import { NUMERICS } from '../content/config/numerics';
import { ITEMS } from '../content/index';
import { staminaStatus } from '../domain/body/stamina';
import { accountMetrics, positionsOf } from '../domain/trading/account';
import { advanceQuote, beginPlay, beginRest, finalizeDayLiving, nextDay, settleDay } from '../domain/core/day';
import { createGame, tradingProfit } from '../domain/core/state';
import type { GameState } from '../domain/core/types';
import { useSupply } from '../domain/economy/supplies';
import type { DayScript } from '../domain/market/quote-grid';
import { mood, moodLabel } from '../domain/mind/mood';
import { restrictions } from '../domain/mind/sanity';
import { evaluateAchievements } from '../domain/progress/achievements';
import { applyEnding, classifyEnding, type EndingResult } from '../domain/progress/ending';
import { OPENING_PAGES, checkStories, chooseStory, pendingStory, queueStory } from '../domain/story/story';
import { closeOrders } from '../domain/trading/close';
import { placeOrder, previewOrder, type StopPips } from '../domain/trading/order';
import { entryFromState, fetchLeaderboard, type LeaderboardEntry } from './services/leaderboard';
import { layoutCandles } from '../view/charts/candles';
import { DEFAULT_THEME, THEME_IDS, themeTokens, type ThemeId } from '../view/styles/tokens';
import { loadGame, saveGame } from './persistence/save';

const THEME_KEY = 'kurumi-fx:theme';

let state: GameState = createGame(Date.now() >>> 0, { mode: 'story' });
let theme: ThemeId = DEFAULT_THEME;
let leverage = 25;
let amount = 10_000;
let stopPips: StopPips = null;
let timer: number | null = null;
let leaderboard: LeaderboardEntry[] | null = null;
let notice = '';
const log: string[] = [];

const yen = (n: number): string => '¥' + Math.round(n).toLocaleString('zh-CN');
const num = (n: number, d = 2): string => n.toLocaleString('zh-CN', { minimumFractionDigits: d, maximumFractionDigits: d });

function activeScript(): DayScript {
  return state.script as DayScript;
}

function currentEvent() {
  const events = activeScript()?.events ?? [];
  return events[Math.min(state.beat, Math.max(0, events.length - 1))];
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
    /* storage unavailable — play continues in memory */
  }
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* ignore */
  }
}

function debtOf(s: GameState): number {
  return (s.family?.outstanding ?? 0) + (s.loan?.outstanding ?? 0);
}

