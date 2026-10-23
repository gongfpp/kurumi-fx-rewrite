// Presentation only. The owning picker keeps the opening context and final guard.
// A category shows one set of choices. Selection stays local until the action.
export const mobileLifeViewport=doc=>{
 const {innerWidth=1536,innerHeight=1024}=doc.defaultView||{};
 return doc.body.dataset.frontend==='pixel'&&(innerWidth<=759||(innerWidth<=1024&&innerHeight<=600&&innerWidth>innerHeight));
};
const GROUPS=Object.freeze({
 friend:{label:'找朋友聊',hint:'选择朋友',icon:'chat',action:'开始聊天'},
 work:{label:'打工',hint:'选择工作',icon:'work',action:'开始打工'},
 relax:{label:'出去散心',hint:'选择地点',icon:'leaf',action:'出发'},
 dinner:{label:'请客吃饭',hint:'选择请客安排',icon:'dinner',action:'请客并收盘'}
});
const ART_IDS=new Set(['mochiko','yasuko','convenience','cafe','bookstore','shrine','river','park']);
const number=n=>n.toLocaleString('zh-CN',{maximumFractionDigits:2});
export function renderMobileLifeCharacter({document:doc,body,model,make,icon}){
 if(!model.character)return;
 const sprite=name=>{const node=make('span',`life-mobile-sprite life-mobile-sprite-${name}`);node.setAttribute('aria-hidden','true');return node;};
 const character=make('section','life-mobile-character');character.setAttribute('aria-label','久留美当前状态');
 const identity=make('div','life-mobile-identity');identity.append(sprite('kurumi'),make('strong','','久留美'));
 const stats=make('div','life-mobile-stats'),emotion=make('p','life-mobile-emotion');emotion.append(icon('chat'),make('span','','情绪'),make('strong','',model.character.emotion||'—'));stats.append(emotion);
 for(const [key,label] of [['sanity','心理承受力'],['stamina','体力']]){
  const value=model.character[key];if(!Number.isFinite(value))continue;
  const row=make('div',`life-mobile-stat life-mobile-${key}`),caption=make('p','');caption.append(sprite(key),make('span','',label),make('strong','',String(Math.round(value))));
  const meter=make('div','life-mobile-meter');meter.setAttribute('role','meter');meter.setAttribute('aria-label',label);meter.setAttribute('aria-valuemin','0');meter.setAttribute('aria-valuemax','100');meter.setAttribute('aria-valuenow',String(Math.max(0,Math.min(100,value))));
  const fill=make('span','');fill.style.width=`${Math.max(0,Math.min(100,value))}%`;meter.append(fill);row.append(caption,meter);stats.append(row);
 }
 character.append(identity,stats);body.append(character);
}
export function renderMobileLifeChoices({document:doc,body,actionDock,category,model,selections,busy,stale,optionsOf,make,button,icon,actionButton}){
 const status=model.status||{},group=GROUPS[category];if(!group)return;
 const sprite=name=>{const node=make('span',`life-mobile-sprite life-mobile-sprite-${name}`);node.setAttribute('aria-hidden','true');return node;};
 const section=make('section',`life-mobile-section life-mobile-${category}`);section.dataset.lifeGroup=category;
 const heading=make('h3','life-mobile-heading');heading.id=`life-mobile-${category}-heading`;heading.append(icon(group.icon),doc.createTextNode(group.hint));section.append(heading);
 const options=optionsOf(model,category),grid=make('div','life-mobile-options');grid.setAttribute('role','group');grid.setAttribute('aria-labelledby',heading.id);
 if(!options.some(option=>option.id===selections[category]))selections[category]=(options.find(option=>option.enabled)||options[0])?.id;
 for(const option of options){
  const card=button('life-mobile-option');card.dataset.lifeSelect=option.id;card.dataset.lifeSelectCategory=category;
  card.setAttribute('aria-pressed',String(option.id===selections[category]));card.disabled=busy||stale||!status.enabled||!option.enabled;
  const art=make('span','life-mobile-art');
  if(ART_IDS.has(option.id))art.append(sprite(option.id));else{art.classList.add('life-mobile-art-symbol');art.append(icon(group.icon));}
  card.append(art,make('strong','life-mobile-option-label',option.label));
  const reason=option.reason||status.reason;
  if(!option.enabled&&reason){card.append(make('span','life-mobile-reason',reason));card.title=reason;}
  grid.append(card);
 }
 section.append(grid);body.append(section);
 if(!options.length)section.append(make('p','life-mobile-reason',category==='friend'?'暂时还没有相识的朋友。':'暂时没有可选的安排。'));
 const selected=options.find(option=>option.id===selections[category]);
 const summary=make('div','life-mobile-selection');summary.setAttribute('aria-live','polite');summary.setAttribute('aria-atomic','true');summary.append(make('strong','life-mobile-selected-label',selected?`已选：${selected.label}`:'尚未选择'));
 if(category==='work'&&Number.isFinite(selected?.income)){
  const income=make('p','life-mobile-income');income.append(sprite('coins'),make('span','','本次预计收入'),make('strong','',`¥${number(selected.income)}`));summary.append(income);
  if(Number.isFinite(selected.staminaCost))summary.append(make('p','life-mobile-work-details',`体力 −${selected.staminaCost} · 压力 ${selected.stressDelta>0?'+':''}${selected.stressDelta||0}`));
  if(selected.partialWork&&Number.isFinite(selected.baseIncome))summary.append(make('p','life-mobile-work-details',`整份工作 ¥${number(selected.baseIncome)} · 需${selected.requiredStamina}体力`));
  if(selected.rewardLabel)summary.append(make('p','life-mobile-work-reward',`初次完成获得：${selected.rewardLabel}`));
 }
 if((category==='relax'||category==='dinner')&&selected){
  if(Number.isFinite(selected.cost))summary.append(make('p','life-mobile-income',`费用 ¥${number(selected.cost)}`));
  if(Number.isFinite(selected.staminaRecovery))summary.append(make('p','life-mobile-work-details',`体力 +${selected.staminaRecovery} · 压力 ${selected.stressDelta>0?'+':''}${selected.stressDelta||0}`));
 }
 const reason=selected?.reason||status.reason,disabled=busy||stale||!status.enabled||!selected?.enabled;
 const submit=actionButton(group.action,{lifeChoose:selected?.id||'',lifeCategory:category},disabled,reason);
 submit.setAttribute('aria-label',selected?`${group.action}：${selected.label}，自动平仓并进入结算`:group.action);
 const host=actionDock||section;host.append(summary,submit);host.hidden=false;
}
