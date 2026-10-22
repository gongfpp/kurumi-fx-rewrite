import { NUMERICS } from '../../content/config/numerics';
import type { Direction, Position } from '../core/types';

export const PAIR = 'USD/JPY';
export const QUOTE_UNIT = '日元/1 美元';
export const PIP_SIZE = NUMERICS.PIP_SIZE;

export const formatQuote = (n: number): string => (Number.isFinite(n) ? n.toFixed(3) : '—');

export const formatQuantity = (n: number): string =>
  Number.isFinite(n) ? n.toLocaleString('zh-CN', { maximumFractionDigits: 2 }) : '—';

export const isLegacyPosition = (p?: Position | null): boolean => p?.pnlModel === 'legacy-inverse-v5';

export function positionQuantity(p: Position): number | null {
  return isLegacyPosition(p) ? null : (p.notional ?? p.margin * p.leverage) / p.entry;
}

export function grossPnlAt(p: Position, price: number): number {
  if (!p) return 0;
  const n = p.notional ?? p.margin * p.leverage;
  return isLegacyPosition(p) ? n * p.direction * (1 - p.entry / price) : (positionQuantity(p) as number) * p.direction * (price - p.entry);
}

export interface PnlCoefficients {
  linear: number;
  reciprocal: number;
  constant: number;
}

export function pnlCoefficients(p: Position): PnlCoefficients {
  const n = (p.notional ?? p.margin * p.leverage) * p.direction;
  return isLegacyPosition(p)
    ? { linear: 0, reciprocal: -n * p.entry, constant: n }
    : { linear: n / p.entry, reciprocal: 0, constant: -n };
}

export function directionLabel(d: Direction, baseName = '美元'): string {
  return (d === 1 ? '做多' : '做空') + baseName;
}