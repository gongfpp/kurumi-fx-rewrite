// Housing presentation only. All quotes, eligibility and payments belong to the app.
const yen=value=>`¥${value.toLocaleString('zh-CN',{maximumFractionDigits:2})}`;
export function mountLifeHousingPicker({document:doc=globalThis.document,dialog,getModel,onChoose}={}){
 if(!dialog||typeof getModel!=='function'||typeof onChoose!=='function')throw new TypeError('Housing picker requires a dialog, model and action');
 const make=(tag,className,text)=>{const node=doc.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=text;return node;};
 const host=dialog.querySelector('#life-housing-choices'),toolbar=dialog.querySelector('.dialog-toolbar')||dialog;
 const title=dialog.querySelector('h2'),returnButton=[...dialog.querySelectorAll('[data-close]')].find(node=>!node.classList.contains('x-close'));
 if(title)toolbar.prepend(title);
 if(returnButton){returnButton.textContent='‹ 返回生活';returnButton.classList.add('life-housing-return');toolbar.prepend(returnButton);}
 dialog.classList.add('life-housing-picker');
 const dock=make('footer','life-housing-action-dock'),summary=make('div','life-housing-selection'),submit=make('button','primary life-housing-confirm');submit.type='button';
 const feedback=make('p','life-housing-feedback');feedback.setAttribute('role','status');feedback.setAttribute('aria-live','polite');feedback.hidden=true;
 summary.setAttribute('aria-live','polite');summary.setAttribute('aria-atomic','true');dock.append(summary,feedback,submit);dialog.append(dock);
 let selectedId=null,contextToken=null,busy=false,session=0,returnToParent=null,message='';
 const model=()=>getModel()||{};
 const setMessage=text=>{message=text||'';feedback.textContent=message;feedback.hidden=!message;};
 const stale=m=>contextToken!==m.contextToken;
 function render(){
  if(!dialog.open)return;
  const m=model(),options=m.options||[],scroll=host.parentElement?.scrollTop||0,active=doc.activeElement,focusId=active?.dataset?.housingSelect;
  host.replaceChildren();host.append(make('p','life-housing-current',m.currentLabel||''));
  if(m.pendingLabel)host.append(make('p','life-housing-pending',m.pendingLabel));
  const choices=make('div','life-housing-choices');choices.setAttribute('role','group');choices.setAttribute('aria-label','选择住处');
  for(const option of options){
   const card=make('button','life-housing-option');card.type='button';card.dataset.housingSelect=option.id;card.setAttribute('aria-pressed',String(option.id===selectedId));
   card.disabled=busy||stale(m)||option.enabled===false;
   card.append(make('strong','',option.label),make('span','life-housing-rate',`${yen(option.dailyCost)}/日`),make('span','',`搬入费 ${yen(option.moveInCost)} · 睡眠恢复${option.sleepRecovery}体力`));
   if(option.reason)card.append(make('small','life-housing-option-status',option.reason));
   card.onclick=event=>{event?.stopPropagation();if(card.disabled||busy)return;selectedId=option.id;setMessage('');render();};choices.append(card);
  }
  host.append(choices);
  const selected=options.find(option=>option.id===selectedId);summary.replaceChildren();
  if(selected){
   summary.append(make('strong','',`已选：${selected.label}`),make('p','',selected.summary||`搬入费 ${yen(selected.moveInCost)} · ${yen(selected.dailyCost)}/日`));
   submit.textContent=selected.actionLabel||`支付 ${yen(selected.moveInCost)} 搬入费并预约`;
  }else{summary.append(make('p','','选择住处后，在此确认费用与生效时间。'));submit.textContent='确认住处';}
  submit.disabled=busy||stale(m)||!selected||selected.enabled===false||!selected.changed;
  dialog.setAttribute('aria-busy',String(busy));
  if(stale(m))setMessage('住处安排已变化，请返回生活菜单后重新选择。');
  else if(message)setMessage(message);
  if(host.parentElement)host.parentElement.scrollTop=scroll;
  if(focusId)[...choices.querySelectorAll('button')].find(node=>node.dataset.housingSelect===focusId&&!node.disabled)?.focus({preventScroll:true});
 }
 submit.addEventListener('click',async event=>{
  event.stopPropagation();if(busy||submit.disabled||event.detail>1)return;
  const m=model(),selected=(m.options||[]).find(option=>option.id===selectedId);
  if(stale(m)||!selected?.changed||selected.enabled===false){render();return;}
  const requestSession=session;busy=true;setMessage('');render();
  try{
   const result=await onChoose({id:selected.id,contextToken});
   if(requestSession!==session)return;
   if(result?.ok!==true)setMessage(result?.reason||'住处尚未调整，请稍后再试。');
   else setMessage(result?.message||'住处安排已更新。');
  }catch(error){if(requestSession===session)setMessage(error.message||'住处尚未调整，请稍后再试。');}
  finally{busy=false;render();}
 });
 dialog.addEventListener('close',()=>{session++;const resume=returnToParent;returnToParent=null;queueMicrotask(()=>resume?.());});
 return {element:dialog,render,open({onReturn,selectedId:requestedId,returnLabel='返回生活'}={}){if(dialog.open)return false;const m=model();contextToken=m.contextToken;selectedId=(m.options||[]).some(option=>option.id===requestedId)?requestedId:m.selectedId??null;returnToParent=onReturn;if(returnButton)returnButton.textContent=`‹ ${returnLabel}`;setMessage('');session++;dialog.showModal();render();returnButton?.focus({preventScroll:true});return true;}};
}
