import openingRaw from '../../content/story/opening.json';
import eventsRaw from '../../content/story/events.json';
import { addEffect } from '../mind/effects';
import { recomputeSanity } from '../mind/sanity';
import type { GameState } from '../core/types';

export interface StoryChoice {
  id: string;
  text: string;
  stress?: number;
  trust?: number;
  mood?: string;
}

export interface StoryEvent {
  key: string;
  title: string;
  original: boolean;
  minDay: number;
  lines: [string, string][];
  choices: StoryChoice[];
}

export interface OpeningPage {
  id: string;
  kind: 'fan' | 'original';
  text: string;
  sourceNote: string;
}

export const STORY_EVENTS: StoryEvent[] = eventsRaw as unknown as StoryEvent[];
export const OPENING_PAGES: OpeningPage[] = openingRaw as unknown as OpeningPage[];

function eventByKey(key: string): StoryEvent | null {
  return STORY_EVENTS.find((e) => e.key === key) ?? null;
}

export function ensureStory(s: GameState): NonNullable<GameState['story']> {
  s.story ||= { seen: [], queue: [], log: [], flags: {}, presentedDay: 0 };
  s.story.seen ||= [];
  s.story.queue ||= [];
  s.story.log ||= [];
  s.story.flags ||= {};
  if (s.fatherUsed && (s.family?.outstanding ?? 0) > 0 && !(s.effects ?? []).some((e) => e.id === 'guilt')) {
    addEffect(s, 'guilt', null);
  }
  return s.story;
}

export function queueStory(s: GameState, key: string): boolean {
  const story = ensureStory(s);
  if (s.mode === 'endless' || !eventByKey(key) || story.seen.includes(key) || story.queue.includes(key)) return false;
  story.queue.push(key);
  return true;
}

export function pendingStory(s: GameState): StoryEvent | null {
  const story = ensureStory(s);
  if (s.mode === 'endless' || s.phase !== 'resting' || story.presentedDay === s.day) return null;
  story.queue = story.queue.filter((key) => !!eventByKey(key));
  const key = story.queue[0];
  return key ? eventByKey(key) : null;
}

export interface ChooseResult {
  event: StoryEvent;
  choice: StoryChoice;
}

export function chooseStory(s: GameState, choiceId: string): ChooseResult {
  if (s.phase !== 'resting') throw new Error('人物事件只在休市后发生');
  const event = pendingStory(s);
  if (!event) throw new Error('没有待处理的剧情');
  const choice = event.choices.find((c) => c.id === choiceId);
  if (!choice) throw new Error('请选择一个回应');
  const story = ensureStory(s);
  story.queue = story.queue.filter((key) => key !== event.key);
  story.presentedDay = s.day;
  story.seen.push(event.key);
  story.log.push({ id: event.key, choice: choice.id, day: s.day });
  story.log = story.log.slice(-40);
  s.stress = Math.max(0, (s.stress || 0) + (choice.stress || 0));
  s.family ||= {};
  s.family.trust = (s.family.trust ?? 0) + (choice.trust ?? 0);
  if (choice.mood) s.emotionPressure = { context: `${s.mode}:${s.runId ?? s.seed}:${s.day}`, direction: choice.mood === 'ecstatic' ? 'ecstatic' : 'despair', taps: 1, target: 1, lastAt: Date.now() };
  if (event.key === 'fatherUnlock') {
    s.family.unlocked = true;
    s.loan ||= { outstanding: 0, borrowed: 0, repaid: 0, limit: 300_000, dailyRate: 0.0005, interestPaid: 0, interestAccrued: 0, lastInterestDay: 0, borrowCount: 0 };
  }
  if (event.key === 'fatherFound') s.family.discovered = true;
  recomputeSanity(s);
  return { event, choice };
}

/** Queue the day's scheduled events while resting. */
export function checkStories(s: GameState): void {
  ensureStory(s);
  if (s.mode === 'endless' || s.phase !== 'resting') return;
  const completed = (id: string): boolean => s.story?.seen.includes(id) ?? false;
  const due = [
    ['friendStudy', 1],
    ['roommate', 2],
    ['quietNight', 3],
  ].find(([id, day]) => s.day >= (day as number) && !completed(id as string));
  if (due) queueStory(s, due[0] as string);
  if (s.family?.outstanding && s.family.outstanding > 0 && !completed('fatherFound') && s.family.discovered) queueStory(s, 'fatherFound');
}