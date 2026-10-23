import {createPreviewAudioTap,unlockSafeAudio} from './audio-envelope.js?v=ebe513d153a1219d73a65051f32fb508afce547c-capture-v1-1fbef814f493';

export const CAPTURE_REVISION='preview-capture-v1';
export const CAPTURE_LIMIT_MS=60000;
const FORMATS=['audio/webm;codecs=opus','audio/ogg;codecs=opus','audio/mp4;codecs=mp4a.40.2','audio/mp4','audio/webm'];
export function recordingType(Recorder=globalThis.MediaRecorder){
  return typeof Recorder==='function'&&typeof Recorder.isTypeSupported==='function'?FORMATS.find(type=>Recorder.isTypeSupported(type))||null:null;
}
export function recordingExtension(type=''){
  return /mp4/i.test(type)?'m4a':/ogg/i.test(type)?'ogg':/webm/i.test(type)?'webm':'bin';
}
export function allowedMedia(paths,base=import.meta.url){
  const urls=new Set(paths.map(path=>new URL(path,base).pathname));
  const origin=new URL(base).origin;
  return media=>{try{const url=new URL(media.currentSrc||media.src,base);return url.origin===origin&&urls.has(url.pathname);}catch{return false;}};
}

// No device, microphone, screen, tab, or system capture. This records only the
// explicitly permitted gain outputs from this preview's original audio graph.
export class PreviewRecorder {
  constructor({acceptMedia,unlock=unlockSafeAudio,createTap=createPreviewAudioTap,Recorder=globalThis.MediaRecorder,beforeStart=()=>{},hidden=()=>document.hidden,onState=()=>{},onResult=()=>{},now=()=>Date.now(),schedule=(callback,delay)=>globalThis.setTimeout(callback,delay),cancel=timer=>globalThis.clearTimeout(timer)}={}){
    Object.assign(this,{acceptMedia,unlock,createTap,Recorder,beforeStart,hidden,onState,onResult,now,schedule,cancel});
    this.state='idle';this.current=null;this.preparing=null;this.generation=0;
  }
  update(state,message){this.state=state;this.onState(state,message);}
  async start(event){
    if(this.state==='recording'||this.state==='preparing'||this.state==='stopping')return false;
    if(!event?.isTrusted||event.type!=='click'||this.hidden())return false;
    const mimeType=recordingType(this.Recorder);
    if(!mimeType){this.update('error','此浏览器没有可用的本页音频编码器，请换支持 MediaRecorder 的浏览器。');return false;}
    if(!this.unlock(event)){this.update('error','未能开启本页音频，请使用浏览器中的真实点击重试。');return false;}
    const token=++this.generation;
    this.update('preparing','正在准备本页录制…');
    let tap,pending;
    try{
      this.beforeStart();
      tap=this.createTap({acceptMedia:this.acceptMedia});
      pending={tap,timer:null,abort:null};this.preparing=pending;
      await new Promise((resolve,reject)=>{
        pending.abort=()=>reject(new Error('录制已取消'));
        pending.timer=this.schedule(()=>reject(new Error('音频准备超时，请重试')),5000);
        Promise.resolve(tap.context.resume()).then(resolve,reject);
      });
      this.cancel(pending.timer);if(this.preparing===pending)this.preparing=null;
      if(token!==this.generation||this.hidden()){tap.release();if(token===this.generation)this.update('idle','页面不可见，录制已取消。');return false;}
      if(tap.context.state!=='running')throw new Error('音频上下文未运行，请再次点击');
      const recorder=new this.Recorder(tap.stream,{mimeType,audioBitsPerSecond:128000});
      const session={recorder,tap,chunks:[],started:this.now(),reason:'manual',error:null,timer:null,finalizeTimer:null,finished:false};
      this.current=session;
      recorder.ondataavailable=event=>{if(!session.finished&&event.data?.size)session.chunks.push(event.data);};
      recorder.onerror=event=>{if(session.finished||this.current!==session)return;session.error=event.error?.name||'recording-error';this.stop('encoding-error');};
      recorder.onstop=()=>this.finish(session);
      recorder.start(250);
      session.timer=this.schedule(()=>this.stop('time-limit'),CAPTURE_LIMIT_MS);
      this.update('recording','正在录制本页音频。现在请手动播放一个场景或短原声；最长 60 秒。');
      return true;
    }catch(error){
      if(this.current?.tap===tap)this.current=null;
      if(pending)this.cancel(pending.timer);if(this.preparing===pending)this.preparing=null;
      tap?.release();
      if(token===this.generation)this.update('error','录制未开始：'+(error?.message||'浏览器编码器不可用'));
      return false;
    }
  }
  stop(reason='manual'){
    if(this.state==='preparing'){++this.generation;const pending=this.preparing;this.preparing=null;if(pending){this.cancel(pending.timer);pending.tap.release();pending.abort?.();}this.update('idle','录制已取消。');return;}
    const session=this.current;
    if(!session||session.finished||this.state==='stopping')return;
    session.reason=reason;
    this.cancel(session.timer);
    this.update('stopping','正在生成本轮音频文件…');
    session.finalizeTimer=this.schedule(()=>{session.error||='stop-timeout';this.finish(session);},5000);
    if(session.recorder.state!=='inactive'){
      try{session.recorder.stop();}catch(error){session.error=error?.name||'stop-error';this.finish(session);}
    } // An encoder error can set state to inactive before its final data/stop events.
  }
  finish(session){
    if(session.finished)return;
    session.finished=true;this.cancel(session.timer);this.cancel(session.finalizeTimer);
    const type=session.recorder.mimeType||session.chunks[0]?.type||'',sources=session.tap.sources(),playEvents=session.tap.events?.()||[];
    session.tap.release();
    if(this.current===session)this.current=null;
    const blob=new Blob(session.chunks,{type});
    if(!blob.size){this.update('error','未生成可用的音频文件，请重新录制。');return;}
    const evidence={captureRevision:CAPTURE_REVISION,moduleVersion:new URL(import.meta.url).searchParams.get('v'),startedAt:new Date(session.started).toISOString(),durationMs:Math.max(0,this.now()-session.started),stopReason:session.reason,encodingError:session.error,mimeType:type,bytes:blob.size,connectedAssets:sources,mediaPlayEvents:playEvents,sourceGraph:'original HTMLAudio → original envelope gain → parallel MediaStreamDestination',listeningVerified:false};
    this.onResult({blob,evidence});
    this.update(session.error?'error':'ready',session.error?'编码器报错，保留的文件可能不完整，请重录。':`已生成 ${(blob.size/1024).toFixed(1)} KB 音频；请回放确认声音和完整性。${sources.length?'':' 尚未连接素材，文件可能只有静音。'}`);
  }
}

