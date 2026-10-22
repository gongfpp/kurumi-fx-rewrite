import { describe, it, expect } from 'vitest';
import { createGame } from '../../src/domain/core/state';
import { enforceMargin } from '../../src/domain/trading/close';
import type { Position } from '../../src/domain/core/types';

function underwaterPosition(): Position {
  const margin = 10_000;
  return {
    id: 'order-1',
    symbol: 'USD/JPY',
    direction: 1,
    entry: 150,
    margin,
    initialMargin: margin,
    leverage: 25,
    notional: margin * 25,
    stop: 1,
    openFeeRemaining: 0,
    openFee: 0,
    maxUnrealized: 0,
  };
}

describe('margin enforcement', () => {
  it('liquidates the worst position when margin level crosses stop-out', () => {
    const s = createGame(1);
    s.cash = 10_000;
    s.reserve = 0;
    s.positions = [underwaterPosition()];
    s.position = s.positions[0] as Position;
    // floating = 1666.667 * (137-150) = -21666.67 ; equity goes negative
    s.price = 137;

    const exits = enforceMargin(s);
    expect(exits).toHaveLength(1);
    expect(exits[0]?.type).toBe('liquidation');
    expect(s.positions).toHaveLength(0);
    // Cross-margin protection caps the loss at the posted margin, never below zero cash.
    expect(s.cash).toBe(0);
    expect(exits[0]?.pnl).toBeCloseTo(-20_000, 2);
  });

  it('returns margin without protection when the loss is affordable', () => {
    const s = createGame(1);
    s.cash = 10_000;
    s.reserve = 0;
    s.positions = [underwaterPosition()];
    s.position = s.positions[0] as Position;
    // floating = -15000 ; cash 10000 + margin 10000 - loss leaves a positive balance
    s.price = 141;

    const exits = enforceMargin(s);
    expect(exits).toHaveLength(1);
    expect(s.cash).toBeCloseTo(4_987.5, 2);
    expect(exits[0]?.pnl).toBeCloseTo(-15_012.5, 2);
  });

  it('does not liquidate a healthy account', () => {
    const s = createGame(1);
    s.cash = 100_000;
    s.reserve = 0;
    s.positions = [underwaterPosition()];
    s.position = s.positions[0] as Position;
    s.price = 150;
    const exits = enforceMargin(s);
    expect(exits).toHaveLength(0);
    expect(s.positions).toHaveLength(1);
  });
});