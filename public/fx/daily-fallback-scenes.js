import {DAILY_FALLBACK_CATALOG} from './daily-fallback-catalog.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {sealedDailyMangaOutcome} from './manga-context.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {isDailyFamilyNarrative} from './daily-family-art.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {artIdentity,dailyArtMemory} from './daily-art-memory.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {tradingTrauma} from './trading-trauma.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {dailyRoutineSceneAllowed} from './daily-narrative-facts.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';

export const DAILY_FALLBACK_MAX_DAY=50;
const contexts=new Set(['quiet','roommate']),outcomes=new Set(['flat','profit','loss']);
const strings=value=>Array.isArray(value)&&value.every(v=>typeof v==='string'&&v.length>0);
const subset=(value,allowed)=>strings(value)&&value.length>0&&value.every(v=>allowed.has(v));
const cropValid=(rect,art)=>Array.isArray(rect)&&rect.length===4&&rect.every(Number.isFinite)&&rect[0]>=0&&rect[1]>=0&&rect[2]>0&&rect[3]>0&&rect[0]+rect[2]<=art.width&&rect[1]+rect[3]<=art.height;
const panelValid=panel=>panel&&typeof panel.action==='string'&&panel.action.trim()&&Array.isArray(panel.lines)&&panel.lines.every(line=>Array.isArray(line)&&line.length===2&&line.every(v=>typeof v==='string'&&v.trim()));
function valid(entry){
 const art=entry?.art,requires=entry?.requires;
 return entry?.approved===true&&entry.enabled!==false&&/^daily-life-[a-z0-9-]+$/.test(entry.id)&&Number.isInteger(entry.order)&&entry.order>=0&&
  typeof entry.title==='string'&&entry.title.trim()&&subset(entry.contexts,contexts)&&subset(entry.outcomes,outcomes)&&
  ['any','clear','active'].includes(entry.trauma)&&Number.isInteger(entry.fromDay)&&Number.isInteger(entry.toDay)&&entry.fromDay>=1&&entry.toDay<=DAILY_FALLBACK_MAX_DAY&&entry.fromDay<=entry.toDay&&
  requires&&strings(requires.story)&&strings(requires.arcs)&&strings(requires.fallback)&&
  strings(entry.characters)&&entry.characters.length>0&&new Set(entry.characters).size===entry.characters.length&&
  (!entry.characters.includes('萌智子')||requires.story.includes('friendStudy'))&&
  (!entry.characters.some(name=>['康子','安子'].includes(name))||requires.story.includes('roommate')||(entry.contexts.length===1&&entry.contexts[0]==='roommate'))&&
  Array.isArray(entry.dialoguePanels)&&entry.dialoguePanels.length===4&&entry.dialoguePanels.every(panelValid)&&entry.dialoguePanels.some(panel=>panel.lines.length>0)&&entry.dialoguePanels.every(panel=>panel.lines.every(([speaker])=>entry.characters.includes(speaker)))&&
  art?.reviewed===true&&art.independentComic===true&&art.dialogueId===entry.id&&art.people===entry.characters.length&&art.panels===4&&!art.grid&&typeof art.path==='string'&&/^\.\/generated\/(?:[a-z0-9_-]+\/)*[a-z0-9_-]+\.(?:webp|png|jpg)$/.test(art.path)&&
  /^[a-f0-9]{64}$/.test(art.sha256)&&Number.isFinite(art.width)&&art.width>0&&Number.isFinite(art.height)&&art.height>0&&
  Array.isArray(art.panelRects)&&art.panelRects.length===4&&art.panelRects.every(rect=>cropValid(rect,art));
}
// Counts are development diagnostics, never a claim of complete daily coverage.
// Ambiguous duplicate IDs, scripts or images are all excluded, not first-wins.
export function inspectDailyFallbackCatalog(catalog=DAILY_FALLBACK_CATALOG){
 const all=Array.isArray(catalog)?catalog:[],keys=entry=>[entry.id,artIdentity(entry.art),JSON.stringify(entry.dialoguePanels?.map(p=>p.lines))];
 const counts=[new Map(),new Map(),new Map()];
 for(const entry of all.filter(valid))keys(entry).forEach((key,i)=>counts[i].set(key,(counts[i].get(key)||0)+1));
 const accepted=[],rejected=[];
 for(const entry of all){if(!valid(entry)){rejected.push({id:entry?.id||null,reason:'incomplete-or-unapproved'});continue;}
  if(keys(entry).some((key,i)=>counts[i].get(key)>1)){rejected.push({id:entry.id,reason:'duplicate-content'});continue;}
  accepted.push(entry);
 }
 accepted.sort((a,b)=>a.order-b.order||a.id.localeCompare(b.id));
 return {accepted,rejected,readyCount:accepted.length};
}
export function dailyFallbackCandidates(state,narrative,{catalog=DAILY_FALLBACK_CATALOG,memory=dailyArtMemory,allowExhaustedActivity=false}={}){
 const outcome=sealedDailyMangaOutcome(state);
 if(narrative?.day!==undefined&&narrative.day!==state?.day)return [];
 if(state?.mode!=='story'||!outcome||!dailyRoutineSceneAllowed(state)||state.day<1||state.day>DAILY_FALLBACK_MAX_DAY||isDailyFamilyNarrative(narrative))return [];
 // Only the daily selector opens this route after validating a real activity.
 // Its image can be exhausted; its receipt, bill and narrative stay untouched.
 if(!allowExhaustedActivity&&(state.recapChoiceLedger||[]).some(r=>r.day===state.day))return [];
 const event=narrative?.event?.key,context=!event||event==='quietNight'?'quiet':event==='roommate'?'roommate':null;
 if(!context)return [];
 const trauma=tradingTrauma(state).active;
 return inspectDailyFallbackCatalog(catalog).accepted.filter(entry=>
  state.day>=entry.fromDay&&state.day<=entry.toDay&&entry.contexts.includes(context)&&entry.outcomes.includes(outcome.kind)&&
  (entry.trauma==='any'||(entry.trauma==='active')===trauma)&&
  entry.requires.story.every(id=>state.story?.seen?.includes(id))&&entry.requires.arcs.every(id=>memory.has(`arc:${id}`))&&
  entry.requires.fallback.every(id=>memory.has(`daily-fallback:${id}`))
 ).map(entry=>({id:entry.id,title:entry.title,ready:true,art:structuredClone(entry.art),dialoguePanels:structuredClone(entry.dialoguePanels),
  lines:entry.dialoguePanels.flatMap(panel=>structuredClone(panel.lines)),identity:artIdentity(entry.art),arcIdentity:`daily-fallback:${entry.id}`}));
}
