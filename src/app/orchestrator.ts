import { ACHIEVEMENTS, ITEMS } from '../content/index';
import { NUMERICS } from '../content/config/numerics';
import { assetUrl, voiceUrl } from '../content/assets';
import { energyStage } from '../domain/body/energy';
import { staminaStatus } from '../domain/body/stamina';
import { accountMetrics, positionsOf } from '../domain/trading/account';
import { advanceQuote, beginPlay, beginRest, finalizeDayLiving, nextDay, settleDay } from '../domain/core/day';
import { createGame, tradingProfit } from '../domain/core/state';
import type { GameState } from '../domain/core/types';
import { borrowNetwork, repayNetwork } from '../domain/economy/credit';
import { doDinner, doFriend, doRelax, moveHouse } from '../domain/economy/life-actions';
import { purchaseLottery, redeemCheatLottery, settleLottery } from '../domain/economy/lottery';
import { useSupply } from '../domain/economy/supplies';
import { doWork, LIFE_WORK_JOBS } from '../domain/economy/work';
import type { DayScript } from '../domain/market/quote-grid';
import { addEffect } from '../domain/mind/effects';
import { mood, moodLabel } from '../domain/mind/mood';
import { pressEmotion } from '../domain/mind/pressure';
import { restrictions } from '../domain/mind/sanity';
import { evaluateAchievements } from '../domain/progress/achievements';
import { applyEnding, classifyEnding } from '../domain/progress/ending';
import { dailyManga, routeManga } from '../domain/story/manga';
import { OPENING_PAGES, checkStories, chooseStory, pendingStory, queueStory } from '../domain/story/story';
import { closeOrders } from '../domain/trading/close';
import { maxTopUp, topUpMargin } from '../domain/trading/margin';
import { placeOrder, previewOrder, type OrderType, type StopPips } from '../domain/trading/order';
import { entryFromState, fetchLeaderboard, submitScore, type LeaderboardEntry } from './services/leaderboard';
import { layoutCandles, movingAverage, bollinger, volumeMA } from '../view/charts/candles';
import { createAudio, type AudioController } from '../view/components/audio';
import * as D from '../view/components/dialogs';
import * as P from '../view/components/panels';
import * as L from '../view/components/library-dialogs';
import * as S from '../view/components/source-dialogs';
import { createParticles, countUp, flashTheme, type ParticleSystem } from '../view/components/effects';
import { parseForexite, buildHistoricalScript, historicalDayCount, candlesFromScript } from '../domain/market/sources/historical';
import { fetchLiveQuote, applyLiveQuote, createLiveState, type LiveState } from '../domain/market/sources/live';
import { encodeReplay, decodeReplay, replayFromLocation } from '../domain/market/sources/replay';
import { processRisk } from '../domain/core/day';
import { planDay } from '../domain/market/sources/simulated';
import { historyCandles } from '../domain/market/history';
import { currentComments } from '../domain/story/library';
import { DEFAULT_THEME, THEME_IDS, themeTokens, type ThemeId } from '../view/styles/tokens';
import { loadGame, saveGame, encodeSave, decodeSave, saveKeyFor } from './persistence/save';
import { scopedKey } from './persistence/storage';

const THEME_KEY = 'kurumi-fx:theme';

let state: GameState = createGame(Date.now() >>> 0, { mode: 'story' });
let theme: ThemeId = DEFAULT_THEME;
let leverage = 25;
let amount = 10_000;
let stopPips: StopPips = null;
let period = 15;
let maSet: number[] = [5, 10];
let speed = 1;
let openingPage = 0;
let storyBook = 0;
let storyPage = 0;
let pixelFrontend = false;
let privacyOn = true;
let devVerified = false;
let devTainted = false;
let showBoll = false;
let rankNick = '匿名交易者';
let rankAnon = true;
let rankStatus = '';
let currentSavedAt = 0;
let conflictOpen = false;
let currentRaw: string | null = null;
let rankSort = 'netProfit';
const DEV_PASSWORD = 'kurumi-fx';
let marketSource: 'sim' | 'historical' | 'live' | 'replay' = 'sim';
let historyFile: string | null = null;
let historyDays = 0;
let historyMinutes: { t: number; o: number; h: number; l: number; c: number }[] = [];
let historyDayIdx = 0;
let live: LiveState = createLiveState();
let liveTimer: number | null = null;
let particles: ParticleSystem | null = null;
let prevEquity = Number.NaN;
let hoverIndex = -1;
let hoverY = -1;
let timer: number | null = null;
let modal: string | null = null;
let leaderboard: LeaderboardEntry[] | null = null;
let notice = '';
let lastNewsKey = '';
let newsToast = '';
let tradeToast = '';
let toastTimer: number | null = null;
const log: string[] = [];
const audio: AudioController = createAudio();

const yen = (n: number): string => '¥' + Math.round(n).toLocaleString('zh-CN');
const num = (n: number, d = 2): string => n.toLocaleString('zh-CN', { minimumFractionDigits: d, maximumFractionDigits: d });

function activeScript(): DayScript {
  return state.script as DayScript;
}
function currentEvent() {
  const events = activeScript()?.events ?? [];
  return events[Math.min(state.beat, Math.max(0, events.length - 1))];
}
function debtOf(s: GameState): number {
  return (s.family?.outstanding ?? 0) + (s.loan?.outstanding ?? 0);
}
function stopTimer(): void {
  if (timer !== null) {
    clearInterval(timer);
    timer = null;
  }
}
function persist(): void {
  if (conflictOpen) return;
  try {
    currentRaw = encodeSave(state);
    saveGame(state);
    currentSavedAt = Date.now();
  } catch {
    /* ignore */
  }
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* ignore */
  }
}
function flashToast(kind: 'news' | 'trade', text: string): void {
  if (kind === 'news') newsToast = text;
  else tradeToast = text;
  if (toastTimer !== null) clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    newsToast = '';
    tradeToast = '';
    render();
  }, 3500);
}

function trackNews(): void {
  const ev = currentEvent();
  if (!ev || state.phase === 'ending') return;
  const key = `${state.day}:${state.beat}:${ev.title}`;
  if (key === lastNewsKey) return;
  lastNewsKey = key;
  state.newsLog ||= [];
  state.newsLog.push({ source: ev.source, title: ev.title, copy: ev.copy });
  if (state.newsLog.length > 60) state.newsLog = state.newsLog.slice(-60);
  flashToast('news', `📣 ${ev.title} · ${ev.copy}`);
  audio.playSfx('news');
}

function startTimer(): void {
  stopTimer();
  timer = window.setInterval(() => {
    try {
      const result = advanceQuote(state);
      for (const exit of result.exits) {
        log.unshift(`强平/止损：${exit.type} ${yen(exit.pnl)}`);
        audio.playSfx(exit.type === 'liquidation' ? 'majorLoss' : 'orderClose');
      }
      if (state.phase !== 'playing') {
        stopTimer();
        resolveEnding(false);
        persist();
        render();
      } else {
        patchMarket(result);
      }
    } catch (error) {
      stopTimer();
      log.unshift(`行情暂停：${(error as Error).message}`);
      render();
    }
  }, Math.max(40, 180 / speed));
}

function resolveEnding(walkaway: boolean): void {
  const result = classifyEnding(state, { walkaway });
  if (result && (result.baseId !== 'walkaway' || walkaway)) {
    applyEnding(state, result);
    audio.playSfx(result.baseId === 'million' || result.baseId === 'walkaway' ? 'majorProfit' : 'majorLoss');
    persist();
  }
}

