import {sealedDailyMangaOutcome} from './manga-context.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {safeHistoricalTradeEvidence} from './historical-evidence.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {hasHistoricalSimulation,safeHistoricalSegmentEvidence} from './history-continuation.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';

function validExecutionTimeSource(state,trade){
 if(trade.timePrecision==='game-clock')return !trade.historicalQuote&&!trade.marketSegment;
 if(![1,2,3].includes(state.historical?.version))return false;
 const segment=safeHistoricalSegmentEvidence(trade.marketSegment);
 if(trade.marketSegment&&(!segment||segment.timestamp!==trade.timestamp||!hasHistoricalSimulation(state)))return false;
 if(trade.timePrecision==='historical-quote')return safeHistoricalTradeEvidence(trade)?.sourceTimestamp===trade.timestamp&&(!segment||segment.source==='historical');
 return trade.timePrecision==='simulated-continuation'&&segment?.source==='simulated'&&segment.timestamp===trade.timestamp;
}

const positive=n=>Number.isFinite(n)&&n>0;
const nonnegative=n=>Number.isFinite(n)&&n>=0;
const integer=n=>Number.isSafeInteger(n)&&n>=0;
const closeTypes=new Set(['close','half','closing','stop','liquidation']);
const near=(a,b,tolerance=.02)=>Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<=tolerance;
const quantityNear=(a,b)=>near(a,b,Math.max(1,Math.abs(a),Math.abs(b))*1e-9);
const sum=(rows,key)=>rows.reduce((n,row)=>n+row[key],0);
const sameValue=(a,b)=>a===b||!!a&&!!b&&typeof a==='object'&&typeof b==='object'&&Array.isArray(a)===Array.isArray(b)&&Object.keys(a).length===Object.keys(b).length&&Object.keys(a).every(k=>Object.hasOwn(b,k)&&sameValue(a[k],b[k]));
const sameMultiset=(a,b,equal=sameValue)=>{
 if(a.length!==b.length)return false;
 const matched=new Set();
 for(const row of a){const index=b.findIndex((other,i)=>!matched.has(i)&&equal(row,other));if(index<0)return false;matched.add(index);}
 return true;
};
// Repeated half-closes can share a game-clock timestamp. Their successively
// smaller quantities distinguish those real executions from duplicated rows.
const receiptIdentity=t=>JSON.stringify([t.day,t.beat,t.positionId,t.type,t.timestamp,t.quantity]);
const uniqueReceipts=rows=>new Set(rows.map(receiptIdentity)).size===rows.length;
// Shared by the financial receipt and the retained execution projection.
const legalProtectionCredits=t=>{
 const beforeProtection=t.grossPnl-t.openFee-t.closeFee;
 return (t.lossReduction===0||t.type==='liquidation'&&beforeProtection<0&&near(t.lossReduction,-beforeProtection*.25))&&((t.balanceProtection??0)===0||t.positionClosed===true);
};
function validClose(t,day){
 if(!t||t.day!==day||!closeTypes.has(t.type)||![1,-1].includes(t.direction)||t.pnlModel!=='usd-jpy-v6'||typeof t.positionId!=='string'||!t.positionId||!integer(t.beat)||!positive(t.timestamp)||typeof t.positionClosed!=='boolean')return false;
 if(!['entry','exit','quantity','margin','leverage'].every(k=>positive(t[k]))||!['grossPnl','pnl'].every(k=>Number.isFinite(t[k])))return false;
 if(!['openFee','closeFee','fee','lossReduction'].every(k=>nonnegative(t[k]))||!nonnegative(t.balanceProtection??0)||t.protection!==(t.lossReduction>0))return false;
 // The engine grants this one credit only for an actual losing liquidation.
 // Self-consistent imported arithmetic cannot turn a regular close into aid.
 if(!legalProtectionCredits(t))return false;
 return near(t.grossPnl,(t.exit-t.entry)*t.direction*t.quantity)&&near(t.fee,t.openFee+t.closeFee)&&near(t.pnl,t.grossPnl-t.openFee-t.closeFee+t.lossReduction+(t.balanceProtection??0));
}
function closedOrders(trades){
 const groups=new Map();
 for(const trade of trades){if(!groups.has(trade.positionId))groups.set(trade.positionId,[]);groups.get(trade.positionId).push(trade);}
 const orders=[];
 for(const [positionId,rows] of groups){
  const first=rows[0];
  if(rows.at(-1).positionClosed!==true||rows.some((t,i)=>t.direction!==first.direction||t.entry!==first.entry||(i<rows.length-1&&(t.positionClosed!==false||t.type!=='half'))||(i>0&&(t.beat<rows[i-1].beat||t.timestamp<rows[i-1].timestamp))))return null;
  orders.push({positionId,direction:first.direction,net:sum(rows,'pnl'),trades:rows});
 }
 return orders;
}

