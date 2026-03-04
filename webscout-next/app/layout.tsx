import "./globals.css";
import type { Metadata } from "next";
import Image from "next/image";
import { Plus_Jakarta_Sans } from "next/font/google";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const siteUrl = "https://webscout-six.vercel.app";
// 로컬 이미지: public/ogimage/webscoutimg.png (배포 후 404면 GitHub raw URL로 교체)
const ogImageUrl = `${siteUrl}/ogimage/webscoutimg.png`;

const siteTitle = "WebScout – AI Website Structure Analyzer";
const siteDescription =
  "Paste a URL and get site map, key pages, SEO signals, and UX insights in seconds.";

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    siteName: "WebScout",
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "WebScout – Search Website Perfect.",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [ogImageUrl],
  },
};

function Header() {
  return (
    <header className="bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-[1100px] px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src="/icons/webscoutlogo2.svg"
            alt="WebScout Agent"
            width={140}
            height={32}
            priority
          />
        </div>
        <nav className="flex items-center gap-3 text-xs text-neutral-500">
          <a href="/" aria-label="Home">
            <span className="inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-neutral-50 text-neutral-300 hover:bg-neutral-100 hover:text-neutral-500 transition-colors">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-5 w-5"
              >
                <path
                  d="M4 11.5 12 4l8 7.5V19a1.5 1.5 0 0 1-1.5 1.5h-3.5a1 1 0 0 1-1-1v-3.5h-4V19a1 1 0 0 1-1 1H5.5A1.5 1.5 0 0 1 4 19v-7.5Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </a>
        </nav>
      </div>
    </header>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={jakarta.variable}>
      <body className="font-sans bg-white text-neutral-900 antialiased min-h-screen">
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <footer className="bg-white/80">
            <div className="mx-auto max-w-[1100px] px-6 py-4 text-xs text-neutral-400 flex items-center justify-between">
              <span>WebScout Agent</span>
              <span>Built by Seyoung Lee</span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
