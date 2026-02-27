## 01 — Product Overview

### What WebScout Does

WebScout is a **site structure intelligence tool** that crawls a website and turns the results into:

- A **sitemap view** with depth, query, and external link signals  
- **Heuristic insight scores** (overall, SEO, UX / structure)  
- **Prioritized URL lists** for design/IA work (Figma-ready, importance view)  
- **Bookmarking and export tools** for collaboration and handoff

The goal is to help UX strategists, marketers, and product teams:

- Benchmark **competitor IA and page mix** quickly  
- Discover **hidden or “deep” pages** that are hard to see from the main nav  
- Build **cleaner information architectures** for redesign projects  
- Prepare **Figma-ready URL lists** without manual sorting in spreadsheets

### Primary User Flow

1. **Home (`/`)**
   - User enters a full `https://` URL into the hero input.
   - If the input is invalid, a **dark toast** explains the requirement instead of a blocking alert.
   - On success, the app routes to `/analyze?base=<url>&depth=2` with a unified **LoadingSplash** animation.

2. **Analyze (`/analyze`)**
   - Shows the crawl context at the top:
     - `WebScout Analysis`
     - `Analyzing https://… — link analysis for this domain.`
   - Tabs allow the user to explore:
     - `Sitemap View`
     - `Page Types`
     - `Figma Ready`
     - `Importance`
   - The **Sitemap View** is the primary workspace with:
     - Summary cards (Total URLs, Source, Depth, Logs)
     - Insights panel (Insight Score, SEO, UX / Structure, priority fixes)
     - URL table with depth / query / external signals, selection, bookmark, and export.

3. **Meta Ads & External Research**
   - A dedicated **Meta Ads** button sits next to the `Export` control.
   - It opens the Facebook Ads Library in a new tab with prefilled query parameters, making it easy to jump from IA analysis to ad creative research.

### Positioning (for README / marketing copy)

- **Tagline**: “One prompt is just a start. WebScout learns and improves with you.”  
- **Usage line**: “Start with a URL. See your structure clearly.”  

WebScout is opinionated but light-weight: it does not try to be a full SEO crawler or analytics tool. Instead, it focuses on the **shape and depth of a site**, surfaces key pages, and helps teams make better information architecture decisions faster.

