// Explicit opt-in delayed observation replay. No synthetic prices or clock substitution.
const integer=n=>Number.isSafeInteger(n)&&n>=0;
const stream=id=>typeof id==='string'&&/^[A-Za-z0-9_-]{1,128}$/.test(id);
const symbols=['USD/JPY','AUD/JPY','GBP/JPY'];
export const isSharedReplay=s=>s?.liveMarket?.version===2&&s.liveMarket.mode==='shared-replay';
export function validReplayCheckpoint(c){return !!c&&c.version===1&&stream(c.streamId)&&integer(c.floor)&&Array.isArray(c.playedAboveFloor)&&c.playedAboveFloor.length<=2048&&c.playedAboveFloor.every((n,i,a)=>integer(n)&&n>c.floor&&(i===0||n>a[i-1]))&&(c.playbackClock===null||integer(c.playbackClock)&&c.playbackClock>0);}
const played=(c,n)=>n<=c.floor||c.playedAboveFloor.includes(n);
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
export function initializeSharedReplay(s){
 if(s.liveMarket?.version!==1||s.positions?.length||Object.keys(s.liveMarket.quotes||{}).length)throw Error('Replay requires a fresh game');
 s.liveMarket.version=2;s.liveMarket.mode='shared-replay';s.liveMarket.replay={version:1,streamId:null,checkpoint:null,playbackClock:null,serverReceivedAt:null,wallPlayedAt:null,bound:false,resetRequired:false};return s;
}
export function bindSharedReplay(s,{streamId,checkpoint=null}={}){
 if(!isSharedReplay(s)||!stream(streamId))throw Error('Invalid replay binding');const r=s.liveMarket.replay;
 if(r.resetRequired||r.streamId&&r.streamId!==streamId)throw Error('Replay requires a new game');
 if(r.streamId? !same(checkpoint,r.checkpoint):checkpoint!==null)throw Error('Resume requires exact saved checkpoint');
 r.streamId=streamId;r.bound=true;s.liveMarket.transport='online';return s;
}
export function suspendSharedReplay(s){if(!isSharedReplay(s))return false;s.liveMarket.replay.bound=false;s.liveMarket.transport='disconnected';return true;}
export function sharedReplayQuoteReady(s,symbol){const l=s.liveMarket,r=l?.replay,q=l?.quotes?.[symbol];return !!(isSharedReplay(s)&&r?.bound===true&&!r.resetRequired&&l.transport==='online'&&q?.providerMarketState==='open'&&q.providerStale===false&&q.replay?.streamId===r.streamId&&integer(q.replay.sequence)&&integer(r.playbackClock)&&q.sourceTimestamp<=r.playbackClock&&r.playbackClock-q.sourceTimestamp<=30000);}
export function resetSharedReplay(s,reason='server-reset'){if(!isSharedReplay(s))return false;s.liveMarket.replay.bound=false;s.liveMarket.replay.resetRequired=true;s.liveMarket.replay.resetReason=typeof reason==='string'?reason.slice(0,100):'server-reset';s.liveMarket.transport='reset-required';s.marketPaused=true;return true;}
export function validSharedReplay(s){
 if(!isSharedReplay(s))return false;const r=s.liveMarket.replay;
 if(!r||r.version!==1||typeof r.bound!=='boolean'||typeof r.resetRequired!=='boolean'||r.resetRequired&&r.bound||r.streamId!==null&&!stream(r.streamId)||[r.playbackClock,r.serverReceivedAt,r.wallPlayedAt].some(n=>n!==null&&(!integer(n)||n===0)))return false;
 if(r.checkpoint!==null&&(!validReplayCheckpoint(r.checkpoint)||r.checkpoint.streamId!==r.streamId||r.checkpoint.playbackClock!==r.playbackClock))return false;
 if(r.playbackClock!==null&&r.checkpoint===null||r.bound&&!stream(r.streamId))return false;
 return Object.values(s.liveMarket.quotes||{}).every(q=>q.replay?.streamId===r.streamId&&integer(q.replay.sequence)&&q.replay.sequence>0&&r.checkpoint&&played(r.checkpoint,q.replay.sequence)&&integer(q.receivedAt)&&integer(q.clientReceivedAt)&&q.sourceTimestamp<=r.playbackClock);
}
export function safeSharedReplayEvidence(v){
 if(!v||v.mode!=='shared-replay'||!stream(v.streamId)||!integer(v.sequence)||v.sequence<1||!['playbackClock','serverReceivedAt','wallPlayedAt','sourceTimestamp'].every(k=>integer(v[k])&&v[k]>0)||v.sourceTimestamp>v.playbackClock||v.sourceTimestamp>v.serverReceivedAt+5000||v.serverReceivedAt>v.wallPlayedAt+5000)return null;
 return {mode:'shared-replay',streamId:v.streamId,sequence:v.sequence,sourceTimestamp:v.sourceTimestamp,playbackClock:v.playbackClock,serverReceivedAt:v.serverReceivedAt,wallPlayedAt:v.wallPlayedAt,sourceDelayMs:Math.max(0,v.wallPlayedAt-v.sourceTimestamp)};
}
export function prepareSharedReplayEvent(s,o){
 const r=s.liveMarket?.replay,e=o?.event,q=e?.tick,c=o?.checkpoint;
 if(!isSharedReplay(s)||!r.bound||r.resetRequired||s.liveMarket.transport!=='online'||o?.type!=='tick'||o.executionEligible!==false||q?.executionEligible!==false||!validReplayCheckpoint(c)||c.streamId!==r.streamId||!integer(e?.sequence)||e.sequence<1||!played(c,e.sequence)||r.checkpoint&&played(r.checkpoint,e.sequence)||o.playbackClock!==q.sourceTimestamp||c.playbackClock!==q.sourceTimestamp||r.playbackClock!==null&&q.sourceTimestamp<r.playbackClock)throw Error('Invalid replay execution event');
 if(r.checkpoint&&(c.floor<r.checkpoint.floor||!r.checkpoint.playedAboveFloor.every(n=>played(c,n))))throw Error('Replay checkpoint regressed');
 if(!symbols.includes(q.symbol)||!integer(q.sourceTimestamp)||q.sourceTimestamp<1||Date.parse(q.sourceTimestampText)!==q.sourceTimestamp||typeof q.source!=='string'||!q.source.trim()||q.source.length>200||!['bid','ask','mid'].every(k=>Number.isFinite(q[k])&&q[k]>0)||q.bid>q.mid||q.mid>q.ask||![null,'open','closed'].includes(q.providerMarketState)||![null,true,false].includes(q.providerStale)||q.priceBasis!=='provider-indicative-mid'||!integer(e.receivedAt)||!integer(o.wallClock)||q.sourceTimestamp>e.receivedAt+5000||e.receivedAt>o.wallClock+5000||q.sourceTimestamp>Date.now()+5000)throw Error('Invalid replay quote');
 const quote={...q,provider:'biquote',receivedAt:e.receivedAt,clientReceivedAt:o.wallClock,replay:{streamId:r.streamId,sequence:e.sequence}};
 const quotes={...s.liveMarket.quotes,[q.symbol]:quote};
 const snapshots=Object.fromEntries(symbols.map(symbol=>[symbol.replace('/',''),{transport:'online',status:'observed',quote:quotes[symbol]||null,canTrade:false}]));
 return {replay:{checkpoint:structuredClone(c),playbackClock:q.sourceTimestamp,serverReceivedAt:e.receivedAt,wallPlayedAt:o.wallClock},snapshots};
}
