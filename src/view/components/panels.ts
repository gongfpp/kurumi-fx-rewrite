import { NUMERICS } from '../../content/config/numerics';
import type { GameState } from '../../domain/core/types';
import { accountMetrics, positionsOf } from '../../domain/trading/account';
import { energyStage } from '../../domain/body/energy';
import { staminaStatus } from '../../domain/body/stamina';
import { pressureStatus } from '../../domain/mind/pressure';
import { maxTopUp } from '../../domain/trading/margin';
import type { ThemeTokens } from '../styles/tokens';

const yen = (n: number): string => '¥' + Math.round(n).toLocaleString('zh-CN');

export const AMOUNT_PRESETS = [1_000, 5_000, 10_000, 50_000, 100_000];

/** Order tickets extras: stake ratio, amount presets and a random dice. */
export function orderExtrasHtml(canOpen: boolean): string {
  return `<div class="fx-extras">
    <div class="fx-stake-row">
      <span class="fx-caption">仓位比例</span>
      ${[0.1, 0.25, 0.5, 1].map((v) => `<button data-act="stake:${v}" ${canOpen ? '' : 'disabled'}>${v === 1 ? '全仓' : Math.round(v * 100) + '%'}</button>`).join('')}
    </div>
    <div class="fx-stake-row">
      <span class="fx-caption">常用金额</span>
      ${AMOUNT_PRESETS.map((v) => `<button data-act="amount:${v}" ${canOpen ? '' : 'disabled'}>${yen(v)}</button>`).join('')}
      <button data-act="amount:random" ${canOpen ? '' : 'disabled'}>🎲 随机</button>
    </div>
  </div>`;
}

export interface ChartOptions {
  period: number;
  ma: number[];
  speed: number;
}

export function chartToolbarHtml(o: ChartOptions): string {
  const periods: [number, string][] = [[1440, '日K'], [15, '15分钟'], [5, '5分钟'], [1, '1分钟']];
  return `<div class="fx-extras">
    <div class="fx-stake-row">
      <span class="fx-caption">K线周期</span>
      ${periods.map(([p, label]) => `<button data-act="period:${p}" ${o.period === p ? 'disabled' : ''}>${label}</button>`).join('')}
    </div>
    <div class="fx-stake-row">
      <span class="fx-caption">均线</span>
      ${[5, 10, 20].map((m) => `<button data-act="ma:${m}" class="${o.ma.includes(m) ? 'on' : ''}">MA${m}</button>`).join('')}
      <span class="fx-caption">倍速</span>
      ${[1, 2, 4].map((sp) => `<button data-act="speed:${sp}" ${o.speed === sp ? 'disabled' : ''}>${sp}×</button>`).join('')}
    </div>
  </div>`;
}

/** Emotion-pressure panel: shows the soft-lock meter and lets the player push. */
export function pressurePanelHtml(s: GameState, now: number): string {
  const p = pressureStatus(s, now);
  const pct = Math.min(100, Math.round(p.intensity * 100));
  return `<div class="fx-pressure" aria-label="上头压力">
    <div class="fx-bar"><span style="width:${pct}%;background:var(--fx-warn)"></span></div>
    <div class="fx-row"><span>上头连点</span><b>${p.taps} / ${p.target || '-'}</b></div>
    <div class="fx-actions">
      <button data-act="press:stake" ${p.extreme ? 'disabled' : ''}>连点：突破仓位锁</button>
      <button data-act="press:lev" ${p.extreme ? 'disabled' : ''}>连点：突破杠杆锁</button>
    </div>
    <div class="fx-caption">连续点击可临时突破心理限制，代价是压力与上头上升。</div>
  </div>`;
}

/** Inline risk alerts mirroring the original risk-alerts block. */
export function riskAlertsHtml(s: GameState): string {
  const m = accountMetrics(s);
  const alerts: string[] = [];
  if (s.positions.length && m.marginLevel !== null && m.marginLevel <= 0.8) alerts.push(`保证金率 ${(m.marginLevel * 100).toFixed(0)}% · 接近强平`);
  if (s.sanity <= 20) alerts.push(`心理承受力 ${Math.round(s.sanity)} · 强制限制开仓`);
  const st = staminaStatus(s);
  if (st.low) alerts.push(`体力偏低 ${Math.round(st.value)} · 消耗加快`);
  const es = energyStage(s);
  if (es.active) alerts.push(es.hint);
  if (!alerts.length) return '';
  return `<div class="fx-alerts" role="status">${alerts.map((a) => `<div>⚠️ ${a}</div>`).join('')}</div>`;
}

