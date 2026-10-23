/** Local run history (per browser), used by the "my records" screen. */
export interface RunRecord {
  day: number;
  equity: number;
  profit: number;
  ending: string | null;
  mode: 'story' | 'endless';
  seed: number;
  at: number;
}

const KEY = 'kurumi-fx:records';

export function loadRecords(): RunRecord[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as RunRecord[]) : [];
    return Array.isArray(parsed) ? parsed.slice(0, 30) : [];
  } catch {
    return [];
  }
}

export function pushRecord(r: RunRecord): RunRecord[] {
  const list = [r, ...loadRecords()].slice(0, 30);
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* ignore */
  }
  return list;
}

export function clearRecords(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}