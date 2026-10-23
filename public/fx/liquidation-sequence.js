// Presentation-only receipts. The engine has already closed and booked every trade.
export function createLiquidationSequence({schedule=setTimeout,cancel=clearTimeout,onChange=()=>{},onSettle=()=>{},onEmotion=()=>{}}={}){
 let receipt=null,timers=[],context=null,seen=new Set();
 const clear=()=>{timers.forEach(cancel);timers=[];};
 const publish=()=>onChange(receipt?{...receipt,trades:[...receipt.trades]}:null);
 function dismiss(){clear();receipt=null;publish();}
 function sync(next){if(context!==next){dismiss();seen.clear();context=next;}}
 return {sync,dismiss,get active(){return !!receipt;},push(trades,next,{reduced=false}={}){
  sync(next);const fresh=(trades||[]).filter(t=>t?.type==='liquidation'&&Number.isFinite(t.pnl)).filter(t=>{const key=JSON.stringify([t.positionId??t.id,t.day,t.beat,t.timestamp,t.margin,t.pnl]);if(seen.has(key))return false;seen.add(key);if(seen.size>1000)seen.delete(seen.values().next().value);return true;});
  if(!fresh.length)return false;
  clear();const all=[...(receipt?.trades||[]),...fresh];receipt={context,trades:all,count:all.length,pnl:all.reduce((n,t)=>n+t.pnl,0),stage:reduced?'settled':'trigger'};publish();
  const settle=()=>{if(!receipt)return;receipt.stage='settled';publish();onSettle({...receipt});};
  const emotion=()=>{if(!receipt)return;receipt.stage='after';publish();onEmotion([...receipt.trades]);};
  if(reduced){onSettle({...receipt});}else timers.push(schedule(settle,520));
  timers.push(schedule(emotion,reduced?0:1450));
  return true;
 }};
}

export function mountLiquidationSequence({host,getContext,isBlocked=()=>false,reduced=()=>false,onSettle=()=>{},onEmotion=()=>{},format=n=>String(n),doc=host.ownerDocument}){
 const win=doc.defaultView,box=doc.createElement('section'),heading=doc.createElement('strong'),copy=doc.createElement('p'),amount=doc.createElement('b'),after=doc.createElement('p'),close=doc.createElement('button');
 box.className='liquidation-receipt';box.hidden=true;box.setAttribute('aria-label','强制平仓回执');box.setAttribute('data-floating-risk-avoid','');
 heading.className='liquidation-receipt-title';copy.className='liquidation-receipt-copy';amount.className='liquidation-receipt-amount';after.className='liquidation-receipt-after';
 close.type='button';close.className='liquidation-receipt-close';close.textContent='×';close.setAttribute('aria-label','收起强平回执');
 const status=doc.createElement('span');status.className='liquidation-receipt-status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');
 box.append(heading,close,copy,amount,after,status);host.append(box);
 const sequence=createLiquidationSequence({schedule:(fn,ms)=>win.setTimeout(()=>{refresh();if(!isBlocked())fn();},ms),cancel:id=>win.clearTimeout(id),onSettle,onEmotion,onChange:r=>{
  box.hidden=!r;if(!r)return;box.dataset.stage=r.stage;box.classList.toggle('is-reduced',reduced());
  heading.textContent=r.stage==='trigger'?'触及强平线':'强制平仓已完成';
  copy.textContent=`${r.count} 笔仓位已由系统平仓`;
  amount.textContent=`已实现盈亏 ${format(r.pnl)}`;
  after.textContent=r.stage==='after'?'先看清这几笔，再决定下一步。':'成交已记入明细';
  status.textContent=r.stage==='trigger'||reduced()?`${copy.textContent}，${amount.textContent}`:'';
 }});
 function refresh(){sequence.sync(getContext());box.classList.toggle('is-reduced',reduced());if(isBlocked())sequence.dismiss();}
 close.addEventListener('click',()=>sequence.dismiss());
 doc.addEventListener('keydown',e=>{if(e.key==='Escape')sequence.dismiss();});
 win.addEventListener('pagehide',()=>sequence.dismiss());win.addEventListener('popstate',()=>sequence.dismiss());
 doc.addEventListener('visibilitychange',()=>{if(doc.hidden)sequence.dismiss();});
 return {refresh,dismiss:sequence.dismiss,get active(){return sequence.active;},push(trades){refresh();if(isBlocked())return false;return sequence.push(trades,getContext(),{reduced:reduced()});}};
}
