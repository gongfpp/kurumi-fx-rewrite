// The queue has no engine, money, storage or navigation capability.
export function createEventComicQueue({onChange=()=>{}}={}) {
 let pending=[],active=null,history=[],paused=false,seen=new Set();
 const view=()=>({active,pending:[...pending],history:[...history],paused});
 const emit=()=>onChange(view());
 const advance=()=>{active=pending.shift()||null;if(active&&!history.some(scene=>scene.receiptKey===active.receiptKey))history.push(active);};
 return {
  get state(){return view();},
  enqueue(scenes){for(const scene of scenes)if(scene?.receiptKey&&!seen.has(scene.receiptKey)){seen.add(scene.receiptKey);pending.push(scene);}if(!active&&!paused)advance();emit();},
  play(scenes){pending=[...scenes];active=null;paused=false;advance();emit();},
  next(){active=null;if(!paused)advance();emit();},
  cancel(){pending=[];active=null;paused=true;emit();},
  dismiss(){active=null;paused=true;emit();},
  resume(){paused=false;if(!active)advance();emit();},
  replay(key){const scene=history.findLast(scene=>!key||scene.receiptKey===key);if(!scene)return false;if(active&&active.receiptKey!==scene.receiptKey)pending.unshift(active);active=scene;paused=false;emit();return true;},
  reset(){pending=[];active=null;history=[];paused=false;seen.clear();emit();},
 };
}
