import type { GameState } from '../core/types';

/** Persistent de-buffs driven by story choices. Names are game adaptations. */
export const DEBUFFS: Record<string, { name: string; copy: string; stress?: number; mental?: number }> = {
  guilt: { name: '父亲的柜中存款', copy: '未还清时心理压力增加 8', stress: 8 },
  familyWatch: { name: '父亲开始查账', copy: '心理压力增加 6', stress: 6 },
};

export function addEffect(s: GameState, id: string, remaining: number | null): void {
  s.effects ||= [];
  const effect = { id, remaining };
  const old = s.effects.findIndex((e) => e.id === id);
  if (old >= 0) s.effects[old] = effect;
  else s.effects.push(effect);
}

export function ageEffects(s: GameState, segments = 1): string[] {
  const expired: string[] = [];
  if (segments <= 0) return expired;
  s.effects = (s.effects || []).filter((e) => {
    if (!DEBUFFS[e.id]) return false;
    if (e.remaining === null) return true;
    e.remaining -= segments;
    if (e.remaining <= 0) {
      expired.push(e.id);
      return false;
    }
    return true;
  });
  return expired;
}

/** Base risk limits derived from sanity, before stamina and emotion overrides. */
export function baseRestrictions(s: GameState) {
  const sanity = s.sanity ?? 50;
  let leverage = sanity < 40 ? 25 : sanity < 65 ? 50 : 100;
  let stake = sanity < 40 ? 0.25 : sanity < 65 ? 0.5 : 1;
  const stop = 1;
  let mental = 0;
  let stress = 0;
  for (const e of s.effects || []) {
    const def = DEBUFFS[e.id];
    if (!def) continue;
    mental += def.mental || 0;
    stress += def.stress || 0;
  }
  return { leverage, stake, stop, stopMaximum: stop, noStop: true, noEntry: sanity <= 5, mental, stress };
}