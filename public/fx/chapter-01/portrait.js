import {setMangaImage} from '../manga-images.js?v=295e20358213d4ea13e57d98c0bfc3b6ffe341ec-23f2a20b7717';
export function showChapterPortrait(image,panel){
 if(!panel)return;
 setMangaImage(image,panel.original,{loading:'eager'});
 const [x0,y0,x1,y1]=panel.cropPixels,[width,height]=panel.imageSize;
 image.style.cssText=`position:absolute;width:${width/(x1-x0)*100}%;height:auto;max-width:none;left:0;top:0;transform:translate(${-x0/width*100}%,${-y0/height*100}%);object-fit:initial;`;
 image.parentElement.style.aspectRatio=`${x1-x0} / ${y1-y0}`;
 image.alt=`久留美 · ${panel.expression} · 原作第${panel.chapter}话第${panel.page}页表情裁切`;
}
