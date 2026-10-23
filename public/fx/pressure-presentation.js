import {systemReducedMotion} from './motion-preference.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {pressureVisual} from './pressure-visuals.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
// Only rendering. This module cannot unlock a control, place an order, or save.
export function pressureMotionPlan(taps,{reduced=false,unlocked=false,target=5}={}){
 const visual=pressureVisual(taps,{reduced,unlocked,target}),pageDisplacement=reduced?0:unlocked?18:taps===0?0:7+9*visual.intensity;
 return{...visual,displacement:reduced?0:unlocked?9:3+5*visual.intensity,pageDisplacement,duration:reduced?0:unlocked?900:480+visual.intensity*220};
}
export function createPressurePresentation({root=document,motion,enabled=()=>true,onClear=()=>{}}={}){
 let pageAnimation=null,buttonAnimation=null,impactAnimation=null,ringAnimation=null,timer=null,activeButton=null,disposed=false,layoutRestore=null;
 const win=root.defaultView,media=win?.matchMedia?.('(prefers-reduced-motion: reduce)');
 const blocked=()=>!!root.hidden||!!root.querySelector('dialog[open]');
 const flare=root.createElement('div');flare.className='pressure-page-flare';flare.setAttribute('aria-hidden','true');root.body.append(flare);
 const glass=root.createElementNS('http://www.w3.org/2000/svg','svg');glass.setAttribute('viewBox','0 0 1000 1000');glass.setAttribute('preserveAspectRatio','none');glass.classList.add('pressure-viewport-glass');
 const viewportCracks=['M0 190 L120 220 L155 180 L225 260 L300 230 M120 220 L110 300 L185 340','M1000 650 L890 600 L850 680 L770 630 L700 700 M890 600 L920 510 L855 470','M1000 90 L860 170 L820 140 L750 230 M860 170 L880 280 L805 315','M0 850 L150 770 L190 820 L290 730 M150 770 L120 680 L185 640','M370 0 L410 100 L370 140 L455 225 M410 100 L510 120 M640 1000 L620 900 L690 850 L650 775'];
 const branches=viewportCracks.map(d=>{const path=root.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d',d);glass.append(path);return path;});flare.append(glass);
 const ring=root.createElement('div');ring.className='pressure-impact-ring';flare.append(ring);
 function clear(reason='cancel'){onClear(reason);pageAnimation?.cancel();buttonAnimation?.cancel();impactAnimation?.cancel();ringAnimation?.cancel();ringAnimation=null;pageAnimation=null;buttonAnimation=null;impactAnimation=null;clearTimeout(timer);layoutRestore?.();layoutRestore=null;activeButton?.classList.remove('pressure-breaking');flare.dataset.active='false';delete root.body.dataset.pressureImpact;}
 // Moving body through its independent layout offset preserves the containing
 // block of fixed overlays. A body transform/translate would relocate those
 // overlays into document coordinates on a scrolled page. Recap owns transform;
 // pressure owns only these short-lived offset animations and restores its styles.
 function acquirePageOffset(){
  const body=root.body,html=root.documentElement,restores=[],hadBodyStyle=body.hasAttribute('style'),hadHtmlStyle=html.hasAttribute('style');
  const own=(node,key,value)=>{const previous=node.style.getPropertyValue(key),priority=node.style.getPropertyPriority(key);node.style.setProperty(key,value);restores.push(()=>{if(node.style.getPropertyValue(key)!==value||node.style.getPropertyPriority(key))return;previous?node.style.setProperty(key,previous,priority):node.style.removeProperty(key);});};
  if(!win?.getComputedStyle||win.getComputedStyle(body).position==='static')own(body,'position','relative');
  own(body,'overflow-anchor','none');own(html,'overflow-x','clip');
  layoutRestore=()=>{for(const restore of restores.reverse())restore();if(!hadBodyStyle&&!body.style.length)body.removeAttribute('style');if(!hadHtmlStyle&&!html.style.length)html.removeAttribute('style');};
  const computed=win?.getComputedStyle?.(body);return {left:parseFloat(computed?.left)||0,top:parseFloat(computed?.top)||0};
 }

 const cancelForContext=()=>{if(blocked()||!enabled()||systemReducedMotion(root))clear();};
 const observer=win?.MutationObserver?new win.MutationObserver(cancelForContext):null;
 observer?.observe(root.body,{subtree:true,attributes:true,attributeFilter:['open']});
 const preferenceObserver=win?.MutationObserver?new win.MutationObserver(cancelForContext):null;
 preferenceObserver?.observe(root.body,{attributes:true,attributeFilter:['class']});media?.addEventListener?.('change',cancelForContext);
 root.addEventListener?.('visibilitychange',cancelForContext);root.addEventListener?.('scroll',clear,true);win?.addEventListener?.('pagehide',clear);

 function play(button,{taps,unlocked=false,target=5,direction='ecstatic'}={}){
  if(disposed)return;clear();if(blocked())return;activeButton=button;
  const reduced=!enabled()||systemReducedMotion(root),plan=pressureMotionPlan(taps,{reduced,unlocked,target});
  button.dataset.pressureStage=plan.stage;button.dataset.pressureDirection=direction;flare.dataset.direction=direction;
  if(reduced)return plan;
  const x=plan.displacement,page=root.body,p=plan.pageDisplacement;
  buttonAnimation=motion?.animate(button,[{transform:'none',offset:0},{transform:`translate(${-x}px,2px) rotate(-1.4deg)`,offset:.14},{transform:`translate(${x}px,-2px) rotate(1.4deg)`,offset:.31},{transform:`translate(${-x*.7}px,1px) rotate(-.6deg)`,offset:.5},{transform:`translate(${x*.4}px,-1px)`,offset:.7},{transform:'none',offset:1}],{duration:plan.duration,easing:'ease-out'});
  if(page&&p>0){const base=acquirePageOffset(),offset=(x,y,at)=>({left:`${base.left+x}px`,top:`${base.top+y}px`,offset:at});pageAnimation=motion?.animate(page,[offset(0,0,0),offset(-p,p*.28,.14),offset(p,-p*.22,.31),offset(-p*.7,p*.12,.5),offset(p*.4,0,.7),offset(0,0,1)],{duration:plan.duration,easing:'linear'});}
  root.body.dataset.pressureImpact=unlocked?'break':plan.stage;flare.dataset.active='true';flare.dataset.stage=unlocked?'break':'hit';flare.style.setProperty('--pressure-edge',String(.16+plan.intensity*.2));
  const box=button.getBoundingClientRect?.();
  flare.style.setProperty('--pressure-origin-x',`${box?box.left+box.width/2:(win?.innerWidth||1000)/2}px`);flare.style.setProperty('--pressure-origin-y',`${box?box.top+box.height/2:(win?.innerHeight||800)/2}px`);
  branches.forEach((path,index)=>path.style.opacity=index<plan.visibleBranches?String(.42+plan.intensity*.4):'0');
  // One rise and one slow decay per click, never a flash/strobe loop. A new
  // animation handle guarantees a fresh impact even on fast repeated presses.
  ringAnimation=motion?.animate(ring,[{transform:'translate(-50%,-50%) scale(.45)',opacity:.9},{transform:'translate(-50%,-50%) scale(1.4)',opacity:0}],{duration:plan.duration+120,easing:'cubic-bezier(.12,.6,.2,1)'});
  impactAnimation=motion?.animate(flare,[{opacity:0,offset:0},{opacity:1,offset:.09},{opacity:1,offset:.32},{opacity:0,offset:1}],{duration:plan.duration+120,easing:'ease-out'});
  if(unlocked)button.classList.add('pressure-breaking');
  timer=setTimeout(()=>clear('finished'),plan.duration+140);
  return plan;
 }
 return{play,clear,dispose(){disposed=true;clear();observer?.disconnect();preferenceObserver?.disconnect();media?.removeEventListener?.('change',cancelForContext);root.removeEventListener?.('visibilitychange',cancelForContext);root.removeEventListener?.('scroll',clear,true);win?.removeEventListener?.('pagehide',clear);flare.remove();}};
}
