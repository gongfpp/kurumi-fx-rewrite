import {hasLotteryCheat} from './lottery-ranking.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {lifeActionDefinition} from './life-actions.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {isLiveMarket,safeLiveTradeEvidence} from './live-market-state.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {historicalReportSource,safeHistoricalTradeEvidence,historicalTimeDefinition} from './historical-evidence.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {hasHistoricalSimulation,safeHistoricalSegmentEvidence} from './history-continuation.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {readHallMetrics} from './hall-metrics.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {MARKETS,marketPrice,positionMarket} from './market-book.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {classifyEnding} from './ending-classifier.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {runPerformance} from './performance.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {orderPerformance,readRunStatistics} from './run-statistics.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {accountingValues} from './accounting-journal.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {ACCOUNTING_POINT_LIMIT,retainAccountingPoints,accountingDayMissing,accountingDailyCoverage,accountingStart} from './accounting-retention.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {currentTradingTimestamp,GAME_TIME_ZONE} from './trading-time.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {grossPnlAt} from './market.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';

export const RESULTS_SCHEMA_VERSION='1.0.0';
const number=v=>Number.isFinite(v)?v:null;
const zero=v=>Number.isFinite(v)?v:0;
const money=v=>Number.isFinite(v)?Math.round(v*100)/100:null;
const endings=['million','walkaway','broke','crisis'];
const eventTypes=['open','half','close','rescue','stop','liquidation','closing'];
const positionId=v=>typeof v==='string'&&/^order-\d{1,15}$/.test(v)?v:null;
function pickNumbers(row,keys){return Object.fromEntries(keys.map(key=>[key,number(row?.[key])]));}
function exportTrade(t={},historical=false){t=t||{};const liveQuote=safeLiveTradeEvidence(t.liveQuote),marketSegment=safeHistoricalSegmentEvidence(t.marketSegment),historicalQuote=marketSegment?.source==='simulated'?null:safeHistoricalTradeEvidence(t);return {...(liveQuote?{liveQuote}:{}),...(historicalQuote?{historicalQuote}:{}),...(marketSegment?{marketSegment}:{}),symbol:MARKETS.some(m=>m.symbol===positionMarket(t))?positionMarket(t):null,...pickNumbers(t,['sequence','day','beat','timestamp','direction','margin','leverage','entry','exit','quantity','grossPnl','openFee','closeFee','fee','pnl','maxUnrealized','lossReduction','balanceProtection']),positionId:positionId(t.positionId),type:eventTypes.includes(t.type)?t.type:'unknown',positionClosed:t.positionClosed===true,...(liveQuote?.replay?{sourceMode:'shared-replay'}:{}),timePrecision:liveQuote?liveQuote.replay?'shared-replay-quote':'provider-quote':marketSegment?.source==='simulated'?'simulated-continuation':historicalQuote||historical&&Number.isFinite(t.timestamp)?'historical-quote':t.timePrecision==='game-clock'?'game-clock':'day-and-beat-only'};}
function exportPoint(p={}){p=p||{};return {...pickNumbers(p,['day','observation','timestamp','nominalAssets','netAssets','debt','realizedProfit','unrealized','expenses','netFunding','nonTradingIncome','tradingAssets']),...(Object.hasOwn(p,'lotteryIncome')?{lotteryIncome:number(p.lotteryIncome)}:{}),...(Object.hasOwn(p,'cheatLotteryIncome')?{cheatLotteryIncome:number(p.cheatLotteryIncome)}:{}),...(p.executions?{executions:{...pickNumbers(p.executions,['from','to']),types:(p.executions.types||[]).filter(type=>eventTypes.includes(type))}}:{}),kind:['opening','update','settled','closing','current','start'].includes(p.kind)?p.kind:'observation'};}
export function buildResultsReport(state={},options={}){
 const p=runPerformance(state),orders=orderPerformance(state),stats=readRunStatistics(state),values=accountingValues(state),recap=state.ending?.immediate?null:options.recap;
 const currentPositions=state.positions?.length?state.positions:state.position?[state.position]:[];
 const fatherDebt=number(state.family?.outstanding),networkDebt=number(state.loan?.outstanding);
 const totalDebt=fatherDebt===null||networkDebt===null?null:fatherDebt+networkDebt;
 const nominalAssets=number(recap?.account?.nominalAssets??values.nominalAssets),netAssets=nominalAssets===null||totalDebt===null?null:nominalAssets-totalDebt;
 const unrealized=currentPositions.reduce((n,pos)=>n+zero(grossPnlAt(pos,marketPrice(state,positionMarket(pos)))),0),unallocatedOpenFees=currentPositions.reduce((n,pos)=>n+zero(pos.openFeeRemaining),0);
 const interestPaid=number(state.loan?.interestPaid),interestAccrued=number(state.loan?.interestAccrued??(stats.complete?0:null));
 const interestTotal=interestPaid===null||interestAccrued===null?null:interestPaid+interestAccrued;
 const living=number(state.livingPaid??(state.mode==='endless'||(state.day===1&&!state.dayReport)?0:null)),expenses=number(state.expenses);
 const consumption=expenses===null||living===null||interestTotal===null?null:Math.max(0,expenses-living-interestTotal);
 const gameFinished=state.phase==='ending'&&endings.includes(state.ending?.id),developmentTaint=!!(state.developmentTaint||state.developer?.edited);
 const performance={...readHallMetrics(state),initialCapital:p.initialEquity,realizedNetTradingPnl:p.totalProfit,returnRate:p.returnRate,dailyReturnRate:p.dailyReturnRate,elapsedSimulatedDays:p.elapsedSimulatedDays,daysSurvived:p.daysSurvived,completedCandles:p.completedCandles,closeExecutions:p.closedTrades,...orders,maxDrawdown:stats.drawdownRecorded===true&&state.performance&&Number.isFinite(state.performance.maxDrawdown)?state.performance.maxDrawdown:null};
 const workIncome=number(state.nonTradingIncome??0),lotteryIncome=number(state.lotteryIncome??0),cheatLotteryIncome=number(state.cheatLotteryIncome??0),lotteryCheat=hasLotteryCheat(state),netFunding=number(state.externalFunding),adjustment=number(state.developer?.profitOffset??0);
 const incomeTotal=[workIncome,lotteryIncome,cheatLotteryIncome].every(Number.isFinite)?workIncome+lotteryIncome+cheatLotteryIncome:null;
 const expectedNominalAssets=[incomeTotal,netFunding,expenses,adjustment].every(Number.isFinite)?p.initialEquity+p.totalProfit+unrealized-unallocatedOpenFees+netFunding+incomeTotal-expenses+adjustment:null;
 const residual=expectedNominalAssets===null?null:nominalAssets-expectedNominalAssets;
 const specialRecords=[];
 for(const [id,label,value] of [['liquidated-orders','被强平订单',orders.liquidatedOrders],['stop-orders','触发止损订单',orders.stopLossOrders],['partial-closes','减半平仓操作',orders.partialCloseExecutions],['winning-streak','最长连胜订单',orders.maxWinningStreak],['losing-streak','最长连亏订单',orders.maxLosingStreak],['profit-giveback','曾有浮盈、最终整单亏损',orders.profitGivebackOrders]])if(value>0)specialRecords.push({id,label,value});
 if(orders.maxLeverage>0)specialRecords.push({id:'max-leverage',label:'最高使用杠杆',value:orders.maxLeverage});
 if(netAssets<0)specialRecords.push({id:'negative-net-assets',label:gameFinished?'负净资产离场':'当前净资产为负',value:money(netAssets)});
 if(p.returnRate<-1)specialRecords.push({id:'loss-over-initial',label:'已实现亏损超过初始本金',value:money(-p.totalProfit-p.initialEquity)});
 const historical=historicalReportSource(state),journal=state.accountingJournal,transactions=stats.trades.map(t=>exportTrade(t,!!historical)),daily=(journal?.days||[]).map(row=>({...exportPoint(row),...pickNumbers(row,['opening','tradingNet','costs','funding'])}));
 // Start/daily/end summaries and quote-by-quote observations have separate coverage.
 // A current snapshot is known even when an older run has lost its earlier path.
 const retainedStart=accountingStart(journal);
 const start=retainedStart&&Number.isFinite(retainedStart.timestamp)&&Number.isFinite(retainedStart.nominalAssets)?exportPoint({...retainedStart,kind:'start'}):null;
 const end=exportPoint({day:state.day,timestamp:currentTradingTimestamp(state),kind:gameFinished?'closing':'current',...values});
 const retainedPoints=retainAccountingPoints(journal?.points||[],{day:state.day}),sampled=!!journal?.sampling?.omittedPoints||!!retainedPoints.removed.length;
 const samplingExact=journal?.sampling?.countsExact!==false&&!journal?.sampling?.legacyWrites&&!journal?.observationSequenceRebased&&!journal?.sampling?.missingDays?.length&&(!journal?.sampling||Number.isSafeInteger(journal.sampling.omittedTradePoints));
 const missingDailyCount=accountingDailyCoverage(journal,state.day).missingDays,dailyPartial=!journal||!!journal.legacyPartial||!start||missingDailyCount>0;
 const intradayMissing=[...(journal?.truncatedDays||[]),...(journal?.sampling?.missingDays||[])].some(day=>accountingDayMissing(journal,day));
 const intradayPartial=!journal||!!journal.legacyPartial||!start||intradayMissing||sampled;
 const events=[];
 if(gameFinished)events.push({type:'ending',reason:state.ending.id,day:state.day,timestamp:currentTradingTimestamp(state)});
 for(const trade of transactions)if(['liquidation','stop'].includes(trade.type))events.push({type:trade.type,positionId:trade.positionId,day:trade.day,timestamp:trade.timestamp,pnl:trade.pnl});
 const report={...(historical||{}),...(isLiveMarket(state)?{marketSource:state.liveMarket.version===2?'shared-replay':'live',...(state.liveMarket.version===2?{sourceMode:'shared-replay'}:{}),marketData:{provider:'biquote',priceBasis:'provider-indicative-mid',execution:'game-fees-applied-to-provider-mid',timeBasis:'provider-quote-UTC',dayProgress:'observed-ready-minute-boundaries'}}:{}),schemaVersion:RESULTS_SCHEMA_VERSION,version:1,game:'kurumi-fx',mode:state.mode==='endless'?'endless':'story',day:Number.isSafeInteger(state.day)?state.day:null,seed:Number.isSafeInteger(state.seed)?state.seed:null,currency:'JPY',gameTimeZone:GAME_TIME_ZONE,gameTimestamp:currentTradingTimestamp(state),gameFinished,completionReason:gameFinished?state.ending.id:null,
  ending:classifyEnding(state),
  eligibility:{gameFinished,developmentTaint,...(state.lottery?{lotteryCheat}:{}),rankingEligible:gameFinished&&!developmentTaint&&!lotteryCheat&&!hasHistoricalSimulation(state)&&state.liveMarket?.version!==2},performance,
  daily:recap?{day:recap.day,tradingNetPartial:!!recap.daily?.tradingNetPartial,livingStatus:recap.daily?.livingStatus||null,tradingNet:money(recap.daily?.tradingNet),returnRate:number(recap.daily?.returnRate),returnDenominator:money(recap.daily?.returnDenominator),netResult:money(recap.daily?.netResult),nonTradingIncome:money(recap.daily?.nonTradingIncome??0),...(state.lottery?{lotteryIncome:money(recap.daily?.lotteryIncome??0),cheatLotteryIncome:money(recap.daily?.cheatLotteryIncome??0)}:{}),sealed:!!recap.sealed}:null,
  account:{nominalAssets:money(nominalAssets),netAssets:money(netAssets),fatherDebt:money(fatherDebt),networkDebt:money(networkDebt),totalDebt:money(totalDebt),cash:money(state.cash),reservedLivingCash:money(state.reserve),unrealized:money(unrealized),unallocatedOpenFees:money(unallocatedOpenFees),openPositions:currentPositions.map(pos=>({symbol:positionMarket(pos),positionId:positionId(pos.id),...pickNumbers(pos,['direction','entry','margin','leverage','openFeeRemaining']),unrealized:money(grossPnlAt(pos,marketPrice(state,positionMarket(pos))))}))},
  fees:{trading:money(state.feesPaid),interestPaid:money(interestPaid),interestAccrued:money(interestAccrued),interestTotal:money(interestTotal),living:money(living),consumption:money(consumption),nonTradingTotal:money(expenses)},
  funding:{netFundingIncludingAccruedInterest:money(netFunding),netBorrowingPrincipal:netFunding===null||interestAccrued===null?null:money(netFunding-interestAccrued),fatherRepaid:money(state.family?.repaid),networkBorrowed:money(state.loan?.borrowed),networkRepaid:money(state.loan?.repaid)},
  ...(state.lifeActions||state.lottery?{income:{nonTradingTotal:money(incomeTotal),work:money(workIncome),...(state.lottery?{lotteryIncome:money(lotteryIncome),cheatLotteryIncome:money(cheatLotteryIncome)}:{}),receipts:(state.lifeActions?.receipts||[]).filter(row=>row?.category==='work'&&lifeActionDefinition('work',row.optionId)&&Number.isFinite(row.income)&&row.income>0).map(row=>({day:number(row.day),workplace:row.optionId,label:lifeActionDefinition('work',row.optionId).label,amount:money(row.income),timestamp:number(row.timestamp)}))}}:{}),
  protections:{balanceProtection:money(state.balanceProtection??0),liquidationReduction:money(state.protectionPaid??0)},
  specialRecords,transactions,events,timeline:{start,points:retainedPoints.points.map(exportPoint),days:daily,end},
  reconciliation:{status:residual===null?'unavailable':Math.abs(residual)<=.02?'matched':'mismatch',expectedNominalAssets:money(expectedNominalAssets),actualNominalAssets:money(nominalAssets),residual:money(residual),formula:'initialCapital + realizedNetTradingPnl + unrealized - unallocatedOpenFees + netFundingIncludingAccruedInterest + nonTradingIncome + lotteryIncome + cheatLotteryIncome - nonTradingTotal + developerAdjustment',developerAdjustment:money(adjustment)},
  dataQuality:{orderStatisticsComplete:orders.complete,metricCoverage:{orders:orders.complete,highestLeverage:orders.maxLeverage!==null,drawdown:performance.maxDrawdown!==null,realizedPath:orders.realizedPathComplete===true},transactionsPartial:!!stats.timelinePartial,retainedTransactions:transactions.length,transactionLimit:2048,accountingTimelinePartial:dailyPartial||intradayPartial,accountingDailyPartial:dailyPartial,accountingIntradayPartial:intradayPartial,missingAccountingDays:missingDailyCount,accountingStartKnown:!!start,retainedAccountingDays:daily.length,accountingDayLimit:null,accountingPointLimit:ACCOUNTING_POINT_LIMIT,accountingSampled:sampled,accountingSampling:sampled?{policy:journal?.sampling?.policy||'observed-priority-sequence-buckets-v1',omittedPoints:!samplingExact?null:(journal?.sampling?.omittedPoints||0)+retainedPoints.removed.length,omittedKnownPoints:(journal?.sampling?.omittedPoints||0)+retainedPoints.removed.length,omittedTradePoints:journal?.executionAnchorsComplete===true&&samplingExact?(journal?.sampling?.omittedTradePoints||0)+retainedPoints.removed.filter(point=>point.executions).length:null,omittedKnownTradePoints:(journal?.sampling?.omittedTradePoints||0)+retainedPoints.removed.filter(point=>point.executions).length,tradeAnchorCoverage:journal?.executionAnchorsComplete===true&&samplingExact?'observed':'legacy-unknown'}:null,unknownFieldsUseNull:true,warnings:[]},
  definitions:{returnRate:'累计已实现净交易盈亏 / 初始游戏本金。开平仓费已扣除；借款、工作收入、生活费、利息、消费、未平仓浮盈亏不计分子。借入资金也能亏损，所以结果可以低于 -100%。',winRate:'盈利完整订单数 / 已全部平仓订单数。同一 positionId 的全部减半平仓与最终平仓先合并，盈亏绝对值不超过 ¥0.005 算保本，保本计入分母。未完全平仓不计胜负。',maxOrderLoss:'最差完整订单的累计已实现净盈亏，包含同订单全部分批平仓及开平仓费用；没有亏损为 0，记录不足为 null。',maxDrawdown:'引擎记录的交易权益最大回撤：初始本金加净交易盈亏与浮盈亏，剔除借还款、工作收入和非交易支出，权益下限为 0，因此上限 100%。它不是最大整单亏损。',assets:'账户总资产是现金、预留生活费及按现价计量持仓的总和；净资产 = 账户总资产 - 父亲欠款 - 网贷欠款。网贷欠款包含已资本化的未付利息。',fees:'已实现交易净盈亏已扣开平仓手续费，分析时不可再次扣 trading。interestAccrued 已进入债务，不是已支付现金。',time:isLiveMarket(state)?'实时报价时间采用提供方 UTC 时间戳，界面显示 JST；剧情天数仅为游戏进度。成交是基于券商指示中间价和游戏费用的模拟结算，不代表可执行盘口。未收到报价时 timestamp 为 null，不补造历史。':historical?historicalTimeDefinition(state):'全部时间为虚构游戏交易钟，JST；不是玩家真实活动时间。历史缺失不补造，时间精度不足时 timestamp 为 null。'},
  privacy:{scope:'本地游戏复盘数据',automaticAIUpload:false,excluded:['玩家昵称与账号身份','排行榜能力凭证与令牌','浏览器存储原文','聊天与内部提示词','本地路径']}
 };
 if(!orders.complete)report.dataQuality.warnings.push('旧档缺少部分交易，完整订单胜率、极值和特殊战绩未知；knownSample 仅表示保留样本。');
 if(report.dataQuality.transactionsPartial)report.dataQuality.warnings.push('交易明细为保留窗口；不要将窗口合计冒充全局累计。');
 if(dailyPartial)report.dataQuality.warnings.push(!journal||journal.legacyPartial?'旧存档缺少早期资金记录；已保留的数据和当前余额仍可查看。':missingDailyCount?`缺少 ${missingDailyCount} 天的资金汇总；当前余额与已记录的日期仍可查看。`:'开局资金记录已缺失；保留的每日汇总与当前余额仍可查看。');
 if(intradayPartial&&intradayMissing)report.dataQuality.warnings.push(dailyPartial?'旧档盘中记录曾被截断，缺失部分无法恢复。':'开局、每日汇总与当前余额完整；旧档盘中记录曾被截断，缺失部分无法恢复。');
 if(sampled)report.dataQuality.warnings.push('盘中资金已采样；保留实际首尾、峰谷及成交观察点，部分成交观察也可能省略。每日汇总另列。');
 if(residual!==null&&Math.abs(residual)>.02)report.dataQuality.warnings.push('余额守恒校验不一致，请先说明差额，不能假定账目完整。');
 if(developmentTaint)report.dataQuality.warnings.push('开发者测试局，不能用于真实排行榜比较。');
 return JSON.parse(JSON.stringify(report,(_k,value)=>typeof value==='number'&&!Number.isFinite(value)?null:value));
}
export {AI_REVIEW_PROMPT} from './ai-roast-prompts.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
export function resultsFilename(report){return `kurumi-fx-${report?.mode==='endless'?'endless':'story'}-day-${Number.isSafeInteger(report?.day)&&report.day>0?report.day:1}-results-v1.json`;}
export function serializeResults(report){return JSON.stringify(report,null,2)+'\n';}
export function downloadResults(report,{document=globalThis.document,URL=globalThis.URL,Blob=globalThis.Blob,schedule=globalThis.setTimeout}={}){
 if(!document||!URL?.createObjectURL||!Blob)throw Error('当前浏览器无法下载 JSON，请稍后重试');
 const blob=new Blob([serializeResults(report)],{type:'application/json;charset=utf-8'}),url=URL.createObjectURL(blob),anchor=document.createElement('a');
 try{anchor.href=url;anchor.download=resultsFilename(report);anchor.hidden=true;document.body.append(anchor);anchor.click();}finally{anchor.remove();schedule(()=>URL.revokeObjectURL(url),1000);}
 return {filename:resultsFilename(report),bytes:blob.size};
}
