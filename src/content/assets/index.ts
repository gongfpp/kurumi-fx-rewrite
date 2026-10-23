import manifestRaw from './manifest.json';

type Manifest = Record<string, string[]>;
const M = manifestRaw as unknown as Manifest;
const BASE = (import.meta.env?.BASE_URL as string | undefined) ?? '/';

export const assetUrl = (rel: string): string => `${BASE}fx/${rel}`;

export const EXPRESSION_FILES = M.expressions ?? [];
export const COMIC_FILES = M.comics ?? [];
export const HOMAGE_FILES = M.homage ?? [];
export const PIXEL_FILES = M.pixel ?? [];
export const VOICE_FILES = M.voice ?? [];
export const BGM_FILES = M.bgm ?? [];
export const SFX_FILES = M.sfx ?? [];
export const GENERATED_FILES = M.generated ?? [];
export const MANGA_FILES = M.manga ?? [];

/** Emotion key (from mood()) -> original expression asset. */
const MOOD_FILE: Record<string, string> = {
  calm: 'kurumi-calm.webp',
  hopeful: 'kurumi-hopeful.webp',
  focused: 'kurumi-focused.webp',
  irritated: 'kurumi-irritated.webp',
  stunned: 'kurumi-stunned.webp',
  exhausted: 'kurumi-exhausted.webp',
  guilty: 'kurumi-guilty.webp',
  embarrassed: 'kurumi-embarrassed.webp',
  lonely: 'kurumi-lonely.webp',
  determined: 'kurumi-determined.webp',
  warm: 'kurumi-warm.webp',
  smug: 'kurumi-smug.webp',
  nervous: 'kurumi-nervous.webp',
  anxious: 'kurumi-anxious.webp',
  ecstatic: 'kurumi-exhilarated.webp',
  despair: 'kurumi-shocked.webp',
  regretful: 'kurumi-regretful.webp',
  relieved: 'kurumi-relieved.webp',
  'trauma-pain': 'kurumi-shocked.webp',
  'trauma-frozen': 'kurumi-blank.webp',
  numb: 'kurumi-blank.webp',
  recovering: 'kurumi-calm.webp',
};

export function expressionUrl(emotion: string): string {
  const file = MOOD_FILE[emotion] ?? 'kurumi-blank.webp';
  return assetUrl(`expressions/${file}`);
}

/** Named SFX keys used by gameplay events. */
export const SFX_INDEX: Record<string, string> = {
  news: 'news-notice.mp3',
  orderOpen: 'order-confirm.mp3',
  orderClose: 'order-close.mp3',
  tick: 'quote-tick.mp3',
  profit: 'profit-notice.mp3',
  risk: 'risk-notice.mp3',
  success: 'success-notice.mp3',
  tap: 'terminal-tap.mp3',
  pressureHit: 'pressure-v3/hit.mp3',
  pressureRise: 'pressure-v3/break-rise.mp3',
  pressureFall: 'pressure-v3/break-fall.mp3',
  recapRise: 'recap-v3/rise.mp3',
  recapFall: 'recap-v3/fall.mp3',
  landProfit: 'recap-v3/land-profit.mp3',
  landLoss: 'recap-v3/land-loss.mp3',
  terminalTap: 'terminal-v2/tap.mp3',
  terminalClose: 'terminal-v2/close.mp3',
  terminalNews: 'terminal-v2/news.mp3',
  terminalRisk: 'terminal-v2/risk.mp3',
  terminalFill: 'terminal-v2/fill.mp3',
  majorProfit: 'terminal-v2/major-profit.mp3',
  majorLoss: 'terminal-v2/major-loss.mp3',
  reject: 'terminal-v2/reject.mp3',
  breakthrough: 'terminal-v2/breakthrough.mp3',
};

export function sfxUrl(key: string): string | null {
  const rel = SFX_INDEX[key];
  return rel ? assetUrl(`sfx/${rel}`) : null;
}

