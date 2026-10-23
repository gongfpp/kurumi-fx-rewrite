import {LotteryPresentation} from './lottery-presentation.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
// Candidate renderer only: no CSS or app mount is selected before visual review.
// The host supplies its existing container and its durable settlement receipt.
export function mountLotteryView(root,{ticket,saved=false,now,schedule=callback=>requestAnimationFrame(callback),cancel=id=>cancelAnimationFrame(id),onClose=()=>{},reducedMotion=false}={}){
 const doc=root.ownerDocument,number=doc.createElement('div'),prize=doc.createElement('p'),skip=doc.createElement('button'),close=doc.createElement('button');
 number.setAttribute('aria-hidden','true');prize.setAttribute('role','status');prize.setAttribute('aria-live','polite');skip.type=close.type='button';skip.textContent='跳过动画';close.textContent='关闭';
 let handle=null,disposed=false;
 const controller=new LotteryPresentation({now,onFrame:frame=>{
  if(disposed)return;number.textContent=frame.digits.map(d=>d.value).join(' ');
  if(frame.status==='revealed'){prize.textContent=frame.receipt.prize>0?`票号 ${frame.receipt.number} · 奖金 ¥${frame.receipt.prize.toLocaleString('zh-CN')}`:`票号 ${frame.receipt.number} · 本次未中奖`;skip.hidden=true;}
 }});
 // Validate before replacing any host content.
 controller.open(ticket,{saved,reducedMotion});
 root.replaceChildren(number,prize,skip,close);
 const tick=()=>{handle=null;if(disposed)return;if(controller.frame().status==='running')handle=schedule(tick);};
 const stop=()=>{if(handle!==null)cancel(handle);handle=null;};
 const dispose=()=>{if(disposed)return;stop();controller.close();disposed=true;skip.removeEventListener('click',onSkip);close.removeEventListener('click',onDismiss);};
 const onSkip=()=>{stop();controller.skip();};
 const onDismiss=()=>{if(disposed)return;dispose();root.replaceChildren();onClose();};
 skip.addEventListener('click',onSkip);close.addEventListener('click',onDismiss);if(controller.status==='running')handle=schedule(tick);
 return {controller,skip:onSkip,close:onDismiss,dispose};
}

// Mount into the existing daily supply area; styles remain owned by the host.
// The host executes and saves game actions, then remounts with its saved state.
export function mountLotteryCard(root,{state={},onPurchase=()=>{},onCode=()=>{},onOpen=()=>{},onError=()=>{}}={}){
 const doc=root.ownerDocument,card=doc.createElement('article'),title=doc.createElement('h3'),description=doc.createElement('p'),status=doc.createElement('p'),purchase=doc.createElement('button'),code=doc.createElement('input'),redeem=doc.createElement('button'),open=doc.createElement('button');
 card.className='lottery-card';title.textContent='每日彩票';description.textContent='本作原创玩法 · 每张 ¥300，每天限购一张，次个游戏日 18:00 开奖。提前收盘时随日结揭晓。';status.setAttribute('role','status');
 const tickets=state.lottery?.tickets||[],today=tickets.find(t=>t.kind==='normal'&&t.purchaseDay===state.day),latest=tickets.at(-1),pending=tickets.find(t=>t.status==='pending');
 purchase.type=redeem.type=open.type='button';purchase.textContent=today?'今日已购票':'购买一张 · ¥300';purchase.disabled=!!today||state.mode!=='story'||state.phase==='ending';
 status.textContent=pending?`票号 ${pending.number??pending.id} · 等待开奖`:latest?.status==='settled'?`票号 ${latest.number??latest.id} · 已开奖`:'今天还没有待开奖的彩票。';
 code.type='text';code.autocomplete='off';code.setAttribute('aria-label','彩票暗号');code.placeholder='输入暗号';code.maxLength=80;redeem.textContent='兑换暗号';code.disabled=redeem.disabled=state.lottery?.cheatRedeemed===true;open.textContent='查看开奖结果';open.hidden=latest?.status!=='settled';
 let disposed=false,busy=false;
 const run=async(action)=>{if(busy||disposed)return;busy=true;purchase.disabled=redeem.disabled=true;try{await action();}catch(error){onError(error);}finally{busy=false;if(!disposed){purchase.disabled=!!today||state.mode!=='story'||state.phase==='ending';redeem.disabled=state.lottery?.cheatRedeemed===true;}}};
 const buy=()=>run(onPurchase),exchange=()=>run(()=>onCode(code.value)),reveal=()=>{if(!disposed)onOpen(latest);};
 purchase.addEventListener('click',buy);redeem.addEventListener('click',exchange);open.addEventListener('click',reveal);card.append(title,description,status,purchase,code,redeem,open);root.replaceChildren(card);
 return {dispose(){disposed=true;purchase.removeEventListener('click',buy);redeem.removeEventListener('click',exchange);open.removeEventListener('click',reveal);},purchase:buy,redeem:exchange,open:reveal};
}
