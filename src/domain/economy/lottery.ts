import { NUMERICS, type LotteryTier } from '../../content/config/numerics';
import type { GameState, LotteryState } from '../core/types';

const L = NUMERICS.LOTTERY;

export interface LotteryConfig {
  id: string;
  ticketPrice: number;
  drawMinute: number;
  guaranteeDraws: number;
  cheatCode: string;
  cheatPrize: number;
  tiers: LotteryTier[];
}

export const LOTTERY_RULES: LotteryConfig = {
  id: 'lottery-20261017-v1',
  ticketPrice: L.ticketPrice,
  drawMinute: L.drawMinute,
  guaranteeDraws: L.guaranteeDraws,
  cheatCode: L.cheatCode,
  cheatPrize: L.cheatPrize,
  tiers: L.tiers,
};

export function validateLotteryRules(c: LotteryConfig): LotteryConfig {
  if (!c || typeof c.id !== 'string' || !c.id || c.ticketPrice !== 300 || c.guaranteeDraws !== 40 || !Number.isInteger(c.drawMinute) || c.drawMinute < 0 || c.drawMinute >= 1440 || c.cheatPrize !== 20000000 || !Array.isArray(c.tiers) || c.tiers.length !== 7) {
    throw new Error('Invalid lottery rules');
  }
  return c;
}

export function newLotteryState(): LotteryState {
  return { version: 1, tickets: [], drawsWithoutTop3: 0, cheatRedeemed: false };
}

const top3 = (r: { tier: number }): boolean => r.tier >= 1 && r.tier <= 3;

/** Weighted draw. Forced draws use the top-three weights renormalized, without boosting prizes. */
export function drawLotteryResult(config: LotteryConfig, rng: () => number, forced = false): { tier: number; prize: number; forced: boolean } {
  validateLotteryRules(config);
  const pool = config.tiers.filter((t) => !forced || (t.tier >= 1 && t.tier <= 3));
  const u = rng();
  if (!Number.isFinite(u) || u < 0 || u >= 1) throw new Error('Lottery RNG must return [0,1)');
  let n = u * pool.reduce((s, t) => s + t.weight, 0);
  const selected = pool.find((t) => (n -= t.weight) < 0) as LotteryTier;
  return { tier: selected.tier, prize: selected.prize, forced };
}

function readLottery(s: GameState): LotteryState {
  s.lottery ||= newLotteryState();
  return s.lottery;
}

export interface LotteryResponse {
  applied: boolean;
  reason?: string;
  debit: number;
  normalCredit: number;
  cheatCredit: number;
  ticket?: LotteryState['tickets'][number];
  excludePublicRanking?: boolean;
}

export function purchaseLottery(s: GameState, config: LotteryConfig = LOTTERY_RULES): LotteryResponse {
  const l = readLottery(s);
  if (l.tickets.some((t) => t.kind === 'normal' && t.purchaseDay === s.day)) return { applied: false, reason: 'already-purchased', debit: 0, normalCredit: 0, cheatCredit: 0 };
  if (!Number.isFinite(s.cash) || s.cash < config.ticketPrice) return { applied: false, reason: 'insufficient-funds', debit: 0, normalCredit: 0, cheatCredit: 0 };
  const ticket = {
    id: `lottery:${s.runId ?? `seed:${s.seed}`}:${s.day}:normal`,
    number: String(s.day % 1000000).padStart(6, '0'),
    kind: 'normal' as const,
    purchaseDay: s.day,
    drawDay: s.day + 1,
    rulesId: config.id,
    cost: config.ticketPrice,
    status: 'pending' as const,
    result: null,
    settledDay: null,
  };
  l.tickets.push(ticket);
  s.cash -= config.ticketPrice;
  s.expenses += config.ticketPrice;
  return { applied: true, debit: config.ticketPrice, normalCredit: 0, cheatCredit: 0, ticket };
}

export function redeemCheatLottery(s: GameState, code: string, config: LotteryConfig = LOTTERY_RULES): LotteryResponse {
  const l = readLottery(s);
  if (l.cheatRedeemed) return { applied: false, reason: 'already-redeemed', debit: 0, normalCredit: 0, cheatCredit: 0 };
  if (typeof config.cheatCode !== 'string' || !config.cheatCode || code !== config.cheatCode) return { applied: false, reason: 'invalid-code', debit: 0, normalCredit: 0, cheatCredit: 0 };
  const ticket = {
    id: `lottery:${s.runId ?? `seed:${s.seed}`}:${s.day}:cheat`,
    number: String(s.day % 1000000).padStart(6, '0'),
    kind: 'cheat' as const,
    purchaseDay: s.day,
    drawDay: s.day + 1,
    rulesId: config.id,
    cost: 0,
    status: 'pending' as const,
    result: null,
    settledDay: null,
  };
  l.tickets.push(ticket);
  l.cheatRedeemed = true;
  return { applied: true, debit: 0, normalCredit: 0, cheatCredit: 0, ticket, excludePublicRanking: true };
}

/** Persist ledger AND cash/income deltas together before any animation. */
export function settleLottery(s: GameState, { rng, endOfDay = false, minute = 0, config = LOTTERY_RULES }: { rng?: () => number; endOfDay?: boolean; minute?: number; config?: LotteryConfig } = {}): LotteryResponse {
  const l = readLottery(s);
  const roll = rng ?? Math.random;
  const out: LotteryResponse = { applied: false, debit: 0, normalCredit: 0, cheatCredit: 0 };
  for (const t of l.tickets) {
    if (t.status !== 'pending' || s.day < t.drawDay || (s.day === t.drawDay && !endOfDay && minute < config.drawMinute)) continue;
    t.result = t.kind === 'cheat' ? { tier: 1, prize: config.cheatPrize, forced: false } : drawLotteryResult(config, roll, l.drawsWithoutTop3 >= config.guaranteeDraws - 1);
    t.status = 'settled';
    t.settledDay = s.day;
    if (t.kind === 'normal') {
      l.drawsWithoutTop3 = top3(t.result) ? 0 : l.drawsWithoutTop3 + 1;
      out.normalCredit += t.result.prize;
    } else {
      out.cheatCredit += t.result.prize;
    }
  }
  if (out.normalCredit) {
    s.cash += out.normalCredit;
    s.lotteryIncome = (s.lotteryIncome || 0) + out.normalCredit;
  }
  if (out.cheatCredit) {
    s.cash += out.cheatCredit;
    s.cheatLotteryIncome = (s.cheatLotteryIncome || 0) + out.cheatCredit;
  }
  out.applied = out.normalCredit > 0 || out.cheatCredit > 0;
  return out;
}

export function lotteryIncomeTotals(l: LotteryState): { normal: number; cheat: number; spent: number } {
  const total = { normal: 0, cheat: 0, spent: 0 };
  for (const t of l.tickets) {
    total.spent += t.cost;
    if (t.status === 'settled' && t.result) total[t.kind === 'normal' ? 'normal' : 'cheat'] += t.result.prize;
  }
  return total;
}