function startTimer(): void {
  stopTimer();
  timer = window.setInterval(() => {
    try {
      const result = advanceQuote(state);
      for (const exit of result.exits) log.unshift(`强平/止损：${exit.type} ${yen(exit.pnl)}`);
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

/** Apply an automatic ending (broke/crisis/million) or a requested walkaway. */
function resolveEnding(walkaway: boolean): EndingResult | null {
  const result = classifyEnding(state, { walkaway });
  if (result && (result.baseId !== 'walkaway' || walkaway)) {
    applyEnding(state, result);
    persist();
    return result;
  }
  return null;
}

function orderPreviewSafe(): ReturnType<typeof previewOrder> {
  try {
    return previewOrder(state, { type: 'long', leverage, amount, stopPips });
  } catch {
    return { valid: false, error: '参数错误', margin: 0, notional: 0, quantity: 0, openFee: 0, closeFee: 0, totalDebit: 0, maxMargin: 0, stopPips, stopPrice: null, liquidationPrice: null, riskPercent: 0 };
  }
}

function storyOverlay(): string {
  const ev = pendingStory(state);
  if (!ev) return '';
  return `
    <div class="fx-panel" style="margin-bottom:12px" role="dialog" aria-label="剧情事件">
      <h2>${ev.title}${ev.original ? ' · 原作桥段改编' : ''}</h2>
      ${ev.lines.map(([, line]) => `<div class="fx-row"><span>${line}</span></div>`).join('')}
      <div class="fx-actions" style="margin-top:8px">
        ${ev.choices.map((c) => `<button data-act="story:${ev.key}:${c.id}">${c.text}</button>`).join('')}
      </div>
    </div>`;
}

function supplyRow(): string {
  const items = ITEMS.filter((i) => i.id !== 'father').slice(0, 6);
  return `<div class="fx-actions" style="margin-top:8px">
    ${items.map((i) => `<button data-act="supply:${i.id}" title="${i.effect}">${i.name} ${i.price ? yen(i.price) : ''}</button>`).join('')}
  </div>`;
}

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
  const achievements = evaluateAchievements(state);
  const unlocked = Object.values(achievements).filter((a) => a.unlocked).length;
  const opening = state.day === 1 && state.completedDays === 0 && state.history.length === 0;

  app.innerHTML = `
    <header class="fx-top">
      <div class="fx-title">FX韭留美 · 今天也要回本<small>FX KURUMI / 漫画交易室 · 第 ${state.day} 天 · ${state.phase}</small></div>
      <div class="fx-top-actions" role="group" aria-label="主题与操作">
        ${THEME_IDS.map((id) => `<button data-theme-set="${id}" aria-pressed="${id === theme}" ${id === theme ? 'disabled' : ''}>${themeTokens(id).label}</button>`).join('')}
        <button data-act="leaderboard">名人堂</button>
        <button data-act="share">导出存档</button>
        <button data-act="new">重开一局</button>
      </div>
    </header>
    ${notice ? `<div class="fx-panel" style="margin-bottom:12px" role="status">${notice}</div>` : ''}
    ${state.phase === 'ending' ? endingPanel(metrics.equity) : ''}
    ${state.phase === 'resting' ? storyOverlay() : ''}
    ${opening ? openingPanel() : ''}
    ${ev && state.phase !== 'resting' ? `<div class="fx-panel" style="margin-bottom:12px"><div class="fx-caption">📣 快讯 · ${ev.title}</div><div class="fx-row"><span>${ev.copy}</span></div></div>` : ''}
    <div class="fx-grid">
      <section class="fx-panel" aria-label="角色状态">
        <h2>久留美</h2>
        <div class="fx-row"><span>情绪</span><b>${moodLabel(emotion)}（${emotion}）</b></div>
        <div class="fx-row"><span>心理承受力</span><b>${Math.round(state.sanity)} / 100</b></div>
        <div class="fx-bar"><span style="width:${Math.max(0, Math.min(100, state.sanity))}%;background:${t.accent}"></span></div>
        <div class="fx-row"><span>体力</span><b>${Math.round(stamina.value)} / ${stamina.max}</b></div>
        <div class="fx-bar"><span style="width:${Math.max(0, Math.min(100, stamina.value))}%;background:${t.up}"></span></div>
        <div class="fx-row"><span>压力</span><b>${num(state.stress, 0)}</b></div>
        <div class="fx-row"><span>成就</span><b>${unlocked} / ${Object.keys(achievements).length}</b></div>
        <div class="fx-caption">当前杠杆上限 ${limits.leverage}× · 仓位上限 ${Math.round(limits.stake * 100)}%${limits.noEntry ? ' · 承受力过低，禁止开仓' : ''}</div>
      </section>
      <section class="fx-panel" aria-label="行情终端">
        <h2>行情终端 · USD/JPY</h2>
        <div class="fx-quote-price" aria-live="polite">${num(state.price, 3)}</div>
        <div class="fx-delta ${profit >= 0 ? 'up' : 'down'}">本章累计 ${profit >= 0 ? '+' : ''}${yen(profit)} · 目标 +${yen(NUMERICS.TARGET_PROFIT)}</div>
        <canvas class="fx-chart" width="760" height="260" role="img" aria-label="K线图"></canvas>
        <div class="fx-caption">JST · 15分钟 K线 · 撮合为确定性虚构行情</div>
      </section>
      <section class="fx-panel" aria-label="账户与下单">
        <h2>账户与下单</h2>
        <div class="fx-row"><span>总资产</span><b>${yen(metrics.equity)}</b></div>
        <div class="fx-row"><span>净资产(扣债)</span><b>${yen(metrics.equity - debt)}</b></div>
        <div class="fx-row"><span>总欠款</span><b>${yen(debt)}</b></div>
        <div class="fx-row"><span>可用保证金</span><b>${yen(metrics.availableMargin)}</b></div>
        <div class="fx-row"><span>已用保证金</span><b>${yen(metrics.usedMargin)}</b></div>
        <div class="fx-row"><span>浮动盈亏</span><b>${yen(metrics.unrealized)}</b></div>
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
        ${state.phase !== 'ending' ? supplyRow() : ''}
        <div class="fx-log" aria-live="polite">
          ${log.slice(0, 6).map((l) => `<div>· ${l}</div>`).join('')}
        </div>
      </section>
    </div>
    ${leaderboard ? leaderboardPanel() : ''}
    <div class="fx-foot">原创同人小游戏 · 非官方作品 · 虚构行情 · 非投资建议</div>
  `;
  drawChart();
}

function openingPanel(): string {
  return `<details class="fx-panel" style="margin-bottom:12px"><summary>序章（点击展开）</summary>
    ${OPENING_PAGES.map((p) => `<div class="fx-row"><span>${p.text}</span><b>${p.kind === 'fan' ? '原作' : '原创'}</b></div>`).join('')}
  </details>`;
}

function endingPanel(eq: number): string {
  const e = state.ending;
  const def = e ? classifyEnding(state) : null;
  return `<div class="fx-panel" style="margin-bottom:12px;border-color:${themeTokens(theme).accent}" role="alert">
    <h2>结局 · ${e?.id ?? ''}</h2>
    <div>${def?.description ?? '本局结束。'}</div>
    <div class="fx-caption">资产 ${yen(eq)} · 心理 ${Math.round(state.sanity)} · 第 ${state.day} 天</div>
    <div class="fx-actions" style="margin-top:8px"><button data-act="share">导出战报</button><button data-act="new">再来一局</button></div>
  </div>`;
}

function leaderboardPanel(): string {
  return `<div class="fx-panel" style="margin-top:12px"><h2>名人堂</h2>
    ${leaderboard && leaderboard.length ? leaderboard.map((r, i) => `<div class="fx-row"><span>${i + 1}. ${r.nickname}</span><b>${yen(r.netProfit)} · ${r.survivedDays}天</b></div>`).join('') : '<div class="fx-caption">暂无榜单数据（后端未配置或为空）。</div>'}
    <div class="fx-caption">上榜默认匿名；统计不含身份信息。</div>
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
  state = createGame(Date.now() >>> 0, { mode: 'story' });
  persist();
  render();
}

function onAction(act: string): void {
  notice = '';
  try {
    if (act.startsWith('supply:')) {
      const r = useSupply(state, act.split(':')[1] as string);
      log.unshift(r.applied ? `使用了 ${r.id}` : `无法使用：${r.reason}`);
      persist();
      render();
      return;
    }
    if (act.startsWith('story:')) {
      const [, key, choiceId] = act.split(':');
      const { choice } = chooseStory(state, choiceId as string);
      log.unshift(`剧情 ${key}：选择了「${choice.text}」`);
      persist();
      render();
      return;
    }
    switch (act) {
      case 'new':
        newGame();
        return;
      case 'play':
        beginPlay(state);
        startTimer();
        break;
      case 'long':
      case 'short': {
        const price = state.price;
        placeOrder(state, { type: act, leverage, amount, stopPips });
        log.unshift(`${act === 'long' ? '做多' : '做空'} @${num(price, 3)}`);
        break;
      }
      case 'closeall':
        closeOrders(state, 1, state.phase === 'playing' ? 'manual' : 'closing');
        log.unshift('全部平仓');
        break;
      case 'hold':
        break;
      case 'settle':
        settleDay(state);
        finalizeDayLiving(state);
        log.unshift('今日已结算，生活费已扣');
        break;
      case 'rest':
        beginRest(state);
        checkStories(state);
        if (!pendingStory(state)) queueStory(state, 'quietNight');
        break;
      case 'next':
        nextDay(state);
        break;
      case 'walkaway':
        resolveEnding(true);
        break;
      case 'share':
        exportShare();
        break;
      case 'leaderboard':
        void loadLeaderboard();
        return;
    }
    if (!state.ending) resolveEnding(false);
  } catch (error) {
    log.unshift((error as Error).message);
  }
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
  app.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const themeBtn = target.closest('[data-theme-set]') as HTMLElement | null;
    if (themeBtn) {
      theme = themeBtn.dataset.themeSet as ThemeId;
      persist();
      render();
      return;
    }
    const act = (target.closest('[data-act]') as HTMLElement | null)?.dataset.act;
    if (act) onAction(act);
  });
  app.addEventListener('input', (e) => {
    const field = (e.target as HTMLElement).dataset.field;
    if (field === 'amount') amount = Number((e.target as HTMLInputElement).value);
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