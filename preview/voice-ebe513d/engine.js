import {generateQuoteGrid,hasCanonicalGrid,validQuoteGrid,quoteSubstep,QUOTE_SUBSTEPS,QUOTE_GRID_VERSION,MARKET_BALANCE} from './quote-grid.js?v=ebe513d153a1219d73a65051f32fb508afce547c-capture-v1-1fbef814f493';
import {quotePackageState,planQuotePackagePurchase,quotePackageOffer,quoteCostRepresentable} from './quote-packages.js?v=ebe513d153a1219d73a65051f32fb508afce547c-capture-v1-1fbef814f493';
export {quotePackageState} from './quote-packages.js?v=ebe513d153a1219d73a65051f32fb508afce547c-capture-v1-1fbef814f493';
import {dailyReturnMetrics} from './daily-performance.js?v=ebe513d153a1219d73a65051f32fb508afce547c-capture-v1-1fbef814f493';
export {dailyReturnMetrics} from './daily-performance.js?v=ebe513d153a1219d73a65051f32fb508afce547c-capture-v1-1fbef814f493';
import {quoteLivingMeal,livingDayRoll,validLivingSettlement} from './living-settlement.js?v=ebe513d153a1219d73a65051f32fb508afce547c-capture-v1-1fbef814f493';
import {ensureRunStatistics,recordOrderOpened,recordOrderExits} from './run-statistics.js?v=ebe513d153a1219d73a65051f32fb508afce547c-capture-v1-1fbef814f493';

import {ensureTradingClock,stampCandleTime,stampQuoteTime,currentTradingTimestamp} from './trading-time.js?v=ebe513d153a1219d73a65051f32fb508afce547c-capture-v1-1fbef814f493';
import {ensureAccountingJournal,recordAccountingPoint,recordAccountingDay,sealAccountingDay} from './accounting-journal.js?v=ebe513d153a1219d73a65051f32fb508afce547c-capture-v1-1fbef814f493';
import {recapChoices} from './recap-choices.js?v=ebe513d153a1219d73a65051f32fb508afce547c-capture-v1-1fbef814f493';
import {observeTradingTrauma,recoverTradingTrauma,tradingTrauma,capTraumaSanity,validTradingTrauma,tradingCapitalSafety} from './trading-trauma.js?v=ebe513d153a1219d73a65051f32fb508afce547c-capture-v1-1fbef814f493';


import {creditTerms} from './credit-policy.js?v=ebe513d153a1219d73a65051f32fb508afce547c-capture-v1-1fbef814f493';
import {pressureMood,pressureIntensity} from './emotion-pressure.js?v=ebe513d153a1219d73a65051f32fb508afce547c-capture-v1-1fbef814f493';
import {PIP_SIZE,grossPnlAt,pnlCoefficients,positionQuantity,isLegacyPosition} from './market.js?v=ebe513d153a1219d73a65051f32fb508afce547c-capture-v1-1fbef814f493';
import {itemUnlocked,discoverItems,itemDiscovered,itemUnavailableReason} from './item-events.js?v=ebe513d153a1219d73a65051f32fb508afce547c-capture-v1-1fbef814f493';
import {NEWS_CHAINS,PROPS} from './content.js?v=ebe513d153a1219d73a65051f32fb508afce547c-capture-v1-1fbef814f493';
import {BLACK_SWANS} from './story-content.js?v=ebe513d153a1219d73a65051f32fb508afce547c-capture-v1-1fbef814f493';
import {ensureStory,checkStories,restrictions as baseRestrictions,addEffect,ageEffects,queueStory,pendingStory} from './story.js?v=ebe513d153a1219d73a65051f32fb508afce547c-capture-v1-1fbef814f493';
export {pendingStory,chooseStory,DEBUFFS} from './story.js?v=ebe513d153a1219d73a65051f32fb508afce547c-capture-v1-1fbef814f493';
import {appendDialogue,chooseDialogue,ensureDialogue,updateSpeech,chapterChat} from './dialogue.js?v=ebe513d153a1219d73a65051f32fb508afce547c-capture-v1-1fbef814f493';
export const VERSION = 8;
export const FEE_RATE = .00005;
export const STOP_OUT_LEVEL = .5;
export const LIVING_DAILY = 2200;
export const FATHER_SAVINGS = 3000000;
export const TARGET_PROFIT = 20000000;
export const START_PRICE = 150;
export const START = 100000;
export const CANDLES_PER_BEAT = 4;
export const BEATS_PER_DAY = 4;
export function beatsPerDay(s){return s.mode==='endless'?BEATS_PER_DAY:BEATS_PER_DAY+(s.bonusBeats||0);}
export {itemDiscovered,discoverItems};
export const TICKS_PER_CANDLE = 6;
export const MIN_EQUITY = 1000;

