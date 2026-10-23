import {LIFE_SCENE_CATALOG} from './life-scene-catalog.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {lifeActionDialogueForSource} from './life-action-dialogues.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
const options={friend:['mochiko','yasuko'],work:['convenience','cafe','bookstore','flyer','warehouse','dishwashing','campusArchive','proofreading','eventSetup','petCare','translation','remoteData','buildingCaretaker','radioMonitor','tutoring'],relax:['shrine','river','park']};
// New work sheets are limited to their reviewed identity, exact source and cast.
const additionalWorkArt=Object.freeze({
 "dishwashing": {
  "characters": [
   "久留美"
  ],
  "sha256": "feee1a39f5789a647c000a87c355279d8a818486005525ec6a3df3cf5e2d3560"
 },
 "campusArchive": {
  "characters": [
   "久留美"
  ],
  "sha256": "7d135ab115babf5abf5244816442067e9afdd1d11721f03b3e10081ce4340516"
 },
 "proofreading": {
  "characters": [
   "久留美"
  ],
  "sha256": "1b5aa938282edfe285a1ac911ceb4cc0868fc511295753fe1102c330a4e3ebb5"
 },
 "eventSetup": {
  "characters": [
   "久留美"
  ],
  "sha256": "f2d48568e37a286805820f92ef5c72bdbeaaf113039c2fccd39f8e92e4c1bcf1"
 },
 "petCare": {
  "characters": [
   "久留美"
  ],
  "sha256": "72857d6c2342adfa638b8f76a8c479a3ff6e32797071810b472f36109f9b4b5b"
 },
 "translation": {
  "characters": [
   "久留美"
  ],
  "sha256": "43dacd7fe5843b3698b525d5de30d19d1c8e7866bc3d172a851d541829a3ca13"
 },
 "remoteData": {
  "characters": [
   "久留美"
  ],
  "sha256": "8f1f39ceb31f4b55b6f3b9efd1feca5b065f9b69d14781fa8b695c6117c58f89"
 },
 "buildingCaretaker": {
  "characters": [
   "久留美",
   "匿名维修师傅"
  ],
  "sha256": "fe7a7baab726ea9c4b7bb1c6e52212f70a9424e588706f76a2b114ef29eb9b61"
 },
 "radioMonitor": {
  "characters": [
   "久留美"
  ],
  "sha256": "51550f368500594d0d9ca5da99bb4e00a3aa241fa2f2a4af2fecafddd9e53272"
 },
 "tutoring": {
  "characters": [
   "久留美",
   "匿名学生"
  ],
  "sha256": "f4201fd802f21633a466055d805fb9b5f35d3b7ee9ef387800719a3f2c7c58fe"
 }
});
const text=value=>typeof value==='string'&&value.trim().length>0;
const strings=value=>Array.isArray(value)&&value.length>0&&value.every(text)&&new Set(value).size===value.length;
const cropValid=(r,a)=>Array.isArray(r)&&r.length===4&&r.every(Number.isFinite)&&r[0]>=0&&r[1]>=0&&r[2]>0&&r[3]>0&&r[0]+r[2]<=a.width&&r[1]+r[3]<=a.height;
function valid(entry,dialogueForSource){
 const a=entry?.art;
 if(!entry||entry.approved!==true||entry.enabled===false||!options[entry.category]?.includes(entry.optionId)||
  !new RegExp(`^life-${entry.category}-${entry.optionId}-[0-9]{2}$`).test(entry.id)||!text(entry.dialogueId)||!entry.dialogueId.endsWith(`:${entry.id}`)||entry.semanticReadKey!==`life-scene:${entry.id}`||
  !Number.isSafeInteger(entry.order)||entry.order<0||!text(entry.title)||!Number.isInteger(entry.fromDay)||!Number.isInteger(entry.toDay)||entry.fromDay<1||entry.toDay<entry.fromDay||entry.toDay>50||
  !strings(entry.outcomes)||entry.outcomes.some(x=>!['flat','profit','loss'].includes(x))||!['any','clear','active'].includes(entry.trauma)||
  !strings(entry.characters)||entry.people!==entry.characters.length||!entry.characters.includes('久留美')||
  !Array.isArray(entry.dialoguePanels)||entry.dialoguePanels.length!==4||!entry.dialoguePanels.every(p=>text(p?.action)&&Array.isArray(p.lines)&&p.lines.every(line=>Array.isArray(line)&&line.length===2&&line.every(text)&&entry.characters.includes(line[0])))||!entry.dialoguePanels.some(p=>p.lines.length)||
  a?.reviewed!==true||a.independentComic!==true||a.panels!==4||a.grid||a.people!==entry.people||a.dialogueId!==entry.dialogueId||
  typeof a.path!=='string'||!/^\.\/generated\/(?:[a-z0-9_-]+\/)*[a-z0-9_-]+\.(?:webp|png|jpg)$/.test(a.path)||!/^([a-f0-9]{64})$/.test(a.sha256)||
  !Number.isFinite(a.width)||a.width<=0||!Number.isFinite(a.height)||a.height<=0||!Array.isArray(a.panelRects)||a.panelRects.length!==4||new Set(a.panelRects.map(r=>JSON.stringify(r))).size!==4||!a.panelRects.every(r=>cropValid(r,a)))return false;
 if(entry.category!=='friend'){
  const workArt=entry.category==='work'?additionalWorkArt[entry.optionId]:null;
  if(workArt){
   if(entry.id!==`life-work-${entry.optionId}-01`||entry.receiptDialogueSourceId!==`work-expansion-20261015:${entry.optionId}`||JSON.stringify(entry.characters)!==JSON.stringify(workArt.characters)||a.sha256!==workArt.sha256)return false;
  }else if(entry.people!==1)return false;
  // Existing unbound catalogs remain compatible; new routine artwork must
  // opt into the exact frozen receipt source, without renaming that source.
  if(entry.receiptDialogueSourceId==null)return true;
  const source=dialogueForSource({category:entry.category,id:entry.optionId},entry.receiptDialogueSourceId);
  return !!source&&JSON.stringify(source.lines)===JSON.stringify(entry.dialoguePanels.flatMap(p=>p.lines.map(([from,text])=>({from,text}))));
 }
 const friend=entry.optionId==='mochiko'?'萌智子':'安子';
 if(entry.people!==2||!entry.characters.includes(friend)||entry.receiptDialogueSourceId!==entry.dialogueId)return false;
 const source=dialogueForSource({category:entry.category,id:entry.optionId},entry.receiptDialogueSourceId);
 // The same complete frozen exchange drives chat, receipt and picture. Never
 // relabel a legacy receipt with new text merely because its friend matches.
 return !!source&&JSON.stringify(source.lines)===JSON.stringify(entry.dialoguePanels.flatMap(p=>p.lines.map(([from,text])=>({from,text}))));
}
export function inspectLifeSceneCatalog(catalog=LIFE_SCENE_CATALOG,{dialogueForSource=lifeActionDialogueForSource}={}){
 const all=Array.isArray(catalog)?catalog:[],good=all.filter(e=>valid(e,dialogueForSource));
 const keys=e=>[e.id,e.dialogueId,e.semanticReadKey,e.art.sha256,JSON.stringify(e.dialoguePanels),JSON.stringify(e.dialoguePanels.map(p=>p.lines)),...(e.receiptDialogueSourceId?[`source:${e.receiptDialogueSourceId}`]:[])];
 const counts=new Map();for(const e of good)keys(e).forEach((value,index)=>{const key=`${index}:${value}`;counts.set(key,(counts.get(key)||0)+1);});
 const accepted=[],rejected=[];
 for(const e of all){if(!good.includes(e)){rejected.push({id:e?.id||null,reason:'incomplete-or-unapproved'});continue;}
  if(keys(e).some((value,index)=>counts.get(`${index}:${value}`)>1)){rejected.push({id:e.id,reason:'duplicate-content'});continue;}accepted.push(e);
 }
 accepted.sort((a,b)=>a.order-b.order||a.id.localeCompare(b.id));return {accepted,rejected,readyCount:accepted.length};
}
export const lifeSceneMatches=(entry,{day,outcome,trauma})=>day>=entry.fromDay&&day<=entry.toDay&&entry.outcomes.includes(outcome)&&(entry.trauma==='any'||(entry.trauma==='active')===trauma);
