import {tradingTrauma,tradingCapitalSafety} from './trading-trauma.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
const narrative=Object.freeze({'father-crisis':'crisis','father-discovery':'tension','father-relief':'relief'});
export function voiceMixActive(voice,auditions=[]){
 return Boolean(voice?.audible||voice?.playing||Array.from(auditions).some(player=>!player.paused&&!player.ended&&!player.error));
}
export function selectBgmScene(state,{sceneCue=null,accountEquity,netFloating}={}){
 if(narrative[sceneCue])return narrative[sceneCue];
 const trauma=tradingTrauma(state);
 if(trauma.active)return trauma.mood==='numb'?'numb':trauma.mood==='recovering'?'relief':'crisis';
 const report=state.dayReport;
 if(['day_end','resting','ending'].includes(state.phase)&&report?.day===state.day&&Number.isFinite(report.net)){
  if(report.net>0)return report.net>=5000?'gain':'relief';
  if(report.net<0)return tradingCapitalSafety(state,{accountEquity}).principalIntact?'tension':'loss';
  return 'neutral';
 }
 const holding=state.positions?.length||state.position;
 // Use the host's actual net floating P/L, never candle direction (a short can
 // profit while price falls). A small dead band keeps ordinary noise in focus.
 if(holding&&Number.isFinite(netFloating)){
  const threshold=Math.max(250,(Number.isFinite(state.startEquity)?state.startEquity:100000)*.005);
  if(netFloating>=threshold)return 'gain';
  if(netFloating<=-threshold)return 'loss';
 }
 return holding?'focus':'neutral';
}
