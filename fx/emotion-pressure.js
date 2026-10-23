// A saved, bounded impulse. This never edits an order, cash, debt or unlock flag.
export const PRESSURE_TAPS = 5;
export const PRESSURE_GRACE_MS = 8000;
export const PRESSURE_DECAY_MS = 2000;
export const PRESSURE_TAP_INTERVAL_MS = 80;
const finite = (value, fallback=0) => Number.isFinite(value) ? value : fallback;
const clamp = (value, low=0, high=1) => Math.max(low, Math.min(high, finite(value)));
const context = s => `${s.mode || 'story'}:${s.runId || s.seed}:${s.day}`;

// Match the existing psychological risk caps (40 / 65), for either mood.
export function pressureTarget(s,{kind,value,limits,hardBlocked=false}={}) {
 if(emotionControlState({kind,value,limits,hardBlocked})!=='soft')return 0;
 const threshold=kind==='leverage'?(value>50?65:40):(value>.5?65:40);
 const gap=Math.max(0,threshold-finite(s.sanity,50));
 return gap<=10?3:gap<=25?4:5;
}
export function pressureStatus(s, now=Date.now()) {
  const p=s?.emotionPressure;
  // Old saved bursts retain their original denominator; no financial migration.
  const target=p?.target??12;
  if (!p || p.context!==context(s) || !['ecstatic','despair'].includes(p.direction)
      || !Number.isInteger(p.taps) || p.taps<1 || p.taps>target || ![3,4,5,12].includes(target)
      || !Number.isFinite(p.lastAt) || !Number.isFinite(now) || p.lastAt>now+1000)
    return {taps:0, target:0, intensity:0, extreme:false, direction:null, remainingMs:0};
  const elapsed=Math.max(0,now-p.lastAt);
  const cooled=Math.floor(Math.max(0,elapsed-PRESSURE_GRACE_MS)/PRESSURE_DECAY_MS);
  const taps=Math.max(0,p.taps-cooled);
  return {taps,target:taps?target:0,intensity:taps/target,extreme:taps===target,
    direction:taps?p.direction:null,remainingMs:Math.max(0,PRESSURE_GRACE_MS+PRESSURE_DECAY_MS-elapsed)};
}

export function pressureMood(s, now=Date.now()) {
  const p=pressureStatus(s,now);
  return p.extreme ? p.direction : null;
}

export function pressureIntensity(s={}, emotion, now=Date.now()) {
  if (['ecstatic','despair'].includes(emotion)) return 1;
  return clamp(Math.max(pressureStatus(s,now).intensity,finite(s.heat)/5,finite(s.stress)/40));
}

export function pressureDirection({emotion,sanity,profit=0,unrealized=0}={}) {
  return finite(sanity,50)<40 || finite(profit)<0 || finite(unrealized)<0
    || ['despair','anxious','nervous','regretful','guilty','exhausted'].includes(emotion)
    ? 'despair' : 'ecstatic';
}

// hardBlocked is deliberately explicit. A lock caused by cash, market phase,
// an exhausted account, save coordination or content access is never pressure.
export function emotionControlState({kind,value,limits,hardBlocked=false}) {
  if (hardBlocked || limits?.noEntry) return 'hard';
  if (kind==='leverage') {
    if (![5,10,25,50,100].includes(value) || value<(limits?.minLeverage??5)) return 'hard';
    return value>limits.leverage ? 'soft' : 'open';
  }
  if (kind==='stake') {
    if (![.1,.25,.5,1].includes(value)) return 'hard';
    return value>limits.stake ? 'soft' : 'open';
  }
  return 'hard';
}

export function pressEmotion(s,{kind,value,limits,hardBlocked=false,emotion,profit=0,unrealized=0,now=Date.now()}={}) {
  if (emotionControlState({kind,value,limits,hardBlocked})!=='soft') return {accepted:false,reason:'not-soft-lock',...pressureStatus(s,now)};
  const previous=pressureStatus(s,now);
  if (previous.taps && now-s.emotionPressure.lastAt<PRESSURE_TAP_INTERVAL_MS)
    return {accepted:false,reason:'too-fast',...previous};
  const direction=previous.direction || pressureDirection({emotion,sanity:s.sanity,profit,unrealized});
  const target=previous.taps && previous.target!==12?previous.target:pressureTarget(s,{kind,value,limits,hardBlocked});
  const priorTaps=previous.target===12?Math.floor(previous.intensity*target):previous.taps;
  const taps=Math.min(target,priorTaps+1);
  s.emotionPressure={context:context(s),direction,taps,target,lastAt:now};
  // The existing psychological system bears the cost and recovers normally.
  s.stress=Math.max(0,finite(s.stress))+.5;
  if (taps%3===0) s.heat=clamp(finite(s.heat)+1,0,5);
  return {accepted:true,unlocked:taps===target,...pressureStatus(s,now)};
}

export function pressureFeedback(intensity) {
  const value=clamp(intensity);
  return {rate:.9+.35*value,level:.3+.5*value,displacement:1+3*value,duration:120+80*value};
}
