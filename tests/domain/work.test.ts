import { describe, it, expect } from 'vitest';
import { createGame } from '../../src/domain/core/state';
import { calculateWorkPay, doWork, LIFE_WORK_JOBS } from '../../src/domain/economy/work';

describe('work', () => {
  it('pays the base wage for a full shift and scales partial shifts', () => {
    expect(calculateWorkPay(30, 30, 5000)).toBe(5000);
    expect(calculateWorkPay(15, 30, 5000)).toBe(2500);
    expect(LIFE_WORK_JOBS.length).toBeGreaterThanOrEqual(4);
  });

  it('adds non-trading income and consumes stamina', () => {
    const s = createGame(1);
    s.stamina.value = 100;
    const before = s.cash;
    const receipt = doWork(s, 'cafe');
    expect(receipt.applied).toBe(true);
    expect(receipt.income).toBeGreaterThan(0);
    expect(s.cash).toBe(before + receipt.income);
    expect(s.nonTradingIncome).toBe(receipt.income);
    expect(s.stamina.value).toBe(100 - receipt.staminaCost);
  });

  it('refuses work with no stamina', () => {
    const s = createGame(1);
    s.stamina.value = 0;
    expect(doWork(s, 'cafe').applied).toBe(false);
  });
});