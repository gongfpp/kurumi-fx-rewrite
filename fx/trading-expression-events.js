import {positionsOf,positionNetUnrealized,accountMetrics,tradingOpen} from './engine.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';

// Presentation only: no RNG, clock advances, account mutations or cash-based P&L.
export const TRADING_EXPRESSION_RULES=Object.freeze({
 'entry-hesitation':{basis:'none',thoughts:{long:'现在买入……说不定能赚一大笔！',short:'现在做空……说不定能赚一大笔！'}},
 'position-opened':{basis:'none',thoughts:{long:'买好了……接下来就盯紧它。',short:'空单开好了……别急着得意。',mixed:'多空都有了，得分清每一单。'}},
 'floating-profit':{basis:'floating',thoughts:{any:'浮盈了……还没落袋呢。'}},
 'floating-loss':{basis:'floating',thoughts:{any:'还浮亏着……先看清仓位。'}},
 'profit-to-loss':{basis:'floating',thoughts:{any:'刚才的浮盈……变成浮亏了。'}},
 'loss-to-profit':{basis:'floating',thoughts:{any:'浮亏转正了……先别得意。'}},
 'closed-profit':{basis:'realized',thoughts:{any:'这次平仓，赚到手了！'}},
 'closed-loss':{basis:'realized',thoughts:{any:'这次平仓亏了……记住这一笔。'}},
 'risk-warning':{basis:'floating',thoughts:{any:'保证金吃紧了……得盯住风险。'}}
});
export function expressionThought(event,direction){const rule=TRADING_EXPRESSION_RULES[event];return rule?.thoughts[direction]||rule?.thoughts.any||null;}
export function tradingExpressionSnapshot(state){
 const orders=positionsOf(state),directions=new Set(orders.map(p=>p.direction)),net=orders.reduce((n,p)=>n+positionNetUnrealized(state,p),0);
 const notional=orders.reduce((n,p)=>n+(p.notional??p.margin*p.leverage),0),band=Math.max(50,notional*.00003);
 return {positionIds:orders.map(p=>p.id),active:tradingOpen(state),context:`${state.runId}:${state.mode}:${state.day}`,key:orders.map(p=>`${p.id}:${p.direction}:${p.margin}:${p.entry}`).sort().join('|'),position:orders.length?'open':'flat',direction:directions.size>1?'mixed':directions.has(1)?'long':directions.has(-1)?'short':'none',net,pnlSign:orders.length&&Number.isFinite(net)&&Math.abs(net)>band?Math.sign(net):0,atRisk:orders.length>0&&accountMetrics(state).marginLevel<=1.25};
}
export function expressionEvent(event,snapshot,extra={}){
 const rule=TRADING_EXPRESSION_RULES[event];return rule?{event,direction:snapshot.direction,position:snapshot.position,profitBasis:rule.basis,pnlSign:rule.basis==='none'?0:snapshot.pnlSign,previousPnlSign:0,context:snapshot.context,positionKey:snapshot.key,...extra}:null;
}
export function expressionForTrades(trades,snapshot){
 const list=(trades||[]).filter(Boolean);if(!list.length)return null;
 const dirs=new Set(list.map(t=>t.direction)),direction=dirs.size>1?'mixed':dirs.has(1)?'long':dirs.has(-1)?'short':'none';
 if(list.every(t=>t.type==='open')){
  // Only a receipt matching every current position proves a fresh entry from flat.
  const ids=list.map(t=>t.positionId),current=snapshot.positionIds;
  const firstOpen=direction===snapshot.direction&&list.every(t=>[t.margin,t.entry,t.quantity].every(n=>Number.isFinite(n)&&n>0))&&snapshot.active&&snapshot.position==='open'&&Array.isArray(current)&&current.length===ids.length&&new Set(ids).size===ids.length&&ids.every(id=>id!=null&&current.includes(id));
  return expressionEvent('position-opened',snapshot,{direction:snapshot.direction,eventSource:firstOpen?'receipt-first-open':'receipt-addition'});
 }
 if(list.some(t=>!Number.isFinite(t.pnl)))return null;
 const pnl=list.reduce((n,t)=>n+t.pnl,0);return pnl===0?null:expressionEvent(pnl>0?'closed-profit':'closed-loss',snapshot,{direction,pnlSign:Math.sign(pnl)});
}
export function createExpressionObserver({now=()=>Date.now(),settleMs=1800}={}){
 let previous=null,stable=0,pending=null,risk=false;
 return {reset(){previous=null;stable=0;pending=null;risk=false;},observe(s){
  if(!s.active||s.position==='flat'){this.reset();return null;}
  if(!previous||previous.context!==s.context||previous.key!==s.key){previous=s;stable=s.pnlSign;pending=null;risk=s.atRisk;return null;}
  previous=s;
  if(s.atRisk&&!risk){risk=true;return expressionEvent('risk-warning',s);}risk=s.atRisk;
  if(!s.pnlSign){pending=null;return null;}
  if(s.pnlSign===stable){pending=null;return null;}
  if(!pending||pending.sign!==s.pnlSign){pending={sign:s.pnlSign,since:now()};return null;}
  if(now()-pending.since<settleMs)return null;
  const before=stable;stable=s.pnlSign;pending=null;
  const event=before===1&&stable===-1?'profit-to-loss':before===-1&&stable===1?'loss-to-profit':stable===1?'floating-profit':'floating-loss';
  return expressionEvent(event,s,{previousPnlSign:before});
 }};
}
// A dropped event is never queued to appear later with stale account context.
export function createExpressionGate({now=()=>Date.now(),cooldownMs=12000,dismissMs=30000,dedupeMs=60000}={}){
 let until=0,last=new Map();return {accept(e){const time=now(),key=`${e.context}:${e.event}:${e.direction}:${e.positionKey}`;if(time<until||time-(last.get(key)??-Infinity)<dedupeMs)return false;until=time+cooldownMs;last.set(key,time);if(last.size>80)last.delete(last.keys().next().value);return true;},dismiss(){until=Math.max(until,now()+dismissMs);}};
}
