// One quotation per timer: never replay elapsed time after a hidden tab or modal.
export class MarketClock{
 constructor({step,canRun,canStep=()=>true,interval=()=>1000,schedule=(fn,ms)=>setTimeout(fn,ms),cancel=id=>clearTimeout(id),now=()=>performance.now(),onError=()=>{},paint,paintInterval=()=>1000,minimumDelay=50}){
  Object.assign(this,{step,canRun,canStep,interval,schedule,cancel,now,onError,minimumDelay});this.timer=null;this.generation=0;this.pulseStartedAt=null;
  this.paintClock=typeof paint==='function'?new MarketClock({step:paint,canRun,canStep,interval:paintInterval,schedule,cancel,now,onError,minimumDelay:1}):null;
 }
 start(delay){if(this.timer!==null||!this.canRun())return;const generation=this.generation,cost=this.pulseStartedAt===null?0:Math.max(0,this.now()-this.pulseStartedAt);this.timer=this.schedule(()=>this.pulse(generation),Math.max(this.minimumDelay,Number.isFinite(delay)?delay:this.interval()-cost));this.paintClock?.start();}
 stop(){this.paintClock?.stop();this.generation++;if(this.timer!==null)this.cancel(this.timer);this.timer=null;this.pulseStartedAt=null;}
 pulse(generation){
  if(generation!==this.generation)return;this.timer=null;
  if(!this.canRun())return;
  // Compensate this callback's own rendering cost, not elapsed background time.
  // At most one quote is processed; delayed tabs never catch up in a burst.
  const started=this.now();this.pulseStartedAt=started;
  try{if(this.canStep())this.step();}catch(error){this.stop();this.onError(error);return;}
  const delay=this.interval()-Math.max(0,this.now()-started);this.pulseStartedAt=null;
  if(generation===this.generation)this.start(delay);
 }
 reschedule(){this.stop();this.start();}
}
