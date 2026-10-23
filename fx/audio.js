import {ReceiptAudioBank,receiptCueProfile} from './receipt-audio.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {synthesizeTerminalCue} from './audio-fallback.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {TERMINAL_SOUND_CUES} from './terminal-cues.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {scheduleAudioTimeline} from './audio-timeline.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {AudioEnvelope,getSafeAudioContext,connectScheduledAudio} from './audio-envelope.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {assetURL} from './assets.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';

function volume(value,fallback){return Number.isFinite(Number(value))?Math.max(0,Math.min(1,Number(value))):fallback;}

// Original, gently enveloped electronic cues inspired by the anime's trading
// terminal scenes. These are not extracted anime recordings; see sfx/SOURCES.json.
export const FX_SOUND_FILES=Object.freeze({click:'terminal-tap',gain:'profit-notice',loss:'risk-notice',draw:'news-notice',win:'success-notice',defend:'order-confirm',exhaust:'order-close',rattle:'quote-tick',play:'order-confirm',unlock:'success-notice',power:'order-confirm',dividend:'profit-notice',upgrade:'success-notice'});
const COOLDOWN={click:100,gain:350,loss:950,draw:650,win:900,defend:250,exhaust:250};

export class FXAudio{
 constructor({createAudio=()=>document.createElement('audio'),hidden=()=>document.hidden,onError=()=>{},now=()=>performance.now()}={}){
  this.envelope=new AudioEnvelope({now});this.createAudio=createAudio;this.hidden=hidden;this.onError=onError;this.now=now;this.pool=new Map();this.unlocked=false;this.prefs={sound:false};this.reported=new Set();this.lastPlayed=new Map();this.lastAny=-Infinity;this.timelines=new Set();this.buffers=new Map();this.receiptBanks=new WeakMap();this.receiptPiano=null;this.receiptPianoBuffer=null;this.pianoAttempts=0;this.pianoNextRetry=0;this.visibility=()=>this.sync();globalThis.document?.addEventListener('visibilitychange',this.visibility);
 }
 make(file,label){
  const a=this.createAudio();a.src=assetURL(`./sfx/${file}.mp3`);a.preload='none';a.dataset.audio=`fx-${label}`;a.hidden=true;
  if(typeof document!=='undefined')document.body.append(a);
  a.addEventListener('error',()=>this.report(label));return a;
 }
 report(label){if(!this.reported.has(label)){this.reported.add(label);this.onError(label);}}
 configure(prefs){this.prefs={...this.prefs,...prefs};this.sync();if(!this.prefs.sound)this.stopEffects();}
 unlock(){this.unlocked=true;this.preloadTimeline();for(const timeline of [...this.timelines])timeline.activate?.();}
 preloadTimeline(){if(getSafeAudioContext())void this.loadReceiptPiano().catch(()=>{});if(getSafeAudioContext())for(const kind of ['terminal-tap','terminal-fill','terminal-close','outcome-profit','outcome-loss','recap-rise','recap-fall','recap-land-profit','recap-land-loss'])void this.loadBuffer(kind).catch(()=>{});}
 loadBuffer(kind){const spec=TERMINAL_SOUND_CUES[kind];if(!spec)return Promise.reject(new Error('Unknown sample'));const file=spec.file;if(!this.buffers.has(file)){const context=getSafeAudioContext();const pending=fetch(assetURL(`./sfx/${file}.mp3`)).then(r=>{if(!r.ok)throw new Error('Sample unavailable');return r.arrayBuffer();}).then(bytes=>context.decodeAudioData(bytes));this.buffers.set(file,pending);pending.catch(()=>this.buffers.delete(file));}return this.buffers.get(file);}
 receiptBank(){const context=getSafeAudioContext();if(!context)return null;let bank=this.receiptBanks.get(context);if(!bank){bank=new ReceiptAudioBank(context,{piano:this.receiptPianoBuffer});this.receiptBanks.set(context,bank);}if(this.receiptPianoBuffer)bank.setPiano(this.receiptPianoBuffer);return bank;}
 loadReceiptPiano(){if(!this.receiptPiano){if(this.pianoAttempts>=3||this.now()<this.pianoNextRetry)return Promise.reject(new Error('Piano sample retry deferred'));const context=getSafeAudioContext();if(!context)return Promise.reject(new Error('Audio not unlocked'));this.pianoAttempts++;this.receiptPiano=fetch(assetURL('./sfx/receipt-c-v1/toy-piano-note.wav')).then(r=>{if(!r.ok)throw new Error('Piano sample unavailable');return r.arrayBuffer();}).then(bytes=>{if(bytes.byteLength>262144)throw new Error('Piano sample exceeds budget');return context.decodeAudioData(bytes);}).then(buffer=>{if(buffer.duration>1)throw new Error('Piano sample duration exceeds budget');this.receiptPianoBuffer=buffer;return buffer;}).catch(error=>{this.receiptPiano=null;this.pianoNextRetry=this.now()+1500;throw error;});}return this.receiptPiano;}
 async loadTimelineCue(kind,cue){const profile=receiptCueProfile(cue);if(!profile)return this.loadBuffer(kind);const bank=this.receiptBank();if(!bank)throw new Error('Audio not unlocked');if(profile.piano)await this.loadReceiptPiano().catch(()=>{});if(this.receiptPianoBuffer)bank.setPiano(this.receiptPianoBuffer);return bank.render(cue);}
 receiptFallback(cue){
  const context=getSafeAudioContext(),bank=this.receiptBank();if(context?.state!=='running'||!bank)return false;const mixed=bank.render(cue);if(!mixed)return false;
  const {buffer,profile}=mixed,rate=Math.max(.8,Math.min(1.25,Number(cue.rate)||1)),target=Math.min(.65,volume(this.prefs.soundVolume,.5)*volume(cue.level,1)*mixed.gain),at=context.currentTime;
  if(!target)return false;let source,gain,disconnect,stopped=false;const interrupted=()=>{if(context.state!=='running')stop();};
  const stop=()=>{if(stopped)return;stopped=true;context.removeEventListener?.('statechange',interrupted);try{source?.stop();}catch{}try{disconnect?.();source?.disconnect();gain?.disconnect();}catch{}};
  try{source=context.createBufferSource();gain=context.createGain();source.buffer=buffer;source.playbackRate.value=rate;gain.gain.setValueAtTime(target,at);source.connect(gain);disconnect=connectScheduledAudio({source,gain,cue,when:at,target,rate},'synthetic:receipt-c');source.onended=stop;context.addEventListener?.('statechange',interrupted);source.start(at);source.stop(at+buffer.duration/rate);return{stop,durationMs:Math.ceil(buffer.duration/rate*1000)+20,profile};}catch{stop();return false;}
 }
 scheduleTimeline(cues,{startedAt=this.now(),onTrace=()=>{}}={}){
  if(!this.prefs.sound||this.hidden())return {cancel(){},ready:Promise.resolve(),receipts:[]};
  for(const previous of [...this.timelines])previous.cancel();
  let inner=null,cancelled=false,expiry=null,resolveReady;
  const ready=new Promise(resolve=>resolveReady=resolve);
  const deadline=startedAt+Math.max(0,...cues.map(c=>Number.isFinite(c.atMs)?c.atMs:0))+180;
  const handle={ready,get receipts(){return inner?.receipts||[];},cancel:()=>{if(cancelled)return;cancelled=true;clearTimeout(expiry);inner?.cancel();this.timelines.delete(handle);resolveReady(handle);},activate:()=>{
   if(cancelled||inner||!this.unlocked||!this.prefs.sound||this.hidden())return;
   if(this.now()>deadline){handle.cancel();return;}
   clearTimeout(expiry);
   inner=scheduleAudioTimeline(cues,{context:getSafeAudioContext(),load:(kind,cue)=>this.loadTimelineCue(kind,cue),connect:entry=>connectScheduledAudio(entry,receiptCueProfile(entry.cue)?'synthetic:receipt-c':assetURL(`./sfx/${TERMINAL_SOUND_CUES[entry.cue.kind].file}.mp3`)),startedAt,now:this.now,hidden:this.hidden,allowed:()=>this.unlocked&&this.prefs.sound,level:volume(this.prefs.soundVolume,.5),fallback:cue=>{if(!this.unlocked||!this.prefs.sound||this.hidden())return false;const context=getSafeAudioContext();if(context&&receiptCueProfile(cue))return this.receiptFallback(cue);if(context)return synthesizeTerminalCue(context,cue,{level:volume(this.prefs.soundVolume,.5),connect:entry=>connectScheduledAudio(entry,'synthetic:terminal-recovery')});let voice;const accepted=this.effect(cue.kind,{...cue,onVoice:handle=>voice=handle});return accepted?(voice||true):false;},onTrace});
   inner.ready.then(()=>resolveReady(handle));
  }};
  this.timelines.add(handle);
  if(this.unlocked)handle.activate();else{expiry=setTimeout(()=>handle.cancel(),Math.max(0,deadline-this.now()));expiry.unref?.();}
  return handle;
 }
 sync(){if(this.hidden())this.stopEffects();}
 effect(kind,{rate=1,stretch=false,level=1,preview=false,audioBudgetMs,onVoice=()=>{}}={}){
  // Continuous prices stay quiet. quote-tick exists only for explicit audition.
  if(!this.unlocked||!this.prefs.sound||this.hidden()||(kind==='rattle'&&!preview)||Number.isFinite(audioBudgetMs)&&audioBudgetMs<=0)return false;
  const amplitude=volume(this.prefs.soundVolume,.5)*volume(level,1);if(amplitude===0)return false;
  const spec=TERMINAL_SOUND_CUES[kind];
  const file=spec?.file||FX_SOUND_FILES[kind]||FX_SOUND_FILES.click,label=spec||FX_SOUND_FILES[kind]?kind:'click',time=this.now();
  if(time-(this.lastPlayed.get(file)??-Infinity)<(spec?.cooldownMs??COOLDOWN[label]??350)||time-this.lastAny<65)return false;
  let voices=this.pool.get(file);if(!voices){voices=[this.make(file,label),this.make(file,label)];this.pool.set(file,voices);}
  const a=voices.find(x=>x.paused||x.ended);if(!a)return false;
  // At most two short cues overlap, even when news and settlement arrive together.
  const active=[...this.pool.values()].flat().filter(x=>!x.paused&&!x.ended);
  if(active.length>=2)return false;
  this.lastPlayed.set(file,time);this.lastAny=time;a.currentTime=0;
  const envelope=this.envelope.prepare(a,{target:amplitude,leadInSeconds:spec?0:.04,coldMs:spec?8:180,warmMs:spec?8:75,tailMs:spec?20:120});
  // A timeline owns this particular envelope, never a later reuse of the voice.
  let releaseTimer=null;
  const voice={stop:()=>{clearTimeout(releaseTimer);releaseTimer=null;if(this.envelope.records.get(a)===envelope){this.envelope.stop(a);a.pause();}},releaseWithin:ms=>{clearTimeout(releaseTimer);const budget=Math.max(0,ms),tail=Math.min(20,budget);voice.durationMs=budget;releaseTimer=setTimeout(()=>{releaseTimer=null;if(this.envelope.records.get(a)!==envelope)return;this.envelope.fadeOut(a,{duration:Math.max(1,tail),onComplete:()=>{if(!this.envelope.records.has(a))a.pause();}});},Math.max(0,budget-tail));releaseTimer.unref?.();}};
  onVoice(voice);
  if(Number.isFinite(audioBudgetMs))voice.releaseWithin(audioBudgetMs);
  a.playbackRate=Math.max(.8,Math.min(1.25,Number.isFinite(rate)?rate:1));a.preservesPitch=stretch;a.webkitPreservesPitch=stretch;
  try{const playing=a.play();if(playing?.then)playing.then(()=>this.envelope.start(a,envelope)).catch(error=>{if(this.envelope.records.get(a)!==envelope)return;this.envelope.stop(a);if(error?.name!=='AbortError'&&error?.name!=='NotAllowedError')this.report(label);});else this.envelope.start(a,envelope);}
  catch(error){this.envelope.stop(a);if(error?.name!=='AbortError'&&error?.name!=='NotAllowedError')this.report(label);return false;}
  return true;
 }
 stopEffects(){for(const timeline of [...this.timelines])timeline.cancel();for(const voices of this.pool.values())for(const a of voices){this.envelope.stop(a);a.pause();}}
 pause(){this.stopEffects();}
 dispose(){this.stopEffects();globalThis.document?.removeEventListener('visibilitychange',this.visibility);for(const voices of this.pool.values())for(const a of voices){this.envelope.dispose(a);a.remove?.();}this.pool.clear();this.buffers.clear();}
}
