import { describe, it, expect } from 'vitest';
import { createGame } from '../../src/domain/core/state';
import { accountMetrics, equity, positionsOf } from '../../src/domain/trading/account';
import type { Position } from '../../src/domain/core/types';

function makePosition(over: Partial<Position> = {}): Position {
  const margin = over.margin ?? 10_000;
  const leverage = over.leverage ?? 25;
  return {
    id: 'order-1',
    symbol: 'USD/JPY',
    direction: 1,
    entry: 150,
    margin,
    initialMargin: margin,
    leverage,
    notional: margin * leverage,
    stop: 1,
    openFeeRemaining: 0,
    openFee: 0,
    maxUnrealized: 0,
    ...over,
  };
}

describe('account metrics', () => {
  it('reserves living cost at story open so equity equals principal', () => {
    const s = createGame(1, { mode: 'story' });
    expect(s.cash).toBe(298_500);
    expect(s.reserve).toBe(1500);
    expect(equity(s)).toBe(300_000);
  });

  it('marks floating profit into equity', () => {
    const s = createGame(1);
    s.cash = 100_000;
    s.reserve = 0;
    s.positions = [makePosition({ entry: 150 })];
    s.position = s.positions[0] as Position;
    s.price = 151;
    const m = accountMetrics(s);
    // qty = 250000 / 150 = 1666.667 -> 1 pip move gives 1666.67
    expect(m.unrealized).toBeCloseTo(1666.6667, 3);
    expect(m.usedMargin).toBe(10_000);
    expect(m.tradingEquity).toBeCloseTo(111_666.6667, 3);
    expect(m.marginLevel).toBeCloseTo(11.1667, 3);
  });

  it('exposes positions through both authoritative and legacy views', () => {
    const s = createGame(1);
    const p = makePosition();
    s.positions = [p];
    s.position = p;
    expect(positionsOf(s)).toHaveLength(1);
    s.positions = [];
    expect(positionsOf(s)).toHaveLength(1);
  });
});