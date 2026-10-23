// A read-only presentation score. Money and the settlement ledger live elsewhere.
export function recapPresentation(snapshot){
 const profit=Number.isFinite(snapshot.primary?.profit)?snapshot.primary.profit:0,rate=Math.abs(Number.isFinite(snapshot.primary?.returnRate)?snapshot.primary.returnRate:profit/Math.max(1,snapshot.daily?.openingNominal||1));
 const tier=profit===0?'flat':rate<.05?'small':rate<.2?'medium':'large',rank={flat:0,small:1,medium:2,large:3}[tier],direction=profit>0?'profit':profit<0?'loss':'flat';
 const duration=[1500,2800,3800,4800][rank],beats=[0,5,8,12][rank],countDuration=duration-[250,650,800,1000][rank];
 const beatTimes=Array.from({length:beats},(_,i)=>Math.round((countDuration-280)*((i+1)/beats)**.72));
 return{tier,rank,direction,duration,countDuration,beats,beatTimes,intensity:[0,.25,.6,1][rank],particles:direction==='profit'?[0,4,9,16][rank]:0,shake:direction==='loss'?[0,1,2,4][rank]:0};
}
export function recapBeatCue(presentation,index,{final=false}={}){
 const fraction=presentation.beats?Math.min(1,(index+1)/presentation.beats):0;
 return{kind:final?(presentation.rank===3?`outcome-${presentation.direction}`:presentation.direction==='profit'?'terminal-fill':'terminal-close'):'terminal-tap',rate:.86+.36*fraction,level:final?.45+presentation.rank*.12:.18+fraction*(.2+presentation.rank*.09)};
}
