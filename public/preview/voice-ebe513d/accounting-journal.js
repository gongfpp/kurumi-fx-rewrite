import {grossPnlAt} from './market.js?v=ebe513d153a1219d73a65051f32fb508afce547c-capture-v1-1fbef814f493';
import {currentTradingTimestamp,reportTradingTimestamp,ensureTradingClock,tradingTimestamp} from './trading-time.js?v=ebe513d153a1219d73a65051f32fb508afce547c-capture-v1-1fbef814f493';
const finite=(v,f=0)=>Number.isFinite(v)?v:f;
export function accountingValues(state){
 const positions=state.positions?.length?state.positions:state.position?[state.position]:[];
 const floating=positions.reduce((sum,p)=>sum+finite(grossPnlAt(p,state.price)),0),margin=positions.reduce((sum,p)=>sum+finite(p.margin),0);
 const nominalAssets=Math.max(0,finite(state.cash)+margin+floating)+finite(state.reserve);
 const debt=finite(state.family?.outstanding)+finite(state.loan?.outstanding);
 const realized=finite(state.performance?.totalProfit,(state.history||[]).filter(t=>t.type!=='open').reduce((sum,t)=>sum+finite(t.pnl),0));
 return{nominalAssets,netAssets:nominalAssets-debt,debt,realizedProfit:realized,unrealized:floating,expenses:finite(state.expenses),netFunding:finite(state.externalFunding)};
}
export function ensureAccountingJournal(state){
 ensureTradingClock(state);
 if(!state.accountingJournal||state.accountingJournal.version!==1)state.accountingJournal={version:1,points:[],days:[],startedDay:state.day||1,legacyPartial:(state.day||1)>1||!!state.history?.length||!!state.candles?.some(c=>!c.historical)};
 const j=state.accountingJournal;j.points=Array.isArray(j.points)?j.points.filter(p=>Number.isFinite(p.timestamp)&&Number.isFinite(p.nominalAssets)).slice(-2048):[];j.days=Array.isArray(j.days)?j.days.filter(p=>Number.isFinite(p.timestamp)&&Number.isFinite(p.nominalAssets)).slice(-400):[];return j;
}
// Observation only. This must never execute an order, consume an item or charge a fee.
export function recordAccountingPoint(state,kind='update'){
 const j=ensureAccountingJournal(state),v=accountingValues(state),timestamp=currentTradingTimestamp(state),last=j.points.at(-1);
 if(j.dayOpening?.day!==state.day){const retainedToday=(state.history||[]).filter(t=>t.day===state.day&&t.type!=='open').reduce((n,t)=>n+finite(t.pnl),0);j.dayOpening={day:state.day,realizedProfit:v.realizedProfit-retainedToday,partial:j.legacyPartial&&j.startedDay===state.day};}
 if(last&&last.day===state.day&&Object.keys(v).every(key=>last[key]===v[key]))return last;
 const point={day:state.day||1,timestamp,kind,...v};j.points.push(point);if(j.points.length>2048){j.truncatedDays=[...new Set([...(j.truncatedDays||[]),...j.points.slice(0,-2048).map(p=>p.day)])].slice(-400);}j.points=j.points.slice(-2048);return point;
}
export function recordAccountingDay(state){
 const j=ensureAccountingJournal(state),row={day:state.day,timestamp:currentTradingTimestamp(state),...accountingValues(state)};
 const index=j.days.findIndex(d=>d.day===state.day);if(index>=0)j.days[index]=row;else j.days.push(row);j.days=j.days.slice(-400);return row;
}
export function sealAccountingDay(state){
 const report=state.dayReport;if(!report||report.day!==state.day)return null;
 const j=ensureAccountingJournal(state);report.closedAt=reportTradingTimestamp(state,report);
 recordAccountingPoint(state,'settled');
 report.accounting={version:1,...accountingValues(state),points:j.points.filter(p=>p.day===report.day).map(p=>({...p})),partial:!!(j.legacyPartial&&j.startedDay===report.day||j.truncatedDays?.includes(report.day))};
 const row={day:report.day,timestamp:report.closedAt,opening:report.opening,tradingNet:report.net,costs:report.costs,funding:report.funding,...accountingValues(state)};
 const index=j.days.findIndex(d=>d.day===report.day);if(index>=0)j.days[index]=row;else j.days.push(row);j.days=j.days.slice(-400);return report.accounting;
}
export function dayOpeningPoint(state,report){return{day:report.day,timestamp:tradingTimestamp(state,{day:report.day}),nominalAssets:report.opening,netAssets:null,kind:'opening'};}
