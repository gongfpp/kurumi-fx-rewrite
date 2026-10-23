// Original event-driven terminal sounds. No platform/film/anime audio is sampled.
export const TERMINAL_SOUND_CUES=Object.freeze({
 'terminal-tap':{file:'terminal-v2/tap',cooldownMs:100,leadInSeconds:.045},
 'terminal-fill':{file:'terminal-v2/fill',cooldownMs:180,leadInSeconds:.05},
 'terminal-close':{file:'terminal-v2/close',cooldownMs:220,leadInSeconds:.05},
 'terminal-reject':{file:'terminal-v2/reject',cooldownMs:600,leadInSeconds:.06},
 'terminal-news':{file:'terminal-v2/news',cooldownMs:1200,leadInSeconds:.08},
 'terminal-risk':{file:'terminal-v2/risk',cooldownMs:1600,leadInSeconds:.09},
 'outcome-profit':{file:'terminal-v2/major-profit',cooldownMs:3500,leadInSeconds:.12},
 'outcome-loss':{file:'terminal-v2/major-loss',cooldownMs:3500,leadInSeconds:.14},
 'pressure-hit':{file:'terminal-v2/pressure',cooldownMs:85,leadInSeconds:.045},
 'pressure-break':{file:'terminal-v2/breakthrough',cooldownMs:1800,leadInSeconds:.06},
});
export function terminalCueForEvent({type,pnl=0,margin=0,liquidated=false,quiet=false}={}){
 if(type==='open')return{kind:'terminal-fill',level:.45};
 if(type==='reject')return{kind:'terminal-reject',level:.35};
 if(type==='news')return{kind:'terminal-news',level:.25};
 if(type==='close'){
  const major=Number.isFinite(pnl)&&Math.abs(pnl)>=Math.max(5000,Math.max(0,Number.isFinite(margin)?margin:0)*.12);
  if(major&&!quiet)return{kind:pnl>0?'outcome-profit':'outcome-loss',level:.65};
  return{kind:liquidated&&!quiet?'terminal-risk':'terminal-close',level:quiet?.2:.4};
 }
 return{kind:'terminal-tap',level:.3};
}
