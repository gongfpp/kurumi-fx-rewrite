// Validates labels and declared coverage. It does not resolve the provider's
// unknown opening/closing label, publication latency or Forexite price side.
const MINUTE=60000;
const fail=()=>{throw Error('分钟研究行情：分钟标签或覆盖范围不符');};
export function parseM1Label(label){
 if(typeof label!=='string'||!/^\d{4}-\d\d-\d\dT\d\d:\d\d:00(?:\.000)?Z$/.test(label))fail();
 const at=Date.parse(label);if(!Number.isSafeInteger(at)||at<0||new Date(at).toISOString().slice(0,19)!==label.slice(0,19))fail();return at;
}
export function validateM1DayLabels(raw){
 let last=-Infinity,total=0,allCounts=true;
 const result=raw.days.map(d=>{
  const first=parseM1Label(d.firstLabelUTC),end=parseM1Label(d.lastLabelUTC);
  if(first<=last||end<first||end-first>=86400000||new Date(first).toISOString().slice(0,7)!==raw.utcMonth||new Date(end).toISOString().slice(0,7)!==raw.utcMonth)fail();
  if(d.date!==undefined&&(d.date!==new Date(first).toISOString().slice(0,10)||d.date!==new Date(end).toISOString().slice(0,10)))fail();
  if(d.rows!==undefined&&(!Number.isSafeInteger(d.rows)||d.rows<1||d.rows>(end-first)/MINUTE+1))fail();
  if(d.rows===undefined)allCounts=false;else total+=d.rows;last=end;return {first,last:end,rows:d.rows};
 });
 if(allCounts&&total!==raw.rows)fail();return result;
}
export function validateM1ObservedCoverage(raw,observations){
 const expected=validateM1DayLabels(raw);let range=0,previous=-Infinity;
 const seen=expected.map(()=>({first:null,last:null,rows:0}));
 for(const at of observations){
  if(!Number.isSafeInteger(at)||at%MINUTE!==0||at<=previous)fail();
  while(range<expected.length&&at>expected[range].last)range++;
  if(range===expected.length||at<expected[range].first)fail();
  const row=seen[range];row.first??=at;row.last=at;row.rows++;previous=at;
 }
 if(seen.some((row,i)=>row.first!==expected[i].first||row.last!==expected[i].last||expected[i].rows!==undefined&&row.rows!==expected[i].rows))fail();
 return true;
}
