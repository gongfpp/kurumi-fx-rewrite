import {isDailyFamilyNarrative} from './daily-family-art.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {FIRSTDAY_BACKSTORY_NODES,OPPOSITE_IMAGINATION_PANEL} from './contextual-manga-firstday-backstory.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {firstDayBackstoryEvidence} from './contextual-firstday-evidence.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {firstDayOriginalRecallEvidence} from './firstday-original-recall.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {BORROWING_CONTINUATION_NODES} from './contextual-manga-borrowing-continuation.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {LINK_DAILY_NODES,LINK_DAILY_PANELS} from './contextual-manga-links-content.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {longLossThenShortEvidence} from './contextual-reversal-evidence.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {REVERSAL_DAILY_NODES} from './contextual-manga-reversal-content.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {VERIFIED_DAILY_NODES,VERIFIED_DAILY_PANELS} from './contextual-manga-verified-daily.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {DAILY_EXTENSION_NODES} from './contextual-manga-daily-extension.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {pauseAndReturnEvidence,averagingDownEvidence,friendsLedgersEvidence,floatingCautionEvidence,activityPresentationIdentity} from './contextual-restraint-evidence.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {sealedDailyTradeEvidence,longProfitEvidence,shortProfitEvidence,reversalLiquidationEvidence,oppositeDirectionsEvidence} from './contextual-trade-evidence.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {CONTEXTUAL_MANGA_ASSETS,CONTEXTUAL_MANGA_NODES,CONTEXTUAL_MANGA_ARCS} from './contextual-manga-content.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {CHARACTER_STORY_ASSETS,CHARACTER_STORY_NODES} from './character-story-content.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {sealedDailyMangaOutcome} from './manga-context.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {priorBorrowedShortLossEvidence} from './contextual-debt-evidence.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
const arcs={
 ...CONTEXTUAL_MANGA_ARCS,
 'profit-fades':['aud-yen-delight','profit-fades','look-away','first-negative-estimate'],
 'holding-loss':['considering-stop','refuse-to-stop','loss-deepens','support-and-margin','unrealized-fear'],
 'walkaway':['manga-fund-plan'],
};
const titles={'pause-and-return':'久留美 · 她说过要放弃','averaging-down-prayer':'久留美 · 直到只剩下祈求','friends-different-ledgers':'她们 · 与此同时','floating-profit-caution':'久留美 · 浮盈之后的警惕','realized-short-profit':'久留美 · 第一次把利润留住','reversal-liquidation':'芽吹 · 与此同时','opposite-directions':'久留美与芽吹 · 与此同时','borrowed-time':'芽吹 · 与此同时','asking-for-more':'芽吹与久留美 · 与此同时','borrowed-recovery':'芽吹 · 与此同时','twenty-seconds':'芽吹 · 与此同时','follow-confidence':'久留美与芽吹 · 与此同时','profit-fades':'久留美 · 那次消失的浮盈','holding-loss':'久留美 · 那次没等到的反弹',walkaway:'康子 · 与此同时'};
// Extend only the sealed daily reader; independent event readers keep their
// original lists. Amounts in these nodes remain the manga characters' facts.
function dailyArc(id,evidence){
 if(id==='long-loss-then-short')return {id,title:'康子 · 与此同时',parallelStory:true,evidence:structuredClone(evidence),nodes:structuredClone(REVERSAL_DAILY_NODES.filter(n=>n.id==='kangzi-loss-and-turn'))};
 const result=id==='realized-long-profit'?{id,title:'久留美 · 确定下来的利润',parallelStory:true,evidence:structuredClone(evidence),nodes:[]}:arc(id,evidence);
 const node=key=>structuredClone([...CHARACTER_STORY_NODES,...DAILY_EXTENSION_NODES,...VERIFIED_DAILY_NODES,...REVERSAL_DAILY_NODES,...LINK_DAILY_NODES].find(n=>n.id===key));
 if(id==='profit-fades'){result.nodes.unshift(node('entry-expectation'));result.nodes.splice(2,0,node('shop-profit-dream'));}
 if(id==='friends-different-ledgers')result.nodes.unshift(node('friends-earlier-invitation'));
 if(id==='holding-loss')result.nodes.unshift(node('heavy-position'));
 if(id==='follow-confidence'){
  const intro=node('admiring-senpai'),chart=result.nodes[0],follow=result.nodes[1],later=node('message-from-mebuki'),confidence=result.nodes[2];
  intro.panels.push(structuredClone(LINK_DAILY_PANELS[89]));intro.after='久留美觉得，懂得越多，就越有机会赢。';
  chart.title='先看这张图';chart.before='话题转到图表，K线上已经走出一段下跌。久留美认真起来：“投资是自负盈亏的。”';
  chart.panels.unshift(...[94,95].map(r=>structuredClone(LINK_DAILY_PANELS[r])));
  later.title='后来的消息';later.panels.push(...confidence.panels);later.after=confidence.after;
  result.nodes=[intro,node('imagined-life-and-accounts'),chart,follow,later];
 }
 if(id==='realized-short-profit')result.nodes.unshift(node('first-trade-beginning'));
 if(id==='borrowed-time')result.nodes.splice(2,0,node('policy-surge-conversation'));
 if(id==='asking-for-more'){result.title='芽吹 · 与此同时';result.nodes.push(node('promise-and-doubt'),node('mochiko-responsibility'),...structuredClone(BORROWING_CONTINUATION_NODES));}
 if(id==='borrowed-recovery')result.nodes.splice(2,0,node('short-plan-drawdown'));
 if(id==='realized-long-profit')result.nodes=['long-profit-realized','later-overseas-profit'].map(node);
 const before=(record,key)=>{const index=result.nodes.findIndex(n=>n.panels.some(p=>p.record===record));if(index<0)throw Error('Missing daily story anchor: '+record);result.nodes.splice(index,0,node(key));};
 if(id==='profit-fades'){before(25,'funding-refusal');before(28,'prompted-purchase');before(31,'carefree-walk');before(35,'weight-of-loss');}
 if(id==='holding-loss'){before(45,'furious-at-loss');result.nodes.push(node('another-funding-idea'));}
 if(id==='averaging-down-prayer')result.nodes.push(node('savings-fear'));
 if(id==='realized-long-profit'){before(75,'profit-confirmation');result.nodes.push(node('tax-return-worry'));}
 if(id==='borrowed-recovery'){
  before(157,'news-and-more-shorts');before(161,'tuition-distance');before(166,'scholarship-fantasy');
  const end=result.nodes.find(n=>n.panels.some(p=>p.record===169));end.panels.splice(end.panels.findIndex(p=>p.record===169),0,structuredClone(VERIFIED_DAILY_PANELS[168]));
 }
 if(id==='opposite-directions'){
  const earlier=node('tuition');
  earlier.before='先前，芽吹向萌智子诉苦：之前赚的钱亏光了，追加的次年学费也快保不住。';
  earlier.panels[1].before='萌智子笑着说，没有人能预测行情，市场也可能在一夜之间反转。';
  earlier.panels[1].alt='萌智子笑着摊手，说没有人能够预测行情，市场可能在一夜之间反转';
  earlier.after='她们的话题又回到了行情。';
  result.nodes.unshift(earlier);
  const opening=result.nodes.find(n=>n.id==='opposite-open-opinions');
  opening.panels.splice(opening.panels.findIndex(p=>p.record===182)+1,0,structuredClone(OPPOSITE_IMAGINATION_PANEL));
  opening.before+=' 芽吹心里却不以为然：在这个位置做多，她觉得久留美是上当了。';
  const debate=result.nodes.find(n=>n.panels.some(p=>p.record===187));debate.panels.splice(debate.panels.findIndex(p=>p.record===187),0,...[185,186].map(r=>structuredClone(VERIFIED_DAILY_PANELS[r])));
  result.completionIdentity=oppositeDirectionsDailyContentIdentity(result);
 }
 return result;
}
const positions=s=>Array.isArray(s.positions)?s.positions:s.position?[s.position]:[];
const closed=t=>t&&['close','half','closing','stop','liquidation'].includes(t.type)&&Number.isFinite(t.pnl)&&Number.isFinite(t.entry)&&Number.isFinite(t.exit)&&[1,-1].includes(t.direction)&&t.positionId!=null&&t.pnlModel!=='legacy-inverse-v5';
function arc(id,evidence){return {id,title:titles[id],...(['pause-and-return','averaging-down-prayer','friends-different-ledgers','floating-profit-caution','borrowed-time','asking-for-more','realized-short-profit','reversal-liquidation','opposite-directions'].includes(id)?{parallelStory:true}:{}),evidence:structuredClone(evidence),nodes:structuredClone(arcs[id].map(key=>[...CHARACTER_STORY_NODES,...CONTEXTUAL_MANGA_NODES].find(n=>n.id===key)))};}
// These selectors read certified records only. No engine calls or state writes.
function baseDailyContextualManga(state){
 const outcome=sealedDailyMangaOutcome(state),r=state.dayReport;
 if(!outcome||outcome.net>=0||!Array.isArray(r.trades))return null;
 const trades=r.trades.filter(t=>t.day===r.day&&t.type!=='open');
 if(!trades.length||trades.some(t=>!closed(t)))return null;
 const reversal=(r.moments||[]).find(m=>m.day===r.day&&m.reversal==='profit-to-loss'&&m.direction===1&&m.pnl<0&&trades.some(t=>t.positionId===m.positionId&&t.direction===1)&&trades.filter(t=>t.positionId===m.positionId).every(t=>t.direction===1)&&trades.filter(t=>t.positionId===m.positionId).reduce((sum,t)=>sum+t.pnl,0)<0);
 if(reversal)return (sealedDailyTradeEvidence(state)?dailyArc:arc)('profit-fades',{day:r.day,net:r.net,positionId:reversal.positionId});
 // This chapter explicitly holds a bought currency through a falling quote.
 // A short losing on a rise must never borrow its AUD/JPY rebound dialogue.
 const crisis=trades.every(t=>t.direction===1&&t.exit<t.entry&&t.pnl<0)?trades.find(t=>t.nearMiss===true):null;
 return crisis?(sealedDailyTradeEvidence(state)?dailyArc:arc)('holding-loss',{day:r.day,positionId:crisis.positionId,nearMiss:true}):null;
}

