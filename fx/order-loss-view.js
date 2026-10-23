// Presentation only. The account threshold and price come from orderPreview's
// shared liquidation estimator; never substitute the ticket's margin as loss.
export function liquidationLossAmount(preview){
  const estimate=preview?.liquidation;
  return preview?.valid&&Number.isFinite(preview.liquidationPrice)&&preview.liquidationPrice>0
    &&estimate&&!estimate.reason&&Number.isFinite(estimate.lossThreshold)&&estimate.lossThreshold>=0
    ?estimate.lossThreshold:null;
}

export function orderLossView(stopPips,longPreview,shortPreview,formatMoney){
  const money=value=>Number.isFinite(value)?formatMoney(value):'—';
  if(stopPips!==null)return {
    label:'预计止损亏损',
    amount:money(longPreview?.valid?longPreview.stopLossAmount:null),
    note:''
  };
  return {
    label:'预计强平亏损',
    amount:`做多 ${money(liquidationLossAmount(longPreview))} / 做空 ${money(liquidationLossAmount(shortPreview))}`,
    note:'账户浮亏估算，不含平仓费或减免；实际按触发报价结算。'
  };
}
