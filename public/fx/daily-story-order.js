// Approved original-story chapter order. Independent characters progress on
// separate tracks; eligibility still comes from the sealed financial evidence.
export const DAILY_STORY_TRACKS=Object.freeze({
 kurumi:Object.freeze(['realized-short-profit','profit-fades','holding-loss','averaging-down-prayer','realized-long-profit','pause-and-return','floating-profit-caution']),
 mebuki:Object.freeze(['follow-confidence','twenty-seconds','reversal-liquidation','borrowed-recovery','opposite-directions','borrowed-time','asking-for-more']),
 kangzi:Object.freeze(['long-loss-then-short','walkaway']),
 friends:Object.freeze(['friends-different-ledgers'])
});
export function orderedDailyStories(candidates,memory){
 const allowed=new Set(Object.values(DAILY_STORY_TRACKS).map(track=>track.find(id=>!memory.has(`arc:${id}`))).filter(Boolean));
 return candidates.filter(c=>!c.selection||allowed.has(c.id)||memory.has(c.identity)||memory.has(`arc:${c.id}`));
}
