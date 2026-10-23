import {LIVING_MOVE_SCENE_IDS} from './living-services.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {sealedDailyMangaOutcome} from './manga-context.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {isSevereSettledLoss} from './settled-comic-art.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
// Presentation frequency is run-local. Receipts and manual replay are untouched.
export const COMIC_PROFIT_MULTIPLIER=2;
const FIRST_ONLY=new Set([...Object.values(LIVING_MOVE_SCENE_IDS),'prop-daily-drink-first-use','shrine-walk','noodles-today','takeaway','energy','spa','mochiko-watch','dinner-small','dinner-friends','dinner-feast','dinner-banquet','friend-treat','living-basic','living-comfortable','living-generous','stop-loss','liquidation','settled-severe-loss','quote-2hz','quote-4hz']);
const MANUAL_RESULTS=new Set(['closed-loss','half-loss','closed-flat','half-flat','settled-small-loss','settled-no-trade','loan-interest']);
const PROFIT=new Set(['closed-profit','half-profit','settled-gain']);
const settledTrades=state=>(state.history||[]).filter(row=>['close','half','closing','stop','liquidation'].includes(row.type)&&Number.isFinite(row.pnl));
export const comicTradeKey=row=>JSON.stringify([row.positionId,row.day,row.beat,row.timestamp,row.type,row.margin,row.pnl]);
const emptyProfitRecovery=()=>({receipts:[],batches:0,netFloor:0});
const emptyProfitSuppression=()=>({count:0,netFloor:0});
const validFloor=value=>!!value&&Number.isFinite(value.netFloor)&&value.netFloor>=0;
const validRecovery=value=>value===undefined||validFloor(value)&&Array.isArray(value.receipts)&&value.receipts.length<=1000&&value.receipts.every(key=>typeof key==='string'&&key.length<=1000)&&Number.isInteger(value.batches)&&value.batches>=0&&value.batches<=2;
const validSuppression=value=>value===undefined||validFloor(value)&&[0,2].includes(value.count);
// Called BEFORE the economic snapshot is saved. These are receipt facts, not
// exposure acknowledgements. Every leg in this new capture contributes its net.
export function recordComicProfitBatch(state){
 const value=ensureComicAutoplay(state),rows=settledTrades(state),recovery=value.profitRecovery??=emptyProfitRecovery(),known=new Set(recovery.receipts);
 const fresh=rows.filter(row=>!known.has(comicTradeKey(row))),net=fresh.reduce((sum,row)=>sum+row.pnl,0);
 if(fresh.length&&net>0){recovery.batches=Math.min(2,recovery.batches+1);recovery.netFloor=Math.max(recovery.netFloor,net);}
 recovery.receipts=rows.map(comicTradeKey);
 return recovery;
}
function recoverProfitSuppression(state,value){
 const rows=settledTrades(state),prior=value.profitSuppression??emptyProfitSuppression();
 let count=prior.count,netFloor=Math.max(prior.netFloor,value.lastProfit);
 if(value.profitRecovery){
  const evidence=value.profitRecovery;
  if(evidence.batches>=2||evidence.batches>value.profitCount)count=2;
  netFloor=Math.max(netFloor,evidence.netFloor);
  const tracked=new Set(evidence.receipts),untracked=rows.filter(row=>!tracked.has(comicTradeKey(row)));
  if(untracked.length){
   const groups=new Map();for(const row of untracked){const key=JSON.stringify([row.day,row.beat,row.timestamp??null]);groups.set(key,(groups.get(key)||0)+row.pnl);}
   const positive=[...groups.values()].filter(net=>net>0);
   if(positive.length)count=2;netFloor=Math.max(netFloor,0,...positive);
   evidence.receipts=rows.map(comicTradeKey);
  }
 }else{
  // Old snapshots lack action IDs. Group ALL legs sharing a stored quote-time,
  // never just winning legs. This is a recovery window, NOT a claimed display
  // or exact original action. Retire uncertain free openings conservatively.
  const groups=new Map();
  for(const row of rows){const key=JSON.stringify([row.day,row.beat,row.timestamp??null]);groups.set(key,(groups.get(key)||0)+row.pnl);}
  const positive=[...groups.values()].filter(net=>net>0);
  if(positive.length||value.profitCount>0)count=2;
  netFloor=Math.max(netFloor,0,...positive);
  value.profitRecovery={...emptyProfitRecovery(),receipts:rows.map(comicTradeKey)};
 }
 value.profitSuppression={count,netFloor};
}

