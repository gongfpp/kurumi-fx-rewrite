import {TERMINAL_SOUND_CUES} from './terminal-cues.js?v=539d26616071e7036617b0b49726bd24af40ef2e-capture-v1-1fbef814f493';
import {AudioEnvelope} from './audio-envelope.js?v=539d26616071e7036617b0b49726bd24af40ef2e-capture-v1-1fbef814f493';
import {assetURL} from './assets.js?v=539d26616071e7036617b0b49726bd24af40ef2e-capture-v1-1fbef814f493';

function volume(value,fallback){return Number.isFinite(Number(value))?Math.max(0,Math.min(1,Number(value))):fallback;}

// Original, gently enveloped electronic cues inspired by the anime's trading
// terminal scenes. These are not extracted anime recordings; see sfx/SOURCES.json.
export const FX_SOUND_FILES=Object.freeze({click:'terminal-tap',gain:'profit-notice',loss:'risk-notice',draw:'news-notice',win:'success-notice',defend:'order-confirm',exhaust:'order-close',rattle:'quote-tick',play:'order-confirm',unlock:'success-notice',power:'order-confirm',dividend:'profit-notice',upgrade:'success-notice'});
const COOLDOWN={click:100,gain:350,loss:950,draw:650,win:900,defend:250,exhaust:250};

export class FXAudio{
 constructor({createAudio=()=>document.createElement('audio'),hidden=()=>document.hidden,onError=()=>{},now=()=>performance.now()}={}){
  this.envelope=new AudioEnvelope({now});this.createAudio=createAudio;this.hidden=hidden;this.onError=onError;this.now=now;this.pool=new Map();this.unlocked=false;this.prefs={sound:false};this.reported=new Set();this.lastPlayed=new Map();this.lastAny=-Infinity;
 }
 make(file,label){
  const a=this.createAudio();a.src=assetURL(`./sfx/${file}.mp3`);a.preload='none';a.dataset.audio=`fx-${label}`;a.hidden=true;
  if(typeof document!=='undefined')document.body.append(a);
  a.addEventListener('error',()=>this.report(label));return a;
 }
 report(label){if(!this.reported.has(label)){this.reported.add(label);this.onError(label);}}
 configure(prefs){this.prefs={...this.prefs,...prefs};this.sync();if(!this.prefs.sound)this.stopEffects();}
 unlock(){this.unlocked=true;}
 sync(){if(this.hidden())this.stopEffects();}
 effect(kind,{rate=1,stretch=false,level=1,preview=false}={}){
  // Continuous prices stay quiet. quote-tick exists only for explicit audition.
  if(!this.unlocked||!this.prefs.sound||this.hidden()||(kind==='rattle'&&!preview))return false;
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
  const envelope=this.envelope.prepare(a,{target:amplitude,leadInSeconds:spec?.leadInSeconds??.04,coldMs:spec?100:180,warmMs:spec?45:75});
  a.playbackRate=Math.max(.8,Math.min(1.25,Number.isFinite(rate)?rate:1));a.preservesPitch=stretch;a.webkitPreservesPitch=stretch;
  try{const playing=a.play();if(playing?.then)playing.then(()=>this.envelope.start(a,envelope)).catch(error=>{if(this.envelope.records.get(a)!==envelope)return;this.envelope.stop(a);if(error?.name!=='AbortError'&&error?.name!=='NotAllowedError')this.report(label);});else this.envelope.start(a,envelope);}
  catch(error){this.envelope.stop(a);if(error?.name!=='AbortError'&&error?.name!=='NotAllowedError')this.report(label);return false;}
  return true;
 }
 stopEffects(){for(const voices of this.pool.values())for(const a of voices){this.envelope.stop(a);a.pause();}}
 pause(){this.stopEffects();}
}
