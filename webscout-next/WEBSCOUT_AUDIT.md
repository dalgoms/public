## WebScout Agent — Next.js Refactor Audit

### Context

- **Baseline (production reference)**: `https://webscout-agent.vercel.app/` (`webscout-agent` Express + SPA)
- **Current implementation**: `webscout-next` (Next.js App Router) + proxy to the same Express `/api/collect` backend
- Scope: **no new AI features, no UI redesign** — only feature parity, behavior, and security

---

### PART 1 — Current Implementation Spec (Next.js)

#### 1) User Flow

- **Home (`/`)**
  - Component: `app/page.tsx`
  - User pastes URL into `HeroPrompt` (`components/HeroPrompt.tsx`).
  - `handleSend`:
    - Validates with `isHttpUrl` (must be full `http(s)://` URL).
    - On success:
      - Calls `addRecent(input)` (localStorage, via `lib/clientStorage.ts`).
      - Builds `/analyze?base=<encodeURIComponent(input)>&depth=2`.
      - `router.push` to `/analyze`.

- **Analyze (`/analyze`)**
  - Component: `AnalyzePageContent` in `app/analyze/page.tsx`.
  - Reads `base` and `depth` from `useSearchParams`.
  - On mount / when `base` or `depth` change:
    - If `!base`: sets error `"Missing base URL."`.
    - Else:
      - `loading = true`, `error = null`.
      - `POST /api/collect` with JSON body:
        - `baseUrl: base`
        - `base`
        - `depth`
        - `max: 5000`
        - `stripQuery: false`
        - `allowWwwAlias: true`
        - `excludePaths: []`
      - Waits for response and enforces **minimum 450ms** duration before `loading = false`.
    - While `loading`: renders `<LoadingSplash />` full-screen.
    - On success: stores `data: CollectResponse` = `{ logs: string[], result: { urls, source, ... } }`.

- **Tabs behavior**
  - Tabs: `components/AnalyzeTabs.tsx`.
  - Types: `"sitemap" | "page-types" | "figma" | "importance"`.
  - Active tab derived from `view` query param via `getViewFromParams(searchParams)`, default `"sitemap"`.
  - `handleTabClick(view)`:
    - Uses `router.replace(buildAnalyzeUrl(base, depth, view))`.
    - `buildAnalyzeUrl` keeps `base` and `depth`, only adds `view` when not `"sitemap"`.
  - Effect: **no refetch on tab change** because the data fetch only depends on `base` and `depth`.

- **View-specific behavior**
  - **Sitemap View** (`view === "sitemap"`, default):
    - Renders:
      - Summary cards: Total URLs, Source, Depth, Logs.
      - Inline URL table (URL / Depth / Query / External) from `data.result.urls`.
      - `InsightsPanel` for heuristic Insight Score and Priority Fixes.
  - **Page Types View** (`view === "page-types"`):
    - `PageTypesPanel` classifies each URL into:
      - `landing`, `internal`, `param`, `asset`, `external`.
    - Based on:
      - Host comparison vs. `baseUrl` (for `external`).
      - File extension match (`ASSET_EXT`).
      - Presence of `?` / `#`.
      - Path patterns (`/`, `/home`, `/index`, `/index.html`).
    - Provides:
      - Type counters.
      - Filter cards and chips.
      - Filtered URL table via `UrlListTable`.
  - **Figma Ready View** (`view === "figma"`):
    - `FigmaReadyPanel`:
      - Excludes:
        - External domains.
        - Asset URLs.
        - URLs containing `?` or `#`.
      - Assigns priorities by pathname patterns (landing, pricing, features, solutions, docs, etc.).
      - Shows recommended URLs list with depth and “Copy list” (clipboard) button.
  - **Importance View** (`view === "importance"`):
    - `ImportancePanel`:
      - Computes per-URL importance score (0–100) from:
        - Key page bonuses.
        - Depth penalties.
        - Param penalties.
      - Sorts all URLs, shows top 20 with color-coded score badges and tooltips.

- **Recent searches persistence**
  - Module: `lib/clientStorage.ts`.
  - LocalStorage key: `webscout_recent`.
  - `addRecent(url, max = 10)`:
    - Trims URL, dedupes, stores `{ url, at }` list capped at `max`.
  - `getRecents()` reads the list; used by `components/RecentSearches.tsx`.
  - Home page:
    - `RecentSearches` renders prior URLs; clicking one sets `loading` and navigates to `/analyze?base=<...>&depth=2`.

