import {firstDayBackstoryEvidence} from './contextual-firstday-evidence.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {retainedTimeline,sealedDailyTradeEvidence} from './contextual-trade-evidence.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
// Only the new first-day seal can create this proof. Later days may validate
// it against retained real ledgers; they never reconstruct an old missing seal.
const orderKeys=['sequence','type','positionId','day','beat','timestamp','timePrecision'];
const orderBinding=rows=>rows.map(row=>orderKeys.map(key=>row[key]??null));
const reportKeys=['net','closedTradeNet','tradeNet','netTradingProfit','fees','feesPaid'];
const receiptKeys=['type','positionClosed','timestamp','positionId','direction','margin','leverage','entry','exit','pnlModel','quantity','grossPnl','lossReduction','protection','openFee','closeFee','fee','maxUnrealized','balanceProtection','pnl','day','beat'];
const statisticsKeys=['version','complete','runId','closedOrders','winningOrders','losingOrders','breakevenOrders','maxOrderProfit','maxOrderLoss','liquidatedOrders','stopLossOrders','partialCloseExecutions','maxLeverage','maxWinningStreak','maxLosingStreak','winningStreak','losingStreak','profitGivebackOrders','openOrders','executions','timelinePartial','realizedCumulative','realizedPeak','realizedTrough','realizedPathComplete','maxLeverageComplete','profitGivebackComplete','drawdownRecorded'];
const project=(row,keys)=>Object.fromEntries(keys.filter(key=>Object.hasOwn(row,key)).map(key=>[key,structuredClone(row[key])]));
const receipt=row=>project(row,receiptKeys);
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
export function captureFirstDayOriginalRecall(state){
 if(state?.mode!=='story'||state.phase!=='resting'||state.day!==1||typeof state.runId!=='string'||!state.runId||!state.story||Object.hasOwn(state.story,'firstDayOriginalRecall')||state.story.presentedDay===1||state.story.seen?.includes('friendStudy')||state.story.log?.some(row=>row?.id==='friendStudy')||!firstDayBackstoryEvidence(state))return false;
 const statistics=project(state.runStatistics,statisticsKeys);
 state.story.firstDayOriginalRecall={version:1,origin:'sealed-first-day-short-profit',runId:state.runId,day:1,
  report:{day:1,runId:state.runId,...Object.fromEntries(reportKeys.map(key=>[key,state.dayReport[key]]))},
  receipts:state.dayReport.trades.filter(row=>row.type!=='open').map(receipt),statistics,executionOrder:orderBinding(state.runStatistics.trades)};
 return true;
}
export function firstDayOriginalRecallEvidence(state){
 const source=state?.story?.firstDayOriginalRecall,stats=state?.runStatistics;
 if(state?.mode!=='story'||!Number.isSafeInteger(state.day)||state.day<=1||typeof state.runId!=='string'||!state.runId||source?.version!==1||source.origin!=='sealed-first-day-short-profit'||source.runId!==state.runId||source.day!==1||source.report?.day!==1||source.report?.runId!==state.runId||!Array.isArray(source.receipts)||!source.receipts.length||!Array.isArray(source.executionOrder)||!source.statistics||Object.hasOwn(source.statistics,'trades')||!Array.isArray(state.history)||!Array.isArray(state.feeLedger))return null;
 if(stats?.version!==1||stats.complete!==true||stats.timelinePartial!==false||!Array.isArray(stats.trades)||Object.hasOwn(stats,'runId')&&stats.runId!==state.runId||state.history.some(row=>!row||typeof row!=='object'))return null;
 // A retained first-day prefix cannot excuse a contradictory current run.
 // Empty later days still validate all retained executions and aggregates.
 const currentExits=stats.trades.filter(row=>row?.day===state.day&&row.type!=='open');
 const current=currentExits.length?sealedDailyTradeEvidence(state):{trades:[],orders:[]};
 if(!current||!retainedTimeline(state,current))return null;
 const history=state.history.filter(row=>row?.day===1).map(receipt),timeline=stats.trades.filter(row=>row?.day===1),fees=state.feeLedger.filter(row=>row?.day===1);
 if(!same(source.receipts,history.filter(row=>row.type!=='open'))||!same(source.executionOrder,orderBinding(timeline)))return null;
 // Reuse the original arithmetic, fees, all-short, chronology and complete-run
 // gate on that sealed first day. This is a read-only view, never a new report
 // in the player's current state, and contains no stored future price script.
 const view={...state,day:1,phase:'resting',position:null,positions:[],dayReport:{...source.report,trades:source.receipts},
  history,feeLedger:fees,runStatistics:{...source.statistics,trades:timeline}};
 const proof=firstDayBackstoryEvidence(view);return proof?{...proof,runId:source.runId,recalledOn:state.day}:null;
}
