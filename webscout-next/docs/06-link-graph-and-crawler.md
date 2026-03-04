# 06 — Link Graph & Graph-Friendly Crawler

This document captures the design intent for **source → target link tracking** and a **graph-friendly crawler** so future backend work can build toward a full link graph.

## Why track source → target?

Once the crawler tracks **which page links to which** (source → target), we can represent the site as a **link graph**. That enables:

| Feature | Description |
|--------|-------------|
| **Key page detection** | Pages with many inbound links (hubs) are likely important (e.g. homepage, main landing pages). |
| **Orphan page detection** | Pages with zero inbound internal links are candidates for poor IA or dead ends. |
| **PageRank-style importance** | Simple importance scoring based on link structure, not just depth or URL patterns. |

The first step (already planned) is **internal link count** per URL (`internalLinkCount`). That is the in-degree of each node in the graph. Keeping the crawler structure graph-friendly means we can later add:

- Explicit **edges** (source URL, target URL) if we need to compute more than in-degree (e.g. full PageRank, path analysis).
- **Out-degree** or full adjacency if we want “pages this URL links to” in the UI or exports.

## Design principles for the crawler

1. **Track source when extracting links**  
   For every internal link discovered, store (or have access to) the page it was found on (source) and the linked URL (target).

2. **Aggregate counts for the current API**  
   For each target URL, increment a counter. Expose this as `internalLinkCount` in the collect `done` payload so the frontend can show “In-links” without changing the response shape drastically.

3. **Keep the model extensible**  
   Prefer a structure that could later emit or store full edge list (source, target) or graph representation without a redesign—e.g. internal data structures that already record edges, with `internalLinkCount` as a derived view.

4. **Frontend is ready**  
   The Next.js app already supports optional `internalLinkCount` on each URL and displays it in the Sitemap table as “In-links” (or “-” when not provided). Backend only needs to populate the field.

## Future extensions (after link graph exists)

- **Orphan highlight** in the UI (e.g. badge or filter for “0 in-links”).
- **Key page highlight** (e.g. high in-link count or simple score).
- **Export** of node list with in/out degree or full edge list for external analysis.
- **Optional PageRank (or similar)** computed server-side and exposed as a score per URL.

Keeping the crawler graph-friendly from the start makes these features straightforward to add later.
