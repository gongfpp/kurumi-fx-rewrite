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
