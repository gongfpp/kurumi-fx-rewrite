import {createShareCard} from './share-card.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {createPixelShareCard} from './share-card-pixel.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
// Keep the existing original layout, with its numeric overlap fixes.
export function createReportCard(state,options={}){
 return options.style==='pixel'?createPixelShareCard(state,options):createShareCard(state,options);
}
