import {movingAverageSeries} from './moving-average.js?v=539d26616071e7036617b0b49726bd24af40ef2e-capture-v1-1fbef814f493';
import {dailyReturnMetrics} from './daily-performance.js?v=539d26616071e7036617b0b49726bd24af40ef2e-capture-v1-1fbef814f493';
import {runPerformance} from './performance.js?v=539d26616071e7036617b0b49726bd24af40ef2e-capture-v1-1fbef814f493';
import {accountingValues,dayOpeningPoint} from './accounting-journal.js?v=539d26616071e7036617b0b49726bd24af40ef2e-capture-v1-1fbef814f493';
import {timedCandles,reportTradingTimestamp,currentTradingTimestamp,tradingTimestamp,TRADING_TIME_NOTICE} from './trading-time.js?v=539d26616071e7036617b0b49726bd24af40ef2e-capture-v1-1fbef814f493';
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
 const opening=finite(report?.opening,finite(state.dayOpening)),funding=finite(report?.funding,finite(state.externalFunding)-finite(state.dayOpeningFunding)),interestAccrued=finite(report?.interestAccrued,expensesToday.reduce((n,e)=>n+finite(e.interestAccrued),0));
 const points=(Array.isArray(recorded?.points)?recorded.points:state.accountingJournal?.points?.filter(x=>x.day===state.day)||[]).filter(x=>Number.isFinite(x.timestamp)&&Number.isFinite(x.nominalAssets));
 const today=points.map(x=>({...x}));
 if(!today.length||today[0].timestamp>tradingTimestamp(state,{day:state.day}))today.unshift(dayOpeningPoint(state,{day:state.day,opening}));
 const closing=finite(report?.closing,currentValues.nominalAssets),closeTime=report?reportTradingTimestamp(state,report):currentTradingTimestamp(state);
 if(!today.length||today.at(-1).nominalAssets!==closing||today.at(-1).timestamp!==closeTime)today.push({day:state.day,timestamp:closeTime,nominalAssets:closing,netAssets:currentValues.netAssets,kind:'closing'});
 const cumulative=(state.accountingJournal?.days||[]).filter(x=>Number.isFinite(x.timestamp)&&Number.isFinite(x.nominalAssets)).map(x=>({...x}));
 const hasEarlierGap=!!cumulative.length&&cumulative[0].day>1;
 cumulative.unshift({day:1,timestamp:tradingTimestamp(state,{day:1}),nominalAssets:p.startEquity,netAssets:p.startEquity,kind:'start'});
 if(cumulative.at(-1).timestamp!==closeTime||cumulative.at(-1).nominalAssets!==closing)cumulative.push({day:state.day,timestamp:closeTime,nominalAssets:closing,netAssets:currentValues.netAssets,kind:'current'});
 const cumulativeDenominator=finite(state.startEquity,p.startEquity),totalProfit=finite(report?.performance?.totalProfit,p.totalProfit),totalReturn=ratio(totalProfit,cumulativeDenominator),dayReturn=dayMetrics.returnRate;
 const primary=state.mode==='endless'?{scope:'cumulative',label:'累计已实现交易收益',profit:totalProfit,returnRate:totalReturn}:{scope:'today',label:dayMetrics.tradingNetPartial?'今日交易盈亏 · 留存样本':report?'今日交易净盈亏':'今日已实现交易盈亏',profit:tradingNet,returnRate:dayReturn};
 const allCandles=timedCandles(state),dayCandleStart=allCandles.findIndex(c=>c.day===state.day),dayCandleEnd=allCandles.findLastIndex(c=>c.day===state.day)+1,candleMovingAverages=dayCandleStart<0?[]:movingAverageSeries(state.candles,{start:dayCandleStart,end:dayCandleEnd});
 const snapshot={version:1,id:`${state.runId||state.seed||0}:${state.day}:${closeTime}:${tradingNet}:${costs}`,day:state.day||1,mode:state.mode||'story',sealed:!!report,timestamp:closeTime,
  primary,daily:{tradingNet,tradingNetPartial:dayMetrics.tradingNetPartial,returnRate:dayReturn,returnDenominator:dayMetrics.denominator,returnDenominatorSource:dayMetrics.source,returnBasis:'今日已实现净交易盈亏 ÷ 开盘扣债净资产；借入本金不计分子，日内借还不改变开盘分母',openingNominal:opening,closingNominal:closing,nominalChange:amount(closing-opening),costs:{total:costs,living,interest,consumption},netResult:amount(tradingNet-costs),fundingIncludingAccruedInterest:funding,fundingPrincipal:amount(funding-interestAccrued),interestAccrued,returnUnavailable:dayMetrics.returnUnavailable,livingStatus:report?.livingSettlement?.status||(report?'legacy-paid':'not-due'),pendingLivingCost:finite(report?.pendingLivingCost)},
  cumulative:{realizedProfit:totalProfit,returnRate:totalReturn,returnDenominator:cumulativeDenominator,returnBasis:'累计已实现净交易盈亏 ÷ 初始游戏本金；借款、消费与浮盈不计入收益率'},
  account:{nominalAssets:closing,netAssets:currentValues.netAssets,debt:currentValues.debt,unrealized:currentValues.unrealized},
  curves:{today,cumulative,todayPartial:recorded?!!recorded.partial:!state.accountingJournal||!!state.accountingJournal.legacyPartial&&state.accountingJournal.startedDay===state.day||state.accountingJournal?.truncatedDays?.includes(state.day),cumulativePartial:!!state.accountingJournal?.legacyPartial||!state.accountingJournal||hasEarlierGap,unit:'日元 / ¥',timeUnit:'游戏交易时间 · JST'},
  candles:allCandles.filter(c=>c.day===state.day),candleMovingAverages,timeNotice:TRADING_TIME_NOTICE,
  note:tradingNet>0&&tradingNet-costs<0?'交易赚了，费用后结余仍减少。':null};
 return JSON.parse(JSON.stringify(snapshot));
}
export function recapSegments(snapshot){
 const d=snapshot.daily;let value=d.openingNominal;const rows=[{id:'opening',label:'开盘名义资产',delta:0,from:value,to:value}];
 for(const [id,label,delta] of [['trading','已实现交易净盈亏',d.tradingNet],['funding','借还本金净变动',d.fundingPrincipal],['living','生活费',-d.costs.living],['interest','已付利息',-(d.costs.interest-d.interestAccrued)],['consumption','可选消费',-d.costs.consumption]]){
  if(delta){rows.push({id,label,delta,from:value,to:amount(value+delta)});value=amount(value+delta);}
 }
 rows.push({id:'closing',label:snapshot.daily.livingStatus==='pending'?'交易收盘资产 · 生活费待结':'收盘名义资产',delta:0,from:value,to:d.closingNominal});return rows;
}
export function recapIntensity(snapshot){
 const magnitude=Math.abs(snapshot.primary.profit),relative=Math.abs(snapshot.primary.returnRate||0);
 return Math.min(1,Math.max(Math.log10(1+magnitude)/7,Math.min(1,relative/2)));
}
export {recapChoices} from './recap-choices.js?v=539d26616071e7036617b0b49726bd24af40ef2e-capture-v1-1fbef814f493';
