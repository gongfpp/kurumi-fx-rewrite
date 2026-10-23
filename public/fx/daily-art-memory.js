import {createGameStorage} from './storage.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {kurumiStorage} from './storage-namespace.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
export const DAILY_ART_MEMORY_KEY='fx-daily-art-memory-v1';
// A visual-only revision can retain its original read/locked-day identity.
// The actual sha256 still verifies the image bytes; no saved records are migrated.
export function artIdentity(art){return typeof art?.contentIdentity==='string'&&/^sha256:[a-f0-9]{64}$/.test(art.contentIdentity)?art.contentIdentity:art?.sha256?'sha256:'+art.sha256:art?.path?'path:'+art.path.split('?')[0]:null;}
export function createDailyArtMemory(storage=createGameStorage(()=>kurumiStorage()),recoveryStorage=null){
 const parse=raw=>{try{const x=JSON.parse(raw);return x?.version===1&&Array.isArray(x.seen)&&x.seen.every(id=>typeof id==='string')&&x.days&&typeof x.days==='object'&&!Array.isArray(x.days)?x:{version:1,seen:[],days:{}};}catch{return {version:1,seen:[],days:{}};}};
 const read=()=>{const main=parse(storage.getItem(DAILY_ART_MEMORY_KEY)),recovery=parse(recoveryStorage?.getItem(DAILY_ART_MEMORY_KEY));return {version:1,seen:[...new Set([...main.seen,...recovery.seen])],days:{...main.days,...recovery.days}};};
 const save=x=>{const value=JSON.stringify(x),saved=storage.setItem(DAILY_ART_MEMORY_KEY,value);if(saved)recoveryStorage?.removeItem(DAILY_ART_MEMORY_KEY);else recoveryStorage?.setItem(DAILY_ART_MEMORY_KEY,value);return saved;};
 return {
  day(key){const x=read();return {locked:Object.hasOwn(x.days,key),identity:x.days[key]??null};},
  has(id){return !!id&&read().seen.includes(id);},
  seen(ids){const x=read();x.seen=[...new Set([...x.seen,...ids.filter(id=>typeof id==='string'&&id.length<256)])].slice(-2000);return save(x);},
  peek(dayKey,candidates){const x=read();if(Object.hasOwn(x.days,dayKey))return candidates.find(c=>c.identity===x.days[dayKey])||null;return candidates.find(c=>!c.preserveLockedOnly&&!x.seen.includes(c.identity)&&(!c.arcIdentity||!x.seen.includes(c.arcIdentity)))||null;},
  pick(dayKey,candidates){const x=read();if(Object.hasOwn(x.days,dayKey)){save(x);return candidates.find(c=>c.identity===x.days[dayKey])||null;}
   const chosen=candidates.find(c=>!c.preserveLockedOnly&&!x.seen.includes(c.identity)&&(!c.arcIdentity||!x.seen.includes(c.arcIdentity)))||null;
   x.days[dayKey]=chosen?.identity||null;const keys=Object.keys(x.days);for(const key of keys.slice(0,-256))delete x.days[key];save(x);return chosen;
  }
 };
}
export const dailyArtMemory=createDailyArtMemory(createGameStorage(()=>kurumiStorage()),createGameStorage(()=>kurumiStorage('sessionStorage')));
// A selected/queued image is not seen. Record only a decoded image actually in
// the viewport; an expanded offscreen story remains eligible until scrolled to.
export function observeSeenArtwork(image,{identities=[],memory=dailyArtMemory,onSeen=()=>{},visibilityTarget=image,visibilityTargets=[visibilityTarget],minVisibleRatio=0,accumulateVisibility=false}={}){
 if(!image.ownerDocument?.defaultView||!image.getBoundingClientRect)return()=>{};
 const targets=[...new Set(visibilityTargets)],visibility=new Map(targets.map(target=>[target,false]));
 const coverage=new Map();
 let loaded=image.complete&&image.naturalWidth>0,done=false,observer=null;
 const win=image.ownerDocument.defaultView;
 const finish=()=>{if(done||!loaded||!targets.every(target=>visibility.get(target))||image.isConnected===false||image.ownerDocument.hidden)return;done=true;memory.seen(identities);onSeen();observer?.disconnect();};
 // Older browsers must account for scroll containers too, not just the window.
 const check=()=>{if(done)return;for(const target of targets){
  const r=target.getBoundingClientRect(),area=r.width*r.height;let left=Math.max(r.left,0),right=Math.min(r.right,win.innerWidth||0),top=Math.max(r.top,0),bottom=Math.min(r.bottom,win.innerHeight||0),hidden=false;
  for(let node=target;node;node=node.parentElement){const style=win.getComputedStyle?.(node);if(node.hidden||style?.display==='none'||style?.visibility==='hidden'){hidden=true;break;}if(node===target||!style)continue;const box=node.getBoundingClientRect();if(/auto|scroll|hidden|clip/.test(style.overflowX)){left=Math.max(left,box.left+node.clientLeft);right=Math.min(right,box.left+node.clientLeft+node.clientWidth);}if(/auto|scroll|hidden|clip/.test(style.overflowY)){top=Math.max(top,box.top+node.clientTop);bottom=Math.min(bottom,box.top+node.clientTop+node.clientHeight);}}
  const shown=Math.max(0,right-left)*Math.max(0,bottom-top);
  if(accumulateVisibility){
   // A short viewport can expose picture and caption at different scroll
   // positions. Accumulate actual decoded, visible pixels, never scroll intent.
   // Invalidate changed geometry even offscreen: an old completed picture
   // must not combine with a newly exposed caption after a resize.
   let record=coverage.get(target);if(!record||record.width!==r.width||record.height!==r.height){record={width:r.width,height:r.height,rects:[]};coverage.set(target,record);visibility.set(target,false);}
   if(!hidden&&area>0&&shown>0&&loaded&&image.isConnected!==false&&!image.ownerDocument.hidden){
    const box=[(left-r.left)/r.width,(top-r.top)/r.height,(right-r.left)/r.width,(bottom-r.top)/r.height];
    const contains=(a,b)=>a[0]<=b[0]&&a[1]<=b[1]&&a[2]>=b[2]&&a[3]>=b[3];
    if(!record.rects.some(old=>contains(old,box))){record.rects=record.rects.filter(old=>!contains(box,old));record.rects.push(box);}
    const xs=[...new Set(record.rects.flatMap(b=>[b[0],b[2]]))].sort((a,b)=>a-b);let covered=0;
    for(let i=1;i<xs.length;i++){const intervals=record.rects.filter(b=>b[0]<=xs[i-1]&&b[2]>=xs[i]).map(b=>[b[1],b[3]]).sort((a,b)=>a[0]-b[0]);let end=0,height=0;for(const [start,stop] of intervals){height+=Math.max(0,stop-Math.max(start,end));end=Math.max(end,stop);}covered+=(xs[i]-xs[i-1])*height;}
    visibility.set(target,covered+1e-9>=minVisibleRatio);
   }
  }else visibility.set(target,!hidden&&area>0&&shown>0&&shown/area>=minVisibleRatio);
 }finish();};
 const load=()=>{loaded=image.naturalWidth>0;if(observer&&!accumulateVisibility)finish();else check();};image.addEventListener('load',load);
 if(win?.IntersectionObserver){observer=new win.IntersectionObserver(entries=>{if(accumulateVisibility){check();return;}for(const e of entries){const target=e.target||(targets.length===1?targets[0]:null);if(visibility.has(target))visibility.set(target,e.isIntersecting&&e.intersectionRatio>0&&e.intersectionRatio>=minVisibleRatio);}finish();},{threshold:[0,.01,...(minVisibleRatio?[minVisibleRatio]:[])]});targets.forEach(target=>observer.observe(target));}if(!observer||accumulateVisibility){win?.addEventListener('scroll',check,true);win?.addEventListener('resize',check);check();}
 return()=>{done=true;observer?.disconnect();image.removeEventListener('load',load);win?.removeEventListener('scroll',check,true);win?.removeEventListener('resize',check);};
}
