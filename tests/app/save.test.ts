import { describe, it, expect } from 'vitest';
import { createGame } from '../../src/domain/core/state';
import { clearGame, decodeSave, encodeSave, loadGame, saveGame } from '../../src/app/persistence/save';
import { kurumiStorage, memoryStorage, scopedKey } from '../../src/app/persistence/storage';

describe('save codec', () => {
  it('round-trips a game state', () => {
    const s = createGame(7, { mode: 'story' });
    s.cash = 123_456.78;
    s.day = 3;
    const decoded = decodeSave(encodeSave(s));
    expect(decoded.state?.day).toBe(3);
    expect(decoded.state?.cash).toBeCloseTo(123_456.78, 2);
  });

  it('rejects malformed payloads', () => {
    expect(decodeSave(null).state).toBeNull();
    expect(decodeSave('not json').state).toBeNull();
    expect(decodeSave(JSON.stringify({ version: 999, state: {} })).state).toBeNull();
  });
});

describe('namespaced storage', () => {
  it('writes under the kurumi prefix only', () => {
    const raw = memoryStorage();
    const storage = kurumiStorage(raw);
    saveGame(createGame(1, { mode: 'story' }), storage);
    const keys = Object.keys(raw.dump());
    expect(keys).toHaveLength(1);
    expect(keys[0]).toBe(scopedKey('fx-girl-campaign-v3'));
    expect(keys[0]?.startsWith('kurumi-fx:')).toBe(true);
  });

  it('loads and clears per mode independently', () => {
    const storage = kurumiStorage(memoryStorage());
    const story = createGame(1, { mode: 'story' });
    story.day = 5;
    saveGame(story, storage);
    expect(loadGame('story', storage).state?.day).toBe(5);
    expect(loadGame('endless', storage).state).toBeNull();
    clearGame('story', storage);
    expect(loadGame('story', storage).state).toBeNull();
  });
});