import {preserveScroll} from './preserve-scroll.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {isTextEntry,prepareModalFocus} from './focus-safety.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
// Every modal owns one fixed control strip and one scrollable content region.
// Closing a narrative window dismisses its presentation, never chooses a story.
export function enhanceDialogs({root=document,onDismiss=()=>{},onClose=()=>{}}={}) {
  const dialogs=[...root.querySelectorAll('dialog')].filter(dialog=>dialog.id!=='pixel-boot-error'),records=new Map();
  const openDialogs=()=>dialogs.filter(d=>d.open);
  const sync=()=>root.documentElement.classList.toggle('dialog-active',openDialogs().length>0);
  const focusable=node=>node?.isConnected&&!node.disabled&&!node.closest?.('[hidden]')&&!isTextEntry(node);
  for(const dialog of dialogs) {
    if(dialog.classList.contains('dialog-shell'))continue;
    const scroller=root.createElement('div');scroller.className='dialog-scroll';
    const toolbar=root.createElement('div');toolbar.className='dialog-toolbar';
    const existing=dialog.querySelector('.x-close');
    const close=existing||root.createElement('button');
    close.classList.add('x-close');close.type='button';
    if(!existing){close.textContent='×';close.setAttribute('aria-label','关闭窗口，保留当前进度');close.dataset.dialogDismiss='';}
    const title=dialog.querySelector('h2');
    if(title){title.id||=`${dialog.id}-title`;dialog.setAttribute('aria-labelledby',title.id);}
    dialog.setAttribute('aria-modal','true');
    for(const child of [...dialog.childNodes])if(child!==existing)scroller.append(child);
    toolbar.append(close);dialog.append(toolbar,scroller);dialog.classList.add('dialog-shell');
    const record={opener:null,show:dialog.showModal.bind(dialog),scroller};records.set(dialog,record);
    dialog.showModal=()=>{
      if(dialog.open)return;
      record.opener=prepareModalFocus(root);
      // Native dialog close also restores its remembered focus. Release an
      // editable opener before showModal so a later automatic close cannot
      // reopen the phone keyboard. Direct input and Tab stay native.
      preserveScroll(root.documentElement,()=>record.show());scroller.scrollTop=0;sync();
      close.focus({preventScroll:true});
    };
    const nativeClose=dialog.close.bind(dialog);
    dialog.close=(...args)=>preserveScroll(record.opener?.parentElement||root.documentElement,()=>nativeClose(...args));
    const dismiss=()=>{
      if(!dialog.open||dialog.dataset.dismissLocked==='true')return;
      if(dialog.id==='prop-dialog'){root.getElementById('prop-done').click();return;}
      dialog.close('dismiss');onDismiss(dialog);
    };
    if(!existing)close.addEventListener('click',dismiss);
    // Existing opening skip keeps its explicit skip semantics. Other Escape
    // closes are ordinary dismissals, not synthetic next-day/choice clicks.
    dialog.addEventListener('cancel',event=>{
      if(dialog.id==='opening-dialog')return;
      event.preventDefault();event.stopImmediatePropagation();dismiss();
    },true);
    dialog.addEventListener('keydown',event=>{
      // Native controls still receive Enter/Space/Tab, but gameplay shortcuts
      // on the page never receive a key from a modal.
      event.stopPropagation();
    });
    dialog.addEventListener('close',()=>{
      onClose(dialog);sync();queueMicrotask(()=>{
        const active=openDialogs().at(-1),opener=record.opener;
        if(active){if(focusable(opener)&&active.contains(opener))opener.focus({preventScroll:true});else if(!active.contains(root.activeElement))active.querySelector('.x-close')?.focus({preventScroll:true});}
        else if(focusable(opener))opener.focus({preventScroll:true});
        else {const resume=root.getElementById('scene-resume');(focusable(resume)?resume:root.getElementById('pixel-frontend'))?.focus({preventScroll:true});}
      });
    });
  }
  sync();return {dialogs,records,sync};
}
