import { describe, it, expect } from 'vitest';
import { createGame } from '../../src/domain/core/state';
import { dailyManga, MANGA_PAGES, mangaById, routeManga } from '../../src/domain/story/manga';
import { expressionFor, expressionLabel } from '../../src/domain/mind/expressions';

describe('manga routing', () => {
  it('ships several four-panel pages with source notes', () => {
    expect(MANGA_PAGES.length).toBeGreaterThanOrEqual(6);
    expect(MANGA_PAGES.every((p) => p.panels.length === 4 && ['original', 'fan'].includes(p.origin))).toBe(true);
  });

  it('routes to the liquidation page after a margin call', () => {
    const s = createGame(1);
    expect(routeManga(s, { justLiquidated: true }).route).toBe('liquidation');
  });

  it('routes to the father page when debt is discovered', () => {
    const s = createGame(1);
    s.family = { outstanding: 100_000, discovered: true };
    expect(routeManga(s).route).toBe('father');
  });

  it('returns the calm page on a flat opening day', () => {
    const s = createGame(1);
    expect(routeManga(s).route).toBe('calm');
  });

  it('looks up a page by id', () => {
    expect(mangaById('liquidated')?.title).toBeTruthy();
    expect(mangaById('nope')).toBeNull();
  });

  it('picks a discouraging recap after a big loss', () => {
    const s = createGame(1);
    expect(dailyManga(s, { net: -100_000 }).route).toBe('despair');
  });
});

describe('expressions', () => {
  it('maps calm and despair to visibly different rigs', () => {
    const calm = expressionFor('calm');
    const despair = expressionFor('despair');
    expect(calm.mouth).not.toBe(despair.mouth);
    expect(despair.sweat || despair.shake).toBe(true);
    expect(expressionLabel('despair')).toContain('含泪');
  });

  it('falls back to a base rig for unknown emotions', () => {
    expect(expressionFor('???').eye).toBe('normal');
  });
});