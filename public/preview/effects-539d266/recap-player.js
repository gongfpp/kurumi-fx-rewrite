import {recapSegments} from './daily-recap.js?v=539d26616071e7036617b0b49726bd24af40ef2e-capture-v1-1fbef814f493';
import {recapPresentation,recapBeatCue} from './recap-presentation.js?v=539d26616071e7036617b0b49726bd24af40ef2e-capture-v1-1fbef814f493';
// Cancellable, repeatable presentation. No game state, save or economic callbacks.
export function createRecapPlayer(snapshot,{render,onCue=()=>{},enabled=true,reducedMotion=false,requestFrame=globalThis.requestAnimationFrame,cancelFrame=globalThis.cancelAnimationFrame,now=()=>performance.now()}={}){
 const segments=recapSegments(snapshot),presentation=recapPresentation(snapshot),duration=enabled&&!reducedMotion?presentation.duration:0;
 let frame=null,stopped=false,lastBeat=-1,finalCued=false,started=now();
 const draw=(elapsed,{silent=false}={})=>{
  const counting=duration?Math.min(1,Math.max(0,elapsed/presentation.countDuration)):1,progress=counting**1.35,position=progress*(segments.length-1),index=Math.min(segments.length-1,Math.floor(position)),segment=segments[index],local=progress===1?1:position-index;
  const beat=duration?presentation.beatTimes.filter(t=>t<=elapsed).length-1:-1,complete=!duration||elapsed>=duration,stage=counting<1?'counting':complete?'complete':'landing';
  render({progress,segment,index,value:segment.from+(segment.to-segment.from)*local,intensity:presentation.intensity,complete,candleCount:Math.ceil(progress*snapshot.candles.length),stage,beat,presentation});
  if(!silent&&duration&&counting<1&&beat>lastBeat){lastBeat=beat;onCue({...recapBeatCue(presentation,beat),segment,intensity:presentation.intensity,beat,final:false});}
  if(!silent&&duration&&counting===1&&!finalCued&&presentation.direction!=='flat'){finalCued=true;onCue({...recapBeatCue(presentation,presentation.beats-1,{final:true}),segment,intensity:presentation.intensity,beat,final:true});}
 };
 const tick=time=>{frame=null;if(stopped)return;const elapsed=Math.max(0,time-started);draw(elapsed);if(elapsed<duration)frame=requestFrame(tick);};
 const cancel=()=>{stopped=true;if(frame!==null){cancelFrame(frame);frame=null;}};
 const finish=()=>{cancel();draw(duration,{silent:true});};
 if(duration){draw(0);frame=requestFrame(tick);}else draw(0,{silent:true});
 return{cancel,finish,duration,snapshot,presentation};
}
