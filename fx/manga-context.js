import {RESTRAINT_MANGA_ASSETS} from './contextual-manga-restraint-content.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {MANGA_PANELS} from './manga-panels.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';

// Card matching is intentionally independent of the portrait's emotion rules.
// An illustration is evidence for a scene, never the ledger for this account.
export const MANGA_BOUNDARY='游戏 IF 对照：台词与账单写的是本局；漫画取自原作情境。原图的金额、汇率、手数与时间不代表本局。';
const number=n=>Number.isFinite(n);
const yen=n=>`${n<0?'−':n>0?'+':''}¥${Math.abs(n).toLocaleString('zh-CN',{maximumFractionDigits:2})}`;
export const CARD_CROPS=Object.freeze({profit:[0,0,445,371],rule:[0,0,741,332],ready:[0,0,809,540],'short-entry':[0,0,809,405],retreat:[0,0,744,587]});
export function verifiedPanel(id,{catalog=MANGA_PANELS,maxChapter=Infinity,maxPage=Infinity}={}){
 const p=catalog[id];if(!p||!Number.isInteger(p.chapter)||!Number.isInteger(p.page)||p.chapter>maxChapter||(p.chapter===maxChapter&&p.page>maxPage)||!p.sourceCommit||!p.sourceURL||!p.sha256||!p.original)return null;
 return p;
}
const missing=(reason,facts=[])=>({status:'unmatched',cards:[],reason,facts,boundary:MANGA_BOUNDARY});
const matched=(id,reason,facts,options={})=>{const panel=verifiedPanel(id,options);return panel?{status:'matched',cards:[{panel,crop:CARD_CROPS[id]||null,reason}],reason,facts,boundary:MANGA_BOUNDARY}:missing('已找到语境，但缺少可核验的本地原图。',facts);};
// Event IDs alone do not establish facts: guards also inspect the account.
export function selectNarrativeManga(state,{kind='event',event=null,index=0,catalog=MANGA_PANELS}={}){
 if(kind==='opening'){
  if(index===0)return matched('family-loss','原作第 1 话：母亲造成的家庭亏损。',['原作背景 · 家庭亏损两千万日元。'],{catalog});
  if(index===1)return matched('recovery-vow','原作第 1 话：想把家中的亏损赚回来。',['原作背景 · 久留美的入场动机。'],{catalog});
  return matched('ready','正式入场的觉悟；本局本金另按游戏规则。',['本局采用十万日元开局，是游戏改编；原作首单本金三十万。'],{catalog});
 }
 if(kind==='ending'&&state.phase==='ending'&&state.ending?.id==='walkaway'&&!state.positions?.length&&!state.position){
  const asset=RESTRAINT_MANGA_ASSETS[105];
  return {status:'matched',cards:[{panel:{id:'kurumi-pauses-fx',character:'久留美与芽吹',chapter:8,page:28,original:asset.path,sha256:asset.sha256,imageSize:asset.dimensions,sourceRecord:105,sourceCommit:"b37bbf7efe7caa05621946879dcd8e4ada56ae59",sourceURL:"https://github.com/gongfpp/manga-panel-extractor/blob/b37bbf7efe7caa05621946879dcd8e4ada56ae59/memes/%E8%8A%BD%E5%90%B9_%E5%89%B2%E8%82%89%E7%A6%BB%E5%9C%BA_%E6%95%99%E5%AE%A4_%E7%A9%BA%E6%B4%9E%E7%9C%BC_%E6%94%BE%E6%A3%84FX%E4%BA%86.jpg",sourceBlob:"eb8dca746a8beb6b6690b2a64cd07d6b886c0e92",context:'原作暂时收手；后续仍有重新入金，不代表永久退出或玩家账户归零。'},crop:null,reason:'久留美曾表示放弃 FX；此处对应玩家主动结束这一局。'}],reason:'主动离场',facts:[],boundary:MANGA_BOUNDARY};
 }
 if(kind==='ending')return missing('这个结局由本局选择产生；素材中没有与全部结果一致的原作结局，不用别的结局代替。');
 return missing(event?.key?.startsWith('repay')?'原作素材没有可核验的本次还款画面；以实际还款记录为准。':'当前人物对话没有精确对应的原作画面，保留对话与旁白。');
}
// Final daily presentation is anchored only to the sealed dayReport.net.
// Cumulative performance and intraday reversals never redefine this outcome.
export function sealedDailyMangaOutcome(state){
 const r=state?.dayReport,positions=Array.isArray(state?.positions)?state.positions:state?.position?[state.position]:[];
 if(!r||r.day!==state.day||!Number.isInteger(r.day)||!number(r.net)||positions.length||!['day_end','resting','ending'].includes(state.phase))return null;
 const kind=r.net<0?'loss':r.net>0?'profit':'flat';
 return {scope:'sealed-day',source:'dayReport.net',day:r.day,net:r.net,kind,label:kind==='loss'?'今日交易亏损':kind==='profit'?'今日交易盈利':'今日交易持平'};
}
export function selectDailyManga(state,options={}){
 const selection=selectDailyMangaCore(state,options),outcome=sealedDailyMangaOutcome(state);
 return {...selection,outcome,cards:selection.cards.map(card=>({...card,scope:card.panel.id==='long-loss'?'intraday':'sealed-day'}))};
}
function selectDailyMangaCore(state,{catalog=MANGA_PANELS}={}){
 const r=state.dayReport;if(!r||!Number.isInteger(r.day)||!number(r.net))return missing('缺少完整当日结算，不能推断今日漫画。');
 if(r.day!==state.day)return missing('这份日报不是当前交易日，保留原账单，不复用为今日漫画。');
 const current=(Array.isArray(state.positions)?state.positions:state.position?[state.position]:[]);
 if(current.length||!['day_end','resting','ending'].includes(state.phase))return missing('账户仍在盘中或有持仓；浮动盈亏不能当成今日已实现结果。');
 const all=(r.trades||[]).filter(t=>t.day===r.day&&t.type!=='open');
 const trades=all.filter(t=>number(t.pnl)&&number(t.entry)&&number(t.exit)&&(t.direction===1||t.direction===-1));
 const pnl=trades.reduce((sum,t)=>sum+t.pnl,0);
 const facts=[`第 ${r.day} 天已平仓 ${trades.length} 笔，逐笔净盈亏合计 ${yen(pnl)}。`,`今日交易净变化 ${yen(r.net)}；生活费、借款和未实现浮盈不充作盈利。`];
 if(all.length!==trades.length)return missing('当日成交记录缺少可验证字段，不据余额猜测原作情节。',facts);
 if(!trades.length)return missing('今日没有已平仓成交，不配盈利、亏损或爆仓漫画。',facts);
 if(trades.some(t=>t.pnlModel==='legacy-inverse-v5'))return missing('旧合约结算保持原账务；不套用新版方向对应漫画。',facts);
 const shortOnly=trades.every(t=>t.direction===-1),longOnly=trades.every(t=>t.direction===1);
 if(!shortOnly&&!longOnly)return missing('今日同时有多单和空单，单一方向漫画不能概括这份账单。',facts);
 const reversal=(r.moments||[]).find(m=>m.day===r.day&&m.reversal==='profit-to-loss'&&m.direction===1&&m.pnl<0&&trades.some(t=>t.positionId===m.positionId));
 if(longOnly&&pnl<0&&r.net<0&&trades.every(t=>t.pnl<0)&&reversal)return matched('long-loss','盘中多单曾从浮盈转为浮亏（当日事件记录）；今日最终平仓结果另列。',[...facts,'漫画对应盘中“盈利哪里去了”的错愕，不把当时浮亏当作最终账单。'],{catalog});
 // A positive balance, borrowing, one winning trade, or gross profit is insufficient.
 if(shortOnly&&pnl>0&&r.net>0&&(r.mood==='ecstatic'||r.net>=Math.max(1,r.opening*.07))&&trades.every(t=>t.pnl>0&&t.exit<t.entry))return matched('profit','美元空单已经平仓且每笔、全日净结果均盈利；原作第 1 话的“确定盈利”。',facts,{catalog});
 return missing(shortOnly?'今日空单结果与原作首单止盈不一致；不把原作“反弹撤退”误写为本局亏损。':'现有已审核漫画没有对应这份美元多单结算；不拿澳元或其他人物的结果冒充。',facts);
}
