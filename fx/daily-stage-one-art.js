import {lifeActionStory,mountLifeActionStory} from './life-action-story.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {applyApprovedContextDialogue} from './context-rewrite-view.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {DAILY_FALLBACK_CATALOG} from './daily-fallback-catalog.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {LIFE_SCENE_CATALOG} from './life-scene-catalog.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {lifeSceneCandidates} from './life-scene-consumer.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {dailyFallbackCandidates} from './daily-fallback-scenes.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {DINNER_TIERS,dinnerStoryCandidates} from './dinner-story-scenes.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {approvedDailySkitCandidates} from './approved-skit-scenes.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {mountComicDialogue,usesPanelArtwork} from './comic-dialogue-view.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {selectRealizedProfitArtwork} from './profit-tier-art.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {orderedDailyStories} from './daily-story-order.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {selectDailyFamilyArtwork,isDailyFamilyNarrative} from './daily-family-art.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {selectComicScene} from './comic-scenes.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {COMIC_PRESENTATION_ASSETS} from './comic-scene-assets.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {selectDailyContextualManga,selectLockedFriendContextualManga,selectDeferredFriendContextualManga,selectDeferredFirstDayContextualManga} from './contextual-manga-scenes.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {CONTEXTUAL_MANGA_ASSETS} from './contextual-manga-content.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {CHARACTER_STORY_ASSETS} from './character-story-content.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {settledComicArt,isSevereSettledLoss} from './settled-comic-art.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {sealedDailyMangaOutcome} from './manga-context.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {tradingTrauma} from './trading-trauma.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {artIdentity,dailyArtMemory,observeSeenArtwork} from './daily-art-memory.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {setImage} from './assets.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {mountContextualManga} from './contextual-manga-view.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {dailyNarrativeFacts,dailySceneFilterReason} from './daily-narrative-facts.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {ACTION_SCENES} from './copy/action-scenes.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {SCENE_LINES} from './copy/scenes.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {hasDailyIllustration,noteDailyImageFailure,preferDailyIllustration} from './daily-illustration.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {createSkitLine} from './skit-dialogue.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
const candidate=scene=>scene?.frames?{...scene,identity:'sequence:'+scene.frames.map(frame=>artIdentity(frame.art)).join('|')}:scene?.art?{...scene,identity:artIdentity(scene.art)}:null;
// An exhausted illustration is not evidence that the activity really happened.
// Validate its current receipt, offered price/outcome and paired positive debit
// before admitting a separate daily scene. This adapter never repairs ledgers.
function validActivityForFallback(state,receipt){
 const outcome=sealedDailyMangaOutcome(state),tier=DINNER_TIERS[receipt?.id];
 if(state?.mode!=='story'||!outcome||!receipt||receipt.day!==state.day||!Number.isFinite(receipt.timestamp))return false;
 const offered=tier?receipt.cost===tier.cost&&outcome.net>=tier.minGain:
  receipt.id==='noodles-today'?receipt.cost===150&&outcome.net<0:
  receipt.id==='quiet-night'?receipt.cost===0&&outcome.net<=-10000:false;
 if(!offered||!selectComicScene(state,{type:'activity',receipt}))return false;
 if(receipt.id==='noodles-today'&&receipt.consumptionId===`item:${state.day}:noodles`){
  const uses=state.dailySupplies?.uses?.filter(row=>row.day===state.day&&row.id==='noodles')||[];
  const debits=state.consumptionLedger?.filter(row=>row.id===receipt.consumptionId)||[];
  return uses.length===1&&uses[0].cost===150&&uses[0].consumptionId===receipt.consumptionId&&debits.length===1&&
   debits[0].kind==='item'&&debits[0].day===state.day&&debits[0].amount===150&&Number.isFinite(debits[0].timestamp)&&debits[0].timestamp<=receipt.timestamp;
 }
 return receipt.cost===0||!!state.consumptionLedger?.some(r=>r.id===`activity:${state.day}:${receipt.id}`&&r.kind==='activity'&&r.day===state.day&&r.amount===receipt.cost&&r.timestamp===receipt.timestamp);
}
// A matching original can follow exhausted activity art, but never displace an
// unread paid/life story. Existing selectors own its certified receipt evidence;
// the ordinary chapter-order and one-scene memory gates still apply below.
function activityOriginalCandidates(state,activity){
 const ids=activity?.id==='quiet-night'?['averaging-down-prayer','pause-and-return']:activity?.id==='dinner-friends'?['friends-different-ledgers']:[];
 if(!ids.length)return [];
 const contextual=selectDailyContextualManga(state);
 return (contextual?[contextual,...(contextual.related||[])]:[]).filter(arc=>ids.includes(arc.id))
  .map(arc=>({id:arc.id,identity:`arc:${arc.id}`,title:arc.title,selection:{...arc,related:undefined}}));
}
function coreDailyArtworkCandidates(state,narrative,{memory=dailyArtMemory,lifeCatalog=LIFE_SCENE_CATALOG}={}){
 if(!sealedDailyMangaOutcome(state)||state.mode==='endless')return [];
 if(isDailyFamilyNarrative(narrative))return [candidate(selectDailyFamilyArtwork(state,narrative))].filter(Boolean);
 // The player's paid choice is more specific than a generic profit picture.
 const activity=(state.recapChoiceLedger||[]).findLast(r=>r.day===state.day);
 if(activity&&Object.hasOwn(DINNER_TIERS,activity.id))return [...dinnerStoryCandidates(state,activity,{memory}),...activityOriginalCandidates(state,activity)];
 if(activity){const scene=selectComicScene(state,{type:'activity',receipt:activity},{assets:COMIC_PRESENTATION_ASSETS});return [...(scene?.ready?[candidate(scene)]:[]),...activityOriginalCandidates(state,activity)];}
 const chosenLife=lifeSceneCandidates(state,null,{catalog:lifeCatalog,memory});
 const actionStory=lifeActionStory(state);
 if(chosenLife.length||actionStory)return chosenLife.length?chosenLife:[actionStory];
 if(narrative?.event?.key==='friendStudy'){const art=COMIC_PRESENTATION_ASSETS['mochiko-watch'];return art?.reviewed&&art.panels===4?[candidate({id:'mochiko-watch',title:narrative.event.title,art,lines:narrative.event.lines||[]})]:[];}
 const contextual=selectDailyContextualManga(state),choices=approvedDailySkitCandidates(state,{memory}).map(candidate);
 for(const arc of contextual?[contextual,...(contextual.related||[])]:[]){
  const selection={...arc,related:undefined};
  const completeEdition=arc.completionIdentity&&arc.nodes.flatMap(node=>node.panels).every(panel=>memory.has(artIdentity(CONTEXTUAL_MANGA_ASSETS[panel.record]||CHARACTER_STORY_ASSETS[panel.record])));
  choices.push({id:arc.id,identity:arc.completionIdentity||`arc:${arc.id}`,title:arc.title,selection,...(completeEdition?{preserveLockedOnly:true}:{})});
  if(arc.id==='opposite-directions'&&memory.day?.(`${state.runId||state.seed}:${state.day}`).identity==='arc:opposite-directions'){
   const legacy={...selection,nodes:selection.nodes.filter(node=>node.id!=='tuition')};delete legacy.completionIdentity;
   choices.push({id:arc.id,identity:'arc:opposite-directions',title:arc.title,selection:legacy,preserveLockedOnly:true});
  }
 }
 // No unrelated picture underneath a narrative event. A missing exact match
 // keeps its honest text rather than inventing a happy/loss scene.
 if(narrative?.event?.key&&narrative.event.key!=='quietNight')return choices;
 // Exact story/original-work choices retain priority. A genuine life receipt
 // is more specific than generic market art or an unrelated quiet-day scene.
 choices.push(...lifeSceneCandidates(state,narrative,{catalog:lifeCatalog,memory}));
 const trauma=tradingTrauma(state),art=state.dayReport.net>0&&!trauma.active?selectRealizedProfitArtwork(state.dayReport.net):settledComicArt({net:state.dayReport.net,settled:true,mood:trauma.active?'devastated':state.dayReport.mood,traumaActive:trauma.active,severeLoss:isSevereSettledLoss(state,state.dayReport)});
 if(art)choices.push(candidate({id:'daily-result',title:state.dayReport.net>0?'今天收盘了':state.dayReport.net<0?'今天先到这里':'收盘之后',art,lines:[]}));
 const recalled=selectDeferredFirstDayContextualManga(state,narrative);
 if(recalled){
  const ids=recalled.nodes.flatMap(node=>node.panels.map(panel=>artIdentity(CONTEXTUAL_MANGA_ASSETS[panel.record]||CHARACTER_STORY_ASSETS[panel.record])));
  choices.push({id:recalled.id,identity:recalled.completionIdentity,title:recalled.title,selection:recalled,deferredOriginal:true,
   preserveLockedOnly:ids.length>0&&ids.every(id=>id&&memory.has(id))});
 }
 const deferred=selectDeferredFriendContextualManga(state,narrative);
 if(deferred){
  const ids=deferred.nodes.flatMap(node=>node.panels.map(panel=>artIdentity(CONTEXTUAL_MANGA_ASSETS[panel.record]||CHARACTER_STORY_ASSETS[panel.record])));
  choices.push({id:deferred.id,identity:deferred.completionIdentity,title:deferred.title,selection:deferred,deferredOriginal:true,
   preserveLockedOnly:ids.length>0&&ids.every(id=>id&&memory.has(id))});
 }
 return choices.filter(Boolean);
}
function consequenceTransition(state){
 const facts=dailyNarrativeFacts(state);if(!facts?.needsConsequence)return null;
 // Reuse already shipped, context-compatible lines. This is a transition,
 // never a new comic, action receipt, reward or completed original chapter.
 // The frozen intraday portrait says numbers are still moving. After close,
 // use the existing rest line instead of pretending the quote is still live.
 const lines=facts.outcome.kind==='loss'?ACTION_SCENES['settled-severe-loss'].lines:
  facts.trauma.active&&facts.trauma.mood!=='trauma-frozen'?[['久留美',facts.trauma.line]]:SCENE_LINES.quietNight;
 return {id:'daily-consequence-transition',identity:`daily-consequence:${state.runId||state.seed}:${state.day}`,title:facts.outcome.kind==='loss'?ACTION_SCENES['settled-severe-loss'].title:'收盘之后',
  ready:true,dialogueOnly:true,consequenceTransition:true,consequenceFirst:true,lines:structuredClone(lines)};
}
export function dailyArtworkCandidates(state,narrative,options={}){
 const candidates=coreDailyArtworkCandidates(state,narrative,options);
 if(isDailyFamilyNarrative(narrative))return candidates;
 const facts=dailyNarrativeFacts(state);
 if(facts?.needsConsequence&&facts.outcome.kind==='loss'){
  const art=settledComicArt({net:facts.outcome.net,settled:true,severeLoss:true});
  if(art)candidates.unshift(candidate({id:'daily-result',title:ACTION_SCENES['settled-severe-loss'].title,art,lines:ACTION_SCENES['settled-severe-loss'].lines,consequenceFirst:true}));
 }
 return candidates.filter(scene=>!dailySceneFilterReason(state,scene));
}
export function selectDailyArtwork(state,narrative,{memory=dailyArtMemory,fallbackCatalog=DAILY_FALLBACK_CATALOG,lifeCatalog=LIFE_SCENE_CATALOG,preferIllustrated=false}={}){
 if(narrative?.day!==undefined&&narrative.day!==state?.day)return null;
 const primary=orderedDailyStories(dailyArtworkCandidates(state,narrative,{memory,lifeCatalog}),memory);
 const activity=(state.recapChoiceLedger||[]).findLast(r=>r.day===state.day),validActivity=validActivityForFallback(state,activity);
 const unreadPrimary=primary.some(scene=>!scene.preserveLockedOnly&&!memory.has(scene.identity)&&(!scene.arcIdentity||!memory.has(scene.arcIdentity)));
 const receiptAction=primary.find(scene=>scene.receiptDialogue);
 // Already-read art stays in the gallery. Its image identity need not occupy
 // another closing screen; the actual action/receipt remains this day's fact.
 const repeatedLifeSource=receiptAction&&state.lifeActions?.receipts?.some(receipt=>receipt.day<receiptAction.day&&
  receipt.dialogue?.sourceId===state.dayReport?.lifeAction?.dialogue?.sourceId);
 const exhaustedLifeArt=receiptAction?.lifeScene&&receiptAction.art&&
  (memory.has(receiptAction.identity)||receiptAction.arcIdentity&&memory.has(receiptAction.arcIdentity));
 // Text receipts have a per-day identity. A new ID must not make the same
 // already-read frozen exchange look like a new story on every later day.
 // Require both this run's earlier exact source and its witnessed read marker.
 const exhaustedLifeText=receiptAction?.dialogueOnly&&repeatedLifeSource&&state.lifeActions.receipts.some(receipt=>
  receipt.day<receiptAction.day&&receipt.dialogue?.sourceId===state.dayReport.lifeAction.dialogue?.sourceId&&memory.has(`life-dialogue:${receipt.id}`));
 const exhaustedLife=exhaustedLifeArt||exhaustedLifeText;
 const fallback=dailyFallbackCandidates(state,narrative,{catalog:fallbackCatalog,memory,allowExhaustedActivity:validActivity})
  // Keep an already-locked daily scene restorable if a later content update
  // adds unread activity art. Only an exhausted activity may choose a new one.
  .map(scene=>validActivity&&unreadPrimary?{...scene,preserveLockedOnly:true}:scene)
  // A separate daily scene after an already-read life illustration still
  // belongs to this committed day. Reuse the life receipt's existing save gate.
  .map(scene=>exhaustedLife?{...scene,lifeScene:true,lifeReceiptFallback:true,receiptKey:receiptAction.receiptKey,receiptBinding:receiptAction.receiptBinding,day:receiptAction.day,runId:receiptAction.runId,dayKey:receiptAction.dayKey}:scene);
 // Its real event owns the new roommate scene, ahead of unrelated market arcs.
 // A paid choice still comes first, including on roommate's introduction day.
 // Keep legacy selected-day candidates for restoration and preserve empty locks.
 const roommate=!activity&&narrative?.event?.key==='roommate'&&fallback.length>0;
 const immediate=primary.filter(scene=>!scene.deferredOriginal).map(scene=>exhaustedLifeText&&scene===receiptAction?{...scene,preserveLockedOnly:true}:scene),deferred=primary.filter(scene=>scene.deferredOriginal);
 // A completed introduction must not wait behind the entire fifty-day daily
 // pool. Its unchanged evidence/order gates run above; exact current actions
 // still come first. pick() below preserves an existing old-day lock.
 const candidates=roommate?[...fallback,...primary.map(scene=>({...scene,preserveLockedOnly:true}))]:[...immediate,...deferred,...fallback];
 // Legacy chapter locks still refer to the same chapter, not this newer
 // edition identity. Restore only certified original evidence; never reselect.
 if(memory.day?.(`${state.runId||state.seed}:${state.day}`).identity==='arc:follow-confidence'){
  const original=selectDeferredFriendContextualManga(state,narrative)||selectLockedFriendContextualManga(state,narrative);
  if(original)candidates.push(...orderedDailyStories([{id:original.id,identity:'arc:follow-confidence',title:original.title,selection:original,preserveLockedOnly:true}],memory));
 }
 const eligible=isDailyFamilyNarrative(narrative)?candidates:candidates.filter(scene=>!dailySceneFilterReason(state,scene));
 const selected=memory.pick(`${state.runId||state.seed}:${state.day}`,eligible);
 // A user-chosen, saved exchange must not disappear behind a generic image
 // locked by a previous client. Preserve that old lock; show the real receipt.
 const chosenAction=eligible.find(scene=>scene.receiptDialogue);
 // An unread chosen exchange keeps priority, but a previously read catalog
 // image must not hide the next eligible daily story. Preserve its locked-day
 // fallback on reload; an exhausted pool leaves replay in the existing gallery.
 if(chosenAction&&selected?.identity!==chosenAction.identity&&!exhaustedLife)return preferIllustrated?preferDailyIllustration(chosenAction,eligible):chosenAction;
 const preferred=selected||(!isDailyFamilyNarrative(narrative)?consequenceTransition(state):null)||(narrative?.event?.key==='friendStudy'?eligible.find(scene=>scene.id==='mochiko-watch'):null)||null;
 return applyApprovedContextDialogue(preferIllustrated?preferDailyIllustration(preferred,eligible):preferred);
}
export function mountDailyArtwork(host,selection,{memory=dailyArtMemory,showHeading=true,onSelectionChange=()=>{}}={}){
 selection=applyApprovedContextDialogue(selection);
 memory=memory.forSelection?.(selection)||memory;
 host.replaceChildren();host.hidden=false;host.className='daily-single-art';let dispose=()=>{};
 delete host.dataset.contentIdentity;
 const doc=host.ownerDocument,make=(tag,text)=>{const el=doc.createElement(tag);if(text)el.textContent=text;return el;};
 if(!selection){host.hidden=true;return {dispose};}
 host.dataset.contentIdentity=selection.identity;
 const heading=make('h3',selection.title),body=make('div'),replay=make('button','回看这段小剧场');replay.type='button';replay.className='secondary';
 const seen=memory.has(selection.identity)||selection.arcIdentity&&memory.has(selection.arcIdentity);
 // Keep the current committed receipt open on re-entry. On later days a read
 // picture no longer displaces the next eligible story; the gallery retains it.
 const currentLife=selection.lifeScene===true&&!selection.lifeReceiptFallback&&!!selection.receiptKey&&!!selection.receiptBinding;
 body.hidden=!!seen&&!currentLife&&!selection.showIllustration&&!selection.illustrationTextOnly;replay.hidden=!seen||currentLife||!!selection.showIllustration||!!selection.illustrationTextOnly;
 const paintText=()=>{body.replaceChildren();body.hidden=false;replay.hidden=true;
  const lines=selection.lines?.length?selection.lines:selection.frames?.map(frame=>['旁白',frame.text])||selection.selection?.nodes?.flatMap(node=>[['旁白',node.before],['旁白',node.after]]).filter(([,text])=>text)||[];
  for(const [speaker,text] of lines)body.append(createSkitLine(doc,speaker,text));
  if(!lines.length)body.append(make('p',selection.art?.alt||selection.title));
 };
 let cancelled=false,replacement=null;
 const onError=event=>{const image=event.target;if(image?.tagName!=='IMG'||!selection.showIllustration)return;
  queueMicrotask(()=>{if(cancelled||!image.classList.contains('image-unavailable'))return;
   noteDailyImageFailure(image.src);const next=selection.illustrationAlternatives?.find(hasDailyIllustration);
   if(next){cancelled=true;host.removeEventListener('error',onError,true);dispose();const chosen={...next,showIllustration:true,illustrationAlternatives:selection.illustrationAlternatives.filter(scene=>scene!==next)};replacement=mountDailyArtwork(host,chosen,{memory,showHeading,onSelectionChange});onSelectionChange(chosen);return;}
   // Keep this exact story's text when no usable matching picture remains.
   cancelled=true;host.removeEventListener('error',onError,true);dispose();paintText();
   onSelectionChange({...selection,showIllustration:false,illustrationTextOnly:true,illustrationAlternatives:[]});
  });
 };
 host.addEventListener?.('error',onError,true);
 function paint(manual=false){if(body.childNodes.length)return;if(selection.dialogueOnly){const view=mountLifeActionStory(body,selection,{memory:selection.consequenceTransition?undefined:memory});dispose=view.dispose;return;}if(selection.contextLabel)body.append(make('p',selection.contextLabel));if(usesPanelArtwork(selection)){const dialogue=make('ol');dialogue.className='event-comic-lines comic-panel-cards';body.append(dialogue);const view=mountComicDialogue(dialogue,selection,{root:doc});dispose=view.observe({memory,identities:[selection.identity,selection.arcIdentity].filter(Boolean)});return;}if(selection.selection){const view=mountContextualManga(body,selection.selection,{manual:false,unreadOnly:!manual,showHeading:false,memory});dispose=()=>view?.dispose();return;}if(selection.frames){dispose=mountDailySequence(body,selection,{memory});return;}const image=make('img');image.alt=selection.art.alt||selection.title;if(selection.art.width)image.width=selection.art.width;if(selection.art.height)image.height=selection.art.height;image.style.cssText='display:block;width:100%;height:auto;object-fit:contain';body.append(image);setImage(image,selection.art.path);dispose=observeSeenArtwork(image,{memory,identities:[selection.identity,selection.arcIdentity].filter(Boolean)});
  if(selection.manga)body.append(make('p','原作片段 · 图中金额与经历属于原作人物。'));
  if(selection.lines?.length){const dialogue=make('ol');dialogue.className='event-comic-lines';const view=mountComicDialogue(dialogue,selection,{root:doc}),stopImage=dispose;dispose=()=>{view.dispose();stopImage();};body.append(dialogue);}
 }
 replay.onclick=()=>{body.hidden=false;replay.hidden=true;paint(true);};if(showHeading)host.append(heading);host.append(replay,body);if(!body.hidden){if(selection.illustrationTextOnly)paintText();else paint(!!selection.showIllustration);}return {dispose:()=>{cancelled=true;host.removeEventListener?.('error',onError,true);dispose();replacement?.dispose();}};
}

// Three moments, one scene. Partial reading survives refresh, but only seeing
// every loaded image and its caption acknowledges the complete story.
export function mountDailySequence(host,selection,{memory=dailyArtMemory}={}){
 const doc=host.ownerDocument,stops=[],ids=selection.frames.map(frame=>artIdentity(frame.art));
 const complete=()=>{if(ids.every(id=>memory.has(id)))memory.seen([selection.identity]);};
 host.className='daily-family-sequence';
 for(const frame of selection.frames){
  const figure=doc.createElement('figure'),image=doc.createElement('img'),caption=doc.createElement('figcaption');
  figure.dataset.stage=frame.id;image.alt=({pain:'久留美痛苦流泪',discover:'久留美发现柜中未动的信封',relief:'久留美望着信封，喜极而泣'})[frame.id];
  image.width=1086;image.height=1448;caption.textContent=frame.text;figure.append(image,caption);host.append(figure);
  setImage(image,frame.art.path);stops.push(observeSeenArtwork(image,{memory,identities:[artIdentity(frame.art)],visibilityTargets:[image,caption],minVisibleRatio:.9,onSeen:complete}));
 }
 return()=>stops.forEach(stop=>stop());
}
