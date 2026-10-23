import {BIQUOTE_SYMBOLS, createBiquoteSource} from './biquote-source.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
export const BIQUOTE_HUB = 'https://biquote.io/hubs/tick';
export const SIGNALR_BROWSER_CLIENT = 'https://cdnjs.cloudflare.com/ajax/libs/microsoft-signalr/8.0.0/signalr.min.js';
// These are recommended defaults, injectable pending product parameter approval.
export const DIRECT_SOURCE_DEFAULTS = Object.freeze({intervalMs:5000, maxAgeMs:30000, connectTimeoutMs:10000});
let clientLoad;
export function loadBrowserSignalR({documentImpl=globalThis.document}={}) {
 if(globalThis.signalR?.HubConnectionBuilder)return Promise.resolve(globalThis.signalR);
 if(!documentImpl)return Promise.reject(Error('signalr-browser-unavailable'));
 if(!clientLoad)clientLoad=new Promise((resolve,reject)=>{
  const script=documentImpl.createElement('script');script.src=SIGNALR_BROWSER_CLIENT;script.crossOrigin='anonymous';
  script.onload=()=>globalThis.signalR?.HubConnectionBuilder?resolve(globalThis.signalR):reject(Error('signalr-client-unavailable'));
  script.onerror=()=>reject(Error('signalr-client-load-failed'));documentImpl.head.append(script);
 }).catch(error=>{clientLoad=null;throw error;});
 return clientLoad;
}
export async function createBrowserBiquoteConnection(){
 const signalR=await loadBrowserSignalR();
 return new signalR.HubConnectionBuilder().withUrl(BIQUOTE_HUB,{withCredentials:false}).withAutomaticReconnect().build();
}
// Each player connects directly to the official upstream. No relay or shared cache.
export function createDirectBiquoteSource({connectionFactory=createBrowserBiquoteConnection,
 connectTimeoutMs=DIRECT_SOURCE_DEFAULTS.connectTimeoutMs,setTimer=setTimeout,clearTimer=clearTimeout,...options}={}){
 if(typeof connectionFactory!=='function'||!Number.isFinite(connectTimeoutMs)||connectTimeoutMs<=0)throw TypeError('Invalid direct source configuration');
 const source=createBiquoteSource({...DIRECT_SOURCE_DEFAULTS,...options,setTimer,clearTimer});
 let running=false,generation=0,connection=null,deadline=null,watchdog=null,path='idle',streamError=null;
 function watch(token){
  if(!running||token!==generation)return;
  if(path==='signalr'&&Object.values(source.all()).some(view=>view.status!=='current'))fallback(token,'signalr-no-current-quote');
  watchdog=setTimer(()=>watch(token),options.intervalMs??DIRECT_SOURCE_DEFAULTS.intervalMs);
 }
 const fallback=(token,reason)=>{
  if(!running||generation!==token||path==='rest')return;
  clearTimer(deadline);deadline=null;
  streamError=reason;path='rest';source.disconnect(reason);source.start();
 };
 async function connect(token){
  try{
   const candidate=await connectionFactory();
   if(!running||generation!==token||path!=='connecting'){if(connection===candidate)connection=null;await candidate.stop();return;}
   connection=candidate;
   candidate.on('ReceiveTick',tick=>{if(running&&generation===token&&path==='signalr')source.ingestTick(tick);});
   candidate.onreconnecting?.(()=>fallback(token,'signalr-reconnecting'));
   candidate.onclose?.(()=>fallback(token,'signalr-closed'));
   candidate.onreconnected?.(async()=>{
    if(!running||generation!==token||connection!==candidate)return;
    try{await candidate.invoke('Subscribe',[...BIQUOTE_SYMBOLS]);if(running&&generation===token&&connection===candidate){source.stop();path='signalr';streamError=null;}}
    catch{fallback(token,'signalr-subscribe-failed');}
   });
   await candidate.start();
   if(!running||generation!==token||path!=='connecting'){if(connection===candidate)connection=null;await candidate.stop();return;}
   await candidate.invoke('Subscribe',[...BIQUOTE_SYMBOLS]);
   if(!running||generation!==token||path!=='connecting'){if(connection===candidate)connection=null;await candidate.stop();return;}
   clearTimer(deadline);deadline=null;source.stop();path='signalr';streamError=null;
   // REST establishes source/state metadata immediately, including weekend closure.
   // It also supplies the initial quote if the hub has no new tick to push.
   await source.poll();
  }catch(error){clearTimer(deadline);deadline=null;fallback(token,error?.message||'signalr-unavailable');}
 }
 function start(){
  if(running)return false;running=true;const token=++generation;path='connecting';
  deadline=setTimer(()=>{fallback(token,'signalr-connect-timeout');},connectTimeoutMs);
  void connect(token);watchdog=setTimer(()=>watch(token),options.intervalMs??DIRECT_SOURCE_DEFAULTS.intervalMs);return true;
 }
 function stop(){running=false;generation++;clearTimer(watchdog);watchdog=null;clearTimer(deadline);deadline=null;const previous=connection;connection=null;path='stopped';source.stop();void previous?.stop().catch(()=>{});}
 return Object.freeze({...source,start,stop,get connectionStatus(){return Object.freeze({path,error:streamError});}});
}
