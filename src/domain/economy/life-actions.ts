import { LIFE } from '../../content';
import { NUMERICS } from '../../content/config/numerics';
import { consumeStamina, recoverStamina } from '../body/stamina';
import { LIFESTYLES, lifestylePlan, recordConsumption } from './living';
import type { ConsumptionRow, GameState } from '../core/types';

export interface LifeActionReceipt {
  applied: boolean;
  reason?: string;
  id: string;
  label: string;
  cost: number;
  staminaDelta: number;
  stressDelta: number;
}

export function relaxOptions() {
  return LIFE.relax;
}
export function dinnerOptions() {
  return LIFE.dinner;
}
export function friendNames(): string[] {
  return LIFE.friends;
}

function ensureFree(s: GameState, _id: string): string | null {
  return (s.lifeActionsToday?.length ?? 0) > 0 ? '今天已经安排过生活行动了' : null;
}

function markLife(s: GameState, id: string): void {
  s.lifeActionsToday ||= [];
  s.lifeActionsToday.push(id);
}

export function doRelax(s: GameState, id: string): LifeActionReceipt {
  const item = LIFE.relax.find((r) => r.id === id);
  const empty: LifeActionReceipt = { applied: false, id, label: '', cost: 0, staminaDelta: 0, stressDelta: 0 };
  if (!item) return { ...empty, reason: '未知的放松方式' };
  const busy = ensureFree(s, id);
  if (busy) return { ...empty, reason: busy, label: item.label };
  if (item.cost > (s.cash || 0)) return { ...empty, reason: '现金不足', label: item.label, cost: item.cost };
  if (item.cost > 0) {
    s.cash -= item.cost;
    s.expenses += item.cost;
    recordConsumption(s, { id: `relax:${s.seed}:${s.day}:${id}`, kind: 'relax', label: item.label, amount: item.cost });
  }
  applyStamina(s, item.stamina, `relax:${s.day}:${id}`);
  if (item.stress) s.stress = Math.max(0, (s.stress || 0) + item.stress);
  markLife(s, id);
  return { applied: true, id, label: item.label, cost: item.cost, staminaDelta: item.stamina, stressDelta: item.stress };
}

export function doDinner(s: GameState, id: string): LifeActionReceipt {
  const item = LIFE.dinner.find((d) => d.id === id);
  const empty: LifeActionReceipt = { applied: false, id, label: '', cost: 0, staminaDelta: 0, stressDelta: 0 };
  if (!item) return { ...empty, reason: '未知的晚餐选项' };
  const busy = ensureFree(s, `dinner:${id}`);
  if (busy) return { ...empty, reason: busy, label: item.label };
  if (item.cost > (s.cash || 0)) return { ...empty, reason: '现金不足', label: item.label, cost: item.cost };
  s.cash -= item.cost;
  s.expenses += item.cost;
  s.dinner = true;
  recordConsumption(s, { id: `dinner:${s.seed}:${s.day}:${id}`, kind: item.meal ? 'takeaway' : 'dinner', label: item.label, amount: item.cost });
  if (item.relationship) s.relationship = (s.relationship ?? 0) + item.relationship;
  markLife(s, `dinner:${id}`);
  return { applied: true, id, label: item.label, cost: item.cost, staminaDelta: 0, stressDelta: item.relationship ? -2 : 0 };
}

export function doFriend(s: GameState, name: string): LifeActionReceipt {
  const empty: LifeActionReceipt = { applied: false, id: `friend:${name}`, label: name, cost: 0, staminaDelta: 0, stressDelta: 0 };
  if (!LIFE.friends.includes(name)) return { ...empty, reason: '未知的朋友' };
  const busy = ensureFree(s, `friend:${name}`);
  if (busy) return { ...empty, reason: busy };
  s.relationship = (s.relationship ?? 0) + 1;
  s.stress = Math.max(0, (s.stress || 0) - 6);
  markLife(s, `friend:${name}`);
  return { applied: true, id: `friend:${name}`, label: name, cost: 0, staminaDelta: 0, stressDelta: -6 };
}

export function moveHouse(s: GameState, id: string): LifeActionReceipt {
  const plan = LIFESTYLES.find((x) => x.id === id);
  const empty: LifeActionReceipt = { applied: false, id, label: '', cost: 0, staminaDelta: 0, stressDelta: 0 };
  if (!plan) return { ...empty, reason: '未知的住房' };
  if (lifestylePlan(s).id === id) return { ...empty, reason: '已经住在那里了', label: plan.label };
  if (plan.moveInCost > (s.cash || 0)) return { ...empty, reason: '搬家费用不足', label: plan.label, cost: plan.moveInCost };
  if (plan.moveInCost > 0) {
    s.cash -= plan.moveInCost;
    s.expenses += plan.moveInCost;
    recordConsumption(s, { id: `movein:${s.seed}:${s.day}`, kind: 'housing', label: `搬入${plan.label}`, amount: plan.moveInCost });
  }
  s.lifestyle = { version: 2, id, selectedDay: s.day };
  return { applied: true, id, label: plan.label, cost: plan.moveInCost, staminaDelta: 0, stressDelta: 0 };
}

function applyStamina(s: GameState, delta: number, tag: string): void {
  if (!delta) return;
  if (delta > 0) recoverStamina(s, { amount: delta, id: `life:${tag}`, source: 'life' });
  else consumeStamina(s, { amount: -delta, id: `life:${tag}`, source: 'life' });
}

export interface ConsumptionStatement {
  day: number;
  rows: ConsumptionRow[];
  total: number;
  availableCash: number;
}

export function consumptionStatement(s: GameState): ConsumptionStatement {
  const rows = (s.consumptionLedger || []).filter((r) => r.day === s.day);
  return {
    day: s.day,
    rows,
    total: Math.round(rows.reduce((sum, r) => sum + r.amount, 0) * 100) / 100,
    availableCash: Math.max(0, s.cash || 0) + (s.reserve || 0),
  };
}

export function housingOptions() {
  return LIFESTYLES.map((l) => ({ id: l.id, label: l.label, dailyCost: l.dailyCost, moveInCost: l.moveInCost, sleepRecovery: l.sleepRecovery }));
}

export { NUMERICS };