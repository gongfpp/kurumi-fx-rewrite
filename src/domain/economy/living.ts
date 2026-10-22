import { NUMERICS } from '../../content/config/numerics';
import { equity } from '../trading/account';
import type { ConsumptionRow, GameState, LifestyleState } from '../core/types';

export interface Lifestyle {
  id: string;
  label: string;
  dailyCost: number;
  baseDailyCost: number;
  dailyBasics: number;
  dailyRent: number;
  mealCost: number;
  moveInCost: number;
  sleepRecovery: number;
}

export const LIFESTYLES: readonly Lifestyle[] = [
  { id: 'basic', label: '公寓', dailyCost: 1500, baseDailyCost: 1500, dailyBasics: 300, dailyRent: 1200, mealCost: 300, moveInCost: 0, sleepRecovery: NUMERICS.HOUSING_SLEEP_RECOVERY.basic as number },
  { id: 'comfortable', label: '好一点的公寓', dailyCost: 3000, baseDailyCost: 1500, dailyBasics: 300, dailyRent: 2700, mealCost: 300, moveInCost: 45000, sleepRecovery: NUMERICS.HOUSING_SLEEP_RECOVERY.comfortable as number },
  { id: 'generous', label: '独栋住宅', dailyCost: 6000, baseDailyCost: 1500, dailyBasics: 300, dailyRent: 5700, mealCost: 300, moveInCost: 135000, sleepRecovery: NUMERICS.HOUSING_SLEEP_RECOVERY.generous as number },
  { id: 'premium', label: '顶层公寓', dailyCost: 12000, baseDailyCost: 1500, dailyBasics: 300, dailyRent: 11700, mealCost: 300, moveInCost: 315000, sleepRecovery: NUMERICS.HOUSING_SLEEP_RECOVERY.premium as number },
  { id: 'penthouse', label: '豪宅', dailyCost: 30000, baseDailyCost: 1500, dailyBasics: 300, dailyRent: 29700, mealCost: 300, moveInCost: 855000, sleepRecovery: NUMERICS.HOUSING_SLEEP_RECOVERY.penthouse as number },
];

export function lifestylePlan(s: GameState): Lifestyle {
  return LIFESTYLES.find((x) => x.id === s.lifestyle?.id) ?? (LIFESTYLES[0] as Lifestyle);
}

export function selectLifestyle(s: GameState, id: string): LifestyleState | null {
  const plan = LIFESTYLES.find((x) => x.id === id);
  if (!plan) return null;
  s.lifestyle = { version: 2, id, selectedDay: s.day };
  return s.lifestyle;
}

/** Base daily living cost after any standing discount. */
export function livingCost(s: GameState): number {
  return Math.round(lifestylePlan(s).dailyCost * (1 - (s.livingDiscount || 0)));
}

function money(value: number): number {
  return Math.round((value + Number.EPSILON * Math.abs(value) * 2) * 100) / 100;
}

const meals = (s: GameState): number =>
  (s.consumptionLedger || []).filter((row) => row.day === s.day && ['noodles', 'takeaway'].includes(row.kind)).length;

export function recordConsumption(s: GameState, row: Omit<ConsumptionRow, 'day'> & { day?: number }): ConsumptionRow {
  if (!Number.isFinite(row.amount) || row.amount < 0) throw new Error('消费流水金额无效');
  s.consumptionLedger ||= [];
  const existing = s.consumptionLedger.find((r) => r.id === row.id);
  if (existing) return existing;
  const entry: ConsumptionRow = { id: row.id, day: row.day ?? s.day, kind: row.kind, label: row.label, amount: row.amount, timestamp: row.timestamp ?? null };
  s.consumptionLedger.push(entry);
  return entry;
}

export interface LivingReceipt {
  charged: boolean;
  amount: number;
  receipt: {
    id: string;
    day: number;
    amount: number;
    baseAmount: number;
    kind: string;
    label: string;
    assetsBefore: number;
    assetsAfter: number;
  } | null;
}

/**
 * Charge today's living cost exactly once. A meal credit already applied by a
 * supply item reduces the base; the household rent of the chosen lifestyle is
 * always charged.
 */
export function finalizeDayLiving(s: GameState): LivingReceipt {
  if (s.mode === 'endless') return { charged: false, amount: 0, receipt: null };
  if (!['day_end', 'resting', 'ending'].includes(s.phase)) throw new Error('先完成今日交易结算');
  const plan = lifestylePlan(s);
  const base = plan.dailyBasics + plan.dailyRent;
  const credit = meals(s) > 0 ? plan.mealCost : 0;
  const amount = money(Math.min(Math.max(0, s.cash), base - credit));
  const assetsBefore = equity(s);
  s.cash -= amount;
  s.expenses += amount;
  s.livingPaid = (s.livingPaid || 0) + amount;
  const receipt = {
    id: `living:${s.seed}:${s.day}`,
    day: s.day,
    amount,
    baseAmount: base - credit,
    kind: 'ordinary',
    label: credit ? '生活费（已抵餐费）' : '生活费',
    assetsBefore,
    assetsAfter: equity(s),
  };
  recordConsumption(s, { id: receipt.id, kind: 'living', label: receipt.label, amount });
  return { charged: true, amount, receipt };
}