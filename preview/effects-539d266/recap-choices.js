export function recapChoices(snapshot,{cash=0,loanUnlocked=false,loanTerms=null}={}){
 if(!snapshot.sealed||snapshot.mode==='endless')return[];
 const net=snapshot.daily.tradingNet,choices=[];
 if(net>0){for(const [id,label,cost,minGain] of [['dinner-small','请吃一顿饭',1500,3000],['dinner-friends','请朋友聚餐',8000,40000],['dinner-feast','今晚好好庆祝',30000,200000],['dinner-banquet','大方请客一次',100000,1000000]])if(net>=minGain)choices.push({id,label,cost,group:'dinner',enabled:cash>=cost,copy:`明确支付 ¥${cost.toLocaleString('zh-CN')} 游戏币；不改变交易收益`,origin:'游戏原创生活选择'});}
 else if(net<0){choices.push({id:'noodles-next-day',label:'明天吃泡面，省点生活费',cost:200,enabled:cash>=200,copy:'支付 ¥200 游戏币，明日生活费减免 40%；不追溯退款',origin:'游戏原创生活选择'});if(net<=-10000)choices.push({id:'quiet-night',label:'去神社走走，冷静一下',cost:0,enabled:true,copy:'免费休息，不改变胜率或行情',origin:'游戏原创生活选择，非原作祭拜情节'});}
 if(net<0&&snapshot.account.netAssets<snapshot.daily.openingNominal*.6&&loanUnlocked&&loanTerms)choices.push({id:'loan-review',label:'看看游戏内网贷额度',cost:0,enabled:loanTerms.availableCredit>=loanTerms.minBorrow,loan:true,copy:`可借 ¥${loanTerms.availableCredit.toLocaleString('zh-CN')} · 日息 ${(loanTerms.dailyRate*100).toFixed(3)}%；点击只看条款，再明确确认借款`,origin:'仅游戏内虚构贷款，无真实贷款入口'});
 return choices;
}
