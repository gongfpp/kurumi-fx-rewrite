// The chapter's facts are sourced; prices/choice branches are transparent game
// adaptations. This module has no free-trading engine, storage or network writes.
export const STORY_VERSION=1;
export const STORY_KEY='fx-manga-story-ch01-v1';
export const INITIAL_CAPITAL=300000;
export const LOT_SIZE=10000;
export const LEVERAGE=50;
const prices=[100,99.92,99.68,99.76,100.12,100.60];
export const STORY_STAGES=['opening','plan','entry','first','temptation','rebound','extension','review'];
const money=n=>Math.round(n*100)/100;
export function createMangaStory(runId='local') {
  return {kind:'fx-manga-story',version:STORY_VERSION,chapter:1,runId,scene:0,stage:'opening',actions:[],priceIndex:0,price:prices[0],cash:INITIAL_CAPITAL,position:null,realized:0,ledger:[],quotes:[prices[0]],riskPlan:null,branch:'canon-inspired',maxEquity:INITIAL_CAPITAL,maxDrawdown:0,closedReason:null,reflection:null};
}
export function storyUnrealized(s){return s.position?money((s.price-s.position.entry)*s.position.quantity*s.position.direction):0;}
export function storyEquity(s){return money(s.cash+storyUnrealized(s));}
export function storyMargin(s){return s.position?money(s.position.entry*s.position.quantity/LEVERAGE):0;}
export function storyAvailable(s){return money(storyEquity(s)-storyMargin(s));}
export function storyChoices(s){
  if(s.stage==='opening')return [{id:'begin',label:'翻到她的第一笔交易',detail:'第 1 话 · 约 5 分钟 · 进度独立保存'}];
  if(s.stage==='plan')return [{id:'protected',label:'先写下撤退线',detail:'开仓价反向 0.10 日元自动止损；10 枚最大计划亏损 ¥10,000'},{id:'discretionary',label:'自己盯盘，手动撤退',detail:'不设自动止损；在每个节点决定是否继续承担风险'}];
  if(s.stage==='entry')return [{id:'short10',label:'卖出 10 枚美元',detail:'原作方向与规模 · 100,000 USD · 占用保证金 ¥200,000'},{id:'short1',label:'卖出 1 枚，先试一笔',detail:'IF 小仓位 · 10,000 USD · 占用保证金 ¥20,000'},{id:'long1',label:'反过来，买入 1 枚美元',detail:'IF 反向判断 · 下跌会亏损 · 占用保证金 ¥20,000'},{id:'observe',label:'这次先不下单',detail:'IF 观望 · 不产生交易盈亏，也不占用保证金'}];
  if(['first','temptation'].includes(s.stage))return s.position?[{id:'close',label:'全部平仓，兑现结果',detail:`按当前 ${s.price.toFixed(3)} 成交；本笔盈亏 ${storyUnrealized(s)>=0?'+':''}¥${storyUnrealized(s).toLocaleString('zh-CN')}`},{id:'half',label:'先平一半',detail:'一半盈亏立即兑现，另一半继续暴露于价格变化'},{id:'hold',label:'继续持有',detail:'不兑现浮盈亏，推进到下一个剧情节点'}]:[{id:'watch',label:'空仓看下一格',detail:'账户不再随汇率变化'}];
  if(s.stage==='rebound')return s.position?[{id:'close',label:'在反弹中撤退',detail:'按当前报价全部平仓，进入首章复盘'},{id:'extend',label:'继续持仓，进入 IF 测试',detail:'进入明确标注的 IF 压力测试；原作在此撤退，后续不是原作行情'}]:[{id:'finish',label:'结束首章，看看这次选择',detail:'回顾你的仓位、风险和原作首单'}];
  if(s.stage==='extension')return s.position?[{id:'close',label:'现在平仓',detail:'接受当前损益，结束这一章'},{id:'hold',label:'仍然持有到测试结束',detail:'继续承担一次未知价格变化；测试终点会强制结算'}]:[{id:'finish',label:'查看复盘',detail:'自动止损已生效；没有剩余仓位'}];
  return [];
}
function record(s,type,detail){s.ledger.push({index:s.ledger.length+1,type,price:s.price,...detail});}
function close(s,fraction=1,reason='manual',exit=s.price){
  const p=s.position;if(!p)return;
  const quantity=p.quantity*fraction,pnl=money((exit-p.entry)*quantity*p.direction);
  s.cash=money(s.cash+pnl);s.realized=money(s.realized+pnl);
  record(s,'close',{price:exit,quantity,direction:p.direction,entry:p.entry,pnl,reason});
  p.quantity-=quantity;if(p.quantity<=0){s.position=null;s.closedReason=reason;}
}
function advance(s,index){
  const old=s.price,next=prices[index],p=s.position;
  // Execute an existing stop at its trigger on this continuous teaching path,
  // not at the endpoint. Real-world gap/slippage risk is stated in the rules.
  if(p&&s.riskPlan==='protected'){
    const stop=p.entry-p.direction*.10;
    if(p.direction===1?next<=stop&&old>stop:next>=stop&&old<stop)close(s,1,'stop',stop);
  }
  s.priceIndex=index;s.price=next;s.quotes.push(next);
  const eq=storyEquity(s);s.maxEquity=Math.max(s.maxEquity,eq);s.maxDrawdown=Math.max(s.maxDrawdown,money(s.maxEquity-eq));
}
export function chooseMangaStory(input,choice,expectedScene=input.scene){
  if(expectedScene!==input.scene)throw Error('这一格已经做过选择，请看当前剧情。');
  if(!storyChoices(input).some(x=>x.id===choice))throw Error('当前剧情没有这个选择。');
  const s=structuredClone(input),stage=s.stage;
  s.actions.push({scene:s.scene,choice});s.scene++;
  if(stage==='opening')s.stage='plan';
  else if(stage==='plan'){s.riskPlan=choice;s.stage='entry';}
  else if(stage==='entry'){
    if(choice!=='observe'){
      const quantity=choice==='short10'?100000:10000,direction=choice==='long1'?1:-1;
      s.position={quantity,direction,entry:s.price};
      if(storyAvailable(s)<0)throw Error('保证金不足。');
      record(s,'open',{quantity,direction,entry:s.price,margin:storyMargin(s)});
    }else record(s,'observe',{});
    if(choice!=='short10')s.branch='if';
    s.stage='first';advance(s,1);
  }else if(stage==='first'||stage==='temptation'){
    if(choice==='close')close(s);if(choice==='half')close(s,.5,'half');
    if(choice==='half'||choice==='close')s.branch='if';
    advance(s,stage==='first'?2:3);s.stage=stage==='first'?'temptation':'rebound';
  }else if(stage==='rebound'){
    if(choice==='extend'){s.branch='if';advance(s,4);s.stage='extension';}
    else {if(s.position)close(s);s.stage='review';}
  }else if(stage==='extension'){
    if(choice==='hold'){advance(s,5);if(s.position)close(s,1,'chapter-end');}
    else if(s.position)close(s);
    s.stage='review';
  }
  return s;
}
export function restoreMangaStory(raw){
  try{
    const saved=typeof raw==='string'?JSON.parse(raw):raw;
    if(!saved||saved.kind!=='fx-manga-story'||saved.version!==STORY_VERSION||saved.chapter!==1||typeof saved.runId!=='string'||saved.runId.length>100||!Array.isArray(saved.actions)||saved.actions.length>12)return null;
    let s=createMangaStory(saved.runId);
    for(const action of saved.actions){if(!action||action.scene!==s.scene||typeof action.choice!=='string')return null;s=chooseMangaStory(s,action.choice,action.scene);}
    // Economics are replayed from choices, never imported into the free account.
    return s;
  }catch{return null;}
}
export function storyReview(s){
  if(s.stage!=='review')return null;
  const opens=s.ledger.filter(x=>x.type==='open'),closes=s.ledger.filter(x=>x.type==='close');
  const title=!opens.length?'这一回，先旁观':s.realized>0?'把浮盈带出了市场':s.realized<0?(s.closedReason==='stop'?'撤退线真的派上了用场':'为等待付出的代价'):'不赚不亏，也是一次选择';
  return {title,profit:s.realized,equity:storyEquity(s),maxDrawdown:s.maxDrawdown,closed:!s.position,quantity:opens[0]?.quantity||0,discipline:s.riskPlan==='protected'?'你事先设置了 0.10 日元撤退线。':'你选择手动判断，没有自动止损。',lesson:!opens.length?'观望的收益是零，价格变化也没有变成账户亏损。':closes.some(x=>x.reason==='half')?'分批兑现后，剩余敞口缩小；后续每 0.01 日元的盈亏也同步缩小。':s.branch==='if'?'同一段行情，方向、仓位和退出时点会改变实际结果。':'在这条教学路径上，首单做空并于反弹处平仓得到 +24,000 日元。它不意味着下次也会盈利。'};
}
