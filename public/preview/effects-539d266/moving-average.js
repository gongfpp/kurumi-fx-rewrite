// Closed candles only. A missing/corrupt bar breaks the rolling window; it is
// never replaced with zero, skipped, or read from the future script.
export const DEFAULT_MA_PERIODS=Object.freeze([5,10,20]);
export const MA_COLORS=Object.freeze({5:'#f7cf66',10:'#74d9e8',20:'#c7a3ff'});
export function simpleMovingAverage(candles,period){
 if(!Number.isSafeInteger(period)||period<1||period>1000)throw Error('Invalid moving-average period');
 if(!Array.isArray(candles))return[];
 const window=[];
 return candles.map(candle=>{
   const close=candle?.close;
   if(candle?.closed!==true||!Number.isFinite(close)||close<=0){window.length=0;return null;}
   window.push(close);if(window.length>period)window.shift();if(window.length<period)return null;
   // Scaling avoids overflow even when all source closes approach MAX_VALUE.
   const scale=Math.max(...window),mean=scale*(window.reduce((sum,p)=>sum+p/scale,0)/period);
   return Number.isFinite(mean)&&mean>0?mean:null;
 });
}
export function movingAverageSeries(candles,{periods=DEFAULT_MA_PERIODS,start=0,end=candles?.length||0}={}){
 const input=Array.isArray(candles)?candles:[],from=Math.max(0,Math.min(input.length,Math.floor(start)||0)),to=Math.max(from,Math.min(input.length,Math.floor(end)||0));
 const lastClosed=input.findLastIndex(c=>c?.closed===true);
 return [...new Set(periods)].map(period=>{const full=simpleMovingAverage(input,period);return{period,color:MA_COLORS[period]||'#ddd',values:full.slice(from,to),latest:lastClosed>=0?full[lastClosed]:null,start:from};});
}
export function movingAverageSettings(value){return Object.fromEntries(DEFAULT_MA_PERIODS.map(period=>[period,typeof value?.[period]==='boolean'?value[period]:true]));}
// Use separate path segments after nulls. Renderers must not connect across gaps.
export function movingAverageSegments(values){const result=[];let current=[];for(const [index,value] of values.entries()){if(Number.isFinite(value)&&value>0)current.push({index,value});else if(current.length){result.push(current);current=[];}}if(current.length)result.push(current);return result;}
export function movingAveragePath(values,{x,y}){
 let path='',connected=false;
 for(const [index,value] of values.entries()){
   if(!Number.isFinite(value)||value<=0){connected=false;continue;}
   const X=x(index),Y=y(value);if(!Number.isFinite(X)||!Number.isFinite(Y)){connected=false;continue;}
   path+=`${connected?'L':'M'}${X.toFixed(2)},${Y.toFixed(2)}`;connected=true;
 }
 return path;
}
