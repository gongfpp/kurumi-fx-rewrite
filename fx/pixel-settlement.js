/* Approved settlement skin: presentation only. The original recap owns every
   amount, chart, timer, audio cue, button handler and modal lifecycle. */
const money=value=>(value<0?'−':'')+'¥'+Math.abs(value).toLocaleString('zh-CN',{maximumFractionDigits:2});
const node=(doc,tag,className,text)=>{const element=doc.createElement(tag);element.className=className;if(text!==undefined)element.textContent=text;return element;};

// Only a current, actual receipt may supply the compact paid row. In particular,
// pending quotes and legacy status without a receipt are never shown as paid.
export function pixelSettlementReceipt(snapshot,receipt){
 if(!snapshot||!receipt||receipt.day!==snapshot.day||!['finalized','legacy-paid'].includes(snapshot.daily?.livingStatus)||!Number.isFinite(receipt.amount)||receipt.amount<0||!Number.isFinite(snapshot.account?.nominalAssets))return null;
 return {cost:receipt.amount===0?'¥0':'−'+money(receipt.amount),balance:money(snapshot.account.nominalAssets)};
}

export function mountPixelSettlement({root=document}={}){
 const dialog=root.getElementById('day-dialog');
 if(!dialog)return {update(){},dispose(){}};
 const doc=dialog.ownerDocument,owned=[],restorations=[];
 let disposed=false,header=null,dayLabel=null,paid=null,cost=null,balance=null,actions=null,replay=null;
 const remember=(element,parent,before)=>{const anchor=doc.createComment('pixel-settlement-position');parent.insertBefore(anchor,before||null);restorations.push({element,anchor});return anchor;};
 const restore=record=>{if(record.anchor.parentNode){record.anchor.parentNode.insertBefore(record.element,record.anchor);record.anchor.remove();}};
 const ensure=()=>{
  const scroller=dialog.querySelector('.dialog-scroll'),next=dialog.querySelector('#recap-next');
  if(!scroller||!next)return false;
  if(!header){
   header=node(doc,'div','pixel-settlement-heading');header.setAttribute('aria-hidden','true');
   header.append(node(doc,'span','pixel-settlement-title','今日结算'));dayLabel=node(doc,'span','pixel-settlement-day');header.append(dayLabel);scroller.insertBefore(header,scroller.firstChild);owned.push(header);
   paid=node(doc,'div','pixel-settlement-paid');paid.hidden=true;
   const fee=node(doc,'div','pixel-settlement-fee'),remaining=node(doc,'div','pixel-settlement-balance');cost=node(doc,'strong','pixel-settlement-cost');balance=node(doc,'strong','pixel-settlement-balance-value');
   fee.append(node(doc,'span','pixel-settlement-fee-label','生活费'),cost);remaining.append(node(doc,'span','pixel-settlement-balance-label','结余'),balance);paid.append(fee,remaining);scroller.insertBefore(paid,next);owned.push(paid);
   actions=node(doc,'div','pixel-settlement-actions');scroller.insertBefore(actions,next);owned.push(actions);remember(next,next.parentNode,next);actions.append(next);
  }
  const current=dialog.querySelector('#daily-recap .recap-replay');
  if(current&&current!==replay){
   // renderDayRecap replaces its own content. Return a previous button only to
   // its own detached origin, then reuse the new live button without cloning it.
   if(replay){const index=restorations.findIndex(r=>r.element===replay);if(index>=0){restore(restorations[index]);restorations.splice(index,1);}}
   replay=current;remember(replay,replay.parentNode,replay);actions.insertBefore(replay,actions.firstChild);
  }
  return true;
 };
 const update=(input={},options={})=>{
  if(disposed||root.body?.dataset.frontend!=='pixel')return;
  const snapshot=input.snapshot||input,livingReceipt=input.livingReceipt||options.livingReceipt;
  if(!ensure())return;
  dayLabel.textContent=Number.isInteger(snapshot.day)&&snapshot.day>0?`第${snapshot.day}天`:'';
  const receipt=pixelSettlementReceipt(snapshot,livingReceipt);paid.hidden=!receipt;
  cost.textContent=receipt?.cost||'';balance.textContent=receipt?.balance||'';
 };
 return {update,dispose(){if(disposed)return;disposed=true;for(const record of [...restorations].reverse())restore(record);for(const element of owned)element.remove();}};
}
