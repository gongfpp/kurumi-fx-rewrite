import { describe, it, expect } from 'vitest';
import { createGame } from '../../src/domain/core/state';
import { previewOrder, placeOrder } from '../../src/domain/trading/order';
import { equity } from '../../src/domain/trading/account';
import { recomputeSanity, restrictions } from '../../src/domain/mind/sanity';

describe('order preview and placement', () => {
  it('accepts a valid long order and charges the open fee', () => {
    const s = createGame(1);
    const preview = previewOrder(s, { type: 'long', leverage: 25, amount: 10_000 });
    expect(preview.valid).toBe(true);
    expect(preview.margin).toBe(10_000);
    expect(preview.notional).toBe(250_000);
    expect(preview.openFee).toBeCloseTo(12.5, 4);

    const before = s.cash;
    placeOrder(s, { type: 'long', leverage: 25, amount: 10_000 });
    expect(s.positions).toHaveLength(1);
    expect(s.cash).toBeCloseTo(before - 10_000 - 12.5, 4);
    expect(s.positions[0]?.openFeeRemaining).toBeCloseTo(12.5, 4);
  });

  it('rejects invalid leverage and margin below the floor', () => {
    const s = createGame(1);
    expect(previewOrder(s, { type: 'long', leverage: 30, amount: 10_000 }).error).toBe('订单参数无效');
    expect(previewOrder(s, { type: 'long', leverage: 25, amount: 50 }).error).toBe('保证金至少需要 ¥100');
  });

  it('rejects orders beyond available margin', () => {
    const s = createGame(1);
    const preview = previewOrder(s, { type: 'long', leverage: 100, amount: 10_000_000 });
    expect(preview.valid).toBe(false);
    expect(preview.error).toBeTruthy();
  });

  it('blocks entry when sanity is exhausted', () => {
    const s = createGame(1);
    s.sanity = 5;
    expect(previewOrder(s, { type: 'long', leverage: 25, amount: 10_000 }).error).toBe('承受力过低，先休息');
    expect(restrictions(s).noEntry).toBe(true);
  });

  it('limits leverage by sanity band', () => {
    const s = createGame(1);
    s.sanity = 30;
    expect(restrictions(s).leverage).toBe(25);
    expect(previewOrder(s, { type: 'long', leverage: 50, amount: 10_000 }).error).toBe('心理承受力不足，无法使用这个杠杆');
  });

  it('keeps equity conserving through sanity recompute', () => {
    const s = createGame(1);
    recomputeSanity(s);
    expect(equity(s)).toBe(300_000);
    expect(s.sanity).toBeGreaterThanOrEqual(0);
    expect(s.sanity).toBeLessThanOrEqual(100);
  });
});