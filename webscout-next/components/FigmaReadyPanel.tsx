"use client";

import { useMemo, useState } from "react";
import { Copy, Check, Download } from "lucide-react";
import { safeHref } from "@/lib/safeHref";

type CollectUrl = {
  url: string;
  pathDepth?: number;
  hasQuery?: boolean;
  external?: boolean;
};

const ASSET_EXT =
  /\.(png|jpg|jpeg|svg|gif|webp|ico|pdf|css|js|mp4|webm|woff|woff2|ttf|otf)(\?|#|$)/i;

function getBaseHost(urlString: string): string | null {
  try {
    const u = new URL(urlString);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

function isExcluded(url: CollectUrl, baseUrl: string): boolean {
  try {
    const parsed = new URL(url.url);
    const baseHost = getBaseHost(baseUrl);

    if (baseHost && parsed.hostname.replace(/^www\./, "") !== baseHost) {
      return true; // external
    }
    if (ASSET_EXT.test(url.url)) return true; // asset
    if (url.url.includes("?") || url.url.includes("#")) return true; // param
    return false;
  } catch {
    return true;
  }
}

const PRIORITY_PATTERNS: { pattern: RegExp; order: number }[] = [
  { pattern: /^\/$|^\/home\/?$|^\/index\.?(html?)?\/?$/i, order: 0 }, // landing
  { pattern: /\/pricing\/?/i, order: 1 },
  { pattern: /\/features|\/product\/?/i, order: 2 },
  { pattern: /\/solutions\/?/i, order: 3 },
  { pattern: /\/case-stud(y|ies)\/?/i, order: 4 },
  { pattern: /\/docs\/?$/i, order: 5 }, // docs overview (not deep paths)
  { pattern: /\/about\/?/i, order: 6 },
  { pattern: /\/contact\/?/i, order: 7 },
  { pattern: /\/blog\/?$/i, order: 8 },
  { pattern: /.*/, order: 99 },
];

function getPriority(pathname: string): number {
  const path = pathname.toLowerCase().replace(/\/$/, "") || "/";
  for (const { pattern, order } of PRIORITY_PATTERNS) {
    if (pattern.test(path)) return order;
  }
  return 99;
}

type FigmaReadyPanelProps = {
  urls: CollectUrl[];
  baseUrl: string;
};

export default function FigmaReadyPanel({ urls, baseUrl }: FigmaReadyPanelProps) {
  const [copied, setCopied] = useState(false);

  const recommended = useMemo(() => {
    const filtered = urls.filter((u) => !isExcluded(u, baseUrl));
    const withPath = filtered.map((u) => {
      try {
        const parsed = new URL(u.url);
        return { ...u, pathname: parsed.pathname };
      } catch {
        return { ...u, pathname: u.url };
      }
    });
    return withPath.sort(
      (a, b) => getPriority(a.pathname) - getPriority(b.pathname)
    );
  }, [urls, baseUrl]);

  async function handleCopy() {
    const text = recommended.map((u) => u.url).join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  }

  function handleDownload() {
    if (recommended.length === 0) return;
    const text = recommended.map((u) => u.url).join("\n") + "\n";
    try {
      const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "figma-ready-urls.txt";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // ignore download errors
    }
  }

  return (
    <section className="space-y-6">
      <h2 className="text-lg font-semibold text-neutral-800">Figma Ready</h2>

      <p className="text-sm text-neutral-500">
        Recommended pages to import/design first. Excludes assets, parameterized
        URLs, and external links.
      </p>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <span className="text-sm text-neutral-600">
          {recommended.length} page{recommended.length !== 1 ? "s" : ""} recommended
        </span>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            disabled={recommended.length === 0}
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 disabled:hover:bg-white transition"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-green-600" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy list
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={recommended.length === 0}
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50 disabled:opacity-50 disabled:hover:bg-white transition"
          >
            <Download className="h-4 w-4" />
            Download .txt
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white">
        <div className="divide-y divide-neutral-100 max-h-[480px] overflow-y-auto">
          {recommended.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-neutral-500">
              No pages match the criteria
            </div>
          ) : (
            recommended.map((u, idx) => (
              <div
                key={u.url + idx}
                className="px-4 py-3 flex items-center justify-between gap-4 hover:bg-neutral-50/50"
              >
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
                        "text-sm truncate flex-1 " +
                        (blocked
                          ? "text-neutral-400 cursor-not-allowed"
                          : "text-neutral-800 hover:underline")
                      }
                    >
                      {u.url}
                    </a>
                  );
                })()}
                <span className="text-xs text-neutral-400 shrink-0">
                  depth {u.pathDepth ?? "-"}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
