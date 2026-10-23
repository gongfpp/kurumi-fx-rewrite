import {fixedDailyContentIdentity} from './contextual-manga-scenes.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {artIdentity,dailyArtMemory,observeSeenArtwork} from './daily-art-memory.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {CONTEXTUAL_MANGA_ASSETS} from './contextual-manga-content.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {CHARACTER_STORY_ASSETS} from './character-story-content.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {setImage} from './assets.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {mountContextualOriginalVoices} from './original-scene-voice.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
const mountedViews=new WeakMap();
// Inline presentation only. Reading memory never changes game/account state.
export function mountContextualManga(host,selection,{manual=true,unreadOnly=false,showHeading=true,memory=dailyArtMemory,root=host.ownerDocument||document}={}){
 mountedViews.get(host)?.();mountedViews.delete(host);host.replaceChildren();host.hidden=!selection;if(!selection)return null;
 const make=(tag,text)=>{const node=root.createElement(tag);if(text!==undefined)node.textContent=text;return node;};
 host.className='contextual-manga';host.dataset.arc=selection.id;
 const section=make('section'),heading=make('h3',selection.title),content=make('div');
 // Older readers can acknowledge every panel without the chapter marker.
 // Recover only from every current, nonempty content identity; never from the
 // chapter selection, a record number, or a partial/previous panel list.
 const completeRead=(choice,recover=false)=>{
  if(choice.completionIdentity&&choice.completionIdentity!==fixedDailyContentIdentity(choice))return false;
  const assets=choice.nodes.flatMap(node=>node.panels.map(panel=>CONTEXTUAL_MANGA_ASSETS[panel.record]||CHARACTER_STORY_ASSETS[panel.record])),ids=assets.map(artIdentity);
  const complete=ids.length>0&&ids.every(id=>id&&memory.has(id));
  // Path-only legacy identities cannot establish unchanged content on mount.
  // Keep their explicit replay; the normal visible-image observer still owns
  // acknowledging reads when no stable content hash is available.
  if(complete&&(!recover||assets.every(asset=>/^[a-f0-9]{64}$/i.test(asset?.sha256||'')))){
   const identities=[`arc:${choice.id}`];
   // An old chapter marker alone never completes a larger edition. Only the
   // same all-current-image proof can acknowledge its content-bound identity.
   if(choice.completionIdentity)identities.push(choice.completionIdentity);
   const unread=identities.filter(id=>!memory.has(id));if(unread.length)memory.seen(unread);
  }
  return complete;
 };
 const choices=[selection,...(selection.related||[])].slice(0,4);let active=selection,replay=unreadOnly&&completeRead(active,true),expanded=!manual&&!replay,toggle=null;let observers=[];const dispose=()=>{for(const stop of observers)stop();observers=[];};mountedViews.set(host,dispose);
 const updateToggle=()=>{if(toggle){const label=active.parallelStory?'故事':'往事';toggle.textContent=replay&&!expanded?'回看这段小剧场':(expanded?'收起这段':'展开这段')+label;toggle.setAttribute('aria-expanded',String(expanded));}};
 function paint(){dispose();content.replaceChildren();content.hidden=!expanded;if(!expanded)return;
  for(const node of active.nodes){const remaining=node.panels.filter(panel=>{const asset=CONTEXTUAL_MANGA_ASSETS[panel.record]||CHARACTER_STORY_ASSETS[panel.record];return !unreadOnly||replay||!memory.has(artIdentity(asset));});if(!remaining.length)continue;const story=make('section'),title=make('h4',node.title);story.dataset.node=node.id;story.append(title,make('p',node.before));
   for(const panel of remaining){if(panel.before)story.append(make('p',panel.before));const asset=CONTEXTUAL_MANGA_ASSETS[panel.record]||CHARACTER_STORY_ASSETS[panel.record],figure=make('figure'),img=make('img'),missing=make('p','图片暂未加载。');missing.hidden=true;missing.setAttribute('role','status');img.alt=panel.alt;img.width=asset.dimensions[0];img.height=asset.dimensions[1];img.dataset.sourceRecord=String(panel.record);img.loading='eager';img.decoding='async';setImage(img,asset.path,{onStatus:status=>{missing.hidden=status!=='unavailable';img.hidden=status==='unavailable';}});figure.append(img,missing);story.append(figure);observers.push(observeSeenArtwork(img,{memory,identities:[artIdentity(asset)],onSeen:()=>completeRead(active)}));}
   story.append(make('p',node.after));content.append(story);
   observers.push(mountContextualOriginalVoices(story,{selection:active,node,visiblePanels:remaining,root,owner:host}));
  }
 }
 if(showHeading)section.append(heading);
 if(manual||choices.length>1||replay){toggle=make('button','展开这段往事');toggle.type='button';toggle.className='secondary';toggle.setAttribute('aria-expanded',String(expanded));toggle.addEventListener('click',()=>{expanded=!expanded;updateToggle();paint();});section.append(toggle);}
 if(choices.length>1){const nav=make('nav');nav.setAttribute('aria-label',choices.some(choice=>choice.parallelStory)?'相关故事':'相关往事');for(const choice of choices){const button=make('button',choice.title);button.type='button';button.className='secondary';button.dataset.arcChoice=choice.id;button.setAttribute('aria-pressed',String(choice===active));button.addEventListener('click',()=>{active=choice;replay=unreadOnly&&completeRead(active,true);expanded=true;heading.textContent=choice.title;host.dataset.arc=choice.id;for(const sibling of nav.children)sibling.setAttribute('aria-pressed',String(sibling===button));updateToggle();paint();});nav.append(button);}section.append(nav);}
 section.append(content);host.append(section);updateToggle();paint();return {dispose,get expanded(){return expanded;}};
}