- **Bookmarks persistence**
  - Same module: `lib/clientStorage.ts`.
  - LocalStorage key: `webscout_bookmarks`.
  - `toggleBookmark(url)`:
    - Toggles presence in `BookmarkItem[]` and returns `{ list, bookmarked }`.
  - `isBookmarked(url)` checks membership.
  - Analyze header:
    - Shows “Bookmark” pill button when `base` is present.
    - Uses bookmark state driven by `isBookmarked(base)` and `toggleBookmark(base)`.

---

#### 2) API Behavior

- **Next.js `/api/collect` route (proxy)**
  - File: `app/api/collect/route.ts`.
  - Upstream target:
    - `UPSTREAM_COLLECT_URL = process.env.COLLECT_API_URL ?? "http://localhost:3003/api/collect"`.
  - `POST` handler:
    - Parses `req.json()`; on failure returns `400` with `{ error: { message: "Invalid JSON body" } }`.
    - Forwards body as JSON to `UPSTREAM_COLLECT_URL`.
    - On network error:
      - Logs `"Collect upstream error"`, returns `502` with `{ error: { message: "Unable to reach collect API" } }`.
    - Reads upstream as **text** (NDJSON), splits by newlines, JSON-parses each line:
      - Collects `type === "log"` messages as `logs: string[]`.
      - Uses last `type === "done"` message as `result` (or `null` if none).
    - Returns:
      ```json
      {
        "logs": ["..."],
        "result": { "urls": [...], "source": "...", ... }
      }
      ```

- **Express `/api/collect` (baseline backend)**
  - File: `webscout-agent/server.js`.
  - Input:
    - `baseUrl` or `base` (string).
    - `depth` (default 3, clamped 1–10).
    - `max` (default 5000, clamped 1–50000).
    - `stripQuery` (boolean).
    - `allowWwwAlias` (default `true`).
    - `excludePaths` (array or comma-separated string; normalized and capped at 50).
  - Validation:
    - Calls `validateBaseUrl(baseUrl)` from `webscout-agent/lib/validate-url.js`:
      - Enforces http/https.
      - Blocks localhost, private IP ranges, metadata IPs, and disallowed ports.
  - Response:
    - `Content-Type: application/x-ndjson`.
    - Streams JSON lines:
      - `{ "type": "log", "msg": string }`.
      - Final `{ "type": "done", "urls": [...], "metadata": {...}, "source": "sitemap"|"crawl" }`.

- **Other backend routes (baseline-only, AI-related)**
  - `/api/ai-insight`, `/api/landing-insights`, `/api/content-strategy`:
    - AI-backed analysis via `services/ai.js`.
  - `webscout-next` does **not** call any of these routes; only `/api/collect` is used.

---

#### 3) Insight System (Next.js, heuristic-only)

- **No LLM / AI logic in `webscout-next`**
  - Insight-related components:
    - `components/InsightsPanel.tsx`
    - `components/FigmaReadyPanel.tsx`
    - `components/PageTypesPanel.tsx`
    - `components/ImportancePanel.tsx`
  - All of them derive scores from:
    - URL path patterns.
    - Depth (`pathDepth`).
    - Flags (`hasQuery`, `external`).
    - Optional metadata (`linkCount` in baseline, though not fully used in Next).
  - There are **no** imports of `services/ai.js` or AI endpoints in `webscout-next`.

- **Insight Score (site-level)**
  - Implemented in `computeInsightScore(urls, maxDepth)` in `InsightsPanel.tsx`:
    - `internalUrls = urls.filter(u => !u.external)`.
    - `keyPageCount` = internal URLs whose `url` matches:
      - `/pricing`, `/features|/product`, `/solutions`, `/blog`, `/docs`, `/about`, `/contact`, `/careers`.
    - `keyPageScore = min(1, keyPageCount / 4) * 40` (0–40 pts).
    - `shallow` = internal URLs with `(pathDepth <= 2 && !hasQuery)`.
    - `shallowRatio = shallow / internalUrls.length` (0 if none).
    - `depthScore = round(shallowRatio * 60)` (0–60 pts).
    - Final score = `min(100, round(keyPageScore + depthScore))`.

- **Priority Fixes (site-level)**
  - `computePriorityFixes(urls)`:
    - `internal = urls.filter(u => !u.external)`.
    - Adds up to 5 `{ page, reason }` entries:
      - Deepest 2 URLs (by `pathDepth`) with `pathDepth >= 4` → `"Deep path (depth X)"`.
      - First 2 URLs with `hasQuery` → `"Parameterized URL — consider canonical"`.
      - First 2 URLs that look like assets (extensions or `/assets/|/static/`) → `"Asset in crawl — review inclusion"`.
  - `InsightsPanel` uses backend-provided `priorityFixes` if present; otherwise computes locally.

