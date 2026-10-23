/** Shared replay: an opaque code that reproduces the exact same deterministic run. */
export interface ReplayCode {
  seed: number;
  day: number;
  mode: 'story' | 'endless';
  v: number;
}

const VERSION = 1;

function toBase64Url(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(code: string): string {
  const b64 = code.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

export function encodeReplay(r: Omit<ReplayCode, 'v'>): string {
  return toBase64Url(JSON.stringify({ ...r, v: VERSION }));
}

export interface DecodeReplayResult {
  replay: ReplayCode | null;
  reason?: string;
}

export function decodeReplay(code: string): DecodeReplayResult {
  if (!code) return { replay: null, reason: 'empty' };
  try {
    const parsed = JSON.parse(fromBase64Url(code.trim())) as Partial<ReplayCode>;
    if (parsed.v !== VERSION || !Number.isFinite(parsed.seed) || !Number.isFinite(parsed.day) || !['story', 'endless'].includes(parsed.mode as string)) {
      return { replay: null, reason: 'schema' };
    }
    return { replay: { seed: parsed.seed as number, day: parsed.day as number, mode: parsed.mode as 'story' | 'endless', v: VERSION } };
  } catch {
    return { replay: null, reason: 'parse' };
  }
}

export function replayFromLocation(search: string): ReplayCode | null {
  const params = new URLSearchParams(search.startsWith('?') ? search : `?${search}`);
  const code = params.get('replay');
  return code ? decodeReplay(code).replay : null;
}

export function shareUrl(base: string, code: string): string {
  const url = new URL(base, globalThis.location?.href ?? 'https://example.com');
  url.searchParams.set('replay', code);
  return url.toString();
}
