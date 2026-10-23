import {LIFE_WORK_JOBS} from './life-work.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {LIFE_SCENE_DIALOGUE_SOURCES} from './life-scene-dialogue-sources.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
// Append-only receipt dialogue sources. Existing source IDs, scope and exact text
// are a save-format contract, independent of the current action selector.
// These two legacy snapshots intentionally preserve the original v17 bytes.
const source=(category,optionId,sourceId,origin,lines)=>Object.freeze({category,optionId,dialogue:Object.freeze({sourceId,origin,lines:Object.freeze(lines.map(([from,text])=>Object.freeze({from,text})))})});
export const LIFE_ACTION_DIALOGUE_SOURCES=Object.freeze([
 source('relax','onsen','onsen-rest-20261017','original-game-adaptation',[[ '久留美','更衣柜一关，手机也跟着安静了。' ],[ '久留美','泡完再按一按肩膀。今天的交易，到这里就够了。' ]]),
 source('friend','yasuko','yasuko-cat-toy-20261017','original-game-adaptation',[[ '久留美','逗猫绳带来了。它今天肯出来吗？' ],[ '安子','已经盯上你手里的绳子了。手机先收起来。' ],[ '久留美','好吧，今天只追它。' ]]),
 source("friend","mochiko","O-F-TALK-01","existing-game-dialogue",[["久留美","我想找一份坐着就能发财的工作。"],["萌智子","售票窗口也能坐。"],["久留美","我说的是发财，不是找零。"],["萌智子","那你先把“工作”两个字划掉。"],["久留美","不要，这样听起来比较有志气。"]]),
 source("friend","yasuko","O-C-HIDE-02","existing-game-dialogue",[["久留美","今天我先当个省话的人。"],["安子","行，那我少问两句。"],["久留美","但不是不能理我。"]]),
 ...LIFE_SCENE_DIALOGUE_SOURCES,
 ...LIFE_WORK_JOBS.filter(job=>!LIFE_SCENE_DIALOGUE_SOURCES.some(row=>row.category==='work'&&row.optionId===job.id&&row.dialogue.sourceId===job.dialogue.sourceId)).map(job=>Object.freeze({category:'work',optionId:job.id,dialogue:job.dialogue})),
]);
// No fallback to today's selector or untrusted save text for an unknown identity.
export function lifeActionDialogueForSource(option,sourceId){
 const row=LIFE_ACTION_DIALOGUE_SOURCES.find(row=>row.category===option?.category&&row.optionId===option?.id&&row.dialogue.sourceId===sourceId);
 return row?structuredClone(row.dialogue):null;
}
export function validLifeActionDialogue(option,dialogue){
 // Null was the exact legacy payload for these options; keep it valid forever.
 if(dialogue===null)return ['dinner','work','relax'].includes(option.category);
 const expected=lifeActionDialogueForSource(option,dialogue?.sourceId);
 return expected!==null&&JSON.stringify(dialogue)===JSON.stringify(expected);
}
