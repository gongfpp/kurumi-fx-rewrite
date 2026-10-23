import {ALL_ACHIEVEMENTS as ACHIEVEMENTS} from './achievements.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {achievementManga} from './manga-achievements.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {setImage} from './assets.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {setMangaImage} from './manga-images.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';

// A presentation-only companion to the original book. Original cards, controls,
// reader sessions, unlock evaluation and persistence always stay with app.js.
const mounted=new WeakMap();
const textOf=(node,selector)=>node.querySelector(selector)?.textContent||'';
const put=(node,text)=>{if(node.textContent!==text)node.textContent=text;};
export function readPixelAchievementEntries(book){
 const definitions=new Map(ACHIEVEMENTS.map(def=>[def.name,def]));
 const cards=[...book.children].filter(node=>node.classList.contains('fx-ach-entry'));
 const entries=cards.map(card=>{
  const name=textOf(card,'.fx-ach-name'),def=definitions.get(name);if(!def)return null;
  const image=card.querySelector('.fx-ach-source-image'),badgeImage=card.querySelector('.fx-ach-badge-image');
  return {id:def.id,name,description:textOf(card,'.fx-ach-copy'),locked:card.classList.contains('locked'),
   notes:[...card.querySelectorAll('.fx-ach-meta')].map(node=>node.textContent),
   badge:textOf(card,'.fx-ach-badge-text'),thumbnail:badgeImage?.dataset.asset||null,
   picture:image?achievementManga(def.id)?.panel.original||null:null};
 });
 // Fail open to the untouched original book if its rendering contract changes.
 return entries.some(entry=>!entry)||new Set(entries.map(entry=>entry.id)).size!==entries.length?[]:entries;
}

