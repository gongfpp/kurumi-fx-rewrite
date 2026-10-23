import {LIVE_RETURN_HELP} from './copy/live-return-help.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
// Display-only explanation of the immutable return inputs; never changes accounting.
const money=value=>Number.isFinite(value)?`${value<0?'−':''}¥${Math.abs(value).toLocaleString('zh-CN',{minimumFractionDigits:2,maximumFractionDigits:2})}`:'未知';
export const formatReturnRate=value=>Number.isFinite(value)?`${value>0?'+':''}${(value*100).toFixed(2)}%`:'—';
export function returnFormula(snapshot,scope='today',{settled=true}={}){
 const cumulative=scope==='cumulative',data=cumulative?snapshot.cumulative:snapshot.daily;
 const numerator=cumulative?data.realizedProfit:data.tradingNet,denominator=data.returnDenominator,rate=data.returnRate;
 const label=cumulative?'累计收益率':settled?'收盘收益率（扣债净资产）':'今日收益率';
 const basis=cumulative?'累计已实现净盈亏 ÷ 初始本金':'今日已实现净盈亏 ÷ 开盘扣债净资产';
 const available=Number.isFinite(rate)&&Number.isFinite(numerator)&&Number.isFinite(denominator)&&denominator>0;
 const lines=[...(settled?['以下为收盘最终值；播放中的数字按实际交易逐步累加。']:[]),basis,available?`${money(numerator)} ÷ ${money(denominator)} × 100% ≈ ${formatReturnRate(rate)}`:`${money(numerator)} ÷ ${money(denominator)}：${data.returnUnavailable||(Number.isFinite(denominator)&&denominator<=0?'分母不为正，收益率不适用':'缺少可信记录，收益率不可确定')}`];
 if(!cumulative&&Number.isFinite(data.openingNominal)&&Number.isFinite(denominator))lines.push(`开盘总资产 ${money(data.openingNominal)} − 开盘欠款 ${money(data.openingNominal-denominator)} = ${money(denominator)}`);
 lines.push(settled?'已实现盈亏已扣交易手续费；借还款、生活开销和未平仓浮盈不计入。':LIVE_RETURN_HELP);
 return{label,lines,numerator,denominator,rate};
}
let nextId=0;
export function createReturnFormulaHelp(doc,snapshot,scope='today'){
 return createFormulaHelp(doc,returnFormula(snapshot,scope));
}
export function createFormulaHelp(doc,formula){
 const root=doc.createElement('span'),button=doc.createElement('button'),panel=doc.createElement('span');
 root.className='return-formula';button.className='return-formula-trigger';button.type='button';button.textContent='?';
 panel.className='return-formula-panel';panel.id=`return-formula-${++nextId}`;panel.setAttribute('popover','auto');panel.setAttribute('role','note');button.setAttribute('popovertarget',panel.id);button.setAttribute('aria-controls',panel.id);
 let previous='';
 root.updateFormula=next=>{
  const values=[next.label,...next.lines],signature=JSON.stringify(values);if(signature===previous)return;previous=signature;
  button.setAttribute('aria-label',`查看${next.label}计算公式`);panel.setAttribute('aria-label',next.label);
  const lines=values.map(text=>{const line=doc.createElement('span');line.className='return-formula-line';line.textContent=text;return line;});panel.replaceChildren(...lines);
 };
 root.updateFormula(formula);
 // Native popovers provide tap, keyboard, Escape and outside-click dismissal.
 if(typeof panel.togglePopover!=='function'){panel.removeAttribute?.('popover');panel.hidden=true;button.setAttribute('aria-expanded','false');button.onclick=()=>{panel.hidden=!panel.hidden;button.setAttribute('aria-expanded',String(!panel.hidden));};button.onkeydown=e=>{if(e.key==='Escape'){panel.hidden=true;button.setAttribute('aria-expanded','false');}};}
 root.append(button,panel);return root;
}
