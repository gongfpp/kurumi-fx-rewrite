import {LIFE_SCENE_DIALOGUE_SOURCES} from './life-scene-dialogue-sources.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
// Per-shift game contracts informed by 2014 Japanese part-time wage references.
// Income uses the gross hourly reference; this game does not simulate wage tax.
export const LEGACY_WORK_INCOMES=Object.freeze({"convenience":2200,"cafe":2500,"bookstore":1800,"flyer":1600,"warehouse":3400,"dishwashing":2800,"campusArchive":1300,"tutoring":3600,"proofreading":2100,"eventSetup":4200,"petCare":2300,"translation":4600,"remoteData":2600,"buildingCaretaker":3000,"radioMonitor":1900});
const WORK_PAY=Object.freeze({
 convenience:Object.freeze({version:1,hours:6,rate:940}),
 cafe:Object.freeze({version:1,hours:6,rate:980}),
 bookstore:Object.freeze({version:1,hours:6,rate:900}),
 flyer:Object.freeze({version:1,hours:5,rate:1000}),
 warehouse:Object.freeze({version:1,hours:6,rate:1120}),
 dishwashing:Object.freeze({version:1,hours:6,rate:1050}),
 campusArchive:Object.freeze({version:1,hours:4,rate:900}),
 tutoring:Object.freeze({version:1,hours:3,rate:1400}),
 proofreading:Object.freeze({version:1,hours:4,rate:1150}),
 eventSetup:Object.freeze({version:1,hours:6,rate:1200}),
 petCare:Object.freeze({version:1,hours:4,rate:1000}),
 translation:Object.freeze({version:1,hours:4,rate:1450}),
 remoteData:Object.freeze({version:1,hours:5,rate:1040}),
 buildingCaretaker:Object.freeze({version:1,hours:5,rate:1100}),
 radioMonitor:Object.freeze({version:1,hours:4,rate:1020}),
 eventAssist:Object.freeze({version:1,hours:5,rate:1600}),
});
// Pre-expansion v17 work receipts had no work payload and granted no items.
// Keep only the evidenced original three-job shape; modern receipts carry
// additional fields and cannot become this format by deleting pay or terms.
const BARE_WORK_KEYS=Object.freeze(['id','day','category','optionId','label','income','cost','feeTotal','closedPositions','timestamp','assetsBefore','assetsAfter','dialogue']);
export function validLegacyBareWorkReceipt(receipt,job){
 if(!receipt||!job||!['convenience','cafe','bookstore'].includes(job.id)||Object.keys(receipt).length!==BARE_WORK_KEYS.length||!BARE_WORK_KEYS.every(key=>Object.hasOwn(receipt,key)))return false;
 return receipt.category==='work'&&receipt.optionId===job.id&&receipt.label===job.label&&receipt.cost===0&&(
  // Frozen ba3756fb cafe receipt predates per-job wages and dialogue.
  job.id==='cafe'&&receipt.income===2200&&receipt.dialogue===null||
  receipt.income===LEGACY_WORK_INCOMES[job.id]&&receipt.dialogue?.sourceId===`life-action-20261012:work:${job.id}`&&JSON.stringify(receipt.dialogue)===JSON.stringify(job.dialogue));
}
function validBareWorkEvidence(s,receipt,job){
 if(s.lifeActions?.sourceVersion!==12||!validLegacyBareWorkReceipt(receipt,job))return false;
 const rows=s.stamina?.recoveryReceipts?.filter(row=>row.id===`stamina:work:${receipt.day}`);
 if(!rows||rows.length!==1)return false;
 const row=rows[0],cost=receipt.dialogue===null?20:job.staminaCost;
 return Object.keys(row).length===6&&['id','source','amount','before','after','delta'].every(key=>Object.hasOwn(row,key))&&row.source==='work'&&row.amount===cost&&row.delta===-cost&&Number.isFinite(row.before)&&row.before>=cost&&row.before<=100&&row.after===row.before-cost;
}
// Historical receipts have no pay field and must match the exact old amount.
// New receipts must match the complete trusted contract, including its keys.
export const WORK_ITEM_EFFECTS=Object.freeze({
 apron:Object.freeze({jobId:'cafe',staminaCost:20,label:'咖啡店体力消耗降至20'}),
 raincoat:Object.freeze({jobId:'flyer',staminaCost:15,label:'传单派发体力消耗降至15'}),
 workGloves:Object.freeze({jobId:'warehouse',staminaCost:32,label:'仓库分拣体力消耗降至32'}),
 waterproofGloves:Object.freeze({jobId:'dishwashing',staminaCost:25,label:'餐厅洗碗体力消耗降至25'}),
 toolkit:Object.freeze({jobId:'buildingCaretaker',staminaCost:22,label:'住宅巡检体力消耗降至22'}),
 redPen:Object.freeze({jobId:'proofreading',income:5060,label:'校对助理每次工资提高至¥5,060'}),
 wordCards:Object.freeze({jobId:'translation',income:6380,label:'翻译助理每次工资提高至¥6,380'}),
 keyboard:Object.freeze({jobId:'remoteData',income:5720,label:'居家数据录入每次工资提高至¥5,720'}),
 headphones:Object.freeze({jobId:'radioMonitor',income:4488,label:'音频标注每次工资提高至¥4,488'}),
 catToy:Object.freeze({friendId:'yasuko',staminaRecovery:16,label:'见安子时恢复16点体力'}),
 eventPass:Object.freeze({unlocks:'eventAssist',label:'可应聘展会现场协助'}),
 memo:Object.freeze({manualUse:'tradingNotes',label:'手动翻看，每天压力 -5'}),
 teachingNotes:Object.freeze({unlocks:'translation',label:'可应聘翻译助理'}),
 bookmark:Object.freeze({unlocks:'radioMonitor',label:'可应聘音频标注'}),
 indexCards:Object.freeze({unlocks:'radioMonitor',label:'可应聘音频标注'}),
});
function termsFor(job,acquired){
 const effectId=Object.keys(WORK_ITEM_EFFECTS).find(id=>WORK_ITEM_EFFECTS[id].jobId===job.id&&acquired.has(id))||null;
 const effect=WORK_ITEM_EFFECTS[effectId]||{};
 return {income:effect.income??job.income,staminaCost:effect.staminaCost??job.staminaCost,stressDelta:job.stressDelta,terms:{version:2,effectId}};
}
export function initializeWorkEconomy(s,{restored=false}={}){
 if(s.workEconomy!==undefined)return s.workEconomy;
 const receipts=s.lifeActions?.receipts||[];
 const firstModern=receipts.findIndex(receipt=>receipt.category==='work'&&receipt.work?.terms!==undefined);
 return s.workEconomy={version:1,legacyReceiptCount:restored?(firstModern<0?receipts.length:firstModern):0};
}
export function effectiveWorkTerms(s,job){
 const acquired=new Set(validWorkInventory(s)?Object.keys(s.workInventory||{}):[]);
 return termsFor(job,acquired);
}
// Settlement records the stamina at the start of the shift, before any debit.
export function calculateWorkPay(startStamina,requiredStamina,baseWage){
 if(!Number.isFinite(startStamina)||startStamina<0||startStamina>100||!Number.isFinite(requiredStamina)||requiredStamina<0||!Number.isSafeInteger(baseWage)||baseWage<0)throw Error('Invalid work pay inputs');
 return Math.floor(baseWage*(requiredStamina===0?1:Math.min(1,startStamina/requiredStamina)));
}
// Browsing uses the same earned item terms and wage rule as settlement. Keep
// the full-shift contract alongside this action's actual income and debit.
export function quoteWorkAction(s,job,startStamina){
 const terms=effectiveWorkTerms(s,job),baseIncome=terms.income,requiredStamina=terms.staminaCost;
 return {...terms,income:calculateWorkPay(startStamina,requiredStamina,baseIncome),staminaCost:Math.min(startStamina,requiredStamina),baseIncome,requiredStamina,partialWork:startStamina<requiredStamina};
}
export function workPayDialogue(baseDialogue,{baseWage,income,startStamina,requiredStamina}){
 if(!baseDialogue)return null;
 const text=income<baseWage?`今天体力只够做完一部分。工资拿到 ¥${income.toLocaleString('en-US')}，比整份少了 ¥${(baseWage-income).toLocaleString('en-US')}。`:`收工，工资 ¥${income.toLocaleString('en-US')} 到手了。`;
 return {...structuredClone(baseDialogue),sourceId:`${baseDialogue.sourceId}:pay-v1`,origin:'original-game-adaptation',lines:[...structuredClone(baseDialogue.lines),{from:'久留美',text}]};
}
export function validWorkPayDialogue(job,receipt){
 const ratio=receipt?.work?.payRatio;
 if(!ratio)return false;
 return JSON.stringify(receipt.dialogue)===JSON.stringify(workPayDialogue(job.dialogue,{...ratio,income:receipt.income}));
}
export function validWorkPay(receipt,job){
 if(!receipt||!job)return false;
 if(!Object.hasOwn(receipt,'work'))return validLegacyBareWorkReceipt(receipt,job);
 if(!receipt.work)return false;
 const terms=receipt.work.terms;
 if(terms!==undefined&&(!terms||typeof terms!=='object'||Array.isArray(terms)||Object.keys(terms).length!==2||terms.version!==2||!Object.hasOwn(terms,'effectId')||terms.effectId!==null&&WORK_ITEM_EFFECTS[terms.effectId]?.jobId!==job.id))return false;
 if(!Object.hasOwn(receipt.work,'pay'))return terms===undefined&&Object.hasOwn(LEGACY_WORK_INCOMES,job.id)&&receipt.income===LEGACY_WORK_INCOMES[job.id];
 const pay=receipt.work.pay,expected=job.pay;
 const baseWage=terms===undefined?job.income:termsFor(job,new Set(terms.effectId?[terms.effectId]:[])).income;
 let income=baseWage;
 if(Object.hasOwn(receipt.work,'payRatio')){
  const ratio=receipt.work.payRatio,required=terms===undefined?job.staminaCost:termsFor(job,new Set(terms.effectId?[terms.effectId]:[])).staminaCost;
  if(!ratio||typeof ratio!=='object'||Array.isArray(ratio)||Object.keys(ratio).length!==4||ratio.version!==1||ratio.baseWage!==baseWage||ratio.requiredStamina!==required||!Number.isFinite(ratio.startStamina)||ratio.startStamina<0||ratio.startStamina>100)return false;
  income=calculateWorkPay(ratio.startStamina,ratio.requiredStamina,baseWage);
 }
 return !!pay&&typeof pay==='object'&&!Array.isArray(pay)&&Object.keys(pay).length===3&&
  ['version','hours','rate'].every(key=>Object.hasOwn(pay,key)&&pay[key]===expected[key])&&receipt.income===income;
}
const job=(id,label,income,staminaCost,stressDelta,rewardLabel,rewardId,gate,title,lines)=>{
 const published=LIFE_SCENE_DIALOGUE_SOURCES.find(row=>row.category==='work'&&row.optionId===id)?.dialogue;
 const dialogue=published||Object.freeze({sourceId:`work-expansion-20261015:${id}`,origin:'original-game-adaptation',lines:Object.freeze(lines.map(text=>Object.freeze({from:'久留美',text})))});
 return Object.freeze({category:'work',id,label,income,pay:WORK_PAY[id],staminaCost,stressDelta,rewardLabel,rewardId,gate,title,dialogue});
};
export const LIFE_WORK_JOBS=Object.freeze([
 job("convenience","便利店",5640,20,2,"交易笔记","memo","open","整齐的货架",[]),
 job("cafe","咖啡店",5880,24,-2,"围裙","apron","open","滑开的围裙",[]),
 job("bookstore","书店",5400,12,-3,"旧书签","bookmark","open","词典里的圆珠笔",[]),
 job("flyer","传单派发",5000,18,4,"雨衣","raincoat","open","雨点落下来之前",["刚摆好传单就下雨，只好挪到有顶棚的路口。", "剩下的总算发完。下次出门先看天气，不看汇率。"]),
 job("warehouse","仓库分拣",6720,38,5,"劳保手套","workGloves","open","追上错误的货箱",["两个箱子的标签贴反了，装车前才拦下来。", "手臂抬不起来了。工资倒是实实在在到了。"]),
 job("dishwashing","餐厅洗碗",6300,30,3,"防水手套","waterproofGloves","open","晚餐高峰的盘子",["刚清空水池，下一摞盘子又来了。", "最后一只盘子洗完，比平仓还想叹气。"]),
 job("campusArchive","校内资料整理",3600,8,-1,"索引卡","indexCards","open","少掉的一页",["装订前对了一遍目录，果然少了一页。", "补回去就能交差。今天这份工作允许我坐着慢慢来。"]),
 job("tutoring","课后家教",4200,22,-4,"教学笔记","teachingNotes","mochiko","终于讲懂的分数题",["萌智子介绍的学生，问我为什么分母不能直接加。", "讲到他能自己做出来，我才发现这比猜涨跌踏实。"]),
 job("proofreading","校对助理",4600,10,1,"红笔","redPen","story","漏掉的一个字",["同一句读了三遍，才看见漏掉的那个字。", "上次一起看资料的办法还真管用。红笔比下单键安静多了。"]),
 job("eventSetup","展会布场",7200,45,6,"工作通行证","eventPass","assets","歪斜的展板",["展板刚立起来就往一边倒，只好重新固定底座。", "闭馆前终于全部站稳。今天站不稳的是我的腿。"]),
 job("petCare","宠物照看",4000,16,-6,"逗猫绳","catToy","yasuko","纸箱里的猫",["安子介绍的猫，比约好的见面时间还难找。", "最后从纸箱里请出来了。它肯吃饭，我也跟着松了口气。"]),
 job("translation","翻译助理",5800,28,7,"词汇卡","wordCards","notes","反复确认的术语",["同一个词在两段里意思不一样，差点整页翻错。", "翻出教学笔记，一项项列清楚才交稿。脑子比手还累。"]),
 job("remoteData","居家数据录入",5200,14,2,"键盘","keyboard","home","重复的记录",["录到最后才发现两行编号相同，得回头核对原表。", "自己住倒是没人打断。可是敲完这些数字，我不想再看行情了。"]),
 job("buildingCaretaker","住宅巡检",5500,26,-2,"工具包","toolkit","residence","楼道里的水迹",["巡楼时看见墙角渗水，先通知管理人，再把路口围好。", "维修师傅接手了。能在问题变大前发现一次，也挺好。"]),
 job("radioMonitor","音频标注",4080,6,3,"耳机","headphones","cards","杂音后面的声音",["同一小段反复听，终于分清是关门声还是鼓点。", "坐着也会累耳朵。标完这一批，先安静一会儿。"]),
 job("eventAssist","展会现场协助",8000,40,4,"工作通行证","eventPass","eventPass","开场前的最后一趟",["通行证挂好，先帮忙把入口的指示牌摆正。", "人一多就停不下来。收工了，终于能坐下数工资。"]),
]);
export function workUnlockReason(s,job,{knowsFriend=()=>false,netAssets=0}={}){
 const seen=id=>s.story?.seen?.includes(id)||s.story?.log?.some(row=>row.id===id);
 const owns=id=>Object.hasOwn(s.workInventory||{},id)&&validWorkInventory(s);
 const home=s.livingHousing?.id??s.lifestyle?.id??'basic';
 switch(job.gate){
 case 'mochiko':return knowsFriend('mochiko')?null:'需要萌智子介绍';
 case 'yasuko':return knowsFriend('yasuko')?null:'需要安子介绍';
 case 'story':return seen('friendStudy')?null:'一起整理过学习资料后开放';
 case 'assets':return netAssets>=500000?null:'净资产达到 ¥500,000 后可应聘';
 case 'notes':return owns('teachingNotes')?null:'需要家教工作获得的教学笔记';
 case 'home':return ['comfortable','generous','premium','penthouse'].includes(home)?null:'独住后可接居家工作';
 case 'residence':return ['comfortable','generous','premium','penthouse'].includes(home)?null:'在独住居所熟悉住宅后开放';
 case 'eventPass':return owns('eventPass')?null:'需要展会布场获得的工作通行证';
 case 'cards':return owns('bookmark')||owns('indexCards')?null:'需要书签或资料整理索引卡';
 default:return null;
 }
}
export function awardWorkItem(s,job,receiptId){
 s.workInventory ||= {};
 if(s.workInventory[job.rewardId])return null;
 const reward={id:job.rewardId,label:job.rewardLabel,jobId:job.id,day:s.day,receiptId};
 s.workInventory[job.rewardId]=reward;return {...reward};
}
export function validWorkInventory(s){
 if(s.lifeActions?.receipts!==undefined&&!Array.isArray(s.lifeActions.receipts))return false;
 const receipts=s.lifeActions?.receipts||[],economy=s.workEconomy;
 if(economy!==undefined&&(!economy||typeof economy!=='object'||Array.isArray(economy)||Object.keys(economy).length!==2||economy.version!==1||!Number.isSafeInteger(economy.legacyReceiptCount)||economy.legacyReceiptCount<0||economy.legacyReceiptCount>receipts.length))return false;
 const inventory=s.workInventory??{};
 if(s.workInventory===null||typeof inventory!=='object'||Array.isArray(inventory))return false;
 const acquired=new Set(),days=new Set();let hasStructuredWork=false;
 const runId=String(s.runId??`seed:${s.seed}:${s.mode}`);
 for(const receipt of [...(s.lifeActions?.receipts||[])].sort((a,b)=>a.day-b.day)){
  if(receipt.category!=='work')continue;
  const job=LIFE_WORK_JOBS.find(j=>j.id===receipt.optionId);if(!job)return false;
  // Null is the established legacy dialogue payload; never backfill today's text.
  if(!Number.isSafeInteger(receipt.day)||receipt.day<1||receipt.day>s.day||days.has(receipt.day)||receipt.id!==`life:${runId}:${receipt.day}`||receipt.label!==job.label||!validWorkPay(receipt,job)||receipt.cost!==0||(receipt.dialogue!==null&&JSON.stringify(receipt.dialogue)!==JSON.stringify(job.dialogue)&&!validWorkPayDialogue(job,receipt)))return false;
  days.add(receipt.day);
  if(economy){const legacy=receipts.indexOf(receipt)<economy.legacyReceiptCount;if(legacy?receipt.work?.terms!==undefined:receipt.work?.terms===undefined)return false;}
  if(!Object.hasOwn(receipt,'work')){if(hasStructuredWork||!validBareWorkEvidence(s,receipt,job))return false;continue;}
  hasStructuredWork=true;
  const current=receipt.work.terms!==undefined;
  const effective=current?termsFor(job,acquired):job;
  if(current&&JSON.stringify(receipt.work.terms)!==JSON.stringify(effective.terms))return false;
  if(job.id==='eventAssist'&&(!current||!acquired.has('eventPass')))return false;
  if(receipt.work.staminaCost!==effective.staminaCost||receipt.work.stressDelta!==effective.stressDelta)return false;
  if(!Number.isFinite(receipt.work.stressBefore)||!Number.isFinite(receipt.work.stressAfter)||receipt.work.stressBefore<0||receipt.work.stressAfter!==Math.max(0,receipt.work.stressBefore+job.stressDelta))return false;
  if(receipt.work.payRatio){
   const ratio=receipt.work.payRatio,rows=s.stamina?.recoveryReceipts?.filter(row=>row.id===`stamina:work:${receipt.day}`);
   if(!rows||rows.length!==1)return false;
   const row=rows[0],amount=Math.min(ratio.startStamina,ratio.requiredStamina),after=Math.round(Math.max(0,ratio.startStamina-amount)*1e9)/1e9;
   if(row.source!=='work'||row.before!==ratio.startStamina||row.amount!==amount||row.after!==after||row.delta!==Math.round((after-ratio.startStamina)*1e9)/1e9)return false;
  }
  const reward=receipt.work.reward;
  if(acquired.has(job.rewardId)){if(reward!==null)return false;continue;}
  const expected={id:job.rewardId,label:job.id==='convenience'&&!current?'便签本':job.rewardLabel,jobId:job.id,day:receipt.day,receiptId:receipt.id};
  if(JSON.stringify(reward)!==JSON.stringify(expected)||JSON.stringify(inventory[job.rewardId])!==JSON.stringify(expected))return false;
  acquired.add(job.rewardId);
 }
 return Object.keys(inventory).length===acquired.size;
}

// A display flag or a loose item is not proof of the earned work reward.
export function ownsTradingNotes(s={}){
 return Object.hasOwn(s.workInventory||{},'memo')&&validWorkInventory(s);
}
