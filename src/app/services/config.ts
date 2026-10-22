/** Optional backend. The game is fully playable offline when unset. */
export const SERVICE_BASE = 'https://kurumi-fx-api.gongfpp.chatgpt.site';
export const LEADERBOARD_PATH = '/api/fx/leaderboard';
export const EVENTS_PATH = '/api/fx/events';

export function serviceConfigured(base: string = SERVICE_BASE): boolean {
  return typeof base === 'string' && /^https?:\/\//.test(base) && base.length > 'https://'.length;
}

export function endpoint(path: string, base: string = SERVICE_BASE): string {
  return base.replace(/\/$/, '') + path;
}

export interface ServiceResult<T = unknown> {
  status: 'ok' | 'service-unconfigured' | 'network-error' | 'error';
  code?: number;
  data?: T;
}

export type FetchLike = (input: string, init?: RequestInit) => Promise<{ ok: boolean; status: number; json(): Promise<unknown> }>;

export async function postJson<T = unknown>(url: string, body: unknown, fetchImpl?: FetchLike): Promise<ServiceResult<T>> {
  const f = fetchImpl ?? (globalThis.fetch as unknown as FetchLike | undefined);
  if (!f) return { status: 'service-unconfigured' };
  try {
    const res = await f(url, {
      method: 'POST',
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) return { status: 'error', code: res.status };
    return { status: 'ok', code: res.status, data: (await res.json()) as T };
  } catch {
    return { status: 'network-error' };
  }
}

export async function getJson<T = unknown>(url: string, fetchImpl?: FetchLike): Promise<ServiceResult<T>> {
  const f = fetchImpl ?? (globalThis.fetch as unknown as FetchLike | undefined);
  if (!f) return { status: 'service-unconfigured' };
  try {
    const res = await f(url, { method: 'GET', credentials: 'omit', referrerPolicy: 'no-referrer' });
    if (!res.ok) return { status: 'error', code: res.status };
    return { status: 'ok', code: res.status, data: (await res.json()) as T };
  } catch {
    return { status: 'network-error' };
  }
}