import { EVENTS_PATH, SERVICE_BASE, endpoint, postJson, serviceConfigured, type FetchLike, type ServiceResult } from './config';

export interface TelemetryContext {
  base?: string;
  fetchImpl?: FetchLike;
  enabled: boolean;
  anonId: string;
  outbox?: unknown[];
  seen?: string[];
}

export interface TelemetryEvent {
  id: string;
  kind: string;
  at: number;
  payload?: Record<string, unknown>;
}

/**
 * Anonymous, opt-out telemetry. When disabled or unconfigured it is a no-op and
 * records nothing beyond the caller's own outbox.
 */
export function createTelemetry(ctx: TelemetryContext) {
  const base = ctx.base ?? SERVICE_BASE;
  const send = async (event: TelemetryEvent): Promise<ServiceResult> => {
    if (!ctx.enabled) return { status: 'service-unconfigured' };
    if (!serviceConfigured(base)) return { status: 'service-unconfigured' };
    return postJson(endpoint(EVENTS_PATH, base), { anonId: ctx.anonId, event }, ctx.fetchImpl);
  };
  return {
    enabled: ctx.enabled,
    record(event: TelemetryEvent): boolean {
      if (!ctx.enabled || ctx.seen?.includes(event.id)) return false;
      (ctx.outbox ??= []).push(event);
      return true;
    },
    flush: async (): Promise<ServiceResult[]> => {
      if (!ctx.enabled || !ctx.outbox?.length) return [];
      const results: ServiceResult[] = [];
      for (const event of ctx.outbox.splice(0, ctx.outbox.length)) {
        results.push(await send(event as TelemetryEvent));
        (ctx.seen ??= []).push((event as TelemetryEvent).id);
      }
      return results;
    },
    explain: () => '匿名统计仅记录玩法事件（如开局、结局、成就），不含身份信息，可随时关闭。',
  };
}