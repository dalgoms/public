# Changelog

All notable changes to WebScout Agent will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-02-20

### Added
- Initial MVP release
- **Core Discovery Engine**
  - Sitemap.xml parsing (single and sitemap_index)
  - Robots.txt sitemap discovery
  - Internal link crawling fallback
  - Same-origin URL filtering
  - www/non-www normalization
  - Query string stripping option
  - Path exclusion filtering
  - Depth and max URL limits
  - Request throttling (150ms delay)

- **Web Dashboard UI**
  - Modern SaaS-style interface
  - Real-time KPI metrics (Total URLs, Source, Max Depth, Excluded)
  - Interactive URL table with search and sort
  - URL selection and bulk export
  - Progress indicators with live updates
  - Empty state with animated search bot icon
  - Error handling and retry

- **Insights Dashboard**
  - Sitemap tree view
  - Page type auto-tagging (marketing/product/support/other)
  - Figma readiness scoring
  - Page importance heatmap (link count analysis)

- **Export Features**
  - urls.txt export (one URL per line, Figma-ready)
  - urls.csv export (spreadsheet format)
  - Selected URLs export
  - Full URL list export

- **CLI Support**
  - Command-line interface for headless operation
  - Configurable depth and max limits
  - Automatic file generation

- **Validation Tools**
  - PowerShell verification script (verify-urls.ps1)
  - Same-origin validation
  - Hash removal verification
  - Query string handling check

- **Deployment**
  - Vercel deployment configuration
  - Serverless function support
  - Local development server with auto port detection

### Technical Details
- Node.js 18+ with ES modules
- Express.js server
- Vanilla JavaScript (no frameworks)
- Modern CSS with custom properties
- Responsive design (mobile-friendly)
- Server-Sent Events (NDJSON streaming) for real-time updates

---

## [Unreleased]

### Planned
- Sitemap tree visualization improvements
- Enhanced page type detection with ML
- Advanced Figma readiness metrics
- Batch processing for multiple domains
- API authentication
- Rate limiting
- JavaScript rendering support for SPAs
- Export to JSON format
- Webhook notifications
- Scheduled collection jobs

---

[0.1.0]: https://github.com/yourusername/webscout-agent/releases/tag/v0.1.0
