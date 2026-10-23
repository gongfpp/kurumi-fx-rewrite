import {recordDisplaySourceCandle,validCandleDisplay} from './candle-period.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {historicalMarkIsSimulated,historicalEffectiveTime,historicalSimulationActive,startHistoricalContinuation} from './history-continuation.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
const SYMBOLS=Object.freeze(['USD/JPY','AUD/JPY','GBP/JPY']),HASH=/^[a-f0-9]{64}$/;
const fields=['price','script','candles','displayMinutes','displayMinutesPartial','lastEvent','swanSeen','dayOpeningPrice'];
const feeds=new WeakMap();
const researchKeys=['timestampMeaning','quoteSide','availabilityModel','executionModel','spreadModel','feesModel'];
const sameResearch=(a,b)=>a&&b&&Object.keys(a).length===researchKeys.length&&Object.keys(b).length===researchKeys.length&&researchKeys.every(k=>a[k]===b[k]);
export const isMultiHistory=s=>s?.historical?.version===3;
export const hasMultiHistoryFeed=s=>feeds.has(s);
const active=s=>s.marketBook?.active||'USD/JPY';
export const multiHistoryTimestamp=(s,symbol=active(s))=>s.historical?.quotes?.[symbol]?.at??null;
export const multiHistoryQuoteCurrent=(s,symbol=active(s))=>!isMultiHistory(s)||historicalMarkIsSimulated(s,symbol)&&historicalEffectiveTime(s)!==null||multiHistoryTimestamp(s,symbol)===(historicalEffectiveTime(s)??s.historical.lastQuote?.[0]);
export const multiHistorySymbolEnded=(s,symbol=active(s))=>isMultiHistory(s)&&s.mode==='story'&&feeds.get(s)?.lastAt[symbol]===multiHistoryTimestamp(s,symbol);
export const multiHistoryEntryOpen=(s,symbol=active(s))=>multiHistoryQuoteCurrent(s,symbol)&&!multiHistorySymbolEnded(s,symbol);
export const multiHistoryPositionsCurrent=s=>!isMultiHistory(s)||(s.positions||[]).every(p=>multiHistoryQuoteCurrent(s,p.symbol||'USD/JPY'));
export function multiHistoryTradeEvidence(s,symbol=active(s)){const q=s.historical?.quotes?.[symbol];return q?{date:s.historical.date,cursor:s.historical.cursor,sourceVersion:q.sourceVersion,symbol,sourceTimestamp:q.at,priceBasis:'observed-close-only'}:null;}
function storeActive(s){const m=s.marketBook.markets[active(s)];for(const k of fields){if(s[k]===undefined)delete m[k];else m[k]=s[k];}}
function restoreActive(s){const m=s.marketBook.markets[active(s)];for(const k of fields){if(m[k]===undefined)delete s[k];else s[k]=m[k];}s.historical.lastQuote[1]=s.historical.quotes[active(s)]?.price??s.price;}
function candle(s,b){return {open:b.open,high:b.high,low:b.low,close:b.close,closed:true,day:s.day,beat:Math.min(3,Math.floor(new Date(b.availableAt+32400000).getUTCHours()/6)),timestamp:b.labelAt,timeSource:'historical',firstQuoteAt:b.availableAt,lastQuoteAt:b.availableAt,availableAt:b.availableAt,research:true};}
export function initializeMultiHistory(s,{manifest,dayData,startDate,manifestURL},script){
 const entry=manifest.days.find(d=>d.date===startDate);if(!entry)throw Error('所选日期没有分钟行情');
 s.historical={version:3,datasetId:manifest.id,sourceVersion:String(manifest.version),sourceHash:manifest.source.sha256,manifestURL,priceBasis:'observed-close-only',research:{...manifest.research},date:startDate,startDate,dayHash:entry.sha256,cursor:0,status:'loading',lastQuote:null,quotes:{},acceptedGapCursor:null};
 s.marketBook={version:1,source:'historical',active:'USD/JPY',markets:{}};
 for(const symbol of SYMBOLS)s.marketBook.markets[symbol]={script:script(),candles:[],displayMinutes:[],lastEvent:null,swanSeen:false};
 bindMultiHistoryDay(s,manifest,dayData);
 let i=0;for(;i<dayData.events.length;i++){consumeMultiHistoryEvent(s,dayData.events[i]);if(SYMBOLS.every(symbol=>s.historical.quotes[symbol]))break;}
 if(!SYMBOLS.every(symbol=>s.historical.quotes[symbol]))throw Error('所选日期没有分钟行情');
 s.startPrice=s.price;for(const symbol of SYMBOLS){const m=s.marketBook.markets[symbol];m.dayOpeningPrice=m.price;}
 const now=s.historical.lastQuote[0];s.tradingClock={version:1,epochMs:Math.floor((now+32400000)/86400000)*86400000-32400000,timeZone:'Asia/Tokyo',candleMinutes:1,source:'historical',lastQuoteAt:now,lastQuoteDay:s.day};s.historical.dayOpeningAt=now;s.historical.status='ready';return s;
}
export function bindMultiHistoryDay(s,manifest,data){
 const h=s.historical,entry=manifest.days.find(d=>d.date===h.date);
 if(!sameResearch(h.research,manifest.research)||manifest.schemaVersion!=='research-multi-m1-close-v1'||data.schemaVersion!==manifest.schemaVersion||data.validated!==true||data.date!==h.date||data.datasetId!==h.datasetId||data.datasetVersion!==h.sourceVersion||manifest.id!==h.datasetId||manifest.version!==h.sourceVersion||data.sha256!==h.sourceHash||manifest.source.sha256!==h.sourceHash||entry?.sha256!==h.dayHash||!Array.isArray(data.events)||!data.events.length||!Number.isSafeInteger(h.cursor)||h.cursor<0||h.cursor>data.events.length)throw Error('分钟行情版本与存档不一致');
 if(h.cursor>0){const last=data.events[h.cursor-1];if(last.at!==h.lastQuote?.[0])throw Error('分钟行情存档价格不符');const expected={};for(const e of data.events.slice(0,h.cursor))for(const [symbol,b] of Object.entries(e.bars))expected[symbol]={at:e.at,price:b.close,sourceVersion:b.sourceVersion};for(const [symbol,q] of Object.entries(expected)){const saved=h.quotes[symbol];if(!saved||saved.at!==q.at||saved.price!==q.price||saved.sourceVersion!==q.sourceVersion||!historicalMarkIsSimulated(s,symbol)&&s.marketBook.markets[symbol].price!==q.price)throw Error('分钟行情存档价格不符');}}
 const lastAt={};for(const event of data.events)for(const symbol of Object.keys(event.bars))lastAt[symbol]=event.at;
 feeds.set(s,{manifest,dayData:data,lastAt});if(['loading','error','ready'].includes(h.status))h.status='ready';return s;
}
export function peekMultiHistory(s){const f=feeds.get(s),h=s.historical;if(!f)throw Error('历史行情尚未载入');if(h.status!=='ready')return{blocked:true};const event=f.dayData.events[h.cursor];if(!event)return{done:true};return{event,quote:[event.at,event.bars[active(s)]?.close??s.price],last:h.cursor===f.dayData.events.length-1,gapDurationMs:event.at-h.lastQuote[0]>60000?event.at-h.lastQuote[0]:0};}
export function consumeMultiHistoryEvent(s,event){
 if(s.historical.lastQuote)storeActive(s);let selectedCandle=null;
 for(const [symbol,b] of Object.entries(event.bars)){const m=s.marketBook.markets[symbol];if(!m)throw Error('未知货币对');const c=candle(s,b);m.price=b.close;if(s.historical.cursor===0)m.dayOpeningPrice=b.close;m.candles.push(c);m.day=s.day;m.beat=c.beat;recordDisplaySourceCandle(m,c);delete m.day;delete m.beat;if(m.candles.length>256)m.candles=m.candles.slice(-256);s.historical.quotes[symbol]={at:event.at,price:b.close,sourceVersion:b.sourceVersion};if(symbol===active(s)){selectedCandle=c;s.completedCandles++;}}
 const h=s.historical;if(h.cursor===0)h.dayOpeningAt=event.at;h.cursor++;h.lastQuote=[event.at,s.marketBook.markets[active(s)].price??null];restoreActive(s);if(s.tradingClock){s.tradingClock.lastQuoteAt=event.at;s.tradingClock.lastQuoteDay=s.day;}return selectedCandle;
}
export function skipElapsedMultiHistorySource(s,until){
 const f=feeds.get(s),h=s.historical,c=s.historyContinuation;if(!f||!c)return 0;
 const events=f.dayData.events;let lo=h.cursor,hi=events.length;
 while(lo<hi){const mid=(lo+hi)>>>1;if(events[mid].at<=until)lo=mid+1;else hi=mid;}
 const skipped=lo-h.cursor;if(!skipped)return 0;
 for(const symbol of SYMBOLS)for(let index=lo-1;index>=h.cursor;index--){const bar=events[index].bars[symbol];if(bar){h.quotes[symbol]={at:events[index].at,price:bar.close,sourceVersion:bar.sourceVersion};c.origins[symbol]='simulated';c.prices[symbol]=s.marketBook.markets[symbol].price;break;}}
 if(h.cursor===0)h.dayOpeningAt=events[0].at;h.cursor=lo;h.lastQuote=[events[lo-1].at,h.quotes[active(s)].price];s.tradingClock.lastQuoteAt=h.lastQuote[0];s.tradingClock.lastQuoteDay=s.day;c.skippedRealQuotes+=skipped;return skipped;
}
export function multiHistoryDayInfo(s){return feeds.get(s)?.manifest.days.find(d=>d.date===s.historical.date)||null;}
export function nextMultiHistoryDate(s){const days=feeds.get(s)?.manifest.days;return days?.[days.findIndex(d=>d.date===s.historical.date)+1]?.date||null;}
export function prepareNextMultiHistoryDay(s){const feed=feeds.get(s);if(!feed){startHistoricalContinuation(s,'loading');return false;}if(historicalSimulationActive(s)&&s.historical.status==='ready'&&s.historical.cursor<feed.dayData.events.length){s.marketPaused=false;return true;}const date=nextMultiHistoryDate(s);if(!date){s.historical.status='exhausted';startHistoricalContinuation(s,'exhausted');return false;}const entry=feed.manifest.days.find(d=>d.date===date);Object.assign(s.historical,{date,dayHash:entry.sha256,cursor:0,status:'loading',resumeAfterLoad:true,acceptedGapCursor:null});feeds.delete(s);startHistoricalContinuation(s,'loading');return true;}
export function switchMultiHistoryMarket(s,symbol){if(!SYMBOLS.includes(symbol)||!s.historical.quotes[symbol])throw Error('未知货币对');if(symbol===active(s))return false;storeActive(s);s.marketBook.active=symbol;restoreActive(s);if(s.pending)s.pending.startPrice=s.price;return true;}
export function validMultiHistoryBook(s){
 const b=s.marketBook,h=s.historical;if(!isMultiHistory(s)||!b||b.version!==1||b.source!=='historical'||!SYMBOLS.includes(b.active)||Object.keys(b.markets||{}).length!==3||!SYMBOLS.every(symbol=>{const m=b.markets[symbol],q=h.quotes?.[symbol];return m&&q&&Number.isFinite(m.price)&&m.price>0&&(historicalMarkIsSimulated(s,symbol)||m.price===q.price)&&Array.isArray(m.candles)&&m.candles.length>0&&m.script?.historical===true&&m.script.tracks?.length===0&&m.candles.every(c=>[c.open,c.high,c.low,c.close].every(n=>Number.isFinite(n)&&n>0)&&c.low<=Math.min(c.open,c.close)&&c.high>=Math.max(c.open,c.close)&&(c.availableAt??Infinity)<=(historicalEffectiveTime(s)??h.lastQuote[0]))&&validCandleDisplay({...s,displayMinutes:m.displayMinutes});}))return false;
 return s.price===b.markets[b.active].price&&(s.positions||[]).every(p=>SYMBOLS.includes(p.symbol||'USD/JPY'));
}
export function validMultiHistorySave(s){const h=s.historical;return isMultiHistory(s)&&[12,13].includes(s.version)&&typeof h.datasetId==='string'&&typeof h.sourceVersion==='string'&&HASH.test(h.sourceHash)&&h.sourceVersion===h.sourceHash&&h.dayHash===h.sourceHash&&/^\d{4}-\d\d-\d\d$/.test(h.date)&&/^\d{4}-\d\d-\d\d$/.test(h.startDate)&&Number.isSafeInteger(h.cursor)&&h.cursor>=0&&h.priceBasis==='observed-close-only'&&sameResearch(h.research,{timestampMeaning:'unknown-open-or-close-label',quoteSide:'unverified-single-price-OHLC',availabilityModel:'label-plus-60-seconds',executionModel:'observed-close-only',spreadModel:'none',feesModel:'game-fee-rate'})&&h.research?.executionModel==='observed-close-only'&&h.research?.availabilityModel==='label-plus-60-seconds'&&h.research?.spreadModel==='none'&&['ready','loading','error','day-end','exhausted'].includes(h.status)&&Array.isArray(h.lastQuote)&&h.lastQuote.length===2&&h.lastQuote.every(Number.isFinite)&&(historicalMarkIsSimulated(s)||h.lastQuote[1]===s.price)&&s.tradingClock?.lastQuoteAt===h.lastQuote[0]&&Object.keys(h.quotes||{}).length===3&&SYMBOLS.every(symbol=>{const q=h.quotes[symbol];return q&&Number.isSafeInteger(q.at)&&q.at<=h.lastQuote[0]&&Number.isFinite(q.price)&&q.price>0&&HASH.test(q.sourceVersion);})&&validMultiHistoryBook(s);}
