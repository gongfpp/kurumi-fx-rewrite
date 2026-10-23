import {createSkitLine} from './skit-dialogue.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {setImage} from './assets.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {mainStoryArtForDay} from './main-story-art-assets.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';

// The existing settlement scroll area owns layout. No new modal, continuation
// button, account action or automatic pagination is introduced.
export function mountMainStory(host,episode,{dailySelection=null}={}){
 // A locked daily story owns this page's title, pictures and dialogue. The
 // independent campus episode is only a text fallback, never its introduction.
 if(dailySelection?.id)episode=null;
 host.replaceChildren();host.hidden=!episode;
 delete host.dataset.mainStoryId;
 if(!episode)return;
 const doc=host.ownerDocument,heading=doc.createElement('h3'),action=doc.createElement('p');
 host.dataset.mainStoryId=episode.id;host.className='main-story';
 heading.textContent=episode.title;action.textContent=episode.action;
 host.append(heading,action);
 const art=mainStoryArtForDay(episode.number);
 if(art){
  const image=doc.createElement('img');image.alt=art.alt;image.width=art.width;image.height=art.height;
  image.setAttribute('style','display:block;width:100%;height:auto;object-fit:contain');
  setImage(image,art.path);host.append(image);
 }
 for(const [speaker,text] of episode.lines)host.append(createSkitLine(doc,speaker,text));
}
