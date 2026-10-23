import {activeMarket,marketPrice,positionMarket} from './market-book.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
// Only sourced Kurumi dialogue. Traditional Chinese is normalized to simplified;
// punctuation and line breaks are normalized, with no new dialogue composed.
export const PRESSURE_QUOTES=Object.freeze([
 Object.freeze({id:'user-buy-profit',text:'现在买入一定爆赚',speaker:'久留美',source:'用户本轮明确提供；原作页码待核'}),
 Object.freeze({id:'user-small-money',text:'这点不上不下的钱我才看不上',speaker:'久留美',source:'用户本轮明确提供；原作页码待核'}),
 Object.freeze({id:'manga-refuse-stop',text:'果然还是不能就此收手…!!',speaker:'久留美',source:'原作第3话p6，record39；dist/fx/manga/characters-v1/39.jpg',sha256:'c9e1a761b594d4e6dd5248f345a4f90dc97a8e0e30028d91a178d115d95a8cac'}),
 Object.freeze({id:'pv-cannot-lose',text:'不可能输的',speaker:'久留美',source:'dist/fx/voice/SOURCES.json#pv-cannot-lose；官方主PV 72.48–73.86秒',original:'負けようがない',url:'https://www.youtube.com/watch?v=7rxIZ3z0S4s&t=72'}),
 Object.freeze({"id":"manga-recover-money","text":"我绝对!!会把钱拿回来的！","original":"我絕對!!會把錢拿回來的！","speaker":"久留美","source":"第1话p46；record21；dist/fx/manga/contextual-ijk/21.jpg","sha256":"237e33e1e2f642dca8961bdead9c2698cb5ccdf5bed1f36a5efe264ff9ee4ed5","gate":"always","review":"本轮实际查看本地原图；仅简繁及行间标点规范化"}),
 Object.freeze({"id":"manga-only-way","text":"只能这么做了…！","original":"只能這麼做了…！","speaker":"久留美","source":"第3话p23；门边内心独白，下一格为筹款；record47；dist/fx/manga/contextual-links/47.jpg","sha256":"6ec63b0d13e5d2e7f10e3f7f8537c21b52061f68f577bfad47b0ec048897b374","gate":"always","review":"本轮实际查看本地原图；仅简繁及行间标点规范化"}),
 Object.freeze({"id":"manga-knowledge","text":"知识的多寡决定胜负，我是这么觉得的…","original":"知識的多寡決定勝負 我是這麼覺得的…","speaker":"久留美","source":"第7话托付场景p10–15；久留美读书示意图内心独白；record89；dist/fx/manga/characters-v1/89.jpg","sha256":"1ed11cca29b5f7ddcafc0817673b128958aaee097c33b6c8bcd7870e449fbf12","gate":"always","review":"本轮实际查看本地原图；仅简繁及行间标点规范化"}),
 Object.freeze({"id":"manga-endure","text":"所以我现在要忍耐…","original":"所以我現在要忍耐…","speaker":"久留美","source":"第3话；持多浮亏，左上本人气泡完整摘引；record42；dist/fx/manga/characters-v1/42.jpg","sha256":"2de9d490e0348bd2476bd7e929ff0fc21eb4f55a127b0f7fe7aa7d45d9712203","gate":"long-loss","review":"本轮实际查看本地原图；仅简繁及行间标点规范化"}),
 Object.freeze({"id":"manga-regret-buy","text":"不在这个位置买入的话肯定会后悔…！","original":"不在這個位置買入的話 肯定會後悔…！","speaker":"久留美","source":"第4话p18；左下本人气泡，不含方框旁白；record61；dist/fx/manga/characters-v1/61.jpg","sha256":"1f4dff31427ccb9b0ad7495878f3600470172ef58605559ee1acda3f236f8288","gate":"long","review":"本轮实际查看本地原图；仅简繁及行间标点规范化"}),
 Object.freeze({"id":"manga-hope-rise","text":"咕…这样涨上去就好了…！","original":"咕…這樣漲上去就好了…！","speaker":"久留美","source":"第4话；本人两个相连气泡；record50；dist/fx/manga/contextual-lmno/50.jpg","sha256":"3db7edee86f57e7a84bfc54d7817315211c0514ac23a542fd311ae95bf2ff178","gate":"long","review":"本轮实际查看本地原图；仅简繁及行间标点规范化"}),
 Object.freeze({"id":"manga-expect-fall","text":"应该…会跌吧","original":"應該…會跌吧","speaker":"久留美","source":"第7话p27–28；久留美本人判断，不是芽吹回答；record98；dist/fx/manga/contextual-def/98.jpg","sha256":"8c093f23dcadbbc5304b2b948a543918f7fedf73c9b2dc040fc958b90c229452","gate":"short","review":"本轮实际查看本地原图；仅简繁及行间标点规范化"}),
 Object.freeze({"id":"manga-small-fall","text":"稍微跌一点很正常…！不是奇怪的变动…！","original":"稍微跌一點很正常…！不是奇怪的變動…！","speaker":"久留美","source":"第4话；本人内心独白；record57；dist/fx/manga/characters-v1/57.jpg","sha256":"8898032c4b2fde2059cdbefa77707cf2bd994d64f3207d2fb816fc86f2ee8bcf","gate":"small-long-loss","review":"本轮实际查看本地原图；仅简繁及行间标点规范化"})
]);
// Only current, observed marks and held directions are read; no future prices.
export function pressureQuoteFacts(state={}){
 const all=Array.isArray(state.positions)&&state.positions.length?state.positions:state.position?[state.position]:[];
 const positions=all.filter(p=>positionMarket(p)===activeMarket(state));
 const price=marketPrice(state);
 if(!positions.length||!Number.isFinite(price)||price<=0||positions.some(p=>!Number.isFinite(p.entry)||p.entry<=0))return {};
 const long=positions.every(p=>p.direction===1),short=positions.every(p=>p.direction===-1);
 const longLoss=long&&positions.every(p=>price<p.entry);
 return {long,short,longLoss,smallLongLoss:longLoss&&positions.every(p=>(p.entry-price)/p.entry<=.003)};
}
export function eligiblePressureQuotes(facts={}){
 return PRESSURE_QUOTES.filter(q=>!q.gate||q.gate==='always'||q.gate==='long'&&facts.long===true||q.gate==='short'&&facts.short===true||q.gate==='long-loss'&&facts.longLoss===true||q.gate==='small-long-loss'&&facts.smallLongLoss===true);
}
// Exclude the last three actual lines; the larger pool still has several random
// choices instead of forcing the four-line cycle. History never touches saves.
export function createPressureQuotePicker({random=Math.random}={}){
 const recent=[];
 return (facts={})=>{
  const pool=eligiblePressureQuotes(facts),eligible=pool.filter(q=>!recent.includes(q.id));
  const draw=Number(random()),index=Math.min(eligible.length-1,Math.max(0,Math.floor((Number.isFinite(draw)?draw:0)*eligible.length)));
  const quote=eligible[index];recent.push(quote.id);if(recent.length>3)recent.shift();return quote.text;
 };
}
export function pressureLimitTooltip({stake=0,leverage=0}={},kind='stake'){
 return `受心理承受力影响，当前上限 ${kind==='leverage'?`${leverage}×`:`${Math.round(stake*100)}%`}`;
}
