// Canonical market samples are independent of the purchased display cadence.
// A logical second stays one second at 1x, with four shared risk-check samples.
export const QUOTE_GRID_VERSION=2;
export const QUOTE_SUBSTEPS=4;
export const QUOTE_DT=1/QUOTE_SUBSTEPS;
export const MARKET_BALANCE=Object.freeze({noise:.00058*.35,driftScale:.5,maxShock:.04,historyNoise:.002*.35});
const price9=value=>Number(Math.max(.001,value).toFixed(9));
export function boundedShock(value){return Number.isFinite(value)?Math.max(-MARKET_BALANCE.maxShock,Math.min(MARKET_BALANCE.maxShock,value)):0;}
export function generateQuoteGrid({startPrice,events,market,impactAt,swan=null,newsEffects=true,candlesPerBeat=4,ticksPerCandle=6}){
 if(!Number.isFinite(startPrice)||startPrice<=0||typeof market!=='function'||typeof impactAt!=='function'||!Array.isArray(events))throw Error('Invalid canonical quote input');
 let price=startPrice;
 const subtracks=events.map((event,beat)=>Array.from({length:candlesPerBeat},(_,candle)=>Array.from({length:ticksPerCandle},(_,tick)=>Array.from({length:QUOTE_SUBSTEPS},(_,subtick)=>{
   // A newly revealed release/shock is not leaked into earlier sub-samples.
   const impact=impactAt(event,{beat,candle,tick:subtick===QUOTE_SUBSTEPS-1?tick:tick-1/QUOTE_SUBSTEPS,subtick});
   const drift=newsEffects?(Number.isFinite(impact.drift)?impact.drift:0)*MARKET_BALANCE.driftScale*QUOTE_DT:0;
   const vol=newsEffects&&Number.isFinite(impact.volatility)?Math.max(0,impact.volatility):1;
   const noise=(market()+market()-1)*MARKET_BALANCE.noise*vol*Math.sqrt(QUOTE_DT);
   const shock=swan&&swan.beat===beat&&swan.candle===candle&&swan.tick===tick&&subtick===QUOTE_SUBSTEPS-1?boundedShock(swan.delta):0;
   price=price9(price*(1+drift+noise+shock));return price;
 }))));
 const tracks=subtracks.map(beat=>beat.map(candle=>candle.map(second=>second.at(-1))));
 return{gridVersion:QUOTE_GRID_VERSION,substeps:QUOTE_SUBSTEPS,tracks,subtracks};
}
export function hasCanonicalGrid(script){return script?.gridVersion===QUOTE_GRID_VERSION&&script.substeps===QUOTE_SUBSTEPS&&Array.isArray(script.subtracks);}
export function validQuoteGrid(script){
 const validTracks=Array.isArray(script?.tracks)&&script.tracks.length>0&&script.tracks.every(beat=>Array.isArray(beat)&&beat.length===4&&beat.every(candle=>Array.isArray(candle)&&candle.length===6&&candle.every(p=>Number.isFinite(p)&&p>0)));
 if(!validTracks)return false;
 if(script?.gridVersion===undefined)return script?.subtracks===undefined&&script?.substeps===undefined;
 if(!hasCanonicalGrid(script)||!Array.isArray(script.tracks)||script.subtracks.length!==script.tracks.length)return false;
 return script.tracks.every((beat,b)=>Array.isArray(beat)&&beat.length===4&&Array.isArray(script.subtracks[b])&&script.subtracks[b].length===4&&beat.every((candle,c)=>Array.isArray(candle)&&candle.length===6&&Array.isArray(script.subtracks[b][c])&&script.subtracks[b][c].length===6&&candle.every((endpoint,t)=>{
   const samples=script.subtracks[b][c][t];return Number.isFinite(endpoint)&&endpoint>0&&Array.isArray(samples)&&samples.length===QUOTE_SUBSTEPS&&samples.every(p=>Number.isFinite(p)&&p>0)&&samples.at(-1)===endpoint;
 })));
}
function gridSubsteps(script){if(script?.gridVersion===undefined)return 1;if(!hasCanonicalGrid(script))throw Error('Canonical quote metadata is damaged');return QUOTE_SUBSTEPS;}
export function quoteStepMilliseconds(script,speed=1){return 1000/(gridSubsteps(script)*(Number.isFinite(speed)&&speed>0?speed:1));}
export function visibleQuoteStep({script,subtick=0,hz=1,important=false}={}){
 const substeps=gridSubsteps(script);if(important||substeps===1)return true;
 if(!Number.isInteger(subtick)||subtick<0||subtick>=QUOTE_SUBSTEPS)throw Error('Canonical quote cursor is damaged');
 const rate=[1,2,4].includes(hz)?hz:1;return(subtick+1)%(QUOTE_SUBSTEPS/rate)===0;
}
export function quoteSubstep(script,cursor){
 const endpoint=script?.tracks?.[cursor.beat]?.[cursor.candle]?.[cursor.tick];
 if(!Number.isFinite(endpoint)||endpoint<=0)throw Error('Stored quote endpoint is damaged');
 if(gridSubsteps(script)===1)return endpoint;
 const subtick=cursor.subtick===undefined?0:cursor.subtick;
 if(!Number.isInteger(subtick)||subtick<0||subtick>=QUOTE_SUBSTEPS)throw Error('Canonical quote cursor is damaged');
 const samples=script.subtracks?.[cursor.beat]?.[cursor.candle]?.[cursor.tick];
 if(!Array.isArray(samples)||samples.length!==QUOTE_SUBSTEPS||samples.some(p=>!Number.isFinite(p)||p<=0))throw Error('Canonical quote grid is damaged');
 // Developers/tests may replace a scripted second explicitly. Never retain
 // hidden old samples after its authoritative stored endpoint was replaced.
 return samples.at(-1)===endpoint?samples[subtick]:endpoint;
}
