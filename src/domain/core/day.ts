import { NUMERICS } from '../../content/config/numerics';
import { accrueLoanInterest } from '../economy/credit';
import { finalizeDayLiving as finalizeLiving, livingCost } from '../economy/living';
import { quoteSubstep, QUOTE_SUBSTEPS, type DayScript } from '../market/quote-grid';
import { planDay } from '../market/sources/simulated';
import { mood } from '../mind/mood';
import { recomputeSanity } from '../mind/sanity';
import { accountMetrics, equity } from '../trading/account';
import { closeOrders, closePosition, enforceMargin } from '../trading/close';
import { tradingTimestamp } from './clock';
import { beatsPerDay } from './state';
import type { Candle, DayReport, GameState, TradeReceipt } from './types';

export interface AdvanceResult {
  price: number;
  beatEnded: boolean;
  dayEnded: boolean;
  exits: TradeReceipt[];
  phase: GameState['phase'];
}

export function beginPlay(s: GameState): void {
  s.pending = { beat: s.beat, candle: 0, tick: 0, subtick: 0 };
  s.phase = 'playing';
}

function ensureCandle(s: GameState, beat: number): Candle {
  const last = s.candles[s.candles.length - 1];
  if (!last || last.closed || last.day !== s.day || last.beat !== beat) {
    const candle: Candle = {
      open: s.price,
      high: s.price,
      low: s.price,
      close: s.price,
      closed: false,
      day: s.day,
      beat,
      timestamp: tradingTimestamp(s, { day: s.day, beat }),
    };
    s.candles.push(candle);
    return candle;
  }
  return last;
}

/** Soft stop-loss and cross-margin liquidation at the current observed price. */
export function processRisk(s: GameState): TradeReceipt[] {
  const exits: TradeReceipt[] = [];
  for (const p of [...s.positions]) {
    if (p.stopPrice != null) {
      const hit = p.direction === 1 ? s.price <= p.stopPrice : s.price >= p.stopPrice;
      if (hit) exits.push(closePosition(s, 1, 'stop', p.id));
    }
  }
  enforceMargin(s, exits);
  return exits;
}

/** Advance a single canonical sub-sample; rolls into the next tick/candle/beat. */
export function advanceQuote(s: GameState): AdvanceResult {
  if (s.phase !== 'playing' || !s.pending) throw new Error('当前没有待播放行情');
  const script = s.script as DayScript;
  const p = s.pending;
  const price = quoteSubstep(script, { beat: p.beat, candle: p.candle, tick: p.tick, subtick: p.subtick ?? 0 });
  s.price = price;
  const candle = ensureCandle(s, p.beat);
  candle.close = price;
  candle.high = Math.max(candle.high, price);
  candle.low = Math.min(candle.low, price);
  const exits = processRisk(s);

  let beatEnded = false;
  let dayEnded = false;
  const sub = (p.subtick ?? 0) + 1;
  if (sub >= QUOTE_SUBSTEPS) {
    p.subtick = 0;
    p.tick++;
    if (p.tick >= NUMERICS.TICKS_PER_CANDLE) {
      p.tick = 0;
      candle.closed = true;
      s.completedCandles = (s.completedCandles || 0) + 1;
      p.candle++;
      if (p.candle >= NUMERICS.CANDLES_PER_BEAT) {
        p.candle = 0;
        s.beat++;
        beatEnded = true;
        recomputeSanity(s, true);
        if (s.beat >= beatsPerDay(s)) {
          dayEnded = true;
          s.pending = null;
          s.phase = 'closing';
        } else {
          s.pending = null;
          s.phase = 'decision';
        }
      }
    }
  } else {
    p.subtick = sub;
  }
  return { price, beatEnded, dayEnded, exits, phase: s.phase };
}

