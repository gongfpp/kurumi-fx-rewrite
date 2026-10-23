// Optional dialog decoration loads only after selecting the pixel frontend.
// An unavailable view leaves the original functional dialogs untouched.
export function createPixelDialogController({document=globalThis.document,getSettlement=()=>null,load=()=>import('./pixel-dialogs.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717')}={}){
 let module=null,instance=null,loading=null,disposed=false;
 const pixel=()=>document.body.dataset.frontend==='pixel';
 function refresh(kind){
  if(disposed)return false;
  if(!instance){
   if(!pixel())return true;
   if(!module){
    if(!loading)loading=Promise.resolve().then(load).then(value=>{
     module=value;if(!disposed&&pixel())refresh('refreshLayout');
    }).catch(()=>{}).finally(()=>{loading=null;});
    return true;
   }
   try{instance=module.mountPixelDialogs({document,getSettlement});}catch{return false;}
  }
  try{return instance[kind]();}
  catch{try{instance.dispose();}catch{}instance=null;return false;}
 }
 return {
  refreshLayout:()=>refresh('refreshLayout'),
  refreshSettlement:()=>refresh('refreshSettlement'),
  dispose(){if(disposed)return;disposed=true;instance?.dispose();instance=null;}
 };
}
