import { describe, it, expect } from 'vitest';
import { tradingTimestamp, formatTradingTime } from '../../src/domain/core/clock';

const MINUTE = 60_000;
const FIRST_DAY = Date.UTC(2014, 1, 14) - 9 * 60 * MINUTE;

describe('trading clock', () => {
  it('anchors day 1 beat 0 to the first Tokyo session open', () => {
    expect(tradingTimestamp({ day: 1 }, { day: 1, beat: 0, candle: 0, tick: 0 })).toBe(FIRST_DAY + 550 * MINUTE);
  });

  it('advances by session, candle and tick within the fictional grid', () => {
    const beat0 = tradingTimestamp({ day: 1 }, { day: 1, beat: 0 });
    const beat1 = tradingTimestamp({ day: 1 }, { day: 1, beat: 1 });
    expect(beat1 - beat0).toBe(140 * MINUTE);

    const c0 = tradingTimestamp({ day: 1 }, { day: 1, beat: 0, candle: 0 });
    const c1 = tradingTimestamp({ day: 1 }, { day: 1, beat: 0, candle: 1 });
    expect(c1 - c0).toBe(15 * MINUTE);

    const t6 = tradingTimestamp({ day: 1 }, { day: 1, beat: 0, candle: 0, tick: 6 });
    expect(t6 - c0).toBe(15 * MINUTE);
  });

  it('skips weekends when advancing business days', () => {
    // 2014-02-14 is a Friday; day 2 must land on the following Monday.
    const day1 = tradingTimestamp({ day: 1 }, { day: 1, beat: 0 });
    const day2 = tradingTimestamp({ day: 2 }, { day: 2, beat: 0 });
    expect(day2 - day1).toBe(3 * 86_400_000);
  });

  it('formats Tokyo market time', () => {
    const at = tradingTimestamp({ day: 1 }, { day: 1, beat: 0 });
    expect(formatTradingTime(at)).toBe('09:10');
    expect(formatTradingTime(at, { full: true })).toContain('2014-02-14');
  });
});