import {dailyReturnMetrics} from './daily-performance.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {tradingTrauma} from './trading-trauma.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
// Generic AFTER-close scenes. These do not depict an intraday market path.
// The single authoritative emotion selector supplies mood/traumaActive.
const positive=Object.freeze({path:'./generated/settled-comics-v1/settled-gain.webp',kind:'generated-game-art',layout:'whole-sheet',alt:'收盘后，久留美看过账单，放下手机，松了一口气'});
const severe=Object.freeze({path:'./generated/settled-comics-v1/settled-severe-loss.webp',kind:'generated-game-art',layout:'whole-sheet',alt:'收盘后，久留美从难过流泪到放下手机，疲惫地坐着'});
const SEVERE_MOODS=new Set(['despair','extreme-despair','numb','trauma-numb','devastated','trauma-pain','trauma-frozen']);
export function settledComicArt({net,settled=false,mood,traumaActive=false,severeLoss=false}={}){
 if(!settled||!Number.isFinite(net))return null;
 if(net>0&&!traumaActive&&!SEVERE_MOODS.has(mood))return positive;
 if(net<0&&(severeLoss||SEVERE_MOODS.has(mood)))return severe;
 // A small loss/profit giveback must not produce a breakdown comic.
 return null;
}

// Read-only day-relative mapping. Leverage, borrowing and cumulative profits
// cannot relabel a sealed large DAILY loss as a relaxed small-loss scene.
export function isSevereSettledLoss(state,report=state?.dayReport){
 if(!report||report.day!==state.day||!Number.isFinite(report.net)||report.net>=0)return false;
 const daily=dailyReturnMetrics(state,{report}),trauma=tradingTrauma(state);
 const bankrupt=state.phase==='bankrupt'||state.ending?.id==='broke';
 return bankrupt||(daily.denominator!==null&&daily.denominator<=0)||Number.isFinite(daily.returnRate)&&daily.returnRate<=-.2||trauma.active&&['hurt','crushed','numb'].includes(trauma.level)||SEVERE_MOODS.has(report.mood);
}
