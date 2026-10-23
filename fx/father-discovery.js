// Pure selection + explicit state transitions for the cabinet discovery.
// No DOM, timers, RNG, audio playback, storage writes or account transfers.
export const FATHER_DISCOVERY_POLICY = Object.freeze({
  version: 1, itemId: 'father', name: '父亲的柜中存款', amount: 3000000,
  scheduledDay: 12, crisisEquityCeiling: 30000, severeLossFraction: .8,
});
export const FATHER_DISCOVERY_ART = Object.freeze({
  calm: {kind:'existing-game-art',path:'./comics/event-father.webp',grid:[0,0,2,2],note:'现有同人四格左上格；平静发现柜中信封。'},
  pain: {kind:'generated-game-art',slot:'father-crisis-pain',path:'./generated/father-cabinet-v1/pain.webp',note:'已实际巨亏/强平、接近无翻盘资金；不能把原作尚在持仓的浮亏图当已爆仓。'},
  discover: {kind:'generated-game-art',slot:'father-crisis-discover',path:'./generated/father-cabinet-v1/discover.webp',note:'痛苦状态看到柜中资金；钱仍在柜中，尚未领取。'},
  relief: {kind:'generated-game-art',slot:'father-crisis-relief',path:'./generated/father-cabinet-v1/relief.webp',note:'发现后喜极而泣；不是交易盈利，不画已到账或拿走钱。'},
});
const SAFE_PHASES = new Set(['closing','day_end','resting','bankrupt']);
const finite = Number.isFinite;
const whole = n => Number.isSafeInteger(n) && n >= 0;
const ownPositions = s => Array.isArray(s.positions) ? s.positions : s.position ? [s.position] : [];
const hasTaken = s => !!s.fatherUsed || !!s.family?.takenConfirmed || s.family?.outstanding > 0 || s.family?.repaid > 0;
const stableId = s => `${s.runId || 'seed-'+(s.seed ?? 'legacy')}:father-cabinet-v1`;
const money = n => `¥${Math.max(0,n).toLocaleString('zh-CN',{maximumFractionDigits:2})}`;
const no = (reason, extra={}) => ({ok:false,changed:false,reason,hooks:[],...extra});

export function fatherDiscoveryState(s) {
  const raw=s.fatherDiscovery;
  if(hasTaken(s))return {...(raw?.version===1?raw:{}),version:1,status:'consumed',route:raw?.route||'legacy',eventId:raw?.eventId||stableId(s),step:raw?.step??0,revision:raw?.revision??0};
  if(raw !== undefined){
    if(!raw || (raw.purpose!==undefined&&!['unlock','reminder'].includes(raw.purpose)) || (raw.hintPending!==undefined&&typeof raw.hintPending!=='boolean') || raw.version!==1 || !['presenting','available','consumed'].includes(raw.status) || !['calendar','crisis','legacy'].includes(raw.route) || typeof raw.eventId!=='string' || !whole(raw.step) || !whole(raw.revision) || (raw.status==='presenting' && (raw.route==='legacy'||!raw.facts||!finite(raw.facts.accountEquity)||raw.facts.accountEquity<0||raw.step >= (raw.route==='crisis'?3:1))))return {version:1,status:'blocked',reason:'unrecognized-discovery-state'};
    return {...raw};
  }
  if(s.family?.unlocked || s.story?.seen?.includes('fatherUnlock'))return {version:1,status:'available',route:'legacy',eventId:stableId(s),step:0,revision:0,legacy:true,hintPending:false};
  return {version:1,status:'undiscovered',revision:0};
}

