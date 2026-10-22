import { describe, it, expect } from 'vitest';
import { createGame } from '../../src/domain/core/state';
import { advanceQuote, beginPlay, beginRest, endingCondition, finalizeDayLiving, nextDay, settleDay } from '../../src/domain/core/day';
import { placeOrder } from '../../src/domain/trading/order';
import { equity } from '../../src/domain/trading/account';

describe('story day loop', () => {
  it('runs a full day and advances to the next', () => {
    const s = createGame(1, { mode: 'story' });
    placeOrder(s, { type: 'long', leverage: 25, amount: 10_000 });

    let guard = 0;
    while (s.phase !== 'closing' && guard++ < 5000) {
      if (s.phase === 'decision') beginPlay(s);
      else advanceQuote(s);
    }
    expect(s.phase).toBe('closing');
    expect(s.completedCandles).toBe(4 * 4);

    const report = settleDay(s);
    expect(s.phase).toBe('day_end');
    expect(s.positions).toHaveLength(0);
    expect(report.day).toBe(1);
    expect(Number.isFinite(report.closing)).toBe(true);

    finalizeDayLiving(s);
    beginRest(s);
    expect(s.phase).toBe('resting');
    nextDay(s);
    expect(s.day).toBe(2);
    expect(s.phase).toBe('decision');
    expect(s.reserve).toBe(1500);
  });

  it('detects the broke ending when equity collapses', () => {
    const s = createGame(1, { mode: 'endless' });
    s.cash = 500;
    expect(endingCondition(s)).toBe('broke');
  });

  it('detects the million ending at the profit target', () => {
    const s = createGame(1, { mode: 'story' });
    s.cash += 20_000_000;
    expect(endingCondition(s)).toBe('million');
  });

  it('keeps equity finite through a day', () => {
    const s = createGame(9, { mode: 'story' });
    placeOrder(s, { type: 'short', leverage: 25, amount: 5_000 });
    let guard = 0;
    while (s.phase !== 'closing' && guard++ < 5000) {
      if (s.phase === 'decision') beginPlay(s);
      else advanceQuote(s);
    }
    expect(Number.isFinite(equity(s))).toBe(true);
  });
});