export const BGM_TRACKS: string[] = BGM_FILES.map((p) => p.replace(/^bgm\//, '').replace(/\.mp3$/, ''));

export function bgmUrl(name: string): string {
  return assetUrl(`bgm/${name}.mp3`);
}

export interface VoiceClip {
  id: string;
  file: string;
  caption: string;
}

const VOICE_CAPTIONS: Record<string, string> = {
  'kurumi-came.mp3': '「我回来了……」',
  'kurumi-cannot-lose.mp3': '「不能输……」',
  'kurumi-check.mp3': '「再确认一下。」',
  'kurumi-family-money.mp3': '「那是家里的钱。」',
  'kurumi-gasp.mp3': '（倒吸一口气）',
  'kurumi-gone.mp3': '「……没了。」',
  'kurumi-greedy.mp3': '「再多一点就好。」',
  'kurumi-human.mp3': '「我也是人啊。」',
  'kurumi-laugh.mp3': '（苦笑）',
  'kurumi-profit-ten.mp3': '「十万……到手了。」',
  'kurumi-profit-twenty.mp3': '「两千万！」',
  'kurumi-profit-vanished.mp3': '「利润……不见了。」',
  'kurumi-stop.mp3': '「停！别看了。」',
  'mebuki-rich.mp3': '「有钱真好啊。」',
  'mochiko-waste.mp3': '「你这是在浪费。」',
  'yasuko-start.mp3': '「开始吧。」',
};

export const VOICE_CLIPS: VoiceClip[] = VOICE_FILES.map((p) => {
  const file = p.replace(/^voice\//, '');
  return { id: file.replace(/\.mp3$/, ''), file: p, caption: VOICE_CAPTIONS[file] ?? file };
});

export function voiceUrl(file: string): string {
  return assetUrl(file.replace(/^fx\//, ''));
}

/** Curated scene illustrations (daily four-panel / events / life). */
export const SCENES: Record<string, string> = {
  liquidation: 'generated/comic-scenes-v1/liquidation.webp',
  stopLoss: 'generated/comic-scenes-v1/stop-loss.webp',
  closedProfit: 'generated/comic-scenes-v1/closed-profit.webp',
  takeaway: 'generated/comic-scenes-v1/takeaway.webp',
  noodles: 'generated/comic-scenes-v1/noodles-today.webp',
  energy: 'generated/comic-scenes-v1/energy.webp',
  dinnerSmall: 'generated/comic-scenes-v1/dinner-small.webp',
  dinnerFriends: 'generated/comic-scenes-v1/dinner-friends.webp',
  dinnerFeast: 'generated/comic-scenes-v1/dinner-feast.webp',
  friendTreat: 'generated/comic-scenes-v1/friend-treat.webp',
  spa: 'generated/comic-scenes-v1/spa.webp',
  fatherBorrow: 'generated/comic-scenes-v1/father-borrow.webp',
  fatherDiscover: 'generated/comic-scenes-v1/father-discover.webp',
  fatherFound: 'generated/comic-scenes-v1/father-found.webp',
  fatherRepaid: 'generated/comic-scenes-v1/father-repaid.webp',
  loanFunded: 'generated/comic-scenes-v1/loan-funded.webp',
  loanInterest: 'generated/comic-scenes-v1/loan-interest.webp',
  loanRepaid: 'generated/comic-scenes-v1/loan-repaid.webp',
  livingBasic: 'generated/comic-scenes-v1/living-basic.webp',
  livingComfortable: 'generated/comic-scenes-v1/living-comfortable.webp',
  livingGenerous: 'generated/comic-scenes-v1/living-generous.webp',
  settledNoTrade: 'generated/comic-scenes-v1/settled-no-trade.webp',
  settledSmallLoss: 'generated/comic-scenes-v1/settled-small-loss.webp',
  skitDinnerSmall: 'generated/approved-four-skits-v1/dinner-small.webp',
  skitHoldingLoss: 'generated/approved-four-skits-v1/holding-loss-companion.webp',
  skitAfterLoan: 'generated/approved-four-skits-v1/mebuki-after-loan.webp',
  skitShrineWalk: 'generated/approved-four-skits-v1/shrine-walk.webp',
  profitHundredThousand: 'generated/character-profit-v1/profit-hundred-thousand-v1.webp',
  profitTwentyMillion: 'generated/character-profit-v1/profit-twenty-million-v1.webp',
  chapterPreparation: 'generated/chapter-01/preparation-original.webp',
  chapterExitPlan: 'generated/chapter-01/exit-plan-original.webp',
};

export function sceneUrl(key: string): string | null {
  const rel = SCENES[key];
  return rel ? assetUrl(rel) : null;
}

export const PIXEL_INDEX: Record<string, string> = {
  uiIcons: 'pixel-assets/ui-icons-transparent.png',
  uiIconsExtra: 'pixel-assets/ui-icons-extra-transparent.png',
  lifeMenu: 'pixel-assets/life-menu-approved.png',
  lifeWork: 'pixel-assets/life-work-approved.png',
  lifeRelax: 'pixel-assets/life-relax-approved.png',
  lifeFriends: 'pixel-assets/life-friends-approved.png',
  mobileLife: 'pixel-assets/mobile-life-approved.png',
  reportPixel: 'pixel-assets/report-pixel-approved.png',
  referenceAtlas: 'pixel-assets/reference-atlas.png',
};

export function pixelUrl(key: string): string | null {
  const rel = PIXEL_INDEX[key];
  return rel ? assetUrl(rel) : null;
}

export function mangaUrl(file: string): string {
  return assetUrl(`manga/${file}`);
}