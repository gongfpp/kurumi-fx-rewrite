import { NUMERICS } from '../content/config/numerics';
import { createGame } from '../domain/core/state';
import { historyCandles } from '../domain/market/history';
import { planDay } from '../domain/market/sources/simulated';

const fmt = (n: number): string => n.toLocaleString('zh-CN');

function mount(root: HTMLElement): void {
  const state = createGame(20261022, { mode: 'story' });
  state.candles = historyCandles(state.seed);
  state.script = planDay(state.seed, state.day, state.price);

  root.innerHTML = `
    <main class="boot" role="main">
      <p class="eyebrow">FX KURUMI / MARGIN CALL TERMINAL</p>
      <h1>FX韭留美 · 今天也要回本</h1>
      <p class="sub">原创同人风外汇交易模拟 · TypeScript 重建版</p>
      <dl>
        <div><dt>开盘本金</dt><dd>¥${fmt(NUMERICS.STORY_START)}</dd></div>
        <div><dt>章节目标</dt><dd>净交易收益 +¥${fmt(NUMERICS.TARGET_PROFIT)}</dd></div>
        <div><dt>主要货币对</dt><dd>${NUMERICS.MARKETS.map((m) => m.symbol).join(' · ')}</dd></div>
        <div><dt>行情</dt><dd>${state.script ? '已生成 · 确定性种子 ' : ''}${state.seed}</dd></div>
      </dl>
      <footer>原创同人小游戏 · 非官方作品 · 虚构行情 · 非投资建议</footer>
    </main>
  `;
}

const app = document.getElementById('app');
if (app) mount(app);