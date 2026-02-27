"use client";

import { useRouter } from "next/navigation";

export type AnalyzeView = "sitemap" | "page-types" | "figma" | "importance";

const TABS: { id: AnalyzeView; label: string }[] = [
  { id: "sitemap", label: "Sitemap View" },
  { id: "page-types", label: "Page Types" },
  { id: "figma", label: "Figma Ready" },
  { id: "importance", label: "Importance" },
];

export function getViewFromParams(searchParams: URLSearchParams): AnalyzeView {
  const v = searchParams.get("view");
  if (
    v === "sitemap" ||
    v === "page-types" ||
    v === "figma" ||
    v === "importance"
  ) {
    return v;
  }
  return "sitemap";
}

export function buildAnalyzeUrl(
  base: string,
  depth: number,
  view: AnalyzeView
): string {
  const params = new URLSearchParams();
  params.set("base", base);
  params.set("depth", String(depth));
  if (view !== "sitemap") params.set("view", view);
  return `/analyze?${params.toString()}`;
}

type AnalyzeTabsProps = {
  base: string;
  depth: number;
  active: AnalyzeView;
};

export default function AnalyzeTabs({ base, depth, active }: AnalyzeTabsProps) {
  const router = useRouter();

  function handleTabClick(view: AnalyzeView) {
    router.replace(buildAnalyzeUrl(base, depth, view));
  }

  return (
    <div className="w-full overflow-x-auto">
      <div
        role="tablist"
        aria-label="Analysis views"
        className="inline-flex rounded-xl border border-neutral-200 bg-neutral-50/80 p-1 min-w-max"
      >
        {TABS.map((tab) => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              type="button"
              onClick={() => handleTabClick(tab.id)}
              className={[
                "px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition",
                isActive
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100/60",
              ].join(" ")}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
