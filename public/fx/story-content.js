import {fatherTheftReceipt} from './father-theft-discovery.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {FATHER_THEFT_SCENES} from './copy/father-theft-scenes.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {ITEM_SCENES,STORY_DEFINITIONS,SCENE_LINES} from './copy/scenes.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
// Simulated market information is separate from user-approved character dialogue.
import {approvedQuote,dialogueFacts} from './dialogue.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
// USD/JPY is quoted in JPY per USD: positive = stronger USD / weaker JPY.
// Bias/delta signs are legacy metadata. New responses sample their own direction.
// Quote convention: https://www.boj.or.jp/about/education/oshiete/intl/g18.htm
// Historical market incidents inspire scenarios only; headlines, timing and moves are fictional.

export const EXTRA_NEWS_CHAINS = [
  {id:"extra_us_inflation",name:"美国通胀意外降温",bias:-1,vol:2,source:"跨洋数据台",
    lead:"美国通胀初值低于预估",leadCopy:"已公布通胀初值低于调查预估，市场正在区分能源与服务分项的贡献。",
    confirmed:["美国物价降温覆盖多个分项","完整分项显示，租金与部分服务价格涨幅低于上次公布值。"],
    reversed:["美国服务价格仍有黏性","完整数据中能源贡献较大，服务价格涨幅没有同步下降。"],
    muted:["美国物价分项表现分化","不同品类涨幅有升有降，市场对通胀持续性的判断不同。"]},
  {id:"extra_japan_wages",name:"春季工资谈判",bias:-1,vol:2,source:"东京经济观察",
    lead:"日本工资谈判首批结果公布",leadCopy:"已公布企业的加薪幅度较上次调查提高，市场关注样本覆盖范围。",
    confirmed:["日本加薪样本覆盖扩大","新增企业结果已经公布，更多行业报告了工资上调。"],
    reversed:["日本加薪样本集中于大企业","完整样本说明显示，早期调查以大企业为主，中小企业结果存在差异。"],
    muted:["日本工资调查结果存在差异","已公布企业的加薪幅度不同，尚未完成的调查不计入本次结果。"]},
  {id:"extra_japan_consumption",name:"日本消费恢复",bias:-1,vol:1,source:"街区经济简报",
    lead:"日本家庭支出初值改善",leadCopy:"已公布家庭支出初值高于前期，市场讨论促销与日常需求的贡献。",
    confirmed:["日本多个消费品类支出增加","新增分项已经公布，多个日常消费品类的支出较前期增加。"],
    reversed:["日本消费改善主要来自促销","完整调查显示促销贡献较大，可比口径下的支出增幅较小。"],
    muted:["日本消费品类表现不同","部分品类支出增加，其他品类减少，市场对消费强度的判断不同。"]},
  {id:"extra_yen_short_cover",name:"日元空头回补",bias:-1,vol:3,source:"汇市持仓观察",
    lead:"持仓报告显示部分日元空头平仓",leadCopy:"已公布持仓记录中，部分基金平掉了此前建立的日元空头。",
    confirmed:["更多基金披露日元空头平仓","追加持仓记录包含更多已完成的日元空头平仓交易。"],
    reversed:["日元空头平仓规模低于初步统计","完整样本中平仓规模较初步统计少，部分基金维持原持仓。"],
    muted:["日元持仓调整存在分歧","持仓报告同时记录了平仓与新建空头，不同基金的操作不同。"]},
  {id:"extra_safe_haven",name:"跨市场避险买盘",bias:-1,vol:3,source:"全球风险简报",
    lead:"海外股市在已结束时段走弱",leadCopy:"已结束时段的股市指数下跌，部分基金披露了缩减风险仓位的记录。",
    confirmed:["多个市场公布基金减仓记录","已公布记录显示，多家基金在不同市场缩减了持仓。"],
    reversed:["海外股市收复此前跌幅","最新已结束时段中，相关股指收复此前跌幅，基金操作仍有差异。"],
    muted:["股债市场表现不同","已记录时段内股债走势不一，投资者对风险程度的判断不同。"]},
  {id:"extra_repatriation",name:"海外资金回流",bias:-1,vol:1,source:"企业资金台",
    lead:"日本企业披露海外收益结汇",leadCopy:"企业确认已将部分海外收益兑换为日元，披露的是已完成交易。",
    confirmed:["日本企业追加结汇记录公布","新增记录包含企业分批完成的结汇交易。"],
    reversed:["日本企业确认本批结汇结束","企业已完成本批收益结汇，没有公布新的换汇交易。"],
    muted:["日本企业资金收付相抵","已公布的收益结汇与进口付款规模接近，不同企业的收付有差异。"]},
  {id:"extra_japan_bond_yield",name:"日本长债收益率抬升",bias:-1,vol:2,source:"东京债市快讯",
    lead:"日本长债收益率在已结束时段抬升",leadCopy:"已记录时段的日本长债收益率抬升，市场对供需与政策因素的解释不同。",
    confirmed:["日本多期限债券收益率抬升","已公布行情中，多个期限的债券收益率高于上一时段。"],
    reversed:["日本长债收益率在最新时段回落","最新已结束时段的债券买入增加，长债收益率低于上一时段。"],
    muted:["日本各期限债券表现不一","不同期限债券的收益率变化不同，市场对本次变动的原因有分歧。"]},
  {id:"extra_us_growth_slow",name:"美国增长放缓",bias:-1,vol:2,source:"纽约经济观察",
    lead:"美国企业订单调查初值下降",leadCopy:"已公布订单初值低于前期，市场关注行业覆盖与家庭支出的差别。",
    confirmed:["美国更多行业订单调查下降","新增行业结果已经公布，多个行业的订单指标低于前期。"],
    reversed:["美国订单调查初值上修","更新样本修订了此前初值，订单指标高于初步公布结果。"],
    muted:["美国增长分项表现不同","订单与家庭支出指标表现不同，市场对需求强度的解释有分歧。"]},
  {id:"extra_carry_unwind",name:"利差交易减仓",bias:-1,vol:3,source:"跨境资金观察",
    lead:"日元融资交易披露减仓记录",leadCopy:"已公布记录包含融资头寸的减仓与偿还，交易者讨论其规模。",
    confirmed:["更多日元融资头寸完成减仓","追加记录显示更多融资头寸已退出，均为已完成交易。"],
    reversed:["本批日元融资减仓交易结束","机构确认本批减仓与偿还已完成，没有公布新的执行计划。"],
    muted:["日元融资头寸双向调整","已公布记录同时包含减仓与新建仓，不同机构的操作有分歧。"]},
  {id:"extra_us_retail",name:"美国零售走强",bias:1,vol:2,source:"纽约数据简报",
    lead:"美国零售初值高于预估",leadCopy:"已公布零售初值高于调查预估，市场关注增长品类与可比口径。",
    confirmed:["美国零售增长覆盖多个品类","完整分项中，多个品类的零售额较前期增加。"],
    reversed:["美国零售初值被下修","统计部门公布修订结果，可比口径的增幅低于初值。"],
    muted:["美国零售与消费调查分化","两份已公布调查的结果不同，市场对家庭需求的判断有分歧。"]},
  {id:"extra_import_energy",name:"进口能源付款",bias:1,vol:1,source:"贸易资金观察",
    lead:"日本进口商披露能源付款记录",leadCopy:"进口商已购入美元支付能源账款，披露记录不包含新的付款安排。",
    confirmed:["日本进口商公布追加付款记录","新增记录包含本批分次完成的美元购汇与能源付款。"],
    reversed:["日本本批能源付款已经完成","进口商确认本批账款已付清，没有公布新增购汇记录。"],
    muted:["日本进出口换汇规模接近","已公布的进口购汇与出口结汇规模接近，企业之间仍有差异。"]},
  {id:"extra_japan_output",name:"日本工业调查转弱",bias:1,vol:2,source:"产业经济台",
    lead:"日本制造业订单调查下降",leadCopy:"已公布订单指标低于前期，市场关注停工与库存因素的贡献。",
    confirmed:["日本多个行业订单与投资减少","完整调查中，多个行业报告了订单与投资减少。"],
    reversed:["日本订单下降与短暂停工有关","完整调查说明列出短暂停工因素，相关产线已经恢复。"],
    muted:["日本工业行业表现分化","部分行业产出改善，其他行业仍有库存压力，市场看法不一。"]},
  {id:"extra_us_treasury",name:"美国债券拍卖",bias:1,vol:2,source:"纽约债市观察",
    lead:"美国债券拍卖结果公布",leadCopy:"本次拍卖需求低于前次，已结束时段内美债收益率抬升。",
    confirmed:["美债收益率在下一已结束时段抬升","已公布行情中，美债收益率高于拍卖结束时段。"],
    reversed:["美债最新时段买入记录增加","最新已结束时段内债券买入增加，收益率低于上一时段。"],
    muted:["美债市场正在消化拍卖结果","不同期限债券表现不一，交易者对拍卖需求的解释不同。"]},
  {id:"extra_risk_rebound",name:"风险偏好回升",bias:1,vol:2,source:"全球市场观察",
    lead:"海外股市在已结束时段回升",leadCopy:"已记录股指高于上一时段，部分基金披露了风险仓位调整。",
    confirmed:["海外股市上涨覆盖更多板块","已结束时段中，更多板块指数高于上一时段。"],
    reversed:["海外股市尾盘收跌","本次尾盘收盘值低于此前时段，基金调整记录存在差异。"],
    muted:["海外风险资产涨跌交错","已记录时段内不同资产表现不一，市场对风险程度的判断不同。"]},
  {id:"extra_rate_patience",name:"日本政策耐心论",bias:1,vol:2,source:"政策记者会",
    lead:"日本政策声明强调观察需求",leadCopy:"已公布声明讨论了需求与增长风险，没有宣布新的利率调整。",
    confirmed:["日本政策记者会强调增长风险","已结束记者会中，官员重点讨论了增长风险与当前政策理由。"],
    reversed:["日本完整声明列出调整条件","完整声明列出评估政策的条件，没有宣布具体调整日期。"],
    muted:["日本政策讨论存在分歧","已公布讨论中，对需求与物价的判断不同，声明没有给出时间表。"]},
  {id:"extra_outbound_funds",name:"海外资产配置",bias:1,vol:1,source:"长期资金简报",
    lead:"日本机构披露海外资产配置",leadCopy:"机构公布了已执行的海外资产配置与换汇记录。",
    confirmed:["日本机构公布分批配置记录","追加记录包含本批已完成的分次换汇与海外资产购买。"],
    reversed:["日本机构披露汇率对冲交易","机构确认已买入日元进行汇率对冲，公布的是已执行交易。"],
    muted:["日本机构海外配置与对冲并存","已公布记录同时包含海外配置与对冲，不同机构的安排不同。"]},
  {id:"extra_us_wages",name:"美国薪资压力",bias:1,vol:3,source:"劳动力数据台",
    lead:"美国薪资初值高于预估",leadCopy:"已公布薪资初值高于调查预估，市场关注行业构成与样本变化。",
    confirmed:["美国多个行业薪资增幅提高","完整分项中，多个行业的薪资增幅高于前期。"],
    reversed:["美国薪资初值受样本构成影响","可比样本的薪资增幅低于初值，调查说明列出了行业构成差异。"],
    muted:["美国薪资与就业分项不同","两项已公布指标表现不同，市场对劳动力状况的判断有分歧。"]},
  {id:"extra_quiet_session",name:"清淡时段美元买盘",bias:1,vol:2,source:"夜间成交观察",
    lead:"清淡时段美元买入记录集中",leadCopy:"已结束时段内，部分机构集中买入美元；公开记录没有覆盖全部参与者。",
    confirmed:["活跃时段公布新的美元买入记录","最新已结束时段的记录包含追加美元买入，机构之间操作不同。"],
    reversed:["最新时段美元买入规模减少","已公布的可比记录中，美元买入规模低于前一时段。"],
    muted:["美元买入与卖出记录接近","已公布的买入与卖出规模接近，参与者对流动性的判断不同。"]}
];

