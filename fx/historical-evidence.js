// Public report projection only. No provider, file path, local package URL or
// unobserved price enters a result through arbitrary save metadata.
import {hasHistoricalSimulation} from './history-continuation.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
const HASH=/^[a-f0-9]{64}$/;
const symbols=['USD/JPY','AUD/JPY','GBP/JPY'];
function validDate(value){return typeof value==='string'&&/^\d{4}-\d\d-\d\d$/.test(value)&&Number.isFinite(Date.parse(value+'T00:00:00Z'))&&new Date(value+'T00:00:00Z').toISOString().slice(0,10)===value;}
export function safeHistoricalTradeEvidence(trade){
 const e=trade?.historicalQuote,at=trade?.timestamp;
 if(!e||!validDate(e.date)||!Number.isSafeInteger(e.cursor)||e.cursor<0||typeof e.sourceVersion!=='string'||!/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,127}$/.test(e.sourceVersion)||!Number.isSafeInteger(at)||at<0)return null;
 if(e.symbol!==undefined&&!symbols.includes(e.symbol)||e.sourceTimestamp!==undefined&&e.sourceTimestamp!==at||e.priceBasis!==undefined&&e.priceBasis!=='observed-close-only')return null;
 return {date:e.date,cursor:e.cursor,sourceVersion:e.sourceVersion,sourceTimestamp:at,...(e.symbol?{symbol:e.symbol,priceBasis:'observed-close-only'}:{})};
}
export function historicalReportSource(state){
 const h=state?.historical;if(![1,2,3].includes(h?.version))return null;
 const mixed=hasHistoricalSimulation(state);
 return {marketSource:mixed?'historical-mixed':'historical',marketData:{priceBasis:h.version===1?'bid-ask-mid':'observed-close-only',execution:h.version===1?'game-fees-applied-to-observed-mid':'game-fees-applied-to-observed-close',timeBasis:h.version===1?'historical-source-UTC':'source-label-plus-60-seconds',...(HASH.test(h.sourceHash)?{sourceHash:h.sourceHash}:{}),...(h.version!==1?{timestampMeaning:'unknown-open-or-close-label',quoteSide:'unverified-single-price-OHLC',availabilityModel:'label-plus-60-seconds'}:{}),exhaustion:'continue-simulated-from-last-real-price',composition:mixed?'mixed':'historical',...(mixed?{pureHistoricalProfit:null,simulatedSamples:state.historyContinuation.simulatedSamples,segments:state.historyContinuation.segments.map(row=>({id:row.id,source:row.source,from:row.from,to:row.to})),segmentsOmitted:state.historyContinuation.segmentsOmitted}:{})}};
}
export function historicalTimeDefinition(state){
 const details=state.historical.version===1?'逐笔数据按已接收的买卖报价中间价和游戏费用结算，不代表可执行盘口。':'分钟 OHLC 标签的开收含义和报价侧未核实，按标签后 60 秒可用的保守模型读取已完成线，只以已观察收盘价和游戏费用结算；不补造逐笔路径或价差。';
 return `历史行情时间采用来源 UTC 时间戳，界面显示 JST；剧情天数仅为游戏进度。${details}历史数据缺口和结束后从最后真实价格进行模拟补接，模拟段单独标记；混合结果不代表纯真实历史收益。`;
}
