import {LIBRARY_COPY} from './copy/library-ui.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {MARKET_COMMENTS} from './market-comments.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {ORIGINAL_MARKET_COMMENTS} from './original-market-comments.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {eligibleOriginalComments} from './original-comment-scenes.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {currentTradingTimestamp} from './trading-time.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
const clamp=n=>Math.max(0,Math.min(1,Number.isFinite(n)?n:0));
export const COMMENT_REPEAT_GAP=30000;
export const ORIGINAL_THEME_REPEAT_GAP=90000;
export const PLAYER_COMMENT_MAX_LENGTH=200;
export const PLAYER_COMMENT_PREVIEW_LENGTH=30;
// Input is only the existing public comments API response, never composer text.
// Keep the nickname in the same text-only line; Unicode code points match the API.
export function eligiblePlayerComments(rows=[]){
 const ids=new Set();
 return (Array.isArray(rows)?rows:[]).slice(0,50).flatMap(row=>{
  if(!row||typeof row.id!=='string'||!row.id||ids.has(row.id)||typeof row.text!=='string')return [];
  const text=row.text.trim();
  if(!text||[...text].length>PLAYER_COMMENT_MAX_LENGTH)return [];
  ids.add(row.id);
  const alias=typeof row.alias==='string'&&row.alias?row.alias:'匿名玩家',long=[...text].length>PLAYER_COMMENT_PREVIEW_LENGTH;
  const preview=long?[...text].slice(0,PLAYER_COMMENT_PREVIEW_LENGTH).join('')+'…':text;
  return [{id:row.id,alias,playerText:text,truncated:long,zh_translation:`${alias}：${preview}`,source:'player'}];
 });
}
// Activity is derived only from revealed candles and completed/recorded actions.
// Never read a planned quote track, reroll RNG, write a save, or affect execution.
export function marketCommentActivity(state={}){
 const day=state.day,beat=Number.isFinite(state.beat)?state.beat:0;
 const candles=(state.candles||[]).filter(c=>c?.closed&&!c.historical&&c.day===day&&c.open>0).slice(-4);
 const movement=candles.length?candles.reduce((sum,c)=>sum+Math.abs(c.close/c.open-1),0)/candles.length:0;
 const trades=(state.runStatistics?.trades||state.history||[]).filter(t=>t?.day===day&&t.beat>=Math.max(0,beat-1)&&t.beat<=beat).length;
 const event=state.lastEvent,revealedShock=state.swanSeen===true&&event?.swan===true&&event.day===day&&event.beat>=beat-1&&event.beat<=beat;
 const score=clamp(Math.max(movement/.0015,trades/5,(state.heat||0)/5,revealedShock?1:0));
 return score>=.66?{level:'hot',interval:2000,pixelsPerSecond:100,lanes:4}:score>=.25?{level:'active',interval:3600,pixelsPerSecond:72,lanes:3}:{level:'quiet',interval:9000,pixelsPerSecond:48,lanes:2};
}
// Compatibility belongs only to unchanged canonical legacy records. New
// records, copied rows and colliding IDs must use the shared admission gates.
const LEGACY_COMMENT_IDS=["se-profit-01","se-costs-01","se-risk-01","se-leverage-01","se-short-01","se-suspicious-01","se-returns-01","se-walkaway-01","se-participants-01","se-orderbook-01","se-spreads-01","se-new-01","se-margin-01","se-stopout-01","se-pips-01","se-ask-01"];
const LEGACY_COMMENT_RECORDS=new WeakSet(LEGACY_COMMENT_IDS.flatMap((id,index)=>{
 const row=MARKET_COMMENTS[index];
 return row?.id===id&&row.source_batch===undefined&&Object.isFrozen(row)?[row]:[];
}));
const commentText=value=>typeof value==='string'&&value.trim().length>0;
const commentSourceRef=row=>commentText(row.source_ref)?row.source_ref.trim():row.id.trim();
const commentTextKey=value=>value.normalize('NFC').replace(/\s+/gu,' ').trim();
// Compare equivalent text without rewriting the displayed or full player message.
const commentRepeatKey=row=>commentTextKey(row.playerText??row.originalText??row.zh_translation);
const COMMENT_KEYS=new WeakMap();
function commentKeys(row){
 const cached=COMMENT_KEYS.get(row);
 if(cached&&cached.id===row.id&&cached.source_ref===row.source_ref&&cached.original===row.original&&cached.zh_translation===row.zh_translation)return cached.keys;
 const keys=[row.id.trim(),commentSourceRef(row),commentTextKey(row.original),commentTextKey(row.zh_translation)];
 COMMENT_KEYS.set(row,{id:row.id,source_ref:row.source_ref,original:row.original,zh_translation:row.zh_translation,keys});return keys;
}
function uniqueMarketComments(rows){
 // Keep the canonical legacy objects if a later import reuses their identity.
 // Otherwise the first admitted record owns its attribution; never mix fields.
 const ids=new Set(),refs=new Set(),originals=new Set(),translations=new Set(),accepted=new Set();
 const accept=row=>{
  const [id,ref,original,translation]=commentKeys(row);
  if(ids.has(id)||refs.has(ref)||originals.has(original)||translations.has(translation))return;
  ids.add(id);refs.add(ref);originals.add(original);translations.add(translation);accepted.add(row);
 };
 for(const row of rows)if(LEGACY_COMMENT_RECORDS.has(row))accept(row);
 for(const row of rows)if(!LEGACY_COMMENT_RECORDS.has(row))accept(row);
 return rows.filter(row=>accepted.delete(row));
}
function commentLink(value){
 if(!commentText(value))return null;
 try{const url=new URL(value);return url.protocol==='https:'&&!url.username&&!url.password?url:null;}catch{return null;}
}
function commentSourceName(row){
 const name=[row.source_platform,row.source_name].find(commentText);
 if(name)return name.trim();
 const host=commentLink(row.source_url)?.hostname;
 return host==='money.stackexchange.com'?'Personal Finance & Money Stack Exchange':host||'来源未标明';
}
function commentTimestamp(value){
 // Require an ISO date, with an explicit zone when a time is supplied. Reject
 // calendar normalization (for example February 30) and ambiguous local time.
 if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}(?:T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d{1,3})?(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d))?$/.test(value))return NaN;
 const date=value.slice(0,10),midnight=Date.parse(`${date}T00:00:00Z`),timestamp=Date.parse(value);
 return Number.isFinite(midnight)&&new Date(midnight).toISOString().slice(0,10)===date?timestamp:NaN;
}
const COMMENT_DATES=new WeakMap();
function commentDates(row){
 const cached=COMMENT_DATES.get(row);
 if(cached&&cached.source_date===row.source_date&&cached.source_updated===row.source_updated)return cached;
 const created=commentTimestamp(row.source_date),updated=row.source_updated==null?created:commentTimestamp(row.source_updated);
 const dates={source_date:row.source_date,source_updated:row.source_updated,created,updated};
 COMMENT_DATES.set(row,dates);return dates;
}
// Review distinguishes timeless quotes from dated personal events; a generic
// thought is not a contemporaneous historical or currency-pair claim.
function recentRealizedLoss(state,cutoff){
 const trade=state.lastTrade,beat=state.beat;
 return !!trade&&['close','half','stop','liquidation','rescue','closing'].includes(trade.type)&&Number.isFinite(trade.pnl)&&trade.pnl<0&&Number.isFinite(trade.timestamp)&&trade.timestamp<=cutoff&&trade.day===state.day&&Number.isFinite(beat)&&Number.isFinite(trade.beat)&&trade.beat<=beat&&trade.beat>=Math.max(0,beat-1);
}
export function eligibleMarketComments(comments=MARKET_COMMENTS,state=null){
 const cutoff=state===null?Infinity:currentTradingTimestamp(state);
 const admitted=(Array.isArray(comments)?comments:[]).filter(row=>{
  if(!row||row.source==='player'||row.source==='fictional'||row.original_fictional===true||row.real_quote===false||row.playerText!==undefined||row.release_enabled!==true||!['id','license','attribution_display','source_title','source_url','license_url','original','zh_translation','translation_note'].every(key=>commentText(row[key]))||!/^CC-BY-SA-(3\.0|4\.0)$/.test(row.license)||!row.source_url.startsWith('https://')||!row.license_url.startsWith('https://creativecommons.org/'))return false;
  const {created,updated}=commentDates(row);
  if(!Number.isFinite(created)||!Number.isFinite(updated))return false;
  if(LEGACY_COMMENT_RECORDS.has(row))return true;
  // Shared admission for all additional sources. Batch names never grant a
  // bypass. Pair-specific/other-asset quotes need a separate supported scene.
  if(row.edited_contributors_review_required!==false||row.source_updated!==null||row.context_reviewed!==true||row.asset_scope!=='general_trading'||row.contemporaneous_replay_allowed!==false||!Array.isArray(row.candidate_currency_pairs)||row.candidate_currency_pairs.length||!commentText(row.reuse_rationale_zh))return false;
  if(row.reuse_scope==='timeless_general_expression')return row.scene_gate==='general_expression';
  if(row.reuse_scope==='dated_personal_event'&&row.scene_gate==='recent_realized_loss')return true;
  return false;
 });
 // Resolve the aggregate before temporal filtering so the source identity is
 // stable between the credits index and scene changes. Duplicates need review,
 // not an attribution switch when a different scene happens to become eligible.
 return uniqueMarketComments(admitted).filter(row=>{
  if(state===null||LEGACY_COMMENT_RECORDS.has(row)||row.reuse_scope!=='dated_personal_event')return true;
  const {created,updated}=commentDates(row);
  return Math.max(created,updated)<=cutoff&&recentRealizedLoss(state,cutoff);
 });
}
// A lane keeps its speed until empty. A following line may enter once the
// preceding tail has cleared the right edge by 42px, so it cannot catch up.
export const COMMENT_LANE_GAP=42;
export const COMMENT_MAX_VISIBLE=16;
export function createCommentSchedule({comments=MARKET_COMMENTS,originalComments=ORIGINAL_MARKET_COMMENTS,measureWidth=text=>text.length*14}={}){
 const catalogue=eligibleMarketComments(comments),seen=new Map(),seenThemes=new Map(),shownPlayerIds=new Set(),lanes=Array(4).fill(null);let playerPool=[],marketSincePlayer=0,marketSinceOriginal=1,cursor=0,originalCursor=0,laneCursor=0,clock=0,wall=null,paused=true,nextAt=0,key=null,reduced=null,active=[],datedPool=new Set();
 return{
  // Replace the public snapshot, rather than append on every poll or resume.
  setPlayerComments(rows){playerPool=eligiblePlayerComments(rows);},
  update(state,{now=0,pause=false,reduce=false,width=400}={}){
   if(wall!==null&&!paused&&!pause)clock+=Math.max(0,Math.min(2000,now-wall)); // no replay after a sleeping tab
   wall=now;paused=pause;
   width=Math.max(200,width||400);
   const pool=eligibleMarketComments(catalogue,state),originalPool=eligibleOriginalComments(state,originalComments),run=`${state.mode}:${state.runId||state.seed}`,scopeChanged=key!==run,hardReset=scopeChanged||reduced!==reduce;
   const nextDatedPool=new Set(pool.filter(row=>row.reuse_scope==='dated_personal_event').map(row=>row.id)),withdrawn=[...datedPool].filter(id=>!nextDatedPool.has(id));datedPool=nextDatedPool;
   const reset=hardReset||withdrawn.length>0;
   // Eligibility and container width affect future rows, never the current run.
   if(hardReset){key=run;reduced=reduce;lanes.fill(null);active=[];laneCursor=0;nextAt=clock;}
   // A date/source rollback must also withdraw an already visible dated event.
   // Keep unrelated rows and lane reservations: clearing one reservation could
   // let a new follower collide with an earlier line still travelling there.
   active=active.filter(row=>row.expires>clock&&!(row.dated&&withdrawn.includes(row.id)));
   const activity=marketCommentActivity(state),result={clock,reset,hardReset,withdrawn,scopeChanged:scopeChanged||withdrawn.length>0,paused:pause,reduced:reduce,activity,row:null};
   if(pause||clock<nextAt||active.length>=COMMENT_MAX_VISIBLE||!pool.length&&!originalPool.length)return result;
   let lane=reduce?0:-1;
   if(!reduce)for(let n=0;n<activity.lanes;n++){
    const index=(laneCursor+n)%activity.lanes,previous=lanes[index];
    const tail=previous?previous.origin-(clock-previous.startedAt)*previous.speed/1000+previous.textWidth:-Infinity;
    if(!previous||clock>=previous.expires||tail<=width-COMMENT_LANE_GAP){lane=index;break;}
   }
   if(lane<0)return result;
   let row=null;
   if(marketSincePlayer>=3)row=playerPool.find(candidate=>!shownPlayerIds.has(candidate.id)&&(!seen.has(commentRepeatKey(candidate))||clock-seen.get(commentRepeatKey(candidate))>=COMMENT_REPEAT_GAP))||null;
   // Player priority is unchanged. Fictional dialogue shares these existing lanes,
   // alternates with excerpts, and cannot increase density by paraphrasing one scene.
   if(!row&&marketSinceOriginal>=1)for(let n=0;n<originalPool.length;n++){
    const index=(originalCursor+n)%originalPool.length,candidate=originalPool[index];
    if((!seen.has(commentRepeatKey(candidate))||clock-seen.get(commentRepeatKey(candidate))>=COMMENT_REPEAT_GAP)&&(!seenThemes.has(candidate.theme_id)||clock-seenThemes.get(candidate.theme_id)>=ORIGINAL_THEME_REPEAT_GAP)){
     row=candidate;
     // Keep the existing theme priority. Within that eligible theme, prefer the
     // least recently shown wording, so its first variant cannot starve siblings.
     for(let offset=1;offset<originalPool.length;offset++){
      const alternate=originalPool[(index+offset)%originalPool.length];
      if(alternate.theme_id!==candidate.theme_id)continue;
      const last=seen.get(commentRepeatKey(alternate))??-Infinity;
      if(clock-last>=COMMENT_REPEAT_GAP&&last<(seen.get(commentRepeatKey(row))??-Infinity))row=alternate;
     }
     originalCursor=(index+1)%originalPool.length;break;
    }
   }
   for(let n=0;!row&&n<pool.length;n++){const index=(cursor+n)%pool.length,candidate=pool[index];if(!seen.has(commentRepeatKey(candidate))||clock-seen.get(commentRepeatKey(candidate))>=COMMENT_REPEAT_GAP){row=candidate;cursor=(index+1)%pool.length;break;}}
   if(!row)return result; // never invent text or shorten the repeat cooldown for density
   const textWidth=Math.max(1,measureWidth(row.zh_translation)),previous=lanes[lane];
   const speed=previous&&previous.expires>clock?previous.speed:activity.pixelsPerSecond;
   const duration=reduce?30000:Math.ceil((width+textWidth)/speed*1000);
   if(row.source==='player'){shownPlayerIds.add(row.id);marketSincePlayer=0;}else marketSincePlayer=Math.min(3,marketSincePlayer+1);
   if(row.source==='fictional'){seenThemes.set(row.theme_id,clock);marketSinceOriginal=0;}else if(row.source!=='player')marketSinceOriginal=1;
   seen.set(commentRepeatKey(row),clock);lanes[lane]={origin:width,startedAt:clock,textWidth,expires:clock+duration,speed};
   active.push({expires:clock+duration,id:row.id,dated:row.reuse_scope==='dated_personal_event'&&row.source!=='player'});
   laneCursor=(lane+1)%activity.lanes;nextAt=clock+Math.max(activity.interval,reduce?30000:0);
   result.row={...row,lane,duration,textWidth,speed,origin:width,expires:clock+duration};return result;
  }
 };
}
export function createInvestorDanmaku(root,{document=root.ownerDocument,now=()=>performance.now(),comments=MARKET_COMMENTS,originalComments=ORIGINAL_MARKET_COMMENTS,onOpenComment=()=>{}}={}){
 const canvas=document.createElement('canvas'),context=canvas.getContext?.('2d');
 if(context)context.font='600 13px sans-serif';
 const schedule=createCommentSchedule({comments,originalComments,measureWidth:text=>context?Math.ceil(context.measureText(text).width)+8:text.length*14}),lines=new Map();let disposed=false;
 const removeLine=line=>{lines.get(line)?.cleanup();lines.delete(line);line.remove();};
 const clearLines=retained=>{for(const line of [...root.children])if(line!==retained)removeLine(line);};
 return{
  setPlayerComments(rows){if(!disposed)schedule.setPlayerComments(rows);},
  update(state,{paused=false,reducedMotion=false}={}){
   if(disposed)return;
   const effectivePaused=paused||root.contains?.(document.activeElement)===true;
   const frame=schedule.update(state,{now:now(),pause:effectivePaused,reduce:reducedMotion,width:root.clientWidth});
   root.dataset.activity=frame.activity.level;root.dataset.lanes=String(frame.activity.lanes);root.dataset.paused=String(effectivePaused);root.dataset.reduced=String(reducedMotion);
   if(frame.hardReset)clearLines(reducedMotion&&!frame.scopeChanged?[...root.children].at(-1):null);
   for(const child of [...root.children]){
    if(child.dataset.source!=='player'&&frame.withdrawn.includes(child.dataset.commentId)){removeLine(child);continue;}
    if(!reducedMotion&&Number(child.dataset.expires)<=frame.clock){removeLine(child);continue;}
    const record=lines.get(child),animation=child.getAnimations?.().find(a=>a.animationName==='investor-comment-right-to-left');
    // Moving the native list between skins can recreate its CSS animation.
    // Reattach that animation to the existing row's clock, without replaying it.
    if(record&&animation&&record.animation!==animation)animation.currentTime=Math.max(0,frame.clock-record.startedAt);
    if(record)record.animation=animation;
   }
   if(!frame.row)return;
   if(reducedMotion)clearLines();
   const line=document.createElement('li');line.className='investor-danmaku-line';
   let detachOpen=()=>{};
   if(frame.row.source==='player'&&frame.row.truncated){
    const full=document.createElement('button');full.type='button';full.className='investor-danmaku-open';full.textContent=frame.row.zh_translation;full.setAttribute('aria-label',LIBRARY_COPY.commentOpenLabel.replace('{alias}',frame.row.alias));
    const open=()=>{if(!disposed&&lines.has(line))onOpenComment({id:frame.row.id,alias:frame.row.alias,text:frame.row.playerText});};
    full.addEventListener('click',open);detachOpen=()=>full.removeEventListener?.('click',open);line.append(full);
   }else line.textContent=frame.row.zh_translation;
   line.dataset.source=frame.row.source||'excerpt';line.dataset.sourceRef=frame.row.source==='player'?frame.row.id:commentSourceRef(frame.row);line.dataset.commentId=frame.row.id;line.dataset.lane=String(frame.row.lane);line.dataset.speed=String(frame.row.speed);line.dataset.expires=String(frame.row.expires);
   line.style.left=`${frame.row.origin}px`;
   line.style.setProperty('--comment-width',`${frame.row.textWidth}px`);line.style.setProperty('--comment-lane',frame.row.lane);line.style.setProperty('--comment-duration',`${frame.row.duration}ms`);line.style.setProperty('--comment-travel',`${frame.row.origin}px`);
   const end=event=>{if(event.target===line&&event.animationName==='investor-comment-right-to-left')removeLine(line);};
   line.addEventListener('animationend',end);
   lines.set(line,{startedAt:frame.clock,animation:null,cleanup(){line.removeEventListener?.('animationend',end);detachOpen();}});root.append(line);
  },
  dispose(){disposed=true;clearLines();}
 };
}
export function mountCommentCredits(root,{document=root.ownerDocument,comments=MARKET_COMMENTS}={}){
 root.replaceChildren();
 const intro=document.createElement('p');intro.textContent='这些短评摘自下列来源的公开交易与投资讨论，由英文节选翻译。它们不是剧情年代的实时聊天；提问、设想与作者自述均不代表已核验的交易经历。各条节选及译文按所列 CC BY-SA 许可共享，不代表作者或平台背书。';root.append(intro);
 const policies=new Map();
 for(const row of eligibleMarketComments(comments)){
  const section=document.createElement('section'),title=document.createElement('h3'),quote=document.createElement('p'),original=document.createElement('p'),credit=document.createElement('p'),source=document.createElement('a'),license=document.createElement('a'),changes=document.createElement('p');
  const sourceName=commentSourceName(row);
  section.id=`comment-source-${commentSourceRef(row)}`;title.textContent=row.zh_translation;original.textContent=row.original;original.lang='en';credit.textContent=`${row.attribution_display} · ${row.source_date.slice(0,10)} · ${sourceName}`;
  source.href=row.source_url;source.textContent=row.source_title;license.href=row.license_url;license.textContent=row.license;license.rel='license noopener noreferrer';source.rel='noopener noreferrer';source.target=license.target='_blank';
  changes.textContent=`${row.translation_note} ${row.translation_credit}，按 ${row.translation_license||row.license} 共享。`;quote.append(source,document.createTextNode(' · '),license);section.append(title,original,credit,quote,changes);
  if(commentLink(row.source_author_url)){const author=document.createElement('a');author.href=row.source_author_url;author.textContent=row.attribution_display;author.target='_blank';author.rel='noopener noreferrer';section.append(author);}
  if(row.context){const context=document.createElement('p');context.textContent=row.context;section.append(context);}
  root.append(section);
  const policyUrl=commentLink(row.license_policy_url)?.href;
  if(policyUrl){if(!policies.has(policyUrl))policies.set(policyUrl,new Set());policies.get(policyUrl).add(sourceName);}
 }
 for(const [url,names] of policies){const policy=document.createElement('a');policy.href=url;policy.textContent=`${[...names].join(' / ')} 内容许可说明`;policy.target='_blank';policy.rel='noopener noreferrer';root.append(policy);}
}
