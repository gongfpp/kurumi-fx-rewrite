import { describe, it, expect } from 'vitest';
import { createGame } from '../../src/domain/core/state';
import { consumptionStatement, doDinner, doFriend, doRelax, housingOptions, moveHouse } from '../../src/domain/economy/life-actions';
import { lifestylePlan } from '../../src/domain/economy/living';

describe('life actions', () => {
  it('relaxes: deducts cost, restores stamina and lowers stress', () => {
    const s = createGame(1);
    s.cash = 20_000;
    s.stress = 20;
    s.stamina.value = 50;
    const r = doRelax(s, 'onsen');
    expect(r.applied).toBe(true);
    expect(s.cash).toBe(20_000 - 8000);
    expect(s.stamina.value).toBeGreaterThan(50);
    expect(s.stress).toBe(10);
  });

  it('blocks a second life action on the same day', () => {
    const s = createGame(1);
    s.cash = 20_000;
    doRelax(s, 'shrine');
    expect(doRelax(s, 'park').applied).toBe(false);
  });

  it('dinner raises relationship for a shared meal', () => {
    const s = createGame(1);
    s.cash = 20_000;
    const r = doDinner(s, 'friendMeal');
    expect(r.applied).toBe(true);
    expect(s.relationship).toBe(1);
    expect(s.dinner).toBe(true);
  });

  it('meeting a friend lowers stress', () => {
    const s = createGame(1);
    s.stress = 20;
    const r = doFriend(s, '萌智子');
    expect(r.applied).toBe(true);
    expect(s.stress).toBe(14);
  });

  it('moving house charges the move-in cost and changes the plan', () => {
    const s = createGame(1);
    s.cash = 500_000;
    expect(lifestylePlan(s).id).toBe('basic');
    const r = moveHouse(s, 'generous');
    expect(r.applied).toBe(true);
    expect(s.cash).toBe(500_000 - 135_000);
    expect(lifestylePlan(s).id).toBe('generous');
    expect(housingOptions().length).toBeGreaterThanOrEqual(5);
  });

  it('summarises today consumption', () => {
    const s = createGame(1);
    s.cash = 20_000;
    doRelax(s, 'cafeRest');
    const stmt = consumptionStatement(s);
    expect(stmt.total).toBe(600);
    expect(stmt.rows.length).toBe(1);
  });
});