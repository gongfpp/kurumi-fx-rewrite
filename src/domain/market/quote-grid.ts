/**
 * Canonical market samples, independent of the purchased display cadence.
 * Ported from quote-grid.js: one logical second at 1x with four shared
 * risk-check sub-samples.
 */
export const QUOTE_GRID_VERSION = 2;
export const QUOTE_SUBSTEPS = 4;
export const QUOTE_DT = 1 / QUOTE_SUBSTEPS;

export const MARKET_BALANCE = Object.freeze({
  noise: 0.00058 * 0.28,
  driftScale: 0.5,
  maxShock: 0.012,
  shockScale: 0.3,
  shockChance: 0.12,
  shockCooldownDays: 2,
  historyNoise: 0.002 * 0.28,
});

export const SIMULATION_CALIBRATION: Record<string, { scale: number; maxShock: number }> = Object.freeze({
  'USD/JPY': Object.freeze({ scale: 1, maxShock: 0.006 }),
  'AUD/JPY': Object.freeze({ scale: 1.25, maxShock: 0.0075 }),
  'GBP/JPY': Object.freeze({ scale: 1.45, maxShock: 0.0087 }),
});

export interface Calibration {
  noise: number;
  driftScale: number;
  maxShock: number;
  shockScale: number;
}

export function simulationCalibration(symbol = 'USD/JPY', tickMinutes = 2.5): Calibration {
  const profile = SIMULATION_CALIBRATION[symbol];
  if (!profile || !Number.isFinite(tickMinutes) || tickMinutes <= 0) throw new Error('Invalid simulation calibration');
  const time = tickMinutes / 2.5;
  return {
    noise: MARKET_BALANCE.noise * profile.scale * Math.sqrt(time),
    driftScale: MARKET_BALANCE.driftScale * profile.scale * time,
    maxShock: profile.maxShock,
    shockScale: MARKET_BALANCE.shockScale * 0.5 * profile.scale * Math.sqrt(time),
  };
}

export function shouldScheduleShock(day: number, rollForDay: (d: number) => number): boolean {
  if (!Number.isSafeInteger(day) || day < 1 || typeof rollForDay !== 'function') throw new Error('Invalid shock schedule input');
  const candidate = (d: number): boolean => {
    const roll = rollForDay(d);
    if (!Number.isFinite(roll) || roll < 0 || roll >= 1) throw new Error('Invalid shock schedule roll');
    return roll < MARKET_BALANCE.shockChance;
  };
  if (!candidate(day)) return false;
  for (let ago = 1; ago <= MARKET_BALANCE.shockCooldownDays && day > ago; ago++) if (candidate(day - ago)) return false;
  return true;
}

const price9 = (value: number): number => Number(Math.max(0.001, value).toFixed(9));

export function boundedShock(value: number, maxShock: number = MARKET_BALANCE.maxShock): number {
  return Number.isFinite(value) ? Math.max(-maxShock, Math.min(maxShock, value)) : 0;
}

export function calibratedShock(value: number, options: { symbol?: string; tickMinutes?: number } = {}): number {
  const profile = simulationCalibration(options.symbol, options.tickMinutes);
  return boundedShock(value * profile.shockScale, profile.maxShock);
}

export interface ScriptEvent {
  id: string;
  chain: string;
  variant: 'confirmed' | 'reversed' | 'muted';
  bias: number;
  vol: number;
  response?: { impulse: number; behavior: 'continue' | 'range' | 'retrace' };
  title: string;
  copy: string;
  source: string;
  time: string;
  flash: string;
  flashCopy: string;
}

export interface DayScript {
  gridVersion: number;
  substeps: number;
  tracks: number[][][];
  subtracks: number[][][][];
  events: ScriptEvent[];
  swan: unknown;
}