export const BLACK_SWANS = [
  {id:"peg_break",name:"汇率安排突变",title:"突发｜海外央行意外撤销汇率安排",
    copy:"海外央行已撤销原有汇率安排，机构对政策变化的解释存在分歧。",delta:-0.032,speaker:"久留美"},
  {id:"bank_failure",name:"大型机构融资中断",title:"突发｜海外金融机构暂停正常融资",
    copy:"机构已暂停正常融资并披露紧急减仓，市场正在核对相关融资安排。",delta:0.04,speaker:"安子"},
  {id:"pandemic_emergency",name:"公共卫生紧急措施",title:"突发｜多国公布公共卫生紧急措施",
    copy:"多国已公布公共卫生紧急措施，机构对经营与融资影响的判断不同。",delta:-0.027,speaker:"萌智子"},
  {id:"gilt_spiral",name:"债市连锁平仓",title:"突发｜海外债市出现连锁卖盘",
    copy:"海外债市已出现连锁卖盘，机构正在核对已发生的平仓与融资记录。",delta:0.023,speaker:"安子"},
  {id:"liquidity_freeze",name:"汇市流动性冲击",title:"突发｜短期融资紧张，USD/JPY 出现跳价",
    copy:"交易对手已缩减报价，部分融资安排暂停，市场参与者对流动性的判断不同。",delta:-0.018,speaker:"久留美"},
  {id:"policy_surprise",name:"政策意外转向",title:"突发｜日本政策会议给出意外宽松措施",
    copy:"日本政策会议已公布宽松措施，完整声明同时列出增长与物价的评估。",delta:0.035,speaker:"久留美"},
  {id:"referendum_night",name:"计票结果逆转",title:"突发｜海外公投结果逆转市场预期",
    copy:"已公布计票结果与会前调查不同，市场参与者正在核对最终结果。",delta:-0.024,speaker:"芽吹"},
  {id:"commodity_dislocation",name:"交割合约异价",title:"突发｜临近交割的商品合约出现异常报价",
    copy:"临近交割的商品合约已出现异常报价，交易所正在核对交割与持仓记录。",delta:0.015,speaker:"久留美"}
];

