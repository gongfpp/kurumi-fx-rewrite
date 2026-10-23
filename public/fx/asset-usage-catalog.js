import {ENDING_VARIANT_ART} from './ending-variant-art.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {PROP_STORY_ASSETS,PROP_STORY_REVIEWS} from './prop-story-assets.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {FATHER_THEFT_ASSETS,FATHER_THEFT_REVIEWS} from './father-theft-assets.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {LIVING_MOVE_ASSETS} from './living-move-assets.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {LIVING_MOVE_SCENES} from './copy/living-move-scenes.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {DAILY_LIFE_ART_ASSETS,DAILY_LIFE_ART_REVIEWS} from './daily-life-art-assets.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {DINNER_STORY_ASSETS,DINNER_STORY_REVIEWS,DINNER_STORY_ART_REVISIONS} from './dinner-story-assets.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {APPROVED_FOUR_SKIT_ASSETS,APPROVED_FOUR_SKIT_REVIEWS} from './approved-four-skit-assets.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {FIRSTDAY_BACKSTORY_NODES,OPPOSITE_IMAGINATION_PANEL} from './contextual-manga-firstday-backstory.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {BORROWING_CONTINUATION_NODES} from './contextual-manga-borrowing-continuation.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {LINK_DAILY_NODES,LINK_DAILY_PANELS} from './contextual-manga-links-content.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {REVERSAL_DAILY_NODES} from './contextual-manga-reversal-content.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {VERIFIED_DAILY_NODES,VERIFIED_DAILY_PANELS} from './contextual-manga-verified-daily.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {DAILY_EXTENSION_NODES} from './contextual-manga-daily-extension.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {MANGA_PANELS} from './manga-panels.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {CHARACTER_STORY_ASSETS,CHARACTER_STORY_NODES} from './character-story-content.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {CONTEXTUAL_MANGA_ASSETS,CONTEXTUAL_MANGA_NODES} from './contextual-manga-content.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {COMIC_SCENE_ASSETS} from './comic-scene-assets.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {SUPPLEMENTAL_ASSET_SOURCES} from './asset-usage-supplemental.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {ASSET_USAGE_REVIEWS} from './asset-usage-reviews.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {ORIGINAL_ASSET_USAGE_REVIEWS} from './asset-usage-original-reviews.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';

