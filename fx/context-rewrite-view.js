import {CONTEXT_REWRITE_SCENES} from './copy/context-rewrite-scenes.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
// Apply only at the last presentation boundary: profit tiers, dinner variants,
// receipt gates and current-debt continuity already made their factual choices.
// An unchanged image identity keeps read/replay memory and costs unchanged.
export function applyApprovedContextDialogue(scene){
 const copy=CONTEXT_REWRITE_SCENES[scene?.id],art=scene?.art;
 if(!copy||!art?.reviewed||art.panels!==4||art.people!==copy.people||art.sha256!==copy.artSha256||art.grid)return scene;
 const path=String(art.path||''),expected=copy.artPath.slice(2);
 if(path!==copy.artPath&&!path.endsWith('/fx/'+expected))return scene;
 return {...scene,title:copy.title,characters:[...copy.characters],people:copy.people,ready:true,
  dialoguePanels:structuredClone(copy.dialoguePanels),lines:copy.lines.map(line=>[...line]),
  dialogueRevision:'gemini-context-rewrite-20261010-v3'};
}
