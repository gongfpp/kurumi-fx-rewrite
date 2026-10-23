// Lottery winnings are a separate gross source, never trading PnL or principal.
export function hasLotteryCheat(state){return state?.lottery?.cheatRedeemed===true||state?.cheatLotteryIncome>0||(state?.lottery?.tickets||[]).some(t=>t.kind==='cheat');}
export function lotteryRankingIncome(state){
 const value=state?.lotteryIncome??0;
 if(!Number.isSafeInteger(value)||value<0||value>1e10)throw Object.assign(Error('彩票奖金记录无效'),{code:'invalid-score'});
 return value;
}
export function assertLotteryRankingEligible(state){if(hasLotteryCheat(state))throw Object.assign(Error('暗号彩票局不进入公共排行榜'),{code:'lottery-cheat'});}
export function lotteryScoreFields(state){assertLotteryRankingEligible(state);const lotteryIncome=lotteryRankingIncome(state);return lotteryIncome>0?{lotteryIncome}:{};}
export function lotteryScoreForServer(score,supported){
 if(Object.hasOwn(score,'lotteryIncome')&&supported!==true)throw Object.assign(Error('排行榜尚未支持彩票奖金，本局成绩暂未提交'),{code:'lottery-unavailable'});
 return {...score};
}
// Candidate achievement facts, without freezing names or unlock conditions.
export function normalLotteryFacts(state){
 if(hasLotteryCheat(state))return {wins:0,topThreeWins:0};
 const tickets=(state?.lottery?.tickets||[]).filter(t=>t.kind==='normal'&&t.status==='settled'&&Number.isSafeInteger(t.result?.prize)&&t.result.prize>0);
 return {wins:tickets.length,topThreeWins:tickets.filter(t=>Number.isInteger(t.result.tier)&&t.result.tier>=1&&t.result.tier<=3).length};
}
