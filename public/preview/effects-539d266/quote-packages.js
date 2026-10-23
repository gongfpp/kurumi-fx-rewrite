// Fictional, one-off per-run game purchases. No payment provider or real money.
export const QUOTE_PACKAGE_VERSION=1;
export const QUOTE_PACKAGES=Object.freeze([
 Object.freeze({hz:1,totalPrice:0,label:'基础行情'}),
 Object.freeze({hz:2,totalPrice:2000,label:'流畅行情'}),
 Object.freeze({hz:4,totalPrice:8000,label:'高刷行情'})
]);
const tier=hz=>QUOTE_PACKAGES.find(x=>x.hz===hz);
const receiptId=(state,hz)=>`quote-package:${state.runId||state.seed}:${state.mode||'story'}:${hz}`;
export function quotePackageState(state={}){
 const p=state.quotePackage;
 if(!Object.hasOwn(state,'quotePackage'))return{version:1,ownedHz:1,selectedHz:1,paid:0,receipts:[]};
 if(!p||typeof p!=='object'||Array.isArray(p))throw Error('行情套餐存档无效');
 if(p.version!==1||!tier(p.ownedHz)||!tier(p.selectedHz)||p.selectedHz>p.ownedHz||p.paid!==tier(p.ownedHz).totalPrice||!Array.isArray(p.receipts))throw Error('行情套餐存档无效');
 const seen=new Set();let paid=0,previous=1;
 for(const r of p.receipts){if(!r||r.id!==receiptId(state,r.hz)||seen.has(r.id)||!tier(r.hz)||r.hz<=previous||r.amount!==tier(r.hz).totalPrice-tier(previous).totalPrice||r.totalPaid!==tier(r.hz).totalPrice||r.currency!=='game-JPY'||!Number.isSafeInteger(r.day)||r.day<1||Number.isSafeInteger(state.day)&&r.day>state.day)throw Error('行情套餐收据无效');seen.add(r.id);paid+=r.amount;previous=r.hz;}
 if(paid!==p.paid||previous!==p.ownedHz)throw Error('行情套餐账务不一致');
 return p;
}
// Money movements must match their receipt within the engine's yen tolerance.
// Merely changing a huge floating-point balance is not sufficient proof.
export function quoteCostRepresentable(value,amount,{add=false}={}){
 if(!Number.isFinite(value)||!Number.isFinite(amount)||amount<0)return false;
 const after=add?value+amount:value-amount,delta=add?after-value:value-after;
 return Number.isFinite(after)&&Math.abs(delta-amount)<=1e-6&&(amount===0||after!==value);
}
export function quotePackageOffer(state,hz,{availableCash=state.cash,canPurchase=true}={}){
 const p=quotePackageState(state),target=tier(hz);if(!target)return{valid:false,reason:'未知行情档位',price:0};
 const owned=hz<=p.ownedHz,price=owned?0:target.totalPrice-p.paid;
 const available=Math.max(0,Number.isFinite(availableCash)?availableCash:0);
 const representable=price===0||quoteCostRepresentable(available,price)&&quoteCostRepresentable(state.cash??available,price)&&quoteCostRepresentable(state.expenses??0,price,{add:true});
 return{valid:owned||canPurchase&&available>=price&&representable,owned,hz,price,totalPrice:target.totalPrice,availableCash:available,reason:owned?null:!canPurchase?'当前不能购买行情套餐':available<price?'可用资金不足':!representable?'当前金额精度不足，无法安全扣款':null};
}
// Engine applies the returned cost exactly once to cash/expenses and persists it
// together with this package transition. This planner never mutates money.
export function planQuotePackagePurchase(state,hz,{availableCash=state.cash,canPurchase=true,timestamp=null}={}){
 const p=quotePackageState(state),offer=quotePackageOffer(state,hz,{availableCash,canPurchase});if(!offer.valid)throw Error(offer.reason);
 if(offer.owned)return{charged:false,amount:0,receipt:null,package:{...p,selectedHz:hz}};
 const receipt={id:receiptId(state,hz),hz,amount:offer.price,totalPaid:p.paid+offer.price,day:state.day,timestamp,currency:'game-JPY',label:`${hz}Hz 行情套餐`};
 return{charged:true,amount:offer.price,receipt,package:{version:1,ownedHz:hz,selectedHz:hz,paid:p.paid+offer.price,receipts:[...p.receipts,receipt]}};
}
