import { ITEMS, type ItemDef } from '../../content';
import { NUMERICS } from '../../content/config/numerics';
import { consumeStamina, ensureStamina, recoverStamina } from '../body/stamina';
import type { DailySupplies, GameState } from '../core/types';

export const SUPPLY_ITEMS: ItemDef[] = ITEMS as ItemDef[];

export function supplyById(id: string): ItemDef | null {
  return SUPPLY_ITEMS.find((i) => i.id === id) ?? null;
}

export function ensureDailySupplies(s: GameState): DailySupplies {
  s.dailySupplies ||= { version: 1, mealCreditDay: null, eyeMaskPending: false, uses: [], noteUsedDay: null };
  return s.dailySupplies;
}

export function supplyUsedToday(s: GameState, id: string): boolean {
  return s.itemsUsed?.[id] === true || (s.dailySupplies?.uses ?? []).some((r) => r.day === s.day && r.id === id);
}

export function supplyUnavailableReason(s: GameState, id: string): string | null {
  const item = supplyById(id);
  if (!item) return '这个物品不可用';
  if (item.meal && (s.dailySupplies?.mealCreditDay === s.day || (s.dailySupplies?.uses ?? []).some((r) => r.day === s.day && r.id === 'noodles') || (s.dailySupplies?.uses ?? []).some((r) => r.day === s.day && r.id === 'takeaway'))) {
    return '今天已经吃过这一餐了';
  }
  if (supplyUsedToday(s, id)) return '今天已经用过了';
  if (item.price > (s.cash || 0)) return '现金不足';
  return null;
}

export interface SupplyReceipt {
  applied: boolean;
  reason?: string;
  id: string;
  cost: number;
  stamina: number;
  stress: number;
  mood: string | null;
  mealCredit: boolean;
}

/** Buy and apply a daily supply. Deducts cash and updates stamina/stress plus meal credit. */
export function useSupply(s: GameState, id: string): SupplyReceipt {
  const item = supplyById(id);
  const base: SupplyReceipt = { applied: false, id, cost: 0, stamina: 0, stress: 0, mood: null, mealCredit: false };
  if (!item) return { ...base, reason: '这个物品不可用' };
  const reason = supplyUnavailableReason(s, id);
  if (reason) return { ...base, reason };

  const supplies = ensureDailySupplies(s);
  s.cash -= item.price;
  s.expenses += item.price;
  supplies.uses.push({ id, day: s.day, cost: item.price });
  s.itemsUsed ||= {};
  s.itemsUsed[id] = true;
  if (item.meal) supplies.mealCreditDay = s.day;
  if (item.stamina > 0) recoverStamina(s, { amount: item.stamina, id: `supply:${s.day}:${id}`, source: 'supply' });
  if (item.id === 'eyeMask') supplies.eyeMaskPending = true;
  if (item.stress) {
    s.stress = Math.max(0, (s.stress || 0) + item.stress);
  }
  if (id === 'tradingNotes') {
    ensureStamina(s);
    consumeStamina(s, { amount: 0, id: `supply:note:${s.day}`, source: 'supply' });
  }
  return { applied: true, id, cost: item.price, stamina: item.stamina, stress: item.stress, mood: item.mood, mealCredit: item.meal };
}

export function supplyIds(): string[] {
  return SUPPLY_ITEMS.map((i) => i.id);
}

export const SUPPLY_PRICES = Object.fromEntries(SUPPLY_ITEMS.map((i) => [i.id, i.price])) as Record<string, number>;
export { NUMERICS };