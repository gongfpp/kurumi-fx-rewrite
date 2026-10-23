import {LIFESTYLES,LEGACY_LIFESTYLES,lifestylePlan} from './consumption-ledger.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
// Completed paid services grant recovery. Choosing/replaying a home cannot
// improve trading P&L, prices or trauma. These are game balance parameters.
export const LIVING_MOVE_SCENE_IDS=Object.freeze({basic:'move-home-basic',comfortable:'move-home-comfortable',generous:'move-home-generous',premium:'move-home-premium',penthouse:'move-home-penthouse'});
const planById=id=>LIFESTYLES.find(plan=>plan.id===id);
const amount=value=>Math.round((value+Number.EPSILON*Math.abs(value)*2)*100)/100;
const nonnegative=value=>Number.isFinite(value)&&value>=0;
const day=value=>Number.isSafeInteger(value)&&value>=1;
export function livingChargeParts(state){
 const selected=planById(state.livingHousing?.id)||lifestylePlan(state),legacy=state.housingEconomy?.effectiveDay>state.day;
 const plan=legacy?(LEGACY_LIFESTYLES.find(p=>p.id===selected.id)||selected):selected;
 const mealCredit=state.dailySupplies?.mealCreditDay===state.day?300:0;
 const basics=amount(plan.dailyBasics-mealCredit);
 return {lifestyleId:plan.id,basics,rent:plan.dailyRent,total:basics+plan.dailyRent,mealCredit,pricingVersion:legacy?1:2};
}
export function paidLivingService(quote){
 const plan=quote.pricingVersion!==2?LEGACY_LIFESTYLES.find(p=>p.id===quote.lifestyleId):planById(quote.lifestyleId);if(!plan||quote.legacyPricing)return undefined;
 const basicDue=quote.kind==='friend-treat'?0:quote.basicAmount;
 const rentDue=quote.rentAmount,basicPaid=Math.min(quote.amount,basicDue),rentPaid=Math.max(0,quote.amount-basicPaid);
 const fullyPaid=Math.abs(quote.amount-basicDue-rentDue)<.000001;
 return {version:quote.pricingVersion===2?2:1,lifestyleId:plan.id,basicDue,rentDue,basicPaid,rentPaid,fullyPaid,
  stressRelief:fullyPaid?plan.extraStressRelief:0,restRecovery:fullyPaid?plan.extraRestRecovery:0};
}
export function validLivingService(service,receipt){
 if(service===undefined)return true;
 const plan=service?.version===1?LEGACY_LIFESTYLES.find(p=>p.id===service.lifestyleId):planById(service?.lifestyleId);
 return !!plan&&[1,2].includes(service.version)&&service.lifestyleId===receipt.lifestyleId&&
  ['basicDue','rentDue','basicPaid','rentPaid','stressRelief','restRecovery'].every(key=>nonnegative(service[key]))&&
  service.basicDue<=plan.dailyBasics&&service.rentDue===plan.dailyRent&&service.basicPaid<=service.basicDue&&service.rentPaid<=service.rentDue&&
  Math.abs(service.basicPaid+service.rentPaid-receipt.amount)<.000001&&
  service.fullyPaid===(Math.abs(service.basicPaid-service.basicDue)<.000001&&Math.abs(service.rentPaid-service.rentDue)<.000001)&&
  service.stressRelief===(service.fullyPaid?plan.extraStressRelief:0)&&service.restRecovery===(service.fullyPaid?plan.extraRestRecovery:0);
}
export function applyPaidLivingRecovery(state){
 const settlement=state.dayReport?.livingSettlement,receipt=settlement?.receipt,service=receipt?.service;
 if(state.mode==='endless'||state.phase!=='resting'||state.dayReport?.day!==state.day||settlement?.status!=='finalized'||!service||
  !validLivingService(service,receipt)||!service.fullyPaid||state.livingRecovery?.day>=state.day)return null;
 const stressBefore=state.stress||0,recoveryBefore=state.restRecovery||0;
 state.stress=Math.max(0,stressBefore-service.stressRelief);state.restRecovery=Math.min(32,recoveryBefore+service.restRecovery);
 const result={version:1,day:state.day,receiptId:receipt.id,lifestyleId:receipt.lifestyleId,
  stressRelief:stressBefore-state.stress,restRecovery:state.restRecovery-recoveryBefore};
 state.livingRecovery=result;return result;
}
export function activateSelectedHousing(state,timestamp){
 const housing=state.livingHousing,pending=housing?.pending;
 if(state.mode==='endless'||!pending||pending.effectiveDay>state.day)return null;
 delete housing.pending;
 if(housing.id===pending.toId)return null;
 const moves=state.livingMoves ||= [],receipt={id:`living-move:${state.seed}:${moves.length+1}`,day:state.day,
  fromId:housing.id,toId:pending.toId,selectedDay:pending.selectedDay,effectiveDay:state.day,plannedDay:pending.effectiveDay,timestamp};
 housing.id=pending.toId;moves.push(receipt);return receipt;
}
export function scheduleHousingSelection(state,{fromId,toId,effectiveDay,timestamp}){
 if(state.mode==='endless')return null;
 const housing=state.livingHousing ||= {version:1,id:fromId};
 if(toId===housing.id){delete housing.pending;return null;}
 housing.pending={toId,selectedDay:state.day,effectiveDay};
 return activateSelectedHousing(state,timestamp);
}
export function validLivingServices(state){
 const housing=state.livingHousing,moves=state.livingMoves,recovery=state.livingRecovery;
 if((housing!==undefined||moves!==undefined||recovery!==undefined||state.dayReport?.livingSettlement?.receipt?.service!==undefined)&&state.lifestyle?.version!==2)return false;
 if(housing&&!housing.pending&&housing.id!==state.lifestyle?.id)return false;
 if(housing!==undefined&&(!housing||housing.version!==1||!planById(housing.id)||housing.pending!==undefined&&(!housing.pending||
  !planById(housing.pending.toId)||housing.pending.toId!==state.lifestyle?.id||housing.pending.toId===housing.id||
  !day(housing.pending.selectedDay)||housing.pending.selectedDay>state.day||!day(housing.pending.effectiveDay)||
  housing.pending.effectiveDay<housing.pending.selectedDay||housing.pending.effectiveDay>state.day+1)))return false;
 if(moves!==undefined&&(!Array.isArray(moves)||moves.some((move,index)=>!move||move.id!==`living-move:${state.seed}:${index+1}`||
  !day(move.day)||move.day>state.day||!planById(move.fromId)||!planById(move.toId)||move.fromId===move.toId||
  !day(move.selectedDay)||!day(move.effectiveDay)||move.selectedDay>move.effectiveDay||move.effectiveDay!==move.day||
  index>0&&(moves[index-1].toId!==move.fromId||moves[index-1].day>move.day))||moves.length&&moves.at(-1).toId!==housing?.id))return false;
 if(recovery!==undefined){const plan=LEGACY_LIFESTYLES.find(p=>p.id===recovery?.lifestyleId)||planById(recovery?.lifestyleId);if(!plan||recovery.version!==1||!day(recovery.day)||recovery.day>=state.day||
  recovery.receiptId!==`living:${state.seed}:${recovery.day}`||!nonnegative(recovery.stressRelief)||recovery.stressRelief>plan.extraStressRelief||
  !nonnegative(recovery.restRecovery)||recovery.restRecovery>plan.extraRestRecovery)return false;}
 return true;
}

