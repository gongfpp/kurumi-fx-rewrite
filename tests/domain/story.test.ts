import { describe, it, expect } from 'vitest';
import { createGame } from '../../src/domain/core/state';
import { beginRest, settleDay } from '../../src/domain/core/day';
import { chooseStory, ensureStory, OPENING_PAGES, pendingStory, queueStory, STORY_EVENTS } from '../../src/domain/story/story';

describe('story content', () => {
  it('ships eight opening pages with source notes', () => {
    expect(OPENING_PAGES).toHaveLength(8);
    expect(OPENING_PAGES.every((p) => p.sourceNote && ['fan', 'original'].includes(p.kind))).toBe(true);
  });

  it('ships events each with at least one choice', () => {
    expect(STORY_EVENTS.length).toBeGreaterThanOrEqual(6);
    expect(STORY_EVENTS.every((e) => e.choices.length >= 1 && e.lines.length >= 1)).toBe(true);
  });
});

describe('story flow', () => {
  it('queues an event once and presents it while resting', () => {
    const s = createGame(1);
    s.phase = 'day_end';
    beginRest(s);
    ensureStory(s);
    expect(queueStory(s, 'friendStudy')).toBe(true);
    expect(queueStory(s, 'friendStudy')).toBe(false);
    const ev = pendingStory(s);
    expect(ev?.key).toBe('friendStudy');
  });

  it('applies choice effects and records the log', () => {
    const s = createGame(1);
    s.stress = 10;
    s.phase = 'day_end';
    beginRest(s);
    queueStory(s, 'friendStudy');
    const before = s.stress;
    const { choice } = chooseStory(s, 'listen');
    expect(choice.id).toBe('listen');
    expect(s.stress).toBe(before - 4);
    expect(s.story?.seen).toContain('friendStudy');
    expect(pendingStory(s)).toBeNull();
  });

  it('rejects choosing an unknown option', () => {
    const s = createGame(1);
    s.phase = 'day_end';
    beginRest(s);
    queueStory(s, 'friendStudy');
    expect(() => chooseStory(s, 'nope')).toThrow();
  });

  it('does not present story during the trading phase', () => {
    const s = createGame(1);
    queueStory(s, 'friendStudy');
    expect(pendingStory(s)).toBeNull();
    void settleDay;
  });
});