import { NUMERICS, type MarketDef } from '../../content/config/numerics';
import type { GameState, Position } from '../core/types';

export const MULTI_MARKET_VERSION = 15;

export const MARKETS: readonly MarketDef[] = NUMERICS.MARKETS;

export const marketInfo = (symbol: string): MarketDef => MARKETS.find((m) => m.symbol === symbol) ?? (MARKETS[0] as MarketDef);

export const activeMarket = (s: GameState): string => s.marketBook?.active ?? 'USD/JPY';

export const positionMarket = (p?: Position | null): string => p?.symbol ?? 'USD/JPY';

export function marketSeed(s: GameState, symbol: string = activeMarket(s)): number {
  return (s.seed ^ marketInfo(symbol).seed) >>> 0;
}

export function marketPrice(s: GameState, symbol: string = activeMarket(s)): number {
  return symbol === activeMarket(s) ? s.price : s.marketBook?.markets[symbol]?.price ?? Number.NaN;
}