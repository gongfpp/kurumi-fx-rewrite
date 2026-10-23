import {createGameStorage} from '../storage.js?v=295e20358213d4ea13e57d98c0bfc3b6ffe341ec-23f2a20b7717';
import {createSaveSession} from '../save-session.js?v=295e20358213d4ea13e57d98c0bfc3b6ffe341ec-23f2a20b7717';
import {createMangaStory,restoreMangaStory,chooseMangaStory,STORY_KEY as LEGACY_KEY} from './engine.js?v=295e20358213d4ea13e57d98c0bfc3b6ffe341ec-23f2a20b7717';
export {LEGACY_KEY};
export const CHAPTER_KEY='fx-original-chapter-01-v1';
const PREFIX='kurumi-fx:';
const backupKey=key=>key.startsWith(CHAPTER_KEY+'-protected-')&&/^[-a-zA-Z0-9]{1,100}$/.test(key.slice((CHAPTER_KEY+'-protected-').length));
// This adapter cannot write the main game, network identity, or original chapter.
export function chapterStorage(raw){
 return {
  getItem(key){
   if(key===LEGACY_KEY)return raw.getItem(PREFIX+key)??raw.getItem(key);
   if(key!==CHAPTER_KEY&&!backupKey(key))throw Error('Outside chapter storage');
   return raw.getItem(PREFIX+key);
  },
  setItem(key,value){if(key!==CHAPTER_KEY&&!backupKey(key))throw Error('Chapter slot is read-only');raw.setItem(PREFIX+key,String(value));}
 };
}
export function chapterStorageEvent(key){return key===null||[CHAPTER_KEY,LEGACY_KEY].some(k=>key===PREFIX+k||key===k);}
export function chapterFrames(state){
 const verified=restoreMangaStory(state);if(!verified)return [];
 const frames=[createMangaStory(verified.runId)];
 for(const action of verified.actions)frames.push(chooseMangaStory(frames.at(-1),action.choice,action.scene));
 return frames;
}
export function createChapterProgress({resolve=()=>globalThis.localStorage,locks=globalThis.navigator?.locks,id=()=>globalThis.crypto.randomUUID()}={}){
 const storage=createGameStorage(()=>chapterStorage(resolve()));
 const session=createSaveSession({storage,key:CHAPTER_KEY,legacyKey:LEGACY_KEY,restore:restoreMangaStory,locks});
 let state=restoreMangaStory(session.raw)||createMangaStory(id()),busy=false;
 const legacyPreview=()=>!session.blocked&&session.raw!==null&&storage.readItem(CHAPTER_KEY).value===null;
 const snapshot=()=>structuredClone(state);
 async function exclusive(work){if(busy)return {ok:false,reason:'busy'};busy=true;try{return await work();}finally{busy=false;}}
 return {
  session,get state(){return snapshot();},get busy(){return busy;},get needsLegacyConsent(){return legacyPreview();},
  get unsafeToLeave(){return busy||session.status==='memory'||session.status==='pending'||session.localRaw!==session.raw;},
  backup:()=>session.backup(snapshot()),
  async choose(choice,scene){return exclusive(async()=>{
   if(!session.check())return {ok:false,reason:session.status};
   if(legacyPreview())return {ok:false,reason:'legacy-confirmation'};
   try{state=chooseMangaStory(state,choice,scene);}catch(error){return {ok:false,reason:error.message};}
   const saved=await session.save(state);return {ok:true,saved,state:snapshot()};
  });},
  async acceptLegacy(){return exclusive(async()=>legacyPreview()?{ok:await session.save(state)}:{ok:false,reason:'no-legacy-preview'});},
  async retry(){return exclusive(async()=>legacyPreview()?{ok:false,reason:'legacy-confirmation'}:{ok:await session.save(state)});},
  reload(){if(busy)return {ok:false,reason:'busy'};const loaded=session.reload();if(loaded.ok)state=loaded.state||createMangaStory(id());return loaded;},
  async restart(){return exclusive(async()=>{
   if(!session.check())return {ok:false,reason:session.status};
   if(!locks?.request)return {ok:false,reason:'coordination'};
   const key=CHAPTER_KEY+'-protected-'+id(),text=JSON.stringify(session.backup(state));
   const archived=await locks.request('fx-progress:'+CHAPTER_KEY,{mode:'exclusive'},()=>{
    if(!session.check())return false;
    const prior=storage.readItem(key);if(!prior.available||prior.value!==null)return false;
    return storage.setItem(key,text)&&storage.readItem(key).value===text;
   });
   if(!archived)return {ok:false,reason:'backup-failed'};
   const fresh=createMangaStory(id());
   if(!await session.save(fresh))return {ok:false,reason:session.status,backupKey:key};
   state=fresh;return {ok:true,backupKey:key};
  });},
  async recover(){return exclusive(async()=>{
   if(session.status!=='invalid')return {ok:false,reason:'invalid-request'};
   if(!locks?.request)return {ok:false,reason:'coordination'};
   const current=storage.readItem(CHAPTER_KEY),legacy=current.available&&current.value===null?storage.readItem(LEGACY_KEY):null;
   const raw=current.value??legacy?.value;if(!current.available||legacy&&!legacy.available||typeof raw!=='string'||restoreMangaStory(raw))return {ok:false,reason:'changed'};
   const key=CHAPTER_KEY+'-protected-'+id(),fresh=createMangaStory(id());
   const result=await locks.request('fx-progress:'+CHAPTER_KEY,{mode:'exclusive'},()=>{
    const now=storage.readItem(CHAPTER_KEY),old=legacy?storage.readItem(LEGACY_KEY):null;
    if(!now.available||now.value!==current.value||old&&(!old.available||old.value!==legacy.value))return {ok:false,reason:'changed'};
    const prior=storage.readItem(key);if(!prior.available||prior.value!==null)return {ok:false,reason:'backup-key'};
    if(!storage.setItem(key,raw)||storage.readItem(key).value!==raw)return {ok:false,reason:'backup-failed'};
    if(!storage.setItem(CHAPTER_KEY,JSON.stringify(fresh)))return {ok:false,reason:'write-failed',backupKey:key};
    return {ok:true,backupKey:key};
   });
   if(result.ok){const loaded=session.reload();if(!loaded.ok)return loaded;state=loaded.state;}
   return result;
  });}
 };
}
