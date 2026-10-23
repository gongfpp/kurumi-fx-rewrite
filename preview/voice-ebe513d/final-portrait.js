import {tradingTrauma} from './trading-trauma.js?v=ebe513d153a1219d73a65051f32fb508afce547c-capture-v1-1fbef814f493';
import {GENERATED_EXTREME_EXPRESSIONS} from './generated-emotion-assets.js?v=ebe513d153a1219d73a65051f32fb508afce547c-capture-v1-1fbef814f493';
import {positionNetUnrealized,mood} from './engine.js?v=ebe513d153a1219d73a65051f32fb508afce547c-capture-v1-1fbef814f493';
import {pressureMood} from './emotion-pressure.js?v=ebe513d153a1219d73a65051f32fb508afce547c-capture-v1-1fbef814f493';
import {MOODS} from './content.js?v=ebe513d153a1219d73a65051f32fb508afce547c-capture-v1-1fbef814f493';
import {floatingReactionSnapshot} from './floating-reaction.js?v=ebe513d153a1219d73a65051f32fb508afce547c-capture-v1-1fbef814f493';

const generated=(path,emotion,label,scope,evidence)=>({kind:'generated',path,emotion,label,scope,evidence,sourceLabel:'原创同人',origin:'generated-game-art'});
const plain=(emotion,scope,evidence)=>generated(`./expressions/kurumi-${MOODS[emotion]?.[1]||'calm'}.webp`,emotion,MOODS[emotion]?.[0]||'平静',scope,evidence);
const art=(key,emotion,label,scope,evidence)=>generated(GENERATED_EXTREME_EXPRESSIONS[key].path,emotion,label,scope,evidence);

// Character portraits use authored fan-art only. Story panels keep their own
// exact narrative matcher elsewhere; a panel cannot become the avatar.
export function selectFinalPortrait(state,{sealedOutcome=null,floatingReaction=null}={}){
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
  return {...market,line:'先看看行情……'};
}
