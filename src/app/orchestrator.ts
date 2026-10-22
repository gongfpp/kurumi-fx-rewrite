import { NUMERICS } from '../content/config/numerics';
import { accountMetrics, equity, positionsOf } from '../domain/trading/account';
import { staminaStatus } from '../domain/body/stamina';
import { advanceQuote, beginPlay, beginRest, finalizeDayLiving, nextDay, settleDay } from '../domain/core/day';
import { createGame } from '../domain/core/state';
import type { GameState } from '../domain/core/types';
import type { DayScript } from '../domain/market/quote-grid';
import { mood, moodLabel } from '../domain/mind/mood';
import { restrictions } from '../domain/mind/sanity';
import { closeOrders } from '../domain/trading/close';
import { placeOrder, previewOrder, type StopPips } from '../domain/trading/order';
import { layoutCandles } from '../view/charts/candles';
import { DEFAULT_THEME, THEME_IDS, themeTokens, type ThemeId } from '../view/styles/tokens';
import { loadGame, saveGame } from './persistence/save';

let state: GameState = createGame(Date.now() >>> 0, { mode: 'story' });
let theme: ThemeId = DEFAULT_THEME;
let leverage = 25;
let amount = 10_000;
let stopPips: StopPips = null;
let timer: number | null = null;
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
}

