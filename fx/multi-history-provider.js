import {ResearchProvider} from './research-provider.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
export const MULTI_HISTORY_SYMBOLS=Object.freeze(['USD/JPY','AUD/JPY','GBP/JPY']);
const HASH=/^[a-f0-9]{64}$/;
// Local owner research only. Transport is scoped to the existing local catalog.
export class MultiHistoryProvider {
 #months=new Map();#entries;#fetch;#base;#cache=new Map();
 constructor(raw,{fetch=globalThis.fetch,baseURL}={}){
  const base=new URL(baseURL);
  if(!['http:','https:'].includes(base.protocol)||base.username||base.password||!['localhost','127.0.0.1','[::1]'].includes(base.hostname)||raw?.format!=='kurumi-local-multi-history-v1'||!HASH.test(raw.version)||!Array.isArray(raw.months)||!raw.months.length||raw.months.length>1200||typeof raw.id!=='string'||!raw.id||raw.id.length>100||raw.rights?.localResearchOnly!==true)throw Error('历史行情载入失败，请重试');
  this.#entries=raw.months;this.#fetch=fetch;this.#base=base;const dates=new Set();const ids=new Set();
  for(const e of raw.months){const m=e.manifest,key=m.symbol+':'+m.utcMonth;if(ids.has(key)||!MULTI_HISTORY_SYMBOLS.includes(m.symbol.slice(0,3)+'/'+m.symbol.slice(3))||!/^[-\w/.]+\.csv\.gz$/.test(e.path)||e.path.startsWith('/')||e.path.split('/').includes('..')||new URL(e.path,base).origin!==base.origin)throw Error('历史行情载入失败，请重试');ids.add(key);
   const p=new ResearchProvider(m,{multiCurrency:true,baseURL:'https://local.invalid/admin/research/months/'+m.symbol+'-'+m.utcMonth+'.json',fetch:(url,options)=>{if(new URL(url).pathname.split('/').at(-1)!==m.gzip.file)throw Error('历史行情载入失败，请重试');return this.#fetch(new URL(e.path,this.#base).href,{...options,credentials:'omit'});}});this.#months.set(key,p);for(const d of p.manifest.days)dates.add(d.date);
  }
  const allDays=[...dates].sort().filter(d=>MULTI_HISTORY_SYMBOLS.every(s=>[...this.#months.values()].some(p=>p.manifest.symbol===s.replace('/','')&&p.manifest.days.some(x=>x.date===d))));
  if(!allDays.length)throw Error('所选日期没有分钟行情');
  this.manifest=Object.freeze({schemaVersion:'research-multi-m1-close-v1',id:raw.id,version:raw.version,symbol:'MULTIJPY',symbols:MULTI_HISTORY_SYMBOLS,timeZone:'Asia/Tokyo',quoteType:'observed-single-close',gapThresholdMs:60000,source:{sha256:raw.version,url:'https://www.forexite.com/free_forex_quotes/forex_history_arhiv_2014.html'},research:{timestampMeaning:'unknown-open-or-close-label',quoteSide:'unverified-single-price-OHLC',availabilityModel:'label-plus-60-seconds',executionModel:'observed-close-only',spreadModel:'none',feesModel:'game-fee-rate'},days:allDays.map(date=>({date,sha256:raw.version,gaps:[]}))});
 }
 async loadDay(date){
  if(!this.manifest.days.some(d=>d.date===date))throw Error('所选日期没有分钟行情');if(this.#cache.has(date))return this.#cache.get(date);
  const groups=new Map(),sources={},used=new Set();
  for(const symbol of MULTI_HISTORY_SYMBOLS){const short=symbol.replace('/','');sources[symbol]=[];
   for(const p of this.#months.values()){if(p.manifest.symbol!==short||!p.manifest.days.some(d=>d.date===date))continue;used.add(p);const data=await p.loadDay(date);sources[symbol].push({id:p.manifest.id,version:p.manifest.version,sha256:p.manifest.source.sha256});for(const bar of data.bars){if(!groups.has(bar.availableAt))groups.set(bar.availableAt,{});const g=groups.get(bar.availableAt);if(g[symbol])throw Error('历史行情版本与存档不一致');g[symbol]=Object.freeze({...bar,sourceVersion:p.manifest.version});}}
  }
  const events=[...groups].sort(([a],[b])=>a-b).map(([at,bars])=>Object.freeze({at,bars:Object.freeze(bars)}));
  const result=Object.freeze({schemaVersion:this.manifest.schemaVersion,datasetId:this.manifest.id,datasetVersion:this.manifest.version,sha256:this.manifest.source.sha256,date,validated:true,sources:Object.freeze(sources),events:Object.freeze(events)});
  for(const p of this.#months.values())if(!used.has(p))p.clear();
  this.#cache.set(date,result);while(this.#cache.size>2)this.#cache.delete(this.#cache.keys().next().value);return result;
 }
}
