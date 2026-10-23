import {NEWS_2014} from './news-2014.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {NEWS_2014_ADDITIONS} from './news-2014-additions.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {NEWS_2014_BATCH2} from './news-2014-batch2.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {NEWS_2014_REVIEWED} from './news-2014-reviewed.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {NEWS_2014_NEXT_BATCH} from './news-2014-next-batch.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {NEWS_2014_VERIFIED_EXPANSION} from './news-2014-verified-expansion.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {NEWS_2014_VERIFIED_FOLLOWUP} from './news-2014-verified-followup.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {NEWS_2014_VERIFIED_FIVE} from './news-2014-verified-five.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {NEWS_2014_PUBLIC_BATCH6} from './news-2014-public-batch6.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {NEWS_2014_PUBLIC_SUPPLEMENT} from './news-2014-public-supplement.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {availableNews,newsAvailableAt,newsContext} from './news-context.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {archiveTopicMatch,revealedNewsTopics} from './news-topics.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';

// Display-only archive. No script tracks, future quote reads or price writes.
export const NEWS_ARCHIVE=Object.freeze([...NEWS_2014,...NEWS_2014_ADDITIONS,...NEWS_2014_BATCH2,...NEWS_2014_REVIEWED,...NEWS_2014_NEXT_BATCH,...NEWS_2014_VERIFIED_EXPANSION,...NEWS_2014_VERIFIED_FOLLOWUP,...NEWS_2014_VERIFIED_FIVE,...NEWS_2014_PUBLIC_BATCH6,...NEWS_2014_PUBLIC_SUPPLEMENT]);
const byId=new Map(NEWS_ARCHIVE.map(e=>[e.id,e]));
const DIRECTIONS=['up','down','range'],VOLATILITY=['normal','high'];
const validState=s=>s&&DIRECTIONS.includes(s.direction)&&VOLATILITY.includes(s.volatility);
export function observedNewsState(state){
 const candles=(state.candles||[]).filter(c=>!c.historical&&Number.isFinite(c.open)&&c.open>0&&Number.isFinite(c.close)&&c.close>0).slice(-6);
 const prices=candles.length?[candles[0].open,...candles.map(c=>c.close)]:[state.price];
 const first=prices[0],last=prices.at(-1),change=first>0?last/first-1:0;
 const observedRange=candles.flatMap(c=>[c.open,c.close,...[c.high,c.low].filter(v=>Number.isFinite(v)&&v>0)]);
 const range=observedRange.length?observedRange:prices;
 const amplitude=first>0?(Math.max(...range)-Math.min(...range))/first:0;
 return{direction:change>.0003?'up':change<-.0003?'down':'range',volatility:amplitude>=.002?'high':'normal'};
}
export function matchingNews(marketState,context){
 if(!validState(marketState))return [];
 // Historical facts do not prove a currency pair moved up or down. In either
 // mode, match on information availability and currency relevance only.
 return NEWS_ARCHIVE.filter(entry=>availableNews(entry,context));
}
function hash(text){let h=2166136261;for(const c of String(text)){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
function shuffled(ids,seed){let n=seed>>>0;const result=[...ids];for(let i=result.length-1;i>0;i--){n=(Math.imul(n,1664525)+1013904223)>>>0;const j=n%(i+1);[result[i],result[j]]=[result[j],result[i]];}return result;}
function ensureMemory(state,context,eligible){
 const raw=state.newsArchive;
 if(!raw||raw.version!==2||!Number.isSafeInteger(raw.serial)||raw.serial<0||!raw.bags||typeof raw.bags!=='object'||Array.isArray(raw.bags)||!Array.isArray(raw.recent))state.newsArchive={version:2,serial:0,bags:{},recent:[],active:null};
 const memory=state.newsArchive,scope=`${context.mode}:${context.pair}:${context.date}`,ids=new Set(eligible.map(e=>e.id));
 memory.recent=memory.recent.filter(id=>byId.has(id)&&availableNews(byId.get(id),context)).slice(-NEWS_ARCHIVE.length);
 // Purge every stale bag, including after a date rewind, pair switch or reload.
 for(const key of Object.keys(memory.bags)){
  if(key!==scope||!Array.isArray(memory.bags[key]))delete memory.bags[key];
  else memory.bags[key]=[...new Set(memory.bags[key].filter(id=>ids.has(id)))];
 }
 if(memory.active?.scope!==scope||!ids.has(memory.active?.id))memory.active=null;
 // A newly available publication joins a nonempty bag immediately.
 const prior=memory.availableScope===scope&&Array.isArray(memory.available)?memory.available:[];
 if(memory.bags[scope])memory.bags[scope].unshift(...[...ids].filter(id=>!prior.includes(id)&&!memory.bags[scope].includes(id)));
 memory.availableScope=scope;memory.available=[...ids];
 return {memory,scope};
}
export function archiveEventFamily(entry={}){
 if(entry.eventFamily)return entry.eventFamily;
 // Optional display URLs do not establish fact eligibility or event identity.
 // Keep the existing hostname grouping when present; use retained source
 // metadata for reviewed records whose publication link is not displayed.
 let source=entry.sourceName||entry.id||'unknown';
 try{if(entry.sourceUrl)source=new URL(entry.sourceUrl).hostname||source;}catch{/* A missing or malformed link is not a family. */}
 return source+':'+(entry.catalyst||entry.id||'news');
}
const family=archiveEventFamily;
function diverseChoice(bag,memory,revealedTopics){
 const last=byId.get(memory.recent.at(-1));
 const recent=memory.recent.slice(-Math.max(1,Math.floor(bag.length/2)));
 const tiers=[
  id=>!recent.includes(id)&&(!last||family(byId.get(id))!==family(last)&&byId.get(id).sourceName!==last.sourceName),
  id=>!recent.includes(id)&&(!last||family(byId.get(id))!==family(last)),
  id=>!recent.includes(id),
  id=>id!==last?.id
 ];
 for(const accepts of tiers){
  let index=-1,score=-1;
  for(let i=0;i<bag.length;i++)if(accepts(bag[i])){
   const match=archiveTopicMatch(byId.get(bag[i]),revealedTopics);
   if(match>score){index=i;score=match;}
  }
  if(index>=0)return index;
 }
 return 0;
}
export function selectArchiveNews(state,{slot,marketState=observedNewsState(state),revealedTopics=[]}={}){
 if(!validState(marketState)||typeof slot!=='string')return null;
 const context=newsContext(state),eligible=matchingNews(marketState,context);
 // Don't create save data in a context with no dated, currency-matched facts.
 if(!eligible.length){if(state.newsArchive){const {memory}=ensureMemory(state,context,[]);memory.active=null;}return null;}
 const {memory,scope}=ensureMemory(state,context,eligible),active=memory.active;
 // Revalidate before using a cached headline. Slot equality alone is unsafe.
 if(active?.slot===slot&&validState(active.marketState))return{entry:byId.get(active.id),marketState:active.marketState,context};
 const ids=eligible.map(e=>e.id);
 let bag=memory.bags[scope]||[];
 if(!bag.length)bag=shuffled(ids,hash(`${state.seed}:${scope}:${memory.serial}`));
 if(context.mode==='historical')bag.sort((a,b)=>newsAvailableAt(byId.get(b))-newsAvailableAt(byId.get(a)));
 const next=bag.findIndex(id=>id!==memory.recent.at(-1));
 const index=context.mode==='historical'?Math.max(0,next):diverseChoice(bag,memory,revealedTopics);
 const [id]=bag.splice(index,1);memory.bags[scope]=bag;
 memory.serial=memory.serial===Number.MAX_SAFE_INTEGER?0:memory.serial+1;
 memory.recent.push(id);memory.recent=memory.recent.slice(-NEWS_ARCHIVE.length);
 memory.active={slot,id,scope,marketState:{...marketState}};
 return{entry:byId.get(id),marketState:memory.active.marketState,context};
}
function fallbackNews(event,context){
 const historical=context.mode==='historical';
 if(event?.archiveId||historical&&(event?.swan||event?.contentKind==='fictional_market_event'))return {title:historical?'历史行情':'模拟行情',copy:'按当前报价继续交易。',source:historical?'历史外汇行情':'模拟行情',time:'',archiveKind:'行情记录',contentKind:'quote_record'};
 return historical?event:{...event,archiveKind:'模拟快讯',contentKind:'fictional_market_event'};
}
export function archiveNewsView(state,event,{flash=false}={}){
 const context=newsContext(state),historical=context.mode==='historical';
 // Synthetic exceptional events stay visibly separate from factual history.
 if(event?.swan)return fallbackNews(event,context);
 const beat=Number.isInteger(state.beat)?state.beat:0;
 const revealed=flash||state.lastEvent?.beat===beat||state.pending?.beat===beat&&state.pending.flashShown;
 const slot=historical?`history:${Math.floor(context.at/3600000)}`:`${state.day}:${beat}:${revealed?'reveal':'lead'}`;
 const selected=selectArchiveNews(state,{slot,revealedTopics:historical?[]:revealedNewsTopics(state,event,{flash})});
 if(!selected)return fallbackNews(event,context);
 const {entry,marketState}=selected;
 return{...event,title:entry.title,copy:entry.summary,source:entry.sourceName,time:entry.date,archiveKind:'新闻',archiveId:entry.id,sourceUrl:entry.sourceUrl,marketState,contentKind:'historical_fact',archiveTags:entry.currencies.join(' / '),sourceAttribution:entry.sourceAttribution||null,sourceLicenseUrl:entry.sourceLicenseUrl||null,summaryNotice:entry.summaryNotice||null};
}
