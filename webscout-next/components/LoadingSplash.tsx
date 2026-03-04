"use client";

import Image from "next/image";

type LoadingSplashProps = {
  message?: string;
  subtext?: string;
};

export default function LoadingSplash({
  message = "Collecting URLs from the site…",
  subtext = "This may take a few seconds.",
}: LoadingSplashProps) {
  return (
    <section className="w-full min-h-screen bg-white flex items-center justify-center px-6 no-caret">
      <div className="flex flex-col items-center gap-10 text-center">
        <div className="relative w-80 h-32 sm:w-[460px] sm:h-44 md:w-[640px] md:h-52">
          <Image
            src="/icons/loadingbar.gif"
            alt="Loading"
            fill
            sizes="(min-width: 1024px) 640px, (min-width: 640px) 460px, 320px"
            className="object-contain"
            priority
          />
        </div>

        <div className="space-y-3">
          <p className="text-2xl md:text-3xl font-semibold text-neutral-900">
            {message}
          </p>
          {subtext && (
            <p className="text-base md:text-lg text-neutral-500">{subtext}</p>
          )}
        </div>
      </div>
    </section>
  );
}
