// Configurable game balance, not a claim about real living costs or behavior.
export const LIVING_SETTLEMENT_VERSION=1;
export const LIVING_POLICY=Object.freeze({gainThreshold:20000,openingNetRatio:.25,feastChance:.12,feastMultiplier:1.5,friendChance:.15,cooldownDays:3});
const finite=(value,fallback=0)=>Number.isFinite(value)?value:fallback;
const money=value=>Math.round((value+Number.EPSILON*Math.abs(value)*2)*100)/100;
export function livingDayRoll(seed,day){let x=((seed>>>0)^Math.imul(day,0x9e3779b9)^0x4c495649)>>>0;x=Math.imul(x^(x>>>16),0x7feb352d);x=Math.imul(x^(x>>>15),0x846ca68b);return((x^(x>>>16))>>>0)/4294967296;}
export function quoteLivingMeal({seed,day,baseAmount,cash,openingNetAssets,tradingNet,knowsFriend=false,lastSpecialDay=null,discount=0,roll=livingDayRoll(seed,day)}={}){
 const budget=Math.max(0,finite(cash)),base=Math.max(0,finite(baseAmount)),threshold=Math.max(LIVING_POLICY.gainThreshold,Math.max(0,finite(openingNetAssets))*LIVING_POLICY.openingNetRatio);
 const cooled=lastSpecialDay===null||!Number.isFinite(lastSpecialDay)||day-lastSpecialDay>LIVING_POLICY.cooldownDays;
 const draw=Number.isFinite(roll)&&roll>=0&&roll<1?roll:livingDayRoll(seed,day);
 let kind=discount>0?'thrifty':'ordinary',label=discount>0?'省钱生活费':'普通生活费',amount=Math.min(budget,base);
 const feast=money(base*LIVING_POLICY.feastMultiplier);
 if(cooled&&finite(tradingNet)>=threshold&&draw<LIVING_POLICY.feastChance&&feast>0&&budget>=feast){kind='feast';label='难得吃顿大餐';amount=feast;}
 else if(cooled&&knowsFriend&&finite(tradingNet)<=-threshold&&draw<LIVING_POLICY.friendChance){kind='friend-treat';label='朋友请客';amount=0;}
 // Sub-cent legacy cash is an asset, not permission to charge beyond that cash.
 return{version:1,day,amount:Math.min(budget,money(amount)),baseAmount:base,kind,label,roll:draw,seedLocked:true,threshold,discount:Math.max(0,finite(discount)),cooldownDays:LIVING_POLICY.cooldownDays};
}
export function validLivingSettlement(record,day){
 if(!record||record.version!==1||record.day!==day||!['pending','finalized','legacy-paid'].includes(record.status))return false;
 const q=record.quote;if(!q||!Number.isFinite(q.amount)||q.amount<0||!Number.isFinite(q.baseAmount)||q.baseAmount<0)return false;
 if(record.status==='pending')return record.receipt===undefined&&Number.isFinite(q.roll)&&q.roll>=0&&q.roll<1&&q.seedLocked===true;
 const r=record.receipt;return !!r&&r.day===day&&Number.isFinite(r.amount)&&r.amount>=0&&typeof r.kind==='string'&&typeof r.label==='string';
}
