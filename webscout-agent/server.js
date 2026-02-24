import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { collectUrls } from "./collect-urls.mjs";
import { generateInsights, generateLandingPageInsights, generateContentStrategy } from "./services/ai.js";
import { validateBaseUrl } from "./lib/validate-url.js";

// Load environment variables from .env file
// Note: dotenv package is required for local development
// Install with: npm install dotenv
// On Vercel, environment variables are set automatically via dashboard
(async function loadDotenv() {
  try {
    const dotenv = await import("dotenv");
    dotenv.default.config();
  } catch (err) {
    // dotenv not installed - this is OK for Vercel deployment
    // For local dev, install dotenv: npm install dotenv
    if (!process.env.VERCEL) {
      console.warn("⚠️  Warning: dotenv not found. Install with: npm install dotenv");
      console.warn("   Continuing without .env file (using process.env directly)");
    }
  }
})();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

const MAX_JSON_BODY = "1mb";
const MAX_URLS_AI = 500;
const MAX_URL_LENGTH = 2000;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_COLLECT = 10;
const RATE_LIMIT_AI = 20;

const CORS_ALLOWED_ORIGINS = (process.env.CORS_ALLOWED_ORIGINS || "http://localhost:3001,http://127.0.0.1:3001,http://localhost:3000,http://127.0.0.1:3000")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

function normalizeExcludePath(p) {
  if (typeof p !== "string") return null;
  const s = p.trim();
  if (s === "" || !s.startsWith("/") || s.includes("..")) return null;
  return s;
}

function filterAndLimitUrls(urls) {
  const seen = new Set();
  const out = [];
  for (const u of urls) {
    const urlStr = typeof u === "string" ? u : (u && u.url) ? u.url : "";
    if (!urlStr || urlStr.length > MAX_URL_LENGTH) continue;
    if (seen.has(urlStr)) continue;
    seen.add(urlStr);
    out.push(urlStr);
    if (out.length >= MAX_URLS_AI) break;
  }
  return out;
}

