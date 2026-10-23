import {originalPublicationUrl,renderArchiveSource} from './news-source-view.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {closeAllModalOpen} from './close-all-control.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {NEWS_MARKET_COPY as COPY} from './copy/news-market.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';

// The card shows the publication, time and a short body/observed-market recap. The existing detail dialog owns scrolling,
// Escape, touch, focus return and the ordinary modal playback boundary.
export function mountNewsDetails({document=globalThis.document,openDetails}={}){
 const get=id=>document.getElementById(id),list=get('news'),title=get('news-title'),copy=get('news-copy');
 const meta=list?.querySelector('.news-meta'),source=get('news-archive-source'),sources=get('news-archive-details');
 if(!list||!title||!copy||!meta||!source||!sources||typeof openDetails!=='function')return null;
 const recap=document.createElement('p'),hint=document.createElement('span');recap.id='news-recap';hint.className='news-detail-hint';hint.textContent=COPY.labels.details+' ›';hint.setAttribute('aria-hidden','true');list.append(recap,hint);
 const attributes=['role','tabindex','aria-haspopup','aria-controls','aria-labelledby','aria-describedby'];
 const before=new Map(attributes.map(name=>[name,list.getAttribute(name)]));
 const visibility={meta:meta.hidden,copy:copy.hidden};let current=null,disposed=false;
 list.setAttribute('role','button');list.setAttribute('tabindex','0');list.setAttribute('aria-haspopup','dialog');
 list.setAttribute('aria-controls','detail-dialog');list.setAttribute('aria-labelledby','news-title');list.setAttribute('aria-describedby','news-time news-copy news-recap');
 // Repeated trade renders often keep the same news. Avoid replacing its text
 // nodes; compare the DOM so external edits are still repaired on the next render.
 const text=(node,value)=>{if(node){const next=String(value??'');if(node.textContent!==next)node.textContent=next;}};
 function render(event){
  if(disposed)return;
  // Keep a snapshot of the displayed item, including its provenance. Never
  // mutate the event, save, archive selection or a detail already being read.
  current={...event,recap:event?.recap?{...event.recap}:null,background:event?.background?{...event.background}:null};text(title,current.title);text(copy,current.copy);
  const sourceName=get('news-source'),time=get('news-time');
  text(sourceName,current.source);text(time,current.time);
  meta.hidden=false;copy.hidden=!current.copy;recap.hidden=!current.recap?.copy;text(recap,current.recap?.copy?`${current.recap.title} · ${current.recap.copy}`:'');sources.hidden=true;source.hidden=true;source.removeAttribute('href');
 }
 function open(){
  if(disposed||!current||closeAllModalOpen(document))return false;
  const event={...current},extra=document.createElement('div');extra.hidden=true;
  function appendSource(item,parent){
   const block=document.createElement('div'),link=document.createElement('a');
   block.id='news-archive-details';link.id='news-archive-source';block.append(link);
   const fictional=item.contentKind==='fictional_market_event'||item.swan;
   const sourced={...item,sourceUrl:fictional?null:item.sourceUrl,
    sourceLicenseUrl:originalPublicationUrl({sourceUrl:item.sourceLicenseUrl})};
   renderArchiveSource({createElement:tag=>document.createElement(tag),
    getElementById:id=>id===block.id?block:block.querySelector('#'+id)},sourced);
   if(link.hidden)link.remove();
   if(!block.hidden){parent.append(block);extra.hidden=false;}
  }
  appendSource(event,extra);
  if(event.background?.contentKind==='historical_fact'){
   const background=event.background,section=document.createElement('section');
   for(const [tag,text] of [['h3',COPY.labels.background],['p',background.title],['p',background.copy],['p',[background.source,background.time].filter(Boolean).join(' · ')]]){
    const node=document.createElement(tag);node.textContent=text??'';section.append(node);
   }
   appendSource(background,section);extra.append(section);extra.hidden=false;
  }
  const lines=[event.copy,event.recap?.copy?`${event.recap.title} · ${event.recap.copy}`:null,[event.source,event.time].filter(value=>typeof value==='string'&&value.trim()).join(' · ')]
   .filter(value=>typeof value==='string'&&value.trim());
  list.focus({preventScroll:true});
  openDetails(event.title??'',lines,null,extra.hidden?null:extra);
  return true;
 }
 const click=event=>{event.stopPropagation();if(event.detail>1)return;open();};
 const keydown=event=>{
  if(event.key!=='Enter'&&event.key!==' ')return;
  event.preventDefault();event.stopPropagation();if(!event.repeat)open();
 };
 list.addEventListener('click',click);list.addEventListener('keydown',keydown);
 return {render,open,dispose(){
  if(disposed)return;disposed=true;list.removeEventListener('click',click);list.removeEventListener('keydown',keydown);
  for(const [name,value] of before)if(value===null)list.removeAttribute(name);else list.setAttribute(name,value);
  meta.hidden=visibility.meta;copy.hidden=visibility.copy;recap.remove();hint.remove();if(current)renderArchiveSource(document,current);
 }};
}
