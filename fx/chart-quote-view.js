// DOM-only overlay: it never owns or replaces the chart's SVG or price state.
const views=new WeakMap();
const text=value=>value===null||value===undefined?'—':String(value);
export function renderChartQuoteLabel(chart,model){
 if(!chart||!model)return null;
 let view=views.get(chart);
 if(!view){
  const doc=chart.ownerDocument,element=doc.createElement('div'),primary=doc.createElement('div'),change=doc.createElement('div'),caption=doc.createElement('span'),price=doc.createElement('strong');
  element.className='chart-quote-label';element.setAttribute('role','group');
  primary.className='chart-quote-label-primary';change.className='chart-quote-label-change';primary.append(caption,price);element.append(primary,change);
  view={element,primary,change,caption,price};views.set(chart,view);
 }
 const {element,primary,change,caption,price}=view;
 caption.textContent=`${text(model.symbol)} · ${text(model.priceLabel)} `;price.textContent=text(model.price);
 change.textContent=`${text(model.change)} · ${text(model.percent)}`;
 const stamp=Number.isFinite(model.sourceTimestamp)&&Math.abs(model.sourceTimestamp)<=8640000000000000?new Date(model.sourceTimestamp).toISOString():null;
 const age=Number.isFinite(model.delaySeconds)?`距来源时间 ${model.delaySeconds} 秒`:null;
 const detail=[model.basis,model.status,stamp?`来源时间 ${stamp}`:null,age].filter(Boolean).join('；');
 element.setAttribute('title',detail);element.setAttribute('aria-label',`${primary.textContent}；涨跌额 ${text(model.change)}；涨跌幅 ${text(model.percent)}；${detail}`);
 element.dataset.realtime=String(model.isRealtime===true);
 // A redraw may detach the overlay with innerHTML. Reattach this same node after
 // the replacement SVG, preserving firstChild identity and the chart cache.
 if(element.parentNode!==chart)chart.append(element);
 return element;
}
