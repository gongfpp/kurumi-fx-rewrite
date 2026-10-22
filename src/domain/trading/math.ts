import { NUMERICS } from '../../content/config/numerics';

/** Round to 2 decimal places, matching engine money handling. */
export const money = (n: number): number => Math.round(n * 100) / 100;

/** Open/close fee for a margin at a leverage. */
export const fee = (margin: number, leverage: number): number => money(margin * leverage * NUMERICS.FEE_RATE);

/** Floor to 2 decimals, never negative. */
export const floorMoney = (n: number): number => Math.max(0, Math.floor((n + 1e-8) * 100) / 100);

/** Largest margin affordable within a budget after its own open fee. */
export function marginWithinBudget(budget: number, leverage: number): number {
  let margin = floorMoney(budget / (1 + leverage * NUMERICS.FEE_RATE));
  if (margin + fee(margin, leverage) > budget + 1e-8) margin = floorMoney(margin - 0.01);
  return margin;
}

export const clamp = (value: number, min: number, max: number): number => Math.max(min, Math.min(max, value));