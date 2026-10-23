// Read-only replay clock. Receipts move realized P/L; recorded equity moves assets.
const finite=(n,f=0)=>Number.isFinite(n)?n:f;
// Upper bound keeps every animation frame logarithmic, including reverse seeks.
export function recapUpperBound(items,value,key){let lo=0,hi=items.length;while(lo<hi){const mid=(lo+hi)>>>1;if(key(items[mid])<=value)lo=mid+1;else hi=mid;}return lo;}
const timeKey=p=>p.timestamp,beatKey=p=>p.atMs;
function clockPosition(anchors,timestamp){if(anchors.length===1)return 0;const i=recapUpperBound(anchors,timestamp,t=>t)-1;if(i<0)return 0;if(i>=anchors.length-1)return 1;return (i+(timestamp-anchors[i])/Math.max(1,anchors[i+1]-anchors[i]))/Math.max(1,anchors.length-1);}
function clockTimestamp(anchors,progress){const raw=progress*Math.max(1,anchors.length-1),position=Math.abs(raw-Math.round(raw))<1e-9?Math.round(raw):raw,i=Math.min(anchors.length-1,Math.floor(position));return anchors[i]+(anchors[i+1]===undefined?0:(anchors[i+1]-anchors[i])*(position-i));}
const observedPoints=snapshot=>(snapshot.replay?.observations||[]).filter(p=>Number.isFinite(p.timestamp)&&Number.isFinite(p.tradingAssets)&&Number.isFinite(p.unrealized)&&(!Number.isFinite(snapshot.timestamp)||p.timestamp<=snapshot.timestamp)).map(p=>({...p})).sort((a,b)=>a.timestamp-b.timestamp);
// Both the presentation length and the scan use this recorded-activity clock.
// Empty calendar gaps are compressed; no market or asset samples are invented.
export function recapActivityAnchors(snapshot,observations=observedPoints(snapshot)){
 const candles=snapshot.candles||[],trades=(snapshot.trades||[]).filter(t=>Number.isFinite(t.timestamp)),times=[...observations.map(timeKey),...candles.map(timeKey),...trades.map(timeKey)];
 const end=Number.isFinite(snapshot.timestamp)?snapshot.timestamp:Math.max(1,...times,...candles.map(c=>c.timestamp+900000));
 let priorAssets=finite(snapshot.daily?.openingNominal),priorFloat=0;
 const changes=observations.filter(p=>{const changed=Math.abs(p.tradingAssets-priorAssets)>=.005||Math.abs(p.unrealized-priorFloat)>=.005;priorAssets=p.tradingAssets;priorFloat=p.unrealized;return changed;});
 return [...new Set([...candles.map(c=>Math.min(c.availableAt??c.timestamp+(c.periodMinutes||15)*60000,end)),...changes.map(timeKey),...trades.map(timeKey),end])].filter(t=>Number.isFinite(t)&&t<=end).sort((a,b)=>a-b);
}
// The chart preserves these global receipt indices when filtering its price axis.
export const orderedRecapTrades=snapshot=>(snapshot.trades||[]).filter(t=>Number.isFinite(t.timestamp)&&(!Number.isFinite(snapshot.timestamp)||t.timestamp<=snapshot.timestamp)).map((t,i)=>({...t,key:t.sequence??i})).sort((a,b)=>a.timestamp-b.timestamp||a.key-b.key);
export function buildRecapTimeline(snapshot,presentation){
 const candles=snapshot.candles||[],trades=orderedRecapTrades(snapshot);
 const observations=observedPoints(snapshot),anchors=recapActivityAnchors(snapshot,observations),safeEnd=anchors.at(-1),times=[...observations.map(timeKey),...candles.map(timeKey),...trades.map(timeKey),safeEnd].filter(Number.isFinite),safeStart=Math.min(...times);
 const knownTotal=trades.reduce((sum,t)=>sum+(t.type==='open'?0:finite(t.pnl)),0),missing=finite(snapshot.daily.tradingNet)-knownTotal;
 // Unknown legacy P/L is a closing aggregate, never an invented execution.
 if(Math.abs(missing)>.005)trades.push({type:'summary',timestamp:safeEnd,pnl:missing,key:'summary',summary:true});
 const leadIn=Math.min(440,presentation.countDuration),travel=anchors.length===1?0:Math.max(0,presentation.countDuration-leadIn),atTime=timestamp=>leadIn+travel*clockPosition(anchors,timestamp);
 let pnl=0;
 const events=trades.map((t,index)=>{const delta=t.type==='open'?0:finite(t.pnl),before=pnl;pnl+=delta;return{...t,index,delta,before,after:pnl,atMs:atTime(t.timestamp),hold:0,spentBefore:0,beats:[]};});
 // A receipt is shown once at its real time. Simultaneous receipts form one
 // monetary punch, with their complete ledger total, never sequential holds.
 const scoreBeats=[];
 for(let i=0;i<events.length;){let j=i+1;while(j<events.length&&events[j].timestamp===events[i].timestamp)j++;
  const group=events.slice(i,j),event=group.findLast(e=>e.delta);
  if(event){const beat={eventIndex:event.index,delta:group.reduce((sum,e)=>sum+e.delta,0),receiptBefore:group[0].before,receiptAfter:group.at(-1).after,step:0,count:1,atMs:event.atMs,timestamp:event.timestamp,fraction:1,index:scoreBeats.length,strength:.35+.65*j/Math.max(1,events.length)};scoreBeats.push(beat);event.beats.push(beat);}
  i=j;
 }
 const unique=observations.filter((p,i)=>observations[i+1]?.timestamp!==p.timestamp),assetBeats=[];
 let previous=finite(snapshot.daily?.openingNominal),lastAssetAt=-Infinity;
 for(const point of unique){
  const delta=point.tradingAssets-previous;previous=point.tradingAssets;const atMs=atTime(point.timestamp),nearBeat=recapUpperBound(scoreBeats,atMs-110,beatKey);
  // Limit sound/punch density only; every frame still reads exact observed equity.
  if(Math.abs(delta)<.01||atMs<100||atMs-lastAssetAt<Math.max([700,560,380,260][presentation.rank],travel/24)||assetBeats.length>=24||(scoreBeats[nearBeat]?.atMs<=atMs+110))continue;
  lastAssetAt=atMs;assetBeats.push({index:assetBeats.length,atMs,timestamp:point.timestamp,value:point.tradingAssets,delta,strength:Math.max(.18,Math.min(1,Math.abs(delta)/Math.max(1,Math.abs(snapshot.daily?.openingNominal)*.03))),asset:true});
 }
 const timeline={leadIn,anchors,start:safeStart,end:safeEnd,clockPower:1,travel,hold:0,events,scoreBeats,assetBeats,known:knownTotal,residual:missing,observations,observationTimes:observations.map(p=>atTime(p.timestamp)),opening:finite(snapshot.daily?.openingNominal),closing:snapshot.sealed?finite(snapshot.daily?.openingNominal)+finite(snapshot.daily.tradingNet):observations.at(-1)?.tradingAssets,partial:!!snapshot.replay?.partial,finishAt:leadIn+travel};
 for(const beat of [...scoreBeats,...assetBeats]){const f=recapTimelineFrame(timeline,beat.atMs),prior=recapTimelineFrame(timeline,beat.atMs-.00001);beat.displayValue=f.settlementAssets-timeline.opening;beat.displayDelta=f.settlementAssets-prior.settlementAssets;beat.realized=f.realized;}
 return timeline;
}
export function recapTimelineFrame(timeline,elapsed,{complete=false}={}){
 const reconciled=complete||elapsed>=timeline.finishAt,seen=elapsed<timeline.leadIn&&!complete?0:recapUpperBound(timeline.events,reconciled?Infinity:elapsed,beatKey),active=timeline.events[seen-1]||null;
 const progress=reconciled?1:Math.min(1,Math.max(0,(elapsed-timeline.leadIn)/Math.max(1,timeline.travel)));
 const timestamp=reconciled?timeline.end:elapsed<timeline.leadIn?timeline.start-1:clockTimestamp(timeline.anchors,progress);
 const realized=reconciled?timeline.known+timeline.residual:active?.after??0,points=timeline.observations;
 // Last-known actual assets stay authoritative through gaps and realization.
 // Floating P/L becoming realized does not earn the same amount a second time.
 const observed=elapsed<timeline.leadIn&&!complete?null:points[recapUpperBound(timeline.observationTimes,reconciled?Infinity:elapsed,t=>t)-1]||null;
 const tradingAssets=reconciled&&Number.isFinite(timeline.closing)?timeline.closing:observed?.tradingAssets??timeline.opening+realized;
 const unrealized=reconciled&&Number.isFinite(timeline.closing)?finite(points.at(-1)?.unrealized):finite(observed?.unrealized);
 const scoreBeat=timeline.scoreBeats[recapUpperBound(timeline.scoreBeats,elapsed,beatKey)-1]||null,assetBeat=timeline.assetBeats[recapUpperBound(timeline.assetBeats,elapsed,beatKey)-1]||null;
 return{scanTime:timestamp,scoringEvent:null,scoringProgress:1,settlementAssets:tradingAssets,scoreBeat,assetBeat,timestamp,realized,unrealized,tradingAssets,observationAvailable:!!observed,observationPartial:timeline.partial,event:active,eventCount:seen,timeProgress:progress,reconciled};
}
