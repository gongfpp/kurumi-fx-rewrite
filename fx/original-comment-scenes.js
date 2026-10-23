import {ORIGINAL_MARKET_COMMENTS} from './original-market-comments.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {NEWS_ARCHIVE} from './news-archive.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {availableNews,newsAvailableAt,newsContext} from './news-context.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';

// Fictional speakers are the game's existing investors, never account holders.
// Dialogue about their imagined trades has no execution, balance or ranking side effects.
const ACTORS=Object.freeze({long:'多头纸鸢',short:'空头逆风',watch:'观望小凳'});
const REVIEWED=new WeakSet(ORIGINAL_MARKET_COMMENTS);
const positive=value=>Number.isFinite(value)&&value>0;
const direction=value=>Math.abs(value)<.0003?0:Math.sign(value);
const MINUTE=60000;
const audAdverseNews=new Map(NEWS_ARCHIVE.filter(entry=>entry.currencies?.includes('AUD')&&entry.directionInterpretation?.currencyBias==='negative').map(entry=>[entry.id,entry]));
const barMove=bar=>bar.close/bar.open-1;
const adjacent=(previous,latest,minutes)=>!!previous&&!!latest&&previous.timestamp+minutes*MINUTE===latest.timestamp;

// New multi-pair/news scenes require timestamped completed intervals. Old saves
// without these fields retain the older generic-scene/excerpt fallback.
function strictBars(state,symbol,cutoff,beat){
 const active=state.marketBook?.active||'USD/JPY';
 const rows=symbol===active?state.candles:state.marketBook?.markets?.[symbol]?.candles;
 const minutes=state.liveMarket||[2,3].includes(state.historical?.version)?1:15;
 if(!Number.isFinite(cutoff))return [];
 return (Array.isArray(rows)?rows:[]).filter(c=>c?.closed===true&&!c.historical&&c.day===state.day&&positive(c.open)&&positive(c.close)&&Number.isFinite(c.beat)&&c.beat<=beat&&Number.isFinite(c.timestamp)&&c.timestamp+minutes*MINUTE<=cutoff);
}
function revealedAudNews(state,pair){
 if(pair!=='AUDJPY'||state.historical||state.liveMarket||state.lastEvent?.swan&&state.lastEvent.beat===state.beat)return null;
 const active=state.newsArchive?.version===2?state.newsArchive.active:null;
 const entry=audAdverseNews.get(active?.id);if(!entry)return null;
 const context=newsContext(state),beat=Number.isInteger(state.beat)?state.beat:0;
 const revealed=state.lastEvent?.beat===beat||state.pending?.beat===beat&&state.pending.flashShown;
 const slot=context.mode==='historical'?`history:${Math.floor(context.at/3600000)}`:`${state.day}:${beat}:${revealed?'reveal':'lead'}`;
 if(context.pair!==pair||active.scope!==`${context.mode}:${pair}:${context.date}`||active.slot!==slot||!availableNews(entry,context))return null;
 const at=newsAvailableAt(entry);
 // This first adapter uses only simulated AUDJPY's displayed canonical archive.
 // A catalogue entry or an old cached headline is not current news.
 if(!Number.isFinite(at)||context.at-at>86400000)return null;
 return {id:entry.id,availableAt:at};
}
function deltaObservation(state,pair,cutoff,beat){
 const minutes=state.liveMarket||[2,3].includes(state.historical?.version)?1:15;
 const symbol=pair.slice(0,3)+'/'+pair.slice(3),bars=strictBars(state,symbol,cutoff,beat),latest=bars.at(-1),previous=bars.at(-2);
 const linked=adjacent(previous,latest,minutes);
 const dipRecovery=!!linked&&barMove(previous)<-.0003&&barMove(latest)>.0003&&latest.close>=previous.open;
 const weakerRise=!!linked&&barMove(previous)>=.0015&&barMove(latest)>.0003&&barMove(latest)<=barMove(previous)/2&&latest.close>previous.close;
 const gb=strictBars(state,'GBP/JPY',cutoff,beat),us=strictBars(state,'USD/JPY',cutoff,beat),g=gb.at(-1),u=us.at(-1),up=us.at(-2);
 const aligned=!!g&&!!u&&g.timestamp===u.timestamp&&g.beat===u.beat&&g.day===u.day&&g.timestamp===latest?.timestamp;
 const crossFall=!!aligned&&barMove(g)>=.0015&&barMove(u)<-.0003;
 const crossPersistentFall=crossFall&&adjacent(up,u,minutes)&&barMove(up)<-.0003&&u.close<up.close;
 const news=revealedAudNews(state,pair),afterNews=!!news&&!!linked&&previous.timestamp>=news.availableAt;
 // Resilience can hold level or rise; it does not require inventing a selloff.
 const newsResilience=afterNews&&latest.close/previous.open-1>=-.0003&&barMove(latest)>=0;
 const newsWeakness=afterNews&&latest.close/previous.open-1<-.0003&&barMove(latest)<-.0003;
 return {weakerRise,dipRecovery,crossFall,crossPersistentFall,newsResilience,newsWeakness};
}

