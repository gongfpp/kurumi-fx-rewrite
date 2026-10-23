import {sealedDailyTradeEvidence,retainedTimeline} from './contextual-trade-evidence.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';

// Closing a losing long and only then opening a short proves the change in
// direction, not a motive, position size, market bottom or the short's outcome.
export function longLossThenShortEvidence(state){
 const evidence=sealedDailyTradeEvidence(state);if(!evidence)return null;
 const orders=retainedTimeline(state,evidence);if(!orders)return null;
 const timeline=state.runStatistics.trades;
 for(const first of orders){
  const final=first.final;
  if(first.direction!==1||first.net>=-.005||first.executions.reduce((n,t)=>n+t.grossPnl,0)>=0||!['close','stop'].includes(final.type)||final.positionClosed!==true||final.pnl>=0||final.exit>=first.open.entry||first.executions.some(t=>t.lossReduction!==0||(t.balanceProtection??0)!==0))continue;
  // Replay actual sequence, allowing equal timestamps while rejecting any
  // overlapping position at the completed long's exit.
  const active=new Set();
  for(const t of timeline){if(t.sequence>final.sequence)break;if(t.type==='open')active.add(t.positionId);else if(t.positionClosed)active.delete(t.positionId);}
  if(active.size)continue;
  const next=timeline.find(t=>t.sequence>final.sequence&&t.type==='open');
  if(!next||next.day!==state.day||next.direction!==-1||next.positionId===first.positionId)continue;
  const second=orders.find(o=>o.positionId===next.positionId&&o.open.sequence===next.sequence);
  if(!second)continue;
  return {runId:state.runId,day:evidence.day,longPositionId:first.positionId,shortPositionId:second.positionId,longOpenSequence:first.open.sequence,longCloseSequence:final.sequence,shortOpenSequence:next.sequence,shortCloseSequence:second.final.sequence};
 }
 return null;
}
