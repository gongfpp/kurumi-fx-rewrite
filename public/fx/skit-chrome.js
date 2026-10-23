import {createSkitCrop} from './skit-dialogue.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {LIFE_SCENE_CATALOG} from './life-scene-catalog.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {COMIC_PRESENTATION_ASSETS} from './comic-scene-assets.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {APPROVED_FOUR_SKIT_ASSETS} from './approved-four-skit-assets.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {DINNER_STORY_ASSETS} from './dinner-story-assets.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {DAILY_FALLBACK_CATALOG} from './daily-fallback-catalog.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {PROFIT_TIER_ART} from './profit-tier-art.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {CONTEXTUAL_MANGA_ASSETS} from './contextual-manga-content.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {CHARACTER_STORY_ASSETS} from './character-story-content.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
// Cropped windows of the already approved life UI; no new illustration assets.
const lifeIcon=rect=>Object.freeze({path:'./pixel-assets/mobile-life-approved.png',width:854,height:1842,rect});
export const SKIT_CHROME_ICONS=Object.freeze({
 chat:lifeIcon([409,212,35,31]),convenience:lifeIcon([122,924,86,70]),cafe:lifeIcon([392,929,75,67]),bookstore:lifeIcon([641,924,94,73]),
 shrine:lifeIcon([125,1404,86,73]),river:lifeIcon([372,1404,108,74]),park:lifeIcon([626,1397,121,83]),
 work:lifeIcon([43,799,57,62]),relax:lifeIcon([42,1287,58,62])
});
const identity=art=>typeof art?.path==='string'&&/^[a-f0-9]{64}$/i.test(art?.sha256||'')?`${art.path}:${art.sha256}`:null;
const fanAssets=[...Object.values(COMIC_PRESENTATION_ASSETS),...Object.values(APPROVED_FOUR_SKIT_ASSETS),...Object.values(DINNER_STORY_ASSETS),...Object.values(PROFIT_TIER_ART),...LIFE_SCENE_CATALOG.filter(row=>row.approved).map(row=>row.art),...DAILY_FALLBACK_CATALOG.filter(row=>row.approved).map(row=>row.art)];
const fanIds=new Set(fanAssets.filter(art=>art?.reviewed&&!art.path?.startsWith('./manga/')).map(identity).filter(Boolean));
const originals={...CONTEXTUAL_MANGA_ASSETS,...CHARACTER_STORY_ASSETS};
const originalIds=new Set(Object.values(originals).filter(art=>art.path?.startsWith('./manga/')).map(identity).filter(Boolean));
export function skitSourceLabel(scene){
 const arts=scene?.selection?scene.selection.nodes?.flatMap(node=>(node.panels||[]).map(panel=>originals[panel.record])):scene?.frames?scene.frames.map(frame=>frame.art):scene?.art?[scene.art]:[];
 if(!arts?.length)return null;
 const ids=arts.map(identity);if(ids.some(id=>!id))return null;
 if(ids.every(id=>originalIds.has(id)))return '原作片段';
 if(ids.every(id=>fanIds.has(id)))return '原创同人';
 return null;
}
function scenePresentation(scene,state,title){
 const receipt=state?.dayReport?.lifeAction;
 // Only the selected life scene may use this action's category. A simultaneous
 // shrine recap must not be titled as work just because work happened as well.
 const bound=receipt?.day===state?.day&&scene?.receiptKey===receipt.id&&scene?.receiptBinding===JSON.stringify(receipt);
 if(bound){const key=receipt.category==='friend'?'chat':Object.hasOwn(SKIT_CHROME_ICONS,receipt.optionId)?receipt.optionId:receipt.category;return {icon:SKIT_CHROME_ICONS[key]||SKIT_CHROME_ICONS.chat,title,category:receipt.category==='work'?'打工 · ':null};}
 const activity=(state?.recapChoiceLedger||[]).find(row=>row.day===state.day&&row.id==='quiet-night');
 return {icon:activity&&scene?.id==='shrine-walk'?SKIT_CHROME_ICONS.shrine:SKIT_CHROME_ICONS.chat,title};
}
// Adds presentation only to existing controls. Close/next listeners, focus,
// settlement token and guards stay on their original native button nodes.
export function decorateSkitChrome(dialog,{scene=null,state=null}={}){
 if(!dialog)return;const doc=dialog.ownerDocument,make=(tag,className,text)=>{const node=doc.createElement(tag);node.className=className;if(text!==undefined)node.textContent=text;return node;};
 const toolbar=dialog.querySelector('.dialog-toolbar');
 if(toolbar&&!toolbar.querySelector('.skit-toolbar-heading')){const heading=make('span','skit-toolbar-heading');heading.append(createSkitCrop(doc,SKIT_CHROME_ICONS.chat,'skit-chrome-icon skit-chat-icon'),make('span','skit-toolbar-label','今日小剧场'));toolbar.append(heading);}
 const title=dialog.querySelector('#day-title');
 if(title){const text=scene?.title||title.querySelector('.skit-scene-name')?.textContent||title.textContent,presentation=scenePresentation(scene,state,text),label=skitSourceLabel(scene);const name=make('span','skit-scene-title');if(presentation.category)name.append(make('span','skit-scene-category',presentation.category));name.append(make('span','skit-scene-name',presentation.title));title.replaceChildren(createSkitCrop(doc,presentation.icon,'skit-chrome-icon skit-scene-icon'),name);if(label)title.append(make('span','skit-source-badge',label));}
 const next=dialog.querySelector('#next-day');
 if(next?.textContent==='明天开盘'&&!next.querySelector('.skit-trend-icon')){const icon=make('span','skit-trend-icon');icon.setAttribute('aria-hidden','true');next.replaceChildren(icon,make('span','skit-next-label','明天开盘'));}
}
