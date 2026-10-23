import {ACTION_SCENES} from './copy/action-scenes.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {COMIC_PRESENTATION_ASSETS} from './comic-scene-assets.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {APPROVED_FOUR_SKITS} from './copy/approved-four-skits.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {APPROVED_FOUR_SKIT_ASSETS} from './approved-four-skit-assets.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {DINNER_STORIES} from './copy/dinner-stories.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {DINNER_PRESENTATION_ASSETS} from './dinner-story-assets.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {inspectDailyFallbackCatalog} from './daily-fallback-scenes.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {inspectLifeSceneCatalog} from './life-scene-schema.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {mangaLibraryEntries} from './manga-collection-model.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';

// A browse-only projection of the existing complete scripts and their own art.
// No game state, receipt, trigger, achievement or natural-reading memory is used.
export function originalStoryLibraryEntries(){
 const published=new Map(mangaLibraryEntries('fan').map(entry=>[entry.sha256,entry]));
 const pairs=(scripts,assets,category)=>Object.entries(scripts).map(([id,script])=>({id,script,art:assets[id],category}));
 const candidates=[
  ...pairs({...ACTION_SCENES,...APPROVED_FOUR_SKITS},{...COMIC_PRESENTATION_ASSETS,...APPROVED_FOUR_SKIT_ASSETS},'日常小剧场'),
  ...pairs(DINNER_STORIES,DINNER_PRESENTATION_ASSETS,'饭局'),
  ...inspectDailyFallbackCatalog().accepted.map(script=>({id:script.id,script,art:script.art,category:'日常小事'})),
  ...inspectLifeSceneCatalog().accepted.map(script=>({id:script.id,script,art:script.art,category:'生活'})),
 ];
 const seen=new Set(),entries=[];
 for(const {id,script,art,category} of candidates){
  const library=published.get(art?.sha256),people=script.people??script.characters?.length;
  if(!library||!library.paths.includes(art.path)||art.reviewed!==true||art.panels!==4||art.grid||art.people!==people)continue;
  if(script.dialogueId&&art.dialogueId!==script.dialogueId)continue;
  const panels=script.dialoguePanels||script.lines?.map(line=>({lines:[line]}));
  if(panels?.length!==4||!panels.every(panel=>Array.isArray(panel.lines)&&panel.lines.every(line=>Array.isArray(line)&&line.length===2&&line.every(value=>typeof value==='string')))||!panels.some(panel=>panel.lines.length))continue;
  const identity=art.sha256+':'+JSON.stringify(panels);
  if(seen.has(identity))continue;seen.add(identity);
  entries.push({id,title:script.title,category,ready:true,art:structuredClone(art),dialoguePanels:structuredClone(panels),lines:panels.flatMap(panel=>structuredClone(panel.lines))});
 }
 return entries;
}
