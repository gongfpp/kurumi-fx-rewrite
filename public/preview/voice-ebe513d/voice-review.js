import {mountPreviewCapture} from './preview-capture.js?v=ebe513d153a1219d73a65051f32fb508afce547c-capture-v1-1fbef814f493';
import {BASE_STATE} from './voice-fixture.js?v=ebe513d153a1219d73a65051f32fb508afce547c-capture-v1-1fbef814f493';
import {VoicePlayer,VOICE_LINES} from './voice.js?v=ebe513d153a1219d73a65051f32fb508afce547c-capture-v1-1fbef814f493';
import {createVoiceContextSelector} from './voice-timing.js?v=ebe513d153a1219d73a65051f32fb508afce547c-capture-v1-1fbef814f493';
import {createFloatingReaction} from './floating-reaction.js?v=ebe513d153a1219d73a65051f32fb508afce547c-capture-v1-1fbef814f493';
import {selectFinalPortrait} from './final-portrait.js?v=ebe513d153a1219d73a65051f32fb508afce547c-capture-v1-1fbef814f493';
import {positionNetUnrealized} from './engine.js?v=ebe513d153a1219d73a65051f32fb508afce547c-capture-v1-1fbef814f493';
import {assetURL} from './assets.js?v=ebe513d153a1219d73a65051f32fb508afce547c-capture-v1-1fbef814f493';
import {unlockSafeAudio} from './audio-envelope.js?v=ebe513d153a1219d73a65051f32fb508afce547c-capture-v1-1fbef814f493';
import {mountVoiceLibrary} from './voice-library.js?v=ebe513d153a1219d73a65051f32fb508afce547c-capture-v1-1fbef814f493';
const $=id=>document.getElementById(id),trace=[],reaction=createFloatingReaction(),select=createVoiceContextSelector();
let state=structuredClone(BASE_STATE),generation=0,plays=0,dispose=null,lastPortrait;
const record=(event,extra={})=>{trace.push({at:new Date().toISOString(),event,...extra});$('trace').textContent=trace.slice(-35).map(e=>JSON.stringify(e)).join('\n');};
const voice=new VoicePlayer({onUpdate:()=>render(),onPlay:line=>record('clip-started',{id:line.id}),makeAudio:()=>{const a=new Audio();a.addEventListener('play',()=>{plays++;record('actual-media-play',{source:a.currentSrc});});a.addEventListener('pause',()=>record('actual-media-pause',{time:a.currentTime}));a.addEventListener('ended',()=>record('actual-media-ended'));return a;}});
function render(){
 const floating=state.positions.reduce((sum,p)=>sum+positionNetUnrealized(state,p),0),portrait=selectFinalPortrait(state,{floatingReaction:reaction.observe(state)});lastPortrait=portrait;
 const context=select(state,{floating,hasPositions:state.positions.length>0}),clip=voice.sync({enabled:!document.hidden&&!$('library').open,emotion:portrait.emotion,run:state.runId,context});
 $('mood').textContent=portrait.label;if($('portrait').dataset.path!==portrait.path){$('portrait').src=assetURL(portrait.path);$('portrait').dataset.path=portrait.path;}$('portrait').alt='久留美 · '+portrait.label;
 $('speech').textContent=clip?.zh||portrait.line||'先看看行情……';$('caption').textContent=clip?`${clip.speaker} · ${clip.ja}`:'';
 $('metrics').textContent=`${state.positions.length} 笔持仓 · 净浮盈 ¥${floating.toFixed(2)} · 借款 ¥${state.externalFunding||0}`;
 const candidates=voice.available(),active=voice.playing||voice.loading;$('play').disabled=!active&&!candidates.length;$('play').textContent=active?'停止原声':candidates.length?'播放当前原声':'暂无适配台词';
 $('status').textContent=voice.lastError|| (active?'正在播放':'仅手动播放')+(candidates.length?'':' · 当前没有适配台词');
 $('play-count').textContent=`实际原声播放次数 ${plays} · 当前 ${voice.playing?'播放中':voice.loading?'加载中':'静音'} · ${voice.audio.currentTime?.toFixed(2)||0} 秒`;
}
function base(){state=structuredClone(BASE_STATE);reaction.reset();render();}
function scenario(name){
 ++generation;const turn=generation;voice.stop();base();record('scenario',{name});
 if(name==='spike'){state.price-=10;render();}
 if(name==='loss'){state.price-=10;render();state.price+=20;render();}
 if(name==='flicker'){let i=0;const pulse=()=>{if(turn!==generation||i>=12)return;state.price=BASE_STATE.price+(i++%2?.1:-.1);render();setTimeout(pulse,110);};pulse();}
 if(name==='hedge'){state.positions.push({...state.positions[0],id:'opposite',direction:1});reaction.reset();render();state.price-=10;render();}
 if(name==='borrow'){state.cash+=3000000;state.externalFunding+=3000000;render();}
 if(name==='flat'){state.positions=[];state.position=null;state.price-=10;render();}
 if(name==='no-match'){state.price+=1;reaction.reset();render();}
}
$('scenarios').addEventListener('click',event=>{const button=event.target.closest('[data-case]');if(button)scenario(button.dataset.case);});
$('play').onclick=()=>{if(document.hidden)return;if(voice.playing||voice.loading){voice.stop();render();return;}render();voice.unlock();void voice.play(voice.lastMood,'preview-click');};
$('catalog').onclick=()=>{voice.stop();dispose?.();dispose=mountVoiceLibrary($('voice-list'),VOICE_LINES,{beforePlay:()=>voice.stop(),onPlay:line=>record('manual-audition',{id:line.id})});$('library').showModal();render();};
$('close-library').onclick=()=>$('library').close();$('library').addEventListener('close',()=>{dispose?.();dispose=null;voice.stop();render();});
for(const type of ['pointerdown','keydown'])document.addEventListener(type,event=>unlockSafeAudio(event),{capture:true});
document.addEventListener('visibilitychange',()=>{if(document.hidden){voice.stop();for(const a of $('voice-list').querySelectorAll('audio'))a.pause();record('background-silenced');}render();});
window.addEventListener('pagehide',()=>voice.stop());
$('version').textContent='Source commit: ebe513d153a1219d73a65051f32fb508afce547c';render();setInterval(()=>{if(!document.hidden)render();},100);

const capture=mountPreviewCapture($('capture-panel'),{name:'voice-ebe513d',allowedPaths:['./voice/kurumi-came.mp3', './voice/kurumi-cannot-lose.mp3', './voice/kurumi-check.mp3', './voice/kurumi-family-money.mp3', './voice/kurumi-gasp.mp3', './voice/kurumi-gone.mp3', './voice/kurumi-greedy.mp3', './voice/kurumi-human.mp3', './voice/kurumi-laugh.mp3', './voice/kurumi-profit-ten.mp3', './voice/kurumi-profit-twenty.mp3', './voice/kurumi-profit-vanished.mp3', './voice/kurumi-stop.mp3', './voice/mebuki-rich.mp3', './voice/mochiko-waste.mp3', './voice/yasuko-start.mp3'],beforeStart:()=>{voice.stop();for(const a of $('voice-list').querySelectorAll('audio'))a.pause();},onState:state=>{$('capture-stop-library').disabled=state!=='recording';}});
$('capture-stop-library').onclick=()=>capture.stop();
