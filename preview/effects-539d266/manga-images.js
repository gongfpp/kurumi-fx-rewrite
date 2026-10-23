import {setImage} from './assets.js?v=539d26616071e7036617b0b49726bd24af40ef2e-capture-v1-1fbef814f493';
const bindings=new WeakMap();
// Lazy non-primary art and an explicit text fallback retain the ledger/context
// even if both the original request and its one ordinary retry fail.
export function setMangaImage(image,path,{loading='lazy'}={}){
 image.loading=loading;image.decoding='async';
 setImage(image,path);
 const current=bindings.get(image),asset=image.dataset.asset;
 if(current?.asset===asset)return;
 current?.note?.remove();
 const state={asset,note:null};bindings.set(image,state);
 const error=image.onerror,loaded=image.onload;
 image.onerror=event=>{
  error?.call(image,event);
  if(bindings.get(image)!==state||!image.classList.contains('image-unavailable')||state.note)return;
  const note=image.ownerDocument.createElement('p');note.className='manga-image-fallback';note.setAttribute('role','status');
  note.textContent='漫画图片暂时无法载入；本局数值与文字说明仍可查看。';
  image.parentElement?.append(note);state.note=note;
 };
 image.onload=event=>{loaded?.call(image,event);state.note?.remove();state.note=null;};
}
