export const RECENT_KEY = "webscout_recent";

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export type RecentItem = {
  url: string;
  at: string;
};

export function getRecents(): RecentItem[] {
  if (typeof window === "undefined") return [];
  return safeParse<RecentItem[]>(localStorage.getItem(RECENT_KEY), []);
}

export function addRecent(url: string, max: number = 10): RecentItem[] {
  if (typeof window === "undefined") return [];
  const trimmed = url.trim();
  if (!trimmed) return getRecents();
  const now = new Date().toISOString();
  const existing = getRecents().filter((r) => r.url !== trimmed);
  const next = [{ url: trimmed, at: now }, ...existing].slice(0, max);
  localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  return next;
}

export function removeRecent(url: string): RecentItem[] {
  if (typeof window === "undefined") return [];
  const trimmed = url.trim();
  if (!trimmed) return getRecents();
  const existing = getRecents();
  const next = existing.filter((r) => r.url !== trimmed);
  localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  return next;
}

