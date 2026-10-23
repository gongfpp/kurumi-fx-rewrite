export const HISTORY_HANDOFF_PROTOCOL='kurumi-history-handoff-v1';
export const HISTORY_OWNER_ORIGIN='https://kurumi-fx-api.gongfpp.chatgpt.site';
const sourceId='forexite',month='2008-10',MAX=16*1024*1024;
export function createHistoryHandoff({window:win=globalThis.window,targetOrigin=HISTORY_OWNER_ORIGIN,onMonth,timeoutMs=120000,timers=globalThis}={}){
 const target=new URL(targetOrigin);if(target.origin!==targetOrigin||target.username||target.password||!['https:','http:'].includes(target.protocol)||target.protocol==='http:'&&!['127.0.0.1','localhost','[::1]'].includes(target.hostname))throw Error('历史来源地址无效');
 let active=null;
 const send=(request,type)=>{try{request.popup?.postMessage({...request.base,type},targetOrigin);}catch{}};
 function end(r,error){if(active!==r)return;active=null;timers.clearTimeout(r.timeout);timers.clearInterval(r.poll);win.removeEventListener('message',r.listener);if(error){r.controller.abort(error);send(r,'cancel');r.reject(error);}else{send(r,'accepted');r.resolve();}try{r.popup?.close();}catch{}}
 function cancel(){if(active)end(active,Error('已取消历史行情载入'));}
 function request(){
  if(active){try{active.popup?.focus();}catch{}return active.promise;}
  const random=new Uint8Array(32);win.crypto.getRandomValues(random);const requestId=[...random].map(n=>n.toString(16).padStart(2,'0')).join('');
  const r={base:{protocol:HISTORY_HANDOFF_PROTOCOL,requestId,sourceId,month},controller:new AbortController(),consumed:false,sentRequest:false,popup:null};r.promise=new Promise((resolve,reject)=>{r.resolve=resolve;r.reject=reject;});active=r;
  r.listener=async event=>{
   if(active!==r||event.origin!==targetOrigin||event.source!==r.popup||!event.data||typeof event.data!=='object')return;
   const data=event.data;if(Object.entries(r.base).some(([k,v])=>data[k]!==v))return;
   if(data.type==='ready'){if(!r.sentRequest&&!r.consumed){r.sentRequest=true;send(r,'request');}return;}
   if(data.type==='error'){end(r,Error('历史行情未载入，请重试或选择本机文件'));return;}
   if(data.type!=='package'||!r.sentRequest||r.consumed)return;
   r.consumed=true;
   try{
    if(Object.keys(data).some(k=>!['protocol','type','requestId','sourceId','month','manifest','gzip'].includes(k))||!(data.gzip instanceof ArrayBuffer)||!data.gzip.byteLength||data.gzip.byteLength>MAX||data.manifest?.utcMonth!==month||data.manifest?.symbol!=='USDJPY'||data.manifest?.executionEligible!==false||data.manifest?.rights?.researchAudience!=='owner-only'||new TextEncoder().encode(JSON.stringify(data.manifest)).byteLength>1024*1024)throw Error('历史行情包身份或大小不符');
    const assertCurrent=()=>{if(active!==r||r.controller.signal.aborted)throw Error('已取消历史行情载入');if(r.popup.closed){const error=Error('历史行情连接已中断，尚未保存数据');end(r,error);throw error;}};assertCurrent();
    await onMonth({manifest:data.manifest,gzip:data.gzip},{signal:r.controller.signal,beforeWrite:assertCurrent});
    if(active!==r||r.controller.signal.aborted)return;end(r);
   }catch(error){if(active===r)end(r,Error(r.controller.signal.aborted?'已取消历史行情载入':error.message||'历史行情校验未通过'));}
  };
  win.addEventListener('message',r.listener);
  try{r.popup=win.open(targetOrigin+'/history-connect?request='+requestId+'&month='+month,'_blank','popup,width=520,height=640');}catch{}
  if(!r.popup){end(r,Error('浏览器未打开登录窗口，请允许弹出窗口后重试'));return r.promise;}
  r.timeout=timers.setTimeout(()=>end(r,Error('等待历史行情超时，请重试或选择本机文件')),timeoutMs);
  r.poll=timers.setInterval(()=>{if(active===r&&r.popup?.closed)end(r,Error('历史行情连接已中断，尚未载入数据'));},500);
  return r.promise;
 }
 return{request,cancel,get pending(){return active!==null;}};
}
