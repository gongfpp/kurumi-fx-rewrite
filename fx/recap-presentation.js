import {recapActivityAnchors} from './recap-timeline.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
// Read-only score: only realized P/L and its recorded return affect spectacle.
const clamp=n=>Math.max(0,Math.min(1,n));
// A catastrophic presentation needs a certified daily ledger AND real forced-close receipts.
export function catastrophicRecapLoss(snapshot){
 const daily=snapshot.daily,base=daily?.returnDenominator,net=daily?.tradingNet;
 const liquidationLoss=(snapshot.trades||[]).filter(t=>t.type==='liquidation'&&t.positionClosed===true&&Number.isFinite(t.pnl)&&t.pnl<0).reduce((sum,t)=>sum-t.pnl,0);
 return snapshot.sealed===true&&snapshot.primary?.scope==='today'&&snapshot.primary.profit<0&&daily?.tradingNetPartial===false&&Number.isFinite(base)&&base>0&&Number.isFinite(net)&&net/base<=-.65&&liquidationLoss/base>=.5;
}
export function recapPresentation(snapshot){
 const profit=Number.isFinite(snapshot.primary?.profit)?snapshot.primary.profit:0;
 const rate=Math.abs(Number.isFinite(snapshot.primary?.returnRate)?snapshot.primary.returnRate:0),amount=Math.round(Math.abs(profit)*100)/100;
 const weight=Math.max(clamp(rate/.5),clamp(Math.log10(1+amount/1000)/3));
 const catastrophic=catastrophicRecapLoss(snapshot);
 const observedMotion=(snapshot.replay?.observations||[]).some(p=>Number.isFinite(p.tradingAssets)&&Math.abs(p.tradingAssets-(snapshot.daily?.openingNominal||0))>=.01);
 const receiptMotion=(snapshot.trades||[]).some(t=>t.type!=='open'&&Number.isFinite(t.pnl)&&Math.abs(t.pnl)>=.01);
 const rank=catastrophic?3:profit===0?(observedMotion||receiptMotion?1:0):rate>=.2||amount>=100000?3:rate>=.05||amount>=10000?2:1;
 const tier=['flat','small','medium','large'][rank],direction=profit>0?'profit':profit<0?'loss':'flat';
 const intensity=catastrophic?1:rank?Math.min(1,[0,.16,.38,.7][rank]+weight*.3):0;
 const countDuration=recapActivityAnchors(snapshot).length<=1?440:catastrophic?8400:[2600,4600,6200,7800][rank],landingDuration=catastrophic?900:[400,550,700,850][rank],duration=countDuration+landingDuration,beats=[0,8,16,26][rank];
 const amountTier=amount>=20000000?'twenty-million':amount>=100000?'hundred-thousand':amount>=1000?'thousand':'small';
 // The scan and amount never stop for an impact. Only the final landing remains.
 const stops=[[0,0],[1,1]];
 const beatTimes=Array.from({length:beats},(_,i)=>Math.round((countDuration-320)*(.1+.9*((i+1)/beats)**.7)));
 return{catastrophic,amountTier,tier,rank,direction,duration,countDuration,landingDuration,beats,beatTimes,stops,intensity,particles:direction==='profit'?[0,8,26,64][rank]:0,shards:catastrophic?36:direction==='loss'?[0,0,7,15][rank]:0,shake:catastrophic?22:rank===3?Math.round((direction==='loss'?19:10)*intensity):rank===2?7:4};
}
export function recapProgress(presentation,elapsed){
 const t=clamp(elapsed/presentation.countDuration),stops=presentation.stops;
 for(let i=1;i<stops.length;i++){const [end,to]=stops[i],[start,from]=stops[i-1];if(t<=end){const p=(t-start)/(end-start);return from+(to-from)*(1-(1-p)**2);}}
 return 1;
}
export function recapBeatCue(presentation,index,{final=false}={}){
 const fraction=presentation.beats?Math.min(1,(index+1)/presentation.beats):0;
 return{kind:final?(presentation.rank===3?`recap-land-${presentation.direction}`:presentation.direction==='profit'?'terminal-fill':'terminal-close'):'terminal-tap',rate:presentation.direction==='loss'?1.2-.4*fraction:.8+.45*fraction,level:final?.45+presentation.rank*.12:.15+fraction*(.2+presentation.rank*.09)};
}
