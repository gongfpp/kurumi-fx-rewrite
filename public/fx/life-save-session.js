import {createSaveSession as createBaseSaveSession} from './save-session.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {LIFE_SCENE_DIALOGUE_SOURCES} from './life-scene-dialogue-sources.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {validLifeActions} from './life-actions.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
// This is the first scene-source compatibility boundary, not a rolling backup.
function hasLifeSceneSource(state){
  if(!LIFE_SCENE_DIALOGUE_SOURCES.length||state?.mode!=='story'||state.version!==17||state.lifeActions?.version!==1)return false;
  // Do not let a forged source claim consume this one-time archive. This guard
  // only selects the migration backup; it does not change general save policy.
  try{return validLifeActions(state)&&state.lifeActions.receipts.some(receipt=>LIFE_SCENE_DIALOGUE_SOURCES.some(row=>row.category===receipt.category&&row.optionId===receipt.optionId&&JSON.stringify(row.dialogue)===JSON.stringify(receipt.dialogue)));}catch{return false;}
}
const lifeSceneMigration=Object.freeze({enabled:LIFE_SCENE_DIALOGUE_SOURCES.length>0,hasSource:hasLifeSceneSource});
// Only the main game opts into its life-source compatibility boundary.
// Reuse the canonical validator without importing main-game code in the shared
// save session used by the preserved chapter runtime.
export function createSaveSession(options){
  return createBaseSaveSession({...options,lifeSceneMigration,staminaFatigueMigration:true});
}