function orderPreviewSafe(): ReturnType<typeof previewOrder> {
  try {
    return previewOrder(state, { type: 'long', leverage, amount, stopPips });
  } catch {
    return { valid: false, error: '参数错误', margin: 0, notional: 0, quantity: 0, openFee: 0, closeFee: 0, totalDebit: 0, maxMargin: 0, stopPips, stopPrice: null, liquidationPrice: null, riskPercent: 0 };
  }
}

export function start(): void {
  const app = document.getElementById('app');
  if (!app) return;
  try {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme && THEME_IDS.includes(savedTheme as ThemeId)) theme = savedTheme as ThemeId;
  } catch {
    /* ignore */
  }
  try {
    const loaded = loadGame('story');
    if (loaded.state) state = loaded.state;
  } catch {
    /* fresh run */
  }
  document.documentElement.dataset.theme = theme;
  document.documentElement.dataset.frontend = pixelFrontend ? 'pixel' : 'default';
  document.documentElement.style.setProperty('--fx-pixel-icon', `url("${assetUrl('pixel-assets/ui-icons-transparent.png')}")`);
  document.documentElement.style.setProperty('--fx-pixel-atlas', `url("${assetUrl('pixel-assets/reference-atlas.png')}")`);
  const fxCanvas = document.createElement('canvas');
  fxCanvas.id = 'fx-particles';
  fxCanvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:80';
  document.body.append(fxCanvas);
  particles = createParticles(fxCanvas);
  app.addEventListener('mousemove', (e) => {
    const el = e.target as HTMLElement;
    if (!el.classList || !el.classList.contains('fx-chart')) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    const candles = state.candles.slice(-48);
    const padding = 18;
    const slot = Math.max(1, rect.width - padding * 2) / Math.max(1, candles.length);
    const idx = Math.min(candles.length - 1, Math.max(0, Math.floor((x - padding) / slot)));
    hoverIndex = idx; hoverY = y;
    const c = candles[idx];
    const tip = document.getElementById('chart-tip');
    if (tip && c) { tip.hidden = false; tip.style.left = `${Math.min(rect.width - 150, x)}px`; tip.style.top = `${y}px`;
      const maLine = maSet.length ? maSet.map((m) => { const v = movingAverage(candles, m)[idx]; return `MA${m} ${v ? v.toFixed(3) : '—'}`; }).join(' · ') : '';
      const bollLine = showBoll ? (() => { const b = bollinger(candles, 20, 2); const v = b.mid[idx]; return `BOLL ${v ? v.toFixed(3) : '—'}`; })() : '';
      tip.innerHTML = `<b>${c.close.toFixed(3)}</b><br>开 ${c.open.toFixed(3)} · 高 ${c.high.toFixed(3)} · 低 ${c.low.toFixed(3)}<br>${maLine}${bollLine ? '<br>' + bollLine : ''}`; }
    drawChart();
  });
  app.addEventListener('mouseout', (e) => {
    const el = e.target as HTMLElement;
    if (el.classList && el.classList.contains('fx-chart')) { hoverIndex = -1; const tip = document.getElementById('chart-tip'); if (tip) tip.hidden = true; drawChart(); }
  });
  try { const nk = localStorage.getItem('kurumi-fx:nickname'); if (nk) rankNick = nk; } catch { /* ignore */ }
  watchStorageConflict();
  const urlReplay = replayFromLocation(globalThis.location?.search ?? '');
  if (urlReplay) applyReplay(encodeReplay(urlReplay));
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && modal) {
      modal = null;
      render();
    }
    if (modal) return;
    if (ev.key === 'ArrowRight' || ev.key === 'ArrowLeft') {
      const n = Math.min(48, state.candles.length);
      if (n > 0) {
        hoverIndex = Math.max(0, Math.min(n - 1, (hoverIndex < 0 ? n - 1 : hoverIndex) + (ev.key === 'ArrowRight' ? 1 : -1)));
        hoverY = 130;
        drawChart();
      }
      return;
    }
    if (ev.key === 'ArrowUp') {
      amount = Math.min(amount + 1000, 10_000_000);
      render();
    } else if (ev.key === 'ArrowDown') {
      amount = Math.max(100, amount - 1000);
      render();
    } else if (ev.key === 'Enter' && state.phase === 'decision') {
      onAction('long');
    } else if (ev.key === ' ') {
      ev.preventDefault();
      onAction(state.phase === 'decision' ? 'play' : 'hold');
    }
  });
  app.addEventListener('click', (e) => {
    const el = (e.target as HTMLElement).closest('[data-act], [data-theme-set]') as HTMLElement | null;
    if (!el) return;
    if (el.dataset.themeSet) {
      theme = el.dataset.themeSet as ThemeId;
      flashTheme();
      persist();
      render();
      return;
    }
    const act = el.dataset.act as string;
    if (act === 'modal:close') {
      modal = null;
      render();
      return;
    }
    if (act.startsWith('open:')) {
      modal = act.slice(5);
      if (modal === 'opening') openingPage = 0;
      render();
      return;
    }
    onAction(act);
  });
  app.addEventListener('input', (e) => {
    const field = (e.target as HTMLElement).dataset.field;
    if (field === 'amount') {
      amount = Number((e.target as HTMLInputElement).value);
      render();
    } else if (field === 'volume') {
      audio.setVolume(Number((e.target as HTMLInputElement).value) / 100);
      render();
    }
    // Other fields (password / file inputs) keep their own state; do not re-render.
  });
  app.addEventListener('change', (e) => {
    const field = (e.target as HTMLElement).dataset.field;
    if (field === 'leverage') leverage = Number((e.target as HTMLSelectElement).value);
    if (field === 'stopPips') {
      const v = (e.target as HTMLSelectElement).value;
      stopPips = v === '' ? null : (Number(v) as StopPips);
    }
    if (field) render();
  });
  app.addEventListener('change', async (e) => {
    const field = (e.target as HTMLElement).dataset.field;
    if (field === 'restore') {
      const input = e.target as HTMLInputElement;
      const file = input.files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const restored = decodeSave(text);
        if (restored.state) {
          state = restored.state;
          notice = '已从备份恢复。';
        } else {
          notice = '备份文件无效。';
        }
      } catch {
        notice = '恢复失败。';
      }
      render();
    }
  });
  render();
  const boot = document.getElementById('boot');
  if (boot) {
    boot.classList.add('hide');
    window.setTimeout(() => boot.remove(), 500);
  }
}

function fatherTake(take: number): string {
  const remaining = NUMERICS.FATHER_SAVINGS - (state.family?.outstanding ?? 0);
  const amt = Math.min(take, remaining);
  if (amt <= 0) return '柜子里已经没钱了';
  state.family ||= {};
  state.family.outstanding = (state.family.outstanding ?? 0) + amt;
  state.family.unlocked = true;
  state.cash += amt;
  state.externalFunding += amt;
  state.fatherUsed = true;
  addEffect(state, 'guilt', null);
  return `取出 ${yen(amt)}，这会计入欠款`;
}
function fatherRepay(): string {
  const owed = state.family?.outstanding ?? 0;
  const pay = Math.min(owed, Math.max(0, state.cash));
  if (pay <= 0) return '没有可归还的金额';
  state.family ||= {};
  state.family.outstanding = (state.family.outstanding ?? 0) - pay;
  state.family.repaid = (state.family.repaid ?? 0) + pay;
  state.cash -= pay;
  state.externalFunding = Math.max(0, state.externalFunding - pay);
  if ((state.family.outstanding ?? 0) <= 0) state.effects = (state.effects ?? []).filter((x) => x.id !== 'guilt');
  return `归还 ${yen(pay)}`;
}

