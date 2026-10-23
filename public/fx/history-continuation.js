import {simulationCalibration} from './quote-grid.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
const MINUTE=60000,SYMBOLS=['USD/JPY','AUD/JPY','GBP/JPY'];
const active=s=>s.marketBook?.active||'USD/JPY';
const price=(s,symbol)=>symbol===active(s)?s.price:s.marketBook?.markets?.[symbol]?.price;
const retainedSimulation=s=>(s?.candles||[]).some(c=>c.sourceKind==='simulated'||c.timeSource==='historical-simulation')||(s?.runStatistics?.trades||[]).some(t=>t.marketSegment?.mixedRun===true);
export const hasHistoricalSimulation=s=>s?.historyContinuation?.version===1&&s.historyContinuation.simulatedSamples>0||retainedSimulation(s);
export const historicalSimulationActive=s=>s?.historyContinuation?.version===1&&s.historyContinuation.active===true;
export const historicalEffectiveTime=s=>historicalSimulationActive(s)?s.historyContinuation.at:null;
export const historicalMarkIsSimulated=(s,symbol=active(s))=>s?.historyContinuation?.origins?.[symbol]==='simulated';
export function historicalSourcePresentation(s){
 if(!s?.historical||s.liveMarket)return null;
 if(historicalSimulationActive(s))return s.historyContinuation.reason==='exhausted'
  ?{label:'模拟续盘',description:'历史数据已结束，现从最后真实价格模拟续盘。'}
  :{label:'历史 · 模拟补接',description:'部分行情使用模拟补接；恢复历史报价后，本局仍标记含模拟。'};
 if(hasHistoricalSimulation(s))return {label:'历史 · 含模拟',description:'本局用过模拟补接；当前已恢复历史报价，结果仍含模拟。'};
 return {label:'历史行情',description:'采用历史报价；本局如有模拟段，会在此标明。'};
}
export function historicalSourceNotice(s){
 // Normal transitions stay in source/segment evidence, away from play controls.
 // An actual transport failure keeps its visible recovery path.
 return s?.historical?.status==='error'?'行情加载失败，请重试。':'';
}
export function startHistoricalContinuation(s,reason='loading'){
 if(!s.historical||s.liveMarket)return false;
 const raw=s.historical.lastQuote;if(!Array.isArray(raw)||!Number.isSafeInteger(raw[0])||raw[0]<=0||!Number.isFinite(raw[1])||raw[1]<=0||s.historical.version===1&&(!Number.isFinite(raw[2])||raw[2]<raw[1]))return false;
 let c=s.historyContinuation;
 if(!c){const at=s.historical.lastQuote?.[0];if(!Number.isSafeInteger(at))return false;
  const symbols=s.historical.version===3?SYMBOLS:['USD/JPY'];
  const opening=s.accountingJournal?.points?.find(row=>row.day===s.day&&row.kind==='opening')?.timestamp??at;
  c=s.historyContinuation={version:1,active:true,reason,at,random:(s.seed^0x619a74d3)>>>0,simulatedSamples:0,skippedRealQuotes:0,segment:0,segments:[{id:0,source:'historical',from:s.historical.dayOpeningAt??at,to:at}],segmentsOmitted:0,prices:Object.fromEntries(symbols.map(symbol=>[symbol,price(s,symbol)])),origins:Object.fromEntries(symbols.map(symbol=>[symbol,'historical'])),progressDay:s.day,dayOpeningAt:opening,daySamples:0};
 }
 c.active=true;c.reason=reason;s.marketPaused=false;return true;
}
function segment(c,source,at){
 let row=c.segments.at(-1);
 if(row.source!==source){row={id:++c.segment,source,from:at,to:at};c.segments.push(row);if(c.segments.length>128){c.segments.shift();c.segmentsOmitted++;}}
 row.to=at;return row.id;
}
export function resetHistoricalContinuationDay(s){
 const c=s.historyContinuation;if(c&&c.progressDay!==s.day){c.progressDay=s.day;c.dayOpeningAt=c.at;c.daySamples=0;}
}
export function simulateHistoricalMarks(s,{at,reason='gap',symbols}={}){
 startHistoricalContinuation(s,reason);const c=s.historyContinuation;if(!c)throw Error('尚无可衔接的历史价格');
 const selected=symbols||Object.keys(c.prices),nextAt=at??c.at+MINUTE;
 if(!Number.isSafeInteger(nextAt)||nextAt<c.at)throw Error('模拟续盘时间无效');
 const marks={};
 for(const symbol of selected){
  const before=price(s,symbol),priorAt=c.origins[symbol]==='simulated'?c.at:s.historical.version===3?s.historical.quotes?.[symbol]?.at:s.historical.lastQuote?.[0],profile=simulationCalibration(symbol,Math.max(1,nextAt-priorAt)/MINUTE);
  c.random=(Math.imul(c.random,1664525)+1013904223)>>>0;const a=c.random/4294967296;
  c.random=(Math.imul(c.random,1664525)+1013904223)>>>0;const b=c.random/4294967296;
  marks[symbol]=Number(Math.max(.001,before*(1+(a+b-1)*profile.noise)).toFixed(9));
  c.prices[symbol]=marks[symbol];c.origins[symbol]='simulated';
 }
 resetHistoricalContinuationDay(s);c.at=nextAt;c.simulatedSamples++;c.daySamples++;
 const id=segment(c,selected.length===Object.keys(c.prices).length?'simulated':'mixed',nextAt);
 return {at:nextAt,marks,segment:id};
}
export function recordHistoricalSource(s,at,symbols){
 const c=s.historyContinuation;if(!c)return 0;
 for(const symbol of symbols||Object.keys(c.prices)){c.prices[symbol]=price(s,symbol);c.origins[symbol]='historical';}
 c.at=at;c.active=Object.values(c.origins).includes('simulated');
 return segment(c,c.active?'mixed':'historical',at);
}
export function historicalSimulationEvidence(s,symbol=active(s)){
 const c=s.historyContinuation;if(!hasHistoricalSimulation(s))return null;
 return {source:historicalMarkIsSimulated(s,symbol)?'simulated':'historical',segment:c.segment,timestamp:historicalMarkIsSimulated(s,symbol)?c.at:s.historical.version===3?s.historical.quotes?.[symbol]?.at:s.historical.lastQuote?.[0],reason:c.reason,mixedRun:true};
}
export function safeHistoricalSegmentEvidence(e){
 if(!e||!['historical','simulated'].includes(e.source)||!Number.isSafeInteger(e.segment)||e.segment<0||!Number.isSafeInteger(e.timestamp)||e.timestamp<=0||!['gap','exhausted','loading','missing-market'].includes(e.reason)||e.mixedRun!==true)return null;
 return {source:e.source,segment:e.segment,timestamp:e.timestamp,reason:e.reason,mixedRun:true};
}
export function validHistoricalContinuation(s){
 const c=s.historyContinuation;if(c===undefined)return !retainedSimulation(s);
 if(!s.historical||s.liveMarket||c.version!==1||typeof c.active!=='boolean'||!['gap','exhausted','loading','missing-market'].includes(c.reason)||!Number.isSafeInteger(c.at)||c.at<0||!Number.isInteger(c.random)||c.random<0||c.random>0xffffffff||!Number.isSafeInteger(c.simulatedSamples)||c.simulatedSamples<0||!Number.isSafeInteger(c.skippedRealQuotes)||c.skippedRealQuotes<0||!Number.isSafeInteger(c.segment)||c.segment<0||!Array.isArray(c.segments)||!c.segments.length||c.segments.length>128||!Number.isSafeInteger(c.segmentsOmitted)||c.segmentsOmitted<0||!Number.isSafeInteger(c.progressDay)||c.progressDay<1||c.progressDay>s.day||!Number.isSafeInteger(c.daySamples)||c.daySamples<0)return false;
 const symbols=s.historical.version===3?SYMBOLS:['USD/JPY'];
 return Number.isSafeInteger(c.dayOpeningAt)&&c.dayOpeningAt<=c.at&&c.at>=s.historical.lastQuote?.[0]&&(!retainedSimulation(s)||c.simulatedSamples>0)&&Object.keys(c.prices||{}).length===symbols.length&&Object.keys(c.origins||{}).length===symbols.length&&symbols.every(symbol=>Number.isFinite(c.prices[symbol])&&c.prices[symbol]>0&&['historical','simulated'].includes(c.origins[symbol])&&(c.origins[symbol]!=='simulated'||price(s,symbol)===c.prices[symbol]))&&c.segments.every((row,i)=>Number.isSafeInteger(row.id)&&row.id>=0&&(!i||row.id===c.segments[i-1].id+1)&&['historical','simulated','mixed'].includes(row.source)&&Number.isSafeInteger(row.from)&&Number.isSafeInteger(row.to)&&row.from<=row.to&&(!i||row.from>=c.segments[i-1].to))&&c.segments.at(-1).id===c.segment&&c.segments.at(-1).to===c.at;
}
