import {COMIC_PRESENTATION_ASSETS} from './comic-scene-assets.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {setImage} from './assets.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';

// Decorative inventory previews reuse the existing corresponding story images.
// They neither trigger the story nor claim a purchase has already occurred.
const SCENES=Object.freeze({dailyDrink:'prop-daily-drink-first-use',takeaway:'takeaway',noodles:'noodles-today',energy:'energy',celebration:'spa',father:'father-borrow',mochiko:'mochiko-watch'});
export const PROP_INVENTORY_ART=Object.freeze(Object.fromEntries(Object.entries(SCENES).map(([id,sceneId])=>[id,COMIC_PRESENTATION_ASSETS[sceneId]])));
export function ensurePropInventoryArt(button,id){
 if(!button||!Object.hasOwn(PROP_INVENTORY_ART,id)||button.dataset.prop!==id)return null;
 const art=PROP_INVENTORY_ART[id];
 let image=button.querySelector('.prop-inventory-art');
 if(image)return image;
 image=button.ownerDocument.createElement('img');image.className='prop-inventory-art';
 setImage(image,art.path);image.alt='';image.setAttribute('aria-hidden','true');
 image.width=art.width;image.height=art.height;image.decoding='async';
 // Preserve the existing first title / last caption nodes and their consumers.
 button.insertBefore(image,button.lastChild);button.classList.add('item-with-art');
 return image;
}