const positive=n=>Number.isFinite(n)&&n>0;
// A loan unlock, a changed balance, or an unsuccessful click is no receipt.
function borrowedToday(state){
 const r=state.loan?.lastBorrow;
 return r?.day===state.day&&/^network-borrow:[1-9]\d*$/.test(r.id||'')&&positive(r.amount)&&Number.isFinite(r.timestamp)&&positive(r.outstanding)&&r.outstanding>=r.amount&&positive(state.loan.borrowed)&&state.loan.borrowed>=r.amount?r:null;
}
function combine(selections){const choices=selections.filter(Boolean).slice(0,4);return choices.length?{...choices[0],related:choices.slice(1)}:null;}
export function selectDailyContextualManga(state){
 const directionChange=longLossThenShortEvidence(state);
 const longProfit=longProfitEvidence(state),profit=shortProfitEvidence(state),liquidation=reversalLiquidationEvidence(state),opposite=oppositeDirectionsEvidence(state);
 const specific=longProfit?dailyArc('realized-long-profit',longProfit):profit?dailyArc('realized-short-profit',profit):liquidation?arc('reversal-liquidation',liquidation):opposite?dailyArc('opposite-directions',opposite):null;
 if(specific?.id==='realized-short-profit'&&firstDayBackstoryEvidence(state)){
  specific.nodes.unshift(...structuredClone(FIRSTDAY_BACKSTORY_NODES));
  const adult=specific.nodes.find(n=>n.id==='first-trade-beginning');
  adult.before='时间到了2014年2月14日。二十岁的久留美，终于坐到了交易屏幕前。';
 }
 // A completed reversal-and-liquidation gets one coherent story, rather than
 // another generic reversal episode competing for the same receipt.
 const averaging=liquidation?null:averagingDownEvidence(state),pause=averaging?null:pauseAndReturnEvidence(state),friends=friendsLedgersEvidence(state),caution=floatingCautionEvidence(state);
 const base=specific||directionChange||averaging||pause?null:baseDailyContextualManga(state),outcome=sealedDailyMangaOutcome(state),report=state.dayReport;
 const reversal=base?.id==='profit-fades'?arc('twenty-seconds',base.evidence):null;
 const trades=report?.trades?.filter(t=>t.day===state.day&&t.type!=='open')||[],loan=borrowedToday(state);
 const certified=loan?sealedDailyTradeEvidence(state):null;
 // Loan receipts have no execution sequence: equal timestamps cannot prove
 // whether borrowing preceded closing. Keep those cases on the original arc.
 const shortLoss=certified&&certified.net<0&&certified.trades.every(t=>t.direction===-1&&t.exit>t.entry&&t.grossPnl<0&&t.pnl<0&&t.timestamp>loan.timestamp)&&positive(state.loan.outstanding)&&Number.isFinite(state.loan.repaid)&&state.loan.repaid>=0&&Math.abs(state.loan.borrowed+(state.loan.interestAccrued??0)-state.loan.repaid-state.loan.outstanding)<=.02;
 const debt=loan&&outcome?.net<0&&trades.length&&trades.every(closed)&&trades.reduce((sum,t)=>sum+t.pnl,0)<0?(shortLoss?dailyArc:arc)('borrowed-recovery',{day:state.day,receipt:loan.id,amount:loan.amount,net:outcome.net}):null;
 const priorDebt=priorBorrowedShortLossEvidence(state);
 return combine([specific,directionChange?dailyArc('long-loss-then-short',directionChange):null,averaging?dailyArc('averaging-down-prayer',averaging):null,friends?dailyArc('friends-different-ledgers',friends):null,caution?arc('floating-profit-caution',caution):null,pause?arc('pause-and-return',pause):null,base,reversal,pause&&priorDebt?null:debt,...(priorDebt?[dailyArc('borrowed-time',priorDebt),dailyArc('asking-for-more',priorDebt)]:[])]);
}
export function selectStoryContextualManga(state,event){
 if(event?.key!=='friendStudy'||state.mode!=='story')return null;
 const r=state.story?.log?.findLast(x=>x.id==='friendStudy'&&x.day===state.day&&typeof x.choice==='string'&&x.choice);
 const current=sealedDailyMangaOutcome(state)&&(!Object.hasOwn(state.dayReport,'runId')||state.dayReport.runId===state.runId)&&r?.choice.trim();
 return r&&state.story?.seen?.includes('friendStudy')?(current?dailyArc:arc)('follow-confidence',{day:r.day,choice:r.choice}):null;
}
// SHA-256 of the fixed ordered [record, image sha256] list. This edition
// supplements the old seven-panel chapter; it never migrates old read keys.
export const FOLLOW_CONFIDENCE_DAILY_IDENTITY='arc-edition:follow-confidence:sha256:cdde1b44c7089f0a83329be6a325fa341119d8fc90ece1c49db368cba4e96f17';
const followConfidenceDailyContent=Object.freeze([
 [88,'1fe6e77f75b1b53f8baf99b8319abd1c7b2c653ed9a16becabf98bf4a2a67b01'],
 [89,'1ed11cca29b5f7ddcafc0817673b128958aaee097c33b6c8bcd7870e449fbf12'],
 [91,'45dd74f4c02bc2f6e980e42ebca14976ab34a96451d3ace178e9a87543b50b33'],
 [92,'8c6b85ba0b9a14b72f128f350eac591adb37761e440df275fb2f1a49192626e4'],
 [93,'9ad380df1949ef2d5634c187c5b7e1b575bdb0c56a80e16775a06cca9742a946'],
 [94,'65e3fc73ab8bc627bae36b5a6d79d2c15ec60ef5b57462eb4ce88c7f1aeba8b0'],
 [95,'809bc596574817852c991deb94d8a244e77a1bff732fe0a27e6086438b4fa8ca'],
 [97,'53ccf9b691f0ed6325ce51329168390d8c39913f0b100f322f5c2775f492f411'],
 [98,'8c093f23dcadbbc5304b2b948a543918f7fedf73c9b2dc040fc958b90c229452'],
 [99,'d290f8000d6057b13a802d91bf71a3eecffa17355e3742e05adecb423004fb5f'],
 [100,'56e9d5334433e948f245c1063ad2d594892f6d8500057b521fac27d96612e466'],
 [101,'d686c5fc1bc5fa03f1f39ee969d2d20c26aae9d3f23aaadc98163504acb01cfd'],
 [102,'625e7e36f270e9995d7c666e8971dd616badaf5396f525232887b520ebac693a'],
 [103,'2da54ba7d620b7c359b0c92ea2d723755fbf4b11a26ae5b946498b217d83f1a2'],
 [104,'060049f7f1b1aca6e2d1cac6f85dd6d4388bd4d647db9579a00113b4f8308377']
]);
export function followConfidenceDailyContentIdentity(selection){
 const panels=selection?.nodes?.flatMap(node=>node.panels)||[];
 return selection?.id==='follow-confidence'&&panels.length===followConfidenceDailyContent.length&&panels.every((panel,index)=>{
  const [record,sha256]=followConfidenceDailyContent[index],asset=CONTEXTUAL_MANGA_ASSETS[panel.record]||CHARACTER_STORY_ASSETS[panel.record];
  return panel.record===record&&asset?.sha256===sha256;
 })?FOLLOW_CONFIDENCE_DAILY_IDENTITY:null;
}
// This exact chapter extension adds the earlier tuition conversation. It keeps
// the semantic arc/track marker while preserving already-locked fifteen-image days.
export const OPPOSITE_DIRECTIONS_DAILY_IDENTITY='arc-edition:opposite-directions:sha256:766dd5e17cb1eadbf0cc6c4b8ea16457245380ece693e6942bb22434c522a827';
const oppositeDirectionsDailyContent=Object.freeze([
 [175,'c4b09262c97b2a479dc06551b7fd6e48259175a19f532bf9764d96631549a92f'],
 [178,'9039b3afdbcbd60e4dbcbae117e65d11dd592bb7e0693a5165a59bd803576153'],
 [180,'b98542b3f12a145f4efc75c9f1f8c9f831e9bd5b21d27b92f984bd6c69f1d755'],
 [182,'8363c4f8f4cf3473885d0a47e982229224f6275eb903263b6af805fe9222f710'],
 [181,'9114d816feccceb44d32a16773905535faf67f354a7397a2989f0ff9ca61a5b4'],
 [183,'049c83d07fe5f1b738e4f9ee0ce263e50e1413cc04818dd3d861c76dec8a598a'],
 [184,'f845a814ac1a1c701cad9956477425748b9869fb88a9452dfdcb7820a1d9fbb6'],
 [185,'af18905df2c173a06742621099e61fc4edec2f849a84a8d4ac6306f54adf886e'],
 [186,'40c63a4d72d5bb88e6a6e9cce6914cc3477b6bc969c1c11f25b066b03e4f897e'],
 [187,'06d2c4c1090cdb3bb370925ed91d3c35e03765b39b8596cbaa76ebebe0bb4ae9'],
 [189,'57d232bd2b193e7c0f1f56a74cea9043b687fd6e9009d450e8aa835ef3c3b48b'],
 [188,'c1b19e3fd9beff25447b4c23c560dc9fb34eae1c9f797715532a7f37e78d4752'],
 [191,'1d0a0a024212a1a8c525512a45bc114548726d0a6f0407b2a0ad0f87eb155638'],
 [190,'1ee2a9c293b28ab3997d178781b9ad0588a3f77db01e214cadb840ba477111ff'],
 [192,'b9ba16f4c36295f791a97d71e15b9a80adfea91f3ded43696585eb011a3e36c3'],
 [193,'f087fdb9b23f97c6162a156498f93459d84d291f07112a73b7d6f2894727b51c'],
 [194,'78510190c593877d249ba9c1fdad0f39be78632e10d01a962538dce5e803aef2']
]);
export function oppositeDirectionsDailyContentIdentity(selection){
 const panels=selection?.nodes?.flatMap(node=>node.panels)||[];
 return selection?.id==='opposite-directions'&&panels.length===oppositeDirectionsDailyContent.length&&panels.every((panel,index)=>{
  const [record,sha256]=oppositeDirectionsDailyContent[index],asset=CONTEXTUAL_MANGA_ASSETS[panel.record]||CHARACTER_STORY_ASSETS[panel.record];
  return panel.record===record&&asset?.sha256===sha256;
 })?OPPOSITE_DIRECTIONS_DAILY_IDENTITY:null;
}
export function fixedDailyContentIdentity(selection){
 return followConfidenceDailyContentIdentity(selection)||oppositeDirectionsDailyContentIdentity(selection)||firstDayRecallContentIdentity(selection);
}
export const FIRSTDAY_RECALL_DAILY_IDENTITY='arc-edition:realized-short-profit:sha256:ab5b72fa3dde076b55a817312111e90f65f0659382628bc7f935822183dd8bb5';
const firstDayRecallContent=Object.freeze([
 [2,'6b397faf79fd743f58ffdf9e465e1e433f686a12faad2d689a0733793e91bb14'],
 [3,'2952f536ef31d929c5e857484dc8eb80f09e365cf5e799f58bad8f671719e5ad'],
 [4,'bd3a695d307a6ccedc8b4339267418fb0d3e66dfc8f38ad7d445520da99623b0'],
 [5,'bcfaac0aff8105a26d49bb54dfe8be38775025813a8e666efce282faaf0c75ac'],
 [6,'fa559e08155bb1b3c84f279bf0c42d61da99157423bc7078c11988edbd559d83'],
 [7,'993b351dc01fe632eb400e9ff680fbee3fbcec370f3171b96f6b0df42d8631c6'],
 [8,'68a6fd7f062a2c9b41a4ab717f0040cda9a8dda2b4bb6e43b07ea3d8fada2493'],
 [11,'938e4bf49bbe747b4dce68987f109d2b78acc91aeac550ed6dc12d5c0a024a71'],
 [12,'8fd5e8d60372121b33ee73ee031bce5b3b6efb2cfddfa673947231f9602b0036'],
 [13,'cfb367e10341ceb3eaa15536f45ab6932373f423ae4f7c974c3b334213c1b5ee'],
 [14,'62d70abce44387991481dbde6f68093865e6ef0c0196f3731819ee656da9b953'],
 [15,'e80f14d6306a99efd320c3c4ec569aa5c60e1fb22f9e32a020f27cf17edc9d24'],
 [16,'a430c65bc4399a150f6cf46fd7bf0ed868c6b1bcc6878969e9c6b7f939564ef2'],
 [17,'44c0f5934d989315525c56f907c768310a11922931d4a503b427f8d8def57418'],
 [18,'6cd571c934e006871266cbe41e06dd78113b4e78cee962030c097f9165003868'],
 [19,'bdcf3a85c11213ba519d50767d188640d8ca0442dcf138b1d8f67522acbf62f7'],
 [20,'1208fcada96e02f2b9e1dccf6039a05aa897a780a74f87196a82ff8ff9ecd8a1'],
 [21,'237e33e1e2f642dca8961bdead9c2698cb5ccdf5bed1f36a5efe264ff9ee4ed5']
]);
export function firstDayRecallContentIdentity(selection){
 const panels=selection?.nodes?.flatMap(node=>node.panels)||[];
 return selection?.id==='realized-short-profit'&&selection.evidence?.recall==='sealed-first-day'&&panels.length===firstDayRecallContent.length&&panels.every((panel,index)=>{
  const [record,sha256]=firstDayRecallContent[index],asset=CONTEXTUAL_MANGA_ASSETS[panel.record]||CHARACTER_STORY_ASSETS[panel.record];
  return panel.record===record&&asset?.sha256===sha256;
 })?FIRSTDAY_RECALL_DAILY_IDENTITY:null;
}
function completedFriendEvidence(state,{sameDay=false}={}){
 if(!Array.isArray(state.story?.seen)||!state.story.seen.includes('friendStudy')||!Array.isArray(state.story.log))return null;
 const valid=row=>Number.isInteger(row?.day)&&row.day>0&&(sameDay?row.day===state.day:row.day<state.day)&&row.choice==='continue'&&
  (!Object.hasOwn(row,'runId')||row.runId===state.runId);
 const logs=state.story.log.filter(row=>row?.id==='friendStudy'),unlock=state.itemUnlocks?.mochiko;
 if(logs.length>1||logs.length===1&&!valid(logs[0]))return null;
 // chooseStory stores this exact unlock permanently; the log keeps only 40
 // rows. Migration's day=0/legacy-use entries are not completion evidence.
 const fromUnlock=unlock?.event==='friendStudy';
 if(fromUnlock&&(!valid(unlock)||logs.length&&unlock.day!==logs[0].day))return null;
 return logs[0]||(fromUnlock?unlock:null);
}
function currentFriendNarrative(state,narrative,{sameDay=false}={}){
 // Family frames and actual paid/elected evenings keep priority even during
 // legacy day-lock recovery, which runs after the primary candidate branch.
 if(isDailyFamilyNarrative(narrative)||isDailyFamilyNarrative(state?.settlementNarrative)||
  state?.recapChoiceLedger?.some(row=>row.day===state.day)||state?.dayReport?.lifeAction||
  state?.lifeActions?.receipts?.some(row=>row.day===state.day))return false;
 // A later quiet settlement explicitly saves event:null. Missing fields or
 // an incomplete/stale snapshot are not evidence of a quiet evening.
 const valid=snapshot=>snapshot?.version===1&&snapshot.day===state?.day&&typeof snapshot.effectsApplied==='boolean'&&
  Object.hasOwn(snapshot,'event')&&(sameDay?snapshot.event?.key==='friendStudy':snapshot.event===null||snapshot.event?.key==='quietNight');
 return state?.mode==='story'&&!!sealedDailyMangaOutcome(state)&&typeof state.runId==='string'&&!!state.runId&&
  (!Object.hasOwn(state.dayReport,'runId')||state.dayReport.runId===state.runId)&&
  valid(narrative)&&valid(state.settlementNarrative)&&narrative.event?.key===state.settlementNarrative.event?.key;
}
export function selectDeferredFriendContextualManga(state,narrative){
 if(!currentFriendNarrative(state,narrative))return null;
 const source=completedFriendEvidence(state);if(!source)return null;
 const selection=dailyArc('follow-confidence',{day:source.day,choice:source.choice,deferredUntil:state.day});
 const completionIdentity=followConfidenceDailyContentIdentity(selection);
 return completionIdentity?{...selection,completionIdentity}:null;
}
export function selectDeferredFirstDayContextualManga(state,narrative){
 if(!currentFriendNarrative(state,narrative))return null;
 const proof=firstDayOriginalRecallEvidence(state);if(!proof)return null;
 const selection=dailyArc('realized-short-profit',{...proof,recall:'sealed-first-day'});
 selection.nodes.unshift(...structuredClone(FIRSTDAY_BACKSTORY_NODES));
 selection.nodes.find(node=>node.id==='first-trade-beginning').before='时间到了2014年2月14日。二十岁的久留美，终于坐到了交易屏幕前。';
 selection.title='久留美 · 最初的那笔交易';selection.completionIdentity=firstDayRecallContentIdentity(selection);
 return selection.completionIdentity?selection:null;
}
// Only restores a pre-existing chapter day lock. This narrow adapter does not
// broaden the older independent event-reader API or create a new daily slot.
export function selectLockedFriendContextualManga(state,narrative){
 if(!currentFriendNarrative(state,narrative,{sameDay:true}))return null;
 const source=completedFriendEvidence(state,{sameDay:true});
 return source?dailyArc('follow-confidence',{day:source.day,choice:source.choice}):null;
}
export function selectEventContextualManga(state,event){
 if(event.type==='loan-borrow'){
  const r=borrowedToday(state);
  return r&&state.loan.outstanding===r.outstanding&&event.result?.amount===r.amount&&event.result?.outstanding===r.outstanding?arc('borrowed-recovery',{day:r.day,receipt:r.id,amount:r.amount}):null;
 }
 if(event.type==='item'&&event.id==='mochiko'&&event.result?.id==='mochiko'){
  const r=state.consumptionLedger?.find(x=>x.id===`item:${state.day}:mochiko`&&x.day===state.day&&x.kind==='item'&&positive(x.amount)&&x.amount===event.result.cost);
  return r?arc('follow-confidence',{day:r.day,receipt:r.id,amount:r.amount}):null;
 }

 if(event.type==='walkaway'&&state.phase==='ending'&&state.ending?.id==='walkaway'&&!positions(state).length)return arc('walkaway',{day:state.day});
 if(event.type==='day-close')return selectDailyContextualManga(state);
 if(event.type!=='trade'||!sealedDailyMangaOutcome(state)||state.dayReport.net>=0)return null;
 const r=event.receipt;
 const found=(state.history||[]).find(t=>t.day===state.day&&closed(t)&&t.direction===1&&t.exit<t.entry&&t.pnl<0&&t.nearMiss===true&&['day','beat','type','positionId','pnl','entry','exit'].every(k=>t[k]===r?.[k]));
 return found?arc('holding-loss',{day:found.day,positionId:found.positionId,nearMiss:true}):null;
}
// A sealed report owns its presentation snapshot. Rendering or later expenses
// cannot select another arc. Replacing the save/report creates a fresh context.
export function createDailyContextualMangaCache(){
 const snapshots=new WeakMap();
 return state=>{const report=state.dayReport;if(!report||typeof report!=='object'||!sealedDailyMangaOutcome(state))return null;if(!snapshots.has(report))snapshots.set(report,structuredClone(selectDailyContextualManga(state)));return structuredClone(snapshots.get(report));};
}

