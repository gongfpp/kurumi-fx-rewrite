// Canonical market samples are independent of the purchased display cadence.
// A logical second stays one second at 1x, with four shared risk-check samples.
export const QUOTE_GRID_VERSION=2;
export const QUOTE_SUBSTEPS=4;
export const QUOTE_DT=1/QUOTE_SUBSTEPS;
// A market day contains 96 logical seconds. Rare news can still gap, but daily
// roulette and mandatory weekly shocks must not make consecutive days violent.
export const MARKET_BALANCE=Object.freeze({noise:.00058*.28,driftScale:.5,maxShock:.012,shockScale:.3,shockChance:.12,shockCooldownDays:2,historyNoise:.002*.28});
// Simulation presets, not a fit to real historical returns. One logical second
// represents 2.5 market minutes; changing display Hz/speed/period never changes it.
export const SIMULATION_CALIBRATION=Object.freeze({
 'USD/JPY':Object.freeze({scale:1,maxShock:.006}),
 'AUD/JPY':Object.freeze({scale:1.25,maxShock:.0075}),
 'GBP/JPY':Object.freeze({scale:1.45,maxShock:.0087})
});
export function simulationCalibration(symbol='USD/JPY',tickMinutes=2.5){
 const profile=SIMULATION_CALIBRATION[symbol];
 if(!profile||!Number.isFinite(tickMinutes)||tickMinutes<=0)throw Error('Invalid simulation calibration');
 const time=tickMinutes/2.5;
 return {noise:MARKET_BALANCE.noise*profile.scale*Math.sqrt(time),driftScale:MARKET_BALANCE.driftScale*profile.scale*time,maxShock:profile.maxShock,shockScale:MARKET_BALANCE.shockScale*.5*profile.scale*Math.sqrt(time)};
}
// Candidate rolls are a pure function of seed/day supplied by the engine. Looking
// back at candidates (rather than mutable run state) gives a strict quiet period
// and the same day schedule when loading, skipping days or changing display Hz.
export function shouldScheduleShock(day,rollForDay){
 if(!Number.isSafeInteger(day)||day<1||typeof rollForDay!=='function')throw Error('Invalid shock schedule input');
 const candidate=d=>{const roll=rollForDay(d);if(!Number.isFinite(roll)||roll<0||roll>=1)throw Error('Invalid shock schedule roll');return roll<MARKET_BALANCE.shockChance;};
 if(!candidate(day))return false;
 for(let ago=1;ago<=MARKET_BALANCE.shockCooldownDays&&day>ago;ago++)if(candidate(day-ago))return false;
 return true;
}
const price9=value=>Number(Math.max(.001,value).toFixed(9));
export function boundedShock(value,maxShock=MARKET_BALANCE.maxShock){return Number.isFinite(value)?Math.max(-maxShock,Math.min(maxShock,value)):0;}
// Return the actual price jump so stored news metadata describes the new path.
export function calibratedShock(value,options={}){const profile=simulationCalibration(options.symbol,options.tickMinutes);return boundedShock(value*profile.shockScale,profile.maxShock);}
export function generateQuoteGrid({startPrice,events,market,impactAt,swan=null,newsEffects=true,symbol='USD/JPY',tickMinutes=2.5,candlesPerBeat=4,ticksPerCandle=6}){
 if(!Number.isFinite(startPrice)||startPrice<=0||typeof market!=='function'||typeof impactAt!=='function'||!Array.isArray(events))throw Error('Invalid canonical quote input');
 const profile=simulationCalibration(symbol,tickMinutes);let price=startPrice;
 const subtracks=events.map((event,beat)=>Array.from({length:candlesPerBeat},(_,candle)=>Array.from({length:ticksPerCandle},(_,tick)=>Array.from({length:QUOTE_SUBSTEPS},(_,subtick)=>{
   // A newly revealed release/shock is not leaked into earlier sub-samples.
   const impact=impactAt(event,{beat,candle,tick:subtick===QUOTE_SUBSTEPS-1?tick:tick-1/QUOTE_SUBSTEPS,subtick});
   const drift=newsEffects?(Number.isFinite(impact.drift)?impact.drift:0)*profile.driftScale*QUOTE_DT:0;
   const vol=newsEffects&&Number.isFinite(impact.volatility)?Math.max(0,impact.volatility):1;
   const noise=(market()+market()-1)*profile.noise*vol*Math.sqrt(QUOTE_DT);
   const shock=newsEffects&&swan&&swan.beat===beat&&swan.candle===candle&&swan.tick===tick&&subtick===QUOTE_SUBSTEPS-1?boundedShock(swan.delta,profile.maxShock):0;
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
