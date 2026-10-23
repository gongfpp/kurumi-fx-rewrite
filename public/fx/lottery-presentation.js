// Presentation consumes a durably saved result. It never draws, settles or pays.
const finite=n=>Number.isFinite(n)&&n>=0;
export function lotteryPresentationReceipt(ticket){
 if(!ticket||typeof ticket.id!=='string'||!ticket.id||ticket.status!=='settled'||!['normal','cheat'].includes(ticket.kind)||!finite(ticket.result?.prize))throw new TypeError('A settled lottery ticket is required');
 const number=String(ticket.number??ticket.id);
 return Object.freeze({id:ticket.id,number,kind:ticket.kind,tier:ticket.result.tier,prize:ticket.result.prize});
}
export function lotteryRevealTimeline(receipt,{fastMs=600,stopGapMs=180,slowMs=500}={}){
 if(![fastMs,stopGapMs,slowMs].every(n=>Number.isFinite(n)&&n>0))throw new RangeError('Invalid reveal timing');
 const digits=[...receipt.number];
 return Object.freeze(digits.map((digit,index)=>Object.freeze({digit,index,slowAt:fastMs+index*stopGapMs,stopAt:fastMs+index*stopGapMs+slowMs})));
}
// The host persists settlement before calling open(...,{saved:true}). Closing,
// replaying and restoring this local controller cannot mutate the game receipt.
export class LotteryPresentation {
 constructor({now=()=>performance.now(),onFrame=()=>{},timing}={}){Object.assign(this,{now,onFrame,timing});this.receipt=null;this.timeline=[];this.startedAt=0;this.elapsed=0;this.status='closed';}
 open(ticket,{saved=false,reducedMotion=false}={}){
  if(saved!==true)throw Object.assign(Error('Lottery settlement has not been saved'),{code:'save-pending'});
  const receipt=lotteryPresentationReceipt(ticket);
  this.receipt=receipt;this.timeline=lotteryRevealTimeline(receipt,this.timing);this.startedAt=this.now();this.elapsed=0;this.status=reducedMotion?'revealed':'running';return this.frame();
 }
 frame(){
  if(!this.receipt)return {status:'closed',receipt:null,digits:[]};
  if(this.status==='running')this.elapsed=Math.max(this.elapsed,Math.max(0,this.now()-this.startedAt));
  const duration=this.timeline.at(-1)?.stopAt??0;
  if(this.status==='running'&&this.elapsed>=duration)this.status='revealed';
  const digits=this.timeline.map(({digit,index,slowAt,stopAt})=>{
   const stopped=this.status==='revealed'||this.elapsed>=stopAt;
   // A deterministic visual cycle only; final digits are the saved ticket.
   const slowing=this.elapsed>=slowAt,progress=Math.min(1,Math.max(0,(this.elapsed-slowAt)/(stopAt-slowAt)));
   const travel=this.elapsed<slowAt?this.elapsed/35:slowAt/35+(stopAt-slowAt)/35*(progress-progress*progress/2);
   return {index,value:stopped?digit:/\d/.test(digit)?String((Math.floor(travel)+index)%10):digit,phase:stopped?'stopped':slowing?'slowing':'fast'};
  });
  const result={status:this.status,receipt:this.receipt,digits,elapsed:this.elapsed,duration};this.onFrame(result);return result;
 }
 skip(){if(this.receipt&&this.status!=='closed')this.status='revealed';return this.frame();}
 close(){this.status='closed';return this.frame();}
}
