import {originalStoryLibraryEntries} from './original-story-library-model.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {mountComicDialogue} from './comic-dialogue-view.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';

const mounts=new WeakMap();
// Reuse the established four-panel reader without its optional seen observer.
export function mountOriginalStoryLibrary({root=globalThis.document,getMangaCollection=()=>null}={}){
 if(mounts.has(root))return mounts.get(root);
 const node=id=>root.getElementById(id),dialog=node('original-story-library-dialog'),opener=node('settings-original-story'),manga=node('settings-original-manga');
 if(!dialog||!opener||!manga)return {open:()=>false,dispose(){}};
 const choice=node('original-story-library-choice'),title=node('original-story-library-title'),lines=node('original-story-library-lines'),position=node('original-story-library-position'),previous=node('original-story-library-previous'),next=node('original-story-library-next');
 const entries=originalStoryLibraryEntries(),listeners=[];let index=0,view=null,disposed=false;
 const listen=(target,type,callback)=>{target.addEventListener(type,callback);listeners.push(()=>target.removeEventListener(type,callback));};
 choice.replaceChildren(...entries.map(entry=>{const option=root.createElement('option');option.value=entry.id;option.textContent=`${entry.category} · ${entry.title}`;return option;}));
 function paint(){
  const entry=entries[index];if(!entry)return false;view?.dispose();
  title.textContent=entry.title;choice.value=entry.id;dialog.dataset.storyId=entry.id;
  position.textContent=`${index+1} / ${entries.length}`;previous.disabled=index===0;next.disabled=index===entries.length-1;
  view=mountComicDialogue(lines,entry,{root});dialog.querySelector('.dialog-scroll').scrollTop=0;return true;
 }
 function select(nextIndex){if(disposed||!dialog.open||nextIndex<0||nextIndex>=entries.length||nextIndex===index)return false;index=nextIndex;return paint();}
 const api={open(){if(disposed||!entries.length)return false;if(dialog.open)return true;node('help-dialog')?.close();paint();dialog.showModal();choice.focus({preventScroll:true});return true;},dispose(){if(disposed)return;disposed=true;view?.dispose();listeners.forEach(remove=>remove());if(dialog.open)dialog.close();mounts.delete(root);}};
 listen(node('original-story-library-close'),'click',()=>{if(!disposed)dialog.close();});
 listen(opener,'click',event=>{if(!(event.detail>1))api.open();});
 listen(manga,'click',event=>{if(disposed||event.detail>1)return;node('help-dialog')?.close();getMangaCollection()?.open('original');});
 listen(choice,'change',()=>select(entries.findIndex(entry=>entry.id===choice.value)));
 listen(previous,'click',event=>{if(!(event.detail>1))select(index-1);});listen(next,'click',event=>{if(!(event.detail>1))select(index+1);});
 listen(dialog,'close',()=>{view?.dispose();view=null;});
 mounts.set(root,api);return api;
}
