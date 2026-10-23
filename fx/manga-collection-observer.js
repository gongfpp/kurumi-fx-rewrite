import {MANGA_PANELS} from './manga-panels.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {CONTEXTUAL_MANGA_ASSETS} from './contextual-manga-content.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {CHARACTER_STORY_ASSETS} from './character-story-content.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {dailyArtMemory,observeSeenArtwork} from './daily-art-memory.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
// Kept independent of achievements/setMangaImage to avoid an import cycle.
const byPath=new Map([...Object.values(MANGA_PANELS),...Object.values(CONTEXTUAL_MANGA_ASSETS),...Object.values(CHARACTER_STORY_ASSETS)].map(p=>[p.original||p.path,p.sha256]));
const bindings=new WeakMap(),documents=new WeakMap();
// One removal observer per document releases hidden/offscreen images when an
// existing reader rerenders. A detached thumbnail must not retain an IO forever.
function watchRemoval(image,dispose){
 const doc=image.ownerDocument,Observer=doc.defaultView?.MutationObserver;
 if(!Observer)return()=>{};
 let watched=documents.get(doc);
 if(!watched){
  const items=new Map(),observer=new Observer(()=>{for(const [node,stop]of [...items])if(node.isConnected===false)stop();});
  observer.observe(doc.documentElement,{childList:true,subtree:true});watched={items,observer};documents.set(doc,watched);
 }
 watched.items.set(image,dispose);
 return()=>{watched.items.delete(image);if(!watched.items.size){watched.observer.disconnect();documents.delete(doc);}};
}
function requestIdentity(src){try{const url=new URL(src);url.searchParams.delete('retry');return url.href;}catch{return src;}}
export function observeMangaCollectionArtwork(image,path,{memory=dailyArtMemory}={}){
 bindings.get(image)?.();bindings.delete(image);
 const hash=byPath.get(String(path||'').split('?')[0]);
 if(!hash||!image.ownerDocument?.defaultView||memory.has?.('sha256:'+hash)===true||image.closest?.('#achievements-dialog'))return()=>{};
 let disposed=false,stop=()=>{},unwatch=()=>{},revision=0;const source=requestIdentity(image.src);
 const current=()=>!disposed&&!image.closest?.('#achievements-dialog')&&requestIdentity(image.src)===source&&image.complete!==false&&image.naturalWidth>0&&image.naturalHeight>0&&(!image.currentSrc||image.currentSrc===image.src);
 const loaded=()=>{
  const ticket=++revision;stop();
  if(!current())return;
  // Decode rejection, a reused image element, a closed dialog or an obsolete
  // IntersectionObserver callback must never award a previously queued panel.
  const decoded=()=>{if(ticket!==revision||!current()||image.isConnected===false)return;
   unwatch();unwatch=watchRemoval(image,dispose);
   stop=observeSeenArtwork(image,{memory:{seen:ids=>current()?memory.seen(ids):false},identities:['sha256:'+hash],minVisibleRatio:.1,accumulateVisibility:true,onSeen:()=>dispose()});if(disposed)stop();
  };
  if(typeof image.decode==='function')Promise.resolve().then(()=>image.decode()).then(decoded,()=>{});else decoded();
 };
 const dispose=()=>{disposed=true;revision++;stop();unwatch();image.removeEventListener('load',loaded);};
 bindings.set(image,dispose);image.addEventListener('load',loaded);loaded();return dispose;
}