function onAction(act: string): void {
  notice = '';
  try {
    if (act.startsWith('stake:')) {
      const v = Number(act.split(':')[1]);
      amount = Math.max(100, Math.floor(orderPreviewSafe().maxMargin * v));
      stakeApplied();
    } else if (act.startsWith('amount:')) {
      if (act.endsWith('random')) {
        const max = Math.max(100, Math.floor(orderPreviewSafe().maxMargin));
        amount = Math.max(100, Math.floor((Math.random() * max) / 100) * 100);
      } else {
        amount = Number(act.split(':')[1]);
      }
    } else if (act.startsWith('period:')) {
      period = Number(act.split(':')[1]);
    } else if (act.startsWith('ma:')) {
      const m = Number(act.split(':')[1]);
      maSet = maSet.includes(m) ? maSet.filter((x) => x !== m) : [...maSet, m];
    } else if (act === 'boll') {
      showBoll = !showBoll;
    } else if (act === 'amount:+1000') {
      amount = Math.min(amount + 1000, Math.max(100, Math.floor(orderPreviewSafe().maxMargin)));
    } else if (act === 'amount:-1000') {
      amount = Math.max(100, amount - 1000);
    } else if (act.startsWith('tab:')) {
      const id = 'col-' + act.split(':')[1];
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    } else if (act.startsWith('rank:sort:')) {
      rankSort = act.split(':')[2] as string;
    } else if (act === 'rank:anon') {
      rankAnon = !rankAnon;
    } else if (act === 'rank:submit' || act === 'rank:retry') {
      const input = document.querySelector('[data-field="nickname"]') as HTMLInputElement | null;
      if (input && input.value) rankNick = input.value;
      try { localStorage.setItem('kurumi-fx:nickname', rankNick); } catch { /* ignore */ }
      void submitRank();
    } else if (act === 'conflict:keep') {
      try {
        const loaded = loadGame(state.mode);
        if (loaded.state) state = loaded.state;
        notice = '已载入最新存档。';
      } catch { notice = '载入失败。'; }
      conflictOpen = false;
      modal = null;
    } else if (act === 'conflict:overwrite') {
      conflictOpen = false;
      persist();
      notice = '已保留本页进度并覆盖存档。';
      modal = null;
    } else if (act.startsWith('speed:')) {
      speed = Number(act.split(':')[1]);
      if (state.phase === 'playing') startTimer();
    } else if (act.startsWith('press:')) {
      const kind = act.split(':')[1] === 'lev' ? 'leverage' : 'stake';
      const value = kind === 'leverage' ? leverage : Math.max(0.1, Math.min(1, amount / Math.max(1, orderPreviewSafe().maxMargin)));
      const res = pressEmotion(state, { kind, value, soft: true, emotion: mood(state) });
      if (res.unlocked) {
        state.dailyLeverageUnlocked = true;
        state.heat = Math.min(5, (state.heat ?? 0) + 1);
        log.unshift('突破心理锁！本日可用更高杠杆/仓位');
        audio.playSfx('pressureRise');
        particles?.burst(window.innerWidth * 0.25, window.innerHeight * 0.45, 'spark', 22);
      } else if (res.accepted) {
        audio.playSfx('pressureHit');
      } else {
        log.unshift('现在还不能连点');
      }
    } else if (act.startsWith('half:')) {
      closeOrders(state, 0.5, 'manual', act.split(':')[1]);
      log.unshift('全部减半');
    } else if (act.startsWith('close:')) {
      closeOrders(state, 1, 'manual', act.split(':')[1]);
      log.unshift('平仓');
    } else if (act.startsWith('margin:')) {
      const id = positionsOf(state)[0]?.id;
      if (!id) {
        log.unshift('没有可追加的持仓');
      } else {
        const req = act === 'margin:max' ? maxTopUp(state) : Number(act.split(':')[1]);
        const r = topUpMargin(state, id, req);
        log.unshift(r.applied ? `追加保证金 ${yen(r.amount)}` : `${r.reason}`);
      }
    } else if (act.startsWith('mode:')) {
      const mode = act.split(':')[1] as 'story' | 'endless';
      stopTimer();
      state = createGame(Date.now() >>> 0, { mode });
      log.unshift(mode === 'endless' ? '进入操盘模式' : '进入剧情模式');
      modal = null;
    } else if (act.startsWith('supply:')) {
      const r = useSupply(state, act.split(':')[1] as string);
      log.unshift(r.applied ? `使用 ${r.id}` : `无法使用：${r.reason}`);
      audio.playSfx(r.applied ? 'success' : 'reject');
    } else if (act.startsWith('work:')) {
      const r = doWork(state, act.split(':')[1] as string);
      log.unshift(r.applied ? `打工 +${yen(r.income)}` : `无法打工：${r.reason}`);
    } else if (act.startsWith('life:relax:')) {
      const r = doRelax(state, act.split(':')[2] as string);
      log.unshift(r.applied ? `放松：${r.label}` : `${r.reason}`);
    } else if (act.startsWith('life:dinner:')) {
      const r = doDinner(state, act.split(':')[2] as string);
      log.unshift(r.applied ? `晚餐：${r.label}` : `${r.reason}`);
    } else if (act.startsWith('life:friend:')) {
      const r = doFriend(state, act.split(':')[2] as string);
      log.unshift(r.applied ? `和${r.label}见面，压力下降` : `${r.reason}`);
    } else if (act.startsWith('life:house:')) {
      const r = moveHouse(state, act.split(':')[2] as string);
      log.unshift(r.applied ? `搬到 ${r.label}` : `${r.reason}`);
    } else if (act === 'lottery:buy') {
      const r = purchaseLottery(state);
      log.unshift(r.applied ? '买了一张彩票' : `买不了：${r.reason}`);
    } else if (act === 'lottery:cheat') {
      const r = redeemCheatLottery(state, '201402');
      log.unshift(r.applied ? '暗号生效！' : `暗号无效：${r.reason}`);
    } else if (act.startsWith('credit:borrow:')) {
      const r = borrowNetwork(state, Number(act.split(':')[2]));
      log.unshift(r.applied ? `借入 ${yen(r.amount)}` : `${r.reason}`);
    } else if (act === 'credit:repay:all') {
      const r = repayNetwork(state, Number.MAX_SAFE_INTEGER);
      log.unshift(r.applied ? `归还 ${yen(r.amount)}` : `${r.reason}`);
    } else if (act.startsWith('father:take:')) {
      log.unshift(fatherTake(Number(act.split(':')[2])));
    } else if (act.startsWith('father:repay')) {
      log.unshift(fatherRepay());
    } else if (act === 'audio:bgm-toggle') {
      audio.setBgmEnabled(!audio.state.bgmEnabled);
      if (audio.state.bgmEnabled && audio.state.currentBgm) audio.playBgm(audio.state.currentBgm);
    } else if (act === 'audio:sfx-toggle') {
      audio.setSfxEnabled(!audio.state.sfxEnabled);
    } else if (act.startsWith('bgm:play:')) {
      audio.setBgmEnabled(true);
      audio.playBgm(act.split(':')[2] as string);
    } else if (act.startsWith('voice:play:')) {
      playVoice(act.slice('voice:play:'.length));
    } else if (act.startsWith('opening:')) {
      const cmd = act.split(':')[1];
      if (cmd === 'next') openingPage = Math.min(OPENING_PAGES.length - 1, openingPage + 1);
      else if (cmd === 'prev') openingPage = Math.max(0, openingPage - 1);
      else if (cmd === 'skip') modal = null;
    } else if (act.startsWith('story:')) {
      const parts = act.split(':');
      const { choice } = chooseStory(state, parts[2] as string);
      log.unshift(`剧情 ${parts[1]}：${choice.text}`);
    } else if (act === 'play') {
      modal = null;
      beginPlay(state);
      startTimer();
    } else if (act === 'long' || act === 'short') {
      placeOrder(state, { type: act as OrderType, leverage, amount, stopPips });
      log.unshift(`${act === 'long' ? '做多' : '做空'} @${num(state.price, 3)}`);
      flashToast('trade', `${act === 'long' ? '做多' : '做空'}成交 ${yen(amount)} · ${leverage}×`);
      particles?.burst(window.innerWidth * 0.75, window.innerHeight * 0.5, 'spark', 14);
      audio.playSfx('orderOpen');
    } else if (act === 'closeall') {
      closeOrders(state, 1, state.phase === 'playing' ? 'manual' : 'closing');
      log.unshift('全部平仓');
      audio.playSfx('orderClose');
    } else if (act === 'hold') {
      /* keep positions */
    } else if (act === 'settle') {
      const report = settleDay(state);
      finalizeDayLiving(state);
      settleLottery(state, { endOfDay: true });
      log.unshift('今日已结算');
      audio.playSfx((report.net ?? 0) >= 0 ? 'landProfit' : 'landLoss');
      if ((report.net ?? 0) > 0) particles?.burst(window.innerWidth * 0.5, window.innerHeight * 0.5, 'coin', 30);
      modal = 'recap';
    } else if (act === 'rest') {
      beginRest(state);
      checkStories(state);
      if (!pendingStory(state)) queueStory(state, 'quietNight');
    } else if (act === 'next') {
      nextDay(state);
      if (marketSource === 'historical') {
        historyDayIdx += 1;
        applyHistoricalDay(historyDayIdx);
      }
      modal = null;
    } else if (act === 'walkaway') {
      modal = 'walkaway';
    } else if (act === 'walkaway:confirm') {
      resolveEnding(true);
      modal = null;
    } else if (act === 'share') {
      modal = 'share';
    } else if (act === 'share:json') {
      exportShare();
    } else if (act === 'share:png') {
      exportSharePng();
    } else if (act === 'leaderboard') {
      void loadLeaderboard();
      modal = 'leaderboard';
    } else if (act === 'pixel') {
      pixelFrontend = !pixelFrontend;
    } else if (act.startsWith('charstory:') || act.startsWith('origstory:')) {
      const parts = act.split(':');
      const kind = parts[0];
      if (parts[1] === 'book') {
        storyBook = Number(parts[2]);
        storyPage = 0;
      } else if (parts[1] === 'next') storyPage += 1;
      else if (parts[1] === 'prev') storyPage = Math.max(0, storyPage - 1);
      modal = kind;
    } else if (act === 'privacy:toggle') {
      privacyOn = !privacyOn;
      try {
        localStorage.setItem('kurumi-fx:telemetry', privacyOn ? 'on' : 'off');
      } catch {
        /* ignore */
      }
    } else if (act === 'dev:verify') {
      const input = document.querySelector('[data-field="devpass"]') as HTMLInputElement | null;
      if (input && input.value === DEV_PASSWORD) {
        devVerified = true;
        devTainted = true;
      } else {
        log.unshift('开发者密码错误');
      }
    } else if (act.startsWith('dev:cash:')) {
      state.cash = Number(act.split(':')[2]);
      devTainted = true;
    } else if (act.startsWith('dev:sanity:')) {
      state.sanity = Number(act.split(':')[2]);
      devTainted = true;
    } else if (act === 'dev:stress:0') {
      state.stress = 0;
      devTainted = true;
    } else if (act === 'save:download' || act === 'save:download-report') {
      exportShare();
    } else if (act === 'save:latest') {
      try {
        const loaded = loadGame('story');
        if (loaded.state) state = loaded.state;
        notice = '已载入最新存档。';
      } catch {
        notice = '载入失败。';
      }
    } else if (act.startsWith('source:')) {
      const kind = act.split(':')[1] as 'sim' | 'historical' | 'live' | 'replay';
      marketSource = kind;
      if (kind === 'sim') {
        stopLive();
        state.script = planDay(state.seed, state.day, state.price);
      } else if (kind === 'replay') {
        notice = '粘贴回放码后点「载入回放」。';
      }
    } else if (act === 'history:load') {
      const sel = document.querySelector('[data-field="historyFile"]') as HTMLSelectElement | null;
      if (sel && sel.value) void loadHistorical(sel.value);
      else notice = '请先选择历史数据文件。';
    } else if (act === 'live:start') {
      startLive();
    } else if (act === 'live:stop') {
      stopLive();
      marketSource = 'sim';
      notice = '已停止实时行情。';
    } else if (act === 'replay:copy') {
      const code = encodeReplay({ seed: state.seed, day: state.day, mode: state.mode });
      try {
        const pr = navigator.clipboard?.writeText(code);
        if (pr) void pr.catch(() => undefined);
      } catch {
        /* ignore */
      }
      notice = `回放码：${code}`;
    } else if (act === 'replay:load') {
      const input = document.querySelector('[data-field="replayCode"]') as HTMLInputElement | null;
      if (input && input.value) applyReplay(input.value);
      else notice = '请输入回放码。';
    } else if (act === 'new') {
      modal = 'restart';
    } else if (act === 'restart:confirm') {
      newGame();
      return;
    }
    if (!state.ending && state.phase !== 'playing' && state.phase !== 'decision') resolveEnding(false);
  } catch (error) {
    log.unshift((error as Error).message);
    audio.playSfx('reject');
  }
  persist();
  render();
}

