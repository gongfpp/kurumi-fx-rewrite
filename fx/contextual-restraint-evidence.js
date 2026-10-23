import {sealedDailyMangaOutcome} from './manga-context.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {sealedDailyTradeEvidence,retainedTimeline,validStatisticsShape} from './contextual-trade-evidence.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {currentTradingTimestamp} from './trading-time.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
const activitySpecs={'quiet-night':[0,undefined,-10000],'noodles-today':[150,undefined,null],'dinner-small':[1500,'dinner',3000],'dinner-friends':[8000,'dinner',40000],'dinner-feast':[30000,'dinner',200000],'dinner-banquet':[100000,'dinner',1000000]};
const current=state=>state?.mode==='story'&&['day_end','resting'].includes(state.phase)&&!state.position&&Number.isSafeInteger(state.day)&&state.day>0&&sealedDailyMangaOutcome(state);
// Validate both whole current-day activity multisets. Free choices are real
// zero-valued receipts, never inferred from clicks, mood or itemsUsed.
export function activityReceiptEvidence(state,id){
 const outcome=current(state);if(!outcome||!activitySpecs[id]||!Array.isArray(state.recapChoiceLedger)||!Array.isArray(state.consumptionLedger))return null;
 const choices=state.recapChoiceLedger.filter(r=>r?.day===state.day),consumption=state.consumptionLedger.filter(r=>r?.kind==='activity'&&r.day===state.day||typeof r?.id==='string'&&r.id.startsWith(`activity:${state.day}:`));
 if(!choices.length||choices.length!==consumption.length||new Set(choices.map(r=>r.id)).size!==choices.length||choices.filter(r=>r.group==='dinner').length>1)return null;
 for(const r of choices){
  const spec=activitySpecs[r.id];if(!spec)return null;
  const [cost,group,threshold]=spec;
  if(r.cost!==cost||r.group!==group||!Number.isFinite(r.timestamp)||r.timestamp!==currentTradingTimestamp(state))return null;
  if(r.id==='quiet-night'?outcome.net>threshold:r.id==='noodles-today'?outcome.net>=0:outcome.net<threshold)return null;
  const matches=consumption.filter(c=>c.id===`activity:${state.day}:${r.id}`);
  if(matches.length!==1)return null;
  const c=matches[0];if(c.kind!=='activity'||c.day!==state.day||c.amount!==cost||c.timestamp!==r.timestamp)return null;
 }
 const receipt=choices.find(r=>r.id===id);return receipt?{day:state.day,id:receipt.id,cost:receipt.cost,group:receipt.group??null,timestamp:receipt.timestamp}:null;
}
export function quietNightConfirmation(state){
 if(!current(state))return null;
 const n=state.settlementNarrative,s=state.story;
 if(n?.day!==state.day||n.event?.key!=='quietNight'||n.effectsApplied!==true||s?.presentedDay!==state.day||!Array.isArray(s.seen)||!s.seen.includes('quietNight')||!Array.isArray(s.log))return null;
 const logs=s.log.filter(r=>r?.day===state.day&&r.id==='quietNight');
 if(logs.length!==1||logs[0].choice!=='continue'||!Number.isSafeInteger(logs[0].beat)||logs[0].beat!==state.beat)return null;
 return {day:state.day,beat:logs[0].beat,choice:'continue',event:'quietNight'};
}
function completeEvidence(state){
 if(!current(state))return null;
 const evidence=sealedDailyTradeEvidence(state);if(!evidence)return null;
 const orders=retainedTimeline(state,evidence);return orders?{...evidence,orders}:null;
}
export function pauseAndReturnEvidence(state){
 const outcome=current(state);if(!outcome)return null;
 if(outcome.net<=-10000){const evidence=completeEvidence(state),receipt=activityReceiptEvidence(state,'quiet-night');return evidence&&receipt?{day:state.day,net:evidence.net,receipt}:null;}
 if(outcome.net!==0||state.dayReport.closedTradeNet!==0||!Array.isArray(state.dayReport.trades)||state.dayReport.trades.length||!Array.isArray(state.history)||state.history.some(t=>!t||t.day===state.day))return null;
 const stats=state.runStatistics;
 if(!stats||stats.version!==1||stats.complete!==true||stats.timelinePartial!==false||!Array.isArray(stats.trades)||stats.trades.some(t=>!t||t.day===state.day)||stats.executions!==stats.trades.length||!validStatisticsShape(stats)||!retainedTimeline(state,{trades:[],orders:[]})||Object.hasOwn(stats,'runId')&&stats.runId!==state.runId)return null;
 const confirmation=quietNightConfirmation(state);return confirmation?{day:state.day,net:0,confirmation}:null;
}
export function averagingDownEvidence(state){
 const evidence=completeEvidence(state),receipt=activityReceiptEvidence(state,'quiet-night');
 if(!evidence||!receipt||evidence.net>-10000||evidence.trades.some(t=>t.direction!==1))return null;
 const losing=evidence.orders.filter(o=>o.net<0&&o.final.type!=='liquidation');
 for(const first of losing)for(const second of losing){
  if(first.open.sequence<second.open.sequence&&second.open.sequence<first.final.sequence&&second.open.entry<first.open.entry){
   const remaining=first.open.quantity-first.executions.filter(t=>t.sequence<second.open.sequence).reduce((sum,t)=>sum+t.quantity,0);
   if(remaining>0)return {day:state.day,net:evidence.net,receipt,firstPositionId:first.positionId,secondPositionId:second.positionId,firstOpen:first.open.sequence,secondOpen:second.open.sequence,firstFinal:first.final.sequence};
  }
 }
 return null;
}
export function friendsLedgersEvidence(state){
 const evidence=completeEvidence(state),receipt=activityReceiptEvidence(state,'dinner-friends');return evidence&&evidence.net>=40000&&receipt?{day:state.day,net:evidence.net,receipt}:null;
}
export function floatingCautionEvidence(state){
 const evidence=completeEvidence(state);if(!evidence||evidence.net<=0)return null;
 for(const order of evidence.orders){
  if(order.direction!==1||order.net<=0||order.final.type!=='closing'&&order.final.type!=='close'||order.final.pnl<=0||order.final.exit<=order.open.entry)continue;
  const partial=order.executions.find(t=>t.type==='half'&&t.positionClosed===false&&t.pnl>0&&t.exit>order.open.entry&&t.maxUnrealized>0&&t.sequence<order.final.sequence);
  if(partial)return {day:state.day,net:evidence.net,positionId:order.positionId,partialSequence:partial.sequence,finalSequence:order.final.sequence,maxUnrealized:partial.maxUnrealized};
 }
 return null;
}
export function activityPresentationIdentity(state){return [activityReceiptEvidence(state,'quiet-night'),activityReceiptEvidence(state,'dinner-friends'),quietNightConfirmation(state)];}
