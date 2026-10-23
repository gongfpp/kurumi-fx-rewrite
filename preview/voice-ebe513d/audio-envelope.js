// One opt-in audio graph; constructing a player never wakes audio hardware.
let context=null;
const mediaGraphs=new WeakMap();
// Preview-only capture branch. The original speaker chain and envelope are untouched.
const liveGraphs=new Set();
let previewTap=null;
export function createPreviewAudioTap({acceptMedia=()=>false}={}) {
  if(!context||typeof context.createMediaStreamDestination!=='function')throw new Error('当前浏览器不支持本页音频导出');
  if(previewTap)throw new Error('已有录制正在进行');
  const destination=context.createMediaStreamDestination(),connected=new Set(),sources=new Set(),events=[];
  const tap={
    connect(entry){
      if(!acceptMedia(entry.media)){if(connected.delete(entry))entry.gain.disconnect(destination);return;}
      if(!connected.has(entry)){entry.gain.connect(destination);connected.add(entry);}
      sources.add(entry.media.currentSrc||entry.media.src);
    },
    played(entry){
      this.connect(entry);
      if(connected.has(entry))events.push({at:new Date().toISOString(),source:entry.media.currentSrc||entry.media.src,volume:entry.media.volume,playbackRate:entry.media.playbackRate||1});
    },
    remove(entry){if(connected.delete(entry))entry.gain.disconnect(destination);},
  };
  previewTap=tap;
  try{for(const entry of liveGraphs)tap.connect(entry);}catch(error){previewTap=null;for(const entry of connected)entry.gain.disconnect(destination);for(const track of destination.stream.getTracks())track.stop();throw error;}
  let released=false;
  return {
    context,stream:destination.stream,
    sources:()=>[...sources],events:()=>events.slice(),
    release(){if(released)return;released=true;if(previewTap===tap)previewTap=null;for(const entry of connected){try{entry.gain.disconnect(destination);}catch{}}connected.clear();for(const track of destination.stream.getTracks())track.stop();},
  };
}
const bounded=(n,fallback=.5)=>Number.isFinite(n)?Math.max(0,Math.min(.65,n)):fallback;
export function unlockSafeAudio(event) {
  if(!event?.isTrusted||!['pointerdown','keydown','click'].includes(event.type))return false;
  const AudioContext=globalThis.AudioContext||globalThis.webkitAudioContext;
  if(!AudioContext)return false;
  try{context||=new AudioContext();if(context.state==='suspended')void context.resume().catch(()=>{});return true;}catch{return false;}
}
function graph(media) {
  if(!context)return null;
  if(mediaGraphs.has(media)){const existing=mediaGraphs.get(media);previewTap?.connect(existing);return existing;}
  try{const source=context.createMediaElementSource(media),gain=context.createGain();gain.gain.value=0;source.connect(gain).connect(context.destination);const result={source,gain,context,media};mediaGraphs.set(media,result);liveGraphs.add(result);result.capturePlay=()=>previewTap?.played(result);media.addEventListener('play',result.capturePlay);previewTap?.connect(result);return result;}catch{return null;}
}

export class AudioEnvelope {
  constructor({now=()=>performance.now(),schedule=fn=>{const timer=setTimeout(fn,16);timer.unref?.();return timer;},cancel=id=>clearTimeout(id),getGraph=graph,idleMs=8000}={}) {
    this.now=now;this.schedule=schedule;this.cancel=cancel;this.getGraph=getGraph;this.idleMs=idleMs;this.records=new WeakMap();this.lastStarted=-Infinity;
  }
  setLevel(media,record,fraction) {
    const level=Math.max(0,Math.min(1,Number.isFinite(fraction)?fraction:0));
    if(record.graph){
      const gain=record.graph.gain.gain,at=record.graph.context.currentTime;
      if(level===0){gain.cancelScheduledValues?.(at);gain.setValueAtTime?.(0,at);gain.value=0;}
      else if(gain.setTargetAtTime)gain.setTargetAtTime(level,at,.012);else gain.value=level;
      record.lastVolume=record.target;media.volume=record.target;
    } else {record.lastVolume=record.target*level;media.volume=record.lastVolume;}
  }
  prepare(media,{target=.5,leadInSeconds=0,coldMs=450,warmMs=180}={}) {
    this.stop(media);
    const time=this.now(),offset=Number.isFinite(media.currentTime)?media.currentTime:0,record={target:bounded(target),offset,lead:Math.max(0,leadInSeconds-offset),duration:time-this.lastStarted>=this.idleMs?coldMs:warmMs,graph:this.getGraph(media),timer:null,started:null};
    this.records.set(media,record);this.setLevel(media,record,0);
    return record;
  }
  start(media,record=this.records.get(media)) {
    if(!record||record!==this.records.get(media))return false;
    this.lastStarted=this.now();record.started=this.now();
    const step=()=>{
      if(record!==this.records.get(media))return;
      if(media.ended||media.paused===true){this.stop(media);return;}
      const position=Number.isFinite(media.currentTime)?media.currentTime:record.offset+Math.max(0,this.now()-record.started)/1000;
      const elapsed=Math.max(0,position-record.offset);
      const fade=Math.min(1,Math.max(0,(elapsed-record.lead)/(record.duration/1000)));
      const tail=Number.isFinite(media.duration)?Math.max(0,Math.min(1,(media.duration-position)/.12)):1;
      this.setLevel(media,record,fade*tail);
      if(fade<1||Number.isFinite(media.duration))record.timer=this.schedule(step);
    };
    step();return true;
  }
  fadeOut(media,{duration=100,onComplete=()=>{}}={}) {
    const record=this.records.get(media);
    if(!record){onComplete();return;}
    if(record.timer!==null)this.cancel(record.timer);
    const began=this.now(),initial=record.graph?record.graph.gain.gain.value:record.target?media.volume/record.target:0;
    const step=()=>{
      if(this.records.get(media)!==record)return;
      const progress=Math.min(1,Math.max(0,(this.now()-began)/duration));
      this.setLevel(media,record,initial*(1-progress));
      if(progress>=1){this.stop(media);onComplete();}else record.timer=this.schedule(step);
    };
    step();
  }
  stop(media) {
    const record=this.records.get(media);if(!record)return;
    if(record.timer!==null)this.cancel(record.timer);this.setLevel(media,record,0);this.records.delete(media);
  }
}

export function bindAuditionEnvelope(media,{leadInSeconds=.4,envelope=new AudioEnvelope()}={}) {
  let target=bounded(media.volume,.65),record=envelope.prepare(media,{target,leadInSeconds});
  // The Web Audio gain is already zero before native playback can start.
  const play=()=>{record=envelope.prepare(media,{target,leadInSeconds});envelope.start(media,record);};
  const stop=()=>envelope.stop(media);
  const volume=()=>{
    if(record&&Math.abs(media.volume-record.lastVolume)<.00001)return;
    target=bounded(media.volume,target);if(record){record.target=target;record.lastVolume=media.volume;}
  };
  media.addEventListener('play',play);media.addEventListener('pause',stop);media.addEventListener('ended',stop);media.addEventListener('volumechange',volume);
  return ()=>{stop();for(const [type,fn] of [['play',play],['pause',stop],['ended',stop],['volumechange',volume]])media.removeEventListener(type,fn);const connected=mediaGraphs.get(media);if(connected){previewTap?.remove(connected);liveGraphs.delete(connected);media.removeEventListener('play',connected.capturePlay);}connected?.source.disconnect();connected?.gain.disconnect();mediaGraphs.delete(media);};
}