function stakeApplied(): void {
  log.unshift(`按比例设定保证金：${yen(amount)}`);
}

function playVoice(file: string): void {
  const AudioCtor = (globalThis as { Audio?: typeof Audio }).Audio;
  if (!AudioCtor) return;
  const el = new AudioCtor(voiceUrl(file));
  el.volume = audio.state.volume;
  void el.play().catch(() => {
    /* ignore */
  });
}

function download(name: string, blob: Blob): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function exportShare(): void {
  try {
    download(`FX-${state.mode}-战报-第${state.day}天.json`, new Blob([encodeSave(state, Date.now())], { type: 'application/json' }));
    notice = '已导出存档 / 战报 JSON。';
  } catch {
    notice = '导出失败。';
  }
}

function exportSharePng(): void {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 360;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const t = themeTokens(theme);
    ctx.fillStyle = t.bg;
    ctx.fillRect(0, 0, 640, 360);
    ctx.strokeStyle = t.accent;
    ctx.lineWidth = 4;
    ctx.strokeRect(12, 12, 616, 336);
    ctx.fillStyle = t.ink;
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText('FX韭留美 · 今天也要回本', 40, 70);
    ctx.font = '16px sans-serif';
    const m = accountMetrics(state);
    const lines = [
      `第 ${state.day} 天 · ${state.mode === 'endless' ? '操盘模式' : '剧情模式'}`,
      `总资产：${yen(m.equity)}`,
      `总欠款：${yen(debtOf(state))}`,
      `心理：${Math.round(state.sanity)} / 体力：${Math.round(staminaStatus(state).value)}`,
      `累计交易：${yen(tradingProfit(state))}`,
    ];
    lines.forEach((l, i) => ctx.fillText(l, 40, 120 + i * 34));
    ctx.fillStyle = t.muted;
    ctx.font = '12px sans-serif';
    ctx.fillText('原创同人小游戏 · 非官方作品 · 虚构行情 · 非投资建议', 40, 340);
    canvas.toBlob((blob) => {
      if (blob) download(`FX-战报-第${state.day}天.png`, blob);
    });
    notice = '已生成战报卡 PNG。';
  } catch {
    notice = '生成战报卡失败。';
  }
}

