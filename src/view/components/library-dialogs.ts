import { COMIC_FILES, HOMAGE_FILES, MANGA_FILES, assetUrl } from '../../content/assets';
import type { GameState } from '../../domain/core/types';
import { CHARACTER_STORIES, ORIGINAL_STORIES, currentComments, type StoryBook } from '../../domain/story/library';
import { equity } from '../../domain/trading/account';
import type { CommentEntry } from '../../domain/story/library';

const yen = (n: number): string => '¥' + Math.round(n).toLocaleString('zh-CN');

export function shell(title: string, body: string, { wide = false }: { wide?: boolean } = {}): string {
  return `<div class="fx-modal-backdrop"><section class="fx-modal ${wide ? 'wide' : ''}" role="dialog" aria-modal="true" aria-label="${title}">
    <header class="fx-modal-head"><h2>${title}</h2><button data-act="modal:close" aria-label="关闭">×</button></header>
    <div class="fx-modal-body">${body}</div>
  </section></div>`;
}

export function commentsRow(s: GameState): string {
  const { investor, player } = currentComments(s);
  return `<div class="fx-comments" data-act="open:comments" style="cursor:pointer">
    <div class="fx-caption">💬 投资者短评 · ${investor.role}</div>
    <div class="fx-row"><span>${investor.text}</span></div>
    <div class="fx-caption">🗨 玩家留言：${player.text}（点击查看出处）</div>
  </div>`;
}

export function commentsDialog(investor: CommentEntry, player: CommentEntry): string {
  return shell(
    '短评出处',
    `<div class="fx-item"><div class="fx-item-head"><b>${investor.role}</b><span>投资者</span></div><div class="fx-caption">${investor.text}</div><div class="fx-caption">出处：${investor.source}</div></div>
     <div class="fx-item"><div class="fx-item-head"><b>玩家留言</b></div><div class="fx-caption">${player.text}</div><div class="fx-caption">出处：${player.source}</div></div>
     <div class="fx-caption">公开讨论摘录与玩家留言，非实时聊天；内容为示例数据。</div>`,
  );
}

function bookReader(list: StoryBook[], bookIndex: number, page: number, prefix: string): string {
  const book = list[bookIndex] as StoryBook;
  const safePage = Math.max(0, Math.min(page, book.pages.length - 1));
  return `<div class="fx-modal-backdrop"><section class="fx-modal" role="dialog" aria-modal="true" aria-label="${book.title}">
    <header class="fx-modal-head"><h2>${book.title} · ${safePage + 1}/${book.pages.length}</h2><button data-act="modal:close" aria-label="关闭人物篇章">×</button></header>
    <div class="fx-modal-body">
      <div class="fx-manga-title">${book.origin === 'fan' ? '原作桥段改编' : '游戏原创'}${book.note ? ` · ${book.note}` : ''}${book.sourceNote ? ` · ${book.sourceNote}` : ''}</div>
      <p>${book.pages[safePage]}</p>
      <div class="fx-actions">
        <button data-act="${prefix}:prev" ${safePage <= 0 ? 'disabled' : ''}>← 上一页</button>
        <button data-act="${prefix}:next" ${safePage >= book.pages.length - 1 ? 'disabled' : ''}>下一页</button>
      </div>
      <h3 class="fx-sub">篇章（${list.length}）</h3>
      <div class="fx-actions wrap">${list.map((b, i) => `<button data-act="${prefix}:book:${i}" ${i === bookIndex ? 'disabled' : ''}>${b.title}</button>`).join('')}</div>
      <div class="fx-caption">共 ${list.length} 篇，可逐页翻阅。</div>
    </div></section></div>`;
}

export function characterStoryDialog(bookIndex: number, page: number): string {
  return bookReader(CHARACTER_STORIES, bookIndex, page, 'charstory');
}
export function originalStoryDialog(bookIndex: number, page: number): string {
  return bookReader(ORIGINAL_STORIES, bookIndex, page, 'origstory');
}

