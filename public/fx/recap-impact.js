// Presentation-only physical response. Never changes amounts or ledger state.
const clamp=n=>Math.max(0,Math.min(1,n));
export function recapImpact(presentation,{delta=0,strength=.5,asset=false,landing=false}={}){
 const rank=presentation.rank||0,weight=clamp(strength),loss=delta<0;
 const scale=[0,.13,.19,.25][rank],amount=presentation.amountTier==='twenty-million'?1.45:presentation.amountTier==='hundred-thousand'?1.18:1;
 const power=(asset?.7:1)*(landing?1.35:1)*(.5+.5*weight)*amount;
 return{scale:1+scale*power,kick:[0,4,7,10][rank]*power,lift:[0,11,17,24][rank]*power,tilt:(loss?-1:1)*[0,1.2,1.8,2.5][rank]*power,duration:[0,340,390,450][rank],loss,level:rank?(.32+rank*.10)*(.55+.45*weight)*(asset?.65:1):0};
}

// One bounded score, shared by the visual player and both audio backends.
// Keep the final landing and receipt endings before thinning optional market ticks.
export function boundedRecapCues(cues,limit=64){
 const spaced=[];
 for(const cue of cues){const previous=spaced.at(-1);if(previous&&cue.atMs-previous.atMs<65){if(cue.final||!previous.final&&cue.trade&&!previous.trade)spaced[spaced.length-1]=cue;continue;}spaced.push(cue);}
 if(spaced.length<=limit)return Object.freeze(spaced);
 const final=spaced.filter(c=>c.final),endings=spaced.filter(c=>!c.final&&c.trade&&['terminal-fill','terminal-close'].includes(c.kind)),optional=spaced.filter(c=>!final.includes(c)&&!endings.includes(c));
 const sample=(items,count)=>count<=0?[]:count>=items.length?items:count===1?[items.at(-1)]:Array.from({length:count},(_,i)=>items[Math.round(i*(items.length-1)/(count-1))]);
 const keptFinal=sample(final,limit),keptEndings=sample(endings,limit-keptFinal.length),keptOptional=sample(optional,limit-keptFinal.length-keptEndings.length);
 return Object.freeze([...keptFinal,...keptEndings,...keptOptional].sort((a,b)=>a.atMs-b.atMs));
}
