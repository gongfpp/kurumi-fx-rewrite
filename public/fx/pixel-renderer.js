import {createApprovedMobileLayout} from './approved-mobile-layout.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';

/**
 * Pixel presentation only. All game controls remain the original live DOM nodes.
 * No engine, save store, network client, quote clock or financial state is created.
 * The host owns the reversible portal ledger and restores nodes after dispose().
 */
export function createPixelRenderer({document:doc}) {
  let root=null, portals=null, controller=null, tabs=null, originalPercent=null, originalPercentHidden=null, mobileLayout=null;
  const owned=[];
  const q=(selector,scope=root)=>scope?.querySelector(selector);
  const native=id=>doc.getElementById(id);
  const make=(tag,className,text)=>{const node=doc.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=text;owned.push(node);return node;};
  function icon(name){const node=make('span',`pixel-sprite pixel-icon-${name}`);node.setAttribute('aria-hidden','true');return node;}
  function panel(className,title,iconName){const node=make('section',`pixel-panel ${className}`),heading=make('h2','pixel-panel-title');heading.append(icon(iconName),doc.createTextNode(title));node.append(heading);return node;}
  function moveNode(node,destination){if(node&&destination)portals.moveNode(node,destination);return node;}
  function move(name,destination){portals.move(name,destination);}
  function drawer(label,className=''){const node=make('details',`pixel-drawer ${className}`),summary=make('summary','',label),content=make('div','pixel-drawer-content');node.append(summary,content);return {node,summary,content};}
  function nativeBySelector(selector){return doc.querySelector(selector);}
  function buildHeader(headerSlot){
    move('header',headerSlot);
    const top=q('.topbar'),right=q('.top-right',top);
    if(!top||!right)return;
    const mode=native('mode-open');
    if(mode){mode.classList.add('pixel-mode-button');moveNode(mode,right);}
    const source=make('span','pixel-source-status');source.setAttribute('aria-live','off');right.append(source);
    const exit=make('div','pixel-exit-region');exit.setAttribute('role','group');exit.setAttribute('aria-label','结束本局');right.append(exit);moveNode(native('retire'),exit);
    for(const id of ['leaderboard-open','achievements-open','share-open'])moveNode(native(id),right);
    const settings=drawer('设置','pixel-settings');settings.summary.prepend(icon('settings'));right.append(settings.node);
    const sound=make('section','settings-section');sound.setAttribute('aria-label','声音');sound.append(make('h3','','声音'));settings.content.append(sound);
    for(const id of ['sound','music-open'])moveNode(native(id),sound);
    for(const id of ['settings-reading','settings-progress'])moveNode(native(id),settings.content);
    const more=make('section','settings-section');more.setAttribute('aria-label','帮助与其他');more.append(make('h3','','帮助与其他'));settings.content.append(more);
    for(const id of ['help','developer-open','privacy-toggle'])moveNode(native(id),more);
    moveNode(q('.stock-game-link',top),more);
    moveNode(native('saved'),more);
  }
  function buildCharacter(container){
    move('character',container);
    const card=native('character-card');
    const name=make('h3','pixel-character-name','久留美');card?.append(name);
    const actions=make('div','pixel-life-actions');container.append(actions);
    const items=drawer('道具','pixel-items');items.summary.prepend(icon('bag'));actions.append(items.node);move('inventory',items.content);
    const lifeButton=native('life-open');if(lifeButton){moveNode(lifeButton,actions);lifeButton.classList.add('pixel-life-button');lifeButton.prepend(icon('house'));}
    const session=drawer('本局','pixel-session');container.append(session.node);move('heading',session.content);
    for(const id of ['day-review','restart'])moveNode(native(id),session.content);
    const comic=drawer('漫画','pixel-comic');comic.summary.prepend(icon('comic'));actions.append(comic.node);move('storyLibrary',comic.content);
    const voice=native('voice-library-open');if(voice){moveNode(voice,actions);voice.classList.add('pixel-voice-button');}
    const speech=q('.speech',card),voiceRow=q('.voice-caption-row',card);
    const conversation=drawer('当前对话','pixel-conversation');container.append(conversation.node);moveNode(speech,conversation.content);moveNode(voiceRow,conversation.content);
  }
  function buildMarket(container){
    move('market',container);
    const terminal=native('terminal'),select=native('market-symbol');
    if(terminal&&select){
      tabs=make('div','pixel-currency-tabs');tabs.setAttribute('role','group');tabs.setAttribute('aria-label','选择交易货币');terminal.prepend(tabs);
      select.classList.add('pixel-market-native');
      tabs.addEventListener('click',event=>{
        const button=event.target.closest('[data-pixel-market]');if(!button||button.disabled||select.disabled)return;
        const option=[...select.options].find(item=>item.value===button.dataset.pixelMarket);
        if(!option||option.disabled)return;
        select.value=option.value;
        select.dispatchEvent(new doc.defaultView.Event('change',{bubbles:true}));
        syncMarketTabs();
      },{signal:controller.signal});
    }
    const extras=drawer('行情控制与均线','pixel-market-extras');container.append(extras.node);
    for(const selector of ['.market-price','.quote-unit','.chart-controls','.ma-legend','.chart-foot'])moveNode(q(selector,terminal),extras.content);
    const caption=native('trading-clock-label');if(caption)moveNode(caption,terminal);
  }
  function buildTrade(container,positionsSlot){
    move('trade',container);
    const trade=q('.trade-card',container),order=native('order-empty');
    if(!trade)return;
    const account=make('div','pixel-account-summary');trade.prepend(account);
    moveNode(q('.account-heading',trade),account);
    const today=native('pnl-period')?.closest('.account-row');moveNode(today,account);
    const details=drawer('账户与订单明细','pixel-financial-details');positionsSlot.after(details.node);
    for(const [id,label] of [['day-return','对应收益率'],['stake-value','实际投入比例'],['leverage-value','当前杠杆'],['stop-value','止损距离']]){
      const node=id==='day-return'?(native('day-return-group')||native(id)):native(id);if(!node)continue;const row=make('div','account-row pixel-original-detail'),caption=make('span','',label);row.append(caption);details.content.append(row);moveNode(node,row);
    }
    const help=make('div','pixel-order-help');details.content.append(help);
    for(const [key,label] of [['leverage','杠杆说明'],['stop','止损说明']]){const button=q(`[data-help="${key}"]`,order);if(button){const row=make('div','pixel-help-row');row.append(make('span','',label));help.append(row);moveNode(button,row);}}
    for(const node of [...trade.children])if(node!==account&&node!==order&&node.matches('.account-row,.margin-health,#account-details'))moveNode(node,details.content);
    const fee=make('div','pixel-fee-summary');trade.append(fee);
    const feeLabel=make('span','','开仓费用 ');feeLabel.setAttribute('aria-hidden','true');fee.append(feeLabel);
    // Keep the actual fee node, not a copied number. Its original calculation is unchanged.
    moveNode(native('preview-fee'),fee);
    const debit=make('span','pixel-debit-label',' · 预计扣款 ');debit.setAttribute('aria-hidden','true');fee.append(debit);moveNode(native('preview-debit'),fee);
    for(const selector of ['.order-estimate','.liquidation-estimate','.risk-line','.emotion-pressure-panel'])moveNode(q(selector,order),details.content);
    const percent=native('percent-slider-field');
    if(percent){originalPercent=native('percent-field');if(originalPercent){originalPercentHidden=originalPercent.hidden;originalPercent.hidden=true;}percent.hidden=false;}
    const amount=native('amount-field');
    for(const selector of ['.amount-slider-heading','#amount-slider','.amount-slider-bounds'])moveNode(q(selector,amount),details.content);
    for(const id of ['amount-limit','emotion-order-rule','order-validation']){const node=native(id);if(node)moveNode(node,trade);}
    // Keep a direct, truthful available-margin display beside the percent controls.
    const available=native('available-margin');if(available){const availableRow=available.closest('.account-row');if(availableRow)moveNode(availableRow,details.content);}
  }
  function buildComments(container){
    move('comments',container);
    const comments=q('.investor-comments',container),player=native('player-comments'),list=q('.player-comment-list',player);
    if(list&&!list.closest('details')){const recent=drawer('最近留言','pixel-recent-comments');player.append(recent.node);moveNode(list,recent.content);}
    if(comments){const credits=native('comment-credits-open');if(credits)moveNode(credits,q('.investor-comments-heading',comments));}
  }
  function syncMarketTabs(){
    const select=native('market-symbol');if(!tabs||!select)return;
    const values=[...select.options].map(option=>option.value).join('|');
    if(tabs.dataset.values!==values){
      tabs.replaceChildren();for(const option of select.options){const button=make('button','pixel-currency-button',option.textContent);button.type='button';button.dataset.pixelMarket=option.value;tabs.append(button);}tabs.dataset.values=values;
    }
    for(const button of tabs.children){const option=[...select.options].find(item=>item.value===button.dataset.pixelMarket);button.disabled=select.disabled||!option||option.disabled;button.setAttribute('aria-pressed',String(button.dataset.pixelMarket===select.value));}
  }
  function render(){
    if(!root)return;
    // Match the CSS breakpoint to the viewport, but fit the usable width after
    // a classic scrollbar gutter. The two can differ by 15px on desktop.
    const availableWidth=doc.documentElement.clientWidth||doc.defaultView.innerWidth;
    root.style.setProperty('--pixel-scale',String(doc.defaultView.innerWidth>1200?Math.min(availableWidth/1536,1):1));
    syncMarketTabs();
    const mood=native('emotion-label')?.textContent?.trim()||'';root.dataset.pixelMood=mood;
    const mode=native('mode-open'),stage=native('stage-name')?.textContent||'';
    if(mode){const label=mode.textContent.replace(/[▾▼]/g,'').trim();const day=stage.match(/第\s*\d+\s*天/)?.[0]||'';mode.dataset.pixelLabel=[label,day].filter(Boolean).join('\n');}
    const disclosure=native('market-disclosure')?.textContent||'';
    const source=q('.pixel-source-status');if(source){
      const meta=native('terminal')?.dataset||{},kind=meta.marketSource;
      source.textContent=meta.marketSourceLabel||({live:'实时真实',historical:'历史真实','historical-mixed':'历史 · 含模拟',simulated:'模拟盘'}[kind]||'模拟盘');source.title=meta.marketSourceDescription||disclosure;
      if(meta.marketSourceDescription){source.setAttribute('role','button');source.setAttribute('tabindex','0');source.setAttribute('aria-label',source.textContent+'，点击查看来源说明');source.style.cursor='help';source.onclick=()=>native('beat-label')?.onclick?.();source.onkeydown=event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();source.onclick();}};}
      else{source.removeAttribute('role');source.removeAttribute('tabindex');source.removeAttribute('aria-label');source.style.cursor='';source.onclick=null;source.onkeydown=null;}
    }
    const pressure=native('emotion-pressure-panel');if(pressure&&!pressure.hidden){const drawer=pressure.closest('details');if(drawer)drawer.open=true;}
    mobileLayout?.refresh();
  }
  return {
    id:'pixel',
    mount({root:host,portals:ledger}) {
      root=host;portals=ledger;controller=new AbortController();root.id='pixel-frontend';
      doc.defaultView.addEventListener('resize',render,{signal:controller.signal});
      const header=make('div','pixel-header-slot'),notices=make('div','pixel-notices'),grid=make('div','pixel-dashboard'),footer=make('div','pixel-footer-slot');
      const character=panel('pixel-character-panel','角色与生活','heart'),market=panel('pixel-market-panel','行情','chart'),news=panel('pixel-news-panel','新闻','news'),comments=panel('pixel-comments-panel','弹幕','chat'),right=panel('pixel-trading-panel','交易','yen');
      const characterBody=make('div','pixel-character-body'),marketBody=make('div','pixel-market-body'),newsBody=make('div','pixel-news-body'),commentsBody=make('div','pixel-comments-body'),tradeBody=make('div','pixel-trade-body'),positions=make('div','pixel-positions-slot');
      character.append(characterBody);market.append(marketBody);news.append(newsBody);comments.append(commentsBody);right.append(tradeBody,positions);grid.append(character,market,news,comments,right);root.append(header,notices,grid,footer);
      buildHeader(header);for(const name of ['status','developerStatus','sceneResume'])move(name,notices);
      buildCharacter(characterBody);buildMarket(marketBody);move('news',newsBody);buildComments(commentsBody);move('positions',positions);buildTrade(tradeBody,positions);move('footer',footer);
      mobileLayout=createApprovedMobileLayout({document:doc,root});
      render();
    },
    render,
    dispose() {
      controller?.abort();
      const source=q('.pixel-source-status');if(source){source.onclick=null;source.onkeydown=null;}
      mobileLayout?.dispose();mobileLayout=null;
      const percent=native('percent-slider-field');if(percent)percent.hidden=true;
      if(originalPercent){originalPercent.hidden=originalPercentHidden;originalPercent=null;originalPercentHidden=null;}
      // Portal restoration follows this call. Do not remove a wrapper that owns live nodes.
      for(const id of ['mode-open','market-symbol','voice-library-open','life-open']){
        const node=native(id);node?.classList.remove('pixel-mode-button','pixel-market-native','pixel-voice-button','pixel-life-button');
        if(node)delete node.dataset.pixelLabel;
      }
      controller=null;
    },
    afterRestore() {
      // Native nodes have now returned to their original parents. Remove only owned decoration.
      for(const node of [...owned].reverse())node.remove();
      if(root){root.style.removeProperty('--pixel-scale');delete root.dataset.pixelMood;}
      tabs=null;root=null;portals=null;owned.length=0;
    }
  };
}
