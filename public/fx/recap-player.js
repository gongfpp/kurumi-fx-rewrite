import {RECEIPT_RECAP_CANDIDATE,buildReceiptRecap,receiptRecapFrame} from './recap-receipts.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {receiptCueData} from './receipt-audio.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {recapImpact,boundedRecapCues} from './recap-impact.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {buildRecapTimeline,recapTimelineFrame,recapUpperBound} from './recap-timeline.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {recapSegments} from './daily-recap.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {recapPresentation,recapBeatCue,recapProgress} from './recap-presentation.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
// Cancellable, repeatable presentation. No game state, save or economic callbacks.
export function createRecapPlayer(snapshot,{render,onCue=()=>{},onTimeline,variant='classic',enabled=true,reducedMotion=false,playbackRate=1,requestFrame=globalThis.requestAnimationFrame,cancelFrame=globalThis.cancelAnimationFrame,now=()=>performance.now()}={}){
 const candidate=variant===RECEIPT_RECAP_CANDIDATE?buildReceiptRecap(snapshot):null;
 const segments=recapSegments(snapshot),presentation=candidate?.presentation||recapPresentation(snapshot),duration=enabled&&!reducedMotion?presentation.duration:0;
 const tradingTimeline=candidate?.timeline||buildRecapTimeline(snapshot,presentation),timelineFrame=candidate?receiptRecapFrame:recapTimelineFrame;
 const cueDelta=b=>Number.isFinite(b.displayDelta)?b.displayDelta:b.delta;
 // The same event ends on the presentation clock. Convert its release budget
 // to wall time without changing musical pitch; leave a small release margin.
 const budgetCue=(cue,at=cue.atMs,speed=1)=>candidate&&cue.recap?Object.freeze({...cue,audioBudgetMs:Math.max(0,(Math.min(duration,cue.final?duration:cue.recap.endMs??duration)-Math.max(cue.atMs,at))/speed-20)}):cue;
 // A zero-money opening tap must not crowd out a real asset change. Check both
 // the virtual score and its retimed wall deadlines before generic thinning.
 const preferMoney=score=>score.filter(c=>c.recap||c.kind!=='terminal-tap'||!score.some(b=>Math.abs(b.recap?.delta)>=.005&&Math.abs(b.atMs-c.atMs)<65));
 const audioPresentation={...presentation,direction:snapshot.daily.tradingNet<0?'loss':snapshot.daily.tradingNet>0?'profit':'flat'};
 const landingReceipt=candidate&&tradingTimeline.scoreBeats.findLast(b=>Math.abs(b.atMs-tradingTimeline.finishAt)<65),landingPresentation=landingReceipt?.delta?{...audioPresentation,direction:landingReceipt.delta<0?'loss':'profit'}:audioPresentation;
 const validRate=value=>[1,1.5,2].includes(value);
 let frame=null,stopped=false,finalCued=false,rate=validRate(playbackRate)?playbackRate:1;
 let anchorWall=now(),anchorElapsed=0,elapsed=0,lastWall=anchorWall,timeline=null;
 // Presentation speed changes this virtual clock only, never the cue pitch.
 const readClock=time=>{
  if(stopped||!duration)return elapsed;
  lastWall=Math.max(lastWall,time);elapsed=Math.min(duration,Math.max(elapsed,anchorElapsed+(lastWall-anchorWall)*rate));
  // Round trips between audio deadlines and RAF time can lose a few ULPs.
  const reached=recapUpperBound(cues,elapsed+1e-7,c=>c.atMs)-1,boundary=cues[reached]?.atMs;
  if(boundary!==undefined&&Math.abs(boundary-elapsed)<1e-7)elapsed=boundary;
  if(duration-elapsed<1e-7)elapsed=duration;
  return elapsed;
 };
 const plannedCues=boundedRecapCues(preferMoney(tradingTimeline.scoreBeats.map(b=>Object.freeze({kind:b.step===b.count-1?(cueDelta(b)<0?'terminal-close':'terminal-fill'):(cueDelta(b)<0?'recap-fall':'recap-rise'),atMs:b.atMs,rate:cueDelta(b)<0?.8+.2*b.strength:.8+.45*b.strength,level:recapImpact(presentation,b).level,recap:receiptCueData(tradingTimeline,b,snapshot.daily.tradingNet),beat:b.index,trade:true,final:false})).concat(tradingTimeline.assetBeats.map(b=>Object.freeze({kind:cueDelta(b)<0?'recap-fall':'recap-rise',atMs:b.atMs,rate:cueDelta(b)<0?.8+.2*b.strength:.85+.4*b.strength,level:recapImpact(presentation,b).level,recap:receiptCueData(tradingTimeline,b,snapshot.daily.tradingNet,{source:'observation',cumulative:timelineFrame(tradingTimeline,b.atMs).realized}),assetBeat:b.index,asset:true,final:false}))).concat(tradingTimeline.events.filter(e=>!e.delta).map(e=>Object.freeze({kind:'terminal-tap',atMs:e.atMs+Math.min(80,e.hold/2),rate:.85,level:.25,trade:true,final:false}))).concat(audioPresentation.direction==='flat'?[]:[Object.freeze({...recapBeatCue(landingPresentation,presentation.beats-1,{final:true}),atMs:presentation.countDuration,beat:presentation.beats-1,recap:receiptCueData(tradingTimeline,null,snapshot.daily.tradingNet,{final:true}),final:true})]).filter(c=>!c.recap||c.final||Math.abs(c.recap.delta)>=.005).sort((a,b)=>a.atMs-b.atMs)));
 const cues=candidate?Object.freeze(plannedCues.map(cue=>budgetCue(cue))):plannedCues;
 let lastCue=-1;
 const cancelTimeline=()=>{timeline?.cancel?.();timeline=null;};
 const scheduleTimeline=(at,wall,{initial=false}={})=>{
  if(!duration||stopped||typeof onTimeline!=='function')return;
  // Rebound after retiming: faster wall spacing must not let the audio backend
  // discard a crowded final cue. Passed cues are never queued again.
  const future=initial&&rate===1?cues:boundedRecapCues(preferMoney(cues.filter(c=>initial||c.atMs>at).map(c=>Object.freeze({...budgetCue(c,c.atMs,rate),atMs:(c.atMs-at)/rate}))));
  timeline=onTimeline(future,{startedAt:wall});
 };
 const draw=(elapsed,{silent=false}={})=>{
  const counting=duration?Math.min(1,Math.max(0,elapsed/presentation.countDuration)):1,progress=duration?recapProgress(presentation,elapsed):1,index=progress===0?0:progress<1?1:segments.length-1,segment=segments[index];
  const beat=duration?recapUpperBound(presentation.beatTimes,elapsed,t=>t)-1:-1,complete=!duration||elapsed>=duration,stage=complete?'complete':counting>=1?'landing':counting>=(presentation.catastrophic?.84:.93)?'anticipation':elapsed<tradingTimeline.leadIn?'opening':'counting';
  const replay=timelineFrame(tradingTimeline,elapsed,{complete});
  render({elapsed,playbackRate:rate,progress,segment,index,...replay,reconciliation:tradingTimeline.residual,value:replay.tradingAssets,intensity:presentation.intensity,complete,candleCount:recapUpperBound(snapshot.candles,replay.timestamp,c=>c.timestamp),stage,beat,presentation});
  if(!silent&&!stopped&&!timeline&&duration){
   // A late frame releases at most one still-current cue, never an old burst.
   const reached=recapUpperBound(cues,elapsed,c=>c.atMs)-1;
   if(reached>lastCue){const cue=cues[reached],audible=budgetCue(cue,elapsed,rate);lastCue=reached;if(elapsed-cue.atMs<=80*rate||cue.final&&!finalCued){if(cue.final)finalCued=true;onCue({...audible,segment,intensity:presentation.intensity});}}
  }
 };
 const stopFrame=()=>{if(frame!==null){cancelFrame(frame);frame=null;}};
 const tick=time=>{frame=null;if(stopped)return;draw(readClock(time));if(!stopped&&elapsed<duration)frame=requestFrame(tick);else stopped=true;};
 const setPlaybackRate=next=>{
  if(!validRate(next)||next===rate)return rate;
  if(stopped||!duration){rate=next;return rate;}
  const at=readClock(now());anchorWall=lastWall;anchorElapsed=at;rate=next;
  draw(at);cancelTimeline();
  lastCue=Math.max(lastCue,recapUpperBound(cues,at,c=>c.atMs)-1);
  if(cues.some(c=>c.final&&c.atMs<=at))finalCued=true;
  if(at>=duration){stopped=true;stopFrame();}else if(!stopped)scheduleTimeline(at,anchorWall);
  return rate;
 };
 const cancel=()=>{readClock(now());stopped=true;cancelTimeline();stopFrame();};
 const finish=()=>{cancel();elapsed=duration;draw(duration,{silent:true});};
 if(duration){scheduleTimeline(0,anchorWall,{initial:true});draw(0);frame=requestFrame(tick);}else draw(0,{silent:true});
 return{cancel,finish,setPlaybackRate,get playbackRate(){return rate;},get elapsed(){return readClock(now());},duration,snapshot,presentation,cues,tradingTimeline};
}
