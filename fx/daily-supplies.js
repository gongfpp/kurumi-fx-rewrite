import {ownsTradingNotes} from './life-work.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
// Approved game-only daily supplies. Receipts own payment and meal credit;
// these helpers never touch quotes, orders, borrowing or permanent attributes.
export const DAILY_SUPPLY_IDS=Object.freeze(['dailyDrink','energy','noodles','takeaway','chocolate','eyeMask']);
export const ACTIVE_SUPPLY_IDS=Object.freeze(['energy','noodles','takeaway']);
export function supplyUnavailableReason(state,id){
 if(id==='tradingNotes'&&!ownsTradingNotes(state))return '还没获得交易笔记';
 if(id!=='tradingNotes'&&!ACTIVE_SUPPLY_IDS.includes(id))return '这个物品已停止购买';
 if(supplyUsedToday(state,id)||id==='tradingNotes'&&state.dailySupplies?.noteUsedDay===state.day)return '今天已经用过了';
 if(['noodles','takeaway'].includes(id)&&(state.dailySupplies?.mealCreditDay===state.day||state.dailySupplies?.uses?.some(row=>row.day===state.day&&['noodles','takeaway'].includes(row.id))))return '今天已经吃过这一餐了';
 return '';
}
export function recordTradingNotes(state){
 const reason=supplyUnavailableReason(state,'tradingNotes');if(reason)throw Error(reason);
 ensureDailySupplies(state).noteUsedDay=state.day;state.itemsUsed ||= {};state.itemsUsed.tradingNotes=true;
 return {id:'tradingNotes',day:state.day,cost:0};
}
export const SUPPLY_PRICES=Object.freeze({dailyDrink:300,energy:300,noodles:150,takeaway:1200,chocolate:200,eyeMask:500});
const MOOD_STEPS=Object.freeze(['despair','anxious','nervous','calm','hopeful','smug','ecstatic']);
const moodRank=emotion=>({exhausted:1,regretful:2,guilty:2,irritated:2,stunned:2,lonely:2,relieved:3,warm:3,focused:3,determined:3}[emotion]??Math.max(0,MOOD_STEPS.indexOf(emotion)));
export function ensureDailySupplies(state){
 return state.dailySupplies ||= {version:1,mealCreditDay:null,eyeMaskPending:false,uses:[],noteUsedDay:null};
}
export function supplyUsedToday(state,id){return state.itemsUsed?.[id]===true||state.dailySupplies?.uses?.some(row=>row.day===state.day&&row.id===id)||false;}
export function supplyReceipt(state,id){return state.dailySupplies?.uses?.find(row=>row.day===state.day&&row.id===id)||null;}
export function recordSupplyUse(state,id,consumptionId){
 const supplies=ensureDailySupplies(state);
 const reason=supplyUnavailableReason(state,id);if(reason)throw Error(reason);
 const receipt={id,day:state.day,cost:SUPPLY_PRICES[id],consumptionId};
 supplies.uses.push(receipt);state.itemsUsed ||= {};state.itemsUsed[id]=true;
 if(['noodles','takeaway'].includes(id))supplies.mealCreditDay=state.day;
 if(id==='eyeMask')supplies.eyeMaskPending=true;
 return receipt;
}
export function applySupplyMood(state,id,current,baseline=current){
 const from=moodRank(current),calm=3;
 const next=id==='energy'?Math.min(MOOD_STEPS.length-1,from+1):id==='takeaway'?from+Math.sign(calm-from):id==='chocolate'&&from<calm?from+1:from;
 if(next===from)return null;
 const shift={day:state.day,beat:state.beat,from:baseline,to:MOOD_STEPS[next]};
 ensureDailySupplies(state).moodShift=shift;return {...shift};
}
export function supplyMood(state,baseline){
 const shift=state.dailySupplies?.moodShift;
 return shift?.day===state.day&&shift.beat===state.beat&&shift.from===baseline?shift.to:baseline;
}
export function validDailySupplies(state){
 const s=state.dailySupplies;if(s===undefined)return true;
 const validDay=day=>Number.isSafeInteger(day)&&day>=1&&day<=state.day;
 if(!s||s.version!==1||typeof s.eyeMaskPending!=='boolean'||s.mealCreditDay!==null&&!validDay(s.mealCreditDay)||s.noteUsedDay!==null&&!validDay(s.noteUsedDay)||!Array.isArray(s.uses))return false;
 const keys=new Set();
 if(!s.uses.every(row=>{
  if(!row||!DAILY_SUPPLY_IDS.includes(row.id)||!validDay(row.day)||row.cost!==SUPPLY_PRICES[row.id]||typeof row.consumptionId!=='string')return false;
  const key=row.day+':'+row.id;if(keys.has(key))return false;keys.add(key);
  return state.consumptionLedger?.some(c=>c.id===row.consumptionId&&c.day===row.day&&c.amount===row.cost);
 }))return false;
 if(s.mealCreditDay!==null&&!s.uses.some(r=>r.day===s.mealCreditDay&&['noodles','takeaway'].includes(r.id)))return false;
 if(s.eyeMaskPending&&!s.uses.some(r=>r.id==='eyeMask'))return false;
 const shift=s.moodShift;
 return shift===undefined||!!shift&&validDay(shift.day)&&Number.isSafeInteger(shift.beat)&&shift.beat>=0&&shift.beat<=10&&typeof shift.from==='string'&&MOOD_STEPS.includes(shift.to);
}
export const TAKEAWAY_LINES=Object.freeze([
 '咖喱饭还热着。先把这一顿吃完，行情等会儿再看。',
 '盖饭送到了，筷子却被压在袋子底下。找出来以后，我总算肯慢慢吃了。',
 '乌冬面的汤差一点洒出来。先扶稳碗，再把手机放远一点。'
]);
export function takeawayLine(state){return TAKEAWAY_LINES[((state.seed>>>0)+Math.imul(state.day,31))%TAKEAWAY_LINES.length];}
// Visible Chinese excerpt in the existing chapter19/page21 context-calm.jpg.
// Its published source/hash remains in manga-context-panels.js; not a Japanese transcript.
export const TRADING_NOTES_LINE='但我也差不多要小心了';
