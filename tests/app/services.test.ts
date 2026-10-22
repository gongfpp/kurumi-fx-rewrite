import { describe, it, expect } from 'vitest';
import { createGame } from '../../src/domain/core/state';
import { entryFromState, fetchLeaderboard, sortEntries, submitScore, type LeaderboardEntry } from '../../src/app/services/leaderboard';
import { createTelemetry } from '../../src/app/services/telemetry';
import { serviceConfigured } from '../../src/app/services/config';

function mockFetch(ok: boolean, payload: unknown = {}) {
  const calls: { url: string; init?: RequestInit }[] = [];
  const impl = async (url: string, init?: RequestInit) => {
    calls.push({ url, init });
    return { ok, status: ok ? 200 : 500, json: async () => payload };
  };
  return { impl, calls };
}

describe('service config', () => {
  it('treats the shipped endpoint as configured and empty as unconfigured', () => {
    expect(serviceConfigured()).toBe(true);
    expect(serviceConfigured('')).toBe(false);
  });
});

describe('leaderboard', () => {
  it('builds an anonymous entry from state', () => {
    const s = createGame(1);
    const e = entryFromState(s);
    expect(e.board).toBe('story');
    expect(e.anon).toBe(true);
    expect(e.netProfit).toBe(0);
  });

  it('degrades gracefully when unconfigured', async () => {
    const res = await submitScore(entryFromState(createGame(1)), { base: '' });
    expect(res.status).toBe('service-unconfigured');
  });

  it('posts to the configured endpoint with safe fetch options', async () => {
    const { impl, calls } = mockFetch(true, { ok: true });
    const res = await submitScore(entryFromState(createGame(1)), { fetchImpl: impl });
    expect(res.status).toBe('ok');
    expect(calls[0]?.init?.credentials).toBe('omit');
    expect(calls[0]?.init?.referrerPolicy).toBe('no-referrer');
  });

  it('sorts entries by a key', () => {
    const rows: LeaderboardEntry[] = [
      { nickname: 'a', board: 'story', survivedDays: 3, returnRate: 0.1, netProfit: 100, maxDrawdown: 0.02, anon: true },
      { nickname: 'b', board: 'story', survivedDays: 9, returnRate: 0.05, netProfit: 200, maxDrawdown: 0.01, anon: true },
    ];
    expect(sortEntries(rows, 'survivedDays')[0]?.nickname).toBe('b');
    expect(sortEntries(rows, 'netProfit', false)[0]?.nickname).toBe('a');
  });

  it('fetchLeaderboard is a no-op when unconfigured', async () => {
    const res = await fetchLeaderboard('story', { base: '' });
    expect(res.status).toBe('service-unconfigured');
  });
});

describe('telemetry', () => {
  it('records nothing when disabled', async () => {
    const t = createTelemetry({ enabled: false, anonId: 'x' });
    expect(t.record({ id: 'e1', kind: 'run-start', at: 1 })).toBe(false);
    expect(await t.flush()).toEqual([]);
  });

  it('records, dedupes and flushes when enabled', async () => {
    const { impl, calls } = mockFetch(true);
    const t = createTelemetry({ enabled: true, anonId: 'x', fetchImpl: impl });
    expect(t.record({ id: 'e1', kind: 'run-start', at: 1 })).toBe(true);
    await t.flush();
    expect(t.record({ id: 'e1', kind: 'run-start', at: 1 })).toBe(false);
    expect(calls.length).toBe(1);
  });
});