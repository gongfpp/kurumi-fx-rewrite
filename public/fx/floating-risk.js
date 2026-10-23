import {closeAllModalOpen} from './close-all-control.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {bindFloatingDismissal} from './floating-dismissal.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {liquidationMeter} from './liquidation-meter.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';

// Existing position risk displays stay in the document; close uses a shared action gate.
// Block complete trading panels as well as controls, so click-through is only a
// second safeguard, never a reason to draw on top of a button or a position.
export const FLOATING_RISK_OBSTACLES=[
  'body > :not(main):not(dialog):not(.floating-risk)',
  'main > :not(.game-grid)', '.game-grid > *',
  '#position-card', '.trade-card', '#risk-alerts', '[data-floating-risk-avoid]',
  'button', 'a[href]', 'input', 'select', 'textarea', 'summary', 'label',
  '[role="button"]', '[role="link"]', '[tabindex]', '[onclick]', '[contenteditable="true"]'
].join(',');

const rect=value=>{
  if(!value)return null;
  const left=value.left??value.x,top=value.top??value.y;
  const right=value.right??left+value.width,bottom=value.bottom??top+value.height;
  if(![left,top,right,bottom].every(Number.isFinite)||right<left||bottom<top)return null;
  return {left,top,right,bottom,width:right-left,height:bottom-top};
};
const overlaps=(a,b,gap=0)=>a.left<b.right+gap&&a.right>b.left-gap&&a.top<b.bottom+gap&&a.bottom>b.top-gap;
const contains=(a,b)=>a.left<=b.left&&a.right>=b.right&&a.top<=b.top&&a.bottom>=b.bottom;

// Pure geometry, in layout-viewport CSS pixels (including visual viewport offsets).
// Null means the inline meter is the only safe location; never force a placement.
export function findFloatingRiskPlacement({viewport,width,height,obstacles=[],gap=12,previous=null}={}) {
  const view=rect(viewport);
  if(!view||![width,height,gap].every(Number.isFinite)||width<=0||height<=0||gap<0)return null;
  const area=rect({left:view.left+gap,top:view.top+gap,right:view.right-gap,bottom:view.bottom-gap});
  if(!area||width>area.width||height>area.height)return null;
  let blocked=[];
  for(const value of obstacles){
    const box=rect(value);if(!box)return null;
    if(box.width>0&&box.height>0&&overlaps(box,view,gap))blocked.push(box);
  }
  // Buttons inside an already protected card do not add candidate boundaries.
  blocked=blocked.filter((box,index)=>!blocked.some((other,i)=>i!==index&&contains(other,box)&&(!contains(box,other)||i<index)));
  const candidate=(left,top)=>rect({left,top,width,height});
  const safe=box=>box&&contains(area,box)&&!blocked.some(other=>overlaps(box,other,gap));
  if(previous&&safe(candidate(previous.left,previous.top)))return candidate(previous.left,previous.top);
  const xs=new Set([area.right-width,area.left]),ys=new Set([area.bottom-height,area.top]);
  for(const box of blocked){xs.add(box.right+gap);xs.add(box.left-gap-width);ys.add(box.bottom+gap);ys.add(box.top-gap-height);}
  // Prefer a low, stable corner. Obstacle edges also find interior blank columns.
  const lefts=[...xs].filter(x=>x>=area.left&&x+width<=area.right).sort((a,b)=>b-a);
  const tops=[...ys].filter(y=>y>=area.top&&y+height<=area.bottom).sort((a,b)=>b-a);
  for(const top of tops)for(const left of lefts){const box=candidate(left,top);if(safe(box))return box;}
  return null;
}

// The approved pixel banner is confined to the visible chart, never the order
// form or position cards. The legacy gutter-placement function stays unchanged.
export function findChartRiskPlacement({viewport,anchor,width,height,obstacles=[],previous=null}={}) {
  const view=rect(viewport),chart=rect(anchor);
  if(!view||!chart)return null;
  const intersection=rect({left:Math.max(view.left,chart.left),top:Math.max(view.top,chart.top),right:Math.min(view.right,chart.right),bottom:Math.min(view.bottom,chart.bottom)});
  if(!intersection)return null;
  return findFloatingRiskPlacement({viewport:intersection,width,height,obstacles,previous,gap:8});
}

