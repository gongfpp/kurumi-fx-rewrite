import {ownsTradingNotes} from './life-work.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {FATHER_DISCOVERY_POLICY} from './father-discovery.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
// Discovery happens in play. Undiscovered items show only anonymous, unusable silhouettes.
// Keep the original introduction's durable completion marker for story replay.
// There is no mochiko product, usable action or liquidation benefit.
export const ITEM_EVENTS={fatherDiscover:['father'],friendStudy:['mochiko'],roommate:['energy']};
// Kept as an empty compatibility export; unlock conditions are never player copy.
export const UNLOCK_HINTS={};
export {ITEM_SCENES} from './copy/scenes.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
export function itemDiscovered(s,id){return id==='tradingNotes'?ownsTradingNotes(s):!!s.itemDiscoveries?.[id]||itemUnlocked(s,id);}
const PLAY_ITEMS=['takeaway','noodles','energy','father'];
export function itemUnlocked(s,id){return id==='tradingNotes'?ownsTradingNotes(s):['dailyDrink','chocolate','eyeMask'].includes(id)?false:id==='father'?s.mode==='endless'||!!s.family?.unlocked:s.mode==='endless'&&PLAY_ITEMS.includes(id)||!!s.itemUnlocks?.[id];}
export function itemUnavailableReason(s,id){return id==='eyeMask'&&s.dailySupplies?.eyeMaskPending?'已备好，留待下次睡眠':'';}
export function discoverItems(s){
 s.itemDiscoveries ||= {};s.itemUnlocks ||= {};
 const profit=s.history?.filter(t=>t.type!=='open').reduce((n,t)=>n+(t.pnl||0),0)||0;
 const discover=(id,unlocked=false)=>{s.itemDiscoveries[id] ||= {day:s.day,event:'play'};if(unlocked)s.itemUnlocks[id] ||= {day:s.day,event:'play'};};
 for(const id of ['takeaway','noodles','energy'])discover(id,true);
 if(ownsTradingNotes(s))discover('tradingNotes',true);
 if(s.day>=FATHER_DISCOVERY_POLICY.scheduledDay||s.family?.unlocked||s.fatherUsed)discover('father');
 return s.itemDiscoveries;
}
