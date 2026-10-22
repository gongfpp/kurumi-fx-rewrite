import { LEADERBOARD_PATH, SERVICE_BASE, endpoint, getJson, postJson, serviceConfigured, type FetchLike, type ServiceResult } from './config';
import type { GameState } from '../../domain/core/types';
import { equity } from '../../domain/trading/account';
import { tradingProfit } from '../../domain/core/state';

export type LeaderboardBoard = 'story' | 'endless';

export interface LeaderboardEntry {
  nickname: string;
  board: LeaderboardBoard;
  survivedDays: number;
  returnRate: number | null;
  netProfit: number;
  maxDrawdown: number;
  anon: boolean;
  ending?: string | null;
}

export function entryFromState(s: GameState, { nickname = '匿名交易者', anon = true }: { nickname?: string; anon?: boolean } = {}): LeaderboardEntry {
  const base = s.startEquity || 1;
  return {
    nickname: anon ? '匿名交易者' : nickname,
    board: s.mode === 'endless' ? 'endless' : 'story',
    survivedDays: s.completedDays ?? 0,
    returnRate: equity(s) / base - 1,
    netProfit: tradingProfit(s),
    maxDrawdown: s.performance?.maxDrawdown ?? 0,
    anon,
    ending: s.ending?.id ?? null,
  };
}

export function submitScore(entry: LeaderboardEntry, { base = SERVICE_BASE, fetchImpl }: { base?: string; fetchImpl?: FetchLike } = {}): Promise<ServiceResult> {
  if (!serviceConfigured(base)) return Promise.resolve({ status: 'service-unconfigured' });
  return postJson(endpoint(LEADERBOARD_PATH, base), entry, fetchImpl);
}

export function fetchLeaderboard(board: LeaderboardBoard, { base = SERVICE_BASE, fetchImpl }: { base?: string; fetchImpl?: FetchLike } = {}): Promise<ServiceResult<LeaderboardEntry[]>> {
  if (!serviceConfigured(base)) return Promise.resolve({ status: 'service-unconfigured' });
  return getJson<LeaderboardEntry[]>(`${endpoint(LEADERBOARD_PATH, base)}?board=${board}`, fetchImpl);
}

export const SORTS = ['survivedDays', 'returnRate', 'netProfit', 'maxDrawdown'] as const;
export type SortKey = (typeof SORTS)[number];

export function sortEntries(entries: LeaderboardEntry[], key: SortKey, desc = true): LeaderboardEntry[] {
  return [...entries].sort((a, b) => {
    const av = (a[key] ?? 0) as number;
    const bv = (b[key] ?? 0) as number;
    if (av === bv) return 0;
    return desc ? (av < bv ? 1 : -1) : av < bv ? -1 : 1;
  });
}