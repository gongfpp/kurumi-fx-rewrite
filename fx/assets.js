import {RESEARCH_BUILD} from './research-config.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
// Resolve against the module, so /fx.html, /fx and Pages subdirectories agree.
export function assetURL(path,base=import.meta.url){
  const source=new URL(base);let url=new URL(path,source);
  if(RESEARCH_BUILD&&url.origin===source.origin&&url.pathname.includes('/game/fx/')&&!url.pathname.includes('/manga/contextual-lmno/')&&!url.pathname.includes('/sfx/')&&!url.pathname.includes('/expressions/')&&!/\/generated\/(?:emotion-extremes-v1\/(?:numb|tearful-stunned|realized-win)|father-cabinet-v1\/pain)\.webp$/.test(url.pathname))url=new URL(url.pathname.split('/game/fx/')[1],'https://gongfpp.github.io/kurumi-fx-pages/fx/');
  const version=source.searchParams.get('v');if(version)url.searchParams.set('v',version);
  return url.href;
}
const requests=new WeakMap();
function startImage(image,request,manual=false){
 request.attempt=manual?request.attempt+1:0;request.automaticRetry=false;
 image.dataset.imageRetry='0';image.classList.remove('image-unavailable');request.onStatus?.('loading');
 const assign=()=>{const retry=new URL(request.url);if(request.attempt&&!RESEARCH_BUILD)retry.searchParams.set('retry',String(request.attempt));image.src=retry.href;};
 image.onerror=()=>{
  if(requests.get(image)!==request)return;
  if(!request.automaticRetry){request.automaticRetry=true;request.attempt++;image.dataset.imageRetry='1';assign();}
  else{image.classList.add('image-unavailable');request.onStatus?.('unavailable');}
 };
 image.onload=()=>{if(requests.get(image)!==request)return;image.classList.remove('image-unavailable');request.onStatus?.('ready');};assign();
}
export function setImage(image,path,{onStatus}={}){
 const url=assetURL(path),existing=requests.get(image);
 if(existing?.url===url){if(onStatus)existing.onStatus=onStatus;return;}
 const request={url,onStatus,attempt:0};requests.set(image,request);image.dataset.asset=url;startImage(image,request);
}
// A deliberate retry can recover an offline/cache failure without changing the
// selected expression. Repeated rendering never creates an endless retry loop.
export function retryImage(image){const request=requests.get(image);if(!request)return false;startImage(image,request,true);return true;}