/** Position list with per-position top-up / half / close. */
export function positionsTableHtml(s: GameState): string {
  const rows = positionsOf(s)
    .map((p) => {
      const floating = p.direction * ((p.symbol && s.marketBook ? s.marketBook.markets[p.symbol]?.price : s.price) as number - p.entry) * ((p.notional ?? p.margin * p.leverage) / p.entry);
      return `<div class="fx-pos">
        <div class="fx-row"><span>${p.direction === 1 ? '做多' : '做空'} ${p.leverage}× · ${p.id}</span><b class="${floating >= 0 ? 'up' : 'down'}">${floating >= 0 ? '+' : ''}${yen(floating)}</b></div>
        <div class="fx-caption">保证金 ${yen(p.margin)} · 名义 ${yen(p.notional ?? p.margin * p.leverage)}</div>
        <div class="fx-actions"><button data-act="half:${p.id}">全部减半</button><button data-act="close:${p.id}">平仓</button></div>
      </div>`;
    })
    .join('');
  return rows || '<div class="fx-caption">当前没有持仓。</div>';
}

export function modeDialog(current: string): string {
  const modes: [string, string, string][] = [
    ['story', '剧情模式', '4 决策段一天，有日结、剧情与目标两千万。'],
    ['endless', '操盘模式（无限）', '连续运行、不日结，净资产过低即破产。'],
  ];
  return `<div class="fx-modal-backdrop"><section class="fx-modal" role="dialog" aria-modal="true" aria-label="模式选择">
    <header class="fx-modal-head"><h2>选择模式</h2><button data-act="modal:close" aria-label="关闭">×</button></header>
    <div class="fx-modal-body">
      ${modes.map(([id, label, desc]) => `<div class="fx-item"><div class="fx-item-head"><b>${label}</b>${id === current ? '<span>当前</span>' : ''}</div><div class="fx-caption">${desc}</div><button data-act="mode:${id}" ${id === current ? 'disabled' : ''}>${id === current ? '使用中' : '切换到该模式'}</button></div>`).join('')}
      <div class="fx-caption">历史真实 / 实时真实行情源为可选扩展，当前默认使用确定性模拟盘。</div>
    </div></section></div>`;
}

export function marginDialog(s: GameState): string {
  const options = [10_000, 50_000, 100_000, Math.floor(maxTopUp(s))].filter((v, i, a) => v >= 100 && a.indexOf(v) === i);
  return `<div class="fx-modal-backdrop"><section class="fx-modal" role="dialog" aria-modal="true" aria-label="追加保证金">
    <header class="fx-modal-head"><h2>追加保证金</h2><button data-act="modal:close" aria-label="关闭">×</button></header>
    <div class="fx-modal-body">
      ${positionsTableHtml(s)}
      <div class="fx-row"><span>可追加现金</span><b>${yen(maxTopUp(s))}</b></div>
      <div class="fx-actions wrap">
        ${options.map((v) => `<button data-act="margin:${v}">追加 ${yen(Math.floor(v))}</button>`).join('')}
        <button data-act="margin:max">最大可追加</button>
      </div>
      <div class="fx-caption">追加保证金会从现金转入持仓，提高强平距离，但不改变盈亏方向。</div>
    </div></section></div>`;
}

export function bankruptDialog(s: GameState): string {
  return `<div class="fx-modal-backdrop"><section class="fx-modal" role="dialog" aria-modal="true" aria-label="账户告急">
    <header class="fx-modal-head"><h2>账户告急</h2><button data-act="modal:close" aria-label="关闭">×</button></header>
    <div class="fx-modal-body">
      <div class="fx-row"><span>当前权益</span><b>${yen(accountMetrics(s).equity)}</b></div>
      <div class="fx-row"><span>最低限额</span><b>${yen(NUMERICS.MIN_EQUITY)}</b></div>
      <div class="fx-actions">
        <button data-act="credit:borrow:${Math.max(100000, Math.floor(Math.max(0, s.cash)))}">借钱续命</button>
        <button data-act="open:father">动用父亲的柜子</button>
        <button data-act="walkaway">销户离场</button>
      </div>
      <div class="fx-caption">权益跌破最低限额会直接进入破产结局；也可以主动收手。</div>
    </div></section></div>`;
}

