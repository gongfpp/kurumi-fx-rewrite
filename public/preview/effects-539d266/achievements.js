import {grossPnlAt} from './market.js?v=539d26616071e7036617b0b49726bd24af40ef2e-capture-v1-1fbef814f493';
import {achievementManga} from './manga-achievements.js?v=539d26616071e7036617b0b49726bd24af40ef2e-capture-v1-1fbef814f493';
import {setMangaImage} from './manga-images.js?v=539d26616071e7036617b0b49726bd24af40ef2e-capture-v1-1fbef814f493';
// Names are game adaptations of verified scenes, not quotations or official achievements.
const define = (id, name, description, badge, sourceNote, goal = 1) =>
  Object.freeze({id, name, description, badge, sourceNote, goal});
export const ACHIEVEMENTS = Object.freeze([
  define('first-profit','太好啦！确定盈利！','完成第一笔手续费后仍盈利的平仓。','利','原作第 1 话第 45 页：确认盈利；图内数字不作为本局条件。'),
  define('million-thirty','一百三十万的余震','累计已实现净收益达到 ¥1,300,000。','130','原作第 5 话第 23 页：130 万日元收益确定后发抖。',1300000),
  define('liquidated','祈祷没有成交价','第一次因保证金不足被强制平仓。','祈','游戏成就：真实保证金强平。已审核的大浮亏图不能证明已强平，因此不配。'),
  define('hold-loss','关掉屏幕仍在亏','选择继续持有后，实际播放至少一根 K 线，仍持有亏损超过保证金 25% 的订单。','暗','游戏成就：继续持亏并经历行情。已审核素材不能证明本局关掉屏幕，因此不配。'),
  define('hundred-times','杠杆把心跳放大','实际持有 100× 仓位经历一次行情变化。','100','借原作杠杆放大心跳的主题，100×门槛为游戏设计；不使用带原作10枚/固定金额的账单。'),
  define('father-funds','柜子里的三百万','实际取用父亲的 ¥3,000,000 存款。','柜','家庭资金梗的游戏改编；现有审核图未证明本局取用300万，不强配。'),
  define('tell-everything','今晚把事情说清楚','实际向朋友披露欠款，或在父亲发现前主动归还一笔。','话','本作加入实际披露与还款；没有准确对应的原作完成截图。'),
  define('fully-repaid','三百万，一分不少','取用父亲的柜中存款后，将欠款全部归还。','还','归还三百万是游戏账本中的实际行为；不是原作既成事实，没有对应完成图。'),
  define('accept-stop','不顾一切，进行止损！','实际执行一次止损平仓。','止','原作第 4 话第 2 页的止损决心，由游戏真实止损成交践行。'),
  define('mochiko-warning','萌智子帮忙盯盘','实际使用萌智子的盯盘保护。','萌','萌智子保护及爆仓减免为游戏设计；现有审核素材没有精确对应截图。'),
  define('profit-receipt','利润换成热饭','赚到第一笔利润后，点一份外卖。','饭','真实盈利后点外卖是本作设计；现有审核素材没有对应热饭截图。'),
  define('saved-at-last','手还在发抖','一笔曾接近强平的仓位最终净盈利平仓。','救','呼应原作第5话第23页落袋后发抖；近强平后盈利的精确触发是本作改写，不能据原图推断。'),
  define('walkaway','屏幕之外还有明天','完成主动离场结局。','休','主动离场为本作原创结局；不把原作爆仓或暂停画面当成主动退休。'),
  define('twenty-million','妈妈……我赚到钱了……','正常游戏中，累计已实现交易净利润达到 ¥20,000,000；扣交易费用，不含借款、浮盈或账户本金。','2000','游戏自拟标题，呼应原作第 1 话第 11 页赚回两千万的目标；不是原作兑现台词。',20000000)
]);
const finite = (n, fallback=0) => Number.isFinite(n) ? n : fallback;
const positions = s => Array.isArray(s.positions) ? s.positions : s.position ? [s.position] : [];
const closed = s => (s.history || []).filter(t => t.type !== 'open' && Number.isFinite(t.pnl));
const pnl = (s,p) => finite(p.unrealized,finite(grossPnlAt(p,s.price)));
function evidence(s) {
  const trades=closed(s), active=positions(s), realized=Number.isFinite(s.performance?.totalProfit)&&s.performance.closedTrades>0?s.performance.totalProfit:trades.reduce((sum,t)=>sum+t.pnl,0);
  return {
    'first-profit':trades.some(t=>t.pnl>0)?1:0,
    'million-thirty':Math.max(0,realized),
    'liquidated':trades.some(t=>t.type==='liquidation')?1:0,
    'hold-loss':s.pending?.action==='hold'&&s.pending.candle>=1&&active.some(p=>p.margin>0&&pnl(s,p)<=-p.margin*.25)?1:0,
    'hundred-times':s.phase==='playing'&&(s.pending?.candle>0||s.pending?.tick>0)&&active.some(p=>p.leverage===100)?1:0,
    'father-funds':s.fatherUsed&&s.family?.takenConfirmed?1:0,
    'tell-everything':s.disclosures?.debt||s.family?.repaid>0&&s.family?.informed&&!s.family?.discovered?1:0,
    'fully-repaid':s.fatherUsed&&s.family?.repaid>=3000000&&finite(s.family?.outstanding)===0?1:0,
    'accept-stop':trades.some(t=>t.type==='stop')?1:0,
    'mochiko-warning':s.itemsUsed?.mochiko||s.skills?.mochiko?1:0,
    'profit-receipt':(s.itemsUsed?.takeaway&&realized>0)||trades.some(t=>t.type==='receipt'&&t.pnl>0)?1:0,
    'saved-at-last':trades.some(t=>t.pnl>0&&(t.nearMiss||t.minUnrealized<=-t.margin*.65))?1:0,
    'walkaway':s.phase==='ending'&&s.ending?.id==='walkaway'?1:0,
    'twenty-million':Math.max(0,realized)
  };
}
export function normalizeAchievementProfile(profile={}) {
  const unlocked={};
  for(const def of ACHIEVEMENTS){const entry=profile?.unlocked?.[def.id];if(entry&&Number.isFinite(entry.at)&&entry.at>=0)unlocked[def.id]={at:entry.at,day:Math.max(1,Math.floor(finite(entry.day,1))),...(def.id==='twenty-million'&&entry.ruleVersion===2?{ruleVersion:2}:{})};}
  return {version:1,unlocked};
}
export function achievementProgress(state={},profile={}) {
  const saved=normalizeAchievementProfile(profile), values=(state.developmentTaint||state.developer?.edited)?{}:evidence(state);
  return ACHIEVEMENTS.map(def=>({...def,unlocked:!!saved.unlocked[def.id],unlockedAt:saved.unlocked[def.id]?.at,legacyUnlocked:def.id==='twenty-million'&&!!saved.unlocked[def.id]&&saved.unlocked[def.id].ruleVersion!==2,
    progress:Math.max(0,Math.min(def.goal,finite(values[def.id])))}));
}
export function evaluateAchievements(state,profile={}, {now=Date.now()}={}) {
  const saved=normalizeAchievementProfile(profile), newlyUnlocked=[];
  if(state?.developmentTaint||state?.developer?.edited)return {profile:saved,newlyUnlocked};
  for(const def of achievementProgress(state,saved))if(!def.unlocked&&def.progress>=def.goal){
    saved.unlocked[def.id]={at:finite(now,Date.now()),day:Math.max(1,Math.floor(finite(state.day,1))),...(def.id==='twenty-million'?{ruleVersion:2}:{})};
    newlyUnlocked.push(ACHIEVEMENTS.find(a=>a.id===def.id));
  }
  return {profile:saved,newlyUnlocked};
}
const UI_STYLES=`
.fx-ach-host{position:fixed;right:24px;bottom:24px;z-index:1100;pointer-events:none;max-width:calc(100vw - 32px)}
.fx-ach-toast{width:340px;max-width:100%;box-sizing:border-box;display:grid;grid-template-columns:52px 1fr 24px;gap:12px;padding:16px;background:linear-gradient(115deg,#24303a,#151e25);color:#f5f7f9;border:1px solid #617481;border-top:3px solid #a4c967;box-shadow:0 8px 30px #0007;border-radius:5px;pointer-events:auto;font:14px/1.45 system-ui,sans-serif;animation:fx-ach-enter .28s ease-out}
.fx-ach-badge{display:grid;place-items:center;width:48px;height:48px;background:#344743;border:1px solid #7d9b70;color:#c4e18e;border-radius:4px;font-weight:800;font-size:18px}
.fx-ach-label{font-size:11px;color:#b5ca99;letter-spacing:.08em}.fx-ach-name{font-weight:750;font-size:16px;margin:3px 0}.fx-ach-copy{font-size:12px;color:#c5cfd6}.fx-ach-close{color:#bfcbd1;border:0;background:none;cursor:pointer;font-size:20px;align-self:start;padding:0;min-width:24px;min-height:24px}
.fx-ach-manga{grid-column:1/-1;min-width:0;font-size:12px;line-height:1.6}.fx-ach-manga summary{cursor:pointer}.fx-ach-source-image{display:block;width:100%;max-width:580px;height:auto;margin:10px auto}.fx-ach-manga a{color:inherit}.fx-ach-book{display:grid;gap:12px}.fx-ach-entry{display:grid;grid-template-columns:52px 1fr;gap:12px;padding:14px;background:#18232b;color:#eaf0f4;border:1px solid #4a5d69;border-radius:5px}.fx-ach-entry.locked{background:#eff0f0;color:#46545e;border-color:#c2c9ce}.fx-ach-entry.locked .fx-ach-badge{background:#d3d8da;border-color:#a0aaaf;color:#667780}.fx-ach-entry .fx-ach-copy{color:inherit;opacity:.82}.fx-ach-meta{display:block;font-size:11px;margin-top:6px;opacity:.7}.fx-ach-hint{font-size:11px;margin-top:5px;opacity:.65}
@keyframes fx-ach-enter{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@media(max-width:640px){.fx-ach-host{right:16px;bottom:calc(96px + env(safe-area-inset-bottom,0px))}.fx-ach-toast{width:310px;padding:12px;gap:9px}}
@media(prefers-reduced-motion:reduce){.fx-ach-toast{animation:none}}
`;
const queues=new WeakMap();
function styles(doc){if(doc.getElementById('fx-ach-style'))return;const css=doc.createElement('style');css.id='fx-ach-style';css.textContent=UI_STYLES;doc.head.append(css);}
function el(doc,tag,className,text){const node=doc.createElement(tag);node.className=className;if(text!==undefined)node.textContent=text;return node;}
export function createAchievementToast(def,{document:doc=globalThis.document,duration=5500}={}) {
  if(!doc?.body||!def)return;
  styles(doc);let q=queues.get(doc);if(!q){const host=el(doc,'div','fx-ach-host');host.setAttribute('aria-live','polite');host.setAttribute('aria-atomic','true');doc.body.append(host);q={host,items:[],active:null};queues.set(doc,q);}
  q.items.push({def,duration:Math.max(1500,finite(duration,5500))});
  const show=()=>{if(q.active||!q.items.length)return;const item=q.items.shift(), toast=el(doc,'div','fx-ach-toast');
    toast.append(el(doc,'span','fx-ach-badge',item.def.badge));const content=el(doc,'div','fx-ach-content');content.append(el(doc,'div','fx-ach-label','成就已解锁'),el(doc,'div','fx-ach-name',item.def.name),el(doc,'div','fx-ach-copy',item.def.description));toast.append(content);
    const close=el(doc,'button','fx-ach-close','×');close.type='button';close.setAttribute('aria-label','关闭成就提示');toast.append(close);q.active=toast;
    let timer;const dismiss=()=>{if(q.active!==toast)return;clearTimeout(timer);toast.remove();q.active=null;setTimeout(show,200);};close.addEventListener('click',dismiss);q.host.append(toast);timer=setTimeout(dismiss,item.duration);
  };show();
}
export function renderAchievementBook(container,profile={},state={}) {
  const doc=container.ownerDocument;styles(doc);container.replaceChildren();container.classList.add('fx-ach-book');
  for(const def of achievementProgress(state,profile)){
    const card=el(doc,'article','fx-ach-entry'+(def.unlocked?'':' locked'));card.append(el(doc,'span','fx-ach-badge',def.unlocked?def.badge:'锁'));
    const text=el(doc,'div','fx-ach-content');text.append(el(doc,'div','fx-ach-name',def.name),el(doc,'div','fx-ach-copy',def.description));
    const status=def.unlocked?`已解锁 · ${new Date(def.unlockedAt).toLocaleDateString('zh-CN')}`:def.goal>1?`未解锁 · ${Math.floor(def.progress).toLocaleString('zh-CN')} / ${def.goal.toLocaleString('zh-CN')}`:'未解锁';
    if(def.legacyUnlocked)text.append(el(doc,'small','fx-ach-meta','旧版已解锁记录保留；未重新计算当时账单，新规则仅用于今后的解锁。'));
    text.append(el(doc,'small','fx-ach-meta',status),el(doc,'div','fx-ach-hint',def.sourceNote));card.append(text);const source=achievementManga(def.id);if(source){const details=el(doc,'details','fx-ach-manga'),summary=el(doc,'summary','',`原作梗 · 第 ${source.panel.chapter} 话第 ${source.panel.page} 页`),image=el(doc,'img','fx-ach-source-image');setMangaImage(image,source.panel.original);image.alt=`原作参考 · ${source.panel.character} · ${source.panel.meaning}`;image.loading='lazy';const link=el(doc,'a','','固定版本原图 ↗');link.href=source.panel.sourceURL;link.target='_blank';link.rel='noopener';details.append(summary,el(doc,'p','fx-ach-copy',source.note),image,link);card.append(details);}container.append(card);
  }
}
