import {buildRecapTimeline,recapTimelineFrame,recapUpperBound} from './recap-timeline.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {recapPresentation} from './recap-presentation.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';

// Explicit opt-in only. The app keeps its existing presentation until acceptance.
export const RECEIPT_RECAP_CANDIDATE='trade-receipts-v1';
const finite=(value,fallback=0)=>Number.isFinite(value)?value:fallback;
const clamp=value=>Math.max(0,Math.min(1,value));

// A 150ms slice of the original replay becomes 250ms of continuous motion.
// Speed falls linearly from 1 to .2. Only the presentation clock is remapped;
// receipts, timestamps and amounts remain the already settled facts.
export function receiptSourceTime(timeline,elapsed){
 const windows=timeline.slowdowns,index=recapUpperBound(windows,elapsed,w=>w.start)-1;
 if(index<0)return elapsed;
 const window=windows[index];
 if(elapsed>=window.end)return elapsed-window.addedAfter;
 const p=clamp((elapsed-window.start)/250);
 return window.sourceStart+250*(p-.4*p*p);
}
function receiptDeadline(windows,sourceTime){
 const index=recapUpperBound(windows,sourceTime,w=>w.sourceStart)-1;
 if(index<0)return sourceTime;
 const window=windows[index];
 if(sourceTime>=window.sourceEnd)return sourceTime+window.addedAfter;
 const distance=(sourceTime-window.sourceStart)/250;
 return window.start+250*(1-Math.sqrt(Math.max(0,1-1.6*distance)))/.8;
}

export function buildReceiptRecap(snapshot){
 const daily=snapshot.daily,net=finite(daily.tradingNet),opening=finite(daily.openingNominal);
 const rate=Number.isFinite(daily.returnRate)?daily.returnRate:daily.returnDenominator>0?net/daily.returnDenominator:0;
 // Reuse the existing receipt reconciliation, simultaneous groups and audio
 // planner. Quote candles and floating equity do not define earned P/L bars.
 const receiptSnapshot={...snapshot,primary:{...snapshot.primary,scope:'today',profit:net,returnRate:rate},trades:(snapshot.trades||[]).filter(trade=>trade.type==='open'||Number.isFinite(trade.pnl)),candles:[],replay:{observations:[],partial:!!snapshot.replay?.partial}};
 let basePresentation=recapPresentation(receiptSnapshot),source=buildRecapTimeline(receiptSnapshot,basePresentation);
 const receiptCount=source.events.filter(event=>event.type!=='open').length;
 if(receiptCount<=2){
  // Project pacing choices, not official Balatro timings. Sparse receipts do
  // not inherit several seconds of empty travel from the classic replay.
  // Keep the existing landing and 250ms major-event slowdowns below intact.
  const ceiling=receiptCount===0?180:basePresentation.catastrophic?(receiptCount===1?1500:2200):(receiptCount===1?[440,760,950,1200]:[700,1150,1450,1800])[basePresentation.rank];
  const countDuration=Math.min(basePresentation.countDuration,ceiling);
  if(countDuration<basePresentation.countDuration){
   const ratio=countDuration/basePresentation.countDuration;
   basePresentation={...basePresentation,countDuration,duration:countDuration+basePresentation.landingDuration,beatTimes:basePresentation.beatTimes.map(time=>time*ratio)};
   source=buildRecapTimeline(receiptSnapshot,basePresentation);
  }
 }
 source.closing=opening+net;
 const slowdowns=[];
 let added=0,previousEnd=0;
 const threshold=Math.min(10000,Math.max(1,finite(daily.returnDenominator,Math.abs(opening))*.05));
 for(const beat of source.scoreBeats){
  // Dense receipts share their uninterrupted scan. Never stack overlapping
  // slowdowns or extend a replay in proportion to the number of fills.
  if(Math.abs(beat.delta)<threshold||beat.atMs-150<previousEnd)continue;
  const sourceStart=beat.atMs-150,start=sourceStart+added;
  added+=100;slowdowns.push({sourceStart,sourceEnd:beat.atMs,start,end:start+250,addedAfter:added});previousEnd=beat.atMs;
 }
 const at=sourceTime=>receiptDeadline(slowdowns,sourceTime);
 // Plan once at the fastest supported speed: 130 virtual ms is 65 wall ms
 // at 2×. Dense fills share one exact amount change, scan hit and audio cue.
 // Merge adjacent groups before the 64-cue audio budget, rather than dropping
 // sounds while the visual performance continues to punch every raw fill.
 const batches=[];
 for(let i=source.events.length-1;i>=0;i--){const event=source.events[i],next=batches[0];if(next&&at(next.at(-1).atMs)-at(event.atMs)<130)next.unshift(event);else batches.unshift([event]);}
 while(batches.length>63){let nearest=0,gap=Infinity;for(let i=0;i<batches.length-1;i++){const distance=at(batches[i+1].at(-1).atMs)-at(batches[i].at(-1).atMs);if(distance<gap){gap=distance;nearest=i;}}batches.splice(nearest,2,[...batches[nearest],...batches[nearest+1]]);}
 const events=[],scoreBeats=[],sourceEvents=[],sourceBeats=[];
 for(const batch of batches){
  const last=batch.at(-1),sourceAtMs=net&&batch===batches.at(-1)&&at(source.finishAt)-at(last.atMs)<130?source.finishAt:last.atMs,atMs=at(sourceAtMs),closed=batch.filter(e=>e.type!=='open'),marker=closed.at(-1),eventId=`receipt:${batch[0].index}-${last.index}`;
  let beat=null;
  if(marker&&closed.some(e=>e.delta)){
   const before=batch[0].before,after=last.after,delta=after-before;
   const effectBudget=basePresentation.catastrophic&&closed.some(e=>e.type==='liquidation')?1250:Math.max(550,[0,340,390,450][basePresentation.rank]+122),completion=at(source.finishAt)+basePresentation.landingDuration;
   beat={eventId,eventIndex:marker.index,delta,receiptBefore:before,receiptAfter:after,displayValue:after,displayDelta:delta,realized:after,step:0,count:1,atMs,timestamp:marker.timestamp,fraction:1,index:scoreBeats.length,strength:.35+.65*(last.index+1)/Math.max(1,source.events.length),direction:delta<0?'loss':delta>0?'profit':'flat',endMs:sourceAtMs===source.finishAt?completion:Math.min(completion,atMs+effectBudget)};
   scoreBeats.push(beat);sourceBeats.push({...beat,atMs:sourceAtMs});
  }
  for(const event of batch){events.push({...event,eventId,sourceAtMs,atMs,beats:beat&&event.index===marker.index?[beat]:[]});sourceEvents.push({...event,eventId,atMs:sourceAtMs,beats:beat&&event.index===marker.index?[sourceBeats.at(-1)]:[]});}
 }
 const groupedSource={...source,events:sourceEvents,scoreBeats:sourceBeats};
 const receipts=events.filter(e=>e.type!=='open');
 for(const beat of scoreBeats){const first=receipts.findIndex(e=>e.eventId===beat.eventId),last=receipts.findLastIndex(e=>e.eventId===beat.eventId);beat.position=(first+last+1)/(2*Math.max(1,receipts.length));}
 const groups=new Map();
 for(const event of events){
  if(event.type==='open')continue;
  const group=groups.get(event.atMs)||{eventId:event.eventId,atMs:event.atMs,count:0,delta:0,before:event.before,position:scoreBeats.find(b=>b.eventId===event.eventId)?.position,types:[],hasLiquidation:false,receipts:[]};
  if(!event.summary)group.count++;group.delta+=event.delta;group.after=event.after;group.lastEventIndex=event.index;group.direction=group.delta<0?'loss':group.delta>0?'profit':'flat';
  if(!group.types.includes(event.type))group.types.push(event.type);group.hasLiquidation||=event.type==='liquidation';group.receipts.push(event);groups.set(event.atMs,group);
 }
 const timeline={...source,source:groupedSource,slowdowns,events,scoreBeats,groups,firstLiquidationAt:events.find(event=>event.type==='liquidation')?.atMs,assetBeats:[],observationTimes:[],finishAt:at(source.finishAt)};
 const presentation={...basePresentation,countDuration:timeline.finishAt,duration:timeline.finishAt+basePresentation.landingDuration,beatTimes:basePresentation.beatTimes.map(at)};
 return {timeline,presentation};
}

