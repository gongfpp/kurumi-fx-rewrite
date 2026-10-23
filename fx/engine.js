import {activateEnergyEffect,energyStageStatus,validEnergyEffect} from './energy-stage.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {SUPPLY_POLICY,ONSEN_POLICY} from './economy-plan-config.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {LOTTERY_RULES} from './lottery-rules.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {purchaseLottery,settleLottery,redeemCheatLottery,validLotteryState,lotteryIncomeTotals} from './lottery-core.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {calculateWorkPay,quoteWorkAction,workPayDialogue,workUnlockReason,awardWorkItem,effectiveWorkTerms,validWorkInventory,initializeWorkEconomy} from './life-work.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {DAILY_SUPPLY_IDS,ensureDailySupplies,recordTradingNotes,supplyUnavailableReason,supplyUsedToday,supplyReceipt,recordSupplyUse,applySupplyMood,supplyMood,validDailySupplies,takeawayLine,TRADING_NOTES_LINE} from './daily-supplies.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {captureSkitState,makeSkitOutcome} from './skit-outcome.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {classifyEnding} from './ending-classifier.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {selectEndingLifeChoice} from './ending-life-choice.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {hasHistoricalSimulation,historicalSimulationActive,historicalMarkIsSimulated,historicalEffectiveTime,startHistoricalContinuation,resetHistoricalContinuationDay,simulateHistoricalMarks,recordHistoricalSource,historicalSimulationEvidence,validHistoricalContinuation} from './history-continuation.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {recoverLifeAction,recoverRecapAction,recoverProp,recoverLifeSleep} from './life-recovery.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {STAMINA_RULES,newStamina,ensureStamina,validStamina,staminaStatus,tradingDayProgress,consumeTradingStamina,consumeStamina} from './stamina.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
export {STAMINA_RULES,staminaStatus} from './stamina.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {selectLifeSceneDialogue} from './life-scene-dialogue-selector.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {dailyNarrativeFacts} from './daily-narrative-facts.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {lifeActionDialogueForSource} from './life-action-dialogues.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {LIFE_ACTION_SAVE_VERSION,LIFE_ACTION_CATALOG,lifeActionDefinition,lifeActionRunId,lifeActionReceipt,lifeActionDialogue,lifeFriendKnown,validLifeActions} from './life-actions.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
export {LIFE_ACTION_CATALOG,LIFE_WORK_INCOME} from './life-actions.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {beginFatherTheftWatch,checkFatherTheftAtClose,validFatherTheftWatch} from './father-theft-discovery.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {isMultiHistory,consumeMultiHistoryEvent,multiHistoryTimestamp,multiHistoryTradeEvidence,multiHistoryQuoteCurrent,multiHistoryPositionsCurrent,multiHistorySymbolEnded,multiHistoryEntryOpen} from './multi-history-state.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {LIVING_CHOICE_COPY,renderLivingCopy} from './copy/living-choices.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {LIVE_MARKET_VERSION,LIVE_SYMBOLS,isLiveMarket,initializeLiveMarket,liveScript,liveQuote,liveTimestamp,liveTradingReady,livePositionsReady,liveQuoteReady,liveStatusLabel,liveTradeEvidence,validLiveQuote,validLiveMarket,markLiveRestored} from './live-market-state.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {newHallMetrics,recordHallPosition} from './hall-metrics.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {MULTI_MARKET_VERSION,activeMarket,marketSeed,positionMarket,marketPrice,captureMarket,createMarketBook,switchMarket,renewMarketScripts,advanceHiddenMarkets,validMarketBook} from './market-book.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
export {activeMarket,marketPrice} from './market-book.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
export function selectMarket(s,symbol){const upgraded=s.version===LIFE_ACTION_SAVE_VERSION;const result=switchMarket(s,symbol,planDay);if(upgraded&&s.version!==LIFE_ACTION_SAVE_VERSION){s.lifeActions.sourceVersion=s.version;s.version=LIFE_ACTION_SAVE_VERSION;}return result;}
export function enableMarkets(s){const upgraded=s.version===LIFE_ACTION_SAVE_VERSION;if(!s.historical)createMarketBook(s,planDay);if(upgraded&&s.version!==LIFE_ACTION_SAVE_VERSION){s.lifeActions.sourceVersion=s.version;s.version=LIFE_ACTION_SAVE_VERSION;}return s;}
import {decodeSaveRaw} from './save-codec.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {CANDLE_PERIODS,recordDisplayQuote,recordDisplaySourceCandle,validCandleDisplay} from './candle-period.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {isResearch,researchCandle,isHistorical,historicalReady,hasHistoricalFeed,historicalScript,initializeHistorical,peekHistoricalQuote,skipElapsedHistoricalSource,commitHistoricalQuote,prepareNextHistoricalDay,nextHistoricalDate,validHistoricalSave,markHistoricalRestored,markHistoricalOpening} from './historical-replay.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {emptyComicAutoplay,reconcileComicAutoplay,validComicAutoplay} from './comic-autoplay.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {validOrderRatio,quoteOrderIntent} from './amount-controls.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {livingChargeParts,paidLivingService,applyPaidLivingRecovery,activateSelectedHousing,validLivingServices,initializeHousingEconomy,quoteHousingSelection,commitHousingSelection} from './living-services.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {lifestylePlan,validLifestyle,recordConsumption,consumptionStatement,validConsumptionLedger} from './consumption-ledger.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
export {lifestylePlan,consumptionStatement,LIFESTYLES} from './consumption-ledger.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {generateQuoteGrid,hasCanonicalGrid,validQuoteGrid,quoteSubstep,QUOTE_SUBSTEPS,QUOTE_GRID_VERSION,MARKET_BALANCE,shouldScheduleShock,calibratedShock} from './quote-grid.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {quotePackageState,planQuotePackagePurchase,quotePackageOffer,quoteCostRepresentable} from './quote-packages.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
export {quotePackageState} from './quote-packages.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {dailyReturnMetrics} from './daily-performance.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
export {dailyReturnMetrics} from './daily-performance.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {quoteLivingMeal,livingDayRoll,validLivingSettlement} from './living-settlement.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {ensureRunStatistics,recordOrderOpened,recordOrderExits} from './run-statistics.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';

import {ensureTradingClock,stampCandleTime,stampQuoteTime,currentTradingTimestamp,tradingTimestamp} from './trading-time.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {ensureAccountingJournal,recordAccountingPoint,recordAccountingDay,sealAccountingDay} from './accounting-journal.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {recapChoices} from './recap-choices.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {observeTradingTrauma,recoverTradingTrauma,tradingTrauma,capTraumaSanity,validTradingTrauma,tradingCapitalSafety} from './trading-trauma.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';


import {creditTerms} from './credit-policy.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {pressureMood,pressureIntensity} from './emotion-pressure.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {PIP_SIZE,grossPnlAt,pnlCoefficients,positionQuantity,isLegacyPosition} from './market.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {itemUnlocked,discoverItems,itemDiscovered,itemUnavailableReason} from './item-events.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {NEWS_CHAINS,PROPS} from './content.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {BLACK_SWANS} from './story-content.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {ensureStory,checkStories,restrictions as baseRestrictions,addEffect,ageEffects,queueStory,pendingStory} from './story.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
export {pendingStory,chooseStory,DEBUFFS} from './story.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
import {appendDialogue,chooseDialogue,ensureDialogue,updateSpeech,chapterChat} from './dialogue.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
export const VERSION = 9;
export const STORY_CAPITAL_VERSION = 12;
export const ENDLESS_CAPITAL_VERSION = 13;
export const FEE_RATE = .00005;
export const STOP_OUT_LEVEL = .5;
export const LIVING_DAILY = 1500;
export const FATHER_SAVINGS = 3000000;
export const TARGET_PROFIT = 20000000;
export const START_PRICE = 150;
// Legacy saves retain their original principal; new games use 300,000 yen.
export const START = 100000;
export const STORY_START = 300000;
export const initialCapital = s => Number.isFinite(s.startEquity)&&s.startEquity>0?s.startEquity:START;
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
// Used only when explicitly generating the frozen legacy grid. Saved grids are
// authoritative and are never regenerated during a copy refresh or restore.
function legacyNewsImpact(event,{day,beat,candle,tick}){
 const revealed=beat%2===1||candle*TICKS_PER_CANDLE+tick>=NEWS_FLASH_CANDLE*TICKS_PER_CANDLE+NEWS_FLASH_TICK;
 const phase=!revealed?1:event.variant==='reversed'?(beat%2?-1:-1.5):event.variant==='muted'?.1:beat%2?.8:1.2;
 return{drift:event.bias*phase*(.00007+day%3*.00001),volatility:event.vol*(revealed&&event.variant==='muted'?.55:1),revealed};
}
// Facts/variant do not select a price direction. A separate seeded response
// allows continuation, range and retracement; noise can overwhelm every impulse.
export function newsImpact(event,{day,beat,candle,tick}){
 const elapsed=candle*TICKS_PER_CANDLE+tick,release=NEWS_FLASH_CANDLE*TICKS_PER_CANDLE+NEWS_FLASH_TICK;
 const revealed=beat%2===1||elapsed>=release,response=event.response;
 const age=beat%2?24-release+elapsed:Math.max(0,elapsed-release),decay=Math.exp(-age/12);
 const phase=!revealed?.35:response?.behavior==='retrace'?-decay:response?.behavior==='range'?.08*decay:.7*decay;
 const impulse=Number.isFinite(response?.impulse)?response.impulse:0;
 const vol=Number.isFinite(event.vol)?Math.max(1,event.vol):1;
 return {drift:impulse*phase*(.00007+day%3*.00001),volatility:!revealed?vol:1+(vol-1)*decay*(event.variant==='muted'?.25:1),revealed};
}

