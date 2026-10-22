import { NUMERICS } from '../../../content/config/numerics';
import { BLACK_SWANS, NEWS_CHAINS, NEWS_VARIANTS, type NewsVariant } from '../../../content/news';
import { mix, random } from '../../core/rng';
import { newsImpact } from '../news';
import { calibratedShock, generateQuoteGrid, shouldScheduleShock, type DayScript, type ScriptEvent } from '../quote-grid';

export interface PlanDayOptions {
  newsEffects?: boolean;
  swanEffects?: boolean;
  symbol?: string;
  tickMinutes?: number;
}

export const SESSION_TIMES = ['09:10', '11:30', '15:00', '21:30', '23:30'];

interface SwanSchedule {
  beat: number;
  candle: number;
  tick: number;
  delta: number;
  [key: string]: unknown;
}

/**
 * Deterministic daily market script. Same seed + day + start price always
 * produces the same tracks, so saves are authoritative and reloads never reroll.
 */
export function planDay(seed: number, day: number, startPrice: number, rounds = NUMERICS.BEATS_PER_DAY, opts: PlanDayOptions = {}): DayScript {
  const symbol = opts.symbol ?? 'USD/JPY';
  const tickMinutes = opts.tickMinutes ?? NUMERICS.TICK_MINUTES;
  const story = random(mix(seed, day, 0x5170));
  const market = random(mix(seed, day, 0x61a0));
  const response = random(mix(seed, day, 0x934a));
  const shockDirection = response() < 0.5 ? -1 : 1;

  const cycle = Math.floor(((day - 1) * 2) / NEWS_CHAINS.length);
  const bag = NEWS_CHAINS.map((_, i) => i);
  const shuffle = random(mix(seed, cycle, 0x777a));
  for (let i = bag.length - 1; i > 0; i--) {
    const j = Math.floor(shuffle() * (i + 1));
    [bag[i], bag[j]] = [bag[j] as number, bag[i] as number];
  }
  const selected = [
    NEWS_CHAINS[bag[((day - 1) * 2) % bag.length] as number] as (typeof NEWS_CHAINS)[number],
    NEWS_CHAINS[bag[((day - 1) * 2 + 1) % bag.length] as number] as (typeof NEWS_CHAINS)[number],
  ];

  const surprise = random(mix(seed, day, 0x1b1a));
  const shockRoll = surprise();
  const shockDay = shouldScheduleShock(day, (d) => (d === day ? shockRoll : random(mix(seed, d, 0x1b1a))()));

  let swan: SwanSchedule | null = null;
  if (shockDay && opts.swanEffects !== false) {
    const picked = BLACK_SWANS[Math.floor(surprise() * BLACK_SWANS.length)] as (typeof BLACK_SWANS)[number];
    swan = {
      ...picked,
      beat: Math.floor(surprise() * 4),
      candle: Math.floor(surprise() * 3),
      tick: 2 + Math.floor(surprise() * 3),
      delta: shockDirection * Math.abs(calibratedShock(picked.delta, { symbol, tickMinutes })),
    };
  }

  const events: ScriptEvent[] = [];
  for (let beat = 0; beat < rounds; beat++) {
    const chain = selected[Math.floor(beat / 2) % selected.length] as (typeof NEWS_CHAINS)[number];
    const variant: NewsVariant = beat % 2 === 0 ? (NEWS_VARIANTS[Math.floor(story() * 3)] as NewsVariant) : (events[beat - 1]?.variant as NewsVariant);
    const tuple = chain[variant] as [string, string];
    const reaction = beat % 2
      ? { response: events[beat - 1]?.response }
      : {
          response: {
            impulse: (response() < 0.5 ? -1 : 1) * (0.5 + response() * 0.5),
            behavior: (['continue', 'range', 'retrace'] as const)[Math.min(2, Math.floor(response() * 3))] as 'continue' | 'range' | 'retrace',
          },
        };
    events.push({
      id: chain.id,
      chain: chain.name,
      variant,
      bias: chain.bias,
      vol: chain.vol,
      ...reaction,
      title: beat % 2 === 0 ? chain.lead : tuple[0],
      copy: beat % 2 === 0 ? chain.leadCopy : tuple[1],
      source: chain.source,
      time: SESSION_TIMES[beat] ?? '00:30',
      flash: beat % 2 === 0 ? tuple[0] : `${chain.name}：市场继续评估后续影响`,
      flashCopy: tuple[1],
    });
  }

  const grid = generateQuoteGrid({
    startPrice,
    events,
    market,
    swan,
    newsEffects: opts.newsEffects !== false,
    symbol,
    tickMinutes,
    impactAt: (event, cursor) => newsImpact(event, { day, ...cursor }),
  });
  return { ...grid, events, swan };
}