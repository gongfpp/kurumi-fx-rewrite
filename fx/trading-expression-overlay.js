import {selectOriginalTradingExpression} from './trading-expression-originals.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {assetURL} from './assets.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {bindFloatingDismissal} from './floating-dismissal.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {createExpressionObserver,createExpressionGate,tradingExpressionSnapshot,expressionEvent,expressionForTrades,expressionThought} from './trading-expression-events.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';

// Try readable sizes inside existing whitespace; never move or cover game UI.
export function selectExpressionPlacement({width,height,viewportWidth,viewportHeight,context,blockers=[],anchors=[],selectAsset=selectOriginalTradingExpression}){
 const overlaps=(a,b)=>a.left<b.right+8&&a.right>b.left-8&&a.top<b.bottom+8&&a.bottom>b.top-8;
 const widths=[...new Set([width,360,320,280])].filter(w=>w>0&&w<=width).sort((a,b)=>b-a);
 for(const candidateWidth of widths){
  const asset=selectAsset({...context,maxDisplayWidth:candidateWidth,maxDisplayHeight:height});if(!asset)continue;
  const w=asset.displayWidth+4,h=asset.displayHeight+36;
  const xs=[...new Set([viewportWidth-w-8,8,...anchors.flatMap(b=>[b.left,b.right-w])].map(Math.round))].filter(x=>x>=8&&x+w<=viewportWidth-8);
  for(let y=8;y+h<=viewportHeight-8;y+=12)for(const x of xs){
   const spot={left:x,right:x+w,top:y,bottom:y+h};if(!blockers.some(b=>overlaps(spot,b)))return {asset,spot,width:candidateWidth,height};
  }
 }
 return null;
}