function newGame(): void {
  stopTimer();
  log.length = 0;
  leaderboard = null;
  modal = null;
  state = createGame(Date.now() >>> 0, { mode: 'story' });
  persist();
  render();
}

async function loadLeaderboard(): Promise<void> {
  const res = await fetchLeaderboard(state.mode === 'endless' ? 'endless' : 'story');
  if (res.status === 'ok' && Array.isArray(res.data)) {
    leaderboard = res.data;
    notice = '已加载名人堂。';
  } else {
    leaderboard = [entryFromState(state)];
    notice = res.status === 'service-unconfigured' ? '云端未配置，显示本地成绩。' : '暂时无法连接名人堂，显示本地成绩。';
  }
  render();
}


function sourceStatus(): S.SourceStatus {
  return { current: marketSource, historyFile, live, replayCode: encodeReplay({ seed: state.seed, day: state.day, mode: state.mode }), historyDays };
}

async function loadHistorical(file: string): Promise<void> {
  try {
    historyFile = file;
    const res = await fetch(assetUrl(file));
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = await res.arrayBuffer();
    let text: string;
    const DS = (globalThis as { DecompressionStream?: new (f: string) => unknown }).DecompressionStream;
    if (DS && file.endsWith('.gz')) {
      const stream = new Blob([buf]).stream().pipeThrough(new DS('gzip') as unknown as ReadableWritablePair<Uint8Array, Uint8Array>);
      text = await new Response(stream).text();
    } else {
      text = new TextDecoder().decode(buf);
    }
    const minutes = parseForexite(text);
    if (!minutes.length) throw new Error('没有解析到历史数据');
    historyMinutes = minutes;
    historyDays = historicalDayCount(minutes);
    historyDayIdx = 0;
    applyHistoricalDay(0);
    marketSource = 'historical';
    notice = `已载入历史数据：${historyDays} 个交易日。`;
  } catch (error) {
    marketSource = 'sim';
    notice = `历史数据载入失败：${(error as Error).message}`;
  }
  persist();
  render();
}

function applyHistoricalDay(dayIdx: number): void {
  const script = buildHistoricalScript(historyMinutes, dayIdx);
  state.script = script;
  state.candles = candlesFromScript(script);
  const first = script.tracks[0]?.[0]?.[0] ?? state.price;
  state.price = first;
}

function stopLive(): void {
  if (liveTimer !== null) {
    clearInterval(liveTimer);
    liveTimer = null;
  }
  live = { ...live, active: false };
}

function startLive(): void {
  stopLive();
  live = { active: true, source: null, lastPrice: null, lastAt: null, degraded: false, note: '' };
  const poll = async (): Promise<void> => {
    try {
      const quote = await fetchLiveQuote();
      applyLiveQuote(state, quote);
      live = { active: true, source: quote.source, lastPrice: quote.price, lastAt: quote.at, degraded: false, note: '' };
      processRisk(state);
      marketSource = 'live';
      render();
    } catch {
      live = { active: false, source: null, lastPrice: null, lastAt: null, degraded: true, note: '连接失败，已降级为模拟盘' };
      marketSource = 'sim';
      stopLive();
      render();
    }
  };
  void poll();
  liveTimer = window.setInterval(() => void poll(), 3000);
  marketSource = 'live';
  notice = '已启动实时行情（公开汇率源，可能失败）。';
  persist();
  render();
}

function applyReplay(code: string): boolean {
  const res = decodeReplay(code);
  if (!res.replay) {
    notice = `回放码无效：${res.reason ?? ''}`;
    return false;
  }
  stopTimer();
  stopLive();
  state = createGame(res.replay.seed, { mode: res.replay.mode });
  state.day = Math.max(1, res.replay.day);
  state.script = planDay(state.seed, state.day, state.price);
  state.candles = historyCandles(state.seed);
  marketSource = 'replay';
  notice = `已载入共享回放：种子 ${res.replay.seed} · 第 ${state.day} 天。`;
  return true;
}


async function submitRank(): Promise<void> {
  try {
    const entry = entryFromState(state, { nickname: rankNick, anon: rankAnon });
    const res = await submitScore(entry);
    rankStatus = res.status === 'ok' ? '已上榜。' : res.status === 'service-unconfigured' ? '云端未配置，已保存本地成绩。' : '上榜失败，可重试。';
    if (!leaderboard) leaderboard = [entry];
    if (res.status === 'ok') void loadLeaderboard();
    log.unshift(rankStatus);
  } catch {
    rankStatus = '上榜失败，可重试。';
  }
  persist();
  render();
}

function watchStorageConflict(): void {
  window.addEventListener('storage', (ev) => {
    if (!ev.key || ev.key !== scopedKey(saveKeyFor(state.mode))) return;
    if (ev.newValue && ev.newValue === currentRaw) return;
    const meta = decodeSave(ev.newValue ?? null);
    if (meta.state && meta.savedAt && meta.savedAt > currentSavedAt) {
      conflictOpen = true;
      modal = 'conflict';
      render();
    }
  });
}

function buildModal(): string {
  switch (modal) {
    case 'manga':
      return D.mangaDialog(state, routeManga(state));
    case 'recap':
      return D.mangaDialog(state, state.dayReport ? dailyManga(state, state.dayReport) : routeManga(state));
    case 'scenes':
      return D.sceneGalleryDialog();
    case 'items':
      return D.itemDialog(state);
    case 'life':
      return D.lifeDialog(state);
    case 'news':
      return D.newsDialog(state);
    case 'achievements':
      return D.achievementsDialog(state);
    case 'leaderboard':
      return D.leaderboardDialog(leaderboard, { sort: rankSort, myNick: rankNick });
    case 'voice':
      return D.vocalDialog();
    case 'settings':
      return D.settingsDialog(audio.state);
    case 'opening':
      return P.openingPagerHtml(openingPage, OPENING_PAGES);
    case 'events':
      return D.eventsDialog();
    case 'help':
      return D.helpDialog();
    case 'lottery':
      return D.lotteryDialog(state);
    case 'credit':
      return D.creditDialog(state);
    case 'father':
      return D.fatherDialog(state);
    case 'source':
      return S.sourceDialog(state, sourceStatus());
    case 'margin':
      return P.marginDialog(state);
    case 'bankrupt':
      return P.bankruptDialog(state);
    case 'walkaway':
      return P.walkawayDialog(state);
    case 'share':
      return P.shareDialog(state, themeTokens(theme));
    case 'restart':
      return D.shell('重开确认', '<div class="fx-caption">将放弃当前进度并开始新的一局。</div><div class="fx-actions"><button data-act="restart:confirm">重开韭菜人生</button><button data-act="modal:close">先等等</button></div>');
    case 'mangalib':
      return L.mangaLibraryDialog();
    case 'charstory':
      return L.characterStoryDialog(storyBook, storyPage);
    case 'origstory':
      return L.originalStoryDialog(storyBook, storyPage);
    case 'comments': {
      const c = currentComments(state);
      return L.commentsDialog(c.investor, c.player);
    }
    case 'privacy':
      return L.privacyDialog(privacyOn);
    case 'developer':
      return L.developerDialog(state, { active: devVerified, verified: devVerified, tainted: devTainted, password: '', note: devTainted ? '本局已被标记：不计入排行榜与成就。' : '开发者模式会话限时，修改会永久标记。' });
    case 'save':
      return L.saveDialog();
    case 'rank':
      return P.rankDialog(state, { nickname: rankNick, anon: rankAnon, status: rankStatus });
    case 'conflict':
      return P.conflictDialog();
    default:
      return '';
  }
}

