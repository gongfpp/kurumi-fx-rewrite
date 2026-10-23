const finite=Number.isFinite,clamp=n=>Math.max(0,Math.min(1,n));
const percentText=n=>n>0&&n<.01?'不足 0.01%':n.toFixed(2)+'%';
// A position card shows its own stop first; account risk has a separate meter.
// Engine roots assume the portfolio stays unchanged, so an opposite-direction
// account root must not be appended as the next event of a stopped order.
export function positionRiskView(position,{price,grossPnl,stopLoss,accountEstimate}={}){
 const stop=finite(stopLoss)&&stopLoss>0&&finite(position.stopPrice)&&position.stopPrice>0?
  {kind:'stop',boundary:position.stopPrice,consumed:finite(grossPnl)?clamp(-grossPnl/stopLoss):null,label:'本单止损'}:null;
 const e=accountEstimate,validPrice=value=>finite(value)&&value>0;
 if(!finite(price)||price<=0)return{kind:'unknown',percent:null,tone:'unknown',label:'风险距离暂不可估算'};
 const roots=e&&!e.reason?[...new Set([e.price,...(e.prices||[])].filter(validPrice))].sort((a,b)=>Math.abs(a-price)-Math.abs(b-price)):[];
 const comparable=roots[0];
 const account=comparable!==undefined?{kind:'liquidation',boundary:comparable,consumed:finite(e.remainingLoss)&&finite(e.lossThreshold)&&e.lossThreshold>0?clamp(1-e.remainingLoss/e.lossThreshold):e.remainingLoss===0?1:null,label:'账户强平'}:null;
 // Without a finite root, report current margin status instead of inventing a distance.
 if(e?.remainingLoss===0&&e.reason!=='empty')return{kind:roots.length?'liquidation':'unknown',percent:roots.length?100:null,tone:'critical',label:roots.length?'已触及账户强平阈值':'账户保证金已触及强平阈值 · 无单一强平价'};
 const selected=stop||account;
 if(!selected)return{kind:'unknown',percent:null,tone:'unknown',label:finite(stopLoss)&&stopLoss>0?'本单止损价格暂不可估算':e?.reason==='hedged'?'未设止损 · 多空对冲，无单一强平价':e?.reason==='unreachable'?'未设止损 · 当前无可达的强平价格':'未设止损 · 账户强平距离暂不可估算'};
 const distance=Math.abs(selected.boundary/price-1)*100,at=selected.consumed===1||distance<1e-10,percent=selected.consumed===null?null:Math.round(selected.consumed*1000)/10;
 const direction=selected.boundary<price?'跌':'涨';let label=at?`已触及${selected.label}`:`${selected.label} · 再${direction} ${percentText(distance)}`;
 const tone=at||distance<=.1||percent>=85?'critical':distance<=.35||percent>=60?'warning':'normal';
 return{kind:selected.kind,boundary:selected.boundary,percent,tone,label,scope:selected.kind==='stop'?'本单止损阈值':'全账户强平阈值',distance};
}
export function renderPositionRisk(track,view){
 const doc=track.ownerDocument;track.hidden=false;track.className=`stop-progress risk-progress is-${view.tone}`;track.dataset.riskKind=view.kind;
 let fill=track.firstElementChild;if(!fill){fill=doc.createElement('i');track.append(fill);}fill.style.width=view.percent===null?'0%':view.percent+'%';
 track.setAttribute('role','progressbar');track.setAttribute('aria-label',view.label);track.setAttribute('aria-valuemin','0');track.setAttribute('aria-valuemax','100');
 if(view.percent===null){track.removeAttribute('aria-valuenow');track.setAttribute('aria-valuetext',view.label);}else{track.setAttribute('aria-valuenow',String(view.percent));track.setAttribute('aria-valuetext',view.label+`；${view.scope}已消耗 ${view.percent}%`);}
 let label=track.nextElementSibling;if(!label?.classList.contains('position-risk-label')){label=doc.createElement('p');label.className='position-risk-label';track.after(label);}label.textContent=view.label;label.dataset.tone=view.tone;
}
