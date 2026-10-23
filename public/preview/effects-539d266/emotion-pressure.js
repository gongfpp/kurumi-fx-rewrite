// A saved, bounded impulse. This never edits an order, cash, debt or unlock flag.
export const PRESSURE_TAPS = 12;
export const PRESSURE_GRACE_MS = 8000;
export const PRESSURE_DECAY_MS = 2000;
export const PRESSURE_TAP_INTERVAL_MS = 80;
const finite = (value, fallback=0) => Number.isFinite(value) ? value : fallback;
const clamp = (value, low=0, high=1) => Math.max(low, Math.min(high, finite(value)));
const context = s => `${s.mode || 'story'}:${s.runId || s.seed}:${s.day}`;

export function pressureStatus(s, now=Date.now()) {
  const p=s?.emotionPressure;
  if (!p || p.context!==context(s) || !['ecstatic','despair'].includes(p.direction)
      || !Number.isInteger(p.taps) || p.taps<1 || p.taps>PRESSURE_TAPS
      || !Number.isFinite(p.lastAt) || !Number.isFinite(now) || p.lastAt>now+1000)
    return {taps:0, intensity:0, extreme:false, direction:null, remainingMs:0};
  const elapsed=Math.max(0,now-p.lastAt);
  const cooled=Math.floor(Math.max(0,elapsed-PRESSURE_GRACE_MS)/PRESSURE_DECAY_MS);
  const taps=Math.max(0,p.taps-cooled);
  return {taps,intensity:taps/PRESSURE_TAPS,extreme:taps===PRESSURE_TAPS,
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
  const taps=Math.min(PRESSURE_TAPS,previous.taps+1);
  s.emotionPressure={context:context(s),direction,taps,lastAt:now};
  // The existing psychological system bears the cost and recovers normally.
  s.stress=Math.max(0,finite(s.stress))+.5;
  if (taps%3===0) s.heat=clamp(finite(s.heat)+1,0,5);
  return {accepted:true,unlocked:taps===PRESSURE_TAPS,...pressureStatus(s,now)};
}

export function pressureFeedback(intensity) {
  const value=clamp(intensity);
  return {rate:.9+.35*value,level:.18+.32*value,displacement:1+3*value,duration:120+80*value};
}
