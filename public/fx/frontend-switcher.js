import {createFrontendHost} from './frontend-host.js?v=9ba5ed087d3fbe3b4e6ddd0a44fcb3bc7087a3f1-23f2a20b7717';

// The host moves the original controls; no game, clock or save is recreated.
export function mountFrontendSwitcher({document=globalThis.document,onLayout=()=>{},loadPixel=()=>import('./pixel-renderer.js?v=9ba5ed087d3fbe3b4e6ddd0a44fcb3bc7087a3f1-23f2a20b7717'),startupTimeoutMs=5000,setTimer=globalThis.setTimeout,clearTimer=globalThis.clearTimeout}={}){
 const boot=document.defaultView?.kurumiFrontendBoot;
 const nav=document.getElementById('frontend-switch');
 if(!nav){boot?.finish('legacy');return null;}
 const status=document.getElementById('frontend-switch-status');
 const host=createFrontendHost({document,onLayout,renderers:{pixel:async()=>{
  const module=await loadPixel();return module.createPixelRenderer({document});
 }}});
 let request=0,pending=null,disposed=false,startupTimer=null,resolveReady;
 const ready=new Promise(resolve=>{resolveReady=resolve;});
 const sync=()=>{
  const selected=pending?.id||host.active;
  for(const button of nav.querySelectorAll('[data-frontend-target]'))button.setAttribute('aria-pressed',String(button.dataset.frontendTarget===selected));
 };
 const finishStartup=result=>{
  if(!resolveReady)return;
  if(startupTimer!==null){clearTimer(startupTimer);startupTimer=null;}
  boot?.finish(host.active);
  const resolve=resolveReady;resolveReady=null;resolve(result);
 };
 function select(id){
  if(disposed)return Promise.resolve({ok:false,frontend:host.active,reason:'disposed'});
  // Repeated clicks during the same import share one presentation request.
  if(pending?.id===id)return pending.promise;
  const token=++request;
  pending={id,token,promise:null};nav.setAttribute('aria-busy','true');sync();
  const promise=(async()=>{
   const result=await host.switchTo(id);if(token!==request)return result;
   pending=null;nav.removeAttribute('aria-busy');sync();
   if(status)status.textContent=result.ok?'':result.reason==='superseded'?'':'界面未能切换，可以继续使用当前界面。';
   finishStartup(result);
   return result;
  })();
  pending.promise=promise;return promise;
 }
 const click=event=>{const button=event.target.closest('[data-frontend-target]');if(button&&nav.contains(button))void select(button.dataset.frontendTarget);};
 const fallback=()=>{void select('legacy');};
 nav.addEventListener('click',click);
 document.addEventListener('kurumi:frontendbootfallback',fallback);
 boot?.claim();
 let requested=boot?.requested;
 if(!requested)try{requested=new URL(document.defaultView.location.href).searchParams.get('frontend');}catch{}
 void select(requested==='legacy'?'legacy':'pixel');
 if(requested!=='legacy')startupTimer=setTimer(()=>{
  if(!resolveReady)return;
  const token=request+1;
  // Cancels a stalled import. A late renderer is disposed by the host.
  void select('legacy').then(result=>{
   if(result.ok&&token===request&&status)status.textContent='界面未能切换，可以继续使用当前界面。';
  });
 },startupTimeoutMs);
 return {host,ready,select,refresh(){const ok=host.refresh();sync();if(!ok&&status)status.textContent='界面显示中断，已切回原版。';return ok;},dispose(){
  if(disposed)return;disposed=true;request++;pending=null;
  nav.removeEventListener('click',click);document.removeEventListener('kurumi:frontendbootfallback',fallback);
  nav.removeAttribute('aria-busy');host.dispose();sync();
  finishStartup({ok:false,frontend:'legacy',reason:'disposed'});
 }};
}
