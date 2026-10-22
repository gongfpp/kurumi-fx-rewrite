import raw from '../../content/config/numerics.json';

export interface MarketDef {
  symbol: string;
  base: string;
  name: string;
  label: string;
  startPrice: number;
  seed: number;
}

export interface LotteryTier {
  tier: number;
  prize: number;
  weight: number;
}

export interface Numerics {
  FEE_RATE: number;
  STOP_OUT_LEVEL: number;
  MIN_EQUITY: number;
  TARGET_PROFIT: number;
  STORY_START: number;
  START: number;
  START_PRICE: number;
  LIVING_DAILY: number;
  FATHER_SAVINGS: number;
  CANDLES_PER_BEAT: number;
  BEATS_PER_DAY: number;
  TICKS_PER_CANDLE: number;
  PIP_SIZE: number;
  TICK_MINUTES: number;
  LEVERAGES: number[];
  STAKES: number[];
  STOP_PIPS: (number | null)[];
  MARKETS: MarketDef[];
  CREDIT: { baseLimit: number; maxLimit: number; baseDailyRate: number; maxDailyRate: number; minBorrow: number };
  STAMINA: {
    max: number;
    warning: number;
    entryMinimum: number;
    workCost: number;
    calmDayCost: number;
    observedWatchCostPerMinute: number;
    maxObservedGapMinutes: number;
  };
  ENERGY: { boostDuration: number; fatigueDuration: number; boostMultiplier: number; fatigueMultiplier: number };
  SUPPLY: {
    notesStressReduction: number;
    mealBudget: number;
    energyPrice: number;
    energyRecovery: number;
    noodlesPrice: number;
    noodlesRecovery: number;
    takeawayPrice: number;
    takeawayRecovery: number;
  };
  ONSEN: { cost: number; recovery: number; stressReduction: number };
  HOUSING_SLEEP_RECOVERY: Record<string, number>;
  WATCH: { simulatedDayMinutes: number; calmDayCost: number; pressureMinimum: number; pressureMaximum: number };
  TRAUMA: {
    hurtAt: number;
    crushedAt: number;
    numbAt: number;
    hurtCap: number;
    crushedCap: number;
    numbCap: number;
    survivalFloor: number;
    restRecovery: number;
    flatSegmentRecovery: number;
    painTicks: number;
    numbTicks: number;
  };
  PRESSURE: { taps: number; graceMs: number; decayMs: number; tapIntervalMs: number };
  STAMINA_FATIGUE: { durationMs: number; recovery: number; minHours: number; maxHours: number };
  LOTTERY: {
    ticketPrice: number;
    drawMinute: number;
    guaranteeDraws: number;
    cheatCode: string;
    cheatPrize: number;
    tiers: LotteryTier[];
  };
}

function deepFreeze<T>(value: T): T {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const key of Object.keys(value as Record<string, unknown>)) {
      deepFreeze((value as Record<string, unknown>)[key]);
    }
  }
  return value;
}

export const NUMERICS: Numerics = deepFreeze(raw as unknown as Numerics);