// accountEquity must come from the host's real equity calculator. A current,
// sealed report is an allowed fallback; stale reports and raw cash are not.
export function fatherDiscoveryFacts(s,{accountEquity,policy=FATHER_DISCOVERY_POLICY}={}) {
  const r=s.dayReport,reportCurrent=r?.day===s.day && ['day_end','resting','bankrupt'].includes(s.phase);
  const equity=finite(accountEquity)?accountEquity:reportCurrent&&finite(r.closing)?r.closing:null;
  if(equity===null || equity<0 || !Number.isSafeInteger(s.day) || s.day<1)return null;
  const opening=reportCurrent&&finite(r.opening)?r.opening:finite(s.dayOpening)?s.dayOpening:finite(s.startEquity)?s.startEquity:100000;
  const reference=Math.max(1,finite(s.startEquity)&&s.startEquity>0?s.startEquity:100000,opening);
  const currentTrades=(s.history||[]).filter(t=>t.day===s.day&&t.type!=='open'&&finite(t.pnl));
  const dayNet=reportCurrent&&finite(r.net)?r.net:currentTrades.length?currentTrades.reduce((sum,t)=>sum+t.pnl,0):0;
  const realized=finite(s.performance?.totalProfit)?s.performance.totalProfit:(s.history||[]).filter(t=>t.type!=='open'&&finite(t.pnl)).reduce((sum,t)=>sum+t.pnl,0);
  const liquidation=currentTrades.some(t=>t.type==='liquidation'&&t.pnl<0);
  const drawdown=Math.max(0,1-equity/reference);
  const start=finite(s.startEquity)&&s.startEquity>0?s.startEquity:100000;
  const severeTradingLoss=-dayNet>=reference*policy.severeLossFraction || -realized>=start*policy.severeLossFraction || liquidation&&-dayNet>=reference*.5;
  // A tiny trade loss after large expenses/repayments is not a trading crisis.
  const severe=equity<policy.crisisEquityCeiling && severeTradingLoss;
  return {day:s.day,beat:whole(s.beat)?s.beat:0,accountEquity:equity,dayTradingNet:dayNet,realizedTradingNet:realized,reference,drawdown,liquidation,severe,openPositions:ownPositions(s).length};
}

export function fatherDiscoveryCandidate(s,options={}) {
  if(s.mode==='endless')return null;
  const current=fatherDiscoveryState(s);
  if(!['undiscovered','available'].includes(current.status))return null;
  const policy={...FATHER_DISCOVERY_POLICY,...options.policy};
  if(!Number.isSafeInteger(policy.scheduledDay)||policy.scheduledDay<1||!finite(policy.crisisEquityCeiling)||policy.crisisEquityCeiling<=0||!finite(policy.severeLossFraction)||policy.severeLossFraction<=0||policy.severeLossFraction>1)return null;
  const facts=fatherDiscoveryFacts(s,{...options,policy});if(!facts)return null;
  // Crisis wins a same-tick race with the calendar, before the first scene starts.
  const reminder=current.status==='available';
  if(reminder&&(!facts.severe||current.crisisSeen||current.route==='crisis'))return null;
  const route=facts.severe?'crisis':!reminder&&s.day>=policy.scheduledDay?'calendar':null;
  if(!route)return null;
  return {eventId:stableId(s),itemId:'father',title:policy.name,route,purpose:reminder?'reminder':'unlock',facts,steps:route==='crisis'?3:1,canPresent:SAFE_PHASES.has(s.phase)&&facts.openPositions===0,requiresExplicitTake:true};
}

export function fatherDiscoveryPresentation(s) {
  const d=fatherDiscoveryState(s);if(d.status!=='presenting')return null;
  const crisis=d.route==='crisis',stages=crisis?[
    {id:'pain',emotion:'despair',text:`账户只剩 ${money(d.facts.accountEquity)}。刚才的损失还压在胸口。`,art:FATHER_DISCOVERY_ART.pain,audioCue:'father-crisis'},
    {id:'discover',emotion:'shocked',text:d.purpose==='reminder'?'对了，柜子里那笔还没动过的存款……还在那里。':'柜子里的信封……爸爸留下的三百万，还在那里。',art:FATHER_DISCOVERY_ART.discover,audioCue:'father-discovery'},
    {id:'relief',emotion:'tearful-relief',text:'原来还有一条路……但这是爸爸的钱，取用后必须归还。',art:FATHER_DISCOVERY_ART.relief,audioCue:'father-relief'},
  ]:[{id:'calm',emotion:'calm',text:'柜子里放着爸爸的三百万存款。先记住它的位置。',art:FATHER_DISCOVERY_ART.calm,audioCue:'father-discovery'}];
  return {eventId:d.eventId,title:FATHER_DISCOVERY_POLICY.name,route:d.route,purpose:d.purpose||'unlock',step:d.step,revision:d.revision,total:stages.length,...stages[d.step],nextLabel:d.step===stages.length-1?'记住这笔存款':'继续',requiresExplicitTake:true,financialMeaning:'discovery-only; not income or receipt'};
}

