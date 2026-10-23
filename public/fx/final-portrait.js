import {tradingTrauma} from './trading-trauma.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {GENERATED_EXTREME_EXPRESSIONS} from './generated-emotion-assets.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {positionNetUnrealized,positionsOf,mood} from './engine.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {pressureMood} from './emotion-pressure.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {MOODS} from './content.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {floatingReactionSnapshot} from './floating-reaction.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {speechForEmotion} from './dialogue.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';

const generated=(path,emotion,label,scope,evidence)=>({kind:'generated',path,emotion,label,scope,evidence,sourceLabel:'原创同人',origin:'generated-game-art'});
const plain=(emotion,scope,evidence)=>generated(`./expressions/kurumi-${MOODS[emotion]?.[1]||'calm'}.webp`,emotion,MOODS[emotion]?.[0]||'平静',scope,evidence);
const art=(key,emotion,label,scope,evidence)=>generated(GENERATED_EXTREME_EXPRESSIONS[key].path,emotion,label,scope,evidence);

const tradeTypes=new Set(['open','half','close','rescue','stop','liquidation','closing']);
// Existing saves already retain filled-order evidence even after recent history
// is trimmed. Reading it avoids rewriting or guessing an older run's progress.
export function hasStartedPortraitTrading(state){
  return state.portraitTradingStarted===true||positionsOf(state).length>0||state.nextOrderId>1
    ||state.runStatistics?.executions>0||state.runStatistics?.closedOrders>0||state.performance?.closedTrades>0
    ||tradeTypes.has(state.lastTrade?.type)||(state.history||[]).some(t=>tradeTypes.has(t?.type))
    ||(state.feeLedger||[]).some(t=>['open','close'].includes(t?.side));
}
// Only a submitted trading instruction ends the initial portrait. Hovering,
// changing ticket settings, waiting and rejected progress guards do not submit.
export function markPortraitTradingAction(state,type){
  if(!['long','short','half','close'].includes(type))return false;
  state.portraitTradingStarted=true;return true;
}

function selectPortrait(state,{sealedOutcome=null,floatingReaction=null}={}){
  const sealed=sealedOutcome&&Number.isFinite(sealedOutcome.net)&&Number.isInteger(sealedOutcome.day)
    ?{...sealedOutcome,kind:sealedOutcome.net<0?'loss':sealedOutcome.net>0?'profit':'flat'}:null;
  const trauma=tradingTrauma(state),sameDay=!sealed||sealed.day===state.day;
  if(trauma.active&&sameDay)return art(trauma.art,trauma.mood,trauma.label,'trauma',{level:trauma.level,cap:trauma.cap});
  if(sealed){
    const report=state.dayReport?.day===sealed.day?state.dayReport:null,opening=Math.max(1,Number.isFinite(report?.opening)?report.opening:state.startEquity||100000);
    if(sealed.net<0){
      const start=Math.max(1,state.startEquity||100000),debt=report?.day===state.day?(state.family?.outstanding||0)+(state.loan?.outstanding||0):0;
      const principalIntact=Number.isFinite(report?.closing)&&report.closing-debt>=start;
      if(principalIntact)return plain('regretful','sealed-day',sealed);
      if(-sealed.net>=opening*.75&&Number.isFinite(report?.closing)&&report.closing<=Math.max(30000,opening*.2))return art('numb','numb','麻木','sealed-day',sealed);
      if(-sealed.net>=Math.max(5000,opening*.25))return art('tearfulStunned','trauma-frozen','恍惚','sealed-day',sealed);
      return plain('regretful','sealed-day',sealed);
    }
    if(sealed.net>0)return sealed.net>=Math.max(5000,opening*.1)?art('realizedWin','ecstatic','欣喜','sealed-day',sealed):plain('relieved','sealed-day',sealed);
    return plain('calm','sealed-day',sealed);
  }
  const orders=Array.isArray(state.positions)?state.positions:state.position?[state.position]:[];
  const natural=Array.isArray(state.recent)?mood(state):'calm';
  if(orders.length){
    const net=orders.reduce((sum,p)=>sum+positionNetUnrealized(state,p),0);
    const reaction=floatingReaction||floatingReactionSnapshot(state);
    if(reaction){const portrait=plain(reaction.emotion,'floating',reaction.evidence);return {...portrait,label:reaction.label||portrait.label,line:reaction.line};}
    return plain(net>0?'smug':net<0?'anxious':'focused','floating',{net});
  }
  const last=state.lastTrade;
  if(last&&last.type!=='open'&&last.day===state.day&&last.beat===state.beat&&Number.isFinite(last.pnl))
    return plain(last.pnl>0?'relieved':last.pnl<0?'regretful':'calm','realized',{net:last.pnl,positionId:last.positionId});
  const pressure=pressureMood(state);if(pressure)return plain(pressure,'pressure',{pressure:true});
  const market=plain(['calm','focused','determined','guilty','warm','lonely','exhausted'].includes(natural)?natural:'calm','market',{hasPositions:false});
  // The JPEG belongs only to the period before this run's first instruction.
  if(market.emotion==='calm'&&!hasStartedPortraitTrading(state))return {...market,kind:'user-image',path:'./expressions/kurumi-default-user.jpg',origin:'user-provided-image',sourceLabel:'用户指定人物图',preserveWholeImage:true,line:'先看看行情……'};
  return market;
}
export function selectFinalPortrait(state,options={}){
  const portrait=selectPortrait(state,options);
  return {...portrait,line:portrait.line??speechForEmotion(state,portrait.emotion)};
}
