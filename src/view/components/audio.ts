import { bgmUrl, sfxUrl } from '../../content/assets';

export interface AudioState {
  bgmEnabled: boolean;
  sfxEnabled: boolean;
  volume: number;
  currentBgm: string | null;
}

const KEY = 'kurumi-fx:audio';

export function createAudio() {
  let state: AudioState = { bgmEnabled: false, sfxEnabled: true, volume: 0.5, currentBgm: null };
  let bgmEl: HTMLAudioElement | null = null;

  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? 'null') as Partial<AudioState> | null;
    if (saved) state = { ...state, ...saved, currentBgm: null };
  } catch {
    /* ignore */
  }

  const save = (): void => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  };

  const AudioCtor = (globalThis as { Audio?: typeof Audio }).Audio;

  return {
    get state(): AudioState {
      return { ...state };
    },
    setBgmEnabled(on: boolean): void {
      state.bgmEnabled = on;
      if (!on) this.stopBgm();
      save();
    },
    setSfxEnabled(on: boolean): void {
      state.sfxEnabled = on;
      save();
    },
    setVolume(v: number): void {
      state.volume = Math.max(0, Math.min(1, v));
      if (bgmEl) bgmEl.volume = state.volume;
      save();
    },
    playBgm(name: string): void {
      state.currentBgm = name;
      save();
      if (!state.bgmEnabled || !AudioCtor) return;
      if (bgmEl && bgmEl.dataset.track === name) return;
      this.stopBgm();
      const el = new AudioCtor(bgmUrl(name));
      el.loop = true;
      el.volume = state.volume;
      el.dataset.track = name;
      bgmEl = el;
      void el.play().catch(() => {
        /* autoplay blocked until a user gesture */
      });
    },
    stopBgm(): void {
      if (bgmEl) {
        bgmEl.pause();
        bgmEl = null;
      }
    },
    playSfx(key: string): void {
      if (!state.sfxEnabled || !AudioCtor) return;
      const url = sfxUrl(key);
      if (!url) return;
      const el = new AudioCtor(url);
      el.volume = state.volume;
      void el.play().catch(() => {
        /* ignore */
      });
    },
  };
}

export type AudioController = ReturnType<typeof createAudio>;