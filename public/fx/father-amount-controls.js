import {FATHER_DISCOVERY_POLICY} from './father-discovery.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
// The cabinet's balance is independent of the player's trading cash. A partial
// withdrawal consumes this chapter's single opportunity just like a full one.
export function fatherWithdrawalLimit(state){
 const f=state?.family||{};
 return state?.fatherUsed||f.takenConfirmed||f.withdrawal||f.outstanding>0||f.repaid>0?0:FATHER_DISCOVERY_POLICY.amount;
}
export function clampFatherPreset(amount,balance){
 return Number.isFinite(amount)&&Number.isFinite(balance)?Math.max(0,Math.min(amount,balance,FATHER_DISCOVERY_POLICY.amount)):0;
}
export function mountFatherAmountControls(dialog,getState){
 const input=dialog.querySelector('#father-take-amount'),confirm=dialog.querySelector('#father-take-confirm'),buttons=[...dialog.querySelectorAll('[data-father-amount]')];
 function refresh(){
  const max=fatherWithdrawalLimit(getState());input.max=String(max);input.disabled=max<=0;confirm.disabled=max<=0;
  for(const button of buttons){button.disabled=max<=0;button.setAttribute('aria-pressed',String(max>0&&Number(input.value)===clampFatherPreset(Number(button.dataset.fatherAmount),max)));}
 }
 for(const button of buttons)button.onclick=()=>{const max=fatherWithdrawalLimit(getState());if(max<=0)return refresh();input.value=String(clampFatherPreset(Number(button.dataset.fatherAmount),max));refresh();};
 input.addEventListener('input',refresh);refresh();return{refresh};
}
