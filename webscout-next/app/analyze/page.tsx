"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Download } from "lucide-react";
import { safeHref } from "@/lib/safeHref";
import { useRouter, useSearchParams } from "next/navigation";
import { addRecent } from "@/lib/clientStorage";
import AnalyzeTabs, { getViewFromParams } from "@/components/AnalyzeTabs";
import InsightsPanel from "@/components/InsightsPanel";
import FigmaReadyPanel from "@/components/FigmaReadyPanel";
import ImportancePanel from "@/components/ImportancePanel";
import PageTypesPanel from "@/components/PageTypesPanel";
import LoadingSplash from "@/components/LoadingSplash";
import { useUrlBookmarks } from "@/hooks/useUrlBookmarks";
import { normalizeUrls } from "@/lib/normalizeUrls";

type CollectDonePayload = {
  urls?: {
    url: string;
    pathDepth?: number;
    hasQuery?: boolean;
    external?: boolean;
  }[];
  source?: string | null;
};

type CollectResponse = {
  logs: string[];
  result: (CollectDonePayload & { type?: string }) | null;
};

function downloadTextFile(filename: string, lines: string[]) {
  if (typeof window === "undefined" || lines.length === 0) return;
  try {
    const text = lines.join("\n") + "\n";
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch {
    // ignore download errors
  }
}

type UrlCheckboxProps = {
  id: string;
  checked: boolean;
  onChange: () => void;
  ariaLabel: string;
  indeterminate?: boolean;
};

function UrlCheckbox({
  id,
  checked,
  onChange,
  ariaLabel,
  indeterminate,
}: UrlCheckboxProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = !!indeterminate && !checked;
    }
  }, [indeterminate, checked]);

  return (
    <label
      htmlFor={id}
      className="inline-flex items-center justify-center cursor-pointer select-none"
    >
      <input
        ref={inputRef}
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        aria-label={ariaLabel}
        className="peer sr-only"
      />
      <span
        className="inline-flex items-center justify-center h-5 w-5 rounded-md border border-neutral-300 bg-white transition-all duration-150
                   peer-checked:bg-black peer-checked:border-black
                   peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-black"
      >
        <svg
          viewBox="0 0 16 16"
          aria-hidden="true"
          className={`h-3 w-3 text-white transition-opacity duration-150 ${
            checked ? "opacity-100" : "opacity-0"
          }`}
        >
          <path
            d="M4 8.5 6.5 11 12 5.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </label>
  );
}

type ExportDropdownProps = {
  onDownloadFiltered: () => void;
  onCopyFiltered: () => void;
  onDownloadBookmarks: () => void;
  disableBookmarks: boolean;
};

