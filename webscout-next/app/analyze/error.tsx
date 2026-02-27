"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function AnalyzeError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Analyze page error:", error);
  }, [error]);

  return (
    <main className="w-full bg-white">
      <div className="mx-auto max-w-[1100px] px-6 py-16 sm:py-20">
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center">
          <h2 className="text-lg font-semibold text-red-800">
            Something went wrong
          </h2>
          <p className="mt-2 text-sm text-red-700">
            {error.message || "An unexpected error occurred."}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={reset}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition"
            >
              Try again
            </button>
            <Link
              href="/"
              className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition"
            >
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
