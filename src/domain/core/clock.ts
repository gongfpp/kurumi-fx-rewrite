/**
 * Deterministic fictional market clock. Playback milliseconds never enter it.
 * Ported from trading-time.js (simulated branch); live/historical sources add
 * their own timestamps later without changing this grid.
 */
export const TRADING_CLOCK_VERSION = 1;
export const GAME_TIME_ZONE = 'Asia/Tokyo';
export const CANDLE_MINUTES = 15;

const MINUTE = 60_000;
const DAY = 86_400_000;
// Chapter 1 p36 explicitly shows Friday, 2014-02-14.
const FIRST_DAY = Date.UTC(2014, 1, 14) - 9 * 60 * MINUTE;
const SESSION_MINUTES = [550, 690, 900, 1290, 1410];

const integer = (n: number, fallback = 0): number => (Number.isSafeInteger(n) && n >= 0 ? n : fallback);

export interface TradingClock {
  version: number;
  epochMs: number;
  timeZone: string;
  candleMinutes: number;
  source: string;
  lastQuoteAt?: number;
  lastQuoteDay?: number;
}

interface ClockHost {
  day?: number;
  tradingClock?: TradingClock;
}

function businessDate(epoch: number, days: number): number {
  let offset = Math.floor(days / 5) * 7;
  let remainder = days % 5;
  const weekday = new Date(epoch + 9 * 60 * MINUTE).getUTCDay();
  while (remainder) {
    offset++;
    const dow = (weekday + offset) % 7;
    if (dow !== 0 && dow !== 6) remainder--;
  }
  return epoch + offset * DAY;
}

export function tradingClock(state: ClockHost = {}): TradingClock {
  const existing = state.tradingClock;
  if (existing?.version === TRADING_CLOCK_VERSION && Number.isFinite(existing.epochMs) && Math.abs(existing.epochMs) < 8e15) {
    return { ...existing, timeZone: GAME_TIME_ZONE, candleMinutes: CANDLE_MINUTES };
  }
  return { version: TRADING_CLOCK_VERSION, epochMs: FIRST_DAY, timeZone: GAME_TIME_ZONE, candleMinutes: CANDLE_MINUTES, source: 'game-calendar' };
}

export function ensureTradingClock(state: ClockHost): TradingClock {
  state.tradingClock = tradingClock(state);
  return state.tradingClock;
}

export interface TimestampParts {
  day?: number;
  beat?: number;
  candle?: number;
  tick?: number;
}

export function tradingTimestamp(state: ClockHost & { day?: number }, { day = state.day ?? 1, beat = 0, candle = 0, tick = 0 }: TimestampParts = {}): number {
  const clock = tradingClock(state);
  const date = businessDate(clock.epochMs, Math.max(0, integer(day, 1) - 1));
  const b = integer(beat);
  const start = SESSION_MINUTES[b] ?? (SESSION_MINUTES[SESSION_MINUTES.length - 1] ?? 1410) + (b - 4) * 60;
  return date + (start + integer(candle) * CANDLE_MINUTES + (Math.min(6, integer(tick)) * CANDLE_MINUTES) / 6) * MINUTE;
}

export function stampQuoteTime(state: ClockHost & { day: number }, cursor: TimestampParts, fraction = 1): number {
  const clock = ensureTradingClock(state);
  const at = tradingTimestamp(state, { day: state.day, beat: cursor.beat ?? 0, candle: cursor.candle ?? 0, tick: cursor.tick ?? 0 }) +
    (fraction * CANDLE_MINUTES * MINUTE) / 6;
  clock.lastQuoteAt = at;
  clock.lastQuoteDay = state.day;
  return at;
}

export function formatTradingTime(timestamp: number, { date = false, full = false }: { date?: boolean; full?: boolean } = {}): string {
  if (!Number.isFinite(timestamp)) return '—';
  const iso = new Date(timestamp + 9 * 60 * MINUTE).toISOString();
  const day = iso.slice(0, 10);
  const time = iso.slice(11, 16);
  return full ? `${day} ${iso.slice(11, 19)} JST` : date ? `${day.slice(5)} ${time}` : time;
}