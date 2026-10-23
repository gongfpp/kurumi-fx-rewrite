import {isLiveMarket,liveTradingReady} from './live-market-state.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
export function canRequestWalkaway(state={}){return ['decision','playing','closing','day_end','resting','bankrupt'].includes(state.phase);}
export function walkawayConfirmation(state={}){
 const openPositions=state.positions?.length||(state.position?1:0);
 if(isLiveMarket(state)&&openPositions&&!liveTradingReady(state))return {suspendOnly:true,title:'保存持仓，暂时离开？',copy:'行情暂缓，暂时无法平仓。账户和持仓将原样保存，再回到模式选择；继续本局时等待新报价。'};
 return {title:'销户离场，结束这一局？',copy:`${openPositions?`现有 ${openPositions} 笔持仓将按当前报价平仓，并计入交易手续费。`:''}离场后，本局结束。`};
}
// Confirmation delegates all account changes to the authoritative engine.
export function requestWalkaway(state,{finishRunImmediately}={}){
 if(state?.phase==='ending')return {alreadyRequested:true,ending:state?.ending||null};
 if(!canRequestWalkaway(state))throw Error('当前暂不能离场，请先完成正在进行的步骤');
 if(typeof finishRunImmediately!=='function')throw Error('当前版本暂不能完成离场，请保留存档并重试');
 const ending=finishRunImmediately(state);return ending?.suspended?{alreadyRequested:false,...ending}:{alreadyRequested:false,ending};
}