export function walkawayDialog(s: GameState): string {
  const debt = (s.family?.outstanding ?? 0) + (s.loan?.outstanding ?? 0);
  return `<div class="fx-modal-backdrop"><section class="fx-modal" role="dialog" aria-modal="true" aria-label="收手离场">
    <header class="fx-modal-head"><h2>收手并上榜？</h2><button data-act="modal:close" aria-label="关闭">×</button></header>
    <div class="fx-modal-body">
      <div class="fx-row"><span>本章累计</span><b>${yen(s.cash + accountMetrics(s).usedMargin + accountMetrics(s).unrealized)}</b></div>
      <div class="fx-row"><span>未清债务</span><b>${yen(debt)}</b></div>
      <div class="fx-actions"><button data-act="walkaway:confirm">收手并上榜</button><button data-act="modal:close">继续本局</button></div>
      <div class="fx-caption">离场后本局结束，可导出战报；债务状况决定结局变体。</div>
    </div></section></div>`;
}

export function shareDialog(s: GameState, tokens: ThemeTokens): string {
  const debt = (s.family?.outstanding ?? 0) + (s.loan?.outstanding ?? 0);
  const eq = accountMetrics(s).equity;
  return `<div class="fx-modal-backdrop"><section class="fx-modal" role="dialog" aria-modal="true" aria-label="战报">
    <header class="fx-modal-head"><h2>保存我的战绩卡</h2><button data-act="modal:close" aria-label="关闭">×</button></header>
    <div class="fx-modal-body">
      <div class="fx-share-card" style="border-color:${tokens.accent}">
        <div class="fx-share-title">FX韭留美 · 今天也要回本</div>
        <div class="fx-share-row"><span>第 ${s.day} 天 · ${s.mode === 'endless' ? '操盘模式' : '剧情模式'}</span></div>
        <div class="fx-share-row"><span>总资产</span><b>${yen(eq)}</b></div>
        <div class="fx-share-row"><span>总欠款</span><b>${yen(debt)}</b></div>
        <div class="fx-share-row"><span>心理 / 体力</span><b>${Math.round(s.sanity)} / ${Math.round(staminaStatus(s).value)}</b></div>
        <div class="fx-share-foot">原创同人小游戏 · 非官方作品 · 虚构行情</div>
      </div>
      <div class="fx-actions"><button data-act="share:png">下载本页与当前存档备份</button><button data-act="share:json">导出存档 / 战报 JSON</button></div>
      <div class="fx-caption">战报卡为像素风/主题配色，内容仅含本局公开数据。</div>
    </div></section></div>`;
}

export function openingPagerHtml(index: number, pages: { id: string; kind: string; text: string; sourceNote: string }[]): string {
  const page = pages[Math.max(0, Math.min(index, pages.length - 1))];
  return `<div class="fx-modal-backdrop"><section class="fx-modal" role="dialog" aria-modal="true" aria-label="序章">
    <header class="fx-modal-head"><h2>序章 ${index + 1} / ${pages.length}</h2><button data-act="modal:close" aria-label="关闭序章">×</button></header>
    <div class="fx-modal-body">
      <div class="fx-manga-title">${page?.kind === 'fan' ? '原作' : '原创'}</div>
      <p class="fx-caption">${page?.text}</p>
      <div class="fx-caption">${page?.sourceNote}</div>
      <div class="fx-actions">
        <button data-act="opening:prev" ${index <= 0 ? 'disabled' : ''}>← 上一页</button>
        <button data-act="opening:next" ${index >= pages.length - 1 ? 'disabled' : ''}>下一页</button>
        <button data-act="opening:skip">跳过序章</button>
      </div>
    </div></section></div>`;
}