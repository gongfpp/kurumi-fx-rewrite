import {LIFE_SCENE_ART_ENTRIES} from './life-scene-art-assets.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {ASSET_USAGE_CATALOG} from './asset-usage-catalog.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {ACHIEVEMENTS,normalizeAchievementProfile} from './achievements.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {achievementManga} from './manga-achievements.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {MANGA_PANELS} from './manga-panels.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {OPENING_PAGES} from './opening-story.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {CHARACTER_STORY_NODES} from './character-story-content.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {CONTEXTUAL_MANGA_NODES} from './contextual-manga-content.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {FIRSTDAY_BACKSTORY_NODES} from './contextual-manga-firstday-backstory.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {BORROWING_CONTINUATION_NODES} from './contextual-manga-borrowing-continuation.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {LINK_DAILY_NODES} from './contextual-manga-links-content.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {REVERSAL_DAILY_NODES} from './contextual-manga-reversal-content.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {VERIFIED_DAILY_NODES} from './contextual-manga-verified-daily.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {DAILY_EXTENSION_NODES} from './contextual-manga-daily-extension.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {dailyArtMemory} from './daily-art-memory.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';

import {mangaLibrarySceneContext} from './manga-library-context.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';

const freeze=value=>{if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
const nodes=[...FIRSTDAY_BACKSTORY_NODES,...BORROWING_CONTINUATION_NODES,...LINK_DAILY_NODES,...REVERSAL_DAILY_NODES,...CHARACTER_STORY_NODES,...CONTEXTUAL_MANGA_NODES,...DAILY_EXTENSION_NODES,...VERIFIED_DAILY_NODES];
const panels=Object.values(MANGA_PANELS);
// The repayment illustration is only an emotional reference. It does not prove
// the 1.3m profit in the picture. Keep that trophy without this unlock route.
export const MANGA_COLLECTION_ACHIEVEMENT_AUDIT=freeze(ACHIEVEMENTS.map(def=>{
 const panel=achievementManga(def.id)?.panel;
 const original=panel?.kind==='original-manga'||(!panel?.kind&&Number.isFinite(panel?.chapter)&&Number.isFinite(panel?.page));
 return {id:def.id,name:def.name,condition:def.description,kind:original?'original-manga':panel?.kind||'none',sha256:original?panel.sha256:null,collectionTrigger:original&&def.id!=='fully-repaid',legacyRuleRequired:def.id==='twenty-million'?2:null};
}));
function makeCatalog(){
 const groups=new Map();
 const priority=['million-thirty','liquidated','accept-stop','hundred-times','first-profit','hold-loss','tell-everything','walkaway','twenty-million'];
 const rank=e=>e.achievementIds.length?Math.min(...e.achievementIds.map(id=>{const i=priority.indexOf(id);return i<0?99:i;})):999;
 for(const asset of ASSET_USAGE_CATALOG){
  // Identity comes from the reviewed runtime registry, never from a filename or
  // from the word "original" in a generated asset's descriptive label.
  if(asset.source.kind!=='original-manga'||!/^\.\/manga\//.test(asset.path)||! /^[a-f0-9]{64}$/.test(asset.source.sha256||''))continue;
  const key='sha256:'+asset.source.sha256;
  if(groups.has(key)){groups.get(key).paths.push(asset.path);continue;}
  const panel=panels.find(p=>p.sha256===asset.source.sha256),opening=OPENING_PAGES.find(p=>p.panelId===panel?.id);
  const node=nodes.find(n=>n.panels.some(p=>p.record===asset.source.record));
  const triggers=MANGA_COLLECTION_ACHIEVEMENT_AUDIT.filter(a=>a.collectionTrigger&&a.sha256===asset.source.sha256);
  const title=triggers[0]?.name||opening?.title||node?.title||panel?.scene||'原作片段';
  const chapter=panel?.chapter||(Number.isFinite(node?.chapter)?node.chapter:null);
  // A node can span several pages. Do not guess a panel's page by its index.
  const page=panel?.page||(node?.pages?.length===1?node.pages[0]:null);
  const encountered=opening?`在序章「${opening.title}」中看到这页漫画。`:node?`在「${node.title}」中看到这页漫画。`:'在游戏剧情中看到这页原作漫画。';
  const conditions=triggers.map(a=>a.condition);
  const condition=conditions.length?conditions.join(' 或 ')+` 也可${encountered.replace(/^在/,'在')}`:encountered;
  groups.set(key,{id:key,sha256:asset.source.sha256,path:asset.path,paths:[asset.path],title,chapter,page,
   sourceLabel:chapter?`第${chapter}话${page?` · 第${page}页`:''}`:'原作漫画',
   alt:opening?.alt||node?.panels.find(p=>p.record===asset.source.record)?.alt||`${asset.character} · ${title}`,
   dimensions:asset.source.dimensions,record:asset.source.record,condition,encountered,
   achievementIds:triggers.map(a=>a.id),source:asset.source,storyNodeIds:asset.storyNodeIds,
   context:opening?{title:opening.title,paragraphs:[opening.text]}:node?{sceneId:node.id,title:node.title,characters:typeof node.people==='string'?[node.people]:[],
    paragraphs:[node.before,...node.panels.flatMap(p=>[p.before,p.after]),node.after].filter(Boolean)}:null});
 }
 return [...groups.values()].sort((a,b)=>rank(a)-rank(b)||(a.chapter??99)-(b.chapter??99)||(a.page??99)-(b.page??99)||(a.record??999)-(b.record??999));
}
export const MANGA_COLLECTION_CATALOG=freeze(makeCatalog());
// Pure projection: opening/queue/day selection, raw balance and current mutable
// game state are intentionally not inputs. Opening the book never unlocks art.
export function mangaCollectionProgress({achievementProfile={},memory=dailyArtMemory}={}){
 const saved=normalizeAchievementProfile(achievementProfile);
 return MANGA_COLLECTION_CATALOG.map(entry=>{
  const achievements=entry.achievementIds.filter(id=>saved.unlocked[id]&&(id!=='twenty-million'||saved.unlocked[id].ruleVersion===2));
  const seen=memory?.has?.(entry.id)===true;
  return {...entry,unlocked:seen||achievements.length>0,seen,unlockedBy:seen?'seen':achievements.length?'achievement':null,triggeredAchievements:achievements};
 });
}

// Browsing is unrestricted within the already shipped runtime artwork. This
// projection never changes achievement facts or natural scene/seen records.
const fanKinds=new Set(['original-fan-art','generated-game-art']);
function makeLibraryCatalog(){
 const original=MANGA_COLLECTION_CATALOG.map(entry=>({...entry,category:'original'}));
 const seen=new Set(original.map(entry=>entry.sha256)),fan=[];
 for(const asset of [...ASSET_USAGE_CATALOG,...LIFE_SCENE_ART_ENTRIES]){
  if(!fanKinds.has(asset.source.kind)||asset.review?.status!=='verified'||asset.publication?.scope==='local-only'||!/^\.\/(?:generated|comics|expressions|homage)\//.test(asset.path)||!/^[a-f0-9]{64}$/.test(asset.source.sha256||'')||seen.has(asset.source.sha256))continue;
  seen.add(asset.source.sha256);
  const characters=(asset.characters||[]).filter(name=>name&&name!=='未核定').join('、');
  const context=mangaLibrarySceneContext(asset.source.sha256),event=context?.title||asset.emotion||asset.label;
  fan.push({id:'sha256:'+asset.source.sha256,sha256:asset.source.sha256,path:asset.path,paths:[asset.path],category:'fan',title:`${characters||context?.characters?.join('、')||asset.label} · ${event}`,sourceLabel:'同人',alt:characters||asset.label,dimensions:asset.source.dimensions,source:asset.source,storyNodeIds:asset.storyNodeIds,context});
 }
 // Separate read-only gallery entries; preserve the 202 manga identities and
 // every existing trigger/seen record. No emotion-to-outcome scene assignment.
 return original.concat(fan);
}
export const MANGA_LIBRARY_CATALOG=freeze(makeLibraryCatalog());
export function mangaLibraryEntries(category='original'){
 return MANGA_LIBRARY_CATALOG.filter(entry=>entry.category===(category==='fan'?'fan':'original'));
}
