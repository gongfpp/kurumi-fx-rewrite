import {isLiveMarket} from './live-market-state.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
// Display aggregation only. Never reads a script, feed, or unseen source candle.
import {timedCandles,currentTradingTimestamp} from './trading-time.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {QUOTE_PACKAGES,quotePackageState,quotePackageOffer,quotePackageName} from './quote-packages.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
export const CANDLE_PERIODS=Object.freeze([{minutes:1440,label:'日K',hz:1},{minutes:15,label:'15分钟',hz:1},{minutes:5,label:'5分钟',hz:1},{minutes:1,label:'1分钟',hz:1}]);
const MINUTE=60000,JST=9*3600000,LIMIT=8192;
export const requestedCandlePeriod=s=>CANDLE_PERIODS.some(p=>p.minutes===s.candlePeriod)?s.candlePeriod:15;
export const candlePeriod=s=>requestedCandlePeriod(s);
export const nextCandlePeriod=s=>CANDLE_PERIODS[(CANDLE_PERIODS.findIndex(p=>p.minutes===candlePeriod(s))+1)%CANDLE_PERIODS.length].minutes;
export const candlePeriodLabel=s=>CANDLE_PERIODS.find(p=>p.minutes===candlePeriod(s)).label;
export const candlePeriodNotice=(s,{includeTimeZone=true}={})=>`${includeTimeZone?'JST · ':''}${candlePeriodLabel(s)}${candlePeriod(s)===1440?'':' K线'}`;
export function recordDisplayQuote(s,timestamp,price){
 if(!Number.isFinite(timestamp)||!Number.isFinite(price)||price<=0)return;
 s.displayMinutes ||= [];const bars=s.displayMinutes,bucket=Math.floor(timestamp/MINUTE)*MINUTE,last=bars.at(-1);
 if(last&&timestamp<last.lastQuoteAt)return;
 if(last&&last.timestamp===bucket&&last.day===s.day){last.close=price;last.high=Math.max(last.high,price);last.low=Math.min(last.low,price);last.lastQuoteAt=timestamp;return;}
 if(last)last.closed=true;
 bars.push({timestamp:bucket,open:price,high:price,low:price,close:price,day:s.day,beat:s.beat||0,closed:false,firstQuoteAt:timestamp,lastQuoteAt:timestamp,timeSource:'observed-quote'});
 if(bars.length>LIMIT){bars.splice(0,bars.length-LIMIT);s.displayMinutesPartial=true;}
}
export function recordDisplaySourceCandle(s,candle){
 s.displayMinutes ||= (s.candles||[]).filter(c=>c.research&&c.timestamp<candle.timestamp).map(c=>({...c}));if(s.displayMinutes.at(-1)?.timestamp===candle.timestamp)return;
 s.displayMinutes.push({...candle});if(s.displayMinutes.length>LIMIT){s.displayMinutes.splice(0,s.displayMinutes.length-LIMIT);s.displayMinutesPartial=true;}
}
export function validCandleDisplay(s){
 if(s.candlePeriod!==undefined&&!CANDLE_PERIODS.some(p=>p.minutes===s.candlePeriod))return false;
 if(s.displayMinutes===undefined)return true;
 const now=currentTradingTimestamp(s);let previous=-Infinity;
 return Array.isArray(s.displayMinutes)&&s.displayMinutes.length<=LIMIT&&s.displayMinutes.every(c=>{const at=c.availableAt??c.lastQuoteAt;const valid=Number.isFinite(c.timestamp)&&c.timestamp>=previous&&Number.isFinite(at)&&at<=now&&[c.open,c.high,c.low,c.close].every(n=>Number.isFinite(n)&&n>0)&&c.low<=Math.min(c.open,c.close)&&c.high>=Math.max(c.open,c.close)&&Number.isSafeInteger(c.day)&&c.day>0&&c.day<=s.day;previous=c.timestamp;return valid;});
}
export function aggregateCandles(source,minutes,now){
 const result=[],duration=minutes*MINUTE,offset=minutes===1440?JST:0;
 for(const c of source){if(!Number.isFinite(c.timestamp)||c.timestamp>now||(c.availableAt??c.firstQuoteAt??c.timestamp)>now)continue;
  const bucket=Math.floor((c.timestamp+offset)/duration)*duration-offset,last=result.at(-1);
  if(last&&last.timestamp===bucket&&(last.sourceSegment??0)===(c.sourceSegment??0)&&(last.sourceKind??'historical')===(c.sourceKind??'historical')){last.day=c.day;last.close=c.close;last.high=Math.max(last.high,c.high);last.low=Math.min(last.low,c.low);last.closed=last.closed&&c.closed;last.lastQuoteAt=c.lastQuoteAt??c.timestamp;if(c.sourceKind)last.sourceKind=c.sourceKind;if(c.sourceSegment!==undefined)last.sourceSegment=c.sourceSegment;}
  else result.push({...c,timestamp:bucket,periodMinutes:minutes,closed:!!c.closed});
 }
 for(const c of result)c.closed=!!c.closed&&c.timestamp+duration<=now;
 return result;
}
export function displayCandles(s){
 const minutes=candlePeriod(s),now=currentTradingTimestamp(s),research=[2,3].includes(s.historical?.version);
 const source=research?(s.displayMinutes?.length?s.displayMinutes:timedCandles(s)):minutes<15?(s.displayMinutes||[]):timedCandles(s);
 // Simulated source bars start on the actual session grid (09:10 etc.).
 if(minutes===15&&!research&&!isLiveMarket(s)&&!s.historical)return source.map(c=>({...c,periodMinutes:15}));
 return aggregateCandles(source,minutes,now);
}
export function candlePeriodMarkup(s){
 const selected=candlePeriod(s);
 return `<div class="candle-period-list" role="group" aria-label="K线时间周期">${CANDLE_PERIODS.map(p=>`<button type="button" class="candle-period-row" data-candle-period="${p.minutes}" aria-pressed="${selected===p.minutes}"><span class="candle-period-name"><strong>${p.label}</strong></span><span class="candle-period-price">免费${selected===p.minutes?' · 已选':''}</span></button>`).join('')}</div>`;
}
// Refresh is selectable separately, including while viewing the free 15-minute chart.
export function quoteRefreshMarkup(s,{availableCash=s.cash,canPurchase=true,busy=false}={}){
 const state=quotePackageState(s),labels={1:'常速刷新',2:'高速刷新',4:'超高频刷新'};
 return QUOTE_PACKAGES.map(p=>{
  const offer=quotePackageOffer(s,p.hz,{availableCash,canPurchase}),active=state.selectedHz===p.hz;
  const detail=offer.reason||(offer.price>0&&offer.price<p.dailyPrice?`今日补付¥${offer.price.toLocaleString('zh-CN')}`:active?'使用中':offer.owned?'今日可用':'按交易日续租');
  const label=p.hz===1?'手机':p.label,cost=p.dailyPrice?'¥'+p.dailyPrice.toLocaleString('zh-CN')+'/日':'免费';
  return `<button type="button" class="quote-refresh-choice" data-quote-hz="${p.hz}" aria-pressed="${active}" ${busy||!offer.valid?'disabled':''} title="${p.label} · ${labels[p.hz]} · ${detail}。只改刷新，不改K线周期；升级补差价，降档当天不退费。选手机可停止续租。${isLiveMarket(s)?'实时源的更新速度不变。':''}"><strong>${label}</strong><small>${cost}</small></button>`;
 }).join('');
}
