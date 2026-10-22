import { NUMERICS } from '../../content/config/numerics';
import { equity } from '../trading/account';
import { pressureIntensity } from '../mind/pressure';
import { mood } from '../mind/mood';
import type { GameState } from '../core/types';

const C = NUMERICS.CREDIT;
const clamp = (value: number, min: number, max: number): number => Math.max(min, Math.min(max, value));
const money = (value: number): number => Math.round((value + Number.EPSILON * Math.abs(value) * 2) * 100) / 100;

export interface CreditTerms {
  nominalAssets: number;
  netAssets: number;
  totalDebt: number;
  limit: number;
  dailyRate: number;
  availableCredit: number;
  maxRepayment: number;
  estimatedDailyInterest: number;
  minBorrow: number;
}

export interface CreditInput {
  assets?: number;
  availableCash?: number;
  familyDebt?: number;
  networkDebt?: number;
  borrowCount?: number;
  emotionIntensity?: number;
  mode?: string;
}

/** Fictional game pressure, not a real loan product. Pure: never mutates a balance. */
export function creditTerms(input: CreditInput = {}): CreditTerms {
  const nominalAssets = Number.isFinite(input.assets) ? (input.assets as number) : 0;
  const availableCash = Math.max(0, Number.isFinite(input.availableCash) ? (input.availableCash as number) : 0);
  const familyDebt = Math.max(0, Number.isFinite(input.familyDebt) ? (input.familyDebt as number) : 0);
  const networkDebt = Math.max(0, Number.isFinite(input.networkDebt) ? (input.networkDebt as number) : 0);
  const borrowCount = clamp(Number.isFinite(input.borrowCount) ? (input.borrowCount as number) : 0, 0, 20);
  const emotionIntensity = clamp(Number.isFinite(input.emotionIntensity) ? (input.emotionIntensity as number) : 0, 0, 1);
  const totalDebt = familyDebt + networkDebt;
  const netAssets = nominalAssets - totalDebt;
  const endless = input.mode === 'endless';
  const limit = endless
    ? Math.floor(clamp(200000 + Math.max(netAssets, 0) + 0.5 * totalDebt, C.baseLimit, C.maxLimit) / 100) * 100
    : C.baseLimit;
  const denominator = Math.max(nominalAssets, 1);
  const debtRatio = Math.min(totalDebt / denominator, 2);
  const dailyRate = endless
    ? clamp(C.baseDailyRate + 0.002 * debtRatio + 0.00015 * borrowCount + 0.0015 * emotionIntensity, C.baseDailyRate, C.maxDailyRate)
    : C.baseDailyRate;
  const interest = networkDebt * dailyRate;
  return {
    nominalAssets,
    netAssets,
    totalDebt,
    limit,
    dailyRate,
    availableCredit: networkDebt >= limit ? 0 : Math.max(0, limit - networkDebt),
    maxRepayment: money(Math.min(availableCash, networkDebt)),
    estimatedDailyInterest: money(interest),
    minBorrow: C.minBorrow,
  };
}

export function networkLoanTerms(s: GameState): CreditTerms {
  return creditTerms({
    assets: equity(s),
    availableCash: Math.max(0, s.cash || 0),
    familyDebt: s.family?.outstanding ?? 0,
    networkDebt: s.loan?.outstanding ?? 0,
    borrowCount: s.loan?.borrowCount ?? 0,
    emotionIntensity: pressureIntensity(s, mood(s)),
    mode: s.mode,
  });
}

export interface BorrowResult {
  applied: boolean;
  reason?: string;
  amount: number;
  terms: CreditTerms;
}

/** Apply a borrow against the current credit terms; interest becomes debt if unpaid. */
function ensureLoan(s: GameState): NonNullable<GameState['loan']> {
  s.loan ||= { outstanding: 0, borrowed: 0, repaid: 0, limit: C.baseLimit, dailyRate: C.baseDailyRate, interestPaid: 0, interestAccrued: 0, lastInterestDay: 0, borrowCount: 0 };
  return s.loan;
}

export function borrowNetwork(s: GameState, amount: number): BorrowResult {
  const loan = ensureLoan(s);
  const terms = networkLoanTerms(s);
  const rounded = Math.floor(Math.max(0, amount) / 100) * 100;
  if (!Number.isFinite(amount) || rounded < terms.minBorrow) return { applied: false, reason: '低于最小借入额', amount: 0, terms };
  if (rounded > terms.availableCredit) return { applied: false, reason: '超过可用额度', amount: 0, terms };
  loan.outstanding += rounded;
  loan.borrowed += rounded;
  loan.borrowCount = (loan.borrowCount || 0) + 1;
  s.cash += rounded;
  s.externalFunding += rounded;
  return { applied: true, amount: rounded, terms };
}

export function repayNetwork(s: GameState, amount: number): BorrowResult {
  const loan = ensureLoan(s);
  const terms = networkLoanTerms(s);
  const rounded = Math.floor(Math.max(0, amount) / 100) * 100;
  const pay = Math.min(rounded, loan.outstanding, Math.max(0, s.cash));
  if (pay <= 0) return { applied: false, reason: '没有可归还金额', amount: 0, terms };
  loan.outstanding -= pay;
  loan.repaid += pay;
  s.cash -= pay;
  s.externalFunding = Math.max(0, s.externalFunding - pay);
  return { applied: true, amount: pay, terms };
}

export interface InterestReceipt {
  interest: number;
  interestPaid: number;
  interestAccrued: number;
  interestRate: number;
}

/** Charge once per completed simulated day; unpaid interest becomes debt. */
export function accrueLoanInterest(s: GameState, living = 0): InterestReceipt {
  const loan = ensureLoan(s);
  if (loan.lastInterestDay === s.day) return { interest: 0, interestPaid: 0, interestAccrued: 0, interestRate: loan.dailyRate };
  const terms = networkLoanTerms(s);
  const rate = terms.dailyRate;
  const interest = terms.estimatedDailyInterest;
  const interestPaid = Math.min(Math.max(0, s.cash - living), interest);
  const interestAccrued = interest - interestPaid;
  s.cash -= interestPaid;
  s.expenses += interest;
  loan.lastInterestDay = s.day;
  loan.dailyRate = rate;
  if (interestAccrued) {
    loan.outstanding += interestAccrued;
    s.externalFunding += interestAccrued;
  }
  loan.interestPaid += interestPaid;
  loan.interestAccrued += interestAccrued;
  return { interest, interestPaid, interestAccrued, interestRate: rate };
}