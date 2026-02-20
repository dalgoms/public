# Agent Flow

WebScout Agent follows a structured discovery and normalization flow to transform a domain input into a clean, exportable URL list.

## Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    INPUT DOMAIN                             │
│              https://example.com                            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              STEP 1: DISCOVERY                              │
│                                                             │
│  ┌──────────────────────────────────────┐                  │
│  │  1.1 Check robots.txt                │                  │
│  │     → Extract Sitemap URLs           │                  │
│  └──────────────┬───────────────────────┘                  │
│                 │                                           │
│  ┌──────────────▼───────────────────────┐                  │
│  │  1.2 Try sitemap.xml                 │                  │
│  │     → Parse <loc> tags               │                  │
│  └──────────────┬───────────────────────┘                  │
│                 │                                           │
│  ┌──────────────▼───────────────────────┐                  │
│  │  1.3 Try sitemap_index.xml           │                  │
│  │     → Follow sub-sitemaps            │                  │
│  └──────────────┬───────────────────────┘                  │
│                 │                                           │
│         ┌───────┴───────┐                                  │
│         │               │                                  │
│    Found?            Not Found?                            │
│         │               │                                  │
│         ▼               ▼                                  │
│  ┌──────────┐    ┌──────────────┐                         │
│  │ Sitemap  │    │  1.4 Crawl   │                         │
│  │  URLs    │    │  Internal    │                         │
│  └──────────┘    │   Links      │                         │
│                  └──────────────┘                         │
└────────────────────┬───────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              STEP 2: NORMALIZATION                          │
│                                                             │
│  ┌──────────────────────────────────────┐                  │
│  │  2.1 Remove hash fragments          │                  │
│  │     example.com/page#section        │                  │
│  │     → example.com/page              │                  │
│  └──────────────────────────────────────┘                  │
│                                                             │
│  ┌──────────────────────────────────────┐                  │
│  │  2.2 www/non-www merge              │                  │
│  │     www.example.com                 │                  │
│  │     example.com                     │                  │
│  │     → Treated as same site          │                  │
│  └──────────────────────────────────────┘                  │
│                                                             │
│  ┌──────────────────────────────────────┐                  │
│  │  2.3 Query stripping (optional)     │                  │
│  │     example.com/page?utm=123        │                  │
│  │     → example.com/page              │                  │
│  └──────────────────────────────────────┘                  │
│                                                             │
│  ┌──────────────────────────────────────┐                  │
│  │  2.4 Exclude paths (optional)       │                  │
│  │     /admin, /api, /private         │                  │
│  │     → Filtered out                 │                  │
│  └──────────────────────────────────────┘                  │
└────────────────────┬───────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              STEP 3: STRUCTURING                            │
│                                                             │
│  ┌──────────────────────────────────────┐                  │
│  │  3.1 Calculate path depth            │                  │
│  │     / → depth 0                     │                  │
│  │     /about → depth 1                │                  │
│  │     /blog/post → depth 2            │                  │
│  └──────────────────────────────────────┘                  │
│                                                             │
│  ┌──────────────────────────────────────┐                  │
│  │  3.2 Track link relationships       │                  │
│  │     → Build link map                │                  │
│  │     → Calculate importance          │                  │
│  └──────────────────────────────────────┘                  │
│                                                             │
│  ┌──────────────────────────────────────┐                  │
│  │  3.3 Classify page types            │                  │
│  │     → marketing/product/support     │                  │
│  └──────────────────────────────────────┘                  │
│                                                             │
│  ┌──────────────────────────────────────┐                  │
│  │  3.4 Calculate Figma readiness      │                  │
│  │     → Score based on URL quality    │                  │
│  └──────────────────────────────────────┘                  │
└────────────────────┬───────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              STEP 4: EXPORT                                 │
│                                                             │
│  ┌──────────────────────────────────────┐                  │
│  │  4.1 Sort URLs                       │                  │
│  │     → Alphabetical order             │                  │
│  └──────────────────────────────────────┘                  │
│                                                             │
│  ┌──────────────────────────────────────┐                  │
│  │  4.2 Generate urls.txt              │                  │
│  │     → One URL per line              │                  │
│  │     → Figma-ready format            │                  │
│  └──────────────────────────────────────┘                  │
│                                                             │
│  ┌──────────────────────────────────────┐                  │
│  │  4.3 Generate urls.csv              │                  │
│  │     → CSV format                    │                  │
│  │     → Includes metadata             │                  │
│  └──────────────────────────────────────┘                  │
└─────────────────────────────────────────────────────────────┘
```

## Detailed Steps

### Step 1: Discovery

**Goal**: Find all URLs from the target website

**Methods** (in priority order):

1. **Robots.txt Parsing**
   - Fetch `/robots.txt`
   - Extract `Sitemap:` directives
   - Add to sitemap candidate list

2. **Sitemap.xml Parsing**
   - Try `/sitemap.xml`
   - Extract all `<loc>` tags
   - Return URL list if found

3. **Sitemap Index Parsing**
   - Try `/sitemap_index.xml`
   - Parse sub-sitemap references
   - Fetch each sub-sitemap
   - Aggregate all URLs

4. **Internal Link Crawling** (Fallback)
   - Start from base URL
   - Extract `<a href>` links from HTML
   - Follow same-site links recursively
   - Respect depth and max limits
   - Track link relationships

**Output**: Array of raw URLs

### Step 2: Normalization

**Goal**: Clean and standardize URLs

**Operations**:

1. **Hash Removal**
   - Remove `#fragment` from all URLs
   - Prevents duplicate pages

