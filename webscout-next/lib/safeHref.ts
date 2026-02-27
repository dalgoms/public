export function safeHref(url: string | null | undefined): string {
  if (!url || typeof url !== "string") return "#";
  const trimmed = url.trim().toLowerCase();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return url.trim();
  }
  return "#";
}

