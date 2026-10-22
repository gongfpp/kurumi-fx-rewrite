import { NUMERICS } from '../../content/config/numerics';
import type { GameState, StaminaState } from '../core/types';

export interface StaminaStatus {
  value: number;
  max: number;
  low: boolean;
  exhausted: boolean;
  canOpen: boolean;
  canWork: boolean;
  canRest: boolean;
}

export function newStamina(): StaminaState {
  return { version: 3, value: NUMERICS.STAMINA.max, watchMinutes: 0, spent: 0, recovered: 0, lastSample: null, recoveryReceipts: [] };
}

export function ensureStamina(s: GameState): StaminaState {
  if (s.stamina === undefined) s.stamina = newStamina();
  return s.stamina;
}

/** Read-only: opening a menu or switching UI never upgrades a save. */
export function staminaStatus(s: GameState): StaminaStatus {
  const value = s.stamina?.value ?? NUMERICS.STAMINA.max;
  return {
    value,
    max: NUMERICS.STAMINA.max,
    low: value <= NUMERICS.STAMINA.warning,
    exhausted: value <= 0,
    canOpen: value > NUMERICS.STAMINA.entryMinimum,
    canWork: value >= NUMERICS.STAMINA.workCost,
    canRest: true,
  };
}

export interface StaminaChangeOptions {
  amount: number;
  id: string;
  source: string;
}

export interface StaminaReceipt {
  id: string;
  source: string;
  amount: number;
  before: number;
  after: number;
  delta: number;
  applied: boolean;
  alreadyApplied: boolean;
}

const round = (v: number): number => Math.round(v * 1e9) / 1e9;
const validId = (v: string): boolean => typeof v === 'string' && v.length > 0 && v.length <= 200;

function changeStamina(s: GameState, { amount, id, source }: StaminaChangeOptions, direction: 1 | -1): StaminaReceipt {
  if (!Number.isFinite(amount) || amount < 0 || amount > NUMERICS.STAMINA.max || !validId(id) || !validId(source)) throw new TypeError('Invalid stamina change');
  const stamina = ensureStamina(s);
  const prior = stamina.recoveryReceipts.find((r) => (r as StaminaReceipt).id === id) as StaminaReceipt | undefined;
  if (prior) return { ...prior, applied: false, alreadyApplied: true };
  if (direction < 0 && stamina.value < amount) return { id, source, amount: 0, before: stamina.value, after: stamina.value, delta: 0, applied: false, alreadyApplied: false };
  const before = stamina.value;
  const after = round(Math.max(0, Math.min(NUMERICS.STAMINA.max, before + direction * amount)));
  const delta = round(after - before);
  const receipt: StaminaReceipt = { id, source, amount, before, after, delta, applied: true, alreadyApplied: false };
  stamina.value = after;
  if (direction > 0) stamina.recovered = round(stamina.recovered + delta);
  else stamina.spent = round(stamina.spent - delta);
  stamina.recoveryReceipts.push(receipt);
  return receipt;
}

export function recoverStamina(s: GameState, opts: StaminaChangeOptions): StaminaReceipt {
  return changeStamina(s, opts, 1);
}

export function consumeStamina(s: GameState, opts: StaminaChangeOptions): StaminaReceipt {
  return changeStamina(s, opts, -1);
}

/**
 * Watching cost per market minute. Emotion never changes cost; pressure is a
 * separate input, and costs are integrated exactly so batching cannot alter them.
 */
export function staminaDrainMultiplier(emotion: string, pressureIntensity = 0): number {
  const p = Number.isFinite(pressureIntensity) ? Math.max(0, Math.min(1, pressureIntensity)) : 0;
  void emotion;
  return p > 0 ? NUMERICS.WATCH.pressureMinimum + (NUMERICS.WATCH.pressureMaximum - NUMERICS.WATCH.pressureMinimum) * p : 1;
}