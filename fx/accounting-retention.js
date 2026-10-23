// Keep actual observations, in their original order. Never interpolate balances
// or timestamps. Daily summaries are a separate full-range ledger.
export const ACCOUNTING_POINT_LIMIT=2048;
const COMPACT_TO=1536;
const fields=['tradingAssets','nominalAssets','netAssets','unrealized'];
const tradePoint=p=>Number.isSafeInteger(p.executions?.to);
function evenly(indices,count){
 if(indices.length<=count)return indices;
 if(count<=0)return[];
 if(count===1)return[indices[0]];
 return Array.from({length:count},(_,i)=>indices[Math.round(i*(indices.length-1)/(count-1))]);
}
function anchors(points,indices){
 if(!indices.length)return[];
 const result=new Set([indices[0],indices.at(-1)]);
 for(const field of fields){let low=null,high=null;for(const i of indices){if(!Number.isFinite(points[i][field]))continue;if(low===null||points[i][field]<points[low][field])low=i;if(high===null||points[i][field]>points[high][field])high=i;}if(low!==null){result.add(low);result.add(high);}}
 return[...result].sort((a,b)=>a-b);
}
export function retainAccountingPoints(points,{day}={}){
 if(points.length<=ACCOUNTING_POINT_LIMIT)return{points,removed:[]};
 const target=COMPACT_TO,indices=points.map((_,i)=>i),byDay=new Map();
 for(const i of indices){const list=byDay.get(points[i].day)||[];list.push(i);byDay.set(points[i].day,list);}
 const selected=new Set([...anchors(points,indices),...anchors(points,byDay.get(day)||[])]);
 const add=(candidates,budget)=>{for(const i of evenly([...new Set(candidates)].filter(i=>!selected.has(i)).sort((a,b)=>a-b),Math.min(budget,target-selected.size)))selected.add(i);};
 const trades=indices.filter(i=>tradePoint(points[i]));
 // First/last occurrence of each execution type survive even a trade-heavy day.
 for(const type of ['open','half','close','closing','stop','liquidation','rescue']){const matching=trades.filter(i=>points[i].executions.types?.includes(type)),today=matching.filter(i=>points[i].day===day);add([matching[0],matching.at(-1),today[0],today.at(-1)].filter(Number.isInteger),4);}
 add(trades,Math.floor(target/2));
 add([...byDay.values()].flatMap(list=>anchors(points,list)),Math.floor(target/4));
 // Persistent observation-sequence buckets retain local peaks/troughs without
 // re-spacing an already sampled array. Same-quote actions remain distinct.
 const remaining=indices.filter(i=>!selected.has(i)),slots=target-selected.size,buckets=new Map(),first=points[0].observation,last=points.at(-1).observation,count=Math.max(1,Math.floor(slots/2));
 for(const i of remaining){const fraction=Number.isFinite(first)&&Number.isFinite(last)&&last>first?(points[i].observation-first)/(last-first):i/Math.max(1,points.length-1),bucket=Math.min(count-1,Math.max(0,Math.floor(fraction*count))),list=buckets.get(bucket)||[];list.push(i);buckets.set(bucket,list);}
 add([...buckets.values()].flatMap(list=>{let low=list[0],high=list[0];for(const i of list){const value=points[i].tradingAssets??points[i].nominalAssets;if(value<(points[low].tradingAssets??points[low].nominalAssets))low=i;if(value>(points[high].tradingAssets??points[high].nominalAssets))high=i;}return[low,high];}),slots);
 add(remaining,target-selected.size);
 return{points:points.filter((_,i)=>selected.has(i)),removed:points.filter((_,i)=>!selected.has(i))};
}
// Keep quality information readable by PR48, whose v9 reader only knows
// truncatedDays/partial. Newer readers distinguish those compatibility markers
// from actual loss. The set grows with sampled days, never with tick count.
const daysOf=values=>[...new Set(values.filter(day=>Number.isSafeInteger(day)&&day>0))].sort((a,b)=>a-b);
function legacyPartialBridge(j){
 if(!j.sampling)return;
 j.sampling.missingDays ??= [...(j.truncatedDays||[])];
 j.sampling.days=daysOf([...(j.sampling.days||[]),...(j.sampling.dayOmittedPoints>0?[j.sampling.day]:[])]);
 j.truncatedDays=daysOf([...(j.truncatedDays||[]),...j.sampling.days,...j.sampling.missingDays]);
}
export function reconcileAccountingObservations(j,executions){
 const hadSequence=Number.isSafeInteger(j.observationSequence),numbered=j.points.filter(p=>Number.isSafeInteger(p.observation)&&p.observation>0);
 let frontier=hadSequence?j.observationSequence:0;for(const p of numbered)frontier=Math.max(frontier,p.observation);
 const unnumbered=numbered.length!==j.points.length,legacyWrites=(hadSequence||numbered.length>0)&&unnumbered;
 let previous=0,previousDay=null,disordered=false;const gapDays=[];
 for(const p of numbered){if(p.observation<=previous)disordered=true;if(p.observation>previous+1){gapDays.push(p.day);if(previousDay!==null)gapDays.push(previousDay);}previous=p.observation;previousDay=p.day;}
 if(frontier>previous&&previousDay!==null)gapDays.push(previousDay);
 const knownGap=Math.max(j.observationOmittedLowerBound||0,j.observationSequenceRebased?0:Math.max(0,frontier-j.points.length)),unexplained=knownGap>(j.sampling?.omittedPoints||0),incompleteCounts=!!j.sampling&&(j.sampling.omittedPoints>0&&!Number.isSafeInteger(j.sampling.omittedTradePoints)||j.sampling.countsExact!==false&&(j.sampling.legacyWrites||j.observationSequenceRebased||j.sampling.missingDays?.length));
 const uncertainPath=legacyWrites||disordered||unexplained||!hadSequence&&j.truncatedDays?.length;
 if(uncertainPath||incompleteCounts){
  const prior=j.sampling||{};
  j.sampling={...prior,version:1,policy:prior.policy||'legacy-observation-gaps',omittedPoints:Math.max(prior.omittedPoints||0,knownGap),omittedTradePoints:prior.omittedTradePoints||0,countsExact:false,legacyWrites:!!prior.legacyWrites||legacyWrites||disordered,days:daysOf([...(prior.days||[]),...gapDays]),missingDays:daysOf([...(prior.missingDays||[]),...(uncertainPath?[...(j.truncatedDays||[]),...gapDays]:[])])};
  j.executionAnchorsComplete=false;
  // Only proven legacy observations can consume the stale execution cursor.
  // A normal new trade legitimately has a cursor behind its execution count.
  if(legacyWrites||disordered)j.executionCursor=executions;
 }
 if(!hadSequence&&!numbered.length){j.executionCursor=executions;j.executionAnchorsComplete=false;let sequence=0;for(const p of j.points)p.observation=++sequence;j.observationSequence=sequence;}
 else if(unnumbered||disordered){
  const firstMissing=j.points.findIndex(p=>!Number.isSafeInteger(p.observation)||p.observation<1),mixed=disordered||firstMissing>=0&&j.points.slice(firstMissing).some(p=>Number.isSafeInteger(p.observation)&&p.observation>0);
  if(mixed){for(const p of j.points)p.observation=++frontier;}
  else for(const p of j.points)if(!Number.isSafeInteger(p.observation)||p.observation<1)p.observation=++frontier;
  j.observationSequence=frontier;j.observationSequenceRebased=true;
 }else j.observationSequence=frontier;
 if(j.sampling)j.observationOmittedLowerBound=Math.max(j.observationOmittedLowerBound||0,j.sampling.omittedPoints||0);
 legacyPartialBridge(j);
}
export function compactAccountingJournal(j,day){
 const result=retainAccountingPoints(j.points,{day});j.points=result.points;
 if(!result.removed.length)return;
 const previous=j.sampling||{},sameDay=previous.day===day;
 j.sampling={...previous,version:1,policy:'observed-priority-sequence-buckets-v1',omittedPoints:(previous.omittedPoints||0)+result.removed.length,omittedTradePoints:(previous.omittedTradePoints||0)+result.removed.filter(tradePoint).length,day,dayOmittedPoints:(sameDay?previous.dayOmittedPoints||0:0)+result.removed.filter(p=>p.day===day).length,dayOmittedTradePoints:(sameDay?previous.dayOmittedTradePoints||0:0)+result.removed.filter(p=>p.day===day&&tradePoint(p)).length,days:daysOf([...(previous.days||[]),...result.removed.map(p=>p.day)]),missingDays:previous.missingDays||[...(j.truncatedDays||[])]};
 if(j.sampling)j.observationOmittedLowerBound=Math.max(j.observationOmittedLowerBound||0,j.sampling.omittedPoints||0);
 legacyPartialBridge(j);
}
export const accountingDaySampled=(journal,day)=>!!journal?.sampling?.days?.includes(day)||journal?.sampling?.day===day&&journal.sampling.dayOmittedPoints>0;
export const accountingDayMissing=(journal,day)=>!!journal?.sampling?.missingDays?.includes(day)||!!journal?.truncatedDays?.includes(day)&&!accountingDaySampled(journal,day);
export function accountingDailyCoverage(journal,day){
 const required=Math.max(0,(Number.isSafeInteger(day)?day:1)-1),known=new Set((journal?.days||[]).filter(p=>Number.isSafeInteger(p.day)&&p.day>=1&&p.day<=required&&Number.isFinite(p.timestamp)&&Number.isFinite(p.nominalAssets)).map(p=>p.day));
 return{missingDays:Math.max(0,required-known.size)};
}

export function accountingStart(journal){
 return [journal?.start,journal?.points?.find(point=>point?.day===1&&point.kind==='opening')].find(point=>point?.day===1&&Number.isFinite(point.timestamp)&&Number.isFinite(point.nominalAssets))||null;
}
