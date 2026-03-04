## 02 — UX · UI First Pass (1차 고도화)

This document summarizes the first major UX/UI refinement pass for WebScout Next.

### 1. Home Page (`/`)

- **Hero headline**
  - `Search ✨ Website 💬 Perfect.` with brand icons.
  - Subheadline split into two deliberate lines on desktop:
    - `One prompt is just a start.`
    - `WebScout learns and improves with you.`
  - Subheadline color: `text-neutral-400` so the headline remains dominant.

- **Hero prompt**
  - Replaced `textarea` with a single-line `input` to avoid oversized carets and odd line heights.
  - Added `hero-prompt-shell` / `hero-prompt-inner` classes:
    - Soft Toss-like hover/focus treatment (subtle blue glow and border change).
    - Works without distracting animations.
  - Input caret color globally softened via `globals.css` (`caret-color: #d4d4d8`).

- **Onboarding helpers**
  - Under the prompt box:
    - `Start with a URL. See your structure clearly.` (small guidance copy).
    - `Try:` chips with example URLs (`https://yourbrand.com`, `https://competitor.com`) that pre-fill the input when clicked.

- **Validation & errors**
  - `isHttpUrl` enforces a full `http(s)://` URL.
  - Invalid input shows a **non-blocking toast** at the bottom of the screen instead of `alert()`.

- **Loading**
  - Unified onto a single `LoadingSplash` component using the `loadingbar.gif` asset.
  - Message: `Preparing analysis…`
  - Subtext clarifies expectations for heavy sites:  
    `This can take 10–30 seconds for larger sites.`

### 2. Analyze Header (`/analyze`)

- **Title & context**
  - `WebScout Analysis` heading.
  - Text below:
    - `Analyzing <base> — link analysis for this domain.`
    - Base URL highlighted in brand blue (`#008CFF`).

- **Layout robustness**
  - The long `Analyzing …` line now has a **max-width** and flex layout so that:
    - Long URLs can wrap without pushing the right-side buttons down.
    - Right-aligned actions stay aligned and unbroken.

- **Meta Ads & Export**
  - Right side of the header (visible when `base` exists):
    - `Meta Ads` button:
      - Capsule icon with “M” and compact label.
      - Links to the Facebook Ads Library with a prefilled query.
    - `Export` dropdown:
      - Uses the same `Download` icon and sizing as the Figma Ready export control.
      - Self-contained component that renders both trigger and menu so positioning is always correct.
  - Export dropdown options:
    - `Download filtered URLs (.txt)`
    - `Copy filtered URLs`
    - `Download bookmarks only (.txt)`
  - All export actions respect:
    - Depth filter
    - Bookmarked-only toggle
    - (Future) path filters

- **Error handling**
  - When the upstream collect returns an error:
    - User-facing copy: `Hmm… we couldn’t reach that site!`
    - Includes a **“Back to previous”** rounded button calling `router.back()` so the user can quickly retry or change the URL.

### 3. Sitemap View — URL Table & Controls

- **Summary cards**
  - Four cards at the top:
    - Total URLs (black card, white text)
    - Source
    - Depth
    - Logs

- **Depth filter**
  - Pills: `All`, `Depth 0`, `Depth 1`, `Depth 2`, `3+`.
  - Selected pill: black background with white text.
  - Filter updates reset page and selection state for clarity.

- **Bookmark UX**
  - URL-level bookmarks managed via `useUrlBookmarks` (localStorage).
  - Dedicated **action bar above the table**:
    - `Bookmark all (filtered)` — bookmarks all currently filtered URLs that are not yet bookmarked.
    - `Bookmark selected` — bookmarks only the rows the user has checked.
    - `Reset bookmarks` — clears all URL-level bookmarks.
  - `Bookmarked only (★ Bookmarked only (N))` toggle:
    - Pills style aligned with depth filters.
    - Shows the current count of bookmarked URLs.
  - Each row has a star icon:
    - Animated scale bump on toggle.
    - Blue when bookmarked, neutral when not.
    - Shows a short toast: `Bookmarked` or `Removed from bookmarks`.

- **Selection UX**
  - Row selection uses a custom `UrlCheckbox`:
    - 20px square, `rounded-md`.
    - Neutral border in default state.
    - Black background and white check SVG when selected.
    - Smooth `transition-all duration-150`.
  - Header checkbox:
    - Supports **indeterminate** state (some rows selected).
    - Toggles “select all visible on this page”.
  - Pagination:
    - Page size 50.
    - `Prev` / `Next` buttons with disabled states.
    - Changing filters or bookmarked-only resets back to page 1.

- **Table details**
  - Columns: URL, Depth, Query, External, Bookmark.
  - URL column uses `safeHref`:
    - Blocks unsafe schemes (e.g., `javascript:`).
    - Uses a muted style and `cursor-not-allowed` when blocked.
  - Query column:
    - Shows `Yes` when:
      - `u.hasQuery === true`, or
      - URL contains `?` or `#`.
    - Otherwise shows `-`.

### 4. Global Visual Refinements

- **Background**
  - Switched from gradient to a **clean, full white** background.

- **Scrollbars**
  - Both page and inner scroll areas use a lighter neutral gray (around Tailwind `neutral-200`) for a quieter, modern feel.

- **Caret & focus**
  - Global `caret-color` set to a soft gray to avoid heavy black “beams”.
  - `LoadingSplash` uses a `no-caret` utility to avoid stray carets on loading screens.

Overall, this pass aims to make WebScout feel like a modern, production-ready SaaS tool: light, confident, and fast to understand, while staying out of the way of actual IA analysis work.

