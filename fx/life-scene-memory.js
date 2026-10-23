import {currentLifeSceneReceipt} from './life-scene-consumer.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {validLifeActions} from './life-actions.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {DINNER_OPTIONS} from './recap-choices.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {sealedDailyMangaOutcome} from './manga-context.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {selectDailyContextualManga} from './contextual-manga-scenes.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {CONTEXTUAL_MANGA_ASSETS} from './contextual-manga-content.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {CHARACTER_STORY_ASSETS} from './character-story-content.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {artIdentity} from './daily-art-memory.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {COMIC_SCENE_ASSETS} from './comic-scene-assets.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {FATHER_THEFT_ASSETS} from './father-theft-assets.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {FATHER_DISCOVERY_ART} from './father-discovery.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
const dinnerOriginalId='friends-different-ledgers';
const isDinnerOriginal=scene=>scene?.id===dinnerOriginalId||scene?.identity===`arc:${dinnerOriginalId}`||scene?.selection?.id===dinnerOriginalId;
// Bind only the exact certified original selected for this paid day. Do not
// turn an arbitrary chapter, supplied receipt or modified panel list into a meal.
function dinnerOriginalImages(state,scene){
 if(scene?.id!==dinnerOriginalId||scene.identity!==`arc:${dinnerOriginalId}`||scene.art||scene.frames||scene.lifeScene||scene.dialogueOnly)return null;
 const contextual=selectDailyContextualManga(state),expected=(contextual?[contextual,...(contextual.related||[])]:[]).find(arc=>arc.id===dinnerOriginalId);
 if(!expected||scene.title!==expected.title||Object.keys(scene).sort().join(',')!=='id,identity,selection,title'||JSON.stringify(scene.selection)!==JSON.stringify({...expected,related:undefined}))return null;
 const assets=expected.nodes.flatMap(node=>node.panels.map(panel=>CONTEXTUAL_MANGA_ASSETS[panel.record]||CHARACTER_STORY_ASSETS[panel.record]));
 return assets.length&&assets.every(asset=>/^[a-f0-9]{64}$/.test(asset?.sha256||''))?assets.map(artIdentity):null;
}
const dinnerReceipt=state=>Array.isArray(state?.recapChoiceLedger)?state.recapChoiceLedger.findLast(row=>row?.day===state.day&&DINNER_OPTIONS.some(option=>option.id===row.id)):null;
const dayKey=state=>state?`${state.runId||state.seed}:${state.day}`:null;
// Preserve the independent family image contract, not an arbitrary unbound
// selection submitted during a paid day. Identities come from existing assets.
function familyScene(scene){
 if(scene?.selection||scene?.lifeScene||scene?.dialogueOnly)return false;
 if(scene?.id==='father-crisis'){
  const ids=['pain','discover','relief'];return scene.frames?.length===3&&scene.frames.every((frame,index)=>frame.id===ids[index]&&artIdentity(frame.art)===artIdentity(FATHER_DISCOVERY_ART[ids[index]]))&&scene.identity==='sequence:'+ids.map(id=>artIdentity(FATHER_DISCOVERY_ART[id])).join('|');
 }
 const asset={...COMIC_SCENE_ASSETS,...FATHER_THEFT_ASSETS}[scene?.id];
 return !!asset&&scene.id.startsWith('father-')&&scene.identity===artIdentity(asset)&&artIdentity(scene.art)===artIdentity(asset);
}
// Paid choices, their exact original and explicit daily fallback use the meal gate.
// Higher-priority family scenes keep their existing multi-frame read contract.
const paidDinnerScene=(scene,receipt)=>!scene||scene.receipt?.id===receipt?.id&&scene.receipt?.day===receipt?.day||scene.arcIdentity===`daily-fallback:${scene.id}`;
// Bind the actual paid meal and its paired debit, including legacy recap-only
// saves. A scene image alone cannot certify a charge or advance a durable day.
function dinnerBinding(state){
 const receipt=dinnerReceipt(state),option=DINNER_OPTIONS.find(row=>row.id===receipt?.id),outcome=sealedDailyMangaOutcome(state);
 if(state?.mode!=='story'||!receipt||!option||!outcome||outcome.net<option.minGain||receipt.cost!==option.cost||!Number.isFinite(receipt.timestamp))return null;
 const debit=state.consumptionLedger?.find(row=>row.id===`activity:${state.day}:${receipt.id}`&&row.kind==='activity'&&row.day===state.day&&row.amount===receipt.cost&&row.timestamp===receipt.timestamp);
 if(!debit)return null;
 return JSON.stringify({dayKey:dayKey(state),net:outcome.net,receipt,debit,lifeReceipt:currentLifeSceneReceipt(state)});
}
// Rendering may proceed while a game save is pending. New life/paid-dinner
// locks and read acknowledgements become durable only with that exact receipt.
// No storage schema or historical lock/read record is rewritten.
export function createLifeSceneMemory({memory,getState,getContext,getSavedState,isBlocked=()=>false}){
 const records=new Map();
 const current=entry=>!isBlocked()&&entry.context===getContext()&&entry.dayKey===dayKey(getState())&&
  (entry.kind==='dinner'?entry.binding===dinnerBinding(getState()):entry.scene.day===getState()?.day&&JSON.stringify(currentLifeSceneReceipt(getState()))===entry.binding)&&
  (!entry.originalImages||JSON.stringify(dinnerOriginalImages(getState(),entry.scene))===JSON.stringify(entry.originalImages));
 const durable=entry=>{try{const saved=getSavedState();return entry.kind==='dinner'?entry.binding===dinnerBinding(saved)&&(!entry.originalImages||JSON.stringify(dinnerOriginalImages(saved,entry.scene))===JSON.stringify(entry.originalImages)):validLifeActions(saved)&&saved.lifeActions?.receipts?.some(r=>r.id===entry.scene.receiptKey&&JSON.stringify(r)===entry.binding);}catch{return false;}};
 const prune=()=>{for(const [key,entry] of records)if(!current(entry))records.delete(key);};
 const bind=(key,scene,kind='life',binding=scene?.receiptBinding,originalImages=null)=>{let entry=records.get(key);if(!entry||entry.kind!==kind||entry.scene?.identity!==scene?.identity||entry.binding!==binding||entry.context!==getContext()){
  entry={scene,dayKey:key,kind,binding,originalImages,context:getContext(),seen:new Set()};records.set(key,entry);
 }return entry;};
 const commit=entry=>{
  if(!current(entry)||!durable(entry))return false;
  // pick preserves every pre-existing lock, including an explicit null.
  if(entry.scene?.receiptDialogue&&memory.day(entry.dayKey).locked&&memory.day(entry.dayKey).identity!==entry.scene.identity)return entry.seen.size?memory.seen([...entry.seen]):true;
  const chosen=memory.pick(entry.dayKey,entry.scene?[entry.scene]:[]);
  if((chosen?.identity||null)!==(entry.scene?.identity||null))return false;
  return entry.seen.size?memory.seen([...entry.seen]):true;
 };
 const has=id=>memory.has(id)||[...records.values()].some(entry=>current(entry)&&entry.seen.has(id));
 const reading=entry=>({has,seen(ids){
  if(!current(entry))return false;
  const allowed=new Set([entry.scene?.identity,entry.scene?.arcIdentity,...(entry.originalImages||[])].filter(Boolean));
  for(const id of ids)if(allowed.has(id)&&(!entry.originalImages||id!==entry.scene.identity||entry.originalImages.every(image=>memory.has(image)||entry.seen.has(image))))entry.seen.add(id);
  return commit(entry);
 }});
 const wrapper={
  has,seen:ids=>memory.seen(ids),day:key=>memory.day(key),
  peek(key,candidates){
   prune();if(memory.day(key).locked)return memory.peek(key,candidates);
   const pending=records.get(key);return pending?candidates.find(c=>c.identity===pending.scene?.identity&&(pending.kind==='dinner'||c.receiptBinding===pending.binding))||null:memory.peek(key,candidates);
  },
  pick(key,candidates){
   const selected=wrapper.peek(key,candidates),state=getState(),original=isDinnerOriginal(selected)||!!dinnerReceipt(state)&&!!selected?.selection,originalImages=original?dinnerOriginalImages(state,selected):null;
   if(original&&!originalImages)return null;
   // A recap meal owns this slot; lifeSceneCandidates excludes every such day.
   if(dinnerReceipt(state)&&selected?.lifeScene)return null;
   if(dinnerReceipt(state)&&selected&&!original&&!paidDinnerScene(selected,dinnerReceipt(state))&&!selected.lifeScene&&!familyScene(selected))return null;
   if(dinnerReceipt(state)&&(original||paidDinnerScene(selected,dinnerReceipt(state)))){
    const binding=dinnerBinding(state);if(!binding||key!==dayKey(state))return null;
    const entry=bind(key,selected,'dinner',binding,originalImages);if(!current(entry))return null;
    // This also stages exhausted null days and honest post-dinner fallback art.
    if(durable(entry))commit(entry);return selected;
   }
   if(!selected?.lifeScene)return memory.day(key).locked||!records.has(key)?memory.pick(key,candidates):null;
   const entry=bind(key,selected);if(!current(entry))return null;
   if(durable(entry)){const chosen=memory.pick(key,candidates);return chosen?.identity===selected.identity?chosen:null;}
   return selected;
  },
  forSelection(scene){
   const original=isDinnerOriginal(scene)||!!dinnerReceipt(getState())&&!!scene?.selection;
   if(original&&!dinnerOriginalImages(getState(),scene))return {has,seen:()=>false};
   if(dinnerReceipt(getState())&&scene?.lifeScene)return {has,seen:()=>false};
   if(scene?.lifeScene)return reading(bind(scene.dayKey,scene));
   if(dinnerReceipt(getState())&&scene&&!original&&!paidDinnerScene(scene,dinnerReceipt(getState()))&&!familyScene(scene))return {has,seen:()=>false};
   if(dinnerReceipt(getState())&&(original||paidDinnerScene(scene,dinnerReceipt(getState())))){
    const entry=records.get(dayKey(getState()));
    return entry?.kind==='dinner'&&entry.scene?.identity===scene?.identity?reading(entry):{has,seen:()=>false};
   }
   return memory;
  },
  confirm(){prune();for(const entry of records.values())commit(entry);}
 };
 return wrapper;
}
