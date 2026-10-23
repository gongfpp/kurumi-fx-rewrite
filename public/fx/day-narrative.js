import {pendingStory,chooseStory} from './story.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {automaticNarrativeChoice,keepNarrativeSnapshot} from './narrative-effects.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {fatherDiscoveryCandidate,fatherDiscoveryPresentation,fatherDiscoverySequence,applyFatherDiscovery} from './father-discovery.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {selectMainStory,canCompleteMainStory,completeMainStory} from './main-story.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {captureFirstDayOriginalRecall} from './firstday-original-recall.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
export function prepareDailyNarrative(state,{accountEquity}={}){
 if(state.mode==='endless'||state.phase!=='resting'||state.dayReport?.day!==state.day)return null;
 applyFatherDiscovery(state,{type:'migrate'});
 if(!state.settlementNarrative||state.settlementNarrative.day!==state.day){
  const candidate=fatherDiscoveryCandidate(state,{accountEquity});
  if(candidate?.canPresent)applyFatherDiscovery(state,{type:'start'},{accountEquity});
 }
 const fresh=!state.settlementNarrative||state.settlementNarrative.day!==state.day;
 const saved=keepNarrativeSnapshot(state,pendingStory(state));
 // Never retrofit an already locked day, including a legacy empty snapshot.
 if(fresh){saved.mainStory=selectMainStory(state);captureFirstDayOriginalRecall(state);}
 if(fatherDiscoveryPresentation(state)&&!saved.fatherFrames){saved.fatherFrames=fatherDiscoverySequence(state);saved.fatherDiscovery=true;}
 return saved;
}
// Only narrative acknowledgements are automatic. This function has no item,
// loan or payment API; financial actions remain their existing explicit buttons.
export function finishDailyNarrative(state,{choiceId}={}){
 const n=state.settlementNarrative;
 if(state.mode==='endless'||!n||n.day!==state.day||state.phase!=='resting')return{ok:false,reason:'no-current-narrative',hooks:[]};
 if(n.effectsApplied)return{ok:true,changed:false,hooks:[]};
 if(!canCompleteMainStory(state,n.mainStory))return{ok:false,reason:'main-story-changed',hooks:[]};
 let result=null,hooks=[];
 if(n.fatherDiscovery){
  for(let count=0;count<3;count++){
   const current=fatherDiscoveryPresentation(state);if(!current)break;
   result=applyFatherDiscovery(state,{type:'advance',eventId:current.eventId,expectedStep:current.step,expectedRevision:current.revision});
   if(!result.ok)return{ok:false,reason:result.reason,hooks:[]};
   hooks.push(...result.hooks.filter(h=>h.type==='item-revealed'||h.type==='item-reminded'));
  }
 }else{
  const current=pendingStory(state);
  if(current&&current.key!==n.event?.key)return{ok:false,reason:'narrative-changed',hooks:[]};
  if(!current&&n.event&&!state.story.seen.includes(n.event.key))return{ok:false,reason:'narrative-changed',hooks:[]};
  if(current&&current.key===n.event?.key){
   const id=choiceId||automaticNarrativeChoice(n.event);
   if(!id)return{ok:false,reason:'needs-explicit-choice',event:n.event,hooks:[]};
   if(!current.choices.some(c=>c.id===id))return{ok:false,reason:'invalid-choice',hooks:[]};
   result=chooseStory(state,id);
  }
 }
 if(n.fatherDiscovery&&hooks.length){state.story.log ||= [];state.story.log.push({id:n.fatherFrames?.[0]?.purpose==='reminder'?'fatherCabinetReminder':'fatherDiscover',day:state.day,beat:state.beat,choice:'acknowledge-discovery'});state.story.log=state.story.log.slice(-40);}
 completeMainStory(state,n.mainStory);
 state.story.presentedDay=state.day;n.effectsApplied=true;
 return{ok:true,changed:true,result,hooks};
}