export interface GridInput {
  startPrice: number;
  events: ScriptEvent[];
  market: () => number;
  impactAt: (event: ScriptEvent, cursor: { beat: number; candle: number; tick: number; subtick: number }) => { drift: number; volatility: number; revealed: boolean };
  swan?: { beat: number; candle: number; tick: number; delta: number; [key: string]: unknown } | null;
  newsEffects?: boolean;
  symbol?: string;
  tickMinutes?: number;
  candlesPerBeat?: number;
  ticksPerCandle?: number;
}

export function generateQuoteGrid({
  startPrice,
  events,
  market,
  impactAt,
  swan = null,
  newsEffects = true,
  symbol = 'USD/JPY',
  tickMinutes = 2.5,
  candlesPerBeat = 4,
  ticksPerCandle = 6,
}: GridInput): { gridVersion: number; substeps: number; tracks: number[][][]; subtracks: number[][][][] } {
  if (!Number.isFinite(startPrice) || startPrice <= 0 || typeof market !== 'function' || typeof impactAt !== 'function' || !Array.isArray(events)) {
    throw new Error('Invalid canonical quote input');
  }
  const profile = simulationCalibration(symbol, tickMinutes);
  let price = startPrice;
  const subtracks = events.map((event, beat) =>
    Array.from({ length: candlesPerBeat }, (_, candle) =>
      Array.from({ length: ticksPerCandle }, (_, tick) =>
        Array.from({ length: QUOTE_SUBSTEPS }, (_, subtick) => {
          // A newly revealed release/shock is never leaked into earlier sub-samples.
          const impact = impactAt(event, { beat, candle, tick: subtick === QUOTE_SUBSTEPS - 1 ? tick : tick - 1 / QUOTE_SUBSTEPS, subtick });
          const drift = newsEffects ? (Number.isFinite(impact.drift) ? impact.drift : 0) * profile.driftScale * QUOTE_DT : 0;
          const vol = newsEffects && Number.isFinite(impact.volatility) ? Math.max(0, impact.volatility) : 1;
          const noise = (market() + market() - 1) * profile.noise * vol * Math.sqrt(QUOTE_DT);
          const shock = newsEffects && swan && swan.beat === beat && swan.candle === candle && swan.tick === tick && subtick === QUOTE_SUBSTEPS - 1 ? boundedShock(swan.delta, profile.maxShock) : 0;
          price = price9(price * (1 + drift + noise + shock));
          return price;
        }),
      ),
    ),
  );
  const tracks = subtracks.map((beat) => beat.map((candle) => candle.map((second) => second[second.length - 1] as number)));
  return { gridVersion: QUOTE_GRID_VERSION, substeps: QUOTE_SUBSTEPS, tracks, subtracks };
}

export function hasCanonicalGrid(script: unknown): boolean {
  const s = script as DayScript | null;
  return s?.gridVersion === QUOTE_GRID_VERSION && s.substeps === QUOTE_SUBSTEPS && Array.isArray(s.subtracks);
}

export function quoteSubstep(script: DayScript, cursor: { beat: number; candle: number; tick: number; subtick?: number }): number {
  const endpoint = script?.tracks?.[cursor.beat]?.[cursor.candle]?.[cursor.tick];
  if (!Number.isFinite(endpoint) || (endpoint as number) <= 0) throw new Error('Stored quote endpoint is damaged');
  const substeps = hasCanonicalGrid(script) ? QUOTE_SUBSTEPS : 1;
  if (substeps === 1) return endpoint as number;
  const subtick = cursor.subtick === undefined ? 0 : cursor.subtick;
  if (!Number.isInteger(subtick) || subtick < 0 || subtick >= QUOTE_SUBSTEPS) throw new Error('Canonical quote cursor is damaged');
  const samples = script.subtracks?.[cursor.beat]?.[cursor.candle]?.[cursor.tick];
  if (!Array.isArray(samples) || samples.length !== QUOTE_SUBSTEPS || samples.some((p) => !Number.isFinite(p) || p <= 0)) throw new Error('Canonical quote grid is damaged');
  return samples[samples.length - 1] === endpoint ? (samples[subtick] as number) : (endpoint as number);
}