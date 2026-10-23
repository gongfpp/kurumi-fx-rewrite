import { ACHIEVEMENTS } from '../../content';
import {
  COMIC_FILES,
  GENERATED_FILES,
  HOMAGE_FILES,
  MANGA_FILES,
  VOICE_CLIPS,
  assetUrl,
  expressionUrl,
  pixelUrl,
  sceneUrl,
} from '../../content/assets';
import { NUMERICS } from '../../content/config/numerics';
import type { GameState } from '../../domain/core/types';
import { consumptionStatement, dinnerOptions, friendNames, housingOptions, relaxOptions } from '../../domain/economy/life-actions';
import { SUPPLY_ITEMS, supplyUnavailableReason } from '../../domain/economy/supplies';
import { lotteryIncomeTotals } from '../../domain/economy/lottery';
import { networkLoanTerms } from '../../domain/economy/credit';
import { lifestylePlan } from '../../domain/economy/living';
import { mood, moodLabel } from '../../domain/mind/mood';
import { expressionLabel } from '../../domain/mind/expressions';
import { evaluateAchievements } from '../../domain/progress/achievements';
import type { MangaPage } from '../../domain/story/manga';
import { OPENING_PAGES, STORY_EVENTS } from '../../domain/story/story';
import type { LeaderboardEntry } from '../../app/services/leaderboard';
import type { AudioState } from './audio';
import { BGM_TRACKS } from '../../content/assets';

const yen = (n: number): string => '¥' + Math.round(n).toLocaleString('zh-CN');

export const SCENE_BY_ROUTE: Record<string, string> = {
  liquidation: 'liquidation',
  despair: 'settledSmallLoss',
  profit: 'closedProfit',
  calm: 'settledNoTrade',
  ecstatic: 'profitHundredThousand',
  friend: 'dinnerFriends',
  father: 'fatherBorrow',
  recovering: 'spa',
};

export function faceHtml(emotion: string): string {
  return `<figure class="fx-face">
    <img src="${expressionUrl(emotion)}" alt="久留美 · ${moodLabel(emotion)} · ${expressionLabel(emotion)}" loading="lazy" />
    <figcaption>${moodLabel(emotion)} · ${expressionLabel(emotion)}</figcaption>
  </figure>`;
}

export function shell(title: string, body: string, { wide = false }: { wide?: boolean } = {}): string {
  return `<div class="fx-modal-backdrop">
    <section class="fx-modal ${wide ? 'wide' : ''}" role="dialog" aria-modal="true" aria-label="${title}">
      <header class="fx-modal-head"><h2>${title}</h2><button data-act="modal:close" aria-label="关闭">×</button></header>
      <div class="fx-modal-body">${body}</div>
    </section>
  </div>`;
}

export function mangaPanelHtml(page: MangaPage): string {
  const scene = SCENE_BY_ROUTE[page.route];
  const img = scene ? (sceneUrl(scene) ?? '') : '';
  return `<div class="fx-manga-title">${page.title} <span class="tag ${page.origin}">${page.origin === 'fan' ? '原作桥段改编' : '游戏原创'}</span></div>
    ${page.sourceNote ? `<div class="fx-caption">${page.sourceNote}</div>` : ''}
    ${img ? `<img class="fx-scene" src="${img}" alt="${page.title}" loading="lazy" />` : ''}
    <div class="fx-manga-grid">
      ${page.panels.map((p, i) => `<div class="fx-frame" style="background-image:url('${graphicFor(i, page.route)}')"><span class="n">${i + 1}</span><div class="fx-frame-text"><b>${p.speaker}</b><br>${p.text}</div></div>`).join('')}
    </div>`;
}

function graphicFor(index: number, route: string): string {
  void index;
  return sceneUrl(SCENE_BY_ROUTE[route] ?? 'settledNoTrade') ?? '';
}

export function mangaDialog(_s: GameState, page: MangaPage): string {
  const gallery = COMIC_FILES.slice(0, 8);
  return shell(
    '每日小剧场 · 原创四格',
    `${mangaPanelHtml(page)}
     <h3 class="fx-sub">结局／事件四格（原创）</h3>
     <div class="fx-gallery">${gallery.map((f) => `<a href="${assetUrl(f)}" target="_blank" rel="noopener"><img src="${assetUrl(f)}" alt="四格" loading="lazy"></a>`).join('')}</div>
     <h3 class="fx-sub">原作致敬单格</h3>
     <div class="fx-gallery">${HOMAGE_FILES.map((f) => `<a href="${assetUrl(f)}" target="_blank" rel="noopener"><img src="${assetUrl(f)}" alt="致敬" loading="lazy"></a>`).join('')}</div>
     <h3 class="fx-sub">原作漫画（${MANGA_FILES.length} 张）</h3>
     <div class="fx-gallery manga">${MANGA_FILES.slice(0, 24).map((f) => `<a href="${assetUrl(f)}" target="_blank" rel="noopener"><img src="${assetUrl(f)}" alt="漫画" loading="lazy"></a>`).join('')}</div>`,
    { wide: true },
  );
}