export function random(seed) {
  let a = seed >>> 0;
  return () => {
    a += 0x6D2B79F5;
    let t = a;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function mix(seed, day, channel) {
  let x = (seed ^ Math.imul(day, 0x9E3779B9) ^ channel) >>> 0;
  x = Math.imul(x ^ x >>> 16, 0x7feb352d);
  x = Math.imul(x ^ x >>> 15, 0x846ca68b);
  return (x ^ x >>> 16) >>> 0;
}

const CHAINS = NEWS_CHAINS;
const VARIANTS = ['confirmed', 'reversed', 'muted'];
export const NEWS_FLASH_CANDLE=1,NEWS_FLASH_TICK=2;
// The reveal's influence starts on the very quote that displays the flash.
export function newsImpact(event,{day,beat,candle,tick}){
 const revealed=beat%2===1||candle*TICKS_PER_CANDLE+tick>=NEWS_FLASH_CANDLE*TICKS_PER_CANDLE+NEWS_FLASH_TICK;
 const phase=!revealed?1:event.variant==='reversed'?(beat%2?-1:-1.5):event.variant==='muted'?.1:beat%2?.8:1.2;
 return{drift:event.bias*phase*(.00007+day%3*.00001),volatility:event.vol*(revealed&&event.variant==='muted'?.55:1),revealed};
}

export function planDay(seed, day, startPrice, rounds = BEATS_PER_DAY, {newsEffects=true,swanEffects=true,gridVersion=QUOTE_GRID_VERSION}={}) {
  const story = random(mix(seed, day, 0x5170));
  const market = random(mix(seed, day, 0x61a0));
  const cycle=Math.floor((day-1)*2/CHAINS.length),bag=CHAINS.map((_,i)=>i),shuffle=random(mix(seed,cycle,0x777a));
  for(let i=bag.length-1;i>0;i--){const j=Math.floor(shuffle()*(i+1));[bag[i],bag[j]]=[bag[j],bag[i]];}
  const selected=[CHAINS[bag[((day-1)*2)%bag.length]],CHAINS[bag[((day-1)*2+1)%bag.length]]];
  const surprise=random(mix(seed,day,0x1b1a));
  const swan=(surprise()<.22||day%7===0)&&swanEffects?{...BLACK_SWANS[Math.floor(surprise()*BLACK_SWANS.length)],beat:Math.floor(surprise()*4),candle:Math.floor(surprise()*3),tick:2+Math.floor(surprise()*3)}:null;
  const events = [];
  for (let beat = 0; beat < rounds; beat++) {
    const chain = selected[Math.floor(beat / 2)%selected.length];
    const variant = beat % 2 === 0 ? VARIANTS[Math.floor(story() * 3)] : events[beat - 1].variant;
    const [reveal, detail] = chain[variant];
    events.push({id: chain.id, chain: chain.name, variant, bias: chain.bias, vol: chain.vol,
      title: beat % 2 === 0 ? chain.lead : reveal,
      copy: beat % 2 === 0 ? chain.leadCopy : detail,
      source: chain.source, time: ['09:10','11:30','15:00','21:30','23:30'][beat]||'00:30',
      flash: beat % 2 === 0 ? reveal : `${chain.name}：市场继续评估后续影响`,
      flashCopy: detail});
  }
  if(gridVersion===QUOTE_GRID_VERSION){const grid=generateQuoteGrid({startPrice,events,market,swan,newsEffects,impactAt:(event,cursor)=>newsImpact(event,{day,...cursor})});return{events,...grid,swan};}
  let price = startPrice;
  const tracks = events.map((event, beat) => Array.from({length: CANDLES_PER_BEAT}, (_, candle) => {
    const ticks = [];
    for (let tick = 0; tick < TICKS_PER_CANDLE; tick++) {
      const impact=newsImpact(event,{day,beat,candle,tick});
      const drift=newsEffects?impact.drift:0;
      const noise = (market() + market() - 1) * 0.00058 * (newsEffects?impact.volatility:1);
      const shock=swan&&swan.beat===beat&&swan.candle===candle&&swan.tick===tick?swan.delta:0;
      price = Math.max(.001, price * (1 + drift + noise + shock));
      ticks.push(Number(price.toFixed(9)));
    }
    return ticks;
  }));
  return {events, tracks, swan};
}

function historyCandles(seed) {
  const rng = random(mix(seed, 0, 0x75ca));
  const candles = [];
  let price = START_PRICE * .992;
  for (let i = 0; i < 18; i++) {
    const open = price;
    const points = Array.from({length: 6}, () => { price *= 1 + (rng() - .49) * MARKET_BALANCE.historyNoise; return price; });
    candles.push({open, close: price, high: Math.max(open, ...points), low: Math.min(open, ...points), closed: true, historical: true});
  }
  const ratio = START_PRICE / price;
  for (const c of candles) for (const key of ['open','close','high','low']) c[key] *= ratio;
  return candles;
}
export function createGame(seed = Date.now(), {mode = 'story'} = {}) {
  if(!['story','endless'].includes(mode))throw Error('未知游戏模式');
  seed = seed >>> 0;
  const state = {version: VERSION, mode, startEquity:START, completedCandles:0, completedDays:0, performance:{totalProfit:0,closedTrades:0,winningTrades:0,winRateTrades:0,maxLoss:0,maxProfit:0,peakEquity:START,maxDrawdown:0}, seed, day: 1, beat: 0, phase: 'decision', price: START_PRICE,
    cash: mode==='endless'?START:START-LIVING_DAILY, reserve: mode==='endless'?0:LIVING_DAILY, positions: [], position: null, nextOrderId: 1, feesPaid: 0, feeLedger: [], sanity: 50, mentalBoost:0, bonusBeats:0, dayOpening: START, dayOpeningNetAssets:START, dayOpeningDebt:0, candles: historyCandles(seed),
    script: null, pending: null, history: [], recent: [], chat: {group:[],friend:[]}, promise: null,
    relationship: 0, publicStance: null, promiseNoted:false, dinner:false, skills:{mochiko:false,yasuko:false},
    fatherUsed:false,externalFunding:0,dayOpeningFunding:0,stress:0,heat:0,peakPersonal:START,equityTrail:[START],nextStop:null,
    lastEvent:null, lastTrade:null, lastReaction:null, dayReport:null};
  ensureRunStatistics(state);ensureTradingClock(state);ensureAccountingJournal(state);recordAccountingPoint(state,'opening');
  state.script = planDay(seed, 1, state.price);
  chapterChat(state);ensureStory(state);observeTradingTrauma(state,{accountEquity:START});updateSpeech(state,'hopeful');state.dayOpeningLine=state.speech.text;
  return state;
}
// position remains a first-order view for older story/dialogue consumers.
// All accounting uses positions; legacy fixtures/saves can still supply position.
export function positionsOf(s) {
  if(Array.isArray(s.positions)&&s.positions.length)return s.positions;
  return s.position?[s.position]:[];
}
function ensureOrders(s){
  if(!Array.isArray(s.positions)||!s.positions.length&&s.position)s.positions=s.position?[s.position]:[];
  s.nextOrderId ||= 1;s.feesPaid ||= 0;s.feeLedger ||= [];
  for(const p of s.positions){
    if(!p.id)p.id='order-'+s.nextOrderId++;
    p.notional ??= p.margin*p.leverage;p.initialMargin ??= p.margin;p.openFeeRemaining ??= 0;p.openFee ??= 0;p.maxUnrealized ??= 0;p.stop ??= 1;
  }
  syncPosition(s);
}
function syncPosition(s){s.position=s.positions[0]||null;}
export function positionUnrealized(s,p){return grossPnlAt(p,s.price);}
export function positionNetUnrealized(s,p){return p?positionUnrealized(s,p)-(p.openFeeRemaining||0)-money((p.notional??p.margin*p.leverage)*FEE_RATE):0;}
export function unrealized(s){return positionsOf(s).reduce((sum,p)=>sum+positionUnrealized(s,p),0);}
export function accountMetrics(s){
  const positions=positionsOf(s),usedMargin=positions.reduce((sum,p)=>sum+p.margin,0),floating=unrealized(s);
  const requiredMargin=positions.reduce((sum,p)=>sum+(p.initialMargin??p.margin),0),tradingEquity=s.cash+usedMargin+floating;
  return {cash:s.cash,availableMargin:Math.max(0,Math.min(s.cash,tradingEquity-usedMargin)),usedMargin,
    unrealized:floating,tradingEquity,equity:Math.max(0,tradingEquity)+(s.reserve||0),
    requiredMargin,marginLevel:requiredMargin?tradingEquity/requiredMargin:null,notional:positions.reduce((sum,p)=>sum+(p.notional??p.margin*p.leverage),0),
    feesPaid:s.feesPaid||0,reserve:s.reserve||0};
}
export function equity(s){return accountMetrics(s).equity;}
const money=n=>Math.round(n*100)/100;
const fee=(margin,leverage)=>money(margin*leverage*FEE_RATE);
const floorMoney=n=>Math.max(0,Math.floor((n+1e-8)*100)/100);
function marginWithinBudget(budget,leverage){
  let margin=floorMoney(budget/(1+leverage*FEE_RATE));
  if(margin+fee(margin,leverage)>budget+1e-8)margin=floorMoney(margin-.01);
  return margin;
}
export function accountLiquidationEstimate(s,extra){
 const positions=[...positionsOf(s),...(extra?[extra]:[])],used=positions.reduce((n,p)=>n+p.margin,0);
 const required=positions.reduce((n,p)=>n+(p.initialMargin??p.margin),0),afterFee=accountMetrics(s).tradingEquity-(extra?fee(extra.margin,extra.leverage):0);
 const balance=s.cash-(extra?extra.margin+fee(extra.margin,extra.leverage):0)+used;
 const lossThreshold=Math.max(0,balance-STOP_OUT_LEVEL*required),remainingLoss=Math.max(0,afterFee-STOP_OUT_LEVEL*required);
 const result={price:null,movePercent:null,lossThreshold,remainingLoss,reason:!positions.length?'empty':'unreachable'};
 if(!positions.length)return result;
 const terms=positions.map(pnlCoefficients),a=terms.reduce((n,t)=>n+t.linear,0),b=terms.reduce((n,t)=>n+t.reciprocal,0),c=balance-STOP_OUT_LEVEL*required+terms.reduce((n,t)=>n+t.constant,0);
 if(Math.abs(a)<1e-10&&Math.abs(b)<1e-8)return {...result,reason:'hedged'};
 let roots=[];
 if(Math.abs(a)<1e-10){if(Math.abs(c)>1e-10)roots=[-b/c];}
 else if(Math.abs(b)<1e-8)roots=[-c/a];
 else {const discriminant=c*c-4*a*b;if(discriminant>=0){const q=-.5*(c+(c>=0?1:-1)*Math.sqrt(discriminant));roots=q?[q/a,b/q]:[-c/(2*a)];}}
 roots=[...new Set(roots.filter(price=>price>0&&Number.isFinite(price)))].sort((x,y)=>Math.abs(Math.log(x/s.price))-Math.abs(Math.log(y/s.price)));
 const price=roots[0];return price?{...result,price,prices:roots,movePercent:(price/s.price-1)*100,reason:null}:result;
}
export function pipStopPrice(entry,direction,pips){if(pips===null)return null;const price=entry-direction*pips*PIP_SIZE;return price>0?price:null;}

function orderStop(s,action){
  if(Object.hasOwn(action,'stopPips')){
    const price=pipStopPrice(s.price,action.type==='short'?-1:1,action.stopPips);
    return{stop:1,stopPips:action.stopPips,stopPrice:price};
  }
  const stop=action.stop;
  return{stop,stopPrice:stop<1&&action.leverage?s.price*(1-(action.type==='short'?-1:1)*stop/action.leverage):null};
}
export function positionStopLoss(p){
  return Object.hasOwn(p,'stopPips')?(Number.isFinite(p.stopPrice)?Math.max(0,-grossPnlAt(p,p.stopPrice)):null):p.stop<1?p.margin*p.stop:null;
}
export function restrictions(s){
  const limits=baseRestrictions(s),emotion=mood(s),pressure=pressureMood(s),forceNoStop=['ecstatic','despair'].includes(emotion)||!!pressure;
  const pressured=!!pressure&&!limits.noEntry;
  return {...limits,...(pressured?{leverage:100,stake:1}:{}),minLeverage:forceNoStop?25:5,forceNoStop,emotion};
}
export function tradingOpen(s){return s.phase==='decision'||s.realtime===true&&s.phase==='playing';}
export function orderPreview(s,action={}){
  const a=accountMetrics(s),limits=restrictions(s),leverage=action.leverage;
  const factor=Number.isFinite(leverage)?leverage*FEE_RATE:0;
  const marginLimit=(Math.max(0,a.tradingEquity)*limits.stake-a.usedMargin)/(1+limits.stake*factor);
  const notionalLimit=Number.isFinite(leverage)?(Math.max(0,a.tradingEquity)*limits.leverage-a.notional)/(leverage+limits.leverage*factor):0;
  const maxMargin=floorMoney(Math.min(marginWithinBudget(a.availableMargin,leverage||0),Math.max(0,marginLimit),Math.max(0,notionalLimit)));
  const amountMode=Object.hasOwn(action,'amount');
  const margin=amountMode?money(action.amount):marginWithinBudget(a.availableMargin*(action.stake||0),leverage||0);
  const openFee=fee(margin,leverage||0),closeFee=openFee,stopConfig=orderStop(s,action);
  const result={valid:false,error:null,margin,notional:margin*(leverage||0),quantity:margin*(leverage||0)/s.price,openFee,closeFee,totalDebit:margin+openFee,maxMargin,
    ...stopConfig,stopLossAmount:stopConfig.stopPrice?Math.max(0,-margin*leverage*(action.type==='short'?-1:1)*(stopConfig.stopPrice/s.price-1)):null,
    liquidationPrice:null,liquidationBasis:'account',riskPercent:a.tradingEquity>0?(a.usedMargin+margin)/Math.max(1,a.tradingEquity-openFee)*100:0,
    availableMargin:a.availableMargin,feeRate:FEE_RATE,stopOutLevel:STOP_OUT_LEVEL};
  let error=null;
  if(!tradingOpen(s))error='当前市场已休市';
  else if(!['long','short'].includes(action.type)||![5,10,20,25,50,100].includes(leverage)||(Object.hasOwn(action,'stopPips')?![10,30,50,null].includes(action.stopPips):![.25,.5,1].includes(action.stop))||amountMode&&(!Number.isFinite(action.amount)||action.amount<=0)||!amountMode&&(!Number.isFinite(action.stake)||action.stake<.01||action.stake>1))error='订单参数无效';
  else if(Object.hasOwn(action,'stopPips')&&action.stopPips!==null&&!Number.isFinite(stopConfig.stopPrice))error='止损点数超出有效报价范围';
  else if(limits.noEntry)error='承受力过低，先休息';
  else if(leverage>limits.leverage)error='心理承受力不足，无法使用这个杠杆';
  else if(leverage<limits.minLeverage)error='当前情绪下杠杆至少 25×';
  else if(limits.forceNoStop&&(Object.hasOwn(action,'stopPips')?action.stopPips!==null:action.stop!==1))error='极度亢奋或绝望时只能不设止损';
  else if(margin<100)error='保证金至少需要 ¥100';
  else if(margin+openFee>a.availableMargin+1e-7)error='可用保证金不足（需要预留开仓手续费）';
  else if(margin>maxMargin+1e-7)error='总持仓超过当前心理承受力的风险限额';
  result.error=error;result.valid=!error;
  if(result.valid){result.liquidation=accountLiquidationEstimate(s,{margin,leverage,direction:action.type==='long'?1:-1,entry:s.price});result.liquidationPrice=result.liquidation.price;}
  return result;
}
export function tradingProfit(s){return equity(s)-START-(s.externalFunding||0)+(s.expenses||0)-(s.developer?.profitOffset||0);}
export function mentalReadout(s){
 const personal=Math.max(0,equity(s)-(s.externalFunding||0)+(s.expenses||0)-(s.developer?.profitOffset||0)),peak=Math.max(START,s.peakPersonal||START,personal),recentPeak=Math.max(START*.01,...(s.equityTrail||[personal]),personal),metrics=accountMetrics(s);
 return{value:s.sanity,totalDrawdown:Math.max(0,1-personal/peak),recentDrawdown:Math.max(0,1-personal/recentPeak),exposure:Math.min(1,metrics.notional/Math.max(metrics.tradingEquity,1)/50)};
}
export function mentalState(s, sample=false){
  ensureStory(s);observeTradingTrauma(s,{accountEquity:equity(s)});const modifiers=restrictions(s);
  const personal=Math.max(0,equity(s)-(s.externalFunding||0)+(s.expenses||0)-(s.developer?.profitOffset||0));
  s.peakPersonal=Math.max(START,s.peakPersonal||START,personal);
  s.equityTrail ||= [personal];
  if(sample){s.equityTrail.push(personal);s.equityTrail=s.equityTrail.slice(-48);}
  const recentPeak=Math.max(START*.01,...s.equityTrail,personal);
  const totalDrawdown=Math.max(0,1-personal/s.peakPersonal);
  const recentDrawdown=Math.max(0,1-personal/recentPeak);
  const metrics=accountMetrics(s),exposure=Math.min(1,metrics.notional/Math.max(metrics.tradingEquity,1)/50);
  const earned=Math.max(0,Math.min(35,Math.log2(1+Math.max(0,personal-START)/1000)*5));
  s.sanity=Math.max(0,Math.min(100,Math.round(50+earned+(s.mentalBoost||0)+(s.restRecovery||0)-totalDrawdown*65-recentDrawdown*20-exposure*5-(s.stress||0)-modifiers.stress+modifiers.mental)));
  if((s.restRecovery||0)>0&&equity(s)>=5000)s.sanity=Math.max(6,s.sanity);
  s.sanity=capTraumaSanity(s,s.sanity,equity(s));
  if(s.developer?.edited&&Number.isFinite(s.developer.sanityOverride))s.sanity=Math.max(0,Math.min(100,s.developer.sanityOverride));
  const emotion=mood(s);discoverItems(s);checkStories(s,equity(s),emotion);samplePerformance(s);updateSpeech(s,emotion);
  recordAccountingPoint(s);
  return {value:s.sanity,totalDrawdown,recentDrawdown,exposure};
}
function experience(s, entry) {
  entry={day:s.day,beat:s.beat,...entry};
  if(entry.reversal){s.dayMoments ||= [];s.dayMoments.push({...entry,day:s.day,beat:s.beat});s.dayMoments=s.dayMoments.slice(-40);}
  s.recent.unshift(entry);
  s.recent = s.recent.slice(0, 5);
  s.lastReaction = {type: entry.type, day: s.day, beat: s.beat, risk:entry.risk||0,pnl:entry.pnl??null,positionId:entry.positionId||null,direction:entry.direction??null,reversal:entry.reversal||null};
}
function closePosition(s, fraction, reason, positionId){
  ensureOrders(s);
  const p=positionId?s.positions.find(p=>p.id===positionId):s.positions[0];
  if(!p||fraction<=0||fraction>1)throw Error('没有可平仓位');
  const before=equity(s),margin=p.margin*fraction,raw=positionUnrealized(s,p)*fraction,quantity=isLegacyPosition(p)?null:positionQuantity(p)*fraction;
  const peakUnrealized=p.maxUnrealized*fraction,openFee=p.openFeeRemaining*fraction,closeFee=money((p.notional??p.margin*p.leverage)*fraction*FEE_RATE);
  let pnl=raw-openFee-closeFee;
  let lossReduction=0;
  if(reason==='liquidation'&&s.skills?.mochiko&&pnl<0){lossReduction=-pnl*.25;pnl+=lossReduction;s.protectionPaid=(s.protectionPaid||0)+lossReduction;s.protectionLedger ||= [];s.protectionLedger.push({day:s.day,positionId:p.id,amount:lossReduction});}

  s.cash+=margin+raw-closeFee+lossReduction;s.feesPaid+=closeFee;s.feeLedger.push({day:s.day,beat:Math.min(s.beat,beatsPerDay(s)-1),positionId:p.id,side:'close',amount:closeFee});
  p.notional=(p.notional??p.margin*p.leverage)*(1-fraction);p.initialMargin=(p.initialMargin??p.margin)*(1-fraction);p.margin-=margin;p.maxUnrealized*=1-fraction;p.openFeeRemaining-=openFee;
  if(p.margin<.00001||fraction===1)s.positions=s.positions.filter(order=>order!==p);
  syncPosition(s);
  s.lastTrade={type:reason,positionClosed:!s.positions.some(order=>order.id===p.id),timestamp:currentTradingTimestamp(s),positionId:p.id,direction:p.direction,margin,leverage:p.leverage,entry:p.entry,exit:s.price,
    pnlModel:p.pnlModel||'usd-jpy-v6',quantity,grossPnl:raw,lossReduction,protection:lossReduction>0,openFee,closeFee,fee:openFee+closeFee,feeAllocation:{open:openFee,close:closeFee},nearMiss:!!p.nearMiss,maxUnrealized:peakUnrealized,pnl,day:s.day,beat:Math.min(s.beat,beatsPerDay(s)-1)};
  s.history.push(s.lastTrade);
  const impact=pnl/Math.max(1000,before);
  s.heat=Math.max(0,Math.min(5,(s.heat||0)+(pnl>0?1:-1)));
  const type=pnl>=0?(p.nearMiss||p.recoveredFromLoss?'relieved':impact>.07?'ecstatic':pnl>0?'smug':'calm')
    :reason==='liquidation'||impact<-.07?'despair':peakUnrealized>0?'regretful':'anxious';
  experience(s,{type,impact,risk:p.risk,pnl,positionId:p.id,day:s.day,beat:s.beat});
  return s.lastTrade;
}
function ensurePerformance(s){
  if(s.performance&&s.performance.winRateTrades!==undefined&&s.performance.winningTrades!==undefined)return s.performance;
  const trades=(s.history||[]).filter(t=>t.type!=='open'&&Number.isFinite(t.pnl));
  if(s.performance){
    // Old endless saves may have already trimmed earlier trades. Count only
    // retained evidence, then accumulate future closes without inventing wins.
    if(s.performance.winRateTrades===undefined||s.performance.winningTrades===undefined){const recorded=trades.filter(t=>t.performanceRecorded);s.performance.winRateTrades=recorded.length;s.performance.winningTrades=recorded.filter(t=>t.pnl>0).length;}
    return s.performance;
  }
  let profit=0,peak=START,drawdown=0;
  for(const t of trades){profit+=t.pnl;peak=Math.max(peak,START+profit);drawdown=Math.max(drawdown,1-Math.max(0,START+profit)/peak);}
  return s.performance={totalProfit:profit,closedTrades:trades.length,winningTrades:trades.filter(t=>t.pnl>0).length,winRateTrades:trades.length,maxLoss:Math.min(0,...trades.map(t=>t.pnl)),maxProfit:Math.max(0,...trades.map(t=>t.pnl)),peakEquity:peak,maxDrawdown:drawdown};
}
function samplePerformance(s){
  const stats=ensurePerformance(s),netEquity=Math.max(0,START+tradingProfit(s));
  stats.peakEquity=Math.max(START,stats.peakEquity,netEquity);
  stats.maxDrawdown=Math.max(stats.maxDrawdown,1-netEquity/stats.peakEquity);
}
function trimEndlessLedgers(s){
  if(s.mode!=='endless')return;
  for(const key of ['candles','history','feeLedger','protectionLedger','collateralLedger','expenseLedger'])if(s[key]?.length>256)s[key]=s[key].slice(-256);
}
function protectBalance(s,trades){
  // Cross-margin losses may exceed one order's margin, but cannot consume reserve.
  // A gap can exhaust the trading account; debt relief is explicit in its ledger.
  if(!s.positions.length&&s.cash<0){
    const relief=-s.cash;s.cash=0;s.balanceProtection=(s.balanceProtection||0)+relief;
    const trade=trades.at(-1);if(trade){trade.balanceProtection=relief;trade.pnl+=relief;}
  }
  if(Math.abs(s.cash)<1e-8)s.cash=0;
  const stats=ensurePerformance(s);
  for(const t of trades)if(!t.performanceRecorded){stats.totalProfit+=t.pnl;stats.closedTrades++;stats.winRateTrades++;if(t.pnl>0)stats.winningTrades++;stats.maxLoss=Math.min(stats.maxLoss,t.pnl);stats.maxProfit=Math.max(stats.maxProfit,t.pnl);t.performanceRecorded=true;}
  recordOrderExits(s,trades);samplePerformance(s);trimEndlessLedgers(s);
}
function enforceMargin(s){
  const exits=[];
  while(s.positions.length&&accountMetrics(s).marginLevel<=STOP_OUT_LEVEL){
    const worst=[...s.positions].sort((a,b)=>positionUnrealized(s,a)-positionUnrealized(s,b))[0];
    exits.push(closePosition(s,1,'liquidation',worst.id));
  }
  protectBalance(s,exits);return exits;
}
function closeOrders(s,fraction,reason,positionId){
  ensureOrders(s);const targets=positionId?s.positions.filter(p=>p.id===positionId):[...s.positions];
  if(!targets.length)throw Error('没有可平仓位');
  const trades=targets.map(p=>closePosition(s,fraction,reason,p.id));
  trades.push(...enforceMargin(s));protectBalance(s,trades);mentalState(s);return trades;
}
export function mood(s) {
  const trauma=tradingTrauma(s);if(trauma.active)return trauma.mood;
  const current=s.recent.filter(entry=>entry.day===s.day||(entry.day===undefined&&s.developer?.edited));
  const latest = current[0];
  const weighted = current.reduce((sum,e,i)=>sum+e.impact*[1,.75,.5,.3,.15][i],0);
  const panic=tradingCapitalSafety(s,{accountEquity:equity(s)}).principalIntact&&!s.developer?.edited?'regretful':'despair';
  if (s.sanity<=5) return panic;
  const pressured=pressureMood(s);if(pressured)return pressured;
  if (s.sanity<=15) return panic;
  if(s.sanity>=50&&s.day===1&&s.beat===0&&!s.position&&!latest&&Math.abs(tradingProfit(s))<.01)return 'hopeful';
  if(latest?.day===s.day&&(latest.observedMove||latest.reversal))return latest.type==='despair'?panic:latest.type;
  if (latest?.type==='despair' || weighted<-.17) return panic;
  if (s.sanity<25) return 'anxious';
  if (latest?.type==='ecstatic' && weighted>0 || tradingProfit(s)>START*.15&&s.heat>=3) return 'ecstatic';
  if(positionsOf(s).some(p=>p.risk>=20||positionNetUnrealized(s,p)<-p.margin*.22))return 'nervous';
  if (latest?.day===s.day&&latest?.type==='regretful') return 'regretful';
  if (latest?.day===s.day&&latest?.type==='relieved') return 'relieved';
  if (s.emotionBias?.until>(s.day-1)*4+s.beat) return s.emotionBias.mood;
  if((s.effects||[]).some(e=>e.id==='fatigue'))return 'exhausted';
  if(s.family?.outstanding>0&&s.family.discovered)return 'guilty';
  if (weighted<-.015 || latest?.type==='anxious' && weighted<0) return 'anxious';
  if((s.stress||0)>16&&s.sanity>=25)return 'irritated';
  if (weighted>.02) return 'smug';
  return 'calm';
}
export function currentEvent(s){
 const beat=Math.min(s.beat,beatsPerDay(s)-1),event=s.script.events[beat];
 if(s.swanSeen&&s.lastEvent?.swan&&s.lastEvent.beat===beat)return{...event,...s.lastEvent,source:'汇市紧急快讯'};
 if(s.lastEvent?.beat===beat||s.pending?.beat===beat&&s.pending.flashShown)return{...event,title:event.flash,copy:event.flashCopy};
 return event;
}

export function useProp(s,id){
 ensureStory(s);ensureOrders(s);
 if(!tradingOpen(s)&&!(['day_end','resting','bankrupt'].includes(s.phase)&&id==='father'))throw Error('当前无法使用物品');
 if(!PROPS[id])throw Error('没有这个物品');
 const unavailable=itemUnavailableReason(s,id);if(unavailable)throw Error(unavailable);
 if(!itemUnlocked(s,id))throw Error('这个物品还没获得');
 if(id==='father'){
  if(s.fatherUsed)throw Error('这笔存款已经取过了');
  s.fatherUsed=true;s.cash+=FATHER_SAVINGS;s.externalFunding+=FATHER_SAVINGS;s.stress+=12;s.heat=Math.min(5,s.heat+2);
  s.family.outstanding=FATHER_SAVINGS;s.family.borrowedAt=(s.day-1)*4+s.beat;addEffect(s,'guilt',null);s.family.takenConfirmed=true;
  if(s.phase==='bankrupt')s.phase='day_end';refreshReport(s);mentalState(s);return{id,amount:FATHER_SAVINGS,trades:[],line:'这笔钱要还。'};
 }
 if(s.itemsUsed[id])throw Error('今天已经用过了');
 const cost=PROPS[id].cost||0;if(accountMetrics(s).availableMargin<cost)throw Error('可用资金不足');
 s.cash-=cost;s.expenses+=cost;s.itemsUsed[id]=true;
 if(id==='takeaway')s.mentalBoost=Math.min(50,(s.mentalBoost||0)+10);
 if(id==='celebration')s.mentalBoost=Math.min(50,(s.mentalBoost||0)+20);
 if(id==='noodles')s.livingDiscount=.4;
 if(id==='mochiko')s.skills.mochiko=true;
 if(id==='energy'){
  s.bonusBeats=(s.bonusBeats||0)+1;
  const expanded=planDay(s.seed,s.day,s.script.tracks.at(-1).at(-1).at(-1),beatsPerDay(s),{swanEffects:false,gridVersion:hasCanonicalGrid(s.script)?QUOTE_GRID_VERSION:1});
  s.script.events.push({...expanded.events[0],time:'23:30'});s.script.tracks.push(expanded.tracks[0]);if(hasCanonicalGrid(s.script))s.script.subtracks.push(expanded.subtracks[0]);
 }
 mentalState(s);return{id,cost,trade:null,trades:[],line:PROPS[id].copy};
}
// Explicit game-only after-close decisions. Merely showing/replaying a recap has no effect.
export function chooseRecapAction(s,id){
 ensureStory(s);
 if(!['day_end','resting'].includes(s.phase)||s.dayReport?.day!==s.day||s.mode==='endless')throw Error('只有今天收盘后才能选择生活安排');
 s.recapChoiceLedger ||= [];
 if(s.recapChoiceLedger.some(e=>e.day===s.day&&e.id===id))throw Error('今天已经选择过了');
 const r=s.dayReport,choices=recapChoices({sealed:true,mode:s.mode,daily:{tradingNet:r.net,openingNominal:r.opening},account:{netAssets:equity(s)-debtSummary(s).total}},{cash:accountMetrics(s).availableMargin});
 const choice=choices.find(c=>c.id===id);if(!choice||choice.loan)throw Error('没有这个生活选项');
 if(!choice.enabled)throw Error('可用资金不足');
 if(choice.group&&s.recapChoiceLedger.some(e=>e.day===s.day&&e.group===choice.group))throw Error('今晚已经安排过这一类活动');
 s.cash-=choice.cost;s.expenses+=choice.cost;
 const receipt={day:s.day,id,group:choice.group,cost:choice.cost,timestamp:currentTradingTimestamp(s),label:choice.label};s.recapChoiceLedger.push(receipt);s.recapChoiceLedger=s.recapChoiceLedger.slice(-200);
 if(id==='noodles-next-day')s.nextDayLivingDiscount=.4;
 else if(id==='quiet-night')s.stress=Math.max(0,(s.stress||0)-3);
 else s.mentalBoost=Math.min(50,(s.mentalBoost||0)+Math.min(20,4+Math.log10(1+choice.cost)*2));
 mentalState(s);refreshReport(s);return receipt;
}
export function debtSummary(s){return{family:s.family?.outstanding||0,network:s.loan?.outstanding||0,total:(s.family?.outstanding||0)+(s.loan?.outstanding||0)};}
// Shared game-only quote. Borrowed funds remain liabilities rather than profit.
export function emotionIntensity(s){return Math.max(tradingTrauma(s).intensity,pressureIntensity(s,mood(s)));}
export function networkLoanTerms(s){
 const intensity=emotionIntensity(s);
 const availableCash=accountMetrics(s).availableMargin,networkDebt=s.loan?.outstanding||0;
 const terms=creditTerms({mode:s.mode,assets:equity(s),availableCash,familyDebt:s.family?.outstanding||0,networkDebt,borrowCount:s.loan?.borrowCount??((s.loan?.borrowed||0)>0?1:0),emotionIntensity:intensity});
 // Old interest ledgers can contain a fraction of a cent. An affordable full
 // payoff must clear that exact liability, never strand an unpayable residue.
 if(networkDebt>0&&networkDebt<=availableCash)terms.maxRepayment=networkDebt;
 return terms;
}
const validMoneyAmount=amount=>Number.isFinite(amount)&&Number.isSafeInteger(Math.round(amount*100))&&Math.abs(amount*100-Math.round(amount*100))<1e-6;
export function borrowNetwork(s,amount){
 ensureStory(s);if(!tradingOpen(s)&&!['day_end','resting'].includes(s.phase))throw Error('当前市场已休市');
 if(!s.loan.unlocked)throw Error('还没有发现网络贷款');
 const terms=networkLoanTerms(s);
 if(!validMoneyAmount(amount)||amount<terms.minBorrow||amount>terms.availableCredit)throw Error('借款至少 ¥100，不能超过当前可借额度，最多保留两位小数');
 s.loan.borrowCount=(s.loan.borrowCount??(s.loan.borrowed>0?1:0))+1;
 s.cash+=amount;s.externalFunding+=amount;s.loan.outstanding+=amount;s.loan.borrowed+=amount;s.loan.lastBorrow={day:s.day,amount};s.stress+=3;mentalState(s);refreshReport(s);return{amount,outstanding:s.loan.outstanding};
}
export function repayNetwork(s,amount){
 ensureStory(s);if(!tradingOpen(s)&&!['day_end','resting'].includes(s.phase))throw Error('当前市场已休市');
 if(!Number.isFinite(amount)||amount<=0||amount>Math.min(s.loan.outstanding,accountMetrics(s).availableMargin))throw Error('还款不能超过可支配现金或欠款');
 s.cash-=amount;s.externalFunding-=amount;s.loan.outstanding-=amount;s.loan.repaid+=amount;mentalState(s);refreshReport(s);return{amount,outstanding:s.loan.outstanding};
}
export function nearStopOrders(s){
 const a=accountMetrics(s);return positionsOf(s).map(p=>{
  const loss=Math.max(0,-positionUnrealized(s,p)),threshold=positionStopLoss(p);
  const progress=threshold?loss/threshold:a.marginLevel?STOP_OUT_LEVEL/a.marginLevel:0;
  return{positionId:p.id,loss,threshold,progress,canTopUp:a.availableMargin>=100,maxTopUp:floorMoney(a.availableMargin),kind:threshold?'stop':'liquidation'};
 }).filter(p=>p.progress>=.65);
}
export function topUpMargin(s,id,amount){
 ensureOrders(s);if(!['playing','decision'].includes(s.phase))throw Error('当前无法追加保证金');
 const p=s.positions.find(p=>p.id===id);if(!p)throw Error('没有这个持仓');
 if(!Number.isFinite(amount)||amount<100||amount>accountMetrics(s).availableMargin)throw Error('追加金额超过可用资金');
 const before=equity(s);s.cash-=amount;p.margin+=amount;p.addedMargin=(p.addedMargin||0)+amount;p.leverage=p.notional/p.margin;
 s.collateralLedger ||= [];s.collateralLedger.push({day:s.day,beat:s.beat,positionId:id,amount});mentalState(s);
 return{positionId:id,amount,before,after:equity(s),notional:p.notional,margin:p.margin};
}
export function rescueClose(s,id){
 ensureOrders(s);if(!['playing','decision'].includes(s.phase))throw Error('当前无法提前平仓');
 const before=equity(s),trades=closeOrders(s,1,'rescue',id);return{trade:trades[0],trades,before,after:equity(s),action:'rescue'};
}
export function livingCost(s){
 const wealth=Math.max(0,equity(s));
 const base=wealth<20000?Math.max(100,wealth*.015):wealth<100000?500+(wealth-20000)*.02125:Math.min(50000,2200+(wealth-100000)*.002);
 return money(Math.min(wealth,base*(1-(s.livingDiscount||0))));
}
function refreshReport(s){if(!s.dayReport||s.dayReport.day!==s.day)return;ensureReportLiving(s);const funding=s.externalFunding-s.dayOpeningFunding,costs=s.expenses-s.dayOpeningExpenses;s.dayReport.closing=equity(s);s.dayReport.funding=funding;s.dayReport.costs=costs;s.dayReport.net=Number.isFinite(s.dayReport.closedTradeNet)?s.dayReport.closedTradeNet:equity(s)-s.dayOpening-funding+costs;s.dayReport.externalFunding=s.externalFunding;s.dayReport.tradeNet=s.dayReport.net;s.dayReport.netTradingProfit=s.dayReport.net;sealAccountingDay(s);}
export function quoteRefreshOffer(s,hz){return quotePackageOffer(s,hz,{availableCash:Math.min(Math.max(0,s.cash),accountMetrics(s).availableMargin),canPurchase:tradingOpen(s)||['day_end','resting'].includes(s.phase)});}
export function purchaseQuoteRefresh(s,hz){
 const plan=planQuotePackagePurchase(s,hz,{availableCash:Math.min(Math.max(0,s.cash),accountMetrics(s).availableMargin),canPurchase:tradingOpen(s)||['day_end','resting'].includes(s.phase),timestamp:currentTradingTimestamp(s)});
 if(plan.charged){
  if(!quoteCostRepresentable(s.cash,plan.amount)||!quoteCostRepresentable(s.expenses,plan.amount,{add:true}))throw Error('费用精度不足，未购买行情套餐');
  s.cash-=plan.amount;s.expenses+=plan.amount;s.quotePackageExpense=(s.quotePackageExpense||0)+plan.amount;
 }
 s.quotePackage=plan.package;if(plan.charged){mentalState(s);refreshReport(s);}return plan;
}
export function repayFather(s,amount){ensureStory(s);if(!tradingOpen(s)&&!['day_end','resting'].includes(s.phase))throw Error('当前市场已休市');if(!Number.isFinite(amount)||amount<=0||amount>accountMetrics(s).availableMargin||amount>s.family.outstanding)throw Error('归还金额超过可用资金或欠款');const wasInformed=s.family.informed||s.family.discovered;s.cash-=amount;s.externalFunding-=amount;s.family.outstanding-=amount;s.family.repaid+=amount;s.family.lastRepayment={amount,outstanding:s.family.outstanding,wasInformed,day:s.day,beat:s.beat};s.family.informed=true;s.story.queue=s.story.queue.filter(id=>id!=='fatherFound');s.family.trust+=amount/FATHER_SAVINGS;
 const full=s.family.outstanding<.00001;if(full){s.family.outstanding=0;s.effects=s.effects.filter(e=>e.id!=='guilt');s.story.queue=s.story.queue.filter(id=>id!=='fatherFound'&&id!=='repayPartial');}
 queueStory(s,full?'repayFull':'repayPartial');s.emotionBias={mood:full?'determined':'guilty',until:(s.day-1)*4+s.beat+2};mentalState(s);refreshReport(s);return{amount,outstanding:s.family.outstanding,full};}
export function reply(s, channel, choice) {
  if(!['decision','closing','day_end','resting'].includes(s.phase)||!['group','friend','campus'].includes(channel))throw Error('行情播放时不能聊天');
  ensureStory(s);
  if(channel==='friend'&&['disclose_position','disclose_debt','disclose_greed','confess'].includes(choice)){
    const key=choice==='disclose_position'?'position':choice==='disclose_greed'?'greed':'debt';
    if(key==='position'&&!s.position)throw Error('现在没有持仓可告知');
    if(key==='debt'&&!(s.family.outstanding>0))throw Error('现在没有欠款可告知');
    if(key==='greed'&&!(tradingProfit(s)>0||unrealized(s)>0))throw Error('这句话需要实际盈利');
    s.disclosures ||= {};s.disclosures[key]={day:s.day,beat:s.beat};
    return appendDialogue(s,channel,'friend.'+key);
  }
  if(channel==='campus'&&['class','lunch','hide'].includes(choice)){s.relationship+=choice==='hide'?0:1;s.stress=Math.max(0,s.stress+(choice==='hide'?2:-3));s.emotionBias={mood:choice==='hide'?'lonely':choice==='class'?'focused':'warm',until:(s.day-1)*4+s.beat+1};return appendDialogue(s,channel,'campus.'+choice);}
  if(channel==='group'){
    if(choice==='meme')return appendDialogue(s,channel,'group.meme');
    if(choice==='ask')return appendDialogue(s,channel,'group.ask');
    if(choice==='stance'){
      const direction=s.position?.direction||1;s.publicStance={day:s.day,beat:s.beat,direction};
      return appendDialogue(s,channel,direction===1?'group.stance.long':'group.stance.short');
    }
    if(choice==='share'){
      const profit=tradingProfit(s),risk=Math.round(accountMetrics(s).usedMargin/Math.max(equity(s),1)*100);
      const yen=n=>(n<0?'−':'')+'¥'+Math.abs(Math.round(n)).toLocaleString('zh-CN');
      return appendDialogue(s,channel,'group.share.'+(profit>1?'win':profit< -1?'loss':'flat'),{equity:yen(equity(s)),risk:risk+'%',profit:(profit>0?'+':'')+yen(profit)});
    }
    throw Error('不支持的群聊回复');
  }
  if(['talk','study','walk','confess'].includes(choice)){if(choice==='confess'&&!(s.family.outstanding>0))throw Error('现在没有这件事可说');s.relationship++;s.stress=Math.max(0,s.stress-4);s.emotionBias={mood:choice==='study'?'focused':choice==='confess'?'guilty':'warm',until:(s.day-1)*4+s.beat+1};return appendDialogue(s,channel,'friend.'+choice);}
  if(choice==='promise'){s.promise='break_even';s.promiseNoted=false;return appendDialogue(s,channel,'friend.promise');}
  if(choice==='small'){s.promise='small';s.promiseNoted=false;return appendDialogue(s,channel,'friend.small');}
  if(choice==='dinner'){s.relationship++;s.dinner=true;return appendDialogue(s,channel,'friend.dinner');}
  throw Error('不支持的单聊回复');
}
function validateAction(s,action){
  if(!tradingOpen(s))throw Error('当前市场已休市');
  if(!['long','short','hold','wait','half','close'].includes(action.type))throw Error('当前操作不可用');
  if(['long','short'].includes(action.type)){
    const preview=orderPreview(s,action);if(!preview.valid)throw Error(preview.error);return preview;
  }
  if(['half','close'].includes(action.type)&&(!positionsOf(s).length||action.positionId&&!positionsOf(s).some(p=>p.id===action.positionId)))throw Error('没有可平仓位');
  return null;
}
export function takeAction(s,action){
  ensureRunStatistics(s);
  const preview=validateAction(s,action),live=s.realtime===true&&s.phase==='playing';ensureOrders(s);
  const before=equity(s);let trade=null,trades=[];
  if(action.type==='long'||action.type==='short'){
    const {margin,openFee}=preview;s.cash-=margin+openFee;if(Math.abs(s.cash)<1e-8)s.cash=0;s.feesPaid+=openFee;s.feeLedger.push({day:s.day,beat:s.beat,positionId:'order-'+s.nextOrderId,side:'open',amount:openFee});
    const p={id:'order-'+s.nextOrderId++,direction:action.type==='long'?1:-1,entry:s.price,pnlModel:'usd-jpy-v6',margin,initialMargin:margin,notional:margin*action.leverage,leverage:action.leverage,
      ...orderStop(s,action),risk:margin/Math.max(1,accountMetrics(s).tradingEquity+margin)*action.leverage,
      openFee,openFeeRemaining:openFee,maxUnrealized:0,nearMiss:false,day:s.day,beat:s.beat};
    s.positions.push(p);syncPosition(s);s.nextStop=null;
    s.lastTrade={type:'open',positionId:p.id,direction:p.direction,margin,leverage:p.leverage,entry:p.entry,pnlModel:p.pnlModel,quantity:positionQuantity(p),openFee,fee:openFee,day:s.day,beat:s.beat};
    trade=s.lastTrade;trades=[trade];recordOrderOpened(s,trade);
    if(action.leverage>=50){s.stress+=action.leverage===100?8:4;s.restRecovery=Math.max(0,(s.restRecovery||0)-4);}
    s.heat=Math.min(5,s.heat+(action.leverage>=50?2:1));
  }else if(action.type==='half'||action.type==='close'){
    trades=closeOrders(s,action.type==='half'?.5:1,action.type,action.positionId);trade=trades[0];
  }else if(action.type==='wait'&&!live){s.stress=Math.max(0,s.stress-3);s.heat=Math.max(0,s.heat-1);if(s.mode==='endless')s.restRecovery=Math.min(32,(s.restRecovery||0)+1);}
  if(live){if(trade)s.pending.traded=true;}else beginSegment(s,action.type,before);
  mentalState(s);
  return {trade,trades,before,after:equity(s),action:action.type};
}
function beginSegment(s,action='market',before=equity(s)){
  s.pending={beat:s.beat,candle:0,tick:0,...(hasCanonicalGrid(s.script)?{subtick:0}:{}),action,before,flashShown:false,flatAtStart:!s.position,startPrice:s.price,traded:false};
  s.phase='playing';
}
export function enableRealtime(s){s.realtime=true;s.marketPaused=!!s.marketPaused;return s;}
export function advanceQuote(s){
  if(s.marketPaused)throw Error('实时行情已暂停');
  if(!s.realtime||!tradingOpen(s))throw Error('当前没有实时行情');
  if(s.phase==='decision')beginSegment(s);
  const result=advanceQuoteTick(s);
  if(s.phase==='decision')beginSegment(s);
  return result;
}
export function advanceMarket(s){
  if(s.marketPaused)throw Error('实时行情已暂停');
  if(!s.realtime||!tradingOpen(s))throw Error('当前没有实时行情');
  if(s.phase==='decision')beginSegment(s);
  const result=advanceTick(s);
  if(s.phase==='decision')beginSegment(s);
  return result;
}
function appendChatAfterBeat(s){
  const first=s.candles.at(-CANDLES_PER_BEAT),delta=s.price/(first?.open||s.price)-1;
  appendDialogue(s,'group','group.market.'+(Math.abs(delta)<.0005?'flat':delta>0?'up':'down'));
  if(s.publicStance?.day===s.day&&s.publicStance.beat===s.beat-1&&Math.abs(delta)>=.0005){
    const correct=s.publicStance.direction===(delta>=0?1:-1);
    appendDialogue(s,'group','group.stance.'+(correct?'correct':'wrong'));
  }
  if(s.promise&&!s.promiseNoted){
    s.promiseNoted=true;
    appendDialogue(s,'friend','friend.remind.'+(s.promise==='small'?'small':'break_even'));
  }
  updateSpeech(s,mood(s),true);
}
function accrueLoanInterest(s,living=0){
  // Charge once per completed simulated day. Unpaid interest becomes debt;
  // matching external funding keeps finance costs out of trading performance.
  if(s.loan?.lastInterestDay===s.day)return{interest:0,interestPaid:0,interestAccrued:0};
  const terms=networkLoanTerms(s),interestRate=terms.dailyRate,interest=terms.estimatedDailyInterest;
  const interestPaid=Math.min(Math.max(0,s.cash-living),interest),interestAccrued=interest-interestPaid;
  s.cash-=interestPaid;s.expenses+=interest;
  if(s.loan){
    s.loan.lastInterestDay=s.day;s.loan.lastInterestRate=interestRate;
    if(interestAccrued){s.loan.outstanding+=interestAccrued;s.externalFunding+=interestAccrued;}
    s.loan.interestPaid=(s.loan.interestPaid||0)+interestPaid;s.loan.interestAccrued=(s.loan.interestAccrued||0)+interestAccrued;
  }
  return{interest,interestPaid,interestAccrued,interestRate};
}
// End only this story day at the current executable quote. Never replay unseen
// ticks, invent completed candles, or allow a repeated click to charge twice.
export function finishTradingDay(s){
  if(s.mode==='endless')throw Error('操盘模式连续运行，不进行日结算');
  if(s.dayReport?.day===s.day&&['day_end','resting','ending'].includes(s.phase))return s.dayReport;
  if(!tradingOpen(s)&&s.phase!=='closing')throw Error('今天已经结束');
  if(s.phase!=='closing')s.earlyClose={day:s.day,beat:s.beat,candle:s.pending?.candle||0,tick:s.pending?.tick||0,price:s.price,timestamp:currentTradingTimestamp(s)};
  ensureOrders(s);enforceMargin(s);
  s.pending=null;s.phase='closing';
  return settleDay(s);
}
export function settleDay(s) {
  if(s.mode==='endless')throw Error('操盘模式不进行日结算');
  if(s.phase!=='closing')throw Error('请等待今日行情结束，再全平收盘');
  if(positionsOf(s).length)closeOrders(s,1,'closing');
  s.cash+=s.reserve;s.reserve=0;
  const livingEstimate=livingCost(s),{interest,interestPaid,interestAccrued,interestRate}=accrueLoanInterest(s,livingEstimate);
  // Interest is accounted for now; living costs are a pending obligation until
  // the narrative page has applied its non-financial effects.
  s.expenseLedger ||= [];s.expenseLedger.push({day:s.day,living:0,interest,interestRate,livingStatus:'pending'});
  if(s.dinner)appendDialogue(s,'friend','friend.day.end');
  mentalState(s,true);
  const closing=equity(s),funding=s.externalFunding-s.dayOpeningFunding,costs=s.expenses-s.dayOpeningExpenses;
  s.dayReport={day:s.day,beat:s.beat,bonusBeats:s.bonusBeats||0,opening:s.dayOpening,closing,net:closing-s.dayOpening-funding+costs,funding,costs,
    livingCost:0,pendingLivingCost:livingEstimate,openingNetAssets:dailyReturnMetrics(s,{report:null}).denominator,openingDebt:Number.isFinite(s.dayOpeningDebt)?s.dayOpeningDebt:null,interest,interestPaid,interestAccrued,interestRate,tradeNet:closing-s.dayOpening-funding+costs,netTradingProfit:closing-s.dayOpening-funding+costs,trades:s.history.filter(t=>t.day===s.day), mood:mood(s), promise:s.promise,externalFunding:s.externalFunding,
    openingLine:s.dayOpeningLine,closingLine:s.speech.text,fees:s.feeLedger.filter(t=>t.day===s.day).reduce((sum,t)=>sum+t.amount,0),feesPaid:s.feeLedger.filter(t=>t.day===s.day).reduce((sum,t)=>sum+t.amount,0),totalFeesPaid:s.feesPaid,
    moments:(s.dayMoments||[]).filter(t=>t.day===s.day),peak:s.history.filter(t=>t.day===s.day).reduce((a,t)=>!a||Math.abs(t.pnl||0)>Math.abs(a.pnl||0)?t:a,null)};
  if(s.earlyClose?.day===s.day)s.dayReport.earlyClose={...s.earlyClose};
  s.dayReport.closedTradeNet=s.dayReport.net;
  const quote=dayLivingQuote(s,s.dayReport,livingDayRoll(s.seed,s.day));
  s.dayReport.livingSettlement={version:1,day:s.day,status:'pending',quote};s.dayReport.pendingLivingCost=quote.amount;
  s.completedDays=Math.max(s.completedDays||0,s.day-1);s.dayReport.performance={...s.performance};s.dayReport.completedCandles=s.completedCandles;s.dayReport.completedDays=s.completedDays;s.phase='day_end';sealAccountingDay(s);return s.dayReport;
}
function dayLivingQuote(s,report,roll){
 const knowsFriend=s.story?.seen?.includes('friendStudy')||s.story?.log?.some(entry=>entry.id==='friendStudy')||s.itemUnlocks?.mochiko?.event==='friendStudy';
 return quoteLivingMeal({seed:s.seed,day:report.day,baseAmount:livingCost(s),cash:Math.max(0,s.cash),openingNetAssets:dailyReturnMetrics(s,{report}).denominator,tradingNet:report.closedTradeNet??report.net,knowsFriend,lastSpecialDay:s.livingPolicy?.lastSpecialDay??null,discount:s.livingDiscount||0,roll});
}
function ensureReportLiving(s){
 const report=s.dayReport;if(!report||!Number.isSafeInteger(report.day)||report.day<1)return null;
 if(report.livingSettlement)return report.livingSettlement;
 // Old closed statements already include their living cost. Annotate only;
 // never refund them, reroll a meal, or reconstruct missing financial history.
 const amount=Number.isFinite(report.livingCost)?Math.max(0,report.livingCost):0;
 const receipt={id:`living:${s.seed}:${report.day}`,day:report.day,amount,kind:'legacy',label:'生活费（已结）',seedLocked:true,legacy:true,assetsBefore:null,assetsAfter:Number.isFinite(report.closing)?report.closing:null,netAssetsBefore:null,netAssetsAfter:null};
 report.livingSettlement={version:1,day:report.day,status:'legacy-paid',quote:{version:1,day:report.day,amount,baseAmount:amount,kind:'legacy',label:receipt.label,seedLocked:true},receipt};report.pendingLivingCost=0;
 return report.livingSettlement;
}
export function finalizeDayLiving(s){
 if(s.mode==='endless')return{charged:false,amount:0,receipt:null};
 if(!['day_end','resting','ending'].includes(s.phase))throw Error('先完成今日交易结算');
 const report=s.dayReport;
 if(!report||report.day!==s.day){if(s.livingLegacyCompletedDay===s.day)return{charged:false,amount:0,receipt:null};throw Error('没有今天的生活费结算');}
 const settlement=ensureReportLiving(s);
 if(!validLivingSettlement(settlement,s.day))throw Error('生活费账单损坏，未扣款');
 if(settlement.status!=='pending')return{charged:false,amount:settlement.receipt.amount,receipt:settlement.receipt};
 const ledger=s.expenseLedger?.findLast(row=>row.day===s.day&&row.livingStatus==='pending');
 if(!ledger||ledger.living!==0)throw Error('生活费流水不一致，未重复扣款');
 const quote=dayLivingQuote(s,report,settlement.quote.roll),amount=quote.amount,assetsBefore=equity(s),netAssetsBefore=assetsBefore-debtSummary(s).total;
 // One synchronous state transition. Animation/playback never commits money.
 s.cash-=amount;s.expenses+=amount;s.livingPaid=(s.livingPaid||0)+amount;
 report.livingCost=amount;report.pendingLivingCost=0;settlement.status='finalized';settlement.quote=quote;
 const receipt={id:`living:${s.seed}:${s.day}`,day:s.day,amount,baseAmount:quote.baseAmount,kind:quote.kind,label:quote.label,seedLocked:true,roll:quote.roll,assetsBefore,assetsAfter:equity(s),netAssetsBefore,netAssetsAfter:equity(s)-debtSummary(s).total,timestamp:currentTradingTimestamp(s)};
 settlement.receipt=receipt;ledger.living=amount;ledger.livingStatus='finalized';ledger.livingReceipt=receipt.id;
 if(['feast','friend-treat'].includes(quote.kind))s.livingPolicy={version:1,lastSpecialDay:s.day};
 s.completedDays=Math.max(s.completedDays||0,equity(s)>=MIN_EQUITY&&(report.beat>=BEATS_PER_DAY+(report.bonusBeats||0)||report.earlyClose?.day===s.day)?s.day:s.day-1);report.completedDays=s.completedDays;
 mentalState(s,true);refreshReport(s);return{charged:true,amount,receipt};
}
export function beginRest(s){if(s.phase!=='day_end')throw Error('先完成全平收盘');s.phase='resting';mentalState(s);return pendingStory(s);}
export function finishEndlessCampaign(s){
  if(s.mode!=='endless')throw Error('剧情模式先完成今晚结算');
  if(s.phase==='ending'&&s.ending)return s.ending;
  if(!['decision','playing'].includes(s.phase))throw Error('当前无法收手离场');
  const timestamp=currentTradingTimestamp(s);
  ensureOrders(s);enforceMargin(s);if(positionsOf(s).length)closeOrders(s,1,'closing');
  // Exiting is not a new quote/day boundary: no invented candle, interest,
  // recovery tick or completed survival day. Keep the run and its liabilities.
  s.pending=null;s.marketPaused=true;s.phase='ending';mentalState(s);
  s.ending={id:'walkaway',day:s.day,equity:equity(s),profit:tradingProfit(s),sanity:s.sanity,timestamp};
  return s.ending;
}
export function finishCampaign(s,id='walkaway'){
  if(!['day_end','resting'].includes(s.phase)||pendingStory(s))throw Error('先完成今晚的休息事件');
  if(!['million','walkaway','broke','crisis'].includes(id))throw Error('未知结局');
  finalizeDayLiving(s);
  s.ending={id,day:s.day,equity:equity(s),profit:tradingProfit(s),sanity:s.sanity};s.phase='ending';return s.ending;
}
export function endingCondition(s){if(s.mode==='endless')return equity(s)<MIN_EQUITY?'broke':null;return s.sanity<=5&&equity(s)<5000?'crisis':equity(s)<MIN_EQUITY?'broke':tradingProfit(s)>=TARGET_PROFIT?'million':null;}
export function advanceTick(s){
  const samples=[];let result;
  do{result=advanceQuoteTick(s);samples.push(result);}while(!result.logicalSecondEnded&&s.phase==='playing');
  const exits=samples.flatMap(r=>r.exits||[]);return{...result,exits,exit:exits[0]||null};
}
function advanceQuoteTick(s) {
  if(s.phase!=='playing'||!s.pending)throw Error('当前没有待播放行情');
  const p=s.pending,points=s.script.tracks[p.beat][p.candle];
  const fine=hasCanonicalGrid(s.script),subtick=fine?(p.subtick??0):0,lastSubtick=!fine||subtick===QUOTE_SUBSTEPS-1;
  const price=quoteSubstep(s.script,{...p,subtick});
  let candle=s.candles.at(-1);
  if(p.tick===0&&subtick===0){candle={open:s.price,close:s.price,high:s.price,low:s.price,closed:false,day:s.day,beat:p.beat};stampCandleTime(s,candle,p);s.candles.push(candle);}
  stampQuoteTime(s,p,fine?(subtick+1)/QUOTE_SUBSTEPS:1);s.price=price;candle.close=price;candle.high=Math.max(candle.high,price);candle.low=Math.min(candle.low,price);
  ensureOrders(s);const exits=[];
  for(const pos of s.positions){
   const unreal=positionNetUnrealized(s,pos),last=pos.lastDirectionalFloating??pos.lastFloating??0;pos.maxUnrealized=Math.max(pos.maxUnrealized,unreal);
   if(!lastSubtick)continue;
   const meaningful=Math.max(5,(pos.notional||0)*.00003);
   if(unreal<-pos.margin*.65)pos.nearMiss=true;
   if(last>meaningful&&unreal<-meaningful){pos.profitToLoss=true;experience(s,{type:'stunned',impact:unreal/Math.max(1000,equity(s)),risk:pos.risk,positionId:pos.id,direction:pos.direction,reversal:'profit-to-loss',pnl:unreal});}
   if(last<-meaningful&&unreal>meaningful){pos.recoveredFromLoss=true;experience(s,{type:'relieved',impact:unreal/Math.max(1000,equity(s)),risk:pos.risk,positionId:pos.id,direction:pos.direction,reversal:'loss-to-profit',pnl:unreal});}
   pos.lastFloating=unreal;if(Math.abs(unreal)>meaningful)pos.lastDirectionalFloating=unreal;
  }
  exits.push(...enforceMargin(s));
  for(const pos of [...s.positions])if(Object.hasOwn(pos,'stopPips')&&Number.isFinite(pos.stopPrice)?(s.price-pos.stopPrice)*pos.direction<=0:pos.stop<1&&positionUnrealized(s,pos)<=-pos.margin*pos.stop)exits.push(closePosition(s,1,'stop',pos.id));
  exits.push(...enforceMargin(s));protectBalance(s,exits);let exit=exits[0]||null;
  if(!lastSubtick){p.subtick=subtick+1;if(exits.length)mentalState(s);return{price,candleClosed:false,beatEnded:false,dayEnded:false,exit,exits,flash:null,equity:equity(s),mood:mood(s),logicalSecondEnded:false,subtick};}
  if(fine)p.subtick=0;
  let flash=null;
  if(p.candle===NEWS_FLASH_CANDLE&&p.tick===NEWS_FLASH_TICK&&!p.flashShown&&!(s.lastEvent?.swan&&s.lastEvent.beat===p.beat)){p.flashShown=true;const e=s.script.events[p.beat];flash={title:e.flash,copy:e.flashCopy,chain:e.chain,beat:p.beat};s.lastEvent=flash;}
  const swan=s.script.swan;if(swan&&swan.beat===p.beat&&swan.candle===p.candle&&swan.tick===p.tick){s.swanSeen=true;flash={...swan,swan:true,chain:swan.name};s.lastEvent=flash;s.emotionBias={mood:'stunned',until:(s.day-1)*4+s.beat+2};appendDialogue(s,'group','group.swan.'+(swan.delta>0?'up':'down'));}
  mentalState(s,true);
  p.tick++;
  let candleClosed=false,beatEnded=false,dayEnded=false;
  if(p.tick>=points.length){candle.closed=true;candleClosed=true;s.completedCandles=(s.completedCandles||0)+1;p.tick=0;p.candle++;trimEndlessLedgers(s);}
  if(p.candle>=CANDLES_PER_BEAT){
    if(p.flatAtStart&&!p.traded&&!s.position){const observedMove=s.price/(p.startPrice||s.price)-1;if(Math.abs(observedMove)>=.004)experience(s,{type:observedMove>0?'regretful':'relieved',impact:0,observedMove,day:s.day,beat:s.beat});}
    if(s.realtime&&!s.position&&!p.traded){if(s.mode==='endless')recoverTradingTrauma(s,{kind:'flat-segment',segment:(s.day-1)*4+s.beat});s.stress=Math.max(0,s.stress-1);s.heat=Math.max(0,s.heat-1);if(s.mode==='endless')s.restRecovery=Math.min(32,(s.restRecovery||0)+1);}
    s.beat++;s.pending=null;beatEnded=true;ageEffects(s);mentalState(s);appendChatAfterBeat(s);
    if(s.mode==='endless'){
      if(s.beat>=BEATS_PER_DAY){
        const cost=accrueLoanInterest(s);
        if(cost.interest){s.expenseLedger ||= [];s.expenseLedger.push({day:s.day,living:0,...cost});}
        exits.push(...enforceMargin(s));protectBalance(s,exits);exit ||= exits[0]||null;mentalState(s);trimEndlessLedgers(s);
      }
      if(equity(s)<MIN_EQUITY){
        if(s.positions.length)closeOrders(s,1,'closing');
        s.ending={id:'broke',day:s.day,equity:equity(s),profit:tradingProfit(s),sanity:s.sanity};s.phase='ending';
      }else if(s.beat>=BEATS_PER_DAY){
        recordAccountingDay(s);s.completedDays=(s.completedDays||0)+1;s.day++;s.beat=0;s.dayOpening=equity(s);s.dayOpeningBasisUnknown=false;s.dayOpeningDebt=debtSummary(s).total;s.dayOpeningNetAssets=s.dayOpening-s.dayOpeningDebt;s.dayOpeningFunding=s.externalFunding;s.dayOpeningExpenses=s.expenses;
        s.script=planDay(s.seed,s.day,s.price);s.lastEvent=null;s.swanSeen=false;s.itemsUsed={};s.skills={mochiko:false,yasuko:false};s.bonusBeats=0;s.phase='decision';mentalState(s);
      }else s.phase='decision';
    }else if(s.beat>=beatsPerDay(s)||equity(s)<MIN_EQUITY||s.sanity<=0){s.phase='closing';dayEnded=true;}
    else s.phase='decision';
  }
  return{price,candleClosed,beatEnded,dayEnded,exit,exits,flash,equity:equity(s),mood:mood(s),logicalSecondEnded:true,subtick};
}
export function finishSegment(s) {
  const results=[];
  while(s.phase==='playing')results.push(advanceTick(s));
  return results;
}
export function nextDay(s) {
  if(s.phase!=='resting')throw Error('请先休市休息');
  if(pendingStory(s))throw Error('先回应今晚的事件');
  finalizeDayLiving(s);
  mentalState(s);
  const ending=endingCondition(s);if(ending){finishCampaign(s,ending);return s;}
  recoverTradingTrauma(s,{kind:'rest'});
  s.day++;s.beat=0;s.phase='decision';s.dayOpening=equity(s);s.dayOpeningBasisUnknown=false;s.dayOpeningDebt=debtSummary(s).total;s.dayOpeningNetAssets=s.dayOpening-s.dayOpeningDebt;s.dayOpeningFunding=s.externalFunding;s.dayOpeningExpenses=s.expenses;s.stress=Math.max(0,s.stress-4);s.restRecovery=Math.min(32,(s.restRecovery||0)+8);s.heat=0;

  s.bonusBeats=0;s.livingDiscount=s.nextDayLivingDiscount||0;delete s.nextDayLivingDiscount;delete s.earlyClose;
  const living=Math.min(livingCost(s),Math.max(0,s.cash));s.cash-=living;s.reserve=living;
  s.script=planDay(s.seed,s.day,s.price);s.skills={mochiko:false,yasuko:false};s.itemsUsed={};s.nextStop=null;
  s.dayMoments=[];s.lastEvent=null;s.swanSeen=false;s.lastReaction=null;s.pending=null;s.promise=null;s.promiseNoted=false;s.dinner=false;s.publicStance=null;
  appendDialogue(s,'friend','friend.day.start');updateSpeech(s,mood(s),true);
  mentalState(s);s.dayOpeningLine=s.speech.text;return s;
}
function refreshNewsCopy(s){
  for(const [i,event] of (s.script.events||[]).entries()){
    const chain=CHAINS.find(c=>c.id===event.id);
    if(!chain||!VARIANTS.includes(event.variant)||!Object.values(event).some(value=>typeof value==='string'&&/模拟|本虚构情景|本情景|交易活跃度/.test(value)))continue;
    const [title,copy]=chain[event.variant];
    Object.assign(event,{chain:chain.name,title:i%2?title:chain.lead,copy:i%2?copy:chain.leadCopy,source:chain.source,flash:i%2?`${chain.name}：市场继续评估后续影响`:title,flashCopy:copy});
  }
  for(const event of [s.script.swan,s.lastEvent]){
    if(!event?.id)continue;
    const canonical=BLACK_SWANS.find(c=>c.id===event.id);
    if(canonical&&/模拟|本虚构情景|本情景|买卖价差迅速扩大|开盘向下跳空|后续报价仍很稀疏/.test(event.title+' '+event.copy))Object.assign(event,{title:canonical.title,copy:canonical.copy,name:canonical.name});
  }
  if(s.lastEvent&&!s.lastEvent.swan&&/模拟|本虚构情景|本情景|交易活跃度/.test(s.lastEvent.title+' '+s.lastEvent.copy)){
    const event=s.script.events.findLast((event,i)=>i<=(s.pending?.beat??s.beat)&&event.chain===s.lastEvent.chain);
    if(event){const chain=CHAINS.find(c=>c.id===event.id);if(chain)Object.assign(s.lastEvent,{title:s.lastEvent.title.includes('交易活跃度')?`${chain.name}：市场继续评估后续影响`:chain[event.variant][0],copy:chain[event.variant][1],chain:chain.name});}
  }
}
export function restoreGame(raw) {
  try {
    let s=JSON.parse(raw);const oldVersion=s?.version,openingSnapshot=dailyReturnMetrics(s||{},{report:null});
    if(s&&[2,3].includes(s.version)&&Number.isFinite(s.cash)&&s.cash<0)return null;
    if(s&&Number.isFinite(s.cash)&&s.cash<0&&s.cash>=-1e-8)s.cash=0;
    if(!s||![2,3,4,5,6,7,VERSION].includes(s.version)||!Number.isFinite(s.seed)||!Number.isFinite(s.price)||s.price<=0||!Number.isFinite(s.cash)||!Array.isArray(s.candles)||!s.script?.tracks||!['decision','playing','closing','day_end','resting','ending','bankrupt'].includes(s.phase))return null;
    if(!validQuoteGrid(s.script))return null;const packageState=quotePackageState(s);if(packageState.paid>0&&(!Number.isFinite(s.quotePackageExpense)||s.quotePackageExpense!==packageState.paid||!Number.isFinite(s.expenses)||s.expenses+1e-6<packageState.paid))return null;
    if(s.phase==='playing'&&hasCanonicalGrid(s.script)&&(!Number.isInteger(s.pending?.subtick)||s.pending.subtick<0||s.pending.subtick>=QUOTE_SUBSTEPS))return null;
    if(s.phase==='playing'&&(!s.pending||!Number.isInteger(s.pending.beat)||!Number.isInteger(s.pending.candle)||!Number.isInteger(s.pending.tick)||!Number.isFinite(s.script.tracks[s.pending.beat]?.[s.pending.candle]?.[s.pending.tick])))return null;
    if(s.phase==='playing'&&hasCanonicalGrid(s.script)&&s.pending.subtick>0&&(!Number.isFinite(s.sanity)||s.sanity<0||s.sanity>100||!Number.isFinite(s.peakPersonal)||!Array.isArray(s.equityTrail)||!s.equityTrail.every(v=>Number.isFinite(v)&&v>=0)||s.candles.at(-1)?.closed!==false))return null;
    if(s.version===2){delete s.positions;s=migrateV2(s);}
    if(s.version<4){delete s.positions;s.version=VERSION;}
    if(oldVersion<5){s.nextStop=null;s.version=VERSION;s.mentalBoost ||= 0;s.bonusBeats ||= 0;s.itemDiscoveries={...s.itemUnlocks};s.effects=(s.effects||[]).filter(e=>['guilt','familyWatch'].includes(e.id));}
    if(oldVersion<6){migrateInverseQuotes(s);s.version=VERSION;}
    if(!s.mode)s.mode='story';if(!['story','endless'].includes(s.mode))return null;
    s.startEquity ??= START;s.completedCandles ??= Math.max(0,(s.day-1)*16+s.beat*4+(s.pending?.candle||0));s.completedDays ??= Math.max(0,s.day-1+(s.mode==='story'&&['day_end','resting','ending'].includes(s.phase)&&s.beat>=beatsPerDay(s)&&equity(s)>=MIN_EQUITY?1:0));
    if(!Number.isSafeInteger(s.completedCandles)||s.completedCandles<0||!Number.isSafeInteger(s.completedDays)||s.completedDays<0)return null;
    if(s.mode==='endless'&&['closing','day_end','resting'].includes(s.phase))return null;
    if(s.mode==='endless'&&s.reserve){s.cash+=s.reserve;s.reserve=0;}
    ensureOrders(s);ensureRunStatistics(s);ensurePerformance(s);
    if(!Number.isSafeInteger(s.performance.winRateTrades)||s.performance.winRateTrades<0||s.performance.winRateTrades>s.performance.closedTrades||!Number.isSafeInteger(s.performance.winningTrades)||s.performance.winningTrades<0||s.performance.winningTrades>s.performance.winRateTrades)return null;
    if(!Number.isFinite(s.performance.totalProfit)||!Number.isInteger(s.performance.closedTrades)||s.performance.closedTrades<0||!Number.isFinite(s.performance.maxLoss)||s.performance.maxLoss>0||!Number.isFinite(s.performance.maxProfit)||s.performance.maxProfit<0||!Number.isFinite(s.performance.peakEquity)||s.performance.peakEquity<START||!Number.isFinite(s.performance.maxDrawdown)||s.performance.maxDrawdown<0||s.performance.maxDrawdown>1)return null;
    const ids=new Set();
    for(const p of s.positions){
      if(![undefined,'usd-jpy-v6','legacy-inverse-v5'].includes(p.pnlModel)||typeof p.id!=='string'||ids.has(p.id)||![1,-1].includes(p.direction)||!Number.isFinite(p.entry)||p.entry<=0||!Number.isFinite(p.margin)||p.margin<=0||!Number.isFinite(p.leverage)||p.leverage<=0||p.leverage>100||!Number.isFinite(p.notional)||p.notional<=0||![.25,.5,1].includes(p.stop)||(Object.hasOwn(p,'stopPips')&&![10,30,50,null].includes(p.stopPips))||(p.stopPrice!==undefined&&p.stopPrice!==null&&(!Number.isFinite(p.stopPrice)||p.stopPrice<=0))||!Number.isFinite(p.openFeeRemaining)||p.openFeeRemaining<0)return null;
      ids.add(p.id);
    }
    // In cross margin, realizing the losing hedge can make cash negative while
    // its still-open winner covers it. Preserve that valid asset-backed ledger.
    if(s.cash<0&&(!s.positions.length||!Number.isFinite(accountMetrics(s).tradingEquity)||accountMetrics(s).tradingEquity<=0))return null;
    if(!Number.isFinite(s.feesPaid)||s.feesPaid<0||!Number.isInteger(s.nextOrderId)||s.nextOrderId<1)return null;
    while(ids.has('order-'+s.nextOrderId))s.nextOrderId++;
    if(!Number.isFinite(s.reserve)||s.reserve<0||!Number.isFinite(s.externalFunding)||!Array.isArray(s.equityTrail)||!s.chat?.group||!s.chat?.friend)return null;
    if(!s.dialogueMemory){s.archivedChat=s.chat;chapterChat(s);s.speech=null;}
    if(s.phase==='bankrupt')s.phase='day_end';
    if(s.phase==='ending'&&(!s.ending||!['million','walkaway','broke','crisis'].includes(s.ending.id)))return null;
    refreshNewsCopy(s);ensureStory(s);
    for(const [account,keys] of [[s.loan,['outstanding','borrowed','repaid','interestPaid','interestAccrued']],[s.family,['outstanding','repaid']]])for(const key of keys)if(account[key]!==undefined&&(!Number.isFinite(account[key])||account[key]<0))return null;
    if(['outstanding','borrowed','repaid','interestPaid'].some(key=>!Number.isFinite(s.loan[key])))return null;
    if(s.loan.borrowCount!==undefined&&(!Number.isSafeInteger(s.loan.borrowCount)||s.loan.borrowCount<0))return null;
    if(s.tradingTrauma!==undefined&&!validTradingTrauma(s.tradingTrauma))return null;
    if(s.recapChoiceLedger!==undefined&&(!Array.isArray(s.recapChoiceLedger)||s.recapChoiceLedger.some(e=>!e||!Number.isSafeInteger(e.day)||e.day<1||typeof e.id!=='string'||!Number.isFinite(e.cost)||e.cost<0)))return null;
    if(s.nextDayLivingDiscount!==undefined&&s.nextDayLivingDiscount!==.4)return null;
    const living=ensureReportLiving(s);if(living&&!validLivingSettlement(living,s.dayReport.day))return null;
    if(living?.status==='pending'&&(s.dayReport.day!==s.day||!['day_end','resting','ending'].includes(s.phase)||s.dayReport.livingCost!==0||!s.expenseLedger?.some(row=>row.day===s.dayReport.day&&row.livingStatus==='pending'&&row.living===0)))return null;
    if(living?.status==='finalized'&&Math.abs(s.dayReport.livingCost-living.receipt.amount)>1e-6)return null;
    if(s.livingPolicy!==undefined&&(s.livingPolicy.version!==1||!Number.isSafeInteger(s.livingPolicy.lastSpecialDay)||s.livingPolicy.lastSpecialDay<1))return null;
    if(oldVersion<7&&!s.dayReport&&['day_end','resting','ending'].includes(s.phase))s.livingLegacyCompletedDay=s.day;
    s.dayOpeningNetAssets??=openingSnapshot.denominator;if(openingSnapshot.denominator===null)s.dayOpeningBasisUnknown=true;s.version=VERSION;
    ensureRunStatistics(s);ensureTradingClock(s);ensureAccountingJournal(s);ensureDialogue(s);if(!(oldVersion>=8&&hasCanonicalGrid(s.script)&&s.phase==='playing'&&s.pending?.subtick>0))mentalState(s);networkLoanTerms(s);s.dayOpeningLine ??= s.speech.text;


    return s;
  }catch{return null;}
}
function migrateV2(s){
  const oldPrice=s.price,oldPosition=s.position;
  const oldUnreal=oldPosition?oldPosition.margin*oldPosition.leverage*oldPosition.direction*(oldPrice/oldPosition.entry-1):0;
  s.version=3;s.price=1/oldPrice;
  for(const c of s.candles){const oldHigh=c.high;c.open=1/c.open;c.close=1/c.close;c.high=1/c.low;c.low=1/oldHigh;}
  s.script.tracks=s.script.tracks.map(beat=>beat.map(candle=>candle.map(p=>1/p)));
  s.script.events=planDay(s.seed,s.day,s.price).events;
  if(oldPosition){
    oldPosition.direction*=-1;
    const divisor=1+oldUnreal/(oldPosition.margin*oldPosition.leverage*oldPosition.direction);
    if(divisor>0)oldPosition.entry=s.price/divisor;
    else{s.cash+=Math.max(0,oldPosition.margin+oldUnreal);s.position=null;}
  }
  const convertTrade=t=>{if(!t)return;t.direction*=-1;if(t.entry)t.entry=1/t.entry;if(t.exit)t.exit=1/t.exit;};
  for(const t of s.history||[])convertTrade(t);
  convertTrade(s.lastTrade);
  s.cash+=s.reserve||0;s.reserve=0;
  if(s.phase==='decision'||s.phase==='playing'){s.reserve=Math.min(LIVING_DAILY,s.cash);s.cash-=s.reserve;}
  s.externalFunding=0;s.dayOpeningFunding=0;s.fatherUsed=false;s.stress=0;s.heat=0;s.nextStop=null;
  s.peakPersonal=Math.max(START,equity(s));s.equityTrail=[START,equity(s)];s.skills={mochiko:false,yasuko:false};
  s.archivedChat=s.chat;chapterChat(s);
  if(s.promise)appendDialogue(s,'friend','friend.remind.'+(s.promise==='small'?'small':'break_even'));
  if(s.dayReport){s.dayReport.funding=0;s.dayReport.externalFunding=0;for(const t of s.dayReport.trades||[])convertTrade(t);convertTrade(s.dayReport.peak);}
  return s;
}

// Re-express old quotes without changing their original economic settlement.
function migrateInverseQuotes(s){
 const inv=n=>Number.isFinite(n)&&n>0?1/n:n;s.price=inv(s.price);
 for(const c of s.candles){const high=c.high;c.open=inv(c.open);c.close=inv(c.close);c.high=inv(c.low);c.low=inv(high);}
 s.script.tracks=s.script.tracks.map(b=>b.map(c=>c.map(inv)));
 // Cached headlines used inverse-price wording too. Refresh only known event
 // copy; never regenerate the materialized path, timing, or variant outcome.
 for(const [i,e] of (s.script.events||[]).entries()){
  const chain=CHAINS.find(c=>c.id===e.id);
  if(chain&&VARIANTS.includes(e.variant)){
   const [title,copy]=chain[e.variant];
   Object.assign(e,{bias:chain.bias,title:i%2?title:chain.lead,copy:i%2?copy:chain.leadCopy,source:chain.source,flash:i%2?chain.name+'：市场继续评估后续影响':title,flashCopy:copy});
  }else {if(Number.isFinite(e.bias))e.bias=-e.bias;for(const key of ['title','copy','flash','flashCopy'])if(typeof e[key]==='string')e[key]='旧 JPY/USD 视角（涨为日元升值）：'+e[key];}
 }
 for(const e of [s.script.swan,s.lastEvent])if(e?.id){const canonical=BLACK_SWANS.find(c=>c.id===e.id);if(canonical)Object.assign(e,{title:canonical.title,copy:canonical.copy,name:canonical.name});else if(e.swan||e===s.script.swan){for(const key of ['title','copy'])if(typeof e[key]==='string')e[key]='旧 JPY/USD 视角（涨为日元升值）：'+e[key];}}
 if(s.lastEvent&&!s.lastEvent.swan){const e=s.script.events[Math.min(s.pending?.beat??s.beat,s.script.events.length-1)];if(e)Object.assign(s.lastEvent,{title:e.flash,copy:e.flashCopy,chain:e.chain});}

 for(const e of [s.script.swan,s.lastEvent])if(e&&Number.isFinite(e.delta))e.delta=1/(1+e.delta)-1;
 if(s.pending?.startPrice)s.pending.startPrice=inv(s.pending.startPrice);
 if(s.publicStance?.direction)s.publicStance.direction*=-1;
 if(s.publicMarketSpeaker?.direction)s.publicMarketSpeaker.direction*=-1;
 if(['long','short'].includes(s.intent))s.intent=s.intent==='long'?'short':'long';
 const seen=new Set();
 const convert=p=>{
  if(!p||seen.has(p))return;seen.add(p);
  if(p.direction===1||p.direction===-1)p.direction*=-1;
  for(const k of ['entry','exit','stopPrice'])if(p[k])p[k]=inv(p[k]);
  if(p.entry){p.pnlModel='legacy-inverse-v5';p.quantity=null;
   if(Number.isFinite(p.margin)){const costs=(p.openFeeRemaining||0)+money((p.notional??p.margin*p.leverage)*FEE_RATE);
    for(const k of ['lastFloating','lastDirectionalFloating'])if(Number.isFinite(p[k]))p[k]-=costs;
    if(Number.isFinite(p.maxUnrealized))p.maxUnrealized=Math.max(0,p.maxUnrealized-costs);
   }
  }
 };
 for(const p of s.positions||[])convert(p);convert(s.position);
 for(const t of s.history||[])convert(t);convert(s.lastTrade);
 for(const t of s.dayReport?.trades||[])convert(t);convert(s.dayReport?.peak);
 for(const e of [...(s.recent||[]),...(s.dayMoments||[]),...(s.dayReport?.moments||[]),s.lastReaction]){if(e?.observedMove)e.observedMove=1/(1+e.observedMove)-1;if(e?.direction===1||e?.direction===-1)e.direction*=-1;}
 s.archivedQuoteChat=s.chat;s.chat={group:[],friend:[]};s.speech=null;s.dialogueMemory=null;chapterChat(s);s.quoteMigration={from:'JPY/USD',to:'USD/JPY',legacySettlement:true};
}
