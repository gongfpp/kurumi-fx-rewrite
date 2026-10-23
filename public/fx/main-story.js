import {MAIN_STORY_EPISODES} from './copy/main-story.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';

export {MAIN_STORY_EPISODES};
const owner=state=>String(state.runId||state.seed);
function progress(state){
 const saved=state.story?.mainline;
 if(!saved)return {completed:[],lastDay:0};
 if(saved.version!==1||!Array.isArray(saved.completed)||saved.completed.length>MAIN_STORY_EPISODES.length||
  saved.completed.some((id,index)=>id!==MAIN_STORY_EPISODES[index].id)||!Number.isSafeInteger(saved.lastDay)||saved.lastDay<0)return null;
 return saved;
}
// Called only when creating a new sealed daily narrative. Old locked days keep
// their exact snapshot; late upgrades start at episode one on their next day.
export function selectMainStory(state){
 const saved=progress(state);
 if(state.mode!=='story'||state.phase!=='resting'||state.dayReport?.day!==state.day||!saved||saved.lastDay>=state.day)return null;
 const episode=MAIN_STORY_EPISODES[saved.completed.length];
 return episode?{...structuredClone(episode),day:state.day,runId:owner(state)}:null;
}
export function canCompleteMainStory(state,episode){
 if(!episode)return true;
 const current=selectMainStory(state);
 return !!current&&current.id===episode.id&&episode.day===state.day&&episode.runId===owner(state);
}
// Narrative progress only. No prices, receipts, balances, family knowledge,
// friendship unlocks, stamina or market clocks change with these episodes.
export function completeMainStory(state,episode){
 if(!episode)return true;
 if(!canCompleteMainStory(state,episode))return false;
 const saved=progress(state);
 state.story.mainline={version:1,completed:[...saved.completed,episode.id],lastDay:state.day};
 return true;
}
