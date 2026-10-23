import {LIFE_SCENE_CATALOG} from './life-scene-catalog.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {DAILY_FALLBACK_CATALOG} from './daily-fallback-catalog.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {APPROVED_FOUR_SKITS} from './copy/approved-four-skits.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {APPROVED_FOUR_SKIT_ASSETS} from './approved-four-skit-assets.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {ACTION_SCENES} from './copy/action-scenes.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {COMIC_PRESENTATION_ASSETS} from './comic-scene-assets.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {DINNER_STORIES} from './copy/dinner-stories.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {DINNER_STORY_ASSETS,DINNER_PRESENTATION_ASSETS} from './dinner-story-assets.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {FATHER_THEFT_SCENES} from './copy/father-theft-scenes.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {FATHER_THEFT_ASSETS} from './father-theft-assets.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {LIVING_MOVE_SCENES} from './copy/living-move-scenes.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {LIVING_MOVE_ASSETS} from './living-move-assets.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {PROP_STORIES} from './copy/prop-stories.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {PROP_STORY_ASSETS} from './prop-story-assets.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {applyApprovedContextDialogue} from './context-rewrite-view.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';

// The existing gallery projects exact shipped scripts by image hash. No game,
// action, reader-memory or reward callbacks are inputs to this lookup.
const contexts=new Map();
function add(id,script,art){
 if(!script||!art?.sha256||art.reviewed!==true)return;
 if(script.dialogueId&&art.dialogueId!==script.dialogueId)return;
 const scene=applyApprovedContextDialogue({id,...script,art});
 const panels=scene.dialoguePanels||scene.panels;
 const lines=scene.lines||panels?.flatMap(panel=>panel.lines)||[];
 if(!lines.length)return;
 contexts.set(art.sha256,{sceneId:id,title:scene.title,characters:[...(scene.characters||[])],
  setting:scene.setting||null,dialoguePanels:panels?structuredClone(panels.map(panel=>({lines:panel.lines}))):null,
  lines:structuredClone(lines)});
}
for(const scene of [...LIFE_SCENE_CATALOG,...DAILY_FALLBACK_CATALOG])add(scene.id,scene,scene.art);
for(const [scripts,assets]of [[ACTION_SCENES,COMIC_PRESENTATION_ASSETS],[APPROVED_FOUR_SKITS,APPROVED_FOUR_SKIT_ASSETS],
 [DINNER_STORIES,DINNER_STORY_ASSETS],[DINNER_STORIES,DINNER_PRESENTATION_ASSETS],[FATHER_THEFT_SCENES,FATHER_THEFT_ASSETS],
 [LIVING_MOVE_SCENES,LIVING_MOVE_ASSETS],[PROP_STORIES,PROP_STORY_ASSETS]]){
 for(const [id,script]of Object.entries(scripts))add(id,script,assets[id]);
}
export function mangaLibrarySceneContext(sha256){
 const context=contexts.get(sha256);return context?structuredClone(context):null;
}
