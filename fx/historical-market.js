import {MultiHistoryProvider} from './multi-history-provider.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {listImportedResearchPackages,inspectResearchPackage} from './research-import.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {RESEARCH_BUILD} from './research-config.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {ResearchProvider} from './research-provider.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {listImportedHistoricalPackages,inspectHistoricalPackage} from './historical-import.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {HistoricalProvider} from './historical-provider.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {acquireGameHistory} from './history-game.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {bindHistoricalDay,isHistorical} from './historical-replay.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {historicalSimulationActive} from './history-continuation.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {currentTradingTimestamp} from './trading-time.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {selectHistoricalOpening} from './historical-opening.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
const publicGameHistory=h=>h.version===1&&h.datasetId==='histdata-usdjpy-201402'&&h.date.startsWith('2014-02-');
const sameSavedSource=(m,h)=>m?.id===h.datasetId&&String(m.version)===h.sourceVersion&&m.source?.sha256===h.sourceHash&&m.days?.some(day=>day.date===h.date&&day.sha256===h.dayHash);
export class HistoricalMarketLibrary{
 constructor({baseURL=new URL('./',import.meta.url),fetch=globalThis.fetch,acquireHistory=acquireGameHistory,listHistoricalPackages=listImportedHistoricalPackages}={}){this.baseURL=baseURL;this.fetch=(...args)=>fetch(...args);this.acquireHistory=acquireHistory;this.listHistoricalPackages=listHistoricalPackages;this.datasets=[];this.providers=new Map();this.recovery=null;}
 async catalog({recovering=null}={}){
  if(RESEARCH_BUILD){const root=new URL('/admin/research/',this.baseURL);const res=await this.fetch(new URL('months/catalog.json',root),{credentials:'same-origin',cache:'no-store'});if(!res.ok)throw Error('本人研究行情载入失败');const c=await res.json();if(c.format!=='kurumi-private-research-catalog-v1'||c.researchAudience!=='owner-only'||c.mixSources!==false||!Array.isArray(c.entries))throw Error('研究目录不符');this.datasets=c.entries.filter(e=>e.sourceId==='forexite'&&e.precision==='M1-OHLC').map(e=>({id:'research-'+e.sourceId+'-'+e.month,label:e.month+' · Forexite 分钟研究',manifestURL:new URL(e.manifest,root).href,research:true}));if(this.datasets.some(d=>{const u=new URL(d.manifestURL);return u.origin!==root.origin||!u.pathname.startsWith('/admin/research/months/')||u.search||u.hash;}))throw Error('研究来源必须为本人同站月份');return this.datasets;}
  const url=new URL('historical-catalog.json',this.baseURL);let datasets=[];try{const res=await this.fetch(url,{signal:AbortSignal.timeout(15000)});if(res.ok)datasets=(await res.json()).datasets||[];}catch{}
  // Local research data never becomes a public catalog or a production fallback.
  if(['localhost','127.0.0.1','[::1]'].includes(url.hostname))try{const local=await this.fetch(new URL('historical-local/catalog.json',this.baseURL));if(local.ok)datasets=[...datasets,...(await local.json()).datasets];}catch{}
  this.datasets=datasets.map(d=>({...d,manifestURL:new URL(d.manifestURL,this.baseURL).href})).filter(d=>new URL(d.manifestURL).origin===url.origin);
  const imported=await this.listHistoricalPackages();
  for(const row of imported){const url='local-package:'+encodeURIComponent(row.key);let inspected;try{inspected=await inspectHistoricalPackage(row.file);}catch(error){if(recovering&&publicGameHistory(recovering)&&sameSavedSource(row.manifest,recovering))continue;throw error;}this.providers.set(url,inspected.provider);this.datasets.push({id:row.key,label:row.label,manifestURL:url,local:true});}
  for(const row of await listImportedResearchPackages()){const url='local-research:'+encodeURIComponent(row.key);const inspected=await inspectResearchPackage(row.file);this.providers.set(url,inspected.provider);this.datasets.push({id:row.key,label:row.label,manifestURL:url,local:true,research:true});}
  return this.datasets;
 }
 async provider(dataset){
  const url=dataset.manifestURL;if(this.providers.has(url))return this.providers.get(url);
  const res=await this.fetch(url,{credentials:dataset.research?'same-origin':'omit',cache:'no-store',redirect:dataset.research||dataset.multiHistorical?'error':'follow'});if(!res.ok)throw Error('历史行情载入失败，请重试');
  const manifest=await res.json();const provider=dataset.multiHistorical?new MultiHistoryProvider(manifest,{fetch:this.fetch,baseURL:url}):dataset.research?new ResearchProvider(manifest,{fetch:this.fetch,baseURL:url}):new HistoricalProvider(manifest,{fetch:this.fetch,baseURL:url});this.providers.set(url,provider);return provider;
 }
 async options(id,date){const dataset=this.datasets.find(d=>d.id===id);if(!dataset)throw Error('暂时没有可用的历史行情');const p=await this.provider(dataset),dayData=await p.loadDay(date);return{manifest:p.manifest,dayData,startDate:date,manifestURL:dataset.manifestURL,opening:selectHistoricalOpening(p.manifest,dayData)};}
 savedDataset(h){
  return this.datasets.find(d=>d.manifestURL===h.manifestURL)||this.datasets.find(d=>{
   // Imported packages may be restored under a different local storage URL.
   // Reuse only an identical source, version and source-day hash; binding below
   // still validates the saved cursor and its exact last observed quote.
   if(h.version!==1||!d.local||d.research)return false;
   const m=this.providers.get(d.manifestURL)?.manifest;
   return sameSavedSource(m,h);
  });
 }
 async recoverPublicPackage(h){
  if(!publicGameHistory(h))return false;
  if(!this.recovery)this.recovery=Promise.resolve().then(()=>this.acquireHistory({datasets:['2014-02'],signal:AbortSignal.timeout(120000)})).then(()=>this.catalog({recovering:h})).finally(()=>{this.recovery=null;});
  await this.recovery;return true;
 }
 async restore(state){
  if(!isHistorical(state))return;const h=state.historical;let dataset=this.savedDataset(h),recovered=false;
  if(!dataset){
   await this.catalog({recovering:h});dataset=this.savedDataset(h);
   // Browser storage can be evicted independently of the player's save. Only
   // the already shipped public game package is eligible for automatic repair.
   if(!dataset){
    recovered=await this.recoverPublicPackage(h);dataset=this.savedDataset(h);
   }
  }
  if(!dataset)throw Error('此存档的历史行情源暂不可用');let p=await this.provider(dataset);
  for(;;){
   const date=h.date,dayHash=h.dayHash;let data;
   try{data=await p.loadDay(date);}catch(error){
    if(recovered||!await this.recoverPublicPackage(h))throw error;
    recovered=true;dataset=this.savedDataset(h);if(!dataset)throw error;p=await this.provider(dataset);continue;
   }
   // Simulated continuation can finish a game day during a slow load. Never
   // bind the previous source day to a state that has already moved forward.
   if(h.date!==date||h.dayHash!==dayHash)continue;
   bindHistoricalDay(state,p.manifest,data);delete h.error;return;
  }
 }
}
// Pure chronological batching: all intermediate ticks execute, only paint is coalesced.
export function advanceHistoricalBatch(state,step,{speed=1,maxTicks=256,budgetMs=8,now=()=>performance.now()}={}){
 const start=now(),until=currentTradingTimestamp(state)+7500*speed,exits=[];let result=null,count=0,candleClosed=false,gapDurationMs=0;
 while(count<maxTicks&&now()-start<budgetMs){
  if(state.marketPaused||state.historical.status!=='ready'&&!historicalSimulationActive(state))break;
  result=step(state);count++;exits.push(...(result.exits||[]));candleClosed ||= !!result.candleClosed;gapDurationMs=Math.max(gapDurationMs,result.gapDurationMs||0);
  if(result.blocked||result.dayEnded||result.sourceBoundary||currentTradingTimestamp(state)>=until||!['decision','playing'].includes(state.phase))break;
 }
 return result?{...result,exits,exit:exits[0]||null,candleClosed,batchTicks:count,...(gapDurationMs?{gapDurationMs}:{})}:null;
}
