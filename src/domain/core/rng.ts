/**
 * Deterministic seeded PRNG and channel mixer.
 * Ported verbatim from the shipped engine so sequences stay reproducible.
 */
export function random(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Mix a seed with a day and channel into an independent stream seed. */
export function mix(seed: number, day: number, channel: number): number {
  let x = (seed ^ Math.imul(day, 0x9e3779b9) ^ channel) >>> 0;
  x = Math.imul(x ^ (x >>> 16), 0x7feb352d);
  x = Math.imul(x ^ (x >>> 15), 0x846ca68b);
  return (x ^ (x >>> 16)) >>> 0;
}