import {prepareModalFocus,restoreFocus} from './focus-safety.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {NEWS_ARCHIVE} from './news-archive.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {availableNews,newsAvailableAt,newsContext,newsDate} from './news-context.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {formatTradingTime} from './trading-time.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {NEWS_MARKET_COPY as COPY} from './copy/news-market.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {newsSourceDetails} from './news-source-view.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {closeAllModalOpen} from './close-all-control.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {displayedNewsItems} from './displayed-news-session.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';

// Compact labels use the viewed market date only as a comparison. The item's
// own publication instant supplies its JST day/time; availability is not a clock.
export function mobileNewsListTime(item,referenceDate){
 const date=newsDate(item?.publishedAt);
 if(!date||typeof referenceDate!=='string'||!/^\d{4}-\d\d-\d\d$/.test(referenceDate))return item?.time||'';
 const day=date===referenceDate?'':date.slice(0,4)===referenceDate.slice(0,4)?date.slice(5):date;
 return [day,formatTradingTime(item.publishedAt)].filter(Boolean).join(' ');
}

// Read-only publication list. Eligibility is the archive's existing pair/date/
// review gate; neither future script events nor archive bag mutations are read.
export function mobileNewsItems(state,current,{archive=NEWS_ARCHIVE}={}){
 const context=newsContext(state),rows=archive.filter(entry=>availableNews(entry,context)).map(entry=>{
  const at=typeof entry.publishedAt==='string'&&/(Z|[+-]\d\d:\d\d)$/.test(entry.publishedAt)?Date.parse(entry.publishedAt):NaN;
  const publishedAt=Number.isFinite(at)?at:null;
  return {id:entry.id,archiveId:entry.id,title:entry.title,copy:entry.summary,source:entry.sourceName,
   // Availability is a conservative visibility gate, not a publication timestamp.
   time:publishedAt===null?`${entry.date} · ${COPY.labels.unknownTime}`:formatTradingTime(publishedAt,{full:true}),
   publishedAt,publicationDate:publishedAt===null?entry.date:newsDate(publishedAt),availableAt:newsAvailableAt(entry),
   sourceUrl:entry.sourceUrl,sourceAttribution:entry.sourceAttribution,sourceLicenseUrl:entry.sourceLicenseUrl,
   summaryNotice:entry.summaryNotice,contentKind:'historical_fact'};
 }).filter(item=>item.publishedAt===null||item.publishedAt<=context.at).sort((a,b)=>
  b.publicationDate.localeCompare(a.publicationDate)||(b.publishedAt??-Infinity)-(a.publishedAt??-Infinity)||a.id.localeCompare(b.id));
 const displayed=displayedNewsItems(state);
 rows.unshift(...displayed);
 if(current?.title&&current.contentKind!=='historical_fact'&&current.contentKind!=='fictional_market_event'&&(!Number.isFinite(current.publishedAt)||current.publishedAt<=context.at))rows.unshift({...current,id:`current:${context.mode}:${context.pair}:${current.id??''}:${current.publishedAt??context.at}:${current.title}`});
 return rows.map(item=>({...item,listTime:mobileNewsListTime(item,context.date)}));
}

