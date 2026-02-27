## 04 — Technical & Security Notes

This document highlights the important technical and security-related decisions made in the first hardening pass. For a more exhaustive reference, see `WEBSCOUT_AUDIT.md` in the project root.

### 1. Architecture Overview

- **Frontend**: Next.js App Router (`app/`), React, Tailwind CSS.
- **Backend**: Existing Express-based collector (`webscout-agent`) remains the single source of truth for crawling.
- **Bridge**: Next.js API route `/api/collect` acts as a proxy to the Express collector.

The goal is to modernize the **UX shell** without rewriting the crawling engine.

### 2. `/api/collect` Proxy & SSRF Hardening

File: `app/api/collect/route.ts`

- Reads the upstream URL from `process.env.COLLECT_API_URL`.
- In **development only**, falls back to `http://localhost:3003/api/collect` if the env is missing.
- In **production**, the env must be set; there is no silent localhost fallback.
- On errors:
  - Returns a structured `{ error: { message } }` payload.
  - The analyze page surfaces user-friendly messages such as:  
    `Hmm… we couldn’t reach that site!`

This setup ensures that:

- The public Next.js app never talks directly to arbitrary external hosts from server-side code.
- Operations are pinned to a **single, controlled collector endpoint**, which can enforce its own URL validation and anti-SSRF rules.

### 3. XSS & Link Safety

- Introduced a `safeHref` utility to sanitize all outgoing links in the UI:
  - Blocks dangerous schemes like `javascript:` or `data:`.
  - Returns `"#"` and a disabled style when blocked.
- All URL renders in the Sitemap table and Priority Fixes list run through `safeHref`.

This defends against:

- Malicious HTML/JS that might be stored or proxied back through the collector.
- Accidental clicking of non-HTTP(S) schemes forwarded from upstream.

### 4. Query Handling & URL Normalization

- URL items from the collector are normalized via `normalizeUrls` so that each entry has:
  - A consistent shape (`url`, `depth`, `hasQuery`, `external`, etc.).
- Query awareness:
  - `stripQuery` is explicitly set to `false` when requesting from `/api/collect` so parameters can be preserved.
  - The UI’s **Query** column computes “Yes” when:
    - `hasQuery === true`, or
    - the raw URL contains `?` or `#`.

Result: the user can accurately see whether query parameters are involved, which is important when cross-checking against tools like the Meta Ads Library.

### 5. Local Storage & Client State

- `lib/clientStorage.ts` is limited to **recent searches**:
  - Key: `webscout_recent`.
  - Stores `{ url, at }` entries, capped to a small history.
- URL-level **bookmarks** are managed via `hooks/useUrlBookmarks.ts`:
  - Stores an array of URL strings in `localStorage`.
  - Exposes helpers:
    - `bookmarks`
    - `isBookmarked`
    - `toggleBookmark`
    - `clearAllBookmarks`
  - No sensitive information is persisted.

### 6. Error Handling & UX

- Analyze page manages three key states:
  - `loading`
  - `error`
  - `data`
- Error display:
  - Uses a soft red card with the user-friendly message.
  - Includes a **Back** button wired to `router.back()` for quick recovery after typing a bad URL.
- Loading state:
  - Enforces a minimum duration (~450ms) to avoid flickery UIs.
  - Uses a unified `LoadingSplash` and an inline card on Analyze for secondary “collect in progress” feedback.

### 7. What Is *Not* Implemented Yet (For Future Hardening)

The current first pass intentionally does **not** include:

- Authentication / user accounts.
- Rate limiting or crawl quotas per user.
- Detailed audit logs or observability integrations.
- Role-based access or team workspaces.

These belong to the **paid SaaS hardening phase** and can be layered on top of the existing architecture without changing the core crawl + analysis flow.

