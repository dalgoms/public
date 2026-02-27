"use client";

import { useMemo } from "react";
import { safeHref } from "@/lib/safeHref";

type CollectUrl = {
  url: string;
  pathDepth?: number;
  hasQuery?: boolean;
  external?: boolean;
};

const KEY_PAGE_BONUSES: { pattern: RegExp; bonus: number; label: string }[] = [
  { pattern: /^\/$|^\/home\/?$|^\/index\.?(html?)?\/?$/i, bonus: 30, label: "Landing" },
  { pattern: /\/pricing\/?/i, bonus: 28, label: "Pricing" },
  { pattern: /\/features|\/product\/?/i, bonus: 26, label: "Features/Product" },
  { pattern: /\/solutions\/?/i, bonus: 24, label: "Solutions" },
  { pattern: /\/case-stud(y|ies)\/?/i, bonus: 22, label: "Case studies" },
  { pattern: /\/docs\/?$/i, bonus: 20, label: "Docs overview" },
  { pattern: /\/about\/?/i, bonus: 18, label: "About" },
  { pattern: /\/contact\/?/i, bonus: 18, label: "Contact" },
  { pattern: /\/blog\/?$/i, bonus: 14, label: "Blog" },
  { pattern: /\/careers\/?/i, bonus: 12, label: "Careers" },
];

const DEPTH_PENALTY = 8;
const PARAM_PENALTY = 15;

type ScoredUrl = {
  url: string;
  pathDepth?: number;
  hasQuery?: boolean;
  external?: boolean;
  score: number;
  reasoning: string[];
};

function computeImportance(url: CollectUrl): ScoredUrl {
  const reasoning: string[] = ["Base (50)"];
  let score = 50;

  try {
    const parsed = new URL(url.url);
    const path = parsed.pathname.toLowerCase().replace(/\/$/, "") || "/";

    // Key page bonus
    for (const { pattern, bonus, label } of KEY_PAGE_BONUSES) {
      if (pattern.test(path)) {
        score += bonus;
        reasoning.push(`${label} (+${bonus})`);
        break;
      }
    }

    // Depth penalty
    const depth = url.pathDepth ?? 0;
    const depthPen = Math.min(depth * DEPTH_PENALTY, 40);
    if (depthPen > 0) {
      score -= depthPen;
      reasoning.push(`Depth ${depth} (-${depthPen})`);
    }

    // Param penalty
    const hasParam = url.hasQuery ?? url.url.includes("?") ?? url.url.includes("#");
    if (hasParam) {
      score -= PARAM_PENALTY;
      reasoning.push(`Has params (-${PARAM_PENALTY})`);
    }

    const clamped = Math.max(0, Math.min(100, Math.round(score)));
    return {
      ...url,
      score: clamped,
      reasoning,
    };
  } catch {
    return {
      ...url,
      score: 0,
      reasoning: ["Invalid URL"],
    };
  }
}

type ImportancePanelProps = {
  urls: CollectUrl[];
};

export default function ImportancePanel({ urls }: ImportancePanelProps) {
  const top20 = useMemo(() => {
    const scored = urls.map(computeImportance);
    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);
  }, [urls]);

  return (
    <section className="space-y-6">
      <h2 className="text-lg font-semibold text-neutral-800">Importance</h2>

      <p className="text-sm text-neutral-500">
        Top 20 pages by importance score (0–100). Based on key page patterns,
        depth, and query parameters.
      </p>

      <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
        <div className="divide-y divide-neutral-100">
          {top20.map((u, idx) => (
            <div
              key={u.url + idx}
              className="px-4 py-3 flex items-center gap-4 hover:bg-neutral-50/50"
            >
              <span
                className={`shrink-0 w-12 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                  u.score >= 70
                    ? "bg-blue-100 text-blue-800"
                    : u.score >= 50
                    ? "bg-indigo-100 text-indigo-800"
                    : "bg-neutral-100 text-neutral-600"
                }`}
                title={u.reasoning.join("; ")}
              >
                {u.score}
              </span>
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
              <span
                className="text-xs text-neutral-400 shrink-0 opacity-0 group-hover:opacity-100 transition cursor-help"
                title={u.reasoning.join("; ")}
              >
                ?
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
