import {CHARACTER_STORY_ASSETS,createCharacterStorySession} from './character-story-content.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {setImage} from './assets.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';

// A presentation-only reader. No engine, story queue, persistence, or account imports.
export function mountCharacterStoryReader({root=document,getState,getContext,canOpen=()=>true}){
 const $=id=>root.getElementById(id),dialog=$('character-story-dialog'),entry=$('character-story-entry'),open=$('character-story-open'),footer=$('character-story-controls');
 const make=(tag,text)=>{const node=root.createElement(tag);if(text!==undefined)node.textContent=text;return node;};
 let lastContext=null,scrollTop=0,painting=false;
 function paint({index,node,total}){
  painting=true;dialog.dataset.node=node.id;
  $('character-story-title').textContent=node.title;
  $('character-story-context').textContent=node.people;
  $('character-story-before').textContent=node.before;
  $('character-story-aftermath').textContent=node.after;
  const panels=$('character-story-panels');panels.replaceChildren();
  for(const panel of node.panels){
   if(panel.before)panels.append(make('p',panel.before));
   const asset=CHARACTER_STORY_ASSETS[panel.record],figure=make('figure'),image=make('img'),missing=make('p','图片暂未加载。');
   missing.hidden=true;missing.className='character-story-missing';missing.setAttribute('role','status');
   image.alt=panel.alt;image.width=asset.dimensions[0];image.height=asset.dimensions[1];image.loading='eager';image.decoding='async';image.dataset.sourceRecord=String(panel.record);setImage(image,asset.path);
   const failed=image.onerror;image.onerror=event=>{failed?.call(image,event);if(image.classList.contains('image-unavailable')){missing.hidden=false;image.hidden=true;}};
   figure.append(image,missing);panels.append(figure);
  }
  $('character-story-position').textContent=`${index+1} / ${total}`;
  $('character-story-prev').disabled=index===0;$('character-story-next').disabled=index===total-1;
  const scroller=dialog.querySelector('.dialog-scroll');if(scroller)scroller.scrollTop=0;scrollTop=0;painting=false;
 }
 const session=createCharacterStorySession({getState,getContext,canOpen,readOnlyPreview:true,onPage:paint,onClose:()=>{if(dialog.open)dialog.close();}});
 function show(){
  const collection=root.getElementById('achievements-dialog'),fromCollection=collection?.open===true;if(fromCollection)collection.close();
  // Preserve the last position only in this live module and this run.
  const context=getContext(),resume=context===lastContext?scrollTop:0;
  if(!session.open()){if(fromCollection)collection.showModal();return false;}
  lastContext=context;
  if(footer.parentElement!==dialog)dialog.append(footer);
  dialog.showModal();const scroller=dialog.querySelector('.dialog-scroll');if(scroller)scroller.scrollTop=resume;
  $('character-story-close').focus({preventScroll:true});return true;
 }
 const move=(delta,event)=>{if(event?.detail>1||event?.repeat)return;session.move(delta);};
 open.addEventListener('click',show);
 $('character-story-prev').addEventListener('click',event=>move(-1,event));
 $('character-story-next').addEventListener('click',event=>move(1,event));
 $('character-story-return').addEventListener('click',()=>session.close());
 $('character-story-close').addEventListener('click',()=>session.close());
 dialog.addEventListener('cancel',event=>{event.preventDefault();session.close();});
 dialog.addEventListener('close',()=>{if(!dialog.open)session.close();});
 dialog.addEventListener('scroll',event=>{if(!painting&&session.active&&event.target.classList?.contains('dialog-scroll'))scrollTop=event.target.scrollTop;},true);
 dialog.addEventListener('keydown',event=>{if(event.altKey||event.ctrlKey||event.metaKey||!['ArrowLeft','ArrowRight'].includes(event.key))return;event.preventDefault();move(event.key==='ArrowLeft'?-1:1,event);});
 root.defaultView?.addEventListener('popstate',()=>session.close());
 return {refresh(){entry.hidden=!session.refresh();if(lastContext!==getContext()){lastContext=null;scrollTop=0;}},open:show};
}
