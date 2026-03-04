"use client";

import React from "react";

export default function WebScoutInfoPanel() {
  return (
    <aside className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white px-4 py-5 sm:px-5 sm:py-6 text-xs sm:text-sm text-neutral-700 shadow-sm shadow-black/5">
      <div className="flex flex-col gap-5 max-h-[520px] overflow-y-auto pr-1">
        {/* Title */}
        <section>
          <h2 className="text-sm font-semibold text-neutral-900">
            WebScout
          </h2>
          <p className="mt-0.5 text-[11px] uppercase tracking-wide text-neutral-400">
            AI Website Structure Analyzer
          </p>
        </section>

        <div className="h-px bg-neutral-100" />

        {/* Description */}
        <section>
          <h3 className="text-xs font-semibold text-neutral-800 mb-1.5">
            Overview
          </h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            WebScout helps marketers, designers, and strategists understand any
            website structure in seconds.
          </p>
          <p className="mt-2 text-xs text-neutral-600 leading-relaxed">
            Paste a URL and instantly get:
          </p>
          <ul className="mt-1.5 space-y-1 text-xs text-neutral-600">
            <li>• Site structure map</li>
            <li>• Key landing pages</li>
            <li>• SEO signals</li>
            <li>• UX insights</li>
            <li>• Content opportunities</li>
          </ul>
        </section>

        <div className="h-px bg-neutral-100" />

        {/* Features */}
        <section>
          <h3 className="text-xs font-semibold text-neutral-800 mb-1.5">
            Features
          </h3>
          <ul className="space-y-1.5 text-xs text-neutral-600 leading-relaxed">
            <li>
              <span className="mr-1.5" aria-hidden="true">
                🔎
              </span>
              <span className="font-medium text-neutral-800">
                Smart URL Collection
              </span>
              <span className="block font-normal">
                Collects pages from sitemap and internal links.
              </span>
            </li>
            <li>
              <span className="mr-1.5" aria-hidden="true">
                🧠
              </span>
              <span className="font-medium text-neutral-800">
                Structure Insights
              </span>
              <span className="block font-normal">
                Analyzes site depth, hierarchy, and key pages.
              </span>
            </li>
            <li>
              <span className="mr-1.5" aria-hidden="true">
                📊
              </span>
              <span className="font-medium text-neutral-800">
                SEO Signals
              </span>
              <span className="block font-normal">
                Detects landing pages, parameter URLs, and orphan pages.
              </span>
            </li>
            <li>
              <span className="mr-1.5" aria-hidden="true">
                🎨
              </span>
              <span className="font-medium text-neutral-800">
                UX Visualization
              </span>
              <span className="block font-normal">
                Transforms the site structure into a clear tree map.
              </span>
            </li>
          </ul>
        </section>

        <div className="h-px bg-neutral-100" />

        {/* Use cases */}
        <section>
          <h3 className="text-xs font-semibold text-neutral-800 mb-1.5">
            Use cases
          </h3>
          <p className="text-xs text-neutral-600 leading-relaxed mb-1.5">
            Who uses WebScout?
          </p>
          <ul className="space-y-1 text-xs text-neutral-600">
            <li>• Growth marketers — analyze competitor websites</li>
            <li>• UX designers — understand information architecture</li>
            <li>• SEO strategists — find important landing pages</li>
            <li>• Product teams — reverse engineer site structures</li>
          </ul>
        </section>

        <div className="h-px bg-neutral-100" />

        {/* Example sites */}
        <section>
          <h3 className="text-xs font-semibold text-neutral-800 mb-1.5">
            Example sites
          </h3>
          <p className="text-xs text-neutral-600 leading-relaxed mb-1.5">
            Try analyzing:
          </p>
          <div className="flex flex-col gap-1.5 text-xs text-neutral-700">
            <span>apple.com</span>
            <span>notion.so</span>
            <span>stripe.com</span>
          </div>
        </section>
      </div>
    </aside>
  );
}

