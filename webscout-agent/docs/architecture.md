# Architecture

WebScout Agent is built with a simple, serverless-friendly architecture optimized for Vercel deployment.

## System Overview

```
┌─────────────────┐
│   Web Browser   │
│   (Frontend)    │
└────────┬────────┘
         │ HTTP/SSE
         │
┌────────▼────────┐
│  Express Server │
│   (server.js)   │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌──▼────────┐
│Static │ │  API      │
│Files  │ │ /api/collect
└───────┘ └──┬────────┘
             │
      ┌──────▼──────┐
      │ collect-urls│
      │    .mjs     │
      └─────────────┘
```

## Components

### 1. Express Server (`server.js`)

**Purpose**: Serves static files and handles API requests

**Responsibilities**:
- Static file serving (`public/` directory)
- Health check endpoint (`GET /health`)
- URL collection API (`POST /api/collect`)
- Server-Sent Events (NDJSON streaming) for real-time progress

**Key Features**:
- Auto port detection (3001-3010)
- Vercel-compatible export
- Local development support

### 2. Collection Engine (`collect-urls.mjs`)

**Purpose**: Core URL discovery and processing logic

**Flow**:
1. **Context Creation** - Normalize base URL, create same-site checker
2. **Sitemap Discovery** - Try robots.txt → sitemap.xml → sitemap_index.xml
3. **Crawl Fallback** - If no sitemap, crawl internal links
4. **URL Enrichment** - Add metadata (depth, query, external flag)
5. **Filtering** - Apply exclude paths, query stripping
6. **Return** - Structured URL array with metadata

**Key Functions**:
- `createContext(baseUrl, options)` - URL normalization context
- `trySitemap(baseUrl, ctx)` - Sitemap discovery
- `crawlInternal(startUrl, depthLimit, maxCount, ctx)` - Link crawling
- `enrichUrls(urlList, opts)` - Add metadata and filter
- `collectUrls(baseUrl, options)` - Main export function

### 3. Web Dashboard (`public/`)

**Purpose**: User-facing interface

**Files**:
- `index.html` - Structure and layout
- `style.css` - Styling with CSS custom properties
- `app.js` - Client-side logic and state management

**Key Features**:
- Real-time progress updates via SSE
- KPI dashboard with live metrics
- Interactive URL table (search, sort, pagination)
- Insights tabs (sitemap, types, Figma, importance)
- Export functionality (txt/csv)

**State Management**:
- `rawUrls` - Original collected URLs
- `filteredUrls` - Filtered/search results
- `urlMetadata` - Link relationships and scores
- `currentPage` - Pagination state
- `currentSort` - Table sorting state

### 4. Validation Script (`verify-urls.ps1`)

**Purpose**: PowerShell script to validate collected URLs

**Checks**:
- Same-origin filtering
- Hash removal
- Query string handling
- www/non-www normalization

## Data Flow

### Collection Flow

```
User Input (baseUrl, options)
    ↓
POST /api/collect
    ↓
collectUrls(baseUrl, options)
    ↓
trySitemap() OR crawlInternal()
    ↓
enrichUrls() + metadata
    ↓
SSE Stream (log, done, error)
    ↓
Client receives URLs
    ↓
Update UI (KPI, table, insights)
```

### URL Processing Pipeline

```
Raw URL
    ↓
Normalize (remove hash)
    ↓
Same-site check
    ↓
Strip query? (optional)
    ↓
Exclude paths? (optional)
    ↓
Enrich (depth, query flag, external flag)
    ↓
Final URL Object
```

## API Endpoints

### `GET /health`

Health check endpoint.

**Response**:
```json
{ "ok": true }
```

### `POST /api/collect`

Start URL collection.

**Request Body**:
```json
{
  "baseUrl": "https://example.com",
  "depth": 3,
  "max": 5000,
  "stripQuery": false,
  "allowWwwAlias": true,
  "excludePaths": ["/admin", "/api"]
}
```

**Response**: NDJSON stream

```json
{"type": "log", "msg": "Base: https://example.com"}
{"type": "log", "msg": "1) Try sitemap..."}
{"type": "done", "urls": [...], "source": "sitemap", "metadata": {...}}
```

## Deployment

### Vercel

- Uses `vercel.json` for configuration
- Serverless function: `server.js` exported as default
- Static files: `public/` directory
- No build step required

### Local Development

- Runs Express server on port 3001-3010
- Auto-detects available port
- Hot reload not included (restart required)

## Dependencies

- **express** (^4.21.0) - Web server
- **Node.js** (>=18) - Runtime with native fetch

No other dependencies - minimal and fast.

## Performance Considerations

- **Request Throttling**: 150ms delay between requests
- **Memory Efficient**: Streams results, doesn't load all URLs in memory
- **Portable**: No database, file system only
- **Stateless**: Each request is independent

## Security

- Same-origin filtering prevents external URL collection
- No authentication (public tool)
- Input validation on baseUrl
- No file system access outside project directory

## Limitations

- No JavaScript rendering (SPA sites may not work)
- No authentication/rate limiting
- Single-threaded (Node.js)
- No persistent storage (results not saved between sessions)