export function livingMoveEvidence(state,receipt){
 if(state.mode!=='story'||!receipt||!day(receipt.day)||receipt.day>state.day||receipt.effectiveDay!==receipt.day||
  !planById(receipt.fromId)||!planById(receipt.toId)||receipt.fromId===receipt.toId)return null;
 const found=state.livingMoves?.find(row=>['id','day','fromId','toId','selectedDay','effectiveDay','timestamp'].every(key=>row[key]===receipt[key]));
 return found?{id:LIVING_MOVE_SCENE_IDS[found.toId],receipt:found,key:found.id}:null;
}

// No ledger entries or current-day quotes are rewritten during restore.
export function initializeHousingEconomy(state,{restored=false}={}){
 if(state.housingEconomy)return state.housingEconomy;
 const id=lifestylePlan(state).id;
 state.lifestyle={version:state.mode==='endless'?1:2,id,selectedDay:state.lifestyle?.selectedDay||state.day};
 if(state.mode!=='endless')state.livingHousing ||= {version:1,id};
 return state.housingEconomy={version:1,effectiveDay:state.day+(restored?1:0)};
}
export function quoteHousingSelection(state,toId){
 const plan=planById(toId);if(!plan)throw new Error('没有这个住处');
 const fromId=state.lifestyle?.id||'basic',changed=fromId!==toId;
 const moveInCost=state.mode!=='endless'&&changed&&state.livingHousing?.id!==toId?plan.moveInCost:0;
 return {...plan,valid:true,fromId,toId,selectedDay:state.day,effectiveDay:state.day+1,changed,moveInCost,requiredCash:moveInCost};
}
// Engine owns payment. paidAmount must be the actual committed move-in charge.
export function commitHousingSelection(state,quote,{paidAmount=0,timestamp}={}){
 const current=quoteHousingSelection(state,quote.toId);
 if(['fromId','toId','selectedDay','effectiveDay','moveInCost'].some(key=>quote[key]!==current[key]))throw new Error('住处选择已变化');
 if(!current.changed)return {...current,move:null};
 if(paidAmount!==current.moveInCost)throw new Error('搬入费未付清');
 initializeHousingEconomy(state);
 state.lifestyle={version:state.mode==='endless'?1:2,id:current.toId,selectedDay:state.day};
 const move=scheduleHousingSelection(state,{...current,timestamp});
 return {...current,move};
}
