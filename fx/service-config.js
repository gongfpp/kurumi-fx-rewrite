import {RESEARCH_BUILD} from './research-config.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
// The sole public service-origin value. Production is intentionally unconfigured.
// tools/build-fx.mjs writes the explicitly supplied KURUMI_SERVICE_ORIGIN into
// the exported bundle only; tests can inject serviceOrigin without editing it.
export const KURUMI_SERVICE_ORIGIN = "https://kurumi-fx-api.gongfpp.chatgpt.site";
export const KURUMI_CLIENT_PATH = '/fx.html';
export const KURUMI_PAGES_ORIGIN = 'https://gongfpp.github.io';
export const KURUMI_PAGES_PATH = '/kurumi-fx-pages/';
// Toy is enabled only by an explicit build-time origin and canonical game path.
// URL query parameters, referrers and parent-frame messages never configure it.
export const KURUMI_TOY_ORIGIN = '';
export const KURUMI_TOY_PATH = '';
export const SERVICE_UNCONFIGURED_MESSAGE = '久留美独立服务尚未配置，排行榜暂不可用；离线游戏和存档不受影响';

export function validServiceOrigin(value) {
  if (typeof value !== 'string' || !value) return false;
  try {
    const url = new URL(value);
    return url.origin === value && !url.username && !url.password &&
      (url.protocol === 'https:' || (url.protocol === 'http:' && isLoopbackOrigin(value)));
  } catch { return false; }
}
export function isLoopbackOrigin(value) {
  try { const url = new URL(value); return url.origin === value && ['http:', 'https:'].includes(url.protocol) && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname); }
  catch { return false; }
}
export function validToyConfiguration(origin, path, serviceOrigin = KURUMI_SERVICE_ORIGIN) {
  if (!validServiceOrigin(origin) || !origin.startsWith('https:') || isLoopbackOrigin(origin) ||
      new URL(origin).port || !/^[a-z0-9]+(?:[.-][a-z0-9]+)*\.[a-z]{2,}$/.test(new URL(origin).hostname) ||
      origin === KURUMI_PAGES_ORIGIN || origin === serviceOrigin) return false;
  return typeof path === 'string' && path.length <= 300 && path.trim() === path &&
    /^\/toy\/[a-zA-Z0-9_-]+\/index\.html$/.test(path);
}
export function toyLocationMatches(location, origin, path) {
  if (location?.origin !== origin || typeof location?.pathname !== 'string' ||
      location.pathname.trim() !== location.pathname) return false;
  if (location.pathname === path) return true;
  // Platform releases may add one version directory below the fixed game slug.
  // Keep telemetry on the canonical path, never on the actual URL or query.
  const root = path.slice(0, -'index.html'.length);
  return location.pathname.startsWith(root) &&
    /^[a-zA-Z0-9_-]+\/index\.html$/.test(location.pathname.slice(root.length));
}
export function serviceConfiguration({serviceOrigin = KURUMI_SERVICE_ORIGIN,
  toyOrigin = KURUMI_TOY_ORIGIN, toyPath = KURUMI_TOY_PATH, location = globalThis.location} = {}) {
  // Only a loopback browser may use same-origin without a registered service.
  // Invalid explicit configuration must never silently select another backend.
  const origin = serviceOrigin === '' && isLoopbackOrigin(location?.origin) ? location.origin : serviceOrigin;
  const pages = location?.origin === KURUMI_PAGES_ORIGIN;
  const local = isLoopbackOrigin(location?.origin);
  const hosted = validServiceOrigin(origin) && location?.origin === origin;
  const toy = validToyConfiguration(toyOrigin, toyPath, origin) &&
    toyLocationMatches(location, toyOrigin, toyPath);
  const toyRequested = toyOrigin !== '' || toyPath !== '';
  // Preserve legacy Pages/local/Sites behavior. Only an explicitly Toy-bound
  // candidate fails closed on a mismatched container instead of mislabeling it.
  const legacy = pages || local || hosted;
  const mismatchedToy = toyRequested && !legacy && !toy;
  const configured = !RESEARCH_BUILD && validServiceOrigin(origin) && !mismatchedToy;
  return Object.freeze({
    configured, origin: configured ? origin : '',
    status: configured ? 'configured' : 'service-unconfigured',
    leaderboardEndpoint: configured ? origin + '/api/fx/leaderboard' : null,
    eventsEndpoint: configured ? origin + '/api/fx/events' : null,
    channel: pages ? 'github-pages' : local ? 'local' : toy ? 'bilibili-toy' : mismatchedToy ? 'unknown' : 'gpt-site',
    path: pages ? KURUMI_PAGES_PATH : toy ? toyPath : mismatchedToy ? '' : KURUMI_CLIENT_PATH,
  });
}
