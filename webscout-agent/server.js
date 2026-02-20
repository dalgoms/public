import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { collectUrls } from "./collect-urls.mjs";
import { generateInsights, generateLandingPageInsights, generateContentStrategy } from "./services/ai.js";

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

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// In-memory data store (for demo - use database in production)
let collectedData = null;

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.post("/api/collect", async (req, res) => {
  const body = req.body || {};
  const baseUrl = body.baseUrl || body.base;
  const depth = Number(body.depth) || 3;
  const max = Number(body.max) || 5000;
  const stripQuery = !!body.stripQuery;
  const allowWwwAlias = body.allowWwwAlias !== false;
  const excludePaths = Array.isArray(body.excludePaths)
    ? body.excludePaths
    : (typeof body.excludePaths === "string" ? body.excludePaths.split(",").map(s => s.trim()).filter(Boolean) : []);

  if (!baseUrl || typeof baseUrl !== "string") {
    return res.status(400).json({ error: "baseUrl required" });
  }

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
    send({ type: "error", msg: String(err.message || "Unknown error occurred") });
  } finally {
    res.end();
  }
});

// Get collected data
app.get("/api/data", (req, res) => {
  if (!collectedData) {
    return res.status(404).json({ error: "No data collected yet" });
  }
  res.json(collectedData);
});

// AI Insight endpoint
app.post("/api/ai-insight", async (req, res) => {
  try {
    const { domain, urls, language = 'en' } = req.body;
    
    if (!domain || !urls || !Array.isArray(urls)) {
      return res.status(400).json({ error: "domain and urls array required" });
    }
    
    const insights = await generateInsights({ domain, urls, language });
    res.json(insights);
  } catch (err) {
    console.error("AI insight error:", err);
    res.status(500).json({ error: err.message || "Failed to generate insights" });
  }
});

// Landing page improvement endpoint
app.post("/api/landing-insights", async (req, res) => {
  try {
    const { urls, language = 'en' } = req.body;
    
    if (!urls || !Array.isArray(urls)) {
      return res.status(400).json({ error: "urls array required" });
    }
    
    const insights = await generateLandingPageInsights({ urls, language });
    res.json(insights);
  } catch (err) {
    console.error("Landing page insight error:", err);
    res.status(500).json({ error: err.message || "Failed to generate landing insights" });
  }
});

// Content strategy endpoint
app.post("/api/content-strategy", async (req, res) => {
  try {
    const { urls, domain, language = 'en' } = req.body;
    
    if (!domain || !urls || !Array.isArray(urls)) {
      return res.status(400).json({ error: "domain and urls array required" });
    }
    
    const strategy = await generateContentStrategy({ urls, domain, language });
    res.json(strategy);
  } catch (err) {
    console.error("Content strategy error:", err);
    res.status(500).json({ error: err.message || "Failed to generate content strategy" });
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