export function receiptRecapFrame(timeline,elapsed,options={}){
 const sourceTime=receiptSourceTime(timeline,elapsed),frame=recapTimelineFrame(timeline.source,sourceTime,options);
 const seen=options.complete?timeline.events.length:recapUpperBound(timeline.events,elapsed,e=>e.atMs),active=timeline.events[seen-1]||null;
 const receiptGroup=active?timeline.groups.get(active.atMs):null,event=receiptGroup?timeline.events[receiptGroup.lastEventIndex]:active;
 const scoreBeat=timeline.scoreBeats[recapUpperBound(timeline.scoreBeats,elapsed,b=>b.atMs)-1]||null;
 const slowdown=timeline.slowdowns[recapUpperBound(timeline.slowdowns,elapsed,w=>w.start)-1];
 return {...frame,event,eventCount:seen,scoreBeat,assetBeat:null,receiptGroup,liquidationSeen:Number.isFinite(timeline.firstLiquidationAt)&&(options.complete||elapsed>=timeline.firstLiquidationAt),
  receiptScanProgress:options.complete?1:clamp(sourceTime/Math.max(1,timeline.source.finishAt)),
  slowing:!!slowdown&&elapsed<slowdown.end};
}

// All positions participate, including opposite directions and same-time fills.
// A missing legacy remainder is labelled separately, never invented as a trade.
export function receiptRecapBars(timeline){
 let receipt=0;
 return timeline.events.filter(event=>event.type!=='open').map(event=>({
  eventId:event.eventId,eventIndex:event.index,value:event.delta,timestamp:event.timestamp,atMs:event.atMs,
  progress:event.sourceAtMs/Math.max(1,timeline.source.finishAt),summary:!!event.summary,
  label:event.summary?'收盘汇总':`第${++receipt}笔`,
 }));
}
