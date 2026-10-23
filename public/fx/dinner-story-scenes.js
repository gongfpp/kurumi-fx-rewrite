import {DINNER_STORIES} from './copy/dinner-stories.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {DINNER_PRESENTATION_ASSETS} from './dinner-story-assets.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {selectComicScene} from './comic-scenes.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {COMIC_PRESENTATION_ASSETS} from './comic-scene-assets.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {sealedDailyMangaOutcome} from './manga-context.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {artIdentity,dailyArtMemory} from './daily-art-memory.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {dailyRoutineSceneAllowed} from './daily-narrative-facts.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';

// Existing prices and gain thresholds, copied as evidence checks only. The
// engine/recap choice remains the sole owner of the bill and account effects.
export const DINNER_TIERS=Object.freeze({
 'dinner-small':Object.freeze({cost:1500,minGain:3000,party:[2,2],quality:1}),
 'dinner-friends':Object.freeze({cost:8000,minGain:40000,party:[3,4],quality:2}),
 'dinner-feast':Object.freeze({cost:30000,minGain:200000,party:[4,4],quality:3}),
 'dinner-banquet':Object.freeze({cost:100000,minGain:1000000,party:[4,4],quality:4}),
});
export function dinnerCastKnown(state,script,memory=dailyArtMemory){
 // Kurumi and Mochiko are established friends from the game's opening. Mebuki
 // only joins after her introduction arc has actually been read. Yasuko also
 // needs her completed in-game encounter; merely being day three proves neither.
 if(script.requiresMebuki&&!memory.has('arc:follow-confidence'))return false;
 if(script.requiresYasuko&&!state.story?.seen?.includes('roommate'))return false;
 return true;
}
export function dinnerStoryCandidates(state,receipt,{memory=dailyArtMemory,assets=DINNER_PRESENTATION_ASSETS,legacyAssets=COMIC_PRESENTATION_ASSETS}={}){
 const tier=DINNER_TIERS[receipt?.id],outcome=sealedDailyMangaOutcome(state);
 if(!tier||state.mode!=='story'||!outcome||!dailyRoutineSceneAllowed(state)||outcome.net<tier.minGain||receipt.day!==state.day||receipt.cost!==tier.cost)return [];
 const base=selectComicScene(state,{type:'activity',receipt},{assets:legacyAssets});if(!base)return [];
 // Require the paired debit, not just a matching display receipt or cash value.
 const debit=state.consumptionLedger?.find(r=>r.id===`activity:${state.day}:${receipt.id}`&&r.kind==='activity'&&r.day===state.day&&r.amount===tier.cost&&r.timestamp===receipt.timestamp);
 if(!debit)return [];
 const candidates=Object.entries(DINNER_STORIES).filter(([id,script])=>script.tier===receipt.id&&dinnerCastKnown(state,script,memory)).map(([id,script])=>{
  const art=assets[id];if(!art?.reviewed||art.panels!==4||art.people!==script.people||art.dialogueId!==script.dialogueId||!art.path||art.grid||art.tier!==receipt.id||art.cost!==tier.cost||art.people<tier.party[0]||art.people>tier.party[1])return null;
  return {...base,...structuredClone(script),id,activityId:receipt.id,art:structuredClone(art),identity:artIdentity(art),ready:true,contextualManga:null};
 }).filter(Boolean);
 // Original assets and content identities remain available solely for an
 // already-locked old day. New days never fall back to old mismatched dinners.
 if(base.ready)candidates.push({...base,identity:artIdentity(base.art),preserveLockedOnly:true});
 return candidates;
}
export function selectDinnerAwareComicScene(state,event,{memory=dailyArtMemory,assets=COMIC_PRESENTATION_ASSETS}={}){
 if(event.type!=='activity'||!Object.hasOwn(DINNER_TIERS,event.receipt?.id))return selectComicScene(state,event,{assets});
 const candidates=dinnerStoryCandidates(state,event.receipt,{memory,legacyAssets:assets});
 // Receipt capture is read-only: only the actual daily display locks the day.
 return memory.peek?memory.peek(`${state.runId||state.seed}:${state.day}`,candidates):candidates.find(c=>!c.preserveLockedOnly&&!memory.has(c.identity))||null;
}
