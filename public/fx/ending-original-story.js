import {selectEventContextualManga} from './contextual-manga-scenes.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {DAILY_STORY_TRACKS} from './daily-story-order.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {CHARACTER_STORY_ASSETS} from './character-story-content.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {dailyArtMemory} from './daily-art-memory.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {mountContextualManga} from './contextual-manga-view.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {endingPresentationMedia,endingPresentationContext,endingPresentationState} from './ending-presentation.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';

export function endingOriginalPresentation(state,ending,art,manga,{memory=dailyArtMemory}={}){
 const media=endingPresentationMedia(state,ending,art,manga);
 const oldContext=endingPresentationContext(state,ending,media);
 // A new reader never reopens a legacy completed ending. Financial variants
 // keep their established presentation; this parallel episode needs its own
 // actual walkaway and the previously read Kangzi chapter.
 if(state?.mode!=='story'||state.phase!=='ending'||state.ending?.id!=='walkaway'||ending?.baseId!=='walkaway'||ending.variant||art||
  !Array.isArray(state.positions)||state.positions.length||state.position||endingPresentationState(state,oldContext))return {media,selection:null};
 const track=DAILY_STORY_TRACKS.kangzi,prior=track.slice(0,track.indexOf('walkaway'));
 if(!prior.length||!prior.every(id=>memory.has(`arc:${id}`)))return {media,selection:null};
 const selection=selectEventContextualManga(state,{type:'walkaway'});
 if(selection?.id!=='walkaway'||!selection.nodes.length)return {media,selection:null};
 const assets=selection.nodes.flatMap(node=>node.panels.map(panel=>CHARACTER_STORY_ASSETS[panel.record]));
 if(!assets.length||assets.some(asset=>!asset?.sha256))return {media,selection:null};
 return {selection,media:[...media,...assets.map(asset=>asset.sha256)]};
}
const mounted=new WeakMap();
// The existing ending theater comes before its account report. Use that same
// scroll area; the original character's balance never becomes the player's.
export function mountEndingOriginal(host,selection,{memory=dailyArtMemory}={}){
 mounted.get(host)?.dispose();
 if(!selection)return;
 const doc=host.ownerDocument,section=doc.createElement('section'),label=doc.createElement('p'),reader=doc.createElement('div');
 section.dataset.endingOriginal=selection.id;label.textContent='原作故事 · 康子的经历';section.append(label,reader);host.append(section);host.hidden=false;
 const view=mountContextualManga(reader,selection,{manual:false,unreadOnly:true,memory,root:doc});
 const dialog=host.closest?.('dialog');
 const dispose=()=>{view?.dispose();dialog?.removeEventListener('close',dispose);section.remove();if(mounted.get(host)?.dispose===dispose)mounted.delete(host);};
 mounted.set(host,{dispose});dialog?.addEventListener('close',dispose);
}
