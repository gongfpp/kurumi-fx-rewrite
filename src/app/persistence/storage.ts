/** Namespaced browser storage. Kurumi writes only under its own prefix. */
export const STORAGE_PREFIX = 'kurumi-fx:';
export const SAVE_KEY = 'fx-girl-campaign-v3';
export const ENDLESS_KEY = 'fx-girl-endless-v1';

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export function scopedKey(key: string): string {
  return STORAGE_PREFIX + key;
}

export function memoryStorage(seed: Record<string, string> = {}): StorageLike & { dump(): Record<string, string> } {
  const map = new Map<string, string>(Object.entries(seed));
  return {
    getItem: (k) => (map.has(k) ? (map.get(k) as string) : null),
    setItem: (k, v) => {
      map.set(k, String(v));
    },
    removeItem: (k) => {
      map.delete(k);
    },
    dump: () => Object.fromEntries(map),
  };
}

export interface NamespacedStorage {
  read(key: string): string | null;
  write(key: string, value: string): void;
  remove(key: string): void;
}

export function kurumiStorage(raw?: StorageLike): NamespacedStorage {
  const backing = raw ?? (globalThis.localStorage as StorageLike | undefined);
  if (!backing) throw new Error('Browser storage is unavailable');
  return {
    read: (key) => backing.getItem(scopedKey(key)),
    write: (key, value) => backing.setItem(scopedKey(key), value),
    remove: (key) => backing.removeItem(scopedKey(key)),
  };
}