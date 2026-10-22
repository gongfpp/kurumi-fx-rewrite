import { equity, accountMetrics } from '../trading/account';
import { initialCapital } from '../core/state';
import type { GameState } from '../core/types';
import { staminaStatus } from '../body/stamina';
import { baseRestrictions } from './effects';
import { mood } from './mood';
import { pressureMood } from './pressure';
import { capTraumaSanity, observeTrauma } from './trauma';

export interface SanityReadout {
  value: number;
  totalDrawdown: number;
  recentDrawdown: number;
  exposure: number;
}

/** Recompute sanity from drawdown, exposure, stress and story modifiers. */
export function recomputeSanity(s: GameState, sample = false): SanityReadout {
  observeTrauma(s);
  const modifiers = baseRestrictions(s);
  const personal = Math.max(
    0,
    equity(s) - (s.externalFunding || 0) - (s.nonTradingIncome || 0) - (s.lotteryIncome || 0) - (s.cheatLotteryIncome || 0) + (s.expenses || 0),
  );
  const base = initialCapital(s);
  s.peakPersonal = Math.max(base, s.peakPersonal || base, personal);
  s.equityTrail ||= [personal];
  if (sample) {
    s.equityTrail.push(personal);
    s.equityTrail = s.equityTrail.slice(-48);
  }
  const recentPeak = Math.max(base * 0.01, ...s.equityTrail, personal);
  const totalDrawdown = Math.max(0, 1 - personal / s.peakPersonal);
  const recentDrawdown = Math.max(0, 1 - personal / recentPeak);
  const metrics = accountMetrics(s);
  const exposure = Math.min(1, metrics.notional / Math.max(metrics.tradingEquity, 1) / 50);
  const earned = Math.max(0, Math.min(35, Math.log2(1 + Math.max(0, personal - base) / 1000) * 5));
  s.sanity = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        50 +
          earned +
          (s.mentalBoost || 0) +
          (s.restRecovery || 0) -
          totalDrawdown * 65 -
          recentDrawdown * 20 -
          exposure * 5 -
          (s.stress || 0) -
          modifiers.stress +
          modifiers.mental,
      ),
    ),
  );
  if ((s.restRecovery || 0) > 0 && equity(s) >= 5000) s.sanity = Math.max(6, s.sanity);
  s.sanity = capTraumaSanity(s, s.sanity);
  return { value: s.sanity, totalDrawdown, recentDrawdown, exposure };
}

export interface Restrictions {
  leverage: number;
  stake: number;
  stop: number;
  stopMaximum: number;
  noStop: boolean;
  noEntry: boolean;
  mental: number;
  stress: number;
  minLeverage: number;
  forceNoStop: boolean;
  emotion: string;
}

export function restrictions(s: GameState): Restrictions {
  if (s.mode === 'endless') {
    return { ...baseRestrictions(s), leverage: 100, stake: 1, noEntry: !staminaStatus(s).canOpen, minLeverage: 5, forceNoStop: false, emotion: mood(s) };
  }
  const base = baseRestrictions(s);
  const limits = { ...base, noEntry: base.noEntry || !staminaStatus(s).canOpen };
  const emotion = mood(s);
  const pressure = pressureMood(s);
  const forceNoStop = ['ecstatic', 'despair'].includes(emotion) || !!pressure;
  const pressured = !!pressure && !limits.noEntry;
  return {
    ...limits,
    ...(pressured ? { leverage: 100, stake: 1 } : {}),
    ...(!limits.noEntry && s.dailyLeverageUnlocked ? { leverage: 100 } : {}),
    minLeverage: forceNoStop ? 25 : 5,
    forceNoStop,
    emotion,
  };
}

export function tradingOpen(s: GameState): boolean {
  return s.phase === 'decision' || s.phase === 'playing';
}