export const STORIES=STORY_DEFINITIONS;
export function getStory(s,key){
  const base=STORIES[key];if(!base)return null;
  const f=dialogueFacts(s),family=s.family||{};
  if(key==='fatherUnlock'&&(s.fatherUsed||f.equity>=30000))return null;
  if(key==='fatherFound'&&(!s.fatherUsed||!family.outstanding||family.informed||family.discovered))return null;
  if(key==='repayPartial'&&(!family.lastRepayment||!(family.outstanding>0)))return null;
  if(key==='repayFull'&&(!family.lastRepayment||family.outstanding!==0||family.lastRepayment.outstanding!==0))return null;
  if(key==='recovery'&&!s.story?.flags?.receiptWinDay)return null;
  const state=['fatherFound','fatherUnlock'].includes(key)?{...s,storyContext:key}:s;
  const lines=ids=>ids.map(id=>approvedQuote(id,state)).filter(Boolean).map(q=>[q.from,q.text]);
  const event={...base,key,lines:[],choices:base.choices.map(c=>({...c,lines:[]}))};
  if(ITEM_SCENES[key]){const scene=ITEM_SCENES[key];event.original=true;event.lines=scene.lines.map(line=>[...line]);for(const c of event.choices)c.lines=(scene.choices[c.id]||[]).map(line=>[...line]);}
  if(key==='fatherUnlock'){
    event.lines=lines(['V2-E03-01']);
    event.choices.find(c=>c.id==='look_at_savings').lines=lines(['V2-E03-02']);

  }
  if(key==='fatherDiscover'){event.original=true;event.lines=SCENE_LINES.fatherDiscover.map(line=>[...line]);}
  if(key==='quietNight'){event.original=true;event.lines=SCENE_LINES.quietNight.map(line=>[...line]);}
  if(key==='fatherFound'){
    const receipt=fatherTheftReceipt(s),script=FATHER_THEFT_SCENES[receipt?.sceneId];
    if(script){event.original=false;event.title=script.title;event.lines=script.lines.map(line=>[...line]);event.theftDiscoveryId=receipt.id;event.theftSceneId=receipt.sceneId;}
    else event.lines=lines(['V2-E04-01','V2-E04-03']);
  }
  if(key==='repayPartial')event.lines=lines(['V2-E05-05','V2-E05-01','V2-E05-03']);
  if(key==='repayFull')event.lines=lines(['V2-E06-01']);
  return event;
}
