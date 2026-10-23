import panelsRaw from '../../content/manga/panels.json';
import { mood } from '../mind/mood';
import { tradingProfit } from '../core/state';
import type { GameState, TradeReceipt } from '../core/types';

export interface MangaPanel {
  art: string;
  speaker: string;
  text: string;
}

export interface MangaPage {
  id: string;
  route: string;
  title: string;
  origin: 'original' | 'fan';
  sourceNote?: string;
  panels: MangaPanel[];
}

export const MANGA_PAGES: MangaPage[] = panelsRaw as unknown as MangaPage[];

export function mangaById(id: string): MangaPage | null {
  return MANGA_PAGES.find((p) => p.id === id) ?? null;
}

/** Route an illustrative four-panel by liquidation, mood, debt and the day's PnL. */
export function routeManga(s: GameState, opts: { justLiquidated?: boolean; justClosed?: TradeReceipt | null } = {}): MangaPage {
  const emotion = mood(s);
  const last = opts.justClosed ?? s.lastTrade;

  if (opts.justLiquidated || last?.type === 'liquidation') return pick('liquidation');
  if (emotion === 'despair' || emotion === 'trauma-pain') return pick('despair');
  if (s.family?.outstanding && s.family.outstanding > 0 && s.family.discovered) return pick('father');
  if (emotion === 'ecstatic' || (s.heat ?? 0) >= 4) return pick('ecstatic');
  if (last && last.pnl > 0) return pick('profit');
  if (emotion === 'guilty') return pick('father');
  if (emotion === 'recovering' || emotion === 'exhausted') return pick('recovering');
  if (emotion === 'warm') return pick('friend');
  return pick('calm');
}

function pick(route: string): MangaPage {
  return MANGA_PAGES.find((p) => p.route === route) ?? (MANGA_PAGES[0] as MangaPage);
}

/** The day's four-panel recap used on the settlement screen. */
export function dailyManga(s: GameState, report: { net?: number } | null): MangaPage {
  const net = report?.net ?? tradingProfit(s);
  if (net <= -0.2 * (s.startEquity || 1)) return pick('despair');
  if (net >= 0.2 * (s.startEquity || 1)) return pick('ecstatic');
  if (net > 0) return pick('profit');
  return pick('calm');
}