// The two-page day-end UI may show every frame read-only on its story page.
// Rendering this sequence never advances, unlocks or takes money.
export function fatherDiscoverySequence(s){
 const d=fatherDiscoveryState(s);if(d.status!=='presenting')return [];
 return Array.from({length:d.route==='crisis'?3:1},(_,step)=>fatherDiscoveryPresentation({...s,fatherDiscovery:{...d,step}}));
}

function store(s,d){s.fatherDiscovery={...d};return s.fatherDiscovery;}
function unlock(s,d){
  s.family ||= {};s.family.unlocked=true;
  s.itemDiscoveries ||= {};s.itemDiscoveries.father ||= {day:s.day,event:'fatherUnlock'};
  s.story ||= {};s.story.seen ||= [];s.story.flags ||= {};s.story.queue ||= [];
  // Keep existing family/network-loan completion compatibility, but never alter
  // loan balances, rates, discovery or access directly from this module.
  if(!s.story.seen.includes('fatherUnlock'))s.story.seen.push('fatherUnlock');
  if(!s.story.seen.includes('fatherDiscover'))s.story.seen.push('fatherDiscover');
  s.story.queue=s.story.queue.filter(id=>!['fatherUnlock','fatherDiscover'].includes(id));
  s.story.flags.fatherCabinetDiscovery=true;
  return store(s,{...d,status:'available',completedDay:s.day,firstDiscovery:d.firstDiscovery||{route:d.route,day:s.day},hintPending:true,revision:d.revision+1});
}

export function applyFatherDiscovery(s,action={},options={}) {
  if(s.mode==='endless')return no('endless-has-no-discovery-scene');
  if(s.fatherDiscovery!==undefined&&s.fatherDiscovery?.version!==1)return no('unrecognized-discovery-state');
  let current=fatherDiscoveryState(s);
  if(current.status==='blocked')return no(current.reason);
  if(action.type==='migrate'){
    if(current.status==='undiscovered'||s.fatherDiscovery?.version===1)return no('nothing-to-migrate');
    // Migration preserves every account number. Prior borrowing is sticky even
    // after repayment; it cannot become a second claim because a flag was absent.
    if(current.status==='consumed')s.fatherUsed=true;
    if(['available','consumed'].includes(current.status)){s.family ||= {};s.family.unlocked=true;store(s,current);return {ok:true,changed:true,status:current.status,hooks:[]};}
    return no('nothing-to-migrate');
  }
  if(action.type==='start'){
    if(!['undiscovered','available'].includes(current.status))return no('already-started-or-unlocked',{status:current.status});
    const candidate=fatherDiscoveryCandidate(s,options);if(!candidate)return no('not-eligible');
    if(!candidate.canPresent)return no('wait-for-safe-empty-account-window');
    current=store(s,{version:1,status:'presenting',route:candidate.route,purpose:candidate.purpose,firstDiscovery:current.firstDiscovery||(current.status==='available'?{route:current.route,day:current.completedDay||null}:null),crisisSeen:current.crisisSeen||candidate.route==='crisis',eventId:candidate.eventId,step:0,revision:current.revision+1,startedDay:s.day,startedBeat:s.beat,facts:candidate.facts,hintPending:false});
    return {ok:true,changed:true,status:'presenting',presentation:fatherDiscoveryPresentation(s),hooks:[{type:'scene-enter',eventId:current.eventId,step:0,audioCue:current.route==='crisis'?'father-crisis':'father-discovery',userGestureRequired:true}]};
  }
  if(action.type==='advance'){
    if(current.status!=='presenting')return no('not-presenting');
    if(!SAFE_PHASES.has(s.phase)||ownPositions(s).length)return no('wait-for-safe-empty-account-window');
    if(action.eventId!==current.eventId||action.expectedStep!==current.step||action.expectedRevision!==current.revision)return no('stale-step');
    const count=current.route==='crisis'?3:1;
    if(current.step+1>=count){current=unlock(s,current);return {ok:true,changed:true,status:'available',hooks:[{type:current.purpose==='reminder'?'item-reminded':'item-revealed',eventId:current.eventId,itemId:'father',effect:'cabinet-discovery',requiresExplicitTake:true}]};}
    current=store(s,{...current,step:current.step+1,revision:current.revision+1});
    const presentation=fatherDiscoveryPresentation(s);
    return {ok:true,changed:true,status:'presenting',presentation,hooks:[{type:'scene-enter',eventId:current.eventId,step:current.step,audioCue:presentation.audioCue,userGestureRequired:true}]};
  }
  if(action.type==='acknowledge-hint'){
    if(current.status!=='available'||!current.hintPending||action.eventId!==current.eventId)return no('no-pending-hint');
    store(s,{...current,hintPending:false,revision:current.revision+1});return {ok:true,changed:true,status:'available',hooks:[]};
  }
  if(action.type==='sync-taken'){
    if(!hasTaken(s))return no('no-actual-withdrawal');
    if(s.fatherDiscovery?.status==='consumed')return no('already-consumed');
    store(s,{...current,status:'consumed',hintPending:false,revision:current.revision+1});return {ok:true,changed:true,status:'consumed',hooks:[]};
  }
  return no('unsupported-action-use-existing-explicit-item-handler');
}