/** Close everything and produce the day report. Charges interest and living holds. */
export function settleDay(s: GameState): DayReport {
  if (s.mode === 'endless') throw new Error('操盘模式不进行日结算');
  if (s.phase !== 'closing') throw new Error('请等待今日行情结束，再全平收盘');
  if (s.positions.length) closeOrders(s, 1, 'closing');
  s.cash += s.reserve;
  s.reserve = 0;
  const livingEstimate = livingCost(s);
  const { interest, interestPaid, interestAccrued, interestRate } = accrueLoanInterest(s, livingEstimate);
  recomputeSanity(s, true);
  const closing = equity(s);
  const funding = s.externalFunding - s.dayOpeningFunding;
  const costs = s.expenses - s.dayOpeningExpenses;
  const income = (s.nonTradingIncome || 0) - s.dayOpeningIncome;
  const net = closing - s.dayOpening - funding - income + costs;
  const report: DayReport = {
    day: s.day,
    beat: s.beat,
    opening: s.dayOpening,
    closing,
    net,
    tradeNet: net,
    funding,
    costs,
    interest,
    fees: s.feeLedger.filter((t) => t.day === s.day).reduce((sum, t) => sum + t.amount, 0),
    livingCost: 0,
    pendingLivingCost: livingEstimate,
    mood: mood(s),
    closedTradeNet: net,
    interestPaid,
    interestAccrued,
    interestRate,
  };
  s.dayReport = report;
  s.completedDays = Math.max(s.completedDays || 0, s.day - 1);
  s.phase = 'day_end';
  return report;
}

export const finalizeDayLiving = finalizeLiving;

export function beginRest(s: GameState): void {
  if (s.phase !== 'day_end') throw new Error('先完成全平收盘');
  s.phase = 'resting';
  recomputeSanity(s);
}

export function finishTradingDay(s: GameState): DayReport {
  if (s.mode === 'endless') throw new Error('操盘模式连续运行，不进行日结算');
  if (s.phase === 'closing') return settleDay(s);
  if (s.phase !== 'decision' && s.phase !== 'playing') throw new Error('今天已经结束');
  s.pending = null;
  s.phase = 'closing';
  return settleDay(s);
}

export function nextDay(s: GameState): GameState {
  if (!['resting', 'day_end'].includes(s.phase)) throw new Error('先完成今晚的休息与结算');
  const reserve = s.mode === 'endless' ? 0 : NUMERICS.LIVING_DAILY;
  if (reserve) {
    s.cash -= reserve;
    s.reserve = reserve;
  }
  s.day++;
  s.beat = 0;
  s.phase = 'decision';
  s.pending = null;
  s.candles = [];
  s.script = planDay(s.seed, s.day, s.price);
  const debt = (s.family?.outstanding ?? 0) + (s.loan?.outstanding ?? 0);
  s.dayOpening = equity(s);
  s.dayOpeningNetAssets = equity(s) - debt;
  s.dayOpeningDebt = debt;
  s.dayOpeningFunding = s.externalFunding;
  s.dayOpeningExpenses = s.expenses;
  s.dayOpeningIncome = s.nonTradingIncome || 0;
  s.dayReport = null;
  return s;
}

export function endingCondition(s: GameState): string | null {
  const eq = equity(s);
  if (s.mode === 'endless') return eq < NUMERICS.MIN_EQUITY ? 'broke' : null;
  if (s.sanity <= 5 && eq < 5000) return 'crisis';
  if (eq < NUMERICS.MIN_EQUITY) return 'broke';
  if (tradingProfit(s) >= NUMERICS.TARGET_PROFIT) return 'million';
  return null;
}

function tradingProfit(s: GameState): number {
  const debt = (s.family?.outstanding ?? 0) + (s.loan?.outstanding ?? 0);
  const metrics = accountMetrics(s);
  return metrics.equity - (s.startEquity || NUMERICS.START) - debt - (s.nonTradingIncome || 0) - (s.lotteryIncome || 0) - (s.cheatLotteryIncome || 0) + (s.expenses || 0);
}