// Editable focus is reserved for native pointer/keyboard input and explicit
// validation after an input action, never startup or modal restoration.
export function isTextEntry(node){
 if(!node)return false;
 if(node.tagName==='TEXTAREA'||node.isContentEditable)return true;
 if(node.tagName!=='INPUT')return false;
 return !['button','submit','reset','checkbox','radio','range','file','color','image','hidden'].includes((node.type||node.getAttribute?.('type')||'text').toLowerCase());
}

export function prepareModalFocus(document){
 const opener=document.activeElement;
 // Native HTMLDialogElement remembers its opener before showModal(). Blurring
 // first prevents the browser itself from reopening an editable keyboard later.
 if(isTextEntry(opener))opener.blur?.();
 return opener;
}
export function captureFocus(document){
 const node=document.activeElement;if(!node||node===document.body)return null;
 let selection=null;try{if(typeof node.selectionStart==='number')selection=[node.selectionStart,node.selectionEnd,node.selectionDirection];}catch{}
 return {node,selection};
}
export function restoreFocus(saved,document){
 if(!saved?.node?.isConnected||saved.node.disabled)return;
 for(let node=saved.node;node;node=node.parentElement)if(node.hidden||node.inert)return;
 // Moving decoration may blur a control. Only buttons/navigation regain focus;
 // a text input is focused again by the player's next native input gesture.
 if(document.activeElement!==saved.node){if(isTextEntry(saved.node))return;saved.node.focus?.({preventScroll:true});}
 if(saved.selection)try{saved.node.setSelectionRange(...saved.selection);}catch{}
}
