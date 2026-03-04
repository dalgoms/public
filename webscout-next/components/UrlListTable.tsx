"use client";

import { useState } from "react";
import { safeHref } from "@/lib/safeHref";
import { useUrlBookmarks } from "@/hooks/useUrlBookmarks";

type UrlItem = {
  url: string;
  pathDepth?: number;
  hasQuery?: boolean;
  external?: boolean;
};

type UrlListTableProps = {
  urls: UrlItem[];
  title?: string;
};

export default function UrlListTable({ urls, title = "URL List" }: UrlListTableProps) {
  const { isBookmarked, toggleBookmark } = useUrlBookmarks();
  const [popUrl, setPopUrl] = useState<string | null>(null);

  if (urls.length === 0) {
    return (
      <div className="rounded-2xl bg-white border border-neutral-200 px-4 py-6 text-sm text-neutral-500 text-center">
        No URLs in this category
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white border border-neutral-200">
      <div className="px-4 py-3 border-b border-neutral-100 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-neutral-800">{title}</h3>
        <span className="text-xs text-neutral-400">{urls.length} items</span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-xs sm:text-sm">
          <thead className="bg-neutral-50 border-b border-neutral-100">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500">
                URL
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-neutral-500">
                Depth
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium text-neutral-500">
                Query
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium text-neutral-500">
                External
              </th>
              <th className="px-3 py-2 text-center text-xs font-medium text-neutral-500">
                <span className="sr-only">Bookmark</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {urls.map((u, idx) => (
              <tr
                key={u.url + idx}
                className={
                  idx % 2 === 0 ? "bg-white" : "bg-neutral-50/60"
                }
              >
                <td className="px-4 py-2 align-top">
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
                          "block max-w-[220px] truncate sm:max-w-none sm:whitespace-normal " +
                          (blocked
                            ? "text-neutral-400 cursor-not-allowed"
                            : "text-neutral-900 hover:underline")
                        }
                      >
                        {u.url}
                      </a>
                    );
                  })()}
                </td>
                <td className="px-4 py-2 text-right text-neutral-700 align-top">
                  {u.pathDepth ?? "-"}
                </td>
                <td className="px-4 py-2 text-center align-top">
                  {u.hasQuery ? "Yes" : "-"}
                </td>
                <td className="px-4 py-2 text-center align-top">
                  {u.external ? "Yes" : "-"}
                </td>
                <td className="px-3 py-2 align-top text-center">
                  {(() => {
                    const bookmarked = isBookmarked(u.url);
                    return (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleBookmark(u.url);
                          setPopUrl(u.url);
                          setTimeout(() => {
                            setPopUrl((prev) => (prev === u.url ? null : prev));
                          }, 180);
                        }}
                        aria-label={
                          bookmarked
                            ? "Remove URL bookmark"
                            : "Add URL bookmark"
                        }
                        className={
                          "inline-flex items-center justify-center h-6 w-6 rounded-full hover:bg-neutral-100 transition-transform duration-150 " +
                          (popUrl === u.url ? "scale-110" : "")
                        }
                      >
                        <span
                          className={
                            bookmarked
                              ? "text-[#008CFF]"
                              : "text-neutral-300"
                          }
                        >
                          {bookmarked ? "★" : "☆"}
                        </span>
                      </button>
                    );
                  })()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
