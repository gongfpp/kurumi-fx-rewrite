import { NUMERICS } from '../../content/config/numerics';
import type { GameState } from '../core/types';

export interface EnergyStage {
  active: boolean;
  phase: 'boost' | 'fatigue' | null;
  day: number | null;
  hint: string;
}

/** Derive the energy stage from a same-day energy drink effect. */
export function energyStage(s: GameState): EnergyStage {
  const e = s.energyEffect;
  if (!e || e.day !== s.day) return { active: false, phase: null, day: null, hint: '' };
  const phase = e.elapsed < NUMERICS.ENERGY.boostDuration ? 'boost' : 'fatigue';
  return {
    active: true,
    phase,
    day: e.day,
    hint:
      phase === 'boost'
        ? `提神中：体力消耗 ×${NUMERICS.ENERGY.boostMultiplier}（约 ${Math.round((NUMERICS.ENERGY.boostDuration - e.elapsed) * 100)}% 剩余）`
        : `疲劳中：体力消耗 ×${NUMERICS.ENERGY.fatigueMultiplier}`,
  };
}

export function advanceEnergy(s: GameState, elapsed: number): void {
  if (s.energyEffect && s.energyEffect.day === s.day) {
    s.energyEffect.elapsed = Math.min(1, s.energyEffect.elapsed + elapsed);
  }
}

export function startEnergyBoost(s: GameState): void {
  s.energyEffect = { day: s.day, elapsed: 0 };
}

export function energyCostMultiplier(s: GameState): number {
  const stage = energyStage(s);
  if (!stage.active) return 1;
  return stage.phase === 'boost' ? NUMERICS.ENERGY.boostMultiplier : NUMERICS.ENERGY.fatigueMultiplier;
}