function ExportDropdown({
  onDownloadFiltered,
  onCopyFiltered,
  onDownloadBookmarks,
  disableBookmarks,
}: ExportDropdownProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    function handleClick(event: MouseEvent) {
      if (
        wrapperRef.current &&
        event.target instanceof Node &&
        !wrapperRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div ref={wrapperRef} className="relative text-xs">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50 hover:border-neutral-300 transition"
      >
        <Download className="h-4 w-4" aria-hidden="true" />
        <span>Export</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-neutral-200 bg-white shadow-lg shadow-black/5 z-20 overflow-hidden">
          <div className="py-1 text-[11px]">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onDownloadFiltered();
              }}
              className="w-full px-3 py-2 text-left text-neutral-700 hover:bg-neutral-50"
            >
              Download filtered URLs (.txt)
            </button>
            <button
              type="button"
              onClick={async () => {
                setOpen(false);
                await onCopyFiltered();
              }}
              className="w-full px-3 py-2 text-left text-neutral-700 hover:bg-neutral-50"
            >
              Copy filtered URLs
            </button>
            <div className="my-1 h-px bg-neutral-100" />
            <button
              type="button"
              onClick={() => {
                if (disableBookmarks) return;
                setOpen(false);
                onDownloadBookmarks();
              }}
              disabled={disableBookmarks}
              className="w-full px-3 py-2 text-left text-neutral-700 hover:bg-neutral-50 disabled:opacity-40 disabled:hover:bg-white"
            >
              Download bookmarks only (.txt)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function AnalyzePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const base = searchParams.get("base");
  const depthParam = searchParams.get("depth");

  const depth = useMemo(() => {
    const n = parseInt(depthParam || "2", 10);
    return Number.isNaN(n) ? 2 : n;
  }, [depthParam]);

  const [data, setData] = useState<CollectResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!base) return;
    addRecent(base);
  }, [base]);

  useEffect(() => {
    if (typeof document !== "undefined" && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }, []);

  useEffect(() => {
    if (!base) {
      setError("Missing base URL.");
      return;
    }

    let cancelled = false;

    async function runCollect() {
      setLoading(true);
      setError(null);
      const start = performance.now();

      try {
        const res = await fetch("/api/collect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            baseUrl: base,
            base,
            depth,
            max: 5000,
            stripQuery: false,
            allowWwwAlias: true,
            excludePaths: [],
          }),
        });

        const json = (await res.json()) as CollectResponse & {
          error?: { message?: string };
        };

        if (!res.ok) {
          throw new Error(json.error?.message || "Collect failed");
        }

        if (!cancelled) {
          setData(json);
        }
      } catch (err: any) {
        console.error("Analyze collect error:", err);
        if (!cancelled) {
          setError(err?.message || "Collect failed");
        }
      } finally {
        if (cancelled) return;
        const elapsed = performance.now() - start;
        const remaining = 450 - elapsed;
        if (remaining > 0) {
          await new Promise((resolve) => setTimeout(resolve, remaining));
        }
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    runCollect();

    return () => {
      cancelled = true;
    };
  }, [base, depth]);

  const urls = useMemo(
    () => normalizeUrls(data?.result?.urls ?? []),
    [data?.result?.urls]
  );
  const view = useMemo(
    () => getViewFromParams(searchParams),
    [searchParams]
  );

  type DepthFilter = "all" | "0" | "1" | "2" | "3+";
  const [depthFilter, setDepthFilter] = useState<DepthFilter>("all");
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
  const {
    bookmarks: bookmarkedUrls,
    isBookmarked,
    toggleBookmark,
    getAllBookmarks,
    clearAllBookmarks,
  } = useUrlBookmarks();
  const [bookmarkPopUrl, setBookmarkPopUrl] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 50;

  // depth filter
  const depthFilteredUrls = useMemo(
    () =>
      urls.filter((u) => {
        const d = (u as any).depth ?? u.pathDepth ?? 0;
        if (depthFilter === "all") return true;
        if (depthFilter === "3+") return d >= 3;
        const n = parseInt(depthFilter, 10);
        return d === n;
      }),
    [urls, depthFilter]
  );

  // path filter (placeholder – no keyword yet, kept for pipeline clarity)
  const pathFilteredUrls = useMemo(
    () => depthFilteredUrls,
    [depthFilteredUrls]
  );

  // bookmarked-only filter
  const filteredUrls = useMemo(
    () =>
      pathFilteredUrls.filter((u) => {
        if (!showBookmarkedOnly) return true;
        return bookmarkedUrls.includes(u.url.trim());
      }),
    [pathFilteredUrls, showBookmarkedOnly, bookmarkedUrls]
  );

  useEffect(() => {
    setPage(1);
    setSelectedUrls([]);
  }, [depthFilter, showBookmarkedOnly, urls.length]);

  const totalPages = Math.max(1, Math.ceil(filteredUrls.length / pageSize));
  const clampedPage = Math.min(page, totalPages);
  const pagedUrls = useMemo(
    () => {
      const start = (clampedPage - 1) * pageSize;
      return filteredUrls.slice(start, start + pageSize);
    },
    [filteredUrls, clampedPage]
  );

  const bookmarkedCount = useMemo(
    () => bookmarkedUrls.length,
    [bookmarkedUrls]
  );

  const bookmarkableSelectedCount = useMemo(
    () =>
      selectedUrls.filter(
        (url) => !bookmarkedUrls.includes(url.trim())
      ).length,
    [selectedUrls, bookmarkedUrls]
  );

  const bookmarkableFilteredCount = useMemo(
    () =>
      filteredUrls.filter((u) => !bookmarkedUrls.includes(u.url.trim()))
        .length,
    [filteredUrls, bookmarkedUrls]
  );

  const allVisibleSelected = useMemo(
    () =>
      pagedUrls.length > 0 &&
      pagedUrls.every((u) => selectedUrls.includes(u.url)),
    [pagedUrls, selectedUrls]
  );

  const someVisibleSelected = useMemo(
    () =>
      pagedUrls.some((u) => selectedUrls.includes(u.url)) &&
      !allVisibleSelected,
    [pagedUrls, selectedUrls, allVisibleSelected]
  );

  function handleToggleRow(url: string) {
    setSelectedUrls((prev) =>
      prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]
    );
  }

  function handleToggleAllVisible() {
    if (allVisibleSelected) {
      const visibleSet = new Set(pagedUrls.map((u) => u.url));
      setSelectedUrls((prev) => prev.filter((u) => !visibleSet.has(u)));
    } else {
      const visible = pagedUrls.map((u) => u.url);
      setSelectedUrls((prev) => Array.from(new Set([...prev, ...visible])));
    }
  }

  function handleBookmarkSelected() {
    if (bookmarkableSelectedCount === 0) return;

    let added = 0;
    selectedUrls.forEach((url) => {
      const trimmed = url.trim();
      if (!bookmarkedUrls.includes(trimmed)) {
        toggleBookmark(url);
        added += 1;
      }
    });

    if (added > 0) {
      const msg =
        added === 1 ? "Bookmarked 1 URL" : `Bookmarked ${added} URLs`;
      setToastMessage(msg);
      setTimeout(() => {
        setToastMessage((prev) => (prev === msg ? null : prev));
      }, 2000);
    }
  }

  function handleBookmarkAllFiltered() {
    if (bookmarkableFilteredCount === 0) return;

    let added = 0;
    filteredUrls.forEach((u) => {
      const trimmed = u.url.trim();
      if (!bookmarkedUrls.includes(trimmed)) {
        toggleBookmark(u.url);
        added += 1;
      }
    });

    if (added > 0) {
      const msg =
        added === 1 ? "Bookmarked 1 URL" : `Bookmarked ${added} URLs`;
      setToastMessage(msg);
      setTimeout(() => {
        setToastMessage((prev) => (prev === msg ? null : prev));
      }, 2000);
    }
  }

  function handleResetAllBookmarks() {
    if (!bookmarkedUrls.length) return;

    clearAllBookmarks();
    const msg = "Cleared all bookmarks";
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2000);
  }

  function handleExportFilteredDownload() {
    if (!filteredUrls.length) return;
    const lines = filteredUrls.map((u) => u.url);
    downloadTextFile("sitemap-filtered-urls.txt", lines);
    const msg = `Downloaded ${lines.length} filtered URL${
      lines.length === 1 ? "" : "s"
    }`;
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2000);
  }

  async function handleExportFilteredCopy() {
    if (!filteredUrls.length || typeof navigator === "undefined") return;
    const text = filteredUrls.map((u) => u.url).join("\n");
    try {
      await navigator.clipboard.writeText(text);
      const msg = `Copied ${filteredUrls.length} filtered URL${
        filteredUrls.length === 1 ? "" : "s"
      }`;
      setToastMessage(msg);
      setTimeout(() => {
        setToastMessage((prev) => (prev === msg ? null : prev));
      }, 2000);
    } catch {
      // ignore copy errors
    }
  }

  function handleExportBookmarksDownload() {
    if (!bookmarkedUrls.length) return;
    downloadTextFile("sitemap-bookmarked-urls.txt", bookmarkedUrls);
    const msg = `Downloaded ${bookmarkedUrls.length} bookmarked URL${
      bookmarkedUrls.length === 1 ? "" : "s"
    }`;
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2000);
  }

  if (loading) {
    return <LoadingSplash />;
  }

  return (
    <main className="w-full bg-white">
      <div className="mx-auto max-w-[1100px] px-6 py-16 sm:py-20 space-y-10">
        <header className="space-y-3">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            WebScout Analysis
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4">
            <p className="text-sm sm:text-base text-neutral-500 leading-snug sm:flex-1 sm:max-w-[70%] min-w-0">
              {base ? (
                <>
                  Analyzing&nbsp;
                  <span className="font-medium text-[#008CFF]">{base}</span>
                  &nbsp;— link analysis for this domain.
                </>
              ) : (
                "No base URL provided."
              )}
            </p>
            {base && (
              <div className="flex flex-nowrap items-center gap-2 self-start sm:self-auto sm:flex-shrink-0">
                <a
                  href="https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=KR&is_targeted_country=false&media_type=all&q=%EC%A0%9C%ED%85%8C%ED%81%AC&search_type=keyword_unordered&sort_data[direction]=desc&sort_data[mode]=total_impressions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50 hover:border-neutral-300 transition"
                >
                  <span className="h-4 w-4 rounded-full border border-neutral-300 flex items-center justify-center text-[10px] text-neutral-500">
                    M
                  </span>
                  <span>Meta Ads</span>
                </a>
                <ExportDropdown
                  onDownloadFiltered={handleExportFilteredDownload}
                  onCopyFiltered={handleExportFilteredCopy}
                  onDownloadBookmarks={handleExportBookmarksDownload}
                  disableBookmarks={!bookmarkedUrls.length}
                />
              </div>
            )}
          </div>
        </header>

        {loading && (
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-6 text-sm text-neutral-600">
            <p>
              Collecting URLs from the site…
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              This can take 10–30 seconds for larger sites.
            </p>
          </div>
        )}

        {error && !loading && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="flex-1">
                {error === "Collect upstream returned an error"
                  ? "Hmm… we couldn’t reach that site!"
                  : error}
              </p>
              <button
                type="button"
                onClick={() => router.back()}
                className="inline-flex items-center justify-center rounded-full border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 hover:border-red-300 transition"
              >
                Back to previous
              </button>
            </div>
          </div>
        )}

        {!loading && !error && urls.length > 0 && (
          <section className="space-y-6">
            {/* Tabs */}
            <div className="flex flex-wrap items-center gap-3">
              <AnalyzeTabs base={base!} depth={depth} active={view} />
            </div>

            {view === "sitemap" && (
              <>
            {/* Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="rounded-2xl bg-black text-white px-4 py-5 flex flex-col justify-between">
                <div className="text-xs uppercase tracking-wide text-neutral-400">
                  Total URLs
                </div>
                <div className="mt-2 text-3xl font-semibold">{urls.length}</div>
              </div>
              <div className="rounded-2xl bg-white border border-neutral-200 px-4 py-5 flex flex-col justify-between">
                <div className="text-xs uppercase tracking-wide text-neutral-400">
                  Source
                </div>
                <div className="mt-2 text-lg font-medium">
                  {data?.result?.source ?? "Unknown"}
                </div>
              </div>
              <div className="rounded-2xl bg-white border border-neutral-200 px-4 py-5 flex flex-col justify-between">
                <div className="text-xs uppercase tracking-wide text-neutral-400">
                  Depth
                </div>
                <div className="mt-2 text-lg font-medium">{depth}</div>
              </div>
              <div className="rounded-2xl bg-white border border-neutral-200 px-4 py-5 flex flex-col justify-between">
                <div className="text-xs uppercase tracking-wide text-neutral-400">
                  Logs
                </div>
                <div className="mt-2 text-lg font-medium">
                  {data?.logs?.length ?? 0}
                </div>
              </div>
            </div>

            {/* Insights */}
            <InsightsPanel urls={urls} maxDepth={depth} />

            {/* URL table */}
            <div className="rounded-2xl bg-white border border-neutral-200">
              <div className="px-4 pt-3 flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-sm font-semibold text-neutral-800">
                  URL List
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <span className="text-neutral-400">Depth</span>
                  {(["all", "0", "1", "2", "3+"] as const).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setDepthFilter(key)}
                      className={[
                        "rounded-full px-2.5 py-1 border text-[11px] font-medium transition",
                        depthFilter === key
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300",
                      ].join(" ")}
                    >
                      {key === "all" ? "All" : key === "3+" ? "3+" : `Depth ${key}`}
                    </button>
                  ))}
                  <span className="ml-2 h-3 w-px bg-neutral-200" aria-hidden />
                  <button
                    type="button"
                    onClick={() =>
                      setShowBookmarkedOnly((prev) => !prev)
                    }
                    className={[
                      "rounded-full px-2.5 py-1 border text-[11px] font-medium transition",
                      showBookmarkedOnly
                        ? "border-[#008CFF] bg-[#EBF5FF] text-[#008CFF]"
                        : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300",
                    ].join(" ")}
                  >
                    ★ Bookmarked only ({bookmarkedCount})
                  </button>
                </div>
                <span className="ml-auto text-xs text-neutral-400">
                  {filteredUrls.length} items
                </span>
              </div>
              {(bookmarkableFilteredCount > 0 ||
                bookmarkableSelectedCount > 0 ||
                bookmarkedCount > 0) && (
                <div className="px-4 pt-1 pb-2 flex flex-wrap items-center justify-end gap-2 text-[11px] text-neutral-500">
                  {bookmarkableFilteredCount > 0 && (
                    <button
                      type="button"
                      onClick={handleBookmarkAllFiltered}
                      className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 border border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 transition"
                    >
                      <span>★</span>
                      <span>Bookmark all ({bookmarkableFilteredCount})</span>
                    </button>
                  )}
                  {bookmarkableSelectedCount > 0 && (
                    <button
                      type="button"
                      onClick={handleBookmarkSelected}
                      className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 border border-[#008CFF]/70 bg-[#EBF5FF] text-[#008CFF] font-medium transition hover:border-[#008CFF]"
                    >
                      <span>★</span>
                      <span>Bookmark selected ({bookmarkableSelectedCount})</span>
                    </button>
                  )}
                  {bookmarkedCount > 0 && (
                    <button
                      type="button"
                      onClick={handleResetAllBookmarks}
                      className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 border border-neutral-200 bg-white text-neutral-500 hover:border-neutral-300 hover:text-neutral-700 transition"
                    >
                      <span>Reset bookmarks</span>
                    </button>
                  )}
                </div>
              )}
              <div className="mt-2 border-t border-neutral-100 overflow-x-auto">
                {filteredUrls.length === 0 ? (
                  <div className="px-4 py-10 text-sm text-neutral-400 text-center">
                    No URLs match the current filters.
                  </div>
                ) : (
                  <table className="min-w-full text-sm">
                    <thead className="bg-neutral-50 border-b border-neutral-100">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-neutral-500">
                          <UrlCheckbox
                            id="url-select-all"
                            checked={allVisibleSelected}
                            indeterminate={someVisibleSelected}
                            ariaLabel="Select all URLs"
                            onChange={handleToggleAllVisible}
                          />
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500">
                          URL
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-neutral-500">
                          Depth
                        </th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-neutral-500">
                          Query
                        </th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-neutral-500">
                          External
                        </th>
                        <th className="px-3 py-2 text-center text-xs font-medium text-neutral-500">
                          <span className="sr-only">Bookmark</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {pagedUrls.map((u, idx) => (
                        <tr
                          key={u.url + idx}
                          className={
                            idx % 2 === 0
                              ? "bg-white"
                              : "bg-neutral-50/60"
                          }
                        >
                          <td className="px-3 py-2 align-top">
                            <UrlCheckbox
                              id={`url-row-${idx}`}
                              checked={selectedUrls.includes(u.url)}
                              ariaLabel={`Select ${u.url}`}
                              onChange={() => handleToggleRow(u.url)}
                            />
                          </td>
                          <td className="px-4 py-2 align-top">
                            {(() => {
                              const href = safeHref(u.url);
                              const blocked = href === "#";
                              return (
                                <a
                                  href={href}
                                  target={blocked ? undefined : "_blank"}
                                  rel={blocked ? undefined : "noopener noreferrer"}
                                  aria-disabled={blocked}
                                  onClick={(e) => {
                                    if (blocked) e.preventDefault();
                                  }}
                                  className={
                                    "break-all " +
                                    (blocked
                                      ? "text-neutral-400 cursor-not-allowed"
                                      : "text-neutral-900 hover:underline")
                                  }
                                >
                                  {u.url}
                                </a>
                              );
                            })()}
                          </td>
                          <td className="px-4 py-2 text-right text-neutral-700 align-top">
                            {u.pathDepth ?? "-"}
                          </td>
                          <td className="px-4 py-2 text-center align-top">
                            {u.hasQuery ||
                            u.url.includes("?") ||
                            u.url.includes("#")
                              ? "Yes"
                              : "-"}
                          </td>
                          <td className="px-4 py-2 text-center align-top">
                            {u.external ? "Yes" : "-"}
                          </td>
                          <td className="px-3 py-2 align-top text-center">
                            {(() => {
                              const currentlyBookmarked = bookmarkedUrls.includes(
                                u.url.trim()
                              );
                              return (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    const wasBookmarked = isBookmarked(u.url);
                                    toggleBookmark(u.url);
                                    setBookmarkPopUrl(u.url);
                                    setTimeout(() => {
                                      setBookmarkPopUrl((prev) =>
                                        prev === u.url ? null : prev
                                      );
                                    }, 180);
                                    const msg = wasBookmarked
                                      ? "Removed from bookmarks"
                                      : "Bookmarked";
                                    setToastMessage(msg);
                                    setTimeout(() => {
                                      setToastMessage((prev) =>
                                        prev === msg ? null : prev
                                      );
                                    }, 2000);
                                  }}
                                  aria-label={
                                    currentlyBookmarked
                                      ? "Remove URL bookmark"
                                      : "Add URL bookmark"
                                  }
                                  className={
                                    "inline-flex items-center justify-center h-6 w-6 rounded-full hover:bg-neutral-100 transition-transform duration-150 " +
                                    (bookmarkPopUrl === u.url ? "scale-110" : "")
                                  }
                                >
                                  <span
                                    className={
                                      currentlyBookmarked
                                        ? "text-[#008CFF]"
                                        : "text-neutral-300"
                                    }
                                  >
                                    {currentlyBookmarked ? "★" : "☆"}
                                  </span>
                                </button>
                              );
                            })()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {filteredUrls.length > 0 && (
                  <div className="px-4 py-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                    <div>
                      Page {clampedPage} of {totalPages}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={clampedPage === 1}
                        className="rounded-full px-2 py-1 border border-neutral-200 bg-white disabled:opacity-40 hover:bg-neutral-50 transition"
                      >
                        Prev
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={clampedPage === totalPages}
                        className="rounded-full px-2 py-1 border border-neutral-200 bg-white disabled:opacity-40 hover:bg-neutral-50 transition"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
              </>
            )}

            {/* Placeholder panels */}
            {view === "page-types" && base && (
              <PageTypesPanel urls={urls} baseUrl={base} />
            )}
            {view === "figma" && base && (
              <FigmaReadyPanel urls={urls} baseUrl={base} />
            )}
            {view === "importance" && (
              <ImportancePanel urls={urls} />
            )}
          </section>
        )}
      </div>

      {toastMessage && (
        <div className="pointer-events-none fixed inset-x-0 bottom-8 z-40 flex justify-center px-4">
          <div className="pointer-events-auto max-w-md w-full rounded-2xl bg-neutral-900 text-white px-4 py-3 shadow-lg shadow-black/20 flex items-center gap-2 text-xs sm:text-sm">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#008CFF]" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </main>
  );
}

export default function AnalyzePage() {
  return (
    <Suspense
        fallback={
          <main className="w-full bg-white">
            <div className="mx-auto max-w-[1100px] px-6 py-16 sm:py-20">
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-12 text-center text-neutral-500">
                Loading…
              </div>
            </div>
          </main>
        }
      >
        <AnalyzePageContent />
      </Suspense>
  );
}