- **Figma Ready logic**
  - `FigmaReadyPanel`:
    - Excludes URLs that are:
      - External (hostname different from base domain).
      - Assets (by extension).
      - Parameterized (`?` or `#`).
    - Remaining URLs are sorted by path priority (`PRIORITY_PATTERNS`) into a recommended list.
    - “Copy list” copies all recommended URLs to clipboard.
    - No AI; uses only path/host heuristics.

- **Importance scoring logic**
  - `ImportancePanel`:
    - `computeImportance(url)`:
      - Starts with base `score = 50`.
      - Adds key page bonuses (landing, pricing, features, solutions, blog, etc.).
      - Applies `Depth` penalty:
        - `depthPen = min(pathDepth * 8, 40)`; subtracts and records `Depth X (-Y)` in reasoning.
      - Applies `Param` penalty:
        - `-15` if `hasQuery` or URL includes `?` / `#`.
      - Clamps 0–100 and returns `ScoredUrl` with `reasoning[]`.
    - `ImportancePanel` sorts URLs by `score` and shows top 20 with badges and tooltips.

---

### PART 2 — Feature Parity Audit

#### Overview Table

| Feature | Baseline Behavior | Current Behavior | Status | Evidence |
|--------|--------------------|------------------|--------|----------|
| **Depth control** | User input `depth` (default 3, clamped 1–10) passed to `/api/collect`. | `depth` hard-coded to `2` in `app/page.tsx`; user cannot change. | Partial | Baseline: `public/app.js` (`depthEl`, chips). Current: `app/page.tsx` uses `depth = 2`. |
| **Max URLs control** | User input `max` (default 5000, clamped 1–50000). | `max` fixed at `5000` in `app/analyze/page.tsx`; no UI. | Partial | Baseline: `server.js` clamps `max`. Current: body `max: 5000`. |
| **Strip query toggle** | `stripQuery` checkbox influences crawler behavior. | Always `stripQuery: false`; no UI. | Missing | Baseline: `stripQueryEl` and `queryChip` in `public/app.js`. Current: constant `false` in `app/analyze/page.tsx`. |
| **www/non-www alias toggle** | `allowWwwAlias` checkbox. | Always `allowWwwAlias: true`; no UI. | Partial | Baseline: `allowWwwAliasEl` and `wwwChip`. Current: constant `true` in `app/analyze/page.tsx`. |
| **Exclude patterns** | Textbox `excludePaths`; applied server-side and client-side filter. | `excludePaths: []` hard-coded; no client filter text. | Missing | Baseline: `excludePathsEl` and `applyFilters` in `public/app.js`. Current: body uses empty array. |
| **Sitemap View** | Full tree view with insight engine, selection, export, AI-integrated scores. | Flat URL table + summary + simple `InsightsPanel`; no tree, no JSON export. | Partial | Baseline: `buildSitemapTreeWithInsights` + `renderSitemapTree`. Current: `app/analyze/page.tsx` + `UrlListTable.tsx` + `InsightsPanel.tsx`. |
| **Page Types** | Buckets into marketing/product/support/other (strategist-oriented). | Buckets into landing/internal/param/asset/external (crawl/type oriented). | OK (different taxonomy, same intent) | Baseline: `renderPageTypes` in `public/app.js`. Current: `components/PageTypesPanel.tsx`. |
| **Figma Ready** | Uses `calculateFigmaScore` and `urlMetadata` (`linkCount`, etc.) to quantify readiness. | Filters URLs via host/asset/param heuristics; no metadata, simple ordering. | Partial | Baseline: `renderFigmaReadiness` in `public/app.js`. Current: `components/FigmaReadyPanel.tsx`. |
| **Importance View** | Uses `linkCount` (graph centrality proxy) to rank URLs. | Uses new heuristic combining key page patterns, depth, and params; ignores `linkCount`. | Partial | Baseline: `renderImportance` in `public/app.js`. Current: `components/ImportancePanel.tsx`. |
| **Heuristic Insight Score** | Insight engine computes per-node `insightScore`, `seoScore`, `uxScore`, plus view-based thresholds. | Single site-level `Insight Score` (0–100) from key-page coverage + shallow ratio; no node-level scores. | Partial | Baseline: `public/insightEngine.js`. Current: `components/InsightsPanel.tsx`. |
| **Priority Fix logic** | Multiple categories (funnel, design debt, content coverage, conversion, QA). | Simple list of up to 5 page-level fixes (deep path, param, asset). | Partial | Baseline: `calculateFunnelHealth`, `calculateDesignDebt`, etc. Current: `computePriorityFixes` in `InsightsPanel.tsx`. |
| **AI Insight endpoints** | `/api/ai-insight`, `/api/landing-insights`, `/api/content-strategy`; UI buttons and overlays. | Not wired at all from `webscout-next`; only `/api/collect` is used. | Missing (by design) | Baseline: `server.js` and AI sections in `public/app.js`. Current: no references. |
| **Loading behavior** | In-SPA “Collecting…” states with progress messages. | Fullscreen `LoadingSplash` while Next.js waits on `/api/collect` proxy. | OK | Current: `components/LoadingSplash.tsx`, `app/analyze/page.tsx`. |
| **Header / hero duplication** | Single SPA; hero only on main view. | Shared logo header in `app/layout.tsx`; hero only on home; analyze uses same header, no extra hero. | OK | Current: `app/layout.tsx`, `app/page.tsx`, `app/analyze/page.tsx`. |
| **Tab navigation refetch** | Tabs are client-state; no extra network. | Tabs only change `view` param; fetch depends on `base`/`depth` → no re-collect. | OK | Current: `AnalyzeTabs.tsx`, `useEffect` in `app/analyze/page.tsx`. |
| **Recent searches** | Originally in SPA, now stubbed in `public/app.js` as no-op (delegated). | Implemented in Next with `localStorage` via `clientStorage.ts` and `RecentSearches.tsx`. | OK | Baseline: `getRecentDomains` now returns `[]`. Current: `lib/clientStorage.ts`, `app/page.tsx`. |
| **Bookmarks / favorites** | SPA favorites functions now no-op, delegated to Next. | Implemented in Next via `BOOKMARKS_KEY` and analyze header bookmark toggle. | OK | Baseline: `addFavorite` no-op. Current: `lib/clientStorage.ts`, `app/analyze/page.tsx`. |

