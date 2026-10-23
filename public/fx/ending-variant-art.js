// Original wordless fan-art; exact runtime bytes are identified below.
// The sealed results report owns classification; art never changes its rules or ledger.
export const ENDING_VARIANT_ART=Object.freeze({
 'back-to-even':Object.freeze({
  id:'back-to-even',baseId:'walkaway',path:'./generated/ending-variants-v1/back-to-even.webp',
  kind:'original-fan-art',panels:4,independentComic:true,
  sha256:'837643eb269148eccb304b65debe4c9f78ce5fea0161a7c92b28dfcb0bf10ac6'
 }),
 'returned-savings':Object.freeze({
  id:'returned-savings',baseId:'walkaway',path:'./generated/ending-variants-v1/returned-savings.webp',
  kind:'original-fan-art',panels:4,independentComic:true,
  sha256:'dc8a9f7d44bb9580651aa658221556c8bbf2fdc470fd50c3f8357dc7746d7d93'
 }),
 'debt-exit':Object.freeze({
  id:'debt-exit',baseIds:Object.freeze(['million','walkaway','broke','crisis']),path:'./generated/ending-variants-v1/debt-exit.webp',
  kind:'original-fan-art',panels:4,independentComic:true,
  sha256:'ec3cfa3007349067157fa1c6762085ed6029f272b2912361d38e84269025841e'
 }),
 'gave-it-back':Object.freeze({
  id:'gave-it-back',baseIds:Object.freeze(['million','walkaway','broke','crisis']),path:'./generated/ending-variants-v1/gave-it-back.webp',
  kind:'original-fan-art',panels:4,independentComic:true,
  sha256:'51e27adac73ca2433ee99444b80537954839cd136bfaf05dfe693fced7fed4d3'
 }),
 'debt-free':Object.freeze({
  id:'debt-free',baseId:'walkaway',path:'./generated/ending-variants-v1/debt-free.webp',
  kind:'original-fan-art',panels:4,independentComic:true,
  sha256:'f49c617d339b4cff545195e21de36de8b524789fb05cbceefd010d8c226dc960'
 })
 ,'paper-millionaire':Object.freeze({
  id:'paper-millionaire',baseIds:Object.freeze(['million','walkaway','broke','crisis']),path:'./generated/ending-variants-v1/paper-millionaire.webp',
  kind:'original-fan-art',panels:4,independentComic:true,
  sha256:'764921ce7b2118833a6827aa6485f4c49bc7a22d1e2792a588696d460cf00681'
 })
});
export function selectEndingVariantArt(state,ending){
 if(state?.phase!=='ending'||!ending||ending.baseId!==state.ending?.id||!Object.hasOwn(ENDING_VARIANT_ART,ending.variant))return null;
 const art=ENDING_VARIANT_ART[ending.variant];
 // Some existing variants span all four valid base endings; END8/9/10 remain narrow.
 return (art.baseIds?art.baseIds.includes(ending.baseId):ending.baseId===art.baseId)?art:null;
}