export function fatherDiscoveryHint(s,{reducedMotion=false}={}) {
  const d=fatherDiscoveryState(s);if(d.status!=='available'||!d.hintPending||hasTaken(s))return null;
  return {eventId:d.eventId,itemId:'father',label:FATHER_DISCOVERY_POLICY.name,target:'[data-prop="father"]',effect:reducedMotion?'static-outline':'short-shake-and-arrow',maxDurationMs:reducedMotion?0:900,announce:d.purpose==='reminder'?'父亲的柜中存款还没有动过。需要时可以打开柜门。':'发现了父亲的柜中存款，还没有取用。',autoActivate:false,audioCue:null};
}
export function canTakeDiscoveredFatherSavings(s){const d=fatherDiscoveryState(s);return (d.status==='available'||d.status==='presenting'&&d.purpose==='reminder')&&!hasTaken(s);}

// Optional main-portrait variant. It represents a verified depleted account,
// not a generic floating loss or a promise that borrowed money is profit.
export function selectAccountCrisisExpression(s,options={}){
 const facts=fatherDiscoveryFacts(s,options);
 if(!facts?.severe||facts.openPositions!==0)return null;
 return {id:'father-crisis-pain-v1',emotion:'despair',art:FATHER_DISCOVERY_ART.pain,facts,origin:'generated-game-art',reason:'实际交易损失后资金接近耗尽；新绘同人痛苦表情，不冒充原作截图。'};
}

// Important item use has a phase-accurate image. A confirmation is not a receipt.
export function fatherItemIllustration(s,{stage='confirm',result,accountEquity}={}){
 const d=fatherDiscoveryState(s);
 if(stage==='confirm'){
   if(hasTaken(s)||!(s.mode==='endless'||canTakeDiscoveredFatherSavings(s)||s.family?.unlocked))return null;
   const crisis=d.route==='crisis'||fatherDiscoveryFacts(s,{accountEquity})?.severe;
   return {itemId:'father',stage:'confirm',title:FATHER_DISCOVERY_POLICY.name,art:crisis?FATHER_DISCOVERY_ART.discover:FATHER_DISCOVERY_ART.calm,caption:'',financialMeaning:'not-taken',autoActivate:false};
 }
 if(stage==='applied'&&hasTaken(s)&&result?.id==='father'&&Number.isFinite(result.amount)&&result.amount>0&&result.amount<=FATHER_DISCOVERY_POLICY.amount&&result.amount===(s.family?.withdrawal?.amount??((s.family?.outstanding||0)+(s.family?.repaid||0)))){
   return {itemId:'father',stage:'applied',title:FATHER_DISCOVERY_POLICY.name,art:{kind:'existing-game-art',path:'./comics/event-father.webp',grid:[1,0,2,2],note:'已查看既有同人四格右上：双手持封闭信封，确为取用后。'},caption:`已取用 ${money(result.amount)}，同时记为父亲欠款；无论金额多少，本章取款机会已用完。`,financialMeaning:'borrowed-principal',autoActivate:false};
 }
 return null;
}