export function sceneGalleryDialog(): string {
  return shell(
    `场景插画库（${GENERATED_FILES.length} 张）`,
    `<div class="fx-gallery manga">${GENERATED_FILES.map((f) => `<a href="${assetUrl(f)}" target="_blank" rel="noopener"><img src="${assetUrl(f)}" alt="插画" loading="lazy"></a>`).join('')}</div>`,
    { wide: true },
  );
}

export function itemDialog(s: GameState): string {
  const rows = SUPPLY_ITEMS.filter((i) => i.id !== 'father')
    .map((i) => {
      const reason = supplyUnavailableReason(s, i.id);
      return `<div class="fx-item">
        <div class="fx-item-head"><b>${i.name}</b><span>${i.price ? yen(i.price) : '免费'}</span></div>
        <div class="fx-caption">效果：${i.effect}${i.stamina ? ` · 体力 ${i.stamina > 0 ? '+' : ''}${i.stamina}` : ''}${i.stress ? ` · 压力 ${i.stress > 0 ? '+' : ''}${i.stress}` : ''}${i.mood ? ` · 情绪趋向「${moodLabel(i.mood)}」` : ''}</div>
        <div class="fx-caption">来源：${i.sourceNote}</div>
        <button data-act="supply:${i.id}" ${reason ? 'disabled' : ''}>${reason ?? '使用'}</button>
      </div>`;
    })
    .join('');
  const items = pixelUrl('uiIcons') ? `<img class="fx-icons" src="${pixelUrl('uiIcons')}" alt="道具图标" loading="lazy">` : '';
  return shell('道具与说明', `${items}${rows}`);
}

export function lifeDialog(s: GameState): string {
  const relax = relaxOptions()
    .map((r) => `<button data-act="life:relax:${r.id}">${r.label}${r.cost ? ` ${yen(r.cost)}` : ''} · 压力${r.stress}</button>`)
    .join('');
  const dinner = dinnerOptions()
    .map((d) => `<button data-act="life:dinner:${d.id}">${d.label} ${yen(d.cost)}</button>`)
    .join('');
  const friends = friendNames()
    .map((n) => `<button data-act="life:friend:${n}">和${n}见面 · 压力-6</button>`)
    .join('');
  const houses = housingOptions()
    .map((h) => `<button data-act="life:house:${h.id}">${h.label}（日${yen(h.dailyCost)} · 搬入${h.moveInCost ? yen(h.moveInCost) : '免费'}）</button>`)
    .join('');
  const stmt = consumptionStatement(s);
  const ledger = stmt.rows.map((r) => `<div class="fx-row"><span>${r.label}</span><b>${yen(r.amount)}</b></div>`).join('') || '<div class="fx-caption">今天还没有消费记录。</div>';
  const pixel = pixelUrl('lifeMenu') ? `<img class="fx-scene" src="${pixelUrl('lifeMenu')}" alt="生活菜单" loading="lazy">` : '';
  return shell(
    '生活 · 一天只能安排一次',
    `${pixel}
     <h3 class="fx-sub">放松 / 温泉</h3><div class="fx-actions wrap">${relax}</div>
     <h3 class="fx-sub">晚餐</h3><div class="fx-actions wrap">${dinner}</div>
     <h3 class="fx-sub">朋友</h3><div class="fx-actions wrap">${friends}</div>
     <h3 class="fx-sub">住房（当前：${lifestylePlan(s).label}）</h3><div class="fx-actions wrap">${houses}</div>
     <h3 class="fx-sub">今日消费账本 · 合计 ${yen(stmt.total)}</h3>${ledger}`,
    { wide: true },
  );
}

export function newsDialog(s: GameState): string {
  const events = (s.newsLog ?? []).slice(-20).reverse();
  const rows = events.length
    ? events.map((e) => `<div class="fx-row"><span>${e.time ?? ''} · ${e.source}</span><b>${e.title}</b></div><div class="fx-caption">${e.copy}</div>`).join('')
    : '<div class="fx-caption">今天还没有快讯。</div>';
  return shell('行情快讯记录', rows, { wide: true });
}

