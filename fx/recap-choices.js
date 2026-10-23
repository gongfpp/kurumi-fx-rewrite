import {LIVING_CHOICE_COPY} from './copy/living-choices.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
export const DINNER_OPTIONS=Object.freeze([['dinner-small','请吃一顿饭',1500,3000],['dinner-friends','请朋友聚餐',8000,40000],['dinner-feast','今晚好好庆祝',30000,200000],['dinner-banquet','大方请客一次',100000,1000000]].map(([id,label,cost,minGain])=>Object.freeze({id,label,cost,minGain})));
export function recapChoices(snapshot,{cash=0,loanUnlocked=false,loanTerms=null}={}){
 if(!snapshot.sealed||snapshot.mode==='endless')return[];
 const net=snapshot.daily.tradingNet,choices=[],recovered=!!snapshot.daily.mainRecoveryUsed;
 if(net>0){for(const {id,label,cost,minGain} of DINNER_OPTIONS)if(net>=minGain)choices.push({id,label,cost,group:'dinner',enabled:cash>=cost&&!recovered,copy:recovered?'今晚已经安排过恢复活动':'',origin:'游戏原创生活选择'});}
 else if(net<0){choices.push({id:'noodles-today',label:'今天关灯吃泡面',cost:150,enabled:cash>=150&&snapshot.daily.livingStatus==='pending'&&!snapshot.daily.noodlesUsed,copy:LIVING_CHOICE_COPY.shared.noodlesRecapDescription,origin:'游戏原创生活选择'});if(net<=-10000)choices.push({id:'quiet-night',label:'去神社走走',cost:0,enabled:!recovered,copy:recovered?'今晚已经安排过恢复活动':'免费',origin:'游戏原创生活选择，非原作祭拜情节'});}
 if(net<0&&snapshot.account.netAssets<snapshot.daily.openingNominal*.6&&loanUnlocked&&loanTerms)choices.push({id:'loan-review',label:'看看网贷额度',cost:0,enabled:loanTerms.availableCredit>=loanTerms.minBorrow,loan:true,copy:`可借 ¥${loanTerms.availableCredit.toLocaleString('zh-CN')} · 日息 ${(loanTerms.dailyRate*100).toFixed(3)}%`,origin:'仅游戏内虚构贷款，无真实贷款入口'});
 return choices;
}
