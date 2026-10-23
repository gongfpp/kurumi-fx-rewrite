/** Live quote adapter. Fetch is injectable; failures degrade to simulation. */
export interface LiveQuote {
  price: number;
  at: number;
  source: string;
}

export type FetchText = (url: string) => Promise<string>;

export interface LiveSourceOptions {
  fetchText?: FetchText;
  endpoints?: string[];
}

const DEFAULT_ENDPOINTS = [
  'https://api.frankfurter.app/latest?from=USD&to=JPY',
  'https://open.er-api.com/v6/latest/USD',
];

async function defaultFetchText(url: string): Promise<string> {
  const res = await fetch(url, { credentials: 'omit', referrerPolicy: 'no-referrer' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

function extractPrice(json: unknown): number | null {
  const j = json as { rates?: Record<string, number> };
  const v = j?.rates?.JPY;
  return Number.isFinite(v) ? (v as number) : null;
}

/**
 * Poll a public FX endpoint for USD/JPY. Any failure throws so the caller can
 * fall back to the deterministic simulated feed without breaking the game.
 */
export async function fetchLiveQuote(opts: LiveSourceOptions = {}): Promise<LiveQuote> {
  const fetchText = opts.fetchText ?? defaultFetchText;
  const endpoints = opts.endpoints ?? DEFAULT_ENDPOINTS;
  let lastError: unknown = null;
  for (const url of endpoints) {
    try {
      const price = extractPrice(JSON.parse(await fetchText(url)));
      if (price && price > 0) return { price, at: Date.now(), source: url };
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError ?? new Error('no live source available');
}

export interface LiveState {
  active: boolean;
  source: string | null;
  lastPrice: number | null;
  lastAt: number | null;
  degraded: boolean;
  note: string;
}

export function createLiveState(): LiveState {
  return { active: false, source: null, lastPrice: null, lastAt: null, degraded: false, note: '' };
}

/** Apply a live quote onto state.price and report whether it changed. */
export function applyLiveQuote(s: { price: number }, quote: LiveQuote): boolean {
  if (!(quote.price > 0)) return false;
  if (s.price === quote.price) return false;
  s.price = quote.price;
  return true;
}