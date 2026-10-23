import {newsContext,newsDate} from './news-context.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';

// View-only memory of messages actually returned for display in this page.
// Never reconstruct missed publications from a saved script or quote history.
// A restored/replaced state starts a new observation session, even with the
// same seed/runId; ordinary play and modeStates retain the existing object.
const sessions=new WeakMap();
export const DISPLAYED_NEWS_LIMIT=256;
const fields=['id','chain','title','copy','source','time','archiveKind','archiveId','sourceUrl','contentKind','archiveTags','sourceAttribution','sourceLicenseUrl','summaryNotice','swan','publishedAt','publicationDate'];
const recapFields=['pair','from','to','start','last','change','low','high','count','title','copy'];
const pick=(value,keys)=>Object.fromEntries(keys.filter(key=>['string','number','boolean'].includes(typeof value?.[key])).map(key=>[key,value[key]]));
const snapshot=item=>({...pick(item,fields),recap:item.recap?pick(item.recap,recapFields):null,background:item.background?pick(item.background,fields):null});

function session(state,context){
 if(!state||typeof state!=='object')return null;
 if(context.mode!=='simulated'||!context.pair||!Number.isFinite(context.at)){sessions.delete(state);return null;}
 let memory=sessions.get(state);
 if(!memory||memory.runId!==state.runId||memory.seed!==state.seed||memory.mode!==state.mode||context.at<memory.at){
  memory={runId:state.runId,seed:state.seed,mode:state.mode,at:context.at,pairs:new Map()};sessions.set(state,memory);
 }
 memory.at=context.at;return memory;
}

export function rememberDisplayedNews(state,item,context=newsContext(state)){
 const memory=session(state,context);
 if(!memory||item?.contentKind!=='fictional_market_event'||!item.title||!Number.isFinite(item.publishedAt)||item.publishedAt>context.at)return;
 const id=`displayed:${context.pair}:${item.id??''}:${item.publishedAt}:${item.title}`;
 let rows=memory.pairs.get(context.pair);if(!rows){rows=new Map();memory.pairs.set(context.pair,rows);}
 // First publication wins: later recaps/background selections never rewrite it.
 if(rows.has(id))return;
 rows.set(id,snapshot({...item,id,publicationDate:newsDate(item.publishedAt)}));
 while(rows.size>DISPLAYED_NEWS_LIMIT)rows.delete(rows.keys().next().value);
}

export function displayedNewsItems(state){
 const context=newsContext(state),memory=session(state,context);
 return [...(memory?.pairs.get(context.pair)?.values()||[])].reverse().sort((a,b)=>b.publishedAt-a.publishedAt).map(snapshot);
}
