"use client";

import { useState } from "react";
import { safeHref } from "@/lib/safeHref";

type CollectUrl = {
  url: string;
  pathDepth?: number;
  hasQuery?: boolean;
  external?: boolean;
};

type InsightsPanelProps = {
  urls: CollectUrl[];
  maxDepth: number;
  /** If provided from API, use it; else compute */
  insightScore?: number | null;
  breakdown?: { seo?: number; ux?: number; structure?: number } | null;
  priorityFixes?: { page: string; reason: string }[] | null;
  onResetFilters?: () => void;
  onApplySeoFilter?: () => void;
  onApplyUxFilter?: () => void;
};

const KEY_PAGE_PATTERNS = [
  /\/pricing/i,
  /\/features|\/product/i,
  /\/solutions/i,
  /\/blog/i,
  /\/docs/i,
  /\/about/i,
  /\/contact/i,
  /\/careers/i,
];

function computeInsightScore(urls: CollectUrl[], maxDepth: number): number {
  if (urls.length === 0) return 0;
  const internalUrls = urls.filter((u) => !u.external);
  const keyPageCount = internalUrls.filter((u) =>
    KEY_PAGE_PATTERNS.some((p) => p.test(u.url))
  ).length;
  const keyPageScore = Math.min(1, keyPageCount / 4) * 40; // up to 40 pts

  const shallow = internalUrls.filter(
    (u) => (u.pathDepth ?? 99) <= 2 && !u.hasQuery
  ).length;
  const shallowRatio = internalUrls.length > 0 ? shallow / internalUrls.length : 0;
  const depthScore = Math.round(shallowRatio * 60); // up to 60 pts

  return Math.min(100, Math.round(keyPageScore + depthScore));
}

function computeSeoScore(urls: CollectUrl[]): number {
  const internal = urls.filter((u) => !u.external);
  if (internal.length === 0) return 0;

  const hasParam = (u: CollectUrl) =>
    u.hasQuery || u.url.includes("?") || u.url.includes("#");

  const cleanUrls = internal.filter((u) => !hasParam(u));
  const cleanRatio = cleanUrls.length / internal.length;

  const shallow = internal.filter((u) => (u.pathDepth ?? 99) <= 2).length;
  const shallowRatio = shallow / internal.length;

  const score = cleanRatio * 50 + shallowRatio * 50;
  return Math.max(0, Math.min(100, Math.round(score)));
}

function computeUxStructureScore(urls: CollectUrl[]): number {
  const internal = urls.filter((u) => !u.external);
  if (internal.length === 0) return 0;

  const inIdealDepth = internal.filter((u) => {
    const d = u.pathDepth ?? 0;
    return d >= 1 && d <= 3;
  }).length;

  const tooDeep = internal.filter((u) => (u.pathDepth ?? 0) >= 4).length;

  const idealRatio = inIdealDepth / internal.length;
  const deepRatio = tooDeep / internal.length;

  const depthComponent = idealRatio * 80 - deepRatio * 30;

  const keyPageCount = internal.filter((u) =>
    KEY_PAGE_PATTERNS.some((p) => p.test(u.url))
  ).length;
  const keyPageBonus = Math.min(1, keyPageCount / 4) * 20;

  const score = depthComponent + keyPageBonus;
  return Math.max(0, Math.min(100, Math.round(score)));
}

function computePriorityFixes(urls: CollectUrl[]): { page: string; reason: string }[] {
  const internal = urls.filter((u) => !u.external);
  if (internal.length === 0) return [];

  const fixes: { page: string; reason: string }[] = [];

  const deepest = [...internal]
    .sort((a, b) => (b.pathDepth ?? 0) - (a.pathDepth ?? 0))
    .slice(0, 2);
  for (const u of deepest) {
    if ((u.pathDepth ?? 0) >= 4) {
      fixes.push({
        page: u.url,
        reason: `Deep path (depth ${u.pathDepth})`,
      });
    }
  }

  const withQuery = internal.filter((u) => u.hasQuery).slice(0, 2);
  for (const u of withQuery) {
    fixes.push({
      page: u.url,
      reason: "Parameterized URL — consider canonical",
    });
  }

  const assets = internal.filter(
    (u) =>
      /\.(js|css|png|jpg|jpeg|gif|svg|woff|ico)(\?|$)/i.test(u.url) ||
      /\/assets\/|\/static\//i.test(u.url)
  ).slice(0, 2);
  for (const u of assets) {
    fixes.push({
      page: u.url,
      reason: "Asset in crawl — review inclusion",
    });
  }

  return fixes.slice(0, 5);
}

