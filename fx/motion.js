// Independent FX motion primitive, extracted from leek-spire feedback.js.
export class GameMotion {
  constructor(){this.enabled=true;this.animations=new Set();this.timers=new Set();}
  configure(enabled,force=false){this.enabled=enabled&&(force||!matchMedia('(prefers-reduced-motion: reduce)').matches);if(!this.enabled)this.clear();}
  clear(){for(const a of this.animations)a.cancel();this.animations.clear();for(const t of this.timers)clearTimeout(t);this.timers.clear();document.querySelectorAll('.fx-ghost,.trade-feedback').forEach(e=>e.remove());}
  animate(el,frames,options){if(!el||!this.enabled)return;const a=el.animate(frames,{duration:360,easing:'cubic-bezier(.2,.8,.2,1)',...options});this.animations.add(a);a.finished.catch(()=>{}).finally(()=>this.animations.delete(a));return a;}
}