app.use(express.json({ limit: MAX_JSON_BODY }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  const origin = req.headers.origin;
  if (origin && CORS_ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

const rateLimit = (windowMs, max, routeName) => {
  const hits = new Map();
  setInterval(() => hits.clear(), windowMs);
  return (req, res, next) => {
    const ip = req.ip || req.socket?.remoteAddress || "unknown";
    const ua = (req.headers["user-agent"] || "").slice(0, 64);
    const origin = (req.headers.origin || "").slice(0, 128);
    const key = `${routeName}:${ip}:${ua}:${origin}`;
    const n = (hits.get(key) || 0) + 1;
    hits.set(key, n);
    if (n > max) {
      res.setHeader("Retry-After", String(Math.ceil(windowMs / 1000)));
      return res.status(429).json({ error: "Too many requests" });
    }
    next();
  };
};
app.use("/api/collect", rateLimit(RATE_LIMIT_WINDOW_MS, RATE_LIMIT_COLLECT, "collect"));
app.use("/api/ai-insight", rateLimit(RATE_LIMIT_WINDOW_MS, RATE_LIMIT_AI, "ai"));
app.use("/api/landing-insights", rateLimit(RATE_LIMIT_WINDOW_MS, RATE_LIMIT_AI, "landing"));
app.use("/api/content-strategy", rateLimit(RATE_LIMIT_WINDOW_MS, RATE_LIMIT_AI, "content"));

let collectedData = null;

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.post("/api/collect", async (req, res) => {
  const body = req.body || {};
  const baseUrl = body.baseUrl || body.base;
  let depth = Number(body.depth) || 3;
  let max = Number(body.max) || 5000;
  const stripQuery = !!body.stripQuery;
  const allowWwwAlias = body.allowWwwAlias !== false;
  let excludePathsRaw = Array.isArray(body.excludePaths)
    ? body.excludePaths
    : (typeof body.excludePaths === "string" ? body.excludePaths.split(",").map(s => s.trim()).filter(Boolean) : []);

  const urlCheck = await validateBaseUrl(baseUrl);
  if (!urlCheck.ok) {
    return res.status(400).json({ error: "Invalid base URL" });
  }
  const depthNum = Number(body.depth);
  const maxNum = Number(body.max);
  depth = Number.isNaN(depthNum) ? 3 : Math.min(10, Math.max(1, Math.floor(depthNum)));
  max = Number.isNaN(maxNum) ? 5000 : Math.min(50000, Math.max(1, Math.floor(maxNum)));
  const excludePaths = excludePathsRaw
    .map(normalizeExcludePath)
    .filter(Boolean)
    .slice(0, 50);

  res.setHeader("Content-Type", "application/x-ndjson");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  const send = (obj) => {
    res.write(JSON.stringify(obj) + "\n");
    if (res.flush) res.flush();
  };

  try {
    const result = await collectUrls(baseUrl.trim(), {
      depth,
      max,
      stripQuery,
      excludePaths,
      allowWwwAlias,
      onLog: (msg) => send({ type: "log", msg }),
    });
    
    // Persist collected data
    collectedData = {
      urls: result.urls || [],
      metadata: result.metadata || {},
      collectedAt: new Date().toISOString(),
      domain: baseUrl.trim(),
      source: result.source || null
    };
    
    send({ type: "done", ...result });
  } catch (err) {
    console.error("Collection error:", err);
    send({ type: "error", msg: "Collection failed. Please try again." });
  } finally {
    res.end();
  }
});

app.get("/api/data", (req, res) => {
  res.status(410).json({ error: "This endpoint is disabled" });
});

app.post("/api/ai-insight", async (req, res) => {
  try {
    const { domain, urls, language = 'en' } = req.body;
    if (!domain || !urls || !Array.isArray(urls)) {
      return res.status(400).json({ error: "domain and urls array required" });
    }
    const limited = filterAndLimitUrls(urls);
    const insights = await generateInsights({ domain, urls: limited, language });
    res.json(insights);
  } catch (err) {
    console.error("AI insight error:", err);
    res.status(500).json({ error: "Failed to generate insights" });
  }
});

app.post("/api/landing-insights", async (req, res) => {
  try {
    const { urls, language = 'en' } = req.body;
    if (!urls || !Array.isArray(urls)) {
      return res.status(400).json({ error: "urls array required" });
    }
    const limited = filterAndLimitUrls(urls);
    const insights = await generateLandingPageInsights({ urls: limited, language });
    res.json(insights);
  } catch (err) {
    console.error("Landing page insight error:", err);
    res.status(500).json({ error: "Failed to analyze landing pages" });
  }
});

app.post("/api/content-strategy", async (req, res) => {
  try {
    const { urls, domain, language = 'en' } = req.body;
    if (!domain || !urls || !Array.isArray(urls)) {
      return res.status(400).json({ error: "domain and urls array required" });
    }
    const limited = filterAndLimitUrls(urls);
    const strategy = await generateContentStrategy({ urls: limited, domain, language });
    res.json(strategy);
  } catch (err) {
    console.error("Content strategy error:", err);
    res.status(500).json({ error: "Failed to generate content strategy" });
  }
});

// Vercel에서는 서버를 직접 띄우므로 listen 불필요
// 로컬 개발 시에만 서버 시작
if (process.env.VERCEL !== "1") {
  function tryListen(port) {
    return new Promise((resolve, reject) => {
      const server = createServer(app);
      server.on("error", (err) => {
        if (err.code === "EADDRINUSE") resolve(null);
        else reject(err);
      });
      server.listen(port, "127.0.0.1", () => resolve(server));
    });
  }

  async function start() {
    for (let port = 3001; port <= 3010; port++) {
      const server = await tryListen(port);
      if (server) {
        console.log(`WebScout Agent: http://localhost:${port}`);
        return;
      }
    }
    console.error("Could not bind to any port 3001-3010");
    process.exit(1);
  }

  start();
}

// Vercel용 export
export default app;
