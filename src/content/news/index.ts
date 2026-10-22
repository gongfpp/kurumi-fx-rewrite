import chains from './chains.json';
import swans from './swans.json';

export interface NewsChain {
  id: string;
  name: string;
  bias: number;
  vol: number;
  source: string;
  lead: string;
  leadCopy: string;
  confirmed: [string, string];
  reversed: [string, string];
  muted: [string, string];
}

export interface Swan {
  id: string;
  name: string;
  title: string;
  copy: string;
  delta: number;
  speaker: string;
}

export const NEWS_CHAINS: NewsChain[] = chains as unknown as NewsChain[];
export const BLACK_SWANS: Swan[] = swans as unknown as Swan[];
export const NEWS_VARIANTS = ['confirmed', 'reversed', 'muted'] as const;
export type NewsVariant = (typeof NEWS_VARIANTS)[number];