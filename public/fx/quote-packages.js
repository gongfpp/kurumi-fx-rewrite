// Daily display rentals. Canonical quotes, execution and risk remain in the engine.
export const QUOTE_PACKAGE_VERSION=2;
export const QUOTE_PACKAGES=Object.freeze([
 Object.freeze({hz:1,totalPrice:0,dailyPrice:0,label:'基础手机看盘',description:'随手看看，慢慢等机会。'}),
 Object.freeze({hz:2,totalPrice:2000,dailyPrice:2000,label:'电脑宽带',description:'坐到电脑前，盯紧盘面。'}),
 Object.freeze({hz:4,totalPrice:8000,dailyPrice:8000,label:'交易所专线',description:'把每一阵波动尽收眼底。'})
]);
export const quotePackageName=hz=>tier(hz)?.label||'行情观看';
const tier=hz=>QUOTE_PACKAGES.find(x=>x.hz===hz);
const receiptId=(state,hz,day=null)=>day===null?`quote-package:${state.runId||state.seed}:${state.mode||'story'}:${hz}`:`quote-rental:${state.runId||state.seed}:${state.mode||'story'}:day-${day}:${hz}`;
const validDay=day=>Number.isSafeInteger(day)&&day>=1;
const invalid=()=>{throw Error('行情套餐存档或收据无效');};
const empty=()=>({version:2,legacyOwnedHz:1,rentalDay:null,rentedHz:1,ownedHz:1,selectedHz:1,preferredHz:1,paid:0,receipts:[]});
export function quotePackageState(state={}){
 const p=state.quotePackage;
 if(!Object.hasOwn(state,'quotePackage'))return empty();
 if(!p||typeof p!=='object'||Array.isArray(p)||![1,2].includes(p.version)||!tier(p.ownedHz)||!tier(p.selectedHz)||p.selectedHz>p.ownedHz||!Array.isArray(p.receipts)||!Number.isFinite(p.paid)||p.paid<0)invalid();
 if(p.renewalBlocked!==undefined&&typeof p.renewalBlocked!=='boolean')invalid();
 if(p.renewal!==undefined&&(!p.renewal||!validDay(p.renewal.day)||p.renewal.day>state.day||!tier(p.renewal.hz)||!['renewed','failed'].includes(p.renewal.status)||p.renewal.status==='failed'&&!['可用资金不足','当前金额精度不足，无法安全扣款','当前不能租用行情套餐'].includes(p.renewal.reason)))invalid();
 const seen=new Set();let paid=0,legacy=1,rentalDay=null,rented=1,hasRental=false;
 for(const r of p.receipts){
  if(!r||!tier(r.hz)||seen.has(r.id)||r.currency!=='game-JPY'||!validDay(r.day)||validDay(state.day)&&r.day>state.day)invalid();
  if(r.kind==='daily-rental'){
   if(p.version!==2||r.id!==receiptId(state,r.hz,r.day)||rentalDay!==null&&r.day<rentalDay)invalid();
   const previous=r.day===rentalDay?rented:legacy;
   if(r.hz<=previous||r.amount!==tier(r.hz).dailyPrice-tier(previous).dailyPrice)invalid();
   rentalDay=r.day;rented=r.hz;hasRental=true;
  }else{
   if(r.kind!==undefined||hasRental||r.id!==receiptId(state,r.hz)||r.hz<=legacy||r.amount!==tier(r.hz).totalPrice-tier(legacy).totalPrice)invalid();
   legacy=r.hz;
  }
  paid+=r.amount;if(!Number.isSafeInteger(paid)||r.totalPaid!==paid)invalid();seen.add(r.id);
 }
 if(paid!==p.paid)invalid();
 if(p.version===1){
  if(legacy!==p.ownedHz||paid!==tier(legacy).totalPrice)invalid();
  return {...empty(),legacyOwnedHz:legacy,ownedHz:legacy,selectedHz:p.selectedHz,preferredHz:p.selectedHz,paid,receipts:p.receipts};
 }
 const storedOwned=Math.max(legacy,rented);
 if(p.legacyOwnedHz!==legacy||p.rentalDay!==rentalDay||p.rentedHz!==rented||p.ownedHz!==storedOwned||!tier(p.preferredHz))invalid();
 const owned=rentalDay===state.day?storedOwned:legacy;
 return {...p,ownedHz:owned,selectedHz:Math.min(p.selectedHz,owned)};
}
// A receipt is valid only when its exact amount can be represented in both ledgers.
export function quoteCostRepresentable(value,amount,{add=false}={}){
 if(!Number.isFinite(value)||!Number.isFinite(amount)||amount<0)return false;
 const after=add?value+amount:value-amount,delta=add?after-value:value-after;
 return Number.isFinite(after)&&Math.abs(delta-amount)<=1e-6&&(amount===0||after!==value);
}
export function quotePackageOffer(state,hz,{availableCash=state.cash,canPurchase=true}={}){
 const p=quotePackageState(state),target=tier(hz);if(!target)return{valid:false,reason:'未知行情档位',price:0};
 const owned=hz<=p.ownedHz,price=owned?0:target.dailyPrice-tier(p.ownedHz).dailyPrice;
 const available=Math.max(0,Number.isFinite(availableCash)?availableCash:0);
 const representable=price===0||quoteCostRepresentable(available,price)&&quoteCostRepresentable(state.cash??available,price)&&quoteCostRepresentable(state.expenses??0,price,{add:true})&&quoteCostRepresentable(p.paid,price,{add:true});
 return{valid:owned||canPurchase&&validDay(state.day)&&available>=price&&representable,owned,hz,price,totalPrice:target.dailyPrice,availableCash:available,reason:owned?null:!canPurchase||!validDay(state.day)?'当前不能租用行情套餐':available<price?'可用资金不足':!representable?'当前金额精度不足，无法安全扣款':null};
}
// Pure planner: only the engine applies and atomically persists the cash expense.
export function planQuotePackagePurchase(state,hz,{availableCash=state.cash,canPurchase=true,timestamp=null}={}){
 const p=quotePackageState(state),offer=quotePackageOffer(state,hz,{availableCash,canPurchase});if(!offer.valid)throw Error(offer.reason);
 // Keep the last paid day in the archive, even when using the free fallback.
 const storedOwned=Math.max(p.legacyOwnedHz,p.rentedHz);
 if(offer.owned)return{charged:false,amount:0,receipt:null,package:{...p,ownedHz:storedOwned,selectedHz:hz,preferredHz:hz,renewalBlocked:false}};
 const receipt={id:receiptId(state,hz,state.day),kind:'daily-rental',hz,amount:offer.price,totalPaid:p.paid+offer.price,day:state.day,timestamp,currency:'game-JPY',label:`${quotePackageName(hz)} · 第 ${state.day} 日`};
 return{charged:true,amount:offer.price,receipt,package:{...p,version:2,rentalDay:state.day,rentedHz:hz,ownedHz:hz,selectedHz:hz,preferredHz:hz,renewalBlocked:false,paid:p.paid+offer.price,receipts:[...p.receipts,receipt]}};
}

// Persisted 1/2/4 tier IDs are not render Hz. Keep receipts and old saves unchanged.
// Playback speed changes source time only; it cannot unlock a faster display tier.
export const QUOTE_DISPLAY_RATES=Object.freeze({1:1,2:5,4:20});
export function quoteRefreshMilliseconds(state){return 1000/QUOTE_DISPLAY_RATES[quotePackageState(state).selectedHz];}
