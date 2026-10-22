import { describe, it, expect } from 'vitest';
import { planDay } from '../../src/domain/market/sources/simulated';
import { historyCandles } from '../../src/domain/market/history';
import { hasCanonicalGrid, quoteSubstep } from '../../src/domain/market/quote-grid';
import { newsImpact } from '../../src/domain/market/news';
import type { ScriptEvent } from '../../src/domain/market/quote-grid';

describe('deterministic market plan', () => {
  it('is reproducible for the same seed and day', () => {
    const a = planDay(42, 1, 150);
    const b = planDay(42, 1, 150);
    expect(a.tracks).toEqual(b.tracks);
  });

  it('shapes four beats of four candles of six ticks', () => {
    const script = planDay(7, 3, 150);
    expect(script.tracks).toHaveLength(4);
    expect(script.tracks[0]).toHaveLength(4);
    expect(script.tracks[0]?.[0]).toHaveLength(6);
    expect(script.tracks.flat(2).every((p) => Number.isFinite(p) && p > 0)).toBe(true);
  });

  it('exposes canonical sub-samples whose last entry matches the endpoint', () => {
    const script = planDay(9, 2, 150);
    expect(hasCanonicalGrid(script)).toBe(true);
    const cursor = { beat: 0, candle: 0, tick: 0, subtick: 3 };
    expect(quoteSubstep(script, cursor)).toBe(script.tracks[0]?.[0]?.[0]);
  });

  it('differs across seeds', () => {
    const a = planDay(1, 1, 150);
    const b = planDay(2, 1, 150);
    expect(a.tracks).not.toEqual(b.tracks);
  });
});

describe('history candles', () => {
  it('is deterministic and normalizes the last close to start price', () => {
    const a = historyCandles(5);
    const b = historyCandles(5);
    expect(a).toEqual(b);
    expect(a).toHaveLength(18);
    expect(a[a.length - 1]?.close).toBeCloseTo(150, 4);
    expect(a.every((c) => c.low <= Math.min(c.open, c.close) && c.high >= Math.max(c.open, c.close))).toBe(true);
  });
});

describe('news impact', () => {
  const event: ScriptEvent = {
    id: 'x',
    chain: 'x',
    variant: 'confirmed',
    bias: 1,
    vol: 2,
    response: { impulse: 1, behavior: 'continue' },
    title: '',
    copy: '',
    source: '',
    time: '',
    flash: '',
    flashCopy: '',
  };

  it('does not leak an unrevealed release into earlier samples', () => {
    expect(newsImpact(event, { day: 1, beat: 0, candle: 0, tick: 0 }).revealed).toBe(false);
    expect(newsImpact(event, { day: 1, beat: 0, candle: 1, tick: 2 }).revealed).toBe(true);
    // Odd beats are always revealed.
    expect(newsImpact(event, { day: 1, beat: 1, candle: 0, tick: 0 }).revealed).toBe(true);
  });

  it('decays volatility after the release', () => {
    const atRelease = newsImpact(event, { day: 1, beat: 1, candle: 1, tick: 2 });
    const later = newsImpact(event, { day: 1, beat: 1, candle: 3, tick: 5 });
    expect(later.volatility).toBeLessThan(atRelease.volatility);
  });
});