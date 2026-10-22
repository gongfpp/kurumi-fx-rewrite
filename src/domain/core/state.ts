import { NUMERICS } from '../../content/config/numerics';
import { equity } from '../trading/account';
import type { GameState, Mode, Performance, StaminaState } from './types';

export const STORY_CAPITAL_VERSION = 12;
export const ENDLESS_CAPITAL_VERSION = 13;

export function beatsPerDay(s: GameState): number {
  return s.mode === 'endless' ? NUMERICS.BEATS_PER_DAY : NUMERICS.BEATS_PER_DAY + (s.bonusBeats || 0);
}

export function initialCapital(s: GameState): number {
  return Number.isFinite(s.startEquity) && s.startEquity > 0 ? s.startEquity : NUMERICS.START;
}

/** Net realized trading profit, excluding funding, living costs, lottery and principal. */
export function tradingProfit(s: GameState): number {
  return (
    equity(s) -
    initialCapital(s) -
    (s.externalFunding || 0) -
    (s.nonTradingIncome || 0) -
    (s.lotteryIncome || 0) -
    (s.cheatLotteryIncome || 0) +
    (s.expenses || 0)
  );
}

export interface CreateOptions {
  mode?: Mode;
  runId?: string;
}

function newStamina(): StaminaState {
  return { version: 3, value: NUMERICS.STAMINA.max, watchMinutes: 0, spent: 0, recovered: 0, lastSample: null, recoveryReceipts: [] };
}

function newPerformance(startingCapital: number): Performance {
  return {
    totalProfit: 0,
    closedTrades: 0,
    winningTrades: 0,
    winRateTrades: 0,
    maxLoss: 0,
    maxProfit: 0,
    peakEquity: startingCapital,
    maxDrawdown: 0,
  };
}

export function createGame(seed: number = Date.now(), opts: CreateOptions = {}): GameState {
  const mode: Mode = opts.mode ?? 'story';
  const s = seed >>> 0;
  const startingCapital = NUMERICS.STORY_START;
  return {
    version: mode === 'story' ? STORY_CAPITAL_VERSION : ENDLESS_CAPITAL_VERSION,
    mode,
    seed: s,
    runId: opts.runId,
    startEquity: startingCapital,
    bonusBeats: 0,

    day: 1,
    beat: 0,
    phase: 'decision',
    price: NUMERICS.START_PRICE,
    recent: [],

    cash: mode === 'endless' ? startingCapital : startingCapital - NUMERICS.LIVING_DAILY,
    reserve: mode === 'endless' ? 0 : NUMERICS.LIVING_DAILY,
    dayOpening: startingCapital,
    dayOpeningNetAssets: startingCapital,
    dayOpeningDebt: 0,
    dayOpeningFunding: 0,
    dayOpeningExpenses: 0,
    dayOpeningIncome: 0,

    positions: [],
    position: null,
    nextOrderId: 1,
    history: [],
    feesPaid: 0,
    feeLedger: [],

    sanity: 50,
    mentalBoost: 0,
    restRecovery: 0,
    stress: 0,
    heat: 0,
    peakPersonal: startingCapital,
    equityTrail: [startingCapital],

    performance: newPerformance(startingCapital),
    candles: [],
    marketBook: undefined,
    script: null,
    pending: null,
    lastEvent: null,
    lastTrade: null,

    externalFunding: 0,
    fatherUsed: false,
    nonTradingIncome: 0,
    lotteryIncome: 0,
    cheatLotteryIncome: 0,
    expenses: 0,

    dayReport: null,
    completedDays: 0,
    completedCandles: 0,

    stamina: newStamina(),
  };
}