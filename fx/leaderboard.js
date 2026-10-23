import {assertLotteryRankingEligible,lotteryScoreFields,lotteryScoreForServer} from './lottery-ranking.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {isSharedReplay} from './shared-replay-state.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {randomUUID} from './uuid.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {notifyFailure} from './error-reporting.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {VOLATILITY_FIELDS} from './daily-volatility.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
export const LEADERBOARD_SORTS = Object.freeze(['survival','returnRate','dailyReturnRate','totalProfit','totalLoss','maxProfit','winRate','maxOrderLoss','maxDrawdown','dailyVolatility']);
const LEGACY_SORTS=Object.freeze(LEADERBOARD_SORTS.filter(sort=>!['totalLoss','maxDrawdown','dailyVolatility'].includes(sort)));
const sortNotice=sort=>`${({totalLoss:'累计亏损榜',maxDrawdown:'回撤榜',dailyVolatility:'日收益波动榜'})[sort]||'这个榜单'}尚未开放。`;
import {HALL_FIELDS,hallScoreForServer} from './hall-metrics.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {finishedLeaderboardScore,liveLeaderboardScore} from './finished-score.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {hasDevelopmentTaint} from './development-taint.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {kurumiStorage} from './storage-namespace.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {serviceConfiguration,SERVICE_UNCONFIGURED_MESSAGE} from './service-config.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {runPerformance} from './performance.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {BEATS_PER_DAY,CANDLES_PER_BEAT} from './engine.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
// Optional public score publishing is independent of anonymous usage statistics.
// Only publish() writes; reading the board never creates a run or an identifier.
const ID = /^[a-zA-Z0-9_-]{8,80}$/;
const defaultStorage = () => {try{return kurumiStorage();}catch{return null;}};
const get = (storage,key) => {try{return storage?.getItem(key);}catch{return null;}};
const put = (storage,key,value) => {try{storage?.setItem(key,value);}catch{}};
const cents = value => Math.round((value + Number.EPSILON) * 100) / 100;
export function normalizeLeaderboardAlias(value='') {
  if(typeof value !== 'string') throw new Error('昵称最多 16 字，可用中英文、数字、空格、点、横线和下划线');
  const alias=value.normalize('NFKC').trim().replace(/\s+/g,' ');
  if([...alias].length>16 || !/^[\p{L}\p{N} ._-]*$/u.test(alias)) throw new Error('昵称最多 16 字，可用中英文、数字、空格、点、横线和下划线');
  return alias;
}
export function completedLeaderboardScore(state) {
  assertLotteryRankingEligible(state);
  if(isSharedReplay(state))throw Object.assign(Error('Shared replay is excluded from ranking'),{code:'shared-replay'});
  const report=state?.dayReport,gameMode=state?.mode??'story';
  if(state?.developer?.edited) throw new Error('开发者测试局不能提交排行榜');
  if(!['story','endless'].includes(gameMode))throw new Error('游戏模式不正确');
  if(!Array.isArray(state?.history))throw new Error('本局成绩数据不完整');
  if(gameMode==='story'&&(!report||!Number.isInteger(report.day)||report.day<1||report.day>state.day||!Array.isArray(report.trades)||!report.trades.length))throw new Error('完成至少一笔交易并收盘后，可以提交成绩');
  if(gameMode==='story'&&report.livingSettlement?.status==='pending')throw new Error('请先结清今日生活费，再提交完整成绩');
  const day=gameMode==='story'?report.day:state.day;
  const daily=gameMode==='story'?report.trades:state.history.filter(t=>t.day===day),all=state.history.filter(trade=>trade.day<=day);
  if([...daily,...all].some(trade=>!Number.isFinite(trade.pnl)))throw new Error('本局成绩数据不完整');
  const dayProfit=cents(daily.reduce((sum,trade)=>sum+trade.pnl,0));
  // Preserve historical calls from pre-mode saves without inventing extrema.
  if(!state.mode&&!state.performance){
    if(!all.length||all.length>20000)throw new Error('本局成绩数据不完整');
    const totalProfit=cents(all.reduce((sum,trade)=>sum+trade.pnl,0));
    if(Math.abs(dayProfit)>1e10||Math.abs(totalProfit)>1e10)throw new Error('本局成绩超过排行榜范围');
    return {day,dayProfit,totalProfit,closedTrades:all.length,...lotteryScoreFields(state)};
  }
  // A saved report is a snapshot; current-day beat/bonus rounds must never
  // shorten yesterday's elapsed time or alter its daily return rate.
  const reportBeat=gameMode==='story'?(report.beat??((report.completedDays??0)>=day?BEATS_PER_DAY:Math.max(0,Math.min(BEATS_PER_DAY,((report.completedCandles??day*16)-(day-1)*16)/CANDLES_PER_BEAT)))):0;
  const performance=gameMode==='story'?runPerformance({...state,history:all,performance:report.performance,day,beat:reportBeat,bonusBeats:report.bonusBeats??0,phase:'day_end',pending:null,completedDays:report.completedDays,completedCandles:report.completedCandles}):runPerformance(state);
  const closedTrades=performance.closedTrades??all.length;
  if(!closedTrades)throw new Error(gameMode==='endless'?'完成至少一笔平仓交易后，可以提交成绩':'本局成绩数据不完整');
  if(!Number.isFinite(performance.totalProfit)||Math.abs(performance.totalProfit)>1e10||Math.abs(dayProfit)>1e10)throw new Error('本局成绩超过排行榜范围');
  const totalProfit=cents(performance.totalProfit),initialEquity=performance.initialEquity??state.startEquity??100000,returnRate=totalProfit/initialEquity;
  return {...lotteryScoreFields(state),day,dayProfit,totalProfit,closedTrades,gameMode,initialEquity,daysSurvived:performance.daysSurvived,elapsedDays:performance.elapsedDays,returnRate,dailyReturnRate:returnRate/performance.elapsedDays,maxLoss:cents(performance.maxLoss),maxProfit:cents(performance.maxProfit),maxDrawdown:performance.maxDrawdown};
}
export function buildLeaderboardSubmission(state,{campaign=state?.runId,token,alias=''}={}) {
  if(!ID.test(campaign||''))throw new Error('本局缺少游戏标识，请重新打开游戏后再试');
  if(!/^[a-f0-9]{64}$/.test(token||''))throw new Error('本局缺少提交凭证');
  return {campaign,token,...completedLeaderboardScore(state),alias:normalizeLeaderboardAlias(alias),settled:(state?.mode??'story')==='story',developerEdited:false};
}
export class LeaderboardError extends Error {
  constructor(message,code='unavailable',status=0){super(message);this.name='LeaderboardError';this.code=code;this.status=status;}
}
export class FXLeaderboard {
  constructor(options={}) {
    this.fetch=options.fetch??globalThis.fetch?.bind(globalThis);
    this.storage=options.storage??defaultStorage();
    this.crypto=options.crypto??globalThis.crypto;
    this.navigator=options.navigator??globalThis.navigator;
    this.locks=options.locks??this.navigator?.locks;
    const location=options.location??globalThis.location;
    this.configuration=serviceConfiguration({serviceOrigin:options.serviceOrigin,location});
    this.endpoint=this.configuration.leaderboardEndpoint;
    this.onStatus=options.onStatus??(()=>{});this.onFailure=options.onFailure??(()=>{});this.timeout=options.timeout??10000;
    this.lotterySupported=new Set();this.registered=new Set();this.hallSupported=new Set();this.volatilitySupported=new Set();this.pending=false;this.capabilities=new Map();this.session=null;this.sortCapabilities=null;
  }
  status(value){try{this.onStatus(value);}catch{}}
  assertConfigured() {if(!this.configuration.configured)throw new LeaderboardError(SERVICE_UNCONFIGURED_MESSAGE,'service-unconfigured');}
  async request(path,{method='GET',data,keepalive=false}={}) {
    this.assertConfigured();
    const scope=path==='/run'?'leaderboard-run':path==='/snapshot'?'leaderboard-snapshot':path==='/name'?'leaderboard-name':method==='GET'?'leaderboard-read':'leaderboard-publish';
    if(!this.fetch||this.navigator?.onLine===false){notifyFailure(this.onFailure,scope,'network-error');throw new LeaderboardError('当前离线，联网后可查看或提交排行榜','offline');}
    const controller=new AbortController();let timer,status=0;
    // Embedded transports may ignore abort, including while decoding the body.
    // Bound the whole request so a lost acknowledgement cannot hold pending.
    const deadline=new Promise((_resolve,reject)=>{timer=setTimeout(()=>{reject(new LeaderboardError('排行榜连接超时，请重试','timeout',status));controller.abort();},this.timeout);});
    try{
      return await Promise.race([deadline,(async()=>{
      const response=await this.fetch(this.endpoint+path,{method,keepalive,credentials:'omit',referrerPolicy:'no-referrer',signal:controller.signal,...(data?{headers:{'Content-Type':'application/json'},body:JSON.stringify(data)}:{})});
      status=response.status;
      let result;try{result=await response.json();}catch{throw new LeaderboardError('排行榜响应不完整，请稍后重试','response',response.status);}
      if(!response.ok)throw new LeaderboardError(result?.error||'排行榜暂时不可用，请稍后重试',response.status===429?'rate-limited':response.status===409?'conflict':'rejected',response.status);
      return result;
      })()]);
    }catch(error){
      notifyFailure(this.onFailure,scope,error?.code==='timeout'||controller.signal.aborted?'timeout':error instanceof LeaderboardError?(error.status>=400?'http-error':'invalid-response'):'network-error',error instanceof LeaderboardError?error.status:0);
      if(error instanceof LeaderboardError)throw error;throw new LeaderboardError(error?.name==='AbortError'?'排行榜连接超时，请重试':'排行榜连接失败，请检查网络后重试',error?.name==='AbortError'?'timeout':'network');
    }
    finally{clearTimeout(timer);}
  }
  async requestScore(path,options) {
    lotteryScoreForServer(options.data,this.lotterySupported.has(options.data.campaign));
    if(VOLATILITY_FIELDS.some(key=>Object.hasOwn(options.data,key))){
      try{return await this.request(path,options);}
      catch(error){if(error.status!==400)throw error;this.volatilitySupported.delete(options.data.campaign);const data={...options.data};for(const key of VOLATILITY_FIELDS)delete data[key];return this.requestScore(path,{...options,data});}
    }
    try{return await this.request(path,options);}
    catch(error){
      // A rolling API rollback can outlive a tab's capability cache. Retry only
      // an explicit schema rejection, with the same identity and core score.
      if(error.status!==400||!HALL_FIELDS.some(key=>Object.hasOwn(options.data,key)))throw error;
      this.hallSupported.delete(options.data.campaign);
      return this.request(path,{...options,data:hallScoreForServer(options.data,false)});
    }
  }
  async read({mode='daily',gameMode,sort,limit=20}={}) {
    if(!['daily','total'].includes(mode)||(gameMode!==undefined&&!['story','endless'].includes(gameMode))||(sort!==undefined&&!LEADERBOARD_SORTS.includes(sort))||!Number.isInteger(limit)||limit<1||limit>50)throw new LeaderboardError('排行榜参数不正确','input');
    const extension=sort!==undefined&&!LEGACY_SORTS.includes(sort);
    // Learn new sort support from a safe read, without registering a run or
    // guessing an order from one page of results. Missing metadata is the old contract.
    if(extension&&this.sortCapabilities===null)await this.read({mode,gameMode,sort:'survival',limit:1});
    if(extension&&!this.sortCapabilities.includes(sort))throw new LeaderboardError(sortNotice(sort),'sort-unavailable');
    this.status({state:'loading',mode,gameMode});
    const query=new URLSearchParams({mode,limit:String(limit)});if(gameMode!==undefined)query.set('gameMode',gameMode);if(sort!==undefined)query.set('sort',sort);
    try{const result=await this.request(`?${query}`);if(!Array.isArray(result?.rows)||result.verification!=='client-submitted'||(gameMode!==undefined&&result.gameMode!==gameMode)){notifyFailure(this.onFailure,'leaderboard-read','invalid-response',200);throw new LeaderboardError('排行榜响应不完整，请稍后重试','response');}
      this.sortCapabilities=result.sortContract?.version===1&&Array.isArray(result.sortContract.supported)?LEADERBOARD_SORTS.filter(key=>result.sortContract.supported.includes(key)):[...LEGACY_SORTS];
      this.status({state:result.rows.length?'ready':'empty',mode,gameMode});return result;}
    catch(error){
      // A service rollback may invalidate a tab's cache. Only refresh read
      // capabilities; never substitute a different requested ranking silently.
      if(extension&&[400,503].includes(error.status)){
        this.sortCapabilities=null;
        try{await this.read({mode,gameMode,sort:'survival',limit:1});if(!this.sortCapabilities.includes(sort))error=new LeaderboardError(sortNotice(sort),'sort-unavailable');}catch{}
      }
      this.status({state:'error',code:error.code,message:error.message});throw error;}
  }
  storedToken(campaign) {
    if(!ID.test(campaign||''))throw new LeaderboardError('本局标识无效','input');
    const key='fx-api-v1-leaderboard-capability-'+campaign;
    try{
      if(!this.storage?.getItem)throw Error('storage');
      let value;if(typeof this.storage.readItem==='function'){const result=this.storage.readItem(key);if(result?.available!==true)throw Error('storage');value=result.value;}else value=this.storage.getItem(key);
      if(value!==null&&!/^[a-f0-9]{64}$/.test(value||''))throw new LeaderboardError('本局凭证损坏，请保留存档后重试','capability');
      return value;
    }catch(error){if(error instanceof LeaderboardError)throw error;throw new LeaderboardError('无法读取本局凭证，暂不提交或修改成绩','storage-unavailable');}
  }
  tokenFor(campaign) {
    const key='fx-api-v1-leaderboard-capability-'+campaign,stored=this.storedToken(campaign),cached=this.capabilities.get(campaign);
    if(stored&&cached&&stored!==cached)throw new LeaderboardError('本局凭证已被其他页面修改，请重新载入','capability-conflict');
    let token=stored||cached;
    if(!token){const bytes=new Uint8Array(32);this.crypto.getRandomValues(bytes);token=[...bytes].map(byte=>byte.toString(16).padStart(2,'0')).join('');}
    if(stored!==token){
      try{if(!this.storage?.setItem||this.storage.setItem(key,token)===false||this.storedToken(campaign)!==token)throw Error('storage');}
      catch{throw new LeaderboardError('无法可靠保存本局凭证，暂不提交或修改成绩','storage-unavailable');}
    }
    this.capabilities.set(campaign,token);return token;
  }
  async ensureToken(campaign) {
    if(!ID.test(campaign||''))throw new LeaderboardError('本局标识无效','input');
    if(!this.locks?.request)throw new LeaderboardError('浏览器暂不支持安全的跨页凭证保存，暂不提交成绩','coordination');
    try{return await this.locks.request('kurumi-fx:score-capability:'+campaign,{mode:'exclusive'},()=>this.tokenFor(campaign));}
    catch(error){if(error instanceof LeaderboardError)throw error;throw new LeaderboardError('本局凭证保存未获确认，请稍后重试','coordination');}
  }
  sessionFor() {
    if(this.session)return this.session;const key='fx-api-v1-leaderboard-submit-session';let session=get(this.storage,key);
    if(!ID.test(session||'')){session=randomUUID(this.crypto);put(this.storage,key,session);}return this.session=session;
  }
  async publishSnapshot(state,report,{snapshotVersion=Date.now(),keepalive=false,isAllowed=()=>true}={}) {
    if(!isAllowed())throw new LeaderboardError('进度更新已暂停','ineligible');
    const score=liveLeaderboardScore(state,report,{storage:this.storage,includeVolatility:true}),campaign=state.runId;
    this.assertConfigured();
    if(this.pending)throw new LeaderboardError('成绩正在处理，请稍候','pending');
    this.pending=true;
    try{
      // Leaving the page must never create a new capability or registration.
      const token=keepalive?this.storedToken(campaign):await this.ensureToken(campaign);
      if(!token||keepalive&&!this.registered.has(campaign))throw new LeaderboardError('等待下次联网更新','pending');
      if(!isAllowed())throw new LeaderboardError('进度更新已暂停','ineligible');
      if(!this.registered.has(campaign)){
        const registration=await this.request('/run',{method:'POST',data:{campaign,session:this.sessionFor(),token,gameMode:score.gameMode,initialEquity:score.initialEquity}});
        if(registration?.tainted)throw new LeaderboardError('开发测试局不能自动上榜','developer');
        if(registration.lotteryMetricsVersion===1)this.lotterySupported.add(campaign);else this.lotterySupported.delete(campaign);if(registration.hallMetricsVersion===1)this.hallSupported.add(campaign);else this.hallSupported.delete(campaign);if(registration.volatilityMetricsVersion===1)this.volatilitySupported.add(campaign);else this.volatilitySupported.delete(campaign);this.registered.add(campaign);
      }
      if(hasDevelopmentTaint(state,this.storage))throw new LeaderboardError('开发测试局不能自动上榜','developer');
      if(!isAllowed())throw new LeaderboardError('进度更新已暂停','ineligible');
      return await this.requestScore('/snapshot',{method:'POST',keepalive,data:{campaign,token,...hallScoreForServer(score,this.hallSupported.has(campaign),this.volatilitySupported.has(campaign)),alias:'',snapshotVersion}});
    }finally{this.pending=false;}
  }
  async publishFinished(state,report,{alias='',campaign=state?.runId}={}) {
    let score;
    try{score=finishedLeaderboardScore(state,report,{storage:this.storage,includeVolatility:true});}
    catch(error){throw new LeaderboardError(error.message,error.code||'invalid-score');}
    const name=normalizeLeaderboardAlias(alias);
    if(campaign!==state.runId)throw new LeaderboardError('成绩必须属于当前终局','input');
    this.assertConfigured();
    if(this.pending)throw new LeaderboardError('成绩正在处理，请稍候','pending');
    this.pending=true;this.status({state:'publishing'});
    try{
      const token=await this.ensureToken(campaign);
      const registration=await this.request('/run',{method:'POST',data:{campaign,session:this.sessionFor(),token,gameMode:score.gameMode,initialEquity:score.initialEquity}});
      if(registration?.tainted)throw new LeaderboardError('开发测试局不能自动上榜','developer');
      if(registration.lotteryMetricsVersion===1)this.lotterySupported.add(campaign);else this.lotterySupported.delete(campaign);if(registration.hallMetricsVersion===1)this.hallSupported.add(campaign);else this.hallSupported.delete(campaign);if(registration.volatilityMetricsVersion===1)this.volatilitySupported.add(campaign);else this.volatilitySupported.delete(campaign);
      if(hasDevelopmentTaint(state,this.storage))throw new LeaderboardError('开发测试局不能自动上榜','developer');
      const result=await this.requestScore('',{method:'POST',data:{campaign,token,...hallScoreForServer(score,this.hallSupported.has(campaign),this.volatilitySupported.has(campaign)),alias:name}});
      if(result?.ok!==true){notifyFailure(this.onFailure,'leaderboard-publish','invalid-response',200);throw new LeaderboardError('成绩未获确认，请稍后重试','response');}
      this.status({state:'published',duplicate:!!result.duplicate});return result;
    }finally{this.pending=false;}
  }
  async disqualifyLottery(state,{saved=false}={}) {
    if(saved!==true)throw new LeaderboardError('请先保存本局进度','save-pending');
    if(state?.lottery?.cheatRedeemed!==true)throw new LeaderboardError('本局没有兑换暗号彩票','input');
    const campaign=state.runId,token=this.storedToken(campaign);
    // No registration or new capability just to remove a never-published run.
    if(!token)return {ok:true,notRegistered:true};
    const result=await this.request('/lottery-disqualify',{method:'POST',data:{campaign,token}});
    if(result?.ok!==true||result?.excluded!==true)throw new LeaderboardError('公共成绩撤回尚未确认','response');
    return result;
  }
  async rename(campaign,alias='') {
    const name=normalizeLeaderboardAlias(alias);
    if(!ID.test(campaign||''))throw new LeaderboardError('本局标识无效','input');
    this.assertConfigured();
    if(hasDevelopmentTaint({runId:campaign},this.storage))throw new LeaderboardError('开发测试局不能改名上榜','developer');
    const existing=this.storedToken(campaign)||this.capabilities.get(campaign);
    if(!existing)throw new LeaderboardError('没有本局成绩的修改凭证','capability');
    const token=await this.ensureToken(campaign);
    if(!/^[a-f0-9]{64}$/.test(token||''))throw new LeaderboardError('没有本局成绩的修改凭证','capability');
    if(this.pending)throw new LeaderboardError('成绩正在处理，请稍候','pending');
    this.pending=true;
    try{const result=await this.request('/name',{method:'POST',data:{campaign,token,alias:name}});if(result?.ok!==true)throw new LeaderboardError('显示名未获确认','response');return result;}finally{this.pending=false;}
  }
  async publish(state,{alias='',campaign=state?.runId}={}) {
    // Validate locally before creating any publishing identity or making a call.
    completedLeaderboardScore(state);normalizeLeaderboardAlias(alias);
    if(!ID.test(campaign||''))throw new LeaderboardError('本局缺少游戏标识，请重新打开游戏后再试','input');
    if(this.pending)throw new LeaderboardError('成绩正在提交，请稍候','pending');
    this.pending=true;this.status({state:'publishing'});
    try{
      this.assertConfigured();
      const token=await this.ensureToken(campaign),submission=buildLeaderboardSubmission(state,{campaign,token,alias});
      const registration=await this.request('/run',{method:'POST',data:{campaign,session:this.sessionFor(),token,gameMode:state?.mode??'story'}});
      lotteryScoreForServer(submission,registration?.lotteryMetricsVersion===1);
      const result=await this.request('',{method:'POST',data:submission});this.status({state:'published',duplicate:result.duplicate});return result;
    }catch(error){this.status({state:'error',code:error.code||'input',message:error.message});throw error;}
    finally{this.pending=false;}
  }
}
