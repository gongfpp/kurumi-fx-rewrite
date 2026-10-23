import {setMangaImage} from './manga-images.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {showMangaPortrait} from './manga-portraits.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';

export function renderMangaSelection(frame,selection,{openSource}={}){
 const document=frame.ownerDocument;
 frame.replaceChildren();frame.hidden=false;frame.className='manga-context-cards';frame.dataset.match=selection.status;
 // Provenance and matching evidence remain in the source metadata.
 if(!selection.cards.length){frame.hidden=true;return;}
 for(const {panel,crop,reason} of selection.cards){
  const figure=document.createElement('figure'),view=document.createElement('div'),img=document.createElement('img');
  view.className='manga-card-viewport';view.append(img);
  if(crop){showMangaPortrait(img,{...panel,cropPixels:crop},{loading:'lazy'});img.alt=`原作剧情参考 · ${panel.character} · 第 ${panel.chapter} 话第 ${panel.page} 页`;}else{setMangaImage(img,panel.original);img.alt=`原作参考 · ${panel.character} · 第 ${panel.chapter} 话第 ${panel.page} 页`;}
  figure.append(view);frame.append(figure);
 }
}
