import { describe, it, expect } from 'vitest';
import { createDeveloper, disableDeveloper, editDeveloper, enableDeveloper, rankingEligible, sessionExpired, DEVELOPER_SESSION_MS } from '../../src/app/developer/index';

describe('developer mode', () => {
  it('starts inactive and eligible', () => {
    const dev = createDeveloper();
    expect(dev.active).toBe(false);
    expect(rankingEligible(dev)).toBe(true);
  });

  it('opens a bounded session', () => {
    const dev = createDeveloper();
    enableDeveloper(dev, 1000);
    expect(sessionExpired(dev, 1000 + 1000)).toBe(false);
    expect(sessionExpired(dev, 1000 + DEVELOPER_SESSION_MS)).toBe(true);
    disableDeveloper(dev);
    expect(dev.active).toBe(false);
  });

  it('permanently taints on edit', () => {
    const dev = createDeveloper();
    editDeveloper(dev, { profitOffset: 1_000_000 }, 5000);
    expect(dev.tainted).toBe(true);
    expect(rankingEligible(dev)).toBe(false);
    expect(dev.changedAt).toBe(5000);
  });
});