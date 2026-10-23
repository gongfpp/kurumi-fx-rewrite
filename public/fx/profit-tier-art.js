import {assetURL} from './assets.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
// Read-only presentation. The caller supplies certified realized trading net,
// never balance, equity, borrowed cash, deposits or unrealized profit.
const rows = {
 small: {path:'./generated/settled-comics-v1/settled-gain.webp',sha256:'2bcc37f0f8852408746ec3153a11ecccac3dd713ec8c9da161d483a3bfa7f281',alt:'久留美确认小额盈利，放下手机，轻轻松了一口气。'},
 thousand: {path:'./generated/comic-scenes-v1/closed-profit.webp',sha256:'d2de347b1ba3e289db306be765f70b8b394fd7fcbfe30db723af9bb3134b5a43',alt:'久留美完成平仓，微笑着握起一只拳头。'},
 'hundred-thousand': {path:'./generated/character-profit-v1/profit-hundred-thousand-v1.webp',sha256:'64fc32a421c8aaba53ec06faa204684a78ce99d58b598ce5c7ea3f9089773562',alt:'久留美惊喜地掩住嘴，站起来举起双拳，又合掌确认收益。'},
 'twenty-million': {path:'./generated/character-profit-v1/profit-twenty-million-v1.webp',sha256:'edc96c5b6fc0633a7036d3625aed6e90e07bfe0acfd4a43a5a3a6412240549dc',alt:'久留美震惊得停住动作，喜极而泣，举起双臂后按着心口笑了。'}
};
export const PROFIT_TIER_ART=Object.freeze(Object.fromEntries(Object.entries(rows).map(([tier,row])=>[tier,Object.freeze({...row,src:assetURL(row.path),tier,direction:'profit',people:1,panels:4,kind:'generated-game-art',reviewed:true})])));
export function realizedProfitTier(net){
 if(!Number.isFinite(net)||net<=0)return null;
 // Match the displayed currency precision without changing the trading ledger.
 const amount=Math.round(net*100)/100;
 return amount>=20000000?'twenty-million':amount>=100000?'hundred-thousand':amount>=1000?'thousand':'small';
}
export function selectRealizedProfitArtwork(net){const tier=realizedProfitTier(net);return tier?PROFIT_TIER_ART[tier]:null;}
// Daily recap integration: specifically consume the immutable snapshot's daily
// realized trading net. No fallback to an account amount is intentional.
export function selectDailyRecapProfitArtwork(snapshot){return selectRealizedProfitArtwork(snapshot?.daily?.tradingNet);}
