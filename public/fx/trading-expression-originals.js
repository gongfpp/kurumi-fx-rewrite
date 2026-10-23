import {ASSET_USAGE_CATALOG,tradingExpressionCandidates} from './asset-usage-catalog.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';

// Whole dialogue panels, never face-only crops. The small amount of adjacent
// panel border in record 36 is excluded, preserving its complete speech bubble.
export const ORIGINAL_EXPRESSION_PANELS=Object.freeze({
 16:{minWidth:320},31:{minWidth:220},37:{minWidth:280},54:{minWidth:320},64:{minWidth:240},98:{minWidth:380},
 36:{minWidth:280,crop:[0,0,770,394]},
});
export function selectOriginalTradingExpression(context={}){
 const {maxDisplayWidth=360,maxDisplayHeight=420,...facts}=context;
 if(!Number.isFinite(maxDisplayWidth)||!Number.isFinite(maxDisplayHeight)||maxDisplayWidth<=0||maxDisplayHeight<=32)return null;
 const pool=tradingExpressionCandidates(facts).filter(a=>a.source.kind==='original-manga'&&a.character==='久留美'&&Object.hasOwn(ORIGINAL_EXPRESSION_PANELS,a.source.record));
 // This panel is the same AUD/JPY long-loss scene immediately before record 37.
 // Generic wording alone does not permit using it for a short/flat/profit event.
 if(facts.event==='floating-loss'&&facts.direction==='long'&&facts.position==='open'&&facts.profitBasis==='floating'&&facts.pnlSign===-1){
  const heavy=ASSET_USAGE_CATALOG.find(a=>a.source.record===36);if(heavy?.review.status==='verified')pool.push({...heavy,textOriginal:'好沉重…'});
 }
 const eligible=pool.map(asset=>{
  const spec=ORIGINAL_EXPRESSION_PANELS[asset.source.record],crop=spec.crop||[0,0,...asset.source.dimensions],w=crop[2],h=crop[3];
  const scale=Math.min(1,maxDisplayWidth/w,(maxDisplayHeight-32)/h);
  return {...asset,hasEmbeddedText:true,expressionCrop:crop,displayWidth:w*scale,displayHeight:h*scale,minimumReadableWidth:spec.minWidth};
 }).filter(a=>a.displayWidth>=a.minimumReadableWidth);
 if(!eligible.length)return null;
 const seed=Number.isSafeInteger(context.seed)?context.seed:0;
 return eligible[((seed%eligible.length)+eligible.length)%eligible.length];
}
