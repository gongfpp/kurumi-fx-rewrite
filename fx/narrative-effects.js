// A single option is not permission to execute a financial action. This list
// names only existing narrative acknowledgements and already-completed effects.
const SAFE_ACKNOWLEDGEMENTS=Object.freeze({
 friendStudy:'continue',roommate:'continue',quietNight:'continue',fatherDiscover:'continue',
 fatherUnlock:'look_at_savings',fatherFound:'admit',repayPartial:'record_payment',repayFull:'close_envelope',
});
export function automaticNarrativeChoice(event){
 const id=SAFE_ACKNOWLEDGEMENTS[event?.key];
 return id&&event.choices?.some(choice=>choice.id===id)?id:null;
}
export function keepNarrativeSnapshot(state,event){
 if(state.settlementNarrative?.day===state.day)return state.settlementNarrative;
 state.settlementNarrative={version:1,day:state.day,event:event?JSON.parse(JSON.stringify(event)):null,effectsApplied:false};
 return state.settlementNarrative;
}
