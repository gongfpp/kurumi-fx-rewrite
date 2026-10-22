import { NUMERICS } from '../../content/config/numerics';
import type { GameState, TradeReceipt } from '../core/types';

export interface TraumaReadout {
  active: boolean;
  severity: number;
  intensity: number;
  level: 'hurt' | 'crushed' | 'numb' | 'recovering';
  mood: string | null;
  label: string;
  cap: number;
  line: string;
  nextAt: number | null;
  recoveryUnits: number;
  explanation: string;
}

const P = NUMERICS.TRAUMA;

const closed = (s: GameState): TradeReceipt[] => (s.history || []).filter((t) => t.type !== 'open' && Number.isFinite(t.pnl));

const gameTick = (s: GameState): number => Math.max(0, Math.trunc(s.completedCandles || 0) * 6 + Math.trunc(s.pending?.tick ?? 0));

const starting = (s: GameState): number => Math.max(1, s.startEquity || NUMERICS.START);

function lossSeverity(loss: number, reference: number): number {
  const ratio = loss / Math.max(1, reference);
  return ratio >= 0.75 ? 92 : ratio >= 0.45 ? 76 : ratio >= 0.2 ? 46 : 0;
}

/** Observe verified CLOSED losses and derive a bounded trauma episode. Read-only for balances. */
export function observeTrauma(s: GameState): TraumaReadout {
  const trades = closed(s);
  const total = s.performance?.totalProfit ?? trades.reduce((n, t) => n + t.pnl, 0);
  const count = Math.max(trades.length, Math.max(0, Math.trunc(s.performance?.closedTrades ?? 0)));
  let balance = starting(s) + total - trades.reduce((n, t) => n + t.pnl, 0);
  let peak = Math.max(starting(s), balance);
  let minimum = Math.min(starting(s), balance);
  for (const t of trades) {
    balance += t.pnl;
    peak = Math.max(peak, balance);
    minimum = Math.min(minimum, balance);
  }
  const old = s.tradingTrauma;
  const compatible = !!old && old.version === 1 && old.mode === (s.mode || 'story') && old.seed === s.seed && (!old.runId || !s.runId || old.runId === s.runId);
  if (!compatible) {
    s.tradingTrauma = {
      version: 1,
      mode: s.mode || 'story',
      seed: s.seed,
      runId: s.runId || null,
      severity: 0,
      peakRealized: peak,
      realized: total,
      seenCloses: count,
      hitTick: gameTick(s) - P.numbTicks,
      hitDay: Math.max(1, s.day || 1),
      recoveryUnits: 0,
      recentLosses: trades
        .filter((t) => t.pnl < 0 && (t.day ?? s.day) >= (s.day || 1) - 3)
        .slice(-8)
        .map((t) => ({ loss: -t.pnl, day: Math.max(1, t.day || s.day || 1), liquidation: t.type === 'liquidation' })),
    };
    const rec = s.tradingTrauma;
    rec.severity = Math.max(0, ...rec.recentLosses.map((t) => lossSeverity(t.loss, rec.peakRealized)));
  } else {
    const rec = s.tradingTrauma as NonNullable<GameState['tradingTrauma']>;
    if (count > rec.seenCloses) {
      let damage = 0;
      const incoming = trades.slice(-(count - rec.seenCloses));
      for (const t of incoming) {
        if (t.pnl < 0) damage = Math.max(damage, lossSeverity(-t.pnl, rec.peakRealized));
      }
      rec.peakRealized = Math.max(rec.peakRealized, peak);
      const liquidations = rec.recentLosses.filter((t) => t.liquidation);
      if (liquidations.length >= 2 && liquidations.reduce((n, t) => n + t.loss, 0) / rec.peakRealized >= 0.35) damage = Math.max(damage, 88);
      if (damage >= P.hurtAt) {
        rec.severity = Math.max(rec.severity, damage);
        rec.hitTick = gameTick(s);
        rec.hitDay = Math.max(1, s.day);
        rec.recoveryUnits = 0;
      }
      rec.seenCloses = count;
      rec.realized = total;
    }
    void minimum;
  }
  return traumaReadout(s);
}

export function traumaReadout(s: GameState): TraumaReadout {
  const t = s.tradingTrauma;
  if (!t || t.version !== 1 || t.severity <= 0) {
    return { active: false, severity: 0, intensity: 0, level: 'recovering', mood: null, label: '平静', cap: 100, line: '', nextAt: null, recoveryUnits: 0, explanation: '' };
  }
  const severity = t.severity;
  const age = Math.max(0, gameTick(s) - t.hitTick);
  const level: TraumaReadout['level'] = severity >= 85 ? 'numb' : severity >= 70 ? 'crushed' : severity >= 40 ? 'hurt' : 'recovering';
  const mood = level === 'recovering' ? 'recovering' : severity >= 85 && age >= P.numbTicks ? 'numb' : severity >= 70 && age < P.painTicks ? 'trauma-pain' : 'trauma-frozen';
  const labels: Record<string, string> = { 'trauma-pain': '崩溃', 'trauma-frozen': level === 'hurt' ? '重创' : '恍惚', numb: '麻木', recovering: '恢复中' };
  const cap = severity >= 85 ? P.numbCap : severity >= 70 ? P.crushedCap : P.hurtCap;
  const lines: Record<string, string> = {
    'trauma-pain': '刚才的损失……还缓不过来。',
    'trauma-frozen': '数字还在变，我却有点反应不过来。',
    numb: '……先停一会儿。',
    recovering: '还没缓过来，今天慢一点。',
  };
  const nextAt =
    severity >= 70 && age < P.painTicks ? t.hitTick + P.painTicks : severity >= 85 && age < P.numbTicks ? t.hitTick + P.numbTicks : null;
  return {
    active: true,
    severity,
    intensity: severity / 100,
    level,
    mood,
    label: labels[mood] as string,
    cap,
    line: lines[mood] as string,
    nextAt,
    recoveryUnits: t.recoveryUnits,
    explanation: `交易重创恢复期 · 承受力上限 ${cap}。借入资金和小幅盈利不会抹去冲击；${s.mode === 'endless' ? '空仓度过完整行情段' : '完成休市休息'}后逐步恢复。`,
  };
}

export function recoverTrauma(s: GameState, { kind, day = s.day }: { kind: 'rest' | 'flat-segment'; day?: number }): boolean {
  const t = s.tradingTrauma;
  if (!t || t.severity <= 0) return false;
  if (s.positions?.length) return false;
  if (kind === 'rest') {
    if (s.mode === 'endless' || s.phase !== 'resting' || day <= (t.hitDay ?? 0)) return false;
    t.severity = Math.max(0, t.severity - P.restRecovery);
    t.recoveryUnits++;
  } else {
    t.severity = Math.max(0, t.severity - P.flatSegmentRecovery);
    t.recoveryUnits += 0.25;
  }
  return true;
}

export function capTraumaSanity(s: GameState, value: number): number {
  const t = traumaReadout(s);
  if (!t.active) return value;
  const floor = (s.startEquity || NUMERICS.START) >= 1000 ? P.survivalFloor : 0;
  return Math.min(t.cap, Math.max(floor, value));
}

export const isTraumaMood = (mood: string): boolean => ['trauma-pain', 'trauma-frozen', 'numb', 'recovering'].includes(mood);