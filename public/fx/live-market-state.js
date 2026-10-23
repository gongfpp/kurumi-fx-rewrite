import {hasHistoricalSimulation,historicalSimulationActive} from './history-continuation.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
// Actual provider observations. No interpolation, random fallback or synthetic time.
export const LIVE_MARKET_VERSION=16;
export const LIVE_SYMBOLS=Object.freeze(['USD/JPY','AUD/JPY','GBP/JPY']);
import {isSharedReplay,sharedReplayQuoteReady,validSharedReplay,safeSharedReplayEvidence} from './shared-replay-state.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
export const isOrdinaryLive=s=>s?.liveMarket?.version===1;
export const isLiveMarket=s=>isOrdinaryLive(s)||isSharedReplay(s);
// Storage routing is stable for a run; source composition is reported separately.
export const marketSourceFamilyOf=s=>isSharedReplay(s)?'shared-replay':isLiveMarket(s)?'live':s?.historical?'historical':'simulated';
export const marketSourceOf=s=>s?.historical&&!isLiveMarket(s)&&(historicalSimulationActive(s)||hasHistoricalSimulation(s))?'historical-mixed':marketSourceFamilyOf(s);
export const liveSymbol=s=>s.marketBook?.active||'USD/JPY';
export const liveQuote=(s,symbol=liveSymbol(s))=>s.liveMarket?.quotes?.[symbol]||null;
export const liveTimestamp=(s,symbol=liveSymbol(s))=>liveQuote(s,symbol)?.sourceTimestamp??null;
export function liveQuoteReady(s,symbol=liveSymbol(s),now=Date.now()){
 if(isSharedReplay(s))return sharedReplayQuoteReady(s,symbol);
 const q=liveQuote(s,symbol);return !!q&&s.liveMarket.transport==='online'&&s.liveMarket.statuses[symbol]==='current'&&q.providerMarketState==='open'&&!q.providerStale&&now-q.sourceTimestamp<=30000&&q.sourceTimestamp<=now+5000;
}
export function livePositionsReady(s,now=Date.now()){return (s.positions||[]).every(p=>liveQuoteReady(s,p.symbol||'USD/JPY',now));}
export function liveTradingReady(s,now=Date.now()){
 return liveQuoteReady(s,liveSymbol(s),now)&&livePositionsReady(s,now);
}
export function liveStatusLabel(s){
 const q=liveQuote(s),l=s.liveMarket;if(!l)return '';
 if(l.transport==='denied')return '行情暂不可用';
 if(['disconnected','error'].includes(l.transport))return '行情连接中';
 if(!q)return '正在连接行情';
 if(q.providerMarketState==='closed')return '休市 · 最后报价';
 return liveTradingReady(s)?'真实行情 · biquote':'行情暂缓 · 保留最后报价';
}
export function liveScript(price){
 const event={id:'live-market',chain:'真实行情',title:'真实汇市',copy:'盘面采用 biquote 券商指示报价，可能延迟。游戏成交按该报价与原有费用规则计算。',source:'biquote · 券商指示行情',time:'',bias:0,vol:0,variant:'muted',flash:'真实汇市',flashCopy:''};
 // Inert shape for existing story consumers, never consumed as a price path.
 return {events:Array.from({length:5},()=>({...event})),tracks:Array.from({length:5},()=>Array.from({length:4},()=>Array(6).fill(price))),swan:null};
}
export function initializeLiveMarket(s){
 if(s.historical||(s.positions||[]).length||s.history?.length)throw Error('真实行情须从独立存档开始');
 s.version=LIVE_MARKET_VERSION;s.liveMarket={version:1,provider:'biquote',transport:'waiting',quotes:{},statuses:{},completedInDay:0,lastProgressAt:null,openingAt:null};
 s.marketBook={version:1,source:'live',active:'USD/JPY',markets:{}};
 for(const [i,symbol] of LIVE_SYMBOLS.entries()){const price=[150,90,170][i];s.marketBook.markets[symbol]={price,script:liveScript(price),candles:[],displayMinutes:[],dayOpeningPrice:price,lastEvent:null,swanSeen:false};}
 Object.assign(s,s.marketBook.markets['USD/JPY']);s.accountingJournal={version:1,points:[],days:[],observationSequence:0,executionAnchorsComplete:true,executionCursor:0,startedDay:1,legacyPartial:false};
 s.tradingClock={version:1,epochMs:0,timeZone:'Asia/Tokyo',candleMinutes:15,source:'biquote'};s.candlePeriod=1;s.pending=null;s.phase='decision';return s;
}
export function liveTradeEvidence(s,symbol=liveSymbol(s)){
 const q=liveQuote(s,symbol);return q?{provider:q.provider,source:q.source,symbol,sourceTimestamp:q.sourceTimestamp,bid:q.bid,ask:q.ask,mid:q.mid,priceBasis:'provider-indicative-mid',...(isSharedReplay(s)?{replay:{...q.replay,sourceTimestamp:q.sourceTimestamp,playbackClock:s.liveMarket.replay.playbackClock,serverReceivedAt:q.receivedAt,wallPlayedAt:q.clientReceivedAt,mode:'shared-replay'}}:{})}:null;
}
// Export only the public quote fields required to explain a game execution.
export function safeLiveTradeEvidence(q){
 if(!q||q.provider!=='biquote'||!LIVE_SYMBOLS.includes(q.symbol)||typeof q.source!=='string'||!q.source.trim()||q.source.length>200||q.priceBasis!=='provider-indicative-mid'||!Number.isSafeInteger(q.sourceTimestamp)||q.sourceTimestamp<=0||!['bid','ask','mid'].every(k=>Number.isFinite(q[k])&&q[k]>0)||q.bid>q.mid||q.mid>q.ask)return null;
 const replay=q.replay===undefined?null:safeSharedReplayEvidence(q.replay);if(q.replay!==undefined&&(!replay||replay.sourceTimestamp!==q.sourceTimestamp))return null;
 return {...(replay?{replay}:{}),provider:'biquote',source:q.source,symbol:q.symbol,sourceTimestamp:q.sourceTimestamp,bid:q.bid,ask:q.ask,mid:q.mid,priceBasis:'provider-indicative-mid'};
}
export function validLiveQuote(q,symbol,{allowUnknown=false}={}){
 return !!q&&LIVE_SYMBOLS.includes(symbol)&&q.symbol===symbol&&q.provider==='biquote'&&['bid','ask','mid'].every(k=>Number.isFinite(q[k])&&q[k]>0)&&q.bid<=q.ask&&q.mid>=q.bid&&q.mid<=q.ask&&Number.isSafeInteger(q.sourceTimestamp)&&q.sourceTimestamp>0&&Date.parse(q.sourceTimestampText)===q.sourceTimestamp&&typeof q.source==='string'&&!!q.source.trim()&&(allowUnknown?[null,'open','closed']:['open','closed']).includes(q.providerMarketState)&&(typeof q.providerStale==='boolean'||allowUnknown&&q.providerStale===null);
}
export function validLiveMarket(s){
 if(!s.liveMarket)return s.version!==LIVE_MARKET_VERSION&&s.marketBook?.source!=='live';
 const l=s.liveMarket,b=s.marketBook;
 if(l.version===1&&('mode' in l||'replay' in l)||isSharedReplay(s)&&!validSharedReplay(s))return false;
 if(!isLiveMarket(s)||s.version!==LIVE_MARKET_VERSION||s.historical||l.provider!=='biquote'||!b||b.source!=='live'||!LIVE_SYMBOLS.includes(b.active)||!l.quotes||!l.statuses||!Number.isSafeInteger(l.completedInDay)||l.completedInDay<0||l.completedInDay>20)return false;
 for(const symbol of Object.keys(l.quotes)){
  const q=l.quotes[symbol];if(!validLiveQuote(q,symbol,{allowUnknown:isSharedReplay(s)}))return false;
  if(b.markets[symbol]?.price!==q.mid)return false;
 }
 return true;
}
export function markLiveRestored(s){if(isLiveMarket(s)){s.liveMarket.transport='disconnected';if(isSharedReplay(s))s.liveMarket.replay.bound=false;for(const symbol of LIVE_SYMBOLS)s.liveMarket.statuses[symbol]='waiting';}}
