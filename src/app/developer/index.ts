/** Developer tools are session-scoped and permanently taint a run from rankings. */
export const DEVELOPER_SESSION_MS = 15 * 60 * 1000;

export interface DeveloperState {
  active: boolean;
  tainted: boolean;
  changedAt: number | null;
  profitOffset: number;
  sanityOverride: number | null;
  sessionStartedAt: number | null;
}

export function createDeveloper(): DeveloperState {
  return { active: false, tainted: false, changedAt: null, profitOffset: 0, sanityOverride: null, sessionStartedAt: null };
}

export function enableDeveloper(dev: DeveloperState, now: number = Date.now()): DeveloperState {
  dev.active = true;
  dev.sessionStartedAt = now;
  return dev;
}

export function disableDeveloper(dev: DeveloperState): DeveloperState {
  dev.active = false;
  return dev;
}

export function sessionExpired(dev: DeveloperState, now: number = Date.now()): boolean {
  return dev.active && dev.sessionStartedAt !== null && now - dev.sessionStartedAt >= DEVELOPER_SESSION_MS;
}

/** Any balance/profit edit permanently taints the run. */
export function editDeveloper(dev: DeveloperState, patch: Partial<DeveloperState>, now: number = Date.now()): DeveloperState {
  Object.assign(dev, patch);
  dev.tainted = true;
  dev.changedAt = now;
  return dev;
}

export function rankingEligible(dev: DeveloperState): boolean {
  return !dev.tainted;
}

export function developerNote(dev: DeveloperState): string {
  if (!dev.tainted) return '开发者模式会话 15 分钟，修改会永久标记本局。';
  return '本局已被标记：不再计入排行榜与成就。';
}