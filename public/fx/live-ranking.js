import {hasLotteryCheat} from './lottery-ranking.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {isSharedReplay} from './shared-replay-state.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {liveLeaderboardScore,hasLiveTradingActivity} from './finished-score.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {hasDevelopmentTaint} from './development-taint.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {hasHistoricalSimulation} from './history-continuation.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
const RECEIPTS='fx-api-v1-live-ranking-receipts',LIMIT=16;
const fingerprint=score=>Object.fromEntries(['closedTrades','day','totalProfit','daysSurvived','netAssets','openPositionCount'].map(key=>[key,score[key]]));
// Retain the compact legacy receipt for older tabs, but compare every public
// aggregate. Margin top-ups, debt and active play time need not change equity.
async function scoreHash(score){
 const bytes=new TextEncoder().encode(JSON.stringify(Object.keys(score).sort().map(key=>[key,score[key]])));
 return [...new Uint8Array(await globalThis.crypto.subtle.digest('SHA-256',bytes))].map(byte=>byte.toString(16).padStart(2,'0')).join('');
}
function readReceipt(storage){
 if(typeof storage?.readItem==='function'){
  const result=storage.readItem(RECEIPTS);
  if(result?.available!==true)throw Error('receipt-storage');
  return result.value;
 }
 return storage.getItem(RECEIPTS);
}
// Bounded local receipts only: no payload queue, identity, or offline replay.
function receipts(storage){
 if(!storage?.getItem||!storage?.setItem)throw Error('receipt-storage');
 const raw=readReceipt(storage);if(raw===null)return [];
 if(typeof raw!=='string'||raw.length>12000)throw Error('receipt-storage');
 const list=JSON.parse(raw);
 if(!Array.isArray(list)||list.length>LIMIT||list.some(r=>!r||!/^[a-zA-Z0-9_-]{8,80}$/.test(r.id)||!Number.isFinite(r.nextAt)||r.nextAt<0||!Number.isInteger(r.attempts)||r.attempts<0||r.attempts>3||!Number.isFinite(r.lastSuccess)||r.lastSuccess<0||r.scoreHash!=null&&!/^[a-f0-9]{64}$/.test(r.scoreHash)||r.score!==null&&(!r.score||Object.keys(r.score).length!==6||['closedTrades','day','totalProfit','daysSurvived','openPositionCount'].some(k=>!Number.isFinite(r.score[k]))||r.score.netAssets!==null&&!Number.isFinite(r.score.netAssets))))throw Error('receipt-storage');
 return list;
}
// Only saved, visible gameplay can schedule work. There is no offline outbox.
export class LiveRanking {
 constructor({client,storage,getState,persist,report,isBlocked=()=>false,enabled=()=>true,visible=()=>true,online=()=>true,now=Date.now,schedule=(...args)=>globalThis.setTimeout(...args),cancel=id=>globalThis.clearTimeout(id),interval=90000,onSubmitted=()=>{}}={}){
  Object.assign(this,{client,storage,getState,persist,report,isBlocked,enabled,visible,online,now,schedule,cancel,onSubmitted});this.interval=Math.max(90000,Math.min(120000,interval));this.timer=null;this.timerCampaign=null;this.pending=null;this.runs=new Map();
 }
 clear(){if(this.timer!==null)this.cancel(this.timer);this.timer=null;this.timerCampaign=null;}
 eligible(){try{const s=this.getState();return !hasLotteryCheat(s)&&!isSharedReplay(s)&&this.enabled()&&!this.isBlocked()&&this.online()&&!hasHistoricalSimulation(s)&&s?.phase!=='ending'&&![2,3].includes(s?.historical?.version)&&!!s?.runId&&this.client?.configuration?.configured&&hasLiveTradingActivity(s)&&!hasDevelopmentTaint(s,this.storage);}catch{return false;}}
 update(){if(!this.eligible()||!this.visible()){this.clear();return;}const campaign=this.getState().runId;if(this.timer!==null&&this.timerCampaign!==campaign)this.clear();const run=this.record();if(run.attempts>=3){this.clear();return;}if(this.timer!==null)return;this.timerCampaign=campaign;this.timer=this.schedule(()=>{this.timer=null;this.timerCampaign=null;void this.submit().finally(()=>this.update());},Math.max(1000,run.nextAt-this.now()));}
 record(){const id=this.getState().runId;if(!this.runs.has(id)){
  let r;try{r=receipts(this.storage).find(r=>r.id===id);}catch{r={attempts:3,storageBlocked:true};}
  this.runs.set(id,{nextAt:this.now()+1000,attempts:0,lastSuccess:0,score:null,scoreHash:null,...r});
  if(this.runs.size>LIMIT)this.runs.delete(this.runs.keys().next().value);
 }return this.runs.get(id);}
 saveReceipt(id,run){
  const list=receipts(this.storage).filter(r=>r.id!==id);
  list.push({id,nextAt:run.nextAt,attempts:run.attempts,lastSuccess:run.lastSuccess,score:run.score?fingerprint(run.score):null,scoreHash:run.scoreHash});
  const value=JSON.stringify(list.slice(-LIMIT));
  if(this.storage.setItem(RECEIPTS,value)===false||readReceipt(this.storage)!==value)throw Error('receipt-storage');
 }
 async submit({leaving=false}={}){
  if(this.pending)return this.pending;
  if(!this.eligible()||!leaving&&!this.visible())return {submitted:false};
  const run=this.record(),campaign=this.getState().runId;
  if(this.now()<run.nextAt||run.attempts>=3)return {submitted:false};
  // Pagehide may only reuse an already registered capability, never create one.
  if(leaving){try{if(!this.client.registered?.has(campaign)||!this.client.storedToken?.(campaign))return {submitted:false};}catch{return {submitted:false,reason:'storage'};}}
  run.nextAt=this.now()+this.interval;
  const task=Promise.resolve().then(async()=>{
   try{
    // persist() captures synchronously; freeze that same state before awaiting
    // the durable write, rather than publishing later, still-unsaved ticks.
    const source=this.getState(),saving=this.persist(),state=structuredClone(source);
    const allowed=()=>this.eligible()&&(leaving||this.visible())&&this.getState()===source&&source.runId===campaign;
    if(await saving!==true||!allowed())return {submitted:false};
    const report=this.report(state),score=liveLeaderboardScore(state,report,{storage:this.storage}),hash=await scoreHash(score);
    if(!allowed())return {submitted:false};
    // Another page or an interrupted previous request may have recorded a lease.
    const saved=receipts(this.storage).find(r=>r.id===campaign);
    if(saved){if(saved.nextAt>this.now()||saved.attempts>=3){Object.assign(run,saved);return {submitted:false};}run.score=saved.score;run.scoreHash=saved.scoreHash??null;run.lastSuccess=saved.lastSuccess;run.attempts=saved.attempts;}
    if(run.scoreHash===hash)return {submitted:false,duplicate:true};
    // Persist a conservative retry receipt before networking. A refresh during
    // the request retains backoff even if the success acknowledgement is lost.
    run.attempts++;run.nextAt=this.now()+Math.min(600000,this.interval*2**run.attempts);
    this.saveReceipt(campaign,run);
    const result=await this.client.publishSnapshot(state,report,{snapshotVersion:this.now(),keepalive:leaving,isAllowed:allowed});
    if(result?.ok!==true)throw Error('unconfirmed');
    run.score=score;run.scoreHash=hash;run.attempts=result.finalized?3:0;run.lastSuccess=this.now();run.nextAt=this.now()+this.interval;
    this.saveReceipt(campaign,run);
    if(!leaving&&this.visible())try{this.onSubmitted(result);}catch{}
    return {submitted:true,...result};
   }catch(error){
    if(['no-trades','ineligible','lottery-cheat','lottery-unavailable'].includes(error.code))return {submitted:false,reason:error.code};
    if(error.message==='receipt-storage'||error instanceof SyntaxError){run.attempts=3;run.storageBlocked=true;return {submitted:false,reason:'storage'};}
    // Attempt/backoff were durably recorded before publishSnapshot.
    if(error.status>=400&&error.status<500&&![409,429].includes(error.status))run.attempts=3;
    try{this.saveReceipt(campaign,run);}catch{run.attempts=3;run.storageBlocked=true;}
    return {submitted:false,reason:error.code||'network'};
   }finally{this.pending=null;}
  });this.pending=task;return task;
 }
 // Connectivity changes never erase retry receipts or shorten their backoff.
 resume(){this.update();}
}

