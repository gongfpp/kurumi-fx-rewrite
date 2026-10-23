// Compare actual displayed data, not array identity: quote aggregation returns
// new arrays, and historical/legacy sources can correct an older bar in place.
const candleFields=['timestamp','open','high','low','close','closed'];
export function createChartRenderState(){
 let previous=null;
 return {
  matches(candles,settings,node){
   if(!previous||previous.node!==node||previous.settings.length!==settings.length||previous.candles.length!==candles.length)return false;
   for(let i=0;i<settings.length;i++)if(!Object.is(previous.settings[i],settings[i]))return false;
   for(let i=0;i<candles.length;i++)for(let j=0;j<candleFields.length;j++)if(!Object.is(previous.candles[i][j],candles[i]?.[candleFields[j]]))return false;
   return true;
  },
  // Commit only after the SVG render succeeds. Keep values rather than refs so
  // same-array quote updates cannot make a stale chart look current.
  commit(candles,settings,node){previous={node,settings:[...settings],candles:candles.map(c=>candleFields.map(field=>c?.[field]))};},
  reset(){previous=null;}
 };
}
