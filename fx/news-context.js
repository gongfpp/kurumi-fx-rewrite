import {currentTradingTimestamp} from './trading-time.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {isLiveMarket} from './live-market-state.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';

const DAY=86400000,JST=9*3600000;
export const NEWS_PAIRS=Object.freeze(['USDJPY','AUDJPY','GBPJPY']);
export const normalizeNewsPair=value=>typeof value==='string'?value.toUpperCase().replace('/',''):null;
const safeTimestamp=at=>typeof at==='number'&&Number.isFinite(at)&&Math.abs(at)<8e15;
export const newsDate=at=>safeTimestamp(at)?new Date(at+JST).toISOString().slice(0,10):null;
export function newsContext(state={}){
 const historical=[1,2,3].includes(state.historical?.version);
 // Version 3 uses the validated historical market book, not historical.symbol.
 // Older USD-only packages must never borrow a simulated tab's active symbol.
 const historicalPair=state.historical?.version===3?(state.marketBook?.version===1&&state.marketBook.source==='historical'?state.marketBook.active:null):(state.historical?.symbol??'USDJPY');
 const pair=normalizeNewsPair(historical?historicalPair:(state.marketBook?.active??'USDJPY'));
 let at=null;
 try{at=historical?state.historical.lastQuote?.[0]:currentTradingTimestamp(state);}catch{/* Invalid old metadata is not a clock. */}
 const date=newsDate(at);
 return {mode:isLiveMarket(state)?'live':historical?'historical':'simulated',pair:NEWS_PAIRS.includes(pair)?pair:null,at:safeTimestamp(at)?at:null,date,year:date?.slice(0,4)??null};
}
export function newsAvailableAt(entry){
 if(typeof entry?.date!=='string'||!/^2014-\d\d-\d\d$/.test(entry.date))return null;
 const dateAt=Date.parse(entry.date+'T00:00:00Z');
 if(!Number.isFinite(dateAt)||new Date(dateAt).toISOString().slice(0,10)!==entry.date)return null;
 if(entry.availableAfterJst!==undefined){
  if(typeof entry.availableAfterJst!=='string'||!/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\+09:00$/.test(entry.availableAfterJst))return null;
  const at=Date.parse(entry.availableAfterJst);
  return safeTimestamp(at)&&new Date(at+JST).toISOString().slice(0,19)+'+09:00'===entry.availableAfterJst&&newsDate(at)>=entry.date?at:null;
 }
 // Legacy records have a release day but no verified time. The next noon JST
 // is after that date in the US, Europe, Japan and Australia. It is not a claim
 // that the original release happened at noon.
 return dateAt+DAY+3*3600000;
}
export function newsPairs(entry){
 if(Array.isArray(entry.pairs))return entry.pairs.map(normalizeNewsPair).filter(pair=>NEWS_PAIRS.includes(pair));
 return NEWS_PAIRS.filter(pair=>entry.currencies?.some(currency=>pair.slice(0,3)===currency||pair.slice(3)===currency));
}
export function availableNews(entry,context){
 if(!context||context.mode==='live'||!NEWS_PAIRS.includes(context.pair)||!safeTimestamp(context.at)||newsDate(context.at)?.slice(0,4)!==entry.date?.slice(0,4))return false;
 if(entry.productionEnabled===false)return false;
 // This review permits only the original factual summary; it does not grant
 // reuse rights in the source document or remove its recorded restrictions.
 if(entry.publicationReviewRequired===true&&!(entry.summaryKind==='original_factual_summary'&&entry.publicationReview?.status==='original_factual_summary_reviewed'&&entry.publicationReview?.reviewScope==='original_factual_summary_only'&&entry.publicationReview?.sourceTextOrImageReuseAuthorized===false))return false;
 const at=newsAvailableAt(entry);
 return at!==null&&at<=context.at&&newsPairs(entry).includes(context.pair);
}
