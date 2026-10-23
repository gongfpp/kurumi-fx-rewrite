import {isLiveMarket,liveTimestamp} from './live-market-state.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {historicalEffectiveTime} from './history-continuation.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
// A deterministic fictional market clock. Playback milliseconds never enter it.
const MINUTE=60000,DAY=86400000;
export const TRADING_CLOCK_VERSION=1;
export const GAME_TIME_ZONE='Asia/Tokyo';
export const CANDLE_MINUTES=15;
// Chapter 1 p36 explicitly shows Friday, 2014-02-14. Existing epochs stay intact.
const FIRST_DAY=Date.UTC(2014,1,14)-9*60*MINUTE;
const SESSION_MINUTES=[550,690,900,1290,1410];
const integer=(n,fallback=0)=>Number.isSafeInteger(n)&&n>=0?n:fallback;
function businessDate(epoch,days){let offset=Math.floor(days/5)*7,remainder=days%5;const weekday=new Date(epoch+9*60*MINUTE).getUTCDay();while(remainder){offset++;const dow=(weekday+offset)%7;if(dow!==0&&dow!==6)remainder--;}return epoch+offset*DAY;}
export function tradingClock(state={}){
 const existing=state.tradingClock;
 if(existing?.version===1&&Number.isFinite(existing.epochMs)&&Math.abs(existing.epochMs)<8e15)return{...existing,timeZone:GAME_TIME_ZONE,candleMinutes:[2,3].includes(state.historical?.version)?1:CANDLE_MINUTES};
 return{version:1,epochMs:FIRST_DAY,timeZone:GAME_TIME_ZONE,candleMinutes:CANDLE_MINUTES,source:'game-calendar'};
}
export function ensureTradingClock(state){state.tradingClock=tradingClock(state);return state.tradingClock;}
export function tradingTimestamp(state,{day=state.day||1,beat=0,candle=0,tick=0}={}){
 if(isLiveMarket(state))return day===state.day?state.liveMarket.openingAt??liveTimestamp(state):state.accountingJournal?.days?.find(row=>row.day===day)?.timestamp??null;
 // Historical sessions have source timestamps, never the fictional session grid.
 // During a next-day load, lastQuote still belongs to the preceding source day.
 if([1,2,3].includes(state.historical?.version)){
  const h=state.historical;
  if(state.historyContinuation?.progressDay===day&&Number.isFinite(state.historyContinuation.dayOpeningAt))return state.historyContinuation.dayOpeningAt;
  if(day===state.day&&h.cursor>0&&Number.isFinite(h.dayOpeningAt))return h.dayOpeningAt;
  const report=state.dayReport?.day===day?state.dayReport:null;
  if(Number.isFinite(report?.openedAt))return report.openedAt;
  const opening=state.accountingJournal?.points?.find(row=>row.day===day&&['opening','start'].includes(row.kind));
  return Number.isFinite(opening?.timestamp)?opening.timestamp:null;
 }
 const clock=tradingClock(state),date=businessDate(clock.epochMs,Math.max(0,integer(day,1)-1));
 const b=integer(beat),start=SESSION_MINUTES[b]??SESSION_MINUTES.at(-1)+(b-4)*60;
 return date+(start+integer(candle)*CANDLE_MINUTES+Math.min(6,integer(tick))*CANDLE_MINUTES/6)*MINUTE;
}
function lastObservedTimestamp(state,day=state.day,cursor=state.pending||state.earlyClose){
 const last=(state.candles||[]).findLast(c=>!c.historical&&c.day===day);if(!last)return null;
 const start=timedCandles(state,[last])[0].timestamp;
 if(last.closed)return start+CANDLE_MINUTES*MINUTE;
 if(cursor&&cursor.beat===last.beat)return start+Math.min(6,integer(cursor.tick))*CANDLE_MINUTES/6*MINUTE;
 return start;
}
export function currentTradingTimestamp(state){
 if(isLiveMarket(state))return state.dayReport?.day===state.day&&['day_end','resting','ending'].includes(state.phase)&&Number.isFinite(state.dayReport.closedAt)?state.dayReport.closedAt:liveTimestamp(state);
 if(Number.isFinite(historicalEffectiveTime(state)))return state.dayReport?.day===state.day&&['day_end','resting','ending'].includes(state.phase)&&Number.isFinite(state.dayReport.closedAt)?state.dayReport.closedAt:historicalEffectiveTime(state);
 if([1,2,3].includes(state.historical?.version)&&Number.isFinite(state.historical.lastQuote?.[0]))return state.historical.lastQuote[0];
 if(state.dayReport?.day===state.day&&['day_end','resting','ending'].includes(state.phase))return reportTradingTimestamp(state,state.dayReport);
 if(state.earlyClose?.day===state.day&&state.phase==='closing')return Number.isFinite(state.earlyClose.timestamp)?state.earlyClose.timestamp:tradingTimestamp(state,state.earlyClose);
 if(state.tradingClock&&state.tradingClock.lastQuoteDay===state.day&&Number.isFinite(state.tradingClock.lastQuoteAt))return state.tradingClock.lastQuoteAt;
 const observed=lastObservedTimestamp(state);if(observed!==null)return observed;
 const p=state.pending;
 if(p)return tradingTimestamp(state,{day:state.day,beat:p.beat??state.beat,candle:p.candle,tick:p.tick});
 if(state.phase==='closing'||(state.beat||0)>=4+(state.mode==='endless'?0:state.bonusBeats||0))return tradingTimestamp(state,{day:state.day,beat:Math.max(0,(state.beat||1)-1),candle:3,tick:6});
 return tradingTimestamp(state,{day:state.day,beat:state.beat||0});
}
export function reportTradingTimestamp(state,report=state.dayReport){
 if(isLiveMarket(state))return Number.isFinite(report?.closedAt)?report.closedAt:liveTimestamp(state);
 if(Number.isFinite(report?.closedAt))return report.closedAt;
 if([1,2,3].includes(state.historical?.version))return report?.day===state.day||!report?historicalEffectiveTime(state)??state.historical.lastQuote?.[0]??null:state.accountingJournal?.days?.find(row=>row.day===report.day)?.timestamp??null;
 if(report?.earlyClose)return Number.isFinite(report.earlyClose.timestamp)?report.earlyClose.timestamp:lastObservedTimestamp(state,report.day,report.earlyClose)??tradingTimestamp(state,report.earlyClose);
 return tradingTimestamp(state,{day:report?.day||state.day||1,beat:Math.max(0,(report?.beat||4)-1),candle:3,tick:6});
}
export function stampQuoteTime(state,cursor,fraction=1){const clock=ensureTradingClock(state);clock.lastQuoteAt=tradingTimestamp(state,{day:state.day,beat:cursor.beat,candle:cursor.candle,tick:cursor.tick})+fraction*CANDLE_MINUTES/6*MINUTE;clock.lastQuoteDay=state.day;return clock.lastQuoteAt;}
export function stampCandleTime(state,candle,cursor){
 if(!Number.isFinite(candle.timestamp))candle.timestamp=tradingTimestamp(state,{day:candle.day||state.day,beat:cursor?.beat??candle.beat??0,candle:cursor?.candle||0});
 candle.timeSource='game-clock';return candle;
}
export function timedCandles(state,candles=state.candles||[]){
 const all=state.candles||candles,counts=new Map(),seen=new Map();
 for(const c of all)if(!c.historical){const key=`${c.day||1}:${c.beat||0}`;counts.set(key,(counts.get(key)||0)+1);}
 const historical=all.filter(c=>c.historical).length,firstActual=all.find(c=>!c.historical),firstKey=firstActual?`${firstActual.day||1}:${firstActual.beat||0}`:null;let hi=0;
 const result=new Map(all.map(c=>{
  let timestamp=c.timestamp;
  if(!Number.isFinite(timestamp)){
   if(c.historical)timestamp=tradingTimestamp(state,{day:1})-(historical-hi++)*CANDLE_MINUTES*MINUTE;
   else {const key=`${c.day||1}:${c.beat||0}`,index=seen.get(key)||0;seen.set(key,index+1);
    // Partial days start at their real first candle. Only the oldest group in
    // a full endless retention window can have lost candles from its front.
    const missingPrefix=state.mode==='endless'&&all.length>=256&&key===firstKey?Math.max(0,4-counts.get(key)):0;
    timestamp=tradingTimestamp(state,{day:c.day||1,beat:c.beat||0,candle:missingPrefix+index});}
  }
  return[c,{...c,timestamp,timeSource:c.timeSource||'derived-game-clock'}];
 }));
 return candles.map(c=>result.get(c)||{...c,timestamp:tradingTimestamp(state,{day:c.day||1,beat:c.beat||0}),timeSource:'derived-game-clock'});
}
export function formatTradingTime(timestamp,{date=false,full=false}={}){
 if(!Number.isFinite(timestamp))return '—';
 const iso=new Date(timestamp+9*60*MINUTE).toISOString(),day=iso.slice(0,10),time=iso.slice(11,16);
 return full?`${day} ${iso.slice(11,19)} JST`:date?`${day.slice(5)} ${time}`:time;
}
export function timeAxisTicks(points,{maxTicks=5,showDate=false}={}){
 if(!points.length)return[];const count=Math.max(1,Math.min(Math.floor(maxTicks)||1,points.length)),indices=new Set();
 for(let i=0;i<count;i++)indices.add(count===1?0:Math.round(i*(points.length-1)/(count-1)));
 let priorDate='';return [...indices].map(index=>{const timestamp=points[index].timestamp,full=formatTradingTime(timestamp,{full:true}),date=full.slice(0,10),label=formatTradingTime(timestamp,{date:showDate||date!==priorDate});priorDate=date;return{index,timestamp,label,title:full};});
}
export const TRADING_TIME_NOTICE='JST · 15分钟 K线';

export const tradingTimeNotice=state=>isLiveMarket(state)?'报价时间 · JST · 已接收的一分钟观察线':[2,3].includes(state.historical?.version)?'JST · 1分钟已完成线':TRADING_TIME_NOTICE;