export function mountPreviewCapture(container,{name,allowedPaths,beforeStart,onState=()=>{}}={}){
  const doc=container.ownerDocument;
  const el=(tag,text)=>{const node=doc.createElement(tag);if(text)node.textContent=text;return node;};
  container.classList.add('preview-capture');
  const title=el('h2','录制这一轮本页音频');
  const note=el('p','默认不录制。开始后，再手动播放演出或短原声；不会录麦克风、屏幕或其他标签页，也不会上传。切后台即停。先调低设备音量。');
  const actions=el('div');actions.className='capture-actions';
  const start=el('button','开始录制'),stop=el('button','停止录制'),download=el('a','下载本轮音频'),metadata=el('a','下载录制记录');
  start.type=stop.type='button';stop.disabled=true;download.hidden=metadata.hidden=true;
  start.dataset.capture='start';stop.dataset.capture='stop';download.dataset.capture='download';metadata.dataset.capture='metadata';
  const status=el('p','尚未录制。录制只保存本页原音量曲线，不包含设备音量设置。');status.setAttribute('role','status');status.dataset.capture='status';
  const playback=el('audio');playback.controls=true;playback.preload='metadata';playback.hidden=true;playback.volume=1;playback.dataset.capture='playback';playback.setAttribute('aria-label','回放刚刚录制的本页音频');
  let urls=[],disposed=false;
  const releaseURLs=()=>{playback.pause();playback.removeAttribute('src');playback.load();for(const url of urls)URL.revokeObjectURL(url);urls=[];};
  const capture=new PreviewRecorder({acceptMedia:allowedMedia(allowedPaths),beforeStart:()=>{playback.pause();beforeStart?.();},onState:(state,message)=>{
    if(disposed)return;
    const busy=['preparing','recording','stopping'].includes(state);start.disabled=busy;stop.disabled=state!=='recording'&&state!=='preparing';status.textContent=message;status.dataset.state=state;onState(state);
  },onResult:({blob,evidence})=>{
    if(disposed)return;
    releaseURLs();
    const base=`kurumi-${name}-${CAPTURE_REVISION}-${evidence.startedAt.replace(/[:.]/g,'-')}`;
    const audioURL=URL.createObjectURL(blob),metaURL=URL.createObjectURL(new Blob([JSON.stringify({...evidence,preview:name},null,2)],{type:'application/json'}));urls=[audioURL,metaURL];
    download.href=audioURL;download.download=base+'.'+recordingExtension(blob.type);download.hidden=false;
    metadata.href=metaURL;metadata.download=base+'.json';metadata.hidden=false;
    playback.src=audioURL;playback.hidden=false;
  }});
  start.onclick=event=>void capture.start(event);stop.onclick=()=>capture.stop();
  const visibility=()=>{if(doc.hidden){capture.stop('page-hidden');playback.pause();}};
  const pagehide=()=>{capture.stop('page-exit');playback.pause();};
  doc.addEventListener('visibilitychange',visibility);globalThis.addEventListener('pagehide',pagehide);
  actions.append(start,stop,download,metadata);container.append(title,note,actions,status,playback);
  if(!recordingType()){start.disabled=true;status.textContent='当前浏览器没有可用的本页音频编码器。原试听仍可使用。';}
  return {stop:()=>capture.stop(),dispose:()=>{disposed=true;capture.stop('dispose');doc.removeEventListener('visibilitychange',visibility);globalThis.removeEventListener('pagehide',pagehide);releaseURLs();}};
}
