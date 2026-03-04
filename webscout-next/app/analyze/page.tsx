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
    internalLinkCount?: number;
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
  type FocusFilter =
    | "none"
    | "hidden"
    | "conversion"
    | "deep"
    | "param"
    | "seo"
    | "ux";

  const [depthFilter, setDepthFilter] = useState<DepthFilter>("all");
  const [focusFilter, setFocusFilter] = useState<FocusFilter>(() => {
    const f = searchParams.get("focus");
    if (
      f === "hidden" ||
      f === "conversion" ||
      f === "deep" ||
      f === "param" ||
      f === "seo" ||
      f === "ux"
    ) {
      return f;
    }
    return "none";
  });
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
  const [showTopIssues, setShowTopIssues] = useState(true);
  const [showConversionSections, setShowConversionSections] = useState(true);
  const [showMarketingSignals, setShowMarketingSignals] = useState(true);

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

  // focus filter driven by insight cards (hidden, conversion, deep, param, seo, ux)
  const pathFilteredUrls = useMemo(
    () =>
      depthFilteredUrls.filter((u) => {
        if (focusFilter === "none") return true;
        const d = (u as any).depth ?? u.pathDepth ?? 0;
        const hasParam =
          u.hasQuery || u.url.includes("?") || u.url.includes("#");
        let path = "";
        try {
          path = new URL(u.url).pathname.toLowerCase();
        } catch {
          // ignore parse errors
        }

        const isConversion =
          path.includes("/pricing") ||
          path.includes("/price") ||
          path.includes("/demo") ||
          path.includes("/contact") ||
          path.includes("/signup") ||
          path.includes("/sign-up") ||
          path.includes("/get-started") ||
          path.includes("/start") ||
          path.includes("/join") ||
          path.includes("/trial");

        const isLanding =
          path === "/" ||
          path === "/home" ||
          path === "/index" ||
          path === "/index.html";

        const isCampaignPath =
          path.includes("/campaign") ||
          path.includes("/lp") ||
          path.includes("/landing") ||
          path.includes("/promo");

        const isCampaignParam =
          u.url.toLowerCase().includes("utm_") ||
          new URL(u.url).searchParams.has("ref") ||
          u.url.toLowerCase().includes("gclid") ||
          u.url.toLowerCase().includes("fbclid");

        const isDocs = path.startsWith("/docs");

        switch (focusFilter) {
          case "deep":
            return d >= 3;
          case "param":
            return hasParam;
          case "hidden": {
            if (isDocs) {
              return d >= 4;
            }
            return d >= 4 || (d >= 3 && (hasParam || isCampaignPath || isConversion));
          }
          case "conversion":
            return isConversion;
          case "seo":
            return isLanding || hasParam || isCampaignPath || isCampaignParam;
          case "ux": {
            if (isDocs && d >= 4) return true;
            return d >= 3 || (d >= 3 && (hasParam || isCampaignPath || isConversion));
          }
          default:
            return true;
        }
      }),
    [depthFilteredUrls, focusFilter]
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
  }, [depthFilter, showBookmarkedOnly, urls.length, focusFilter]);

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

  // Derived insights for sitemap view (URL-structure only, keep lightweight)
  const internalUrls = useMemo(
    () => urls.filter((u) => !u.external),
    [urls]
  );

  const depthProfile = useMemo(() => {
    if (!internalUrls.length) {
      return {
        deepCount: 0,
        deepRatio: 0,
        maxDepth: 0,
      };
    }
    let deepCount = 0;
    let maxDepth = 0;
    internalUrls.forEach((u) => {
      const d = (u as any).depth ?? u.pathDepth ?? 0;
      if (d >= 3) deepCount += 1;
      if (d > maxDepth) maxDepth = d;
    });
    return {
      deepCount,
      deepRatio: deepCount / internalUrls.length,
      maxDepth,
    };
  }, [internalUrls]);

  const paramProfile = useMemo(() => {
    if (!internalUrls.length) {
      return {
        paramCount: 0,
        paramRatio: 0,
      };
    }
    let paramCount = 0;
    internalUrls.forEach((u) => {
      const hasParam =
        u.hasQuery || u.url.includes("?") || u.url.includes("#");
      if (hasParam) paramCount += 1;
    });
    return {
      paramCount,
      paramRatio: paramCount / internalUrls.length,
    };
  }, [internalUrls]);

  const sectionStats = useMemo(() => {
    const map = new Map<
      string,
      { count: number; depthSum: number; paramCount: number }
    >();

    internalUrls.forEach((u) => {
      let section = "root";
      try {
        const parsed = new URL(u.url);
        const parts = parsed.pathname.split("/").filter(Boolean);
        section = parts[0] || "root";
      } catch {
        // ignore parse errors
      }

      const lower = section.toLowerCase();
      if (
        lower === "_next" ||
        lower === "static" ||
        lower === "assets" ||
        lower === "api" ||
        lower === "js" ||
        lower === "css" ||
        lower === "img" ||
        lower === "images" ||
        lower === "fonts" ||
        lower === "font" ||
        lower === "media"
      ) {
        return;
      }

      const existing = map.get(section) || {
        count: 0,
        depthSum: 0,
        paramCount: 0,
      };
      existing.count += 1;
      const d = (u as any).depth ?? u.pathDepth ?? 0;
      existing.depthSum += d;
      const hasParam =
        u.hasQuery || u.url.includes("?") || u.url.includes("#");
      if (hasParam) existing.paramCount += 1;
      map.set(section, existing);
    });

    const stats = Array.from(map.entries()).map(([section, v]) => ({
      section,
      count: v.count,
      avgDepth: v.count ? v.depthSum / v.count : 0,
      paramRatio: v.count ? v.paramCount / v.count : 0,
    }));

    stats.sort((a, b) => b.count - a.count);
    return stats.slice(0, 5);
  }, [internalUrls]);

  const conversionPages = useMemo(() => {
    const seen = new Set<string>();
    const results: string[] = [];

    internalUrls.forEach((u) => {
      try {
        const parsed = new URL(u.url);
        const path = parsed.pathname || "/";
        const lower = path.toLowerCase();
        const isConversion =
          lower.includes("/pricing") ||
          lower.includes("/price") ||
          lower.includes("/demo") ||
          lower.includes("/contact") ||
          lower.includes("/signup") ||
          lower.includes("/sign-up") ||
          lower.includes("/get-started") ||
          lower.includes("/start") ||
          lower.includes("/join") ||
          lower.includes("/trial");

        if (!isConversion) return;
        if (seen.has(path)) return;
        seen.add(path);
        results.push(path || "/");
      } catch {
        // ignore parse errors
      }
    });

    return results.slice(0, 8);
  }, [internalUrls]);

  const contentProofSections = useMemo(() => {
    const found = {
      blog: false,
      caseStudies: false,
      docs: false,
      landing: false,
    };

    internalUrls.forEach((u) => {
      try {
        const path = new URL(u.url).pathname.toLowerCase();
        if (path.includes("/blog")) found.blog = true;
        if (
          path.includes("/case-studies") ||
          path.includes("/customers") ||
          path.includes("/stories")
        ) {
          found.caseStudies = true;
        }
        if (
          path.includes("/docs") ||
          path.includes("/documentation") ||
          path.includes("/help") ||
          path.includes("/developers")
        ) {
          found.docs = true;
        }
        if (
          path.includes("/lp") ||
          path.includes("/landing") ||
          path.includes("/campaign")
        ) {
          found.landing = true;
        }
      } catch {
        // ignore parse errors
      }
    });

    const labels: string[] = [];
    if (found.blog) labels.push("Blog");
    if (found.caseStudies) labels.push("Case studies");
    if (found.docs) labels.push("Docs");
    if (found.landing) labels.push("Landing pages");
    return labels;
  }, [internalUrls]);

  const campaignLandingPaths = useMemo(() => {
    const seen = new Set<string>();
    const results: string[] = [];

    internalUrls.forEach((u) => {
      try {
        const parsed = new URL(u.url);
        const path = parsed.pathname || "/";
        const search = parsed.search.toLowerCase();

        const hasUtm = search.includes("utm_");
        const hasRef = parsed.searchParams.has("ref");
        const hasClickId =
          search.includes("gclid") || search.includes("fbclid");
        const campaignPath =
          path.includes("/campaign") ||
          path.includes("/lp") ||
          path.includes("/landing") ||
          path.includes("/promo");

        if (!(hasUtm || hasRef || hasClickId || campaignPath)) return;

        const key = path || "/";
        if (seen.has(key)) return;
        seen.add(key);
        results.push(key);
      } catch {
        // ignore parse errors
      }
    });

    return results.slice(0, 10);
  }, [internalUrls]);

  const hiddenStats = useMemo(() => {
    if (!internalUrls.length) {
      return { hiddenNonDocs: 0, docsDeep: 0 };
    }

    let hiddenNonDocs = 0;
    let docsDeep = 0;

    internalUrls.forEach((u) => {
      const d = (u as any).depth ?? u.pathDepth ?? 0;
      const hasParam =
        u.hasQuery || u.url.includes("?") || u.url.includes("#");
      let path = "";
      try {
        path = new URL(u.url).pathname.toLowerCase();
      } catch {
        // ignore parse errors
      }

      const isDocs = path.startsWith("/docs");
      const isLandingLike =
        path.includes("/lp") ||
        path.includes("/campaign") ||
        path.includes("/promo");
      const isConversion =
        path.includes("/pricing") ||
        path.includes("/price") ||
        path.includes("/demo") ||
        path.includes("/contact") ||
        path.includes("/signup") ||
        path.includes("/sign-up") ||
        path.includes("/get-started") ||
        path.includes("/start") ||
        path.includes("/join") ||
        path.includes("/trial");

      if (isDocs) {
        if (d >= 4) {
          docsDeep += 1;
        }
        return;
      }

      const isHidden =
        d >= 4 || (d >= 3 && (hasParam || isLandingLike || isConversion));

      if (isHidden) {
        hiddenNonDocs += 1;
      }
    });

    return { hiddenNonDocs, docsDeep };
  }, [internalUrls]);

  const navigationDepthInsight = useMemo(() => {
    if (!internalUrls.length) return "No internal URLs to analyze.";
    const deepPct = Math.round(depthProfile.deepRatio * 100);
    const max = depthProfile.maxDepth;
    if (deepPct <= 20 && max <= 3) {
      return "Most pages are within 2–3 clicks from the homepage.";
    }
    if (deepPct <= 40 && max <= 4) {
      return "Structure is moderately deep; some pages may be 3–4 clicks from the homepage.";
    }
    return "Many pages may be more than 3 clicks from the homepage; navigation can feel complex.";
  }, [internalUrls.length, depthProfile.deepRatio, depthProfile.maxDepth]);

  const sitemapInsights = useMemo(
    () => ({
      hiddenPagesNonDocs: hiddenStats.hiddenNonDocs,
      docsDeepPages: hiddenStats.docsDeep,
      conversionPages,
      sections: sectionStats,
      depthProfile,
      navigationDepthInsight,
      internalCount: internalUrls.length,
    }),
    [
      hiddenStats,
      conversionPages,
      sectionStats,
      depthProfile,
      navigationDepthInsight,
      internalUrls.length,
    ]
  );

  const siteSummary = useMemo(() => {
    if (!internalUrls.length) {
      return {
        internalCount: 0,
        minDepth: 0,
        maxDepth: 0,
        paramPercent: 0,
        hiddenCount: 0,
      };
    }
    let minDepth = Infinity;
    let maxDepth = 0;
    internalUrls.forEach((u) => {
      const d = (u as any).depth ?? u.pathDepth ?? 0;
      if (d < minDepth) minDepth = d;
      if (d > maxDepth) maxDepth = d;
    });
    if (!Number.isFinite(minDepth)) minDepth = 0;
    return {
      internalCount: internalUrls.length,
      minDepth,
      maxDepth,
      paramPercent: Math.round(paramProfile.paramRatio * 100),
      hiddenCount: hiddenStats.hiddenNonDocs + hiddenStats.docsDeep,
    };
  }, [internalUrls, paramProfile.paramRatio, hiddenStats]);

  const actionInsights = useMemo(() => {
    const suggestions: string[] = [];

    if (!sitemapInsights.internalCount) {
      return ["No internal URLs to analyze yet."];
    }

    // Depth / navigation
    const deepPct = Math.round(sitemapInsights.depthProfile.deepRatio * 100);
    if (deepPct >= 30 || sitemapInsights.depthProfile.maxDepth >= 4) {
      suggestions.push(
        "Some important pages may be buried too deep. Consider surfacing key pages in the main navigation."
      );
    }

    // Hidden pages
    if (
      sitemapInsights.hiddenPagesNonDocs > 0 ||
      sitemapInsights.docsDeepPages > 0
    ) {
      suggestions.push(
        "Hidden or hard-to-reach pages were detected. Review whether any of them should be more visible."
      );
    }

    // Parameter URLs
    const paramPct = Math.round(paramProfile.paramRatio * 100);
    if (paramPct >= 25) {
      suggestions.push(
        "A high number of parameterized URLs may affect SEO and reporting clarity. Consider consolidating or canonicals."
      );
    }

    // Conversion pages that are deep
    if (sitemapInsights.conversionPages.length > 0) {
      let deepConversionCount = 0;
      internalUrls.forEach((u) => {
        try {
          const path = new URL(u.url).pathname || "/";
          if (!sitemapInsights.conversionPages.includes(path)) return;
          const d = (u as any).depth ?? u.pathDepth ?? 0;
          if (d >= 3) deepConversionCount += 1;
        } catch {
          // ignore
        }
      });

      if (deepConversionCount > 0) {
        suggestions.push(
          "Conversion pages like pricing or demo appear deeper in the structure. Consider linking them directly from the homepage or header."
        );
      }
    }

    if (!suggestions.length) {
      return ["Structure looks compact and clean based on URL depth and parameters."];
    }

    return suggestions.slice(0, 3);
  }, [sitemapInsights, paramProfile, internalUrls]);

  const topIssues = useMemo(() => {
    const issues: string[] = [];
    const deepCount = depthProfile.deepCount;
    const hiddenTotal = hiddenStats.hiddenNonDocs + hiddenStats.docsDeep;
    if (deepCount > 0) {
      issues.push(
        `${deepCount} page${deepCount > 1 ? "s" : ""} are deeper than recommended (3+ clicks).`
      );
    }
    if (hiddenTotal > 0) {
      issues.push(
        `${hiddenTotal} page${hiddenTotal > 1 ? "s" : ""} look hidden or hard to reach.`
      );
    }
    if (campaignLandingPaths.length === 0) {
      issues.push("No campaign landing pages detected.");
    } else {
      issues.push(
        `${campaignLandingPaths.length} campaign landing page${campaignLandingPaths.length > 1 ? "s" : ""} detected.`
      );
    }
    return issues.slice(0, 3);
  }, [depthProfile.deepCount, hiddenStats, campaignLandingPaths.length]);

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

  function updateFocusInUrl(next: FocusFilter, scroll: boolean) {
    const params = new URLSearchParams(searchParams.toString());
    if (next === "none") {
      params.delete("focus");
    } else {
      params.set("focus", next);
    }
    const qs = params.toString();
    const url = qs ? `/analyze?${qs}` : "/analyze";
    router.replace(url, { scroll });
  }

  function applyFocusFilter(next: FocusFilter, scrollToTable: boolean = true) {
    setFocusFilter(next);
    if (next === "deep") {
      setDepthFilter("3+");
    }
    if (next !== "deep") {
      setDepthFilter("all");
    }
    setShowBookmarkedOnly(false);
    setPage(1);
    setSelectedUrls([]);
    updateFocusInUrl(next, false);
    // Scroll to table only when explicitly requested
    if (scrollToTable && typeof document !== "undefined") {
      const el = document.getElementById("sitemap-table");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }

  function handleClearAllFilters() {
    setFocusFilter("none");
    setDepthFilter("all");
    setShowBookmarkedOnly(false);
    setPage(1);
    setSelectedUrls([]);
    updateFocusInUrl("none", false);
  }

  function handleResetFiltersAndScroll() {
    setFocusFilter("none");
    setDepthFilter("all");
    setShowBookmarkedOnly(false);
    setPage(1);
    setSelectedUrls([]);
    updateFocusInUrl("none", false);
    if (typeof document !== "undefined") {
      const el = document.getElementById("sitemap-table");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }

  function handleExportIABrief() {
    if (!urls.length) return;
    const lines: string[] = [];

    lines.push(`# WebScout IA brief`);
    if (base) {
      lines.push(`Target: ${base}`);
    }
    lines.push("");

    lines.push("## Overview");
    lines.push(`- Total URLs (all): ${urls.length}`);
    lines.push(`- Internal URLs: ${internalUrls.length}`);
    lines.push(
      `- Max depth (internal): ${depthProfile.maxDepth}`
    );
    lines.push(
      `- Deep pages (depth ≥ 3): ${depthProfile.deepCount} (${Math.round(
        depthProfile.deepRatio * 100
      )}%)`
    );
    lines.push(
      `- Parameter URLs (internal): ${paramProfile.paramCount} (${Math.round(
        paramProfile.paramRatio * 100
      )}%)`
    );
    lines.push("");

    if (sectionStats.length) {
      lines.push("## Sections by path (top clusters)");
      sectionStats.forEach((s) => {
        lines.push(
          `- /${s.section === "root" ? "" : s.section} — ${s.count} pages, avg depth ~${s.avgDepth.toFixed(
            1
          )}, params ~${Math.round(s.paramRatio * 100)}%`
        );
      });
      lines.push("");
    }

    if (conversionPages.length) {
      lines.push("## Possible conversion pages");
      conversionPages.forEach((p) => {
        lines.push(`- ${p}`);
      });
      lines.push("");
    }

    if (contentProofSections.length) {
      lines.push("## Content & proof surface");
      contentProofSections.forEach((label) => {
        lines.push(`- ${label}`);
      });
      lines.push("");
    }

    if (campaignLandingPaths.length) {
      lines.push("## Campaign / UTM landings (by URL structure)");
      campaignLandingPaths.forEach((p) => {
        lines.push(`- ${p}`);
      });
      lines.push("");
    }

    downloadTextFile("webscout-ia-brief.md", lines);
    const msg = "Downloaded IA brief (.md)";
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2000);
  }

  function handleExportIASkeleton() {
    if (!internalUrls.length) return;

    const sorted = [...internalUrls].sort((a, b) => {
      const da = (a as any).depth ?? a.pathDepth ?? 0;
      const db = (b as any).depth ?? b.pathDepth ?? 0;
      if (da !== db) return da - db;
      return a.url.localeCompare(b.url);
    });

    const lines: string[] = [];
    lines.push("# IA skeleton (depth-based, internal URLs only)");
    if (base) {
      lines.push(`Base: ${base}`);
    }
    lines.push("");

    sorted.forEach((u) => {
      const d = (u as any).depth ?? u.pathDepth ?? 0;
      const indent = "  ".repeat(Math.max(0, Math.min(d, 6)));
      try {
        const path = new URL(u.url).pathname || "/";
        lines.push(`${indent}- ${path}`);
      } catch {
        lines.push(`${indent}- ${u.url}`);
      }
    });

    downloadTextFile("webscout-ia-skeleton.txt", lines);
    const msg = "Downloaded IA skeleton (.txt)";
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2000);
  }

  function buildMarkdownReport(): string {
    if (!urls.length) {
      return "# WebScout competitor audit\n\nNo URLs available.";
    }

    const lines: string[] = [];
    lines.push("# WebScout competitor audit");
    if (base) {
      lines.push(`Target: ${base}`);
    }
    lines.push("");

    // Site summary
    let minDepth = Infinity;
    let maxDepth = 0;
    internalUrls.forEach((u) => {
      const d = (u as any).depth ?? u.pathDepth ?? 0;
      if (d < minDepth) minDepth = d;
      if (d > maxDepth) maxDepth = d;
    });
    if (!Number.isFinite(minDepth)) minDepth = 0;

    lines.push("## Site summary");
    lines.push(`- Total URLs (all): ${urls.length}`);
    lines.push(`- Internal URLs: ${internalUrls.length}`);
    lines.push(`- Depth range (internal): ${minDepth}–${maxDepth}`);
    lines.push(
      `- Parameter URLs (internal): ${paramProfile.paramCount} (${Math.round(
        paramProfile.paramRatio * 100
      )}%)`
    );
    lines.push("");

    // Key findings (from action insights)
    lines.push("## Key findings");
    if (actionInsights.length === 0) {
      lines.push("- No structural issues detected based on current rules.");
    } else {
      actionInsights.slice(0, 3).forEach((msg) => {
        lines.push(`- ${msg}`);
      });
    }
    lines.push("");

    // Hidden pages
    lines.push("## Hidden pages");
    lines.push(
      `- Hidden pages (non-docs): ${hiddenStats.hiddenNonDocs}`
    );
    lines.push(
      `- Docs deep pages (depth ≥ 4 under /docs): ${hiddenStats.docsDeep}`
    );

    const hiddenExamples: string[] = [];
    internalUrls.forEach((u) => {
      if (hiddenExamples.length >= 10) return;
      const d = (u as any).depth ?? u.pathDepth ?? 0;
      const hasParam =
        u.hasQuery || u.url.includes("?") || u.url.includes("#");
      let path = "";
      try {
        path = new URL(u.url).pathname || "/";
      } catch {
        path = u.url;
      }
      const lower = path.toLowerCase();
      const isDocs = lower.startsWith("/docs");
      const isLandingLike =
        lower.includes("/lp") ||
        lower.includes("/campaign") ||
        lower.includes("/promo");
      const isConversion =
        lower.includes("/pricing") ||
        lower.includes("/price") ||
        lower.includes("/demo") ||
        lower.includes("/contact") ||
        lower.includes("/signup") ||
        lower.includes("/sign-up") ||
        lower.includes("/get-started") ||
        lower.includes("/start") ||
        lower.includes("/join") ||
        lower.includes("/trial");

      if (isDocs) {
        if (d >= 4) {
          hiddenExamples.push(path);
        }
        return;
      }

      const isHidden =
        d >= 4 || (d >= 3 && (hasParam || isLandingLike || isConversion));

      if (isHidden) {
        hiddenExamples.push(path);
      }
    });

    if (hiddenExamples.length) {
      lines.push("");
      hiddenExamples.forEach((p) => {
        lines.push(`- ${p}`);
      });
    } else {
      lines.push("");
      lines.push("- No hidden pages detected based on depth and URL patterns.");
    }
    lines.push("");

    // Conversion pages
    lines.push("## Conversion pages (by URL pattern)");
    if (conversionPages.length) {
      conversionPages.forEach((p) => {
        lines.push(`- ${p}`);
      });
    } else {
      lines.push("- No possible conversion pages detected.");
    }
    lines.push("");

    // Content sections
    lines.push("## Content sections (top-level paths)");
    if (sectionStats.length) {
      sectionStats.forEach((s) => {
        lines.push(
          `- /${s.section === "root" ? "" : s.section} — ${s.count} pages, avg depth ~${s.avgDepth.toFixed(
            1
          )}, params ~${Math.round(s.paramRatio * 100)}%`
        );
      });
    } else {
      lines.push("- No internal sections to summarize.");
    }
    lines.push("");

    // Notes
    lines.push("## Notes");
    lines.push(
      "- This report is generated from URL patterns and depth only."
    );
    lines.push(
      "- No additional crawling, content parsing, or LLM analysis was used."
    );

    return lines.join("\n");
  }

  async function handleCopyMarkdownReport() {
    if (!urls.length || typeof navigator === "undefined") return;
    const text = buildMarkdownReport();
    try {
      await navigator.clipboard.writeText(text);
      const msg = "Copied competitor audit report (.md) to clipboard";
      setToastMessage(msg);
      setTimeout(() => {
        setToastMessage((prev) => (prev === msg ? null : prev));
      }, 2000);
    } catch {
      // ignore copy errors
    }
  }

  function handleDownloadMarkdownReport() {
    if (!urls.length) return;
    const text = buildMarkdownReport();
    const lines = text.split("\n");
    downloadTextFile("webscout-competitor-report.md", lines);
    const msg = "Downloaded competitor audit report (.md)";
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

        {!loading && !error && urls.length === 0 && base && (
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-8 text-sm text-neutral-600 text-center">
            <p>No URLs were collected for this domain.</p>
            <p className="mt-1 text-xs text-neutral-500">
              The site may be blocking crawlers, very slow to respond, or returning an unsupported format.
            </p>
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
            {/* 1. Site summary */}
            <section className="rounded-2xl bg-black text-white px-4 py-5 sm:px-5 sm:py-6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <div>
                    <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-300">
                      Site summary
                    </h2>
                    <p className="mt-1 text-sm font-medium">
                      Quick snapshot of this site&apos;s structure.
                    </p>
                  </div>
                  <p className="text-[11px] text-neutral-200 sm:text-right">
                    {navigationDepthInsight}
                  </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-neutral-50">
                  <div>
                    <div className="text-[11px] uppercase tracking-wide text-neutral-400">
                      Internal pages
                    </div>
                    <div className="mt-1 text-3xl sm:text-4xl font-semibold">
                      {siteSummary.internalCount}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wide text-neutral-400">
                      Depth range
                    </div>
                    <div className="mt-1 text-xl sm:text-2xl font-semibold">
                      {siteSummary.minDepth}–{siteSummary.maxDepth}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wide text-neutral-400">
                      Parameter URLs
                    </div>
                    <div className="mt-1 text-xl sm:text-2xl font-semibold">
                      {siteSummary.paramPercent}%
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wide text-neutral-400">
                      Hidden pages
                    </div>
                    <div className="mt-1 text-xl sm:text-2xl font-semibold">
                      {siteSummary.hiddenCount}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 2. Top issues / structure overview */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-900">
                  Top issues
                </h2>
                <button
                  type="button"
                  onClick={() => setShowTopIssues((prev) => !prev)}
                  className={[
                    "text-[11px] font-medium transition",
                    showTopIssues
                      ? "text-[#008CFF] hover:text-[#006ad1]"
                      : "text-neutral-900 hover:text-neutral-700",
                  ].join(" ")}
                >
                  {showTopIssues ? "Hide" : "Show"}
                </button>
              </div>
              {showTopIssues && (
              <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-4 text-xs text-neutral-600">
                  {topIssues.length === 0 ? (
                    <p className="text-neutral-400">
                      No major structural issues detected from depth and URL patterns.
                    </p>
                  ) : (
                    <ul className="list-disc pl-4 space-y-1">
                      {topIssues.map((msg, idx) => (
                        <li key={idx}>{msg}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </section>

            {/* 3. Conversion & sections */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-900">
                  Conversion & sections
                </h2>
                <button
                  type="button"
                  onClick={() => setShowConversionSections((prev) => !prev)}
                  className={[
                    "text-[11px] font-medium transition",
                    showConversionSections
                      ? "text-[#008CFF] hover:text-[#006ad1]"
                      : "text-neutral-900 hover:text-neutral-700",
                  ].join(" ")}
                >
                  {showConversionSections ? "Hide" : "Show"}
                </button>
              </div>
              {showConversionSections && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Conversion pages */}
                {(() => {
                  const hasConversion = conversionPages.length > 0;
                  const baseClasses =
                    "rounded-2xl border border-neutral-200 bg-white px-4 py-4 flex flex-col justify-between transition";
                  const interactiveClasses = hasConversion
                    ? " cursor-pointer hover:bg-neutral-50/60"
                    : " opacity-70";
                  return (
                <div
                  className={baseClasses + interactiveClasses}
                  onClick={
                    hasConversion
                      ? () => applyFocusFilter("conversion", false)
                      : undefined
                  }
                >
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-900">
                      Conversion pages detected
                    </h3>
                    <p className="mt-1 text-[11px] text-neutral-500">
                      URLs that look like pricing, demo, or signup pages.
                    </p>
                  </div>
                  <div className="mt-3 text-xs text-neutral-600">
                    {!hasConversion ? (
                      <p className="text-neutral-400">
                        No conversion pages detected.
                      </p>
                    ) : (
                      <>
                        <p className="mb-1 text-[11px] text-neutral-500">
                          {conversionPages.length} page
                          {conversionPages.length > 1 ? "s" : ""} detected.
                        </p>
                        <ul className="space-y-0.5">
                          {conversionPages.slice(0, 3).map((p) => {
                            let label = p;
                            try {
                              label = new URL(p).pathname || p;
                            } catch {
                              // ignore parse errors
                            }
                            return (
                              <li key={p} className="font-medium">
                                {label}
                              </li>
                            );
                          })}
                          {conversionPages.length > 3 && (
                            <li className="text-[11px] text-neutral-500">
                              + {conversionPages.length - 3} more
                            </li>
                          )}
                        </ul>
                      </>
                    )}
                  </div>
                </div>
                  );
                })()}

                {/* Navigation depth */}
                {(() => {
                  const hasDepthIssue =
                    depthProfile.deepCount > 0 ||
                    sitemapInsights.hiddenPagesNonDocs +
                      sitemapInsights.docsDeepPages >
                      0;
                  const baseClasses =
                    "rounded-2xl border border-neutral-200 bg-white px-4 py-4 flex flex-col justify-between transition";
                  const interactiveClasses = hasDepthIssue
                    ? " cursor-pointer hover:bg-neutral-50/60"
                    : " opacity-70";
                  return (
                <div
                  className={baseClasses + interactiveClasses}
                  onClick={
                    hasDepthIssue
                      ? () => applyFocusFilter("deep", false)
                      : undefined
                  }
                >
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-900">
                      Navigation depth
                    </h3>
                    <p className="mt-1 text-[11px] text-neutral-900">
                      How many clicks pages are from the homepage.
                    </p>
                  </div>
                  <div className="mt-3 text-xs text-neutral-900 space-y-0.5">
                    <p>
                      <span className="font-semibold">
                        {depthProfile.deepCount}
                      </span>{" "}
                      pages appear 3+ clicks away.
                    </p>
                    <p>
                      <span className="font-semibold">
                        {sitemapInsights.hiddenPagesNonDocs +
                          sitemapInsights.docsDeepPages}
                      </span>{" "}
                      pages look hidden or hard to reach.
                    </p>
                    <p>
                      {navigationDepthInsight}
                    </p>
                  </div>
                </div>
                  );
                })()}

                {/* Sections by path */}
                {(() => {
                  const hasSections = sectionStats.length > 0;
                  const baseClasses =
                    "rounded-2xl border border-neutral-200 bg-white px-4 py-4 flex flex-col justify-between transition";
                  const interactiveClasses = hasSections
                    ? " cursor-pointer hover:bg-neutral-50/60"
                    : " opacity-70";
                  return (
                <div
                  className={baseClasses + interactiveClasses}
                  onClick={
                    hasSections
                      ? () => applyFocusFilter("param", false)
                      : undefined
                  }
                >
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-900">
                      Sections by path
                    </h3>
                    <p className="mt-1 text-[11px] text-neutral-500">
                      Top sections by number of pages and depth.
                    </p>
                  </div>
                  <div className="mt-3 text-xs text-neutral-600">
                    {!hasSections ? (
                      <p className="text-neutral-400">
                        No internal URLs to summarize.
                      </p>
                    ) : (
                      <>
                        <ul className="space-y-0.5">
                          {sectionStats.slice(0, 4).map((s) => {
                            const label =
                              s.section === "root" ? "/" : `/${s.section}`;
                            const roundedDepth = Math.round(s.avgDepth || 0);
                            const paramPct = Math.round(s.paramRatio * 100);
                            return (
                              <li key={s.section}>
                                <span className="font-medium">{label}</span>
                                <span>
                                  {" "}
                                  — {s.count} pages • depth {roundedDepth} •
                                  params {paramPct}%
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                        {sectionStats.length > 4 && (
                          <p className="mt-1 text-[11px] text-neutral-500">
                            + {sectionStats.length - 4} more sections
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>
                  );
                })()}
              </div>
              )}
            </section>

            {/* 4. Marketing signals */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-900">
                  Marketing signals
                </h2>
                <button
                  type="button"
                  onClick={() => setShowMarketingSignals((prev) => !prev)}
                  className={[
                    "text-[11px] font-medium transition",
                    showMarketingSignals
                      ? "text-[#008CFF] hover:text-[#006ad1]"
                      : "text-neutral-900 hover:text-neutral-700",
                  ].join(" ")}
                >
                  {showMarketingSignals ? "Hide" : "Show"}
                </button>
              </div>
              {showMarketingSignals && (
                <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-4 text-xs text-neutral-600 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-900">
                      Campaign signals
                    </h3>
                    <p className="mt-1 text-[11px] text-neutral-500">
                      Campaign or tracked landing URLs detected from structure.
                    </p>
                  </div>
                  <div className="text-right text-sm font-semibold text-neutral-600">
                    {campaignLandingPaths.length}
                    <span className="ml-1 text-[11px] font-normal text-neutral-500">
                      page{campaignLandingPaths.length === 1 ? "" : "s"}
                    </span>
                  </div>
                </div>
              )}
            </section>

            {/* 5. Structure insights */}
            <section className="rounded-2xl border border-neutral-200 bg-white px-4 py-4 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-900">
                    Structure insights
                  </h3>
                  <p className="mt-1 text-[11px] text-neutral-500">
                    Plain-language observations based on URL depth and
                    parameters.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-neutral-500">
                  <button
                    type="button"
                    onClick={handleCopyMarkdownReport}
                    className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-white px-2.5 py-1 hover:border-neutral-300 hover:bg-neutral-50 transition"
                  >
                    <span>⧉</span>
                    <span>Copy report</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadMarkdownReport}
                    className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-white px-2.5 py-1 hover:border-neutral-300 hover:bg-neutral-50 transition"
                  >
                    <span>⬇</span>
                    <span>Export Markdown</span>
                  </button>
                </div>
              </div>
              <ul className="mt-3 space-y-1.5 text-xs text-neutral-600">
                {actionInsights.map((msg, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-[#008CFF]" />
                    <span>{msg}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* URL table */}
            <div
              id="sitemap-table"
              className="rounded-2xl bg-white border border-neutral-200"
            >
              <div className="px-4 pt-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <h2 className="text-sm font-semibold text-neutral-800">
                    URL List
                  </h2>
                  <div className="hidden sm:flex items-center gap-2 text-[11px] text-neutral-500">
                    <button
                      type="button"
                      onClick={handleExportIABrief}
                      className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-white px-2.5 py-1 hover:border-neutral-300 hover:bg-neutral-50 transition"
                    >
                      <span>⬇</span>
                      <span>IA brief (.md)</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleExportIASkeleton}
                      className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-white px-2.5 py-1 hover:border-neutral-300 hover:bg-neutral-50 transition"
                    >
                      <span>⬇</span>
                      <span>IA skeleton (.txt)</span>
                    </button>
                  </div>
                </div>
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
              {(focusFilter !== "none" ||
                depthFilter !== "all" ||
                showBookmarkedOnly) && (
                <div className="px-4 pt-1 pb-1 flex flex-wrap items-center gap-2 text-[11px] text-neutral-600">
                  <span className="text-neutral-400">Active filters:</span>
                  {focusFilter !== "none" && (
                    <span className="rounded-full bg-neutral-100 px-2 py-0.5">
                      {focusFilter === "hidden"
                        ? "Hidden pages"
                        : focusFilter === "conversion"
                        ? "Conversion pages"
                        : focusFilter === "deep"
                        ? "Depth ≥ 3"
                        : "Parameter URLs"}
                    </span>
                  )}
                  {depthFilter !== "all" && (
                    <span className="rounded-full bg-neutral-100 px-2 py-0.5">
                      {depthFilter === "3+" ? "Depth ≥ 3" : `Depth ${depthFilter}`}
                    </span>
                  )}
                  {showBookmarkedOnly && (
                    <span className="rounded-full bg-neutral-100 px-2 py-0.5">
                      Bookmarked only
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={handleClearAllFilters}
                    className="ml-auto inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-white px-2.5 py-0.5 hover:border-neutral-300 hover:bg-neutral-50 transition"
                  >
                    <span>Clear filters</span>
                  </button>
                </div>
              )}
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
                  <table className="min-w-full text-xs sm:text-sm">
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
                        <th className="px-4 py-2 text-right text-xs font-medium text-neutral-500">
                          In-links
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
                                    "block max-w-[220px] truncate sm:max-w-none sm:whitespace-normal " +
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
                          <td className="px-4 py-2 text-right text-neutral-700 align-top">
                            {typeof u.internalLinkCount === "number"
                              ? u.internalLinkCount
                              : "-"}
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