2. **www/non-www Merge**
   - Normalize hostname
   - Treat `www.example.com` = `example.com`
   - Configurable via `allowWwwAlias`

3. **Query Stripping** (Optional)
   - Remove `?param=value` if `stripQuery=true`
   - Useful for Figma import (clean URLs)

4. **Path Exclusion**
   - Filter out paths matching exclude list
   - Example: `/admin`, `/api`, `/private`
   - Prefix matching

**Output**: Normalized URL array

### Step 3: Structuring

**Goal**: Add metadata and insights

**Metadata Added**:

1. **Path Depth**
   - Count path segments
   - `/` = 0, `/about` = 1, `/blog/post` = 2

2. **Link Relationships**
   - Track which pages link to which
   - Calculate link count per URL
   - Used for importance scoring

3. **Page Type Classification**
   - Analyze path patterns
   - Categories: marketing, product, support, other
   - Based on keywords (`/blog`, `/docs`, `/dashboard`)

4. **Figma Readiness Score**
   - Clean URL: +10
   - Short path: +10
   - No hash: +5
   - Has metadata: +15
   - Common patterns: +10
   - Max: 100

**Output**: Enriched URL objects with metadata

### Step 4: Export

**Goal**: Generate files ready for Figma

**Formats**:

1. **urls.txt**
   - One URL per line
   - No headers
   - Compatible with html.to.design
   - Example:
     ```
     https://example.com
     https://example.com/about
     https://example.com/blog
     ```

2. **urls.csv**
   - CSV format with headers
   - Includes metadata columns
   - Spreadsheet-compatible
   - Example:
     ```csv
     url,pathDepth,hasQuery,external
     https://example.com,0,false,false
     https://example.com/about,1,false,false
     ```

**Output**: Files ready for download/import

## Error Handling

- **Sitemap not found**: Falls back to crawling
- **Crawl fails**: Returns partial results
- **Invalid URL**: Skips and continues
- **Network error**: Retries once, then skips
- **Rate limiting**: Respects 150ms delay

## Performance

- **Sitemap**: ~1-2 seconds for 1000 URLs
- **Crawl**: ~15-30 seconds for 100 URLs (150ms delay)
- **Memory**: Streams results, minimal memory usage
- **Concurrent**: Single-threaded, sequential requests

## Limitations

- No JavaScript rendering (SPA sites may miss URLs)
- No authentication (public pages only)
- No rate limit detection (may be blocked)
- No duplicate detection across www/non-www (handled in normalization)
