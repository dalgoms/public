#!/usr/bin/env node
/**
 * URL Collector
 * - export collectUrls(baseUrl, options)
 * - CLI: node collect-urls.mjs https://example.com [--depth=3] [--max=5000]
 */

import fs from "fs";
import path from "path";
import { URL } from "url";

const delayMs = 150;
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

/** @param {string} base - Base URL
 *  @param {{ allowWwwAlias?: boolean }} opts */
function createContext(base, opts = {}) {
  const baseNorm = base.replace(/\/+$/, "");
  const baseUrl = new URL(baseNorm);
  const allowWwwAlias = opts.allowWwwAlias !== false;

  function canonicalHost(hostname) {
    const h = (hostname || "").toLowerCase();
    return h.startsWith("www.") ? h.slice(4) : h;
  }

  function isSameSite(urlStr) {
    try {
      const u = new URL(urlStr);
      if (allowWwwAlias) {
        return u.protocol === baseUrl.protocol && u.port === baseUrl.port &&
          canonicalHost(u.hostname) === canonicalHost(baseUrl.hostname);
      }
      return u.origin === baseUrl.origin;
    } catch {
      return false;
    }
  }

  function isExcludedScheme(href) {
    return href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:");
  }

  function normalizeUrl(input) {
    try {
      const u = new URL(input);
      u.hash = "";
      return u.toString();
    } catch {
      return null;
    }
  }

  return { baseNorm, baseUrl, isSameSite, isExcludedScheme, normalizeUrl };
}

async function fetchText(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "URLCollector/1.0 (+local script)",
      "Accept": "text/html,application/xml;q=0.9,*/*;q=0.8",
    }
  });
  if (!res.ok) throw new Error(`Fetch failed ${res.status} ${url}`);
  return await res.text();
}

function extractLocFromSitemap(xmlText) {
  const locs = [];
  const re = /<loc>\s*([^<\s]+)\s*<\/loc>/gim;
  let m;
  while ((m = re.exec(xmlText)) !== null) locs.push(m[1].trim());
  return locs;
}

function extractSitemapsFromRobotsTxt(robotsText) {
  const urls = [];
  const re = /^\s*Sitemap:\s*(.+)$/gim;
  let m;
  while ((m = re.exec(robotsText)) !== null) {
    const url = m[1].trim();
    if (url) urls.push(url);
  }
  return urls;
}

function pathDepth(pathname) {
  const segs = pathname.replace(/^\/|\/$/g, "").split("/").filter(Boolean);
  return segs.length;
}

/**
 * @param {string} baseUrl - Base URL
 * @param {{ depth?: number, max?: number, stripQuery?: boolean, excludePaths?: string[], allowWwwAlias?: boolean, onLog?: (msg: string) => void }} options
 * @returns {Promise<{ urls: { url: string, pathDepth: number, hasQuery: boolean, external: boolean }[], source: string, sitemapSource?: string }>}
 */
export async function collectUrls(baseUrl, options = {}) {
  const depthLimit = options.depth ?? 3;
  const maxCount = options.max ?? 5000;
  const stripQuery = options.stripQuery ?? false;
  const excludePaths = Array.isArray(options.excludePaths) ? options.excludePaths : [];
  const allowWwwAlias = options.allowWwwAlias !== false;
  const onLog = options.onLog ?? (() => {});

  const ctx = createContext(baseUrl, { allowWwwAlias });
  const { baseNorm, isSameSite, isExcludedScheme, normalizeUrl } = ctx;

  onLog(`Base: ${baseNorm}`);
  onLog("1) Try sitemap...");

  const sm = await trySitemap(baseNorm, ctx);

  let urlList = [];
  let linkMap = {};
  
  if (sm?.urls?.length) {
    onLog(`Sitemap found: ${sm.source}`);
    urlList = sm.urls.filter(u => isSameSite(u));
    // For sitemap, we can't get link relationships without crawling
    // But we can still provide basic metadata
  } else {
    onLog("2) No sitemap (or empty). Fallback to crawling internal links...");
    const crawlResult = await crawlInternal(`${baseNorm}/`, depthLimit, maxCount, ctx);
    urlList = crawlResult.urls || crawlResult; // Handle both old and new format
    linkMap = crawlResult.linkMap || {};
  }

  const enriched = enrichUrls(urlList, { stripQuery, excludePaths });
  
  // Build metadata
  const metadata = {};
  enriched.forEach(({ url }) => {
    const linkCount = linkMap[url] ? linkMap[url].size : 0;
    metadata[url] = {
      linkCount,
      links: linkMap[url] ? [...linkMap[url]] : []
    };
  });
  
  return {
    urls: enriched,
    source: sm ? "sitemap" : "crawl",
    sitemapSource: sm?.source,
    metadata
  };
}

