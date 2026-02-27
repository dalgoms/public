"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import HeroPrompt from "@/components/HeroPrompt";
import LoadingSplash from "@/components/LoadingSplash";
import RecentSearches from "@/components/RecentSearches";
import { addRecent } from "@/lib/clientStorage";

function isHttpUrl(str: string): boolean {
  if (!str) return false;
  try {
    const u = new URL(str.trim());
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export default function Home() {
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingQuery, setLoadingQuery] = useState<string | null>(null);
  const [inlineError, setInlineError] = useState<string | null>(null);
  const router = useRouter();

  const canSend = !!value.trim();

  const exampleUrls = [
    "https://yourbrand.com",
    "https://competitor.com",
  ];

  function handleSend() {
    const input = value.trim();
    if (!input) return;

    if (!isHttpUrl(input)) {
      setInlineError("Enter a full URL including https:// to start analysis.");
      setTimeout(() => {
        setInlineError((current) =>
          current === "Enter a full URL including https:// to start analysis."
            ? null
            : current
        );
      }, 2600);
      return;
    }

    setLoadingQuery(input);
    setIsLoading(true);
    addRecent(input);

    const base = encodeURIComponent(input);
    const depth = 2;
    router.push(`/analyze?base=${base}&depth=${depth}`);
  }

  function handleRecentSelect(url: string) {
    setLoadingQuery(url);
    setIsLoading(true);
    const base = encodeURIComponent(url);
    router.push(`/analyze?base=${base}&depth=2`);
  }

  return (
    <div className="min-h-screen bg-white relative">
      {isLoading ? (
        <LoadingSplash
          message="Preparing analysis..."
          subtext={
            loadingQuery
              ? `Analyzing ${loadingQuery}`
              : "This can take 10–30 seconds for larger sites."
          }
        />
      ) : (
        <>
          <HeroPrompt
            value={value}
            onChange={setValue}
            onSend={handleSend}
            canSend={canSend}
            footer={
              <div className="flex flex-col items-center gap-2 text-[11px] text-neutral-500">
                <span className="text-neutral-400">
                  Start with a URL. See your structure clearly.
                </span>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <span className="text-neutral-400">Try:</span>
                  {exampleUrls.map((url) => (
                    <button
                      key={url}
                      type="button"
                      onClick={() => setValue(url)}
                      className="rounded-full border border-neutral-200 bg-white px-2.5 py-1 hover:border-neutral-300 hover:bg-neutral-50 transition"
                    >
                      {url}
                    </button>
                  ))}
                </div>
              </div>
            }
          />
          <RecentSearches onSelect={handleRecentSelect} />
        </>
      )}

      {inlineError && (
        <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
          <div className="pointer-events-auto max-w-md w-full rounded-2xl bg-neutral-900 text-white px-4 py-3 shadow-lg shadow-black/15 flex items-center gap-2 text-sm">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#008CFF]" />
            <span>{inlineError}</span>
          </div>
        </div>
      )}
    </div>
  );
}
