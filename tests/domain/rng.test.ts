import { describe, it, expect } from 'vitest';
import { random, mix } from '../../src/domain/core/rng';

describe('rng', () => {
  it('produces a reproducible sequence for the same seed', () => {
    const a = random(12345);
    const b = random(12345);
    const seqA = [a(), a(), a(), a(), a()];
    const seqB = [b(), b(), b(), b(), b()];
    expect(seqA).toEqual(seqB);
    expect(seqA.every((n) => n >= 0 && n < 1)).toBe(true);
  });

  it('differs across seeds', () => {
    expect(random(1)()).not.toEqual(random(2)());
  });

  it('mix is deterministic and channel separated', () => {
    expect(mix(7, 3, 0x5170)).toBe(mix(7, 3, 0x5170));
    expect(mix(7, 3, 0x5170)).not.toBe(mix(7, 3, 0x61a0));
    expect(mix(7, 3, 0x5170)).not.toBe(mix(7, 4, 0x5170));
  });
});