// Classification is additive. Existing story/daily consumers retain their own
// source chronology and gates; this catalogue never rewrites those registries.
const freeze=v=>{if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
export const ASSET_PRIMARY_USES=freeze({'trading-expression':'交易表情','story-dialogue':'剧情对话'});
const sources=new Map();
// Exact existing image provenance; no private audit index is bundled.
const originalSourceProvenance=freeze({
  "./manga/characters-v1/26.jpg": {
    "sha256": "2dd504d62668a9d72dc8dd6aa4e21db48ae380aa902d4a1746c6db223e92003d",
    "url": "https://github.com/gongfpp/manga-panel-extractor/blob/b37bbf7efe7caa05621946879dcd8e4ada56ae59/memes/%E4%B9%85%E7%95%99%E7%BE%8E_%E5%85%A5%E5%9C%BA_%E4%B9%A6%E6%A1%8C_%E5%8F%91%E5%B0%84_%E4%B8%8A%E5%90%A7%E4%B9%B0%E5%85%A550%E6%9E%9A.jpg",
    "commit": "b37bbf7efe7caa05621946879dcd8e4ada56ae59"
  },
  "./manga/characters-v1/75.jpg": {
    "sha256": "af4e2d4382f4129f8241d77d94c5f1232e4116927cb06c38cdf317080c5b5bb9",
    "url": "https://github.com/gongfpp/manga-panel-extractor/blob/b37bbf7efe7caa05621946879dcd8e4ada56ae59/memes/%E4%B9%85%E7%95%99%E7%BE%8E_%E6%AD%A2%E7%9B%88_%E7%BB%93%E7%AE%97_%E5%A4%A7%E8%83%9C%E5%88%A9_%E5%88%A9%E7%9B%8A%E7%A1%AE%E5%AE%9A131%E4%B8%87.jpg",
    "commit": "b37bbf7efe7caa05621946879dcd8e4ada56ae59"
  }
});
function register(registry,id,asset){
 const path=asset.path||asset.original;if(!path)return;
 const provenance=originalSourceProvenance[path];if(provenance&&provenance.sha256!==asset.sha256)throw Error(`Provenance hash mismatch: ${path}`);
 const previous=sources.get(path),ref=`${registry}:${id}`;
 if(previous){if(previous.sha256!==asset.sha256)throw Error(`Conflicting asset hash: ${path}`);previous.metadataRefs.push(ref);if(asset.record)previous.record=asset.record;return;}
 sources.set(path,{path,sha256:asset.sha256,dimensions:asset.dimensions||asset.imageSize||[asset.width,asset.height],record:asset.record??null,id,character:asset.character??null,kind:registry==='MANGA_PANELS'||registry.includes('STORY_ASSETS')||registry==='CONTEXTUAL_MANGA_ASSETS'?'original-manga':asset.kind||'original-fan-art',metadataRefs:[ref],sourceURL:asset.sourceURL??provenance?.url??null,sourceCommit:asset.sourceCommit??provenance?.commit??null});
}
for(const [id,a]of Object.entries(PROP_STORY_ASSETS))register('PROP_SCENE_ART',id,a);
for(const [id,a]of Object.entries(FATHER_THEFT_ASSETS))register('FATHER_THEFT_ASSETS',id,a);
for(const [id,a]of Object.entries(MANGA_PANELS))register('MANGA_PANELS',id,a);
for(const [id,a]of Object.entries(CHARACTER_STORY_ASSETS))register('CHARACTER_STORY_ASSETS',id,a);
for(const [id,a]of Object.entries(CONTEXTUAL_MANGA_ASSETS))register('CONTEXTUAL_MANGA_ASSETS',id,a);
for(const [id,a]of Object.entries(COMIC_SCENE_ASSETS))register('COMIC_SCENE_ASSETS',id,a);
for(const [id,a]of Object.entries(DINNER_STORY_ASSETS))register('DINNER_STORY_ART',id,a);
for(const [id,a]of Object.entries(APPROVED_FOUR_SKIT_ASSETS))register('APPROVED_FOUR_SKIT_ASSETS',id,a);
for(const [id,a]of Object.entries(LIVING_MOVE_ASSETS))register('LIVING_MOVE_ASSETS',id,a);
for(const [id,a]of Object.entries(DAILY_LIFE_ART_ASSETS))register('DAILY_LIFE_ART_ASSETS',id,a);
for(const a of SUPPLEMENTAL_ASSET_SOURCES)register('SUPPLEMENTAL_ASSET_SOURCES',a.id,a);
const livingMoveReviews=Object.fromEntries(Object.entries(LIVING_MOVE_ASSETS).filter(([,art])=>art.reviewed).map(([id,art])=>[art.path,{primaryUse:'story-dialogue',character:LIVING_MOVE_SCENES[id].characters[0],characters:LIVING_MOVE_SCENES[id].characters,emotion:'moving-home',intensity:null,events:[],directions:[],hasEmbeddedText:false,textOriginal:null,faceClarity:'scene-scale',textClarity:'no-text',status:'verified',identityStatus:'verified',exclusions:['story-only','confirmed-housing-move-only','not-live-trading-expression']} ]));
const storyNodes=[...FIRSTDAY_BACKSTORY_NODES,{id:'opposite-open-opinions',panels:[OPPOSITE_IMAGINATION_PANEL]},...BORROWING_CONTINUATION_NODES,...LINK_DAILY_NODES,{id:'daily-links-panels',panels:Object.values(LINK_DAILY_PANELS)},...REVERSAL_DAILY_NODES,...CHARACTER_STORY_NODES,...CONTEXTUAL_MANGA_NODES,...DAILY_EXTENSION_NODES,...VERIFIED_DAILY_NODES,{id:'daily-interleaved-panels',panels:Object.values(VERIFIED_DAILY_PANELS)}];
const eventRules=freeze({
 'entry-hesitation':{positions:['flat','open'],profitBases:['none'],directions:['long','short']},
 'position-opened':{positions:['open'],profitBases:['none'],directions:['long','short','mixed']},
 'floating-profit':{directions:['long','short','mixed'],positions:['open'],profitBases:['floating'],pnlSigns:[1]},
 'floating-loss':{directions:['long','short','mixed'],positions:['open'],profitBases:['floating'],pnlSigns:[-1]},
 'profit-to-loss':{directions:['long','short','mixed'],positions:['open'],profitBases:['floating'],pnlSigns:[-1],previousPnlSigns:[1]},
 'loss-to-profit':{directions:['long','short','mixed'],positions:['open'],profitBases:['floating'],pnlSigns:[1],previousPnlSigns:[-1]},
 'closed-profit':{directions:['long','short','mixed'],positions:['flat','open'],profitBases:['realized'],pnlSigns:[1]},
 'closed-loss':{directions:['long','short','mixed'],positions:['flat','open'],profitBases:['realized'],pnlSigns:[-1]},
 'risk-warning':{directions:['long','short','mixed'],positions:['open'],profitBases:['floating'],pnlSigns:[-1]}
});
export const TRADING_EXPRESSION_EVENTS=freeze(Object.keys(eventRules));
// Local registration only; shipping remains subject to release validation.
// All provenance here is the runtime asset identity, not private audit material.
const endingArt=ENDING_VARIANT_ART['back-to-even'];
const endingArtEntry={
 id:'asset:generated/ending-variants-v1/back-to-even',path:endingArt.path,primaryUse:'story-dialogue',label:ASSET_PRIMARY_USES['story-dialogue'],
 tags:['story-dialogue',endingArt.kind,'local-only'],character:'久留美',characters:['久留美'],emotion:'回本后离场',intensity:null,hasEmbeddedText:false,textOriginal:null,
 presentation:{preserveWholeImage:true,objectFit:'contain',allowDialogueOverlay:true,minDisplayWidth:64},
 applicability:{events:[],directions:[],positions:[],profitBases:[],rules:{},exclusions:['story-only','never-crop-dialogue','not-live-trading-expression','local-only']},
 review:{status:'pending',confidence:'pending',faceClarity:'pending',textClarity:'pending',identityStatus:'pending',identityDescription:'久留美'},
 source:{kind:endingArt.kind,id:'ENDING_VARIANT_ART:back-to-even',record:null,sha256:endingArt.sha256,dimensions:[1086,1448],metadataRefs:['ENDING_VARIANT_ART:back-to-even'],url:null,commit:null},
 storyNodeIds:[],consumer:{reader:'ending',variant:endingArt.id,baseId:endingArt.baseId,sealedOnly:true},
 publication:{scope:'local-only',status:'release-validation-pending',published:false,publicReady:false,publicReadyCountContribution:0}
};
const returnedSavingsArt=ENDING_VARIANT_ART['returned-savings'];
const returnedSavingsArtEntry={
 id:'asset:generated/ending-variants-v1/returned-savings',path:returnedSavingsArt.path,primaryUse:'story-dialogue',label:ASSET_PRIMARY_USES['story-dialogue'],
 tags:['story-dialogue',returnedSavingsArt.kind,'local-only'],character:'久留美',characters:['久留美'],emotion:'归还存款后离场',intensity:null,hasEmbeddedText:false,textOriginal:null,
 presentation:{preserveWholeImage:true,objectFit:'contain',allowDialogueOverlay:true,minDisplayWidth:64},
 applicability:{events:[],directions:[],positions:[],profitBases:[],rules:{},exclusions:['story-only','never-crop-dialogue','not-live-trading-expression','local-only']},
 review:{status:'pending',confidence:'pending',faceClarity:'pending',textClarity:'pending',identityStatus:'pending',identityDescription:'久留美'},
 source:{kind:returnedSavingsArt.kind,id:'ENDING_VARIANT_ART:returned-savings',record:null,sha256:returnedSavingsArt.sha256,dimensions:[1086,1448],metadataRefs:['ENDING_VARIANT_ART:returned-savings'],url:null,commit:null},
 storyNodeIds:[],consumer:{reader:'ending',variant:returnedSavingsArt.id,baseId:returnedSavingsArt.baseId,sealedOnly:true},
 publication:{scope:'local-only',status:'release-validation-pending',published:false,publicReady:false,publicReadyCountContribution:0}
};
// Preserve the five existing rows; END6 appends its own exact wordless image.
const remainingEndingArtEntries=[
 ['debt-exit','带着账单离场'],['gave-it-back','已实现利润回吐后离场'],['debt-free','还清借款后离场'],['paper-millionaire','数字上的富翁']
].map(([id,emotion])=>{
 const art=ENDING_VARIANT_ART[id];
 return {
  id:`asset:generated/ending-variants-v1/${id}`,path:art.path,primaryUse:'story-dialogue',label:ASSET_PRIMARY_USES['story-dialogue'],
  tags:['story-dialogue',art.kind,'local-only'],character:'久留美',characters:['久留美'],emotion,intensity:null,hasEmbeddedText:false,textOriginal:null,
  presentation:{preserveWholeImage:true,objectFit:'contain',allowDialogueOverlay:true,minDisplayWidth:64},
  applicability:{events:[],directions:[],positions:[],profitBases:[],rules:{},exclusions:['story-only','never-crop-dialogue','not-live-trading-expression','local-only']},
  review:{status:'pending',confidence:'pending',faceClarity:'pending',textClarity:'pending',identityStatus:'pending',identityDescription:'久留美'},
  source:{kind:art.kind,id:`ENDING_VARIANT_ART:${id}`,record:null,sha256:art.sha256,dimensions:[1086,1448],metadataRefs:[`ENDING_VARIANT_ART:${id}`],url:null,commit:null},
  storyNodeIds:[],consumer:{reader:'ending',variant:art.id,...(art.baseIds?{baseIds:art.baseIds}:{baseId:art.baseId}),sealedOnly:true},
  publication:{scope:'local-only',status:'release-validation-pending',published:false,publicReady:false,publicReadyCountContribution:0}
 };
});
const registeredAssetUsageCatalog=[...sources.values()].map(source=>{
 const r=PROP_STORY_REVIEWS[source.path]||FATHER_THEFT_REVIEWS[source.path]||livingMoveReviews[source.path]||DAILY_LIFE_ART_REVIEWS[source.path]||DINNER_STORY_REVIEWS[source.path]||APPROVED_FOUR_SKIT_REVIEWS[source.path]||ORIGINAL_ASSET_USAGE_REVIEWS[source.path]||ASSET_USAGE_REVIEWS[source.path],record=source.record??r?.sourceRecord??null,nodes=record?storyNodes.filter(n=>n.panels?.some(p=>p.record===record)).map(n=>n.id):[];
 const primaryUse=r?.primaryUse||'story-dialogue',status=r?.status||'pending';
 const events=primaryUse==='trading-expression'&&status==='verified'?(r.events||[]):[];
 const applicability={events,directions:r?.directions||[],positions:[...new Set(events.flatMap(e=>eventRules[e]?.positions||[]))],profitBases:[...new Set(events.flatMap(e=>eventRules[e]?.profitBases||[]))],rules:Object.fromEntries(events.map(e=>[e,{...eventRules[e],...(r.eventRules?.[e]||{})}])),exclusions:r?.exclusions|| (primaryUse==='story-dialogue'?['story-only','never-crop-dialogue']:['unverified-account-event','direction-mismatch','profit-basis-mismatch'])};
 return {id:`asset:${source.path.slice(2).replace(/\.[^.]+$/,'')}`,path:source.path,primaryUse,label:ASSET_PRIMARY_USES[primaryUse],tags:[primaryUse,source.kind,...(r?.tags||[]),...(nodes.length?['existing-story-consumer']:[])],character:r?.character||source.character||'未核定',characters:r?.characters||[r?.character||source.character||'未核定'],emotion:r?.emotion||'待核',intensity:r?.intensity??null,hasEmbeddedText:r?.hasEmbeddedText??null,textOriginal:r?.textOriginal??null,presentation:{preserveWholeImage:true,objectFit:'contain',allowDialogueOverlay:!r?.hasEmbeddedText,minDisplayWidth:r?.minDisplayWidth??(r?.hasEmbeddedText?320:64)},applicability,review:{status,confidence:status==='verified'?'high':'pending',faceClarity:r?.faceClarity||'pending',textClarity:r?.textClarity||'pending',identityStatus:r?.identityStatus||status,identityDescription:r?.identityDescription||r?.character||source.character||'未核定'},source:{kind:source.kind,id:record?`manga-index:${record}`:`${source.metadataRefs[0]}`,record,sha256:source.sha256,dimensions:source.dimensions,metadataRefs:source.metadataRefs,url:source.sourceURL,commit:source.sourceCommit},storyNodeIds:nodes};
});
// New independent stories append after the earlier catalog, preserving every
// historical row and the existing seafood visual revision in place.
const dinnerExpansionPaths=['dinner-new-20','dinner-new-21'].map(id=>DINNER_STORY_ASSETS[id].path);
const originalAssetUsageCatalog=freeze(registeredAssetUsageCatalog.filter(row=>!dinnerExpansionPaths.includes(row.path)).concat([endingArtEntry,returnedSavingsArtEntry,...remainingEndingArtEntries]));
export const DINNER_EXPANSION_ENTRIES=freeze(registeredAssetUsageCatalog.filter(row=>dinnerExpansionPaths.includes(row.path)));


// Both immutable image versions are inventoried. Only the presentation revision
// is the current dinner consumer; neither image creates an additional story.
export const DINNER_ART_REVISION_ENTRIES=freeze(Object.entries(DINNER_STORY_ART_REVISIONS).map(([id,art])=>{
 const original=originalAssetUsageCatalog.find(row=>row.path===art.revision.basePath);
 if(!original||original.source.sha256!==art.revision.baseSha256)throw Error('Dinner revision base mismatch: '+id);
 return {...original,id:`asset:${art.path.slice(2).replace(/\.[^.]+$/,'')}`,path:art.path,
  tags:[...original.tags,'visual-revision'],
  source:{...original.source,id:`DINNER_STORY_ART_REVISIONS:${id}`,sha256:art.sha256,
   metadataRefs:[`DINNER_STORY_ART_REVISIONS:${id}`],revision:art.revision},
  consumer:{reader:'daily-artwork',storyId:id,role:'current-visual-revision',storyCountContribution:0}
 };
}));
// Earlier catalog rows remain exact in their original order.
export const ASSET_USAGE_CATALOG=freeze(originalAssetUsageCatalog.concat(DINNER_ART_REVISION_ENTRIES,DINNER_EXPANSION_ENTRIES));

// Caller supplies a certified event derived from current positions or a real
// receipt. A quote moving up/down alone is not a profit/loss event. No game RNG,
// no account reads/writes, no historical narration converted to player facts.
export function tradingExpressionCandidates(context={}){
 const {event,direction,position,profitBasis,pnlSign,previousPnlSign,maxDisplayWidth,maxDisplayHeight}=context;
 if([maxDisplayWidth,maxDisplayHeight].some(n=>n!==undefined&&(!Number.isFinite(n)||n<=0)))return [];
 if(!Object.hasOwn(eventRules,event)||!['long','short','mixed','none'].includes(direction)||!['flat','open'].includes(position)||!['none','floating','realized'].includes(profitBasis))return [];
 const facts={positions:position,profitBases:profitBasis,directions:direction,pnlSigns:pnlSign,previousPnlSigns:previousPnlSign,eventSources:context.eventSource};
 return ASSET_USAGE_CATALOG.filter(a=>{
  const [width,height]=a.source.dimensions;
  const fittedWidth=Math.min(maxDisplayWidth??Infinity,maxDisplayHeight===undefined?Infinity:maxDisplayHeight*width/height);
  if(a.presentation.minDisplayWidth>fittedWidth)return false;
  if(a.primaryUse!=='trading-expression'||a.review.status!=='verified'||!a.applicability.events.includes(event)||!a.applicability.directions.includes(direction))return false;
  const rule=a.applicability.rules[event];
  return Object.entries(rule).every(([key,allowed])=>Array.isArray(allowed)&&allowed.includes(facts[key]));
 });
}
export function selectTradingExpressionAsset(context={}){
 const pool=tradingExpressionCandidates(context);if(!pool.length)return null;
 const seed=Number.isSafeInteger(context.seed)?context.seed:0;
 return pool[((seed%pool.length)+pool.length)%pool.length];
}
