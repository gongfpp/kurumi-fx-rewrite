// Reviewed transcript meanings define applicability. Files and portrait moods
// are not evidence that a player made/lost money. Add a rule, not a new branch.
const rule=(meaning,scopes,polarity,extra={})=>Object.freeze({meaning,scopes:Object.freeze(scopes),polarity,
  priority:50,cooldownMs:24000,stableMs:2500,maxStartAgeMs:1500,eventMatchedScopes:['realized','settlement'],...extra});
export const VOICE_SCENE_RULES=Object.freeze({
 'pv-profit-ten':rule('当前仍有至少十万净浮盈',['floating'],'profit',{requiresPosition:true,minPnl:100000,priority:70}),
 'pv-profit-twenty':rule('持仓盈利后想再等到二十万止盈',['floating'],'profit',{requiresPosition:true,priority:60}),
 'pv-cannot-lose':rule('持仓中的得意自信',['floating'],'profit',{requiresPosition:true,cooldownMs:30000}),
 'pv-gone':rule('玩家曾有的利润转亏',['floating','realized','settlement'],'loss',{events:['profit-to-loss'],priority:80}),
 'pv-human':rule('客串角色的风险台词，仅主动试听',[],'loss'),
 'pv-stop':rule('真实持仓净亏损时的惊慌',['floating'],'loss',{requiresPosition:true,minAbsPnl:50,priority:90,cooldownMs:30000}),
 'pv-profit-vanished':rule('玩家曾有的利润消失',['floating','realized','settlement'],'loss',{events:['profit-to-loss'],priority:85}),
 'pv-gasp':rule('实际交易转好后的惊喜',['floating','realized','settlement'],'profit',{priority:65,moods:['stunned','loss-to-profit','relieved']}),
 'pv-mebuki-rich':rule('客串角色自我介绍，仅主动试听',[],'neutral'),
 'pv-yasuko-start':rule('客串角色入场宣言，仅主动试听',[],'neutral'),
 'character-came':rule('实际持仓或结算盈利的兴奋',['floating','realized','settlement'],'profit',{priority:60}),
 'character-check':rule('只评论查看行情，不评价玩家盈亏',['market','floating'],'neutral',{priority:10,cooldownMs:30000,moods:['calm','hopeful','regretful','relieved','stunned','nervous']}),
 'character-family-money':rule('涉及明确家庭资金来源，仅主动试听',[],'neutral'),
 'character-greedy':rule('实际净亏损后的后悔',['floating','realized','settlement'],'loss',{priority:60}),
 'character-laugh':rule('实际净盈利时的笑声',['floating','realized','settlement'],'profit',{priority:55}),
 'pv-mochiko-waste':rule('客串角色的可惜评价，仅主动试听',[],'loss')
});
export const voiceSceneRule=line=>line?.sceneRule||VOICE_SCENE_RULES[line?.id];
export function voiceSceneMatches(line,context,{stage='start',now=0,lastPlayedAt=-Infinity}={}) {
  const spec=voiceSceneRule(line);if(!spec||!context||context.suppressCommentary||!spec.scopes.includes(context.scope))return false;
  if(context.scope==='market'&&spec.polarity!=='neutral')return false;
  if(context.scope==='floating'&&!context.hasPositions)return false;
  if(spec.requiresPosition&&!context.hasPositions)return false;
  if(spec.directions&&!spec.directions.includes(context.positionDirection))return false;
  if(spec.volatility&&!spec.volatility.includes(context.volatility))return false;
  if(spec.events&&!spec.events.includes(context.eventKind))return false;
  if(!Number.isFinite(context.pnl))return false;
  if(spec.polarity==='profit'&&context.pnl<1||spec.polarity==='loss'&&context.pnl>-1)return false;
  if(spec.minPnl!==undefined&&context.pnl<spec.minPnl)return false;
  if(spec.minAbsPnl!==undefined&&Math.abs(context.pnl)<spec.minAbsPnl)return false;
  if(stage==='start'){
    if(!context.settled&&(context.stableForMs??0)<(spec.stableMs??0))return false;
    if(context.settled&&(context.eventAgeMs??0)>(spec.maxStartAgeMs??1500))return false;
    if(now-lastPlayedAt<(spec.cooldownMs??0))return false;
  }
  return true;
}
export function sceneVoiceCandidates(lines,emotion,context,options={}) {
  const eligible=lines.filter(line=>(voiceSceneRule(line)?.eventMatchedScopes?.includes(context?.scope)||(voiceSceneRule(line)?.moods||line.moods).includes(emotion))
    &&voiceSceneMatches(line,context,{...options,lastPlayedAt:options.lastPlayed?.get(line.id)??-Infinity}));
  eligible.sort((a,b)=>(voiceSceneRule(b)?.priority??0)-(voiceSceneRule(a)?.priority??0));
  const priority=voiceSceneRule(eligible[0])?.priority;
  return eligible.filter(line=>voiceSceneRule(line)?.priority===priority);
}
