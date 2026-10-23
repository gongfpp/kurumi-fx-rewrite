// Bind multiple views to one current-state close transaction. A displayed quote
// is never an execution price; the supplied transaction reads the live state.
export function closeAllToken({generation,mode,runId,day,positions=[]}) {
  if(!positions.length)return null;
  return JSON.stringify([generation,mode,runId,day,positions.map(p=>[
    p.id,p.direction,p.entry,p.margin,p.notional,p.quantity,p.pnlModel
  ])]);
}

export function closeAllModalOpen(root) {
  return root.documentElement.classList.contains('dialog-active')||Boolean(root.querySelector('dialog[open]'))||
    [...root.querySelectorAll('[role="dialog"][aria-modal="true"], [role="alertdialog"][aria-modal="true"]')]
      .some(node=>!node.hidden&&node.getAttribute('aria-hidden')!=='true'&&node.getClientRects().length>0);
}

export function createCloseAllControl({getContext,guard=()=>true,close}={}) {
  const bindings=new Set();let pending=false,disposed=false;
  function refresh(){
    if(disposed)return;
    const context=getContext();
    for(const binding of bindings){
      binding.token=context.token;
      const disabled=pending||!context.canClose||!context.token;
      if(binding.button.disabled!==disabled)binding.button.disabled=disabled;
    }
  }
  function bind(button,{canInteract=()=>true}={}){
    if(disposed)throw Error('Close control has been disposed');
    const binding={button,token:null,armed:undefined},listeners=[];
    const listen=(type,fn)=>{button.addEventListener(type,fn);listeners.push(()=>button.removeEventListener(type,fn));};
    // Keep the pointer/key-down portfolio even if a save reload or a render
    // replaces the view before the corresponding click reaches this handler.
    listen('pointerdown',event=>{if(event.button===0)binding.armed=binding.token;});
    listen('keydown',event=>{
      if(event.key!=='Enter'&&event.key!==' ')return;
      if(event.repeat){binding.armed=null;event.preventDefault();return;}
      binding.armed=binding.token;
    });
    listen('pointercancel',()=>{binding.armed=null;});
    listen('click',event=>{
      const token=binding.armed===undefined?binding.token:binding.armed;binding.armed=undefined;
      const context=getContext();
      if(disposed||pending||button.disabled||event.detail>1||!canInteract()||!token||token!==context.token||!context.canClose){refresh();return;}
      if(!guard()){refresh();return;}
      const current=getContext();
      if(!current.canClose||token!==current.token){refresh();return;}
      pending=true;refresh();
      try{close(button);}finally{
        // Reject re-entrant and same-turn clicks from either view. Empty/stale
        // portfolios stay disabled after this latch releases.
        queueMicrotask(()=>{pending=false;refresh();});
      }
    });
    bindings.add(binding);refresh();
    binding.remove=()=>{listeners.forEach(remove=>remove());bindings.delete(binding);button.disabled=true;};
    return binding.remove;
  }
  return {bind,refresh,destroy(){if(disposed)return;disposed=true;for(const binding of bindings)binding.remove();}};
}
