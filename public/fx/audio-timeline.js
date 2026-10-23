// Bounded sample score on the audio clock: overdue beats are dropped, never burst.
export function scheduleAudioTimeline(cues,{context,load,connect,startedAt,now=()=>performance.now(),hidden=()=>false,allowed=()=>true,level=.5,fallback=()=>false,schedule=setTimeout,clear=clearTimeout,onTrace=()=>{}}={}) {
 const score=Object.freeze(cues.slice(0,64).map(c=>Object.freeze({...c})).filter((c,i,a)=>Number.isFinite(c.atMs)&&c.atMs>=0&&c.atMs<=30000&&(i===0||c.atMs-a[i-1].atMs>=65)));
 const sources=new Set(),timers=new Set(),fallbackVoices=new Set(),receipts=[],settled=new Set(),deadlines=new Map(),completions=new Map();let lastFallbackAt=-Infinity,cancelled=false,cleanupClock=()=>{},wakeClock=null,clockPromise=null,schedulingDone=false;
 const report=(cue,status,extra={})=>{const r=Object.freeze({cue,status,...extra});receipts.push(r);try{onTrace(r);}catch{}};
 const handle={receipts,cancel(){if(cancelled)return;cancelled=true;wakeClock?.(null);cleanupClock();for(const id of timers)clear(id);timers.clear();for(const done of completions.values())done();completions.clear();for(const voice of fallbackVoices)voice.stop();fallbackVoices.clear();for(const entry of [...sources]){try{entry.gain.gain.cancelScheduledValues(context.currentTime);entry.gain.gain.setValueAtTime(0,context.currentTime);entry.source.stop();}catch{}entry.release();}sources.clear();},ready:null};
 const valid=()=>!cancelled&&!hidden()&&allowed(),began=Number.isFinite(startedAt)?startedAt:now();
 const settle=cue=>{settled.add(cue);completions.get(cue)?.();completions.delete(cue);const id=deadlines.get(cue);if(id!==undefined){clear(id);timers.delete(id);deadlines.delete(cue);}};
 const recover=cue=>{
  if(settled.has(cue))return;
  if(!valid()){settle(cue);return;}
  const late=now()-began-cue.atMs,grace=cue.final?180:65;
  if(context&&context.state==='suspended'&&cue.final&&late<180){const id=schedule(()=>{timers.delete(id);deadlines.delete(cue);recover(cue);},180-late);deadlines.set(cue,id);timers.add(id);return;}
  if(late>grace||!cue.final&&late>=65){settle(cue);report(cue,'dropped-late',{lateMs:late});return;}
  if(now()-lastFallbackAt<65){if(cue.final){const id=schedule(()=>{timers.delete(id);deadlines.delete(cue);recover(cue);},65-(now()-lastFallbackAt));deadlines.set(cue,id);timers.add(id);return;}settle(cue);report(cue,'dropped-crowded');return;}
  settle(cue);
  // Never ask an existing suspended device to queue audio beyond this beat.
  if(context&&context.state!=='running'){report(cue,'dropped-not-ready');return;}
  const remaining=Number.isFinite(cue.audioBudgetMs)?cue.audioBudgetMs-Math.max(0,late):null;
  if(remaining!==null&&remaining<=0){report(cue,'dropped-expired');return;}
  const recoveryCue=remaining===null?cue:Object.freeze({...cue,audioBudgetMs:remaining});
  let voice;try{voice=fallback(recoveryCue);}catch{}if(voice)lastFallbackAt=now();
  if(voice&&typeof voice.stop==='function'){
   if(remaining!==null)voice.releaseWithin?.(remaining);
   fallbackVoices.add(voice);
   const expiry=schedule(()=>{timers.delete(expiry);fallbackVoices.delete(voice);voice.stop();if(schedulingDone&&!sources.size&&!fallbackVoices.size)cleanupClock();},Math.min(750,Math.max(350,Number(voice.durationMs)||0)));timers.add(expiry);
  }
  report(cue,voice?'fallback-play-requested':'fallback-rejected');
 };
 // A deadline owns each cue. A late decoder cannot play it a second time or
 // burst old beats. Pending first unlock can admit only still-current cues.
 for(const cue of score){const id=schedule(()=>{timers.delete(id);deadlines.delete(cue);recover(cue);},Math.max(0,began+cue.atMs-now()));deadlines.set(cue,id);timers.add(id);}
 if(!context){handle.ready=Promise.resolve(handle);return handle;}
 // A suspended device has no usable audio-clock anchor. Keep the original wall
 // deadline, then map only future cues onto one shared clock when it is ready.
 let anchor=context.state==='running'?context.currentTime+(began-now())/1000:null;
 const stateChanged=()=>{if(!valid()||context.state==='closed'){handle.cancel();return;}if(context.state!=='running'&&(sources.size||fallbackVoices.size)){handle.cancel();return;}anchor=context.state==='running'?context.currentTime+(began-now())/1000:null;if(!valid()||context.state==='closed')wakeClock?.(null);else if(anchor!==null){wakeClock?.(anchor);for(const cue of score)if(cue.final&&!settled.has(cue)&&now()>=began+cue.atMs)recover(cue);}};
 context.addEventListener?.('statechange',stateChanged);
 cleanupClock=()=>context.removeEventListener?.('statechange',stateChanged);
 const clock=()=>{
  if(!valid()||context.state==='closed')return Promise.resolve(null);
  if(context.state==='running')return Promise.resolve(anchor??(anchor=context.currentTime+(began-now())/1000));
  if(clockPromise)return clockPromise;
  const expires=began+(score.at(-1)?.atMs??0)+(score.at(-1)?.final?180:0),remaining=expires-now();
  if(remaining<=0)return Promise.resolve(null);
  clockPromise=new Promise(resolve=>{
   const timer=schedule(()=>{timers.delete(timer);wakeClock?.(null);},remaining);timers.add(timer);
   wakeClock=value=>{clear(timer);timers.delete(timer);wakeClock=null;clockPromise=null;resolve(value);};
  });
  return clockPromise;
 };
 score.forEach(async cue=>{
  let source,gain,entry;
  try {
   const loaded=await load(cue.kind,cue),buffer=loaded?.buffer||loaded,mixGain=loaded?.buffer?Math.max(0,Math.min(1,Number(loaded.gain)||0)):1;if(settled.has(cue)||!valid())return;
   let base=await clock();if(settled.has(cue)||!valid())return;
   while(base!==null&&context.state!=='running'){base=await clock();if(!valid())return;}
   if(base===null){if(!settled.has(cue)){settle(cue);report(cue,'dropped-not-ready');}return;}
   const when=base+cue.atMs/1000,late=Math.max(context.currentTime-when,(now()-began-cue.atMs)/1000);
   if(late>0){recover(cue);return;}
   source=context.createBufferSource();gain=context.createGain();source.buffer=buffer;
   const rate=Math.max(.8,Math.min(1.25,Number.isFinite(cue.rate)?cue.rate:1));source.playbackRate.value=rate;
   const duration=Math.min(buffer.duration/rate,Number.isFinite(cue.audioBudgetMs)?Math.max(0,cue.audioBudgetMs)/1000:Infinity),target=Math.min(.65,Math.max(0,level)*Math.max(0,Math.min(1,cue.level??1))*mixGain);
   gain.gain.setValueAtTime(0,when);gain.gain.linearRampToValueAtTime(target,when+Math.min(.008,duration/4));
   gain.gain.setValueAtTime(target,when+Math.max(duration/2,duration-.02));gain.gain.linearRampToValueAtTime(0,when+duration);
   source.connect(gain);const disconnect=connect({source,gain,cue,when,target,rate});
   let released=false;entry={source,gain,release(){if(released)return;released=true;disconnect?.();source.disconnect();gain.disconnect();sources.delete(entry);if(schedulingDone&&!sources.size&&!fallbackVoices.size)cleanupClock();}};
   sources.add(entry);source.onended=()=>entry.release();try{source.start(when);if(Number.isFinite(cue.audioBudgetMs))source.stop(when+duration);}catch(error){entry.release();throw error;}settle(cue);report(cue,'scheduled',{audioTime:when,duration,rate,target,...(loaded?.profile?{receiptProfile:loaded.profile}: {})});
  } catch(error){if(!entry){try{source?.disconnect();gain?.disconnect();}catch{}}if(valid()&&!settled.has(cue)){report(cue,'sample-error',{error:error?.name||'AudioError'});if(now()>=began+cue.atMs)recover(cue);}}
 });
 handle.ready=Promise.all(score.map(cue=>new Promise(resolve=>{if(settled.has(cue)||cancelled)resolve();else completions.set(cue,resolve);}))).then(()=>{schedulingDone=true;if(!sources.size&&!fallbackVoices.size)cleanupClock();return handle;});
 return handle;
}
