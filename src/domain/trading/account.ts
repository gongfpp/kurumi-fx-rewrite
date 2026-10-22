import type { GameState, Position } from '../core/types';
import { positionUnrealized } from './position';

/** positions is authoritative; position stays a first-order view for legacy consumers. */
export function positionsOf(s: GameState): Position[] {
  if (Array.isArray(s.positions) && s.positions.length) return s.positions;
  return s.position ? [s.position] : [];
}

export function unrealized(s: GameState): number {
  return positionsOf(s).reduce((sum, p) => sum + positionUnrealized(s, p), 0);
}

export interface AccountMetrics {
  cash: number;
  availableMargin: number;
  usedMargin: number;
  unrealized: number;
  tradingEquity: number;
  equity: number;
  requiredMargin: number;
  marginLevel: number | null;
  notional: number;
  feesPaid: number;
  reserve: number;
}

export function accountMetrics(s: GameState): AccountMetrics {
  const positions = positionsOf(s);
  const usedMargin = positions.reduce((sum, p) => sum + p.margin, 0);
  const floating = unrealized(s);
  const requiredMargin = positions.reduce((sum, p) => sum + (p.initialMargin ?? p.margin), 0);
  const tradingEquity = s.cash + usedMargin + floating;
  return {
    cash: s.cash,
    availableMargin: Math.max(0, Math.min(s.cash, tradingEquity - usedMargin)),
    usedMargin,
    unrealized: floating,
    tradingEquity,
    equity: Math.max(0, tradingEquity) + (s.reserve || 0),
    requiredMargin,
    marginLevel: requiredMargin ? tradingEquity / requiredMargin : null,
    notional: positions.reduce((sum, p) => sum + (p.notional ?? p.margin * p.leverage), 0),
    feesPaid: s.feesPaid || 0,
    reserve: s.reserve || 0,
  };
}

export function equity(s: GameState): number {
  return accountMetrics(s).equity;
}