export function createFloatingRisk({root=document,closeControl=null,getRiskContext=()=>null}={}) {
  const win=root.defaultView,panel=root.createElement('aside'),heading=root.createElement('span'),value=root.createElement('p');
  const icon=root.createElement('span'),badge=root.createElement('span'),title=root.createElement('span');
  const label=root.createElement('span'),message=root.createElement('span'),dismiss=root.createElement('button');
  panel.className='floating-risk';panel.hidden=true;panel.style.pointerEvents='none';
  // Existing risk readouts provide live announcements. This visual mirror does
  // not repeatedly announce every quote; its two native controls remain usable.
  panel.setAttribute('aria-label','持仓强平风险');heading.setAttribute('aria-hidden','true');value.setAttribute('aria-hidden','true');
  panel.dataset.mode='inline';
  heading.className='floating-risk-heading';icon.className='floating-risk-icon';
  icon.innerHTML='<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M22 4h4l20 36v5H2v-5Z" fill="#ffa186" stroke="#080e53" stroke-width="3"/><path d="M22 15h5l-1 15h-3Z M22 34h5v5h-5Z" fill="#080e53"/></svg>';
  badge.className='floating-risk-badge';badge.textContent='高风险';title.className='floating-risk-title';title.textContent='持仓强平距离';
  heading.append(icon,badge,title);label.className='liquidation-meter-label';message.className='floating-risk-message';message.textContent='保证金不足，请留意持仓风险。';value.append(label,message);
  panel.append(heading,value);root.body.append(panel);
  let active=false,disposed=false,frame=null,previous=null,lastView={hidden:true},context=null,episode=0,wasCritical=false,dismissed=null;
  let unbindClose=null,button=null;
  if(closeControl){
    button=root.createElement('button');button.type='button';button.className='floating-risk-close';
    button.textContent='提前全部平仓';button.setAttribute('aria-label','按当前报价提前平掉全部持仓');
    button.title='按当前报价平掉全部持仓，成交结果与仓位区全部平仓相同';
    panel.append(button);
    unbindClose=closeControl.bind(button,{canInteract:()=>!disposed&&active&&!panel.hidden&&panel.dataset.mode==='floating'&&!root.hidden&&!closeAllModalOpen(root)});
  }
  dismiss.type='button';dismiss.className='floating-risk-dismiss';dismiss.textContent='×';
  dismiss.setAttribute('aria-label','关闭本轮强平预警');dismiss.title='关闭本轮预警；新持仓或新风险出现时会再次提示';panel.append(dismiss);
  const listeners=[];
  const listen=(target,type,callback,options)=>{
    target?.addEventListener?.(type,callback,options);
    listeners.push(()=>target?.removeEventListener?.(type,callback,options));
  };
  const restoreFocus=()=>{
    if(!panel.contains(root.activeElement))return;
    for(const selector of ['#position-close-all','#long','#pixel-frontend']){
      const target=root.querySelector(selector);
      if(target&&!target.disabled&&target.getClientRects().length){target.focus?.({preventScroll:true});return;}
    }
  };
  const hide=()=>{restoreFocus();if(!panel.hidden)panel.hidden=true;panel.style.visibility='hidden';panel.dataset.mode='inline';};
  const isPixel=()=>root.body.dataset.frontend==='pixel';
  const isDismissed=()=>dismissed&&dismissed.context===context&&dismissed.episode===episode;
  const dismissWarning=()=>{if(disposed||panel.hidden)return;dismissed={context,episode};hide();closeControl?.refresh();};
  listen(dismiss,'click',dismissWarning);
  const unbindDismiss=bindFloatingDismissal({element:panel,root,getPresentation:()=>`${context}:${episode}`,dismiss:dismissWarning});
  listen(panel,'keydown',event=>{if(event.key==='Escape'){event.preventDefault?.();event.stopPropagation?.();dismissWarning();}});
  function layout(){
    if(disposed)return;
    closeControl?.refresh();
    const pixel=isPixel(),shouldShow=active&&(!pixel||lastView.tone==='critical');
    const nextTitle=pixel?'接近强平':'持仓强平距离';if(title.textContent!==nextTitle)title.textContent=nextTitle;
    if(button){const text=pixel?'一键平仓':'提前全部平仓';if(button.textContent!==text)button.textContent=text;}
    if(!shouldShow||isDismissed()||root.hidden||closeAllModalOpen(root)||!win?.getComputedStyle){hide();return;}
    const visual=win.visualViewport;
    // Never float during pinch zoom; the position card remains the safe fallback.
    if(visual&&visual.scale!==1){hide();return;}
    const width=Math.min(root.documentElement.clientWidth||win.innerWidth,visual?.width??win.innerWidth);
    const height=Math.min(root.documentElement.clientHeight||win.innerHeight,visual?.height??win.innerHeight);
    if(width<(pixel?320:700)||height<240){hide();return;}
    const viewport={left:visual?.offsetLeft??0,top:visual?.offsetTop??0,width,height};
    try {
      const anchor=pixel?(root.querySelector('#terminal .chart-risk-stage')||root.querySelector('#chart')):null;
      if(pixel&&(!anchor||!anchor.getClientRects().length)){hide();return;}
      const obstacles=[];
      for(const node of root.querySelectorAll(FLOATING_RISK_OBSTACLES)){
        if(node===panel||panel.contains(node)||!node.getClientRects().length)continue;
        // A portaled pixel root / terminal contains the permitted chart area.
        // Only these ancestors are transparent to placement. All actionable
        // descendants and explicitly protected cards still remain obstacles.
        if(anchor&&node.contains(anchor)&&!node.matches?.('#position-card, .trade-card, [data-floating-risk-avoid]'))continue;
        const box=rect(node.getBoundingClientRect());if(!box){hide();return;}
        obstacles.push(box);
      }
      if(panel.hidden)panel.hidden=false;
      // Do not rewrite a safe position to the probe origin on every quote.
      if(!previous){panel.style.left=`${viewport.left+12}px`;panel.style.top=`${viewport.top+12}px`;}
      const style=win.getComputedStyle(panel);
      if(style.position!=='fixed'||style.pointerEvents!=='none'){hide();return;}
      const insets=['Top','Right','Bottom','Left'].map(side=>parseFloat(style[`margin${side}`])||0);
      const safeViewport={left:viewport.left+insets[3],top:viewport.top+insets[0],width:width-insets[1]-insets[3],height:height-insets[0]-insets[2]};
      const anchorBox=anchor?rect(anchor.getBoundingClientRect()):null;
      const panelWidths=pixel?[Math.min(648,anchorBox.width-16,safeViewport.width-24)]:[248,216];
      let placement=null;
      for(const panelWidth of panelWidths){
        if(panelWidth<=0)continue;
        const compact=String(pixel&&panelWidth<620);if(panel.dataset.compact!==compact)panel.dataset.compact=compact;
        const desired=`${panelWidth}px`;if(panel.style.width!==desired)panel.style.width=desired;
        const size=panel.getBoundingClientRect();
        placement=pixel?findChartRiskPlacement({viewport:safeViewport,anchor:anchorBox,width:size.width,height:size.height,obstacles,previous}):findFloatingRiskPlacement({viewport:safeViewport,width:size.width,height:size.height,obstacles,previous});
        if(placement)break;
      }
      if(!placement){hide();previous=null;return;}
      const left=`${placement.left-insets[3]}px`,top=`${placement.top-insets[0]}px`;
      if(panel.style.left!==left)panel.style.left=left;if(panel.style.top!==top)panel.style.top=top;
      previous=placement;panel.style.visibility='visible';panel.dataset.mode='floating';
    }catch{hide();previous=null;}
  }
  function invalidate(){
    hide();
    if(disposed||frame!==null||!win?.requestAnimationFrame)return;
    frame=win.requestAnimationFrame(()=>{frame=null;layout();});
  }
  for(const type of ['scroll','resize','orientationchange'])listen(win,type,invalidate,{passive:true});
  listen(root,'scroll',invalidate,{capture:true,passive:true});
  for(const type of ['visibilitychange','beforetoggle','toggle','close','transitionend','animationend'])listen(root,type,invalidate,true);
  listen(root,'kurumi:frontendchange',()=>{previous=null;invalidate();});
  listen(root,'focusin',layout,true);
  listen(win?.visualViewport,'resize',invalidate,{passive:true});
  listen(win?.visualViewport,'scroll',invalidate,{passive:true});
  listen(root.fonts,'loadingdone',invalidate);
  const mutations=win?.MutationObserver?new win.MutationObserver(records=>{
    if(records.some(record=>!panel.contains(record.target)))layout();
  }):null;
  mutations?.observe(root.documentElement,{subtree:true,childList:true,characterData:true,attributes:true,
    attributeFilter:['open','hidden','class','style','aria-hidden','aria-modal','role','tabindex','disabled']});
  const resize=win?.ResizeObserver?new win.ResizeObserver(invalidate):null;
  for(const node of [root.documentElement,root.body,...root.querySelectorAll('main, .game-grid > *')])resize?.observe(node);
  return {
    element:panel,
    update(estimate){
      if(disposed)return;
      const view=liquidationMeter(estimate),nextContext=getRiskContext();
      active=!view.hidden;
      const critical=active&&view.tone==='critical';
      if(nextContext!==context||(!wasCritical&&critical)){episode++;dismissed=null;}
      context=nextContext;wasCritical=critical;lastView=view;
      if(!active){dismissed=null;previous=null;hide();return;}
      // Only text/tone changes; the panel, buttons and label nodes stay mounted.
      if(label.textContent!==view.label)label.textContent=view.label;
      const className=`liquidation-meter-value is-${view.tone}`;if(value.className!==className)value.className=className;
      if(panel.title!==view.label)panel.title=view.label;
      layout();
    },
    refresh:layout,
    destroy(){
      if(disposed)return;disposed=true;hide();
      if(frame!==null)win?.cancelAnimationFrame?.(frame);
      mutations?.disconnect();resize?.disconnect();listeners.forEach(remove=>remove());unbindDismiss();unbindClose?.();panel.remove();
    }
  };
}
