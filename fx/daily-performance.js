// One daily realized-PnL and opening-net-asset definition for UI, recap and PNG.
// Debt at the opening is immutable; current borrowing never changes the basis.
export function dailyReturnMetrics(state={}, {report}={}) {
 const r=report===null?null:report||(state.dayReport?.day===state.day&&['day_end','resting','ending'].includes(state.phase)?state.dayReport:null);
 const day=r?.day??state.day;
 const trades=(r?.trades||state.history||[]).filter(t=>t.day===day&&t.type!=='open'&&Number.isFinite(t.pnl));
 const opening=state.accountingJournal?.dayOpening,liveTotal=opening?.day===day&&!opening.partial&&Number.isFinite(opening.realizedProfit)&&Number.isFinite(state.performance?.totalProfit)&&(state.performance?.closedTrades||0)>=trades.length?state.performance.totalProfit-opening.realizedProfit:trades.reduce((sum,t)=>sum+t.pnl,0);
 const tradingNet=Number.isFinite(r?.closedTradeNet)?r.closedTradeNet:Number.isFinite(r?.net)?r.net:liveTotal;
 let denominator=null,source='unavailable';
 if(r&&Object.hasOwn(r,'openingNetAssets')&&!Number.isFinite(r.openingNetAssets)){source='report-opening-net-unavailable';}
 else if(Number.isFinite(r?.openingNetAssets)){denominator=r.openingNetAssets;source='report-opening-net';}
 else if(r&&Number.isFinite(r.opening)&&Number.isFinite(r.openingDebt)){denominator=r.opening-r.openingDebt;source='report-opening-debt';}
 else if(r&&Number.isFinite(r.opening)&&Number.isFinite(r.externalFunding)&&Number.isFinite(r.funding)){denominator=r.opening-(r.externalFunding-r.funding);source='legacy-report-funding-snapshot';}
 else if(day===state.day&&!state.dayOpeningBasisUnknown&&Number.isFinite(state.dayOpeningNetAssets)){denominator=state.dayOpeningNetAssets;source='opening-net-snapshot';}
 else if(day===state.day&&!state.dayOpeningBasisUnknown&&Number.isFinite(state.dayOpening)&&Number.isFinite(state.dayOpeningDebt)){denominator=state.dayOpening-state.dayOpeningDebt;source='opening-debt-snapshot';}
 else if(day===state.day&&!state.dayOpeningBasisUnknown&&Number.isFinite(state.dayOpening)&&Number.isFinite(state.dayOpeningFunding)){denominator=state.dayOpening-state.dayOpeningFunding;source='legacy-opening-funding-snapshot';}
 const sealed=Number.isFinite(r?.closedTradeNet)||Number.isFinite(r?.net),hasBaseline=opening?.day===day&&!opening.partial&&Number.isFinite(opening.realizedProfit)&&Number.isFinite(state.performance?.totalProfit)&&(state.performance?.closedTrades||0)>=trades.length,allRetained=(state.history||[]).filter(t=>t.type!=='open'&&Number.isFinite(t.pnl)).length,historyComplete=Number.isSafeInteger(state.performance?.closedTrades)&&state.performance.closedTrades<=allRetained,tradingNetPartial=!sealed&&!hasBaseline&&!historyComplete;
 const ratio=!tradingNetPartial&&denominator>0?tradingNet/denominator:null,returnRate=Number.isFinite(ratio)?ratio:null;
 return {day,tradingNet,tradingNetPartial,denominator,openingNetAssets:denominator,returnRate,source,returnUnavailable:tradingNetPartial?'旧交易记录不完整，今日收益率不可确定':denominator===null?'缺少可信开盘扣债资产记录':denominator<=0?'开盘扣债净资产不为正':returnRate===null?'收益率超出可显示范围':null};
}