function enrichUrls(urlList, opts = {}) {
  const stripQuery = opts.stripQuery ?? false;
  const excludePaths = opts.excludePaths ?? [];

  let list = [...new Set(urlList.map(u => {
    try {
      const x = new URL(u);
      x.hash = "";
      let s = x.toString();
      if (stripQuery) s = s.split("?")[0];
      return s;
    } catch { return null; }
  }).filter(Boolean))];

  if (excludePaths.length) {
    const norm = (p) => (p = (p || "").trim()) && !p.startsWith("/") ? "/" + p : p;
    const prefixes = excludePaths.map(norm).filter(Boolean);
    list = list.filter(u => {
      try {
        const pathname = new URL(u).pathname || "/";
        return !prefixes.some(p => pathname === p || pathname.startsWith(p + "/"));
      } catch { return true; }
    });
  }

  list.sort();
  return list.map(url => {
    const u = new URL(url);
    return {
      url,
      pathDepth: pathDepth(u.pathname),
      hasQuery: u.search.length > 0,
      external: false,
    };
  });
}

async function trySitemap(baseUrl, ctx) {
  const { isSameSite: sameSite } = ctx;
  const fallbackCandidates = [
    `${baseUrl}/sitemap.xml`,
    `${baseUrl}/sitemap_index.xml`,
    `${baseUrl}/sitemap-index.xml`,
    `${baseUrl}/sitemap/sitemap.xml`,
  ];

  const candidates = [];
  try {
    const robotsUrl = new URL("/robots.txt", baseUrl).toString();
    const robotsText = await fetchText(robotsUrl);
    const fromRobots = extractSitemapsFromRobotsTxt(robotsText);
    for (const u of fromRobots) {
      if (sameSite(u)) candidates.push(u);
    }
    await sleep(delayMs);
  } catch {}

  candidates.push(...fallbackCandidates.filter(c => !candidates.includes(c)));

  for (const smUrl of candidates) {
    try {
      const xml = await fetchText(smUrl);
      const locs = extractLocFromSitemap(xml);
      if (!locs.length) continue;

      const isIndex = /<sitemapindex/i.test(xml);
      if (isIndex) {
        const all = [];
        for (const subSm of locs) {
          try {
            const subXml = await fetchText(subSm);
            all.push(...extractLocFromSitemap(subXml));
            await sleep(delayMs);
          } catch {}
        }
        if (all.length) return { source: smUrl, urls: all };
      } else {
        return { source: smUrl, urls: locs };
      }
    } catch {}
  }
  return null;
}

function extractLinksFromHtml(html, baseUrl, ctx) {
  const links = new Set();
  const re = /href\s*=\s*["']([^"']+)["']/gim;
  let m;
  while ((m = re.exec(html)) !== null) {
    const href = m[1]?.trim();
    if (!href || ctx.isExcludedScheme(href)) continue;
    try {
      links.add(new URL(href, baseUrl).toString());
    } catch {}
  }
  return [...links];
}

async function crawlInternal(startUrl, depthLimit, maxCount, ctx) {
  const { normalizeUrl, isSameSite } = ctx;
  const visited = new Set();
  const linkMap = {}; // { url: Set of URLs that link to it }
  const queue = [{ url: startUrl, depth: 0 }];

  while (queue.length && visited.size < maxCount) {
    const { url, depth } = queue.shift();
    const n = normalizeUrl(url);
    if (!n || !isSameSite(n) || visited.has(n)) continue;
    visited.add(n);

    if (depth < depthLimit) {
      try {
        const html = await fetchText(n);
        const links = extractLinksFromHtml(html, n, ctx);
        for (const l of links) {
          const ln = normalizeUrl(l);
          if (ln && isSameSite(ln)) {
            if (!linkMap[ln]) linkMap[ln] = new Set();
            linkMap[ln].add(n);
            if (!visited.has(ln)) queue.push({ url: ln, depth: depth + 1 });
          }
        }
        await sleep(delayMs);
      } catch {}
    }
  }
  return { urls: [...visited], linkMap };
}

function writeOutputs(urls, txtPath, csvPath, ctx) {
  const { normalizeUrl, isSameSite } = ctx;
  const uniq = [...new Set(urls.map(normalizeUrl).filter(Boolean))].filter(isSameSite).sort();
  fs.writeFileSync(txtPath, uniq.join("\n") + "\n", "utf-8");
  const csv = ["url"].concat(uniq.map(u => `"${u.replace(/"/g, '""')}"`)).join("\n") + "\n";
  fs.writeFileSync(csvPath, csv, "utf-8");
}

// CLI entry
const isCLI = typeof process !== "undefined" && process.argv[1]?.endsWith("collect-urls.mjs");
if (isCLI) {
  const args = process.argv.slice(2);
  if (!args[0] || args[0].startsWith("-")) {
    console.log("Usage: node collect-urls.mjs https://example.com [--depth=3] [--max=5000]");
    process.exit(1);
  }
  const base = args[0].replace(/\/+$/, "");
  const depthLimit = Number((args.find(a => a.startsWith("--depth=")) || "--depth=3").split("=")[1]);
  const maxCount = Number((args.find(a => a.startsWith("--max=")) || "--max=5000").split("=")[1]);
  const outDir = process.cwd();
  const txtPath = path.join(outDir, "urls.txt");
  const csvPath = path.join(outDir, "urls.csv");
  const ctx = createContext(base);

  (async () => {
    const { urls } = await collectUrls(base, { depth: depthLimit, max: maxCount, onLog: console.log });
    writeOutputs(urls.map(u => u.url), txtPath, csvPath, ctx);
    console.log(`Saved: ${txtPath} (${urls.length})`);
    console.log(`Saved: ${csvPath} (${urls.length})`);
  })();
}
