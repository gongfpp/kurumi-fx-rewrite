import {MANGA_PANELS} from '../manga-panels.js?v=295e20358213d4ea13e57d98c0bfc3b6ffe341ec-23f2a20b7717';
import {storyUnrealized,storyReview} from './engine.js?v=295e20358213d4ea13e57d98c0bfc3b6ffe341ec-23f2a20b7717';
const scenes={
 opening:{page:40,kicker:'2014年2月14日',title:'先从三十万开始。',body:'20岁的久留美打开了 FX 账户。她要赚回家里失去的两千万日元。',fact:'原作锚点：第 1 话第 11、36、40 页。背景与本金按原作节点整理。',panel:'ready'},
 plan:{page:40,kicker:'下单之前',title:'“不存在必胜法。”',body:'下单前，先想好亏到哪里就走。',fact:'原作锚点：第 1 话第 38 页。止损选项是游戏改编，不冒充原作操作。',panel:'rule'},
 entry:{page:41,kicker:'第一笔 · USD/JPY',title:'美元还会跌吧？',body:'久留美想做空美元。你打算投多少？也可以先观望。',fact:'原作锚点：第 1 话第 41–42 页。此处只显示到第 41 页；下一格才会看到成交后的反应。',panel:null},
 first:{page:43,kicker:'价格动了',title:'价格动了。',body:'美元兑日元正在下跌。下一步怎么做？',fact:'原作锚点：第 1 话第 42–43 页：卖出建空后，开始感受到杠杆。'},
 temptation:{page:44,kicker:'下一格 · 还没结束',title:'就到这里，还是再等一点？',body:'又跌了一点。要不要再等？',fact:'原作锚点：第 1 话第 43–44 页。中间报价为本游戏教学路径。'},
 rebound:{page:44,kicker:'反弹时刻',title:'报价开始反弹。',body:'反弹来了。这时候，原作中的久留美选择了撤退。你呢？',fact:'原作锚点：第 1 话第 44 页。“撤退”是平掉空单，未必是已实现亏损。'},
 extension:{page:44,kicker:'IF · 继续持仓',title:'如果没有在那一刻走呢？',body:'报价继续反弹。还要继续等吗？',fact:'没有新增原作事实；本场景仅复用截至第 44 页已出现且与账户语境相符的表情。'},
 review:{page:46,kicker:'第 1 话 · 你的交易复盘',title:'这一笔，到这里。',body:'原作首单：做空 10 枚，反弹时平仓。你的账单也出来了。',fact:'原作第 45 页索引为 +24,000 日元；第 46 页账户为 324,200 日元。与 30 万本金存在 200 日元差异，现有索引没有解释，本作不补写。'}
};
export function mangaStoryScene(s){
 const base=scenes[s.stage],pnl=storyUnrealized(s);let id=base.panel;
 // Only use an approved, already revealed image whose account context fits.
 // The entry plan has no reviewed runtime image yet. Keep that scene textual.
 if(s.stage==='entry')id=null;
 if(!base.panel&&s.position?.direction===-1){
  id=s.stage==='rebound'?'retreat':pnl<0?'retreat':pnl>0?'leverage':'short-entry';
 }
 if(s.stage==='review'){
  const opening=s.ledger.find(x=>x.type==='open');
  id=s.realized>0&&opening?.direction===-1?'profit':s.realized===0?'rule':null;
 }
 const panel=id&&MANGA_PANELS[id];
 return {...base,panel:panel&&panel.page<=base.page?panel:null,review:storyReview(s)};
}
export const ADAPTATION_RULES='本章使用虚构报价，从 100.000 开始。1 枚 = 10,000 USD，固定 50× 杠杆，手续费、点差、利息均为 0。止损按触发价成交；真实市场可能滑点。IF 为游戏假设路线。';

// A fixed reading sequence, separate from the player's choices and account.
export const FIRST_TRADE_PAGES=Object.freeze([
 Object.freeze({panel:MANGA_PANELS['short-entry'],title:'卖出，等待买回',body:'久留美卖出了。她盯着下跌的价格，等着买回。'}),
 Object.freeze({panel:MANGA_PANELS.leverage,title:'第一次感受到杠杆',body:'手里握着十枚。汇率只动一点，盈亏就变得这么大。'}),
 Object.freeze({panel:MANGA_PANELS.retreat,title:'反弹，撤退',body:'价格反弹了。她赶紧点击，退出了这笔交易。'})
]);
