// Static, synthetic presentation fixtures. Never connected to a live run/save.
export const EFFECT_SCENARIOS=Object.freeze([
 {id:'small-profit',label:'小赚',profit:1000},{id:'large-profit',label:'大赚',profit:35000},
 {id:'small-loss',label:'小亏',profit:-1000},{id:'large-loss',label:'巨亏',profit:-85000},{id:'medium-profit',label:'中赚',profit:12000}
]);
export function effectFixture(id){
 const scenario=EFFECT_SCENARIOS.find(s=>s.id===id)||EFFECT_SCENARIOS[0],opening=100000,net=scenario.profit,start=Date.UTC(2014,1,14,0,10);
 const candles=Array.from({length:16},(_,i)=>{const open=150+Math.sin(i*.8)*.1+(i>4?-4:0),close=open+Math.cos(i)*.05;return{open,close,high:Math.max(open,close)+.04+(i===4?3:0),low:Math.min(open,close)-.04,closed:true,timestamp:start+i*900000};});
 const trades=[{sequence:1,type:"open",timestamp:start+900000,direction:1,entry:150,day:1},...[[3,-.12],[6,.28],[10,-.08],[13,.42],[15,.50]].map(([i,share],j)=>({sequence:j+2,type:j===4?"closing":"half",timestamp:start+i*900000,direction:1,exit:candles[i].close,pnl:net*share,day:1}))];
 const curve=[{timestamp:start,nominalAssets:opening,netAssets:null},{timestamp:start+8*900000,nominalAssets:opening+net*.4,netAssets:null},{timestamp:start+16*900000,nominalAssets:opening+net,netAssets:null}];
 return {version:1,sealed:false,mode:'preview',primary:{label:'演出示例 · 交易净盈亏',profit:net,returnRate:net/opening},cumulative:{realizedProfit:net,returnRate:net/opening,returnBasis:'演出测试数据，不写入任何账户'},account:{nominalAssets:opening+net,netAssets:opening+net,debt:0},daily:{openingNominal:opening,closingNominal:opening+net,tradingNet:net,fundingPrincipal:0,livingStatus:'pending',costs:{living:0,interest:0,consumption:0},interestAccrued:0,netResult:net,returnBasis:'固定测试本金 ¥100,000'},trades,timestamp:start+16*900000,candles,candleMovingAverages:[],curves:{basis:'trading',today:curve,cumulative:curve,todayPartial:false,cumulativePartial:false},timeNotice:'固定虚构数据 · 仅演出预览'};
}
