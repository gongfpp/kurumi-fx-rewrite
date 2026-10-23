import {sealedDailyMangaOutcome} from './manga-context.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {tradingTrauma} from './trading-trauma.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {isSevereSettledLoss} from './settled-comic-art.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {dailyReturnMetrics} from './daily-performance.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';

// Presentation reads the sealed day's result. Funding, wages and one winning
// execution cannot change it, and a later win cannot clear retained trauma.
export function dailyNarrativeFacts(state){
 const outcome=sealedDailyMangaOutcome(state);
 if(!outcome)return null;
 const trauma=tradingTrauma(state),basis=dailyReturnMetrics(state,{report:state.dayReport}).denominator;
 // Older summaries can retain stale auxiliary net aliases. The sealed net
 // selected above remains the narrative's result; aliases cannot make it calm.
 const severeLoss=isSevereSettledLoss(state,state.dayReport)||outcome.net<0&&Number.isFinite(basis)&&(basis<=0||outcome.net/basis<=-.2);
 const trades=Array.isArray(state.dayReport.trades)?state.dayReport.trades:[];
 const liquidation=trades.some(trade=>trade?.day===outcome.day&&trade.type==='liquidation'&&Number.isFinite(trade.pnl)&&trade.pnl<0);
 return {outcome,trauma,severeLoss,liquidation,needsConsequence:severeLoss||liquidation||trauma.active};
}

const lossStories=new Set(['holding-loss-companion','holding-loss','profit-fades','averaging-down-prayer']);
// A common final gate also covers already-locked scenes. Read memory only
// orders eligible content; it never makes incompatible art eligible again.
export function dailySceneFilterReason(state,scene){
 const facts=dailyNarrativeFacts(state);
 if(!facts)return 'unsealed-day';
 if(!scene)return 'missing-scene';
 if(scene.consequenceReceipt)return 'receipt-without-dialogue';
 if(['holding-loss','holding-loss-companion'].includes(scene.id)){
  const trades=Array.isArray(state.dayReport.trades)?state.dayReport.trades.filter(t=>t?.day===state.day&&t.type!=='open'):[];
  if(facts.outcome.kind!=='loss'||!trades.length||trades.some(t=>t.direction!==1||!Number.isFinite(t.entry)||!Number.isFinite(t.exit)||t.exit>=t.entry||!Number.isFinite(t.pnl)||t.pnl>=0))return 'long-loss-direction-mismatch';
 }
 if(!facts.needsConsequence)return null;
 if(scene.consequenceTransition||scene.id==='daily-result'&&facts.outcome.kind==='loss')return null;
 if(facts.outcome.kind==='loss'&&lossStories.has(scene.id))return null;
 return facts.trauma.active?'trading-trauma-continuity':facts.liquidation?'liquidation-consequence-first':'severe-loss-consequence-first';
}

export const dailyRoutineSceneAllowed=state=>dailyNarrativeFacts(state)?.needsConsequence===false;
// A new committed action can omit casual dialogue without inventing a source.
// Existing markerless receipts retain their exact historical text/null payload.
export const isConsequenceLifeReceipt=receipt=>receipt?.narrativeMode==='consequence-first-v1'&&receipt.dialogue===null&&['work','friend','relax','dinner'].includes(receipt.category);
