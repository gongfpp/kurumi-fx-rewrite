import {LIFE_WORK_JOBS,validWorkInventory,validWorkPay,validWorkPayDialogue} from './life-work.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {DINNER_OPTIONS} from './recap-choices.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {lifeActionDialogueForSource,validLifeActionDialogue} from './life-action-dialogues.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {LIFE_SCENE_DIALOGUE_SOURCES} from './life-scene-dialogue-sources.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {isConsequenceLifeReceipt} from './daily-narrative-facts.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
// Convenience-shift default; actual per-job contracts live in life-work.js.
// One completed life action per story day; individual work terms live in life-work.js.
export const LIFE_WORK_INCOME=LIFE_WORK_JOBS[0].income;
export const LIFE_ACTION_SAVE_VERSION=17;
const option=(category,id,label,income=0)=>Object.freeze({category,id,label,income});
export const LIFE_ACTION_CATALOG=Object.freeze({
 dinner:Object.freeze(DINNER_OPTIONS.map(row=>Object.freeze({...row,category:'dinner',income:0}))),
 friend:Object.freeze([option('friend','mochiko','萌智子'),option('friend','yasuko','安子')]),
 work:LIFE_WORK_JOBS,
 relax:Object.freeze([option('relax','shrine','神社'),option('relax','river','河边'),option('relax','park','公园'),Object.freeze({...option('relax','onsen','温泉与按摩'),cost:8000})])
});
export const lifeActionRunId=s=>String(s.runId??`seed:${s.seed}:${s.mode}`);
export const lifeActionDefinition=(category,id)=>LIFE_ACTION_CATALOG[category]?.find(row=>row.id===id)||null;
export const lifeActionReceipt=s=>s.lifeActions?.receipts?.find(row=>row.day===s.day)||null;
// Read only established contact evidence, never mutate story unlocks while browsing.
export function lifeFriendKnown(s,id){
 const event=id==='mochiko'?'friendStudy':id==='yasuko'?'roommate':null;
 const name=LIFE_ACTION_CATALOG.friend.find(row=>row.id===id)?.label;if(!event||!name)return false;
 // A completed, fully validated new-source friend action remains evidence after
 // bounded chat history drops the original name. New display names alone do
 // not establish a relationship; historical receipt text is never rewritten.
 return !!(s.story?.seen?.includes(event)||s.story?.log?.some(row=>row.id===event)||['friend','campus'].some(channel=>(s.chat?.[channel]||[]).some(line=>line.from===name&&(typeof line.dialogueId==='string'||typeof line.storyId==='string')))||
  LIFE_SCENE_DIALOGUE_SOURCES.length>0&&validLifeActions(s)&&s.lifeActions?.receipts?.some(receipt=>receipt.category==='friend'&&receipt.optionId===id&&(isConsequenceLifeReceipt(receipt)||LIFE_SCENE_DIALOGUE_SOURCES.some(row=>row.category==='friend'&&row.optionId===id&&row.dialogue?.sourceId===receipt.dialogue?.sourceId))));
}
// Select only frozen trusted text. Legacy friend receipts retain their exact
// excerpts; routine additions have their own append-only source identities.
export function lifeActionDialogue(option){
 if(option.category==='work')return structuredClone(option.dialogue);
 if(option.category==='relax'&&option.id==='onsen')return lifeActionDialogueForSource(option,'onsen-rest-20261017');
 const id=option.category==='friend'?option.id==='mochiko'?'O-F-TALK-01':'O-C-HIDE-02':['work','relax'].includes(option.category)?`life-action-20261012:${option.category}:${option.id}`:null;
 return lifeActionDialogueForSource(option,id);
}
export function validLifeActions(s){
 if(!validWorkInventory(s))return false;
 const actions=s.lifeActions;
 if(actions===undefined)return (s.nonTradingIncome??0)===0&&(s.dayOpeningIncome??0)===0&&s.version!==LIFE_ACTION_SAVE_VERSION;
 if(!actions||actions.version!==1||![9,10,11,12,15,16].includes(actions.sourceVersion)||s.mode!=='story'||!Array.isArray(actions.receipts)||!actions.receipts.length||!Number.isFinite(s.nonTradingIncome)||s.nonTradingIncome<0||!Number.isFinite(s.dayOpeningIncome)||s.dayOpeningIncome<0||s.dayOpeningIncome>s.nonTradingIncome)return false;
 const days=new Set();let total=0,beforeToday=0;
 for(const receipt of actions.receipts){
  const selected=lifeActionDefinition(receipt?.category,receipt?.optionId);
  if(Object.hasOwn(receipt||{},'narrativeMode')&&!isConsequenceLifeReceipt(receipt))return false;
  if(!selected||!Number.isSafeInteger(receipt.day)||receipt.day<1||receipt.day>s.day||days.has(receipt.day)||receipt.id!==`life:${lifeActionRunId(s)}:${receipt.day}`||receipt.label!==selected.label||(receipt.category==='work'?!validWorkPay(receipt,selected):receipt.income!==selected.income)||receipt.cost!==(selected.cost||0)||!Number.isFinite(receipt.feeTotal)||receipt.feeTotal<0||!Number.isSafeInteger(receipt.closedPositions)||receipt.closedPositions<0||receipt.timestamp!==null&&!Number.isFinite(receipt.timestamp)||!Number.isFinite(receipt.assetsBefore)||!Number.isFinite(receipt.assetsAfter)||!(validLifeActionDialogue(selected,receipt.dialogue)||receipt.category==='friend'&&isConsequenceLifeReceipt(receipt)||receipt.category==='work'&&validWorkPayDialogue(selected,receipt)))return false;
  if(receipt.category==='dinner'){const meals=s.recapChoiceLedger;if(!Array.isArray(meals)||!meals.length||receipt.day>=Math.min(...meals.map(row=>row.day))&&!meals.some(row=>row.day===receipt.day&&row.id===receipt.optionId&&row.cost===receipt.cost))return false;}
  days.add(receipt.day);total+=receipt.income;if(receipt.day<s.day)beforeToday+=receipt.income;
 }
 if(Math.abs(total-s.nonTradingIncome)>1e-6||Math.abs(beforeToday-s.dayOpeningIncome)>1e-6)return false;
 const today=lifeActionReceipt(s);
 return !today||['day_end','resting','ending'].includes(s.phase)&&s.dayReport?.day===s.day&&JSON.stringify(s.dayReport.lifeAction)===JSON.stringify(today)&&Math.abs((s.dayReport.nonTradingIncome||0)-today.income)<1e-6;
}
