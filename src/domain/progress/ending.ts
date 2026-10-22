import { ENDINGS, type EndingDef } from '../../content';
import { NUMERICS } from '../../content/config/numerics';
import { tradingProfit } from '../core/state';
import { equity } from '../trading/account';
import type { GameState } from '../core/types';

export interface EndingResult {
  baseId: string;
  variant: string | null;
  title: string;
  description: string;
}

export function endingDefs(): EndingDef[] {
  return ENDINGS as EndingDef[];
}

function debt(s: GameState): number {
  return (s.family?.outstanding ?? 0) + (s.loan?.outstanding ?? 0);
}

/**
 * Classify the ending for the current state. `walkaway` is true only when the
 * player voluntarily exits; a target/liquidation ending otherwise takes priority.
 */
export function classifyEnding(s: GameState, { walkaway = false }: { walkaway?: boolean } = {}): EndingResult | null {
  const eq = equity(s);
  const profit = tradingProfit(s);
  const owed = debt(s);
  const base = s.startEquity || NUMERICS.START;
  const peakProfit = (s.peakPersonal || base) - base;

  if (s.mode === 'endless') {
    if (eq < NUMERICS.MIN_EQUITY) return pick('broke', null);
    if (walkaway) return pick('walkaway', owed > 0 ? 'debt-exit' : 'debt-free');
    return null;
  }
  if (s.sanity <= 5 && eq < 5000) return pick('crisis', null);
  if (eq < NUMERICS.MIN_EQUITY) return pick('broke', null);
  if (profit >= NUMERICS.TARGET_PROFIT) return pick('million', null);
  if (walkaway) {
    if (owed > 0) return pick('walkaway', 'debt-exit');
    if (peakProfit >= NUMERICS.TARGET_PROFIT && profit < NUMERICS.TARGET_PROFIT) return pick('walkaway', 'paper-millionaire');
    if (peakProfit >= 500_000 && profit < 0) return pick('walkaway', 'gave-it-back');
    if (Math.abs(profit) < base * 0.01) return pick('walkaway', 'back-to-even');
    if ((s.family?.repaid ?? 0) > 0) return pick('walkaway', 'returned-savings');
    if (owed === 0) return pick('walkaway', 'debt-free');
    return pick('walkaway', null);
  }
  return null;
}

function pick(baseId: string, variant: string | null): EndingResult {
  const id = variant ?? baseId;
  const def = (ENDINGS as EndingDef[]).find((e) => e.id === id) ?? (ENDINGS as EndingDef[]).find((e) => e.baseId === baseId);
  return { baseId, variant, title: def?.title ?? baseId, description: def?.description ?? '' };
}

export function applyEnding(s: GameState, result: EndingResult): void {
  s.ending = { id: result.variant ?? result.baseId, baseId: result.baseId, variant: result.variant, day: s.day, equity: equity(s), profit: tradingProfit(s), sanity: s.sanity };
  s.phase = 'ending';
}