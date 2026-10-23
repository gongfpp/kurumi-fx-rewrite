// Presentation only: actual prices and candles are rendered before this short fade.
// No generated prices, timers, deferred fills, or queued transitions.
export function createHistoricalGapTransition({elements,animate,enabled}){
 let active=[];
 return {play(){
  for(const animation of active)animation?.cancel();active=[];
  if(!enabled())return;
  active=elements().filter(Boolean).map(element=>animate(element,[{opacity:.72},{opacity:1}],{duration:180,easing:'ease-out'})).filter(Boolean);
 }};
}