const TOP_BUTTONS: [string, string][] = [
  ['open:source', '模式/行情源'],
  ['open:manga', '漫画'],
  ['open:mangalib', '原作漫画'],
  ['open:charstory', '人物篇章'],
  ['open:origstory', '原创剧情'],
  ['open:items', '道具'],
  ['open:life', '生活'],
  ['open:news', '快讯'],
  ['open:comments', '短评'],
  ['open:margin', '追加保证金'],
  ['open:lottery', '彩票'],
  ['open:credit', '贷款'],
  ['open:father', '柜子'],
  ['open:achievements', '成就'],
  ['open:leaderboard', '名人堂'],
  ['open:voice', '原声目录'],
  ['open:settings', '背景音乐'],
  ['open:opening', '序章'],
  ['open:events', '事件'],
  ['open:scenes', '插画库'],
  ['open:save', '存档'],
  ['open:privacy', '隐私'],
  ['open:developer', '开发者'],
  ['open:help', '玩法'],
  ['share', '战报'],
  ['pixel', '像素版'],
];

function render(): void {
  const app = document.getElementById('app');
  if (!app) return;
  document.documentElement.dataset.theme = theme;
  document.documentElement.dataset.frontend = pixelFrontend ? 'pixel' : 'default';
  const t = themeTokens(theme);
  const metrics = accountMetrics(state);
  const limits = restrictions(state);
  const stamina = staminaStatus(state);
  const preview = orderPreviewSafe();
  const emotion = mood(state);
  const ev = currentEvent();
  const debt = debtOf(state);
  const profit = tradingProfit(state);
  const playing = state.phase === 'playing';
  const unlocked = Object.values(evaluateAchievements(state)).filter((a) => a.unlocked).length;
  const canOpen = !playing && limits.noEntry === false;
  trackNews();

  const lowEquity = metrics.equity < NUMERICS.MIN_EQUITY * 3 && state.phase === 'decision' && !state.ending;

  app.innerHTML = `
    <header class="fx-top">
      <div class="fx-title">FX韭留美 · 今天也要回本<small>FX KURUMI / 漫画交易室 · 第 ${state.day} 天 · ${state.phase}${state.mode === 'endless' ? ' · 操盘模式' : ''}</small></div>
      <div class="fx-top-actions" role="group" aria-label="状态">
        <span class="fx-badge">${state.mode === 'endless' ? '操盘' : '剧情'}</span>
        <span class="fx-badge">${marketSource === 'sim' ? '模拟盘' : marketSource === 'historical' ? '历史真实' : marketSource === 'live' ? '实时真实' : '共享回放'}</span>
        <span class="fx-badge">第 ${state.day} 天</span>
        <span class="fx-badge">${state.phase}</span>
      </div>
      <div class="fx-top-actions" role="group" aria-label="主题">
        ${THEME_IDS.map((id) => `<button data-theme-set="${id}" aria-pressed="${id === theme}" ${id === theme ? 'disabled' : ''}>${themeTokens(id).label}</button>`).join('')}
      </div>
      <div class="fx-top-actions" role="group" aria-label="功能">
        ${TOP_BUTTONS.map(([a, label]) => `<button data-act="${a}">${label}</button>`).join('')}
        <button data-act="new">重开</button>
      </div>
    </header>
    ${notice ? `<div class="fx-panel" style="margin-bottom:12px" role="status">${notice}</div>` : ''}
    <nav class="fx-tabs" aria-label="移动导航">
      <button data-act="tab:market">行情</button>
      <button data-act="tab:account">下单</button>
      <button data-act="tab:character">角色</button>
      <button data-act="open:life">生活</button>
      <button data-act="open:manga">漫画</button>
    </nav>
    ${state.phase === 'ending' ? endingPanel(metrics.equity) : ''}
    ${state.phase === 'resting' ? storyOverlay() : ''}
    <div class="fx-grid">
      <section class="fx-panel" id="col-character" aria-label="角色状态">
        <h2>久留美 · ${moodLabel(emotion)}</h2>
        ${D.faceHtml(emotion)}
        <div class="fx-bar" aria-label="心理承受力"><span style="width:${Math.max(0, Math.min(100, state.sanity))}%;background:${t.accent}"></span></div>
        <div class="fx-row"><span>心理承受力</span><b>${Math.round(state.sanity)} / 100</b></div>
        <div class="fx-bar"><span style="width:${Math.max(0, Math.min(100, stamina.value))}%;background:${t.up}"></span></div>
        <div class="fx-row"><span>体力</span><b>${Math.round(stamina.value)} / ${stamina.max}</b></div>
        <div class="fx-row"><span>压力 / 上头</span><b>${num(state.stress, 0)} / ${state.heat ?? 0}</b></div>
        <div class="fx-row"><span>成就</span><b>${unlocked} / ${ACHIEVEMENTS.length}</b></div>
        <div class="fx-caption">杠杆上限 ${limits.leverage}× · 仓位 ${Math.round(limits.stake * 100)}%${limits.noEntry ? ' · 承受力过低，禁止开仓' : ''}</div>
        ${P.pressurePanelHtml(state, Date.now())}
      </section>
      <section class="fx-panel" id="col-market" aria-label="行情终端">
        <h2>行情终端 · USD/JPY</h2>
        <div class="fx-quote-price" id="quote-price" aria-live="polite">${num(state.price, 3)}</div>
        <div class="fx-delta ${profit >= 0 ? 'up' : 'down'}" id="quote-delta">累计 ${profit >= 0 ? '+' : ''}${yen(profit)} · 目标 +${yen(NUMERICS.TARGET_PROFIT)}</div>
        ${P.chartToolbarHtml({ period, ma: maSet, speed, boll: showBoll })}
        <div class="fx-chart-wrap"><canvas class="fx-chart" width="760" height="260" role="img" aria-label="交易K线" tabindex="0"></canvas><div id="chart-tip" class="fx-chart-tip" hidden></div></div>
        <div class="fx-caption" data-act="open:news" style="cursor:pointer">📣 ${ev ? `${ev.title} · ${ev.copy}` : '等待行情'}（点击查看快讯记录）</div>
        ${L.commentsRow(state)}
        <div id="alerts">${P.riskAlertsHtml(state)}</div>
      </section>
      <section class="fx-panel" id="col-account" aria-label="账户与下单">
        <h2>账户与下单</h2>
        <div class="fx-row"><span>总资产</span><b id="equity-value">${yen(metrics.equity)}</b></div>
        <div class="fx-row"><span>净资产(扣债)</span><b>${yen(metrics.equity - debt)}</b></div>
        <div class="fx-row"><span>总欠款</span><b>${yen(debt)}</b></div>
        <div class="fx-row"><span>可用保证金</span><b>${yen(metrics.availableMargin)}</b></div>
        <div class="fx-row"><span>已用 / 浮盈</span><b>${yen(metrics.usedMargin)} / ${yen(metrics.unrealized)}</b></div>
        <div class="fx-order-form">
          <label>杠杆
            <select data-field="leverage" aria-label="杠杆" ${playing ? 'disabled' : ''}>
              ${NUMERICS.LEVERAGES.filter((l) => l >= limits.minLeverage && l <= limits.leverage).map((l) => `<option value="${l}" ${l === leverage ? 'selected' : ''}>${l}×${l >= 50 ? ' · 原作档' : ''}</option>`).join('')}
            </select>
          </label>
          <label>保证金 <b>${yen(amount)}</b>（最多 ${yen(preview.maxMargin)}）
            <input type="range" data-field="amount" aria-label="保证金" min="100" max="${Math.max(100, Math.floor(preview.maxMargin))}" step="100" value="${Math.min(amount, Math.max(100, Math.floor(preview.maxMargin)))}" ${playing ? 'disabled' : ''} />
          </label>
          ${P.orderExtrasHtml(canOpen)}
          <label>止损
            <select data-field="stopPips" aria-label="止损" ${playing ? 'disabled' : ''}>
              <option value="" ${stopPips === null ? 'selected' : ''}>不设</option>
              ${[10, 30, 50].map((p) => `<option value="${p}" ${p === stopPips ? 'selected' : ''}>${p} 点</option>`).join('')}
            </select>
          </label>
          <div class="fx-error" aria-live="assertive">${preview.valid ? `名义 ${yen(preview.notional)} · 手续费 ${yen(preview.openFee)}${preview.liquidationPrice ? ` · 强平价 ${num(preview.liquidationPrice, 3)}` : ''}` : preview.error ?? ''}</div>
        </div>
        <div class="fx-actions">
          <button data-kind="up" data-act="long" ${!preview.valid || playing ? 'disabled' : ''}>做多</button>
          <button data-kind="down" data-act="short" ${!preview.valid || playing ? 'disabled' : ''}>做空</button>
        </div>
        <div class="fx-actions" style="margin-top:8px">
          ${state.phase === 'decision' ? `<button data-act="play">继续下一条报价 ▶</button>` : ''}
          ${playing ? `<button data-act="closeall">全部平仓</button><button data-act="hold">继续持有</button>` : ''}
          ${positionsOf(state).length ? `<button data-act="closeall">一键平仓</button>` : ''}
          ${state.phase === 'closing' ? `<button data-act="settle">全平收盘 · 结算今日</button>` : ''}
          ${state.phase === 'day_end' ? `<button data-act="rest">收工休息</button><button data-act="open:scenes">查看今日结算</button>` : ''}
          ${state.phase === 'resting' ? `<button data-act="next">明天开盘</button>` : ''}
          ${state.phase === 'decision' || state.phase === 'day_end' ? `<button data-act="walkaway">销户离场</button>` : ''}
          ${lowEquity ? `<button data-act="open:bankrupt">账户告急</button>` : ''}
        </div>
        <h3 class="fx-sub">持仓</h3><div id="pos-table">${P.positionsTableHtml(state)}</div>
        ${state.phase !== 'ending' ? `<div class="fx-actions wrap" style="margin-top:8px">
          ${ITEMS.filter((i) => i.id !== 'father').map((i) => `<button data-act="supply:${i.id}">${i.name}${i.price ? ' ' + yen(i.price) : ''}</button>`).join('')}
          ${LIFE_WORK_JOBS.slice(0, 4).map((j) => `<button data-act="work:${j.id}">${j.label} +${yen(j.income)}</button>`).join('')}
        </div>` : ''}
        <div class="fx-log" id="log" aria-live="polite">${log.slice(0, 6).map((l) => `<div>· ${l}</div>`).join('')}</div>
      </section>
    </div>
    ${newsToast ? `<div class="fx-news-toast" role="alert">${newsToast}</div>` : ''}
    ${tradeToast ? `<div class="fx-toast" role="status">${tradeToast}</div>` : ''}
    ${modal ? buildModal() : ''}
    <div class="fx-foot">原创同人小游戏 · 非官方作品 · 虚构行情 · 非投资建议${energyStage(state).active ? ' · ' + energyStage(state).hint : ''}</div>
  `;
  drawChart();
}

