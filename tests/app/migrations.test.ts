import { describe, it, expect } from 'vitest';
import { createGame } from '../../src/domain/core/state';
import { backupKey, ECONOMY_BACKUP_SUFFIX, ensureFields, migrate, MIGRATION_VERSION } from '../../src/app/persistence/migrations';

describe('save migrations', () => {
  it('builds scoped backup keys', () => {
    expect(backupKey('fx-girl-campaign-v3')).toBe('fx-girl-campaign-v3:pre-economy-v1');
    expect(backupKey('fx-girl-endless-v1', 'pre-life-actions-v1')).toBe('fx-girl-endless-v1:pre-life-actions-v1');
    expect(ECONOMY_BACKUP_SUFFIX).toBe('pre-economy-v1');
  });

  it('fills missing newer fields without changing balances', () => {
    const s = createGame(1);
    s.cash = 111_111;
    delete s.story;
    delete s.loan;
    delete s.lottery;
    delete s.effects;
    const { changed } = ensureFields(s);
    expect(changed).toBe(true);
    expect(s.story).toBeTruthy();
    expect(s.loan).toBeTruthy();
    expect(s.lottery).toBeTruthy();
    expect(Array.isArray(s.effects)).toBe(true);
    expect(s.cash).toBe(111_111);
  });

  it('is idempotent on a second run', () => {
    const s = createGame(1);
    ensureFields(s);
    expect(ensureFields(s).changed).toBe(false);
  });

  it('bumps the version and reports the transition', () => {
    const s = createGame(1);
    s.version = 0;
    const res = migrate(s);
    expect(res.toVersion).toBe(MIGRATION_VERSION);
    expect(res.fromVersion).toBe(0);
  });
});