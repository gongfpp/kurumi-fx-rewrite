// Presentation ownership only. The app owns every game/save/market lifecycle.
// Preserve exact nodes, including trusted-input guards and delegated listeners.
export const FRONTEND_SLOTS=Object.freeze({
 header:'body > .topbar',status:'#storage-warning-panel',developerStatus:'#developer-status',
 heading:'main > .page-heading',sceneResume:'#scene-resume',character:'#character-card',
 market:'#terminal',comments:'.investor-comments',positions:'#position-card',news:'#news',
 trade:'.trade-card',inventory:'.tools.inventory',storyLibrary:'#story-library-actions',footer:'main > footer'
});

export function createDOMPortals({document,slots=FRONTEND_SLOTS}={}){
 const nodes=new Map(Object.entries(slots).map(([name,selector])=>[name,typeof selector==='string'?document.querySelector(selector):selector]));
 const moves=[];
 function moveNode(node,destination){
  if(!node||!destination||!node.parentNode)throw Error('Frontend slot is unavailable');
  if(node===destination||node.contains(destination))throw Error('Frontend slot cannot contain itself');
  const parent=node.parentNode,next=node.nextSibling,anchor=document.createComment('frontend-slot');
  parent.insertBefore(anchor,node);moves.push({node,parent,next,anchor});destination.append(node);return node;
 }
 return {
  get(name){return nodes.get(name)||null;},
  move(name,destination){if(!nodes.has(name))throw Error('Unknown frontend slot: '+name);return moveNode(nodes.get(name),destination);},
  moveNode,
  restore(){
   // Nested and repeated moves unwind to their exact original sibling order.
   while(moves.length){const {node,parent,next,anchor}=moves.pop();
    if(anchor.parentNode)anchor.parentNode.insertBefore(node,anchor);
    else parent.insertBefore(node,next?.parentNode===parent?next:null);
    anchor.remove();
   }
  },
  get count(){return moves.length;}
 };
}
export function captureFocus(document){
 const node=document.activeElement;if(!node||node===document.body)return null;
 let selection=null;try{if(typeof node.selectionStart==='number')selection=[node.selectionStart,node.selectionEnd,node.selectionDirection];}catch{}
 return {node,selection};
}
export function restoreFocus(saved,document){
 if(!saved?.node?.isConnected)return;
 // A skin-only control can remain connected but hidden after returning to the
 // original dialog. Keep the visible fallback selected by that dialog's view.
 for(let node=saved.node;node;node=node.parentElement)if(node.hidden||node.inert)return;
 // A modal's focused control stays exactly where it is. Never focus an action
 // merely because a renderer has changed; restore only the same native node.
 if(document.activeElement!==saved.node)saved.node.focus?.({preventScroll:true});
 if(saved.selection)try{saved.node.setSelectionRange(...saved.selection);}catch{}
}

export function createFrontendHost({document=globalThis.document,legacyRoot=document.querySelector('body > main'),renderers={},onLayout=()=>{}}={}){
 if(!legacyRoot)throw Error('Original frontend is unavailable');
 const portals=createDOMPortals({document});
 const roots=new Map();let active='legacy',instance=null,disposed=false,request=0;
 const initialHidden=legacyRoot.hidden,initialDataset=document.body.dataset.frontend;
 const stats={switches:0,mounts:0,disposes:0,lastError:null};
 document.body.dataset.frontend=active;
 const rootFor=id=>{
  if(!roots.has(id)){const root=document.createElement('div');root.id=id+'-frontend';root.hidden=true;root.dataset.frontendRoot=id;document.body.append(root);roots.set(id,root);}
  return roots.get(id);
 };
 const cleanup=()=>{
  const previous=instance;
  try{previous?.dispose?.();}catch(error){stats.lastError=String(error?.message||error);}
  finally{
   if(previous)stats.disposes++;instance=null;portals.restore();
   // Owned wrappers may sit inside an original node. Remove them only after all
   // live children have been restored, including when mounting failed halfway.
   try{previous?.afterRestore?.();}catch(error){stats.lastError=String(error?.message||error);}
   for(const root of roots.values()){root.hidden=true;root.replaceChildren();}
  }
 };
 function notify(previous){
  // No resize/visibility/page events are synthesized: those own app lifecycles.
  onLayout();
  const EventClass=document.defaultView?.CustomEvent||globalThis.CustomEvent;
  if(EventClass)document.dispatchEvent(new EventClass('kurumi:frontendchange',{detail:{frontend:active,previous}}));
 }
 async function switchTo(id){
  const token=++request;
  if(disposed)return {ok:false,frontend:active,reason:'disposed'};
  if(id!=='legacy'&&!Object.hasOwn(renderers,id))return {ok:false,frontend:active,reason:'unknown-frontend'};
  if(id===active)return {ok:true,frontend:active,changed:false};
  let candidate=null;
  try{
   if(id!=='legacy'){
    candidate=await renderers[id]();
    if(token!==request||disposed){candidate?.dispose?.();return {ok:false,frontend:active,reason:'superseded'};}
    if(!candidate||typeof candidate.mount!=='function')throw Error('Frontend renderer is invalid');
   }
  }catch(error){
   if(token!==request||disposed)return {ok:false,frontend:active,reason:'superseded'};
   stats.lastError=String(error?.message||error);return {ok:false,frontend:active,reason:'renderer-load'};
  }
  const focus=captureFocus(document),previous=active;
  try{
   cleanup();
   if(candidate){
    const root=rootFor(id);instance=candidate;stats.mounts++;
    candidate.mount({root,portals});
    root.hidden=false;legacyRoot.hidden=true;document.body.dataset.frontend=id;
    candidate.render?.(Object.freeze({frontend:id,reason:'switch'}));
   }else{legacyRoot.hidden=initialHidden;document.body.dataset.frontend='legacy';}
   active=id;stats.switches++;stats.lastError=null;
   notify(previous);restoreFocus(focus,document);
   return {ok:true,frontend:active,changed:true};
  }catch(error){
   cleanup();active='legacy';legacyRoot.hidden=initialHidden;document.body.dataset.frontend='legacy';
   stats.lastError=String(error?.message||error);
   try{notify(previous);}catch{}
   restoreFocus(focus,document);
   return {ok:false,frontend:active,reason:'renderer-mount'};
  }
 }
 return {
  switchTo,
  refresh(){
   if(disposed||!instance)return true;
   try{instance.render?.(Object.freeze({frontend:active,reason:'update'}));return true;}
   catch(error){
    const focus=captureFocus(document),previous=active;cleanup();active='legacy';legacyRoot.hidden=initialHidden;document.body.dataset.frontend='legacy';
    stats.lastError=String(error?.message||error);try{notify(previous);}catch{}restoreFocus(focus,document);return false;
   }
  },
  get active(){return active;},
  get diagnostics(){return Object.freeze({...stats,frontend:active,pendingMoves:portals.count,disposed});},
  dispose(){
   if(disposed)return;disposed=true;request++;const focus=captureFocus(document);cleanup();
   legacyRoot.hidden=initialHidden;
   if(initialDataset===undefined)delete document.body.dataset.frontend;else document.body.dataset.frontend=initialDataset;
   active='legacy';for(const root of roots.values())root.remove();roots.clear();restoreFocus(focus,document);
  }
 };
}
