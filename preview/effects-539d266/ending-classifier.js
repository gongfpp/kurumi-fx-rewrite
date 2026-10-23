import {accountingValues} from './accounting-journal.js?v=539d26616071e7036617b0b49726bd24af40ef2e-capture-v1-1fbef814f493';
import {orderPerformance} from './run-statistics.js?v=539d26616071e7036617b0b49726bd24af40ef2e-capture-v1-1fbef814f493';

export const ENDING_RULES_VERSION=1;
export const BASE_ENDINGS=Object.freeze({
 million:{title:'两千万回来了',description:'累计交易目标达成。最后的账户、费用和欠款，都在这张成绩单里。'},
 walkaway:{title:'主动离场',description:'这一局由你按下结束。持仓已经平掉，账单留在这里。'},
 broke:{title:'账户退场',description:'可用于继续交易的资金不足，这一局结束。'},
 crisis:{title:'先停在这里',description:'账户与心理承受力都到了本局的停止条件。先离开交易屏幕。'}
});
export const ENDING_VARIANTS=Object.freeze({
 'debt-exit':{title:'带着账单离场',description:'交易账户已经见底，未还的父亲欠款和网贷仍分别记在账上。'},
 'paper-millionaire':{title:'数字上的富翁',description:'账户里的大数字包含借来的钱。扣掉债务后，真正属于这一局的资产少得多。'},
 'gave-it-back':{title:'又还回去了',description:'曾经落袋的一大段利润，又在后面的交易里退了回去。账本保留着那个盈利高点。'},
 'back-to-even':{title:'回本就走',description:'经历过明显的已实现亏损后，净交易盈亏和扣债净资产都重新过了回本线。你这次真的停下来了。'},
 'debt-free':{title:'无债一身轻',description:'曾经借过的钱已经还清，父亲欠款与网贷余额都归零。这一局不再带着欠款离场。'},
 'returned-savings':{title:'把钱放回去',description:'确实取用过的三百万父亲存款已经归还。柜子里的账先被补齐了。'}
});

// Classification is read-only and only runs for an already sealed terminal state.
// It must never create a terminal state, trade, fee or story transition.
export function classifyEnding(state={}){
 const baseId=state.ending?.id;
 if(state.phase!=='ending'||!Object.hasOwn(BASE_ENDINGS,baseId))return null;
 const values=accountingValues(state),p=orderPerformance(state),initialCapital=Number.isFinite(state.startEquity)&&state.startEquity>0?state.startEquity:100000;
 const fatherDebt=Number.isFinite(state.family?.outstanding)?state.family.outstanding:null,networkDebt=Number.isFinite(state.loan?.outstanding)?state.loan.outstanding:null;
 const debtsKnown=fatherDebt!==null&&networkDebt!==null,totalDebt=debtsKnown?fatherDebt+networkDebt:null;
 const netAssets=debtsKnown?values.nominalAssets-totalDebt:null,realizedNetTradingPnl=Number.isFinite(state.performance?.totalProfit)?state.performance.totalProfit:null;
 const fatherRepaid=Number.isFinite(state.family?.repaid)?state.family.repaid:null,networkBorrowed=Number.isFinite(state.loan?.borrowed)?state.loan.borrowed:null,networkRepaid=Number.isFinite(state.loan?.repaid)?state.loan.repaid:null;
 const fatherBorrowed=state.fatherUsed===true,networkUsed=networkBorrowed>0||networkRepaid>0;
 const evidence={baseId,initialCapital,nominalAssets:values.nominalAssets,netAssets,fatherDebt,networkDebt,totalDebt,fatherBorrowed,fatherRepaid,networkBorrowed,networkRepaid,realizedNetTradingPnl,realizedPeak:p.realizedPeak,realizedTrough:p.realizedTrough,realizedPathComplete:p.realizedPathComplete};
 let variant=null,matchedRule=null;
 if(totalDebt>.005&&(baseId==='broke'||values.nominalAssets<1000)){
  variant='debt-exit';matchedRule='未还债务 > 0，且基础结局为 broke 或名义资产 < ¥1,000';
 }else if(totalDebt>.005&&values.nominalAssets>=1000000&&netAssets<=values.nominalAssets*.1){
  variant='paper-millionaire';matchedRule='名义资产 ≥ ¥1,000,000，且扣债净资产不超过名义资产的 10%';
 }else if(p.realizedPathComplete&&p.realizedPeak>=initialCapital&&realizedNetTradingPnl!==null&&realizedNetTradingPnl<=p.realizedPeak*.1&&p.realizedPeak-realizedNetTradingPnl>=initialCapital){
  variant='gave-it-back';matchedRule='已实现利润峰值 ≥ 初始本金，利润回吐 ≥ 初始本金，剩余利润 ≤ 峰值的 10%';
 }else if(baseId==='walkaway'&&p.realizedPathComplete&&p.realizedTrough<=-initialCapital*.5&&realizedNetTradingPnl>=-.005&&netAssets>=initialCapital-.005){
  variant='back-to-even';matchedRule='主动离场；历史已实现亏损 ≥ 初始本金的 50%；当前净交易盈亏 ≥ 0 且扣债净资产 ≥ 初始本金';
 }else if(baseId==='walkaway'&&debtsKnown&&totalDebt<=.005&&networkUsed&&networkRepaid>0){
  variant='debt-free';matchedRule='主动离场；有实际网贷借还记录；父亲欠款与网贷欠款均已清零';
 }else if(baseId==='walkaway'&&fatherBorrowed&&fatherDebt!==null&&fatherDebt<=.005&&fatherRepaid>=3000000-.005){
  variant='returned-savings';matchedRule='主动离场；实际取用过父亲存款，累计归还 ≥ ¥3,000,000，父亲欠款清零';
 }else if(baseId==='walkaway'&&debtsKnown&&totalDebt<=.005&&fatherRepaid>0){
  variant='debt-free';matchedRule='主动离场；有实际父亲借款归还记录，父亲欠款与网贷欠款均已清零';
 }
 return {rulesVersion:ENDING_RULES_VERSION,baseId,variant,...(variant?ENDING_VARIANTS[variant]:BASE_ENDINGS[baseId]),evidence,matchedRule};
}