---

### PART 3 — Security Audit

#### 1) SSRF Protection

- **Backend (Express)**
  - `validateBaseUrl` (`webscout-agent/lib/validate-url.js`) enforces:
    - Scheme: only `http` or `https`.
    - No embedded credentials (`username` / `password`).
    - Blocks:
      - `localhost`, `127.0.0.1`, `0.0.0.0`, `::1`, `.local` hostnames.
      - Private IPv4 ranges, loopback, link-local, and metadata IPs (e.g. `169.254.169.254`).
      - Direct IP forms (decimal/hex/octal) that map into those ranges.
      - Ports not in `{80, 443}`.
    - DNS lookup of hostname; rejects any resolved address which is “private” per above.
  - `/api/collect` in `server.js` requires `validateBaseUrl(baseUrl).ok` before crawling.

- **Next.js `/api/collect` route**
  - Does **no local URL validation**; trusts the body and forwards to upstream.
  - SSRF protections are therefore provided by the Express backend, **as long as** `COLLECT_API_URL` points to that service.

#### 2) XSS Protection

- **Safe patterns**
  - React JSX only; no `dangerouslySetInnerHTML`.
  - External links use `target="_blank" rel="noopener noreferrer"` to mitigate tab-nabbing.

- **Gap vs baseline**
  - Baseline SPA:
    - Uses `safeHref(url)` and `isSafeHref(url)` to only allow `http(s)` links in `<a href>`.
  - Current Next app:
    - Renders raw `href={u.url}` in:
      - `UrlListTable.tsx`.
      - `FigmaReadyPanel.tsx`.
      - `ImportancePanel.tsx`.
      - `InsightsPanel` priority fixes list.
    - Does **not** block `javascript:` / `data:` or other dangerous schemes if they appear in crawl results.
  - Risk:
    - Malicious or unexpected URLs discovered during crawl could be rendered as clickable links and execute in the WebScout origin.

#### 3) Rate Limiting

- **Backend**
  - `createRateLimitStore` + `rateLimit` middleware in `server.js`:
    - `/api/collect`: 60s window, max `RATE_LIMIT_COLLECT` (default 10) per `ip+ua+origin`.
    - `/api/ai-insight`, `/api/landing-insights`, `/api/content-strategy`: rate-limited as well.

- **Next.js**
  - `/api/collect` route has **no extra rate limit**, but calls the rate-limited backend.
  - No other heavy routes in `webscout-next`.

#### 4) Payload Safety

