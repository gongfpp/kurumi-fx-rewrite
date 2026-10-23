// Separate research contract. M1 observations are never coerced into bid/ask ticks.
import {describeHistoricalCoverage} from './history-coverage.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {validateM1DayLabels,validateM1ObservedCoverage} from './m1-source-contract.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
const MAX=16*1024*1024;
export const RESEARCH_SYMBOLS=Object.freeze(['USDJPY','AUDJPY','GBPJPY']);
const HASH=/^[a-f0-9]{64}$/;const JST=32400000,DAY=86400000;
const date=ms=>new Date(ms+JST).toISOString().slice(0,10);
const fail=message=>{throw Error('分钟研究行情：'+message);};
async function digest(bytes){return [...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(v=>v.toString(16).padStart(2,'0')).join('');}
export async function readResearchBytes(stream,expected){
 if(!Number.isSafeInteger(expected)||expected<1||expected>MAX||!stream?.getReader)fail('文件尺寸无效');
 const reader=stream.getReader(),chunks=[];let length=0;
 try{for(;;){const {done,value}=await reader.read();if(done)break;length+=value.byteLength;if(length>expected||length>MAX){await reader.cancel();fail('文件超过声明大小');}chunks.push(value);}}
 finally{reader.releaseLock();}
 if(length!==expected)fail('文件长度不符');const out=new Uint8Array(length);let offset=0;for(const chunk of chunks){out.set(chunk,offset);offset+=chunk.byteLength;}return out;
}
export class ResearchProvider{
 #fetch;#base;#raw;#month=null;#pending=null;
 constructor(raw,{baseURL,fetch=globalThis.fetch,multiCurrency=false}={}){
  // Legacy single-month imports must remain USD-only; the three-pair adapter
  // explicitly owns symbol identity before enabling the broader parser.
  if(raw?.format!=='kurumi-private-fx-research-m1-v1'||!(multiCurrency?RESEARCH_SYMBOLS:['USDJPY']).includes(raw.symbol)||raw.precision!=='M1-OHLC'||raw.timestampMeaning!=='unknown-open-or-close-label'||raw.quoteSide!=='unverified-single-price-OHLC'||!HASH.test(raw.csv?.sha256)||!HASH.test(raw.gzip?.sha256)||!Array.isArray(raw.days))fail('不支持的数据契约');
  if(!Number.isSafeInteger(raw.rows)||raw.rows<1||raw.rows>31*1440||raw.days.length<1||raw.days.length>31||!/^\d{4}-(0[1-9]|1[0-2])$/.test(raw.utcMonth)||![raw.csv.bytes,raw.gzip.bytes].every(n=>Number.isSafeInteger(n)&&n>0&&n<=MAX)||!/^[-\w.]+\.csv\.gz$/.test(raw.gzip.file)||raw.gaps!=null&&(!Array.isArray(raw.gaps)||raw.gaps.length>raw.rows))fail('月份尺寸或路径无效');
  const base=new URL(baseURL);if(!['https:','http:'].includes(base.protocol)||base.username||base.password||!/^\/admin\/research\/months\/[-\w.]+\.json$/.test(base.pathname)||base.search||base.hash)fail('月份来源路径无效');
  this.#raw=JSON.parse(JSON.stringify(raw));this.#fetch=fetch;this.#base=baseURL;
  validateM1DayLabels(raw);
  const dates=new Set();for(const d of raw.days){let first=Date.parse(d.firstLabelUTC)+60000,last=Date.parse(d.lastLabelUTC)+60000;if(!Number.isFinite(first+last)||last<first||last-first>=DAY||new Date(first-60000).toISOString().slice(0,7)!==raw.utcMonth||new Date(last-60000).toISOString().slice(0,7)!==raw.utcMonth)fail('日期无效');for(let t=Math.floor((first+JST)/DAY)*DAY-JST;t<=last;t+=DAY)dates.add(date(t));}
  this.manifest=Object.freeze({schemaVersion:'research-m1-close-v1',id:'research-forexite-'+(raw.symbol==='USDJPY'?'':raw.symbol.toLowerCase()+'-')+raw.utcMonth,version:raw.csv.sha256,symbol:raw.symbol,timeZone:'Asia/Tokyo',quoteType:'observed-single-close',gapThresholdMs:60000,source:{sha256:raw.csv.sha256,url:'https://www.forexite.com/free_forex_quotes/forex_history_arhiv.html'},research:{timestampMeaning:raw.timestampMeaning,quoteSide:raw.quoteSide,availabilityModel:'label-plus-60-seconds',executionModel:'observed-close-only',spreadModel:'none',feesModel:'game-fee-rate'},days:[...dates].sort().map(day=>({date:day,sha256:raw.csv.sha256,gaps:(raw.gaps||[]).filter(g=>date(Date.parse(g.to)+60000)===day).map(g=>({fromMs:Date.parse(g.from)+60000,toMs:Date.parse(g.to)+60000,classification:g.classification}))}))});
 }
 clear(){this.#month=null;}
 get coverage(){return describeHistoricalCoverage(this.manifest,{rawM1:this.#raw,payloadVerified:this.#month!==null});}
 get cachedDates(){return this.#month?[...this.#month.keys()]:[];}
 async #load(){
  if(this.#month)return this.#month;if(this.#pending)return this.#pending;
  this.#pending=(async()=>{
   const url=new URL(this.#raw.gzip.file,this.#base);if(url.origin!==new URL(this.#base).origin||!/^\/admin\/research\/months\/[-\w.]+\.csv\.gz$/.test(url.pathname)||url.search||url.hash)fail('跨站或非月份来源');
   const res=await this.#fetch(url.href,{credentials:'same-origin',cache:'no-store',redirect:'error'});if(!res.ok)fail('载入失败 '+res.status);
   const zipped=await readResearchBytes(res.body,this.#raw.gzip.bytes);if(zipped.byteLength!==this.#raw.gzip.bytes||await digest(zipped)!==this.#raw.gzip.sha256)fail('压缩包校验失败');
   const bytes=await readResearchBytes(new Blob([zipped]).stream().pipeThrough(new DecompressionStream('gzip')),this.#raw.csv.bytes);if(bytes.byteLength!==this.#raw.csv.bytes||await digest(bytes)!==this.#raw.csv.sha256)fail('月份校验失败');
   const lines=new TextDecoder('utf-8',{fatal:true}).decode(bytes).trim().split(/\r?\n/);if(lines.shift()!=='timestampLabelUtcMs,open,high,low,close,sourceLocalLabel,sourceFile,sourceLine')fail('CSV表头不符');
   const days=new Map();let previous=-Infinity,count=0;
   for(const line of lines){const cells=line.split(',');if(cells.length!==8)fail('CSV列数不符');const r=cells.slice(0,5).map(Number),[t,o,h,l,c]=r;if(!Number.isSafeInteger(t)||t<0||t<=previous||new Date(t).toISOString().slice(0,7)!==this.#raw.utcMonth||!r.every(Number.isFinite)||l<=0||l>Math.min(o,c)||h<Math.max(o,c))fail('无效分钟线');previous=t;count++;
    // +60s is a conservative model boundary for either start/end-labelled M1 bars,
    // not a claim about historical publication latency or executable broker quotes.
    const bar=Object.freeze({labelAt:t,availableAt:t+60000,open:o,high:h,low:l,close:c}),key=date(bar.availableAt);if(!days.has(key))days.set(key,[]);days.get(key).push(bar);
   }
   if(count!==this.#raw.rows||[...days.keys()].join()!==this.manifest.days.map(d=>d.date).join())fail('覆盖范围不符');
   validateM1ObservedCoverage(this.#raw,[...days.values()].flatMap(bars=>bars.map(b=>b.labelAt)));
   this.#month=days;return days;
  })();try{return await this.#pending;}finally{this.#pending=null;}
 }
 async loadDay(date){if(!this.manifest.days.some(d=>d.date===date))fail('日期不在覆盖内');const days=await this.#load(),bars=days.get(date);return Object.freeze({schemaVersion:'research-m1-close-v1',datasetVersion:this.manifest.version,date,sha256:this.manifest.source.sha256,validated:true,bars:Object.freeze(bars)});}
}
