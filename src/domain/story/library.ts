import commentsRaw from '../../content/comments.json';
import characterRaw from '../../content/story/character-stories.json';
import originalRaw from '../../content/story/original-stories.json';
import { mix, random } from '../core/rng';
import type { GameState } from '../core/types';

export interface CommentEntry {
  id: string;
  role?: string;
  text: string;
  source: string;
}

interface CommentsFile {
  investors: CommentEntry[];
  players: CommentEntry[];
}

const COMMENTS = commentsRaw as unknown as CommentsFile;

export const INVESTOR_COMMENTS = COMMENTS.investors;
export const PLAYER_MESSAGES = COMMENTS.players;

/** Deterministic short-comment rotation for the current day/beat. */
export function currentComments(s: GameState): { investor: CommentEntry; player: CommentEntry } {
  const rng = random(mix(s.seed, s.day + (s.beat || 0) * 31, 0x0c0f));
  const investor = INVESTOR_COMMENTS[Math.floor(rng() * INVESTOR_COMMENTS.length)] as CommentEntry;
  const player = PLAYER_MESSAGES[Math.floor(rng() * PLAYER_MESSAGES.length)] as CommentEntry;
  return { investor, player };
}

export interface StoryBook {
  id: string;
  title: string;
  origin: 'original' | 'fan';
  note?: string;
  sourceNote?: string;
  pages: string[];
}

export const CHARACTER_STORIES: StoryBook[] = characterRaw as unknown as StoryBook[];
export const ORIGINAL_STORIES: StoryBook[] = originalRaw as unknown as StoryBook[];

export function bookById(list: StoryBook[], id: string): StoryBook | null {
  return list.find((b) => b.id === id) ?? null;
}

export function clampPage(index: number, book: StoryBook): number {
  return Math.max(0, Math.min(index, book.pages.length - 1));
}