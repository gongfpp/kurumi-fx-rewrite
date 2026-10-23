// Historical data transport only. No prices are generated, interpolated or repaired.
import {describeHistoricalCoverage} from './history-coverage.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
export const EMPTY_HISTORICAL_CATALOG=Object.freeze({schemaVersion:1,datasets:Object.freeze([])});
const DAY=86400000,JST=9*3600000,HASH=/^[a-f0-9]{64}$/;
const DATE=/^\d{4}-\d{2}-\d{2}$/;
const fail=message=>{throw new Error(`Historical data: ${message}`);};
const frozen=value=>{if(value&&typeof value==='object'){for(const v of Object.values(value))frozen(v);Object.freeze(value);}return value;};
const clone=value=>JSON.parse(JSON.stringify(value));
export function historicalJSTDate(timestamp){return new Date(timestamp+JST).toISOString().slice(0,10);}
function validDate(date){return typeof date==='string'&&DATE.test(date)&&new Date(date+'T00:00:00Z').toISOString().slice(0,10)===date;}
function integer(n){return Number.isSafeInteger(n)&&n>=0;}
function validGap(g){return g&&integer(g.fromMs)&&integer(g.toMs)&&g.toMs>g.fromMs&&['unexplained_observation_gap','weekend_closure_candidate','verified_closure'].includes(g.classification)&&typeof g.classificationBasis==='string'&&(g.classification!=='verified_closure'||typeof g.calendarSource==='string'&&g.calendarSource.length>0);}
export function validateHistoricalManifest(input){
 if(!input||input.schemaVersion!==1||typeof input.id!=='string'||!input.id||!['string','number'].includes(typeof input.version)||!String(input.version)||input.symbol!=='USDJPY'||input.timeZone!=='Asia/Tokyo'||input.quoteType!=='bid-ask'||!integer(input.gapThresholdMs)||input.gapThresholdMs===0||!input.source||!HASH.test(input.source.sha256)||typeof input.source.url!=='string'||!Array.isArray(input.days)||!input.days.length)fail('invalid manifest');
 let prior=null;
 for(const d of input.days){
  if(!validDate(d.date)||typeof d.url!=='string'||!d.url||!HASH.test(d.sha256)||!integer(d.bytes)||d.bytes<1||d.bytes>32*1024*1024||!integer(d.count)||d.count===0||!integer(d.first)||!integer(d.last)||d.last<d.first||historicalJSTDate(d.first)!==d.date||historicalJSTDate(d.last)!==d.date||!Array.isArray(d.gaps)||!d.gaps.every(validGap)||d.gapBefore!=null&&!validGap(d.gapBefore))fail('invalid day descriptor');
  if(prior&&(d.date<=prior.date||d.first<prior.last))fail('days are not ordered');
  if(prior){const expected=d.first-prior.last>input.gapThresholdMs;if(expected!==Boolean(d.gapBefore)||expected&&(d.gapBefore.fromMs!==prior.last||d.gapBefore.toMs!==d.first))fail('cross-day gap mismatch');}
  else if(d.gapBefore!=null)fail('first day has an unbound gap');
  prior=d;
 }
 return frozen(clone(input));
}
async function sha256(bytes){if(!globalThis.crypto?.subtle)fail('SHA-256 unavailable');return Array.from(new Uint8Array(await globalThis.crypto.subtle.digest('SHA-256',bytes)),b=>b.toString(16).padStart(2,'0')).join('');}
function validateChunk(payload,entry,manifest){
 if(!payload||payload.schemaVersion!==1||payload.datasetId!==manifest.id||String(payload.datasetVersion)!==String(manifest.version)||payload.date!==entry.date||payload.timeZone!=='Asia/Tokyo'||!Array.isArray(payload.ticks)||payload.ticks.length!==entry.count)fail('chunk identity/count mismatch');
 let previous=null;const gaps=[];
 for(const row of payload.ticks){
  if(!Array.isArray(row)||row.length!==3||!integer(row[0])||!Number.isFinite(row[1])||row[1]<=0||!Number.isFinite(row[2])||row[2]<row[1]||historicalJSTDate(row[0])!==entry.date)fail('invalid tick');
  if(previous!==null){if(row[0]<previous)fail('tick timestamps reversed');if(row[0]-previous>manifest.gapThresholdMs)gaps.push([previous,row[0]]);}
  previous=row[0];
 }
 if(payload.ticks[0][0]!==entry.first||payload.ticks.at(-1)[0]!==entry.last||gaps.length!==entry.gaps.length||gaps.some((g,i)=>g[0]!==entry.gaps[i].fromMs||g[1]!==entry.gaps[i].toMs))fail('coverage/gap mismatch');
 return frozen({...payload,sha256:entry.sha256,count:entry.count,first:entry.first,last:entry.last,gaps:clone(entry.gaps),gapBefore:entry.gapBefore?clone(entry.gapBefore):null,validated:true});
}
export class HistoricalProvider{
 #manifest;#fetch;#base;#cache=new Map();#pending=new Map();#generation=0;
 constructor(manifest,{fetch:fetchFn=globalThis.fetch,baseURL=globalThis.location?.href||'http://localhost/'}={}){this.#manifest=validateHistoricalManifest(manifest);if(typeof fetchFn!=='function')fail('fetch unavailable');this.#fetch=(...args)=>fetchFn(...args);this.#base=baseURL;}
 get manifest(){return this.#manifest;}
 get coverage(){return describeHistoricalCoverage(this.#manifest);}
 get cachedDates(){return [...this.#cache.keys()];}
 clear(){this.#cache.clear();this.#pending.clear();this.#generation++;}
 async loadDay(date){
  const entry=this.#manifest.days.find(d=>d.date===date);if(!entry)fail('date outside verified coverage');
  if(this.#cache.has(date)){const data=this.#cache.get(date);this.#cache.delete(date);this.#cache.set(date,data);return data;}
  if(this.#pending.has(date))return this.#pending.get(date);
  const generation=this.#generation;
  const promise=(async()=>{
   const url=new URL(entry.url,this.#base);if(!['http:','https:'].includes(url.protocol)||url.username||url.password)fail('unsafe chunk URL');
   const response=await this.#fetch(url.href,{credentials:'omit',cache:'no-cache'});if(!response?.ok)fail(`chunk load failed (${response?.status??'network'})`);
   const bytes=await response.arrayBuffer();if(bytes.byteLength>32*1024*1024)fail('chunk exceeds 32 MiB');if(bytes.byteLength!==entry.bytes)fail('chunk byte length mismatch');
   if(await sha256(bytes)!==entry.sha256)fail('chunk SHA-256 mismatch');
   let payload;try{payload=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));}catch{fail('invalid chunk JSON');}
   const data=validateChunk(payload,entry,this.#manifest);
   if(generation!==this.#generation)fail('load invalidated');
   this.#cache.set(date,data);while(this.#cache.size>2)this.#cache.delete(this.#cache.keys().next().value);
   return data;
  })();
  this.#pending.set(date,promise);try{return await promise;}finally{if(this.#pending.get(date)===promise)this.#pending.delete(date);}
 }
}
