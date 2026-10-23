import {VOICE_SCENE_RULES,voiceSceneMatches,sceneVoiceCandidates} from './voice-scenes.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {VoiceTimingGate} from './voice-timing.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {AudioEnvelope} from './audio-envelope.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {recordedVoiceEnvelope,VOICE_STOP_FADE_MS} from './voice-playback.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {assetURL} from './assets.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';

// Actual short recordings from the official public main PV, never generated speech.
// Captions stay with their recording, including the PV's amounts, not game balances.
export const VOICE_SOURCE='https://www.youtube.com/watch?v=7rxIZ3z0S4s';
const clip=(id,file,ja,zh,moods,start,end,speaker='福賀くるみ',source=VOICE_SOURCE)=>Object.freeze({id,file:assetURL(`./voice/${file}`),ja,zh,moods:Object.freeze(moods),start,end,speaker,source,leadInSeconds:.4,synthetic:false});
export const VOICE_LINES=Object.freeze([
 clip("pv-profit-ten","kurumi-profit-ten.mp3","含み益10万は出てるけど、やっぱ20万以上で利確したい","虽然已经有十万浮盈了，还是想赚到二十万以上再止盈",["confident","excited"],53.9,59.5,"福賀くるみ","https://www.youtube.com/watch?v=7rxIZ3z0S4s"),
 clip("pv-profit-twenty","kurumi-profit-twenty.mp3","やっぱ20万以上で利確したい","果然还是想赚到二十万以上再止盈",["greedy","exhilarated","ecstatic"],56.45,59.5,"福賀くるみ","https://www.youtube.com/watch?v=7rxIZ3z0S4s"),
 clip("pv-cannot-lose","kurumi-cannot-lose.mp3","負けようがない","不可能输的",["reckless","determined"],72.48,73.86,"福賀くるみ","https://www.youtube.com/watch?v=7rxIZ3z0S4s"),
 clip("pv-gone","kurumi-gone.mp3","どこ行った!?","去哪儿了！？",["regretful","profit-to-loss","shocked","stunned"],61.3,62.92,"福賀くるみ","https://www.youtube.com/watch?v=7rxIZ3z0S4s"),
 clip("pv-human","kurumi-human.mp3","こんなの、人間が扱っていいものじゃない！","这种东西，根本不是人该碰的！",[],62.84,66.02,"高根やす子","https://www.youtube.com/watch?v=7rxIZ3z0S4s"),
 clip("pv-stop","kurumi-stop.mp3","やめて！","停下来啊！",["nervous"],79.58,80.91,"福賀くるみ","https://www.youtube.com/watch?v=7rxIZ3z0S4s"),
 clip("pv-profit-vanished","kurumi-profit-vanished.mp3","利益…","利润……",["profit-to-loss"],60.4,61.35,"福賀くるみ","https://www.youtube.com/watch?v=7rxIZ3z0S4s"),
 clip("pv-gasp","kurumi-gasp.mp3","あっ！","啊！",["loss-to-profit","relieved"],59.54,60.23,"福賀くるみ","https://www.youtube.com/watch?v=7rxIZ3z0S4s"),
 clip("pv-mebuki-rich","mebuki-rich.mp3","よし、お金持ち目指して頑張ります","好，朝着变有钱的目标努力",[],31.55,34.65,"山師芽吹","https://www.youtube.com/watch?v=7rxIZ3z0S4s"),
 clip("pv-yasuko-start","yasuko-start.mp3","私もFXやってやるよ","我也来做FX给你看",[],34.7,37.35,"高根やす子","https://www.youtube.com/watch?v=7rxIZ3z0S4s"),
 clip("character-came","kurumi-came.mp3","きたー！","来了！",["excited","loss-to-profit"],0.7,2.78,"福賀くるみ","https://www.youtube.com/watch?v=v-cxfCJlrss"),
 clip("character-check","kurumi-check.mp3","相場チェックした〜い！","想看看行情！",["calm","hopeful"],2.84,4.98,"福賀くるみ","https://www.youtube.com/watch?v=v-cxfCJlrss"),
 clip("character-family-money","kurumi-family-money.mp3","家のお金入れたから余裕だよ〜！","家里的钱放进去了，绰绰有余！",[],5.0,7.44,"福賀くるみ","https://www.youtube.com/watch?v=v-cxfCJlrss"),
 clip("character-greedy","kurumi-greedy.mp3","完全に欲張った！","完全是我太贪了！",["regretful"],7.44,8.98,"福賀くるみ","https://www.youtube.com/watch?v=v-cxfCJlrss"),
 clip("character-laugh","kurumi-laugh.mp3","あははははっ！","啊哈哈哈哈！",["ecstatic","exhilarated"],8.99,10.39,"福賀くるみ","https://www.youtube.com/watch?v=v-cxfCJlrss"),
 clip("pv-mochiko-waste","mochiko-waste.mp3","もったいないよ","太可惜了",[],27.78,28.9,"小金萌智子","https://www.youtube.com/watch?v=7rxIZ3z0S4s"),
]);
export {VOICE_SCENE_RULES} from './voice-scenes.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
export function availableVoices(emotion){return VOICE_LINES.filter(line=>line.moods.includes(emotion));}

