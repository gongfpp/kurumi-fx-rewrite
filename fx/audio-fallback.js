// Last-resort terminal cue on the already opted-in audio device. No media fetch,
// new AudioContext, preference changes or voice/BGM routing.
export function synthesizeTerminalCue(context,cue,{level=.5,connect}={}){
 if(context?.state!=='running'||typeof context.createOscillator!=='function')return false;
 const loss=/fall|loss|close/.test(cue.kind),landing=!!cue.final||/land|fill|close/.test(cue.kind);
 const duration=Math.min(landing?.18:.10,Number.isFinite(cue.audioBudgetMs)?Math.max(0,cue.audioBudgetMs)/1000:Infinity),at=context.currentTime;
 const target=Math.min(.08,Math.max(0,Number(level)||0)*Math.max(0,Math.min(1,Number(cue.level??1)||0))*.12);
 if(!target||duration<=0)return false;
 let source,gain,disconnect,stopped=false;
 const interrupted=()=>{if(context.state!=='running')stop();};
 const stop=()=>{if(stopped)return;stopped=true;context.removeEventListener?.('statechange',interrupted);try{source?.stop();}catch{}try{disconnect?.();source?.disconnect();gain?.disconnect();}catch{}};
 try{
  source=context.createOscillator();gain=context.createGain();source.type='sine';
  const rate=Math.max(.8,Math.min(1.25,Number(cue.rate)||1)),from=(loss?440:620)*rate,to=(loss?260:880)*rate;
  source.frequency.setValueAtTime(from,at);source.frequency.exponentialRampToValueAtTime(to,at+duration*.8);
  gain.gain.setValueAtTime(0,at);gain.gain.linearRampToValueAtTime(target,at+Math.min(.008,duration/4));gain.gain.linearRampToValueAtTime(0,at+duration);
  source.connect(gain);if(connect)disconnect=connect({source,gain,cue,when:at,target,rate});else gain.connect(context.destination);
  source.onended=stop;context.addEventListener?.('statechange',interrupted);source.start(at);source.stop(at+duration);return{stop};
 }catch{stop();return false;}
}
