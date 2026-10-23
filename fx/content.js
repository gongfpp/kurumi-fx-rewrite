import {EXTRA_NEWS_CHAINS} from './story-content.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
// Simulated market information and functional UI copy, separate from approved character dialogue.
// Bias is retained only for frozen legacy generation. New simulations sample
// market responses independently; visible copy describes published facts only.
const BASE_NEWS_CHAINS = [
  {id:"boj",name:"日本央行会议",bias:-1,vol:2,source:"东京政策快讯",
    lead:"日本央行会议讨论工资与物价",leadCopy:"已公布会议摘要讨论了工资与物价循环，委员对需求强度的判断有分歧。",
    confirmed:["日本央行上调政策利率","央行公布上调政策利率的决定，声明列出工资与物价的变化。"],
    reversed:["日本央行维持政策利率","央行公布维持利率的决定，完整声明强调仍需观察需求数据。"],
    muted:["日本央行委员意见不一","委员对需求强度的判断不同，声明没有给出下一次调整日期。"]},
  {id:"cpi",name:"日本物价数据",bias:-1,vol:2,source:"东京经济数据",
    lead:"日本消费价格初值高于预估",leadCopy:"已公布的消费价格初值高于调查预估，市场讨论能源与服务分项的差别。",
    confirmed:["日本服务价格涨幅扩大","服务价格分项已经公布，多个品类的涨幅高于上次调查。"],
    reversed:["日本物价细项弱于初步解读","完整分项显示能源贡献较大，剔除短期因素后的涨幅低于初步解读。"],
    muted:["日本物价分项表现不一","商品与服务价格变化不一，交易者对价格压力的持续性看法不同。"]},
  {id:"intervention",name:"财务省汇市发言",bias:-1,vol:3,source:"东京汇市快讯",
    lead:"财务省就近期汇率变动发表意见",leadCopy:"财务省表示关注近期汇率变动，官员没有确认已采取新的交易措施。",
    confirmed:["财务省确认买入日元","财务省确认已执行买入日元的交易，市场正在核对公布的规模与时段。"],
    reversed:["财务省未确认市场干预传闻","官员回应了市场传闻，但没有确认发生外汇干预。"],
    muted:["财务省重申关注汇率变动","官员重复此前立场，本次发言没有公布新措施。"]},
  {id:"payroll",name:"美国就业数据",bias:1,vol:3,source:"纽约经济数据",
    lead:"美国新增就业初值高于预估",leadCopy:"新增岗位初值高于调查预估，薪资与就业参与率的差异受到关注。",
    confirmed:["美国就业细项已经公布","本次数据中，新增岗位与平均薪资均高于上次公布值。"],
    reversed:["美国前期新增岗位数据下修","统计部门下修了前期新增岗位，修订值低于此前公布结果。"],
    muted:["美国就业分项表现不一","新增岗位、薪资与参与率表现不同，市场对劳动力紧张程度有分歧。"]},
  {id:"fed",name:"美日利差",bias:1,vol:2,source:"纽约政策快讯",
    lead:"美债收益率在已结束时段抬升",leadCopy:"已记录时段内美债收益率抬升，交易者对通胀与增长因素的权重判断不同。",
    confirmed:["美国官员强调当前通胀压力","已公布讲话重点讨论了通胀压力与维持当前政策的理由。"],
    reversed:["美国官员完整讲话谈及增长风险","完整讲话同时讨论了增长风险，初步摘要未包含这些段落。"],
    muted:["美国政策讨论存在分歧","不同官员对通胀与增长风险的判断不一，尚无新的利率决定。"]},
  {id:"export",name:"东京企业结汇",bias:-1,vol:1,source:"东京市场观察",
    lead:"日本出口企业公布结汇需求",leadCopy:"企业披露已将部分美元收入换为日元，交易者讨论本次资金收付的规模。",
    confirmed:["日本企业披露追加结汇记录","企业公布的记录包含追加结汇交易，均属于已执行的资金收付。"],
    reversed:["日本企业本次结汇已经结束","企业确认本批结汇交易已完成，没有披露新的执行安排。"],
    muted:["日本企业换汇收付大致相抵","已公布的结汇与购汇规模接近，企业之间的需求仍有差异。"]}
];

export const NEWS_CHAINS = [...BASE_NEWS_CHAINS,...EXTRA_NEWS_CHAINS];
export const MOODS = {
  'trauma-pain':['崩溃','shocked'],'trauma-frozen':['重创','blank'],numb:['麻木','blank'],recovering:['恢复中','blank'],
  hopeful:['期待','hopeful'],focused:['专注','focused'],irritated:['烦躁','irritated'],stunned:['震惊','stunned'],exhausted:['疲惫','exhausted'],guilty:['内疚','guilty'],embarrassed:['局促','embarrassed'],lonely:['落寞','lonely'],determined:['坚定','determined'],warm:['温暖','warm'],
  calm:['平静','calm'],smug:['得意','smug'],nervous:['紧张','nervous'],anxious:['焦虑','anxious'],
  ecstatic:['极度亢奋','exhilarated'],despair:['绝望','shocked'],regretful:['懊恼','regretful'],relieved:['如释重负','relieved']
};

export const CANON_QUOTE = {id:'V2-HOPE-01',text:'两千万而已，我会轻松赚回来的！',source:'用户附译；日语原句见动画官方简介',url:'https://fxkurumi-info.com/'};
export {PROPS} from './copy/items.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
