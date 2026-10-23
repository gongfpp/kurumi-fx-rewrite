import {VOICE_LINES} from './voice.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {mountVoiceLibrary} from './voice-library.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {ORIGINAL_SCENE_VOICE_BINDINGS} from './original-scene-voice-bindings.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {CONTEXTUAL_MANGA_ASSETS} from './contextual-manga-content.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {CHARACTER_STORY_ASSETS} from './character-story-content.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';

const assetFor=record=>CONTEXTUAL_MANGA_ASSETS[record]||CHARACTER_STORY_ASSETS[record];
const exactPath=(path,expected)=>path===expected||String(path).split(/[?#]/)[0].endsWith('/fx/'+expected.slice(2));
const sameLine=(a,b)=>Array.isArray(a)&&a.length===2&&a[0]===b[0]&&a[1]===b[1];
export function contextualOriginalVoiceIds(selection,node,visiblePanels=node?.panels||[],{assets=assetFor}={}){
 if(!selection?.nodes?.includes(node))return [];
 return ORIGINAL_SCENE_VOICE_BINDINGS.filter(binding=>{
  if(binding.kind!=='contextual'||selection.id!==binding.sceneId||node?.id!==binding.nodeId)return false;
  if(!binding.records.every(record=>visiblePanels.some(panel=>panel.record===record)&&assets(record)?.sha256===binding.assetHashes[record]))return false;
  if(Object.entries(binding.expectedText).some(([key,value])=>node[key]!==value))return false;
  if(binding.panelAlt&&!node.panels.some(panel=>binding.records.includes(panel.record)&&panel.alt===binding.panelAlt))return false;
  if(binding.priorNode&&!selection.nodes.some(prior=>prior.id===binding.priorNode.id&&prior.before===binding.priorNode.before))return false;
  return true;
 }).map(binding=>binding.clipId);
}
export function comicOriginalVoiceIds(scene,panelIndex){
 if(!scene?.ready||scene.art?.reviewed!==true)return [];
 return ORIGINAL_SCENE_VOICE_BINDINGS.filter(binding=>{
  if(binding.kind!=='comic'||scene.id!==binding.sceneId||panelIndex!==binding.panelIndex||scene.art.sha256!==binding.artSha256||!exactPath(scene.art.path,binding.artPath))return false;
  if(binding.dialogueRevision&&(scene.dialogueRevision!==binding.dialogueRevision||scene.dialogueId!==binding.dialogueId))return false;
  const lines=scene.dialoguePanels?.[panelIndex]?.lines||[scene.lines?.[panelIndex]];
  if(!lines.some(line=>sameLine(line,binding.expectedLine)))return false;
  if(scene.id==='quote-2hz'){
   const r=scene.receipt;
   if(r?.hz!==2||!Number.isFinite(r.day)||!Number.isFinite(r.timestamp)||!Number.isFinite(r.amount)||r.amount<=0||typeof r.id!=='string'||!r.id||typeof scene.receiptKey!=='string'||!scene.receiptKey.endsWith(':'+r.id)||scene.result?.amount!==r.amount)return false;
  }
  return true;
 }).map(binding=>binding.clipId);
}

// One existing audition component inside the actual visible node/panel. No
// scheduled playback, new narrative queue, ledger writes or generated speech.
export function mountOriginalVoiceExcerpts(host,ids,{root=host.ownerDocument,owner=host,isCurrent=()=>true,
 mountLibrary=mountVoiceLibrary,lines=VOICE_LINES}={}){
 const selected=ids.map(id=>lines.find(line=>line.id===id&&line.speaker===ORIGINAL_SCENE_VOICE_BINDINGS.find(binding=>binding.clipId===id)?.speaker)).filter(Boolean);
 if(!selected.length)return ()=>{};
 const block=root.createElement('div');block.dataset.originalSceneVoice='';host.append(block);
 const dialog=owner.closest?.('dialog')||null;let disposed=false,unmount=()=>{};
 const stop=()=>{for(const player of block.querySelectorAll('audio'))player.pause();};
 const valid=()=>!disposed&&block.isConnected!==false&&!root.hidden&&(!dialog||dialog.open)&&isCurrent();
 const dispose=()=>{if(disposed)return;disposed=true;dialog?.removeEventListener('close',dispose);stop();unmount();block.remove();root.dispatchEvent?.(new Event('kurumi-voice-audition-change'));};
 dialog?.addEventListener('close',dispose);
 try{
  unmount=mountLibrary(block,selected,{root,beforePlay:()=>{if(!valid())stop();}});
  const library=root.getElementById?.('voice-library-dialog'),first=block.children[0];
  for(const selector of ['h2','.small-print']){const part=library?.querySelector(selector);if(part)block.insertBefore(part.cloneNode(true),first||null);}
  const source=library?.querySelector('a[href]');if(source)block.append(source.cloneNode(true));
 }catch(error){dispose();throw error;}
 return dispose;
}
export function mountContextualOriginalVoices(host,{selection,node,visiblePanels,root=host.ownerDocument,owner=host,...options}){
 const read=()=>contextualOriginalVoiceIds(selection,node,visiblePanels),ids=read();
 return mountOriginalVoiceExcerpts(host,ids,{...options,root,owner,isCurrent:()=>JSON.stringify(read())===JSON.stringify(ids)});
}
export function mountComicOriginalVoices(host,{scene,panelIndex,root=host.ownerDocument,owner=host,...options}){
 const read=()=>comicOriginalVoiceIds(scene,panelIndex),ids=read();
 return mountOriginalVoiceExcerpts(host,ids,{...options,root,owner,isCurrent:()=>JSON.stringify(read())===JSON.stringify(ids)});
}
