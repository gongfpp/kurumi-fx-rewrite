import {marketPrice,positionMarket} from './market-book.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {grossPnlAt} from './market.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {compactAccountingJournal,accountingDaySampled,accountingDayMissing,reconcileAccountingObservations} from './accounting-retention.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {currentTradingTimestamp,reportTradingTimestamp,ensureTradingClock,tradingTimestamp} from './trading-time.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
const finite=(v,f=0)=>Number.isFinite(v)?v:f;
export function accountingValues(state){
 const positions=state.positions?.length?state.positions:state.position?[state.position]:[];
 const floating=positions.reduce((sum,p)=>sum+finite(grossPnlAt(p,marketPrice(state,positionMarket(p)))),0),margin=positions.reduce((sum,p)=>sum+finite(p.margin),0);
 const nominalAssets=Math.max(0,finite(state.cash)+margin+floating)+finite(state.reserve);
 const debt=finite(state.family?.outstanding)+finite(state.loan?.outstanding);
 const realized=finite(state.performance?.totalProfit,(state.history||[]).filter(t=>t.type!=='open').reduce((sum,t)=>sum+finite(t.pnl),0));
 const expenses=finite(state.expenses),netFunding=finite(state.externalFunding),nonTradingIncome=finite(state.nonTradingIncome),lotteryIncome=finite(state.lotteryIncome),cheatLotteryIncome=finite(state.cheatLotteryIncome),tradingAssets=nominalAssets-netFunding-nonTradingIncome-lotteryIncome-cheatLotteryIncome+expenses-finite(state.developer?.profitOffset);
 return{...(state.lottery?{lotteryIncome,cheatLotteryIncome}:{}),nominalAssets,netAssets:nominalAssets-debt,debt,realizedProfit:realized,unrealized:floating,expenses,netFunding,...(state.lifeActions?{nonTradingIncome}:{}),tradingAssets};
}
export function ensureAccountingJournal(state){
 ensureTradingClock(state);
 if(!state.accountingJournal||state.accountingJournal.version!==1)state.accountingJournal={version:1,points:[],days:[],observationSequence:0,executionAnchorsComplete:true,executionCursor:Math.max(0,state.runStatistics?.executions||0),startedDay:state.day||1,legacyPartial:(state.day||1)>1||!!state.history?.length||!!state.candles?.some(c=>!c.historical)};
 const j=state.accountingJournal;j.points=Array.isArray(j.points)?j.points.filter(p=>p&&Number.isFinite(p.timestamp)&&Number.isFinite(p.nominalAssets)):[];j.days=Array.isArray(j.days)?j.days.filter(p=>p&&Number.isFinite(p.timestamp)&&Number.isFinite(p.nominalAssets)):[];
 // Old ledgers had no execution cursor. Do not mislabel past trades as new observations.
 if(!Number.isSafeInteger(j.executionCursor)){j.executionCursor=Math.max(0,state.runStatistics?.executions||0);j.executionAnchorsComplete=false;}
 reconcileAccountingObservations(j,Math.max(0,state.runStatistics?.executions||0));
 compactAccountingJournal(j,state.day);return j;
}
// Observation only. This must never execute an order, consume an item or charge a fee.
export function recordAccountingPoint(state,kind='update'){
 const j=ensureAccountingJournal(state),v=accountingValues(state),timestamp=currentTradingTimestamp(state),last=j.points.at(-1);
 if(j.dayOpening?.day!==state.day){const retainedToday=(state.history||[]).filter(t=>t.day===state.day&&t.type!=='open').reduce((n,t)=>n+finite(t.pnl),0);j.dayOpening={day:state.day,realizedProfit:v.realizedProfit-retainedToday,partial:j.legacyPartial&&j.startedDay===state.day};}
 if(!Number.isFinite(timestamp))return null;
 const cursor=Math.max(0,state.runStatistics?.executions||0),newExecutions=cursor>j.executionCursor;
 if(last&&last.day===state.day&&Object.keys(v).every(key=>last[key]===v[key])&&!newExecutions&&(!['settled','closing'].includes(kind)||last.timestamp===timestamp))return last;
 const point={day:state.day||1,timestamp,kind,observation:++j.observationSequence,...v};
 if(newExecutions){point.executions={from:j.executionCursor+1,to:cursor,types:[...new Set((state.runStatistics?.trades||[]).filter(t=>t.sequence>j.executionCursor&&t.sequence<=cursor).map(t=>t.type))]};}j.executionCursor=cursor;if(!j.start&&kind==='opening'&&state.day===1&&!j.legacyPartial&&!j.points.length)j.start={...point,kind:'start'};j.points.push(point);compactAccountingJournal(j,state.day);return point;
}
export function recordAccountingDay(state){
 recordAccountingPoint(state,'closing');
 const j=ensureAccountingJournal(state),previous=j.days.find(d=>d.day===state.day),row={...previous,day:state.day,timestamp:currentTradingTimestamp(state),...accountingValues(state)};
 const index=j.days.findIndex(d=>d.day===state.day);if(index>=0)j.days[index]=row;else j.days.push(row);return row;
}
export function sealAccountingDay(state){
 const report=state.dayReport;if(!report||report.day!==state.day)return null;
 const j=ensureAccountingJournal(state);report.closedAt=reportTradingTimestamp(state,report);
 recordAccountingPoint(state,'settled');
 report.accounting={version:1,...accountingValues(state),points:j.points.filter(p=>p.day===report.day).map(p=>({...p})),partial:!!(j.legacyPartial&&j.startedDay===report.day||accountingDayMissing(j,report.day)||accountingDaySampled(j,report.day)),sampled:accountingDaySampled(j,report.day)};
 const row={day:report.day,timestamp:report.closedAt,opening:report.opening,tradingNet:report.net,costs:report.costs,funding:report.funding,...accountingValues(state)};
 const index=j.days.findIndex(d=>d.day===report.day);if(index>=0)j.days[index]=row;else j.days.push(row);return report.accounting;
}
export function dayOpeningPoint(state,report){return{day:report.day,timestamp:Number.isFinite(report.openedAt)?report.openedAt:tradingTimestamp(state,{day:report.day}),nominalAssets:report.opening,netAssets:null,kind:'opening'};}
