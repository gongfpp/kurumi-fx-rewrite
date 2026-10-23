// View-only adapter. Price boundaries are calculated by engine.accountLiquidationEstimate.
export function liquidationMeter(estimate) {
  if (!estimate || estimate.reason === 'empty') return {hidden:true};
  const finite = n => Number.isFinite(n);
  const remaining = finite(estimate.remainingLoss) ? Math.max(0, estimate.remainingLoss) : null;
  const baseline = finite(estimate.lossThreshold) ? Math.max(0, estimate.lossThreshold) : null;
  // Remaining loss capacity, relative to the same portfolio at zero floating P/L.
  // Profitable positions saturate at 100%; the text still gives the exact remaining price move.
  const percent = remaining === null || baseline === null ? null
    : baseline > 0 ? Math.max(0, Math.min(100, remaining / baseline * 100))
    : remaining > 0 ? 100 : 0;
  if (remaining === 0) return {hidden:false,label:'已触及强平线',percent:0,tone:'critical'};
  const common = {hidden:false,percent,tone:percent === null ? 'unknown' : percent <= 20 ? 'critical' : percent <= 50 ? 'warning' : 'safe'};
  if (estimate.reason === 'hedged') return {...common,label:'多空对冲 · 无单一反向波动距离'};
  if (estimate.reason || !finite(estimate.movePercent) || !finite(estimate.price) || estimate.price <= 0) {
    return {...common,label:'当前无可达的单一强平价格'};
  }
  const absolute = Math.abs(estimate.movePercent);
  const distance = absolute > 0 && absolute < .01 ? '不足 0.01%' : `${absolute.toFixed(2)}%`;
  const multiple = Array.isArray(estimate.prices) && estimate.prices.filter(p => finite(p) && p > 0).length > 1;
  const label = absolute === 0 ? '已触及强平线' : multiple
    ? `距最近强平边界约 ${distance}`
    : `再${estimate.movePercent < 0 ? '跌' : '涨'}约 ${distance}触及强平`;
  return {...common,label,percent:absolute === 0 ? 0 : percent,tone:absolute === 0 ? 'critical' : common.tone};
}

export function renderLiquidationMeter(box,estimate,{showBar=true}={}) {
  const view=liquidationMeter(estimate);
  box.replaceChildren();box.hidden=Boolean(view.hidden);
  if(view.hidden)return;
  const doc=box.ownerDocument,label=doc.createElement('span'),track=doc.createElement('span'),fill=doc.createElement('span'),legend=doc.createElement('span');
  const consumed=view.percent===null?null:100-view.percent;legend.className='liquidation-meter-legend';legend.textContent=consumed===null?'缓冲暂不可估算':`亏损缓冲已消耗 ${Math.round(consumed)}% · 满格触发强平`;
  box.className=`liquidation-meter-value is-${view.tone}`;
  label.className='liquidation-meter-label';label.textContent=view.label;
  track.className='liquidation-meter-track';fill.className='liquidation-meter-fill';
  if(view.percent!==null){
    track.setAttribute('role','progressbar');track.setAttribute('aria-label','亏损缓冲消耗，越满越接近强平');
    track.setAttribute('aria-valuemin','0');track.setAttribute('aria-valuemax','100');
    track.setAttribute('aria-valuenow',String(Math.round(consumed)));
    track.setAttribute('aria-valuetext',view.label);
    fill.style.width=`${consumed}%`;
  }else{track.setAttribute('aria-hidden','true');fill.style.width='0%';}
  track.title='横条表示零浮盈时的亏损缓冲已消耗比例；0%为未消耗，100%为已触及强平，不是发生概率。上方距离按当前报价计算。';
  track.append(fill);box.append(label);if(showBar)box.append(track,legend);
}
