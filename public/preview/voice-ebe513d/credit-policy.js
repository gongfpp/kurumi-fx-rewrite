// Fictional game pressure, not a real loan product or a statutory interest rate.
// Pure calculations only: this module never changes a balance or performs I/O.
const BASE_LIMIT = 300000;
const MAX_LIMIT = 3000000;
const BASE_DAILY_RATE = .0005;
const MAX_DAILY_RATE = .008;
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

function finite(value, name) {
  if (value === undefined) return 0;
  if (typeof value !== 'number') throw new TypeError(`${name} must be a number`);
  if (!Number.isFinite(value)) {
    throw new RangeError(`${name} is outside the supported range`);
  }
  return value;
}

// Convert the number's decimal representation directly, avoiding 1.15 * 100
// becoming 114.99999999999999. Cash is floored and debt is ceiled when computing
// remaining credit, so fractional cents cannot buy extra borrowing/repayment.
function cents(value, roundUp = false) {
  const [coefficient, exponent = '0'] = value.toString().split('e');
  const decimals = coefficient.split('.')[1]?.length || 0;
  const scale = Number(exponent) + 2 - decimals;
  const digits = BigInt(coefficient.replace('.', ''));
  if (scale >= 0) return digits * 10n ** BigInt(scale);
  const divisor = 10n ** BigInt(-scale);
  return digits / divisor + (roundUp && digits % divisor ? 1n : 0n);
}

function amountFromCents(value) {
  // Divide in decimal before converting back, so finite huge cash balances do
  // not overflow through an intermediate Number(value) measured in cents.
  const digits = value.toString().padStart(3, '0');
  return Number(`${digits.slice(0, -2)}.${digits.slice(-2)}`);
}

/**
 * assets includes marked-to-market positions; availableCash must contain only
 * spendable cash (never floating gains or locked margin). Negative debt is
 * clamped to zero; malformed/non-finite inputs are rejected. Finite huge
 * balances remain valid; only overflowing aggregate totals are saturated to
 * Number.MAX_VALUE. The policy never caps or mutates the actual game ledger.
 * Only endless mode changes the story terms. Reducing a limit never writes off
 * existing debt. A positive availableCredit below minBorrow cannot be borrowed.
 */
export function creditTerms(input = {}) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new TypeError('creditTerms input must be an object');
  }
  const nominalAssets = finite(input.assets, 'assets');
  const availableCash = Math.max(0, finite(input.availableCash, 'availableCash'));
  const familyDebt = Math.max(0, finite(input.familyDebt, 'familyDebt'));
  const networkDebt = Math.max(0, finite(input.networkDebt, 'networkDebt'));
  const borrowCount = clamp(finite(input.borrowCount, 'borrowCount'), 0, 20);
  const emotionIntensity = clamp(finite(input.emotionIntensity, 'emotionIntensity'), 0, 1);
  const rawTotalDebt = familyDebt + networkDebt;
  const totalDebt = Math.min(rawTotalDebt, Number.MAX_VALUE);
  const netAssets = clamp(Number.isFinite(rawTotalDebt)
    ? nominalAssets - totalDebt : nominalAssets - familyDebt - networkDebt,
  -Number.MAX_VALUE, Number.MAX_VALUE);
  const endless = input.mode === 'endless';
  const limit = endless
    ? Math.floor(clamp(200000 + Math.max(netAssets, 0) + .5 * totalDebt, BASE_LIMIT, MAX_LIMIT) / 100) * 100
    : BASE_LIMIT;
  const denominator = Math.max(nominalAssets, 1);
  const debtRatio = Number.isFinite(rawTotalDebt)
    ? Math.min(totalDebt / denominator, 2)
    : Math.min(Math.min(familyDebt / denominator, 2) + Math.min(networkDebt / denominator, 2), 2);
  const dailyRate = endless
    ? clamp(BASE_DAILY_RATE + .002 * debtRatio
      + .00015 * borrowCount + .0015 * emotionIntensity, BASE_DAILY_RATE, MAX_DAILY_RATE)
    : BASE_DAILY_RATE;
  const interest = networkDebt * dailyRate;
  // Scale the tolerance with the product so decimal half-cents such as 4.015
  // still round up after the two floating-point multiplications.
  const estimatedDailyInterest = Math.round((interest + Number.EPSILON * interest * 2) * 100) / 100;
  return {
    nominalAssets, netAssets, totalDebt, limit, dailyRate,
    availableCredit: networkDebt >= limit ? 0 : Math.max(0, limit * 100 - Number(cents(networkDebt, true))) / 100,
    maxRepayment: amountFromCents(cents(Math.min(availableCash, networkDebt))),
    estimatedDailyInterest,
    minBorrow: 100,
  };
}