export function mountMobileNewsList({document:doc=globalThis.document,onClose=()=>{}}={}){
 const native=doc.getElementById('news');if(!native)return null;
 const make=(tag,className,text)=>{const node=doc.createElement(tag);node.className=className;if(text!==undefined)node.textContent=text;return node;};
 const feed=make('section','mobile-news-feed'),heading=make('div','mobile-news-heading'),more=make('button','mobile-news-more','更多 ›'),list=make('div','mobile-news-three');
 more.type='button';more.setAttribute('aria-haspopup','dialog');more.setAttribute('aria-controls','mobile-news-dialog');heading.append(make('h2','','市场快讯'),more);feed.append(heading,list);feed.hidden=true;
 const dialog=make('dialog','mobile-news-dialog'),dialogHeader=make('div','mobile-news-dialog-heading'),back=make('button','','返回列表'),title=make('h2','','市场快讯'),close=make('button','x-close','关闭'),body=make('div','mobile-news-dialog-body');
 dialog.id='mobile-news-dialog';title.id='mobile-news-dialog-title';dialog.setAttribute('aria-labelledby',title.id);dialog.setAttribute('data-mobile-news-dialog','true');back.type=close.type='button';dialogHeader.append(back,title,close);dialog.append(dialogHeader,body);doc.body.append(dialog);
 const listeners=[];const listen=(node,type,fn)=>{node?.addEventListener(type,fn);listeners.push(()=>node?.removeEventListener(type,fn));};
 let items=[],snapshot=[],active=false,disposed=false,opener=null,listMode=true,lastSignature='',savedHidden=native.hidden,selectedIndex=0,listScroll=0,listShellScroll=0;
 function row(item,index,scope){const button=make('button','mobile-news-row'),time=make('time','',scope==='three'?(item.listTime??item.time??''):(item.time||'')),label=make('span','',item.title||'');button.type='button';button.dataset.newsIndex=String(index);button.dataset.newsScope=scope;button.setAttribute('aria-haspopup','dialog');time.setAttribute('aria-label',item.time||'');time.title=item.time||'';button.append(time,label,make('span','mobile-news-chevron','›'));return button;}
 function renderList(restore=false){listMode=true;back.hidden=true;title.textContent='市场快讯';body.replaceChildren();snapshot.forEach((item,index)=>body.append(row(item,index,'all')));if(!snapshot.length)body.append(make('p','','暂无快讯'));if(restore){body.scrollTop=listScroll;const scroller=dialog.querySelector('.dialog-scroll');if(scroller)scroller.scrollTop=listShellScroll;body.querySelectorAll('[data-news-index]')[selectedIndex]?.focus({preventScroll:true});}}
 function source(item,parent){
  const {url,attribution,licenseUrl}=newsSourceDetails(item);if(!url&&!attribution&&!licenseUrl)return;
  const line=make('p','mobile-news-source');
  if(url){const a=make('a','','原始发布');a.href=url;a.target='_blank';a.rel='noopener noreferrer';line.append(a);}
  if(attribution)line.append(make('span','',`${url?' · ':''}${attribution}`));
  if(licenseUrl){const link=make('a','',`${url||attribution?' · ':''}CC BY 4.0`);link.href=licenseUrl;link.target='_blank';link.rel='noopener noreferrer';line.append(link);}parent.append(line);
 }
 function showItem(item,fromList,index=0){
  if(fromList){selectedIndex=index;listScroll=body.scrollTop;listShellScroll=dialog.querySelector('.dialog-scroll')?.scrollTop||0;}
  listMode=false;back.hidden=!fromList;title.textContent=item.title||'新闻详情';body.replaceChildren();
  for(const text of [item.copy,item.recap?.copy?`${item.recap.title} · ${item.recap.copy}`:null,[item.source,item.time].filter(Boolean).join(' · ')])if(text)body.append(make('p','',text));
  source(item,body);
  if(item.background?.contentKind==='historical_fact'){const section=make('section','mobile-news-background');section.append(make('h3','','历史背景'),make('h4','',item.background.title),make('p','',item.background.copy));source(item.background,section);body.append(section);}
  body.scrollTop=0;back.hidden?close.focus({preventScroll:true}):back.focus({preventScroll:true});
 }
 function open(index=null){
  if(disposed||!active||dialog.open||closeAllModalOpen(doc)||index!==null&&(!Number.isInteger(index)||!items[index]))return false;
  snapshot=items.map(item=>({...item,recap:item.recap?{...item.recap}:null,background:item.background?{...item.background}:null}));
  opener=prepareModalFocus(doc);selectedIndex=0;listScroll=0;listShellScroll=0;index===null?renderList():showItem(snapshot[index],false);dialog.showModal();close.focus({preventScroll:true});return true;
 }
 function sync(){
  if(disposed)return;
  const next=doc.body.dataset.frontend==='pixel'&&doc.getElementById('pixel-frontend')?.dataset.mobileLayout==='true';
  if(next!==active){active=next;if(active)savedHidden=native.hidden;else{native.hidden=savedHidden;if(dialog.open)dialog.close();}}
  if(feed.parentNode!==native.parentNode||native.nextSibling!==feed)native.after(feed);
  feed.hidden=!active;if(active)native.hidden=true;
 }
 function render(next){
  if(disposed)return;items=Array.isArray(next)?next:[];
  const signature=JSON.stringify(items.slice(0,3).map(item=>[item.id,item.title,item.time,item.listTime]));
  if(signature!==lastSignature){lastSignature=signature;list.replaceChildren();items.slice(0,3).forEach((item,index)=>list.append(row(item,index,'three')));}
  more.disabled=!items.length;sync();
 }
 listen(more,'click',event=>{if(event.detail>1)return;open();});
 listen(list,'click',event=>{const target=event.target.closest('[data-news-index]');if(target&&!(event.detail>1)){target.focus({preventScroll:true});open(Number(target.dataset.newsIndex));}});
 listen(body,'click',event=>{const target=event.target.closest('[data-news-index]');if(!listMode||!target||event.detail>1)return;const item=snapshot[Number(target.dataset.newsIndex)];if(item)showItem(item,true,Number(target.dataset.newsIndex));});
 listen(back,'click',()=>renderList(true));
 listen(close,'click',()=>dialog.close());
 listen(dialog,'close',()=>{
  if(disposed)return;onClose();
  // The shared shell and frontend host also restore focus. Run after their
  // close microtask so a now-hidden mobile opener cannot win on legacy return.
  queueMicrotask(()=>queueMicrotask(()=>{
   if(disposed||doc.querySelector('dialog[open]'))return;
   const visible=node=>node?.isConnected&&!node.disabled&&!node.closest('[hidden]')&&(!node.closest('dialog')||node.closest('dialog').open);
   const fallback=active?more:[doc.getElementById('market-symbol'),doc.getElementById('help')].find(visible);
   const target=active&&visible(opener)?opener:fallback;restoreFocus({node:target},doc);
  }));
 });
 listen(dialog,'keydown',event=>{
  if(event.key==='Escape'&&!back.hidden){event.preventDefault();renderList(true);return;}
  if(event.key!=='Tab')return;
  const focusable=[...dialog.querySelectorAll('button,a[href]')].filter(node=>!node.hidden&&!node.disabled),first=focusable[0],last=focusable.at(-1);
  if(event.shiftKey&&doc.activeElement===first){event.preventDefault();last?.focus();}else if(!event.shiftKey&&doc.activeElement===last){event.preventDefault();first?.focus();}
 });
 listen(doc,'kurumi:frontendchange',sync);listen(doc.defaultView,'resize',()=>queueMicrotask(sync));
 return {render,sync,open,feed,dialog,dispose(){if(disposed)return;disposed=true;listeners.forEach(remove=>remove());if(active)native.hidden=savedHidden;if(dialog.open)dialog.close();feed.remove();dialog.remove();}};
}
