import {notifyFailure} from './error-reporting.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {markDevelopmentTaint,hasDevelopmentTaint} from './development-taint.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
const ID=/^[a-zA-Z0-9_-]{8,80}$/,TOKEN=/^[a-f0-9]{64}$/,REQUEST=/^[a-f0-9-]{36}$/;
// Passwords are never entered or handled by the Pages app. The owner completes
// verification in a top-level first-party Site window; polling uses the same
// run capability, not third-party cookies or a new persistent access token.
export class DeveloperAccess {
 constructor({leaderboard,storage=leaderboard?.storage,fetch=leaderboard?.fetch,now=()=>Date.now(),timeout=10000,onFailure=leaderboard?.onFailure}={}){this.leaderboard=leaderboard;this.storage=storage;this.fetch=fetch;this.now=now;this.timeout=timeout;this.onFailure=onFailure;}
 configured(){return this.leaderboard?.configuration?.configured===true;}
 assertState(state){if(!ID.test(state?.runId||'')||!['story','endless'].includes(state?.mode))throw Error('本局标识或模式无效');}
 existingToken(state){this.assertState(state);let token=this.leaderboard?.capabilities?.get(state.runId);if(!token)token=this.storage?.getItem('fx-api-v1-leaderboard-capability-'+state.runId);return TOKEN.test(token||'')?token:null;}
 async request(action,state,token){
  if(!this.configured())throw Error('独立密码验证服务未配置，开发入口暂不可用');
  if(!['request','status','close','taint'].includes(action)||!TOKEN.test(token||''))throw Error('缺少本局验证凭证');
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),this.timeout);
  let failure='network-error',status=0;
  try{const response=await this.fetch(this.leaderboard.configuration.origin+'/api/fx/developer/'+action,{method:'POST',credentials:'omit',referrerPolicy:'no-referrer',headers:{'Content-Type':'application/json'},body:JSON.stringify({campaign:state.runId,token}),signal:controller.signal});status=response.status;failure=response.ok?'invalid-response':'http-error';let data;try{data=await response.json();}catch{throw Error('密码验证服务响应不完整');}if(!response.ok||data?.ok!==true)throw Error(data?.error||'开发验证暂不可用');return data;}
  catch(error){notifyFailure(this.onFailure,'developer-'+action,controller.signal.aborted?'timeout':failure,status);throw error;}
  finally{clearTimeout(timer);}
 }
 applyTaint(state,data){if(data?.tainted===true)markDevelopmentTaint(state,this.storage);}
 async begin(state){
  this.assertState(state);if(!this.configured())throw Error('独立密码验证服务未配置，开发入口暂不可用');
  const previouslyTainted=hasDevelopmentTaint(state,this.storage);
  const token=await this.leaderboard.ensureToken(state.runId);
  await this.leaderboard.request('/run',{method:'POST',data:{campaign:state.runId,session:this.leaderboard.sessionFor(),token,gameMode:state.mode,initialEquity:state.startEquity??100000}});
  if(previouslyTainted){this.applyTaint(state,await this.request('taint',state,token));}
  const data=await this.request('request',state,token);this.applyTaint(state,data);
  if(!REQUEST.test(data.requestId||'')||!Number.isSafeInteger(data.expiresAt)||data.expiresAt<=this.now()||typeof data.unlockPath!=='string'){notifyFailure(this.onFailure,'developer-request','invalid-response',200);throw Error('验证请求格式不正确');}
  let url;try{url=new URL(data.unlockPath,this.leaderboard.configuration.origin);}catch{notifyFailure(this.onFailure,'developer-request','unsafe-response',200);throw Error('验证页地址不可信');}
  if(!data.unlockPath.startsWith('/admin/developer-unlock?')||url.origin!==this.leaderboard.configuration.origin||url.pathname!=='/admin/developer-unlock'||url.hash||url.username||url.password||[...url.searchParams].length!==1||url.searchParams.get('request')!==data.requestId){notifyFailure(this.onFailure,'developer-request','unsafe-response',200);throw Error('验证页地址不可信');}
  return {requestId:data.requestId,expiresAt:data.expiresAt,url:url.href};
 }
 async check(state){
  this.assertState(state);if(!this.configured())return {configured:false,authorized:false,tainted:hasDevelopmentTaint(state,this.storage)};
  const token=this.existingToken(state);if(!token)return {configured:true,authorized:false,tainted:hasDevelopmentTaint(state,this.storage)};
  const data=await this.request('status',state,token);this.applyTaint(state,data);
  return {configured:data.configured===true,authorized:data.configured===true&&data.authorized===true&&data.tainted===true&&Number.isSafeInteger(data.expiresAt)&&data.expiresAt>this.now(),tainted:data.tainted===true||hasDevelopmentTaint(state,this.storage),expiresAt:Number.isSafeInteger(data.expiresAt)?data.expiresAt:0};
 }
 async beforeEdit(state){const result=await this.check(state);if(!result.authorized)throw Error(result.configured?'开发会话未验证或已过期，请先到安全页输入密码':'密码验证未配置，开发入口暂不可用');markDevelopmentTaint(state,this.storage);return true;}
 async close(state){const token=this.existingToken(state);if(!this.configured()||!token)return {authorized:false};const data=await this.request('close',state,token);this.applyTaint(state,data);return {authorized:false,tainted:data.tainted===true};}
}