- **Backend safeguards**
  - `express.json({ limit: "1mb" })`.
  - `depth` clamped 1–10.
  - `max` clamped 1–50000.
  - `excludePaths` normalized and capped at 50.
  - AI routes further cap URLs via `filterAndLimitUrls` (max 500).

- **Next.js behavior**
  - Sends conservative defaults (`depth: 2`, `max: 5000`, `stripQuery: false`).
  - All heavy processing occurs in the backend; `webscout-next` only holds the result JSON in memory.

#### 5) Production Readiness (Config & Proxy)

| Control | Status | Evidence | Fix (if needed) |
|--------|--------|----------|------------------|
| **SSRF protection on base URL** | OK (backend) | `validateBaseUrl` used in `/api/collect` in `server.js`. | Ensure `COLLECT_API_URL` always targets this server; avoid alternate collectors without equivalent checks. |
| **Scheme restriction** | OK | `scheme !== "http"/"https"` rejected in `validateBaseUrl`. | None. |
| **Localhost/private/metadata block** | OK | `isPrivateIp`, `isBlockedIpv4`, `BLOCKED_HOSTNAMES`. | None. |
| **Safe link rendering** | Needs Hardening | Baseline uses `safeHref`; Next renders `href={u.url}` directly. | Add a `safeHref(url)` helper in `webscout-next` and wrap all `<a href>` usages with it. |
| **No unsafe innerHTML** | OK | No `dangerouslySetInnerHTML`. | None. |
| **Rate limiting** | OK (backend) | `rateLimit` middleware for `/api/collect` and AI routes. | Ensure all crawls go through this backend. |
| **Payload limits / max URLs** | OK | `MAX_JSON_BODY`, `depth`/`max` clamping, `filterAndLimitUrls`. | None. |
| **Hardcoded localhost in proxy** | Needs Hardening | `UPSTREAM_COLLECT_URL` falls back to `http://localhost:3003/api/collect`. | In production, require `COLLECT_API_URL` and fail fast if unset instead of defaulting. |
| **Env handling** | OK | Uses `process.env` without leaking secrets. | None. |
| **Proxy behavior** | OK | Thin forwarder; passes JSON; returns aggregated logs/result. | Document backend as the single security boundary. |

---

### PART 4 — Final Verdict

- **Production readiness score**: **78 / 100**

#### Critical Issues (Must Fix)

1. **Unsafe `href` handling in Next.js**
   - Problem: All URL links are using raw `href={url}`; baseline guarded against dangerous schemes.
   - Risk: Crawled `javascript:`/`data:` URLs could be rendered and executed in the WebScout origin.
   - Fix: Implement a `safeHref(url: string)` helper in `webscout-next` (allow only `http(s)`), and use it everywhere links are rendered.

2. **Proxy’s reliance on backend for SSRF safety**
   - Problem: Next `/api/collect` trusts `COLLECT_API_URL` to point at the hardened backend.
   - Risk: Misconfiguration could route to an unprotected collector and reintroduce SSRF.
   - Fix: Enforce `COLLECT_API_URL` in production (no localhost default), and consider duplicating a minimal version of `validateBaseUrlSync` in the Next route as a defense-in-depth check.

#### Medium Issues

1. **Crawl control parity gaps**
   - `depth`, `max`, `stripQuery`, `excludePaths`, `allowWwwAlias` are user-tunable in baseline but fixed in Next.
   - Effect: Functionally safe but less flexible; behavior differs from baseline’s UI expectations.

2. **Heuristic drift**
   - `Figma Ready`, `Importance`, and `Insight Score` in Next use different heuristics than the baseline insight engine.
   - Effect: Different rankings and scores compared to the existing production behavior, although still deterministic and local.

3. **Localhost default in proxy**
   - In non-dev environments without `COLLECT_API_URL`, Next will quietly attempt `http://localhost:3003/api/collect`.
   - Better to fail-fast with a clear configuration error.

#### Optional Improvements (Non-AI, Non-UI-Structure)

- Add **cheap base-URL validation** (using a sync subset of `validateBaseUrl`) to `/api/collect` in `webscout-next` as defense-in-depth.
- Narrow error messages from upstream in the Next proxy to avoid echoing raw backend error bodies to clients if they ever contain stack traces or internal details.
- Make the importance and Figma heuristics optionally consume backend `metadata` (`linkCount`) when available, to be closer to baseline behavior while still remaining heuristic-only.

All recommendations above preserve the current product scope and UI; they focus only on hardening, parity with the existing agent, and keeping behavior predictable in production.

