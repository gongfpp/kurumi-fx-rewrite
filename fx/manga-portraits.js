import {MANGA_PANELS} from './manga-panels.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {positionsOf,positionUnrealized,positionNetUnrealized,mood} from './engine.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {setMangaImage} from './manga-images.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {sealedDailyMangaOutcome,selectDailyManga} from './manga-context.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';

// Rules refer to actual account exposure, never the direction of the market
// alone. Canonical labels are retained in the catalogue; corrected semantics
// are explicit here. No random selection and no market RNG consumption.
export function selectMangaPortrait(state, {maxChapter=Infinity,maxPage=Infinity,catalog=MANGA_PANELS,emotion}={}) {
  const validCrop=p=>{const c=p?.cropPixels,z=p?.imageSize;return Array.isArray(c)&&c.length===4&&c.every(Number.isFinite)&&Array.isArray(z)&&z.length===2&&z.every(n=>Number.isFinite(n)&&n>0)&&c[0]>=0&&c[1]>=0&&c[2]>c[0]&&c[3]>c[1]&&c[2]<=z[0]&&c[3]<=z[1];};
  const available=id=>{const p=catalog[id];return p?.character==='久留美'&&Number.isInteger(p.chapter)&&Number.isInteger(p.page)&&p.chapter<=maxChapter&&(p.chapter<maxChapter||p.page<=maxPage)&&p.sourceCommit&&p.sha256&&p.original&&validCrop(p)?p:null;};
  if(!state||!Array.isArray(state.recent))return null;
  const orders=positionsOf(state),last=state.lastTrade,em=emotion||mood(state);
  const daily=sealedDailyMangaOutcome(state);
  if(daily&&daily.kind!=='profit'&&['hopeful','ecstatic','smug','relieved','warm'].includes(em))return null;
  const daySupportsProfit=!daily||selectDailyManga(state).cards.some(c=>c.scope==='sealed-day'&&c.panel.id==='profit');
  const modern=orders.every(p=>p.pnlModel!=='legacy-inverse-v5');
  const shorts=modern&&orders.length>0&&orders.every(p=>p.direction===-1),longs=modern&&orders.length>0&&orders.every(p=>p.direction===1);
  const pnl=orders.reduce((sum,p)=>sum+positionUnrealized(state,p),0),net=orders.reduce((sum,p)=>sum+positionNetUnrealized(state,p),0);
  const recent=!!last&&Number.isInteger(last.day)&&Number.isInteger(last.beat)&&last.day===state.day&&last.beat===state.beat;
  const reversal=state.lastReaction?.day===state.day&&state.lastReaction?.reversal==='profit-to-loss'&&state.lastReaction?.direction===1&&orders.some(p=>p.id===state.lastReaction.positionId);
  const closedNow=(state.history||[]).filter(t=>t.day===state.day&&t.beat===state.beat&&t.type!=='open'&&Number.isFinite(t.pnl));
  const cleanShortClose=closedNow.length>0&&closedNow.every(t=>t.direction===-1&&t.pnl>0&&t.pnlModel!=='legacy-inverse-v5');
  let id=null,reason='';
  if(!orders.length&&em==='hopeful'){id='ready';reason='当前期待入场；尚无未结算仓位。';}
  else if(['calm','focused','determined'].includes(em)&&(!orders.length||modern)){
    id=longs&&net>0?'calm':'rule';reason=id==='calm'?'多单仍有净浮盈，当前保持谨慎；不表示已经落袋。':'当前保持冷静，借原作“无必胜法”的表情对照，不宣称漫画里的交易已在本局发生。';
  }
  else if(!orders.length&&recent&&last.type!=='open'&&last.pnl>0&&em==='ecstatic'&&last.direction===-1&&cleanShortClose&&daySupportsProfit){id='profit';reason='空单净盈利已实际平仓，当前情绪为狂喜；原图金额不用于本局。';}
  else if(shorts&&recent&&last.type==='open'&&Math.abs(pnl)<.005&&em==='smug'){id='short-entry';reason='刚卖出建空且当前得意，尚未平仓。';}
  else if(shorts&&net>0&&['nervous','anxious'].includes(em)){id='leverage';reason='空单净浮盈伴随杠杆紧张；浮盈尚未落袋。';}
  else if(shorts&&orders.every(p=>positionNetUnrealized(state,p)>0)&&['nervous','stunned','anxious'].includes(em)&&orders.some(p=>p.maxUnrealized>0&&positionUnrealized(state,p)<p.maxUnrealized-.005)){id='retreat';reason='空单净浮盈回落，当前惊慌；原作此时手动退出，后页确认盈利，不表示本局已平仓。';}
  else if(longs&&net>0&&em==='ecstatic'){id='long-profit';reason='多单当前净浮盈并感到狂喜；只取表情，不采用原作澳元金额。';}
  else if(longs&&pnl<0&&reversal&&['stunned','regretful','anxious','profit-to-loss'].includes(em)){id='long-loss';reason='本局多单有已记录的浮盈转亏，当前错愕；尚未平仓。';}
  else if(longs&&pnl<0&&['anxious','nervous'].includes(em)){id='stop-loss-uneasy';reason='多单仍有浮亏，当前犹疑紧张；漫画是在考虑止损，并未证明已经执行。';}
  else if(longs&&pnl<0&&em==='despair'&&orders.some(p=>positionNetUnrealized(state,p)<=-p.margin*.25)){id='despair';reason='本局多单大幅浮亏且当前绝望，匹配原作持仓中崩溃表情。';}
  const panel=id&&available(id);return panel?{panel,reason,emotion:em}:null;
}

// Crop only the viewport. Original bytes and their fixed manga account values
// remain intact in the explicit source-reference view.
export function showMangaPortrait(image,panel,{loading='eager'}={}) {
  if(!panel)return false;
  setMangaImage(image,panel.original,{loading});
  const [x0,y0,x1,y1]=panel.cropPixels,[width,height]=panel.imageSize;
  const cw=x1-x0,ch=y1-y0;
  image.style.cssText=`position:absolute;width:${width/cw*100}%;height:auto;max-width:none;left:0;top:0;transform:translate(${-x0/width*100}%,${-y0/height*100}%);object-fit:initial;`;
  image.parentElement.style.aspectRatio=`${cw} / ${ch}`;
  image.parentElement.classList.add('manga-viewport');
  image.alt=`久留美 · ${panel.expression} · 原作第${panel.chapter}话第${panel.page}页表情裁切`;
  return true;
}
