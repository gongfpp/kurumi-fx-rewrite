// Presentation progression only. Neither step executes settlement or advances time.
export function settlementPresentation(state){
 const report=state.dayReport;if(!report||report.day!==state.day||!['day_end','resting'].includes(state.phase))return null;
 const id=`${state.runId||state.seed||0}:${state.day}:settlement-v1`,saved=state.settlementPresentation;
 if(saved?.version===1&&saved.id===id&&['recap','story','complete'].includes(saved.stage))return{...saved,token:`${id}:${saved.stage}`};
 const stage=state.story?.presentedDay===state.day?'complete':'recap';return{version:1,id,day:state.day,stage,token:`${id}:${stage}`};
}
export function enterSettlementStory(state,expectedToken){
 const p=settlementPresentation(state);if(!p||p.stage!=='recap'||p.token!==expectedToken)return false;
 state.settlementPresentation={version:1,id:p.id,day:p.day,stage:'story'};return true;
}
export function canConfirmSettlementStory(state,expectedToken){const p=settlementPresentation(state);return !!p&&p.stage==='story'&&p.token===expectedToken;}
export function completeSettlementStory(state,expectedToken){if(!canConfirmSettlementStory(state,expectedToken))return false;const p=settlementPresentation(state);state.settlementPresentation={version:1,id:p.id,day:p.day,stage:'complete'};return true;}
