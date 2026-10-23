import type { Candle } from '../../domain/core/types';

export interface Viewport {
  width: number;
  height: number;
  padding: number;
}

export function priceRange(candles: Candle[]): { min: number; max: number } {
  if (!candles.length) return { min: 0, max: 1 };
  let min = Infinity;
  let max = -Infinity;
  for (const c of candles) {
    min = Math.min(min, c.low);
    max = Math.max(max, c.high);
  }
  if (min === max) {
    min -= 0.5;
    max += 0.5;
  }
  return { min, max };
}

export function priceToY(price: number, min: number, max: number, viewport: Viewport): number {
  const usable = Math.max(1, viewport.height - viewport.padding * 2);
  const ratio = (price - min) / (max - min);
  return viewport.padding + (1 - ratio) * usable;
}

export function yToPrice(y: number, min: number, max: number, viewport: Viewport): number {
  const usable = Math.max(1, viewport.height - viewport.padding * 2);
  const ratio = 1 - (y - viewport.padding) / usable;
  return min + ratio * (max - min);
}

export interface CandleLayout {
  x: number;
  yHigh: number;
  yLow: number;
  yOpen: number;
  yClose: number;
  width: number;
  bullish: boolean;
}

export function layoutCandles(candles: Candle[], viewport: Viewport): CandleLayout[] {
  const { min, max } = priceRange(candles);
  const usableWidth = Math.max(1, viewport.width - viewport.padding * 2);
  const slot = usableWidth / Math.max(1, candles.length);
  const width = Math.max(1, Math.min(14, slot * 0.62));
  return candles.map((c, i) => {
    const center = viewport.padding + slot * (i + 0.5);
    return {
      x: center,
      yHigh: priceToY(c.high, min, max, viewport),
      yLow: priceToY(c.low, min, max, viewport),
      yOpen: priceToY(c.open, min, max, viewport),
      yClose: priceToY(c.close, min, max, viewport),
      width,
      bullish: c.close >= c.open,
    };
  });
}

/** Simple moving average over closes; undefined until the window is full. */
export function movingAverage(candles: Candle[], window: number): (number | null)[] {
  const out: (number | null)[] = [];
  let sum = 0;
  for (let i = 0; i < candles.length; i++) {
    sum += candles[i]!.close;
    if (i >= window) sum -= candles[i - window]!.close;
    out.push(i >= window - 1 ? sum / window : null);
  }
  return out;
}
/** Bollinger bands (mid = SMA, upper/lower = mid ± mult * stddev). */
export function bollinger(candles: Candle[], period = 20, mult = 2): { mid: (number | null)[]; upper: (number | null)[]; lower: (number | null)[] } {
  const mid: (number | null)[] = [];
  const upper: (number | null)[] = [];
  const lower: (number | null)[] = [];
  for (let i = 0; i < candles.length; i++) {
    if (i < period - 1) {
      mid.push(null);
      upper.push(null);
      lower.push(null);
      continue;
    }
    let sum = 0;
    for (let j = i - period + 1; j <= i; j++) sum += candles[j]!.close;
    const m = sum / period;
    let variance = 0;
    for (let j = i - period + 1; j <= i; j++) variance += (candles[j]!.close - m) ** 2;
    const sd = Math.sqrt(variance / period);
    mid.push(m);
    upper.push(m + mult * sd);
    lower.push(m - mult * sd);
  }
  return { mid, upper, lower };
}
