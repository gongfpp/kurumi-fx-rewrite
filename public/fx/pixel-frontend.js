import {createDOMPortals} from './dom-portals.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';

// One presentation over the existing controls. This module never owns a game,
// storage session, network source or quotation clock and has no legacy branch.
export function mountPixelFrontend({document=globalThis.document,onLayout=()=>{},onAvailabilityChange=()=>{},loadPixel=()=>import('./pixel-renderer.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717'),startupTimeoutMs=5000,setTimer=globalThis.setTimeout,clearTimer=globalThis.clearTimeout}={}){
 const boot=document.defaultView?.kurumiPixelBoot;
 document.body.dataset.frontend='pixel';
 const portals=createDOMPortals({document});
 const root=document.createElement('div');root.id='pixel-frontend';root.hidden=true;root.tabIndex=-1;root.setAttribute('role','main');document.body.append(root);
 const retryButton=document.getElementById('pixel-boot-retry');
 let instance=null,pending=null,disposed=false,request=0,timer=null,resolveReady;
 const ready=new Promise(resolve=>{resolveReady=resolve;});
 const stats={mounts:0,disposes:0,lastError:null};
 const clearDeadline=()=>{if(timer!==null){clearTimer(timer);timer=null;}};
 const cleanup=()=>{
  const previous=instance;instance=null;root.hidden=true;
  try{previous?.dispose?.();}catch(error){stats.lastError=String(error?.message||error);}
  finally{
   if(previous)stats.disposes++;
   portals.restore();
   try{previous?.afterRestore?.();}catch(error){stats.lastError=String(error?.message||error);}
   root.replaceChildren();
  }
 };
 const fail=(reason,error)=>{
  cleanup();clearDeadline();pending=null;
  stats.lastError=String(error?.message||error||reason);
  boot?.fail();onAvailabilityChange(false);
  if(retryButton)retryButton.onclick=()=>{void start();};
  return {ok:false,frontend:'pixel',reason};
 };
 function start(){
  if(disposed)return Promise.resolve({ok:false,frontend:'pixel',reason:'disposed'});
  if(instance)return Promise.resolve({ok:true,frontend:'pixel',changed:false});
  if(pending)return pending;
  const token=++request;boot?.retrying();
  const promise=(async()=>{
   let candidate;
   try{
    const module=await Promise.resolve().then(loadPixel);candidate=module.createPixelRenderer({document});
    if(disposed||token!==request){candidate?.dispose?.();return {ok:false,frontend:'pixel',reason:'superseded'};}
    if(!candidate||typeof candidate.mount!=='function')throw Error('Pixel renderer is invalid');
   }catch(error){if(disposed||token!==request)return {ok:false,frontend:'pixel',reason:'superseded'};return fail('renderer-load',error);}
   try{
    instance=candidate;stats.mounts++;
    candidate.mount({root,portals});root.hidden=false;
    candidate.render?.(Object.freeze({frontend:'pixel',reason:'startup'}));
    onLayout();
   }catch(error){if(token!==request||disposed)return {ok:false,frontend:'pixel',reason:'superseded'};return fail('renderer-mount',error);}
   clearDeadline();pending=null;stats.lastError=null;boot?.finish();
   const result={ok:true,frontend:'pixel',changed:true};
   if(resolveReady){resolveReady(result);resolveReady=null;}else onAvailabilityChange(true);
   return result;
  })();
  pending=promise;
  timer=setTimer(()=>{
   if(token!==request||disposed||!pending)return;
   request++;fail('renderer-timeout',Error('Pixel renderer timed out'));
  },startupTimeoutMs);
  return promise;
 }
 boot?.claim();
 void start();
 return {
  ready,retry:start,
  get active(){return !!instance&&!disposed;},
  get diagnostics(){return Object.freeze({...stats,frontend:'pixel',pendingMoves:portals.count,disposed});},
  refresh(){
   if(disposed||!instance)return false;
   try{instance.render?.(Object.freeze({frontend:'pixel',reason:'update'}));return true;}
   catch(error){request++;fail('renderer-update',error);return false;}
  },
  dispose(){
   if(disposed)return;disposed=true;request++;clearDeadline();pending=null;cleanup();root.remove();
   if(retryButton)retryButton.onclick=null;
   if(resolveReady){resolveReady({ok:false,frontend:'pixel',reason:'disposed'});resolveReady=null;}
  }
 };
}
