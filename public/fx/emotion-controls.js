import {createPressureQuotePicker,pressureLimitTooltip,pressureQuoteFacts} from './pressure-quotes.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {systemReducedMotion} from './motion-preference.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {createPressurePresentation} from './pressure-presentation.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {emotionControlState,pressEmotion,pressureStatus,pressureFeedback} from './emotion-pressure.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {PRESSURE_CRACKS,pressureVisual} from './pressure-visuals.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';

export function createEmotionControls({root=document,getState,getLimits,getContext,canInteract,onChange,audio,motion,motionEnabled=()=>false}) {
  const buttons=[...root.querySelectorAll('[data-stake],[data-leverage]')];
  const original=new Map(buttons.map(button=>[button,{label:button.getAttribute('aria-label'),title:button.getAttribute('title'),text:button.textContent.trim()}]));
  const panel=root.getElementById('emotion-pressure-panel'),meter=root.getElementById('emotion-pressure-meter'),status=root.getElementById('emotion-pressure-status'),instructions=root.getElementById('emotion-pressure-instructions');
  panel.hidden=true;instructions.textContent='';instructions.className='sr-only';status.className='sr-only';root.body.append(instructions,status);
  const tooltip=root.createElement('div');tooltip.id='emotion-pressure-tooltip';tooltip.className='pressure-tooltip';tooltip.setAttribute('role','tooltip');tooltip.hidden=true;root.body.append(tooltip);
  const decorations=new Map();
  for(const [decorationIndex,button] of buttons.entries()){
    const svg=root.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 200 64');svg.setAttribute('preserveAspectRatio','none');svg.setAttribute('aria-hidden','true');svg.classList.add('pressure-fracture');
    // Keep the readable label clear; cracks spread inward from the frame only.
    const defs=root.createElementNS('http://www.w3.org/2000/svg','defs'),clip=root.createElementNS('http://www.w3.org/2000/svg','clipPath'),clipId=`pressure-rim-${decorationIndex}`;
    clip.id=clipId;
    for(const [x,y,width,height] of [[0,0,200,14],[0,50,200,14],[0,0,22,64],[178,0,22,64]]){const rect=root.createElementNS('http://www.w3.org/2000/svg','rect');for(const [key,value] of Object.entries({x,y,width,height}))rect.setAttribute(key,String(value));clip.append(rect);}
    defs.append(clip);svg.append(defs);
    const frame=root.createElementNS('http://www.w3.org/2000/svg','g');frame.classList.add('pressure-frame-shards');
    const shards=[[2,2,70,2,-3,-3,.18],[130,62,198,62,3,3,.32],[198,2,198,30,4,-2,.46],[2,34,2,62,-4,2,.6],[70,2,130,2,0,-4,.72],[70,62,130,62,0,4,.84],[130,2,198,2,3,-3,.94],[2,62,70,62,-3,3,1],[2,2,2,34,-4,-2,1],[198,30,198,62,4,2,1]].map(([x1,y1,x2,y2,dx,dy,at])=>{const line=root.createElementNS('http://www.w3.org/2000/svg','line');for(const [key,value] of Object.entries({x1,y1,x2,y2}))line.setAttribute(key,String(value));frame.append(line);return {line,dx,dy,at};});
    svg.append(frame);
    const paths=PRESSURE_CRACKS.map(spec=>{const path=root.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d',spec.path);path.setAttribute('clip-path',`url(#${clipId})`);svg.append(path);return {path,at:spec.at};});
    const count=root.createElement('span');count.className='pressure-count';count.setAttribute('aria-hidden','true');count.hidden=true;button.append(svg,count);button.dataset.pressureLabel=original.get(button).text;decorations.set(button,{svg,paths,count,shards});
  }
  const pickQuote=createPressureQuotePicker();
  let lastQuote='';
  let pressureVoice=null;
  const presentation=createPressurePresentation({root,motion,enabled:motionEnabled,onClear:reason=>{pressureVoice?.stop();pressureVoice=null;if(reason!=='finished')hideHint();}});
  const heldPressureKeys=new Set(),pointerPresses=new Map(),pointerReleaseTimers=new Map();
  let spacePress=null,spaceRelease=null,spaceReleaseTimer=null,inputOrder=0;
  let animation=null,lastSignature='',lastStateKey='',disposed=false,hintTimer,breakTimer;
  const target=button=>({kind:button.hasAttribute('data-stake')?'stake':'leverage',value:Number(button.dataset.stake??button.dataset.leverage)});
  const classify=button=>emotionControlState({...target(button),limits:getLimits(),hardBlocked:getContext(button).hardBlocked});
  const reduced=()=>!motionEnabled()||systemReducedMotion(root);
  function hideHint(){clearTimeout(hintTimer);tooltip.hidden=true;}
  function showHint(button,text,timeout=2600){
    tooltip.textContent=text;tooltip.hidden=false;
    const box=button.getBoundingClientRect(),maxWidth=Math.min(340,(root.defaultView?.innerWidth||root.documentElement.clientWidth)-24);
    tooltip.style.maxWidth=maxWidth+'px';const width=tooltip.offsetWidth||maxWidth;tooltip.style.left=Math.max(12,Math.min(box.left,(root.defaultView?.innerWidth||root.documentElement.clientWidth)-width-12))+'px';
    const height=tooltip.offsetHeight,viewHeight=root.defaultView?.innerHeight||root.documentElement.clientHeight;
    tooltip.style.top=Math.max(12,box.top>height+16?box.top-height-10:Math.min(viewHeight-height-12,box.bottom+10))+'px';
    clearTimeout(hintTimer);hintTimer=setTimeout(hideHint,timeout);
  }
  function render() {
    const state=getState(),stateKey=`${state.mode}:${state.runId||state.seed}:${state.day}`;
    if(lastStateKey&&lastStateKey!==stateKey){lastQuote='';presentation.clear();animation?.cancel();hideHint();clearTimeout(breakTimer);for(const b of buttons)b.classList.remove('pressure-breaking');}
    lastStateKey=stateKey;
    const p=pressureStatus(state),visual=pressureVisual(p.taps,{reduced:reduced(),unlocked:p.extreme,target:p.target||5});
    for(const button of buttons){
      const classification=classify(button),soft=classification==='soft',base=original.get(button),decoration=decorations.get(button);
      button.disabled=classification==='hard';button.classList.toggle('emotion-soft-lock',soft);button.dataset.emotionLock=soft?'soft':'';
      button.dataset.pressureStage=visual.stage;button.dataset.pressureDirection=p.direction||'';button.style.setProperty('--pressure-progress',String(p.intensity));
      for(const {path,at} of decoration.paths)path.style.opacity=p.intensity*12>=at?'1':'0';
      button.dataset.pressureFrame=p.taps?'cracking':'';
      for(const {line,dx,dy,at} of decoration.shards){const broken=p.intensity>=at;line.style.opacity=broken?'0':'1';line.style.transform=broken&&!reduced()?`translate(${dx}px,${dy}px)`:'none';}
      decoration.count.textContent=`${p.taps}/${p.target||5}`;decoration.count.hidden=true;
      if(soft){
        button.setAttribute('aria-disabled','true');button.setAttribute('aria-describedby','emotion-pressure-instructions emotion-pressure-status');
        button.setAttribute('aria-label',base.text);button.removeAttribute('title');
      }else{
        button.removeAttribute('aria-disabled');button.removeAttribute('aria-describedby');
        for(const [name,value] of [['aria-label',base.label],['title',base.title]])value===null?button.removeAttribute(name):button.setAttribute(name,value);
      }
    }
    panel.hidden=true;meter.max=p.target||5;meter.value=p.taps;meter.setAttribute('aria-valuetext',`${p.taps} / ${p.target||5}`);
    if(status.textContent!==lastQuote)status.textContent=lastQuote;
    lastSignature=`${stateKey}:${p.taps}:${p.direction}`;
  }
  function onClick(event){
    const button=event.target.closest?.('[data-stake],[data-leverage]');if(!buttons.includes(button))return;
    const classification=classify(button);
    const keyboardPress=event.detail===0&&spaceRelease?.button===button?spaceRelease:null;
    if(keyboardPress){spaceRelease=null;clearTimeout(spaceReleaseTimer);}
    const legacyPointer=event.detail>0&&!pointerPresses.has(event.pointerId)?[...pointerPresses].filter(([,p])=>p.button===button&&p.released).sort((a,b)=>b[1].released-a[1].released)[0]:null;
    const pointerId=legacyPointer?.[0]??event.pointerId,pointerPress=event.detail!==0?pointerPresses.get(pointerId):null;
    if(pointerPress){pointerPresses.delete(pointerId);clearTimeout(pointerReleaseTimers.get(pointerId));pointerReleaseTimers.delete(pointerId);}
    const gesture=keyboardPress||pointerPress;
    // Finish a soft-lock gesture as pressure only, even if another input unlocked
    // the control between down and click. Selection always needs a fresh gesture.
    if(gesture?.soft&&(gesture.cancelled||gesture.context!==lastStateKey||classification!=='soft')){event.preventDefault();event.stopImmediatePropagation();return;}
    if(classification!=='soft')return;
    event.preventDefault();event.stopImmediatePropagation();if(!event.isTrusted||!canInteract()||root.querySelector('dialog[open]'))return;
    const result=pressEmotion(getState(),{...target(button),limits:getLimits(),...getContext(button)});if(!result.accepted)return;
    const feedback=pressureFeedback(result.intensity),visual=pressureVisual(result.taps,{reduced:reduced(),unlocked:result.unlocked,target:result.target,direction:result.direction});
    animation?.cancel();onChange(result);render();
    presentation.play(button,{taps:result.taps,unlocked:result.unlocked,target:result.target,direction:result.direction});
    lastQuote=pickQuote(pressureQuoteFacts(getState()));status.textContent=lastQuote;showHint(button,lastQuote,result.unlocked?3200:1600);
    audio?.unlock();audio?.effect(result.unlocked?(result.direction==='despair'?'pressure-break-despair':'pressure-break'):'pressure-hit',{...feedback,onVoice:voice=>{pressureVoice=voice;}});
  }
  function onKey(event){
    if(!['Enter',' '].includes(event.key))return;
    const button=event.target.closest?.('[data-stake],[data-leverage]');
    // A held Enter must not become an ordinary selection when its last hit unlocks.
    if(event.repeat&&(heldPressureKeys.has(event.key)||buttons.includes(button))){event.preventDefault();return;}
    spaceRelease=null;clearTimeout(spaceReleaseTimer);
    const soft=buttons.includes(button)&&classify(button)==='soft';
    if(soft)heldPressureKeys.add(event.key);
    if(event.key===' '){spacePress=soft?{button,soft:true,context:lastStateKey,cancelled:false}:null;}
  }
  const onKeyUp=event=>{
    heldPressureKeys.delete(event.key);
    if(event.key===' '&&spacePress){spaceRelease=spacePress;spacePress=null;clearTimeout(spaceReleaseTimer);spaceReleaseTimer=setTimeout(()=>{spaceRelease=null;},1000);}
  };
  const onPointerDown=event=>{const button=event.target.closest?.('[data-stake],[data-leverage]');if(!buttons.includes(button))return;clearTimeout(pointerReleaseTimers.get(event.pointerId));pointerPresses.set(event.pointerId,{button,soft:classify(button)==='soft',context:lastStateKey,cancelled:false});};
  const onPointerUp=event=>{if(!pointerPresses.has(event.pointerId))return;pointerPresses.get(event.pointerId).released=++inputOrder;clearTimeout(pointerReleaseTimers.get(event.pointerId));pointerReleaseTimers.set(event.pointerId,setTimeout(()=>{pointerPresses.delete(event.pointerId);pointerReleaseTimers.delete(event.pointerId);},1000));};
  const onPointerCancel=event=>{clearTimeout(pointerReleaseTimers.get(event.pointerId));pointerReleaseTimers.delete(event.pointerId);pointerPresses.delete(event.pointerId);};
  const onBlur=()=>{heldPressureKeys.clear();if(spacePress)spacePress.cancelled=true;if(spaceRelease)spaceRelease.cancelled=true;for(const p of pointerPresses.values())p.cancelled=true;presentation.clear();};
  function onHint(event){const button=event.target.closest?.('[data-stake],[data-leverage]');if(button&&buttons.includes(button)&&classify(button)==='soft')showHint(button,lastQuote||pressureLimitTooltip(getLimits(),target(button).kind),5000);}
  root.addEventListener('pointerdown',onPointerDown,true);root.addEventListener('pointerup',onPointerUp,true);root.addEventListener('pointercancel',onPointerCancel,true);root.addEventListener('click',onClick,true);root.addEventListener('keydown',onKey,true);root.addEventListener('keyup',onKeyUp,true);root.defaultView?.addEventListener?.('blur',onBlur);root.addEventListener('pointerover',onHint);root.addEventListener('focusin',onHint);root.addEventListener('scroll',hideHint,true);
  const interval=setInterval(()=>{if(disposed||root.hidden)return;const state=getState(),p=pressureStatus(state),signature=`${state.mode}:${state.runId||state.seed}:${state.day}:${p.taps}:${p.direction}`;if(signature!==lastSignature){onChange({cooled:true,...p});render();}},500);
  return {render,dispose(){disposed=true;clearTimeout(spaceReleaseTimer);spacePress=null;spaceRelease=null;heldPressureKeys.clear();for(const t of pointerReleaseTimers.values())clearTimeout(t);pointerReleaseTimers.clear();pointerPresses.clear();presentation.dispose();clearInterval(interval);clearTimeout(breakTimer);hideHint();animation?.cancel();tooltip.remove();root.removeEventListener('pointerdown',onPointerDown,true);root.removeEventListener('pointerup',onPointerUp,true);root.removeEventListener('pointercancel',onPointerCancel,true);root.removeEventListener('click',onClick,true);root.removeEventListener('keydown',onKey,true);root.removeEventListener('keyup',onKeyUp,true);root.defaultView?.removeEventListener?.('blur',onBlur);root.removeEventListener('pointerover',onHint);root.removeEventListener('focusin',onHint);root.removeEventListener('scroll',hideHint,true);}};
}
