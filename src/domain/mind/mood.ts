import { NUMERICS } from '../../content/config/numerics';
import { equity } from '../trading/account';
import { initialCapital, tradingProfit } from '../core/state';
import type { GameState } from '../core/types';
import { pressureMood } from './pressure';
import { traumaReadout } from './trauma';

export const MOODS: Record<string, [string, string]> = {
  'trauma-pain': ['崩溃', 'shocked'],
  'trauma-frozen': ['重创', 'blank'],
  numb: ['麻木', 'blank'],
  recovering: ['恢复中', 'blank'],
  hopeful: ['期待', 'hopeful'],
  focused: ['专注', 'focused'],
  irritated: ['烦躁', 'irritated'],
  stunned: ['震惊', 'stunned'],
  exhausted: ['疲惫', 'exhausted'],
  guilty: ['内疚', 'guilty'],
  embarrassed: ['局促', 'embarrassed'],
  lonely: ['落寞', 'lonely'],
  determined: ['坚定', 'determined'],
  warm: ['温暖', 'warm'],
  calm: ['平静', 'calm'],
  smug: ['得意', 'smug'],
  nervous: ['紧张', 'nervous'],
  anxious: ['焦虑', 'anxious'],
  ecstatic: ['极度亢奋', 'exhilarated'],
  despair: ['绝望', 'shocked'],
  regretful: ['懊恼', 'regretful'],
  relieved: ['如释重负', 'relieved'],
};

/** Current emotions ordered by priority. Never changes balances. */
export function mood(s: GameState): string {
  const trauma = traumaReadout(s);
  if (trauma.active) return trauma.mood as string;
  return baseMood(s);
}

export function moodLabel(emotion: string): string {
  return MOODS[emotion]?.[0] ?? emotion;
}

function baseMood(s: GameState): string {
  const current = (s.recent || []).filter((e) => e.day === s.day);
  const latest = current[0];
  const weighted = current.reduce((sum, e, i) => sum + e.impact * [1, 0.75, 0.5, 0.3, 0.15][i]!, 0);
  const profit = tradingProfit(s);
  const panic = profit >= 0 ? 'regretful' : 'despair';
  if (s.sanity <= 5) return panic;
  const pressured = pressureMood(s);
  if (pressured) return pressured;
  if (s.sanity <= 15) return panic;
  if (s.sanity >= 50 && s.day === 1 && s.beat === 0 && !s.positions.length && !latest && Math.abs(profit) < 0.01) return 'hopeful';
  if (latest && (latest.observedMove || latest.reversal)) return latest.type === 'despair' ? panic : latest.type;
  if (latest?.type === 'despair' || weighted < -0.17) return panic;
  if (s.sanity < 25) return 'anxious';
  if ((latest?.type === 'ecstatic' && weighted > 0) || (profit > initialCapital(s) * 0.15 && s.heat >= 3)) return 'ecstatic';
  const nervous = (s.positions || []).some((p) => (p.risk ?? 0) >= 20);
  if (nervous) return 'nervous';
  if (latest?.type === 'regretful') return 'regretful';
  if (latest?.type === 'relieved') return 'relieved';
  if ((s.effects || []).some((e) => e.id === 'fatigue')) return 'exhausted';
  if ((s.family?.outstanding ?? 0) > 0 && s.family?.discovered) return 'guilty';
  if (weighted < -0.015 || (latest?.type === 'anxious' && weighted < 0)) return 'anxious';
  if (s.stress > 16 && s.sanity >= 25) return 'irritated';
  if (weighted > 0.02) return 'smug';
  return 'calm';
}

// Referenced for the sanity formula; kept here so governance stays in one place.
export const TRAUMA_REFERENCE = NUMERICS.TRAUMA;
export const ACCOUNT_EQUITY = equity;