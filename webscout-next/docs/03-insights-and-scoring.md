## 03 — Insights and Scoring

This document describes how the Insight-related scores work in the current implementation.

### 1. Insight Score Panel

Component: `components/InsightsPanel.tsx`

The panel surfaces three headline numbers:

- **Insight Score** — overall heuristic score (0–100)
- **SEO** — URL cleanliness and depth-oriented SEO score (0–100)
- **UX / Structure** — depth balance and key-page coverage (0–100)

All three scores are rendered as **`text-3xl font-bold`** for visual consistency. Each card includes a short description line underneath to explain what it measures.

### 2. Heuristic Inputs

The scoring is intentionally lightweight and explainable. It uses:

- **Depth information**:
  - Shallow URLs (depth 0–2) are rewarded.
  - Very deep URLs (depth ≥ 3) incur penalties.
- **Key page patterns**:
  - Paths that look like:
    - `/`, `/home`, `/index`
    - `/pricing`, `/plans`
    - `/features`, `/solutions`
    - `/about`, `/company`
    - `/contact`
  - These receive positive weight because they indicate a well-structured IA.
- **Query presence (`?`, `#`)**:
  - URLs with many parameters are treated as noisier or less canonical.
- **External vs internal**:
  - External links are relevant for crawl insight but do not directly improve structural clarity.

The exact formulas are simple additive heuristics, designed so that:

- A focused, shallow site with clear key pages trends toward **higher scores**.
- A scattered, deeply nested site with many parameterized URLs trends toward **lower scores**.

### 3. “How to improve scores” Tips

The Insights header includes a **Toss-like tips badge**:

- Button label: `How to improve scores`
- When clicked, it expands a **lightweight card** with:
  - A small neutral chip header:
    - Blue dot + “Quick tips to lift scores”
  - A compact list of practical tips:
    - Use clear key pages like `/pricing`, `/features`, `/about`, `/contact`.
    - Keep important URLs shallow (depth 1–2) with clean, readable paths.
    - Reduce parameterized URLs (`?utm=...`) or add canonical targets.
    - Avoid very deep paths; group content under hub/overview pages.

The tips card:

- Uses a subtle border and soft shadow (`rounded-2xl`, `border-neutral-200`, `shadow-sm`).
- Is intentionally low-contrast and compact so it does not overwhelm the main metrics.
- Is currently visible on desktop (`sm:` breakpoint) to keep the layout tidy on small screens.

### 4. Priority Fixes

Below the scorecards is the **Priority Fixes** list:

- Each item shows:
  - A link to the affected URL (safe via `safeHref`).
  - A pill describing the reason (e.g., shallow key page missing, deep important URL, many params).
- Reasons are rendered with a soft blue badge:
  - `text-[#008CFF]` on `bg-[#EBF5FF]` with a pill-shaped capsule.

The intent is:

- **Not** to be a full SEO audit.
- But to give **a small, focused list of structural improvements** that deliver the highest leverage for IA and UX.

### 5. Philosophy

The scoring system is:

- **Transparent** — based on understandable signals (depth, key page presence, query usage).
- **Heuristic, not absolute** — useful for comparison and conversation rather than hard grading.
- **Extensible** — future versions can plug in:
  - Analytics (traffic, conversions)
  - Content metadata (H1 presence, title patterns)
  - AI-generated quality checks

For now, it serves as a **conversation starter** between UX, marketing, and product stakeholders about how “healthy” a site structure is, and where to focus a redesign effort.

