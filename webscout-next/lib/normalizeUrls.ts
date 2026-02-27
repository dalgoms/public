export type RawUrlItem = {
  url: string;
  depth?: number;
  pathDepth?: number;
  hasQuery?: boolean;
  external?: boolean;
  type?: string;
  // allow other fields from API without typing them all
  [key: string]: unknown;
};

export type NormalizedUrlItem = RawUrlItem & {
  url: string;
  depth: number;
  pathDepth: number;
  type: string;
};

function computeDepthFromUrl(url: string): number {
  try {
    const u = new URL(url);
    const segments = u.pathname.split("/").filter(Boolean);
    return segments.length;
  } catch {
    return 0;
  }
}

export function normalizeUrls(items: RawUrlItem[] | undefined | null): NormalizedUrlItem[] {
  if (!items || !Array.isArray(items)) return [];

  return items
    .filter((item) => !!item && typeof item.url === "string")
    .map((item) => {
      const rawDepth =
        (typeof item.depth === "number" ? item.depth : undefined) ??
        (typeof item.pathDepth === "number" ? item.pathDepth : undefined);

      const depth = Number.isFinite(rawDepth) ? (rawDepth as number) : computeDepthFromUrl(item.url);

      const type =
        typeof item.type === "string" && item.type.trim().length > 0
          ? item.type
          : item.external
          ? "external"
          : "internal";

      return {
        ...item,
        depth,
        pathDepth: depth,
        type,
      };
    });
}

