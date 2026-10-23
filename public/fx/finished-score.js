import {lotteryScoreFields} from './lottery-ranking.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {isSharedReplay} from './shared-replay-state.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {hasDevelopmentTaint} from './development-taint.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {hasHistoricalSimulation} from './history-continuation.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {terminalRankingEligibility} from './auto-leaderboard.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {dailyVolatilityMetrics} from './daily-volatility.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
const counts=['closedOrders','winningOrders','losingOrders','breakevenOrders','liquidatedOrders','stopLossOrders','partialCloseExecutions','maxWinningStreak','maxLosingStreak','profitGivebackOrders'];
const knownRequired=['closedOrders','winningOrders','losingOrders','breakevenOrders','maxOrderLoss','maxOrderProfit'];
function finite(value,label,min=-1e10,max=1e10){if(!Number.isFinite(value)||value<min||value>max)throw Error('终局成绩字段无效：'+label);return value;}
function integer(value,label,min=0,max=10000000){finite(value,label,min,max);if(!Number.isSafeInteger(value))throw Error('终局成绩字段必须为整数：'+label);return value;}
const nullable=(value,check)=>value===null||value===undefined?null:check(value);
const cents=n=>Math.round((n+Number.EPSILON)*100)/100;
// Fixed score projection, never the full JSON export, names, transactions,
// accounting journal, open-position details, seed, or browser storage.
function projectLeaderboardScore(state,report,{storage,live=false,includeVolatility=false}={}){
 if(isSharedReplay(state))throw Object.assign(Error('Shared replay is excluded from ranking'),{code:'shared-replay'});
 if(hasHistoricalSimulation(state))throw Object.assign(Error('含模拟补接的历史局不提交真实成绩'),{code:'mixed-historical'});
 const eligible=live?{eligible:![2,3].includes(state?.historical?.version)&&state?.phase!=='ending'&&report?.gameFinished===false&&!hasDevelopmentTaint(state,storage)&&report?.eligibility?.developmentTaint===false,reason:'ineligible'}:terminalRankingEligibility(state,report,storage);
 if(!eligible.eligible)throw Object.assign(Error(eligible.reason==='developer'?'开发测试局不能自动上榜':'本局尚不可自动上榜'),{code:eligible.reason});
 if(report.schemaVersion!=='1.0.0'||!['story','endless'].includes(report.mode)||report.mode!==state.mode)throw Error('终局成绩版本或模式不正确');
 if(!live&&((state.positions?.length||state.position)||report.account?.openPositions?.length))throw Error('尚有未平仓订单，不能提交终局成绩');
 const p=report.performance,a=report.account;
 if(!p||!a||typeof p.complete!=='boolean')throw Error('终局统计完整性未知');
 const day=integer(report.day,'day',1,10000);if(day!==state.day)throw Error('终局成绩不是当前日期');
 const initialEquity=finite(p.initialCapital,'initialCapital',100000,300000),rawTotalProfit=finite(p.realizedNetTradingPnl,'realizedNetTradingPnl'),totalProfit=cents(rawTotalProfit);
 if(![100000,300000].includes(initialEquity)||initialEquity!==(state.startEquity??100000))throw Error('初始本金与本局不一致');
 const daysSurvived=integer(p.daysSurvived,'daysSurvived',0,day),elapsedDays=Math.max(1,finite(p.elapsedSimulatedDays,'elapsedSimulatedDays',0,day));
 if(daysSurvived>elapsedDays)throw Error('存活天数大于模拟时间');
 const rawReturnRate=rawTotalProfit/initialEquity,rawDailyReturnRate=rawReturnRate/elapsedDays;
 const returnRate=totalProfit/initialEquity,dailyReturnRate=returnRate/elapsedDays;
 if(Math.abs(finite(p.returnRate,'returnRate')-rawReturnRate)>1e-8||Math.abs(finite(p.dailyReturnRate,'dailyReturnRate')-rawDailyReturnRate)>1e-8)throw Error('终局收益率与净交易账本不一致');
 const score={...lotteryScoreFields(state),schemaVersion:live?'1.1.0':'1.0.0',gameFinished:!live,completionReason:live?null:report.completionReason,developmentTaint:false,statisticsComplete:p.complete,gameMode:report.mode,day,initialEquity,daysSurvived,elapsedDays,returnRate,dailyReturnRate,totalProfit,closedTrades:integer(p.closeExecutions,'closeExecutions'),maxDrawdown:nullable(p.maxDrawdown,v=>finite(v,'maxDrawdown',0,1))};
 for(const key of counts)score[key]=nullable(p[key],v=>integer(v,key));
 score.winRate=nullable(p.winRate,v=>finite(v,'winRate',0,1));
 score.maxOrderLoss=nullable(p.maxOrderLoss,v=>cents(finite(v,'maxOrderLoss',-1e10,0)));
 score.maxOrderProfit=nullable(p.maxOrderProfit,v=>cents(finite(v,'maxOrderProfit',0,1e10)));
 score.maxLeverage=nullable(p.maxLeverage,v=>finite(v,'maxLeverage',0,100));
 for(const key of ['maxPositionMargin','maxOrderMargin'])score[key]=nullable(p[key],v=>cents(finite(v,key,0,1e10)));
 score.playSeconds=nullable(p.playSeconds,v=>integer(v,'playSeconds',0,1e10));
 for(const key of ['fatherDebt','networkDebt','totalDebt'])score[key]=nullable(a[key],v=>cents(finite(v,key,0,1e10)));
 score.netAssets=nullable(a.netAssets,v=>cents(finite(v,'netAssets')));
 if(p.complete&&knownRequired.some(k=>score[k]===null))throw Error('完整统计缺少订单指标');
 if(score.closedOrders!==null&&[score.winningOrders,score.losingOrders,score.breakevenOrders].every(v=>v!==null)&&score.closedOrders!==score.winningOrders+score.losingOrders+score.breakevenOrders)throw Error('完整订单胜负数量不一致');
 if(score.closedOrders===0&&score.winRate!==null)throw Error('没有完整订单时胜率必须未知');
 if(score.closedOrders>0&&score.winningOrders!==null&&(score.winRate===null||Math.abs(score.winRate-score.winningOrders/score.closedOrders)>1e-8))throw Error('胜率与完整订单数不一致');
 if([score.fatherDebt,score.networkDebt,score.totalDebt].every(v=>v!==null)&&Math.abs(score.fatherDebt+score.networkDebt-score.totalDebt)>.01)throw Error('总欠款与两项债务不一致');
 return includeVolatility?{...score,...dailyVolatilityMetrics(state)}:score;
}

export const finishedLeaderboardScore=(state,report,options)=>projectLeaderboardScore(state,report,options);
export function liveOpenPositionCount(state){
 const positions=state?.positions?.length?state.positions:state?.position?[state.position]:[];
 return positions.filter(p=>typeof p.id==='string'&&Number.isFinite(p.entry)&&p.entry>0&&Number.isFinite(p.leverage)&&p.leverage>0&&p.leverage<=100&&Number.isFinite(p.margin)&&p.margin>0).length;
}
export function hasLiveTradingActivity(state){return liveOpenPositionCount(state)>0||Number.isSafeInteger(state?.performance?.closedTrades)&&state.performance.closedTrades>0||(state?.history||[]).some(t=>['close','half','rescue','stop','liquidation','closing'].includes(t.type)&&Number.isFinite(t.pnl));}
export function liveLeaderboardScore(state,report,options){
 const score=projectLeaderboardScore(state,report,{...options,live:true});
 score.openPositionCount=liveOpenPositionCount(state);
 if(score.closedTrades<1&&score.openPositionCount<1)throw Object.assign(Error('实际成交后开始更新进度成绩'),{code:'no-trades'});
 return score;
}
