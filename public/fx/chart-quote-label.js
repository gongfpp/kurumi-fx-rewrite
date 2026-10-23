// Read-only display model. No orders, OHLC, clocks or persisted state are edited.
import {activeMarket} from './market-book.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {isLiveMarket,liveQuote,liveQuoteReady,liveStatusLabel} from './live-market-state.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
const positive=n=>Number.isFinite(n)&&n>0;
const signed=(n,d)=>`${n>=0?'+':''}${(Object.is(n,-0)?0:n).toFixed(d)}`;
function historicalReference(state,symbol){
 if(state.dayOpeningPriceDay===state.day)return state.dayOpeningPrice;
 const book=state.marketBook?.markets?.[symbol];
 // Older saves have no dated display reference. Reconstruct only from marks
 // already retained in that save, never today's first render or a future feed.
 if(state.day===1)return book?book.dayOpeningPrice:state.startPrice;
 return (book?.candles||state.candles||[]).findLast(c=>c.day===state.day-1&&!c.historyWarmup)?.close;
}
export function createChartQuoteLabel(){
 let run=null;const references=new Map(),latest=new Map();
 return (state,{now=Date.now(),sourceMode='live',referenceClock}={})=>{
  const symbol=activeMarket(state),live=isLiveMarket(state),delayed=['delayed','replay'].includes(sourceMode);
  const key=`${state.mode}:${state.runId||state.seed}:${sourceMode}`;
  if(run!==key){references.clear();latest.clear();run=key;}
  // Every currently supported JPY pair shares this quote precision.
  const digits=3,q=live?liveQuote(state,symbol):null,current=live?q?.mid:state.price;
  const timestamp=live?q?.sourceTimestamp:null,previous=latest.get(symbol),observation=q?.observation??q?.replay?.sequence;
  // A delayed relay must explicitly supply its actual playback clock. Wall-clock
  // age alone cannot turn delayed observations into newly live observations.
  const clock=delayed?referenceClock:now;
  let ready=positive(current)&&(!live||Number.isFinite(clock)&&liveQuoteReady(state,symbol,clock));
  if(live&&previous&&(timestamp<previous.timestamp||timestamp===previous.timestamp&&current!==previous.price&&!(Number.isSafeInteger(observation)&&Number.isSafeInteger(previous.observation)&&observation>previous.observation)))ready=false;
  if(live&&ready){latest.set(symbol,{price:current,timestamp,observation});if(!references.has(symbol))references.set(symbol,current);}
  const display=live&&!ready&&previous?previous.price:current;
  const reference=live?references.get(symbol):state.historical?historicalReference(state,symbol):state.dayOpeningPrice;
  const valid=ready&&positive(reference),delta=valid?current-reference:null;
  const basis=live?'相对本次行情会话首个有效中间价':'相对本日开盘价';
  const sourceTimestamp=live&&!ready&&previous?previous.timestamp:timestamp;
  const delaySeconds=live&&Number.isFinite(now)&&Number.isFinite(sourceTimestamp)?Math.max(0,Math.floor((now-sourceTimestamp)/1000)):null;
  const status=!live?(state.historical?'历史行情':'模拟行情'):delayed?
   `${sourceMode==='replay'?'行情回放':'来源延迟'}${delaySeconds===null?'':` · 距来源时间 ${delaySeconds} 秒`}${ready?'':' · 保留最后报价'}`:liveStatusLabel(state);
  return {symbol,priceValue:positive(display)?display:null,price:positive(display)?display.toFixed(digits):'—',change:valid?signed(delta,digits):'—',percent:valid?`${signed(delta/reference*100,3)}%`:'—',ready,
   isRealtime:live&&ready&&!delayed,priceLabel:!positive(display)?'报价':live&&!ready?'最后报价':delayed?sourceMode==='replay'?'回放报价':'延迟报价':live?'当前报价':'报价',
   basis,status,tooltip:`${basis}；${status}`,sourceTimestamp,delaySeconds};
 };
}
