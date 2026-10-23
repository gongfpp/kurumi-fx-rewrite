// Receipt-bound C palette. Pure planning never writes game state or invents P/L.
const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
const finite=n=>Number.isFinite(n)?n:0;
const cents=n=>Math.round(finite(n)*100)/100;
const displayedDelta=beat=>cents(cents(beat.displayValue)-cents(beat.displayValue-beat.displayDelta));
const receiptIdentity=beat=>beat?.eventId?{eventId:beat.eventId,atMs:beat.atMs,position:beat.position,before:cents(beat.receiptBefore),after:cents(beat.receiptAfter),direction:beat.direction,strength:beat.strength,endMs:beat.endMs}:{};
export function receiptCueData(timeline,beat,total,{source='receipt',final=false,cumulative=0}={}){
 const events=timeline.events||[],count=events.filter(e=>e.delta).length;
 if(final){const last=(timeline.scoreBeats||[]).filter(b=>Math.abs(b.atMs-timeline.finishAt)<65).at(-1),scored=last?receiptCueData(timeline,last,total):null;return Object.freeze({...receiptIdentity(last),source:'summary',stage:'final',summaryDirection:total<0?'loss':total>0?'profit':'flat',delta:scored?.delta||0,displayValue:cents(Number.isFinite(timeline.closing)?timeline.closing-timeline.opening:total),realizedDelta:scored?.realizedDelta||0,receiptDelta:scored?.receiptDelta||0,cumulative:cents(total),total:cents(total),step:scored?.step||0,steps:scored?.steps||1,receiptIndex:count,receiptCount:count});}
 if(source==='observation')return Object.freeze({source,stage:'observe',delta:Number.isFinite(beat.displayDelta)&&Number.isFinite(beat.displayValue)?displayedDelta(beat):cents(beat.delta),displayValue:cents(Number.isFinite(beat.displayValue)?beat.displayValue:beat.value-timeline.opening),realizedDelta:0,receiptDelta:0,cumulative:cents(Number.isFinite(beat.realized)?beat.realized:cumulative),total:cents(total),step:beat.index,steps:Math.max(1,timeline.assetBeats?.length||1),receiptIndex:0,receiptCount:count});
 const event=events[beat.eventIndex];if(!event)return null;
 const beforeFraction=beat.step?event.beats?.[beat.step-1]?.fraction??0:0;
 // A simultaneous group is one audible beat, just like the scan and score.
 // Its last receipt is only a marker, not the group's monetary amount.
 const before=Number.isFinite(beat.receiptBefore)?beat.receiptBefore:event.before,after=Number.isFinite(beat.receiptAfter)?beat.receiptAfter:event.after,receiptDelta=after-before;
 const current=cents(beat.fraction===1?after:before+receiptDelta*beat.fraction),previous=cents(before+receiptDelta*beforeFraction);
 return Object.freeze({...receiptIdentity(beat),source:event.summary?'summary':'receipt',stage:beat.step===beat.count-1?'receipt-end':'count',delta:Number.isFinite(beat.displayDelta)&&Number.isFinite(beat.displayValue)?displayedDelta(beat):cents(current-previous),displayValue:cents(Number.isFinite(beat.displayValue)?beat.displayValue:current),realizedDelta:cents(current-previous),receiptDelta:cents(receiptDelta),cumulative:current,total:cents(total),step:beat.step,steps:beat.count,receiptIndex:events.slice(0,event.index).filter(e=>e.delta).length,receiptCount:count});
}
export function receiptCueProfile(cue){
 const r=cue?.recap;if(!r||!['receipt','summary','observation'].includes(r.source)||!['delta','receiptDelta','cumulative','total'].every(k=>Number.isFinite(r[k])))return null;
 // The visible cent values own the sound thresholds. Raw realized/receipt
 // totals keep their ledger meaning but can round differently at half a cent.
 const final=r.stage==='final',observe=r.source==='observation',hasDisplay=Number.isFinite(r.displayValue),displayed=hasDisplay?r.displayValue:r.cumulative;
 const amount=hasDisplay?Math.max(Math.abs(displayed),final?0:Math.abs(r.delta)):Math.abs(final?r.total:Math.max(Math.abs(r.cumulative),Math.abs(r.receiptDelta),Math.abs(r.delta))),delta=Math.abs(r.delta);
 // A landing merged with the last receipt keeps that receipt's direction.
 // The final total remains separately identified as summaryDirection.
 const sign=Math.sign(final&&r.eventId&&r.delta?r.delta:final?(hasDisplay?displayed:r.total):r.delta),loss=sign<0;
 if(!sign||!final&&!delta)return null;
 const magnitude=clamp(Math.log1p(amount)/Math.log1p(2000000)),step=clamp((finite(r.step)+1)/Math.max(1,finite(r.steps)));
 const earned=clamp(Math.abs(displayed)/Math.max(1,Math.abs(r.total),amount));
 const intensity=clamp(.16+.48*magnitude+.20*step+.16*earned);
 const chip=true,cash=amount>=800,piano=final||amount>=5000&&r.step%2===0||r.stage==='receipt-end';
 const notes=loss?[-12,-10,-9,-7,-5,-4,-2]:[-7,-5,-2,0,2,4,7,9,12,14,16,19];
 const note=notes[Math.min(notes.length-1,Math.floor((.55*step+.45*magnitude)*(notes.length-1)))];
 const naturalDuration=final?.42+.18*magnitude:.17+(piano?.13:0)+(cash?.07:0),pitchRate=clamp(Number.isFinite(cue.rate)?cue.rate:1,.8,1.25);
 const duration=Number.isFinite(cue.audioBudgetMs)?Math.min(naturalDuration,Math.max(0,cue.audioBudgetMs)*pitchRate/1000):naturalDuration;
 return Object.freeze({loss,final,observe,chip,cash,piano,note:final&&loss?-12:note,rolls:cash?Math.min(5,1+Math.floor(magnitude*2+step*2)):0,
  duration,gain:(observe?.78:1)*(.48+.42*intensity),
  chipVoices:amount<800?1:intensity>.76?3:intensity>.52?2:1,intensity,magnitude,seed:Math.abs(Math.round(r.delta*100)+Math.round(displayed*100)*17+finite(r.receiptIndex)*997)>>>0});
}
// At most 48 compact mono buffers (~2 MiB); no per-frame rendering or full song.
export class ReceiptAudioBank{
 constructor(context,{piano=null,maxEntries=48,sampleRate=22050}={}){this.context=context;this.piano=piano;this.maxEntries=Math.min(48,Math.max(1,maxEntries));this.sampleRate=sampleRate;this.cache=new Map();this.chips=new Map();}
 setPiano(buffer){if(this.piano!==buffer){this.piano=buffer;this.cache.clear();}}
 render(cue){
  const profile=receiptCueProfile(cue);if(!profile||profile.duration<=0)return null;
  const key=JSON.stringify([profile.loss,profile.final,profile.observe,profile.cash,profile.piano,profile.note,profile.rolls,profile.chipVoices,profile.duration,profile.intensity,Number.isFinite(cue.audioBudgetMs)]);
  let buffer=this.cache.get(key);if(buffer){this.cache.delete(key);this.cache.set(key,buffer);return{buffer,gain:profile.gain,profile};}
  const sr=this.sampleRate,length=Math.max(1,Number.isFinite(cue.audioBudgetMs)?Math.floor(profile.duration*sr):Math.ceil(profile.duration*sr)),data=new Float32Array(length);
  let seed=1039+profile.note*97+(profile.loss?7:0);const noise=()=>{seed=(Math.imul(seed,1664525)+1013904223)|0;return (seed>>>0)/2147483648-1;};
  // C audition's chip/paper recipe, compiled as small receipt voices. Cache
  // the expensive chip partials; each additional layer is only a short mix.
  const chipKey=profile.loss+':'+profile.note;
  let chip=this.chips.get(chipKey);
  if(!chip){chip=new Float32Array(Math.ceil(sr*.34));let low=0;const chipPitch=2**((profile.note*.35-3)/12)*(profile.loss?.73:1);
   for(let i=0;i<chip.length;i++){const t=i/sr;let v=0;for(const [f,g,d]of [[950,1,.055],[1640,.7,.095],[2710,.32,.045],[4030,.13,.026]])v+=Math.sin(2*Math.PI*f*chipPitch*t)*g*Math.exp(-t/d)*.060;const n=noise();low+=.24*(n-low);v+=(n-low)*Math.exp(-t/.010)*.080;chip[i]=v*Math.min(1,t/.0018);}
   this.chips.set(chipKey,chip);while(this.chips.size>24)this.chips.delete(this.chips.keys().next().value);
  }
  seed=449+profile.note*103+profile.rolls*37+profile.chipVoices;
  const layers=[[0,1],[.043*(1-profile.intensity)+.014,.42],[.083*(1-profile.intensity)+.032,.24]].slice(0,profile.chipVoices);
  for(const [delay,gain]of layers){const at=Math.round(delay*sr);for(let i=0;i<chip.length&&i+at<length;i++)data[i+at]+=chip[i]*gain;}
  if(profile.cash){let low=0;for(let i=0;i<length;i++){const t=i/sr,spacing=profile.final?.031:.024,local=t%spacing,roll=Math.floor(t/spacing),n=noise();low+=.24*(n-low);if(roll<profile.rolls&&local<.018)data[i]+=((n-low)*.055+Math.sin(2*Math.PI*(155+65*profile.intensity)*local)*.012)*Math.sin(Math.PI*local/.018)**2*(1-roll*.10);}}
  if(profile.piano&&this.piano){
   const source=this.piano.getChannelData(0),voices=profile.final?(profile.loss?[[-12,1,0],[-5,.45,.022],[-1,.20,.044]]:[[0,1,0],[7,.55,.022],[12,.40,.044]]):[[profile.note,1,0]];
   for(const [note,gain,offset]of voices){const rate=2**(note/12)*this.piano.sampleRate/sr,start=Math.round(offset*sr),max=Math.min(length-start,Math.ceil(source.length/rate));
    for(let i=0;i<max;i++){const pos=i*rate,index=Math.floor(pos),fraction=pos-index,sample=(source[index]||0)*(1-fraction)+(source[index+1]||0)*fraction,fade=Math.min(1,i/(sr*.004),Math.max(0,(max-i)/(sr*.035)));data[start+i]+=sample*.26*gain*fade;}
   }
  }
  const tail=Math.ceil(sr*.025);let peak=0;for(let i=0;i<length;i++){if(i>=length-tail)data[i]*=(length-i)/tail;peak=Math.max(peak,Math.abs(data[i]));}
  const scale=peak>.28?.28/peak:1;buffer=this.context.createBuffer(1,length,sr);const output=buffer.getChannelData(0);for(let i=0;i<length;i++)output[i]=data[i]*scale;
  this.cache.set(key,buffer);while(this.cache.size>this.maxEntries)this.cache.delete(this.cache.keys().next().value);
  return{buffer,gain:profile.gain,profile};
 }
}
