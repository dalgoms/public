"use client";

import { useMemo, useState } from "react";
import UrlListTable from "./UrlListTable";

export type PageType = "landing" | "internal" | "param" | "asset" | "external";

type CollectUrl = {
  url: string;
  pathDepth?: number;
  hasQuery?: boolean;
  external?: boolean;
};

const ASSET_EXT = /\.(png|jpg|jpeg|svg|gif|webp|ico|pdf|css|js|mp4|webm|woff|woff2|ttf|otf)(\?|#|$)/i;

function getBaseHost(urlString: string): string | null {
  try {
    const u = new URL(urlString);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

function classifyUrl(url: CollectUrl, baseUrl: string): PageType {
  try {
    const parsed = new URL(url.url);
    const baseHost = getBaseHost(baseUrl);

    // external: hostname differs from base domain
    if (baseHost && parsed.hostname.replace(/^www\./, "") !== baseHost) {
      return "external";
    }

    // asset: file extension
    if (ASSET_EXT.test(url.url)) {
      return "asset";
    }

    // param: contains ? or #
    if (url.url.includes("?") || url.url.includes("#")) {
      return "param";
    }

    // landing: path is / or /home or /index
    const path = parsed.pathname.toLowerCase().replace(/\/$/, "") || "/";
    if (
      path === "/" ||
      path === "/home" ||
      path === "/index" ||
      path === "/index.html"
    ) {
      return "landing";
    }

    return "internal";
  } catch {
    return "internal";
  }
}

const TYPE_LABELS: Record<PageType, string> = {
  landing: "Landing",
  internal: "Internal",
  param: "Parameterized",
  asset: "Asset",
  external: "External",
};

type PageTypesPanelProps = {
  urls: CollectUrl[];
  baseUrl: string;
};

export default function PageTypesPanel({ urls, baseUrl }: PageTypesPanelProps) {
  const [filter, setFilter] = useState<PageType | "all">("all");

  const byType = useMemo(() => {
    const map: Record<PageType, CollectUrl[]> = {
      landing: [],
      internal: [],
      param: [],
      asset: [],
      external: [],
    };
    for (const u of urls) {
      const t = classifyUrl(u, baseUrl);
      map[t].push(u);
    }
    return map;
  }, [urls, baseUrl]);

  const counts = useMemo(
    () => ({
      landing: byType.landing.length,
      internal: byType.internal.length,
      param: byType.param.length,
      asset: byType.asset.length,
      external: byType.external.length,
    }),
    [byType]
  );

  const filteredUrls =
    filter === "all"
      ? urls
      : byType[filter];

  const typeOrder: PageType[] = ["landing", "internal", "param", "asset", "external"];

  return (
    <section className="space-y-6">
      <h2 className="text-lg font-semibold text-neutral-800">Page Types</h2>

      {/* Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`rounded-xl border px-4 py-3 text-left transition ${
            filter === "all"
              ? "border-neutral-900 bg-neutral-900 text-white"
              : "border-neutral-200 bg-white hover:border-neutral-300"
          }`}
        >
          <div className="text-xs uppercase tracking-wide opacity-80">
            All
          </div>
          <div className="mt-1 text-xl font-semibold">{urls.length}</div>
        </button>
        {typeOrder.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setFilter(t)}
            className={`rounded-xl border px-4 py-3 text-left transition ${
              filter === t
                ? "border-neutral-900 bg-neutral-900 text-white"
                : "border-neutral-200 bg-white hover:border-neutral-300"
            }`}
          >
            <div className="text-xs uppercase tracking-wide opacity-80">
              {TYPE_LABELS[t]}
            </div>
            <div className="mt-1 text-xl font-semibold">{counts[t]}</div>
          </button>
        ))}
      </div>

      {/* Filter chips (quick toggle) */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-neutral-500 self-center mr-1">
          Filter:
        </span>
        {(["all", ...typeOrder] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setFilter(t)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              filter === t
                ? "bg-neutral-800 text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            {t === "all" ? "All" : TYPE_LABELS[t]} ({t === "all" ? urls.length : counts[t]})
          </button>
        ))}
      </div>

      {/* Filtered list */}
      <UrlListTable
        urls={filteredUrls}
        title={
          filter === "all"
            ? `All URLs (${urls.length})`
            : `${TYPE_LABELS[filter]} (${filteredUrls.length})`
        }
      />
    </section>
  );
}
