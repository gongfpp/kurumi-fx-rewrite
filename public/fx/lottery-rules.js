// Explicit experiment only: callers must choose a confirmed configuration before release.
export const CANDIDATE_LOTTERY_RULES=Object.freeze({id:'candidate-20261017',approved:false,ticketPrice:300,drawMinute:18*60,guaranteeDraws:40,cheatCode:'201402',cheatPrize:20000000,tiers:Object.freeze([{tier:1,prize:20000000,weight:1},{tier:2,prize:2000000,weight:4},{tier:3,prize:200000,weight:45},{tier:4,prize:10000,weight:50},{tier:5,prize:3000,weight:100},{tier:6,prize:300,weight:200},{tier:0,prize:0,weight:600}].map(Object.freeze))});
export function validateLotteryRules(c){
 if(!c||typeof c.id!=='string'||!c.id||c.ticketPrice!==300||c.guaranteeDraws!==40||!Number.isInteger(c.drawMinute)||c.drawMinute<0||c.drawMinute>=1440||c.cheatPrize!==20000000||!Array.isArray(c.tiers)||c.tiers.length!==7)throw Error('Invalid lottery rules');
 const tiers=new Set();for(const t of c.tiers){if(!Number.isInteger(t.tier)||t.tier<0||t.tier>6||tiers.has(t.tier)||!Number.isSafeInteger(t.prize)||t.prize<0||!Number.isFinite(t.weight)||t.weight<0)throw Error('Invalid lottery tier');tiers.add(t.tier);}
 if(c.tiers.find(t=>t.tier===1).prize!==20000000||c.tiers.find(t=>t.tier===0).prize!==0||!c.tiers.some(t=>t.tier>0&&t.tier<=3&&t.weight>0)||!c.tiers.some(t=>t.weight>0))throw Error('Invalid lottery distribution');return c;
}
export function drawLotteryResult(config,rng,forced=false){
 validateLotteryRules(config);const pool=config.tiers.filter(t=>!forced||(t.tier>=1&&t.tier<=3));const u=rng();if(!Number.isFinite(u)||u<0||u>=1)throw Error('Lottery RNG must return [0,1)');let n=u*pool.reduce((s,t)=>s+t.weight,0);const selected=pool.find(t=>(n-=t.weight)<0);return {tier:selected.tier,prize:selected.prize,forced};
}
// Root verified the user's approval of the complete plan on 2026-10-17.
// Preserve candidate identity for reproducible historical experiment receipts.
export const LOTTERY_RULES=Object.freeze({...CANDIDATE_LOTTERY_RULES,id:'lottery-20261017-v1',approved:true});
