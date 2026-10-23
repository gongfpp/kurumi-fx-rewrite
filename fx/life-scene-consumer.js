import {validWorkPayDialogue} from './life-work.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {LIFE_SCENE_CATALOG} from './life-scene-catalog.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {inspectLifeSceneCatalog,lifeSceneMatches} from './life-scene-schema.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {validLifeActions,lifeActionReceipt,lifeFriendKnown,lifeActionRunId,lifeActionDefinition} from './life-actions.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {sealedDailyMangaOutcome} from './manga-context.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {isDailyFamilyNarrative} from './daily-family-art.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {tradingTrauma} from './trading-trauma.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {artIdentity} from './daily-art-memory.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {dailyRoutineSceneAllowed} from './daily-narrative-facts.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
export function currentLifeSceneReceipt(state){
 if(state?.mode!=='story'||state.position||state.positions!==undefined&&!Array.isArray(state.positions)||!sealedDailyMangaOutcome(state)||!validLifeActions(state))return null;
 const receipt=lifeActionReceipt(state);
 return receipt&&receipt.id===`life:${lifeActionRunId(state)}:${state.day}`&&JSON.stringify(receipt)===JSON.stringify(state.dayReport.lifeAction)?receipt:null;
}
export function lifeSceneCandidates(state,narrative,{catalog=LIFE_SCENE_CATALOG,...inspection}={}){
 if(!dailyRoutineSceneAllowed(state))return [];
 if(narrative?.day!==undefined&&narrative.day!==state?.day||isDailyFamilyNarrative(narrative)||narrative?.event?.key&&narrative.event.key!=='quietNight'||(state?.recapChoiceLedger||[]).some(r=>r.day===state.day))return [];
 const receipt=currentLifeSceneReceipt(state);if(!receipt||receipt.category==='dinner'||receipt.category==='friend'&&!lifeFriendKnown(state,receipt.optionId))return [];
 const workJob=receipt.category==='work'?lifeActionDefinition('work',receipt.optionId):null,paidDialogue=!!workJob&&validWorkPayDialogue(workJob,receipt);
 const receiptSource=paidDialogue?workJob.dialogue.sourceId:receipt.dialogue?.sourceId;
 const context={day:state.day,outcome:sealedDailyMangaOutcome(state).kind,trauma:tradingTrauma(state).active};
 return inspectLifeSceneCatalog(catalog,inspection).accepted.filter(e=>e.category===receipt.category&&e.optionId===receipt.optionId&&lifeSceneMatches(e,context)&&
  (e.receiptDialogueSourceId==null||e.receiptDialogueSourceId===receiptSource)
 ).map(e=>{const panels=structuredClone(e.dialoguePanels);if(paidDialogue)panels.at(-1).lines.push(...receipt.dialogue.lines.slice(workJob.dialogue.lines.length).map(line=>[line.from,line.text]));return {id:e.id,title:e.title,ready:true,art:structuredClone(e.art),dialoguePanels:panels,lines:panels.flatMap(p=>structuredClone(p.lines)),
  // An exact source-bound friend scene is the committed exchange too. Carry
  // the same receipt priority/save gate so an older generic/null lock cannot
  // hide it; that lock itself remains unchanged.
  identity:artIdentity(e.art),arcIdentity:e.semanticReadKey,receiptKey:receipt.id,lifeScene:true,...(e.receiptDialogueSourceId?{receiptDialogue:true}:{}),receiptBinding:JSON.stringify(receipt),day:state.day,runId:lifeActionRunId(state),dayKey:`${state.runId||state.seed}:${state.day}`};});
}
