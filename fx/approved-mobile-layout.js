import {restoreFocus} from './focus-safety.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
// Approved main-screen presentation only. The original controls, listeners,
// quote clock and save session stay owned by the app. No financial state here.
export const mobileTradingViewport=({innerWidth=0,innerHeight=0}={})=>innerWidth<=759||(innerWidth<=1024&&innerHeight<=600&&innerWidth>innerHeight);

export function createApprovedMobileLayout({document:doc,root}={}){
 const native=id=>doc.getElementById(id),q=selector=>root.querySelector(selector),owned=[],moves=[],listeners=[],labels=[];
 let active=false,disposed=false,account=null,positions=null,positionToggle=null;
 let tradeSettings=null,quickBar=null,quickLeverage=null,quickAmount=null,quickPositions=null,settingsInfo=null,settingsToggle=null;
 // Presentation preferences live only in this renderer. They never enter a save.
 let preference=null;
 const positionCount=()=>Math.max(0,Number.parseInt(native('position-count')?.textContent||'0',10)||0);
 const text=(node,value)=>{if(node&&node.textContent!==value)node.textContent=value;};
 function settingsOpen(open){tradeSettings.node.open=open;preference.settingsOpen=open;text(settingsToggle,open?'收起':'展开');quickLeverage.setAttribute('aria-expanded',String(open));quickAmount.setAttribute('aria-expanded',String(open));}
 function editSettings(target){
  if(!tradeSettings.node.open)preference.manualSettings=true;
  settingsOpen(true);target?.scrollIntoView?.({block:'nearest',behavior:'auto'});target?.focus?.({preventScroll:true});
 }
 function syncQuickTrade(){
  const count=positionCount(),leverage=(native('leverage-value')?.textContent?.trim()||'25×').split(' · ')[0],raw=String(native('order-amount')?.value||'').trim();
  const numeric=Number(raw),amount=raw&&Number.isFinite(numeric)?'¥'+numeric.toLocaleString('zh-CN',{maximumFractionDigits:2}):'设置金额';
  text(quickLeverage,leverage);text(quickAmount,amount);text(quickPositions,`持仓 ${count}`);
  quickLeverage.setAttribute('aria-label',`修改杠杆，当前 ${leverage}`);quickAmount.setAttribute('aria-label',`修改保证金，当前 ${amount}`);
  quickAmount.disabled=Boolean(native('order-amount')?.disabled);
  quickLeverage.disabled=[...root.querySelectorAll('[data-leverage]')].every(node=>node.disabled);
  quickLeverage.dataset.dailyUnlocked=String(leverage==='100×'&&root.querySelector('[data-leverage="100"]')?.dataset.dailyUnlocked==='true');
  quickBar.dataset.longAmount=String(amount.length>10);
  text(settingsInfo,`杠杆 ${leverage} · 保证金 ${amount} · 止损 ${native('stop-value')?.textContent?.trim()||'—'}`);
  if(count>0&&!preference.firstPositionSeen){
   preference.firstPositionSeen=true;
   // A successful open is observed from the app's rendered position count,
   // not from a button press. Rejections and repeated refreshes cannot fold it.
   if(!preference.manualSettings)settingsOpen(false);
   positions.node.open=true;preference.positionsOpen=true;
  }else if(count===0&&preference.previousCount>0&&!preference.manualSettings)settingsOpen(true);
  preference.previousCount=count;
  text(positionToggle,positions.node.open?'收起':'展开');
  quickPositions.setAttribute('aria-expanded',String(positions.node.open));
 }
 const make=(tag,className,text)=>{const node=doc.createElement(tag);node.className=className;if(text!==undefined)node.textContent=text;owned.push(node);return node;};
 const listen=(node,type,fn)=>{node.addEventListener(type,fn);listeners.push(()=>node.removeEventListener(type,fn));};
 const move=(node,destination)=>{if(!node||!destination||!node.parentNode)return;const anchor=doc.createComment('mobile-layout-slot');node.before(anchor);moves.push({node,anchor});destination.append(node);};
 const disclosure=(className,label)=>{const node=make('details',className),summary=make('summary','',label),content=make('div','mobile-disclosure-content');node.append(summary,content);return {node,summary,content};};
 function restore(){
  if(!active)return;
  // Remove mobile listeners before unwrapping; host then restores the pixel portals.
  listeners.splice(0).forEach(remove=>remove());
  for(const [node,value] of labels.splice(0)){if(value===null)node.removeAttribute('aria-label');else node.setAttribute('aria-label',value);}
  while(moves.length){const {node,anchor}=moves.pop();if(anchor.parentNode)anchor.before(node);anchor.remove();}
  for(const node of owned.splice(0).reverse())node.remove();
  if(account)delete account.dataset.longAmounts;
  for(const node of root.querySelectorAll('[data-mobile-amount]'))delete node.dataset.mobileAmount;
  if(native('mode-open'))delete native('mode-open').dataset.mobileLabel;
  const news=q('.pixel-news-panel');if(news)delete news.dataset.mobileNewsExtension;
  delete root.dataset.mobileLayout;active=false;account=null;positions=null;positionToggle=null;tradeSettings=null;quickBar=null;quickLeverage=null;quickAmount=null;quickPositions=null;settingsInfo=null;settingsToggle=null;
 }
 function activate(){
  active=true;root.dataset.mobileLayout='true';
  const grid=q('.pixel-dashboard'),character=q('.pixel-character-panel'),market=q('.pixel-market-panel'),trade=q('.pixel-trading-panel');
  account=q('.pixel-account-summary');move(account,grid);character.after(account);
  // Match the visual order in keyboard and screen-reader traversal as well.
  move(trade,grid);market.after(trade);

  // The position disclosure follows the chart's one existing risk/rest lane.
  positions=disclosure('mobile-position-disclosure');
  const label=make('span','mobile-position-label','持仓');positionToggle=make('span','mobile-position-toggle','展开');
  positions.summary.append(label);move(native('position-count'),positions.summary);move(native('floating'),positions.summary);positions.summary.append(positionToggle);
  trade.prepend(positions.node);move(q('.pixel-positions-slot'),positions.content);
  const count=positionCount();preference||={settingsOpen:count===0,manualSettings:false,firstPositionSeen:count>0,positionsOpen:count>0,previousCount:count};
  positions.node.id='mobile-position-disclosure';positions.node.open=preference.positionsOpen;
  listen(positions.node,'toggle',()=>{preference.positionsOpen=positions.node.open;text(positionToggle,positions.node.open?'收起':'展开');quickPositions?.setAttribute('aria-expanded',String(positions.node.open));});

  // The native pair, free period and paid-refresh choices remain distinct.
  const toolbar=make('div','mobile-market-tools');native('terminal').prepend(toolbar);
  move(q('.pair'),toolbar);move(native('quote-package-open'),toolbar);
  const refresh=disclosure('mobile-refresh-menu','刷新');toolbar.append(refresh.node);move(native('quote-refresh-options'),refresh.content);
  const chartControls=disclosure('mobile-chart-menu','图表');toolbar.append(chartControls.node);move(q('.candle-view-controls'),chartControls.content);move(q('.pixel-market-extras'),chartControls.content);
  for(const entry of [refresh,chartControls])listen(entry.node,'toggle',()=>{if(entry.node.open)for(const other of [refresh,chartControls])if(other!==entry)other.node.open=false;});

  // One editable amount and the existing live available-margin node share a row.
  const amountRow=make('div','mobile-amount-row'),amountCell=make('div','mobile-amount-cell'),availableCell=make('div','mobile-available-cell');
  const amount=native('amount-field'),input=native('order-amount');amount.prepend(amountRow);amountRow.append(amountCell,availableCell);
  const amountLabel=make('label','','保证金');amountLabel.setAttribute('for','order-amount');amountCell.append(amountLabel);move(input,amountCell);
  availableCell.append(make('span','','可用'));move(native('percent-available-margin'),availableCell);
  move(native('percent-slider-field'),amount);move(q('.amount-presets'),amount);
  const settings=q('.pixel-settings'),settingsContent=settings.querySelector('.pixel-drawer-content');
  for(const selector of ['.pixel-exit-region','#share-open','.pixel-session','.pixel-conversation','#voice-library-open','#voice-toggle'])move(q(selector),settingsContent);
  move(native('amount-random'),q('.pixel-financial-details .pixel-drawer-content'));

  // The approved chart-edge strip moves the actual order buttons. Only the
  // two numeric shortcuts are new; they reveal the existing editable controls.
  tradeSettings=disclosure('mobile-trade-settings');tradeSettings.node.id='mobile-trade-settings';
  settingsInfo=make('span','mobile-trade-settings-info');settingsToggle=make('span','mobile-trade-settings-toggle');
  tradeSettings.summary.append(make('b','','交易设置'),settingsInfo,settingsToggle);
  q('.pixel-trade-body').append(tradeSettings.node);move(q('.trade-card'),tradeSettings.content);move(q('.pixel-financial-details'),tradeSettings.content);
  quickBar=make('div','mobile-quick-trade');quickBar.id='mobile-quick-trade';quickBar.setAttribute('role','group');quickBar.setAttribute('aria-label','快捷交易');
  const parameters=make('div','mobile-quick-parameters');quickLeverage=make('button','mobile-quick-leverage');quickAmount=make('button','mobile-quick-amount');quickPositions=make('button','mobile-quick-positions');
  for(const button of [quickLeverage,quickAmount,quickPositions])button.type='button';
  for(const button of [quickLeverage,quickAmount])button.setAttribute('aria-controls','mobile-trade-settings');
  quickPositions.setAttribute('aria-controls','mobile-position-disclosure');parameters.append(quickLeverage,quickAmount);quickBar.append(parameters);move(q('.entry-actions'),quickBar);quickBar.append(quickPositions);
  const stage=native('chart')?.closest('.chart-risk-stage')||native('chart');stage.after(quickBar);
  settingsOpen(preference.settingsOpen);
  listen(tradeSettings.summary,'click',event=>{event.preventDefault();preference.manualSettings=true;settingsOpen(!tradeSettings.node.open);});
  listen(tradeSettings.node,'toggle',()=>{preference.settingsOpen=tradeSettings.node.open;text(settingsToggle,tradeSettings.node.open?'收起':'展开');});
  listen(quickLeverage,'click',()=>editSettings(root.querySelector('[data-leverage][aria-pressed="true"]')||native('leverages')?.querySelector('button')));
  listen(quickAmount,'click',()=>editSettings(native('order-amount')));
  listen(quickPositions,'click',()=>{positions.node.open=!positions.node.open;preference.positionsOpen=positions.node.open;text(positionToggle,positions.node.open?'收起':'展开');quickPositions.setAttribute('aria-expanded',String(positions.node.open));if(positions.node.open){positions.node.scrollIntoView?.({block:'nearest',behavior:'auto'});positions.summary.focus?.({preventScroll:true});}});


  // Bottom navigation opens the existing content; secondary page designs are unchanged.
  const nav=make('nav','mobile-bottom-nav');nav.setAttribute('aria-label','游戏功能');root.append(nav);
  for(const selector of ['.pixel-items','#life-open','.pixel-comic','#leaderboard-open','#achievements-open'])move(q(selector),nav);
  const more=make('button','mobile-more-button','更多');more.type='button';more.setAttribute('aria-controls','mobile-more-settings');nav.append(more);
  const oldSettingsId=settings.getAttribute('id');settings.id='mobile-more-settings';
  listeners.push(()=>{if(oldSettingsId===null)settings.removeAttribute('id');else settings.id=oldSettingsId;});
  const syncMore=()=>{more.setAttribute('aria-expanded',String(settings.open));more.setAttribute('aria-label',settings.open?'关闭更多设置':'打开更多设置');};
  const closeMore=()=>{settings.open=false;syncMore();more.focus?.({preventScroll:true});};
  listen(more,'click',()=>{if(settings.open){closeMore();return;}settings.open=true;syncMore();settings.scrollIntoView?.({block:'start',behavior:'auto'});settings.querySelector('summary')?.focus?.({preventScroll:true});});
  listen(settings,'toggle',syncMore);
  listen(root,'keydown',event=>{if(event.key==='Escape'&&settings.open){event.preventDefault();closeMore();}});
  syncMore();
  // The app-owned news list follows its native anchor and the same frontend flag.
  q('.pixel-news-panel').dataset.mobileNewsExtension='latest-three';
  for(const [node,label] of [[market,'行情与持仓'],[trade,'交易']]){labels.push([node,node.getAttribute('aria-label')]);node.setAttribute('aria-label',label);}
 }
 function refresh(){
  if(disposed)return;
  const wanted=mobileTradingViewport(doc.defaultView);
  if(wanted!==active){const focus=doc.activeElement;wanted?activate():restore();restoreFocus({node:focus},doc);}
  if(!active)return;
  syncQuickTrade();
  const mode=native('mode-open');if(mode)mode.dataset.mobileLabel=mode.textContent.replace(/[▾▼]/g,'').trim();
  for(const node of root.querySelectorAll('[data-amount-preset]')){const value=Number(node.dataset.amountPreset);if(Number.isFinite(value))node.dataset.mobileAmount=value>=1e8?`${value/1e8}亿`:value>=1e4?`${value/1e4}万`:value>=1e3?`${value/1e3}千`:String(value);}
  if(native('amount-max'))native('amount-max').dataset.mobileAmount='最大';
  // Exceptionally long totals use their own full-width row. Preserve every digit.
  account.dataset.longAmounts=String(['equity','day-pnl'].some(id=>(native(id)?.textContent||'').trim().length>11));
  q('.mobile-amount-row').dataset.longAmounts=String(String(native('order-amount')?.value||'').length>13||(native('percent-available-margin')?.textContent||'').trim().length>13);
 }
 return {refresh,get active(){return active;},get pendingMoves(){return moves.length;},dispose(){restore();disposed=true;}};
}
