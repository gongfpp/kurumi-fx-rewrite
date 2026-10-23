// This orchestration never uploads the full local report; the score client
// projects a fixed allowlist and rechecks permanent developer taint.
export class RankingLifecycle {
 constructor({getState,getGeneration=()=>0,isBlocked=()=>false,persist,report,automatic,onStatus=()=>{},schedule=setTimeout,cancel=clearTimeout}={}){
  Object.assign(this,{getState,getGeneration,isBlocked,persist,report,automatic,onStatus,schedule,cancel});this.timer=null;this.pending=null;
 }
 clear(){if(this.timer!==null)this.cancel(this.timer);this.timer=null;}
 async submit(){
  const current=this.getState();
  if(current?.phase!=='ending'||this.isBlocked()){this.clear();return {submitted:false,reason:'unfinished-or-blocked'};}
  if(this.pending)return this.pending;
  const generation=this.getGeneration(),campaign=current.runId;
  const same=()=>this.getGeneration()===generation&&this.getState()?.runId===campaign&&this.getState()?.phase==='ending'&&!this.isBlocked();
  this.clear();
  const task=Promise.resolve().then(async()=>{
   try{
    // persist captures synchronously. Publish exactly that snapshot, never
    // mutations made while its queued durable write is still pending.
    const source=this.getState(),saving=this.persist(),snapshot=structuredClone(source);
    const saved=await saving;
    if(saved!==true||!same()||this.getState()!==source){const reason=saved===true?'stale':'save-pending';this.onStatus({state:'not-submitted',reason});return {submitted:false,reason};}
    this.onStatus({state:'submitting'});
    const result=await this.automatic.submitIfFinished(snapshot,this.report(snapshot));
    if(same())this.onStatus({state:result?.submitted?'submitted':result?.retryAt?'retry-pending':result?.reason==='service-unconfigured'?'unconfigured':'not-submitted',reason:result?.reason});
    if(same()&&Number.isFinite(result?.retryAt))this.timer=this.schedule(()=>{this.timer=null;if(same())void this.submit();},Math.max(250,result.retryAt-Date.now()));
    return result;
   }catch{if(same())this.onStatus({state:'not-submitted',reason:'local-error'});return {submitted:false,reason:'local-error'};}
   finally{this.pending=null;if(!same()&&this.getState()?.phase==='ending'&&!this.isBlocked())this.timer=this.schedule(()=>{this.timer=null;void this.submit();},0);}
  });
  this.pending=task;return task;
 }
}
