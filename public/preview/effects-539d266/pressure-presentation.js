import {pressureVisual} from './pressure-visuals.js?v=539d26616071e7036617b0b49726bd24af40ef2e-capture-v1-1fbef814f493';
// Only rendering. This module cannot unlock a control, place an order, or save.
export function pressureMotionPlan(taps,{reduced=false,unlocked=false}={}){
 const visual=pressureVisual(taps,{reduced,unlocked}),pageDisplacement=reduced?0:unlocked?9:taps<4?0:1+Math.floor((Math.min(12,taps)-4)*.65);
 return{...visual,displacement:reduced?0:unlocked?11:2+8*visual.intensity,pageDisplacement,duration:reduced?0:unlocked?620:160+visual.intensity*130};
}
export function createPressurePresentation({root=document,motion,enabled=()=>true}={}){
 let pageAnimation=null,buttonAnimation=null,timer=null,activeButton=null,disposed=false;
 const flare=root.createElement('div');flare.className='pressure-page-flare';flare.setAttribute('aria-hidden','true');root.body.append(flare);
 function clear(){pageAnimation?.cancel();buttonAnimation?.cancel();clearTimeout(timer);activeButton?.classList.remove('pressure-breaking');flare.dataset.active='false';delete root.body.dataset.pressureImpact;}
 function play(button,{taps,unlocked=false}={}){
  if(disposed)return;clear();activeButton=button;
  const reduced=!enabled()||!!root.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)').matches,plan=pressureMotionPlan(taps,{reduced,unlocked});
  button.dataset.pressureStage=plan.stage;
  if(reduced)return plan;
  const x=plan.displacement,page=root.querySelector('main'),p=plan.pageDisplacement;
  // Page translate is independent of existing trade-feedback transform effects.
  buttonAnimation=motion?.animate(button,[{transform:'none'},{transform:`translate(${-x}px,2px) rotate(-1.2deg)`},{transform:`translate(${x}px,-2px) rotate(1.2deg)`},{transform:`translate(${-x*.55}px,1px)`},{transform:'none'}],{duration:plan.duration,easing:'ease-out'});
  if(page&&p>0)pageAnimation=motion?.animate(page,[{translate:'0px 0px'},{translate:`${-p}px ${p*.35}px`},{translate:`${p}px ${-p*.25}px`},{translate:`${-p*.6}px 0px`},{translate:`${p*.3}px 0px`},{translate:'0px 0px'}],{duration:plan.duration,easing:'ease-out'});
  root.body.dataset.pressureImpact=unlocked?'break':plan.stage;flare.dataset.active=String(taps>=7);flare.style.setProperty('--pressure-edge',String(.08+plan.intensity*.18));
  if(unlocked)button.classList.add('pressure-breaking');
  timer=setTimeout(()=>{activeButton?.classList.remove('pressure-breaking');flare.dataset.active='false';delete root.body.dataset.pressureImpact;},unlocked?900:650);
  return plan;
 }
 return{play,clear,dispose(){disposed=true;clear();flare.remove();}};
}
