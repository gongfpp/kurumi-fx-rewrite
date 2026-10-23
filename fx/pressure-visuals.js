export const PRESSURE_TOOLTIP='连续点击可突破限制；极度亢奋、极度绝望时均可使用';
export const PRESSURE_CRACKS=Object.freeze([
 {at:2,path:'M0 24 L14 19 L26 27 L38 10 L53 14 M38 10 L31 0'},
 {at:4,path:'M53 14 L65 3 L80 12 L99 0 M65 3 L73 20'},
 {at:6,path:'M200 24 L184 18 L171 26 L157 12 L142 17 M184 18 L178 0'},
 {at:8,path:'M200 46 L178 53 L164 43 L145 58 L128 49 L113 64 M0 51 L17 45 L30 58 L49 51 L67 64'},
 {at:10,path:'M70 0 L78 12 L94 7 M142 17 L130 0 M67 64 L83 52 L96 59 M145 58 L151 44'},
]);
export function pressureVisual(taps,{reduced=false,unlocked=false,target=5,direction=null}={}){
 const value=Math.max(0,Math.min(target,Number.isFinite(taps)?taps:0)),intensity=target?value/target:0,progress=intensity*12;
 return {taps:value,intensity,stage:unlocked?'broken':progress>=10?'rupture':progress>=7?'fracture':progress>=3?'crack':'strained',
  visibleBranches:PRESSURE_CRACKS.filter(p=>progress>=p.at).length,displacement:reduced?0:1+6*intensity,
  duration:reduced?0:unlocked?460:120+140*intensity,rift:!reduced&&progress>=8,
  hint:unlocked?'已突破 · 再按一次':`${direction==='despair'?'绝望':direction==='ecstatic'?'亢奋':'连续点击可突破'} · ${value}/${target}`};
}
