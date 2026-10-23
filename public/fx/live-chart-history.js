// Display-only real bars. Never writes game state or supplies execution prices.
export const LIVE_CHART_HISTORY_SOURCE=Object.freeze({provider:'biquote',documentation:'https://biquote.io/docs/#ohlc',priceBasis:'provider-ohlc-unspecified',sourceKinds:Object.freeze(['provider-bootstrap','provider-history','provider-tick-aggregation']),executionEligible:false});
const INTERVALS=Object.freeze({1:'1m',5:'5m',15:'15m',1440:'1d'});
const SYMBOLS=new Set(['USD/JPY','AUD/JPY','GBP/JPY']);
const MINUTE=60000;
const positive=value=>Number.isFinite(value)&&value>0;
export function parseLiveChartBars(payload,{symbol,minutes,now=Date.now(),limit=100}={}){
 const duration=minutes*MINUTE;
 if(!SYMBOLS.has(symbol)||!INTERVALS[minutes]||payload?.symbol!==symbol.replace('/','')||payload?.interval!==INTERVALS[minutes]||!Array.isArray(payload.bars)||payload.bars.length>1000)throw Error('invalid-bar-envelope');
 const unique=new Map();let offset=null;
 for(const row of payload.bars){
  const timestamp=typeof row.openTime==='string'&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(row.openTime)?Date.parse(row.openTime):NaN;
  if(!Number.isSafeInteger(timestamp)||timestamp<=0||timestamp>now||new Date(timestamp).toISOString().slice(0,19)!==row.openTime.slice(0,19)||typeof row.isOpen!=='boolean'||![row.open,row.high,row.low,row.close].every(positive)||row.low>Math.min(row.open,row.close)||row.high<Math.max(row.open,row.close))throw Error('invalid-bar');
  // Do not infer the time of an open snapshot's last tick. Closed historical
  // bars alone bootstrap; the actual quote stream owns the current bar.
  if(row.isOpen||timestamp+duration>now)continue;
  const phase=((timestamp%duration)+duration)%duration;
  if(offset===null)offset=phase;else if(offset!==phase)throw Error('inconsistent-bar-grid');
  const bar={timestamp,open:row.open,high:row.high,low:row.low,close:row.close,closed:true,periodMinutes:minutes,timeSource:'biquote-ohlc',priceBasis:LIVE_CHART_HISTORY_SOURCE.priceBasis,live:true};
  const previous=unique.get(timestamp);
  if(previous&&['open','high','low','close'].some(key=>previous[key]!==bar[key]))throw Error('conflicting-duplicate-bar');
  unique.set(timestamp,bar);
 }
 return {bars:[...unique.values()].sort((a,b)=>a.timestamp-b.timestamp).slice(-limit),offset:offset??(minutes===1440?15*3600000:0)};
}
export function mergeLiveChartBars(history,observations,{minutes,offset=0,now=Date.now(),limit=300}={}){
 const duration=minutes*MINUTE,merged=new Map(history.map(bar=>[bar.timestamp,{...bar}]));
 // Source minutes are actual observed quotes; no missing minute is filled.
 const sorted=(observations||[]).filter(row=>Number.isFinite(row.timestamp)&&row.timestamp<=now&&(!Number.isFinite(row.lastQuoteAt)||row.lastQuoteAt<=now)).slice().sort((a,b)=>a.timestamp-b.timestamp||(a.lastQuoteAt??a.timestamp)-(b.lastQuoteAt??b.timestamp));
 for(const row of sorted){
  if(![row.open,row.high,row.low,row.close].every(positive)||row.low>Math.min(row.open,row.close)||row.high<Math.max(row.open,row.close))continue;
  const timestamp=Math.floor((row.timestamp-offset)/duration)*duration+offset;
  const previous=merged.get(timestamp);
  // A complete provider bar is more informative than a partial locally observed
  // minute from the same completed interval. Never double-count the interval.
  if(previous?.timeSource==='biquote-ohlc')continue;
  if(previous){previous.close=row.close;previous.high=Math.max(previous.high,row.high);previous.low=Math.min(previous.low,row.low);previous.closed=previous.closed&&!!row.closed;previous.lastQuoteAt=row.lastQuoteAt??row.timestamp;}
  else merged.set(timestamp,{...row,timestamp,periodMinutes:minutes,closed:!!row.closed,timeSource:'observed-quote',priceBasis:'provider-indicative-mid'});
 }
 return [...merged.values()].sort((a,b)=>a.timestamp-b.timestamp).slice(-limit).map(bar=>({...bar,closed:bar.closed&&bar.timestamp+duration<=now}));
}
export function createLiveChartHistory({fetchImpl=globalThis.fetch,clock=Date.now,onChange=()=>{},setTimer=setTimeout,clearTimer=clearTimeout,timeoutMs=8000,isCurrent=()=>true}={}){
 let current=null,serial=0;
 const same=(a,b)=>a&&a.state===b.state&&a.generation===b.generation&&a.symbol===b.symbol&&a.minutes===b.minutes&&a.runId===b.state?.runId;
 const cancel=()=>{serial++;current?.controller?.abort();current?.cancel?.();current=null;};
 function view(context,observations){
  if(!SYMBOLS.has(context.symbol)||!INTERVALS[context.minutes])throw Error('unsupported-chart-series');
  if(!same(current,context)){
   cancel();const token=serial,controller=new AbortController();
   const entry={...context,runId:context.state?.runId,controller,status:'loading',error:null,bars:[],offset:context.minutes===1440?15*3600000:0};current=entry;
   const url=`https://biquote.io/api/${context.symbol.replace('/','')}/ohlc?interval=${INTERVALS[context.minutes]}&limit=100`;
   let timer;
   const deadline=new Promise((_,reject)=>{timer=setTimer(()=>{controller.abort();reject(Error('history-timeout'));},timeoutMs);});
   const canceled=new Promise(resolve=>{entry.cancel=()=>resolve(null);});
   const request=Promise.resolve().then(async()=>{const response=await fetchImpl(url,{method:'GET',mode:'cors',credentials:'omit',cache:'no-store',signal:controller.signal});if(!response.ok)throw Error(`history-http-${response.status}`);return response.json();});
   Promise.race([request,deadline,canceled]).then(payload=>{
    if(token!==serial||current!==entry||!same(entry,entry)||!isCurrent(entry)||!payload)return;
    const parsed=parseLiveChartBars(payload,{symbol:entry.symbol,minutes:entry.minutes,now:clock()});entry.bars=parsed.bars;entry.offset=parsed.offset;entry.status=entry.bars.length?'ready':'empty';onChange();
   }).catch(error=>{if(token!==serial||current!==entry||!same(entry,entry)||!isCurrent(entry))return;entry.status='unavailable';entry.error=error?.message||'history-unavailable';onChange();}).finally(()=>clearTimer(timer));
  }
  return mergeLiveChartBars(current.bars,observations,{minutes:context.minutes,offset:current.offset,now:clock()});
 }
 return {view,cancel,get status(){return current?.status??'idle';},get metadata(){return {...LIVE_CHART_HISTORY_SOURCE,status:current?.status??'idle',error:current?.error??null,symbol:current?.symbol??null,minutes:current?.minutes??null};}};
}
