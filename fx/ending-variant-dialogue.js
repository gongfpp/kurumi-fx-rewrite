import {ENDING_VARIANT_DIALOGUES} from './copy/ending-variant-dialogues.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {selectEndingVariantArt} from './ending-variant-art.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {createSkitLine} from './skit-dialogue.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
export {ENDING_VARIANT_DIALOGUES};

// Only the existing sealed report selects a variant. Dialogue never classifies
// an account, invents a repayment, changes money or writes presentation state.
export function selectEndingVariantDialogue(state,ending,art){
 if(!['story','endless'].includes(state?.mode)||state?.phase!=='ending'||typeof ending?.variant!=='string'||!Object.hasOwn(ENDING_VARIANT_DIALOGUES,ending.variant))return null;
 const selected=selectEndingVariantArt(state,ending);
 if(!selected||!art||['id','path','sha256','panels'].some(key=>art[key]!==selected[key]))return null;
 return ENDING_VARIANT_DIALOGUES[ending.variant];
}
export function mountEndingVariantDialogue(host,dialogue,{root=host.ownerDocument||document}={}){
 host.replaceChildren();host.dataset.dialogueId=dialogue?.dialogueId||'';host.dataset.dialogueOrigin=dialogue?.origin||'';
 if(!dialogue)return 0;
 let count=0;
 // The existing caption host is a two-column grid. Keep one grid cell per
 // illustrated panel, including panels with more than one spoken line.
 for(const [index,panel]of dialogue.dialoguePanels.entries()){
  const group=root.createElement('div');group.dataset.comicPanel=String(index+1);group.setAttribute('role','group');group.setAttribute('aria-label',`第${index+1}格`);
  for(const [speaker,text]of panel.lines){const line=createSkitLine(root,speaker,text);line.dataset.comicPanel=String(index+1);line.dataset.dialogueId=dialogue.dialogueId;line.dataset.dialogueOrigin=dialogue.origin;group.append(line);count++;}
  host.append(group);
 }
 return count;
}