function startTimer(): void {
  stopTimer();
  timer = window.setInterval(() => {
    try {
      const result = advanceQuote(state);
      for (const exit of result.exits) log.unshift(`强平/止损：${exit.type} ${yen(exit.pnl)}`);
      if (state.phase !== 'playing') {
        stopTimer();
        checkEnding();
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

function checkEnding(): string | null {
  const eq = equity(state);
  if (state.mode === 'endless') return eq < NUMERICS.MIN_EQUITY ? 'broke' : null;
  if (state.sanity <= 5 && eq < 5000) return 'crisis';
  if (eq < NUMERICS.MIN_EQUITY) return 'broke';
  const debt = (state.family?.outstanding ?? 0) + (state.loan?.outstanding ?? 0);
  const profit = eq - state.startEquity - debt - (state.nonTradingIncome || 0) - (state.lotteryIncome || 0) + (state.expenses || 0);
  if (profit >= NUMERICS.TARGET_PROFIT) return 'million';
  return null;
}

function orderPreviewSafe(): ReturnType<typeof previewOrder> {
  try {
    return previewOrder(state, { type: 'long', leverage, amount, stopPips });
  } catch {
    return { valid: false, error: '参数错误', margin: 0, notional: 0, quantity: 0, openFee: 0, closeFee: 0, totalDebit: 0, maxMargin: 0, stopPips, stopPrice: null, liquidationPrice: null, riskPercent: 0 };
  }
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
  const debt = (state.family?.outstanding ?? 0) + (state.loan?.outstanding ?? 0);
  const profit = equity(state) - state.startEquity - debt - (state.nonTradingIncome || 0) - (state.lotteryIncome || 0) + (state.expenses || 0);
  const playing = state.phase === 'playing';
  const ended = checkEnding();

  app.innerHTML = `
    <header class="fx-top">
      <div class="fx-title">FX韭留美 · 今天也要回本<small>FX KURUMI / 漫画交易室 · 第 ${state.day} 天 · ${state.phase}</small></div>
      <div class="fx-top-actions">
        ${THEME_IDS.map((id) => `<button data-theme-set="${id}" ${id === theme ? 'disabled' : ''}>${themeTokens(id).label}</button>`).join('')}
        <button data-act="new">重开一局</button>
      </div>
    </header>
    <div class="fx-grid">
      <section class="fx-panel">
        <h2>久留美</h2>
        <div class="fx-row"><span>情绪</span><b>${moodLabel(emotion)}（${emotion}）</b></div>
        <div class="fx-row"><span>心理承受力</span><b>${Math.round(state.sanity)} / 100</b></div>
        <div class="fx-bar"><span style="width:${Math.max(0, Math.min(100, state.sanity))}%;background:${t.accent}"></span></div>
        <div class="fx-row"><span>体力</span><b>${Math.round(stamina.value)} / ${stamina.max}</b></div>
        <div class="fx-bar"><span style="width:${Math.max(0, Math.min(100, stamina.value))}%;background:${t.up}"></span></div>
        <div class="fx-row"><span>压力</span><b>${num(state.stress, 0)}</b></div>
        <div class="fx-caption">当前杠杆上限 ${limits.leverage}× · 仓位上限 ${Math.round(limits.stake * 100)}%${limits.noEntry ? ' · 承受力过低，禁止开仓' : ''}</div>
      </section>
      <section class="fx-panel">
        <h2>行情终端 · USD/JPY</h2>
        <div class="fx-quote-price">${num(state.price, 3)}</div>
        <div class="fx-delta ${profit >= 0 ? 'up' : 'down'}">本章累计 ${profit >= 0 ? '+' : ''}${yen(profit)} · 目标 +${yen(NUMERICS.TARGET_PROFIT)}</div>
        <canvas class="fx-chart" width="760" height="260"></canvas>
        <div class="fx-caption">${ev ? `快讯｜${ev.title} · ${ev.copy}` : '等待行情'}</div>
      </section>
      <section class="fx-panel">
        <h2>账户与下单</h2>
        <div class="fx-row"><span>总资产</span><b>${yen(metrics.equity)}</b></div>
        <div class="fx-row"><span>净资产(扣债)</span><b>${yen(metrics.equity - debt)}</b></div>
        <div class="fx-row"><span>可用保证金</span><b>${yen(metrics.availableMargin)}</b></div>
        <div class="fx-row"><span>已用保证金</span><b>${yen(metrics.usedMargin)}</b></div>
        <div class="fx-row"><span>浮动盈亏</span><b>${yen(metrics.unrealized)}</b></div>
        <div class="fx-row"><span>持仓</span><b>${positionsOf(state).length} 笔</b></div>
        <div class="fx-order-form">
          <label>杠杆
            <select data-field="leverage" ${playing ? 'disabled' : ''}>
              ${NUMERICS.LEVERAGES.filter((l) => l >= limits.minLeverage && l <= limits.leverage).map((l) => `<option value="${l}" ${l === leverage ? 'selected' : ''}>${l}×</option>`).join('')}
            </select>
          </label>
          <label>保证金 <b>${yen(amount)}</b>（最多 ${yen(preview.maxMargin)}）
            <input type="range" data-field="amount" min="100" max="${Math.max(100, Math.floor(preview.maxMargin))}" step="100" value="${Math.min(amount, Math.max(100, Math.floor(preview.maxMargin)))}" ${playing ? 'disabled' : ''} />
          </label>
          <label>止损
            <select data-field="stopPips" ${playing ? 'disabled' : ''}>
              <option value="" ${stopPips === null ? 'selected' : ''}>不设</option>
              ${[10, 30, 50].map((p) => `<option value="${p}" ${p === stopPips ? 'selected' : ''}>${p} 点</option>`).join('')}
            </select>
          </label>
          <div class="fx-error">${preview.valid ? `名义 ${yen(preview.notional)} · 手续费 ${yen(preview.openFee)}${preview.liquidationPrice ? ` · 强平价 ${num(preview.liquidationPrice, 3)}` : ''}` : preview.error ?? ''}</div>
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
        </div>
        <div class="fx-log">
          ${log.slice(0, 6).map((l) => `<div>· ${l}</div>`).join('')}
        </div>
      </section>
    </div>
    <div class="fx-foot">原创同人小游戏 · 非官方作品 · 虚构行情 · 非投资建议</div>
    ${ended ? `<div class="fx-panel" style="margin-top:12px;border-color:${t.accent}"><h2>结局</h2><div>本局结束：<b>${ended}</b>（资产 ${yen(metrics.equity)}，心理 ${Math.round(state.sanity)}）</div><div class="fx-actions" style="margin-top:8px"><button data-act="new">再来一局</button></div></div>` : ''}
  `;
  drawChart();
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

function newGame(): void {
  stopTimer();
  log.length = 0;
  state = createGame(Date.now() >>> 0, { mode: 'story' });
  persist();
  render();
}

function onAction(act: string): void {
  try {
    switch (act) {
      case 'new':
        newGame();
        break;
      case 'play':
        beginPlay(state);
        startTimer();
        break;
      case 'long':
      case 'short': {
        const price = state.price;
        placeOrder(state, { type: act, leverage, amount, stopPips });
        log.unshift(`${act === 'long' ? '做多' : '做空'} ${state.positions.length} 笔 @${num(price, 3)}`);
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
        break;
      case 'next':
        nextDay(state);
        break;
    }
  } catch (error) {
    log.unshift((error as Error).message);
  }
  persist();
  render();
}

export function start(): void {
  const app = document.getElementById('app');
  if (!app) return;
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