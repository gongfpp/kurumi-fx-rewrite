import {accountingValues} from './accounting-journal.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {validLifeActions} from './life-actions.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {validStamina} from './stamina.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {readSkitOutcome} from './skit-outcome.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {APPROVED_FOUR_SKITS} from './copy/approved-four-skits.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';

// A reason for an already completed voluntary exit, never an exit requirement.
// Keep only identities and exact labels from committed action receipts. Preview,
// automatic sleep and an illustration/read marker cannot create this evidence.
function completedLifeChoices(state){
 if(state?.mode!=='story'||state.phase!=='ending'||state.ending?.id!=='walkaway'||!validStamina(state.stamina))return [];
 const father=state.family?.outstanding,network=state.loan?.outstanding;
 if(!Number.isFinite(father)||father<0||!Number.isFinite(network)||network<0||father+network>.005||accountingValues(state).netAssets<0)return [];
 const endingDay=state.ending.day,endingTime=state.ending.timestamp,choices=[];
 if(!Number.isSafeInteger(endingDay)||endingDay!==state.day)return [];
 const completed=(receipt,id,source)=>{
  if(!Number.isSafeInteger(receipt.day)||receipt.day<1||receipt.day>endingDay||receipt.day>state.day||!Number.isFinite(receipt.timestamp)||Number.isFinite(endingTime)&&receipt.timestamp>endingTime)return false;
  const recovery=state.stamina?.recoveryReceipts?.find(row=>row.id===`stamina:${id}`&&row.source===source);
  const outcome=readSkitOutcome({...state,day:receipt.day},id,receipt.skitOutcome);
  return !!recovery&&!!outcome?.before&&Math.abs(recovery.before-outcome.before.stamina)<1e-7&&Math.abs(recovery.after-outcome.after.stamina)<1e-7;
 };
 if(validLifeActions(state))for(const receipt of state.lifeActions?.receipts||[]){
  if(!['friend','relax'].includes(receipt.category)||!completed(receipt,receipt.id,receipt.category))continue;
  choices.push({source:'life-action',id:receipt.id,day:receipt.day,category:receipt.category,optionId:receipt.optionId,label:receipt.label,timestamp:receipt.timestamp});
 }
 for(const receipt of state.recapChoiceLedger||[]){
  if(receipt.id!=='quiet-night'||receipt.cost!==0||receipt.label!==APPROVED_FOUR_SKITS['shrine-walk'].title||(state.recapChoiceLedger||[]).filter(row=>row.day===receipt.day&&row.id===receipt.id).length!==1||!completed(receipt,`activity:${receipt.day}:quiet-night`,'quiet-night'))continue;
  const debits=state.consumptionLedger?.filter(row=>row.id===`activity:${receipt.day}:quiet-night`)||[];
  if(debits.length!==1||debits[0].kind!=='activity'||debits[0].day!==receipt.day||debits[0].amount!==0||debits[0].timestamp!==receipt.timestamp||debits[0].label!==receipt.label)continue;
  choices.push({source:'recap',id:receipt.id,day:receipt.day,category:'relax',optionId:'quiet-night',label:receipt.label,timestamp:receipt.timestamp});
 }
 return choices.sort((a,b)=>b.day-a.day||b.timestamp-a.timestamp);
}
export function selectEndingLifeChoice(state){return completedLifeChoices(state)[0]||null;}
export function readEndingLifeChoice(state){
 const saved=state?.ending?.lifeChoice;
 if(!saved)return null;
 // Read only the action sealed at exit. Old terminal saves have no marker and
 // never acquire a new reason when reopened or rendered by a later build.
 return completedLifeChoices(state).find(choice=>choice.source===saved.source&&choice.id===saved.id&&choice.day===saved.day&&choice.category===saved.category&&choice.optionId===saved.optionId&&choice.label===saved.label&&choice.timestamp===saved.timestamp)||null;
}
