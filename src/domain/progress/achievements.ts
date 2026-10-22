import { ACHIEVEMENTS, type Achievement } from '../../content';
import { NUMERICS } from '../../content/config/numerics';
import { tradingProfit } from '../core/state';
import type { GameState, TradeReceipt } from '../core/types';

export interface AchievementState {
  unlocked: boolean;
  progress: number;
}

export type AchievementMap = Record<string, AchievementState>;

const closed = (s: GameState): TradeReceipt[] => (s.history || []).filter((t) => t.type !== 'open' && Number.isFinite(t.pnl));

const debt = (s: GameState): number => (s.family?.outstanding ?? 0) + (s.loan?.outstanding ?? 0);

function lotteryWins(s: GameState): { any: number; top: number } {
  let any = 0;
  let top = 0;
  for (const t of s.lottery?.tickets ?? []) {
    if (t.status === 'settled' && t.result && t.result.prize > 0) {
      any++;
      if (t.result.tier >= 1 && t.result.tier <= 3) top++;
    }
  }
  return { any, top };
}

const checks: Record<string, (s: GameState) => number> = {
  'first-profit': (s) => (closed(s).some((t) => t.pnl > 0) ? 1 : 0),
  liquidated: (s) => (closed(s).some((t) => t.type === 'liquidation') ? 1 : 0),
  'hold-loss': (s) => (closed(s).some((t) => (t.maxUnrealized ?? 0) < -0.5 * t.margin && t.type !== 'liquidation') ? 1 : 0),
  'hundred-times': (s) => s.performance?.closedTrades ?? 0,
  'father-funds': (s) => (s.fatherUsed ? 1 : 0),
  'fully-repaid': (s) => ((s.family?.repaid ?? 0) > 0 && (s.family?.outstanding ?? 0) <= 0 ? 1 : 0),
  'accept-stop': (s) => (closed(s).some((t) => t.type === 'stop' && t.pnl >= 0) ? 1 : 0),
  'mochiko-warning': (s) => (s.story?.seen?.includes('friendStudy') ? 1 : 0),
  'saved-at-last': (s) => ((s.recent?.some((e) => e.type === 'relieved') ?? false) ? 1 : 0),
  walkaway: (s) => (s.ending ? 1 : 0),
  'twenty-million': (s) => (tradingProfit(s) >= NUMERICS.TARGET_PROFIT ? 1 : 0),
  'lottery-first-win': (s) => Math.min(1, lotteryWins(s).any),
  'lottery-top-three': (s) => Math.min(1, lotteryWins(s).top),
  'trauma-survivor': (s) => ((s.tradingTrauma?.recoveryUnits ?? 0) > 0 ? 1 : 0),
  'debt-free': (s) => ((s.phase === 'day_end' || s.phase === 'resting') && debt(s) === 0 ? 1 : 0),
  'thirty-days': (s) => s.completedDays ?? 0,
  'high-leverage': (s) => (closed(s).some((t) => t.leverage >= 100) ? 1 : 0),
  onsen: (s) => (s.itemsUsed?.onsen ? 1 : 0),
};

export function evaluateAchievements(s: GameState, previous: AchievementMap = {}): AchievementMap {
  const out: AchievementMap = {};
  for (const def of ACHIEVEMENTS as Achievement[]) {
    const progress = checks[def.id] ? Math.max(0, checks[def.id](s)) : 0;
    const wasUnlocked = previous[def.id]?.unlocked ?? false;
    out[def.id] = { unlocked: wasUnlocked || progress >= def.goal, progress };
  }
  return out;
}

export function achievementDefs(): Achievement[] {
  return ACHIEVEMENTS as Achievement[];
}