// Discovery of the theft is separate from discovering the untouched cabinet.
// Only the host's daily-close transition may call checkFatherTheftAtClose.
// No money, orders, expenses, market RNG, housing, or ending is changed here.
export const FATHER_THEFT_POLICY=Object.freeze({
 version:1,firstDay:3,guaranteedDay:5,flatYen:1000,largeYen:100000,
 ordinary:Object.freeze({3:.2,4:.5,5:1}),noticeable:Object.freeze({3:.6,4:.85,5:1}),
});
const finite=Number.isFinite,day=n=>Number.isSafeInteger(n)&&n>=1;
const bands=new Set(['flat','small-profit','large-profit','small-loss','large-loss']);
const informed=s=>s.family?.discovered||s.family?.informed||!(s.family?.outstanding>0);
const taken=s=>s.fatherUsed||s.family?.takenConfirmed||s.family?.withdrawal;
export function fatherTheftBand(tradingNet){
 if(!finite(tradingNet))return null;
 const magnitude=Math.abs(tradingNet);
 if(magnitude<=FATHER_THEFT_POLICY.flatYen)return 'flat';
 return `${magnitude>=FATHER_THEFT_POLICY.largeYen?'large':'small'}-${tradingNet>0?'profit':'loss'}`;
}
export function fatherTheftProbability(elapsed,tradingNet){
 if(!Number.isSafeInteger(elapsed)||elapsed<FATHER_THEFT_POLICY.firstDay)return 0;
 if(elapsed>=FATHER_THEFT_POLICY.guaranteedDay)return 1;
 return (finite(tradingNet)&&Math.abs(tradingNet)>=FATHER_THEFT_POLICY.largeYen?FATHER_THEFT_POLICY.noticeable:FATHER_THEFT_POLICY.ordinary)[elapsed];
}
// Dedicated deterministic channel: identical run, withdrawal and day always
// produce the same roll, even after a reload of the pre-close save.
export function fatherTheftRoll(eventId,closeDay){
 let n=2166136261;for(const c of `${eventId}:father-theft-v1:${closeDay}`){n^=c.charCodeAt(0);n=Math.imul(n,16777619);}
 n^=n>>>16;n=Math.imul(n,0x7feb352d);n^=n>>>15;n=Math.imul(n,0x846ca68b);n^=n>>>16;
 return (n>>>0)/4294967296;
}
export function validFatherTheftWatch(w){
 if(w===undefined)return true;
 if(!w||w.version!==1||typeof w.eventId!=='string'||!w.eventId||!day(w.theftDay)||!(w.baselineTradingProfit===null||finite(w.baselineTradingProfit))||!['watching','detected'].includes(w.status)||!Array.isArray(w.checks)||w.checks.length>3||!(w.lastCheckedDay===null||day(w.lastCheckedDay)))return false;
 if(w.baselineTradingProfit===null&&!(w.legacy===true&&w.baselineUnavailable===true))return false;
 let previous=w.theftDay;
 for(const c of w.checks){if(!c||!day(c.day)||c.day<=previous||c.day-w.theftDay<3||!(c.tradingNet===null||finite(c.tradingNet))||!finite(c.roll)||c.roll<0||c.roll>=1||c.probability!==fatherTheftProbability(c.day-w.theftDay,c.tradingNet)||typeof c.detected!=='boolean'||c.detected!==(c.roll<c.probability))return false;previous=c.day;}
 if(w.lastCheckedDay!==(w.checks.at(-1)?.day??null))return false;
 if(w.acknowledgedDay!==undefined&&(!day(w.acknowledgedDay)||w.status!=='detected'))return false;
 if(w.status==='watching')return !w.receipt&&w.checks.every(c=>!c.detected);
 const r=w.receipt,last=w.checks.at(-1);
 return !!r&&last?.detected===true&&w.checks.slice(0,-1).every(c=>!c.detected)&&r.id===`${w.eventId}:found:${last.day}`&&r.day===last.day&&r.theftDay===w.theftDay&&r.tradingNet===last.tradingNet&&r.outcomeBand===fatherTheftBand(last.tradingNet)&&r.sceneId===(r.outcomeBand?`father-discovery-${r.outcomeBand}`:'father-found')&&(r.outcomeBand===null||bands.has(r.outcomeBand));
}
export function beginFatherTheftWatch(s,{tradingProfit}={}){
 if(s.mode!=='story'||!s.family?.withdrawal||s.family.theftDiscovery!==undefined)return false;
 const withdrawal=s.family.withdrawal;
 if(!day(withdrawal.day)||!finite(tradingProfit)||typeof withdrawal.id!=='string')return false;
 s.family.theftDiscovery={version:1,eventId:withdrawal.id,theftDay:withdrawal.day,baselineTradingProfit:tradingProfit,status:'watching',checks:[],lastCheckedDay:null};
 return true;
}
function migrateUnobservedTheft(s){
 if(s.family.theftDiscovery!==undefined||!taken(s)||informed(s))return;
 // A frozen/queued old scene remains its original event and image. An old
 // withdrawal has no certified P/L baseline: never invent a five-band result.
 if(s.story?.queue?.includes('fatherFound')||s.story?.seen?.includes('fatherFound')||s.settlementNarrative?.event?.key==='fatherFound')return;
 const withdrawal=s.family.withdrawal,borrowed=s.family.borrowedAt;
 const theftDay=day(withdrawal?.day)?withdrawal.day:finite(borrowed)&&borrowed>=0?Math.floor(borrowed/4)+1:s.day;
 if(!day(theftDay)||theftDay>s.day)return;
 s.family.theftDiscovery={version:1,eventId:withdrawal?.id||`father:${s.runId||s.seed}`,theftDay,baselineTradingProfit:null,status:'watching',checks:[],lastCheckedDay:null,legacy:true,baselineUnavailable:true};
}
export function fatherTheftReceipt(s){
 const w=s?.family?.theftDiscovery;
 return validFatherTheftWatch(w)&&w?.status==='detected'?w.receipt:null;
}
export function checkFatherTheftAtClose(s,{tradingProfit}={}){
 if(s.mode!=='story'||s.phase!=='day_end'||s.dayReport?.day!==s.day||!day(s.day)||!taken(s)||informed(s)||!finite(tradingProfit))return null;
 migrateUnobservedTheft(s);
 const w=s.family.theftDiscovery;
 if(!w||!validFatherTheftWatch(w)||w.status!=='watching'||s.day-w.theftDay<3||w.lastCheckedDay!==null&&s.day<=w.lastCheckedDay)return null;
 const tradingNet=w.baselineTradingProfit===null?null:tradingProfit-w.baselineTradingProfit;
 const probability=fatherTheftProbability(s.day-w.theftDay,tradingNet),roll=fatherTheftRoll(w.eventId,s.day),detected=roll<probability;
 w.checks.push({day:s.day,tradingNet,probability,roll,detected});w.lastCheckedDay=s.day;
 if(!detected)return null;
 const outcomeBand=fatherTheftBand(tradingNet);
 w.status='detected';w.receipt={id:`${w.eventId}:found:${s.day}`,day:s.day,theftDay:w.theftDay,tradingNet,outcomeBand,sceneId:outcomeBand?`father-discovery-${outcomeBand}`:'father-found'};
 s.story.queue ||= [];if(!s.story.queue.includes('fatherFound')&&!s.story.seen?.includes('fatherFound'))s.story.queue.push('fatherFound');
 return w.receipt;
}
