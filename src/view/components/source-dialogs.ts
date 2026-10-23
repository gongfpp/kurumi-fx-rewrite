import manifest from '../../content/assets/manifest.json';
import { NUMERICS } from '../../content/config/numerics';
import type { GameState } from '../../domain/core/types';
import type { LiveState } from '../../domain/market/sources/live';

const yen = (n: number): string => '¥' + Math.round(n).toLocaleString('zh-CN');
const HISTORY: string[] = ((manifest as unknown as Record<string, string[]>).history ?? []).filter((f) => f.endsWith('.gz'));

export type MarketSourceKind = 'sim' | 'historical' | 'live' | 'replay';

export interface SourceStatus {
  current: MarketSourceKind;
  historyFile: string | null;
  live: LiveState;
  replayCode: string;
  historyDays: number;
}

export function sourceDialog(s: GameState, st: SourceStatus): string {
  const rows: [MarketSourceKind, string, string][] = [
    ['sim', '模拟盘（确定性）', '种子生成，可复现；默认。'],
    ['historical', '历史真实', '导入本地历史数据逐日回放。'],
    ['live', '实时真实', '轮询公开汇率源，失败自动降级为模拟。'],
    ['replay', '共享回放', '用分享码复现他人的同一盘面。'],
  ];
  return `<div class="fx-modal-backdrop"><section class="fx-modal wide" role="dialog" aria-modal="true" aria-label="模式与行情源">
    <header class="fx-modal-head"><h2>模式与行情源</h2><button data-act="modal:close" aria-label="关闭模式选择">×</button></header>
    <div class="fx-modal-body">
      <h3 class="fx-sub">游戏模式</h3>
      <div class="fx-actions wrap">
        <button data-act="mode:story" ${s.mode === 'story' ? 'disabled' : ''}>剧情模式</button>
        <button data-act="mode:endless" ${s.mode === 'endless' ? 'disabled' : ''}>操盘模式（无限）</button>
      </div>
      <h3 class="fx-sub">行情源</h3>
      ${rows
        .map(
          (row) =>
            `<div class="fx-item"><div class="fx-item-head"><b>${row[1]}</b>${st.current === row[0] ? '<span>当前</span>' : ''}</div><div class="fx-caption">${row[2]}</div><button data-act="source:${row[0]}" ${st.current === row[0] ? 'disabled' : ''}>${st.current === row[0] ? '使用中' : '切换到该源'}</button></div>`,
        )
        .join('')}
      <h3 class="fx-sub">历史数据（${HISTORY.length} 个文件）</h3>
      <select data-field="historyFile" aria-label="历史数据文件">
        <option value="">选择历史数据…</option>
        ${HISTORY.map((f) => `<option value="${f}" ${st.historyFile === f ? 'selected' : ''}>${f.replace('history-data/', '')}</option>`).join('')}
      </select>
      <button data-act="history:load">载入并回放历史</button>
      ${st.historyDays ? `<div class="fx-caption">已载入 ${st.historyDays} 个交易日。</div>` : ''}
      <h3 class="fx-sub">实时真实</h3>
      <div class="fx-row"><span>状态</span><b>${st.live.active ? `运行中（${st.live.source ?? ''}）` : st.live.degraded ? '连接失败，已降级为模拟' : '未启动'}</b></div>
      ${st.live.lastPrice ? `<div class="fx-caption">最新报价 ${st.live.lastPrice.toFixed(3)} · ${new Date(st.live.lastAt ?? 0).toLocaleTimeString('zh-CN')}</div>` : ''}
      <div class="fx-actions"><button data-act="live:start">${st.live.active ? '重启实时' : '启动实时'}</button><button data-act="live:stop" ${st.live.active ? '' : 'disabled'}>停止实时</button></div>
      <div class="fx-caption">实时报价来自公开汇率接口，仅作演示；失败会自动降级，不影响游戏。</div>
      <h3 class="fx-sub">共享回放</h3>
      <div class="fx-row"><span>当前回放码</span><b>${st.replayCode || '—'}</b></div>
      <div class="fx-actions"><button data-act="replay:copy">复制当前回放码</button></div>
      <input type="text" data-field="replayCode" placeholder="粘贴回放码后载入" aria-label="回放码" />
      <button data-act="replay:load">载入回放</button>
      <div class="fx-caption">回放码只包含种子与进度，用于复现同一确定性盘面（不包含任何账户隐私）。</div>
      <div class="fx-caption">当前现金 ${yen(s.cash)} · 第 ${s.day} 天 · 目标 +${yen(NUMERICS.TARGET_PROFIT)}</div>
    </div></section></div>`;
}
