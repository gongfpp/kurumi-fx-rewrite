import {isMultiHistory,switchMultiHistoryMarket,validMultiHistoryBook} from './multi-history-state.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {isLiveMarket,LIVE_MARKET_VERSION,liveScript,liveTimestamp} from './live-market-state.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
// Simulated JPY-quoted instruments. No historical or live data is implied.
import {quoteSubstep,QUOTE_SUBSTEPS,hasCanonicalGrid,validQuoteGrid} from './quote-grid.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {recordDisplayQuote,validCandleDisplay} from './candle-period.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {stampCandleTime,stampQuoteTime,currentTradingTimestamp} from './trading-time.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
export const MULTI_MARKET_VERSION=15;
export const MARKETS=Object.freeze([
 Object.freeze({symbol:'USD/JPY',base:'USD',name:'美元',label:'美元兑日元',startPrice:150,seed:0}),
 Object.freeze({symbol:'AUD/JPY',base:'AUD',name:'澳元',label:'澳元兑日元',startPrice:90,seed:0x51ad39}),
 Object.freeze({symbol:'GBP/JPY',base:'GBP',name:'英镑',label:'英镑兑日元',startPrice:170,seed:0x793cb1})
]);
const fields=['price','script','candles','displayMinutes','displayMinutesPartial','lastEvent','swanSeen','dayOpeningPrice'];
export const marketInfo=symbol=>MARKETS.find(m=>m.symbol===symbol)||MARKETS[0];
export const activeMarket=s=>s.marketBook?.active||'USD/JPY';
export const positionMarket=p=>p?.symbol||'USD/JPY';
export const marketSeed=(s,symbol=activeMarket(s))=>(s.seed^marketInfo(symbol).seed)>>>0;
export function marketPrice(s,symbol=activeMarket(s)){return symbol===activeMarket(s)?s.price:s.marketBook?.markets?.[symbol]?.price;}
export function captureMarket(s){if(!s.marketBook)return;const m=s.marketBook.markets[activeMarket(s)];for(const k of fields){if(s[k]===undefined)delete m[k];else m[k]=s[k];}}
export function createMarketBook(s,planDay){
 if(s.historical)throw Error('历史行情暂时仅提供美元兑日元');
 if(s.marketBook)return;
 s.marketBook={version:1,source:'simulated',active:'USD/JPY',markets:{}};
 for(const m of MARKETS){const seed=marketSeed(s,m.symbol),ratio=m.startPrice/150;
  s.marketBook.markets[m.symbol]={lastEvent:null,swanSeen:false,dayOpeningPrice:m.startPrice,price:m.startPrice,script:planDay(seed,s.day,m.startPrice,4+(s.mode==='endless'?0:s.bonusBeats||0),{gridVersion:hasCanonicalGrid(s.script)?2:1,symbol:m.symbol}),candles:s.candles.filter(c=>c.historical).map(c=>({...c,open:c.open*ratio,high:c.high*ratio,low:c.low*ratio,close:c.close*ratio}))};
 }
 s.dayOpeningPrice=s.candles.find(c=>c.day===s.day)?.open??s.price;captureMarket(s);
 // Reconstruct only elapsed simulated quotes for newly added instruments.
 // Existing USD prices, positions, timestamps and accounting are untouched.
 const observedAt=currentTradingTimestamp(s),steps=hasCanonicalGrid(s.script)?QUOTE_SUBSTEPS:1;
 const view={...s,phase:'playing',tradingClock:{...s.tradingClock}};
 for(let b=0;b<s.script.tracks.length;b++)for(let c=0;c<4;c++)for(let t=0;t<6;t++)for(let q=0;q<steps;q++){
  const cursor={beat:b,candle:c,tick:t,subtick:q};
  // Closed/early-exit saves have no pending cursor. Their last observed trading
  // timestamp still bounds reconstruction, including a partial canonical tick.
  if(stampQuoteTime(view,cursor,(q+1)/steps)>observedAt)continue;
  advanceHiddenMarkets(view,cursor);
 }
 for(const p of s.positions||[])p.symbol??='USD/JPY';s.version=MULTI_MARKET_VERSION;
}
export function switchMarket(s,symbol,planDay){
 if(isMultiHistory(s))return switchMultiHistoryMarket(s,symbol);
 if(!MARKETS.some(m=>m.symbol===symbol))throw Error('未知货币对');
 if(s.historical&&symbol!=='USD/JPY')throw Error('历史行情暂时仅提供美元兑日元');
 if(symbol===activeMarket(s))return false;
 createMarketBook(s,planDay);captureMarket(s);if(s.pending){s.pending.marketStartPrices ||= {};s.pending.marketStartPrices[activeMarket(s)] ??= s.pending.startPrice;}s.marketBook.active=symbol;
 const m=s.marketBook.markets[symbol];for(const k of fields){if(m[k]===undefined)delete s[k];else s[k]=m[k];}if(s.pending){s.pending.startPrice=s.pending.marketStartPrices?.[symbol]??s.candles.find(c=>c.day===s.day&&c.beat===s.pending.beat)?.open??s.price;s.pending.flashShown=s.lastEvent?.beat===s.pending.beat;}return true;
}
export function renewMarketScripts(s,planDay){if(!s.marketBook)return;if(isMultiHistory(s)){s.dayOpeningPrice=s.price;captureMarket(s);for(const m of Object.values(s.marketBook.markets)){m.dayOpeningPrice=m.price;m.lastEvent=null;m.swanSeen=false;}return;}if(isLiveMarket(s)){s.script=liveScript(s.price);s.dayOpeningPrice=s.price;captureMarket(s);for(const book of Object.values(s.marketBook.markets)){book.script=liveScript(book.price);book.dayOpeningPrice=book.price;}return;}s.dayOpeningPrice=s.price;captureMarket(s);for(const m of MARKETS){if(m.symbol===activeMarket(s))continue;const book=s.marketBook.markets[m.symbol];book.lastEvent=null;book.swanSeen=false;book.dayOpeningPrice=book.price;book.script=planDay(marketSeed(s,m.symbol),s.day,book.price,4+(s.mode==='endless'?0:s.bonusBeats||0),{symbol:m.symbol});}}
export function advanceHiddenMarkets(s,cursor){
 if(isLiveMarket(s))throw Error('真实行情不可模拟推进');
 if(!s.marketBook)return;
 for(const m of MARKETS){if(m.symbol===activeMarket(s))continue;const book=s.marketBook.markets[m.symbol],fine=hasCanonicalGrid(book.script),subtick=fine?(cursor.subtick??0):0;
  const price=quoteSubstep(book.script,{...cursor,subtick:hasCanonicalGrid(s.script)?subtick:QUOTE_SUBSTEPS-1});let candle=book.candles.at(-1);
  if(cursor.tick===0&&subtick===0){candle={open:book.price,close:book.price,high:book.price,low:book.price,closed:false,day:s.day,beat:cursor.beat};stampCandleTime(s,candle,cursor);book.candles.push(candle);recordDisplayQuote(Object.assign(book,{day:s.day,beat:cursor.beat}),candle.timestamp,book.price);}
  // Restored books share the same already-observed cursor as the selected chart.
  if(!candle)throw Error('缺少货币对行情记录');
  book.price=price;candle.close=price;candle.high=Math.max(candle.high,price);candle.low=Math.min(candle.low,price);
  recordDisplayQuote(Object.assign(book,{day:s.day,beat:cursor.beat}),currentTradingTimestamp(s),price);
  if(!fine||subtick===QUOTE_SUBSTEPS-1){
   if(cursor.candle===1&&cursor.tick===2&&!(book.lastEvent?.swan&&book.lastEvent.beat===cursor.beat)){const e=book.script.events[cursor.beat];book.lastEvent={title:e.flash,copy:e.flashCopy,chain:e.chain,beat:cursor.beat};}
   const swan=book.script.swan;if(swan&&swan.beat===cursor.beat&&swan.candle===cursor.candle&&swan.tick===cursor.tick){book.swanSeen=true;book.lastEvent={...swan,swan:true,chain:swan.name};}
   if(cursor.tick===book.script.tracks[cursor.beat][cursor.candle].length-1)candle.closed=true;
  }
  if(s.mode==='endless'&&book.candles.length>256)book.candles=book.candles.slice(-256);
 }
 captureMarket(s);
}
export function validMarketBook(s){
 if(isMultiHistory(s))return validMultiHistoryBook(s);
 const b=s.marketBook;if(!b)return s.version!==MULTI_MARKET_VERSION&&(s.positions||[]).every(p=>positionMarket(p)==='USD/JPY');
 if(s.version!==(isLiveMarket(s)?LIVE_MARKET_VERSION:MULTI_MARKET_VERSION)||s.historical||b.version!==1||b.source!==(isLiveMarket(s)?'live':'simulated')||!MARKETS.some(m=>m.symbol===b.active)||!b.markets||Object.keys(b.markets).length!==MARKETS.length)return false;
 for(const {symbol} of MARKETS){const m=b.markets[symbol];if(!m||!Number.isFinite(m.price)||m.price<=0||!Array.isArray(m.candles)||!validQuoteGrid(m.script)||m.script.tracks.length!==s.script.tracks.length||hasCanonicalGrid(m.script)!==hasCanonicalGrid(s.script))return false;
  if(!m.candles.every(c=>[c.open,c.close,c.low,c.high].every(n=>Number.isFinite(n)&&n>0)&&c.low<=Math.min(c.open,c.close)&&c.high>=Math.max(c.open,c.close)))return false;
  if(s.phase==='playing'&&(s.pending?.tick>0||s.pending?.subtick>0)&&m.candles.at(-1)?.closed!==false)return false;
  if(!validCandleDisplay({...s,marketBook:{...b,active:symbol},displayMinutes:m.displayMinutes}))return false;
  if(s.phase==='playing'&&!Number.isFinite(m.script.tracks[s.pending?.beat]?.[s.pending?.candle]?.[s.pending?.tick]))return false;
 }
 return (s.positions||[]).every(p=>MARKETS.some(m=>m.symbol===positionMarket(p))&&(p.pnlModel!=='legacy-inverse-v5'||positionMarket(p)==='USD/JPY'));
}
