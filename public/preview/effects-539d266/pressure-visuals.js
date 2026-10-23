export const PRESSURE_TOOLTIP='连续点击可突破限制；极度亢奋、极度绝望时均可使用';
export const PRESSURE_CRACKS=Object.freeze([
 {at:2,path:'M0 30 L20 27 L30 34 L46 23'},
 {at:4,path:'M46 23 L59 27 L70 12 L86 20 L99 0'},
 {at:6,path:'M200 34 L177 30 L164 39 L148 28 L131 38'},
 {at:8,path:'M131 38 L118 31 L105 49 L88 43 L73 64'},
 {at:10,path:'M70 12 L75 34 L63 45 M164 39 L161 55 L174 64 M118 31 L128 16 L151 10'},
]);
export function pressureVisual(taps,{reduced=false,unlocked=false}={}){
 const value=Math.max(0,Math.min(12,Number.isFinite(taps)?taps:0)),intensity=value/12;
 return {taps:value,intensity,stage:unlocked?'broken':value>=10?'rupture':value>=7?'fracture':value>=3?'crack':'strained',
  visibleBranches:PRESSURE_CRACKS.filter(p=>value>=p.at).length,displacement:reduced?0:1+6*intensity,
  duration:reduced?0:unlocked?460:120+140*intensity,rift:!reduced&&value>=8,
  hint:unlocked?'已突破，再选一次。至少 25×，新单不设止损。':`${PRESSURE_TOOLTIP} · ${value}/12`};
}
