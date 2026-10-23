// Inventory presentation only. Prices and effects are executed by the engine.
import {supplyUnavailableReason,supplyUsedToday} from './daily-supplies.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {ownsTradingNotes} from './life-work.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
export const SUPPLY_CARDS=Object.freeze([
 {id:'energy',name:'魔爪能量饮料',cost:300,effect:'体力 +25',detail:'体力恢复25，情绪更亢奋，当日破限免连点。接下来四分之一交易日耗体八折，随后半个交易日耗体增加五成。每天一罐。',icon:'drink'},
 {id:'noodles',name:'泡面',cost:150,effect:'体力 +8',detail:'与外卖共用一餐位，抵扣餐费 ¥300',icon:'meal'},
 {id:'takeaway',name:'外卖',cost:1200,effect:'体力 +20',detail:'情绪向平静移动一档，与泡面共用餐位',icon:'meal'}
]);
const ICON_PATHS={drink:'M8 3h8v3l2 3v12H6V9l2-3z M8 12h8 M9 3v3h6',meal:'M3 12h18l-3 8H6z M7 8V3 M12 8V2 M17 8V3',chocolate:'M5 3h14v18H5z M5 9h14 M5 15h14 M12 3v18',sleep:'M3 9c3-3 6-3 9 0 3-3 6-3 9 0l-2 8h-5l-2-3-2 3H5z',work:'M3 7h18v14H3z M8 7V3h8v4 M3 12h18 M10 12v3h4v-3'};
export function inventoryModel({state,props={},jobs=[],effects={},availableMargin=0,canUse=false,busy=false,canUseFather=false,itemDiscovered=()=>false,itemUnlocked=()=>false}){
 const notesOwned=ownsTradingNotes(state);
 const supplies=SUPPLY_CARDS.map(spec=>({...spec,pending:false,used:supplyUsedToday(state,spec.id)||spec.id==='tradingNotes'&&state.dailySupplies?.noteUsedDay===state.day,disabled:busy||!canUse||!!supplyUnavailableReason(state,spec.id)||availableMargin<spec.cost}));
 const work=Object.values(state.workInventory||{}).filter(item=>item.id!=='memo'||notesOwned).map(item=>{
  const job=jobs.find(row=>row.id===item.jobId),effect=effects[item.id];
  return {...item,name:item.id==='memo'?'交易笔记':item.label,source:`${job?.label||'打工'} · 第 ${item.day} 天获得`,effect:effect?.label||'工作纪念品',collectibleOnly:!!effect?.collectibleOnly,active:item.id==='memo'&&notesOwned,used:item.id==='memo'&&(!!state.itemsUsed?.tradingNotes||state.dailySupplies?.noteUsedDay===state.day),disabled:busy||!canUse||!!state.itemsUsed?.tradingNotes||state.dailySupplies?.noteUsedDay===state.day};
 });
 const father=itemDiscovered(state,'father')?{...props.father,id:'father',disabled:busy||!canUseFather||!itemUnlocked(state,'father')||!!state.fatherUsed,used:!!state.fatherUsed}:null;
 const excluded=new Set([...SUPPLY_CARDS.map(x=>x.id),'father','mochiko','celebration','tradingNotes','dailyDrink','chocolate','eyeMask']);
 const unknownWork=[...new Map(jobs.filter(job=>job.rewardId&&(job.rewardId==='memo'?!notesOwned:!state.workInventory?.[job.rewardId])).map(job=>[job.rewardId,job])).values()];
 const unknown=Object.keys(props).filter(id=>!excluded.has(id)&&!itemDiscovered(state,id)).length+unknownWork.length;
 return {supplies,work,father,unknown,unknownWork,count:supplies.length+work.length+(father?1:0)};
}
export function loadInventoryStyles(doc){
 if(doc.getElementById('inventory-view-style'))return;
 const link=doc.createElement('link');link.id='inventory-view-style';link.rel='stylesheet';link.href=new URL('./inventory-view.css',import.meta.url).href;doc.head.append(link);
}
export function renderInventory({document:doc,box,model}){
 const expanded=box.querySelector('.inventory-collection')?.open||false;
 const focused=doc.activeElement?.dataset?.prop;
 const make=(tag,cls,text)=>{const node=doc.createElement(tag);if(cls)node.className=cls;if(text!==undefined)node.textContent=text;return node;};
 const icon=id=>{const node=doc.createElementNS('http://www.w3.org/2000/svg','svg');node.setAttribute('viewBox','0 0 24 24');node.setAttribute('aria-hidden','true');node.setAttribute('class','inventory-symbol');const path=doc.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d',ICON_PATHS[id]||ICON_PATHS.work);node.append(path);return node;};
 const use=(id,disabled,used,pending=false)=>{const b=make('button','inventory-use',pending?'待下次睡眠':used?'今日已用':'使用');b.type='button';b.dataset.prop=id;b.disabled=disabled;return b;};
 const section=(label,cls)=>{const node=make('section',cls);node.append(make('h3','inventory-heading',label));box.append(node);return node;};
 box.classList.add('inventory-view');box.replaceChildren();
 const supplies=section('每日补给','inventory-supplies'),grid=make('div','inventory-supply-grid');supplies.append(make('p','inventory-note','每天一次；泡面和外卖二选一。体力最高恢复至 100。'),grid);
 for(const spec of model.supplies){const card=make('article','inventory-card');card.dataset.supply=spec.id;card.append(icon(spec.icon),make('h4','',spec.name),make('strong','inventory-price',spec.cost===0?'免费':`¥${spec.cost.toLocaleString('zh-CN')}`),make('p','inventory-effect',spec.effect),make('p','inventory-detail',spec.detail),use(spec.id,spec.disabled,spec.used,spec.pending));grid.append(card);}
 const work=section('随身工作物品','inventory-work');
 if(!model.work.length)work.append(make('p','inventory-note','打工获得的物品会收在这里。'));
 for(const item of model.work){const row=make('article','inventory-work-item');row.append(icon('work'),make('h4','',item.name),make('p','inventory-detail',item.source),make('p','inventory-effect',item.effect));if(item.active)row.append(use('tradingNotes',item.disabled,item.used));else row.append(make('small','inventory-passive',item.collectibleOnly?'工作纪念物':'随身生效'));work.append(row);}
 if(model.father){const f=model.father,b=make('button','inventory-father');b.type='button';b.dataset.prop='father';b.id='father';b.disabled=f.disabled;b.append(make('b','',f.name),make('small','',f.used?'已取用':f.caption));box.append(b);}
 if(model.unknown){const details=make('details','inventory-collection');details.open=expanded;details.append(make('summary','',`未获得收藏 · ${model.unknown} 件`),make('p','inventory-note','继续打工，收集不同工作的纪念品。'));for(const job of model.unknownWork){const row=make('p','inventory-detail',`${job.rewardLabel} · ${job.label}获得`);details.append(row);}box.append(details);}
 if(focused){const replacement=[...box.querySelectorAll('[data-prop]')].find(n=>n.dataset.prop===focused&&!n.disabled);replacement?.focus({preventScroll:true});}
}