function storyOverlay(): string {
  const ev = pendingStory(state);
  if (!ev) return '';
  return `<div class="fx-panel" style="margin-bottom:12px" role="dialog" aria-label="剧情事件">
    <h2>${ev.title}${ev.original ? ' · 原作桥段改编' : ''}</h2>
    ${ev.lines.map(([who, line]) => `<div class="fx-row"><span>${who}</span><b>${line}</b></div>`).join('')}
    <div class="fx-actions" style="margin-top:8px">${ev.choices.map((c) => `<button data-act="story:${ev.key}:${c.id}">${c.text}</button>`).join('')}</div>
  </div>`;
}

function endingPanel(eq: number): string {
  const e = state.ending;
  const def = classifyEnding(state);
  const comicId = e?.baseId === 'million' ? 'ending-million' : e?.baseId === 'broke' ? 'ending-broke' : e?.baseId === 'crisis' ? 'ending-crisis' : 'ending-walkaway';
  return `<div class="fx-panel" style="margin-bottom:12px;border-color:${themeTokens(theme).accent}" role="alert">
    <h2>结局 · ${e?.id ?? ''}</h2>
    <img class="fx-scene" src="${assetUrl(`comics/${comicId}.webp`)}" alt="结局四格" loading="lazy">
    <div>${def?.description ?? '本局结束。'}</div>
    <div class="fx-caption">资产 ${yen(eq)} · 心理 ${Math.round(state.sanity)} · 第 ${state.day} 天</div>
    <div class="fx-actions" style="margin-top:8px"><button data-act="share">保存战报卡</button><button data-act="open:manga">看今日四格</button><button data-act="new">再来一局</button></div>
  </div>`;
}


let prevQuote = state.price;
function patchMarket(result: { price: number; exits: { type: string; pnl: number }[] }): void {
  const dir = result.price >= prevQuote ? 1 : -1;
  prevQuote = result.price;
  const priceEl = document.getElementById('quote-price');
  if (priceEl) {
    priceEl.textContent = num(state.price, 3);
    priceEl.classList.remove('tick-up', 'tick-down');
    void priceEl.offsetWidth;
    priceEl.classList.add(dir >= 0 ? 'tick-up' : 'tick-down');
  }
  const deltaEl = document.getElementById('quote-delta');
  if (deltaEl) {
    const profit = tradingProfit(state);
    deltaEl.textContent = `累计 ${profit >= 0 ? '+' : ''}${yen(profit)} · 目标 +${yen(NUMERICS.TARGET_PROFIT)}`;
    deltaEl.className = 'fx-delta ' + (profit >= 0 ? 'up' : 'down');
  }
  const alerts = document.getElementById('alerts');
  if (alerts) alerts.innerHTML = P.riskAlertsHtml(state);
  const posTable = document.getElementById('pos-table');
  if (posTable) posTable.innerHTML = P.positionsTableHtml(state);
  const logEl = document.getElementById('log');
  if (logEl) logEl.innerHTML = log.slice(0, 6).map((l) => `<div>· ${l}</div>`).join('');
  const eq = accountMetrics(state).equity;
  const eqEl = document.getElementById('equity-value');
  if (eqEl) {
    if (!Number.isFinite(prevEquity)) prevEquity = eq;
    countUp(eqEl, prevEquity, eq);
    prevEquity = eq;
  }
  for (const exit of result.exits) {
    if (exit.type === 'liquidation') {
      triggerShake(true);
      particles?.burst(window.innerWidth * 0.5, window.innerHeight * 0.45, 'shatter', 34);
    } else if (exit.pnl > 0) {
      particles?.burst(window.innerWidth * 0.7, window.innerHeight * 0.4, 'coin', 18);
    } else {
      triggerShake(false);
    }
  }
  drawChart();
}
function triggerShake(hard: boolean): void {
  const body = document.body;
  const cls = hard ? 'fx-shake-hard' : 'fx-shake';
  body.classList.remove('fx-shake', 'fx-shake-hard');
  void body.offsetWidth;
  body.classList.add(cls);
  window.setTimeout(() => body.classList.remove(cls), hard ? 1800 : 550);
}