export function planDay(seed, day, startPrice, rounds = BEATS_PER_DAY, {newsEffects=true,swanEffects=true,gridVersion=QUOTE_GRID_VERSION,symbol='USD/JPY',tickMinutes=2.5}={}) {
  const story = random(mix(seed, day, 0x5170));
  const market = random(mix(seed, day, 0x61a0));
  const response=random(mix(seed,day,0x934a));
  const shockDirection=response()<.5?-1:1;
  const cycle=Math.floor((day-1)*2/CHAINS.length),bag=CHAINS.map((_,i)=>i),shuffle=random(mix(seed,cycle,0x777a));
  for(let i=bag.length-1;i>0;i--){const j=Math.floor(shuffle()*(i+1));[bag[i],bag[j]]=[bag[j],bag[i]];}
  const selected=[CHAINS[bag[((day-1)*2)%bag.length]],CHAINS[bag[((day-1)*2+1)%bag.length]]];
  const surprise=random(mix(seed,day,0x1b1a));
  const shockRoll=surprise();
  const shockDay=gridVersion===QUOTE_GRID_VERSION?shouldScheduleShock(day,d=>d===day?shockRoll:random(mix(seed,d,0x1b1a))()):(shockRoll<.22||day%7===0);
  const swan=shockDay&&swanEffects?{...BLACK_SWANS[Math.floor(surprise()*BLACK_SWANS.length)],beat:Math.floor(surprise()*4),candle:Math.floor(surprise()*3),tick:2+Math.floor(surprise()*3)}:null;
  if(swan&&gridVersion===QUOTE_GRID_VERSION)swan.delta=shockDirection*Math.abs(calibratedShock(swan.delta,{symbol,tickMinutes}));
  const events = [];
  for (let beat = 0; beat < rounds; beat++) {
    const chain = selected[Math.floor(beat / 2)%selected.length];
    const variant = beat % 2 === 0 ? VARIANTS[Math.floor(story() * 3)] : events[beat - 1].variant;
    const [reveal, detail] = chain[variant];
    const reaction=gridVersion!==QUOTE_GRID_VERSION?{}:beat%2?{response:events[beat-1].response}:{response:{impulse:(response()<.5?-1:1)*(.5+response()*.5),behavior:['continue','range','retrace'][Math.min(2,Math.floor(response()*3))]}};
    events.push({id: chain.id, chain: chain.name, variant, bias: chain.bias, vol: chain.vol,...reaction,
      title: beat % 2 === 0 ? chain.lead : reveal,
      copy: beat % 2 === 0 ? chain.leadCopy : detail,
      source: chain.source, time: ['09:10','11:30','15:00','21:30','23:30'][beat]||'00:30',
      flash: beat % 2 === 0 ? reveal : `${chain.name}：市场继续评估后续影响`,
      flashCopy: detail});
  }
  if(gridVersion===QUOTE_GRID_VERSION){const grid=generateQuoteGrid({startPrice,events,market,swan,newsEffects,symbol,tickMinutes,impactAt:(event,cursor)=>newsImpact(event,{day,...cursor})});return{events,...grid,swan};}
  let price = startPrice;
  const tracks = events.map((event, beat) => Array.from({length: CANDLES_PER_BEAT}, (_, candle) => {
    const ticks = [];
    for (let tick = 0; tick < TICKS_PER_CANDLE; tick++) {
      const impact=legacyNewsImpact(event,{day,beat,candle,tick});
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
import {initializeSharedReplay,isSharedReplay,prepareSharedReplayEvent,resetSharedReplay} from './shared-replay-state.js?v=56d6bec24fd11a7578768d36d112a0cef37982c5-23f2a20b7717';
const replayApplication=Symbol('validated replay application');
export function createGame(seed = Date.now(), {mode = 'story',historical=null,multiMarket=false,live=false,sharedReplay=false} = {}) {
  if(sharedReplay&&(!live||historical))throw Error('Replay requires a new live-shaped game');
  if(!['story','endless'].includes(mode))throw Error('未知游戏模式');
  seed = seed >>> 0;
  const startingCapital=STORY_START;
  const state = {stamina:newStamina(),hallMetrics:newHallMetrics(),comicAutoplay:emptyComicAutoplay(),version: mode==='story'?STORY_CAPITAL_VERSION:ENDLESS_CAPITAL_VERSION, mode, startEquity:startingCapital, completedCandles:0, completedDays:0, performance:{totalProfit:0,closedTrades:0,winningTrades:0,winRateTrades:0,maxLoss:0,maxProfit:0,peakEquity:startingCapital,maxDrawdown:0}, seed, day: 1, beat: 0, phase: 'decision', price: START_PRICE,
    cash: mode==='endless'?startingCapital:startingCapital-LIVING_DAILY, reserve: mode==='endless'?0:LIVING_DAILY, positions: [], position: null, nextOrderId: 1, feesPaid: 0, feeLedger: [], sanity: 50, mentalBoost:0, bonusBeats:0, dayOpening: startingCapital, dayOpeningNetAssets:startingCapital, dayOpeningDebt:0, candles: historical?[]:historyCandles(seed),
    script: null, pending: null, history: [], recent: [], chat: {group:[],friend:[]}, promise: null,
    relationship: 0, publicStance: null, promiseNoted:false, dinner:false, skills:{mochiko:false,yasuko:false},
    fatherUsed:false,externalFunding:0,dayOpeningFunding:0,stress:0,heat:0,peakPersonal:startingCapital,equityTrail:[startingCapital],nextStop:null,
    lastEvent:null, lastTrade:null, lastReaction:null, dayReport:null};
  if(historical){initializeHistorical(state,historical);markHistoricalOpening(state);state.accountingJournal={version:1,points:[],days:[],startedDay:1,legacyPartial:false};}
  initializeHousingEconomy(state);initializeWorkEconomy(state);ensureDailySupplies(state);state.stamina.version=3;
  ensureRunStatistics(state);ensureTradingClock(state);ensureAccountingJournal(state);recordAccountingPoint(state,'opening');
  state.script = historical?historicalScript():planDay(seed, 1, state.price);
  chapterChat(state);ensureStory(state);discoverItems(state);observeTradingTrauma(state,{accountEquity:startingCapital});updateSpeech(state,'hopeful');state.dayOpeningLine=state.speech.text;
  if(live){initializeLiveMarket(state);if(sharedReplay)initializeSharedReplay(state);}else if(multiMarket)enableMarkets(state);return state;
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
export function positionUnrealized(s,p){return grossPnlAt(p,marketPrice(s,positionMarket(p)));}
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
export function accountLiquidationEstimate(s,extra,symbol=activeMarket(s)){
 const positions=[...positionsOf(s),...(extra?[{symbol,...extra}]:[])],used=positions.reduce((n,p)=>n+p.margin,0);
 const required=positions.reduce((n,p)=>n+(p.initialMargin??p.margin),0),afterFee=accountMetrics(s).tradingEquity-(extra?fee(extra.margin,extra.leverage):0);
 const balance=s.cash-(extra?extra.margin+fee(extra.margin,extra.leverage):0)+used;
 const lossThreshold=Math.max(0,balance-STOP_OUT_LEVEL*required),remainingLoss=Math.max(0,afterFee-STOP_OUT_LEVEL*required);
 const result={...(s.marketBook?{symbol,conditional:positions.some(p=>positionMarket(p)!==symbol)}:{}),price:null,movePercent:null,lossThreshold,remainingLoss,reason:!positions.length?'empty':'unreachable'};
 if(!positions.length)return result;
 const terms=positions.map(p=>positionMarket(p)===symbol?pnlCoefficients(p):{linear:0,reciprocal:0,constant:positionUnrealized(s,p)}),a=terms.reduce((n,t)=>n+t.linear,0),b=terms.reduce((n,t)=>n+t.reciprocal,0),c=balance-STOP_OUT_LEVEL*required+terms.reduce((n,t)=>n+t.constant,0);
 if(Math.abs(a)<1e-10&&Math.abs(b)<1e-8)return {...result,reason:positions.some(p=>positionMarket(p)===symbol)?'hedged':'other-markets'};
 let roots=[];
 if(Math.abs(a)<1e-10){if(Math.abs(c)>1e-10)roots=[-b/c];}
 else if(Math.abs(b)<1e-8)roots=[-c/a];
 else {const discriminant=c*c-4*a*b;if(discriminant>=0){const q=-.5*(c+(c>=0?1:-1)*Math.sqrt(discriminant));roots=q?[q/a,b/q]:[-c/(2*a)];}}
 roots=[...new Set(roots.filter(price=>price>0&&Number.isFinite(price)))].sort((x,y)=>Math.abs(Math.log(x/marketPrice(s,symbol)))-Math.abs(Math.log(y/marketPrice(s,symbol))));
 const price=roots[0];return price?{...result,price,prices:roots,movePercent:(price/marketPrice(s,symbol)-1)*100,reason:null}:result;
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
export function dailyLeverageUnlocked(s){
 const key=`${s.mode||'story'}:${s.runId||s.seed}:${s.day}`;
 if(s.dailyLeverageUnlock!==key||!validDailySupplies(s))return false;
 return ['energy','dailyDrink'].some(id=>{
  if(s.itemsUsed?.[id]!==true)return false;
  const receipt=supplyReceipt(s,id),paid=s.consumptionLedger?.some(row=>row.id===`item:${s.day}:${id}`&&row.kind==='item'&&row.day===s.day&&row.amount===300);
  // Before supply receipts existed, a purchased drink was recorded in the
  // same-day item ledger. Keep that paid effect without reopening its sale.
  return paid&&(receipt?.consumptionId===`item:${s.day}:${id}`||(id==='dailyDrink'&&!receipt));
 });
}
export function restrictions(s){
  if(s.mode==='endless')return {...baseRestrictions(s),leverage:100,stake:1,noEntry:!staminaStatus(s).canOpen,minLeverage:5,forceNoStop:false,emotion:mood(s)};
  const base=baseRestrictions(s),limits={...base,noEntry:base.noEntry||!staminaStatus(s).canOpen},emotion=mood(s),pressure=pressureMood(s),forceNoStop=['ecstatic','despair'].includes(emotion)||!!pressure;
  const pressured=!!pressure&&!limits.noEntry;
  return {...limits,...(pressured?{leverage:100,stake:1}:{}),...(!limits.noEntry&&dailyLeverageUnlocked(s)?{leverage:100}:{}),minLeverage:forceNoStop?25:5,forceNoStop,emotion};
}
export function tradingOpen(s){return !s.liveSuspension?.active&&(!isLiveMarket(s)||liveTradingReady(s))&&multiHistoryEntryOpen(s)&&historicalReady(s)&&(s.phase==='decision'||s.realtime===true&&s.phase==='playing');}
export const marketPlaybackOpen=s=>isMultiHistory(s)?historicalReady(s)&&['decision','playing'].includes(s.phase):tradingOpen(s);
function positionQuoteCurrent(s,p){return (!isLiveMarket(s)||liveQuoteReady(s,positionMarket(p)))&&multiHistoryQuoteCurrent(s,positionMarket(p));}
function historicalExecutionEvidence(s,symbol){
 if(!isHistorical(s))return {};
 const segment=historicalSimulationEvidence(s,symbol);
 return {...(!historicalMarkIsSimulated(s,symbol)?{historicalQuote:isMultiHistory(s)?multiHistoryTradeEvidence(s,symbol):{date:s.historical.date,cursor:s.historical.cursor,sourceVersion:s.historical.sourceVersion}}:{}),...(segment?{marketSegment:segment}:{})};
}
export function canCloseAtKnownQuote(s,positionId=null){if(isLiveMarket(s)&&positionId)return positionsOf(s).some(p=>p.id===positionId&&positionQuoteCurrent(s,p))&&['decision','playing'].includes(s.phase);if(isMultiHistory(s))return (positionId?(s.positions||[]).filter(p=>p.id===positionId).every(p=>multiHistoryQuoteCurrent(s,positionMarket(p))):multiHistoryPositionsCurrent(s))&&['decision','playing'].includes(s.phase);return tradingOpen(s)||(isHistorical(s)&&['decision','playing'].includes(s.phase)&&Number.isFinite(s.historical.lastQuote?.[0]));}
export function orderPreview(s,action={}){
  const a=accountMetrics(s),limits=restrictions(s),leverage=action.leverage;
  const factor=Number.isFinite(leverage)?leverage*FEE_RATE:0;
  const marginLimit=(Math.max(0,a.tradingEquity)*limits.stake-a.usedMargin)/(1+limits.stake*factor);
  const notionalLimit=Number.isFinite(leverage)?(Math.max(0,a.tradingEquity)*limits.leverage-a.notional)/(leverage+limits.leverage*factor):0;
  const maxMargin=floorMoney(Math.min(marginWithinBudget(a.availableMargin,leverage||0),Math.max(0,marginLimit),Math.max(0,notionalLimit)));
  const intentMode=action.amountMode==='max'||Object.hasOwn(action,'ratio'),amountMode=Object.hasOwn(action,'amount');
  const margin=intentMode?quoteOrderIntent(action,a.availableMargin,maxMargin):amountMode?money(action.amount):marginWithinBudget(a.availableMargin*(action.stake||0),leverage||0);
  const openFee=fee(margin,leverage||0),closeFee=openFee,stopConfig=orderStop(s,action);
  const result={valid:false,error:null,margin,notional:margin*(leverage||0),quantity:margin*(leverage||0)/s.price,openFee,closeFee,totalDebit:margin+openFee,maxMargin,
    ...stopConfig,stopLossAmount:stopConfig.stopPrice?Math.max(0,-margin*leverage*(action.type==='short'?-1:1)*(stopConfig.stopPrice/s.price-1)):null,
    liquidationPrice:null,liquidationBasis:'account',riskPercent:a.tradingEquity>0?(a.usedMargin+margin)/Math.max(1,a.tradingEquity-openFee)*100:0,
    availableMargin:a.availableMargin,feeRate:FEE_RATE,stopOutLevel:STOP_OUT_LEVEL};
  let error=null;
  if(!tradingOpen(s))error='当前市场已休市';
  else if(!['long','short'].includes(action.type)||![5,10,20,25,50,100].includes(leverage)||(Object.hasOwn(action,'stopPips')?![10,30,50,null].includes(action.stopPips):![.25,.5,1].includes(action.stop))||intentMode&&Object.hasOwn(action,'ratio')&&!validOrderRatio(action.ratio)||!intentMode&&amountMode&&(!Number.isFinite(action.amount)||action.amount<=0)||!intentMode&&!amountMode&&(!Number.isFinite(action.stake)||action.stake<.01||action.stake>1))error='订单参数无效';
  else if(Object.hasOwn(action,'stopPips')&&action.stopPips!==null&&!Number.isFinite(stopConfig.stopPrice))error='止损点数超出有效报价范围';
  else if(!staminaStatus(s).canOpen)error='体力不足，先休息';
  else if(limits.noEntry)error='承受力过低，先休息';
  else if(leverage>limits.leverage)error='心理承受力不足，无法使用这个杠杆';
  else if(leverage<limits.minLeverage)error='当前情绪下杠杆至少 25×';
  else if(limits.forceNoStop&&(Object.hasOwn(action,'stopPips')?action.stopPips!==null:action.stop!==1))error='极度亢奋或绝望时只能不设止损';
  else if(margin<100)error='保证金至少需要 ¥100';
  else if(margin+openFee>a.availableMargin+1e-7)error='可用保证金不足（需要预留开仓手续费）';
  else if(margin>maxMargin+1e-7)error=s.mode==='endless'?'总持仓超过可用保证金或最高杠杆限额':'总持仓超过当前心理承受力的风险限额';
  result.error=error;result.valid=!error;
  if(result.valid){result.liquidation=accountLiquidationEstimate(s,{margin,leverage,direction:action.type==='long'?1:-1,entry:s.price,symbol:activeMarket(s)});result.liquidationPrice=result.liquidation.price;}
  return result;
}
export function tradingProfit(s){return equity(s)-initialCapital(s)-(s.externalFunding||0)-(s.nonTradingIncome||0)-(s.lotteryIncome||0)-(s.cheatLotteryIncome||0)+(s.expenses||0)-(s.developer?.profitOffset||0);}
export function mentalReadout(s){
 const personal=Math.max(0,equity(s)-(s.externalFunding||0)-(s.nonTradingIncome||0)-(s.lotteryIncome||0)-(s.cheatLotteryIncome||0)+(s.expenses||0)-(s.developer?.profitOffset||0)),peak=Math.max(initialCapital(s),s.peakPersonal||initialCapital(s),personal),recentPeak=Math.max(initialCapital(s)*.01,...(s.equityTrail||[personal]),personal),metrics=accountMetrics(s);
 return{value:s.sanity,totalDrawdown:Math.max(0,1-personal/peak),recentDrawdown:Math.max(0,1-personal/recentPeak),exposure:Math.min(1,metrics.notional/Math.max(metrics.tradingEquity,1)/50)};
}
export function mentalState(s, sample=false){
  ensureStory(s);observeTradingTrauma(s,{accountEquity:equity(s)});const modifiers=restrictions(s);
  const personal=Math.max(0,equity(s)-(s.externalFunding||0)-(s.nonTradingIncome||0)-(s.lotteryIncome||0)-(s.cheatLotteryIncome||0)+(s.expenses||0)-(s.developer?.profitOffset||0));
  s.peakPersonal=Math.max(initialCapital(s),s.peakPersonal||initialCapital(s),personal);
  s.equityTrail ||= [personal];
  if(sample){s.equityTrail.push(personal);s.equityTrail=s.equityTrail.slice(-48);}
  const recentPeak=Math.max(initialCapital(s)*.01,...s.equityTrail,personal);
  const totalDrawdown=Math.max(0,1-personal/s.peakPersonal);
  const recentDrawdown=Math.max(0,1-personal/recentPeak);
  const metrics=accountMetrics(s),exposure=Math.min(1,metrics.notional/Math.max(metrics.tradingEquity,1)/50);
  const earned=Math.max(0,Math.min(35,Math.log2(1+Math.max(0,personal-initialCapital(s))/1000)*5));
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

  s.cash+=margin+raw-closeFee+lossReduction;s.feesPaid+=closeFee;s.feeLedger.push({day:s.day,beat:Math.min(s.beat,beatsPerDay(s)-1),positionId:p.id,side:'close',amount:closeFee});
  p.notional=(p.notional??p.margin*p.leverage)*(1-fraction);p.initialMargin=(p.initialMargin??p.margin)*(1-fraction);p.margin-=margin;p.maxUnrealized*=1-fraction;p.openFeeRemaining-=openFee;
  if(p.margin<.00001||fraction===1)s.positions=s.positions.filter(order=>order!==p);
  syncPosition(s);
  s.lastTrade={type:reason,...historicalExecutionEvidence(s,positionMarket(p)),positionClosed:!s.positions.some(order=>order.id===p.id),timestamp:isLiveMarket(s)?liveTimestamp(s,positionMarket(p)):isMultiHistory(s)&&!historicalMarkIsSimulated(s,positionMarket(p))?multiHistoryTimestamp(s,positionMarket(p)):currentTradingTimestamp(s),...(isLiveMarket(s)?{liveQuote:liveTradeEvidence(s,positionMarket(p))}:{}),positionId:p.id,...(s.marketBook?{symbol:positionMarket(p)}:{}),direction:p.direction,margin,leverage:p.leverage,entry:p.entry,exit:marketPrice(s,positionMarket(p)),
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
  let profit=0,peak=initialCapital(s),drawdown=0;
  for(const t of trades){profit+=t.pnl;peak=Math.max(peak,initialCapital(s)+profit);drawdown=Math.max(drawdown,1-Math.max(0,initialCapital(s)+profit)/peak);}
  return s.performance={totalProfit:profit,closedTrades:trades.length,winningTrades:trades.filter(t=>t.pnl>0).length,winRateTrades:trades.length,maxLoss:Math.min(0,...trades.map(t=>t.pnl)),maxProfit:Math.max(0,...trades.map(t=>t.pnl)),peakEquity:peak,maxDrawdown:drawdown};
}
function samplePerformance(s){
  const stats=ensurePerformance(s),netEquity=Math.max(0,initialCapital(s)+tradingProfit(s));
  stats.peakEquity=Math.max(initialCapital(s),stats.peakEquity,netEquity);
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
function enforceMargin(s,exits=[]){
  while(s.positions.length&&accountMetrics(s).marginLevel<=STOP_OUT_LEVEL){
    // A missing quote in one pair cannot suspend risk in another pair.
    // Stale positions remain pending until their next observed price.
    const worst=s.positions.filter(p=>positionQuoteCurrent(s,p)).sort((a,b)=>positionUnrealized(s,a)-positionUnrealized(s,b))[0];
    if(!worst)break;
    exits.push(closePosition(s,1,'liquidation',worst.id));
  }
  protectBalance(s,exits);return exits;
}
function closeOrders(s,fraction,reason,positionId){
  if(!(positionId?positionsOf(s).filter(p=>p.id===positionId):positionsOf(s)).every(p=>positionQuoteCurrent(s,p)))throw Error('行情暂缓，暂不能平仓');
  ensureOrders(s);const targets=positionId?s.positions.filter(p=>p.id===positionId):[...s.positions];
  if(!targets.length)throw Error('没有可平仓位');
  const trades=targets.map(p=>closePosition(s,fraction,reason,p.id));
  // Keep the requested closes and any follow-up liquidations in one receipt
  // batch: balance protection must reach the last exit before statistics copy it.
  enforceMargin(s,trades);mentalState(s);return trades;
}
export function mood(s){const baseline=baseMood(s);return tradingTrauma(s).active?baseline:supplyMood(s,baseline);}
function baseMood(s) {
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
  if (latest?.type==='ecstatic' && weighted>0 || tradingProfit(s)>initialCapital(s)*.15&&s.heat>=3) return 'ecstatic';
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
 if(isLiveMarket(s)){const at=liveTimestamp(s);return{...liveScript(s.price).events[0],title:activeMarket(s)+' · '+liveStatusLabel(s),time:at?new Date(at).toISOString().slice(11,19)+' UTC':'',copy:'盘面采用 biquote 券商指示报价，可能延迟。游戏按显示的中间价和原有费用规则结算。'};}
 if(isHistorical(s))return{...s.script.events[0],time:new Date(s.historical.lastQuote[0]+9*3600000).toISOString().slice(11,19)};
 let beat=Math.min(s.beat,beatsPerDay(s)-1);
 const now=currentTradingTimestamp(s);
 // Segment advancement can precede the next session's first observed quote.
 // Keep the last published story during that gap, not the next scheduled lead.
 while(beat>0&&now<tradingTimestamp(s,{day:s.day,beat}))beat--;
 const event=s.script.events[beat],stamp=(visible,candle=0,tick=0)=>({...visible,beat,publishedAt:tradingTimestamp(s,{day:s.day,beat,candle,tick})});
 if(s.swanSeen&&s.lastEvent?.swan&&s.lastEvent.beat===beat){
  const visible=stamp({...event,...s.lastEvent,source:'汇市紧急快讯'},s.lastEvent.candle,(s.lastEvent.tick??0)+1);
  if(visible.publishedAt<=now)return visible;
 }
 const revealedAt=tradingTimestamp(s,{day:s.day,beat,candle:NEWS_FLASH_CANDLE,tick:NEWS_FLASH_TICK+1});
 if((s.lastEvent?.beat===beat||s.pending?.beat===beat&&s.pending.flashShown)&&revealedAt<=now)return stamp({...event,title:event.flash,copy:event.flashCopy},NEWS_FLASH_CANDLE,NEWS_FLASH_TICK+1);
 return stamp(event);
}

// Frozen 2026-10-16 plan rules; tests may inject an explicit experimental policy.
// The returned state and all cash deltas form one save transaction; presentation
// is a consumer of the committed receipt and never calls the random generator.
function applyLotteryTransition(s,result){
 if(result.reason||!result.debit&&!result.normalCredit&&!result.cheatCredit&&!result.ticket&&!result.settled.length)return result;
 const draft=structuredClone(s);
 draft.lottery=result.lottery;
 draft.lotteryIncome=(draft.lotteryIncome||0)+result.normalCredit;
 draft.cheatLotteryIncome=(draft.cheatLotteryIncome||0)+result.cheatCredit;
 draft.dayOpeningLotteryIncome ??= 0;draft.dayOpeningCheatLotteryIncome ??= 0;
 draft.cash+=result.normalCredit+result.cheatCredit-result.debit;
 if(result.debit){draft.expenses+=result.debit;recordConsumption(draft,{id:result.receiptId,kind:'lottery',label:'彩票',amount:result.debit,timestamp:currentTradingTimestamp(draft)});}
 refreshReport(draft);recordAccountingPoint(draft,'lottery');
 Object.assign(s,draft);return result;
}
export function purchaseLotteryTicket(s,{config=LOTTERY_RULES}={}){
 ensureStory(s);if(!tradingOpen(s)&&!['day_end','resting'].includes(s.phase))throw Error('当前无法购买彩票');
 return applyLotteryTransition(s,purchaseLottery(s.lottery,{day:s.day,runId:lifeActionRunId(s),balance:accountMetrics(s).availableMargin,config}));
}
export function settleLotteryDraw(s,{config=LOTTERY_RULES,rng=Math.random,minute,endOfDay=false}={}){
 ensureStory(s);
 if(minute===undefined){const at=currentTradingTimestamp(s);minute=Number.isFinite(at)?new Date(at+9*3600000).getUTCHours()*60+new Date(at+9*3600000).getUTCMinutes():0;}
 return applyLotteryTransition(s,settleLottery(s.lottery,{day:s.day,minute,endOfDay,rng,config}));
}
export function redeemLotteryCode(s,{code,config=LOTTERY_RULES}={}){
 ensureStory(s);return applyLotteryTransition(s,redeemCheatLottery(s.lottery,{day:s.day,runId:lifeActionRunId(s),code,config}));
}
function settleDueLottery(s,{endOfDay=false}={}){
 if(s.mode!=='story'||!s.lottery?.tickets.some(t=>t.status==='pending'&&t.rulesId===LOTTERY_RULES.id&&t.drawDay<=s.day))return null;
 return settleLotteryDraw(s,{endOfDay});
}
function validLotteryLedger(s){
 if(s.lottery===undefined)return !s.lotteryIncome&&!s.cheatLotteryIncome&&!s.dayOpeningLotteryIncome&&!s.dayOpeningCheatLotteryIncome;
 if(!validLotteryState(s.lottery)||s.lottery.tickets.some(t=>t.purchaseDay>s.day||t.settledDay>s.day||t.status==='settled'&&t.kind==='normal'&&LOTTERY_RULES.tiers.find(row=>row.tier===t.result.tier)?.prize!==t.result.prize))return false;
 const totals=lotteryIncomeTotals(s.lottery);
 return s.lotteryIncome===totals.normal&&s.cheatLotteryIncome===totals.cheat&&['LotteryIncome','CheatLotteryIncome'].every(key=>Number.isSafeInteger(s['dayOpening'+key])&&s['dayOpening'+key]>=0&&s['dayOpening'+key]<=s[key[0].toLowerCase()+key.slice(1)]);
}

export function useProp(s,id,{amount=FATHER_SAVINGS}={}){
 ensureStory(s);ensureOrders(s);
 if(!tradingOpen(s)&&!(['day_end','resting'].includes(s.phase)&&(DAILY_SUPPLY_IDS.includes(id)||id==='tradingNotes'))&&!(['day_end','resting','bankrupt'].includes(s.phase)&&id==='father'))throw Error('当前无法使用物品');
 if(!PROPS[id])throw Error('没有这个物品');
 if(DAILY_SUPPLY_IDS.includes(id)&&supplyUsedToday(s,id))throw Error('今天已经用过了');
 const unavailable=itemUnavailableReason(s,id)||(id!=='father'?supplyUnavailableReason(s,id):'');if(unavailable)throw Error(unavailable);
 if(!itemUnlocked(s,id))throw Error('这个物品还没获得');
 if(id==='father'){
  if(s.fatherUsed||s.family.takenConfirmed||s.family.outstanding>0||s.family.repaid>0||s.family.withdrawal)throw Error('这笔存款已经取过了');
  if(!Number.isFinite(amount)||amount<=0||amount>FATHER_SAVINGS||Math.abs(money(amount)-amount)>1e-8)throw Error('取款金额须大于零、不超过三百万，并精确到分');
  const theftTradingProfit=tradingProfit(s);
  s.fatherUsed=true;s.family.withdrawal={id:`father:${s.runId||s.seed}`,day:s.day,amount,timestamp:currentTradingTimestamp(s)};s.cash+=amount;s.externalFunding+=amount;s.stress+=12;s.heat=Math.min(5,s.heat+2);
  s.family.outstanding=amount;s.family.borrowedAt=(s.day-1)*4+s.beat;addEffect(s,'guilt',null);s.family.takenConfirmed=true;beginFatherTheftWatch(s,{tradingProfit:theftTradingProfit});
  if(s.phase==='bankrupt')s.phase='day_end';refreshReport(s);mentalState(s);return{id,amount,trades:[],line:'这笔钱要还。'};
 }
 if(id==='tradingNotes'){
  recordTradingNotes(s);
  s.stress=Math.max(0,(s.stress||0)-SUPPLY_POLICY.notesStressReduction);
  s.chat.friend.push({from:'久留美',text:TRADING_NOTES_LINE,kind:'self',dialogueId:`trading-notes:${s.day}`});s.chat.friend=s.chat.friend.slice(-60);
  mentalState(s);refreshReport(s);return{id,cost:0,trades:[],line:TRADING_NOTES_LINE,monologue:TRADING_NOTES_LINE};
 }
 if(!DAILY_SUPPLY_IDS.includes(id))throw Error('没有这个物品');
 const cost=PROPS[id].cost||0;if(accountMetrics(s).availableMargin<cost)throw Error('可用资金不足');
 const previousMood=mood(s),baselineMood=baseMood(s);
 s.cash-=cost;s.expenses+=cost;const consumption=recordConsumption(s,{id:`item:${s.day}:${id}`,kind:'item',label:PROPS[id].name,amount:cost,timestamp:currentTradingTimestamp(s)});
 recordSupplyUse(s,id,consumption.id);
 // Record event order at purchase: several clicks can share one quote timestamp.
 // This is achievement evidence only; the charge and trading rules stay above.
 if(id==='takeaway')consumption.profitBeforePurchase=(s.history||[]).some(t=>t.type!=='open'&&Number.isFinite(t.pnl)&&t.pnl>0)||(s.performance?.closedTrades>0&&s.performance?.maxProfit>0);
 if(id==='energy'){s.dailyLeverageUnlock=`${s.mode||'story'}:${s.runId||s.seed}:${s.day}`;activateEnergyEffect(s,{progress:tradingDayProgress(s)});}
 const moodShift=tradingTrauma(s).active?null:applySupplyMood(s,id,previousMood,baselineMood);
 if(['noodles','takeaway'].includes(id))refreshPendingLivingMeal(s);
 const staminaRecovery=recoverProp(s,id);
 mentalState(s);refreshReport(s);return{id,cost,trade:null,trades:[],line:id==='takeaway'?takeawayLine(s):PROPS[id].copy,staminaRecovery,moodShift};
}
function refreshPendingLivingMeal(s){
 const report=s.dayReport;
 if(report?.day!==s.day||report.livingSettlement?.status!=='pending')return;
 const prior=report.livingSettlement.quote;
 if(s.housingEconomy?.effectiveDay>s.day&&prior.pricingVersion!==2){
  // Keep an existing legacy discount and the original housing components.
  if(prior.supplyMealCredit===300||prior.discount>0||prior.kind==='friend-treat')return;
  const quote={...prior,baseAmount:Math.max(0,prior.baseAmount-300),supplyMealCredit:300,kind:'thrifty',label:LIVING_CHOICE_COPY.shared.livingDiscountedReceiptLabel};
  if(Number.isFinite(prior.basicAmount))quote.basicAmount=Math.max(0,prior.basicAmount-300);
  quote.amount=Math.min(Math.max(0,s.cash),Math.max(0,prior.amount-300));
  report.livingSettlement.quote=quote;report.pendingLivingCost=quote.amount;return;
 }
 const quote=dayLivingQuote(s,report,report.livingSettlement.quote.roll);
 report.livingSettlement.quote=quote;report.pendingLivingCost=quote.amount;
}
// Explicit game-only after-close decisions. Merely showing/replaying a recap has no effect.
function mainRecoveryUsed(s){return s.lifeActions?.receipts?.some(row=>row.day===s.day&&['friend','relax','dinner'].includes(row.category))||s.recapChoiceLedger?.some(row=>row.day===s.day&&(row.id==='quiet-night'||row.group==='dinner'));}
export function chooseRecapAction(s,id){
 ensureStory(s);
 if(!['day_end','resting'].includes(s.phase)||s.dayReport?.day!==s.day||s.mode==='endless')throw Error('只有今天收盘后才能选择生活安排');
 if(s.recapChoiceLedger?.some(e=>e.day===s.day&&e.id===id))throw Error('今天已经选择过了');
 if(id!=='noodles-today'&&mainRecoveryUsed(s))throw Error('今晚已经安排过恢复活动');
 s.recapChoiceLedger ||= [];
 if(id==='noodles-today'){
  const report=s.dayReport;
  if(report.livingSettlement?.status!=='pending')throw Error('今天的日常开销已经结清，不能重算');
  const skitBefore=captureSkitState(s,mood(s));
  let paid=supplyReceipt(s,'noodles');
  if(!paid&&s.itemsUsed?.noodles){
   const old=(s.consumptionLedger||[]).find(row=>row.day===s.day&&row.id===`item:${s.day}:noodles`&&row.amount===150);
   if(old)paid={consumptionId:old.id,legacy:true};else throw Error('今天已经吃过泡面了');
  }
  if(!paid){useProp(s,'noodles');paid=supplyReceipt(s,'noodles');}
  const receipt={day:s.day,id,cost:150,consumptionId:paid.consumptionId,timestamp:currentTradingTimestamp(s),label:'今天关灯吃泡面'};
  s.recapChoiceLedger.push(receipt);s.recapChoiceLedger=s.recapChoiceLedger.slice(-200);
  if(!paid.legacy)refreshPendingLivingMeal(s);receipt.skitOutcome=makeSkitOutcome(s,`activity:${s.day}:${id}`,skitBefore,captureSkitState(s,mood(s)));refreshReport(s);return receipt;
 }
 const r=s.dayReport;
 const choices=recapChoices({sealed:true,mode:s.mode,daily:{tradingNet:r.net,openingNominal:r.opening,livingStatus:r.livingSettlement?.status||'legacy-paid',noodlesUsed:!!s.itemsUsed.noodles},account:{netAssets:equity(s)-debtSummary(s).total}},{cash:accountMetrics(s).availableMargin});
 const choice=choices.find(c=>c.id===id);if(!choice||choice.loan)throw Error('没有这个生活选项');
 if(!choice.enabled)throw Error('可用资金不足');
 if(choice.group&&s.recapChoiceLedger.some(e=>e.day===s.day&&e.group===choice.group))throw Error('今晚已经安排过这一类活动');
 const skitBefore=captureSkitState(s,mood(s));
 s.cash-=choice.cost;s.expenses+=choice.cost;
 const receipt={day:s.day,id,group:choice.group,cost:choice.cost,timestamp:currentTradingTimestamp(s),label:choice.label};s.recapChoiceLedger.push(receipt);s.recapChoiceLedger=s.recapChoiceLedger.slice(-200);recordConsumption(s,{id:`activity:${s.day}:${id}`,kind:'activity',label:choice.label,amount:choice.cost,timestamp:receipt.timestamp});
 if(id==='quiet-night')s.stress=Math.max(0,(s.stress||0)-3);
 else s.mentalBoost=Math.min(50,(s.mentalBoost||0)+Math.min(20,4+Math.log10(1+choice.cost)*2));
 recoverRecapAction(s,id);
 mentalState(s);receipt.skitOutcome=makeSkitOutcome(s,`activity:${s.day}:${id}`,skitBefore,captureSkitState(s,mood(s)));refreshReport(s);return receipt;
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
 s.cash+=amount;s.externalFunding+=amount;s.loan.outstanding+=amount;s.loan.borrowed+=amount;s.loan.lastBorrow={id:`network-borrow:${s.loan.borrowCount}`,day:s.day,amount,outstanding:s.loan.outstanding,timestamp:currentTradingTimestamp(s)};s.stress+=3;mentalState(s);refreshReport(s);return{amount,outstanding:s.loan.outstanding};
}
export function repayNetwork(s,amount){
 ensureStory(s);if(!tradingOpen(s)&&!['day_end','resting'].includes(s.phase))throw Error('当前市场已休市');
 if(!Number.isFinite(amount)||amount<=0||amount>Math.min(s.loan.outstanding,accountMetrics(s).availableMargin))throw Error('还款不能超过可支配现金或欠款');
 s.cash-=amount;s.externalFunding-=amount;s.loan.outstanding-=amount;s.loan.repaid+=amount;s.loan.lastRepayment={id:`network-repay:${s.loan.repaid}`,day:s.day,amount,outstanding:s.loan.outstanding,timestamp:currentTradingTimestamp(s)};mentalState(s);refreshReport(s);return{amount,outstanding:s.loan.outstanding};
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
 recordHallPosition(s);s.collateralLedger ||= [];s.collateralLedger.push({day:s.day,beat:s.beat,positionId:id,amount});mentalState(s);
 return{positionId:id,amount,before,after:equity(s),notional:p.notional,margin:p.margin};
}
export function rescueClose(s,id){
 ensureOrders(s);if(!['playing','decision'].includes(s.phase))throw Error('当前无法提前平仓');
 const before=equity(s),trades=closeOrders(s,1,'rescue',id);return{trade:trades[0],trades,before,after:equity(s),action:'rescue'};
}
export function livingCost(s){
 return money(Math.min(Math.max(0,equity(s)),livingChargeParts(s).total));
}
export function selectLifestyle(s,id){
 if(!tradingOpen(s)&&!['day_end','resting'].includes(s.phase))throw Error('当前不能调整生活安排');
 const quote=quoteHousingSelection(s,id);
 if(!quote.changed)return {...quote,recurring:true,move:null};
 if(accountMetrics(s).availableMargin+1e-6<quote.moveInCost)throw Object.assign(Error('可用资金不足以支付搬入费'),{code:'insufficient-living-cash'});
 const timestamp=currentTradingTimestamp(s);
 s.cash-=quote.moveInCost;s.expenses+=quote.moveInCost;
 const selection=commitHousingSelection(s,quote,{paidAmount:quote.moveInCost,timestamp});
 if(quote.moveInCost)recordConsumption(s,{id:`housing:${s.day}:${(s.consumptionLedger||[]).filter(r=>r.kind==='housing').length+1}`,kind:'housing',label:`搬入${quote.label}`,amount:quote.moveInCost,timestamp});
 mentalState(s);refreshReport(s);return {...selection,recurring:true};
}
function refreshReport(s){if(!s.dayReport||s.dayReport.day!==s.day)return;ensureReportLiving(s);const funding=s.externalFunding-s.dayOpeningFunding,costs=s.expenses-s.dayOpeningExpenses,income=(s.nonTradingIncome||0)-(s.dayOpeningIncome||0)+(s.lotteryIncome||0)-(s.dayOpeningLotteryIncome||0)+(s.cheatLotteryIncome||0)-(s.dayOpeningCheatLotteryIncome||0);s.dayReport.closing=equity(s);s.dayReport.funding=funding;s.dayReport.costs=costs;if(s.lifeActions)s.dayReport.nonTradingIncome=(s.nonTradingIncome||0)-(s.dayOpeningIncome||0);s.dayReport.net=Number.isFinite(s.dayReport.closedTradeNet)?s.dayReport.closedTradeNet:equity(s)-s.dayOpening-funding-income+costs;s.dayReport.externalFunding=s.externalFunding;s.dayReport.tradeNet=s.dayReport.net;s.dayReport.netTradingProfit=s.dayReport.net;sealAccountingDay(s);}
const canRentQuote=s=>(tradingOpen(s)||isHistorical(s)&&s.phase==='decision'&&s.historical.status==='loading')&&(isHistorical(s)||isLiveMarket(s)||hasCanonicalGrid(s.script));
export function selectCandlePeriod(s,minutes){if(!CANDLE_PERIODS.some(p=>p.minutes===minutes))throw Error('未知K线周期');s.candlePeriod=minutes;return{charged:false,amount:0,receipt:null};}
export function quoteRefreshOffer(s,hz){return quotePackageOffer(s,hz,{availableCash:Math.min(Math.max(0,s.cash),accountMetrics(s).availableMargin),canPurchase:canRentQuote(s)});}
export function purchaseQuoteRefresh(s,hz){
 const plan=planQuotePackagePurchase(s,hz,{availableCash:Math.min(Math.max(0,s.cash),accountMetrics(s).availableMargin),canPurchase:canRentQuote(s),timestamp:currentTradingTimestamp(s)});
 if(plan.charged){
  if(!quoteCostRepresentable(s.cash,plan.amount)||!quoteCostRepresentable(s.expenses,plan.amount,{add:true}))throw Error('费用精度不足，未租用行情套餐');
  s.cash-=plan.amount;s.expenses+=plan.amount;s.quotePackageExpense=(s.quotePackageExpense||0)+plan.amount;recordConsumption(s,{id:plan.receipt.id,kind:'quote-package',label:plan.receipt.label,amount:plan.amount,timestamp:currentTradingTimestamp(s)});
 }
 s.quotePackage=plan.package;if(plan.charged){mentalState(s);refreshReport(s);}return plan;
}
// Called only at a real trading-day boundary. Reloading and rendering never charge.
export function renewQuoteRefresh(s){
 const p=quotePackageState(s);
 if(!s.quotePackage||!canRentQuote(s)||p.renewal?.day===s.day)return {charged:false};
 if(p.renewalBlocked)return {charged:false,blocked:true};
 const hz=p.preferredHz,offer=quoteRefreshOffer(s,hz);
 if(!offer.valid){
  s.quotePackage={...s.quotePackage,selectedHz:Math.min(hz,p.ownedHz),renewalBlocked:true,renewal:{day:s.day,hz,status:'failed',reason:offer.reason}};
  return {charged:false,blocked:true,reason:offer.reason};
 }
 const result=purchaseQuoteRefresh(s,hz);
 s.quotePackage.renewal={day:s.day,hz,status:'renewed'};
 return result;
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
      const direction=s.position?.direction||1;s.publicStance={day:s.day,beat:s.beat,direction,...(s.marketBook?{symbol:s.position?positionMarket(s.position):activeMarket(s)}:{})};
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
  if(!tradingOpen(s)&&!(['half','close'].includes(action.type)&&canCloseAtKnownQuote(s,action.positionId)))throw Error('当前市场已休市');
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
    const p={id:'order-'+s.nextOrderId++,...(s.marketBook?{symbol:activeMarket(s)}:{}),direction:action.type==='long'?1:-1,entry:s.price,pnlModel:'usd-jpy-v6',margin,initialMargin:margin,notional:margin*action.leverage,leverage:action.leverage,
      ...orderStop(s,action),risk:margin/Math.max(1,accountMetrics(s).tradingEquity+margin)*action.leverage,
      openFee,openFeeRemaining:openFee,maxUnrealized:0,nearMiss:false,day:s.day,beat:s.beat};
    s.positions.push(p);syncPosition(s);recordHallPosition(s);s.nextStop=null;
    s.lastTrade={type:'open',timestamp:currentTradingTimestamp(s),...(isLiveMarket(s)?{liveQuote:liveTradeEvidence(s)}:{}),...historicalExecutionEvidence(s,positionMarket(p)),positionId:p.id,...(s.marketBook?{symbol:positionMarket(p)}:{}),direction:p.direction,margin,leverage:p.leverage,entry:p.entry,pnlModel:p.pnlModel,quantity:positionQuantity(p),openFee,fee:openFee,day:s.day,beat:s.beat};
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
export function enableRealtime(s){s.realtime=true;s.marketPaused=!!s.marketPaused;if(isHistorical(s)&&s.historical.status==='exhausted'&&!s.historyContinuation)startHistoricalContinuation(s,'exhausted');return s;}
export function advanceQuote(s){
  if(isLiveMarket(s))throw Error('真实行情由报价来源更新');
  if(s.marketPaused)throw Error('实时行情已暂停');
  if(!s.realtime||!marketPlaybackOpen(s))throw Error('当前没有实时行情');
  if(s.phase==='decision')beginSegment(s);
  const result=advanceQuoteTick(s);settleDueLottery(s);
  if(s.phase==='decision'&&marketPlaybackOpen(s))beginSegment(s);
  return result;
}
export function advanceMarket(s){
  if(isLiveMarket(s))throw Error('真实行情由报价来源更新');
  if(s.marketPaused)throw Error('实时行情已暂停');
  if(!s.realtime||!marketPlaybackOpen(s))throw Error('当前没有实时行情');
  if(s.phase==='decision')beginSegment(s);
  const result=advanceTick(s);
  if(s.phase==='decision'&&marketPlaybackOpen(s))beginSegment(s);
  return result;
}
function appendChatAfterBeat(s){
  const first=s.candles.at(-CANDLES_PER_BEAT),delta=s.price/(first?.open||s.price)-1;
  appendDialogue(s,'group','group.market.'+(Math.abs(delta)<.0005?'flat':delta>0?'up':'down'));
  const stanceSymbol=positionMarket(s.publicStance),stanceCandles=stanceSymbol===activeMarket(s)?s.candles:s.marketBook?.markets?.[stanceSymbol]?.candles,stancePrice=marketPrice(s,stanceSymbol),stanceDelta=stancePrice/(stanceCandles?.at(-CANDLES_PER_BEAT)?.open||stancePrice)-1;
  if(s.publicStance?.day===s.day&&s.publicStance.beat===s.beat-1&&Math.abs(stanceDelta)>=.0005){
    const correct=s.publicStance.direction===(stanceDelta>=0?1:-1);
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
  s.cash-=interestPaid;s.expenses+=interest;recordConsumption(s,{id:`interest:${s.day}`,kind:'interest',label:'网络贷款利息',amount:interest,timestamp:currentTradingTimestamp(s)});
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
  if(!canCloseAtKnownQuote(s)&&s.phase!=='closing')throw Error('今天已经结束');
  if(s.phase!=='closing')s.earlyClose={day:s.day,beat:s.beat,candle:s.pending?.candle||0,tick:s.pending?.tick||0,price:s.price,timestamp:currentTradingTimestamp(s)};
  ensureOrders(s);enforceMargin(s);
  s.pending=null;s.phase='closing';
  return settleDay(s);
}
// A low-stamina prompt never liquidates positions. The single action card first
// asks for an explicit close-all, then calls this entry after verifying flatness.
export function requestStaminaRest(s){
 if(positionsOf(s).length)return{applied:false,alreadyApplied:false,requiresClose:true,reason:'positions-open'};
 if(s.mode==='endless'){
  if(!['decision','playing'].includes(s.phase))return{applied:false,alreadyApplied:false,endless:true,reason:'rest-unavailable'};
  const stamina=ensureStamina(s),recoveryId=`stamina:endless-rest:${s.day}:${stamina.watchMinutes}`,recovery=recoverLifeSleep(s,{id:recoveryId});
  if(recovery.applied){
   // This endpoint alone creates these IDs from the current observation count.
   // Keeping its latest receipt preserves repeat/refresh protection without an
   // ever-growing endless-rest ledger. Other recovery/consumption IDs stay intact.
   stamina.recoveryReceipts=stamina.recoveryReceipts.filter(row=>row.source!=='sleep'||!row.id.startsWith('stamina:endless-rest:')||row.id===recoveryId);
   if(!s.liveSuspension?.active&&!s.liveMarket?.replay?.resetRequired)s.marketPaused=false;
  }
  return{applied:recovery.applied,alreadyApplied:recovery.alreadyApplied,endless:true,report:null,recovery};
 }
 if(s.dayReport?.day===s.day&&['day_end','resting','ending'].includes(s.phase))return{applied:false,alreadyApplied:true,endless:false,report:s.dayReport};
 if(!['decision','playing','closing'].includes(s.phase))return{applied:false,alreadyApplied:false,reason:'rest-unavailable'};
 // An empty account needs no executable quote to stop watching. Preserve the
 // last observed mark and let the existing settlement own all daily charges.
 if(s.phase!=='closing'){s.earlyClose={day:s.day,beat:s.beat,candle:s.pending?.candle||0,tick:s.pending?.tick||0,price:s.price,timestamp:currentTradingTimestamp(s)};s.pending=null;s.phase='closing';}
 const report=settleDay(s);return{applied:true,alreadyApplied:false,endless:false,report};
}
// Opening/browsing a picker must not call any mutating engine helper.
export function lifeActionStatus(s){
 const selected=lifeActionReceipt(s),day=s.day,runId=lifeActionRunId(s);
 let reason=null;
 if(s.mode==='endless')reason='操盘模式连续运行，不进行日结算';
 else if(selected)reason='今天已安排生活行动';
 else if(!['decision','playing','closing','day_end'].includes(s.phase)||s.phase==='day_end'&&(s.dayReport?.day!==s.day||s.dayReport.livingSettlement?.status!=='pending'))reason='今天已经结束';
 else if(positionsOf(s).some(p=>!Number.isFinite(marketPrice(s,positionMarket(p)))||marketPrice(s,positionMarket(p))<=0)||isLiveMarket(s)&&positionsOf(s).length&&!livePositionsReady(s)||isMultiHistory(s)&&!multiHistoryPositionsCurrent(s))reason='行情暂缓，暂不能平仓';
 else if(['decision','playing'].includes(s.phase)&&!canCloseAtKnownQuote(s)&&!(s.phase==='playing'&&!isHistorical(s)&&!isLiveMarket(s)))reason='行情暂缓，暂不能结束交易';
 return {enabled:!reason,reason,day,runId,selected:selected?structuredClone(selected):null};
}
function settleLifeActionDay(s){
 if(s.phase==='day_end')return s.dayReport;
 if(s.phase==='playing'&&!s.realtime&&!isHistorical(s)&&!isLiveMarket(s)){
  s.earlyClose={day:s.day,beat:s.beat,candle:s.pending?.candle||0,tick:s.pending?.tick||0,price:s.price,timestamp:currentTradingTimestamp(s)};
  ensureOrders(s);enforceMargin(s);s.pending=null;s.phase='closing';return settleDay(s);
 }
 return finishTradingDay(s);
}
export function lifeActionOptions(s,category){
 const status=lifeActionStatus(s);let dinners=new Map(),dinnerError=null,relaxCash=accountMetrics(s).availableMargin;
 if(category==='relax'&&status.enabled){try{const preview=structuredClone(s);settleLifeActionDay(preview);relaxCash=accountMetrics(preview).availableMargin;}catch{relaxCash=0;}}
 if(category==='dinner'&&status.enabled){
  // Exact fee/interest/tier preview on a disposable copy. The player's account,
  // story, market cursor and persisted receipts are untouched by opening a menu.
  try{const preview=structuredClone(s),r=settleLifeActionDay(preview);dinners=new Map(recapChoices({sealed:true,mode:preview.mode,daily:{tradingNet:r.net,openingNominal:r.opening},account:{netAssets:equity(preview)-debtSummary(preview).total}},{cash:accountMetrics(preview).availableMargin}).filter(row=>row.group==='dinner').map(row=>[row.id,row]));}
  catch(error){dinnerError=error.message;}
 }
 return (LIFE_ACTION_CATALOG[category]||[]).map(row=>{
  const terms=category==='work'?quoteWorkAction(s,row,staminaStatus(s).value):{};
  const known=category==='friend'?lifeFriendKnown(s,row.id):true;
  const dinner=category==='dinner',offer=dinners.get(row.id),used=dinner&&s.recapChoiceLedger?.some(entry=>entry.day===s.day&&entry.group==='dinner');
  const workReason=category==='work'?workUnlockReason(s,row,{knowsFriend:id=>lifeFriendKnown(s,id),netAssets:equity(s)-debtSummary(s).total}):null;
  const enoughCash=category!=='relax'||relaxCash>=(row.cost||0);
  const recovered=['friend','relax','dinner'].includes(category)&&mainRecoveryUsed(s);
  const enabled=!recovered&&known&&!workReason&&status.enabled&&enoughCash&&(!dinner||!!offer?.enabled&&!used);
  const reason=recovered?'今晚已经安排过恢复活动':!known?'还未相识':status.reason||workReason||(!enoughCash?'可用资金不足':null)||(!dinner?null:used?'今晚已经请过客':dinnerError||(!offer?`今日交易净收益需达到 ¥${row.minGain.toLocaleString('zh-CN')}`:!offer.enabled?'可用资金不足':null));
  return {...row,...terms,...(category==='friend'?{known}:{}),...(category==='relax'?{staminaRecovery:row.id==='onsen'?ONSEN_POLICY.recovery:18,stressDelta:row.id==='onsen'?-ONSEN_POLICY.stressReduction:-3}:{}),unlocked:known&&!workReason,enabled,reason};
 });
}
export function commitLifeAction(s,{category,optionId,day,runId}={}){
 const selected=lifeActionDefinition(category,optionId);
 if(!selected)throw Error('没有这个生活行动');
 if(day!==s.day||runId!==lifeActionRunId(s))throw Error('日期已变化，请重新选择生活行动');
 const previous=lifeActionReceipt(s);
 if(previous)return {applied:false,alreadyApplied:true,receipt:previous,report:s.dayReport};
 const status=lifeActionStatus(s);if(!status.enabled)throw Error(status.reason);
 if(['friend','relax','dinner'].includes(category)&&mainRecoveryUsed(s))throw Error('今晚已经安排过恢复活动');
 if(category==='work'){const reason=workUnlockReason(s,selected,{knowsFriend:id=>lifeFriendKnown(s,id),netAssets:equity(s)-debtSummary(s).total});if(reason)throw Error(reason);}
 if(category==='friend'&&!lifeFriendKnown(s,optionId))throw Error('还未相识');
 if(category==='dinner'||category==='work'||selected.cost>0){
  // A changed quote or inadequate cash must never end the original day before
  // the existing dinner rule has accepted the exact chosen option and cost.
  const sealedReport=s.phase==='day_end'&&s.dayReport?.day===s.day?s.dayReport:null;
  const draft=structuredClone(s),result=applyLifeAction(draft,selected);
  // Commit the accepted action into the already sealed report only after every
  // draft operation succeeds. Its closing trades, fees and interest are reused.
  if(sealedReport){
   const fixedFields=['day','closedTradeNet','net','tradeNet','netTradingProfit','trades','fees','feesPaid','totalFeesPaid','interest','interestPaid','interestAccrued','earlyClose','closedAt'];
   if(!fixedFields.every(key=>JSON.stringify(sealedReport[key])===JSON.stringify(draft.dayReport[key])))throw Error('当日日结已变化，请重新选择');
   Object.assign(sealedReport,draft.dayReport);draft.dayReport=sealedReport;result.report=sealedReport;
  }
  Object.assign(s,draft);return result;
 }
 return applyLifeAction(s,selected);
}
const lifeActionDialogueForCatToy=selected=>lifeActionDialogueForSource(selected,'yasuko-cat-toy-20261017');
function applyLifeAction(s,selected){
 const {category,id:optionId}=selected,before=equity(s),fees=s.feesPaid||0,orderCount=positionsOf(s).length,timestamp=currentTradingTimestamp(s);
 // One synchronous transition: queued quotes and repeated clicks cannot interleave.
 const startStamina=staminaStatus(s).value;
 const report=settleLifeActionDay(s),skitBefore=captureSkitState(s,mood(s));
 let work=null;const terms=category==='work'?effectiveWorkTerms(s,selected):{income:selected.income};
 if(category==='work'){
  const baseWage=terms.income;terms.income=calculateWorkPay(startStamina,terms.staminaCost,baseWage);
  const payRatio={version:1,startStamina,requiredStamina:terms.staminaCost,baseWage};
  const spent=consumeStamina(s,{amount:Math.min(startStamina,terms.staminaCost),id:`stamina:work:${s.day}`,source:'work'});
  if(!spent.applied)throw Error('体力不足，先休息');
  const stressBefore=s.stress||0;s.stress=Math.max(0,stressBefore+selected.stressDelta);
  work={payRatio,pay:{...selected.pay},terms:terms.terms,staminaCost:terms.staminaCost,stressDelta:selected.stressDelta,stressBefore,stressAfter:s.stress,reward:awardWorkItem(s,selected,`life:${lifeActionRunId(s)}:${s.day}`)};
 }
 if(category==='dinner')chooseRecapAction(s,optionId);
 if(category==='relax'&&selected.cost){
  if(accountMetrics(s).availableMargin<selected.cost)throw Error('可用资金不足');
  s.cash-=selected.cost;s.expenses+=selected.cost;recordConsumption(s,{id:`life-cost:${lifeActionRunId(s)}:${s.day}`,kind:'relax',label:selected.label,amount:selected.cost,timestamp});
 }
 const sourceVersion=s.version===LIFE_ACTION_SAVE_VERSION?s.lifeActions.sourceVersion:s.version;
 s.lifeActions ||= {version:1,sourceVersion,receipts:[]};
 s.nonTradingIncome ??= 0;s.dayOpeningIncome ??= 0;
 s.cash+=terms.income;s.nonTradingIncome=money(s.nonTradingIncome+terms.income);
 // Existing friend / quiet-night mental recovery and bounded stamina recovery.
 // Dinner recovery is owned by chooseRecapAction, so it cannot apply twice.
 if(category==='friend'){s.relationship++;s.stress=Math.max(0,s.stress-4);}
 if(category==='relax')s.stress=Math.max(0,s.stress-(optionId==='onsen'?ONSEN_POLICY.stressReduction:3));
 const catToy=category==='friend'&&optionId==='yasuko'&&!!s.workInventory?.catToy&&validWorkInventory(s);
 const staminaRecovery=recoverLifeAction(s,category,`life:${lifeActionRunId(s)}:${s.day}`,optionId,{catToy});
 const consequenceFirst=dailyNarrativeFacts(s)?.needsConsequence===true;
 const dialogue=consequenceFirst?null:work?workPayDialogue(selected.dialogue,{...work.payRatio,income:terms.income}):catToy?lifeActionDialogueForCatToy(selected):selectLifeSceneDialogue(selected,s)||lifeActionDialogue(selected);
 if(dialogue){s.chat.friend.push(...dialogue.lines.map((line,index)=>({...line,dialogueId:`${dialogue.sourceId}:${index}`,kind:line.from==='久留美'?'self':'friend'})));s.chat.friend=s.chat.friend.slice(-60);}
 const receipt={id:`life:${lifeActionRunId(s)}:${s.day}`,day:s.day,category,optionId,label:selected.label,income:terms.income,cost:selected.cost||0,feeTotal:money((s.feesPaid||0)-fees),closedPositions:orderCount,timestamp,assetsBefore:before,assetsAfter:equity(s),dialogue,...(consequenceFirst?{narrativeMode:'consequence-first-v1'}:{}),...(work?{work}: {})};
 s.lifeActions.receipts.push(receipt);s.version=LIFE_ACTION_SAVE_VERSION;
 mentalState(s);receipt.skitOutcome=makeSkitOutcome(s,receipt.id,skitBefore,captureSkitState(s,mood(s)));report.lifeAction=structuredClone(receipt);refreshReport(s);return {applied:true,alreadyApplied:false,receipt,report,staminaRecovery};
}
export function settleDay(s) {
  if(s.mode==='endless')throw Error('操盘模式不进行日结算');
  if(s.phase!=='closing')throw Error('请等待今日行情结束，再全平收盘');
  settleDueLottery(s,{endOfDay:true});
  if(positionsOf(s).length)closeOrders(s,1,'closing');
  s.cash+=s.reserve;s.reserve=0;
  const livingEstimate=livingCost(s),{interest,interestPaid,interestAccrued,interestRate}=accrueLoanInterest(s,livingEstimate);
  // Interest is accounted for now; living costs are a pending obligation until
  // the narrative page has applied its non-financial effects.
  s.expenseLedger ||= [];s.expenseLedger.push({day:s.day,living:0,interest,interestRate,livingStatus:'pending'});
  if(s.dinner)appendDialogue(s,'friend','friend.day.end');
  mentalState(s,true);
  const closing=equity(s),funding=s.externalFunding-s.dayOpeningFunding,costs=s.expenses-s.dayOpeningExpenses,income=(s.nonTradingIncome||0)-(s.dayOpeningIncome||0)+(s.lotteryIncome||0)-(s.dayOpeningLotteryIncome||0)+(s.cheatLotteryIncome||0)-(s.dayOpeningCheatLotteryIncome||0);
  s.dayReport={day:s.day,beat:s.beat,bonusBeats:s.bonusBeats||0,opening:s.dayOpening,closing,net:closing-s.dayOpening-funding-income+costs,funding,costs,
    livingCost:0,pendingLivingCost:livingEstimate,openingNetAssets:dailyReturnMetrics(s,{report:null}).denominator,openingDebt:Number.isFinite(s.dayOpeningDebt)?s.dayOpeningDebt:null,interest,interestPaid,interestAccrued,interestRate,tradeNet:closing-s.dayOpening-funding-income+costs,netTradingProfit:closing-s.dayOpening-funding-income+costs,trades:s.history.filter(t=>t.day===s.day), mood:mood(s), promise:s.promise,externalFunding:s.externalFunding,
    openingLine:s.dayOpeningLine,closingLine:s.speech.text,fees:s.feeLedger.filter(t=>t.day===s.day).reduce((sum,t)=>sum+t.amount,0),feesPaid:s.feeLedger.filter(t=>t.day===s.day).reduce((sum,t)=>sum+t.amount,0),totalFeesPaid:s.feesPaid,
    moments:(s.dayMoments||[]).filter(t=>t.day===s.day),peak:s.history.filter(t=>t.day===s.day).reduce((a,t)=>!a||Math.abs(t.pnl||0)>Math.abs(a.pnl||0)?t:a,null)};
  if(isHistorical(s)){s.dayReport.closedAt=currentTradingTimestamp(s);s.dayReport.openedAt=tradingTimestamp(s,{day:s.day});}
  if(isLiveMarket(s)){s.dayReport.closedAt=liveTimestamp(s);s.dayReport.openedAt=s.liveMarket.openingAt;}
  if(s.earlyClose?.day===s.day)s.dayReport.earlyClose={...s.earlyClose};
  if(s.lifeActions)s.dayReport.nonTradingIncome=(s.nonTradingIncome||0)-(s.dayOpeningIncome||0);
  s.dayReport.closedTradeNet=s.dayReport.net;
  const quote=dayLivingQuote(s,s.dayReport,livingDayRoll(s.seed,s.day));
  s.dayReport.livingSettlement={version:1,day:s.day,status:'pending',quote};s.dayReport.pendingLivingCost=quote.amount;
  s.completedDays=Math.max(s.completedDays||0,s.day-1);s.dayReport.performance={...s.performance};s.dayReport.completedCandles=s.completedCandles;s.dayReport.completedDays=s.completedDays;s.phase='day_end';checkFatherTheftAtClose(s,{tradingProfit:tradingProfit(s)});sealAccountingDay(s);return s.dayReport;
}
function dayLivingQuote(s,report,roll,{legacyPricing=false}={}){
 const knowsFriend=s.story?.seen?.includes('friendStudy')||s.story?.log?.some(entry=>entry.id==='friendStudy')||s.itemUnlocks?.mochiko?.event==='friendStudy';
 const parts=legacyPricing?{basics:livingCost(s),rent:0}:livingChargeParts(s);
 if(legacyPricing)parts.basics=money(Math.min(Math.max(0,equity(s)),lifestylePlan(s).dailyCost*(1-(s.livingDiscount||0))));
 return {...quoteLivingMeal({seed:s.seed,day:report.day,baseAmount:parts.basics,rentAmount:parts.rent,cash:Math.max(0,s.cash),openingNetAssets:dailyReturnMetrics(s,{report}).denominator,tradingNet:report.closedTradeNet??report.net,knowsFriend,lastSpecialDay:s.livingPolicy?.lastSpecialDay??null,discount:parts.mealCredit?1:0,lifestyleId:parts.lifestyleId??lifestylePlan(s).id,pricingVersion:parts.pricingVersion,allowFeast:false,roll}),...(legacyPricing?{legacyPricing:true}:{})};
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
 const preserveLegacy=s.housingEconomy?.effectiveDay>s.day&&settlement.quote.pricingVersion!==2;
 const quote=preserveLegacy?{...settlement.quote,amount:Math.min(settlement.quote.amount,Math.max(0,s.cash)),...(!Object.hasOwn(settlement.quote,'rentAmount')?{legacyPricing:true}:{})}:dayLivingQuote(s,report,settlement.quote.roll,{legacyPricing:!Object.hasOwn(settlement.quote,'rentAmount')});
 const amount=quote.amount,assetsBefore=equity(s),netAssetsBefore=assetsBefore-debtSummary(s).total;
 // One synchronous state transition. Animation/playback never commits money.
 s.cash-=amount;s.expenses+=amount;s.livingPaid=(s.livingPaid||0)+amount;recordConsumption(s,{id:`living:${s.seed}:${s.day}`,kind:'living',label:quote.label,amount,timestamp:currentTradingTimestamp(s)});
 report.livingCost=amount;report.pendingLivingCost=0;settlement.status='finalized';settlement.quote=quote;
 const receipt={id:`living:${s.seed}:${s.day}`,day:s.day,amount,baseAmount:quote.baseAmount,lifestyleId:quote.lifestyleId,kind:quote.kind,label:quote.label,seedLocked:true,roll:quote.roll,assetsBefore,assetsAfter:equity(s),netAssetsBefore,netAssetsAfter:equity(s)-debtSummary(s).total,timestamp:currentTradingTimestamp(s)};
 receipt.service=paidLivingService(quote);
 if(receipt.service)s.lifestyle={version:2,id:lifestylePlan(s).id,selectedDay:s.lifestyle?.selectedDay||s.day};
 settlement.receipt=receipt;ledger.living=amount;ledger.livingStatus='finalized';ledger.livingReceipt=receipt.id;
 if(['feast','friend-treat'].includes(quote.kind))s.livingPolicy={version:1,lastSpecialDay:s.day};
 s.completedDays=Math.max(s.completedDays||0,equity(s)>=MIN_EQUITY&&(report.beat>=BEATS_PER_DAY+(report.bonusBeats||0)||report.earlyClose?.day===s.day)?s.day:s.day-1);report.completedDays=s.completedDays;
 mentalState(s,true);refreshReport(s);return{charged:true,amount,receipt};
}
export function beginRest(s){if(s.phase!=='day_end')throw Error('先完成全平收盘');s.phase='resting';mentalState(s);return pendingStory(s);}
// Voluntary run exit is independent of the daily settlement/story pipeline.
// It uses the existing risk and order execution paths at the last known quote.
export function suspendLiveRun(s){
 if(!isLiveMarket(s)||!['decision','playing','closing','day_end','resting','bankrupt'].includes(s.phase))throw Error('当前无法暂时离开');
 if(s.liveSuspension?.active)return {suspended:true,alreadyApplied:true,suspension:s.liveSuspension};
 const sequence=(s.liveSuspension?.sequence||0)+1;
 s.liveSuspension={version:1,id:`live-suspend:${lifeActionRunId(s)}:${sequence}`,sequence,day:s.day,phase:s.phase,requestedAt:Date.now(),pausedBefore:!!s.marketPaused,active:true,quoteTimes:Object.fromEntries(LIVE_SYMBOLS.map(symbol=>[symbol,liveTimestamp(s,symbol)]))};
 s.marketPaused=true;suspendStaminaWatching(s);return {suspended:true,alreadyApplied:false,suspension:s.liveSuspension};
}
export function resumeLiveRun(s){
 if(!s.liveSuspension?.active)return false;
 s.marketPaused=s.liveSuspension.pausedBefore;s.liveSuspension.quoteTimes||=Object.fromEntries(LIVE_SYMBOLS.map(symbol=>[symbol,liveTimestamp(s,symbol)]));s.liveSuspension.active=false;s.liveSuspension.awaitingFresh=true;markLiveRestored(s);suspendStaminaWatching(s);return true;
}
function validLiveSuspension(s){
 const x=s.liveSuspension;if(x===undefined)return true;
 if(x?.quoteTimes!==undefined&&(!x.quoteTimes||LIVE_SYMBOLS.some(symbol=>x.quoteTimes[symbol]!==null&&(!Number.isFinite(x.quoteTimes[symbol])||x.quoteTimes[symbol]<=0))))return false;
 if(x?.awaitingFresh!==undefined&&typeof x.awaitingFresh!=='boolean'||x?.awaitingFresh&&!x.quoteTimes)return false;
 return isLiveMarket(s)&&x?.version===1&&Number.isSafeInteger(x.sequence)&&x.sequence>0&&x.id===`live-suspend:${lifeActionRunId(s)}:${x.sequence}`&&Number.isSafeInteger(x.day)&&x.day>0&&x.day<=s.day&&['decision','playing','closing','day_end','resting','bankrupt'].includes(x.phase)&&Number.isFinite(x.requestedAt)&&x.requestedAt>0&&typeof x.active==='boolean'&&typeof x.pausedBefore==='boolean'&&(!x.active||s.marketPaused===true&&s.phase===x.phase);
}
function sealWalkawayLifeChoice(s){
 const ending=classifyEnding(s);
 if(ending?.baseId!=='walkaway'||ending.variant)return;
 const choice=selectEndingLifeChoice(s);if(choice)s.ending.lifeChoice=choice;
}
export function finishRunImmediately(s){
  if(isLiveMarket(s)&&positionsOf(s).length&&!liveTradingReady(s))return suspendLiveRun(s);
  if(s.phase==='ending'&&s.ending)return s.ending;
  if(!['decision','playing','closing','day_end','resting','bankrupt'].includes(s.phase))throw Error('当前无法收手离场');
  const timestamp=currentTradingTimestamp(s);
  ensureOrders(s);enforceMargin(s);if(positionsOf(s).length)closeOrders(s,1,'closing');
  s.pending=null;s.marketPaused=true;s.walkawayRequested=true;s.phase='ending';mentalState(s);
  s.ending={id:'walkaway',day:s.day,equity:equity(s),profit:tradingProfit(s),sanity:s.sanity,timestamp,immediate:true};
  sealWalkawayLifeChoice(s);
  recordAccountingPoint(s,'closing');recordAccountingDay(s);
  return s.ending;
}
export function finishEndlessCampaign(s){
  if(s.mode!=='endless')throw Error('剧情模式先完成今晚结算');
  if(isLiveMarket(s)&&positionsOf(s).length&&!liveTradingReady(s))return suspendLiveRun(s);
  if(s.phase==='ending'&&s.ending)return s.ending;
  if(!['decision','playing'].includes(s.phase))throw Error('当前无法收手离场');
  const timestamp=currentTradingTimestamp(s);
  ensureOrders(s);enforceMargin(s);if(positionsOf(s).length)closeOrders(s,1,'closing');
  // Exiting is not a new quote/day boundary: no invented candle, interest,
  // recovery tick or completed survival day. Keep the run and its liabilities.
  s.pending=null;s.marketPaused=true;s.phase='ending';mentalState(s);
  s.ending={id:'walkaway',day:s.day,equity:equity(s),profit:tradingProfit(s),sanity:s.sanity,timestamp};
  sealWalkawayLifeChoice(s);
  return s.ending;
}
export function finishCampaign(s,id='walkaway'){
  if(!['day_end','resting'].includes(s.phase)||pendingStory(s))throw Error('先完成今晚的休息事件');
  if(!['million','walkaway','broke','crisis'].includes(id))throw Error('未知结局');
  finalizeDayLiving(s);
  s.ending={id,day:s.day,equity:equity(s),profit:tradingProfit(s),sanity:s.sanity};s.phase='ending';if(id==='walkaway')sealWalkawayLifeChoice(s);return s.ending;
}
export function endingCondition(s){if(s.mode==='endless')return equity(s)<MIN_EQUITY?'broke':null;return s.sanity<=5&&equity(s)<5000?'crisis':equity(s)<MIN_EQUITY?'broke':tradingProfit(s)>=TARGET_PROFIT?'million':null;}
export function advanceTick(s){
  const samples=[];let result;
  do{result=advanceQuoteTick(s);samples.push(result);}while(!result.logicalSecondEnded&&s.phase==='playing');
  const exits=samples.flatMap(r=>r.exits||[]);return{...result,exits,exit:exits[0]||null};
}
function advanceQuoteTick(s) {
  if(isLiveMarket(s))throw Error('真实行情由报价来源更新');
  if(isHistorical(s))return advanceHistoricalTick(s);
  if(s.phase!=='playing'||!s.pending)throw Error('当前没有待播放行情');
  const p=s.pending,points=s.script.tracks[p.beat][p.candle];
  const fine=hasCanonicalGrid(s.script),subtick=fine?(p.subtick??0):0,lastSubtick=!fine||subtick===QUOTE_SUBSTEPS-1;
  const price=quoteSubstep(s.script,{...p,subtick});
  consumeTradingStamina(s,{minutes:15/TICKS_PER_CANDLE/(fine?QUOTE_SUBSTEPS:1),emotion:mood(s),sampleId:`sim:${s.day}:${p.beat}:${p.candle}:${p.tick}:${subtick}`});
  let candle=s.candles.at(-1);
  if(p.tick===0&&subtick===0){candle={open:s.price,close:s.price,high:s.price,low:s.price,closed:false,day:s.day,beat:p.beat};stampCandleTime(s,candle,p);s.candles.push(candle);recordDisplayQuote(s,candle.timestamp,s.price);}
  stampQuoteTime(s,p,fine?(subtick+1)/QUOTE_SUBSTEPS:1);s.price=price;recordDisplayQuote(s,currentTradingTimestamp(s),price);candle.close=price;candle.high=Math.max(candle.high,price);candle.low=Math.min(candle.low,price);
  advanceHiddenMarkets(s,{...p,subtick});const exits=processQuoteRisk(s,lastSubtick);let exit=exits[0]||null;
  if(!lastSubtick){p.subtick=subtick+1;recordAccountingPoint(s,'quote');if(exits.length)mentalState(s);return{price,candleClosed:false,beatEnded:false,dayEnded:false,exit,exits,flash:null,equity:equity(s),mood:mood(s),logicalSecondEnded:false,subtick};}
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
        recordAccountingDay(s);s.completedDays=(s.completedDays||0)+1;s.day++;s.beat=0;s.dayOpening=equity(s);s.dayOpeningBasisUnknown=false;s.dayOpeningDebt=debtSummary(s).total;s.dayOpeningNetAssets=s.dayOpening-s.dayOpeningDebt;s.dayOpeningFunding=s.externalFunding;s.dayOpeningExpenses=s.expenses;if(s.lifeActions)s.dayOpeningIncome=s.nonTradingIncome||0;if(s.lottery){s.dayOpeningLotteryIncome=s.lotteryIncome||0;s.dayOpeningCheatLotteryIncome=s.cheatLotteryIncome||0;}
        s.script=planDay(marketSeed(s),s.day,s.price,BEATS_PER_DAY,{symbol:activeMarket(s)});renewMarketScripts(s,planDay);s.lastEvent=null;s.swanSeen=false;s.itemsUsed={};s.skills={mochiko:false,yasuko:false};s.bonusBeats=0;s.phase='decision';renewQuoteRefresh(s);mentalState(s);
      }else s.phase='decision';
    }else if(s.beat>=beatsPerDay(s)||equity(s)<MIN_EQUITY||s.sanity<=0){s.phase='closing';dayEnded=true;}
    else s.phase='decision';
  }
  settleDueLottery(s);
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
  if(isHistorical(s)&&!hasHistoricalFeed(s)&&!historicalSimulationActive(s)&&!startHistoricalContinuation(s,'loading'))throw Error('请先载入历史行情');
  if(isHistorical(s)&&!nextHistoricalDate(s)&&!historicalSimulationActive(s)&&!startHistoricalContinuation(s,'exhausted'))throw Error('历史行情尚无可衔接的真实报价');
  finalizeDayLiving(s);
  mentalState(s);
  const ending=endingCondition(s);if(ending){finishCampaign(s,ending);return s;}
  recoverTradingTrauma(s,{kind:'rest'});
  s.stress=Math.max(0,s.stress-4);s.restRecovery=Math.min(32,(s.restRecovery||0)+8);applyPaidLivingRecovery(s);recoverLifeSleep(s);
  s.day++;s.beat=0;s.phase='decision';s.dayOpening=equity(s);s.dayOpeningBasisUnknown=false;s.dayOpeningDebt=debtSummary(s).total;s.dayOpeningNetAssets=s.dayOpening-s.dayOpeningDebt;s.dayOpeningFunding=s.externalFunding;s.dayOpeningExpenses=s.expenses;if(s.lifeActions)s.dayOpeningIncome=s.nonTradingIncome||0;if(s.lottery){s.dayOpeningLotteryIncome=s.lotteryIncome||0;s.dayOpeningCheatLotteryIncome=s.cheatLotteryIncome||0;}s.heat=0;
  if(!s.liveSuspension?.active&&!s.liveMarket?.replay?.resetRequired)s.marketPaused=false;
  activateSelectedHousing(s,currentTradingTimestamp(s));

  s.bonusBeats=0;s.livingDiscount=s.nextDayLivingDiscount||0;delete s.nextDayLivingDiscount;delete s.earlyClose;
  const living=Math.min(livingCost(s),Math.max(0,s.cash));s.cash-=living;s.reserve=living;
  if(isHistorical(s))prepareNextHistoricalDay(s);
  if(isHistorical(s)){resetHistoricalContinuationDay(s);markHistoricalOpening(s);}
  s.script=isLiveMarket(s)?liveScript(s.price):isHistorical(s)?historicalScript():planDay(marketSeed(s),s.day,s.price,BEATS_PER_DAY,{symbol:activeMarket(s)});
  if(isLiveMarket(s)){s.liveMarket.completedInDay=0;s.liveMarket.openingAt=liveTimestamp(s);}renewMarketScripts(s,planDay);s.skills={mochiko:false,yasuko:false};s.itemsUsed={};s.nextStop=null;
  s.dayMoments=[];s.lastEvent=null;s.swanSeen=false;s.lastReaction=null;s.pending=null;s.promise=null;s.promiseNoted=false;s.dinner=false;s.publicStance=null;
  appendDialogue(s,'friend','friend.day.start');updateSpeech(s,mood(s),true);
  renewQuoteRefresh(s);mentalState(s);s.dayOpeningLine=s.speech.text;return s;
}
function refreshNewsCopy(s){
  for(const [i,event] of (s.script.events||[]).entries()){
    const chain=CHAINS.find(c=>c.id===event.id);
    if(!chain||!VARIANTS.includes(event.variant))continue;
    const [title,copy]=chain[event.variant];
    Object.assign(event,{chain:chain.name,title:i%2?title:chain.lead,copy:i%2?copy:chain.leadCopy,source:chain.source,flash:i%2?`${chain.name}：市场继续评估后续影响`:title,flashCopy:copy});
  }
  for(const event of [s.script.swan,s.lastEvent]){
    if(!event?.id)continue;
    const canonical=BLACK_SWANS.find(c=>c.id===event.id);
    if(canonical)Object.assign(event,{title:canonical.title,copy:canonical.copy,name:canonical.name});
  }
  if(s.lastEvent&&!s.lastEvent.swan){
    const event=s.script.events.findLast((event,i)=>i<=(s.pending?.beat??s.beat)&&event.chain===s.lastEvent.chain);
    if(event){const chain=CHAINS.find(c=>c.id===event.id);if(chain)Object.assign(s.lastEvent,{title:/交易活跃度|市场继续评估后续影响/.test(s.lastEvent.title)?`${chain.name}：市场继续评估后续影响`:chain[event.variant][0],copy:chain[event.variant][1],chain:chain.name});}
  }
}
export function restoreGame(raw) {
  try {
    let s=JSON.parse(decodeSaveRaw(raw));const lifeVersion=s?.version===LIFE_ACTION_SAVE_VERSION;if(lifeVersion){if(!validLifeActions(s))return null;s.version=s.lifeActions.sourceVersion;}else if(s?.lifeActions||s?.nonTradingIncome||s?.dayOpeningIncome)return null;const oldVersion=s?.version,openingSnapshot=dailyReturnMetrics(s||{},{report:null});
    if(s&&[2,3].includes(s.version)&&Number.isFinite(s.cash)&&s.cash<0)return null;
    if(s&&Number.isFinite(s.cash)&&s.cash<0&&s.cash>=-1e-8)s.cash=0;
    if(!s||![2,3,4,5,6,7,8,VERSION,10,11,STORY_CAPITAL_VERSION,ENDLESS_CAPITAL_VERSION,MULTI_MARKET_VERSION,LIVE_MARKET_VERSION].includes(s.version)||!Number.isFinite(s.seed)||!Number.isFinite(s.price)||s.price<=0||!Number.isFinite(s.cash)||!Array.isArray(s.candles)||!s.script?.tracks||!['decision','playing','closing','day_end','resting','ending','bankrupt'].includes(s.phase))return null;
    if(!validLiveSuspension(s)||!validEnergyEffect(s.energyEffect)||!validLotteryLedger(s)||!validStamina(s.stamina)||!validDailySupplies(s)||!validLiveMarket(s)||!validHistoricalContinuation(s)||!validMarketBook(s))return null;
    if(s.housingEconomy!==undefined&&(!s.housingEconomy||s.housingEconomy.version!==1||!Number.isSafeInteger(s.housingEconomy.effectiveDay)||s.housingEconomy.effectiveDay<1||s.housingEconomy.effectiveDay>s.day+1))return null;
    if(!validHistoricalSave(s)||[10,11].includes(s.version)&&!isHistorical(s))return null;
    if(!validComicAutoplay(s.comicAutoplay)||!validCandleDisplay(s))return null;
    if(!isHistorical(s)&&!validQuoteGrid(s.script))return null;const packageState=quotePackageState(s);if(packageState.paid>0&&(!Number.isFinite(s.quotePackageExpense)||s.quotePackageExpense!==packageState.paid||!Number.isFinite(s.expenses)||s.expenses+1e-6<packageState.paid))return null;
    if(s.version===STORY_CAPITAL_VERSION&&(s.mode!=='story'||s.startEquity!==STORY_START))return null;
    if(s.version===ENDLESS_CAPITAL_VERSION&&(s.mode!=='endless'||s.startEquity!==STORY_START))return null;
    if(s.phase==='playing'&&hasCanonicalGrid(s.script)&&(!Number.isInteger(s.pending?.subtick)||s.pending.subtick<0||s.pending.subtick>=QUOTE_SUBSTEPS))return null;
    if(!isHistorical(s)&&!isLiveMarket(s)&&s.phase==='playing'&&(!s.pending||!Number.isInteger(s.pending.beat)||!Number.isInteger(s.pending.candle)||!Number.isInteger(s.pending.tick)||!Number.isFinite(s.script.tracks[s.pending.beat]?.[s.pending.candle]?.[s.pending.tick])))return null;
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
    ensureOrders(s);ensureRunStatistics(s);ensurePerformance(s);reconcileComicAutoplay(s);
    if(!Number.isSafeInteger(s.performance.winRateTrades)||s.performance.winRateTrades<0||s.performance.winRateTrades>s.performance.closedTrades||!Number.isSafeInteger(s.performance.winningTrades)||s.performance.winningTrades<0||s.performance.winningTrades>s.performance.winRateTrades)return null;
    if(!Number.isFinite(s.performance.totalProfit)||!Number.isInteger(s.performance.closedTrades)||s.performance.closedTrades<0||!Number.isFinite(s.performance.maxLoss)||s.performance.maxLoss>0||!Number.isFinite(s.performance.maxProfit)||s.performance.maxProfit<0||!Number.isFinite(s.performance.peakEquity)||s.performance.peakEquity<initialCapital(s)||!Number.isFinite(s.performance.maxDrawdown)||s.performance.maxDrawdown<0||s.performance.maxDrawdown>1)return null;
    const ids=new Set();
    for(const p of s.positions){
      if(![undefined,'usd-jpy-v6','legacy-inverse-v5'].includes(p.pnlModel)||typeof p.id!=='string'||ids.has(p.id)||![1,-1].includes(p.direction)||!Number.isFinite(p.entry)||p.entry<=0||!Number.isFinite(p.margin)||p.margin<=0||!Number.isFinite(p.leverage)||p.leverage<=0||p.leverage>100||!Number.isFinite(p.notional)||p.notional<=0||![.25,.5,1].includes(p.stop)||(Object.hasOwn(p,'stopPips')&&![10,30,50,null].includes(p.stopPips))||(p.stopPrice!==undefined&&p.stopPrice!==null&&(!Number.isFinite(p.stopPrice)||p.stopPrice<=0))||!Number.isFinite(p.openFeeRemaining)||p.openFeeRemaining<0)return null;
      ids.add(p.id);
    }
    // In cross margin, realizing the losing hedge can make cash negative while
    // its still-open winner covers it. Observed-source losses awaiting a missing
    // pair quote also preserve their ledger until execution is possible.
    if(s.cash<0&&(!s.positions.length||!Number.isFinite(accountMetrics(s).tradingEquity)||accountMetrics(s).tradingEquity<=0&&!(isMultiHistory(s)&&!multiHistoryPositionsCurrent(s)||isLiveMarket(s)&&!livePositionsReady(s))))return null;
    if(!Number.isFinite(s.feesPaid)||s.feesPaid<0||!Number.isInteger(s.nextOrderId)||s.nextOrderId<1)return null;
    while(ids.has('order-'+s.nextOrderId))s.nextOrderId++;
    if(!Number.isFinite(s.reserve)||s.reserve<0||!Number.isFinite(s.externalFunding)||!Array.isArray(s.equityTrail)||!s.chat?.group||!s.chat?.friend)return null;
    if(!s.dialogueMemory){s.archivedChat=s.chat;chapterChat(s);s.speech=null;}
    if(s.phase==='bankrupt')s.phase='day_end';
    if(s.phase==='ending'&&(!s.ending||!['million','walkaway','broke','crisis'].includes(s.ending.id)))return null;
    refreshNewsCopy(s);if(s.marketBook?.source==='simulated')for(const book of Object.values(s.marketBook.markets))refreshNewsCopy({...book,beat:s.beat,pending:s.pending});ensureStory(s);
    for(const [account,keys] of [[s.loan,['outstanding','borrowed','repaid','interestPaid','interestAccrued']],[s.family,['outstanding','repaid']]])for(const key of keys)if(account[key]!==undefined&&(!Number.isFinite(account[key])||account[key]<0))return null;
    if(['outstanding','borrowed','repaid','interestPaid'].some(key=>!Number.isFinite(s.loan[key])))return null;
    if(s.loan.borrowCount!==undefined&&(!Number.isSafeInteger(s.loan.borrowCount)||s.loan.borrowCount<0))return null;
    if(s.tradingTrauma!==undefined&&!validTradingTrauma(s.tradingTrauma))return null;
    if(s.recapChoiceLedger!==undefined&&(!Array.isArray(s.recapChoiceLedger)||s.recapChoiceLedger.some(e=>!e||!Number.isSafeInteger(e.day)||e.day<1||typeof e.id!=='string'||!Number.isFinite(e.cost)||e.cost<0)))return null;
    if(s.nextDayLivingDiscount!==undefined&&s.nextDayLivingDiscount!==.4)return null;
    if(!validLifestyle(s.lifestyle)||!validConsumptionLedger(s.consumptionLedger)||!validLivingServices(s))return null;
    if(s.family.withdrawal!==undefined&&(!s.family.withdrawal||typeof s.family.withdrawal.id!=='string'||!Number.isFinite(s.family.withdrawal.amount)||s.family.withdrawal.amount<=0||s.family.withdrawal.amount>FATHER_SAVINGS))return null;
    if(!validFatherTheftWatch(s.family.theftDiscovery))return null;
    if(s.family.withdrawal||s.family.takenConfirmed||s.family.outstanding>0||s.family.repaid>0)s.fatherUsed=true;
    const living=ensureReportLiving(s);if(living&&!validLivingSettlement(living,s.dayReport.day))return null;
    if(living?.status==='pending'&&(s.dayReport.day!==s.day||!['day_end','resting','ending'].includes(s.phase)||s.dayReport.livingCost!==0||!s.expenseLedger?.some(row=>row.day===s.dayReport.day&&row.livingStatus==='pending'&&row.living===0)))return null;
    if(living?.status==='finalized'&&Math.abs(s.dayReport.livingCost-living.receipt.amount)>1e-6)return null;
    if(s.livingPolicy!==undefined&&(s.livingPolicy.version!==1||!Number.isSafeInteger(s.livingPolicy.lastSpecialDay)||s.livingPolicy.lastSpecialDay<1))return null;
    if(oldVersion<7&&!s.dayReport&&['day_end','resting','ending'].includes(s.phase))s.livingLegacyCompletedDay=s.day;
    s.dayOpeningNetAssets??=openingSnapshot.denominator;if(openingSnapshot.denominator===null)s.dayOpeningBasisUnknown=true;s.version=[STORY_CAPITAL_VERSION,ENDLESS_CAPITAL_VERSION,MULTI_MARKET_VERSION,LIVE_MARKET_VERSION].includes(oldVersion)?oldVersion:isResearch(s)?11:isHistorical(s)?10:VERSION;
    ensureRunStatistics(s);ensureTradingClock(s);ensureAccountingJournal(s);ensureDialogue(s);if(!(oldVersion>=8&&hasCanonicalGrid(s.script)&&s.phase==='playing'&&s.pending?.subtick>0))mentalState(s);networkLoanTerms(s);s.dayOpeningLine ??= s.speech.text;


    initializeHousingEconomy(s,{restored:true});initializeWorkEconomy(s,{restored:true});ensureDailySupplies(s);ensureStamina(s).version=3;
    captureMarket(s);markHistoricalRestored(s);markLiveRestored(s);if(lifeVersion){s.lifeActions.sourceVersion=s.version;s.version=LIFE_ACTION_SAVE_VERSION;}return s;
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

function processQuoteRisk(s,lastSubtick=true){
  ensureOrders(s);const exits=[];
  for(const pos of s.positions){
   if(isLiveMarket(s)&&!positionQuoteCurrent(s,pos))continue;
   const unreal=positionNetUnrealized(s,pos),last=pos.lastDirectionalFloating??pos.lastFloating??0;pos.maxUnrealized=Math.max(pos.maxUnrealized,unreal);
   if(!lastSubtick)continue;
   const meaningful=Math.max(5,(pos.notional||0)*.00003);
   if(unreal<-pos.margin*.65)pos.nearMiss=true;
   if(last>meaningful&&unreal<-meaningful){pos.profitToLoss=true;experience(s,{type:'stunned',impact:unreal/Math.max(1000,equity(s)),risk:pos.risk,positionId:pos.id,direction:pos.direction,reversal:'profit-to-loss',pnl:unreal});}
   if(last<-meaningful&&unreal>meaningful){pos.recoveredFromLoss=true;experience(s,{type:'relieved',impact:unreal/Math.max(1000,equity(s)),risk:pos.risk,positionId:pos.id,direction:pos.direction,reversal:'loss-to-profit',pnl:unreal});}
   pos.lastFloating=unreal;if(Math.abs(unreal)>meaningful)pos.lastDirectionalFloating=unreal;
  }
  exits.push(...enforceMargin(s));
  for(const pos of [...s.positions])if(positionQuoteCurrent(s,pos)&&(Object.hasOwn(pos,'stopPips')&&Number.isFinite(pos.stopPrice)?(marketPrice(s,positionMarket(pos))-pos.stopPrice)*pos.direction<=0:pos.stop<1&&positionUnrealized(s,pos)<=-pos.margin*pos.stop))exits.push(closePosition(s,1,'stop',pos.id));
  exits.push(...enforceMargin(s));protectBalance(s,exits);return exits;
}

// Each call consumes exactly one source tick. Batch rendering never batches risk.
const historicalSegmentAt=timestamp=>Math.floor((timestamp+9*3600000)/(6*3600000));
function advanceHistoricalTick(s){
 if(isMultiHistory(s))return advanceMultiHistoricalTick(s);
 if(s.phase!=='playing'||!s.pending)throw Error('当前没有待播放行情');
 if(!hasHistoricalFeed(s))return advanceHistoricalSimulation(s,s.historical.status==='exhausted'?'exhausted':'loading');
 let next=peekHistoricalQuote(s);
 const empty={price:s.price,candleClosed:false,beatEnded:false,dayEnded:false,exit:null,exits:[],flash:null,equity:equity(s),mood:mood(s),logicalSecondEnded:true,historical:true};
 if(next.blocked)return advanceHistoricalSimulation(s,s.historical.status==='exhausted'?'exhausted':'loading');
 if(historicalSimulationActive(s)&&hasHistoricalSimulation(s)&&next.quote?.[0]<=s.historyContinuation.at){skipElapsedHistoricalSource(s,s.historyContinuation.at);next=peekHistoricalQuote(s);}
 if(next.done){s.historical.status='exhausted';return advanceHistoricalSimulation(s,'exhausted');}
 const q=next.quote;
 const effective=historicalEffectiveTime(s)??s.historical.lastQuote[0];
 if(next.gapDurationMs&&q[0]>effective+60000)return advanceHistoricalSimulation(s,'gap');
 consumeTradingStamina(s,{minutes:next.gapDurationMs?0:Math.max(0,q[0]-(s.historical.lastQuote?.[0]??q[0]))/60000,emotion:mood(s),sampleId:`history:${s.day}:${s.historical.date}:${s.historical.cursor}:${q[0]}`});
 const price=isResearch(s)?q[1]:(q[1]+q[2])/2,bucket=Math.floor(q[0]/(s.historyContinuation?60000:900000))*(s.historyContinuation?60000:900000);
 // Use consumed absolute JST boundaries, not resettable day/beat counters.
 // Peeking at a gap, loading a day and closing never consume future time.
 const elapsedSegments=historicalSegmentAt(q[0])-historicalSegmentAt(effective);
 const priorSegment=s.historyContinuation?.segment;
 s.price=price;const sourceSegment=recordHistoricalSource(s,q[0]);
 let candle=s.candles.at(-1),candleClosed=false;
 if(isResearch(s)){candle={...researchCandle(s,next.bar),...(s.historyContinuation?{sourceKind:'historical',sourceSegment,sourceBreak:priorSegment!==sourceSegment}:{})};s.candles.push(candle);s.completedCandles++;candleClosed=true;}
 else if(!candle||candle.timestamp!==bucket||candle.day!==s.day||s.historyContinuation&&candle.sourceSegment!==sourceSegment){
  if(candle&&!candle.closed){candle.closed=true;s.completedCandles++;candleClosed=true;}
  candle={open:price,close:price,high:price,low:price,closed:false,day:s.day,beat:Math.min(3,Math.floor(new Date(q[0]+9*3600000).getUTCHours()/6)),timestamp:bucket,timeSource:'historical',firstQuoteAt:q[0],lastQuoteAt:q[0],...(s.historyContinuation?{sourceKind:'historical',sourceSegment,sourceBreak:priorSegment!==sourceSegment}:{})};s.candles.push(candle);
 }
 s.price=price;commitHistoricalQuote(s,q);if(isResearch(s))recordDisplaySourceCandle(s,candle);else{recordDisplayQuote(s,q[0],price);if(s.historyContinuation)Object.assign(s.displayMinutes.at(-1),{sourceKind:'historical',sourceSegment,sourceBreak:priorSegment!==sourceSegment});}candle.close=price;candle.high=Math.max(candle.high,price);candle.low=Math.min(candle.low,price);candle.lastQuoteAt=q[0];
 s.beat=candle.beat;s.pending.beat=s.beat;s.pending.tick++;s.pending.candle=0;
 const exits=processQuoteRisk(s,true);if(elapsedSegments>0)ageEffects(s,elapsedSegments);mentalState(s,candleClosed);
 if(s.candles.length>256)s.candles=s.candles.slice(-256);
 let dayEnded=false;
 if(next.last){dayEnded=finishHistoricalDay(s,candle,exits);candleClosed=true;}
 return{...empty,price,candleClosed,dayEnded,sourceBoundary:!!next.last,exit:exits[0]||null,exits,equity:equity(s),mood:mood(s),...(next.gapDurationMs?{gapDurationMs:next.gapDurationMs}:{})};
}

function resetHistoricalEndlessDay(s){
 s.day++;s.beat=0;s.dayOpening=equity(s);s.dayOpeningBasisUnknown=false;s.dayOpeningDebt=debtSummary(s).total;s.dayOpeningNetAssets=s.dayOpening-s.dayOpeningDebt;s.dayOpeningFunding=s.externalFunding;s.dayOpeningExpenses=s.expenses;if(s.lifeActions)s.dayOpeningIncome=s.nonTradingIncome||0;if(s.lottery){s.dayOpeningLotteryIncome=s.lotteryIncome||0;s.dayOpeningCheatLotteryIncome=s.cheatLotteryIncome||0;}
 resetHistoricalContinuationDay(s);markHistoricalOpening(s);
 s.itemsUsed={};s.skills={mochiko:false,yasuko:false};s.bonusBeats=0;s.lastEvent=null;s.swanSeen=false;s.pending=null;s.phase='decision';renewQuoteRefresh(s);mentalState(s);
}
function finishHistoricalDay(s,candle,exits){
  if(!candle.closed){candle.closed=true;s.completedCandles++;}
  s.pending=null;s.historical.status='day-end';s.marketPaused=true;
  if(s.mode==='story'){s.beat=BEATS_PER_DAY;s.phase='closing';}
  else {
   const cost=accrueLoanInterest(s);if(cost.interest){s.expenseLedger ||= [];s.expenseLedger.push({day:s.day,living:0,...cost});}
   exits.push(...enforceMargin(s));protectBalance(s,exits);recordAccountingDay(s);s.completedDays++;
   if(equity(s)<MIN_EQUITY&&multiHistoryPositionsCurrent(s)){if(s.positions.length)exits.push(...closeOrders(s,1,'closing'));s.phase='ending';s.ending={id:'broke',day:s.day,equity:equity(s),profit:tradingProfit(s),sanity:s.sanity,timestamp:s.historical.lastQuote[0]};}
   else if(nextHistoricalDate(s)){
    prepareNextHistoricalDay(s);resetHistoricalEndlessDay(s);
   }else{s.historical.status='exhausted';resetHistoricalEndlessDay(s);startHistoricalContinuation(s,'exhausted');}
  }
 return s.mode==='story';
}

function advanceHistoricalSimulation(s,reason='gap',options={}){
 const before=currentTradingTimestamp(s),sample=simulateHistoricalMarks(s,{reason,...options});
 const selected=activeMarket(s);let selectedCandle=null;
 for(const [symbol,price] of Object.entries(sample.marks)){
  const book=s.marketBook?s.marketBook.markets[symbol]:s,prior=book.price,previous=book.candles.at(-1),changed=(previous?.sourceKind??'historical')!=='simulated';
  const candle={open:prior,high:Math.max(prior,price),low:Math.min(prior,price),close:price,closed:true,timestamp:sample.at-60000,availableAt:sample.at,firstQuoteAt:sample.at,lastQuoteAt:sample.at,periodMinutes:1,timeSource:'historical-simulation',sourceKind:'simulated',sourceSegment:(previous?.sourceSegment??0)+(changed?1:0),sourceBreak:changed,research:true,day:s.day,beat:Math.min(3,Math.floor((s.historyContinuation.daySamples-1)/60))};
  book.price=price;book.candles.push(candle);recordDisplaySourceCandle(book,candle);if(book.candles.length>256)book.candles=book.candles.slice(-256);if(symbol===selected)selectedCandle=candle;
 }
 if(s.marketBook){const book=s.marketBook.markets[selected];for(const k of ['price','candles','displayMinutes','displayMinutesPartial'])if(book[k]!==undefined)s[k]=book[k];}
 if(selectedCandle)s.completedCandles++;s.beat=Math.min(3,Math.floor((s.historyContinuation.daySamples-1)/60));s.pending={beat:s.beat,candle:0,tick:s.historyContinuation.daySamples,action:'market',before:equity(s),startPrice:s.price,flatAtStart:!s.positions.length,traded:!!s.positions.length,flashShown:true};s.phase='playing';
 consumeTradingStamina(s,{minutes:Math.max(0,sample.at-before)/60000,emotion:mood(s),sampleId:`history-sim:${s.day}:${s.historyContinuation.simulatedSamples}`});
 const elapsedSegments=historicalSegmentAt(sample.at)-historicalSegmentAt(before);if(elapsedSegments>0)ageEffects(s,elapsedSegments);
 const exits=processQuoteRisk(s,true);mentalState(s,true);recordAccountingPoint(s,'quote');
 let dayEnded=false;
 if(s.historyContinuation.daySamples>=240){
  if(s.mode==='story'){s.phase='closing';s.beat=BEATS_PER_DAY;s.pending=null;dayEnded=true;}
  else{const cost=accrueLoanInterest(s);if(cost.interest){s.expenseLedger||=[];s.expenseLedger.push({day:s.day,living:0,...cost});}exits.push(...enforceMargin(s));protectBalance(s,exits);recordAccountingDay(s);s.completedDays++;resetHistoricalEndlessDay(s);}
 }
 captureMarket(s);return {price:s.price,candleClosed:!!selectedCandle,beatEnded:false,dayEnded,exit:exits[0]||null,exits,flash:null,equity:equity(s),mood:mood(s),logicalSecondEnded:true,historical:true,simulated:true,sourceSegment:sample.segment};
}

function markMultiHistoricalCandle(book){
 const bar=book.candles.at(-1),prior=book.candles.at(-2),changed=(prior?.sourceKind??'historical')!=='historical';
 const metadata={sourceKind:'historical',sourceSegment:(prior?.sourceSegment??0)+(changed?1:0),sourceBreak:changed};
 Object.assign(bar,metadata);const display=book.displayMinutes?.at(-1);if(display)Object.assign(display,metadata);
}

// Ephemeral observation boundary: pausing is not game progress or save data.
// A fresh provider sample is needed after resuming; duplicate timestamps cannot
// accidentally clear this boundary and bill time spent in a modal/hidden tab.
const suspendedLiveStamina=new WeakSet();
export function suspendStaminaWatching(s){if(isLiveMarket(s))suspendedLiveStamina.add(s);}

// One batch of actual observations; gameplay never calls the simulated price path.
export function applySharedReplayEvent(s,output,{watching=true}={}){
 if(output?.type==='reset'){return resetSharedReplay(s,output.reason);}
 if(s.phase==='ending')return null;
 const prepared=prepareSharedReplayEvent(s,output);
 // Validation is complete before committing the actual played observation.
 Object.assign(s.liveMarket.replay,prepared.replay);
 return applyLiveMarketSnapshot(s,prepared.snapshots,{watching,[replayApplication]:true});
}
export function applyLiveMarketSnapshot(s,snapshots,options={}){
 const {watching=true}=options;
 if(isSharedReplay(s)&&options[replayApplication]!==true)return null;
 if(!isLiveMarket(s)||s.phase==='ending'||s.liveSuspension?.active)return null;
 if(!watching)suspendStaminaWatching(s);
 const resumedAfterPause=suspendedLiveStamina.has(s);
 const l=s.liveMarket,active=activeMarket(s),beforeProgress=l.completedInDay,beforeWatchAt=liveTimestamp(s,'USD/JPY'),beforeWatchReady=Number.isFinite(beforeWatchAt)&&liveTradingReady(s,beforeWatchAt),watchMood=mood(s);
 let changed=false,candleClosed=false,observedUsdClose=false;captureMarket(s);
 for(const symbol of LIVE_SYMBOLS){
  const view=snapshots?.[symbol.replace('/','')],q=view?.quote,previous=l.quotes[symbol];
  l.transport=view?.transport||'disconnected';l.statuses[symbol]=view?.status||'waiting';
  if(!validLiveQuote(q,symbol,{allowUnknown:isSharedReplay(s)})||q.sourceTimestamp>Date.now()+5000){l.statuses[symbol]='waiting';continue;}
  if(s.liveSuspension?.awaitingFresh&&Number.isFinite(s.liveSuspension.quoteTimes?.[symbol])&&q.sourceTimestamp<=s.liveSuspension.quoteTimes[symbol]){l.statuses[symbol]='waiting';continue;}
  if(previous&&q.sourceTimestamp<previous.sourceTimestamp){l.statuses[symbol]='stale';continue;}
  const newPrice=!previous||q.sourceTimestamp!==previous.sourceTimestamp||q.mid!==previous.mid||q.bid!==previous.bid||q.ask!==previous.ask;
  l.quotes[symbol]={...q};const book=s.marketBook.markets[symbol];book.price=q.mid;
  if(!previous)book.dayOpeningPrice=q.mid;
  if(!newPrice)continue;changed=true;
  if(!['decision','playing'].includes(s.phase))continue;
  const at=q.sourceTimestamp,bucket=Math.floor(at/60000)*60000;let candle=book.candles.at(-1);
  if(!candle||candle.timestamp!==bucket||candle.day!==s.day){
   if(candle&&!candle.closed){candle.closed=true;if(symbol==='USD/JPY'&&candle.day===s.day)observedUsdClose=true;}
   candle={open:q.mid,high:q.mid,low:q.mid,close:q.mid,closed:q.providerMarketState==='closed',timestamp:bucket,firstQuoteAt:at,lastQuoteAt:at,timeSource:'biquote',periodMinutes:1,day:s.day,beat:Math.min(3,Math.floor(l.completedInDay/4)),live:true};book.candles.push(candle);
  }else{candle.close=q.mid;candle.high=Math.max(candle.high,q.mid);candle.low=Math.min(candle.low,q.mid);candle.lastQuoteAt=at;}
  recordDisplayQuote(Object.assign(book,{day:s.day,beat:s.beat}),at,q.mid);if(q.providerMarketState==='closed'&&book.displayMinutes?.length)book.displayMinutes.at(-1).closed=true;
  if(book.candles.length>256)book.candles=book.candles.slice(-256);
 }
 const chosen=s.marketBook.markets[active];for(const k of ['price','script','candles','displayMinutes','displayMinutesPartial','dayOpeningPrice','lastEvent','swanSeen']){if(chosen[k]===undefined)delete s[k];else s[k]=chosen[k];}
 l.openingAt??=liveTimestamp(s);
 if(!['decision','playing'].includes(s.phase))return null;
 // Observed stale bars may extend the chart, never the playable day. Evaluate
 // readiness after the complete multi-pair batch, and keep unfinished days bounded.
 if(observedUsdClose&&liveQuoteReady(s,'USD/JPY')&&liveTradingReady(s)&&l.completedInDay<beatsPerDay(s)*4){l.completedInDay++;s.completedCandles++;candleClosed=true;}
 if(!s.accountingJournal?.points?.length&&!s.accountingJournal?.start&&s.day===1)recordAccountingPoint(s,'opening');
 // Readiness can recover without a new price or timestamp. Recheck existing
 // actual marks before orders are re-enabled; selected unheld charts never gate risk.
 const watchAt=liveTimestamp(s,'USD/JPY'),watchMinutes=Number.isFinite(beforeWatchAt)&&Number.isFinite(watchAt)?Math.max(0,watchAt-beforeWatchAt)/60000:0;
 if(Number.isFinite(watchAt))consumeTradingStamina(s,{minutes:watchMinutes<=STAMINA_RULES.maxObservedGapMinutes?watchMinutes:0,emotion:watchMood,sampleId:`live:${s.day}:${watchAt}`,active:watching&&!resumedAfterPause&&beforeWatchReady&&liveTradingReady(s)});
 if(watching&&resumedAfterPause&&Number.isFinite(watchAt)&&(!Number.isFinite(beforeWatchAt)||watchAt>beforeWatchAt)&&liveTradingReady(s))suspendedLiveStamina.delete(s);
 const exits=processQuoteRisk(s,true);if(!changed&&!exits.length)return null;recordAccountingPoint(s,'quote');
 let dayEnded=false,beatEnded=Math.floor(beforeProgress/4)!==Math.floor(l.completedInDay/4);
 if(liveTradingReady(s)){
  s.phase='playing';s.beat=Math.min(3,Math.floor(l.completedInDay/4));s.pending={beat:s.beat,candle:l.completedInDay%4,tick:0,action:'market',before:equity(s),startPrice:s.price,flatAtStart:!s.positions.length,traded:!!s.positions.length,flashShown:true};
  if(beatEnded){ageEffects(s);mentalState(s);appendChatAfterBeat(s);}
  if(s.mode==='endless'&&equity(s)<MIN_EQUITY){s.phase='ending';s.pending=null;s.ending={id:'broke',day:s.day,equity:equity(s),profit:tradingProfit(s),sanity:s.sanity,timestamp:liveTimestamp(s)};}
  else if(l.completedInDay>=beatsPerDay(s)*4||s.mode==='story'&&(equity(s)<MIN_EQUITY||s.sanity<=0)){
   if(s.mode==='story'){s.beat=beatsPerDay(s);s.pending=null;s.phase='closing';dayEnded=true;}
   else{const cost=accrueLoanInterest(s);if(cost.interest){s.expenseLedger ||= [];s.expenseLedger.push({day:s.day,living:0,...cost});}exits.push(...enforceMargin(s));protectBalance(s,exits);recordAccountingDay(s);s.completedDays++;s.day++;s.beat=0;s.dayOpening=equity(s);s.dayOpeningDebt=debtSummary(s).total;s.dayOpeningNetAssets=s.dayOpening-s.dayOpeningDebt;s.dayOpeningFunding=s.externalFunding;s.dayOpeningExpenses=s.expenses;if(s.lifeActions)s.dayOpeningIncome=s.nonTradingIncome||0;if(s.lottery){s.dayOpeningLotteryIncome=s.lotteryIncome||0;s.dayOpeningCheatLotteryIncome=s.cheatLotteryIncome||0;}l.completedInDay=0;l.openingAt=liveTimestamp(s);s.itemsUsed={};s.skills={mochiko:false,yasuko:false};s.bonusBeats=0;s.pending=null;s.phase='decision';renewQuoteRefresh(s);}
  }
 }
 if(s.liveSuspension?.awaitingFresh&&liveTradingReady(s))s.liveSuspension.awaitingFresh=false;
 mentalState(s,candleClosed);captureMarket(s);settleDueLottery(s);
 return {price:s.price,candleClosed,beatEnded,dayEnded,exit:exits[0]||null,exits,flash:null,equity:equity(s),mood:mood(s),logicalSecondEnded:true,live:true};
}

function advanceMultiHistoricalTick(s){
 if(s.phase!=='playing'||!s.pending)throw Error('当前没有待播放行情');
 if(!hasHistoricalFeed(s))return advanceHistoricalSimulation(s,s.historical.status==='exhausted'?'exhausted':'loading');
 let next=peekHistoricalQuote(s);const empty={price:s.price,candleClosed:false,beatEnded:false,dayEnded:false,exit:null,exits:[],flash:null,equity:equity(s),mood:mood(s),logicalSecondEnded:true,historical:true};
 if(next.blocked)return advanceHistoricalSimulation(s,s.historical.status==='exhausted'?'exhausted':'loading');
 if(historicalSimulationActive(s)&&hasHistoricalSimulation(s)&&next.event?.at<=s.historyContinuation.at){skipElapsedHistoricalSource(s,s.historyContinuation.at);next=peekHistoricalQuote(s);}
 if(next.done){s.historical.status='exhausted';return advanceHistoricalSimulation(s,'exhausted');}
 const effective=historicalEffectiveTime(s)??s.historical.lastQuote[0];
 if(next.event.at>effective+60000)return advanceHistoricalSimulation(s,'gap');
 consumeTradingStamina(s,{minutes:next.gapDurationMs?0:Math.max(0,next.event.at-s.historical.lastQuote[0])/60000,emotion:mood(s),sampleId:`multi-history:${s.day}:${s.historical.date}:${s.historical.cursor}:${next.event.at}`});
 const elapsed=historicalSegmentAt(next.event.at)-historicalSegmentAt(effective),candle=consumeMultiHistoryEvent(s,next.event);
 const realSymbols=Object.keys(next.event.bars),missing=LIVE_SYMBOLS.filter(symbol=>!realSymbols.includes(symbol));
 if(missing.length){
  startHistoricalContinuation(s,'missing-market');recordHistoricalSource(s,next.event.at,realSymbols);
  const result=advanceHistoricalSimulation(s,'missing-market',{at:next.event.at,symbols:missing});
  for(const symbol of realSymbols)markMultiHistoricalCandle(s.marketBook.markets[symbol]);
  if(next.last&&!result.dayEnded){const exits=result.exits;result.dayEnded=finishHistoricalDay(s,s.candles.at(-1),exits);captureMarket(s);}return {...result,sourceBoundary:!!next.last};
 }
 recordHistoricalSource(s,next.event.at,realSymbols);
 if(s.historyContinuation)for(const symbol of realSymbols)markMultiHistoricalCandle(s.marketBook.markets[symbol]);
 s.beat=Math.min(3,Math.floor(new Date(next.event.at+32400000).getUTCHours()/6));s.pending.beat=s.beat;s.pending.tick++;s.pending.candle=0;
 const exits=processQuoteRisk(s,true);
 // Story positions and the final available session close on each pair's last
 // observed bar. Never defer an execution onto another pair's stale mark.
 const closing=[];for(const p of [...s.positions])if(multiHistorySymbolEnded(s,positionMarket(p))&&multiHistoryQuoteCurrent(s,positionMarket(p)))closing.push(closePosition(s,1,'closing',p.id));
 if(closing.length){exits.push(...closing);protectBalance(s,closing);}
 if(elapsed>0)ageEffects(s,elapsed);mentalState(s,!!candle);captureMarket(s);
 let dayEnded=false;if(next.last){dayEnded=finishHistoricalDay(s,s.candles.at(-1),exits);captureMarket(s);}
 return {...empty,price:s.price,candleClosed:!!candle,dayEnded,sourceBoundary:!!next.last,exit:exits[0]||null,exits,equity:equity(s),mood:mood(s),...(next.gapDurationMs?{gapDurationMs:next.gapDurationMs}:{})};
}