// Net equality alone cannot prove completeness: omitting a zero-net execution
// can preserve the daily total while changing the apparent trading direction.
// Reconcile the independently retained fee rows and all sealed daily net aliases.
function completeDailyFees(state,report,trades){
 if(!Array.isArray(state.feeLedger)||!nonnegative(report.fees)||!nonnegative(report.feesPaid))return false;
 if(!['closedTradeNet','tradeNet','netTradingProfit'].every(k=>near(report[k],report.net)))return false;
 const fees=state.feeLedger.filter(row=>row?.day===state.day);
 if(fees.some(row=>!['open','close'].includes(row.side)||typeof row.positionId!=='string'||!integer(row.beat)||!nonnegative(row.amount)))return false;
 if(!near(sum(trades,'fee'),report.fees)||!near(report.fees,report.feesPaid)||!near(sum(fees,'amount'),report.fees))return false;
 const ids=[...new Set(trades.map(t=>t.positionId))];
 if(fees.some(row=>!ids.includes(row.positionId)))return false;
 for(const id of ids){
  const executions=trades.filter(t=>t.positionId===id),opened=fees.filter(row=>row.positionId===id&&row.side==='open'),closed=fees.filter(row=>row.positionId===id&&row.side==='close');
  if(opened.length!==1||!near(opened[0].amount,sum(executions,'openFee'))||!sameMultiset(closed,executions,(fee,t)=>fee.beat===t.beat&&near(fee.amount,t.closeFee)))return false;
 }
 return true;
}

// This is a read-only receipt gate. Durable-save/current-run presentation is
// still owned by createSavedContextualManga; no receipt is repaired here.
export function sealedDailyTradeEvidence(state){
 const outcome=sealedDailyMangaOutcome(state),report=state?.dayReport;
 if(state?.mode!=='story'||!outcome||!Number.isSafeInteger(state.day)||state.day<1||state.position||!Array.isArray(report.trades)||report.trades.some(t=>!t||t.day!==state.day)||!Array.isArray(state.history))return null;
 if(Object.hasOwn(report,'runId')&&report.runId!==state.runId)return null;
 const trades=report.trades.filter(t=>t.type!=='open'),history=state.history.filter(t=>t?.day===state.day&&t.type!=='open');
 if(!trades.length||trades.some(t=>!validClose(t,state.day))||!uniqueReceipts(trades)||!uniqueReceipts(history)||!sameMultiset(trades,history)||!near(sum(trades,'pnl'),outcome.net)||!completeDailyFees(state,report,trades))return null;
 // I and the older debt stories do not need opening chronology. Nevertheless,
 // an explicitly retained complete timeline must not contradict their ledger.
 // In particular, deleting the same losing/winning row from both saved copies
 // cannot hide a known opposite-direction execution from these selectors.
 const stats=state.runStatistics;
 if(stats?.version===1&&stats.complete===true&&stats.timelinePartial===false){
  if(!Array.isArray(stats.trades)||stats.trades.some(t=>!t)||Object.hasOwn(stats,'runId')&&stats.runId!==state.runId||!sameMultiset(stats.trades.filter(t=>t.day===state.day&&t.type!=='open'),trades,sameExecution))return null;
 }
 const orders=closedOrders(history);if(!orders)return null;
 return {day:state.day,net:outcome.net,positions:[...new Set(trades.map(t=>t.positionId))],trades:structuredClone(trades),orders:structuredClone(orders)};
}

export function shortProfitEvidence(state){
 const evidence=sealedDailyTradeEvidence(state);
 if(!evidence||evidence.net<=0||evidence.trades.some(t=>t.direction!==-1||t.exit>=t.entry||t.pnl<=0||t.lossReduction!==0||(t.balanceProtection??0)!==0))return null;
 return {day:evidence.day,net:evidence.net,positions:evidence.positions};
}

// A positive day alone cannot stand in for a profitable long execution.
export function longProfitEvidence(state){
 const evidence=sealedDailyTradeEvidence(state);
 if(!evidence||evidence.net<=0||evidence.trades.some(t=>t.direction!==1||t.exit<=t.entry||t.pnl<=0||t.lossReduction!==0||(t.balanceProtection??0)!==0))return null;
 return {day:evidence.day,net:evidence.net,positions:evidence.positions};
}

