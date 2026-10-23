import {currentTradingTimestamp} from './trading-time.js?v=ebe513d153a1219d73a65051f32fb508afce547c-capture-v1-1fbef814f493';

// This ledger observes filled orders only. It never changes balances or gameplay.
// Execution P/L stays in the engine's original performance ledger. These totals
// aggregate every partial exit into the same order before counting a win/loss.
export const RUN_STATISTICS_VERSION=1;
export const RUN_TRADE_LIMIT=2048;
const finite=(v,f=0)=>Number.isFinite(v)?v:f;
const positions=s=>s.positions?.length?s.positions:s.position?[s.position]:[];
const validId=id=>typeof id==='string'&&/^order-\d{1,15}$/.test(id);
const fresh=()=>({version:1,complete:true,closedOrders:0,winningOrders:0,losingOrders:0,breakevenOrders:0,maxOrderProfit:0,maxOrderLoss:0,liquidatedOrders:0,stopLossOrders:0,partialCloseExecutions:0,maxLeverage:0,maxWinningStreak:0,maxLosingStreak:0,winningStreak:0,losingStreak:0,profitGivebackOrders:0,openOrders:{},trades:[],executions:0,timelinePartial:false,realizedCumulative:0,realizedPeak:0,realizedTrough:0,realizedPathComplete:true,maxLeverageComplete:true,profitGivebackComplete:true,drawdownRecorded:true});
function safeTrade(t,s,{legacy=false}={}){
 const result={sequence:0,type:['open','half','close','rescue','stop','liquidation','closing'].includes(t.type)?t.type:'unknown',positionId:validId(t.positionId)?t.positionId:null,day:Number.isSafeInteger(t.day)?t.day:null,beat:Number.isSafeInteger(t.beat)?t.beat:null,timestamp:Number.isFinite(t.timestamp)?t.timestamp:legacy?null:currentTradingTimestamp(s),timePrecision:legacy&&!Number.isFinite(t.timestamp)?'day-and-beat-only':'game-clock'};
 for(const key of ['direction','margin','leverage','entry','exit','quantity','grossPnl','openFee','closeFee','fee','pnl','maxUnrealized','lossReduction','balanceProtection'])result[key]=Number.isFinite(t[key])?t[key]:null;
 result.positionClosed=t.positionClosed===true;return result;
}
function append(stats,trade){trade.sequence=++stats.executions;stats.trades.push(trade);if(stats.trades.length>RUN_TRADE_LIMIT){stats.trades=stats.trades.slice(-RUN_TRADE_LIMIT);stats.timelinePartial=true;}}
function addExit(stats,t,closed){
 if(Number.isFinite(stats.realizedCumulative)){stats.realizedCumulative+=t.pnl;stats.realizedPeak=Math.max(stats.realizedPeak,stats.realizedCumulative);stats.realizedTrough=Math.min(stats.realizedTrough,stats.realizedCumulative);}else stats.realizedPathComplete=false;
 if(!validId(t.positionId)){stats.complete=false;return;}
 const order=stats.openOrders[t.positionId]||{pnl:0,hasProfit:false};
 order.pnl+=t.pnl;order.hasProfit ||= finite(t.maxUnrealized)>0;
 stats.maxLeverage=Math.max(stats.maxLeverage,finite(t.leverage));
 if(t.type==='half')stats.partialCloseExecutions++;
 if(!closed){stats.openOrders[t.positionId]=order;return;}
 stats.closedOrders++;stats.maxOrderProfit=Math.max(stats.maxOrderProfit,order.pnl);stats.maxOrderLoss=Math.min(stats.maxOrderLoss,order.pnl);
 // Tiny floating arithmetic residuals are a break-even, not a phantom win.
 if(order.pnl>.005){stats.winningOrders++;stats.winningStreak++;stats.losingStreak=0;}
 else if(order.pnl<-.005){stats.losingOrders++;stats.losingStreak++;stats.winningStreak=0;if(order.hasProfit)stats.profitGivebackOrders++;}
 else {stats.breakevenOrders++;stats.winningStreak=0;stats.losingStreak=0;}
 stats.maxWinningStreak=Math.max(stats.maxWinningStreak,stats.winningStreak);stats.maxLosingStreak=Math.max(stats.maxLosingStreak,stats.losingStreak);
 if(t.type==='liquidation')stats.liquidatedOrders++;if(t.type==='stop')stats.stopLossOrders++;
 delete stats.openOrders[t.positionId];
}
function reconstruct(s){
 const stats=fresh(),trades=(s.history||[]).filter(t=>t.type!=='open'&&Number.isFinite(t.pnl));
 const active=new Set(positions(s).map(p=>p.id));
 const declared=s.performance?.closedTrades;
 stats.complete=trades.every(t=>validId(t.positionId))&&(!Number.isSafeInteger(declared)||declared===trades.length);
 // Old saves never retained open executions, so the detailed timeline is partial
 // even when complete exit history is enough to recover all outcome aggregates.
 stats.timelinePartial=!!trades.length||positions(s).length>0||(s.day||1)>1;
 stats.maxLeverageComplete=!trades.length&&!positions(s).length;stats.profitGivebackComplete=trades.every(t=>Number.isFinite(t.maxUnrealized));stats.drawdownRecorded=Number.isFinite(s.performance?.maxDrawdown);
 const last=new Map();trades.forEach((t,i)=>last.set(t.positionId,i));
 for(const [i,t] of trades.entries()){
  const closed=!active.has(t.positionId)&&last.get(t.positionId)===i;
  addExit(stats,t,closed);append(stats,{...safeTrade(t,s,{legacy:true}),positionClosed:closed});
 }
 for(const p of positions(s)){stats.maxLeverage=Math.max(stats.maxLeverage,finite(p.leverage));if(validId(p.id))stats.openOrders[p.id] ||= {pnl:0,hasProfit:finite(p.maxUnrealized)>0};else stats.complete=false;}
 return stats;
}
function validStats(stats){
 return stats?.version===1&&typeof stats.complete==='boolean'&&Array.isArray(stats.trades)&&stats.trades.length<=RUN_TRADE_LIMIT&&stats.openOrders&&typeof stats.openOrders==='object'&&!Array.isArray(stats.openOrders)&&['closedOrders','winningOrders','losingOrders','breakevenOrders','liquidatedOrders','stopLossOrders','partialCloseExecutions','maxLeverage','maxWinningStreak','maxLosingStreak','winningStreak','losingStreak','profitGivebackOrders','executions'].every(k=>Number.isFinite(stats[k])&&stats[k]>=0)&&Number.isFinite(stats.maxOrderProfit)&&Number.isFinite(stats.maxOrderLoss)&&stats.winningOrders+stats.losingOrders+stats.breakevenOrders===stats.closedOrders&&Object.entries(stats.openOrders).every(([id,o])=>validId(id)&&Number.isFinite(o?.pnl));
}
export function readRunStatistics(state={}){return validStats(state.runStatistics)?state.runStatistics:reconstruct(state);}
export function ensureRunStatistics(state){
 if(!validStats(state.runStatistics)){
  state.runStatistics=reconstruct(state);
  for(const t of state.history||[])if(t.type!=='open'&&Number.isFinite(t.pnl))t.runStatisticsRecorded=true;
 }
 return state.runStatistics;
}
export function recordOrderOpened(state,trade){
 const stats=ensureRunStatistics(state);stats.maxLeverage=Math.max(stats.maxLeverage,finite(trade.leverage));
 if(validId(trade.positionId))stats.openOrders[trade.positionId] ||= {pnl:0,hasProfit:false};else stats.complete=false;
 append(stats,safeTrade(trade,state));
}
export function recordOrderExits(state,trades){
 const stats=ensureRunStatistics(state);
 for(const trade of (state.history||trades))if(trade&&Number.isFinite(trade.pnl)&&!trade.runStatisticsRecorded){
  const closed=trade.positionClosed??!positions(state).some(p=>p.id===trade.positionId);
  addExit(stats,trade,closed);append(stats,{...safeTrade(trade,state),positionClosed:closed});trade.runStatisticsRecorded=true;
 }
}
const statsPathComplete=s=>s.realizedPathComplete!==false&&['realizedCumulative','realizedPeak','realizedTrough'].every(k=>Number.isFinite(s[k]));
export function orderPerformance(state={}){
 const s=readRunStatistics(state),known=s.complete;
 return {complete:known,realizedPathComplete:known&&statsPathComplete(s),realizedPeak:known&&statsPathComplete(s)?s.realizedPeak:null,realizedTrough:known&&statsPathComplete(s)?s.realizedTrough:null,closedOrders:known?s.closedOrders:null,winningOrders:known?s.winningOrders:null,losingOrders:known?s.losingOrders:null,breakevenOrders:known?s.breakevenOrders:null,winRate:known&&s.closedOrders?s.winningOrders/s.closedOrders:null,maxOrderProfit:known?s.maxOrderProfit:null,maxOrderLoss:known?s.maxOrderLoss:null,liquidatedOrders:known?s.liquidatedOrders:null,stopLossOrders:known?s.stopLossOrders:null,partialCloseExecutions:known?s.partialCloseExecutions:null,maxLeverage:known&&s.maxLeverageComplete===true?s.maxLeverage:null,maxWinningStreak:known?s.maxWinningStreak:null,maxLosingStreak:known?s.maxLosingStreak:null,profitGivebackOrders:known&&s.profitGivebackComplete===true?s.profitGivebackOrders:null,knownSample:{retainedOrderGroups:s.closedOrders,closedOrders:known?s.closedOrders:null,winningOrders:known?s.winningOrders:null,winRate:known&&s.closedOrders?s.winningOrders/s.closedOrders:null}};
}
