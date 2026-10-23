import {marketInfo,positionMarket} from './market-book.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {consumptionStatement} from './consumption-ledger.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {formatTradingTime,reportTradingTimestamp} from './trading-time.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {formatQuote as quote,directionLabel} from './market.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {TRANSITION_COPY} from './copy/transitions.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
const yen=value=>`${value<0?'−':''}¥${Math.abs(value).toLocaleString('zh-CN',{maximumFractionDigits:2})}`;
const signed=value=>`${value>0?'+':''}${yen(value)}`;
export function buildFXReceipt(report,state={}){
  const labels={half:'减半平仓',close:'平仓',rescue:'提前平仓',stop:'止损',liquidation:'强平',closing:'收盘平仓'};
  const net=report.net;
  const rows=report.trades.filter(t=>Number.isFinite(t.pnl)).map(t=>({label:`#${t.positionId||'—'} · ${directionLabel(t.direction,positionMarket(t))}${t.pnlModel==='legacy-inverse-v5'?'（旧约兼容）':''} · ${labels[t.type]||'交易'}`,amount:t.pnl,formula:`${yen(t.margin)} 保证金 · ${Number((t.leverage||0).toFixed(1))}× · ${positionMarket(t)} ${quote(t.entry)} → ${quote(t.exit)} 日元/${marketInfo(positionMarket(t)).name} · 费用 ${yen((t.openFee||0)+(t.closeFee||0))}${t.lossReduction?' · 萌智子减免 '+yen(t.lossReduction):''}`}));
  if(report.nonTradingIncome)rows.push({label:'工作收入',amount:report.nonTradingIncome});
  if(report.funding)rows.push({label:'借还款变动',amount:report.funding});
  const statement=consumptionStatement(state,report);
  if(statement.rows.some(row=>!row.legacy)){for(const row of statement.rows)if(row.amount)rows.push({label:row.label,amount:-row.amount,formula:row.kind==='interest'&&report.interestAccrued?'其中 '+yen(report.interestAccrued)+' 计入欠款':undefined});}
  else {
   const shopping=Math.max(0,report.costs-(report.livingCost||0)-(report.interest||0));
   if(shopping)rows.push({label:'消费物品（旧账未保留明细）',amount:-shopping});
   if(report.livingCost)rows.push({label:'生活费',amount:-report.livingCost});
   if(report.interest)rows.push({label:'网络贷款利息',amount:-report.interest,formula:report.interestAccrued?'其中 '+yen(report.interestAccrued)+' 计入欠款':''});
  }
  return{title:TRANSITION_COPY.dayTitle,opening:report.opening,closing:report.closing,tradingNet:report.net,funding:report.funding,closingLabel:formatTradingTime(reportTradingTimestamp(state,report),{full:true})+' / TRADING STATEMENT',rows,doneLabel:net>0.005?TRANSITION_COPY.positive:net<-.005?TRANSITION_COPY.negative:TRANSITION_COPY.neutral,summary:`交易净收益 ${signed(report.net)}`};
}