// Gameplay voice is strictly manual. sync observes validity; it never starts audio.
export class VoicePlayer{
 constructor({makeAudio=()=>new Audio(),onUpdate=()=>{},onPlay=()=>{},onReject=()=>{},lines=VOICE_LINES,now=()=>Date.now(),maxLoadMs=3000}={}){
  this.lines=lines;this.makeAudio=makeAudio;this.envelope=new AudioEnvelope({now});this.fading=new Set();
  this.onUpdate=onUpdate;this.onPlay=onPlay;this.onReject=onReject;this.now=now;this.maxLoadMs=maxLoadMs;
  this.presentation=null;this.playing=false;this.loading=false;this.lastError=null;this.generation=0;this.sequence={};this.lastMood=null;this.lastRun=null;
  this.unlocked=false;this.failed=new Set();this.timing=new VoiceTimingGate();this.hasContext=false;this.activeToken=null;
  this.audio=this.configureAudio(makeAudio());
 }
 configureAudio(audio){
  audio.preload='none';audio.volume=0;
  audio.addEventListener('ended',()=>{if(audio!==this.audio)return;this.stop({fadeMs:0});this.onUpdate();});
  audio.addEventListener('error',()=>{if(audio!==this.audio)return;const line=this.presentation;if(!line)return;this.failed.add(line.id);this.stop({fadeMs:0});this.lastError='unavailable';this.onReject(line);this.onUpdate();});
  return audio;
 }
 get audible(){return this.playing||this.fading.size>0;}
 // Invoked by a dedicated play button, never by ordinary page gestures.
 unlock(){this.unlocked=true;this.lastError=null;return true;}
 stop({fadeMs=VOICE_STOP_FADE_MS}={}){
  const audio=this.audio,wasPlaying=this.playing;++this.generation;
  this.playing=false;this.loading=false;this.lastError=null;this.presentation=null;this.activeToken=null;
  const finish=()=>{this.envelope.stop(audio);audio.volume=0;audio.pause();this.fading.delete(audio);if(audio!==this.audio)this.envelope.dispose(audio);this.onUpdate();};
  if(wasPlaying&&audio.paused!==true&&fadeMs>0){this.fading.add(audio);this.envelope.fadeOut(audio,{duration:fadeMs,onComplete:finish});}
  else if(fadeMs<=0||!this.fading.has(audio)) {this.envelope.stop(audio);audio.volume=0;audio.pause();this.fading.delete(audio);}
 }
 accepts(line,token){return !token||this.timing.valid(token)&&voiceSceneMatches(line,this.timing.manualToken(this.now()),{stage:'manual'});}
 async start(line,speechId,emotion,token=null){
  if(!this.unlocked||!line||this.failed.has(line.id)||!this.accepts(line,token))return false;
  const previous=this.audio,replacing=!!this.presentation||this.loading||this.playing||this.fading.has(previous);this.stop();
  if(replacing){
   const next=this.makeAudio();
   // Real playback gets a fresh element so a new explicit request can keep its
   // gesture while the old element fades, and late load events remain with the
   // abandoned request. Single-element adapters cancel the old envelope first.
   if(next!==previous){this.audio=this.configureAudio(next);if(!this.fading.has(previous))this.envelope.dispose(previous);}
   else {this.envelope.stop(previous);previous.pause();this.fading.delete(previous);}
  }
  const audio=this.audio,gen=this.generation,requestedAt=this.now();audio.src=line.file;audio.currentTime=0;
  const envelope=this.envelope.prepare(audio,{target:.5,...recordedVoiceEnvelope(line)});
  this.activeToken=token;this.presentation={...line,mood:emotion,speechId};this.loading=true;this.onUpdate();
  try{
   if(gen!==this.generation||!this.accepts(line,token))return false;
   await audio.play();
   if(gen!==this.generation){if(audio!==this.audio||!this.presentation){audio.pause();audio.volume=0;}return false;}
   if(!this.accepts(line,token)||this.now()-requestedAt>this.maxLoadMs){this.stop({fadeMs:0});this.lastError='stale';this.onUpdate();return false;}
   this.envelope.start(audio,envelope);this.loading=false;this.playing=true;this.onPlay(line);this.onUpdate();return true;
  }catch(error){
   if(gen===this.generation){this.stop();this.lastError=error?.name==='NotAllowedError'?'blocked':'unavailable';if(error?.name==='NotAllowedError')this.unlocked=false;this.onReject(line);this.onUpdate();}
   return false;
  }
 }
 available(emotion=this.lastMood){
  const lines=this.lines.filter(line=>!this.failed.has(line.id));
  if(!this.hasContext)return lines.filter(line=>line.moods.includes(emotion));
  const token=this.timing.manualToken(this.now());
  return token?sceneVoiceCandidates(lines,emotion,token,{stage:'manual'}):[];
 }
 async play(emotion=this.lastMood,speechId){
  if(!this.unlocked)return false;
  const token=this.hasContext?this.timing.manualToken(this.now()):null;
  const pool=this.available(emotion);
  if(!pool.length){this.stop();this.lastError='no-match';this.onUpdate();return false;}
  const turn=this.sequence[emotion]||0,line=pool[turn%pool.length];this.sequence[emotion]=turn+1;
  return this.start(line,speechId,emotion,token);
 }
 // Optional gallery playback is also an explicit action and retains its speaker.
 async playLine(id,speechId='audition'){return this.start(this.lines.find(line=>line.id===id),speechId,'audition');}
 sync({enabled=true,emotion,speechId,run,context}){
  if(context){this.hasContext=true;this.timing.observe(context,this.now());}
  const runChanged=this.lastRun!==null&&this.lastRun!==run;
  this.lastMood=emotion;this.lastRun=run;
  const interrupted=this.activeToken&&(this.loading?!this.accepts(this.presentation,this.activeToken):!this.timing.canFinish(this.activeToken));
  if(!enabled||runChanged||interrupted){if(this.presentation||this.playing||this.loading)this.stop();}
  return this.presentation&&(this.playing||this.loading)?this.presentation:null;
 }
}
