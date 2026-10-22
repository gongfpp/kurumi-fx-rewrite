import achievementsRaw from './achievements.json';
import endingsRaw from './endings.json';
import itemsRaw from './items.json';
import lifeRaw from './life/jobs.json';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  badge: string;
  sourceNote: string;
  goal: number;
}

export interface EndingDef {
  id: string;
  baseId: string;
  title: string;
  description: string;
  rule: string;
}

export interface ItemDef {
  id: string;
  name: string;
  price: number;
  stamina: number;
  stress: number;
  mood: string | null;
  meal: boolean;
  effect: string;
  sourceNote: string;
}

export interface JobDef {
  id: string;
  label: string;
  income: number;
  staminaCost: number;
  stressDelta: number;
  rewardId: string;
  rewardLabel: string;
}

export interface LifeContent {
  jobs: JobDef[];
  relax: { id: string; label: string; cost: number; stamina: number; stress: number }[];
  dinner: { id: string; label: string; cost: number; meal: boolean; relationship?: number }[];
  friends: string[];
}

export const ACHIEVEMENTS: Achievement[] = achievementsRaw as unknown as Achievement[];
export const ENDINGS: EndingDef[] = endingsRaw as unknown as EndingDef[];
export const ITEMS: ItemDef[] = itemsRaw as unknown as ItemDef[];
export const LIFE: LifeContent = lifeRaw as unknown as LifeContent;