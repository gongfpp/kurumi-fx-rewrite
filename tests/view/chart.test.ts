import { describe, it, expect } from 'vitest';
import { layoutCandles, movingAverage, priceRange, priceToY, yToPrice } from '../../src/view/charts/candles';
import type { Candle } from '../../src/domain/core/types';

const candle = (open: number, high: number, low: number, close: number): Candle => ({ open, high, low, close, closed: true, day: 1, beat: 0 });

describe('chart layout', () => {
  const vp = { width: 400, height: 200, padding: 16 };

  it('computes a padded price range', () => {
    const r = priceRange([candle(150, 151, 149, 150.5)]);
    expect(r.min).toBe(149);
    expect(r.max).toBe(151);
  });

  it('maps prices into the viewport with high prices near the top', () => {
    const top = priceToY(200, 100, 200, vp);
    const bottom = priceToY(100, 100, 200, vp);
    expect(top).toBeLessThan(bottom);
    expect(top).toBeGreaterThanOrEqual(vp.padding);
  });

  it('round-trips price to y and back', () => {
    const y = priceToY(153.2, 100, 200, vp);
    expect(yToPrice(y, 100, 200, vp)).toBeCloseTo(153.2, 6);
  });

  it('lays out one entry per candle with width within the slot', () => {
    const candles = [candle(150, 151, 149, 150.5), candle(150.5, 152, 150, 151)];
    const out = layoutCandles(candles, vp);
    expect(out).toHaveLength(2);
    expect(out[0]!.x).toBeLessThan(out[1]!.x);
    expect(out[0]!.width).toBeGreaterThanOrEqual(1);
    expect(out[0]!.bullish).toBe(true);
  });

  it('computes a trailing moving average', () => {
    const candles = [candle(1, 1, 1, 1), candle(1, 1, 1, 2), candle(1, 1, 1, 3)];
    expect(movingAverage(candles, 2)).toEqual([null, 1.5, 2.5]);
  });
});
import { bollinger } from '../../src/view/charts/candles';

describe('bollinger bands', () => {
  it('returns nulls until the window is full, then a mid equal to the SMA', () => {
    const cs = [1, 2, 3, 4, 5].map((v) => candle(v, v, v, v));
    const b = bollinger(cs, 3, 2);
    expect(b.mid[0]).toBeNull();
    expect(b.mid[1]).toBeNull();
    expect(b.mid[2]).toBeCloseTo(2, 6);
    expect(b.upper[2]! > b.mid[2]!).toBe(true);
    expect(b.lower[2]! < b.mid[2]!).toBe(true);
  });
});

import { volumeMA, approxVolume } from '../../src/view/charts/candles';

describe('volume moving average', () => {
  it('averages the approximate volume over the window', () => {
    const cs = [candle(1, 3, 1, 2), candle(2, 5, 2, 3)];
    expect(approxVolume(cs)).toEqual([2, 3]);
    expect(volumeMA(cs, 2)).toEqual([null, 2.5]);
  });
});
