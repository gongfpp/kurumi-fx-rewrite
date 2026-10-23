// Reviewed original game illustrations. Story wording is owned by the matching
// Gemini dialogueId; only confirmed housing-move receipts may select these.
const freeze=value=>{if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
export const LIVING_MOVE_ASSETS=freeze({
 'move-home-basic':{path:'./generated/living-moves-v1/move-home-basic.webp',width:1086,height:1448,sha256:'da12650fbe2ced2f7babb2d50c72da115a6a08dca5aab30ca6e73c852aadbf99',people:1,panels:4,panelRects:[[21,17,512,679],[553,17,511,679],[21,712,512,717],[553,712,511,717]],dialogueId:'gemini-living-moves-20261010:move-home-basic',kind:'generated-game-art',independentComic:true,reviewed:true,alt:'回宿舍铺床'},
 'move-home-comfortable':{path:'./generated/living-moves-v1/move-home-comfortable.webp',width:1086,height:1448,sha256:'08feac17dd4f1a71cd44b859ecb6096cb47f563ac0028437bccf808ce715f88b',people:1,panels:4,panelRects:[[21,17,512,679],[553,17,512,679],[21,713,512,715],[553,713,512,715]],dialogueId:'gemini-living-moves-20261010:move-home-comfortable',kind:'generated-game-art',independentComic:true,reviewed:true,alt:'单间塞行李'},
 'move-home-generous':{path:'./generated/living-moves-v1/move-home-generous.webp',width:1086,height:1448,sha256:'9128138d648ae9c8ae2f283bd6fab8f9a1223a43d11cdb3b5f5ad4ae76f81e2a',people:1,panels:4,panelRects:[[21,17,512,678],[552,17,512,678],[21,712,512,717],[552,712,512,717]],dialogueId:'gemini-living-moves-20261010:move-home-generous',kind:'generated-game-art',independentComic:true,reviewed:true,alt:'一居室移门'}
});
