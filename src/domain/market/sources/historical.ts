import { NUMERICS } from '../../../content/config/numerics';
import type { Candle } from '../../core/types';
import { QUOTE_GRID_VERSION, QUOTE_SUBSTEPS, type DayScript, type ScriptEvent } from '../quote-grid';

/** Forexite-style CSV: "YYYYMMDD HHMMSS;O;H;L;C;V" per line. */
export interface MinuteBar {
  t: number;
  o: number;
  h: number;
  l: number;
  c: number;
}

export function parseForexite(text: string): MinuteBar[] {
  const out: MinuteBar[] = [];
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const parts = line.split(';');
    if (parts.length < 5) continue;
    const stamp = parts[0]!.replace(/\D/g, '');
    if (stamp.length < 12) continue;
    const y = Number(stamp.slice(0, 4));
    const mo = Number(stamp.slice(4, 6)) - 1;
    const d = Number(stamp.slice(6, 8));
    const hh = Number(stamp.slice(8, 10));
    const mm = Number(stamp.slice(10, 12));
    const t = Date.UTC(y, mo, d, hh, mm);
    const o = Number(parts[1]);
    const h = Number(parts[2]);
    const l = Number(parts[3]);
    const c = Number(parts[4]);
    if ([o, h, l, c].every((n) => Number.isFinite(n) && n > 0)) out.push({ t, o, h, l, c });
  }
  return out.sort((a, b) => a.t - b.t);
}

const BARS_PER_DAY = NUMERICS.BEATS_PER_DAY * NUMERICS.CANDLES_PER_BEAT; // 16 fifteen-minute bars

/** Aggregate minute bars into 15-minute bars. */
export function toQuarterBars(minutes: MinuteBar[]): MinuteBar[] {
  const buckets = new Map<number, MinuteBar>();
  for (const m of minutes) {
    const bucket = Math.floor(m.t / (15 * 60_000)) * 15 * 60_000;
    const cur = buckets.get(bucket);
    if (!cur) buckets.set(bucket, { t: bucket, o: m.o, h: m.h, l: m.l, c: m.c });
    else {
      cur.h = Math.max(cur.h, m.h);
      cur.l = Math.min(cur.l, m.l);
      cur.c = m.c;
    }
  }
  return [...buckets.values()].sort((a, b) => a.t - b.t);
}

export function historicalDayCount(minutes: MinuteBar[]): number {
  return Math.max(0, Math.floor(toQuarterBars(minutes).length / BARS_PER_DAY));
}

function barAt(minute: MinuteBar[], startT: number, tick: number): number {
  const target = startT + tick * 2.5 * 60_000;
  let pick = minute[0] as MinuteBar | undefined;
  for (const m of minute) {
    if (m.t <= target) pick = m;
    else break;
  }
  return pick?.c ?? (minute[0]?.c as number);
}

export interface HistoricalScript extends DayScript {
  historical: true;
  openedAt: number;
  closedAt: number;
}

/**
 * Build a canonical DayScript from real quarter bars so the existing playback
 * loop can replay genuine history without any change.
 */
export function buildHistoricalScript(minutes: MinuteBar[], dayIndex: number): HistoricalScript {
  const quarters = toQuarterBars(minutes);
  const start = dayIndex * BARS_PER_DAY;
  const slice = quarters.slice(start, start + BARS_PER_DAY);
  const tracks: number[][][] = [];
  const subtracks: number[][][][] = [];
  let cursor = 0;
  for (let beat = 0; beat < NUMERICS.BEATS_PER_DAY; beat++) {
    const beatTracks: number[][] = [];
    const beatSubs: number[][][] = [];
    for (let candle = 0; candle < NUMERICS.CANDLES_PER_BEAT; candle++) {
      const bar = slice[cursor] ?? (slice[slice.length - 1] as MinuteBar);
      const segment = minutes.filter((m) => m.t >= bar.t - 15 * 60_000 && m.t < bar.t + 15 * 60_000);
      const base = segment.length ? segment : [bar];
      const ticks: number[] = [];
      const subs: number[][] = [];
      for (let tick = 0; tick < NUMERICS.TICKS_PER_CANDLE; tick++) {
        const px = barAt(base, bar.t, tick + 1);
        ticks.push(px);
        subs.push([px, px, px, px]);
      }
      beatTracks.push(ticks);
      beatSubs.push(subs);
      cursor++;
    }
    tracks.push(beatTracks);
    subtracks.push(beatSubs);
  }
  const firstBar = slice[0] ?? (quarters[0] as MinuteBar);
  const lastBar = (slice[slice.length - 1] ?? quarters[quarters.length - 1]) as MinuteBar;
  const events: ScriptEvent[] = Array.from({ length: NUMERICS.BEATS_PER_DAY }, (_, beat) => ({
    id: `hist-${beat}`,
    chain: '历史行情',
    variant: 'confirmed' as const,
    bias: 0,
    vol: 1,
    title: `历史真实行情 · 第 ${dayIndex + 1} 个交易日`,
    copy: '来自导入的历史数据，仅用于复盘与练习。',
    source: '历史数据',
    time: ['09:10', '11:30', '15:00', '21:30'][beat] ?? '00:30',
    flash: '历史行情继续',
    flashCopy: '按已发生的历史数据推进。',
  }));
  return {
    gridVersion: QUOTE_GRID_VERSION,
    substeps: QUOTE_SUBSTEPS,
    tracks,
    subtracks,
    events,
    swan: null,
    historical: true,
    openedAt: firstBar?.t ?? 0,
    closedAt: lastBar?.t ?? 0,
  };
}

export function candlesFromScript(script: HistoricalScript): Candle[] {
  const out: Candle[] = [];
  for (let beat = 0; beat < script.tracks.length; beat++) {
    for (let candle = 0; candle < (script.tracks[beat]?.length ?? 0); candle++) {
      const ticks = script.tracks[beat]?.[candle] ?? [];
      if (!ticks.length) continue;
      const open = ticks[0] as number;
      const close = ticks[ticks.length - 1] as number;
      out.push({ open, close, high: Math.max(...ticks), low: Math.min(...ticks), closed: true, historical: true, day: 1, beat });
    }
  }
  return out;
}