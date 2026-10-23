import {COMPLETE_ORDER_HELP} from './copy/complete-order-help.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {downloadResults} from './results-report.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {AI_ROAST_VOICES,buildAIRoastPrompt} from './ai-roast-prompts.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
const amount=v=>Number.isFinite(v)?`${v<0?'−':''}¥${Math.abs(v).toLocaleString('zh-CN',{maximumFractionDigits:2})}`:'未知';
const signed=v=>Number.isFinite(v)?`${v>0?'+':''}${amount(v)}`:'未知';
const percent=v=>Number.isFinite(v)?`${(v*100).toFixed(2)}%`:'—';
const count=v=>Number.isFinite(v)?String(v):'未知';
export function mountResultsReport(root,report,options={}){
 const doc=root.ownerDocument||globalThis.document,p=report.performance,a=report.account,f=report.fees;
 const make=(tag,text,className)=>{const el=doc.createElement(tag);if(text!==undefined)el.textContent=text;if(className)el.className=className;return el;};
 root.replaceChildren();root.className='results-report';root.dataset.schemaVersion=report.schemaVersion;
 root.append(make('h3','我的战绩'));
 const hero=make('div',undefined,'results-hero'),rate=make('div'),net=make('div');
 rate.append(make('span','累计已实现交易收益率'),make('strong',percent(p.returnRate),p.returnRate<0?'negative':'positive'));
 net.append(make('span','扣债净资产'),make('strong',amount(a.netAssets),a.netAssets<0?'negative':'positive'));hero.append(rate,net);root.append(hero);
 const grid=make('dl',undefined,'results-grid');
 const entries=[['初始本金',amount(p.initialCapital)],['净交易盈亏',signed(p.realizedNetTradingPnl)],['账户总资产',amount(a.nominalAssets)],['欠父亲',amount(a.fatherDebt)],['欠网贷（含未付利息）',amount(a.networkDebt)],['未还债务合计',amount(a.totalDebt)],['已完整平仓订单',count(p.closedOrders)],['完整订单胜率',Number.isFinite(p.winRate)?percent(p.winRate):'未知'],['最大整单盈利',signed(p.maxOrderProfit)],['最大整单亏损',signed(p.maxOrderLoss)],['最大交易权益回撤',percent(p.maxDrawdown)],['强平订单',count(p.liquidatedOrders)],['止损订单',count(p.stopLossOrders)],['最高使用杠杆',p.maxLeverage===null?'未知':`${p.maxLeverage}×`],['当前浮动盈亏',signed(a.unrealized)],['已存活交易日',count(p.daysSurvived)]];
 for(const [label,value] of entries){const cell=make('div');cell.append(make('dt',label),make('dd',value));grid.append(cell);}root.append(grid);
 const fees=make('details',undefined,'results-details');fees.append(make('summary','费用与统计口径'),make('p','收益率按初始本金计算，使用借款后亏损可能超过 100%。'),make('p',COMPLETE_ORDER_HELP.winRate));
 for(const [label,value] of [['累计交易手续费（已计入净盈亏）',f.trading],['已付网贷利息',f.interestPaid],['累计未付、计入债务利息',f.interestAccrued],['已付生活费',f.living],['可选消费',f.consumption]])fees.append(make('p',`${label}：${amount(value)}`));
 if(report.income?.work)fees.append(make('p',`累计工作收入：${amount(report.income.work)}`));
 if(report.income?.lotteryIncome>0)fees.append(make('p',`彩票税前奖金：${amount(report.income.lotteryIncome)}`));
 if(report.income?.cheatLotteryIncome>0)fees.append(make('p',`暗号彩票税前奖金：${amount(report.income.cheatLotteryIncome)}`));
 fees.append(make('p',COMPLETE_ORDER_HELP.extremes),make('p',report.definitions.maxDrawdown));root.append(fees);
 if(report.specialRecords.length){const section=make('section',undefined,'results-special');section.append(make('h4','特别记录'));const list=make('ul');for(const record of report.specialRecords)list.append(make('li',`${record.label}：${['negative-net-assets','loss-over-initial'].includes(record.id)?amount(record.value):record.value+(record.id==='max-leverage'?'×':'')}`));section.append(list);root.append(section);}
 for(const warning of report.dataQuality.warnings)root.append(make('p',warning,'results-warning'));
 const actions=make('div',undefined,'results-actions'),download=make('button','下载本局 JSON','primary'),copy=make('button','复制 AI 锐评提示词','secondary');download.type=copy.type='button';download.dataset.resultsAction='download';copy.dataset.resultsAction='copy-prompt';
 const voiceLabel=make('label','吐槽口吻 ','results-voice'),voice=make('select');voice.setAttribute('aria-label','AI 吐槽口吻');voice.dataset.resultsAction='roast-voice';
 for(const item of AI_ROAST_VOICES){const option=make('option',item.label);option.value=item.id;voice.append(option);}voice.value='tieba';voiceLabel.append(voice);
 const status=make('p','','small-print');status.setAttribute('role','status');status.setAttribute('aria-live','polite');
 const promptBox=make('details',undefined,'results-details'),text=make('textarea');promptBox.append(make('summary','查看 / 手动复制提示词'));text.value=buildAIRoastPrompt(voice.value);text.readOnly=true;text.rows=9;text.setAttribute('aria-label','AI 游戏吐槽提示词');promptBox.append(text);
 voice.onchange=()=>{text.value=buildAIRoastPrompt(voice.value);status.textContent='口吻已切换，复制后配合本局 JSON 使用。';};
 download.onclick=()=>{try{const result=(options.download||downloadResults)(report);status.textContent=`已生成 ${result.filename}，请查看浏览器下载。`;}catch(error){status.textContent=error?.message||'下载失败，请重试';}};
 copy.onclick=async()=>{try{const clipboard=options.clipboard??globalThis.navigator?.clipboard;if(!clipboard?.writeText)throw Error('clipboard unavailable');const selectedPrompt=buildAIRoastPrompt(voice.value);await clipboard.writeText(selectedPrompt);status.textContent='所选口吻的提示词已复制。和本局 JSON 一起交给 AI，就能得到一小段吐槽。';}catch{text.value=buildAIRoastPrompt(voice.value);promptBox.open=true;text.focus?.();text.select?.();status.textContent='浏览器未允许自动复制，已展开提示词，请手动复制。';}};
 actions.append(download,copy);root.append(voiceLabel,actions,status,promptBox,make('p','导出只保存在本地。你可以自行选择 GPT、DeepSeek 等工具，再上传 JSON 并粘贴提示词。','small-print'));
 return {report,download,copy,voice};
}
