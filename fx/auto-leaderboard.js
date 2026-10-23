import {hasLotteryCheat} from './lottery-ranking.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {isSharedReplay} from './shared-replay-state.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {hasDevelopmentTaint} from './development-taint.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {hasHistoricalSimulation} from './history-continuation.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
const ID=/^[a-zA-Z0-9_-]{8,80}$/;
const ENDINGS=new Set(['million','walkaway','broke','crisis']);
const receiptKey=run=>'fx-api-v1-finished-score-'+run;
const manualFailures=new Set(['lottery-cheat','lottery-unavailable','shared-replay','invalid-score','no-trades','developer','mixed-historical','private-research','ineligible','unfinished','missing-run','input','capability','capability-conflict','storage-unavailable','coordination']);
export function automaticRankingStatusText(result={}){
 const reason=result.reason;
 if(reason==='lottery-cheat')return '暗号彩票局不会进入公共排行榜。';
 if(reason==='lottery-unavailable')return '排行榜尚未支持彩票奖金，本局成绩暂未提交。';
 if(result.state==='submitted')return '本局成绩已自动上榜，可在名人堂修改昵称。';
 if(result.state==='submitting')return '正在自动提交匿名终局成绩…';
 if(result.state==='retry-pending')return '成绩暂未确认，稍后会自动重试。';
 if(result.state==='unconfigured')return '名人堂暂未接通，请稍后再试。';
 if(reason==='developer')return '开发测试局不会进入正式名人堂。';
 if(['mixed-historical','private-research'].includes(reason))return '历史行情局不进入名人堂。';
 if(reason==='no-trades')return '本局还没有可上榜的成交记录。';
 if(reason==='save-pending')return '本局进度尚未保存成功，请先重试保存。';
 if(reason==='storage-unavailable'||reason==='coordination')return '成绩提交凭证尚未保存成功，请稍后重试。';
 if(['capability','capability-conflict'].includes(reason))return '本局提交凭证需要核对，请保留存档并重新载入。';
 if(reason==='conflict')return '本局最终成绩与已提交记录不一致，未改写榜单。';
 if(reason==='rejected'||reason==='invalid-score')return '成绩未通过校验，暂未上榜，请保留存档。';
 if(reason==='stale')return '本局状态已变化，请重试提交当前成绩。';
 return '成绩暂未提交，请稍后重试。';
}
// Only a terminal game is eligible. A normal daily settlement is not game-over.
export function terminalRankingEligibility(state,report,storage){
 if(hasLotteryCheat(state))return {eligible:false,reason:'lottery-cheat'};
 if(isSharedReplay(state))return {eligible:false,reason:'shared-replay'};
 if(hasHistoricalSimulation(state))return {eligible:false,reason:'mixed-historical'};
 if([2,3].includes(state?.historical?.version))return {eligible:false,reason:'private-research'};
 if(!ID.test(state?.runId||''))return {eligible:false,reason:'missing-run'};
 if(state.phase!=='ending'||!ENDINGS.has(state.ending?.id)||report?.gameFinished!==true||report?.completionReason!==state.ending.id||report?.eligibility?.gameFinished!==true)return {eligible:false,reason:'unfinished'};
 try{if(hasDevelopmentTaint(state,storage)||report.eligibility.developmentTaint!==false)return {eligible:false,reason:'developer'};}catch{return {eligible:false,reason:'storage-unavailable'};}
 if(report?.eligibility?.rankingEligible!==true)return {eligible:false,reason:'ineligible'};
 return {eligible:true,reason:null};
}
// The caller passes the local report, but the client serializes only its fixed
// score allowlist. Neither reports nor transaction logs are persisted here.
export class AutomaticLeaderboard {
 constructor({client,storage,now=()=>Date.now(),onStatus=()=>{}}={}){this.client=client;this.storage=storage;this.now=now;this.onStatus=onStatus;this.inFlight=new Map();this.completed=new Set();this.retries=new Map();}
 status(value){try{this.onStatus(value);}catch{}}
 async submitIfFinished(state,report){
  const eligibility=terminalRankingEligibility(state,report,this.storage);
  if(!eligibility.eligible){this.status({state:'not-submitted',reason:eligibility.reason});return {submitted:false,...eligibility};}
  const campaign=state.runId;
  if(!this.client?.configuration?.configured){this.status({state:'unconfigured'});return {submitted:false,reason:'service-unconfigured'};}
  try{if(this.completed.has(campaign)||this.storage.getItem(receiptKey(campaign))==='1')return {submitted:true,duplicate:true};}catch{this.status({state:'not-submitted',reason:'storage-unavailable'});return {submitted:false,reason:'storage-unavailable'};}
  if(this.inFlight.has(campaign))return this.inFlight.get(campaign);
  const retry=this.retries.get(campaign);if(retry&&this.now()<retry.nextAt)return {submitted:false,reason:'backoff',retryAt:retry.nextAt};
  this.status({state:'submitting'});
  const task=Promise.resolve().then(async()=>{
   try{
    // Snapshot only inside the explicit network client. It rechecks eligibility
    // and permanent taint before registering or publishing the capability.
    const result=await this.client.publishFinished(state,report,{alias:''});
    if(result?.ok!==true)throw Object.assign(Error('成绩未获确认'),{code:'response'});
    this.completed.add(campaign);this.retries.delete(campaign);
    try{this.storage.setItem(receiptKey(campaign),'1');}catch{}
    this.status({state:'submitted',duplicate:!!result.duplicate});return {submitted:true,...result};
   }catch(error){
    const reason=error.code||'network';
    if(manualFailures.has(reason)||error.status>=400&&error.status<500&&![408,425,429].includes(error.status)){
     this.retries.delete(campaign);this.status({state:'not-submitted',reason});
     return {submitted:false,reason};
    }
    const attempts=(retry?.attempts||0)+1,nextAt=this.now()+Math.min(60000,1000*2**Math.min(attempts,6));
    this.retries.set(campaign,{attempts,nextAt});this.status({state:'retry-pending',reason,code:reason,retryAt:nextAt});
    return {submitted:false,reason,retryAt:nextAt};
   }finally{this.inFlight.delete(campaign);}
  });
  this.inFlight.set(campaign,task);return task;
 }
}
