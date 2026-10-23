import {createSkitStatusIcon} from './skit-dialogue.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {MOODS} from './content.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {staminaStatus} from './stamina.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';

// Optional presentation evidence, never a source of rewards or game balance.
// Old saves lack before-values: display their actual current state, not a guess.
const runId=state=>String(state.runId??`seed:${state.seed}:${state.mode}`);
const point=value=>!!value&&Number.isFinite(value.stamina)&&value.stamina>=0&&value.stamina<=100&&Object.hasOwn(MOODS,value.emotion);
export function captureSkitState(state,emotion){return {stamina:staminaStatus(state).value,emotion};}
export function makeSkitOutcome(state,id,before,after){
 if((before!==null&&!point(before))||!point(after)||typeof id!=='string'||!id)return null;
 return {version:1,runId:runId(state),day:state.day,id,before:before===null?null:{stamina:before.stamina,emotion:before.emotion},after:{stamina:after.stamina,emotion:after.emotion}};
}
export function readSkitOutcome(state,id,value){
 if(!value||value.version!==1||value.runId!==runId(state)||value.day!==state.day||value.id!==id||(value.before!==null&&!point(value.before))||!point(value.after))return null;
 return makeSkitOutcome(state,id,value.before,value.after);
}
const narrativeId=state=>`daily:${state.settlementNarrative?.event?.id||state.settlementNarrative?.event?.key||'quiet'}`;
function actionStart(state){
 const life=state.dayReport?.lifeAction,receipts=[];
 if(life?.day===state.day)receipts.push({id:life.id,value:life.skitOutcome,staminaId:life.category==='work'?`stamina:work:${state.day}`:life.category==='dinner'?`stamina:activity:${state.day}:${life.optionId}`:`stamina:${life.id}`});
 for(const receipt of state.recapChoiceLedger||[])if(receipt.day===state.day)receipts.push({id:`activity:${state.day}:${receipt.id}`,value:receipt.skitOutcome,staminaId:`stamina:activity:${state.day}:${receipt.id}`});
 if(!receipts.length)return {hasAction:false,before:null};
 const unknown={hasAction:true,before:null},actions=new Map();
 // Old, malformed or foreign action snapshots leave a real gap. Observing a
 // later action cannot supply a before-state for that missing history.
 for(const receipt of receipts){
  const outcome=readSkitOutcome(state,receipt.id,receipt.value);if(!outcome?.before)return unknown;
  const prior=actions.get(receipt.staminaId);
  // Dinner has both a life and a recap receipt for one committed action.
  if(prior&&JSON.stringify(prior.outcome)!==JSON.stringify({ ...outcome,id:prior.outcome.id }))return unknown;
  actions.set(receipt.staminaId,{...receipt,outcome});
 }
 const ordered=[...actions.values()];if(ordered.length===1)return {hasAction:true,before:ordered[0].outcome.before};
 // Existing stamina receipts are appended by the actual transactions, unlike
 // the independent life/recap ledgers whose array order cannot be compared.
 // Use them only with exact before/after corroboration; never invent ordering.
 const ledger=state.stamina?.recoveryReceipts||[];
 for(const action of ordered){
  const matches=ledger.map((row,index)=>({row,index})).filter(({row})=>row.id===action.staminaId);
  if(matches.length!==1)return unknown;const {row,index}=matches[0];
  if(!Number.isFinite(row.before)||!Number.isFinite(row.after)||Math.abs(row.before-action.outcome.before.stamina)>1e-7||Math.abs(row.after-action.outcome.after.stamina)>1e-7)return unknown;
  action.order=index;
 }
 ordered.sort((a,b)=>a.order-b.order);return {hasAction:true,before:ordered[0].outcome.before};
}
export function rememberDailySkitOutcome(state,before,emotion){
 const narrative=state.settlementNarrative;
 if(!narrative||narrative.day!==state.day||!narrative.effectsApplied)return false;
 if(readSkitOutcome(state,narrativeId(state),narrative.skitOutcome))return false;
 // The explicit life action occurred before its illustration is opened. Its
 // real before-state is the start of this evening, not the later render state.
 const start=actionStart(state),outcome=makeSkitOutcome(state,narrativeId(state),start.hasAction?start.before:before,captureSkitState(state,emotion));
 if(!outcome)return false;narrative.skitOutcome=outcome;return true;
}
export function dailySkitStatus(state,emotion){
 if(state.mode==='endless'||state.dayReport?.day!==state.day||!['resting','day_end'].includes(state.phase))return null;
 const narrative=state.settlementNarrative,current=captureSkitState(state,emotion);
 const outcome=narrative?.day===state.day&&narrative.effectsApplied?readSkitOutcome(state,narrativeId(state),narrative.skitOutcome):null;
 const start=actionStart(state),before=outcome?(start.hasAction?start.before:outcome.before):null,after=outcome?.after||current;
 if(!point(after))return null;
 const life=state.dayReport.lifeAction;
 return {before,after,delta:before?Math.round((after.stamina-before.stamina)*100)/100:null,
  income:life?.day===state.day&&life.category==='work'&&Number.isFinite(life.income)&&life.income>=0?life.income:null};
}
const number=value=>value.toLocaleString('zh-CN',{maximumFractionDigits:2});
export function renderSkitStatus(host,state,emotion){
 if(!host)return null;host.replaceChildren();const status=dailySkitStatus(state,emotion);host.hidden=!status;if(!status)return null;
 const doc=host.ownerDocument,make=(tag,className,text)=>{const node=doc.createElement(tag);node.className=className;if(text!==undefined)node.textContent=text;return node;};
 for(const [key,label,format] of [['stamina','体力',number],['emotion','情绪',value=>MOODS[value][0]]]){
  const row=make('div',`skit-status-item skit-status-${key}`),values=make('strong','skit-status-values');
  if(status.before){values.append(make('span','skit-status-before',format(status.before[key])),make('span','skit-status-arrow',' → '));}
  values.append(make('span','skit-status-after',format(status.after[key])));row.append(createSkitStatusIcon(doc,key),make('span','skit-status-label',label),values);host.append(row);
 }
 if(status.income!==null){const income=make('div','skit-status-income');income.append(createSkitStatusIcon(doc,'income'),make('span','skit-status-label','工作收入'),make('strong','skit-status-income-value',`+¥${number(status.income)}`));host.append(income);}
 return status;
}
