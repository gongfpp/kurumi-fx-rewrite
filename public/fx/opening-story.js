import {MANGA_PANELS} from './manga-panels.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';

// Eight pixel-reviewed excerpts, in chapter-one order. The last page belongs
// to this game's run; none of the manga's trades or balances are imported.
export const OPENING_VERSION=1;
export const OPENING_PAGES=Object.freeze([
  Object.freeze({id:'family-loss',panelId:'family-loss',title:'2008年秋',
    text:'妈妈在 FX 中亏掉了两千万日元。四个月后，她自杀了。',next:'那时的愿望 →',
    alt:'年幼的久留美受到惊吓，画面周围传来要求归还两千万日元的喊声。',
    sourceNote:'第1话第8页。画面中的年幼久留美不是喊话者的可靠依据。官方简介（https://www.kadokawa.co.jp/topics/6121）核实：母亲在2008年秋因FX亏损2000万日元，四个月后自杀；此句交代后续背景，不声称画面正在描绘死亡。标题、摘要与翻页按钮为游戏编排。'}),
  Object.freeze({id:'recovery-vow',panelId:'recovery-vow',title:'妈妈还在的时候',
    text:'那时，久留美只想赚回两千万，让爸爸妈妈不要离婚。',next:'可 FX 是什么？ →',
    alt:'年幼的久留美在书桌前立下愿望，希望赚回两千万日元，让父母不再离婚。',
    sourceNote:'第1话第11页。图中文字是在表达赚回2000万、阻止父母离婚的愿望，不是已经实现的收益或结局。摘要与翻页按钮为游戏编排。'}),
  Object.freeze({id:'fx-question',panelId:'fx-question',title:'可 FX 是什么？',
    text:'说到底，FX 是什么东西？',next:'后来 →',
    alt:'年幼的久留美一脸困惑，追问FX究竟是什么。',
    sourceNote:'第1话网站14/46页，印刷章页12，杂志286页；相邻页确认仍是母亲在世的童年。原图可见幼年久留美的疑问；没有书桌、账户或交易。标题与摘要为游戏改编。此新增原图仅作本地候选，当前未执行上传发布。'}),
  Object.freeze({id:'after-loss',panelId:'after-loss',title:'失去妈妈之后',
    text:'妈妈不在了。久留美又气又难过：要是自己已经长大就好了。',next:'继续 →',
    alt:'枕头与飞散的填充物，伴随强烈动作线。',
    sourceNote:'裁图可见枕头与动作线，无完整人脸。相邻完整页核实是久留美丧母后的愤怒与想要长大的遗憾，不是她学习不好的自述。 标题和摘要为游戏改编；当前未执行上传发布。'}),
  Object.freeze({id:'mothers-diary',panelId:'mothers-diary',title:'2009年4月',
    text:'她发现了妈妈留下的 FX 交易日记。',next:'爸爸问起 →',
    alt:'久留美睁大眼睛，露出惊讶的神情。',
    sourceNote:'裁图仅可见久留美眼部惊讶，不显示发现对象。完整网站34/46页支持2009年4月及母亲FX交易日记，原文件名中的传单不准确。 标题和摘要为游戏改编；当前未执行上传发布。'}),
  Object.freeze({id:'quiet-reply',panelId:'quiet-reply',title:'没有说出口',
    text:'爸爸问起时，她含糊地带了过去。',next:'长大以后 →',
    alt:'久留美闭眼微笑，脸上冒汗，含糊回应。',
    sourceNote:'裁图只见久留美含糊回应，不显示父亲、交易日记或藏本动作。网站34/46页支持父亲在旁询问，35/46页才有藏日记动作；本页不描绘该动作。 标题和摘要为游戏改编；当前未执行上传发布。'}),
  Object.freeze({id:'ready',panelId:'ready',title:'2014年2月14日',
    text:'福贺久留美，20岁，大学二年级。',next:'我準備好了 →',
    alt:'成年的久留美面对屏幕，原图标注2014年2月14日、20岁、大学二年级，并写着“我準備好了”。',
    sourceNote:'第1话第36页。日期、年龄、年级均可从原图直接读到；按钮“我準備好了”沿用图中短句，其余界面为游戏编排。'}),
  Object.freeze({id:'rule',panelId:'rule',title:'第一笔交易之前',
    text:'不存在必胜法。她还是打开了账户。',next:'打开交易软件 →',
    alt:'久留美闭眼思考，原图说明FX不存在必胜法。',
    sourceNote:'第1话第38页。原图说明FX不存在必胜法；标题、摘要与按钮为游戏衔接文案，不是漫画对白。'}),
  Object.freeze({id:'first-trade',panelId:null,title:'你的这一局',
    text:'第一笔交易，还在等你。',next:'进入交易室 →',
    sourceNote:'本页为游戏原创衔接：剧情新局以30万日元起步，目标为净已实现交易利润2000万；续玩保留原有本金，不复现原作首单结果。进入交易室不会替玩家下单。'})
]);

export function openingPanel(page){return page?.panelId?MANGA_PANELS[page.panelId]:null;}
export function openingIndex(state){
  const saved=state?.openingProgress;
  if(saved?.version!==OPENING_VERSION)return 0;
  const index=OPENING_PAGES.findIndex(page=>page.id===saved.pageId);
  return index<0?0:index;
}
export function rememberOpeningPage(state,index){
  if(!Number.isInteger(index)||!OPENING_PAGES[index])return false;
  state.openingProgress={version:OPENING_VERSION,pageId:OPENING_PAGES[index].id,completed:false};
  return true;
}
export function completeOpening(state,{skipped=false}={}){
  state.openingSeen=true;
  state.openingProgress={version:OPENING_VERSION,pageId:OPENING_PAGES.at(-1).id,completed:true,skipped:!!skipped};
}

// Per-open session guards protect late clicks after a reload, a new run, mode
// switch or dismissal. Replays never write progress or touch the trading state.
export function createOpeningSession({getState,guard=()=>true,save=()=>Promise.resolve(true),onPage=()=>{},onFinish=()=>{}}){
  let owner=null,index=0,replay=false,active=false;
  const current=()=>active&&owner===getState()&&guard();
  const present=()=>{
    if(!replay)rememberOpeningPage(owner,index);
    const result={index,page:OPENING_PAGES[index],replay};
    onPage(result);
    return {...result,saved:replay?Promise.resolve(true):Promise.resolve(save())};
  };
  const finish=skipped=>{
    if(!current())return false;
    active=false;
    if(!replay){completeOpening(owner,{skipped});save();}
    onFinish({replay,skipped});return true;
  };
  return {
    open({replay:requestedReplay=false}={}){
      if(!guard())return null;
      if(active&&owner===getState())return null;
      owner=getState();replay=requestedReplay||!!owner.openingSeen;
      index=replay?0:openingIndex(owner);active=true;
      return present();
    },
    move(delta){
      if(!current()||![1,-1].includes(delta))return null;
      const next=index+delta;
      if(next<0)return null;
      if(next>=OPENING_PAGES.length){if(delta===1)finish(false);return null;}
      index=next;return present();
    },
    skip:()=>finish(true),
    dismiss(){active=false;},
    get index(){return index;},get replay(){return replay;},get active(){return active;}
  };
}
