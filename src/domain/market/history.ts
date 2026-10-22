import { NUMERICS } from '../../content/config/numerics';
import { mix, random } from '../core/rng';
import type { Candle } from '../core/types';
import { MARKET_BALANCE } from './quote-grid';

/**
 * Frozen pre-open history drawn before the first game candle. Deterministic for
 * a seed; normalized so the last historical close equals START_PRICE.
 */
export function historyCandles(seed: number): Candle[] {
  const rng = random(mix(seed, 0, 0x75ca));
  const candles: Candle[] = [];
  let price = NUMERICS.START_PRICE * 0.992;
  for (let i = 0; i < 18; i++) {
    const open = price;
    const points = Array.from({ length: 6 }, () => {
      price *= 1 + (rng() - 0.49) * MARKET_BALANCE.historyNoise;
      return price;
    });
    candles.push({
      open,
      close: price,
      high: Math.max(open, ...points),
      low: Math.min(open, ...points),
      closed: true,
      historical: true,
      day: 0,
      beat: 0,
    });
  }
  const ratio = NUMERICS.START_PRICE / price;
  for (const c of candles) {
    c.open *= ratio;
    c.close *= ratio;
    c.high *= ratio;
    c.low *= ratio;
  }
  return candles;
}