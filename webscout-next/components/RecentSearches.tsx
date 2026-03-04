"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RecentItem, getRecents, removeRecent } from "@/lib/clientStorage";

type RecentSearchesProps = {
  onSelect?: (url: string) => void;
};

export default function RecentSearches({ onSelect }: RecentSearchesProps) {
  const [items, setItems] = useState<RecentItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    setItems(getRecents());
  }, []);

  function handleClick(url: string) {
    if (onSelect) {
      onSelect(url);
    } else {
      router.push(`/analyze?base=${encodeURIComponent(url)}&depth=2`);
    }
  }

  function handleRemove(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    url: string
  ) {
    e.stopPropagation();
    e.preventDefault();
    const next = removeRecent(url);
    setItems(next);
  }

  if (!items.length) return null;

  return (
    <section className="mx-auto mt-10 w-full max-w-[960px] px-6 text-center">
      <div className="mb-2 text-xs text-neutral-500">
        <span className="font-medium text-neutral-700">Recent</span>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {items.map((item) => (
          <button
            key={item.url}
            type="button"
            onClick={() => handleClick(item.url)}
            className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-white pl-3 pr-1 py-1 text-xs text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50 transition"
          >
            <span className="truncate max-w-[200px]">{item.url}</span>
            <button
              type="button"
              aria-label="Remove recent URL"
              onClick={(e) => handleRemove(e, item.url)}
              className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
            >
              ×
            </button>
          </button>
        ))}
      </div>
    </section>
  );
}

