export type Mode = 'story' | 'endless';
export type Phase = 'decision' | 'playing' | 'closing' | 'day_end' | 'resting' | 'ending';
export type Direction = 1 | -1;
export type Leverage = 5 | 10 | 25 | 50 | 100;
export type StopPips = 10 | 30 | 50 | null;

export interface Position {
  id: string;
  symbol: string;
  direction: Direction;
  entry: number;
  margin: number;
  initialMargin: number;
  leverage: number;
  notional: number;
  /** Stop as a fraction of margin in the legacy model; 1 means a pip distance stop. */
  stop: number;
  stopPips?: StopPips;
  stopPrice?: number | null;
  openFeeRemaining: number;
  openFee: number;
  maxUnrealized: number;
  pnlModel?: string;
  nearMiss?: boolean;
  recoveredFromLoss?: boolean;
  risk?: number;
}

export interface Performance {
  totalProfit: number;
  closedTrades: number;
  winningTrades: number;
  winRateTrades: number;
  maxLoss: number;
  maxProfit: number;
  peakEquity: number;
  maxDrawdown: number;
}

export interface StaminaState {
  version: number;
  value: number;
  watchMinutes: number;
  spent: number;
  recovered: number;
  lastSample: string | null;
  recoveryReceipts: unknown[];
}

export interface MarketBookEntry {
  price: number;
  candles: Candle[];
  lastEvent: unknown;
  swanSeen: boolean;
  dayOpeningPrice: number;
  script: unknown;
}

export interface MarketBook {
  version: number;
  source: string;
  active: string;
  markets: Record<string, MarketBookEntry>;
}

export interface Candle {
  open: number;
  high: number;
  low: number;
  close: number;
  closed: boolean;
  day: number;
  beat: number;
  timestamp?: number;
  historical?: boolean;
}

export interface Cursor {
  beat: number;
  candle: number;
  tick: number;
  subtick?: number;
}

export interface RecentEntry {
  type: string;
  impact: number;
  risk?: number;
  pnl?: number | null;
  positionId?: string | null;
  direction?: Direction | null;
  day: number;
  beat: number;
  observedMove?: number;
  reversal?: boolean;
}

export interface GameState {
  version: number;
  mode: Mode;
  seed: number;
  runId?: string;
  startEquity: number;
  bonusBeats?: number;

  day: number;
  beat: number;
  phase: Phase;
  price: number;
  recent: RecentEntry[];

  cash: number;
  reserve: number;
  dayOpening: number;
  dayOpeningNetAssets: number;
  dayOpeningDebt: number;
  dayOpeningFunding: number;
  dayOpeningExpenses: number;
  dayOpeningIncome: number;

  positions: Position[];
  position: Position | null;
  nextOrderId: number;
  history: TradeReceipt[];
  feesPaid: number;
  feeLedger: FeeEntry[];

  sanity: number;
  mentalBoost: number;
  restRecovery: number;
  stress: number;
  heat: number;
  peakPersonal: number;
  equityTrail: number[];

  performance: Performance;
  candles: Candle[];
  marketBook?: MarketBook;
  script: unknown;
  pending: Cursor | null;
  lastEvent: unknown;
  lastTrade: TradeReceipt | null;

  externalFunding: number;
  fatherUsed: boolean;
  nonTradingIncome: number;
  lotteryIncome?: number;
  cheatLotteryIncome?: number;
  expenses: number;

  dayReport: DayReport | null;
  completedDays: number;
  completedCandles: number;

  stamina: StaminaState;

  tradingTrauma?: TradingTrauma;
  emotionPressure?: EmotionPressure;
  effects?: Effect[];
  family?: Family;
  loan?: Loan;
  lottery?: LotteryState;
  lifestyle?: LifestyleState;
  consumptionLedger?: ConsumptionRow[];
  livingPaid?: number;
  dailySupplies?: DailySupplies;
  itemsUsed?: Record<string, boolean>;
  lifeActionsToday?: string[];
  dinner?: boolean;
  relationship?: number;
  newsLog?: { time?: string; source: string; title: string; copy: string }[];
  energyEffect?: { day: number; elapsed: number };
  story?: StoryState;
  ending?: EndingState;
  livingDiscount?: number;
  dailyLeverageUnlocked?: boolean;
}

export interface StoryState {
  seen: string[];
  queue: string[];
  log: { id: string; choice: string; day: number }[];
  flags: Record<string, unknown>;
  presentedDay: number;
}

export interface EndingState {
  id: string;
  baseId: string;
  variant: string | null;
  day: number;
  equity: number;
  profit: number;
  sanity: number;
}

export interface Loan {
  outstanding: number;
  borrowed: number;
  repaid: number;
  limit: number;
  dailyRate: number;
  interestPaid: number;
  interestAccrued: number;
  lastInterestDay: number;
  borrowCount?: number;
}

export interface LotteryTicket {
  id: string;
  number: string;
  kind: 'normal' | 'cheat';
  purchaseDay: number;
  drawDay: number;
  rulesId: string;
  cost: number;
  status: 'pending' | 'settled';
  result: { tier: number; prize: number; forced: boolean } | null;
  settledDay: number | null;
}

export interface LotteryState {
  version: number;
  tickets: LotteryTicket[];
  drawsWithoutTop3: number;
  cheatRedeemed: boolean;
}

export interface ConsumptionRow {
  id: string;
  day: number;
  kind: string;
  label: string;
  amount: number;
  timestamp?: number | null;
}

export interface LifestyleState {
  version: number;
  id: string;
  selectedDay: number;
}

export interface DailySupplies {
  version: number;
  mealCreditDay: number | null;
  eyeMaskPending: boolean;
  uses: { id: string; day: number; cost: number }[];
  noteUsedDay: number | null;
}

export interface Family {
  unlocked?: boolean;
  outstanding?: number;
  discovered?: boolean;
  informed?: boolean;
  repaid?: number;
  trust?: number;
  withdrawal?: { amount: number };
}

export interface TradingTrauma {
  version: number;
  mode: Mode;
  seed: number;
  runId: string | null;
  severity: number;
  peakRealized: number;
  realized: number;
  seenCloses: number;
  hitTick: number;
  hitDay: number;
  recoveryUnits: number;
  recentLosses: { loss: number; day: number; liquidation: boolean }[];
}

export interface EmotionPressure {
  context: string;
  direction: 'ecstatic' | 'despair';
  taps: number;
  target: number;
  lastAt: number;
}

export interface Effect {
  id: string;
  remaining: number | null;
}

export interface FeeEntry {
  day: number;
  beat: number;
  positionId: string;
  side: 'open' | 'close';
  amount: number;
}

export interface TradeReceipt {
  type: string;
  positionId: string;
  direction: Direction;
  margin: number;
  leverage: number;
  entry: number;
  exit: number;
  pnl: number;
  grossPnl: number;
  fee: number;
  openFee: number;
  closeFee: number;
  day: number;
  beat: number;
  timestamp?: number | null;
  symbol?: string;
  positionClosed?: boolean;
  nearMiss?: boolean;
  maxUnrealized?: number;
  balanceProtection?: number;
  performanceRecorded?: boolean;
}

export interface DayReport {
  day: number;
  beat: number;
  opening: number;
  closing: number;
  net: number;
  tradeNet: number;
  funding: number;
  costs: number;
  interest: number;
  fees: number;
  livingCost: number;
  pendingLivingCost: number;
  mood: string;
  closedTradeNet?: number;
  interestPaid?: number;
  interestAccrued?: number;
  interestRate?: number;
}