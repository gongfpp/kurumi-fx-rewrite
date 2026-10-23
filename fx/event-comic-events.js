import {recordComicProfitBatch,comicTradeKey} from './comic-autoplay.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
// Presentation candidates come only from records the engine has already written.
// No balance differences, click intent, market predictions or historical replay.
export function recordedComicEvents(state) {
 const events=[],today=receipt=>receipt?.day===state.day;
 for(const receipt of state.livingMoves||[])events.push({type:'housing-move',receipt});
 for(const receipt of state.recapChoiceLedger||[])if(today(receipt))events.push({type:'activity',receipt});
 for(const receipt of state.consumptionLedger||[]){
  if(!today(receipt))continue;
  if(receipt.kind==='item'){
   const prefix=`item:${state.day}:`;
   if(receipt.id?.startsWith(prefix)){const id=receipt.id.slice(prefix.length);events.push({type:'item',id,result:{id,cost:receipt.amount}});}
  }else if(receipt.kind==='interest')events.push({type:'interest',receipt});
 }
 if(state.family?.withdrawal)events.push({type:'father-borrow',result:{id:'father',amount:state.family.withdrawal.amount}});
 if(state.family?.lastRepayment)events.push({type:'father-repayment',receipt:state.family.lastRepayment});
 if(state.fatherDiscovery?.eventId)events.push({type:'father-discovery',eventId:state.fatherDiscovery.eventId});
 events.push({type:'father-found'});
 for(const [type,field] of [['loan-borrow','lastBorrow'],['loan-repayment','lastRepayment']])if(state.loan?.[field])events.push({type,result:state.loan[field]});
 const living=state.dayReport?.livingSettlement?.receipt;if(living)events.push({type:'living',receipt:living,manualOnly:living.kind==='ordinary'});
 for(const receipt of state.quotePackage?.receipts||[])if(today(receipt))events.push({type:'quote-package',receipt,manualOnly:state.quotePackage.renewal?.status==='renewed'&&state.quotePackage.renewal.day===receipt.day&&state.quotePackage.renewal.hz===receipt.hz});
 for(const receipt of state.history||[])if(today(receipt)&&receipt.type!=='open')events.push({type:'trade',receipt});
 events.push({type:'day-close'},{type:'walkaway'});
 return events;
}

export function recordedComicScenes(state,select){return recordedComicEvents(state).map(event=>{const scene=select(state,event);return scene?{...scene,manualOnly:event.manualOnly===true}:null;}).filter(Boolean);}

// Only the context owner may certify the save. A returned ticket contains frozen
// presentation data selected BEFORE an asynchronous save, never future state.
export function createComicReceiptGate({initialState,context,select,onScenes=()=>{},onReset=()=>{},onCommit=()=>{}}) {
 let currentContext=context,revision=0,captureOrder=0,committedOrder=0,seen=new Set(),seenTrades=new Set();
 const trades=state=>(state.history||[]).filter(row=>['close','half','closing','stop','liquidation'].includes(row.type)&&Number.isFinite(row.pnl));
 const tradeKey=comicTradeKey;
 const scenes=state=>recordedComicScenes(state,select);
 function rebase(state,nextContext){currentContext=nextContext;revision++;seen=new Set(scenes(state).map(scene=>scene.receiptKey));seenTrades=new Set(trades(state).map(tradeKey));onReset();}
 rebase(initialState,context);
 return {
  capture(state,nextContext){
   if(nextContext!==currentContext)rebase(state,nextContext);
   recordComicProfitBatch(state);
   const replayScenes=scenes(state),selected=replayScenes.filter(scene=>!seen.has(scene.receiptKey));
   return {context:currentContext,revision,captureOrder:++captureOrder,continuity:structuredClone({family:state.family,loan:state.loan}),replayScenes:structuredClone(replayScenes),observedDay:state.day,settlementDay:state.dayReport?.day===state.day&&['closing','day_end','resting','ending'].includes(state.phase)?state.day:0,trades:structuredClone(trades(state).filter(row=>!seenTrades.has(tradeKey(row)))),scenes:structuredClone(selected)};
  },
  commit(ticket,{saved,context:nextContext,blocked=false}={}){
   if(!saved||blocked||ticket.context!==nextContext||ticket.context!==currentContext||ticket.revision!==revision)return [];
   if(ticket.captureOrder>committedOrder){committedOrder=ticket.captureOrder;onCommit(ticket.continuity,ticket.replayScenes);}
   const incoming=ticket.scenes.filter(scene=>!seen.has(scene.receiptKey));
   for(const scene of incoming)seen.add(scene.receiptKey);
   const settled=(ticket.trades||[]).filter(row=>!seenTrades.has(tradeKey(row)));
   for(const row of settled)seenTrades.add(tradeKey(row));
   const batchTradingNet=settled.reduce((sum,row)=>sum+row.pnl,0);
   if(incoming.length)onScenes(incoming.map(scene=>({...scene,batchTradingNet,observedDay:ticket.observedDay,settlementDay:ticket.settlementDay||0})));
   return incoming;
  },
  rebase,
  invalidate(){revision++;onReset();},
 };
}
