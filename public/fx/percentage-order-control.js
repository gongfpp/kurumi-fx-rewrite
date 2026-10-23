import {orderAmountRatio} from './amount-controls.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';

export function percentageAvailability({availableMargin,cap,enabled,blockedReason='',format=String}){
 const funded=Number.isFinite(availableMargin)&&availableMargin>0;
 const disabled=!enabled||!funded||!Number.isFinite(cap)||cap<100;
 const ceiling=disabled?0:Math.max(0,Math.min(100,cap/availableMargin*100));
 const limited=disabled||ceiling<99.995;
 const ceilingText=ceiling>0&&ceiling<.01?'不足 0.01%':`${Math.floor(ceiling*100)/100}%`;
 const limitSummary=`受心理承受力影响，当前上限 ${format(disabled?0:cap)}（可用资金的 ${ceilingText}）。`;
 const reason=disabled?`${limitSummary}${blockedReason||(!funded?'当前没有可用保证金。':Number.isFinite(cap)&&cap<100?'当前可开仓额度不足 ¥100。':'当前不能新开仓，恢复后可调整额度。')}`:
  limited?`${limitSummary}灰色部分超出本单上限，选择更高比例时仍按上限计算；上限同时计入已有持仓和开仓费用。`:'';
 return {disabled,ceiling,limited,reason};
}

// The explanation has its own enabled, focusable touch target. Native disabled
// ranges do not dispatch the pointer/focus events needed to discover a tooltip.
const explanations=new WeakMap();
function renderAvailability(document,slider,model){
 const field=document.getElementById('percent-slider-field');if(!field)return;
 let ui=explanations.get(field);
 if(!ui){
  const button=document.createElement('button'),tooltip=document.createElement('span'),heading=field.querySelector('.pixel-percent-heading');
  button.type='button';button.className='percent-availability-help help-dot';button.textContent='?';button.setAttribute('aria-label','查看当前额度限制');
  tooltip.id='percent-availability-description';tooltip.className='percent-availability-tooltip';tooltip.setAttribute('role','tooltip');tooltip.hidden=true;
  button.setAttribute('aria-describedby',tooltip.id);button.setAttribute('aria-controls',tooltip.id);button.setAttribute('aria-expanded','false');
  let hideTimer;
  const show=()=>{clearTimeout(hideTimer);if(button.hidden)return;tooltip.hidden=false;button.setAttribute('aria-expanded','true');};
  const hide=()=>{clearTimeout(hideTimer);tooltip.hidden=true;button.setAttribute('aria-expanded','false');};
  const leave=()=>{if(document.activeElement!==button)hideTimer=setTimeout(hide,120);};
  button.addEventListener('click',show);button.addEventListener('focus',show);button.addEventListener('pointerenter',show);
  button.addEventListener('blur',hide);button.addEventListener('pointerleave',leave);tooltip.addEventListener('pointerenter',show);tooltip.addEventListener('pointerleave',leave);
  button.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();hide();}});
  (heading||field).append(button);field.append(tooltip);ui={button,tooltip,hide};explanations.set(field,ui);
 }
 field.dataset.percentageLimited=String(model.limited);field.dataset.percentageDisabled=String(model.disabled);
 slider.style?.setProperty('--percent-cap',`${model.ceiling}%`);
 const descriptions=new Set((slider.getAttribute('aria-describedby')||'').split(/\s+/).filter(Boolean));
 if(model.limited)descriptions.add(ui.tooltip.id);else descriptions.delete(ui.tooltip.id);
 slider.setAttribute('aria-describedby',[...descriptions].join(' '));
 ui.tooltip.textContent=model.reason;ui.button.hidden=!model.limited;if(!model.limited)ui.hide();
}

// Paint only. Selection flows through the app's existing quoted order draft.
// Keep a selected ratio under fee/psychological caps, and disclose the actual
// ratio when the allowed amount differs. Fixed amounts are never changed here.
export function renderPercentageOrderControl({document,amount,availableMargin,cap,enabled,intent,blockedReason='',format=String}){
 const slider=document.getElementById('percent-slider');if(!slider)return;
 const actual=orderAmountRatio(amount,availableMargin),selected=intent?.mode==='ratio'?intent.ratio:actual;
 const percent=Number.isFinite(selected)?Math.max(0,Math.min(100,selected*100)):0;
 const actualPercent=actual===null?'—':`${Number((actual*100).toFixed(2))}%`;
 const selectedPercent=`${Number(percent.toFixed(2))}%`;
 const clipped=intent?.mode==='ratio'&&actual!==null&&actual<intent.ratio-1e-6;
 const value=Number.isFinite(amount)?format(amount):'—';
 const availability=percentageAvailability({availableMargin,cap,enabled,blockedReason,format});
 slider.value=String(percent);slider.disabled=availability.disabled;
 slider.style?.setProperty('--percent-progress',`${percent}%`);
 slider.setAttribute?.('aria-valuetext',clipped?`${selectedPercent}，实际投入 ${actualPercent}，${value}`:`${actualPercent}，${value}`);
 const funds=document.getElementById('percent-available-margin');if(funds)funds.textContent=Number.isFinite(availableMargin)?format(availableMargin):'—';
 const output=document.getElementById('percent-selected');if(output)output.textContent=clipped?`${selectedPercent} · 实投 ${actualPercent} · ${value}`:`${actualPercent} · ${value}`;
 renderAvailability(document,slider,availability);
}
