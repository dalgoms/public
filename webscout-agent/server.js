import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { collectUrls } from "./collect-urls.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

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
    send({ type: "done", ...result });
  } catch (err) {
    send({ type: "error", msg: String(err.message) });
  } finally {
    res.end();
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