export function originalCommentObservation(state){
 if(!state||!['story','endless'].includes(state.mode??'story'))return null;
 const pair=(state.marketBook?.active||'USD/JPY').replace('/','');
 if(!['USDJPY','AUDJPY','GBPJPY'].includes(pair)||!Number.isFinite(state.day))return null;
 const cutoff=state.historical?.lastQuote?.[0]??state.liveMarket?.quotes?.[state.marketBook?.active||'USD/JPY']?.sourceTimestamp??state.tradingClock?.lastQuoteAt;
 const beat=Number.isFinite(state.beat)?state.beat:0;
 // Candle arrays hold revealed observations. Ignore seed history, incomplete bars,
 // other days and any bar explicitly stamped later than the observed cursor.
 const candles=(Array.isArray(state.candles)?state.candles:[]).filter(c=>c?.closed===true&&!c.historical&&c.day===state.day&&positive(c.open)&&positive(c.close)&&(!Number.isFinite(c.beat)||c.beat<=beat)&&(!Number.isFinite(c.timestamp)||Number.isFinite(cutoff)&&c.timestamp<=cutoff));
 if(!candles.length)return null;
 const first=candles[0],latest=candles.at(-1),previous=candles.at(-2);
 const move=latest.close/first.open-1,lastMove=latest.close/latest.open-1;
 const continuedRise=!!previous&&previous.close>previous.open&&latest.close>latest.open&&latest.close>previous.close;
 const persistentFall=!!previous&&previous.close<previous.open&&latest.close<latest.open&&latest.close<previous.close;
 const erasedGain=move<=0&&lastMove<-.0003&&candles.slice(0,-1).some(c=>c.close/first.open-1>.0003);
 const recent=candles.slice(-4),turns=recent.slice(1).filter((c,i)=>direction(c.close/c.open-1)*direction(recent[i].close/recent[i].open-1)<0).length;
 const event=state.lastEvent;
 // These two existing simulated story events explicitly describe reduced liquidity.
 // Only the revealed event record counts; never inspect the day's planned swan.
 const liquidityEvent=!state.historical&&!state.liveMarket&&pair==='USDJPY'&&state.swanSeen===true&&event?.swan===true&&['liquidity_freeze','bank_failure'].includes(event.id)&&(!Number.isFinite(event.day)||event.day===state.day)&&Number.isFinite(event.beat)&&event.beat===beat&&Number.isInteger(event.candle)&&event.candle>=0&&event.candle<4&&candles.filter(c=>c.beat===event.beat).length>event.candle&&latest.beat===event.beat&&Math.abs(lastMove)>=.0015;
 return {pair,move,lastMove,continuedRise,persistentFall,erasedGain,choppy:recent.length>=3&&turns>=2,liquidityEvent,...deltaObservation(state,pair,cutoff,beat)};
}

function fits(gate,seen){
 switch(gate){
  case 'observed':return true;
  case 'rise':return seen.move>.0003&&seen.lastMove>=0;
  case 'strong_rise':return seen.move>=.0015&&seen.lastMove>0;
  case 'continued_rise':return seen.move>.0003&&seen.continuedRise;
  case 'strong_continued_rise':return seen.move>=.0015&&seen.continuedRise;
  case 'fall':return seen.move<-.0003&&seen.lastMove<=0;
  case 'strong_fall':return seen.move<=-.0015&&seen.lastMove<0;
  case 'persistent_fall':return seen.move<-.0003&&seen.persistentFall;
  case 'erased_long_gain':return seen.erasedGain;
  case 'choppy':return seen.choppy;
  case 'revealed_liquidity_event':return seen.liquidityEvent;
  case 'revealed_rise_with_weaker_recent_upward_progress':return seen.weakerRise;
  case 'cross_pair_gbpjpy_rise_usdjpy_fall':return seen.crossFall;
  case 'cross_pair_gbpjpy_rise_usdjpy_persistent_fall':return seen.crossPersistentFall;
  case 'revealed_audjpy_dip_recovery':return seen.dipRecovery;
  case 'revealed_aud_adverse_news_and_audjpy_resilience':return seen.newsResilience;
  case 'revealed_aud_adverse_context_and_audjpy_weakness':return seen.newsWeakness;
  default:return false;
 }
}

export function eligibleOriginalComments(state,comments=ORIGINAL_MARKET_COMMENTS){
 const seen=originalCommentObservation(state);if(!seen)return [];
 return (Array.isArray(comments)?comments:[]).filter(row=>REVIEWED.has(row)&&row.source==='fictional'&&row.original_fictional===true&&row.real_quote===false&&row.release_enabled===true&&['accepted_generic','accepted_contextual'].includes(row.review_status)&&row.currency_pairs.includes(seen.pair)&&ACTORS[row.stance]&&fits(row.market_gate,seen)).map(row=>({...row,originalText:row.text_zh,actor:ACTORS[row.stance],zh_translation:`${ACTORS[row.stance]}：${row.text_zh}`}));
}
