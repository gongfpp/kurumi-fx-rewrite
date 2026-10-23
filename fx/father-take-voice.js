import {VOICE_LINES} from './voice.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {mountVoiceLibrary} from './voice-library.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';

// This existing PV line mentions family money without a fixed amount or consent.
// Bind it only to the current, durably saved withdrawal receipt, never a mood.
export const FATHER_TAKE_VOICE_ID='character-family-money';
const bindings=new WeakMap();
export function fatherTakeVoiceReceiptMatches(state,result,{saveSucceeded=false}={}){
 const receipt=state?.family?.withdrawal;
 return saveSucceeded===true&&state?.mode==='story'&&state.fatherUsed===true&&state.family.takenConfirmed===true
  &&result?.id==='father'&&Number.isFinite(result.amount)&&result.amount>0
  &&receipt?.id===`father:${state.runId||state.seed}`&&receipt.day===state.day&&receipt.amount===result.amount;
}

export function mountFatherTakeVoice(dialog,{state,result,saveSucceeded=false,isCurrent=()=>true,
 beforePlay=()=>{},onPlaybackChange=()=>{},sourceLink=null,sourceTitle=null,sourceNote=null,
 mountLibrary=mountVoiceLibrary,lines=VOICE_LINES}={}){
 bindings.get(dialog)?.();
 if(!dialog?.open||dialog.dataset.kind!=='father'||!isCurrent()||!fatherTakeVoiceReceiptMatches(state,result,{saveSucceeded}))return ()=>{};
 const line=lines.find(line=>line.id===FATHER_TAKE_VOICE_ID);
 if(!line)return ()=>{};
 const receipt=state.family.withdrawal,host=dialog.ownerDocument.createElement('div');
 host.dataset.fatherTakeVoice='';
 const done=dialog.querySelector('#prop-done');if(done)done.parentNode.insertBefore(host,done);else dialog.append(host);
 let disposed=false,unmount=()=>{};
 const stop=()=>{for(const player of host.querySelectorAll('audio'))player.pause();};
 const current=()=>!disposed&&dialog.open&&dialog.dataset.kind==='father'&&isCurrent()
  &&state.family.withdrawal===receipt&&fatherTakeVoiceReceiptMatches(state,result,{saveSucceeded});
 const events=['play','pause','ended','error'];
 const changed=()=>onPlaybackChange();
 for(const type of events)host.addEventListener(type,changed,true);
 const dispose=()=>{
  if(disposed)return;disposed=true;
  dialog.removeEventListener('close',dispose);
  for(const type of events)host.removeEventListener(type,changed,true);
  stop();unmount();host.remove();
  if(bindings.get(dialog)===dispose)bindings.delete(dialog);
  onPlaybackChange();
 };
 bindings.set(dialog,dispose);dialog.addEventListener('close',dispose);
 try{
  unmount=mountLibrary(host,[line],{beforePlay:()=>{if(!current()){stop();return;}beforePlay();},onPlay:changed});
  const first=host.children[0];
  for(const part of [sourceTitle,sourceNote])if(part)host.insertBefore(part.cloneNode(true),first||null);
  // Reuse the existing official-index link verbatim; no new player-facing copy.
  if(sourceLink)host.append(sourceLink.cloneNode(true));
 }catch(error){dispose();throw error;}
 return dispose;
}
