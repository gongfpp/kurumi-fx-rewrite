import {markDevelopmentTaint} from './development-taint.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';

// No local flag is an authorization. Every open, edit and restore asks the
// service again, and every await is followed by a current-run/epoch check.
export class DeveloperSession {
 constructor({access,getState,getGeneration=()=>0,guard=()=>true,storage,backupKey,restore,patch,replace,onTaint=()=>{},now=()=>Date.now()}){
  Object.assign(this,{access,getState,getGeneration,guard,storage,backupKey,restore,patch,replace,onTaint,now});this.epoch=0;this.busy=false;this.context=null;
 }
 capture(){const state=this.getState();this.access.assertState(state);return {state,generation:this.getGeneration(),epoch:this.epoch,runId:state.runId,mode:state.mode,requestState:{runId:state.runId,mode:state.mode,developmentTaint:state.developmentTaint,developer:state.developer}};}
 current(c){return c.epoch===this.epoch&&c.generation===this.getGeneration()&&c.state===this.getState()&&c.state.runId===c.runId&&c.state.mode===c.mode&&this.guard();}
 assertCurrent(c){if(!this.current(c))throw Error('本局已变化或验证已取消，请重新打开开发入口');}
 async exclusive(work){if(this.busy||this.closing)throw Error('正在检查开发权限，请稍候');this.busy=true;try{return await work();}finally{this.busy=false;}}
 accept(c,result){this.assertCurrent(c);if(result.tainted){markDevelopmentTaint(c.state,this.access.storage);this.onTaint(c.state);}return result;}
 async status(c){const result=await this.access.check(c.requestState);this.accept(c,result);return result;}
 async open(){return this.exclusive(async()=>{
  const c=this.capture();this.assertCurrent(c);this.context=c;
  const status=await this.status(c);if(status.authorized&&status.expiresAt>this.now())return {authorized:true,expiresAt:status.expiresAt};
  const request=await this.access.begin(c.requestState);
  // A cancelled begin may have created its request after close reached the
  // server. Close once more after begin settles so that late link is unusable.
  if(!this.current(c)){await this.access.close(c.requestState);this.assertCurrent(c);}
  this.accept(c,{tainted:c.requestState.developmentTaint===true});
  return {authorized:false,...request};
 });}
 async confirm(){return this.exclusive(async()=>{
  const c=this.context;if(!c)throw Error('请从当前游戏重新发起验证');this.assertCurrent(c);
  const status=await this.status(c);if(!status.authorized||status.expiresAt<=this.now())throw Error('尚未验证或会话已过期，请在安全页输入密码后重试');
  return status;
 });}
 async edit(kind,values){return this.exclusive(async()=>{
  const c=this.context;if(!c)throw Error('请先重新打开当前本局的开发入口');this.assertCurrent(c);
  const status=await this.status(c);if(!status.authorized||status.expiresAt<=this.now())throw Error('开发会话未验证或已过期，请先到安全页输入密码');
  const key='fx-api-v1-developer-backup-'+c.runId;
  let next;
  if(kind==='restore'){
   next=this.restore(this.storage.getItem(key)||this.storage.getItem(this.backupKey()));
   if(!next||next.runId!==c.runId||next.mode!==c.mode)throw Error('没有属于当前本局的修改前存档');
  }else if(kind==='apply'){
   next=this.patch(c.state,values);
   if(!c.state.developer?.edited&&this.storage.setItem(key,JSON.stringify(c.state))===false)throw Error('浏览器无法保存原存档备份，暂不能修改开发数据');
  }else throw Error('未知开发操作');
  this.assertCurrent(c);if(status.expiresAt<=this.now())throw Error('开发会话已过期，请重新验证');
  // Backups never create another campaign or clear server/client taint.
  next.runId=c.runId;next.mode=c.mode;markDevelopmentTaint(next,this.access.storage);
  this.replace(next);return next;
 });}
 hasBackup(){const c=this.capture();const candidate=this.restore(this.storage.getItem('fx-api-v1-developer-backup-'+c.runId)||this.storage.getItem(this.backupKey()));return !!candidate&&candidate.runId===c.runId&&candidate.mode===c.mode;}
 async cancel(){const c=this.context;this.epoch++;this.context=null;if(!c)return this.closing;const closing=this.access.close(c.requestState);this.closing=closing;try{await closing;}finally{if(this.closing===closing)this.closing=null;}}
}
