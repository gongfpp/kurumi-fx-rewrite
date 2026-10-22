/** Design tokens for the three selectable art styles. */
export type ThemeId = 'comic' | 'terminal' | 'cyber';

export interface ThemeTokens {
  id: ThemeId;
  label: string;
  bg: string;
  panel: string;
  panelAlt: string;
  ink: string;
  muted: string;
  accent: string;
  accentSoft: string;
  up: string;
  down: string;
  warn: string;
  grid: string;
  font: string;
}

export const THEMES: Record<ThemeId, ThemeTokens> = {
  comic: {
    id: 'comic',
    label: '漫画交易室',
    bg: '#151e25',
    panel: '#1c2831',
    panelAlt: '#24303a',
    ink: '#f5f7f9',
    muted: '#9fb0bd',
    accent: '#f16f9f',
    accentSoft: '#7a3a53',
    up: '#7fd4a0',
    down: '#ef7d7d',
    warn: '#f2c14e',
    grid: '#2c3b46',
    font: 'system-ui, "Noto Sans SC", sans-serif',
  },
  terminal: {
    id: 'terminal',
    label: 'CRT 投机终端',
    bg: '#04120a',
    panel: '#071c10',
    panelAlt: '#0a2416',
    ink: '#59ff9d',
    muted: '#2f9d63',
    accent: '#fbbf24',
    accentSoft: '#5a4a12',
    up: '#59ff9d',
    down: '#ff6b6b',
    warn: '#fbbf24',
    grid: '#0f3a22',
    font: 'ui-monospace, "Cascadia Mono", Menlo, monospace',
  },
  cyber: {
    id: 'cyber',
    label: '像素赛博 Tokyo',
    bg: '#0b0a1f',
    panel: '#151233',
    panelAlt: '#1d1947',
    ink: '#eae6ff',
    muted: '#9a90d6',
    accent: '#ff4fa3',
    accentSoft: '#5b2a53',
    up: '#5cffd6',
    down: '#ff5c8a',
    warn: '#ffd166',
    grid: '#2a2560',
    font: '"Segoe UI", system-ui, sans-serif',
  },
};

export const DEFAULT_THEME: ThemeId = 'comic';
export const THEME_IDS: ThemeId[] = ['comic', 'terminal', 'cyber'];

export function themeTokens(id: string): ThemeTokens {
  return THEMES[(id as ThemeId) in THEMES ? (id as ThemeId) : DEFAULT_THEME];
}