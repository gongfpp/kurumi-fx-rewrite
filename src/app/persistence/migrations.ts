import { NUMERICS } from '../../content/config/numerics';
import type { GameState } from '../../domain/core/types';

export const MIGRATION_VERSION = 2;
export const ECONOMY_BACKUP_SUFFIX = 'pre-economy-v1';
export const LIFE_BACKUP_SUFFIX = 'pre-life-actions-v1';

export function backupKey(key: string, suffix = ECONOMY_BACKUP_SUFFIX): string {
  return `${key}:${suffix}`;
}

/**
 * Fill fields introduced by later versions without touching existing balances,
 * history or debt. Idempotent: running twice changes nothing the second time.
 */
export function ensureFields(s: GameState): { state: GameState; changed: boolean } {
  let changed = false;
  const set = (cond: boolean, apply: () => void): void => {
    if (cond) {
      apply();
      changed = true;
    }
  };
  set(!s.story, () => {
    s.story = { seen: [], queue: [], log: [], flags: {}, presentedDay: 0 };
  });
  set(!s.loan, () => {
    s.loan = { outstanding: 0, borrowed: 0, repaid: 0, limit: NUMERICS.CREDIT.baseLimit, dailyRate: NUMERICS.CREDIT.baseDailyRate, interestPaid: 0, interestAccrued: 0, lastInterestDay: 0, borrowCount: 0 };
  });
  set(!s.lottery, () => {
    s.lottery = { version: 1, tickets: [], drawsWithoutTop3: 0, cheatRedeemed: false };
  });
  set(!s.effects, () => {
    s.effects = [];
  });
  set(!s.consumptionLedger, () => {
    s.consumptionLedger = [];
  });
  set(!s.recent, () => {
    s.recent = [];
  });
  set(!s.family, () => {
    s.family = { outstanding: 0, discovered: false, trust: 0, repaid: 0 };
  });
  return { state: s, changed };
}

export interface MigrationResult {
  state: GameState;
  changed: boolean;
  fromVersion: number;
  toVersion: number;
}

export function migrate(s: GameState): MigrationResult {
  const fromVersion = Number.isFinite(s.version) ? s.version : 0;
  const { changed } = ensureFields(s);
  s.version = Math.max(fromVersion, MIGRATION_VERSION);
  return { state: s, changed, fromVersion, toVersion: s.version };
}