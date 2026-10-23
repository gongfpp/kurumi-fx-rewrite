import {mountPreviewCapture} from './preview-capture.js?v=539d26616071e7036617b0b49726bd24af40ef2e-capture-v1-1fbef814f493';
import {unlockSafeAudio} from './audio-envelope.js?v=539d26616071e7036617b0b49726bd24af40ef2e-capture-v1-1fbef814f493';
for(const type of ['pointerdown','keydown','click'])document.addEventListener(type,event=>unlockSafeAudio(event),{capture:true});
import {createPressurePresentation} from './pressure-presentation.js?v=539d26616071e7036617b0b49726bd24af40ef2e-capture-v1-1fbef814f493';
import {PRESSURE_CRACKS} from './pressure-visuals.js?v=539d26616071e7036617b0b49726bd24af40ef2e-capture-v1-1fbef814f493';
import {GameMotion} from './motion.js?v=539d26616071e7036617b0b49726bd24af40ef2e-capture-v1-1fbef814f493';
import {mountDailyRecap} from './recap-view.js?v=539d26616071e7036617b0b49726bd24af40ef2e-capture-v1-1fbef814f493';
import {EFFECT_SCENARIOS,effectFixture} from './effects-fixtures.js?v=539d26616071e7036617b0b49726bd24af40ef2e-capture-v1-1fbef814f493';
import {recapPresentation} from './recap-presentation.js?v=539d26616071e7036617b0b49726bd24af40ef2e-capture-v1-1fbef814f493';
import {FXAudio} from './audio.js?v=539d26616071e7036617b0b49726bd24af40ef2e-capture-v1-1fbef814f493';
const $=id=>document.getElementById(id),audio=new FXAudio({onError:()=>{$('sound-status').textContent='音频未能载入；视觉仍可检查。'}});let view=null,selected='small-profit',started=0,trace=[];
function play(id){
 selected=id;view?.dispose();audio.stopEffects();audio.unlock();audio.configure({sound:$('preview-sound').checked,soundVolume:.5});started=performance.now();trace=[];
 const snapshot=effectFixture(id),frozen=JSON.stringify(snapshot),profile=recapPresentation(snapshot);
 $('sound-status').textContent=$('preview-sound').checked?'声音已开启；实际听感需播放设备确认。':'声音已关闭';
 for(const b of $('scenario-buttons').children)b.setAttribute('aria-pressed',String(b.dataset.scenario===id));
 $('trace-status').textContent=`${profile.tier} / ${profile.beats} 拍 / ${profile.duration} ms；快照只读`;$('trace').textContent='';
 view=mountDailyRecap($('preview'),snapshot,{motion:true,reducedMotion:$('preview-reduce').checked||matchMedia('(prefers-reduced-motion: reduce)').matches,portraitUrl:new URL(id.includes('loss')?'./expressions/kurumi-regretful.webp':'./expressions/kurumi-relieved.webp',import.meta.url).href,onSound:(kind,options)=>{const accepted=audio.effect(kind,options);trace.push({ms:Math.round(performance.now()-started),kind,rate:Number(options.rate.toFixed(3)),level:Number(options.level.toFixed(3)),accepted,unchanged:JSON.stringify(snapshot)===frozen});$('trace').textContent=trace.map(x=>JSON.stringify(x)).join('\n');}});
}
for(const scenario of EFFECT_SCENARIOS){const button=document.createElement('button');button.type='button';button.textContent=scenario.label;button.dataset.scenario=scenario.id;button.onclick=()=>play(scenario.id);$('scenario-buttons').append(button);}
$('preview-sound').onchange=()=>{audio.configure({sound:$('preview-sound').checked});$('sound-status').textContent=$('preview-sound').checked?'声音已开启；点重播试听。':'声音已关闭';};$('preview-reduce').onchange=()=>play(selected);
document.addEventListener('visibilitychange',()=>{if(document.hidden){view?.finish();audio.pause();}});window.addEventListener('pagehide',()=>{view?.dispose();audio.pause();});

const motion=new GameMotion(),pressure=createPressurePresentation({root:document,motion,enabled:()=>!$('preview-reduce').checked});let pressureTaps=0,lastPressureAt=-Infinity;
function syncMotion(){const on=!$('preview-reduce').checked;motion.configure(on);document.body.classList.toggle('motion-full',on);}syncMotion();$('preview-reduce').addEventListener('change',()=>{syncMotion();pressure.clear();});
const pressureLabel=document.createElement('span'),fracture=document.createElementNS('http://www.w3.org/2000/svg','svg');pressureLabel.textContent='100× · 0 / 12';fracture.setAttribute('viewBox','0 0 200 64');fracture.setAttribute('preserveAspectRatio','none');fracture.setAttribute('aria-hidden','true');fracture.classList.add('pressure-fracture');const crackPaths=PRESSURE_CRACKS.map(spec=>{const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d',spec.path);path.style.opacity='0';fracture.append(path);return{path,at:spec.at};});$('pressure-demo').replaceChildren(pressureLabel,fracture);
$('pressure-demo').onclick=()=>{const now=performance.now();if(now-lastPressureAt<80||pressureTaps>=12)return;lastPressureAt=now;pressureTaps++;const unlocked=pressureTaps===12;for(const {path,at}of crackPaths)path.style.opacity=pressureTaps>=at?'1':'0';pressureLabel.textContent=unlocked?'限制已突破 · 演出示例':`100× · ${pressureTaps} / 12`;syncMotion();audio.unlock();audio.configure({sound:$('preview-sound').checked,soundVolume:.5});audio.effect(unlocked?'pressure-break':'pressure-hit',{level:.18+.32*pressureTaps/12,rate:.9+.35*pressureTaps/12});const plan=pressure.play($('pressure-demo'),{taps:pressureTaps,unlocked});$('pressure-demo').dataset.pageDisplacement=String(plan.pageDisplacement);};
$('pressure-reset').onclick=()=>{pressure.clear();pressureTaps=0;lastPressureAt=-Infinity;pressureLabel.textContent='100× · 0 / 12';$('pressure-demo').dataset.pressureStage='strained';for(const {path}of crackPaths)path.style.opacity='0';};
window.addEventListener('pagehide',()=>pressure.dispose());

mountPreviewCapture($('capture-panel'),{name:'effects-539d266',allowedPaths:['./sfx/terminal-v2/breakthrough.mp3', './sfx/terminal-v2/close.mp3', './sfx/terminal-v2/fill.mp3', './sfx/terminal-v2/major-loss.mp3', './sfx/terminal-v2/major-profit.mp3', './sfx/terminal-v2/pressure.mp3', './sfx/terminal-v2/tap.mp3'],beforeStart:()=>{view?.finish();audio.pause();}});
