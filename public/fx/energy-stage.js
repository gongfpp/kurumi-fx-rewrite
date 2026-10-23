// Durations are fractions of a trading day, never animation frames or device ticks.
// Formal parameters are centralized so saved episodes retain their exact policy.
import {ENERGY_POLICY} from './economy-plan-config.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
const validProgress=value=>Number.isFinite(value)&&value>=0&&value<=1;
function validatePolicy(policy){
 if(!policy||!['boostDuration','fatigueDuration'].every(key=>Number.isFinite(policy[key])&&policy[key]>=0&&policy[key]<=1)||!['boostMultiplier','fatigueMultiplier'].every(key=>Number.isFinite(policy[key])&&policy[key]>0))throw new TypeError('Invalid energy policy');
}
export function activateEnergyEffect(state,{progress,policy=ENERGY_POLICY}={}){
 if(!validProgress(progress))throw new TypeError('Invalid trading-day progress');validatePolicy(policy);
 if(state.energyEffect?.day===state.day)throw Error('今天已经用过了');
 state.energyEffect={version:1,day:state.day,startProgress:progress,elapsed:0,lastDay:state.day,lastProgress:progress,boostDuration:policy.boostDuration,fatigueDuration:policy.fatigueDuration,boostMultiplier:policy.boostMultiplier,fatigueMultiplier:policy.fatigueMultiplier};
 return energyStageStatus(state,progress);
}
export function advanceEnergyEffect(state,progress){
 if(!validProgress(progress))throw new TypeError('Invalid trading-day progress');
 const effect=state.energyEffect;if(!effect)return null;
 const delta=state.day===effect.lastDay?progress-effect.lastProgress:progress;
 if(delta>0){effect.elapsed+=delta;effect.lastDay=state.day;effect.lastProgress=progress;}
 return energyStageStatus(state,progress);
}
export function energyStageStatus(state,progress){
 const effect=state.energyEffect;if(!effect)return {phase:'normal',multiplier:1,remaining:0};
 if(!validProgress(progress))throw new TypeError('Invalid trading-day progress');
 const elapsed=effect.elapsed+Math.max(0,state.day===effect.lastDay?progress-effect.lastProgress:progress);
 const boostEnd=effect.boostDuration,fatigueEnd=boostEnd+effect.fatigueDuration;
 const phase=elapsed<boostEnd?'boost':elapsed<fatigueEnd?'fatigue':'normal';
 return {phase,multiplier:phase==='boost'?effect.boostMultiplier:phase==='fatigue'?effect.fatigueMultiplier:1,remaining:Math.max(0,(phase==='boost'?boostEnd:fatigueEnd)-elapsed),label:phase==='boost'?'提神中':phase==='fatigue'?'疲劳中':'',description:phase==='boost'?'暂时提神，之后盯盘会更耗体力。':phase==='fatigue'?'提神后的疲劳，盯盘更耗体力。':''};
}
export function energyDrainMultiplier(state,progress){return energyStageStatus(state,progress).multiplier;}
export function clearEnergyAfterSleep(state){const existed=!!state.energyEffect;delete state.energyEffect;return existed;}
export function validEnergyEffect(effect){
 if(effect===undefined)return true;
 try{validatePolicy(effect);return effect.version===1&&Number.isSafeInteger(effect.day)&&effect.day>=1&&Number.isSafeInteger(effect.lastDay)&&effect.lastDay>=effect.day&&validProgress(effect.startProgress)&&validProgress(effect.lastProgress)&&Number.isFinite(effect.elapsed)&&effect.elapsed>=0;}catch{return false;}
}

// Integrate each interval exactly, so batching quotes cannot change the cost.
export function energyCostForDuration(state,duration){
 if(!Number.isFinite(duration)||duration<0)throw new TypeError('Invalid energy duration');
 const effect=state.energyEffect;if(!effect)return duration;
 let cursor=effect.elapsed,remaining=duration,cost=0;
 for(const [end,multiplier] of [[effect.boostDuration,effect.boostMultiplier],[effect.boostDuration+effect.fatigueDuration,effect.fatigueMultiplier],[Infinity,1]]){
  const part=Math.min(remaining,Math.max(0,end-cursor));cost+=part*multiplier;cursor+=part;remaining-=part;
 }
 effect.elapsed+=duration;effect.lastDay=state.day;effect.lastProgress=Math.min(1,(state.stamina?.progressDay===state.day?state.stamina.dayProgress||0:0)+duration);
 return cost;
}
