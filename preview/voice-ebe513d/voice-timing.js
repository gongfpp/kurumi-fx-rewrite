import {tradingTrauma} from './trading-trauma.js?v=ebe513d153a1219d73a65051f32fb508afce547c-capture-v1-1fbef814f493';
// Commentary follows observed/settled P&L. This gate never changes the market.
export const VOICE_STABLE_MS=2500;
export const VOICE_REVERSAL_MS=3500;
export const pnlDirection=value=>Number.isFinite(value)&&Math.abs(value)>=1?Math.sign(value):0;

export class VoiceTimingGate {
  constructor({stableMs=VOICE_STABLE_MS,reversalMs=VOICE_REVERSAL_MS}={}){this.stableMs=stableMs;this.reversalMs=reversalMs;this.current=null;this.revision=0;}
  observe(context,now){
    const session=`${context.run}:${context.mode}`,direction=pnlDirection(context.pnl),key=String(context.eventKey||'market');
    const previous=this.current,changed=!previous||previous.session!==session||previous.direction!==direction||previous.key!==key||previous.scope!==context.scope||previous.eventKind!==context.eventKind;
    if(changed){
      const reversed=previous&&previous.session===session&&previous.direction&&direction&&previous.direction!==direction;
      this.current={session,direction,key,revision:++this.revision,since:now,readyAt:now+(context.settled?0:reversed?this.reversalMs:this.stableMs)};
    }
    Object.assign(this.current,context,{session,direction,pnl:Number.isFinite(context.pnl)?context.pnl:0,stableForMs:Math.max(0,now-this.current.since),observedAt:now});
    return this.token(now);
  }
  token(now){return this.current&&now>=this.current.readyAt?{...this.current,stableForMs:Math.max(0,now-this.current.since),eventAgeMs:(this.current.eventAgeMs||0)+Math.max(0,now-this.current.observedAt)}:null;}
  manualToken(now){return this.current?{...this.current,stableForMs:Math.max(0,now-this.current.since),eventAgeMs:(this.current.eventAgeMs||0)+Math.max(0,now-this.current.observedAt)}:null;}
  valid(token){return !!token&&!!this.current&&token.revision===this.current.revision&&token.session===this.current.session&&token.direction===this.current.direction;}
}

// Saved old trades are not new events. A live confirmed close has an eight-second
// review window, but configuration only lets a new voice start near the event.
export function createVoiceContextSelector({now=()=>Date.now()}={}){
  let session=null,lastClose=null,closeAt=-Infinity,dayKey=null,dayAt=0;
  return (state,{floating=0,hasPositions=false}={})=>{
    const nextSession=`${state.mode}:${state.runId}`,time=now(),first=session!==nextSession;
    if(first){session=nextSession;lastClose=null;closeAt=-Infinity;dayKey=null;}
    const positions=state.positions||[],directions=new Set(positions.map(p=>p.direction));
    const positionDirection=!hasPositions?'flat':directions.size>1?'mixed':directions.has(-1)?'short':'long';
    const latest=state.recent?.[0],volatility=Math.abs(latest?.observedMove||0)>=.004||state.lastEvent?.swan?'spike':'normal';
    const trauma=tradingTrauma(state);
    const base={run:state.runId,mode:state.mode,hasPositions,positionDirection,volatility,suppressCommentary:trauma.active,traumaLevel:trauma.level||null};
    const trade=state.lastTrade,closed=trade&&trade.type!=='open'&&trade.day===state.day&&Number.isFinite(trade.pnl);
    const closeKey=closed?`close:${trade.day}:${trade.beat}:${trade.positionId}:${trade.type}:${trade.pnl}:${trade.margin}:${state.performance?.closedTrades}`:null;
    if(closeKey!==lastClose){lastClose=closeKey;closeAt=first?-Infinity:time;}
    const report=state.dayReport;
    if(['day_end','resting','ending'].includes(state.phase)&&report?.day===state.day){
      const key=`day:${report.day}`;if(dayKey!==key){dayKey=key;dayAt=time;}
      const reversal=report.net<0&&report.moments?.some(m=>m.reversal==='profit-to-loss');
      return {...base,scope:'settlement',pnl:report.net,eventKey:key,eventKind:reversal?'profit-to-loss':'day-settled',settled:true,eventAgeMs:time-dayAt};
    }
    if(closed&&!hasPositions&&time-closeAt<8000){
      return {...base,scope:'realized',pnl:trade.pnl,eventKey:closeKey,eventKind:trade.pnl<0&&trade.maxUnrealized>1?'profit-to-loss':'position-closed',settled:true,eventAgeMs:time-closeAt};
    }
    if(hasPositions){
      const reaction=state.lastReaction,verified=reaction?.day===state.day&&reaction.positionId&&positions.some(p=>p.id===reaction.positionId);
      const eventKind=verified&&reaction.reversal?reaction.reversal:'position-floating';
      return {...base,scope:'floating',pnl:floating,eventKey:`floating:${state.day}:${positions.map(p=>p.id).join(',')}`,eventKind,settled:false,eventAgeMs:0};
    }
    // A market needle with no position changes no player P&L, even if today's
    // old realized ledger is negative or a portrait looks shocked/regretful.
    return {...base,scope:'market',pnl:0,eventKey:`market:${state.day}`,eventKind:volatility==='spike'?'market-spike':'market-watch',settled:false,eventAgeMs:0};
  };
}
