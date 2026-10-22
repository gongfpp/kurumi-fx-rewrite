import { NUMERICS } from '../../content/config/numerics';
import type { Position } from '../core/types';
import { grossPnlAt } from '../market/market';
import { marketPrice, positionMarket } from '../market/market-book';
import { money } from './math';
import type { GameState } from '../core/types';

export function positionUnrealized(s: GameState, p: Position): number {
  return grossPnlAt(p, marketPrice(s, positionMarket(p)));
}

export function positionNetUnrealized(s: GameState, p: Position): number {
  if (!p) return 0;
  return (
    positionUnrealized(s, p) -
    (p.openFeeRemaining || 0) -
    money((p.notional ?? p.margin * p.leverage) * NUMERICS.FEE_RATE)
  );
}