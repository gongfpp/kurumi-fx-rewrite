import {positionNetUnrealized} from './engine.js?v=ebe513d153a1219d73a65051f32fb508afce547c-capture-v1-1fbef814f493';

// Presentation-only: aggregate the unchanged positions' net mark-to-market.
// Account cash, borrowed funds, deposits and withdrawals are never profit signals.
const lines=Object.freeze({
 surprise:'欸？！浮盈一下这么多？！',
 ecstatic:'这么多浮盈……真的？！',
 smug:'有浮盈了……！',
 anxious:'怎么还在亏……',
 stunned:'刚才还赚着呢……',
 focused:'一会儿红一会儿绿的……'
});
function snapshot(state){
 const positions=Array.isArray(state.positions)?state.positions:state.position?[state.position]:[];
 if(!positions.length||state.phase!=='playing')return null;
 const key=`${state.runId}:${state.mode}:${state.day}:`+positions.map(p=>`${p.id}:${p.direction}:${p.entry}:${p.notional??p.margin*p.leverage}`).sort().join('|');
 const net=positions.reduce((sum,p)=>sum+positionNetUnrealized(state,p),0);
 if(!Number.isFinite(net))return null;
 const principal=Math.max(1000,state.startEquity||100000),notional=positions.reduce((sum,p)=>sum+(p.notional??p.margin*p.leverage??0),0);
 const band=Math.max(50,notional*.00003),major=Math.max(2500,principal*.05),large=Math.max(5000,principal*.1);
 return {key,net,band,major,large};
}
function presentation(s,emotion,extra={}){
 return {emotion,label:emotion==='stunned'&&extra.surprise?'惊喜':undefined,line:lines[extra.surprise?'surprise':emotion],evidence:{net:s.net,source:'positions.netUnrealized',...extra}};
}
export function floatingReactionSnapshot(state){
 const s=snapshot(state);if(!s)return null;
 return presentation(s,s.net>=s.large?'ecstatic':s.net>s.band?'smug':s.net<-s.band?'anxious':'focused');
}
export function createFloatingReaction({now=()=>Date.now(),settleMs=1000,surpriseMs=850}={}){
 let previous=null,pending=null,current=null,surprise=null;
 return {reset(){previous=null;pending=null;current=null;surprise=null;},observe(state){
  const s=snapshot(state),time=now();
  if(!s){this.reset();return null;}
  const fresh=!previous||previous.key!==s.key;
  const delta=fresh?0:s.net-previous.net;
  const wanted=s.net>=s.large?'ecstatic':s.net>s.band?'smug':s.net<-s.band?'anxious':'focused';
  if(fresh){pending=null;surprise=null;current=wanted;}
  // True large changes bypass the ordinary flicker delay, in either direction.
  if(!fresh&&delta>=s.major&&s.net>=s.major){surprise={until:time+surpriseMs,delta};current='stunned';pending=null;}
  else if(!fresh&&delta<=-s.major&&s.net<-s.band){surprise=null;current=previous.net>s.band?'stunned':'anxious';pending=null;}
  else if(surprise&&s.net<=s.band){surprise=null;current='focused';pending=null;}
  if(surprise&&time>=surprise.until){surprise=null;current=wanted;pending=null;}
  if(!surprise&&wanted!==current){
   const opposite=(['ecstatic','smug'].includes(current)&&s.net<=s.band)||(['anxious','stunned'].includes(current)&&s.net>=-s.band);
   if(opposite)current='focused';
   if(!pending||pending.emotion!==wanted)pending={emotion:wanted,since:time};
   if(time-pending.since>=settleMs){current=wanted;pending=null;}
  }else if(!surprise)pending=null;
  previous=s;
  return presentation(s,current,{delta,...(surprise?{surprise:true,delta:surprise.delta}:{})});
 }};
}
