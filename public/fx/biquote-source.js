// Isolated, inactive-by-default browser adapter. No engine/UI/storage changes.
// Provider terms: https://biquote.io/terms.html (reviewed 2026-10-10).
// Indicative broker quotes, not exchange prints or guaranteed executable prices.
export const BIQUOTE_SYMBOLS = Object.freeze(['USDJPY', 'AUDJPY', 'GBPJPY']);
export const BIQUOTE_ENDPOINT = 'https://biquote.io/api/latest?symbols=USDJPY&symbols=AUDJPY&symbols=GBPJPY';
const positive = n => Number.isFinite(n) && n > 0;
const symbolKey = symbol => typeof symbol === 'string' ? symbol.replace('/', '') : '';
const freeze = Object.freeze;

export function parseBiquoteTick(raw, {symbol, now = Date.now(), maxFutureMs = 5000} = {}) {
  symbol = symbolKey(symbol);
  if (!Number.isSafeInteger(now) || now <= 0 || !Number.isFinite(maxFutureMs) || maxFutureMs < 0) throw Error('invalid-clock');
  if (!BIQUOTE_SYMBOLS.includes(symbol) || !raw || raw.symbol !== symbol) throw Error('symbol-mismatch');
  if (!['bid', 'ask', 'mid'].every(k => positive(raw[k])) || raw.bid > raw.ask || raw.mid < raw.bid || raw.mid > raw.ask) throw Error('invalid-price');
  // The feed's last=0 is not a trade. Preserve its published mid, bid and ask.
  if (typeof raw.timestamp !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,7})?Z$/.test(raw.timestamp)) throw Error('invalid-timestamp');
  const sourceTimestamp = Date.parse(raw.timestamp);
  if (!Number.isFinite(sourceTimestamp) || sourceTimestamp <= 0 || new Date(sourceTimestamp).toISOString().slice(0, 19) !== raw.timestamp.slice(0, 19) || sourceTimestamp > now + maxFutureMs) throw Error('invalid-timestamp');
  if (typeof raw.source !== 'string' || !raw.source.trim()) throw Error('missing-provenance');
  if (!['open', 'closed'].includes(raw.marketState) || typeof raw.stale !== 'boolean') throw Error('missing-market-state');
  return freeze({provider: 'biquote', source: raw.source, symbol: symbol.slice(0, 3) + '/' + symbol.slice(3),
    bid: raw.bid, ask: raw.ask, mid: raw.mid, priceBasis: 'provider-indicative-mid',
    sourceTimestamp, sourceTimestampText: raw.timestamp, receivedAt: now,
    providerMarketState: raw.marketState, providerStale: raw.stale});
}

