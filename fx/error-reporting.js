// A closed vocabulary, not an exception serializer. Never accept URLs, messages,
// stack traces, request/response bodies, credentials, aliases or player input.
const scopes = new Set([
  'runtime', 'comments-read', 'comments-write', 'leaderboard-read',
  'leaderboard-run', 'leaderboard-snapshot', 'leaderboard-publish',
  'leaderboard-name', 'developer-request', 'developer-status',
  'developer-close', 'developer-taint',
]);
const kinds = new Set(['runtime-error', 'unhandled-rejection', 'network-error',
  'timeout', 'http-error', 'invalid-response', 'unsafe-response']);
export const ERROR_REPORT_LIMITS = Object.freeze({cooldownMs:60000, hourly:20, attempts:3, maxAgeMs:3600000});
export function safeFailure(scope, kind, status = 0) {
  if (!scopes.has(scope) || !kinds.has(kind)) return null;
  if (scope === 'runtime' ? !['runtime-error','unhandled-rejection'].includes(kind) : ['runtime-error','unhandled-rejection'].includes(kind)) return null;
  const http = Number.isInteger(status) && status >= 100 && status <= 599 ? status : 0;
  return {target:scope, detail:{kind:scope === 'runtime' ? 'runtime' : 'api', code:kind, ...(http ? {reason:'http-' + http} : {})}};
}
// A reporting callback may fail, or return a rejected promise. Neither may
// become an application error or a new unhandled rejection. No global fetch hook.
export function notifyFailure(callback, scope, kind, status = 0) {
  try {
    const value = safeFailure(scope, kind, status);
    if (!value || typeof callback !== 'function') return;
    const result = callback(value.target, value.detail.code, Number.isInteger(status) && status >= 100 && status <= 599 ? status : 0);
    if (result && typeof result.then === 'function') Promise.resolve(result).catch(() => {});
  } catch { /* Reporting is always best effort. */ }
}
