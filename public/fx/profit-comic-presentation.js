import {selectRealizedProfitArtwork} from './profit-tier-art.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
// Presentation only: the scheduler still owns eligibility, batch net and receipts.
// Half-close, critical loss and trauma-specific scenes retain their existing art.
export function realizedProfitComicPresentation(scene,{traumaActive=false}={}){
 if(!scene||traumaActive||scene.id!=='closed-profit')return scene;
 const artwork=selectRealizedProfitArtwork(scene.batchTradingNet);
 if(!artwork)return scene;
 const lines=artwork.tier==='twenty-million'?[['久留美','等等……这次真的赚到了？'],['久留美','不是浮盈，已经平仓了。'],['久留美','太好了……！'],['久留美','我再看一遍成交记录。']]:artwork.tier==='hundred-thousand'?[['久留美','这次赚了这么多？'],['久留美','已经到账了！'],['久留美','好耶！'],['久留美','先把这笔记下来。']]:scene.lines;
 return {...scene,art:{...scene.art,...artwork,path:artwork.src,width:1086,height:1448},ready:true,lines,profitArtworkTier:artwork.tier};
}
