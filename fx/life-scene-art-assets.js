import {LIFE_SCENE_CATALOG} from './life-scene-catalog.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {inspectLifeSceneCatalog} from './life-scene-schema.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {ASSET_USAGE_CATALOG,ASSET_PRIMARY_USES} from './asset-usage-catalog.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
const freeze=value=>{if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
// Preserve the five existing routine entries; append the four reviewed friends.
// Browsing the book cannot award a natural action, a read receipt or a meal.
const precedingAssets=ASSET_USAGE_CATALOG;
const accepted=inspectLifeSceneCatalog(LIFE_SCENE_CATALOG).accepted;
export const LIFE_SCENE_ART_ENTRIES=freeze([
 ...accepted.filter(scene=>['work','relax'].includes(scene.category)),
 ...accepted.filter(scene=>scene.category==='friend')
 ]
 .filter(scene=>!precedingAssets.some(row=>row.path===scene.art.path||row.source.sha256===scene.art.sha256))
 .map(scene=>({
 id:`asset:${scene.art.path.slice(2).replace(/\.[^.]+$/,'')}`,path:scene.art.path,
 primaryUse:'story-dialogue',label:ASSET_PRIMARY_USES['story-dialogue'],
 tags:['story-dialogue','generated-game-art',`life-${scene.category}`],character:'久留美',characters:scene.characters,
 emotion:scene.title,intensity:null,hasEmbeddedText:false,textOriginal:null,
 presentation:{preserveWholeImage:true,objectFit:'contain',allowDialogueOverlay:true,minDisplayWidth:64},
 applicability:{events:[],directions:[],positions:[],profitBases:[],rules:{},exclusions:['story-only','exact-life-receipt-only','not-live-trading-expression']},
 review:{status:'verified',confidence:'high',faceClarity:'scene-scale',textClarity:'no-text',identityStatus:'verified',identityDescription:scene.category==='friend'?scene.characters.join('、'):'久留美'},
 source:{kind:'generated-game-art',id:`LIFE_SCENE_CATALOG:${scene.id}`,record:null,sha256:scene.art.sha256,dimensions:[scene.art.width,scene.art.height],metadataRefs:[`LIFE_SCENE_CATALOG:${scene.id}`],url:null,commit:scene.category==='friend'?scene.art.sourceCommit:null},
 storyNodeIds:[scene.id],consumer:{reader:'daily-artwork',storyId:scene.id,category:scene.category,optionId:scene.optionId,receiptDialogueSourceId:scene.receiptDialogueSourceId,semanticReadKey:scene.semanticReadKey}
})));
