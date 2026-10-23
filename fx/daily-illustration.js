import {assetURL} from './assets.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {CONTEXTUAL_MANGA_ASSETS} from './contextual-manga-content.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {CHARACTER_STORY_ASSETS} from './character-story-content.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';

// Session-only failures of images actually displayed. No preflight requests,
// account changes, read acknowledgements or persistent availability guesses.
const failed=new Set();
const key=path=>new URL(assetURL(path)).pathname;
export function dailySceneImages(scene){
 if(scene?.dialogueOnly)return [];
 if(scene?.frames)return scene.frames.map(frame=>frame.art);
 if(scene?.selection)return scene.selection.nodes?.flatMap(node=>node.panels.map(panel=>CONTEXTUAL_MANGA_ASSETS[panel.record]||CHARACTER_STORY_ASSETS[panel.record]))||[];
 return scene?.art?[scene.art]:[];
}
export function hasDailyIllustration(scene){
 const images=dailySceneImages(scene);
 return images.length>0&&images.every(art=>art&&art.reviewed!==false&&/^\.\/[a-zA-Z0-9_./-]+\.(?:webp|png|jpe?g)$/.test(art.path||'')&&/^[a-f0-9]{64}$/i.test(art.sha256||'')&&
  (art.width>0&&art.height>0||art.dimensions?.[0]>0&&art.dimensions?.[1]>0)&&!failed.has(key(art.path)));
}
export function noteDailyImageFailure(url){failed.add(new URL(url).pathname);}
export function preferDailyIllustration(selected,candidates){
 // A chosen receipt or a required consequence keeps its own story. Only art
 // for that same receipt may replace its picture, never an unrelated scene.
 const required=selected?.receiptDialogue||selected?.consequenceTransition;
 const compatible=candidates.filter(scene=>!scene.preserveLockedOnly&&(!required||scene.identity===selected.identity||selected.receiptKey&&scene.receiptKey===selected.receiptKey)&&hasDailyIllustration(scene));
 const chosen=hasDailyIllustration(selected)?selected:compatible[0];
 if(!chosen)return dailySceneImages(selected).length?{...selected,illustrationTextOnly:true}:selected;
 return {...chosen,showIllustration:true,illustrationAlternatives:compatible.filter(scene=>scene.identity!==chosen.identity).slice(0,2)};
}
