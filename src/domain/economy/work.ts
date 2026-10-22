import { LIFE, type JobDef } from '../../content';
import { consumeStamina, ensureStamina } from '../body/stamina';
import type { GameState } from '../core/types';

export const LIFE_WORK_JOBS: JobDef[] = LIFE.jobs;

export function jobById(id: string): JobDef | null {
  return LIFE_WORK_JOBS.find((j) => j.id === id) ?? null;
}

/** Pay scales with the stamina actually spent; a full shift pays the base wage. */
export function calculateWorkPay(startStamina: number, requiredStamina: number, baseIncome: number): number {
  if (startStamina >= requiredStamina) return baseIncome;
  return Math.floor(baseIncome * (Math.max(0, startStamina) / requiredStamina));
}

export interface WorkReceipt {
  applied: boolean;
  reason?: string;
  income: number;
  staminaCost: number;
  stressDelta: number;
  partial: boolean;
  rewardId?: string;
  rewardLabel?: string;
}

export function doWork(s: GameState, jobId: string): WorkReceipt {
  const job = jobById(jobId);
  const empty: WorkReceipt = { applied: false, income: 0, staminaCost: 0, stressDelta: 0, partial: false };
  if (!job) return { ...empty, reason: '未知工作' };
  const stamina = ensureStamina(s);
  if (stamina.value <= 0) return { ...empty, reason: '体力不足' };
  const required = job.staminaCost;
  const spent = Math.min(stamina.value, required);
  const income = calculateWorkPay(stamina.value, required, job.income);
  const before = stamina.value;
  consumeStamina(s, { amount: spent, id: `work:${s.runId ?? s.seed}:${s.day}:${jobId}`, source: 'work' });
  void before;
  s.cash += income;
  s.nonTradingIncome += income;
  s.stress = Math.max(0, (s.stress || 0) + job.stressDelta);
  return { applied: true, income, staminaCost: spent, stressDelta: job.stressDelta, partial: spent < required, rewardId: job.rewardId, rewardLabel: job.rewardLabel };
}

export function workPayNote(receipt: WorkReceipt): string {
  return receipt.partial ? `今天体力只够做完一部分，工资 ${receipt.income}。` : `收工，工资 ${receipt.income} 到手了。`;
}