function drawChart(): void {
  const canvas = document.querySelector('canvas.fx-chart') as HTMLCanvasElement | null;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const t = themeTokens(theme);
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth || 760;
  const h = 260;
  const targetW = Math.round(w * dpr);
  const targetH = Math.round(h * dpr);
  if (canvas.width !== targetW || canvas.height !== targetH) {
    canvas.width = targetW;
    canvas.height = targetH;
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  const candles = state.candles.slice(-48);
  if (!candles.length) return;
  const vp = { width: w, height: h, padding: 18 };
  const layout = layoutCandles(candles, vp);
  const prices = candles.map((c) => c.high);
  const lows = candles.map((c) => c.low);
  const min = Math.min(...lows);
  const max = Math.max(...prices);
  const toY = (p0: number): number => vp.padding + (1 - (p0 - min) / Math.max(1e-9, max - min)) * (h - vp.padding * 2);
  ctx.strokeStyle = t.grid;
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = vp.padding + ((h - vp.padding * 2) * i) / 4;
    ctx.beginPath();
    ctx.moveTo(vp.padding, y);
    ctx.lineTo(w - vp.padding, y);
    ctx.stroke();
  }
  for (const c of layout) {
    ctx.strokeStyle = c.bullish ? t.up : t.down;
    ctx.fillStyle = c.bullish ? t.up : t.down;
    ctx.beginPath();
    ctx.moveTo(c.x, c.yHigh);
    ctx.lineTo(c.x, c.yLow);
    ctx.stroke();
    const top = Math.min(c.yOpen, c.yClose);
    const height = Math.max(1.5, Math.abs(c.yClose - c.yOpen));
    ctx.fillRect(c.x - c.width / 2, top, c.width, height);
  }
  const lastIdx = layout.length - 1;
  if (state.phase === 'playing' && lastIdx >= 0) {
    const prog = Math.min(1, ((state.pending?.tick ?? 0) + 0.5) / NUMERICS.TICKS_PER_CANDLE);
    const c0 = layout[lastIdx] as (typeof layout)[number];
    const top0 = Math.min(c0.yOpen, c0.yClose);
    const height0 = Math.max(1.5, Math.abs(c0.yClose - c0.yOpen));
    ctx.save();
    ctx.globalAlpha = 0.45 + 0.55 * prog;
    ctx.strokeStyle = c0.bullish ? t.up : t.down;
    ctx.fillStyle = c0.bullish ? t.up : t.down;
    ctx.beginPath();
    ctx.moveTo(c0.x, c0.yHigh);
    ctx.lineTo(c0.x, c0.yLow);
    ctx.stroke();
    ctx.fillRect(c0.x - c0.width / 2, top0, c0.width, height0);
    ctx.restore();
  }
  const last = layout[lastIdx];
  if (last) {
    ctx.save();
    ctx.shadowColor = t.accent;
    ctx.shadowBlur = 12;
    ctx.strokeStyle = t.accent;
    ctx.beginPath();
    ctx.moveTo(last.x, last.yHigh);
    ctx.lineTo(last.x, last.yLow);
    ctx.stroke();
    ctx.restore();
    ctx.fillStyle = t.accent;
    ctx.font = '11px sans-serif';
    ctx.fillText(state.price.toFixed(3), Math.min(w - 52, last.x + 6), Math.max(12, last.yClose - 4));
  }
  // Volume sub-plot (approximated from candle range, since sim has no volume)
  const volH = 30;
  const vols = candles.map((c) => Math.abs(c.high - c.low));
  const maxVol = Math.max(...vols, 1e-9);
  for (let i = 0; i < layout.length; i++) {
    const c = layout[i] as (typeof layout)[number];
    const h0 = (vols[i]! / maxVol) * volH;
    ctx.globalAlpha = 0.28;
    ctx.fillStyle = c.bullish ? t.up : t.down;
    ctx.fillRect(c.x - c.width / 2, h - vp.padding - h0, c.width, h0);
    ctx.globalAlpha = 1;
  }
  const vma = volumeMA(candles, 5);
  ctx.strokeStyle = t.warn;
  ctx.lineWidth = 1;
  ctx.beginPath();
  let vStarted = false;
  vma.forEach((v, i) => {
    if (v === null) return;
    const c = layout[i] as (typeof layout)[number];
    const y = h - vp.padding - (v / maxVol) * volH;
    if (!vStarted) { ctx.moveTo(c.x, y); vStarted = true; } else ctx.lineTo(c.x, y);
  });
  ctx.stroke();
  // Crosshair + hover readout
  if (hoverIndex >= 0 && hoverIndex < layout.length) {
    const c = layout[hoverIndex] as (typeof layout)[number];
    ctx.save();
    ctx.strokeStyle = t.muted;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(c.x, vp.padding);
    ctx.lineTo(c.x, h - vp.padding);
    ctx.stroke();
    if (hoverY > vp.padding && hoverY < h - vp.padding) {
      const priceAt = min + (1 - (hoverY - vp.padding) / (h - vp.padding * 2)) * (max - min);
      ctx.beginPath();
      ctx.moveTo(vp.padding, hoverY);
      ctx.lineTo(w - vp.padding, hoverY);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = t.accent;
      ctx.font = '11px sans-serif';
      ctx.fillText(priceAt.toFixed(3), w - 52, hoverY - 3);
    }
    ctx.restore();
  }
  if (showBoll) {
    const b = bollinger(candles, 20, 2);
    ctx.strokeStyle = 'rgba(124,159,255,0.9)';
    ctx.lineWidth = 1;
    for (const series of [b.upper, b.mid, b.lower]) {
      ctx.beginPath();
      let started = false;
      series.forEach((v, i) => {
        if (v === null) return;
        const x = vp.padding + ((w - vp.padding * 2) * (i + 0.5)) / candles.length;
        const y = toY(v);
        if (!started) { ctx.moveTo(x, y); started = true; } else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }
  }
  const colors: Record<number, string> = { 5: '#f2c14e', 10: '#7fd4a0', 20: '#f16f9f', 60: '#7c9fff' };
  for (const m of maSet) {
    const values = movingAverage(candles, m);
    ctx.strokeStyle = colors[m] ?? t.accent;
    ctx.beginPath();
    let started = false;
    values.forEach((v, i) => {
      if (v === null) return;
      const x = vp.padding + ((w - vp.padding * 2) * (i + 0.5)) / candles.length;
      const y = toY(v);
      if (!started) {
        ctx.moveTo(x, y);
        started = true;
      } else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }
  if (maSet.length) {
    ctx.font = '10px sans-serif';
    let lx = vp.padding + 2;
    for (const m of maSet) {
      const vals = movingAverage(candles, m);
      const lastVal = vals[vals.length - 1];
      ctx.fillStyle = colors[m] ?? t.accent;
      ctx.fillText(`MA${m} ${lastVal ? lastVal.toFixed(3) : '—'}`, lx, 12);
      lx += 72;
    }
  }
}
