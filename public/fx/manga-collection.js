import {mangaLibraryEntries} from './manga-collection-model.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {dailyArtMemory} from './daily-art-memory.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {setMangaImage} from './manga-images.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {assetURL,setImage} from './assets.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {collectionHdEdition} from './manga-collection-hd.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {LIBRARY_COPY} from './copy/library-ui.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {createSkitLine} from './skit-dialogue.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';

const mounts=new WeakMap();
const put=(node,text)=>{if(node.textContent!==text)node.textContent=text;};
export function mountMangaCollection({root=globalThis.document,getProfile=()=>({}),memory=dailyArtMemory}={}){
 if(!root?.body)return {refresh(){},dispose(){}};
 if(mounts.has(root))return mounts.get(root);
 const book=root.getElementById('achievement-book'),dialog=root.getElementById('achievements-dialog');
 if(!book||!dialog)return {refresh(){},dispose(){}};
 const dialogTitle=dialog.querySelector('h2'),originalTitle=dialogTitle?.textContent,dialogNote=dialog.querySelector('.small-print'),noteHidden=dialogNote?.hidden,eyebrow=dialog.querySelector('.eyebrow'),eyebrowHidden=eyebrow?.hidden;
 let ownedStyle=null;
 if(!root.getElementById('manga-collection-style')){ownedStyle=root.createElement('link');ownedStyle.id='manga-collection-style';ownedStyle.rel='stylesheet';ownedStyle.href=assetURL('./manga-collection.css');root.head.append(ownedStyle);}
 const make=(tag,css,text)=>{const n=root.createElement(tag);n.className=css;if(text!==undefined)n.textContent=text;return n;};
 const button=(css,text)=>{const n=make('button',css,text);n.type='button';return n;};
 const toolbar=dialog.querySelector('.dialog-toolbar'),mobileToolbarTitle=make('span','manga-collection-mobile-toolbar-title',LIBRARY_COPY.manga),closeButton=dialog.querySelector('.x-close'),closeLabel=closeButton?.getAttribute('aria-label');
 if(toolbar)toolbar.append(mobileToolbarTitle);
 const removers=[];const listen=(n,event,fn)=>{n.addEventListener(event,fn);removers.push(()=>n.removeEventListener(event,fn));};
 const tabs=make('div','manga-collection-tabs');tabs.setAttribute('role','tablist');tabs.setAttribute('aria-label','成就与漫画');
 const trophyTab=button('manga-collection-tab','🏆 成就档案'),mangaTab=button('manga-collection-tab',LIBRARY_COPY.manga);
 trophyTab.id='manga-collection-trophy-tab';mangaTab.id='manga-collection-manga-tab';
 for(const [tab,controls]of [[trophyTab,'achievement-book'],[mangaTab,'manga-collection-panel']]){tab.setAttribute('role','tab');tab.setAttribute('aria-controls',controls);}
 tabs.append(trophyTab,mangaTab);book.insertAdjacentElement('beforebegin',tabs);
 const view=make('section','manga-collection-panel');view.id='manga-collection-panel';view.hidden=true;view.setAttribute('role','tabpanel');view.setAttribute('aria-labelledby',mangaTab.id);book.insertAdjacentElement('afterend',view);
 const catalog=make('section','manga-collection-catalog'),header=make('header','manga-collection-header');
 const chapters=root.getElementById('character-story-entry'),chaptersHome=chapters?.parentElement;
 const count=make('span','manga-collection-count'),mobileHeading=make('h3','manga-collection-mobile-heading','原作片段');
 header.append(make('h3','manga-collection-desktop-heading',LIBRARY_COPY.manga),mobileHeading,count);if(chapters)header.append(chapters);
 const filters=make('div','manga-collection-filters');filters.setAttribute('role','group');filters.setAttribute('aria-label','漫画筛选');
 const search=make('input','manga-collection-search');search.type='search';search.placeholder='搜索场景或人物';search.setAttribute('aria-label','搜索场景、人物或对白');
 const grid=make('div','manga-collection-grid'),empty=make('p','manga-collection-empty','还没有符合筛选条件的漫画。');empty.setAttribute('role','status');
 const listNav=make('nav','manga-collection-list-nav'),listBack=button('','‹'),listPosition=make('span',''),listNext=button('','›');listBack.setAttribute('aria-label','上一组漫画');listNext.setAttribute('aria-label','下一组漫画');listNav.setAttribute('aria-label','漫画目录翻页');listNav.append(listBack,listPosition,listNext);
 const nextGroup=button('manga-collection-next-group','下一组 ›');
 const detail=make('section','manga-collection-detail'),detailThumb=make('div','manga-collection-detail-thumb'),detailCopy=make('div','manga-collection-detail-copy'),detailTitle=make('h4',''),detailStatus=make('span','manga-collection-status'),condition=make('p','manga-collection-condition');
 detailCopy.append(detailTitle,detailStatus);detail.append(detailThumb,detailCopy);catalog.append(header,filters,search,grid,empty,listNav,nextGroup,detail);
 const reader=make('section','manga-collection-reader'),readerHeader=make('header','manga-collection-reader-header'),choice=make('select','manga-collection-choice');choice.setAttribute('aria-label','选择漫画');const readerBack=button('manga-collection-reader-back','‹ 返回目录');readerHeader.append(readerBack,make('h3','',LIBRARY_COPY.manga),choice);
 const page=make('div','manga-collection-page'),caption=make('p','manga-collection-caption'),nav=make('nav','manga-collection-reader-nav'),back=button('','‹ 上一页'),position=make('span',''),next=button('','下一页 ›');nav.setAttribute('aria-label','漫画翻页');position.setAttribute('aria-live','polite');nav.append(back,position,next);reader.append(readerHeader,page,caption,nav);view.append(catalog,reader);
 const mobileMedia=root.defaultView?.matchMedia?.('(max-width:760px)');let mobileMode=false;view.dataset.readerOpen='false';
 let active='achievements',filter='original',entries=[],selectedId=null,listPage=0,disposed=false,signature='',pictureSignature='';
 const filterButtons=new Map();
 const available=()=>{const term=search.value?.trim().toLocaleLowerCase();return term?entries.filter(entry=>[entry.title,entry.alt,entry.sourceLabel,entry.context?.title,...(entry.context?.characters||[]),...(entry.context?.paragraphs||[]),...(entry.context?.lines||[]).flat()].filter(Boolean).join(' ').toLocaleLowerCase().includes(term)):entries;};
 function syncMobile(){
  const nextMode=root.body.dataset.frontend==='pixel'&&mobileMedia?.matches===true;
  if(nextMode===mobileMode)return;mobileMode=nextMode;
  // Reparenting a focused filter blurs it in a real DOM. Keep the pre-move
  // target for reader routing, or restore that same filter in the catalog.
  const focused=root.activeElement;
  header.insertAdjacentElement(mobileMode?'beforebegin':'afterend',filters);
  if(active!=='manga')return;
  if(mobileMode&&view.dataset.readerOpen==='true'&&catalog.contains(focused))readerBack.focus({preventScroll:true});
  else if(mobileMode&&tabs.contains(focused))(view.dataset.readerOpen==='true'?readerBack:filterButtons.get(filter))?.focus({preventScroll:true});
  else if(!mobileMode&&[readerBack,nextGroup].includes(focused))[...grid.children].find(card=>card.dataset.collectionId===selectedId)?.focus({preventScroll:true});
  else if(filters.contains(focused))focused.focus({preventScroll:true});
 }
 function showReader(on,{focus=false}={}){
  view.dataset.readerOpen=String(on);
  if(!mobileMode||!focus)return;
  if(on)readerBack.focus({preventScroll:true});
  else [...grid.children].find(card=>card.dataset.collectionId===selectedId)?.focus({preventScroll:true});
  const scroller=dialog.querySelector('.dialog-scroll');if(scroller)scroller.scrollTop=0;
 }
 function applyTab(){
  const collection=active==='manga';dialog.dataset.collectionTab=active;book.hidden=collection;view.hidden=!collection;
  if(closeButton&&closeLabel!==null)closeButton.setAttribute('aria-label',collection?'关闭漫画':closeLabel);
  if(dialogTitle)put(dialogTitle,collection?LIBRARY_COPY.manga:originalTitle);if(dialogNote)dialogNote.hidden=collection||noteHidden;if(eyebrow)eyebrow.hidden=collection||eyebrowHidden;
  for(const [tab,on]of [[trophyTab,!collection],[mangaTab,collection]]){tab.setAttribute('aria-selected',String(on));tab.tabIndex=on?0:-1;}
  // The existing pixel achievement renderer remains mounted and owns its UI.
  // CSS also guards its next async refresh, so it cannot cover this tab.
  const pixel=dialog.querySelector('.pixel-ach-browser');if(pixel)pixel.inert=collection;
 }
 function selectTab(tab,{focus=false}={}){
  if(disposed)return;active=tab;applyTab();if(active==='manga')refresh();if(focus)(active==='manga'?(mobileMode?(view.dataset.readerOpen==='true'?readerBack:filterButtons.get(filter)):mangaTab):trophyTab)?.focus({preventScroll:true});
 }
 function art(frame,entry,{thumbnail=false}={}){
  frame.replaceChildren();
  if(!entry)return;
  const img=make('img',thumbnail?'manga-collection-thumbnail':'manga-collection-original');img.alt=thumbnail?'':entry.alt;
  if(thumbnail)img.setAttribute('aria-hidden','true');
  const [width,height]=entry.dimensions||[];if(width&&height){img.width=width;img.height=height;}
  const hd=thumbnail||entry.category!=='original'?null:collectionHdEdition(entry,{readOnlyPreview:true});
  if(!hd){frame.append(img);setMangaImage(img,entry.path,{loading:thumbnail?'lazy':'eager'});return;}
  const editions=make('div','manga-collection-editions'),jp=button('','高清日文原页'),legacy=button('','原有中文片段');
  editions.setAttribute('role','group');editions.setAttribute('aria-label','漫画版本');editions.append(jp,legacy);frame.append(editions,img);
  let edition=null;
  function showEdition(useHd){
   if(disposed||!frame.contains(img)||edition===useHd)return;edition=useHd;
   frame.querySelector('.manga-image-fallback')?.remove();
   jp.setAttribute('aria-pressed',String(useHd));legacy.setAttribute('aria-pressed',String(!useHd));
   img.alt=useHd?hd.alt:entry.alt;[img.width,img.height]=useHd?hd.dimensions:entry.dimensions;
   // A failed optional original falls back to the preserved Chinese panel.
   // This reader never records a new content identity or writes a save.
   img.loading='eager';img.decoding='async';
   setImage(img,useHd?hd.path:entry.path,{onStatus:status=>{
    if(disposed||!frame.contains(img)||edition!==useHd)return;
    if(status==='ready')frame.querySelector('.manga-image-fallback')?.remove();
    if(status!=='unavailable')return;
    if(useHd){showEdition(false);return;}
    if(!frame.querySelector('.manga-image-fallback')){const note=make('p','manga-image-fallback','漫画图片暂时无法载入；本局数值与文字说明仍可查看。');note.setAttribute('role','status');frame.append(note);}
   }});
  }
  jp.addEventListener('click',event=>{if(event.detail<=1)showEdition(true);});legacy.addEventListener('click',event=>{if(event.detail<=1)showEdition(false);});showEdition(true);
 }
 function paintSelection({resetScroll=false}={}){
  if(chapters)chapters.style.display=filter==='original'?'':'none';
  put(mobileHeading,filter==='original'?'原作片段':'同人漫画');
  const items=available();if(!items.some(e=>e.id===selectedId))selectedId=items[0]?.id||null;
  put(count,LIBRARY_COPY.mangaCount.replace('{count}',String(items.length)));
  const selected=items.find(e=>e.id===selectedId),index=items.findIndex(e=>e.id===selectedId);
  if(selected&&(index<listPage*4||index>=listPage*4+4))listPage=Math.floor(index/4);
  for(const [key,b]of filterButtons)b.setAttribute('aria-pressed',String(key===filter));
  empty.hidden=items.length>0;grid.replaceChildren();
  for(const entry of items.slice(listPage*4,listPage*4+4)){
   const card=button('manga-collection-card',''),thumb=make('span','manga-collection-thumb');card.dataset.collectionId=entry.id;card.setAttribute('aria-pressed',String(entry.id===selectedId));card.setAttribute('aria-label',`${entry.sourceLabel} · ${entry.title}`);
   const icon=make('span','manga-collection-book-icon'),badge=make('span','manga-collection-chapter',entry.chapter?`第${entry.chapter}话`:entry.category==='fan'?LIBRARY_COPY.fanArt:LIBRARY_COPY.original),chevron=make('span','manga-collection-card-chevron','›'),read=make('span','manga-collection-read','阅读');
   for(const decorative of [icon,badge,chevron,read])decorative.setAttribute('aria-hidden','true');
   art(thumb,entry,{thumbnail:true});card.append(thumb,icon,badge,make('strong','',entry.title),make('span','manga-collection-card-status',entry.sourceLabel),chevron,read);card.addEventListener('click',event=>{if(disposed||active!=='manga'||event.detail>1||!grid.contains(card))return;select(entry.id);showReader(true,{focus:true});});grid.append(card);
  }
  const pages=Math.ceil(items.length/4);put(listPosition,pages?`${listPage+1} / ${pages}`:'0 / 0');listBack.disabled=listPage<=0;listNext.disabled=listPage>=pages-1;listNav.hidden=pages<2;nextGroup.hidden=pages<2;nextGroup.disabled=listNext.disabled;
  detail.hidden=!selected;reader.hidden=!selected;
  choice.replaceChildren(...items.map(e=>{const option=make('option','',`${e.sourceLabel} · ${e.title}`);option.value=e.id;return option;}));choice.value=selectedId||'';
  if(!selected){page.replaceChildren();detailThumb.replaceChildren();pictureSignature='';return;}
  put(detailTitle,selected.title);put(detailStatus,filter==='original'?LIBRARY_COPY.original:LIBRARY_COPY.fanArt);
  const key=selected.id;
  if(key!==pictureSignature){
   art(page,selected);art(detailThumb,selected,{thumbnail:true});
   const context=selected.context;
   if(context){
    const text=make('section','manga-collection-scene-context');text.append(make('h4','',context.title||selected.title));
    if(context.characters?.length)text.append(make('p','manga-collection-scene-cast',context.characters.join('、')));
    if(context.setting)text.append(make('p','',context.setting));
    for(const paragraph of context.paragraphs||[])text.append(make('p','',paragraph));
    // Complete frozen exchanges are shown in their existing panel/speaker order.
    // Browsing never invokes a natural scene observer or an action callback.
    if(context.dialoguePanels?.length){
     const panels=make('ol','manga-collection-dialogue-panels');
     for(const panel of context.dialoguePanels){const item=make('li','');for(const [from,line]of panel.lines)item.append(createSkitLine(root,from,line));panels.append(item);}text.append(panels);
    }else for(const [from,line]of context.lines||[])text.append(createSkitLine(root,from,line));
    page.append(text);
   }
   pictureSignature=key;
  }
  page.dataset.locked='false';put(caption,`${selected.sourceLabel} · ${selected.title}`);
  back.disabled=index<=0;next.disabled=index>=items.length-1;put(position,`${index+1} / ${items.length}`);if(resetScroll)page.scrollTop=0;
 }
 function select(id){if(disposed||active!=='manga'||!available().some(e=>e.id===id))return;selectedId=id;paintSelection({resetScroll:true});}
 function move(delta,event){if(event?.repeat||event?.detail>1||active!=='manga')return;const items=available(),index=items.findIndex(e=>e.id===selectedId);if(items[index+delta])select(items[index+delta].id);}
 for(const [key,label]of [['original',LIBRARY_COPY.original],['fan',LIBRARY_COPY.fanArt]]){const b=button('manga-collection-filter',label);filterButtons.set(key,b);filters.append(b);listen(b,'click',event=>{if(disposed||active!=='manga'||event.detail>1)return;showReader(false);if(filter===key)return;filter=key;listPage=0;selectedId=null;refresh();});}
 listen(trophyTab,'click',()=>selectTab('achievements'));listen(mangaTab,'click',()=>selectTab('manga'));
 listen(tabs,'keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)||event.repeat)return;event.preventDefault();selectTab(event.key==='Home'?'achievements':event.key==='End'?'manga':active==='manga'?'achievements':'manga',{focus:true});});
 listen(readerBack,'click',()=>{if(disposed||active!=='manga')return;showReader(false,{focus:true});});
 listen(back,'click',event=>move(-1,event));listen(next,'click',event=>move(1,event));listen(choice,'change',()=>select(choice.value));
 listen(search,'input',()=>{if(disposed||active!=='manga')return;listPage=0;selectedId=null;paintSelection({resetScroll:true});});
 listen(listBack,'click',event=>{if(disposed||active!=='manga'||event.detail>1)return;const e=available()[(listPage-1)*4];if(e)select(e.id);});const nextListPage=event=>{if(disposed||active!=='manga'||event.detail>1)return;const e=available()[(listPage+1)*4];if(e)select(e.id);};listen(listNext,'click',nextListPage);listen(nextGroup,'click',nextListPage);
 function refresh(){
  if(disposed)return false;syncMobile();applyTab();if(active!=='manga')return true;
  const current=mangaLibraryEntries(filter),nextSignature=filter+':'+current.map(e=>e.id).join(',');
  if(nextSignature===signature)return true;entries=current;signature=nextSignature;
  put(count,LIBRARY_COPY.mangaCount.replace('{count}',String(entries.length)));paintSelection();return true;
 }
 const Observer=root.defaultView?.MutationObserver;const observer=Observer?new Observer(refresh):null;observer?.observe(book,{childList:true});
 const frontendObserver=Observer?new Observer(refresh):null;frontendObserver?.observe(root.body,{attributes:true,attributeFilter:['data-frontend']});
 mobileMedia?.addEventListener?.('change',refresh);
 listen(dialog,'close',()=>{if(view.contains(root.activeElement))(mobileMode?closeButton:mangaTab)?.focus({preventScroll:true});});
 for(const [id,category]of [['manga-original-open','original'],['manga-fan-open','fan']]){const opener=root.getElementById(id);if(opener)listen(opener,'click',()=>api.open(category));}
 const api={refresh,showAchievements(){selectTab('achievements');},open(category='original'){if(disposed)return false;filter=category==='fan'?'fan':'original';showReader(false);selectTab('manga');if(!dialog.open)dialog.showModal();return true;},dispose(){if(disposed)return;disposed=true;observer?.disconnect();frontendObserver?.disconnect();mobileMedia?.removeEventListener?.('change',refresh);removers.forEach(fn=>fn());const focused=view.contains(root.activeElement)||tabs.contains(root.activeElement);if(chapters&&chaptersHome){chapters.style.display='';chaptersHome.append(chapters);}tabs.remove();view.remove();mobileToolbarTitle.remove();book.hidden=false;if(closeButton&&closeLabel!==null)closeButton.setAttribute('aria-label',closeLabel);if(dialogTitle)put(dialogTitle,originalTitle);if(dialogNote)dialogNote.hidden=noteHidden;if(eyebrow)eyebrow.hidden=eyebrowHidden;delete dialog.dataset.collectionTab;const pixel=dialog.querySelector('.pixel-ach-browser');if(pixel)pixel.inert=false;ownedStyle?.remove();if(focused)dialog.querySelector('.x-close')?.focus({preventScroll:true});mounts.delete(root);}};
 mounts.set(root,api);refresh();return api;
}