export function mountTradingExpression({portrait,speech,getState,canEnter=()=>true,doc=portrait.ownerDocument,now=()=>Date.now(),selectAsset=selectOriginalTradingExpression}){
 const win=doc.defaultView,observer=createExpressionObserver({now}),gate=createExpressionGate({now});
 const panel=doc.createElement('div'),img=doc.createElement('img'),close=doc.createElement('button');
 panel.id='trading-expression';panel.className='trading-expression';panel.hidden=true;panel.setAttribute('role','status');panel.setAttribute('aria-live','polite');
 img.alt='';close.type='button';close.className='trading-expression-close';close.textContent='×';close.setAttribute('aria-label','收起久留美的心声');
 const cropFrame=doc.createElement('div');cropFrame.className='trading-expression-crop';cropFrame.append(img);
 const heading=doc.createElement('span');heading.className='trading-expression-heading';heading.textContent='久留美的心声';panel.append(heading,cropFrame,close);
 // The thought panel never enters document flow or replaces the card portrait.
 doc.body.append(panel);
 let shown=null,expire=null,hesitation=null,suspended=false,seed=0,shownAsset=null,selectionSeed=0,placementFrame=null,cachedSelectionKey='',cachedSelection=null;
 function selectForSize(context,width,height){
  const key=JSON.stringify([context.event,context.direction,context.position,context.profitBasis,context.pnlSign,context.previousPnlSign,context.eventSource,context.seed,width,height]);
  if(key===cachedSelectionKey)return cachedSelection;cachedSelectionKey=key;
  return cachedSelection=selectAsset({...context,maxDisplayWidth:width,maxDisplayHeight:height});
 }
 function limits(){return {width:Math.min(440,doc.documentElement.clientWidth-40),height:Math.min(540,win.innerHeight-40)};}
 function place(){
  if(!shown)return;
  const {width,height}=limits(),vw=doc.documentElement.clientWidth,vh=win.innerHeight;
  // Whole information cards and all controls remain protected. Column edges
  // merely supply anchors for the empty space below or beside those cards.
  const rects=selector=>[...doc.querySelectorAll(selector)].filter(n=>!panel.contains(n)&&n.getClientRects().length).map(n=>n.getBoundingClientRect());
  const blockers=rects('header,.page-heading,.character-card,#terminal,.investor-comments,.position-card,.trade-card,.news,button,input,select,textarea,a,summary,[role="button"]').filter(b=>b.bottom>0&&b.top<vh);
  const anchors=rects('.game-grid > .character-card,.game-grid > .trade-card,.market-stack');
  const placement=selectExpressionPlacement({width,height,viewportWidth:vw,viewportHeight:vh,context:{...shown,seed:selectionSeed},blockers,anchors,selectAsset:context=>selectForSize(context,context.maxDisplayWidth,context.maxDisplayHeight)});
  const spot=placement?.spot;
  if(!spot){hide();return false;}
  if(placement.asset.id!==shownAsset?.id)paintAsset(placement.asset);sizeCrop(placement.width,placement.height);
  panel.style.left=spot.left+'px';panel.style.top=spot.top+'px';return true;
 }
 win.addEventListener('scroll',place,{passive:true});win.addEventListener('resize',place);
 const blocked=()=>suspended||doc.hidden||!!doc.querySelector('dialog[open]')||!tradingExpressionSnapshot(getState()).active;
 function cancelHesitation(){win.clearTimeout(hesitation);hesitation=null;}
 function hide({dismiss=false}={}){cancelHesitation();win.cancelAnimationFrame(placementFrame);placementFrame=null;win.clearTimeout(expire);shown=null;panel.hidden=true;panel.style.removeProperty('left');panel.style.removeProperty('top');if(dismiss)gate.dismiss();}
 function suspend(){suspended=true;observer.reset();hide({dismiss:true});}
 function sizeCrop(width,height){
  if(!shownAsset?.expressionCrop)return;
  const [x,y,w,h]=shownAsset.expressionCrop,[sourceWidth,sourceHeight]=shownAsset.source.dimensions;
  const scale=Math.min(1,width/w,Math.max(0,height-32)/h);
  Object.assign(cropFrame.style,{width:w*scale+'px',height:h*scale+'px'});
  Object.assign(img.style,{width:sourceWidth*scale+'px',height:sourceHeight*scale+'px',left:-x*scale+'px',top:-y*scale+'px'});
 }
 function paintAsset(asset){
  shownAsset=asset;panel.dataset.sourceKind=asset.source.kind;panel.dataset.sourceRecord=asset.source.record??'';panel.classList.toggle('has-embedded-text',!!asset.hasEmbeddedText);panel.dataset.assetId=asset.id;img.src=assetURL(asset.path);
  img.alt=`久留美的心声：${asset.textOriginal||asset.emotion}`;
 }
 function emit(e){
  if(!e||blocked()||shown)return false;
  const {width,height}=limits();
  const text=expressionThought(e.event,e.direction),asset=selectForSize({...e,seed},width,height);
  if(!asset||!text||!gate.accept(e))return false;
  selectionSeed=seed++;shown=e;panel.dataset.event=e.event;panel.dataset.assetId=asset.id;panel.dataset.direction=e.direction;panel.dataset.profitBasis=e.profitBasis;
  // The original bubble is the thought; no invented dialogue is layered on it.
  paintAsset(asset);panel.hidden=false;if(!place())return false;
  const followLayout=()=>{if(!shown)return;place();placementFrame=win.requestAnimationFrame(followLayout);};
  placementFrame=win.requestAnimationFrame(followLayout);
  expire=win.setTimeout(()=>hide(),7500);return true;
 }
 bindFloatingDismissal({element:panel,root:doc,getPresentation:()=>shown,dismiss:()=>hide({dismiss:true})});
 img.addEventListener('error',()=>hide());
 close.addEventListener('click',e=>{e.stopPropagation();hide({dismiss:true});});
 doc.addEventListener('keydown',e=>{if(e.key==='Escape'&&shown)hide({dismiss:true});});
 function refresh(){
  if(blocked()){observer.reset();hide();return;}
  const s=tradingExpressionSnapshot(getState());
  if(shown&&(shown.context!==s.context||shown.event==='entry-hesitation'&&!canEnter()||['entry-hesitation','position-opened'].includes(shown.event)&&(shown.positionKey!==s.key||shown.position!==s.position)||shown.profitBasis==='floating'&&(s.position==='flat'||shown.positionKey!==s.key||shown.pnlSign!==s.pnlSign||shown.event==='risk-warning'&&!s.atRisk)))hide();
  emit(observer.observe(s));place();
 }
 function bind(button,direction){
  const start=eventSource=>{
   cancelHesitation();if(button.disabled||blocked()||!canEnter())return;
   const initial=tradingExpressionSnapshot(getState());
   hesitation=win.setTimeout(()=>{
    hesitation=null;const current=tradingExpressionSnapshot(getState());
    if(!button.disabled&&canEnter()&&initial.context===current.context&&initial.key===current.key)emit(expressionEvent('entry-hesitation',current,{direction,eventSource}));
   },1100);
  };
  button.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')start('pointer-hover');});
  button.addEventListener('focus',()=>{if(button.matches(':focus-visible'))start('keyboard-focus');});
  const cancelIntent=()=>{cancelHesitation();if(shown?.event==='entry-hesitation')hide();};
  button.addEventListener('pointerleave',cancelIntent);button.addEventListener('pointercancel',cancelIntent);button.addEventListener('blur',cancelIntent);
  // Never preventDefault or click; the original order handler alone places orders.
  button.addEventListener('pointerdown',()=>hide());button.addEventListener('click',()=>{cancelHesitation();if(shown?.event==='entry-hesitation')hide();});
 }
 const mutation=new win.MutationObserver(()=>{if(doc.querySelector('dialog[open]')){observer.reset();hide({dismiss:true});}});
 mutation.observe(doc.body,{subtree:true,attributes:true,attributeFilter:['open']});
 win.addEventListener('blur',suspend);win.addEventListener('pagehide',suspend);
 win.addEventListener('focus',()=>{suspended=false;observer.reset();});win.addEventListener('pageshow',()=>{suspended=false;observer.reset();});
 doc.addEventListener('visibilitychange',()=>{if(doc.hidden)suspend();else{suspended=false;observer.reset();}});
 return {bind,refresh,hide,trade(trades){hide();return emit(expressionForTrades(trades,tradingExpressionSnapshot(getState())));},reset(){observer.reset();hide({dismiss:true});}};
}
