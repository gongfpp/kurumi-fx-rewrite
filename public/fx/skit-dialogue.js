import {setImage} from './assets.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
// Existing approved UI art. The purple-haired Mochiko portrait comes from the
// labelled friends design, not the incompatible older brown-haired mini-icon.
export const SKIT_AVATAR_ASSETS=Object.freeze({
 '久留美':Object.freeze({path:'./pixel-assets/mobile-life-approved.png',width:854,height:1842,rect:[47,224,99,98]}),
 '萌智子':Object.freeze({path:'./pixel-assets/life-friends-approved.png',width:1536,height:1024,rect:[414,459,256,256]}),
 '安子':Object.freeze({path:'./pixel-assets/life-friends-approved.png',width:1536,height:1024,rect:[900,470,240,240]})
});
export const SKIT_STATUS_ICONS=Object.freeze({
 stamina:Object.freeze({path:'./pixel-assets/mobile-life-approved.png',width:854,height:1842,rect:[409,264,35,29]}),
 emotion:Object.freeze({path:'./pixel-assets/reference-atlas.png',width:1536,height:1024,rect:[184,530,32,32]}),
 income:Object.freeze({path:'./pixel-assets/mobile-life-approved.png',width:854,height:1842,rect:[58,1084,43,51]})
});
export function createSkitCrop(doc,asset,className,{speaker=''}={}){
 const frame=doc.createElement('span');frame.className=className;frame.setAttribute('aria-hidden','true');frame.dataset.speaker=speaker;frame.dataset.artStatus='fallback';
 if(!asset)return frame;
 const [x,y,width,height]=asset.rect,image=doc.createElement('img');image.alt='';image.loading='eager';image.decoding='async';image.width=asset.width;image.height=asset.height;
 image.setAttribute('style',`position:absolute;width:${asset.width/width*100}%;height:${asset.height/height*100}%;max-width:none;max-height:none;left:${-x/width*100}%;top:${-y/height*100}%;object-fit:fill`);
 frame.setAttribute('style',`aspect-ratio:${width} / ${height}`);frame.append(image);
 // Eager loading is required while the decorative image is hidden: a lazy
 // hidden probe would never load and could leave the name fallback forever.
 setImage(image,asset.path,{onStatus:status=>{frame.dataset.artStatus=status;image.hidden=status!=='ready';}});return frame;
}
export function createSkitStatusIcon(doc,kind){return createSkitCrop(doc,Object.hasOwn(SKIT_STATUS_ICONS,kind)?SKIT_STATUS_ICONS[kind]:null,`skit-status-icon skit-status-icon-${kind}`);}
// Keep the exact approved words and speaker order. Presentation never writes
// creative dialogue or merges separate speakers into one synthetic quotation.
export function createSkitLine(doc,speaker,text){
 const line=doc.createElement('p'),name=doc.createElement('b'),separator=doc.createElement('span'),speech=doc.createElement('span');
 line.className='comic-panel-line skit-dialogue-line';line.dataset.speaker=speaker;
 name.className='skit-dialogue-speaker';speech.className='skit-dialogue-speech';name.textContent=speaker;separator.className='skit-dialogue-separator';separator.textContent='：';speech.textContent=text;
 line.append(createSkitCrop(doc,Object.hasOwn(SKIT_AVATAR_ASSETS,speaker)?SKIT_AVATAR_ASSETS[speaker]:null,'skit-dialogue-avatar',{speaker}),name,separator,speech);return line;
}
