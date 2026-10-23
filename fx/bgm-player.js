import {AudioEnvelope} from './audio-envelope.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {assetURL} from './assets.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {BGM_CATALOG,BGM_SCENE_TAGS,validateBgmCatalog} from './bgm-catalog.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';

const clamp=(value,min,max,fallback)=>Number.isFinite(value)?Math.max(min,Math.min(max,value)):fallback;
const gesture=event=>event?.isTrusted===true&&!event.repeat&&['click','pointerdown','keydown'].includes(event.type);
const progress=(now,start,duration)=>Math.min(1,Math.max(0,(now-start)/duration));
// Prefer another recording with the same tag. Sparse catalogs can continue in
// a neighboring mood without jumping from a profit scene straight into crisis.
const companionTags=Object.freeze({neutral:['neutral','focus'],focus:['focus','neutral'],
  tension:['tension','focus'],gain:['gain','relief'],loss:['loss','crisis','numb'],
  crisis:['crisis','loss','numb'],numb:['numb','loss'],relief:['relief','neutral']});

// No media source, preload, audio graph or playback is started by construction.
// Scene tags are supplied by the host. This player never interprets money or plot.
export class BgmPlayer {
  constructor({tracks=BGM_CATALOG,makeAudio=()=>new Audio(),now=()=>performance.now(),
    schedule=(fn,ms)=>{const id=setTimeout(fn,ms);id.unref?.();return id;},cancel=id=>clearTimeout(id),
    envelope,unlockAudio=()=>true,resolveSrc=src=>assetURL(src),onUpdate=()=>{},
    volume=.35,crossfadeMs=1200,duckFactor=.28,loadTimeoutMs=15000,sceneStableMs=4000,sceneCooldownMs=20000}={}) {
    this.tracks=validateBgmCatalog(tracks);this.now=now;this.schedule=schedule;this.cancel=cancel;
    // BGM uses the native media-volume envelope: never attach it to a suspended
    // shared voice/SFX AudioContext. Native play() remains subject to browser policy.
    this.envelope=envelope||new AudioEnvelope({now,schedule,cancel,getGraph:()=>null});this.unlockAudio=unlockAudio;this.resolveSrc=resolveSrc;
    this.volume=clamp(volume,0,.65,.35);this.crossfadeMs=clamp(crossfadeMs,100,5000,1200);
    this.duckFactor=clamp(duckFactor,.05,1,.28);this.loadTimeoutMs=clamp(loadTimeoutMs,1000,60000,15000);
    this.sceneStableMs=clamp(sceneStableMs,0,30000,4000);this.sceneCooldownMs=clamp(sceneCooldownMs,0,120000,20000);
    this.sceneTimer=null;this.pendingScene=null;this.lastSceneSwitch=-Infinity;
    this.mode='follow';this.scene='neutral';this.followedScene='neutral';this.selectedId=this.tracks.find(t=>t.sceneTags.includes(this.scene))?.id||this.tracks[0]?.id||null;
    this.onPreference=()=>{};this.muted=true;this.wanted=false;this.unlocked=false;this.hidden=false;this.destroyed=false;
    this.voiceActive=false;this.duckLevel=1;this.generation=0;this.error=null;this.fade=null;this.duck=null;this.timers=new Set();this.frame=null;
    this.listeners=new Set([onUpdate]);this.decks=Array.from({length:2},()=>{
      const media=makeAudio();media.preload='none';media.volume=0;media.loop=false;
      const deck={media,track:null,record:null,weight:0,playing:false,pending:false,token:0};
      deck.onError=()=>{if(deck.pending||deck.playing)this._failed(deck,deck.token,new Error('Media unavailable'));};
      // Some browsers accept a zero-volume play(), then pause when its fade becomes audible.
      deck.onPause=()=>{if(deck.playing&&media.paused&&!media.ended&&this._allowed())this._failed(deck,deck.token,{name:'NotAllowedError'});};
      deck.onEnded=()=>this._ended(deck);
      media.addEventListener('error',deck.onError);media.addEventListener('pause',deck.onPause);media.addEventListener('ended',deck.onEnded);return deck;
    });
  }
  getState() {
    const loading=this.decks.some(deck=>deck.pending),playing=this.decks.some(deck=>deck.playing);
    const status=this.destroyed?'destroyed':!this.tracks.length?'empty':this.error?'error':this.hidden?'hidden':this.muted?'muted':loading?'loading':playing?'playing':'paused';
    return Object.freeze({status,mode:this.mode,scene:this.scene,selectedId:this.selectedId,
      track:this.tracks.find(track=>track.id===this.selectedId)||null,tracks:this.tracks,volume:this.volume,
      muted:this.muted,playing,loading,wanted:this.wanted,unlocked:this.unlocked,hidden:this.hidden,
      voiceActive:this.voiceActive,ducked:this.voiceActive,error:this.error,destroyed:this.destroyed});
  }
  subscribe(listener) {this.listeners.add(listener);listener(this.getState());return ()=>this.listeners.delete(listener);}
  _emit() {const state=this.getState();for(const listener of this.listeners)listener(state);}
  _allowed() {return !this.destroyed&&!this.hidden&&!this.muted&&this.wanted&&this.unlocked;}
  _schedule(fn,ms) {
    const generation=this.generation;let id;
    id=this.schedule(()=>{this.timers.delete(id);if(generation===this.generation&&!this.destroyed)fn();},ms);
    this.timers.add(id);return id;
  }
  _cancelTimer(id) {if(id!==null&&id!==undefined){this.cancel(id);this.timers.delete(id);}}
  _release(deck,{unload=false}={}) {
    deck.token++;deck.pending=false;deck.playing=false;deck.weight=0;
    this.envelope.stop(deck.media);deck.record=null;deck.media.volume=0;deck.media.pause();
    if(unload){deck.track=null;deck.media.removeAttribute?.('src');deck.media.load?.();}
  }
  _invalidate() {
    this.generation++;for(const timer of this.timers)this.cancel(timer);this.timers.clear();this.frame=null;this.fade=null;this.duck=null;
    const target=this.voiceActive?this.duckFactor:1;
    if(this._allowed()&&this.duckLevel!==target)this.duck={at:this.now(),duration:this.voiceActive?100:500,from:this.duckLevel,to:target};
    else this.duckLevel=target;
    for(const deck of this.decks)if(deck.pending)this._release(deck,{unload:true});
  }
  _silence({unload=false}={}) {this._invalidate();this.duck=null;this.duckLevel=this.voiceActive?this.duckFactor:1;for(const deck of this.decks)this._release(deck,{unload});}
  _level(deck) {
    if(!deck.record)return;
    deck.record.target=this.volume*this.duckLevel;
    this.envelope.setLevel(deck.media,deck.record,this._allowed()?deck.weight:0);
  }
  _animate() {
    if(!this._allowed())return;
    const now=this.now();
    if(this.duck){const t=progress(now,this.duck.at,this.duck.duration);this.duckLevel=this.duck.from+(this.duck.to-this.duck.from)*t;if(t===1)this.duck=null;}
    if(this.fade){
      const fade=this.fade,t=progress(now,fade.at,fade.duration);
      this.decks.forEach((deck,i)=>{deck.weight=fade.from[i]+(fade.to[i]-fade.from[i])*t;});
      if(t===1){this.fade=null;this.decks.forEach((deck,i)=>{if(fade.to[i]===0&&deck.playing)this._release(deck,{unload:true});});}
    }
    for(const deck of this.decks)this._level(deck);
    if((this.fade||this.duck)&&this.frame===null)this.frame=this._schedule(()=>{this.frame=null;this._animate();},16);
  }
  _fadeTo(deck) {
    const from=this.decks.map(item=>item.weight),to=this.decks.map(item=>item===deck?1:0);
    this.fade={at:this.now(),duration:this.crossfadeMs,from,to};this._animate();
  }
  _failed(deck,token,error) {
    if(this.destroyed||deck.token!==token||(!deck.pending&&!deck.playing))return false;
    const blocked=error?.name==='NotAllowedError';this._invalidate();this._release(deck,{unload:true});
    this.error=blocked?'blocked':'unavailable';
    // Browser policy is not a user mute preference. Keep intent for a real gesture.
    if(blocked){this.unlocked=false;this._silence();}
    else{
      const fallback=this.decks.find(item=>item.playing);
      if(fallback){this.selectedId=fallback.track.id;this._fadeTo(fallback);}
    }
    this._emit();return false;
  }
  _playlist(tag) {
    const exact=this.tracks.filter(track=>track.sceneTags.includes(tag));
    if(exact.length>1)return exact;
    const tags=companionTags[tag]||[tag];
    const nearby=this.tracks.filter(track=>track.sceneTags.some(scene=>tags.includes(scene)));
    return nearby.length?nearby:exact;
  }
  _ended(deck) {
    // An outgoing deck can finish during a crossfade. It must never replace the
    // newer manual pick, nor can a late ended event revive a paused/hidden player.
    if(this.destroyed||!deck.playing||!deck.media.ended)return;
    const current=deck.track?.id===this.selectedId;
    const previous=deck.track?.id;
    this._release(deck,{unload:true});
    if(!current||!this._allowed()){this._emit();return;}
    const playlist=this.mode==='follow'?this._playlist(this.followedScene):this.tracks;
    const index=playlist.findIndex(track=>track.id===previous);
    const next=playlist[(index+1)%playlist.length];
    if(next)void this.selectTrack(next.id,{manual:this.mode==='manual'});
    else this._emit();
  }
  async _begin(track) {
    if(!track||!this._allowed())return false;
    const existing=this.decks.find(deck=>deck.track?.id===track.id&&(deck.playing||deck.pending));
    if(existing){
      const index=this.decks.indexOf(existing);
      const pendingOther=this.decks.some(item=>item!==existing&&item.pending);
      const headingElsewhere=this.fade&&this.fade.to[index]!==1;
      if(existing.playing&&(pendingOther||headingElsewhere||(!this.fade&&existing.weight<1))){this._animate();this._invalidate();this._fadeTo(existing);}
      return true;
    }
    this._animate();this._invalidate();this.error=null;
    const resumed=this.decks.find(deck=>deck.track?.id===track.id);
    const deck=resumed||[...this.decks].sort((a,b)=>a.weight-b.weight)[0];
    this._release(deck,{unload:deck.track?.id!==track.id});
    const token=++deck.token,generation=this.generation;
    deck.track=track;deck.pending=true;
    try{
      if(!resumed){deck.media.src=this.resolveSrc(track.src);deck.media.currentTime=0;}
      deck.record=this.envelope.prepare(deck.media,{target:this.volume*this.duckLevel});deck.graph=deck.record.graph;
      const timeout=this._schedule(()=>this._failed(deck,token,new Error('BGM loading timeout')),this.loadTimeoutMs);
      this._emit();
      if(generation!==this.generation||deck.token!==token||!this._allowed())return false;
      this._animate();
      // play() is invoked synchronously in the initiating gesture, before awaiting.
      await deck.media.play();this._cancelTimer(timeout);
      if(generation!==this.generation||deck.token!==token||!this._allowed()){
        // Do not pause a newer request that has since reused this same media node.
        if(deck.token===token||(!deck.pending&&!deck.playing))this._release(deck,{unload:true});return false;
      }
      deck.pending=false;deck.playing=true;this._fadeTo(deck);this._emit();return true;
    }catch(error){return this._failed(deck,token,error);}
  }
  _unlock(event) {
    if(this.unlocked)return true;
    if(!gesture(event))return false;
    this.unlockAudio(event);this.unlocked=true;return true;
  }
  // One ordinary autoplay attempt. Never wake/resume an AudioContext without a gesture.
  startAutomatically() {
    if(this.destroyed||!this.tracks.length)return Promise.resolve(false);
    this.wanted=true;this.muted=false;this.unlocked=true;this.error=null;this._emit();
    return this._begin(this.tracks.find(track=>track.id===this.selectedId));
  }
  _remember() {this.onPreference(this.getState());}
  play(event) {
    if(this.destroyed||!this.tracks.length||!this._unlock(event))return Promise.resolve(false);
    this.wanted=true;this.muted=false;this.error=null;this._remember();this._emit();
    return this._begin(this.tracks.find(track=>track.id===this.selectedId));
  }
  pause({remember=true}={}) {if(this.destroyed)return;this.wanted=false;this._silence();this.error=null;if(remember)this._remember();this._emit();}
  stop() {if(this.destroyed)return;this.wanted=false;this._silence({unload:true});this.error=null;this._remember();this._emit();}
  setMuted(value,event) {
    if(this.destroyed)return Promise.resolve(false);
    if(value){this.muted=true;this._silence();this.error=null;this._remember();this._emit();return Promise.resolve(true);}
    // Unmute is an explicit playback action; the first one needs a real gesture.
    return this.play(event);
  }
  setVolume(value) {
    if(this.destroyed)return;this.volume=clamp(value,0,.65,this.volume);this._animate();this._remember();this._emit();
  }
  selectTrack(id,{manual=true,event}={}) {
    if(this.destroyed)return Promise.resolve(false);
    const track=this.tracks.find(item=>item.id===id);if(!track)return Promise.resolve(false);
    if(manual){this._cancelScene();this.mode='manual';}this.selectedId=id;this.error=null;if(manual)this._remember();
    // Selecting a track while muted/paused only selects; it does not opt into sound.
    this._emit();return this._allowed()?this._begin(track):Promise.resolve(true);
  }
  next({event}={}) {
    const index=this.tracks.findIndex(track=>track.id===this.selectedId),next=this.tracks[(index+1)%this.tracks.length];
    return next?this.selectTrack(next.id,{event}):Promise.resolve(false);
  }
  _cancelScene() {
    if(this.sceneTimer!==null)this.cancel(this.sceneTimer);
    this.sceneTimer=null;this.pendingScene=null;
  }
  _followScene(tag) {
    if(this.destroyed||this.mode!=='follow')return Promise.resolve(false);
    const track=this.tracks.find(item=>item.id===this.selectedId&&item.sceneTags.includes(tag))||this.tracks.find(item=>item.sceneTags.includes(tag));
    if(!track)return Promise.resolve(false);
    this.followedScene=tag;
    if(track.id!==this.selectedId)this.lastSceneSwitch=this.now();
    return this.selectTrack(track.id,{manual:false});
  }
  setMode(mode) {
    if(this.destroyed||!['manual','follow'].includes(mode))return Promise.resolve(false);
    this._cancelScene();this.mode=mode;this._remember();this._emit();
    // Explicitly opting into automatic selection applies the latest scene now.
    return mode==='follow'?this._followScene(this.scene):Promise.resolve(true);
  }
  setScene(tag,{stabilize=false}={}) {
    if(this.destroyed||!BGM_SCENE_TAGS.includes(tag))return Promise.resolve(false);
    // Render ticks are not a retry policy. A failed recording stays failed until
    // an explicit playback/selection action or a genuinely different scene.
    if(tag===this.scene&&this.error)return Promise.resolve(false);
    const changed=tag!==this.scene;this.scene=tag;if(changed)this._emit();
    if(this.mode!=='follow'){this._cancelScene();return Promise.resolve(true);}
    // Natural continuation owns the current playlist until the scene changes.
    // Repeated render ticks must not switch a neighboring recording back again.
    if(this.followedScene===tag&&this._playlist(tag).some(track=>track.id===this.selectedId)){
      this._cancelScene();return Promise.resolve(true);
    }
    const compatible=this.tracks.find(item=>item.id===this.selectedId)?.sceneTags.includes(tag);
    if(!stabilize||compatible){this._cancelScene();return this._followScene(tag);}
    if(this.pendingScene===tag)return Promise.resolve(true);
    this._cancelScene();this.pendingScene=tag;
    // Independent of playback/fade generations; scene changes and manual picks
    // cancel this timer. Continuous render ticks must not restart its debounce.
    const delay=Math.max(this.sceneStableMs,this.lastSceneSwitch+this.sceneCooldownMs-this.now());
    this.sceneTimer=this.schedule(()=>{
      this.sceneTimer=null;this.pendingScene=null;
      if(!this.destroyed&&this.mode==='follow'&&this.scene===tag)void this._followScene(tag);
    },delay);
    return Promise.resolve(true);
  }
  setVoiceActive(value) {
    if(this.destroyed)return;const active=Boolean(value);if(active===this.voiceActive)return;
    this._animate();this.voiceActive=active;const target=active?this.duckFactor:1;
    if(this._allowed()&&this.decks.some(deck=>deck.playing)){
      this.duck={at:this.now(),duration:active?100:500,from:this.duckLevel,to:target};this._animate();
    }else{this.duck=null;this.duckLevel=target;}
    this._emit();
  }
  setHidden(value) {
    if(this.destroyed||this.hidden===Boolean(value))return;this.hidden=Boolean(value);
    if(this.hidden)this._silence();else if(this._allowed())void this._begin(this.tracks.find(track=>track.id===this.selectedId));
    this._emit();
  }
  destroy() {
    if(this.destroyed)return;this._cancelScene();this.wanted=false;this.muted=true;this._silence({unload:true});this.destroyed=true;
    for(const deck of this.decks){deck.media.removeEventListener('error',deck.onError);deck.media.removeEventListener('pause',deck.onPause);deck.media.removeEventListener('ended',deck.onEnded);deck.graph?.source?.disconnect();deck.graph?.gain?.disconnect();deck.graph=null;}
    this._emit();this.listeners.clear();
  }
}

// Includes bfcache pagehide/pageshow; a stale visibility event cannot resume a left page.
export function bindBgmLifecycle(player,{document=globalThis.document,page=globalThis.window}={}) {
  let pageHidden=false;
  const visibility=()=>player.setHidden(pageHidden||Boolean(document?.hidden));
  const hide=()=>{pageHidden=true;visibility();},show=()=>{pageHidden=false;visibility();};
  document?.addEventListener('visibilitychange',visibility);page?.addEventListener('pagehide',hide);page?.addEventListener('pageshow',show);visibility();
  return ()=>{document?.removeEventListener('visibilitychange',visibility);page?.removeEventListener('pagehide',hide);page?.removeEventListener('pageshow',show);};
}
