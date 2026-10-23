// Game-state consequences of verified CLOSED trading losses. These are game
// parameters, not a clinical scale. No balances, orders, rates or RNG are edited.
export const TRAUMA_POLICY=Object.freeze({version:1,hurtAt:40,crushedAt:70,numbAt:85,
  hurtCap:32,crushedCap:18,numbCap:8,survivalFloor:6,restRecovery:8,flatSegmentRecovery:2,
  painTicks:6,numbTicks:14});
const finite=(v,f=0)=>Number.isFinite(v)?v:f;
const clamp=(v,min=0,max=100)=>Math.max(min,Math.min(max,finite(v)));
const closed=s=>(s.history||[]).filter(t=>t.type!=='open'&&Number.isFinite(t.pnl));
const gameTick=s=>Math.max(0,Math.trunc(finite(s.completedCandles))*6+Math.trunc(finite(s.pending?.tick)));
const starting=s=>Math.max(1,finite(s.startEquity,100000));
const netResources=(s,assets)=>Math.max(0,finite(assets)-Math.max(0,finite(s.family?.outstanding))-Math.max(0,finite(s.loan?.outstanding)));

function ledger(s){
  const trades=closed(s),count=Math.max(trades.length,Math.max(0,Math.trunc(finite(s.performance?.closedTrades))));
  const total=count?count===finite(s.performance?.closedTrades,-1)?finite(s.performance.totalProfit):trades.reduce((n,t)=>n+t.pnl,0):0;
  let balance=starting(s)+total-trades.reduce((n,t)=>n+t.pnl,0),peak=Math.max(starting(s),balance),minimum=Math.min(starting(s),balance);
  for(const trade of trades){balance+=trade.pnl;peak=Math.max(peak,balance);minimum=Math.min(minimum,balance);}
  return {trades,count,total,peak,minimum,lossEvidence:count?Math.max(-finite(s.performance?.maxLoss),trades.reduce((n,t)=>n+Math.max(0,-t.pnl),0)):0};
}
export function validTradingTrauma(t){
  return !!t&&t.version===1&&['story','endless'].includes(t.mode)&&Number.isFinite(t.seed)
    &&(t.runId===null||typeof t.runId==='string')&&Number.isFinite(t.severity)&&t.severity>=0&&t.severity<=100
    &&Number.isFinite(t.peakRealized)&&t.peakRealized>0&&Number.isFinite(t.realized)
    &&Number.isSafeInteger(t.seenCloses)&&t.seenCloses>=0&&Number.isSafeInteger(t.hitTick)
    &&Number.isSafeInteger(t.hitDay)&&t.hitDay>=1&&Number.isFinite(t.recoveryUnits)&&t.recoveryUnits>=0
    &&Number.isSafeInteger(t.lastRestDay)&&Number.isSafeInteger(t.lastFlatSegment)&&Array.isArray(t.recentLosses)
    &&(t.principalBreached===undefined||typeof t.principalBreached==='boolean')&&t.recentLosses.length<=8&&t.recentLosses.every(e=>Number.isFinite(e.loss)&&e.loss>0&&Number.isSafeInteger(e.day)&&e.day>=1&&typeof e.liquidation==='boolean');
}
function compatible(s,t){return validTradingTrauma(t)&&t.mode===(s.mode||'story')&&t.seed===s.seed&&(!t.runId||!s.runId||t.runId===s.runId);}
function lossSeverity(loss,reference){const ratio=loss/Math.max(1,reference);return ratio>=.75?92:ratio>=.45?76:ratio>=.2?46:0;}
function principalThreatened(s,snapshot,assets){return snapshot.total<=-starting(s)*.15&&netResources(s,assets)<=starting(s)*.9;}
export function tradingCapitalSafety(s,{accountEquity}={}){const snapshot=ledger(s),netAssets=netResources(s,finite(accountEquity,finite(s.cash)+finite(s.reserve)));return {principalIntact:snapshot.total>=0&&netAssets>=starting(s),realized:snapshot.total,netAssets,start:starting(s)};}
function damageFromDrawdown(s,record,snapshot,assets){
  if(!snapshot.count||!principalThreatened(s,snapshot,assets))return 0;
  const drawdown=clamp(1-Math.max(0,starting(s)+snapshot.total)/record.peakRealized,0,1);
  const depleted=netResources(s,assets)/record.peakRealized<=.2;
  if(drawdown>=.85&&snapshot.lossEvidence>=starting(s)*.5&&depleted)return 96;
  if(drawdown>=.65&&snapshot.lossEvidence>=starting(s)*.3)return 76;
  if(drawdown>=.35&&snapshot.lossEvidence>=starting(s)*.15)return 46;
  return 0;
}
export function observeTradingTrauma(s,{accountEquity}={}){
  const snapshot=ledger(s),old=s.tradingTrauma,assets=finite(accountEquity,finite(s.cash)+finite(s.reserve));
  let record=compatible(s,old)&&snapshot.count>=old.seenCloses?old:null;
  if(!record){
    record={version:1,mode:s.mode||'story',seed:s.seed,runId:s.runId||null,severity:0,peakRealized:snapshot.peak,realized:snapshot.total,seenCloses:snapshot.count,
      principalBreached:snapshot.minimum<starting(s)*.85,hitTick:gameTick(s)-TRAUMA_POLICY.numbTicks,hitDay:Math.max(1,s.day||1),recoveryUnits:0,lastRestDay:0,lastFlatSegment:-1,recentLosses:[]};
    const recent=snapshot.trades.filter(t=>t.pnl<0&&finite(t.day,s.day)>=(s.day||1)-3);
    record.recentLosses=recent.slice(-8).map(t=>({loss:-t.pnl,day:Math.max(1,t.day||s.day||1),liquidation:t.type==='liquidation'}));
    record.severity=principalThreatened(s,snapshot,assets)?Math.max(damageFromDrawdown(s,record,snapshot,assets),...recent.map(t=>lossSeverity(-t.pnl,record.peakRealized)),0):0;
    s.tradingTrauma=record;if(record.severity>0)delete s.emotionPressure;
  }else{
    if(record.principalBreached===undefined){record.principalBreached=snapshot.minimum<starting(s)*.85;if(!record.principalBreached)record.severity=0;}
    if(record.severity>0)record.runId ||= s.runId||null;
    if(snapshot.count>record.seenCloses){
      const incoming=snapshot.trades.slice(-Math.min(snapshot.count-record.seenCloses,snapshot.trades.length));
      let damage=0;
      for(const trade of incoming){
        if(trade.pnl<0){damage=Math.max(damage,lossSeverity(-trade.pnl,record.peakRealized));record.recentLosses.push({loss:-trade.pnl,day:Math.max(1,trade.day||s.day),liquidation:trade.type==='liquidation'});}
      }
      record.recentLosses=record.recentLosses.filter(t=>t.day>=(s.day||1)-3).slice(-8);
      const liquidations=record.recentLosses.filter(t=>t.liquidation);
      if(liquidations.length>=2&&liquidations.reduce((n,t)=>n+t.loss,0)/record.peakRealized>=.35)damage=Math.max(damage,88);
      record.peakRealized=Math.max(record.peakRealized,snapshot.peak);
      const oldDrawdown=1-Math.max(0,starting(s)+record.realized)/record.peakRealized,newDrawdown=1-Math.max(0,starting(s)+snapshot.total)/record.peakRealized;
      const meaningfulLoss=incoming.reduce((sum,t)=>sum+Math.max(0,-t.pnl),0)>=starting(s)*.05;
      if(incoming.some(t=>t.pnl<0)&&(meaningfulLoss||[.35,.65,.85].some(band=>oldDrawdown<band&&newDrawdown>=band)))damage=Math.max(damage,damageFromDrawdown(s,record,snapshot,assets));
      if(!principalThreatened(s,snapshot,assets))damage=0;
      if(damage>=TRAUMA_POLICY.hurtAt){record.principalBreached=true;record.severity=Math.max(record.severity,damage);record.hitTick=gameTick(s);record.runId=s.runId||null;delete s.emotionPressure;record.hitDay=Math.max(1,s.day);record.recoveryUnits=0;}
      record.seenCloses=snapshot.count;record.realized=snapshot.total;
    }
  }
  return tradingTrauma(s);
}
export function recoverTradingTrauma(s,{kind,day=s.day,segment}={}){
  const t=s.tradingTrauma;if(!compatible(s,t)||t.severity<=0||(s.positions?.length||s.position))return false;
  if(kind==='rest'){
    if(s.mode==='endless'||s.phase!=='resting'||s.dayReport?.day!==day||s.story?.presentedDay!==day||!Number.isSafeInteger(day)||day<=t.lastRestDay)return false;
    t.lastRestDay=day;t.severity=Math.max(0,t.severity-TRAUMA_POLICY.restRecovery);t.recoveryUnits++;
  }else if(kind==='flat-segment'){
    if(s.mode!=='endless'||!s.realtime||!s.pending?.flatAtStart||s.pending.traded||s.pending.candle<4||!Number.isSafeInteger(segment)||segment<=t.lastFlatSegment)return false;
    t.lastFlatSegment=segment;t.severity=Math.max(0,t.severity-TRAUMA_POLICY.flatSegmentRecovery);t.recoveryUnits+=.25;
  }else return false;
  return true;
}
export function tradingTrauma(s){
  const t=s?.tradingTrauma;if(!compatible(s,t)||t.severity<=0)return {active:false,severity:0,intensity:0,mood:null,cap:100,art:null,nextAt:null};
  const severity=t.severity,age=Math.max(0,gameTick(s)-t.hitTick),level=severity>=85?'numb':severity>=70?'crushed':severity>=40?'hurt':'recovering';
  const mood=level==='recovering'?'recovering':severity>=85&&age>=TRAUMA_POLICY.numbTicks?'numb':severity>=70&&age<TRAUMA_POLICY.painTicks?'trauma-pain':'trauma-frozen';
  const labels={'trauma-pain':'崩溃','trauma-frozen':level==='hurt'?'重创':'恍惚',numb:'麻木',recovering:'恢复中'};
  const cap=severity>=85?TRAUMA_POLICY.numbCap:severity>=70?TRAUMA_POLICY.crushedCap:TRAUMA_POLICY.hurtCap;
  const lines={'trauma-pain':'刚才的损失……还缓不过来。','trauma-frozen':'数字还在变，我却有点反应不过来。',numb:'……先停一会儿。',recovering:'还没缓过来，今天慢一点。'};
  const nextAt=severity>=70&&age<TRAUMA_POLICY.painTicks?t.hitTick+TRAUMA_POLICY.painTicks:severity>=85&&age<TRAUMA_POLICY.numbTicks?t.hitTick+TRAUMA_POLICY.numbTicks:null;
  return {active:true,severity,intensity:severity/100,level,mood,label:labels[mood],cap,art:mood==='numb'?'numb':mood==='trauma-pain'?'anguish':'tearfulStunned',line:lines[mood],nextAt,recoveryUnits:t.recoveryUnits,
    explanation:`交易重创恢复期 · 承受力上限 ${cap}。借入资金和小幅盈利不会抹去冲击；${s.mode==='endless'?'空仓度过完整行情段':'完成休市休息'}后逐步恢复。`};
}
export function capTraumaSanity(s,value,assets){const t=tradingTrauma(s);if(!t.active)return value;return Math.min(t.cap,Math.max(finite(assets)>=1000?TRAUMA_POLICY.survivalFloor:0,value));}
export const isTraumaMood=mood=>['trauma-pain','trauma-frozen','numb','recovering'].includes(mood);
