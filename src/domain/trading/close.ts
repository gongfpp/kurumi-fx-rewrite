import { NUMERICS } from '../../content/config/numerics';
import { tradingTimestamp } from '../core/clock';
import { beatsPerDay } from '../core/state';
import type { GameState, TradeReceipt } from '../core/types';
import { accountMetrics, equity } from './account';
import { money } from './math';
import { positionUnrealized } from './position';

function ensureOrders(s: GameState): void {
  if (!Array.isArray(s.positions)) s.positions = s.position ? [s.position] : [];
  s.nextOrderId ||= 1;
  s.feesPaid ||= 0;
  s.feeLedger ||= [];
  for (const p of s.positions) {
    if (!p.id) p.id = 'order-' + s.nextOrderId++;
    p.notional ??= p.margin * p.leverage;
    p.initialMargin ??= p.margin;
    p.openFeeRemaining ??= 0;
    p.openFee ??= 0;
    p.maxUnrealized ??= 0;
    p.stop ??= 1;
  }
  syncPosition(s);
}

function syncPosition(s: GameState): void {
  s.position = s.positions[0] || null;
}

function experience(s: GameState, entry: { type: string; impact: number; risk?: number; pnl: number; positionId?: string; day: number; beat: number }): void {
  s.recent.unshift({ ...entry, direction: null, pnl: entry.pnl });
  s.recent = s.recent.slice(0, 5);
}

export function closePosition(s: GameState, fraction: number, reason: string, positionId?: string): TradeReceipt {
  ensureOrders(s);
  const p = positionId ? s.positions.find((x) => x.id === positionId) : s.positions[0];
  if (!p || fraction <= 0 || fraction > 1) throw new Error('没有可平仓位');
  const before = equity(s);
  const margin = p.margin * fraction;
  const raw = positionUnrealized(s, p) * fraction;
  const peakUnrealized = p.maxUnrealized * fraction;
  const openFee = p.openFeeRemaining * fraction;
  const closeFee = money((p.notional ?? p.margin * p.leverage) * fraction * NUMERICS.FEE_RATE);
  const pnl = raw - openFee - closeFee;

  s.cash += margin + raw - closeFee;
  s.feesPaid += closeFee;
  s.feeLedger.push({ day: s.day, beat: Math.min(s.beat, beatsPerDay(s) - 1), positionId: p.id, side: 'close', amount: closeFee });
  p.notional = (p.notional ?? p.margin * p.leverage) * (1 - fraction);
  p.initialMargin = (p.initialMargin ?? p.margin) * (1 - fraction);
  p.margin -= margin;
  p.maxUnrealized *= 1 - fraction;
  p.openFeeRemaining -= openFee;
  if (p.margin < 1e-5 || fraction === 1) s.positions = s.positions.filter((o) => o !== p);
  syncPosition(s);

  const impact = pnl / Math.max(1000, before);
  s.heat = Math.max(0, Math.min(5, (s.heat || 0) + (pnl > 0 ? 1 : -1)));
  const type =
    pnl >= 0
      ? p.nearMiss || p.recoveredFromLoss
        ? 'relieved'
        : impact > 0.07
          ? 'ecstatic'
          : pnl > 0
            ? 'smug'
            : 'calm'
      : reason === 'liquidation' || impact < -0.07
        ? 'despair'
        : peakUnrealized > 0
          ? 'regretful'
          : 'anxious';

  const trade: TradeReceipt = {
    type: reason,
    positionId: p.id,
    direction: p.direction,
    margin,
    leverage: p.leverage,
    entry: p.entry,
    exit: (p.symbol && s.marketBook ? s.marketBook.markets[p.symbol]?.price : s.price) as number,
    pnl,
    grossPnl: raw,
    fee: openFee + closeFee,
    openFee,
    closeFee,
    day: s.day,
    beat: Math.min(s.beat, beatsPerDay(s) - 1),
    timestamp: tradingTimestamp(s, { day: s.day, beat: Math.min(s.beat, beatsPerDay(s) - 1) }),
    symbol: p.symbol,
    positionClosed: !s.positions.some((o) => o.id === p.id),
    nearMiss: !!p.nearMiss,
    maxUnrealized: peakUnrealized,
  };
  s.history.push(trade);
  s.lastTrade = trade;
  experience(s, { type, impact, risk: p.risk, pnl, positionId: p.id, day: s.day, beat: s.beat });
  return trade;
}

function accumulatePerformance(s: GameState, trades: TradeReceipt[]): void {
  const stats = s.performance;
  for (const t of trades) {
    if (t.performanceRecorded) continue;
    stats.totalProfit += t.pnl;
    stats.closedTrades++;
    stats.winRateTrades++;
    if (t.pnl > 0) stats.winningTrades++;
    stats.maxLoss = Math.min(stats.maxLoss, t.pnl);
    stats.maxProfit = Math.max(stats.maxProfit, t.pnl);
    t.performanceRecorded = true;
  }
  const netEquity = Math.max(0, (s.startEquity || NUMERICS.START) + (s.performance.totalProfit || 0));
  stats.peakEquity = Math.max(s.startEquity || NUMERICS.START, stats.peakEquity, netEquity);
  stats.maxDrawdown = Math.max(stats.maxDrawdown, 1 - netEquity / stats.peakEquity);
}

export function protectBalance(s: GameState, trades: TradeReceipt[]): void {
  // Cross-margin losses may exceed one order's margin but cannot consume reserve.
  if (!s.positions.length && s.cash < 0) {
    const relief = -s.cash;
    s.cash = 0;
    const trade = trades[trades.length - 1];
    if (trade) {
      trade.balanceProtection = (trade.balanceProtection || 0) + relief;
      trade.pnl += relief;
    }
  }
  if (Math.abs(s.cash) < 1e-8) s.cash = 0;
  accumulatePerformance(s, trades);
}

export function enforceMargin(s: GameState, exits: TradeReceipt[] = []): TradeReceipt[] {
  while (s.positions.length && (accountMetrics(s).marginLevel ?? Infinity) <= NUMERICS.STOP_OUT_LEVEL) {
    const worst = [...s.positions].sort((a, b) => positionUnrealized(s, a) - positionUnrealized(s, b))[0];
    if (!worst) break;
    exits.push(closePosition(s, 1, 'liquidation', worst.id));
  }
  protectBalance(s, exits);
  return exits;
}

export function closeOrders(s: GameState, fraction: number, reason: string, positionId?: string): TradeReceipt[] {
  ensureOrders(s);
  const targets = positionId ? s.positions.filter((p) => p.id === positionId) : [...s.positions];
  if (!targets.length) throw new Error('没有可平仓位');
  const trades = targets.map((p) => closePosition(s, fraction, reason, p.id));
  enforceMargin(s, trades);
  return trades;
}

export { ensureOrders, syncPosition };