import { describe, it, expect } from 'vitest';
import { createGame } from '../../src/domain/core/state';
import { creditTerms, borrowNetwork, accrueLoanInterest } from '../../src/domain/economy/credit';
import { drawLotteryResult, purchaseLottery, redeemCheatLottery, settleLottery, LOTTERY_RULES } from '../../src/domain/economy/lottery';
import { livingCost, finalizeDayLiving, selectLifestyle } from '../../src/domain/economy/living';
import { random } from '../../src/domain/core/rng';

describe('credit terms', () => {
  it('uses the fixed story limit and base rate', () => {
    const t = creditTerms({ assets: 300_000, availableCash: 100_000, familyDebt: 0, networkDebt: 0, mode: 'story' });
    expect(t.limit).toBe(300_000);
    expect(t.dailyRate).toBeCloseTo(0.0005, 8);
  });

  it('stays within the rate band in endless mode', () => {
    const low = creditTerms({ assets: 1_000_000, availableCash: 0, networkDebt: 0, mode: 'endless' });
    const high = creditTerms({ assets: 10_000, availableCash: 0, networkDebt: 2_900_000, borrowCount: 20, emotionIntensity: 1, mode: 'endless' });
    expect(low.dailyRate).toBeGreaterThanOrEqual(0.0005);
    expect(high.dailyRate).toBeLessThanOrEqual(0.008);
    expect(high.limit).toBeGreaterThanOrEqual(300_000);
    expect(high.limit).toBeLessThanOrEqual(3_000_000);
  });

  it('borrows within credit and accrues interest once per day', () => {
    const s = createGame(1, { mode: 'endless' });
    const before = s.cash;
    const res = borrowNetwork(s, 300_000);
    expect(res.applied).toBe(true);
    expect(s.cash).toBe(before + 300_000);
    const first = accrueLoanInterest(s);
    const second = accrueLoanInterest(s);
    expect(first.interest).toBeGreaterThan(0);
    expect(second.interest).toBe(0);
  });
});

describe('lottery', () => {
  it('draws deterministically from a seeded rng', () => {
    const a = drawLotteryResult(LOTTERY_RULES, random(7));
    const b = drawLotteryResult(LOTTERY_RULES, random(7));
    expect(a.tier).toBe(b.tier);
    expect(a.prize).toBe(b.prize);
  });

  it('always resolves the cheat code to the top prize', () => {
    const s = createGame(1);
    const res = redeemCheatLottery(s, '201402');
    expect(res.applied).toBe(true);
    expect(res.excludePublicRanking).toBe(true);
    // Advance to the draw day and settle.
    s.day = 2;
    const settled = settleLottery(s, { endOfDay: true, rng: random(1) });
    expect(settled.cheatCredit).toBe(20_000_000);
  });

  it('debits the ticket price', () => {
    const s = createGame(1);
    const before = s.cash;
    const res = purchaseLottery(s);
    expect(res.applied).toBe(true);
    expect(s.cash).toBe(before - 300);
  });
});

describe('living costs', () => {
  it('charges the base lifestyle amount and honors housing upgrades', () => {
    const s = createGame(1, { mode: 'story' });
    s.phase = 'day_end';
    s.dayReport = { day: 1, beat: 4, opening: 300_000, closing: 300_000, net: 0, tradeNet: 0, funding: 0, costs: 0, interest: 0, fees: 0, livingCost: 0, pendingLivingCost: 0, mood: 'calm' };
    expect(livingCost(s)).toBe(1500);
    selectLifestyle(s, 'generous');
    expect(livingCost(s)).toBe(6000);
    const receipt = finalizeDayLiving(s);
    expect(receipt.charged).toBe(true);
    expect(receipt.amount).toBe(6000);
  });
});