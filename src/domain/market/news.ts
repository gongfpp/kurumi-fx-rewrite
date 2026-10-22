import type { ScriptEvent } from './quote-grid';

/** News is revealed mid-beat; the flash lands on candle 1, tick 2. */
export const NEWS_FLASH_CANDLE = 1;
export const NEWS_FLASH_TICK = 2;
const TICKS_PER_CANDLE = 6;

export interface NewsImpact {
  drift: number;
  volatility: number;
  revealed: boolean;
}

/**
 * Facts and variant do not select a price direction; a separate seeded response
 * chooses continuation, range or retracement. Noise can overwhelm every impulse.
 */
export function newsImpact(event: ScriptEvent, { day, beat, candle, tick }: { day: number; beat: number; candle: number; tick: number }): NewsImpact {
  const elapsed = candle * TICKS_PER_CANDLE + tick;
  const release = NEWS_FLASH_CANDLE * TICKS_PER_CANDLE + NEWS_FLASH_TICK;
  const revealed = beat % 2 === 1 || elapsed >= release;
  const response = event.response;
  const age = beat % 2 ? 24 - release + elapsed : Math.max(0, elapsed - release);
  const decay = Math.exp(-age / 12);
  const phase = !revealed ? 0.35 : response?.behavior === 'retrace' ? -decay : response?.behavior === 'range' ? 0.08 * decay : 0.7 * decay;
  const impulse = Number.isFinite(response?.impulse) ? (response?.impulse as number) : 0;
  const vol = Number.isFinite(event.vol) ? Math.max(1, event.vol) : 1;
  return {
    drift: impulse * phase * (0.00007 + (day % 3) * 0.00001),
    volatility: !revealed ? vol : 1 + (vol - 1) * decay * (event.variant === 'muted' ? 0.25 : 1),
    revealed,
  };
}