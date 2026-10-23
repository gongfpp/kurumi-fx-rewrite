export function clampOrderAmount(value,cap){
  if(!Number.isFinite(cap)||cap<100)return 0;
  if(!Number.isFinite(value))return NaN;
  return Math.max(100,Math.min(cap,Math.round(value*100)/100));
}
export function sliderOrderAmount(value,cap){
  return clampOrderAmount(value>=cap?cap:Math.round(value/100)*100,cap);
}
// Whole hundreds are easy to read; fees and psychological limits are in cap.
export function randomOrderAmount(cap,random=Math.random){
  if(!Number.isFinite(cap)||cap<100)return 0;
  const count=Math.floor(cap/100),roll=Math.max(0,Math.min(1-Number.EPSILON,random()));
  return (1+Math.floor(roll*count))*100;
}

export const ORDER_RATIOS=Object.freeze([.1,.25,.5,1]);
// Legacy presets and the continuous percentage slider share the same quote path.
export function validOrderRatio(value){return Number.isFinite(value)&&value>=0&&value<=1;}
export function normalizeOrderAmount(value){
 if(!Number.isFinite(value)||value<0||!Number.isSafeInteger(Math.round(value*100)))return NaN;
 return Math.round(value*100)/100;
}
export function draftOrderAmount(state,fallback=10000){const value=normalizeOrderAmount(state?.orderDraftAmount);return Number.isFinite(value)?value:fallback;}
export function orderAmountRatio(amount,availableMargin){
 return Number.isFinite(amount)&&amount>=0&&Number.isFinite(availableMargin)&&availableMargin>0?amount/availableMargin:null;
}
// Highlight only. This function never changes the amount or silently snaps it.
// An exact tie prefers the lower ratio, independent of input array order.
export function nearestOrderRatio(amount,availableMargin,{ratios=ORDER_RATIOS,tolerance=.03}={}){
 const actual=orderAmountRatio(amount,availableMargin);if(actual===null||!Number.isFinite(tolerance)||tolerance<0)return null;
 let winner=null,distance=Infinity;
 for(const ratio of [...new Set(ratios)].filter(value=>Number.isFinite(value)&&value>0&&value<=1).sort((a,b)=>a-b)){
  const diff=Math.abs(actual-ratio);if(diff<distance-1e-12){winner=ratio;distance=diff;}
 }
 return distance<=tolerance+1e-12?winner:null;
}
export function ratioOrderAmount(ratio,availableMargin,cap){
 if(!validOrderRatio(ratio)||!Number.isFinite(availableMargin)||availableMargin<=0||!Number.isFinite(cap)||cap<100)return 0;
 return Math.max(0,Math.floor((Math.min(cap,availableMargin*ratio)+1e-8)*100)/100);
}

// Keep user intent, rather than freezing a rounded amount at an old quote.
// Explicit typed amounts remain fixed. Ratio/max tickets re-quote on execution.
export function orderDraftIntent(state={}){
 const intent=state.orderDraftIntent;
 return intent?.mode==='max'?{mode:'max'}:intent?.mode==='ratio'&&validOrderRatio(intent.ratio)?{mode:'ratio',ratio:intent.ratio}:null;
}
export function orderIntentAction(state,amount){const intent=orderDraftIntent(state);return intent?.mode==='max'?{amountMode:'max'}:intent?.mode==='ratio'?{ratio:intent.ratio}:{amount};}
export function quoteOrderIntent(action,availableMargin,maxMargin){
 if(action?.amountMode==='max')return maxMargin;
 if(Object.hasOwn(action||{},'ratio'))return ratioOrderAmount(action.ratio,availableMargin,maxMargin);
 return null;
}

// Five fixed amounts per asset decade, plus the separate live Max control.
// Only the offered amounts scale: choosing/typing an amount stays an explicit
// ticket, and affordability is checked separately rather than clipping presets.
export function orderAmountPresets(totalAssets){
 // Cap the unit so every offered amount remains safe at cent precision.
 let unit=100;
 if(Number.isFinite(totalAssets))while(totalAssets>=unit*1000&&unit<1e11)unit*=10;
 return [1,5,10,50,100].map(multiplier=>unit*multiplier);
}