export function mountPixelReaders({root=globalThis.document}={}){
 if(!root?.body)return {refresh(){},dispose(){}};
 const existing=mounted.get(root);if(existing)return existing;
 const book=root.getElementById('achievement-book'),dialog=root.getElementById('achievements-dialog');
 if(!book||!dialog)return {refresh(){},dispose(){}};
 const make=(tag,className,text)=>{const node=root.createElement(tag);node.className=className;if(text!==undefined)node.textContent=text;return node;};
 const button=(className,text)=>{const node=make('button',className,text);node.type='button';return node;};
 const removers=[];
 const listen=(node,event,handler)=>{node.addEventListener(event,handler);removers.push(()=>node.removeEventListener(event,handler));};
 const view=make('section','pixel-ach-browser');view.hidden=true;view.setAttribute('aria-label','成就详情与插图');
 const catalog=make('section','pixel-ach-catalog'),header=make('header','pixel-ach-section-header'),heading=make('h3','pixel-ach-heading','成就'),count=make('span','pixel-ach-count');
 const filters=make('div','pixel-ach-filters');filters.setAttribute('role','group');filters.setAttribute('aria-label','成就筛选');
 const grid=make('div','pixel-ach-grid');grid.setAttribute('aria-label','成就列表');
 const empty=make('p','pixel-ach-empty','没有符合筛选条件的成就。');empty.hidden=true;empty.setAttribute('role','status');
 const detail=make('section','pixel-ach-detail');detail.setAttribute('aria-label','当前成就详情');
 const detailTitle=make('h4','pixel-ach-detail-title'),status=make('p','pixel-ach-detail-status'),conditionLabel=make('h5','pixel-ach-condition-title','达成条件'),condition=make('p','pixel-ach-condition'),notes=make('p','pixel-ach-detail-notes');
 detail.append(detailTitle,status,conditionLabel,condition,notes);header.append(heading,count,filters);catalog.append(header,grid,empty,detail);
 const reader=make('section','pixel-ach-reader'),readerHeader=make('header','pixel-ach-section-header'),readerHeading=make('h3','pixel-ach-heading','成就插图');
 const choice=make('select','pixel-ach-choice');choice.setAttribute('aria-label','选择成就插图');readerHeader.append(readerHeading,choice);
 const art=make('figure','pixel-ach-art'),imageFrame=make('div','pixel-ach-image-frame'),caption=make('figcaption','pixel-ach-caption');art.append(imageFrame,caption);
 const nav=make('nav','pixel-ach-nav');nav.setAttribute('aria-label','成就插图翻页');
 const previous=button('pixel-ach-previous','‹ 上一张'),position=make('span','pixel-ach-position'),next=button('pixel-ach-next','下一张 ›');position.setAttribute('aria-live','polite');
 nav.append(previous,position,next);reader.append(readerHeader,art,nav);view.append(catalog,reader);book.insertAdjacentElement('afterend',view);
 let entries=[],selectedId=null,filter='all',disposed=false,lastSignature='',lastPicture=null,previousSkin=null;
 const tiles=new Map(),filterButtons=new Map(),scrollBySkin=new Map();
 const isPixel=()=>root.body.dataset.frontend==='pixel';
 const restoreOriginal=()=>{
  book.classList.remove('pixel-ach-enhanced');
  if(view.contains(root.activeElement))dialog.querySelector('.x-close')?.focus({preventScroll:true});
  view.hidden=true;
 };
 const visible=()=>entries.filter(entry=>filter==='all'||(filter==='unlocked'?!entry.locked:entry.locked));
 function setThumbnail(frame,entry){
  frame.replaceChildren();const fallback=make('span','pixel-ach-badge-text',entry.locked?'锁':entry.badge);frame.append(fallback);
  if(!entry.locked&&entry.thumbnail){
   const image=make('img','pixel-ach-badge-image');image.alt='';image.setAttribute('aria-hidden','true');image.hidden=true;image.width=image.height=96;image.loading='lazy';image.decoding='async';frame.append(image);
   setImage(image,entry.thumbnail,{onStatus:state=>{const ready=state==='ready'&&image.naturalWidth>0&&image.naturalHeight>0;image.hidden=!ready;fallback.hidden=ready;}});
  }
 }
 function paintSelection({resetScroll=false}={}){
  const available=visible();if(!available.some(entry=>entry.id===selectedId))selectedId=available[0]?.id||null;
  const selected=entries.find(entry=>entry.id===selectedId),index=available.findIndex(entry=>entry.id===selectedId);
  for(const entry of entries){const tile=tiles.get(entry.id);tile.button.hidden=!available.includes(entry);tile.button.setAttribute('aria-pressed',String(entry.id===selectedId));}
  for(const [value,node]of filterButtons)node.setAttribute('aria-pressed',String(value===filter));
  empty.hidden=available.length>0;detail.hidden=!selected;reader.hidden=!selected;
  if(!selected){lastPicture=null;imageFrame.replaceChildren();return;}
  put(detailTitle,selected.name);put(status,selected.notes.at(-1)||'');put(condition,selected.description);put(notes,selected.notes.slice(0,-1).join('\n'));notes.hidden=!notes.textContent;
  detail.dataset.locked=String(selected.locked);choice.value=selected.id;
  for(const option of choice.children){option.hidden=!available.some(entry=>entry.id===option.value);option.disabled=option.hidden;}
  previous.disabled=index<=0;next.disabled=index===available.length-1;put(position,`${index+1} / ${available.length}`);
  // Repainting the live book must not restart an image request or its retry.
  if(lastPicture!==selected.picture){
   imageFrame.replaceChildren();
   if(selected.picture){const image=make('img','pixel-ach-page');image.alt=`${selected.name} · 成就插图`;imageFrame.append(image);setMangaImage(image,selected.picture,{loading:'eager'});}
   lastPicture=selected.picture;
  }
  const image=imageFrame.querySelector('img');if(image)image.alt=`${selected.name} · 成就插图`;
  put(caption,selected.name);art.hidden=!selected.picture;
  if(resetScroll)imageFrame.scrollTop=0;
 }
 function select(id){if(disposed||!isPixel()||view.hidden||!visible().some(entry=>entry.id===id))return;selectedId=id;paintSelection({resetScroll:true});}
 function move(delta,event){if(event?.detail>1||event?.repeat)return;const available=visible(),index=available.findIndex(entry=>entry.id===selectedId);const entry=available[index+delta];if(entry)select(entry.id);}
 for(const [value,label]of [['all','全部'],['unlocked','已解锁'],['locked','未解锁']]){
  const node=button('pixel-ach-filter',label);filterButtons.set(value,node);filters.append(node);
  listen(node,'click',()=>{if(disposed||!isPixel()||view.hidden)return;filter=value;paintSelection({resetScroll:true});});
 }
 listen(previous,'click',event=>move(-1,event));listen(next,'click',event=>move(1,event));listen(choice,'change',()=>select(choice.value));
 function update(){
  if(disposed)return false;
  const pixel=isPixel(),skin=pixel?'pixel':'legacy',scroller=dialog.querySelector('.dialog-scroll');
  if(previousSkin!==skin){
   if(previousSkin&&scroller)scrollBySkin.set(previousSkin,scroller.scrollTop);
   // A pixel-only tile has no legacy equivalent. Keep keyboard focus inside
   // the same modal at its original close button, never behind the dialog.
   if(!pixel&&view.contains(root.activeElement))dialog.querySelector('.x-close')?.focus({preventScroll:true});
   if(scroller&&scrollBySkin.has(skin))scroller.scrollTop=scrollBySkin.get(skin);
   previousSkin=skin;
  }
  const records=readPixelAchievementEntries(book),signature=JSON.stringify(records);
  if(!pixel||!records.length){restoreOriginal();return true;}
  if(signature!==lastSignature){
   entries=records;
   const wanted=new Set(entries.map(entry=>entry.id));
   for(const [id,tile]of tiles)if(!wanted.has(id)){tile.remove();tile.button.remove();tiles.delete(id);}
   for(const entry of entries){
    let tile=tiles.get(entry.id);
    if(!tile){
     const node=button('pixel-ach-tile',''),frame=make('span','pixel-ach-thumb'),name=make('span','pixel-ach-tile-name');node.dataset.achievementId=entry.id;node.append(frame,name);
     const handler=()=>select(entry.id);node.addEventListener('click',handler);tile={button:node,frame,name,signature:'',remove:()=>node.removeEventListener('click',handler)};tiles.set(entry.id,tile);grid.append(node);
    }
    put(tile.name,entry.name);tile.button.classList.toggle('locked',entry.locked);tile.button.setAttribute('aria-label',`${entry.name}，${entry.locked?'未解锁':'已解锁'}`);
    const badgeSignature=JSON.stringify([entry.locked,entry.thumbnail,entry.badge]);if(tile.signature!==badgeSignature){setThumbnail(tile.frame,entry);tile.signature=badgeSignature;}
   }
   // Options are inert metadata; original controls and cards are not replaced.
   choice.replaceChildren(...entries.map(entry=>{const option=make('option','',entry.name);option.value=entry.id;return option;}));
   put(count,`${entries.filter(entry=>!entry.locked).length} / ${entries.length}`);paintSelection();lastSignature=signature;
  }
  book.classList.add('pixel-ach-enhanced');view.hidden=false;return true;
 }
 function refresh(){
  try{return update();}catch{
   // A presentation failure must never remove the functioning original book.
   lastSignature='';restoreOriginal();return false;
  }
 }
 const Observer=root.defaultView?.MutationObserver||globalThis.MutationObserver;
 const observer=Observer?new Observer(refresh):null;observer?.observe(book,{childList:true});
 const api={refresh,dispose(){
  if(disposed)return;disposed=true;observer?.disconnect();for(const remove of removers)remove();for(const tile of tiles.values())tile.remove();
  if(view.contains(root.activeElement))dialog.querySelector('.x-close')?.focus({preventScroll:true});
  view.remove();book.classList.remove('pixel-ach-enhanced');mounted.delete(root);
 }};
 mounted.set(root,api);refresh();return api;
}