export function achievementsDialog(s: GameState): string {
  const map = evaluateAchievements(s);
  const rows = ACHIEVEMENTS.map((a) => {
    const st = map[a.id];
    return `<div class="fx-ach ${st?.unlocked ? 'on' : ''}"><span class="badge">${st?.unlocked ? a.badge : '🔒'}</span><div><b>${a.name}</b><div class="fx-caption">${a.description}${a.goal > 1 ? `（进度 ${Math.min(st?.progress ?? 0, a.goal)}/${a.goal}）` : ''}</div><div class="fx-caption">${a.sourceNote}</div></div></div>`;
  }).join('');
  return shell('成就', rows);
}

export function leaderboardDialog(entries: LeaderboardEntry[] | null, opts: { sort?: string; myNick?: string } = {}): string {
  const sort = opts.sort ?? 'netProfit';
  const sorts: [string, string][] = [
    ['survivedDays', '存活天数'],
    ['returnRate', '收益率'],
    ['netProfit', '净收益'],
    ['maxDrawdown', '最大回撤'],
  ];
  const bar = `<div class="fx-actions wrap">${sorts.map(([k, label]) => `<button data-act="rank:sort:${k}" class="${sort === k ? 'on' : ''}">${label}</button>`).join('')}</div>`;
  if (!entries || !entries.length) {
    return shell('名人堂', `${bar}<div class="fx-caption">暂无榜单数据（后端未配置或为空）。上榜默认匿名。</div><div class="fx-actions"><button data-act="open:rank">投稿上榜</button></div>`);
  }
  const key = sort as keyof LeaderboardEntry;
  const sorted = [...entries].sort((a, b) => {
    const av = (a[key] ?? 0) as number;
    const bv = (b[key] ?? 0) as number;
    return av === bv ? 0 : av < bv ? 1 : -1;
  });
  const rows = sorted
    .map((r, i) => {
      const mine = opts.myNick && r.nickname === opts.myNick;
      return `<div class="fx-row ${mine ? 'mine' : ''}"><span>${i + 1}. ${r.nickname}${mine ? '（我）' : ''}</span><b>${yen(r.netProfit)} · ${r.survivedDays}天 · 回撤 ${(r.maxDrawdown * 100).toFixed(1)}%</b></div>`;
    })
    .join('');
  return shell('名人堂', `${bar}${rows}<div class="fx-caption">上榜默认匿名；统计不含身份信息。</div><div class="fx-actions"><button data-act="open:rank">投稿上榜</button></div>`);
}

export function settingsDialog(audio: AudioState): string {
  const tracks = BGM_TRACKS.map((t) => `<button data-act="bgm:play:${t}" ${audio.currentBgm === t ? 'disabled' : ''}>${t}</button>`).join('');
  return shell(
    '设置',
    `<div class="fx-row"><span>背景音乐</span><b><button data-act="audio:bgm-toggle">${audio.bgmEnabled ? '开' : '关'}</button></b></div>
     <div class="fx-row"><span>音效</span><b><button data-act="audio:sfx-toggle">${audio.sfxEnabled ? '开' : '关'}</button></b></div>
     <div class="fx-row"><span>音量</span><b><input type="range" data-field="volume" min="0" max="100" value="${Math.round(audio.volume * 100)}"></b></div>
     <div class="fx-caption">${audio.currentBgm ? `当前曲目：${audio.currentBgm}` : '背景音乐默认关闭，点击「开」后播放。'}</div>
     <h3 class="fx-sub">曲目（${BGM_TRACKS.length}）</h3>
     <div class="fx-actions wrap">${tracks}</div>
     <div class="fx-caption">语音为手动触发；游戏不自动播放原声。</div>`,
    { wide: true },
  );
}

export function vocalDialog(): string {
  const rows = VOICE_CLIPS.map((c) => `<div class="fx-row"><span>${c.caption}</span><b><button data-act="voice:play:${c.file}">播放</button></b></div>`).join('');
  return shell('日语原声（手动播放）', `${rows}<div class="fx-caption">片段来自原作官方 PV，仅手动点播。</div>`, { wide: true });
}

