import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "webscout_url_bookmarks";

function readBookmarks(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((v) => typeof v === "string");
  } catch {
    return [];
  }
}

function writeBookmarks(urls: string[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(urls));
  } catch {
    // ignore quota/storage errors
  }
}

export function useUrlBookmarks() {
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  useEffect(() => {
    setBookmarks(readBookmarks());
  }, []);

  const setForUrl = useMemo(() => new Set(bookmarks), [bookmarks]);

  function isBookmarked(url: string): boolean {
    return setForUrl.has(url.trim());
  }

  function toggleBookmark(url: string) {
    const trimmed = url.trim();
    if (!trimmed) return;
    setBookmarks((prev) => {
      const exists = prev.includes(trimmed);
      const next = exists
        ? prev.filter((u) => u !== trimmed)
        : [trimmed, ...prev];
      writeBookmarks(next);
      return next;
    });
  }

  function getAllBookmarks(): string[] {
    return bookmarks;
  }

  function clearAllBookmarks() {
    setBookmarks([]);
    writeBookmarks([]);
  }

  return {
    bookmarks,
    isBookmarked,
    toggleBookmark,
    getAllBookmarks,
    clearAllBookmarks,
  };
}

