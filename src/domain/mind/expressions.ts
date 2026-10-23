/** Parameterised original pixel-face rig; art is generated, not copied. */
export interface Expression {
  brow: 'up' | 'down' | 'flat';
  eye: 'normal' | 'wide' | 'closed' | 'tear' | 'x';
  mouth: 'smile' | 'flat' | 'open' | 'frown' | 'grin';
  tint: string;
  sweat: boolean;
  shake: boolean;
}

const BASE: Expression = { brow: 'flat', eye: 'normal', mouth: 'flat', tint: '#f16f9f', sweat: false, shake: false };

const MAP: Record<string, Partial<Expression>> = {
  calm: { brow: 'flat', eye: 'normal', mouth: 'smile' },
  hopeful: { brow: 'up', eye: 'normal', mouth: 'smile' },
  focused: { brow: 'flat', eye: 'normal', mouth: 'flat' },
  smug: { brow: 'up', eye: 'closed', mouth: 'grin' },
  ecstatic: { brow: 'up', eye: 'wide', mouth: 'grin', tint: '#ffd166', shake: true },
  nervous: { brow: 'down', eye: 'wide', mouth: 'flat', sweat: true },
  anxious: { brow: 'down', eye: 'wide', mouth: 'frown', sweat: true },
  irritated: { brow: 'down', eye: 'normal', mouth: 'frown' },
  stunned: { brow: 'up', eye: 'wide', mouth: 'open' },
  exhausted: { brow: 'down', eye: 'closed', mouth: 'flat' },
  guilty: { brow: 'down', eye: 'normal', mouth: 'frown', tint: '#9a90d6' },
  lonely: { brow: 'down', eye: 'normal', mouth: 'flat' },
  warm: { brow: 'up', eye: 'closed', mouth: 'smile' },
  relieved: { brow: 'up', eye: 'closed', mouth: 'smile' },
  regretful: { brow: 'down', eye: 'normal', mouth: 'frown' },
  despair: { brow: 'down', eye: 'tear', mouth: 'open', tint: '#7c8aa8', shake: true },
  'trauma-pain': { brow: 'down', eye: 'tear', mouth: 'open', tint: '#7c8aa8', shake: true },
  'trauma-frozen': { brow: 'up', eye: 'x', mouth: 'open', tint: '#7c8aa8' },
  numb: { brow: 'flat', eye: 'x', mouth: 'flat', tint: '#8894a0' },
  recovering: { brow: 'flat', eye: 'closed', mouth: 'smile', tint: '#9ad1b0' },
};

export function expressionFor(emotion: string): Expression {
  return { ...BASE, ...(MAP[emotion] ?? {}) };
}

export function expressionLabel(emotion: string): string {
  const e = expressionFor(emotion);
  const eyes: Record<Expression['eye'], string> = { normal: '平视', wide: '睁大', closed: '闭眼', tear: '含泪', x: '茫然' };
  const mouth: Record<Expression['mouth'], string> = { smile: '微笑', flat: '抿嘴', open: '张嘴', frown: '皱眉', grin: '咧嘴' };
  return `${eyes[e.eye]} · ${mouth[e.mouth]}${e.sweat ? ' · 冒汗' : ''}${e.shake ? ' · 颤抖' : ''}`;
}