export function achievementBroadcast(row){
 if(!row||!['story','endless'].includes(row.gameMode)||typeof row.name!=='string'||!Number.isFinite(row.totalProfit)||row.totalProfit<=0||row.closedTrades<1)return null;
 const name=[...row.name.normalize('NFKC').replace(/[\u0000-\u001f\u007f<>]/g,'')].slice(0,16).join('')||'匿名交易员';
 return `榜单播报 · ${name}已实现净交易盈利 ¥${Math.round(row.totalProfit).toLocaleString('zh-CN')} · ${row.gameMode==='endless'?'操盘':'剧情'}${row.gameFinished?'已结束':'进度成绩'}`;
}
// One noninteractive floating line, never a fabricated player quotation.
export class LeaderboardBroadcast {
 constructor({client,root,enabled=()=>true,visible=()=>true,now=Date.now,schedule=(...args)=>globalThis.setTimeout(...args),cancel=id=>globalThis.clearTimeout(id)}={}){Object.assign(this,{client,root,enabled,visible,now,schedule,cancel});this.nextAt=0;this.pending=false;this.failures=0;this.seen=new Set();this.timer=null;}
 clear(){if(this.timer!==null)this.cancel(this.timer);this.timer=null;this.root?.replaceChildren();}
 async refresh(gameMode){
  if(!this.enabled()||!this.visible()||this.pending||this.failures>=3||this.now()<this.nextAt)return;
  this.nextAt=this.now()+180000;this.pending=true;
  try{
   const data=await this.client.read({mode:'total',gameMode,sort:'totalProfit',limit:10});this.failures=0;
   if(!this.enabled()||!this.visible())return;
   for(const row of data.rows){const text=achievementBroadcast(row),key=JSON.stringify([row.name,row.created,row.totalProfit,row.closedTrades]);if(!text||this.seen.has(key))continue;this.seen.add(key);if(this.seen.size>100)this.seen.delete(this.seen.values().next().value);this.clear();this.root.textContent=text;this.timer=this.schedule(()=>this.clear(),10000);break;}
  }catch{this.failures++;this.nextAt=this.now()+180000*2**this.failures;}
  finally{this.pending=false;}
 }
}
