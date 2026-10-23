import {isLiveMarket} from './live-market-state.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {hasHistoricalSimulation} from './history-continuation.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {activeMarket} from './market-book.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {displayCandles,candlePeriodNotice} from './candle-period.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {readRunStatistics} from './run-statistics.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {consumptionStatement} from './consumption-ledger.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {movingAverageSeries} from './moving-average.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {dailyReturnMetrics} from './daily-performance.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {runPerformance} from './performance.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {accountingValues,dayOpeningPoint} from './accounting-journal.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {accountingDaySampled,accountingDayMissing,accountingDailyCoverage,accountingStart} from './accounting-retention.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {timedCandles,reportTradingTimestamp,currentTradingTimestamp,tradingTimestamp,tradingTimeNotice} from './trading-time.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
const finite=(v,f=0)=>Number.isFinite(v)?v:f;
const amount=n=>Math.round(n*100)/100;
const ratio=(n,d)=>Number.isFinite(n)&&Number.isFinite(d)&&d>0?n/d:null;
export function buildRecapSnapshot(state={},options={}){
 const current=accountingValues(state),p=runPerformance(state),candidate=options.report===null?null:options.report||state.dayReport;
 const report=['day_end','resting','ending'].includes(state.phase)&&candidate?.day===state.day?candidate:null;
 const recorded=report?.accounting?.version===1?report.accounting:null,currentValues=recorded&&Number.isFinite(recorded.netAssets)&&Number.isFinite(recorded.debt)?recorded:current;
 const dailyTrades=(report?.trades||state.history||[]).filter(t=>t.day===state.day&&t.type!=='open'&&Number.isFinite(t.pnl));
 const dayMetrics=dailyReturnMetrics(state,{report:report||null}),tradingNet=dayMetrics.tradingNet;
 const expensesToday=(state.expenseLedger||[]).filter(e=>e.day===state.day),living=finite(report?.livingCost,expensesToday.reduce((n,e)=>n+finite(e.living),0)),interest=finite(report?.interest,expensesToday.reduce((n,e)=>n+finite(e.interest),0)),costs=finite(report?.costs,finite(state.expenses)-finite(state.dayOpeningExpenses)),consumption=Math.max(0,costs-living-interest);
 const lotteryIncome=finite(report?.lotteryIncome,finite(state.lotteryIncome)-finite(state.dayOpeningLotteryIncome)),cheatLotteryIncome=finite(report?.cheatLotteryIncome,finite(state.cheatLotteryIncome)-finite(state.dayOpeningCheatLotteryIncome));
 const openingLottery=finite(state.dayOpeningLotteryIncome)+finite(state.dayOpeningCheatLotteryIncome);
 const mainRecoveryUsed=!!(state.lifeActions?.receipts?.some(row=>row.day===state.day&&['friend','relax','dinner'].includes(row.category))||state.recapChoiceLedger?.some(row=>row.day===state.day&&(row.id==='quiet-night'||row.group==='dinner')));
 const income=finite(report?.nonTradingIncome,finite(state.nonTradingIncome)-finite(state.dayOpeningIncome));
 const opening=finite(report?.opening,finite(state.dayOpening)),funding=finite(report?.funding,finite(state.externalFunding)-finite(state.dayOpeningFunding)),interestAccrued=finite(report?.interestAccrued,expensesToday.reduce((n,e)=>n+finite(e.interestAccrued),0));
 const points=(Array.isArray(recorded?.points)?recorded.points:state.accountingJournal?.points?.filter(x=>x.day===state.day)||[]).filter(x=>Number.isFinite(x.timestamp)&&Number.isFinite(x.nominalAssets));
 const today=points.map(x=>({...x}));
 const openingAt=tradingTimestamp(state,{day:state.day});
 if(Number.isFinite(openingAt)&&(!today.length||today[0].timestamp>openingAt))today.unshift(dayOpeningPoint(state,{day:state.day,opening,openedAt:openingAt}));
 const closing=finite(report?.closing,currentValues.nominalAssets),closeTime=report?reportTradingTimestamp(state,report):currentTradingTimestamp(state);
 if(!today.length||today.at(-1).nominalAssets!==closing||today.at(-1).timestamp!==closeTime)today.push({day:state.day,timestamp:closeTime,nominalAssets:closing,netAssets:currentValues.netAssets,kind:'closing'});
 const cumulative=(state.accountingJournal?.days||[]).filter(x=>Number.isFinite(x.timestamp)&&Number.isFinite(x.nominalAssets)).map(x=>({...x}));
 const journal=state.accountingJournal,missingDailyCount=accountingDailyCoverage(journal,state.day).missingDays;
 const retainedStart=accountingStart(journal);
 if(retainedStart&&Number.isFinite(retainedStart.timestamp)&&Number.isFinite(retainedStart.nominalAssets))cumulative.unshift({...retainedStart,kind:'start'});
 const hasEarlierGap=missingDailyCount>0||!retainedStart;
 if(!cumulative.length||cumulative.at(-1).timestamp!==closeTime||cumulative.at(-1).nominalAssets!==closing)cumulative.push({day:state.day,timestamp:closeTime,nominalAssets:closing,netAssets:currentValues.netAssets,kind:'current'});
 // Presentation curves remove every non-trading cash flow, while the journal
 // and account balances above retain the actual assets and liabilities.
 const tradingPoint=(point,{daily=false}={})=>{
  const raw=Number.isFinite(point.tradingAssets)?point.tradingAssets:Number.isFinite(point.netFunding)&&Number.isFinite(point.expenses)?point.nominalAssets-point.netFunding-finite(point.nonTradingIncome)-finite(point.lotteryIncome)-finite(point.cheatLotteryIncome)+point.expenses-finite(state.developer?.profitOffset):point.kind==='start'?point.nominalAssets:point.kind==='opening'?opening-finite(state.dayOpeningFunding)-finite(state.dayOpeningIncome)-openingLottery+finite(state.dayOpeningExpenses)-finite(state.developer?.profitOffset):null;
  if(raw===null)return null;
  return {...point,originalNominalAssets:point.nominalAssets,originalNetAssets:point.netAssets,nominalAssets:raw+(daily?finite(state.dayOpeningFunding)+finite(state.dayOpeningIncome)+openingLottery-finite(state.dayOpeningExpenses)+finite(state.developer?.profitOffset):0),netAssets:null};
 };
 const closingTrading={day:state.day,timestamp:closeTime,kind:'trading-close',...currentValues};
 today.push(closingTrading);cumulative.push(closingTrading);
 const tradingToday=today.map(point=>tradingPoint(point,{daily:true})).filter(Boolean),tradingCumulative=cumulative.map(point=>tradingPoint(point)).filter(Boolean);
 // Only persisted, already observed account points participate in the replay.
 // The adjusted asset path removes borrowing, repayments and spending, while
 // unrealized remains an independent observation rather than invented profit.
 const observations=points.filter(x=>x.timestamp<=closeTime&&Number.isFinite(x.unrealized)&&Number.isFinite(x.tradingAssets)).map(x=>({timestamp:x.timestamp,tradingAssets:x.tradingAssets+finite(state.dayOpeningFunding)+finite(state.dayOpeningIncome)+openingLottery-finite(state.dayOpeningExpenses)+finite(state.developer?.profitOffset),unrealized:x.unrealized}));
 const observedClosing=closingTrading.tradingAssets+finite(state.dayOpeningFunding)+finite(state.dayOpeningIncome)+openingLottery-finite(state.dayOpeningExpenses)+finite(state.developer?.profitOffset);
 if(Number.isFinite(observedClosing))observations.push({timestamp:closeTime,tradingAssets:observedClosing,unrealized:finite(currentValues.unrealized)});
 const todaySampled=!!recorded?.sampled||accountingDaySampled(journal,state.day);
 const todayMissing=!journal||!!journal.legacyPartial&&journal.startedDay===state.day||accountingDayMissing(journal,state.day)||(recorded?.partial&&!todaySampled);
 const todayPartial=!!recorded?.partial||!!todayMissing||todaySampled;
 // A missing daily row (including one that cannot be converted to trading assets)
 // stays a visible break, rather than a line across unobserved dates.
 for(let i=1;i<tradingCumulative.length;i++)if(tradingCumulative[i].day>tradingCumulative[i-1].day+1||tradingCumulative[i-1].kind==='start'&&tradingCumulative[i].day>1)tradingCumulative[i].gapBefore=true;
 const missingTradingDays=accountingDailyCoverage({days:tradingCumulative.filter(p=>!['start','current','trading-close'].includes(p.kind))},state.day).missingDays;
 const cumulativeDenominator=finite(state.startEquity,p.startEquity),totalProfit=finite(report?.performance?.totalProfit,p.totalProfit),totalReturn=ratio(totalProfit,cumulativeDenominator),dayReturn=dayMetrics.returnRate;
 const primary=state.mode==='endless'?{scope:'cumulative',label:'累计已实现交易收益',profit:totalProfit,returnRate:totalReturn}:{scope:'today',label:dayMetrics.tradingNetPartial?'今日交易盈亏 · 留存样本':report?'今日交易净盈亏':'今日已实现交易盈亏',profit:tradingNet,returnRate:dayReturn};
 const allCandles=displayCandles(state),dayCandleStart=allCandles.findIndex(c=>c.day===state.day),dayCandleEnd=allCandles.findLastIndex(c=>c.day===state.day)+1,candleMovingAverages=dayCandleStart<0?[]:movingAverageSeries(allCandles,{start:dayCandleStart,end:dayCandleEnd});
 const snapshot={version:1,id:`${state.runId||state.seed||0}:${state.day}:${closeTime}:${tradingNet}:${costs}${state.lifeActions?`:${income}`:''}`,day:state.day||1,mode:state.mode||'story',sealed:!!report,timestamp:closeTime,
  primary,daily:{...(mainRecoveryUsed?{mainRecoveryUsed:true}:{}),tradingNet,tradingNetPartial:dayMetrics.tradingNetPartial,returnRate:dayReturn,returnDenominator:dayMetrics.denominator,returnDenominatorSource:dayMetrics.source,returnBasis:'今日收益率 = 今日已实现净盈亏 ÷ 开盘净资产',openingNominal:opening,closingNominal:closing,nominalChange:amount(closing-opening),costs:{total:costs,living,interest,consumption},netResult:amount(tradingNet+income+lotteryIncome+cheatLotteryIncome-costs),...(state.lottery?{lotteryIncome,cheatLotteryIncome}:{}),...(state.lifeActions?{nonTradingIncome:income}:{}),fundingIncludingAccruedInterest:funding,fundingPrincipal:amount(funding-interestAccrued),interestAccrued,returnUnavailable:dayMetrics.returnUnavailable,noodlesUsed:!!state.itemsUsed?.noodles,livingStatus:report?.livingSettlement?.status||(report?'legacy-paid':'not-due'),pendingLivingCost:finite(report?.pendingLivingCost)},
  cumulative:{realizedProfit:totalProfit,returnRate:totalReturn,returnDenominator:cumulativeDenominator,returnBasis:'累计收益率 = 累计已实现净盈亏 ÷ 初始本金'},
  account:{nominalAssets:closing,netAssets:currentValues.netAssets,debt:currentValues.debt,unrealized:currentValues.unrealized},
  consumption:consumptionStatement(state,report),
  curves:{basis:'trading',today:tradingToday,cumulative:tradingCumulative,todayPartial,todaySampled,todayMissing:!!todayMissing,cumulativePartial:!!journal?.legacyPartial||!journal||hasEarlierGap||missingTradingDays>0,missingDailyCount,missingTradingDays,unit:'日元 / ¥',timeUnit:isLiveMarket(state)?'报价时间 · JST':hasHistoricalSimulation(state)?'混合行情时间 · JST':[1,2,3].includes(state.historical?.version)?'历史行情时间 · JST':'游戏交易时间 · JST'},
  replay:{observations,partial:points.some(x=>!Number.isFinite(x.unrealized)||!Number.isFinite(x.tradingAssets))||todayPartial,sampled:todaySampled,missing:!!todayMissing},
  trades:readRunStatistics(state).trades.filter(t=>t.day===state.day).map(t=>({...t})),
  chartSymbol:activeMarket(state),candles:allCandles.filter(c=>c.day===state.day),candleMovingAverages,timeNotice:candlePeriodNotice(state),
  note:dayMetrics.returnUnavailable||null};
 return JSON.parse(JSON.stringify(snapshot));
}
export function recapSegments(snapshot){
 const d=snapshot.daily,opening=d.openingNominal,closing=amount(opening+d.tradingNet);
 return [{id:'opening',label:'开盘交易资产',delta:0,from:opening,to:opening},
 {id:'trading',label:'已实现交易净盈亏',delta:d.tradingNet,from:opening,to:closing},
 {id:'closing',label:'交易收盘资产',delta:0,from:closing,to:closing}];
}
export function recapIntensity(snapshot){
 const magnitude=Math.abs(snapshot.primary.profit),relative=Math.abs(snapshot.primary.returnRate||0);
 return Math.min(1,Math.max(Math.log10(1+magnitude)/7,Math.min(1,relative/2)));
}
export {recapChoices} from './recap-choices.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