// runStatistics v1 deliberately stores a projection, not a second financial
// ledger. It has no native pnlModel/protection/runId fields. Match every saved
// exit to a certified modern receipt instead of manufacturing those fields.
const timelineNumbers=['direction','margin','leverage','entry','exit','quantity','grossPnl','openFee','closeFee','fee','pnl','maxUnrealized','lossReduction','balanceProtection'];
const sameExecution=(execution,receipt)=>['type','positionId','day','beat','timestamp','positionClosed'].every(k=>execution[k]===receipt[k])&&timelineNumbers.every(k=>execution[k]===(Number.isFinite(receipt[k])?receipt[k]:null));
export function validStatisticsShape(stats){
 const counts=['closedOrders','winningOrders','losingOrders','breakevenOrders','liquidatedOrders','stopLossOrders','partialCloseExecutions','maxWinningStreak','maxLosingStreak','winningStreak','losingStreak','profitGivebackOrders','executions'];
 return counts.every(k=>integer(stats[k]))&&nonnegative(stats.maxLeverage)&&nonnegative(stats.maxOrderProfit)&&Number.isFinite(stats.maxOrderLoss)&&stats.maxOrderLoss<=0&&['realizedCumulative','realizedPeak','realizedTrough'].every(k=>Number.isFinite(stats[k]))&&['realizedPathComplete','maxLeverageComplete','profitGivebackComplete','drawdownRecorded'].every(k=>stats[k]===true)&&stats.winningOrders+stats.losingOrders+stats.breakevenOrders===stats.closedOrders&&stats.openOrders&&typeof stats.openOrders==='object'&&!Array.isArray(stats.openOrders)&&Object.keys(stats.openOrders).length===0;
}
function completeExecutionOrders(trades,stats){
 const opened=new Map(),closed=[];
 let partials=0,realized=0,peak=0,trough=0;
 for(const trade of trades){
  if(trade.type==='open'){
   if(opened.has(trade.positionId)||['exit','grossPnl','closeFee','pnl','maxUnrealized','lossReduction','balanceProtection'].some(k=>trade[k]!==null))return false;
   opened.set(trade.positionId,{open:trade,exits:[],closed:false});continue;
  }
  const order=opened.get(trade.positionId);
  if(!order||order.closed||trade.day!==order.open.day||trade.direction!==order.open.direction||trade.entry!==order.open.entry||trade.leverage!==order.open.leverage||typeof trade.positionClosed!=='boolean'||(!trade.positionClosed&&trade.type!=='half'))return false;
  if(!legalProtectionCredits(trade)||!positive(trade.exit)||!['grossPnl','pnl'].every(k=>Number.isFinite(trade[k]))||!['openFee','closeFee','fee','lossReduction','maxUnrealized'].every(k=>nonnegative(trade[k]))||!(trade.balanceProtection===null||nonnegative(trade.balanceProtection))||!near(trade.grossPnl,(trade.exit-trade.entry)*trade.direction*trade.quantity)||!near(trade.fee,trade.openFee+trade.closeFee)||!near(trade.pnl,trade.grossPnl-trade.fee+trade.lossReduction+(trade.balanceProtection??0)))return false;
  order.exits.push(trade);if(trade.type==='half')partials++;
  realized+=trade.pnl;peak=Math.max(peak,realized);trough=Math.min(trough,realized);
  if(trade.positionClosed){
   if(!quantityNear(sum(order.exits,'quantity'),order.open.quantity)||!quantityNear(sum(order.exits,'margin'),order.open.margin)||!near(sum(order.exits,'openFee'),order.open.openFee))return false;
   order.closed=true;order.net=sum(order.exits,'pnl');closed.push(order);
  }
 }
 if([...opened.values()].some(o=>!o.closed)||closed.length!==stats.closedOrders||partials!==stats.partialCloseExecutions||!near(realized,stats.realizedCumulative)||!near(peak,stats.realizedPeak)||!near(trough,stats.realizedTrough))return false;
 const wins=closed.filter(o=>o.net>.005).length,losses=closed.filter(o=>o.net<-.005).length;
 return wins===stats.winningOrders&&losses===stats.losingOrders&&closed.length-wins-losses===stats.breakevenOrders&&near(Math.max(0,...closed.map(o=>o.net)),stats.maxOrderProfit)&&near(Math.min(0,...closed.map(o=>o.net)),stats.maxOrderLoss)&&closed.filter(o=>o.exits.at(-1).type==='liquidation').length===stats.liquidatedOrders&&closed.filter(o=>o.exits.at(-1).type==='stop').length===stats.stopLossOrders;
}
export function retainedTimeline(state,evidence){
 const stats=state?.runStatistics;
 if(!stats||stats.version!==1||stats.complete!==true||stats.timelinePartial!==false||!Array.isArray(stats.trades)||stats.trades.length>2048||!validStatisticsShape(stats)||stats.executions!==stats.trades.length)return null;
 if(Object.hasOwn(stats,'runId')&&stats.runId!==state.runId)return null;
 const trades=stats.trades;
 for(const [index,t] of trades.entries()){
  if(!t||t.sequence!==index+1||!Number.isSafeInteger(t.day)||t.day<1||t.day>state.day||!integer(t.beat)||!positive(t.timestamp)||!validExecutionTimeSource(state,t)||!/^order-\d{1,15}$/.test(t.positionId||'')||![1,-1].includes(t.direction)||!['entry','quantity','margin','leverage'].every(k=>positive(t[k])))return null;
  if(Object.hasOwn(t,'pnlModel')&&t.pnlModel!=='usd-jpy-v6')return null;
  if(t.type!=='open'&&!closeTypes.has(t.type))return null;
  if(index&&(t.day<trades[index-1].day||t.day===trades[index-1].day&&t.beat<trades[index-1].beat||t.timestamp<trades[index-1].timestamp))return null;
  if(t.type==='open'&&(t.positionClosed!==false||!nonnegative(t.openFee)||!near(t.fee,t.openFee)||!quantityNear(t.quantity,t.margin*t.leverage/t.entry)))return null;
 }
 if(!completeExecutionOrders(trades,stats))return null;
 const exits=trades.filter(t=>t.day===state.day&&t.type!=='open');
 if(!uniqueReceipts(exits)||!sameMultiset(exits,evidence.trades,sameExecution))return null;
 // One retained open must cover every exit of every current-day order. This
 // also rejects a deleted partial even if someone changes the report's net.
 const orders=[];
 for(const order of evidence.orders){
  const rows=trades.filter(t=>t.positionId===order.positionId),opens=rows.filter(t=>t.type==='open'),closes=rows.filter(t=>t.type!=='open');
  if(opens.length!==1||closes.length!==order.trades.length)return null;
  const open=opens[0],final=closes.at(-1);
  if(open.day!==state.day||!sameMultiset(closes,order.trades,sameExecution)||closes.some((t,i)=>t.sequence<=open.sequence||t.timestamp<open.timestamp||t.beat<open.beat||t.direction!==open.direction||t.entry!==open.entry||t.leverage!==open.leverage||(i<closes.length-1&&(t.type!=='half'||t.positionClosed!==false)))||final.positionClosed!==true)return null;
  if(!quantityNear(sum(closes,'quantity'),open.quantity)||!quantityNear(sum(closes,'margin'),open.margin)||!near(sum(closes,'openFee'),open.openFee))return null;
  // Report order may be rearranged for display; the retained execution order
  // must still agree with saved history for every partial and final exit.
  if(!closes.every((t,i)=>sameExecution(t,order.trades[i])))return null;
  orders.push({...order,open,final,executions:closes});
 }
 return orders;
}

