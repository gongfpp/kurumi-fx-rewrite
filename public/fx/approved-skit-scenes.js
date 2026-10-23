import {APPROVED_FOUR_SKITS} from './copy/approved-four-skits.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {APPROVED_FOUR_SKIT_ASSETS} from './approved-four-skit-assets.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {sealedDailyTradeEvidence,retainedTimeline} from './contextual-trade-evidence.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {sealedDailyMangaOutcome} from './manga-context.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {BORROWING_CONTINUATION_ASSETS} from './contextual-manga-borrowing-continuation.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {DAILY_STORY_TRACKS} from './daily-story-order.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {artIdentity,dailyArtMemory} from './daily-art-memory.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {dailyRoutineSceneAllowed} from './daily-narrative-facts.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';

export function approvedSkit(id,{assets=APPROVED_FOUR_SKIT_ASSETS}={}){
 const script=APPROVED_FOUR_SKITS[id];if(!script)return null;
 const candidate=assets[id],art=candidate?.reviewed===true&&candidate.panels===4&&candidate.people===script.people&&candidate.dialogueId===script.dialogueId&&candidate.path&&!candidate.grid?structuredClone(candidate):null;
 return {id,...structuredClone(script),art,ready:!!art};
}

// The daily slot recalls a certified intraday long-loss episode. It never
// claims that a position is still open after settlement, nor maps a falling
// quote to a profitable short or a mixture of opposing positions.
export function holdingLossSkitEvidence(state){
 const evidence=sealedDailyTradeEvidence(state);
 if(!evidence||evidence.net>=0||evidence.trades.some(t=>t.direction!==1||t.exit>=t.entry||t.grossPnl>=0||t.pnl>=0))return null;
 if(!evidence.trades.some(t=>t.nearMiss===true)||!retainedTimeline(state,evidence))return null;
 return {day:evidence.day,net:evidence.net,positions:[...evidence.positions]};
}

// Return candidates to the existing once-per-day picker, never a second
// reader, popup, or event queue. NPC credit has no corresponding game receipt.
export function mebukiPromiseStoryRead(memory=dailyArtMemory){
 const track=DAILY_STORY_TRACKS.mebuki,prior=track.slice(0,track.indexOf('asking-for-more'));
 return prior.every(id=>memory.has(`arc:${id}`))&&[227,228,229,230].every(record=>memory.has(artIdentity(BORROWING_CONTINUATION_ASSETS[record])));
}
export function approvedDailySkitCandidates(state,{assets=APPROVED_FOUR_SKIT_ASSETS,memory=dailyArtMemory}={}){
 if(state?.mode!=='story'||!sealedDailyMangaOutcome(state))return [];
 const result=[],evidence=holdingLossSkitEvidence(state),loss=approvedSkit('holding-loss-companion',{assets});
 if(evidence&&loss?.ready)result.push({...loss,title:'久留美·再等一下',evidence});
 if(dailyRoutineSceneAllowed(state)&&mebukiPromiseStoryRead(memory)){const borrowed=approvedSkit('mebuki-after-loan',{assets});if(borrowed?.ready)result.push({...borrowed,title:'芽吹·与此同时'});}
 return result;
}

