import {marketInfo} from './market-book.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
export const PAIR='USD/JPY',QUOTE_UNIT='日元/1 美元',PIP_SIZE=.01;
export const formatQuote=n=>Number.isFinite(n)?n.toFixed(3):'—';
export const formatQuantity=n=>Number.isFinite(n)?n.toLocaleString('zh-CN',{maximumFractionDigits:2}):'—';
export const directionLabel=(d,symbol='USD/JPY')=>(d===1?'做多':'做空')+marketInfo(symbol).name;
export const isLegacyPosition=p=>p?.pnlModel==='legacy-inverse-v5';
export const positionQuantity=p=>isLegacyPosition(p)?null:(p.notional??p.margin*p.leverage)/p.entry;
export function grossPnlAt(p,price){if(!p)return 0;const n=p.notional??p.margin*p.leverage;return isLegacyPosition(p)?n*p.direction*(1-p.entry/price):positionQuantity(p)*p.direction*(price-p.entry);}
export function pnlCoefficients(p){const n=(p.notional??p.margin*p.leverage)*p.direction;return isLegacyPosition(p)?{linear:0,reciprocal:-n*p.entry,constant:n}:{linear:n/p.entry,reciprocal:0,constant:-n};}
