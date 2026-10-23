import {closeAllModalOpen} from './close-all-control.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';

// Capture which presentation was actually clicked, then defer dismissal until
// the full click/default action has run. In particular, closing a risk warning
// must not invalidate its one-click close-position control before it executes.
// Pointer-transparent panels keep click-through: only their visible rectangle
// is observed, and no event is canceled, stopped, synthesized or replayed.
export function bindFloatingDismissal({element,root=element?.ownerDocument,dismiss,getPresentation=()=>element,
 defer=callback=>setTimeout(callback,0),cancel=id=>clearTimeout(id)}={}){
 if(!element||!root||typeof dismiss!=='function')return ()=>{};
 let disposed=false;
 const pending=new Set();
 const visible=()=>!disposed&&!element.hidden&&element.isConnected!==false&&
  element.getClientRects().length>0&&!closeAllModalOpen(root)&&
  !element.closest?.('dialog,[role="dialog"][aria-modal="true"],[role="alertdialog"][aria-modal="true"]');
 const onClick=event=>{
  if(!visible())return;
  const style=root.defaultView?.getComputedStyle?.(element);
  if(style?.visibility==='hidden'||style?.display==='none')return;
  const inside=element.contains(event.target);
  if(!inside){
   // Keyboard activation belongs only to its explicit focused target. A click
   // outside the float never dismisses it, even if another float is visible.
   if(!(event.detail>0)||![event.clientX,event.clientY].every(Number.isFinite))return;
   const {left,right,top,bottom}=element.getBoundingClientRect();
   if(!(event.clientX>=left&&event.clientX<right&&event.clientY>=top&&event.clientY<bottom))return;
  }
  const presentation=getPresentation();
  if(presentation==null)return;
  const task=defer(()=>{
   pending.delete(task);
   // A button can replace the panel with a new receipt or start a new risk
   // episode. A queued dismissal of the old one must not close the new one.
   if(visible()&&getPresentation()===presentation)dismiss();
  });
  pending.add(task);
 };
 root.addEventListener('click',onClick,true);
 return ()=>{
  if(disposed)return;disposed=true;
  root.removeEventListener('click',onClick,true);
  for(const task of pending)cancel(task);
  pending.clear();
 };
}