export function mangaLibraryDialog(): string {
  return shell(
    `原作漫画（${MANGA_FILES.length} 张）`,
    `<div class="fx-gallery manga">${MANGA_FILES.map((f) => `<a href="${assetUrl(f)}" target="_blank" rel="noopener"><img src="${assetUrl(f)}" alt="漫画" loading="lazy"></a>`).join('')}</div>
     <h3 class="fx-sub">结局／事件四格（原创）</h3>
     <div class="fx-gallery">${COMIC_FILES.map((f) => `<a href="${assetUrl(f)}" target="_blank" rel="noopener"><img src="${assetUrl(f)}" alt="四格" loading="lazy"></a>`).join('')}</div>
     <h3 class="fx-sub">原作致敬单格</h3>
     <div class="fx-gallery">${HOMAGE_FILES.map((f) => `<a href="${assetUrl(f)}" target="_blank" rel="noopener"><img src="${assetUrl(f)}" alt="致敬" loading="lazy"></a>`).join('')}</div>`,
    { wide: true },
  );
}

export function privacyDialog(enabled: boolean): string {
  return shell(
    '匿名统计与隐私',
    `<div class="fx-row"><span>匿名统计</span><b>${enabled ? '开启' : '关闭'}</b></div>
     <button data-act="privacy:toggle">${enabled ? '关闭匿名统计' : '开启匿名统计'}</button>
     <div class="fx-caption">统计仅记录玩法事件（开局/结局/成就），不含身份信息；可随时关闭。存储位置为本机 localStorage。</div>`,
  );
}

export interface DeveloperView {
  active: boolean;
  verified: boolean;
  tainted: boolean;
  password: string;
  note: string;
}

export function developerDialog(s: GameState, dev: DeveloperView): string {
  if (!dev.verified) {
    return shell(
      '开发者模式 · 密码验证',
      `<div class="fx-row"><span>密码</span><b><input type="password" data-field="devpass" aria-label="开发者密码" /></b></div>
       <button data-act="dev:verify">验证并进入</button>
       <div class="fx-caption">仅本机调试用；验证后本局会永久标记，不再计入排行榜与成就。</div>
       <div class="fx-caption">${dev.note}</div>`,
    );
  }
  return shell(
    '开发者模式',
    `<div class="fx-row"><span>状态</span><b>${dev.tainted ? '已标记（本局不计榜）' : '未标记'}</b></div>
     <div class="fx-row"><span>第几天 / 阶段</span><b>${s.day} / ${s.phase}</b></div>
     <div class="fx-row"><span>现金</span><b>${yen(s.cash)}</b></div>
     <div class="fx-row"><span>权益</span><b>${yen(equity(s))}</b></div>
     <div class="fx-row"><span>债务</span><b>${yen((s.family?.outstanding ?? 0) + (s.loan?.outstanding ?? 0))}</b></div>
     <div class="fx-row"><span>心理 / 压力</span><b>${Math.round(s.sanity)} / ${Math.round(s.stress)}</b></div>
     <div class="fx-row"><span>报价 / 段</span><b>${s.price.toFixed(3)} / ${s.beat}</b></div>
     <div class="fx-actions wrap">
       <button data-act="dev:cash:1000000">现金设为 ¥100万</button>
       <button data-act="dev:cash:100000">现金设为 ¥10万</button>
       <button data-act="dev:sanity:80">心理设为 80</button>
       <button data-act="dev:stress:0">压力清零</button>
     </div>
     <div class="fx-caption">${dev.note}</div>`,
  );
}

export function saveDialog(): string {
  return shell(
    '存档与恢复',
    `<div class="fx-actions wrap">
       <button data-act="save:download">下载本页进度备份</button>
       <button data-act="save:download-report">下载本页与当前存档备份</button>
       <button data-act="save:latest">放下本页进度，载入最新存档</button>
     </div>
     <h3 class="fx-sub">从进度备份恢复</h3>
     <input type="file" accept="application/json,.json" data-field="restore" aria-label="选择本机文件" />
     <div class="fx-caption">选择之前导出的 JSON 备份文件即可恢复；如本机已有更新存档会提示冲突，需确认后覆盖。</div>`,
  );
}