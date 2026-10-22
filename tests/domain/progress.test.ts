import { describe, it, expect } from 'vitest';
import { createGame } from '../../src/domain/core/state';
import { evaluateAchievements } from '../../src/domain/progress/achievements';
import { classifyEnding } from '../../src/domain/progress/ending';
import { useSupply, supplyUnavailableReason } from '../../src/domain/economy/supplies';
import { placeOrder } from '../../src/domain/trading/order';
import { closePosition } from '../../src/domain/trading/close';

describe('achievements', () => {
  it('unlocks first-profit after a winning close', () => {
    const s = createGame(1);
    placeOrder(s, { type: 'long', leverage: 25, amount: 10_000 });
    s.price += 1; // profit
    closePosition(s, 1, 'manual');
    const map = evaluateAchievements(s);
    expect(map['first-profit']?.unlocked).toBe(true);
  });

  it('unlocks liquidated after a margin call', () => {
    const s = createGame(1);
    s.cash = 10_000;
    s.reserve = 0;
    placeOrder(s, { type: 'long', leverage: 25, amount: 4_000 });
    s.price = 135;
    closePosition(s, 1, 'liquidation');
    expect(evaluateAchievements(s).liquidated?.unlocked).toBe(true);
  });

  it('tracks progress for counters without unlocking early', () => {
    const s = createGame(1);
    const map = evaluateAchievements(s);
    expect(map['thirty-days']?.progress).toBe(0);
    expect(map['thirty-days']?.unlocked).toBe(false);
  });
});

describe('endings', () => {
  it('returns null while still in progress', () => {
    expect(classifyEnding(createGame(1))).toBeNull();
  });

  it('classifies broke when equity collapses', () => {
    const s = createGame(1, { mode: 'endless' });
    s.cash = 500;
    expect(classifyEnding(s)?.baseId).toBe('broke');
  });

  it('classifies the million target', () => {
    const s = createGame(1);
    s.cash += 20_000_000;
    expect(classifyEnding(s)?.baseId).toBe('million');
  });

  it('marks a debt-exit variant when walking away with debt', () => {
    const s = createGame(1);
    s.family = { outstanding: 100_000 };
    s.externalFunding = 100_000;
    const res = classifyEnding(s, { walkaway: true });
    expect(res?.baseId).toBe('walkaway');
    expect(res?.variant).toBe('debt-exit');
  });
});

describe('supplies', () => {
  it('applies stamina and meal credit and blocks a second meal', () => {
    const s = createGame(1);
    const before = s.cash;
    const receipt = useSupply(s, 'takeaway');
    expect(receipt.applied).toBe(true);
    expect(s.cash).toBe(before - 1200);
    expect(s.dailySupplies?.mealCreditDay).toBe(1);
    // A second meal item is refused today.
    expect(supplyUnavailableReason(s, 'noodles')).toBe('今天已经吃过这一餐了');
  });

  it('refuses a supply when cash is insufficient', () => {
    const s = createGame(1);
    s.cash = 100;
    expect(supplyUnavailableReason(s, 'takeaway')).toBe('现金不足');
  });
});