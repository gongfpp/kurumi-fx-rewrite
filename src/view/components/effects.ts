/** Lightweight canvas particle bursts + number tween. No third-party deps. */

type Kind = 'coin' | 'shatter' | 'spark';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  kind: Kind;
  spin: number;
  angle: number;
}

export interface ParticleSystem {
  burst(x: number, y: number, kind: Kind, count?: number): void;
  start(): void;
  stop(): void;
  resize(): void;
}

const COLORS: Record<Kind, string[]> = {
  coin: ['#f2c14e', '#ffd166', '#fff3c4'],
  shatter: ['#ef7d7d', '#ff5c8a', '#9fb0bd'],
  spark: ['#7fd4a0', '#5cffd6', '#f16f9f'],
};

export function createParticles(canvas: HTMLCanvasElement): ParticleSystem {
  const ctx = canvas.getContext('2d');
  const particles: Particle[] = [];
  let raf: number | null = null;
  const dpr = () => window.devicePixelRatio || 1;

  function resize(): void {
    canvas.width = window.innerWidth * dpr();
    canvas.height = window.innerHeight * dpr();
    ctx?.setTransform(dpr(), 0, 0, dpr(), 0, 0);
  }

  function tick(): void {
    if (!ctx) return;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i] as Particle;
      p.vy += p.kind === 'coin' ? 0.32 : 0.16;
      p.vx *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      p.angle += p.spin;
      p.life -= 1;
      const alpha = Math.max(0, p.life / p.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.fillStyle = p.color;
      if (p.kind === 'shatter') {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      if (p.life <= 0) particles.splice(i, 1);
    }
    raf = particles.length ? window.requestAnimationFrame(tick) : null;
  }

  function burst(x: number, y: number, kind: Kind, count = 24): void {
    const palette = COLORS[kind];
    for (let i = 0; i < count; i++) {
      const life = kind === 'coin' ? 46 : 40;
      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * (kind === 'shatter' ? 8 : 6),
        vy: -Math.random() * (kind === 'coin' ? 7 : 5) - 1,
        life,
        maxLife: life,
        size: kind === 'coin' ? 3 + Math.random() * 3 : 2 + Math.random() * 3,
        color: palette[Math.floor(Math.random() * palette.length)] as string,
        kind,
        spin: (Math.random() - 0.5) * 0.3,
        angle: Math.random() * Math.PI,
      });
    }
    if (raf === null) raf = window.requestAnimationFrame(tick);
  }

  resize();
  window.addEventListener('resize', resize);
  return {
    burst,
    start() {
      if (raf === null && particles.length) raf = window.requestAnimationFrame(tick);
    },
    stop() {
      if (raf !== null) {
        window.cancelAnimationFrame(raf);
        raf = null;
      }
      particles.length = 0;
      ctx?.clearRect(0, 0, window.innerWidth, window.innerHeight);
    },
    resize,
  };
}

/** Tween a numeric DOM value from -> to, formatted as JP yen. */
export function countUp(el: HTMLElement, from: number, to: number, format: (n: number) => string = (n) => '¥' + Math.round(n).toLocaleString('zh-CN'), duration = 420): void {
  if (!Number.isFinite(from) || !Number.isFinite(to) || from === to) {
    el.textContent = format(to);
    return;
  }
  const start = performance.now();
  const step = (now: number): void => {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = format(from + (to - from) * eased);
    if (t < 1) window.requestAnimationFrame(step);
  };
  window.requestAnimationFrame(step);
}

/** Short theme-crossfade flash on the document root. */
export function flashTheme(): void {
  const body = document.body;
  body.classList.remove('fx-theme-flash');
  void body.offsetWidth;
  body.classList.add('fx-theme-flash');
  window.setTimeout(() => body.classList.remove('fx-theme-flash'), 420);
}

/** Recenter a burst at an element's midpoint with slight randomness. */
export function centerOf(el: Element | null): { x: number; y: number } {
  if (!el) return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width * (0.3 + Math.random() * 0.4), y: r.top + r.height / 2 };
}