// Only durable saves publish new daily/lesson evidence. Capture owns the frozen
// nodes; commit never consults mutable game data. A replaced state cannot reuse it.
export function createSavedContextualManga(){
 const reports=new WeakMap();let revision=0;
 const key=state=>[state.runId,state.day,state.loan?.lastBorrow?.id||'',state.loan?.lastRepayment?.id||'',state.story?.log?.findLast(x=>x.id==='friendStudy'&&x.day===state.day)?.choice||'',activityPresentationIdentity(state)].map(v=>JSON.stringify(v)).join(':');
 return {
  capture(state){
   const report=state.dayReport;if(!report||!sealedDailyMangaOutcome(state))return null;
   let slot=reports.get(report);if(!slot||slot.owner!==state||slot.runId!==state.runId||slot.day!==state.day){slot={owner:state,runId:state.runId,day:state.day,captured:new Map(),saved:null,savedRevision:0};reports.set(report,slot);}
   const id=key(state);
   if(!slot.captured.has(id)){
    const daily=selectDailyContextualManga(state),event=state.settlementNarrative?.day===state.day?state.settlementNarrative.event:null;
    const friend=selectStoryContextualManga(state,event);
    slot.captured.set(id,combine([...(daily?[{...daily,related:undefined},...(daily.related||[])]:[]),friend]));
   }
   const ticket={state,report,id,revision:++revision,selection:structuredClone(slot.captured.get(id))};return ticket;
  },
  commit(ticket,{saved,state,blocked=false}={}){
   if(!ticket||!saved||blocked||ticket.state!==state||ticket.report!==state.dayReport||ticket.id!==key(state)||!sealedDailyMangaOutcome(state))return false;
   const slot=reports.get(ticket.report);if(!slot||slot.owner!==state||slot.runId!==state.runId||slot.day!==state.day||ticket.revision<=slot.savedRevision)return false;
   slot.saved=structuredClone(ticket.selection);slot.savedRevision=ticket.revision;return true;
  },
  read(state){const slot=reports.get(state.dayReport);return sealedDailyMangaOutcome(state)&&slot?.owner===state&&slot.runId===state.runId&&slot.day===state.day?structuredClone(slot.saved||null):null;}
 };
}
