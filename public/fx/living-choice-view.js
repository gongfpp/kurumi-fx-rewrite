import {LIFESTYLES} from './consumption-ledger.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {renderLivingCopy} from './copy/living-choices.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
const yen=value=>'¥'+value.toLocaleString('zh-CN',{maximumFractionDigits:2});
export const fillLivingCopy=renderLivingCopy;
const planValues=(plan,option,extra={})=>({label:option?.label||plan.label,dailyBasics:yen(plan.dailyBasics),dailyRent:yen(plan.dailyRent),dailyTotal:yen(plan.dailyCost),moveInCost:yen(plan.moveInCost||0),sleepRecovery:plan.sleepRecovery,extraStressRelief:plan.extraStressRelief,extraRestRecovery:plan.extraRestRecovery,restRecoveryCap:32,...extra});
// The caller supplies reviewed, authored copy. This view never chooses housing,
// charges, schedules recovery, changes receipts or reconstructs old bills.
export function mountLivingChoiceDetails(doc,statement,copy,{onLifestyle=()=>{}}={}){
 const options=new Map(copy.options.map(option=>[option.id,option])),shared=copy.shared,compact=copy.compactDisplay;
 const shortOptions=new Map((compact?.options||copy.options).map(option=>[option.id,option]));
 const make=(tag,className,text)=>{const el=doc.createElement(tag);if(className)el.className=className;if(text!==undefined)el.textContent=text;return el;};
 const adjustment=make('details','living-adjustment');adjustment.open=false;adjustment.append(make('summary',null,shared.adjustTitle));
 const current=statement.currentHousing||statement.lifestyle,currentCopy=options.get(current.id);
 adjustment.append(make('p','living-current-arrangement',fillLivingCopy(currentCopy.currentStatusTemplate,planValues(current,currentCopy))));
 const choices=make('div','living-plan-choices');
 for(const plan of LIFESTYLES){
  const option=options.get(plan.id),short=shortOptions.get(plan.id);
  const alreadySelected=plan.id===current.id||plan.id===statement.lifestyle.id||plan.id===statement.scheduledHousing?.toId;
  const moveInCost=alreadySelected?0:plan.moveInCost;
  const values=planValues(plan,option,{moveInCost:yen(moveInCost)}),button=make('button','secondary');button.type='button';button.value=plan.id;
  button.append(make('span','living-plan-label',fillLivingCopy(short.buttonTemplate,values)),make('small','living-plan-effect',fillLivingCopy(short.subtitleTemplate||option.recoveryDescription,values)));
  const pending=statement.scheduledHousing;
  if(pending?.toId===plan.id)button.append(make('small','living-pending-arrangement',fillLivingCopy(short.scheduledNextDayTemplate,planValues(plan,option,{effectiveDay:pending.effectiveDay}))));
  const insufficient=Number.isFinite(statement.availableLivingCash)&&statement.availableLivingCash+1e-6<moveInCost;
  button.disabled=plan.id===statement.lifestyle.id||insufficient;
  if(insufficient)button.title=fillLivingCopy(option.insufficientBalanceText,values);
  // These receipt cards only preview a target. The owning app opens the same
  // housing summary as the life menu; its separate confirm owns any payment.
  button.append(make('small','living-plan-action','查看费用与预约'));
  button.setAttribute?.('aria-label',`${option.label}，查看费用与预约`);
  button.onclick=event=>{event?.stopPropagation();onLifestyle(plan,{opener:button});};choices.append(button);
 }
 adjustment.append(choices);
 if(compact?.shared.termsCompact)adjustment.append(make('small','living-choice-terms',compact.shared.termsCompact));
 const details=compact?.shared.detailTitle?make('details','living-choice-details'):make('div','living-choice-details');
 if(compact?.shared.detailTitle){details.open=false;details.append(make('summary',null,compact.shared.detailTitle));}
 const service=statement.livingService;
 if(service){
  const plan=LIFESTYLES.find(plan=>plan.id===service.lifestyleId),option=options.get(service.lifestyleId),values=planValues(plan,option,{basicPaid:yen(service.basicPaid),rentPaid:yen(service.rentPaid)});
  const detail=make('div','living-paid-components');
  const paidCopy=service.version===1?Object.fromEntries(Object.entries(shared).map(([key,value])=>[key,typeof value==='string'?value.replaceAll('餐食','日常'):value])):shared;
  if(service.rentDue>0&&service.fullyPaid)detail.append(make('p','living-paid-service',fillLivingCopy(paidCopy.servicePaidTemplate,values)));
  else{detail.append(make('p',null,fillLivingCopy(paidCopy.basicsPaidTemplate,values)));if(service.rentDue>0){detail.append(make('p',null,fillLivingCopy(shared.rentPaidTemplate,values)));detail.append(make('p','living-paid-service',shared.servicePartialTemplate));}}
  details.append(detail);
 }
 const recovery=statement.livingRecovery;
 if(recovery&&recovery.day===statement.day&&(recovery.stressRelief>0||recovery.restRecovery>0)){
  const plan=LIFESTYLES.find(plan=>plan.id===recovery.lifestyleId),option=options.get(recovery.lifestyleId);
  details.append(make('p','living-received-recovery',fillLivingCopy(shared.receivedRecoveryTemplate,planValues(plan,option,{actualStressRelief:recovery.stressRelief,actualRestRecovery:recovery.restRecovery}))));
 }
 const selected=options.get(statement.lifestyle.id);
 details.append(make('p','living-recovery-cap',fillLivingCopy(selected.capDescription,planValues(statement.lifestyle,selected))));
 if(shared.discountDescription)details.append(make('p',null,fillLivingCopy(shared.discountDescription,planValues(statement.lifestyle,selected))));
 details.append(make('p','living-full-terms',shared.terms));adjustment.append(details);
 return adjustment;
}
