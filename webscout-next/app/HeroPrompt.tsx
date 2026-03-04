"use client";

import * as React from "react";
import Image from "next/image";
import WebScoutInfoPanel from "./WebScoutInfoPanel";

type HeroPromptProps = {
  value: string;
  onChange: (v: string) => void;

  /** Called when user "sends" (button or Ctrl/Cmd+Enter). */
  onSend: () => void;

  /** If true, send button enabled (URL OR ready-to-search state) */
  canSend: boolean;

  /** Optional: render below the prompt box (e.g. toggles as pills) */
  footer?: React.ReactNode;

  /** Optional: page headline override */
  headline?: {
    left?: string; // default "Search"
    middle?: string; // default "Website"
    right?: string; // default "Perfect."
  };

  /** Optional subheadline */
  subheadline?: string;
};

export default function HeroPrompt({
  value,
  onChange,
  onSend,
  canSend,
  footer,
  headline,
  subheadline,
}: HeroPromptProps) {
  const left = headline?.left ?? "Search";
  const middle = headline?.middle ?? "Website";
  const right = headline?.right ?? "Perfect.";

  const inputRef = React.useRef<HTMLInputElement | null>(null);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    // Enter or Cmd/Ctrl + Enter = send
    if (e.key === "Enter" || ((e.metaKey || e.ctrlKey) && e.key === "Enter")) {
      e.preventDefault();
      if (canSend) {
        inputRef.current?.blur();
        onSend();
      }
    }
  }

  return (
    <section className="w-full min-h-[80vh] bg-white flex flex-col justify-center">
      <div className="mx-auto w-full max-w-[1280px] px-6 pt-24 sm:pt-32 pb-20 sm:pb-28">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.7fr)_minmax(320px,380px)] items-start">
          {/* Left: hero + prompt */}
          <div>
            <div className="text-center lg:text-left">
              <h1 className="mx-auto lg:mx-0 font-sans font-semibold tracking-tight leading-tight text-[clamp(2.6rem,5vw,4rem)]">
                <span className="inline-flex items-baseline gap-3">
                  <span>{left}</span>
                  <span className="inline-block translate-y-[2px] h-[56px] w-[56px]">
                    <Image
                      src="/icons/sparkle.svg"
                      alt=""
                      width={56}
                      height={56}
                      className="h-full w-full"
                      priority
                    />
                  </span>
                </span>{" "}
                <span className="inline-flex items-baseline gap-3">
                  <span>{middle}</span>
                  <span className="relative inline-flex items-baseline translate-y-[4px] h-[56px] w-[56px]">
                    <Image
                      src="/icons/chat.svg"
                      alt=""
                      width={56}
                      height={56}
                      className="h-full w-full"
                      priority
                    />
                  </span>
                </span>{" "}
                <span>{right}</span>
              </h1>

              <p className="mx-auto lg:mx-0 mt-6 max-w-[720px] text-xl sm:text-2xl text-neutral-400">
                {subheadline ? (
                  subheadline
                ) : (
                  <>
                    <span>One prompt is just a start.</span>
                    <br className="hidden sm:block" />
                    <span>WebScout learns and improves with you.</span>
                  </>
                )}
              </p>
            </div>

            {/* Prompt Box */}
            <div className="mx-auto lg:mx-0 mt-12 max-w-[1100px] w-full">
              <div className="hero-prompt-shell">
                <div className="relative rounded-2xl bg-neutral-50/50 p-7 sm:p-8 hero-prompt-inner">
                  <div className="text-base leading-6">
                    <input
                      ref={inputRef}
                      type="text"
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Enter a domain URL (https://...) to start analysis"
                      className="w-full bg-transparent text-base leading-6 font-normal text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
                      aria-label="WebScout prompt input"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (!canSend) return;
                      inputRef.current?.blur();
                      onSend();
                    }}
                    disabled={!canSend}
                    aria-label="Send"
                    className={[
                      "absolute bottom-5 right-5 sm:bottom-6 sm:right-6",
                      "h-12 w-12 sm:h-[52px] sm:w-[52px] rounded-full",
                      "flex items-center justify-center",
                      "bg-neutral-200/80 hover:bg-neutral-200 active:scale-[0.98]",
                      "transition disabled:opacity-50 disabled:hover:bg-neutral-200/80 disabled:active:scale-100",
                    ].join(" ")}
                  >
                    <span className="relative block h-5 w-5 sm:h-[22px] sm:w-[22px]">
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="h-full w-full"
                      >
                        <path
                          d="M6 18L18 6M9.5 6H18v8.5"
                          fill="none"
                          stroke="#404040"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </button>
                </div>
              </div>

              {/* Footer (toggles/pills) */}
              {footer ? (
                <div className="mt-4 flex flex-wrap items-center justify-center lg:justify-start gap-2">
                  {footer}
                </div>
              ) : null}
            </div>
          </div>

          {/* Right: product info panel */}
          <div className="hidden lg:block">
            <WebScoutInfoPanel />
          </div>
        </div>
      </div>
    </section>
  );
}
