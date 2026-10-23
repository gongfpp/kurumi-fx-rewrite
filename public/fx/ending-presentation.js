import {observeSeenArtwork} from './daily-art-memory.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';

// The engine has already sealed the account. This optional record controls only
// the two views of that result, never its classification, money or rewards.
export function endingPresentationContext(state,ending,media=[]){
 if(state?.phase!=='ending'||!ending||ending.baseId!==state.ending?.id)return null;
 const runId=String(state.runId??`seed:${state.seed}:${state.mode}`),endingId=ending.variant||ending.baseId;
 const assets=media.filter(value=>typeof value==='string');
 return {runId,baseId:ending.baseId,endingId,assets,key:JSON.stringify([runId,ending.baseId,endingId,assets])};
}
export function endingPresentationState(state,context){
 const saved=state?.endingPresentation;
 // Frozen51 story base endings had no media. Their completed results remain
 // completed when the exact same-ID legacy picture becomes visible.
 const previousStoryKey=context&&state?.mode==='story'&&context.endingId===context.baseId&&Object.hasOwn(legacyHashes,context.baseId)&&Array.isArray(context.assets)&&context.assets.length===1&&context.assets[0]===legacyHashes[context.baseId]&&context.key===JSON.stringify([context.runId,context.baseId,context.endingId,context.assets])?JSON.stringify([context.runId,context.baseId,context.endingId,[]]):null;
 return context&&state?.phase==='ending'&&state.ending?.id===context.baseId&&String(state.runId??`seed:${state.seed}:${state.mode}`)===context.runId&&saved&&typeof saved==='object'&&!Array.isArray(saved)&&saved.version===1&&(saved.key===context.key||previousStoryKey!==null&&saved.key===previousStoryKey)&&saved.runId===context.runId&&saved.baseId===context.baseId&&saved.endingId===context.endingId&&saved.stage==='results'&&['observed','skipped'].includes(saved.status)?{version:1,key:context.key,runId:context.runId,baseId:context.baseId,endingId:context.endingId,stage:'results',status:saved.status}:null;
}
export function completeEndingPresentation(state,context,{observed=false}={}){
 if(!context||state?.phase!=='ending'||String(state.runId??`seed:${state.seed}:${state.mode}`)!==context.runId||state.ending?.id!==context.baseId||endingPresentationState(state,context))return false;
 state.endingPresentation={version:1,key:context.key,runId:context.runId,baseId:context.baseId,endingId:context.endingId,stage:'results',status:observed?'observed':'skipped'};
 return true;
}
const legacyHashes=Object.freeze({million:'571575df415681ba4eab476f737432ef0ab012afe8429248fc5802296e853ccd',broke:'82ef97fdaf9fff068d9494158829c44f096ea87882670180bed2e63e171dcb4d',crisis:'937e17a1c1f2761086262416225636f4b7029e6a28a7922e5bac1ba0da2a2f73'});
export function endingPresentationMedia(state,ending,art,manga){
 if(art)return [art.sha256];
 if(!ending?.variant&&Object.hasOwn(legacyHashes,state.ending?.id))return [legacyHashes[state.ending.id]];
 return (manga?.cards||[]).map(card=>card.panel.sha256);
}
const views=new WeakMap();
export function bindEndingPresentation({dialog,button,images=[],context,getState,getContext,getGeneration=()=>0,getSession=()=>null,canAdvance=()=>true,onAdvance=()=>{},observe=observeSeenArtwork}){
 views.get(dialog)?.dispose();
 const generation=getGeneration(),originalState=getState(),session=getSession(),seen=new Set(),stops=[];let disposed=false;
 const current=()=>!disposed&&views.get(dialog)===view&&dialog.open&&getGeneration()===generation&&getState()===originalState&&getSession()===session&&getContext()?.key===context?.key;
 const dispose=()=>{if(disposed)return;disposed=true;for(const stop of stops)stop?.();if(button.onclick===advance)button.onclick=null;dialog.removeEventListener?.('close',dispose);if(views.get(dialog)===view)views.delete(dialog);};
 const advance=()=>{
  if(button.disabled||!current()||!canAdvance())return;
  if(!completeEndingPresentation(getState(),context,{observed:images.length>0&&seen.size===images.length}))return;
  dispose();onAdvance();
 };
 const view={dispose};views.set(dialog,view);
 if(endingPresentationState(getState(),context)){dispose();return view;}
 button.onclick=advance;dialog.addEventListener?.('close',dispose);
 for(const [index,image]of images.entries()){
  // "observed" means successfully loaded pixels were visible, not that a
  // person has read them. Advancing is always allowed, including broken art.
  const stop=observe(image,{identities:[],memory:{seen:()=>true},minVisibleRatio:.1,accumulateVisibility:true,onSeen:()=>{if(current())seen.add(index);}});stops.push(stop);if(disposed)stop?.();
 }
 return view;
}
