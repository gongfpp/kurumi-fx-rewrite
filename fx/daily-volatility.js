// V1: sample standard deviation of completed prior-game-day realized returns.
// Return = change in cumulative net trading P/L / fixed initial principal.
// No annualization, current-day interpolation, funding, expenses or raw export.
export const VOLATILITY_FIELDS=Object.freeze(['volatilityVersion','volatilityDays','volatilitySamples','volatilityComplete','volatilitySum','volatilityM2','dailyVolatility']);
const MAX_RETURN=100000;
const close=(a,b)=>Math.abs(a-b)<=1e-10*Math.max(1,Math.abs(a),Math.abs(b));
export function unknownDailyVolatility(day=1){
 return{volatilityVersion:1,volatilityDays:Math.max(0,day-1),volatilitySamples:0,volatilityComplete:false,volatilitySum:null,volatilityM2:null,dailyVolatility:null};
}
export function sanitizeDailyVolatility(data,day){
 if(!data||typeof data!=='object'||Array.isArray(data))return null;
 if(!VOLATILITY_FIELDS.some(key=>Object.hasOwn(data,key)))return{};
 if(VOLATILITY_FIELDS.some(key=>!Object.hasOwn(data,key))||data.volatilityVersion!==1||!Number.isSafeInteger(day)||day<1||day>10000||data.volatilityDays!==day-1||typeof data.volatilityComplete!=='boolean'||!Number.isSafeInteger(data.volatilitySamples)||data.volatilitySamples<0||data.volatilitySamples>day-1)return null;
 const n=data.volatilitySamples;
 if(!data.volatilityComplete){if(n!==0||[data.volatilitySum,data.volatilityM2,data.dailyVolatility].some(value=>value!==null))return null;}
 else{
  if(n!==day-1||!Number.isFinite(data.volatilitySum)||Math.abs(data.volatilitySum)>n*MAX_RETURN||!Number.isFinite(data.volatilityM2)||data.volatilityM2<0||data.volatilityM2>n*MAX_RETURN**2)return null;
  if(n>0){const ceiling=Math.max(0,n*MAX_RETURN**2-data.volatilitySum**2/n);if(data.volatilityM2>ceiling+1e-12*Math.max(1,ceiling))return null;}
  if(n<2){if(data.volatilityM2!==0||data.dailyVolatility!==null||n===0&&data.volatilitySum!==0)return null;}
  else if(!Number.isFinite(data.dailyVolatility)||data.dailyVolatility<0||!close(data.dailyVolatility,Math.sqrt(data.volatilityM2/(n-1))))return null;
 }
 return Object.fromEntries(VOLATILITY_FIELDS.map(key=>[key,data[key]]));
}
export function dailyVolatilityMetrics(state={}){
 const day=state.day,unknown=unknownDailyVolatility(Number.isSafeInteger(day)&&day>=1&&day<=10000?day:1),principal=state.startEquity;
 const j=state.accountingJournal,start=j?.start;
 if(!Number.isSafeInteger(day)||day<1||day>10000||![100000,300000].includes(principal)||j?.version!==1||j.legacyPartial!==false||j.startedDay!==1||!Array.isArray(j.days)||start?.day!==1||!Number.isFinite(start.timestamp)||start.realizedProfit!==0)return unknown;
 const rows=j.days.filter(row=>row?.day<day),byDay=new Map();
 for(const row of rows){
  if(!Number.isSafeInteger(row.day)||row.day<1||byDay.has(row.day)||!Number.isFinite(row.timestamp)||!Number.isFinite(row.realizedProfit)||Math.abs(row.realizedProfit)>1e10)return unknown;
  byDay.set(row.day,row);
 }
 if(byDay.size!==day-1)return unknown;
 let previous=0,previousAt=start.timestamp,n=0,mean=0,m2=0,sum=0;
 for(let index=1;index<day;index++){
  const row=byDay.get(index);if(!row||row.timestamp<previousAt)return unknown;
  const value=(row.realizedProfit-previous)/principal;if(!Number.isFinite(value)||Math.abs(value)>MAX_RETURN)return unknown;
  n++;sum+=value;const delta=value-mean;mean+=delta/n;m2+=delta*(value-mean);
  previous=row.realizedProfit;previousAt=row.timestamp;
 }
 const result={volatilityVersion:1,volatilityDays:day-1,volatilitySamples:n,volatilityComplete:true,volatilitySum:sum,volatilityM2:Math.max(0,m2),dailyVolatility:n>=2?Math.sqrt(Math.max(0,m2)/(n-1)):null};
 return sanitizeDailyVolatility(result,day)||unknown;
}