export function reversalLiquidationEvidence(state){
 const evidence=sealedDailyTradeEvidence(state);
 if(!evidence||evidence.net>=0||evidence.trades.some(t=>t.direction!==1)||!Array.isArray(state.dayReport.moments)||!Array.isArray(state.dayMoments))return null;
 const orders=retainedTimeline(state,evidence);if(!orders)return null;
 for(const order of orders){
  const final=order.final;
  if(order.net>=0||final.type!=='liquidation'||final.pnl>=0||!positive(final.maxUnrealized))continue;
  // Existing moments have only day/beat precision. Equal-beat records cannot
  // establish before/after and therefore cannot unlock this stricter story.
  const moment=state.dayReport.moments.find(m=>m&&m.day===state.day&&m.positionId===order.positionId&&m.direction===1&&m.reversal==='profit-to-loss'&&Number.isFinite(m.pnl)&&m.pnl<0&&integer(m.beat)&&m.beat>=order.open.beat&&m.beat<final.beat&&state.dayMoments.some(saved=>sameValue(saved,m)));
  if(moment)return {day:evidence.day,net:evidence.net,positions:evidence.positions,liquidationPositionId:order.positionId,positionNet:order.net,liquidationSequence:final.sequence,reversalBeat:moment.beat};
 }
 return null;
}

export function oppositeDirectionsEvidence(state){
 const evidence=sealedDailyTradeEvidence(state);if(!evidence)return null;
 const orders=retainedTimeline(state,evidence);if(!orders)return null;
 const rising=order=>order.trades.every(t=>t.exit>t.entry);
 const longs=orders.filter(o=>o.direction===1&&o.net>0&&rising(o)),shorts=orders.filter(o=>o.direction===-1&&o.net<0&&rising(o));
 for(const long of longs)for(const short of shorts){
  if(Math.max(long.open.sequence,short.open.sequence)<Math.min(long.final.sequence,short.final.sequence))return {day:evidence.day,net:evidence.net,positions:evidence.positions,longPositionId:long.positionId,shortPositionId:short.positionId,longNet:long.net,shortNet:short.net,longOpenSequence:long.open.sequence,shortOpenSequence:short.open.sequence,longCloseSequence:long.final.sequence,shortCloseSequence:short.final.sequence};
 }
 return null;
}
