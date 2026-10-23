// Inactive candidate. Only the explicitly configured relay is contacted; never the provider.
// Playback is observational and cannot satisfy the live engine's fresh/executable quote gate.
export const SHARED_TICK_SYMBOLS=Object.freeze(['USDJPY','AUDJPY','GBPJPY']);
const freeze=Object.freeze,integer=n=>Number.isSafeInteger(n)&&n>=0;
const symbolKey=s=>typeof s==='string'?s.replace('/',''):'';
function cursorParts(cursor){if(typeof cursor!=='string'||cursor.length>180)return null;const m=/^([A-Za-z0-9_-]{1,128}):(0|[1-9]\d*)$/.exec(cursor);return m&&integer(Number(m[2]))?{streamId:m[1],sequence:Number(m[2])}:null;}
function parseEvent(raw,serverTime){
 const q=raw?.tick,symbol=symbolKey(q?.symbol);
 if(!integer(raw?.sequence)||raw.sequence<1||!integer(raw.receivedAt)||typeof raw.late!=='boolean'||!SHARED_TICK_SYMBOLS.includes(symbol)||!integer(q?.sourceTimestamp)||q.sourceTimestamp<1||q.sourceTimestamp>raw.receivedAt+5000||raw.receivedAt>serverTime+5000||typeof q.sourceTimestampText!=='string'||Date.parse(q.sourceTimestampText)!==q.sourceTimestamp||typeof q.source!=='string'||!q.source||q.source.length>500||!['bid','ask','mid'].every(k=>Number.isFinite(q[k])&&q[k]>0)||q.bid>q.mid||q.mid>q.ask||![null,'open','closed'].includes(q.providerMarketState)||![null,true,false].includes(q.providerStale)||q.executionEligible!==false||q.priceBasis!=='provider-indicative-mid')throw Error('invalid-shared-tick');
 return freeze({sequence:raw.sequence,receivedAt:raw.receivedAt,late:raw.late,tick:freeze({...q,symbol:symbol.slice(0,3)+'/'+symbol.slice(3)})});
}
function parseInitialWindow(value){
 if(value===undefined||value===null)return null;
 if(!value||Object.getPrototypeOf(value)!==Object.prototype||Object.keys(value).sort().join(',')!=='availableCount,completeRetainedWindow,earliestSequence,limit,omittedCount,selectedCount'||!integer(value.limit)||value.limit<1||value.limit>900||!['availableCount','selectedCount','omittedCount'].every(k=>integer(value[k])&&value[k]<=30000)||value.selectedCount>value.limit||value.selectedCount+value.omittedCount!==value.availableCount||!(value.earliestSequence===null||integer(value.earliestSequence)&&value.earliestSequence>0)||((value.selectedCount===0)!==(value.earliestSequence===null))||typeof value.completeRetainedWindow!=='boolean'||value.completeRetainedWindow!==(value.omittedCount===0))throw Error('invalid-initial-window');
 return freeze({...value});
}
// A checkpoint records played identities, never the accepted network cursor.
// The bound includes the unresolved sequence span, so missing identities cannot
// silently fall out of the dedup window. No wall-clock expiry is invented:
// the relay's explicit cursor-expired reset is the authoritative retention check.
export function validateReplayCheckpoint(value,{maxEntries=2048}={}){
 if(!value||Object.getPrototypeOf(value)!==Object.prototype||Object.keys(value).sort().join(',')!=='floor,playbackClock,playedAboveFloor,streamId,version'||value.version!==1||!cursorParts(`${value.streamId}:${value.floor}`)||!integer(value.floor)||!Array.isArray(value.playedAboveFloor)||value.playedAboveFloor.length>maxEntries||!(value.playbackClock===null||integer(value.playbackClock)&&value.playbackClock>0))throw Error('invalid-replay-checkpoint');
 let previous=value.floor;for(const seq of value.playedAboveFloor){if(!integer(seq)||seq<=previous||seq-value.floor>maxEntries||seq===value.floor+1)throw Error('invalid-replay-checkpoint');previous=seq;}
 if(value.playbackClock===null&&value.playedAboveFloor.length)throw Error('invalid-replay-checkpoint');
 return freeze({version:1,streamId:value.streamId,floor:value.floor,playedAboveFloor:freeze([...value.playedAboveFloor]),playbackClock:value.playbackClock});
}
export function createSharedTickPlayback({endpoint,baseURL=globalThis.location?.href,allowedOrigin,enabled=false,eventSourceFactory=url=>new EventSource(url),clock=Date.now,setTimer=setTimeout,clearTimer=clearTimeout,maxQueue=2048,maxBatch=2048,playbackRate=1,maxGapMs=60000}={}){
 if(!integer(maxQueue)||maxQueue<1||maxQueue>16384||!integer(maxBatch)||maxBatch<1||maxBatch>maxQueue||!Number.isFinite(playbackRate)||playbackRate<1||playbackRate>8||!integer(maxGapMs)||maxGapMs<1||maxGapMs>60000)throw TypeError('invalid-playback-configuration');
 let url=null;if(endpoint){url=new URL(endpoint,baseURL);if(!['http:','https:'].includes(url.protocol)||url.username||url.password||url.hash||url.origin!==(allowedOrigin||new URL(baseURL).origin))throw TypeError('unapproved-relay-origin');}
 let connection=null,timer=null,running=false,transport='idle',streamId=null,acceptedCursor=null,acceptedSequence=0,playedCursor=null,playbackClock=null,lastWallClock=null,resetRequired=false,lateCount=0,resetCount=0,metadata=null;
 let floor=0;const playedAboveFloor=new Set();
 const queue=[],quotes=new Map(),listeners=new Set(),playListeners=new Set();
 const now=()=>{const n=clock();if(!integer(n)||n<1)throw TypeError('invalid-client-clock');return n;};
 const emit=(set,value)=>{for(const listener of [...set]){try{listener(value);}catch{}}};
 function snapshot(symbol){const key=symbolKey(symbol);if(!SHARED_TICK_SYMBOLS.includes(key))throw TypeError('unsupported-symbol');const quote=quotes.get(key)||null,t=now();return freeze({transport,status:!quote?'waiting':quote.providerMarketState==='closed'?'closed':quote.providerStale!==false||t-quote.sourceTimestamp>30000?'delayed':'observed',quote,sourceAgeMs:quote?Math.max(0,t-quote.sourceTimestamp):null,receivedAgeMs:quote?Math.max(0,t-quote.receivedAt):null,clientReceivedAgeMs:quote?Math.max(0,t-quote.clientReceivedAt):null,playbackClock,playbackRate,canTrade:false,executionEligible:false});}
 const all=()=>freeze(Object.fromEntries(SHARED_TICK_SYMBOLS.map(symbol=>[symbol,snapshot(symbol)])));
 function exportCheckpoint(){return streamId===null?null:validateReplayCheckpoint({version:1,streamId,floor,playedAboveFloor:[...playedAboveFloor].sort((a,b)=>a-b),playbackClock},{maxEntries:Math.min(maxQueue,2048)});}
 function importCheckpoint(value){
  if(running||queue.length||streamId!==null)throw Error('checkpoint-import-requires-empty-stopped-source');
  const cp=validateReplayCheckpoint(value,{maxEntries:Math.min(maxQueue,2048)});
  streamId=cp.streamId;floor=cp.floor;for(const seq of cp.playedAboveFloor)playedAboveFloor.add(seq);playbackClock=cp.playbackClock;acceptedSequence=floor;acceptedCursor=`${streamId}:${floor}`;return exportCheckpoint();
 }
 const alreadyPlayed=seq=>seq<=floor||playedAboveFloor.has(seq);
 function requireReset(reason){resetRequired=true;transport='reset-required';cancelTimer();disconnect();emit(playListeners,freeze({type:'reset',reason,checkpoint:exportCheckpoint(),executionEligible:false}));notify();}
 function recordPlayed(seq){playedAboveFloor.add(seq);while(playedAboveFloor.delete(floor+1))floor++;}
 const status=()=>freeze({transport,streamId,acceptedCursor,playedCursor,playbackClock,lastWallClock,queued:queue.length,checkpoint:exportCheckpoint(),resetRequired,lateCount,resetCount,metadata,playbackRate,executionEligible:false});
 function notify(){emit(listeners,freeze({snapshots:all(),playback:status()}));}
 function disconnect(){connection?.close();connection=null;}
 function cancelTimer(){if(timer!==null)clearTimer(timer);timer=null;}
 function schedule(){
  if(!running||timer!==null||!queue.length)return;
  const delta=playbackClock===null?0:Math.max(0,queue[0].tick.sourceTimestamp-playbackClock),interval=Math.min(maxGapMs,delta/playbackRate),delay=lastWallClock===null?0:Math.max(0,lastWallClock+interval-now());
  timer=setTimer(()=>{timer=null;step();schedule();},delay);
 }
 function step(){
  if(resetRequired||!queue.length)return null;cancelTimer();const head=queue[0];
  if(head.sequence-floor>Math.min(maxQueue,2048)){requireReset('checkpoint-capacity');throw Error('checkpoint-capacity');}
  const event=queue.shift(),t=now(),prior=playbackClock;
  if(prior!==null&&event.tick.sourceTimestamp<prior)throw Error('playback-clock-regression');
  recordPlayed(event.sequence);
  playbackClock=event.tick.sourceTimestamp;lastWallClock=t;playedCursor=`${streamId}:${event.sequence}`;
  const quote=freeze({...event.tick,receivedAt:event.receivedAt,clientReceivedAt:event.clientReceivedAt,sequence:event.sequence,cursor:playedCursor,executionEligible:false});quotes.set(symbolKey(quote.symbol),quote);
  const output=freeze({type:'tick',checkpoint:exportCheckpoint(),event:freeze({...event,tick:quote}),playbackClock,wallClock:t,sourceAgeMs:Math.max(0,t-quote.sourceTimestamp),receivedAgeMs:Math.max(0,t-event.receivedAt),sourceDeltaMs:prior===null?0:playbackClock-prior,playbackRate,compressedGap:prior!==null&&(playbackClock-prior)/playbackRate>maxGapMs,executionEligible:false});
  emit(playListeners,output);notify();return output;
 }
 function ingest(kind,payload){
  if(!['batch','reset'].includes(kind)||payload?.schemaVersion!==1||payload.provider!=='biquote'||payload.sampling!=='provider-irregular-ticks'||payload.executionEligible!==false||!integer(payload.serverTime)||!Array.isArray(payload.events)||payload.events.length>maxBatch||typeof payload.reset!=='boolean'||typeof payload.hasMore!=='boolean'||!integer(payload.highWatermark))throw Error('invalid-shared-batch');
  const cursor=cursorParts(payload.cursor);if(!cursor||payload.streamId!==cursor.streamId||cursor.sequence>payload.highWatermark)throw Error('invalid-shared-cursor');
  const reset=kind==='reset'||payload.reset;
  if(streamId&&cursor.streamId!==streamId&&!reset){resetRequired=true;transport='reset-required';disconnect();notify();throw Error('stream-change-requires-reset');}
  const events=payload.events.map(e=>parseEvent(e,payload.serverTime)),initialWindow=parseInitialWindow(payload.initialWindow);
  let previous=0;for(const e of events){if(e.sequence<=previous||e.sequence>cursor.sequence)throw Error('unordered-shared-sequence');previous=e.sequence;}
  if(reset&&streamId!==null){requireReset(payload.reason||'server-reset');return freeze({accepted:0,queued:queue.length,reset:true,resetRequired:true});}
  const queuedSequences=new Set(queue.map(e=>e.sequence));
  const fresh=events.filter(e=>!alreadyPlayed(e.sequence)&&!queuedSequences.has(e.sequence));
  if(!reset&&cursor.sequence<acceptedSequence&&!fresh.length)return freeze({accepted:0,duplicate:true});
  if((reset?0:queue.length)+fresh.length>maxQueue){resetRequired=true;transport='backpressure';disconnect();notify();throw Error('shared-queue-capacity');}
  if(reset){cancelTimer();queue.length=0;quotes.clear();playbackClock=null;playedCursor=null;acceptedSequence=0;floor=0;playedAboveFloor.clear();resetRequired=false;resetCount++;emit(playListeners,freeze({type:'reset',reason:payload.reason||'server-reset',cursor:payload.cursor,executionEligible:false}));}
  if(streamId===null)floor=events.length?events[0].sequence-1:cursor.sequence;
  streamId=cursor.streamId;const received=now(),priorHead=queue[0];
  for(const e of fresh){if(e.late||playbackClock!==null&&e.tick.sourceTimestamp<playbackClock){lateCount++;emit(playListeners,freeze({type:'late-observation',event:e,executionEligible:false}));continue;}queue.push(freeze({...e,clientReceivedAt:received}));}
  queue.sort((a,b)=>a.tick.sourceTimestamp-b.tick.sourceTimestamp||a.sequence-b.sequence);
  acceptedSequence=Math.max(acceptedSequence,cursor.sequence);acceptedCursor=`${streamId}:${acceptedSequence}`;metadata=freeze({serverTime:payload.serverTime,highWatermark:payload.highWatermark,hasMore:payload.hasMore,initialWindow:initialWindow??metadata?.initialWindow??null,coverage:structuredClone(payload.coverage||{}),issues:structuredClone(payload.issues||{}),sourceAgeMs:structuredClone(payload.sourceAgeMs||{})});transport='online';resetRequired=false;
  // A newly arrived earlier observation must be scheduled by its actual timestamp.
  if(queue[0]!==priorHead)cancelTimer();schedule();notify();return freeze({accepted:fresh.length,queued:queue.length,reset});
 }
 function connect(){
  if(!running||!url||resetRequired)return;const target=new URL(url);if(streamId!==null)target.searchParams.set('cursor',`${streamId}:${floor}`);
  connection=eventSourceFactory(target.href);const current=connection;transport='connecting';
  for(const kind of ['batch','reset'])connection.addEventListener(kind,event=>{if(connection!==current||!running)return;try{if(typeof event.data!=='string'||event.data.length>2*1024*1024)throw Error('shared-event-size');const payload=JSON.parse(event.data);if(event.lastEventId&&event.lastEventId!==payload.cursor)throw Error('SSE-cursor-mismatch');ingest(kind,payload);}catch{transport=resetRequired?transport:'protocol-error';disconnect();notify();}});
  connection.addEventListener('error',()=>{if(connection!==current||!running)return;transport='disconnected';notify();});connection.addEventListener('open',()=>{if(connection!==current||!running)return;transport='online';notify();});notify();
 }
 function start(){if(!enabled||!url||running||resetRequired)return false;running=true;connect();schedule();return true;}
 function stop(){running=false;cancelTimer();disconnect();transport='stopped';notify();}
 function reconnect(){if(!running||resetRequired)return false;disconnect();connect();return true;}
 function reset(){stop();queue.length=0;quotes.clear();streamId=null;acceptedCursor=null;acceptedSequence=0;playedCursor=null;playbackClock=null;lastWallClock=null;floor=0;playedAboveFloor.clear();resetRequired=false;metadata=null;transport='idle';notify();}
 const subscribe=listener=>{if(typeof listener!=='function')throw TypeError('expected-listener');listeners.add(listener);return()=>listeners.delete(listener);},subscribePlayback=listener=>{if(typeof listener!=='function')throw TypeError('expected-listener');playListeners.add(listener);return()=>playListeners.delete(listener);};
 return freeze({start,stop,reconnect,reset,ingest,step,snapshot,all,status,subscribe,subscribePlayback,exportCheckpoint,importCheckpoint});
}
