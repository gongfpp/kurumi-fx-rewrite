import type { GameState, Mode } from '../../domain/core/types';
import { ENDLESS_KEY, SAVE_KEY, kurumiStorage, type NamespacedStorage } from './storage';

export const SAVE_VERSION = 1;

export interface SaveEnvelope {
  version: number;
  savedAt: number;
  state: GameState;
}

export function saveKeyFor(mode: Mode): string {
  return mode === 'endless' ? ENDLESS_KEY : SAVE_KEY;
}

export function encodeSave(state: GameState, savedAt: number = Date.now()): string {
  return JSON.stringify({ version: SAVE_VERSION, savedAt, state } satisfies SaveEnvelope);
}

export interface DecodeResult {
  state: GameState | null;
  savedAt: number | null;
  reason?: string;
}

export function decodeSave(raw: string | null): DecodeResult {
  if (!raw) return { state: null, savedAt: null, reason: 'empty' };
  try {
    const parsed = JSON.parse(raw) as Partial<SaveEnvelope>;
    if (parsed?.version !== SAVE_VERSION || !parsed.state || typeof parsed.state !== 'object') {
      return { state: null, savedAt: null, reason: 'schema' };
    }
    const state = parsed.state as GameState;
    if (!Number.isFinite(state.day) || typeof state.mode !== 'string') return { state: null, savedAt: null, reason: 'state' };
    return { state, savedAt: Number.isFinite(parsed.savedAt) ? (parsed.savedAt as number) : null };
  } catch {
    return { state: null, savedAt: null, reason: 'parse' };
  }
}

export function saveGame(state: GameState, storage: NamespacedStorage = kurumiStorage()): void {
  storage.write(saveKeyFor(state.mode), encodeSave(state));
}

export function loadGame(mode: Mode, storage: NamespacedStorage = kurumiStorage()): DecodeResult {
  return decodeSave(storage.read(saveKeyFor(mode)));
}

export function clearGame(mode: Mode, storage: NamespacedStorage = kurumiStorage()): void {
  storage.remove(saveKeyFor(mode));
}