export default function InsightsPanel({
  urls,
  maxDepth,
  insightScore,
  breakdown,
  priorityFixes,
  onResetFilters,
  onApplySeoFilter,
  onApplyUxFilter,
}: InsightsPanelProps) {
  const [showTips, setShowTips] = useState(false);
  const score = insightScore ?? computeInsightScore(urls, maxDepth);
  const fixes =
    priorityFixes && priorityFixes.length > 0
      ? priorityFixes
      : computePriorityFixes(urls);

  const seoScore = breakdown?.seo ?? computeSeoScore(urls);
  const uxStructureScore =
    breakdown?.ux ?? breakdown?.structure ?? computeUxStructureScore(urls);

  return (
    <section className="space-y-4 sm:space-y-6">
      <h2 className="flex items-center justify-between gap-3 text-lg font-semibold text-neutral-800">
        <span>Insights</span>
        <button
          type="button"
          onClick={() => setShowTips((prev) => !prev)}
          className="hidden sm:inline-flex items-center rounded-full border border-neutral-200 px-2 py-0.5 text-[11px] font-medium text-neutral-500 hover:bg-neutral-50 transition"
          aria-expanded={showTips}
        >
          How to improve scores
        </button>
      </h2>

      {showTips && (
        <div className="hidden sm:block rounded-2xl border border-neutral-200 bg-white px-3.5 py-2.5 text-[11px] text-neutral-600 shadow-sm shadow-black/5">
          <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-500">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#008CFF]" />
            <span>Quick tips to lift scores</span>
          </div>
          <ul className="space-y-0.5">
            <li>Use clear key pages like /pricing, /features, /about, /contact.</li>
            <li>Keep important URLs shallow (depth 1–2) with clean, readable paths.</li>
            <li>Reduce parameterized URLs (?utm=...) or add canonical targets.</li>
            <li>Avoid very deep paths; group content under hub / overview pages.</li>
          </ul>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        {/* Overall Score */}
        <button
          type="button"
          onClick={onResetFilters}
          className="text-left rounded-2xl border border-neutral-200 bg-white p-4 cursor-pointer hover:bg-neutral-50 active:scale-[0.99] transition"
        >
          <div className="text-xs uppercase tracking-wide text-neutral-500 mb-1">
            Insight Score
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-neutral-900">{score}</span>
            <span className="text-sm text-neutral-400">/ 100</span>
          </div>
          <p className="mt-1 text-xs text-neutral-500">
            Based on key pages & shallow depth
          </p>
        </button>

        {/* Breakdown cards */}
        <button
          type="button"
          onClick={onApplySeoFilter}
          className="text-left rounded-2xl border border-neutral-200 bg-white p-4 cursor-pointer hover:bg-neutral-50 active:scale-[0.99] transition"
        >
          <div className="text-xs uppercase tracking-wide text-neutral-500 mb-2">
            SEO
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">{seoScore}</span>
            <span className="text-xs text-neutral-400">/ 100</span>
          </div>
          <p className="mt-1 text-[11px] text-neutral-500">
            Clean & shallow URL structure
          </p>
        </button>
        <button
          type="button"
          onClick={onApplyUxFilter}
          className="text-left rounded-2xl border border-neutral-200 bg-white p-4 cursor-pointer hover:bg-neutral-50 active:scale-[0.99] transition"
        >
          <div className="text-xs uppercase tracking-wide text-neutral-500 mb-2">
            UX / Structure
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">{uxStructureScore}</span>
            <span className="text-xs text-neutral-400">/ 100</span>
          </div>
          <p className="mt-1 text-[11px] text-neutral-500">
            Depth balance & key pages
          </p>
        </button>
      </div>

      {/* Priority Fix list */}
      {fixes.length > 0 && (
        <div className="rounded-2xl border border-neutral-200 bg-white">
          <div className="px-4 py-3 border-b border-neutral-100">
            <h3 className="text-sm font-semibold text-neutral-800">
              Priority Fixes
            </h3>
          </div>
          <div className="divide-y divide-neutral-100">
            {fixes.map((f, idx) => (
              <div
                key={idx}
                className="px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1"
              >
                {(() => {
                  const href = safeHref(f.page);
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
                        "text-sm truncate max-w-full " +
                        (blocked
                          ? "text-neutral-400 cursor-not-allowed"
                          : "text-neutral-800 hover:underline")
                      }
                    >
                      {f.page}
                    </a>
                  );
                })()}
                <span className="text-xs text-[#008CFF] bg-[#EBF5FF] px-2 py-0.5 rounded shrink-0">
                  {f.reason}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
