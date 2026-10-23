import { ACHIEVEMENTS, ITEMS } from '../content/index';
import { NUMERICS } from '../content/config/numerics';
import { assetUrl, voiceUrl } from '../content/assets';
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
import { restrictions } from '../domain/mind/sanity';
import { evaluateAchievements } from '../domain/progress/achievements';
import { applyEnding, classifyEnding } from '../domain/progress/ending';
import { dailyManga, routeManga } from '../domain/story/manga';
import { checkStories, chooseStory, pendingStory, queueStory } from '../domain/story/story';
import { closeOrders } from '../domain/trading/close';
import { placeOrder, previewOrder, type OrderType, type StopPips } from '../domain/trading/order';
import { entryFromState, fetchLeaderboard, type LeaderboardEntry } from './services/leaderboard';
import { layoutCandles } from '../view/charts/candles';
import { createAudio, type AudioController } from '../view/components/audio';
import * as D from '../view/components/dialogs';
import { DEFAULT_THEME, THEME_IDS, themeTokens, type ThemeId } from '../view/styles/tokens';
import { loadGame, saveGame } from './persistence/save';

const THEME_KEY = 'kurumi-fx:theme';

let state: GameState = createGame(Date.now() >>> 0, { mode: 'story' });
let theme: ThemeId = DEFAULT_THEME;
let leverage = 25;
let amount = 10_000;
let stopPips: StopPips = null;
let timer: number | null = null;
let modal: string | null = null;
let leaderboard: LeaderboardEntry[] | null = null;
let notice = '';
let lastNewsKey = '';
let newsToast = '';
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
  try {
    saveGame(state);
  } catch {
    /* ignore */
  }
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* ignore */
  }
}
function flashToast(text: string): void {
  newsToast = text;
  if (toastTimer !== null) clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    newsToast = '';
    render();
  }, 4200);
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
  flashToast(`📣 ${ev.title} · ${ev.copy}`);
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
      }
      render();
    } catch (error) {
      stopTimer();
      log.unshift(`行情暂停：${(error as Error).message}`);
      render();
    }
  }, 180);
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
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && modal) {
      modal = null;
      render();
    }
  });
  app.addEventListener('click', (e) => {
    const el = (e.target as HTMLElement).closest('[data-act], [data-theme-set]') as HTMLElement | null;
    if (!el) return;
    if (el.dataset.themeSet) {
      theme = el.dataset.themeSet as ThemeId;
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
      render();
      return;
    }
    onAction(act);
  });
  app.addEventListener('input', (e) => {
    const field = (e.target as HTMLElement).dataset.field;
    if (field === 'amount') amount = Number((e.target as HTMLInputElement).value);
    if (field === 'volume') audio.setVolume(Number((e.target as HTMLInputElement).value) / 100);
    if (field) render();
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
  render();
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
    if (act.startsWith('supply:')) {
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
      modal = 'recap';
    } else if (act === 'rest') {
      beginRest(state);
      checkStories(state);
      if (!pendingStory(state)) queueStory(state, 'quietNight');
    } else if (act === 'next') {
      nextDay(state);
      modal = null;
    } else if (act === 'walkaway') {
      resolveEnding(true);
    } else if (act === 'share') {
      exportShare();
    } else if (act === 'leaderboard') {
      void loadLeaderboard();
      modal = 'leaderboard';
    } else if (act === 'new') {
      newGame();
      return;
    }
    if (!state.ending && state.phase !== 'playing') resolveEnding(false);
  } catch (error) {
    log.unshift((error as Error).message);
    audio.playSfx('reject');
  }
  persist();
  render();
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

function exportShare(): void {
  try {
    const blob = new Blob([JSON.stringify({ theme, savedAt: Date.now(), state }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FX-${state.mode}-战报-第${state.day}天.json`;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    notice = '已导出存档 / 战报 JSON。';
  } catch {
    notice = '导出失败。';
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
      return D.leaderboardDialog(leaderboard);
    case 'voice':
      return D.vocalDialog();
    case 'settings':
      return D.settingsDialog(audio.state);
    case 'opening':
      return D.openingDialog();
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
    default:
      return '';
  }
}

const TOP_BUTTONS: [string, string][] = [
  ['open:manga', '漫画'],
  ['open:items', '道具'],
  ['open:life', '生活'],
  ['open:news', '快讯'],
  ['open:lottery', '彩票'],
  ['open:credit', '贷款'],
  ['open:father', '柜子'],
  ['open:achievements', '成就'],
  ['open:leaderboard', '名人堂'],
  ['open:voice', '语音'],
  ['open:settings', '设置'],
  ['open:opening', '序章'],
  ['open:events', '事件'],
  ['open:scenes', '插画库'],
  ['open:help', '玩法'],
  ['share', '导出'],
  ['new', '重开'],
];

function render(): void {
  const app = document.getElementById('app');
  if (!app) return;
  document.documentElement.dataset.theme = theme;
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
  trackNews();

  app.innerHTML = `
    <header class="fx-top">
      <div class="fx-title">FX韭留美 · 今天也要回本<small>FX KURUMI / 漫画交易室 · 第 ${state.day} 天 · ${state.phase}</small></div>
      <div class="fx-top-actions" role="group" aria-label="主题">
        ${THEME_IDS.map((id) => `<button data-theme-set="${id}" aria-pressed="${id === theme}" ${id === theme ? 'disabled' : ''}>${themeTokens(id).label}</button>`).join('')}
      </div>
      <div class="fx-top-actions" role="group" aria-label="功能">
        ${TOP_BUTTONS.map(([a, label]) => `<button data-act="${a}">${label}</button>`).join('')}
      </div>
    </header>
    ${notice ? `<div class="fx-panel" style="margin-bottom:12px" role="status">${notice}</div>` : ''}
    ${state.phase === 'ending' ? endingPanel(metrics.equity) : ''}
    ${state.phase === 'resting' ? storyOverlay() : ''}
    <div class="fx-grid">
      <section class="fx-panel" aria-label="角色状态">
        <h2>久留美 · ${moodLabel(emotion)}</h2>
        ${D.faceHtml(emotion)}
        <div class="fx-bar" aria-label="心理承受力"><span style="width:${Math.max(0, Math.min(100, state.sanity))}%;background:${t.accent}"></span></div>
        <div class="fx-row"><span>心理承受力</span><b>${Math.round(state.sanity)} / 100</b></div>
        <div class="fx-bar"><span style="width:${Math.max(0, Math.min(100, stamina.value))}%;background:${t.up}"></span></div>
        <div class="fx-row"><span>体力</span><b>${Math.round(stamina.value)} / ${stamina.max}</b></div>
        <div class="fx-row"><span>压力 / 上头</span><b>${num(state.stress, 0)} / ${state.heat ?? 0}</b></div>
        <div class="fx-row"><span>成就</span><b>${unlocked} / ${ACHIEVEMENTS.length}</b></div>
        <div class="fx-caption">杠杆上限 ${limits.leverage}× · 仓位 ${Math.round(limits.stake * 100)}%${limits.noEntry ? ' · 承受力过低，禁止开仓' : ''}</div>
      </section>
      <section class="fx-panel" aria-label="行情终端">
        <h2>行情终端 · USD/JPY</h2>
        <div class="fx-quote-price" aria-live="polite">${num(state.price, 3)}</div>
        <div class="fx-delta ${profit >= 0 ? 'up' : 'down'}">累计 ${profit >= 0 ? '+' : ''}${yen(profit)} · 目标 +${yen(NUMERICS.TARGET_PROFIT)}</div>
        <canvas class="fx-chart" width="760" height="260" role="img" aria-label="K线图"></canvas>
        <div class="fx-caption" data-act="open:news" style="cursor:pointer">📣 ${ev ? `${ev.title} · ${ev.copy}` : '等待行情'}（点击查看快讯记录）</div>
      </section>
      <section class="fx-panel" aria-label="账户与下单">
        <h2>账户与下单</h2>
        <div class="fx-row"><span>总资产</span><b>${yen(metrics.equity)}</b></div>
        <div class="fx-row"><span>净资产(扣债)</span><b>${yen(metrics.equity - debt)}</b></div>
        <div class="fx-row"><span>总欠款</span><b>${yen(debt)}</b></div>
        <div class="fx-row"><span>可用保证金</span><b>${yen(metrics.availableMargin)}</b></div>
        <div class="fx-row"><span>已用 / 浮盈</span><b>${yen(metrics.usedMargin)} / ${yen(metrics.unrealized)}</b></div>
        <div class="fx-row"><span>持仓</span><b>${positionsOf(state).length} 笔</b></div>
        <div class="fx-order-form">
          <label>杠杆
            <select data-field="leverage" aria-label="杠杆" ${playing ? 'disabled' : ''}>
              ${NUMERICS.LEVERAGES.filter((l) => l >= limits.minLeverage && l <= limits.leverage).map((l) => `<option value="${l}" ${l === leverage ? 'selected' : ''}>${l}×</option>`).join('')}
            </select>
          </label>
          <label>保证金 <b>${yen(amount)}</b>（最多 ${yen(preview.maxMargin)}）
            <input type="range" data-field="amount" aria-label="保证金" min="100" max="${Math.max(100, Math.floor(preview.maxMargin))}" step="100" value="${Math.min(amount, Math.max(100, Math.floor(preview.maxMargin)))}" ${playing ? 'disabled' : ''} />
          </label>
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
          ${state.phase === 'decision' ? `<button data-act="play">继续行情 ▶</button>` : ''}
          ${playing ? `<button data-act="closeall">全部平仓</button><button data-act="hold">继续持有</button>` : ''}
          ${state.phase === 'decision' && positionsOf(state).length ? `<button data-act="closeall">平掉持仓</button>` : ''}
          ${state.phase === 'closing' ? `<button data-act="settle">结算今日</button>` : ''}
          ${state.phase === 'day_end' ? `<button data-act="rest">收工休息</button>` : ''}
          ${state.phase === 'resting' ? `<button data-act="next">进入明天</button>` : ''}
          ${state.phase === 'decision' || state.phase === 'day_end' ? `<button data-act="walkaway">收手离场</button>` : ''}
        </div>
        ${state.phase !== 'ending' ? `<div class="fx-actions wrap" style="margin-top:8px">
          ${ITEMS.filter((i) => i.id !== 'father').map((i) => `<button data-act="supply:${i.id}">${i.name}${i.price ? ' ' + yen(i.price) : ''}</button>`).join('')}
          ${LIFE_WORK_JOBS.slice(0, 4).map((j) => `<button data-act="work:${j.id}">${j.label} +${yen(j.income)}</button>`).join('')}
        </div>` : ''}
        <div class="fx-log" aria-live="polite">${log.slice(0, 6).map((l) => `<div>· ${l}</div>`).join('')}</div>
      </section>
    </div>
    ${newsToast ? `<div class="fx-news-toast" role="alert">${newsToast}</div>` : ''}
    ${modal ? buildModal() : ''}
    <div class="fx-foot">原创同人小游戏 · 非官方作品 · 虚构行情 · 非投资建议</div>
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
    <div class="fx-actions" style="margin-top:8px"><button data-act="share">导出战报</button><button data-act="open:manga">看今日四格</button><button data-act="new">再来一局</button></div>
  </div>`;
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
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  const candles = state.candles.slice(-48);
  if (!candles.length) return;
  const vp = { width: w, height: h, padding: 18 };
  const layout = layoutCandles(candles, vp);
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
}