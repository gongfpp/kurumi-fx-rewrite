import {fatherTheftReceipt} from './father-theft-discovery.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {livingMoveEvidence} from './living-services.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {selectEventContextualManga} from './contextual-manga-scenes.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {ACTION_SCENES} from './copy/action-scenes.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {sealedDailyMangaOutcome} from './manga-context.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {tradingTrauma} from './trading-trauma.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {isSevereSettledLoss} from './settled-comic-art.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';

// Read-only presentation adapter. It never executes an action or reconstructs
// missing financial history. Call after success + durable save, not on click.
const finite=Number.isFinite;
const positive=n=>finite(n)&&n>0;
const positions=s=>Array.isArray(s.positions)?s.positions:s.position?[s.position]:[];
const same=(a,b,keys)=>!!a&&!!b&&keys.every(k=>a[k]===b[k]);
const current=(s,r)=>r&&r.day===s.day;
const ACTIVITY_IDS=Object.freeze({'quiet-night':'shrine-walk','noodles-today':'noodles-today','dinner-small':'dinner-small','dinner-friends':'dinner-friends','dinner-feast':'dinner-feast','dinner-banquet':'dinner-banquet'});
const ITEM_IDS=Object.freeze({dailyDrink:'prop-daily-drink-first-use',noodles:'noodles-today',takeaway:'takeaway',energy:'energy',celebration:'spa',mochiko:'mochiko-watch'});
const proof=(id,receipt,key)=>({id,receipt,key});
function evidence(s,event){
 const r=event.receipt;
 switch(event.type){
  case 'housing-move':return livingMoveEvidence(s,r);
  case 'activity':{
   if(!current(s,r)||!finite(r.cost)||r.cost<0||!Object.hasOwn(ACTIVITY_IDS,r.id))return null;
   const found=s.recapChoiceLedger?.find(x=>same(x,r,['id','day','cost','timestamp']));
   // The approved curry conversation names the real total and today's profit.
   if(r.id==='dinner-small'&&(r.cost!==1500||!current(s,s.dayReport)||!(s.dayReport.net>0)))return null;
   return found?proof(ACTIVITY_IDS[r.id],found,`activity:${r.day}:${r.id}`):null;
  }
  case 'item':{
   if(!Object.hasOwn(ITEM_IDS,event.id)||event.result?.id!==event.id)return null;
   const found=s.consumptionLedger?.find(x=>x.id===`item:${s.day}:${event.id}`&&x.kind==='item'&&current(s,x)&&x.amount===event.result.cost&&positive(x.amount));
   return found?proof(ITEM_IDS[event.id],found,found.id):null;
  }
  case 'father-borrow':{
   const found=s.family?.withdrawal;
   if(!current(s,found)||!positive(found.amount)||found.amount>3000000||!s.fatherUsed||event.result?.id!=='father'||found.amount!==event.result.amount)return null;
   return proof('father-borrow',found,found.id||`father-withdrawal:${found.day}:${found.amount}`);
  }
  case 'father-discovery':{
   const d=s.fatherDiscovery;
   if(!d||!['presenting','available'].includes(d.status)||d.eventId!==event.eventId||s.fatherUsed||positive(s.family?.outstanding)||positive(s.family?.repaid))return null;
   // The calm sheet ends by leaving the envelope untouched. Crisis relief has
   // its own existing multi-stage presentation; don't overwrite it with calm.
   return d.route==='calendar'?proof('father-discover',{day:s.day},d.eventId):null;
  }
  case 'father-found':{
   const found=s.story?.log?.findLast(x=>x.id==='fatherFound'&&x.day===s.day);
   if(!s.family?.discovered||!s.fatherUsed||!found)return null;
   const receipt=fatherTheftReceipt(s);
   return receipt&&found.theftDiscoveryId===receipt.id?proof(receipt.sceneId,{...receipt,day:found.day,tradingNet:receipt.tradingNet},receipt.id):proof('father-found',found,`father-found:${found.day}`);
  }
  case 'father-repayment':{
   const found=s.family?.lastRepayment;
   if(!current(s,found)||!positive(found.amount)||!finite(found.outstanding)||found.outstanding<0||!same(found,r,['day','amount','outstanding','beat']))return null;
   return proof(found.outstanding===0?'father-repaid':'father-repay-part',found,`father-repayment:${found.day}:${s.family.repaid}`);
  }
  case 'loan-borrow':case 'loan-repayment':{
   const borrowing=event.type==='loan-borrow',found=s.loan?.[borrowing?'lastBorrow':'lastRepayment'];
   if(!current(s,found)||!positive(found.amount)||!finite(found.outstanding)||found.outstanding<0||!same(found,event.result,['amount','outstanding'])||s.loan.outstanding!==found.outstanding)return null;
   const id=borrowing?'loan-funded':found.outstanding===0?'loan-repaid':'loan-repay-part';
   return proof(id,found,found.id||`${event.type}:${found.day}:${borrowing?s.loan.borrowed:s.loan.repaid}`);
  }
  case 'living':{
   const settlement=s.dayReport?.livingSettlement,found=settlement?.receipt;
   if(settlement?.status!=='finalized'||!current(s,found)||!same(found,r,['id','day','amount','kind','timestamp'])||!finite(found.amount)||found.amount<0||found.legacy)return null;
   if(found.kind==='friend-treat')return found.amount===0&&s.dayReport.net<0?proof('friend-treat',found,found.id):null;
   if(!positive(found.amount))return null;
   // Old random feasts do not become a new, explicitly chosen life tier.
   if(found.kind==='feast'||found.kind==='legacy')return null;
   if(found.kind==='thrifty'||s.livingDiscount>0)return null; // Already shown for the actual noodle purchase.
   // Housing service receipts certify daily basics and rent, not an upgraded
   // meal. Keep old receipt-based meal replays without relabeling their history.
   if(found.service)return null;
   const tier=found.lifestyleId; // Never infer an old receipt from today's changed settings.
   return ['basic','comfortable','generous'].includes(tier)?proof(`living-${tier}`,found,found.id):null;
  }
  case 'quote-package':{
   if(!r||!current(s,r)||![2,4].includes(r.hz)||!positive(r.amount))return null;
   const found=s.quotePackage?.receipts?.find(x=>same(x,r,['id','day','hz','amount','timestamp']));
   return found?proof(`quote-${found.hz}hz`,found,found.id):null;
  }
  case 'day-close':{
   const outcome=sealedDailyMangaOutcome(s);if(!outcome)return null;
   const trauma=tradingTrauma(s),report=s.dayReport;
   let id=null;
   if(outcome.net>0&&!trauma.active)id='settled-gain';
   if(outcome.net<0)id=isSevereSettledLoss(s,report)?'settled-severe-loss':'settled-small-loss';
   if(outcome.net===0&&Array.isArray(report.trades)&&report.trades.length===0)id='settled-no-trade';
   return id?proof(id,{day:outcome.day,tradingNet:outcome.net},`day-close:${outcome.day}`):null;
  }
  case 'trade':{
   if(!r||!current(s,r)||!finite(r.pnl)||!['close','half','stop','liquidation'].includes(r.type))return null;
   const found=s.history?.findLast(x=>same(x,r,['day','beat','type','positionId','pnl','entry','exit']));
   if(!found)return null;
   const stillHeld=positions(s).some(p=>p.id===r.positionId);
   const id=r.type==='liquidation'&&r.pnl<0?'liquidation':r.type==='stop'&&r.pnl<0?'stop-loss':r.type==='half'&&r.pnl>0&&stillHeld?'half-profit':r.type==='close'&&r.pnl>0&&!stillHeld?'closed-profit':null;
   return id?proof(id,found,`trade:${r.positionId}:${r.day}:${r.beat}:${r.type}:${r.pnl}`):null;
  }
  case 'interest':{
   if(!r||!current(s,r)||r.kind!=='interest'||!positive(r.amount))return null;
   const found=s.consumptionLedger?.find(x=>same(x,r,['id','day','kind','amount','timestamp'])),report=s.dayReport;
   // The cost ledger includes capitalized interest. Only an actual cash debit
   // certified by this day's sealed report can become a payment scene.
   if(!found||!current(s,report)||!positive(report.interestPaid)||report.interest!==found.amount||report.interestPaid>found.amount||!finite(report.interestAccrued)||report.interestAccrued<0||Math.abs(report.interestPaid+report.interestAccrued-found.amount)>1e-6)return null;
   return proof('loan-interest',{...found,amount:report.interestPaid,accruedAmount:report.interestAccrued},found.id);
  }
  case 'walkaway':return s.phase==='ending'&&s.ending?.id==='walkaway'&&positions(s).length===0?proof('walkaway',{day:s.day},`walkaway:${s.runId||s.seed}`):null;
  default:return null;
 }
}
export function selectComicScene(state,event={}, {assets={},sceneText=ACTION_SCENES}={}){
 if(!state||state.mode!=='story')return null;
 const selected=evidence(state,event);if(!selected)return null;
 const text=sceneText[selected.id];if(!text)return null;
 const candidate=assets[selected.id];
 const art=(!text.dialogueId||candidate?.dialogueId===text.dialogueId)&&candidate?.reviewed===true&&(candidate.panels===4||(selected.id==='mochiko-watch'&&candidate.panels===1&&candidate.kind==='existing-game-illustration'&&candidate.independentComic===false))&&candidate.people===text.people&&typeof candidate.path==='string'&&candidate.path&&!candidate.grid?{...candidate}:null;
 // A move is never presented with an empty, unreviewed or unrelated image.
 if(selected.id.startsWith('move-home-')&&!art)return null;
 const receipt={...selected.receipt};
 return {id:selected.id,title:text.title,characters:[...text.characters],people:text.people,lines:text.lines.map(line=>[...line]),...(text.dialoguePanels?{dialogueId:text.dialogueId,dialoguePanels:structuredClone(text.dialoguePanels)}:{}),art,ready:!!art,
  contextualManga:selectEventContextualManga(state,event),receiptKey:`${state.runId||state.seed}:${selected.key}`,receipt,result:{amount:finite(receipt.cost)?receipt.cost:finite(receipt.amount)?receipt.amount:null,outstanding:finite(receipt.outstanding)?receipt.outstanding:null,netAssetsAfter:finite(receipt.netAssetsAfter)?receipt.netAssetsAfter:null,tradingNet:finite(receipt.tradingNet)?receipt.tradingNet:finite(receipt.pnl)?receipt.pnl:null}};
}
// Inventory only; runtime acceptance additionally needs real trigger and browser evidence.
export function reviewedComicInventory(assets={}){
 return Object.entries(ACTION_SCENES).map(([id,scene])=>({id,people:scene.people,ready:!!((!scene.dialogueId||assets[id]?.dialogueId===scene.dialogueId)&&assets[id]?.reviewed===true&&assets[id]?.panels===4&&assets[id]?.people===scene.people&&assets[id]?.path&&!assets[id]?.grid)}));
}
