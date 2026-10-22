import { describe, it, expect } from 'vitest';
import { createGame } from '../../src/domain/core/state';
import { pressEmotion, pressureMood, pressureStatus } from '../../src/domain/mind/pressure';
import { recomputeSanity, restrictions } from '../../src/domain/mind/sanity';
import { staminaStatus, recoverStamina, consumeStamina } from '../../src/domain/body/stamina';

describe('emotion pressure', () => {
  it('accumulates taps and unlocks at the target', () => {
    const s = createGame(1);
    s.sanity = 30; // gap 10 -> target 3
    const t0 = 1_000_000;
    let res = pressEmotion(s, { kind: 'stake', value: 0.5, soft: true, emotion: 'calm', now: t0 });
    expect(res.taps).toBe(1);
    res = pressEmotion(s, { kind: 'stake', value: 0.5, soft: true, emotion: 'calm', now: t0 + 1000 });
    expect(res.taps).toBe(2);
    res = pressEmotion(s, { kind: 'stake', value: 0.5, soft: true, emotion: 'calm', now: t0 + 2000 });
    expect(res.taps).toBe(3);
    expect(res.unlocked).toBe(true);
    expect(pressureMood(s, t0 + 2000)).not.toBeNull();
  });

  it('rejects pressure when not a soft lock', () => {
    const s = createGame(1);
    expect(pressEmotion(s, { kind: 'stake', value: 0.5, soft: false, emotion: 'calm' }).accepted).toBe(false);
  });

  it('decays taps after the grace window', () => {
    const s = createGame(1);
    s.sanity = 30;
    const t0 = 5_000_000;
    pressEmotion(s, { kind: 'stake', value: 0.25, soft: true, emotion: 'calm', now: t0 });
    const later = pressureStatus(s, t0 + 8000 + 2000 * 5);
    expect(later.taps).toBe(0);
  });
});

describe('sanity restrictions', () => {
  it('maps sanity bands to leverage and stake caps', () => {
    const s = createGame(1);
    s.sanity = 80;
    expect(restrictions(s).leverage).toBe(100);
    s.sanity = 50;
    expect(restrictions(s).leverage).toBe(50);
    s.sanity = 30;
    expect(restrictions(s).leverage).toBe(25);
  });

  it('recomputes sanity lower after a drawdown', () => {
    const s = createGame(1);
    recomputeSanity(s);
    const calm = s.sanity;
    s.performance.totalProfit = -150_000;
    s.cash -= 150_000;
    recomputeSanity(s, true);
    expect(s.sanity).toBeLessThan(calm);
  });
});

describe('stamina', () => {
  it('recovers and consumes with idempotent receipts', () => {
    const s = createGame(1);
    const r1 = recoverStamina(s, { amount: 10, id: 'a', source: 'item' });
    expect(r1.applied).toBe(true);
    expect(staminaStatus(s).value).toBe(100); // capped at max
    const c1 = consumeStamina(s, { amount: 20, id: 'b', source: 'work' });
    expect(c1.applied).toBe(true);
    expect(staminaStatus(s).value).toBe(80);
    const c2 = consumeStamina(s, { amount: 20, id: 'b', source: 'work' });
    expect(c2.alreadyApplied).toBe(true);
    expect(staminaStatus(s).value).toBe(80);
  });

  it('reports low and exhausted states', () => {
    const s = createGame(1);
    s.stamina.value = 15;
    expect(staminaStatus(s).low).toBe(true);
    expect(staminaStatus(s).canOpen).toBe(true);
    s.stamina.value = 0;
    expect(staminaStatus(s).exhausted).toBe(true);
    expect(staminaStatus(s).canOpen).toBe(false);
  });
});