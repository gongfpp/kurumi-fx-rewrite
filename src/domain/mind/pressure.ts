import { NUMERICS } from '../../content/config/numerics';
import type { GameState, Position } from '../core/types';

export interface PressureStatus {
  taps: number;
  target: number;
  intensity: number;
  extreme: boolean;
  direction: 'ecstatic' | 'despair' | null;
  remainingMs: number;
}

const P = NUMERICS.PRESSURE;
const finite = (v: number | undefined, fallback = 0): number => (Number.isFinite(v) ? (v as number) : fallback);

const ctx = (s: GameState): string => `${s.mode || 'story'}:${s.runId || s.seed}:${s.day}`;

/** A saved, bounded impulse. Never edits an order, cash, debt or unlock flag. */
export function pressureStatus(s: GameState, now = Date.now()): PressureStatus {
  const p = s.emotionPressure;
  const empty: PressureStatus = { taps: 0, target: 0, intensity: 0, extreme: false, direction: null, remainingMs: 0 };
  if (!p || p.context !== ctx(s) || !['ecstatic', 'despair'].includes(p.direction) || !Number.isInteger(p.taps) || p.taps < 1 || p.taps > p.target || !Number.isFinite(p.lastAt) || !Number.isFinite(now) || p.lastAt > now + 1000) {
    return empty;
  }
  const elapsed = Math.max(0, now - p.lastAt);
  const cooled = Math.floor(Math.max(0, elapsed - P.graceMs) / P.decayMs);
  const taps = Math.max(0, p.taps - cooled);
  return {
    taps,
    target: taps ? p.target : 0,
    intensity: taps / p.target,
    extreme: taps === p.target,
    direction: taps ? p.direction : null,
    remainingMs: Math.max(0, P.graceMs + P.decayMs - elapsed),
  };
}

export function pressureMood(s: GameState, now = Date.now()): 'ecstatic' | 'despair' | null {
  const p = pressureStatus(s, now);
  return p.extreme ? p.direction : null;
}

export function pressureIntensity(s: GameState, emotion: string, now = Date.now()): number {
  if (['ecstatic', 'despair'].includes(emotion)) return 1;
  return Math.max(pressureStatus(s, now).intensity, finite(s.heat) / 5, finite(s.stress) / 40);
}

/** Soft-lock target taps (3/4/5) based on the gap to the next risk cap (40 / 65). */
export function pressureTarget(s: GameState, { kind, value }: { kind: 'leverage' | 'stake'; value: number }): number {
  const threshold = kind === 'leverage' ? (value > 50 ? 65 : 40) : value > 0.5 ? 65 : 40;
  const gap = Math.max(0, threshold - finite(s.sanity, 50));
  return gap <= 10 ? 3 : gap <= 25 ? 4 : 5;
}

export function pressureDirection({ emotion, sanity, profit = 0, unrealized = 0 }: { emotion: string; sanity: number; profit?: number; unrealized?: number }): 'ecstatic' | 'despair' {
  return finite(sanity, 50) < 40 || profit < 0 || unrealized < 0 || ['despair', 'anxious', 'nervous', 'regretful', 'guilty', 'exhausted'].includes(emotion) ? 'despair' : 'ecstatic';
}

export interface PressResult extends PressureStatus {
  accepted: boolean;
  reason?: string;
  unlocked?: boolean;
}

export function pressEmotion(
  s: GameState,
  opts: { kind: 'leverage' | 'stake'; value: number; soft: boolean; emotion: string; profit?: number; unrealized?: number; now?: number },
): PressResult {
  const { kind, value, soft, emotion, profit = 0, unrealized = 0, now = Date.now() } = opts;
  if (!soft) return { accepted: false, reason: 'not-soft-lock', ...pressureStatus(s, now) };
  const previous = pressureStatus(s, now);
  if (previous.taps && now - (s.emotionPressure?.lastAt ?? 0) < P.tapIntervalMs) return { accepted: false, reason: 'too-fast', ...previous };
  const direction = previous.direction || pressureDirection({ emotion, sanity: s.sanity, profit, unrealized });
  const target = previous.taps && previous.target ? previous.target : pressureTarget(s, { kind, value });
  const priorTaps = previous.taps;
  const taps = Math.min(target, priorTaps + 1);
  s.emotionPressure = { context: ctx(s), direction, taps, target, lastAt: now };
  s.stress = Math.max(0, finite(s.stress)) + 0.5;
  if (taps % 3 === 0) s.heat = Math.max(0, Math.min(5, finite(s.heat) + 1));
  return { accepted: true, unlocked: taps === target, ...pressureStatus(s, now) };
}

export { P as PRESSURE_POLICY };

/** Positional intensity helper for presentation scaling. */
export function positionRisk(position: Position): number {
  return position.risk ?? 0;
}