export function lotteryDialog(s: GameState): string {
  const totals = lotteryIncomeTotals(s.lottery ?? { version: 1, tickets: [], drawsWithoutTop3: 0, cheatRedeemed: false });
  return shell(
    '彩票',
    `<div class="fx-row"><span>票价</span><b>${yen(NUMERICS.LOTTERY.ticketPrice)}</b></div>
     <div class="fx-row"><span>开奖</span><b>次日 18:00 · 保底 ${NUMERICS.LOTTERY.guaranteeDraws} 抽</b></div>
     <div class="fx-row"><span>累计投入 / 中奖</span><b>${yen(totals.spent)} / ${yen(totals.normal)}</b></div>
     <div class="fx-actions"><button data-act="lottery:buy">买一张 ${yen(NUMERICS.LOTTERY.ticketPrice)}</button><button data-act="lottery:cheat">输入暗号</button></div>
     <div class="fx-caption">彩票是游戏内的休闲玩法，与真实博彩无关。</div>
     <div class="fx-caption">已购：${(s.lottery?.tickets ?? []).filter((t) => t.kind === 'normal').length} 张。</div>`,
  );
}

export function creditDialog(s: GameState): string {
  const terms = networkLoanTerms(s);
  const loan = s.loan ?? { outstanding: 0, limit: terms.limit, dailyRate: terms.dailyRate };
  return shell(
    '网络贷款',
    `<div class="fx-row"><span>额度</span><b>${yen(terms.limit)}</b></div>
     <div class="fx-row"><span>已借 / 可用</span><b>${yen(loan.outstanding)} / ${yen(terms.availableCredit)}</b></div>
     <div class="fx-row"><span>日利率</span><b>${(terms.dailyRate * 100).toFixed(3)}%</b></div>
     <div class="fx-row"><span>今日利息</span><b>${yen(terms.estimatedDailyInterest)}</b></div>
     <div class="fx-actions wrap">
       ${[100000, 300000, terms.availableCredit].filter((v, i, a) => v >= terms.minBorrow && a.indexOf(v) === i).map((v) => `<button data-act="credit:borrow:${Math.floor(v)}">借 ${yen(Math.floor(v))}</button>`).join('')}
       <button data-act="credit:repay:all">全部归还</button>
     </div>
     <div class="fx-caption">这是虚构的游戏压力机制，不是真实借贷产品。</div>`,
  );
}

export function fatherDialog(s: GameState): string {
  const owed = s.family?.outstanding ?? 0;
  const available = NUMERICS.FATHER_SAVINGS;
  return shell(
    '父亲的柜中存款',
    `<div class="fx-row"><span>柜中总额</span><b>${yen(available)}</b></div>
     <div class="fx-row"><span>已借出 / 已归还</span><b>${yen(owed)} / ${yen(s.family?.repaid ?? 0)}</b></div>
     <div class="fx-row"><span>当前压力惩罚</span><b>${owed > 0 ? '+8（未还清）' : '无'}</b></div>
     <div class="fx-actions"><button data-act="father:take:100000">取 10 万</button><button data-act="father:take:300000">取 30 万</button><button data-act="father:take:1000000">取 100 万</button><button data-act="father:repay:all">全部归还</button></div>
     <div class="fx-caption">整章只能动用一次；取用会计入欠款并增加心理压力（原作桥段改编）。</div>`,
  );
}

export function openingDialog(): string {
  const pages = OPENING_PAGES.map((p) => `<div class="fx-row"><span>${p.text}</span><b>${p.kind === 'fan' ? '原作' : '原创'}</b></div><div class="fx-caption">${p.sourceNote}</div>`).join('');
  return shell('序章', pages, { wide: true });
}

export function eventsDialog(): string {
  const rows = STORY_EVENTS.map((e) => `<div class="fx-row"><span>${e.title}</span><b>${e.original ? '原作桥段改编' : '游戏原创'}</b></div><div class="fx-caption">选项：${e.choices.map((c) => c.text).join(' / ')}</div>`).join('');
  return shell('人物事件一览', rows, { wide: true });
}

export function helpDialog(): string {
  return shell(
    '玩法说明',
    `<ul class="fx-help">
      <li>每天 4 个决策段，每段 4 根 K 线；下单后点「继续行情」播放。</li>
      <li>心理承受力随回撤增加而下降，越低限制越多（杠杆/仓位/能否开仓）。</li>
      <li>连点「上头」可临时突破限制，但会累积压力与热度。</li>
      <li>交易日结束会扣生活费、贷款利息，并结算今日账单。</li>
      <li>目标：累计净交易收益 +¥${NUMERICS.TARGET_PROFIT.toLocaleString('zh-CN')}；随时可「收手离场」。</li>
      <li>行情为虚构；本作为非官方同人游戏，非投资建议。</li>
    </ul>`,
    { wide: true },
  );
}

export function moodTag(s: GameState): string {
  const e = mood(s);
  return `<span class="fx-mood-tag">${moodLabel(e)}</span>`;
}