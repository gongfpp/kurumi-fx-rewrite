// Read-only presentation. Six wall-clock seconds of observed quotes; no future OHLC.
// Heavy exposure alone does not pulse: >=65% used margin AND >=0.08% range.
// Exit at <55% or <0.04% to avoid threshold chatter. Near-liquidation has its
// own 20% / 30% remaining-buffer hysteresis, critical at 8% / 12%.
export function createChartRiskHeartbeat(){
 let key,samples=[],volatile=false,near=false,critical=false;
 const reset=()=>{samples=[];volatile=near=critical=false;};
 return {observe({context,time,price,positions,metrics={},estimate,enabled=true}={}){
  if(key!==context){reset();key=context;}
  if(!enabled||!positions||!Number.isFinite(time)||!Number.isFinite(price)||price<=0){reset();return{level:'quiet',duration:1000};}
  if(samples.length&&time<samples.at(-1).time)reset();
  samples=samples.filter(s=>s.time>=time-6000);samples.push({time,price});
  // Render bursts can share the same clock; retain bounded, actual observations.
  if(samples.length>256)samples=samples.slice(-256);
  const range=(Math.max(...samples.map(s=>s.price))-Math.min(...samples.map(s=>s.price)))/price;
  const exposure=Number.isFinite(metrics.usedMargin)&&Number.isFinite(metrics.tradingEquity)?metrics.usedMargin/Math.max(1,metrics.tradingEquity):0;
  volatile=volatile?exposure>=.55&&range>=.0004:exposure>=.65&&range>=.0008;
  const buffer=Number.isFinite(estimate?.remainingLoss)&&Number.isFinite(estimate?.lossThreshold)&&estimate.lossThreshold>0?Math.max(0,estimate.remainingLoss/estimate.lossThreshold):estimate?.remainingLoss===0?0:null;
  near=buffer!==null&&(near?buffer<=.3:buffer<=.2);
  critical=buffer!==null&&(critical?buffer<=.12:buffer<=.08);
  const level=critical?'critical':near?'danger':volatile?'watch':'quiet';
  return{level,duration:critical?650:near?850:1100,range,exposure,buffer};
 }};
}