export const emptyComicAutoplay=()=>({version:1,shown:[],suppressed:[],profitCount:0,lastProfit:0,lastSettlementDay:0,profitRecovery:emptyProfitRecovery(),profitSuppression:emptyProfitSuppression()});
export function validComicAutoplay(value){return value===undefined||!!value&&value.version===1&&Array.isArray(value.shown)&&value.shown.length<=64&&value.shown.every(id=>typeof id==='string'&&FIRST_ONLY.has(id))&&new Set(value.shown).size===value.shown.length&&(value.suppressed===undefined||Array.isArray(value.suppressed)&&value.suppressed.length<=64&&value.suppressed.every(id=>typeof id==='string'&&FIRST_ONLY.has(id))&&new Set(value.suppressed).size===value.suppressed.length)&&Number.isSafeInteger(value.profitCount)&&value.profitCount>=0&&Number.isFinite(value.lastProfit)&&value.lastProfit>=0&&Number.isSafeInteger(value.lastSettlementDay)&&value.lastSettlementDay>=0&&validRecovery(value.profitRecovery)&&validSuppression(value.profitSuppression);}
export function ensureComicAutoplay(state){
 if(state.comicAutoplay){state.comicAutoplay.suppressed??=[];return state.comicAutoplay;}
 const value=emptyComicAutoplay();
 // Older saves never autoplay their historical receipts. Seed only known past
 // successful purchases; don't manufacture a first-use flag from click intent.
 const items={dailyDrink:'prop-daily-drink-first-use',noodles:'noodles-today',takeaway:'takeaway',energy:'energy',celebration:'spa',mochiko:'mochiko-watch'};
 const activities={'quiet-night':'shrine-walk','noodles-today':'noodles-today','dinner-small':'dinner-small','dinner-friends':'dinner-friends','dinner-feast':'dinner-feast','dinner-banquet':'dinner-banquet'};
 const shown=new Set();
 for(const move of state.livingMoves||[]){const id=LIVING_MOVE_SCENE_IDS[move.toId];if(id)shown.add(id);}
 // The drink always had a debit ledger. A legacy flag alone is not payment evidence.
 for(const [id,scene] of Object.entries(items))if(id!=='dailyDrink'&&state.itemsUsed?.[id]===true)shown.add(scene);
 for(const row of state.consumptionLedger||[])if(row.kind==='item'&&row.amount>0){const prop=row.id?.split(':').at(-1),id=items[prop];
  if(prop==='dailyDrink'&&(!Number.isFinite(row.amount)||!Number.isSafeInteger(row.day)||row.day<1||row.day>state.day||row.id!==`item:${row.day}:dailyDrink`))continue;
  if(id)shown.add(id);
 }
 for(const row of state.recapChoiceLedger||[]){const id=activities[row.id];if(id)shown.add(id);}
 const trades=(state.history||[]).filter(row=>['close','half','closing','stop','liquidation'].includes(row.type)&&Number.isFinite(row.pnl));
 for(const row of trades)if(row.pnl<0&&['stop','liquidation'].includes(row.type))shown.add(row.type==='stop'?'stop-loss':'liquidation');
 // Legacy receipts are suppression evidence, never proof of visible shows.
 delete value.profitRecovery;
 value.suppressed=[...shown];state.comicAutoplay=value;return value;
}
// Recovery suppresses historical successful uses without claiming they were
// visibly played. This closes receipt-save success -> display-ack quota failure
// -> reload. Failed operations and non-durable receipts leave no recovery fact.
export function reconcileComicAutoplay(state){
 const value=ensureComicAutoplay(state),historical={...state,comicAutoplay:undefined};
 const inferred=ensureComicAutoplay(historical).suppressed;
 if(sealedDailyMangaOutcome(state)?.net<0&&isSevereSettledLoss(state,state.dayReport))inferred.push('settled-severe-loss');
 for(const row of state.quotePackage?.receipts||[])if(row.amount>0&&[2,4].includes(row.hz))inferred.push(`quote-${row.hz}hz`);
 for(const id of inferred)if(!value.shown.includes(id)&&!value.suppressed.includes(id))value.suppressed.push(id);
 recoverProfitSuppression(state,value);
 return value;
}
const priority=scene=>scene.id==='liquidation'?100:scene.id==='stop-loss'?90:scene.id.startsWith('father-')?80:scene.id==='settled-severe-loss'?75:scene.id.startsWith('settled-')?60:PROFIT.has(scene.id)?10:50;
export function chooseAutomaticComic(state,scenes,{multiplier=COMIC_PROFIT_MULTIPLIER}={}){
 const policy=ensureComicAutoplay(state),factor=Number.isFinite(multiplier)&&multiplier>1?multiplier:COMIC_PROFIT_MULTIPLIER;
 return scenes.filter(scene=>{
  if(MANUAL_RESULTS.has(scene.id)||scene.manualOnly||scene.settlementDay>0&&scene.settlementDay===policy.lastSettlementDay)return false;
  if(FIRST_ONLY.has(scene.id)&&(policy.shown.includes(scene.id)||policy.suppressed.includes(scene.id)))return false;
  // New result IDs must explicitly opt into the profit or first-critical policy.
  if((['close','half','closing','stop','liquidation'].includes(scene.receipt?.type)||/^(closed-|half-|settled-)/.test(scene.id))&&!PROFIT.has(scene.id)&&!FIRST_ONLY.has(scene.id))return false;
  if(PROFIT.has(scene.id)){
   const net=scene.batchTradingNet;
   // Never use an individual winning leg of an overall losing close batch.
   if(!Number.isFinite(net)||net<=0)return false;
   return Math.max(policy.profitCount,policy.profitSuppression?.count||0)<2||net>=Math.max(1,policy.lastProfit,policy.profitSuppression?.netFloor||0)*factor;
  }
  return true;
 }).sort((a,b)=>priority(b)-priority(a))[0]||null;
}
// Called only after showModal succeeds, never while saving or queuing a scene.
export function markAutomaticComicShown(state,scene){
 const value=ensureComicAutoplay(state);
 if(scene.settlementDay>0)value.lastSettlementDay=scene.settlementDay;
 if(FIRST_ONLY.has(scene.id)&&!value.shown.includes(scene.id))value.shown.push(scene.id);
 if(PROFIT.has(scene.id)){value.profitCount++;value.lastProfit=scene.batchTradingNet;}
 return value;
}
