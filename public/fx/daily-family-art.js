import {fatherTheftReceipt} from './father-theft-discovery.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {FATHER_THEFT_ASSETS} from './father-theft-assets.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {FATHER_THEFT_SCENES} from './copy/father-theft-scenes.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {applyApprovedContextDialogue} from './context-rewrite-view.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {COMIC_SCENE_ASSETS} from './comic-scene-assets.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {FATHER_DISCOVERY_ART} from './father-discovery.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {ACTION_SCENES} from './copy/action-scenes.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
const FAMILY_EVENTS=new Set(['fatherDiscover','fatherUnlock','fatherFound','repayPartial','repayFull']);
const positive=n=>Number.isFinite(n)&&n>0;
const taken=s=>!!s.fatherUsed||!!s.family?.takenConfirmed||positive(s.family?.outstanding)||positive(s.family?.repaid)||positive(s.family?.withdrawal?.amount);
// A recognized but unmatched family scene must remain text-only. The caller
// must not replace null with an unrelated trading/mood illustration.
export function isDailyFamilyNarrative(narrative){return FAMILY_EVENTS.has(narrative?.event?.key)||!!narrative?.fatherFrames?.length;}
export function selectDailyFamilyArtwork(state,narrative,{assets={...COMIC_SCENE_ASSETS,...FATHER_THEFT_ASSETS}}={}){
 if(state?.mode!=='story'||!narrative||narrative.day!==state.day||state.dayReport?.day!==state.day||!['resting','ending'].includes(state.phase)||!isDailyFamilyNarrative(narrative))return null;
 const key=narrative.event?.key,family=state.family||{};let id=null;
 if(key==='fatherFound'){
  const acknowledged=family.discovered&&state.story?.log?.some(row=>row.id==='fatherFound'&&row.day===narrative.day);
  const pending=state.story?.queue?.includes('fatherFound')&&positive(family.outstanding)&&!family.informed&&!family.discovered;
  if(taken(state)&&(acknowledged||pending)){
   const receipt=fatherTheftReceipt(state);
   if(narrative.event.theftDiscoveryId){
    if(!receipt||receipt.id!==narrative.event.theftDiscoveryId||receipt.sceneId!==narrative.event.theftSceneId)return null;
    id=receipt.sceneId;
   }else id='father-found';
  }
 }else if(key==='repayPartial'||key==='repayFull'){
  const receipt=family.lastRepayment;
  if(taken(state)&&receipt?.day===narrative.day&&positive(receipt.amount)&&Number.isFinite(receipt.outstanding)&&receipt.outstanding>=0){
   if(key==='repayPartial'&&receipt.outstanding>0)id='father-repay-part';
   if(key==='repayFull'&&receipt.outstanding===0&&family.outstanding===0)id='father-repaid';
  }
 }else if(!taken(state)){
  const discovery=state.fatherDiscovery;
  if(discovery?.route==='crisis'&&['presenting','available'].includes(discovery.status)&&discovery.eventId&&discovery.startedDay===narrative.day&&discovery.facts?.severe===true){
   const ids=['pain','discover','relief'],frames=narrative.fatherFrames;
   if(frames?.length===3&&frames.every((frame,index)=>frame.id===ids[index]&&frame.eventId===discovery.eventId&&frame.route==='crisis')){
    return {id:'father-crisis',title:'柜子里的信封',frames:frames.map(frame=>({id:frame.id,text:frame.text,art:{...FATHER_DISCOVERY_ART[frame.id]}}))};
   }
  }
  // The complete calm sheet leaves the envelope untouched. It is not the
  // crisis pain/discovery/relief sequence, and never an already-taken receipt.
  if(discovery?.route==='calendar'&&['presenting','available'].includes(discovery.status)&&discovery.eventId&&narrative.fatherFrames?.some(frame=>frame.id==='calm'&&frame.eventId===discovery.eventId))id='father-discover';
 }
 const art=assets[id],text=FATHER_THEFT_SCENES[id]||ACTION_SCENES[id];
 if(!id||!text||!art?.reviewed||art.panels!==4||art.people!==text.people||art.grid||typeof art.path!=='string'||!art.path)return null;
 if(FATHER_THEFT_SCENES[id]){if(art.dialogueId!==text.dialogueId)return null;return {id,...structuredClone(text),art:structuredClone(art),ready:true,contextLabel:`偷拿存款后的交易净盈亏：${fatherTheftReceipt(state).tradingNet>0?'+':''}¥${fatherTheftReceipt(state).tradingNet.toLocaleString('zh-CN',{maximumFractionDigits:2})}`,receipt:structuredClone(fatherTheftReceipt(state))};}
 return applyApprovedContextDialogue({id,title:text.title,art:{...art}});
}

// Frozen dialogue may be replayed after the money was taken or repaid. Retain
// only facts that are still true, and label completed confrontation as history.
export function selectDailyFamilyLines(state,narrative){
 if(state?.mode!=='story'||narrative?.day!==state.day||state.dayReport?.day!==state.day||!isDailyFamilyNarrative(narrative))return [];
 const family=state.family||{},key=narrative.event?.key,paid=taken(state)&&family.outstanding===0&&positive(family.repaid);
 const status=()=>paid?[['久留美','现在已经还清了。']]:positive(family.outstanding)?[['久留美','那笔钱已经取用过了，还没有还清。']]:[['久留美','那笔钱已经取用过了。']];
 if(narrative.fatherFrames?.length||['fatherDiscover','fatherUnlock'].includes(key)){
  if(taken(state))return status();
  if(narrative.fatherFrames?.length)return narrative.fatherFrames.map(frame=>['久留美',frame.text]).filter(([,text])=>typeof text==='string'&&text);
 }
 if(key==='fatherFound'){
  if(!selectDailyFamilyArtwork(state,narrative))return [];
  if(paid)return [['久留美','那天，爸爸发现了柜子里的钱少了。'],...status()];
 }
 if(['repayPartial','repayFull'].includes(key)){
  if(paid)return status();
  if(!selectDailyFamilyArtwork(state,narrative))return taken(state)?status():[];
 }
 const event=narrative.event,ack=state.story?.log?.findLast(row=>row.id===key&&row.day===narrative.day),choice=ack?event?.choices?.find(c=>c.id===ack.choice):null;
 return [...(event?.lines||[]),...(choice?.lines||[])].map(line=>[...line]);
}
