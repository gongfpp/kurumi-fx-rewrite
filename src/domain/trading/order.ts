import { NUMERICS } from '../../content/config/numerics';
import { tradingTimestamp } from '../core/clock';
import type { GameState, Position, TradeReceipt } from '../core/types';
import { activeMarket } from '../market/market-book';
import { accountMetrics } from './account';
import { fee, floorMoney, marginWithinBudget, money } from './math';
import { restrictions, tradingOpen } from '../mind/sanity';

export type OrderType = 'long' | 'short';
export type StopPips = 10 | 30 | 50 | null;

export interface OrderAction {
  type: OrderType;
  leverage: number;
  amount?: number;
  stake?: number;
  stopPips?: StopPips;
}

export interface OrderPreview {
  valid: boolean;
  error: string | null;
  margin: number;
  notional: number;
  quantity: number;
  openFee: number;
  closeFee: number;
  totalDebit: number;
  maxMargin: number;
  stopPips: StopPips | undefined;
  stopPrice: number | null;
  liquidationPrice: number | null;
  riskPercent: number;
}

function stopConfig(s: GameState, action: OrderAction): { stopPips: StopPips | undefined; stopPrice: number | null } {
  if (Object.prototype.hasOwnProperty.call(action, 'stopPips')) {
    const pips = action.stopPips ?? null;
    if (pips === null) return { stopPips: null, stopPrice: null };
    const dir = action.type === 'short' ? -1 : 1;
    const price = s.price - dir * pips * NUMERICS.PIP_SIZE;
    return { stopPips: pips, stopPrice: price > 0 ? price : null };
  }
  return { stopPips: undefined, stopPrice: null };
}

/** Estimate the JPY quote that would put a standalone new order at stop-out. */
function estimateLiquidation(s: GameState, action: OrderAction, margin: number, openFee: number): number | null {
  if (s.positions.length) return null; // account-wide estimate handled by callers
  const notional = margin * action.leverage;
  if (!(notional > 0)) return null;
  const direction = action.type === 'long' ? 1 : -1;
  const balance = s.cash - openFee;
  const target = NUMERICS.STOP_OUT_LEVEL * margin - balance;
  const a = (notional * direction) / s.price;
  const c = -notional * direction;
  if (Math.abs(a) < 1e-12) return null;
  const price = (target - c) / a;
  return price > 0 ? price : null;
}

export function previewOrder(s: GameState, action: OrderAction): OrderPreview {
  const a = accountMetrics(s);
  const limits = restrictions(s);
  const leverage = action.leverage;
  const factor = Number.isFinite(leverage) ? leverage * NUMERICS.FEE_RATE : 0;
  const marginLimit = (Math.max(0, a.tradingEquity) * limits.stake - a.usedMargin) / (1 + limits.stake * factor);
  const notionalLimit = Number.isFinite(leverage)
    ? (Math.max(0, a.tradingEquity) * limits.leverage - a.notional) / (leverage + limits.leverage * factor)
    : 0;
  const maxMargin = floorMoney(Math.min(marginWithinBudget(a.availableMargin, leverage || 0), Math.max(0, marginLimit), Math.max(0, notionalLimit)));
  const amountMode = Object.prototype.hasOwnProperty.call(action, 'amount');
  const margin = amountMode ? money(action.amount as number) : marginWithinBudget(a.availableMargin * (action.stake || 0), leverage || 0);
  const openFee = fee(margin, leverage || 0);
  const closeFee = openFee;
  const { stopPips, stopPrice } = stopConfig(s, action);

  const result: OrderPreview = {
    valid: false,
    error: null,
    margin,
    notional: margin * (leverage || 0),
    quantity: (margin * (leverage || 0)) / s.price,
    openFee,
    closeFee,
    totalDebit: margin + openFee,
    maxMargin,
    stopPips,
    stopPrice,
    liquidationPrice: null,
    riskPercent: a.tradingEquity > 0 ? ((a.usedMargin + margin) / Math.max(1, a.tradingEquity - openFee)) * 100 : 0,
  };

  let error: string | null = null;
  const stopValid = Object.prototype.hasOwnProperty.call(action, 'stopPips') ? [10, 30, 50, null].includes(action.stopPips ?? null) : true;
  if (!tradingOpen(s)) error = '当前市场已休市';
  else if (!['long', 'short'].includes(action.type) || ![5, 10, 20, 25, 50, 100].includes(leverage) || !stopValid) error = '订单参数无效';
  else if (action.stopPips != null && stopPrice == null) error = '止损点数超出有效报价范围';
  else if (limits.noEntry) error = '承受力过低，先休息';
  else if (leverage > limits.leverage) error = '心理承受力不足，无法使用这个杠杆';
  else if (leverage < limits.minLeverage) error = '当前情绪下杠杆至少 25×';
  else if (limits.forceNoStop && action.stopPips != null) error = '极度亢奋或绝望时只能不设止损';
  else if (margin < 100) error = '保证金至少需要 ¥100';
  else if (margin + openFee > a.availableMargin + 1e-7) error = '可用保证金不足（需要预留开仓手续费）';
  else if (margin > maxMargin + 1e-7) error = '总持仓超过当前心理承受力的风险限额';

  result.error = error;
  result.valid = !error;
  if (result.valid) {
    result.liquidationPrice = estimateLiquidation(s, action, margin, openFee);
  }
  return result;
}

export function placeOrder(s: GameState, action: OrderAction): TradeReceipt {
  const preview = previewOrder(s, action);
  if (!preview.valid) throw new Error(preview.error || '订单参数无效');
  const margin = preview.margin;
  const openFee = preview.openFee;
  const direction = action.type === 'long' ? 1 : -1;
  s.cash -= margin + openFee;
  const id = 'order-' + s.nextOrderId++;
  const position: Position = {
    id,
    symbol: activeMarket(s),
    direction,
    entry: s.price,
    margin,
    initialMargin: margin,
    leverage: action.leverage,
    notional: margin * action.leverage,
    stop: 1,
    stopPips: preview.stopPips,
    stopPrice: preview.stopPrice,
    openFeeRemaining: openFee,
    openFee,
    maxUnrealized: 0,
    pnlModel: 'usd-jpy-v6',
  };
  s.positions.push(position);
  s.position = s.positions[0] as Position;
  const trade: TradeReceipt = {
    type: 'open',
    positionId: id,
    direction,
    margin,
    leverage: action.leverage,
    entry: position.entry,
    exit: position.entry,
    pnl: 0,
    grossPnl: 0,
    fee: openFee,
    openFee,
    closeFee: 0,
    day: s.day,
    beat: s.beat,
    timestamp: tradingTimestamp(s, { day: s.day, beat: s.beat }),
    symbol: position.symbol,
    positionClosed: false,
  };
  s.history.push(trade);
  return trade;
}