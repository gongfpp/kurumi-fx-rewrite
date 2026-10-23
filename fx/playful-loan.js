import {restoreFocus} from './focus-safety.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
// A local game animation, deliberately independent of media devices or identity services.
export const LOAN_POSES = Object.freeze([
 {id:'blink',label:'眨眨眼',line:'眼睛还睁得开，问题不大！'},
 {id:'mouth',label:'张张嘴',line:'啊——这利息可真敢开口。'},
 {id:'left',label:'向左晃头',line:'左边看看……'},
 {id:'right',label:'向右晃头',line:'右边看看……好，还是我。'},
]);
export function createPlayfulLoan({commit}) {
 let session=null,sequence=0;
 return {
  begin(amount,context,terms){
   if(session)return null;
   if(!Number.isFinite(amount)||!Number.isSafeInteger(Math.round(amount*100))||Math.abs(amount*100-Math.round(amount*100))>=1e-6||amount<terms.minBorrow||amount>terms.availableCredit)throw Error('借款至少 ¥100，不能超过当前可借额度，最多保留两位小数');
   session={id:++sequence,amount,context,rate:terms.dailyRate,limit:terms.limit,step:0};return {...session};
  },
  pose(id,step){if(!session||session.id!==id||session.step!==step||step>=LOAN_POSES.length)return false;session.step++;return true;},
  confirm(id,context,terms){
   if(!session||session.id!==id||session.step!==LOAN_POSES.length)return false;
   const current=session;session=null; // Consume before any callback, including a throwing/reentrant callback.
   if(context!==current.context||terms.dailyRate!==current.rate||terms.limit!==current.limit||current.amount>terms.availableCredit)throw Error('额度或利率有变化，请重新选择借款金额。');
   commit(current.amount);return true;
  },
  cancel(){session=null;},
  get active(){return session!==null;},
 };
}

export function mountPlayfulLoan({dialog,controls,getContext,getTerms,commit,onError,format=String,schedule=setTimeout,unschedule=clearTimeout}) {
 const doc=dialog.ownerDocument,host=doc.createElement('section');host.className='playful-loan';host.hidden=true;
 host.innerHTML=`<h3>久留美的刷脸小剧场</h3><p class="small-print">只让游戏头像做动作，不使用摄像头，也不采集人脸。</p><svg class="loan-avatar" viewBox="0 0 180 180" role="img" aria-label="久留美的趣味头像"><g class="loan-head"><path fill="#6c4739" d="M30 96V71C30 1 150 1 150 71v64l-27-18H52l-22 18z"/><ellipse fill="#ffe3d0" cx="90" cy="89" rx="49" ry="54"/><path fill="#6c4739" d="M39 77Q34 18 91 26q49 0 51 49l-32-35 1 26-24-23-26 31 3-30z"/><g class="loan-eyes" fill="#623830"><ellipse cx="70" cy="88" rx="5" ry="9"/><ellipse cx="111" cy="88" rx="5" ry="9"/></g><path class="loan-smile" fill="none" stroke="#a05252" stroke-width="3" stroke-linecap="round" d="M81 112q9 9 18 0"/><ellipse class="loan-mouth" fill="#a05252" cx="90" cy="116" rx="8" ry="12"/><path stroke="#e9a9a5" stroke-width="5" stroke-linecap="round" d="M53 105h9m57 0h9"/></g></svg><p class="loan-pose-status" role="status" aria-live="polite" aria-atomic="true"></p><p class="loan-offer"></p><button type="button" class="loan-pose primary"></button><button type="button" class="loan-confirm primary" hidden>确认借入</button><button type="button" class="loan-cancel secondary">算了，不借了</button>`;
 dialog.append(host);
 const flow=createPlayfulLoan({commit}),avatar=host.querySelector('.loan-avatar'),status=host.querySelector('.loan-pose-status'),offer=host.querySelector('.loan-offer'),pose=host.querySelector('.loan-pose'),confirm=host.querySelector('.loan-confirm'),cancel=host.querySelector('.loan-cancel');
 let ticket=null,timer=null,busy=false,opener=null;
 function stop(){if(timer!==null)unschedule(timer);timer=null;busy=false;ticket=null;flow.cancel();host.hidden=true;controls.hidden=false;avatar.removeAttribute('data-pose');}
 function dismiss(){stop();if(dialog.open)restoreFocus({node:opener},doc);}
 function renderStep(){const step=ticket.step;pose.hidden=step===LOAN_POSES.length;confirm.hidden=step!==LOAN_POSES.length;pose.disabled=false;if(step<LOAN_POSES.length){pose.textContent=LOAN_POSES[step].label;status.textContent=`${step+1} / ${LOAN_POSES.length} · ${LOAN_POSES[step].label}`;}else{status.textContent='动作完成！要借这笔钱吗？';confirm.focus();}}
 pose.onclick=()=>{
  if(busy||!ticket||!dialog.open)return;
  const id=ticket.id,step=ticket.step;if(!flow.pose(id,step))return;
  busy=true;pose.disabled=true;avatar.dataset.pose=LOAN_POSES[step].id;status.textContent=LOAN_POSES[step].line;
  timer=schedule(()=>{timer=null;if(!ticket||ticket.id!==id||!dialog.open)return;busy=false;ticket.step++;avatar.removeAttribute('data-pose');renderStep();},650);
 };
 confirm.onclick=()=>{
  if(busy||!ticket||!dialog.open)return;
  const id=ticket.id;busy=true;confirm.disabled=true;
  try{flow.confirm(id,getContext(),getTerms());}catch(error){onError(error);}finally{dismiss();confirm.disabled=false;}
 };
 cancel.onclick=dismiss;
 dialog.addEventListener('cancel',stop);dialog.addEventListener('close',stop);
 return {begin(amount){
  if(flow.active||!dialog.open)return false;
  try{ticket=flow.begin(amount,getContext(),getTerms());}catch(error){onError(error);return false;}
  if(!ticket)return false;
  opener=doc.activeElement;controls.hidden=true;host.hidden=false;
  offer.textContent=`借入 ${format(amount)} · 日利率 ${(ticket.rate*100).toFixed(3).replace(/0+$/,'').replace(/\.$/,'')}%`;
  renderStep();pose.focus();return true;
 },cancel:dismiss,get active(){return flow.active;}};
}
