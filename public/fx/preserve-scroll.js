// Only preserve the affected surface during a synchronous UI replacement.
// Normal navigation, explicit next-stage scrolling and user scrolling stay free.
export function preserveScroll(container,update,{focusSelector=null,focusFallbackSelector=null,focusFallback=null}={}){
 const doc=container?.ownerDocument,win=doc?.defaultView,ancestors=[];
 for(let node=container;node;node=node.parentElement)ancestors.push([node,node.scrollLeft,node.scrollTop]);
 const x=win?.scrollX,y=win?.scrollY;
 const result=update();
 if(focusSelector){const target=container.querySelector(focusSelector)||(focusFallbackSelector&&container.querySelector(focusFallbackSelector))||focusFallback;if(target&&!target.disabled)target.focus({preventScroll:true});}
 for(const [node,left,top] of ancestors){if(Number.isFinite(left))node.scrollLeft=left;if(Number.isFinite(top))node.scrollTop=top;}
 if(Number.isFinite(x)&&Number.isFinite(y)&&(win.scrollX!==x||win.scrollY!==y))win.scrollTo({left:x,top:y,behavior:'instant'});
 return result;
}
