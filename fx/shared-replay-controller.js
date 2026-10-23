import {createSharedTickPlayback} from './shared-tick-playback.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {applySharedReplayEvent} from './engine.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {isSharedReplay,bindSharedReplay,suspendSharedReplay} from './shared-replay-state.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {replayConfigured} from './shared-replay-config.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
// Recreate transport from committed engine checkpoint after every interruption.
// The network accepted cursor is never persisted independently of engine state.
export function createSharedReplayController({config,getContext,canRun,persist,onTick=()=>{},onError=()=>{},sourceFactory=createSharedTickPlayback}){
 let source=null,owner=null,off=[],pending=false,dirty=null,closed=false;
 const same=c=>{const n=getContext();return n.state===c.state&&n.session===c.session&&n.generation===c.generation;};
 function stop(){const old=source;source=null;for(const f of off)f();off=[];old?.stop();if(owner&&same(owner))suspendSharedReplay(owner.state);owner=null;}
 function saved(context,ok){if(ok&&dirty&&same(context)&&dirty.state===context.state&&dirty.generation===context.generation){dirty=null;if(!pending)queueMicrotask(sync);}}
 function sync(){
  const c=getContext();if(pending&&source&&owner&&same(owner))return false;if(closed||!replayConfigured(config)||!isSharedReplay(c.state)||c.session.blocked||!canRun()||pending||dirty&&same(dirty)||c.state.liveMarket.replay.resetRequired){stop();return false;}
  if(source&&owner&&same(owner)){const p=source.status();if(p.streamId&&p.metadata&&!p.resetRequired)bindSharedReplay(c.state,{streamId:p.streamId,checkpoint:c.state.liveMarket.replay.checkpoint});source.start();return true;}stop();owner=c;
  let confirmedMetadata=null;
  const local=sourceFactory({...config,enabled:true});source=local;
  try{const cp=c.state.liveMarket.replay.checkpoint;if(cp)local.importCheckpoint(cp);}catch(e){stop();onError(e);return false;}
  off.push(local.subscribe(({playback:p})=>{if(source!==local||!same(c))return;if(p.transport==='online'&&p.metadata&&p.metadata!==confirmedMetadata&&p.streamId&&!p.resetRequired){try{confirmedMetadata=p.metadata;bindSharedReplay(c.state,{streamId:p.streamId,checkpoint:c.state.liveMarket.replay.checkpoint});}catch(e){stop();onError(e);}}else if(p.resetRequired){void receive({type:'reset',reason:p.transport});}else if(['disconnected','protocol-error'].includes(p.transport)){suspendSharedReplay(c.state);}}));
  async function receive(output){
   if(source!==local||!same(c)||pending)return;
   if(output.type!=='reset'&&output.type!=='tick')return;
   if(output.type==='reset'&&output.cursor&&c.state.liveMarket.replay.streamId===null&&c.state.liveMarket.replay.checkpoint===null)return;
   if(!canRun()||c.session.blocked||!c.session.check()){stop();return;}
   pending=true;
   try{const result=applySharedReplayEvent(c.state,output,{watching:true});dirty=c;local.stop();suspendSharedReplay(c.state);onTick(result);const ok=await persist();saved(c,ok);if(!ok)stop();}catch(e){stop();onError(e);}finally{pending=false;sync();}
  }
  off.push(local.subscribePlayback(output=>{void receive(output);}));
  return local.start();
 }
 return Object.freeze({sync,saved,pause:stop,close(){closed=true;stop();},get pending(){return pending;},get dirty(){return dirty!==null;}});
}
