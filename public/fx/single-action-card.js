import {closeAllModalOpen} from './close-all-control.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {liquidationMeter} from './liquidation-meter.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';

export const STAMINA_SLEEP_LINE='爸在门外：久留美，该睡觉了。';
export const STAMINA_BLINK_TIMING=Object.freeze({first:4500,interval:22000,duration:1000});

// Pure view selection. It does not close orders, spend stamina or advance time.
export function singleActionCardView({mode,stamina,sanity=50,positions=[],risk,active=true,context='',portfolioToken=''}={}) {
  if(!active)return null;
  const meter=liquidationMeter(risk);
  if(positions.length&&!meter.hidden&&meter.tone==='critical')return {
    kind:'risk',key:`${context}:risk:${portfolioToken}`,title:'接近强平',message:meter.label,
    action:'close',actionLabel:'一键平仓',icon:'warning',dismissible:mode!=='story'
  };
  if(mode==='story')return {
    kind:stamina?.low?'rest':'early-close',key:`${context}:finish-day:${sanity<=5?'mental':stamina?.low?'sleep':'early'}:${portfolioToken}`,
    title:stamina?.low&&sanity>5?'爸在门外':'提前收盘',message:sanity<=5?'心理承受力过低，今天先休息吧':stamina?.low?'久留美，该睡觉了。':'今天就到这里，早点睡吧。',
    action:'finish-day',actionLabel:'提前收盘睡觉',icon:'door',dismissible:false
  };
  if(!stamina?.low)return null;
  if(positions.length)return {
    kind:'close-before-rest',key:`${context}:close-before-rest:${portfolioToken}`,title:'先平仓，再休息',message:STAMINA_SLEEP_LINE,
    action:'close',actionLabel:'一键平仓',icon:'door'
  };
  return {kind:'rest',key:`${context}:rest`,title:'爸在门外',message:'久留美，该睡觉了。',
    action:'rest',actionLabel:'去休息',icon:'door'};
}

const ICONS={
  warning:'<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M22 4h4l20 36v5H2v-5Z" fill="#ffa186" stroke="#151d54" stroke-width="3"/><path d="M22 15h5l-1 15h-3Z M22 34h5v5h-5Z" fill="#151d54"/></svg>',
  door:'<svg viewBox="0 0 48 52" aria-hidden="true"><path d="M6 49V6l28-4v47Z" fill="#deacb0" stroke="#91466e" stroke-width="2.5"/><path d="M34 3h5v46H6" fill="none" stroke="#c67a9a" stroke-width="2.5"/><circle cx="28" cy="28" r="2" fill="#fff0d7"/><path d="m40 11 4-3m-3 10h5m-6 6 4 3" fill="none" stroke="#f24898" stroke-width="2.5" stroke-linecap="round"/></svg>'
};

