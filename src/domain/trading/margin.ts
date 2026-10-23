import type { GameState } from '../core/types';
import { money } from './math';

export interface MarginReceipt {
  applied: boolean;
  reason?: string;
  amount: number;
  positionId: string | null;
}

/** Move cash into an open position's margin to raise its stop-out distance. */
export function topUpMargin(s: GameState, positionId: string, requested: number): MarginReceipt {
  const p = s.positions.find((x) => x.id === positionId);
  if (!p) return { applied: false, reason: '没有该持仓', amount: 0, positionId: null };
  const amount = money(Math.max(0, Math.min(requested, s.cash)));
  if (amount < 100) return { applied: false, reason: '追加金额不足 ¥100', amount: 0, positionId };
  s.cash -= amount;
  p.margin += amount;
  p.initialMargin = (p.initialMargin ?? 0) + amount;
  return { applied: true, amount, positionId };
}

export function maxTopUp(s: GameState): number {
  return Math.max(0, money(s.cash));
}

export function canTopUp(s: GameState): boolean {
  return s.positions.length > 0 && s.cash >= 100;
}