export function createBiquoteSource({fetchImpl = globalThis.fetch, clock = Date.now,
  intervalMs = 5000, maxAgeMs = 30000, requestTimeoutMs = 10000,
  setTimer = setTimeout, clearTimer = clearTimeout} = {}) {
  if (typeof fetchImpl !== 'function' || typeof clock !== 'function' ||
      !positive(intervalMs) || intervalMs < 1000 || !positive(maxAgeMs) || !positive(requestTimeoutMs)) throw TypeError('Invalid source configuration');
  const quotes = new Map(), issues = new Map(), listeners = new Set();
  let transport = 'idle', responseAt = null, retryAfterMs = intervalMs, blockedUntil = 0;
  let observation = 0, lastError = null;
  let accessDenied = false, running = false, generation = 0, timer = null, inFlight = null, controller = null, cancelPoll = null;
  const now = () => { const t = clock(); if (!Number.isSafeInteger(t) || t <= 0) throw TypeError('Invalid receipt clock'); return t; };
  function snapshot(symbol) {
    symbol = symbolKey(symbol);
    if (!BIQUOTE_SYMBOLS.includes(symbol)) throw TypeError('Unsupported symbol');
    const time = now(), quote = quotes.get(symbol) || null, issue = issues.get(symbol) || null;
    const sourceAgeMs = quote ? Math.max(0, time - quote.sourceTimestamp) : null;
    const status = issue || (!quote ? 'waiting' : quote.providerMarketState === 'closed' ? 'closed' :
      quote.providerStale || sourceAgeMs > maxAgeMs ? 'stale' : 'current');
    return freeze({transport, status, quote, responseAt, sourceAgeMs,
      receivedAgeMs: quote ? Math.max(0, time - quote.receivedAt) : null,
      lastError, canTrade: transport === 'online' && status === 'current', retryAfterMs});
  }
  function notify() { for (const listener of [...listeners]) { try { listener(all()); } catch {} } }
  function all() { return freeze(Object.fromEntries(BIQUOTE_SYMBOLS.map(s => [s, snapshot(s)]))); }
  function apply(payload, at, partial = false) {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) throw Error('invalid-payload');
    const outcomes = {};
    for (const symbol of BIQUOTE_SYMBOLS) {
      if (partial && !Object.hasOwn(payload, symbol)) continue;
      try {
        const candidate = parseBiquoteTick(payload[symbol], {symbol, now: at});
        const previous = quotes.get(symbol);
        if (previous && candidate.sourceTimestamp < previous.sourceTimestamp) throw Error('out-of-order');
        if (previous && candidate.sourceTimestamp === previous.sourceTimestamp) {
          if (candidate.bid !== previous.bid || candidate.ask !== previous.ask || candidate.mid !== previous.mid || candidate.source !== previous.source) {
            // Serial REST snapshots are observations, not provider sequence IDs.
            quotes.set(symbol, freeze({...candidate, observation: ++observation})); outcomes[symbol] = 'accepted'; issues.delete(symbol); continue;
          }
          // Metadata may become closed/stale without a new price. Receipt stays original.
          quotes.set(symbol, freeze({...previous, providerMarketState: candidate.providerMarketState, providerStale: candidate.providerStale}));
          outcomes[symbol] = 'duplicate';
        } else { quotes.set(symbol, freeze({...candidate, observation: ++observation})); outcomes[symbol] = 'accepted'; }
        issues.delete(symbol);
      } catch (error) { issues.set(symbol, error.message); outcomes[symbol] = error.message; }
    }
    return freeze(outcomes);
  }
  function poll() {
    if (accessDenied) return Promise.resolve(freeze({ok: false, reason: 'denied'}));
    if (now() < blockedUntil) return Promise.resolve(freeze({ok: false, reason: 'retry-backoff'}));
    if (inFlight) return inFlight;
    const thisGeneration = generation;
    controller = new AbortController();
    const activeController = controller;
    let timeout;
    // Abort is advisory to an adapter/body reader. The deadline also settles the
    // poll itself so a hung fetch cannot retain inFlight and stop every retry.
    const deadline = new Promise(resolve => { timeout = setTimer(() => { activeController.abort(); resolve({timedOut:true}); }, requestTimeoutMs); });
    const canceled = new Promise(resolve => { cancelPoll = () => resolve({canceled:true}); });
    const request = Promise.resolve().then(async () => {
      const response = await fetchImpl(BIQUOTE_ENDPOINT, {method:'GET', mode:'cors', credentials:'omit', cache:'no-store', signal:activeController.signal});
      return {response, payload:response.ok ? await response.json() : null};
    });
    inFlight = Promise.resolve().then(async () => {
      try {
        const result = await Promise.race([request, deadline, canceled]);
        if (thisGeneration !== generation || result.canceled) return freeze({ok:false, reason:'canceled'});
        if (result.timedOut) throw Error('request-timeout');
        const {response, payload} = result;
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) { transport = 'denied'; accessDenied = true; running = false; }
          else transport = 'disconnected';
          lastError = `http-${response.status}`;
          const retryHeader = response.headers?.get('Retry-After');
          const retrySeconds = retryHeader && /^\d+$/.test(retryHeader) ? Number(retryHeader) * 1000 :
            retryHeader ? Math.max(0, Date.parse(retryHeader) - now()) : 0;
          retryAfterMs = Math.max(intervalMs, Number.isFinite(retrySeconds) ? retrySeconds : 0,
            response.status === 429 ? (retryHeader ? 0 : 60000) : intervalMs * 2);
          if (response.status === 429 || (Number.isFinite(retrySeconds) && retrySeconds > 0)) blockedUntil = now() + retryAfterMs;
          notify(); return freeze({ok: false, reason: `http-${response.status}`});
        }
        if (thisGeneration !== generation) return freeze({ok: false, reason: 'canceled'});
        const at = now(), outcomes = apply(payload, at);
        responseAt = at; transport = 'online'; lastError = null; blockedUntil = 0;
        retryAfterMs = BIQUOTE_SYMBOLS.every(s => snapshot(s).status === 'closed') ? Math.max(60000, intervalMs) : intervalMs; notify();
        return freeze({ok: true, outcomes});
      } catch (error) {
        if (thisGeneration !== generation) return freeze({ok: false, reason: 'canceled'});
        lastError = activeController.signal.aborted ? 'timeout' : 'network-or-payload-error';
        transport = 'disconnected'; retryAfterMs = Math.min(60000, Math.max(intervalMs, retryAfterMs * 2));
        notify(); return freeze({ok: false, reason: activeController.signal.aborted ? 'timeout' : 'network-or-payload-error'});
      } finally { clearTimer(timeout); if (thisGeneration === generation) { inFlight = null; controller = null; cancelPoll = null; } }
    });
    return inFlight;
  }
  async function loop() {
    const thisGeneration = generation;
    await poll();
    if (running && thisGeneration === generation) timer = setTimer(loop, retryAfterMs);
  }
  function start() {
    if (running || accessDenied) return false;
    running = true; transport = 'connecting'; notify(); void loop(); return true;
  }
  function stop() {
    running = false; generation++; if (timer !== null) clearTimer(timer); timer = null;
    controller?.abort(); cancelPoll?.(); cancelPoll = null; controller = null; inFlight = null;
    transport = 'stopped'; notify();
  }
  function subscribe(listener) { if (typeof listener !== 'function') throw TypeError('Expected listener'); listeners.add(listener); return () => listeners.delete(listener); }
  // Both modes read this same source, not separate clocks or random substitutes.
  function forMode(mode) {
    if (!['story', 'endless'].includes(mode)) throw TypeError('Invalid mode');
    return freeze({mode, snapshot, subscribe, executionQuote(symbol, {side, action} = {}) {
      if (!['long', 'short'].includes(side) || !['open', 'close'].includes(action)) throw TypeError('Invalid order');
      const view = snapshot(symbol); if (!view.canTrade) return null;
      const priceBasis = (side === 'long') === (action === 'open') ? 'ask' : 'bid';
      return freeze({...view.quote, priceBasis, price: view.quote[priceBasis]});
    }});
  }
  // Stream ingress shares exactly the REST validation, sequence and freshness policy.
  function ingestTick(raw) {
    const symbol = symbolKey(raw?.symbol);
    if (!BIQUOTE_SYMBOLS.includes(symbol)) return false;
    const at = now(), outcomes = apply({[symbol]: raw}, at, true);
    responseAt = at; transport = 'online'; lastError = null; notify();
    return outcomes[symbol] === 'accepted' || outcomes[symbol] === 'duplicate';
  }
  function disconnect(reason = 'stream-disconnected') {transport = 'disconnected'; lastError = reason; notify();}
  return freeze({snapshot, all, poll, start, stop, subscribe, forMode, ingestTick, disconnect});
}