export function mountSingleActionCard({root=document,getModel=()=>({}),closeControl,onRest=()=>{},onFinishDay=()=>{},motionEnabled=()=>true}={}) {
  const win=root.defaultView,listeners=[];
  const make=(tag,className,text)=>{const node=root.createElement(tag);node.className=className;if(text!==undefined)node.textContent=text;return node;};
  const slot=make('div','single-action-slot'),card=make('aside','single-action-card'),icon=make('span','single-action-icon');
  const copy=make('div','single-action-copy'),heading=make('strong','single-action-title'),message=make('p','single-action-message');
  const close=make('button','single-action-close','一键平仓'),rest=make('button','single-action-rest','去休息'),dismiss=make('button','single-action-dismiss','×');
  card.hidden=true;card.setAttribute('aria-label','操作提醒');copy.setAttribute('role','status');copy.setAttribute('aria-live','polite');copy.setAttribute('aria-atomic','true');
  icon.setAttribute('aria-hidden','true');copy.append(heading,message);card.append(icon,copy,close,rest,dismiss);slot.append(card);
  for(const button of [close,rest,dismiss])button.type='button';
  close.setAttribute('aria-label','按当前报价平掉全部持仓');dismiss.setAttribute('aria-label','关闭本轮操作提醒');
  const meter=make('div','pixel-stamina'),label=make('div','pixel-stamina-label'),number=make('b','pixel-stamina-value'),stateLabel=make('span','pixel-stamina-state');
  const track=make('div','pixel-stamina-track'),fill=make('span','pixel-stamina-fill');
  label.append(make('span','pixel-stamina-caption','体力'),number,stateLabel);track.append(fill);meter.append(label,track);
  const energyHint=make('small','energy-stage-hint');energyHint.setAttribute('role','status');meter.append(energyHint);
  track.setAttribute('role','progressbar');track.setAttribute('aria-label','体力');track.setAttribute('aria-valuemin','0');track.setAttribute('aria-valuemax','100');
  const eyelids=make('div','stamina-eyelids');eyelids.setAttribute('aria-hidden','true');eyelids.hidden=true;
  eyelids.append(make('div','stamina-eyelid stamina-eyelid-top'),make('div','stamina-eyelid stamina-eyelid-bottom'));
  let disposed=false,view=null,dismissedKey=null,lastViewKey=null,busy=false,restArmed,blinkTimer=null,blinkEnd=null,blinkContext=null,pointerActive=false;
  const listen=(node,type,fn,options)=>{node?.addEventListener?.(type,fn,options);listeners.push(()=>node?.removeEventListener?.(type,fn,options));};
  const pixel=()=>root.body.dataset.frontend==='pixel';
  const available=()=>!disposed&&pixel()&&!root.hidden&&!closeAllModalOpen(root);
  const text=(node,value)=>{if(node.textContent!==value)node.textContent=value;};
  const restoreFocus=()=>{
    if(!card.contains(root.activeElement))return;
    for(const id of ['position-close-all','life-open','pixel-frontend']){const target=root.getElementById(id);if(target&&!target.disabled&&target.getClientRects().length){target.focus?.({preventScroll:true});break;}}
  };
  const hideCard=()=>{restoreFocus();card.hidden=true;close.hidden=true;rest.hidden=true;rest.disabled=true;};
  const stopBlink=()=>{
    if(blinkTimer!==null)win.clearTimeout(blinkTimer);if(blinkEnd!==null)win.clearTimeout(blinkEnd);
    blinkTimer=null;blinkEnd=null;blinkContext=null;eyelids.classList.remove('is-blinking');eyelids.hidden=true;
  };
  function interactionFocused(){
    const focus=root.activeElement;
    return ['BUTTON','INPUT','SELECT','TEXTAREA','A','SUMMARY'].includes(focus?.tagName)||['button','slider','spinbutton','combobox'].includes(focus?.getAttribute?.('role'))||focus===root.getElementById('chart');
  }
  function canBlink(model){return available()&&!pointerActive&&!interactionFocused()&&singleActionCardView(model)?.kind!=='risk'&&model.active!==false&&model.stamina?.low&&model.stamina?.value>0&&model.blinkAllowed!==false&&motionEnabled();}
  function scheduleBlink(context,delay){
    blinkTimer=win.setTimeout(()=>{
      blinkTimer=null;const model=getModel();
      if(!canBlink(model)||model.context!==context){stopBlink();return;}
      eyelids.hidden=false;eyelids.classList.add('is-blinking');
      blinkEnd=win.setTimeout(()=>{
        blinkEnd=null;eyelids.classList.remove('is-blinking');eyelids.hidden=true;
        const next=getModel();if(canBlink(next)&&next.context===context)scheduleBlink(context,STAMINA_BLINK_TIMING.interval);else stopBlink();
      },STAMINA_BLINK_TIMING.duration);
    },delay);
  }
  function syncBlink(model){
    if(!canBlink(model)){stopBlink();return;}
    if(blinkContext!==model.context){stopBlink();blinkContext=model.context;}
    if(blinkTimer===null&&blinkEnd===null)scheduleBlink(model.context,STAMINA_BLINK_TIMING.first);
  }
  const unbindClose=closeControl?.bind(close,{canInteract:()=>available()&&!card.hidden&&!close.hidden&&view?.action==='close'});
  const dismissCurrent=()=>{if(card.hidden||!view||view.dismissible===false)return;dismissedKey=view.key;hideCard();};
  listen(dismiss,'click',dismissCurrent);
  listen(card,'keydown',event=>{if(event.key==='Escape'){event.preventDefault?.();event.stopPropagation?.();dismissCurrent();}});
  const currentRestKey=()=>singleActionCardView(getModel())?.key;
  listen(rest,'pointerdown',event=>{if(event.button===0)restArmed=currentRestKey();});
  listen(rest,'pointercancel',()=>{restArmed=null;});
  listen(rest,'keydown',event=>{if(!['Enter',' '].includes(event.key))return;if(event.repeat){restArmed=null;event.preventDefault?.();}else restArmed=currentRestKey();});
  listen(rest,'click',event=>{
    const expected=restArmed===undefined?view?.key:restArmed;restArmed=undefined;
    const model=getModel(),current=singleActionCardView(model);
    if(busy||event.detail>1||!available()||card.hidden||rest.hidden||rest.disabled||!['rest','finish-day'].includes(current?.action)||expected!==current.key||(current.action==='finish-day'?model.canFinishDay===false:model.canRest===false))return;
    busy=true;rest.disabled=true;
    try {(current.action==='finish-day'?onFinishDay:onRest)({context:model.context,key:current.key});}
    finally {queueMicrotask(()=>{busy=false;refresh();});}
  });
  function refresh(){
    if(disposed)return;
    const model=getModel(),host=pixel()?root.getElementById('pixel-frontend'):null;
    const character=host?root.getElementById('character-card'):null,chart=host?root.getElementById('chart'):null;
    if(!host||!character||!chart){hideCard();slot.remove();meter.remove();eyelids.remove();stopBlink();return;}
    if(meter.parentElement!==character)character.append(meter);
    const stage=chart.closest?.('.chart-risk-stage')||chart;
    if(eyelids.parentElement!==stage)stage.append(eyelids);
    // Follow the chart-edge order strip when the approved mobile layout is active.
    const quickTrade=root.getElementById('mobile-quick-trade');
    const actionAnchor=quickTrade&&host.contains(quickTrade)?quickTrade:stage;
    if(slot.parentElement!==stage.parentElement||slot.previousSibling!==actionAnchor)actionAnchor.after(slot);
    const value=Math.max(0,Math.min(100,Number.isFinite(model.stamina?.value)?model.stamina.value:100));
    const energy=model.energyStage;energyHint.hidden=!energy?.label;text(energyHint,energy?.label?`${energy.label} · ${energy.phase==='fatigue'?'盯盘耗体增加':'随后进入疲劳期'}`:'');
    text(number,`${Math.round(value)}/100`);text(stateLabel,model.stamina?.low?'困倦':'');stateLabel.hidden=!model.stamina?.low;
    meter.dataset.low=String(Boolean(model.stamina?.low));track.setAttribute('aria-valuenow',String(Math.round(value)));track.setAttribute('aria-valuetext',`${Math.round(value)}/100${model.stamina?.low?'，困倦':''}`);fill.style.width=`${value}%`;
    view=singleActionCardView(model);
    if(view?.dismissible===false)dismissedKey=null;
    if(!view){dismissedKey=null;lastViewKey=null;}
    else if(view.key!==lastViewKey){if(dismissedKey!==view.key)dismissedKey=null;lastViewKey=view.key;}
    if(!available()||!view||view.key===dismissedKey){hideCard();}
    else {
      card.hidden=false;dismiss.hidden=view.dismissible===false;card.dataset.kind=view.kind;text(heading,view.title);text(message,view.message);
      if(icon.dataset.icon!==view.icon){icon.innerHTML=ICONS[view.icon];icon.dataset.icon=view.icon;}
      card.setAttribute('aria-label',view.kind==='rest'?STAMINA_SLEEP_LINE:'操作提醒');
      const previousFocus=root.activeElement;
      close.hidden=view.action!=='close';rest.hidden=!['rest','finish-day'].includes(view.action);text(rest,view.actionLabel);rest.disabled=busy||(view.action==='finish-day'?model.canFinishDay===false:model.canRest===false);
      if(previousFocus===close&&close.hidden){if(!rest.hidden&&!rest.disabled)rest.focus?.({preventScroll:true});else restoreFocus();}
      if(previousFocus===rest&&rest.hidden){if(!close.hidden&&!close.disabled)close.focus?.({preventScroll:true});else restoreFocus();}
    }
    closeControl?.refresh();syncBlink(model);
  }
  listen(root,'focusin',()=>syncBlink(getModel()));
  listen(root,'focusout',()=>queueMicrotask(()=>{if(!disposed)syncBlink(getModel());}));
  listen(root,'pointerdown',()=>{pointerActive=true;stopBlink();},true);
  for(const event of ['pointerup','pointercancel'])listen(root,event,()=>{pointerActive=false;refresh();},true);
  listen(root,'visibilitychange',()=>{if(root.hidden)pointerActive=false;refresh();});
  listen(root,'kurumi:frontendchange',refresh);
  listen(win,'pagehide',()=>{hideCard();stopBlink();});listen(win,'pageshow',refresh);
  // Dialog entry can occur without a game-state render. Cancel an eyelid sweep
  // immediately; no catch-up animation or background timeout survives a pause.
  listen(root,'beforetoggle',event=>{if(event.target?.tagName==='DIALOG'&&event.newState==='open'){hideCard();stopBlink();}},true);
  listen(root,'toggle',refresh,true);listen(root,'close',refresh,true);
  return {refresh,element:card,slot,staminaElement:meter,eyelidsElement:eyelids,destroy(){if(disposed)return;disposed=true;hideCard();stopBlink();unbindClose?.();listeners.forEach(remove=>remove());slot.remove();meter.remove();eyelids.remove();}};
}
