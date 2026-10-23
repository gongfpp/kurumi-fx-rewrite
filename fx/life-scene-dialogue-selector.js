import {LIFE_FRIEND_DIALOGUE_SCENES} from './life-friend-dialogues.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {LIFE_SCENE_CATALOG} from './life-scene-catalog.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {inspectLifeSceneCatalog,lifeSceneMatches} from './life-scene-schema.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {lifeActionDialogueForSource} from './life-action-dialogues.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {tradingTrauma} from './trading-trauma.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {dailyRoutineSceneAllowed} from './daily-narrative-facts.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
// Called only by the existing synchronous commit after the report is sealed.
// The action payload cannot inject a source ID, lines, money or scene catalog.
export function selectLifeSceneDialogue(option,state,{catalog=LIFE_SCENE_CATALOG,dialogueForSource=lifeActionDialogueForSource}={}){
 if(option?.category!=='friend'||state?.mode!=='story'||state.dayReport?.day!==state.day||!Number.isFinite(state.dayReport.net))return null;
 if(!dailyRoutineSceneAllowed(state))return null;
 const used=new Set((state.lifeActions?.receipts||[]).map(r=>r.dialogue?.sourceId));
 const net=state.dayReport.net,context={day:state.day,outcome:net<0?'loss':net>0?'profit':'flat',trauma:tradingTrauma(state).active};
 const entry=inspectLifeSceneCatalog(catalog,{dialogueForSource}).accepted.find(e=>e.category===option.category&&e.optionId===option.id&&!used.has(e.receiptDialogueSourceId)&&lifeSceneMatches(e,context));
 if(entry)return dialogueForSource(option,entry.receiptDialogueSourceId);
 // Text is a complete trusted exchange before any picture is admitted. Only
 // reviewed artwork enters the art catalog; lack of art cannot erase the action.
 return LIFE_FRIEND_DIALOGUE_SCENES.filter(scene=>scene.optionId===option.id&&!used.has(scene.dialogueId)&&lifeSceneMatches(scene,context))
  .map(scene=>dialogueForSource(option,scene.dialogueId)).find(Boolean)||null;
}
