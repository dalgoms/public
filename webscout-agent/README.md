# WebScout Agent

**AI-powered website discovery agent for Figma-ready design.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org/)

[🇰🇷 한국어](README.ko.md) | [🇺🇸 English](README.md)

---

## What is WebScout Agent?

WebScout Agent automatically discovers and maps all URLs from any website, preparing them for Figma design import. Instead of manually collecting URLs one by one, this AI agent:

- **Discovers** URLs via sitemap.xml or intelligent crawling
- **Normalizes** URLs (removes queries, handles www/non-www)
- **Structures** website hierarchy with depth analysis
- **Exports** clean URL lists ready for Figma (html.to.design)

Perfect for design rebuilds, site audits, and Figma workflow automation.

---

## Why I Built This

When rebuilding designs, manually entering URLs one by one is inefficient and error-prone. WebScout Agent automates this entire process, turning hours of manual work into seconds of automated discovery.

---

## Agent Flow

```
Input Domain
    ↓
Sitemap Discovery (robots.txt → sitemap.xml)
    ↓
Crawl Fallback (if no sitemap)
    ↓
URL Normalization (www/non-www merge, query strip)
    ↓
Structure Analysis (depth, path hierarchy)
    ↓
Export (urls.txt / urls.csv)
```

For detailed flow diagram, see [docs/agent-flow.md](./docs/agent-flow.md)

---

## Features

### Core Discovery
- ✅ **Sitemap-first approach** - Automatically detects and parses sitemap.xml
- ✅ **Intelligent fallback** - Crawls internal links if sitemap unavailable
- ✅ **Same-origin filtering** - Only collects URLs from the target domain
- ✅ **Robots.txt parsing** - Discovers sitemap locations automatically

### URL Processing
- ✅ **Query stripping** - Optional removal of query parameters
- ✅ **www/non-www merge** - Treats www and non-www as same site
- ✅ **Hash removal** - Cleans URL fragments automatically
- ✅ **Path exclusion** - Filter out admin, API, or other paths

### Control & Limits
- ✅ **Depth control** - Limit crawling depth (default: 3)
- ✅ **Max URLs limit** - Prevent runaway collection (default: 5000)
- ✅ **Request throttling** - 150ms delay between requests

### Dashboard & Export
- ✅ **Real-time KPI dashboard** - Total URLs, source, depth, excluded count
- ✅ **Interactive URL table** - Search, sort, filter, select
- ✅ **Export formats** - urls.txt (one per line) and urls.csv
- ✅ **Insights tabs** - Sitemap view, page types, Figma readiness, importance

### AI-Powered Intelligence
- ✅ **AI Insights** - Generate marketing and design insights using GPT-4
- ✅ **Competitor Analysis Mode** - Analyze competitor sites with strengths/weaknesses
- ✅ **Content Strategy Agent** - Suggest missing content pages
- ✅ **Landing Page Analysis** - Conversion optimization feedback
- ✅ **Auto-select Design Pages** - Automatically select top 10 pages by importance
- ✅ **QA Monitor** - Basic quality checks for URLs

---

## Quick Start

### Prerequisites

- Node.js 18+ ([Download](https://nodejs.org/))
- npm (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/webscout-agent.git
cd webscout-agent

# Install dependencies
npm install

# Set up OpenAI API key (optional, for AI features)
# Create a .env file in the root directory:
echo "OPENAI_API_KEY=your-api-key-here" > .env
```

**Note**: AI features require an OpenAI API key. Without it, core URL collection features still work.

### Run Web UI

```bash
npm start
```

Open your browser: **http://localhost:3001**

> **Note**: The server automatically finds an available port between 3001-3010. Check the console output for the actual port number if 3001 is already in use. The URL should be `http://localhost:3001` (no hash or trailing slash needed).

---

## Using Web UI

1. **Enter Domain** - Type any website URL (e.g., `https://example.com`)
2. **Configure Options** (optional):
   - **Depth**: Maximum crawl depth (default: 3)
   - **Max URLs**: Maximum URLs to collect (default: 5000)
   - **Query Strip**: Remove query parameters
   - **www/non-www**: Merge www and non-www variants
   - **Exclude**: Comma-separated paths to exclude (e.g., `/admin,/api`)
3. **Click "Collect URLs"** - Watch real-time progress
4. **Review Results** - Check KPI cards and URL table
5. **Explore Insights** - View sitemap tree, page types, Figma readiness, and importance
6. **Generate AI Insights** (requires OpenAI API key):
   - Click **"AI Insights"** tab
   - Toggle **"Analyze as Competitor"** for competitor analysis
   - Click **"Generate AI Insights"** for marketing/design recommendations
   - Use **"Generate Content Strategy"** for content suggestions
   - Use **"Analyze Landing Pages"** for conversion feedback
7. **Auto-select Design Pages** - Click **"Auto-select Design Pages"** to automatically select top 10 pages by importance
8. **Export** - Download `urls.txt` or `urls.csv`
9. **Import to Figma** - Use [html.to.design](https://html.to.design) to import URLs

### Demo Site

Click **"Use Demo Site"** to test with `https://webscout-demo.pages.dev`

### AI Features

**AI Insights Tab** provides:
- **Site Summary**: Page distribution (Product/Content/Conversion/Company)
- **Funnel Analysis**: Landing → Product → Conversion flow
- **Missing Elements**: Gaps in site structure
- **Recommendations**: Top 5 improvement suggestions
- **Content Ideas**: Content strategy suggestions

**Competitor Mode** (toggle enabled):
- **Strengths**: What competitor does well
- **Weaknesses**: Gaps or issues
- **Opportunities**: Areas to differentiate

**Content Strategy Agent**:
- Suggests missing pages (comparison, use cases, pricing explainers, case studies)

**Landing Page Analysis**:
- CTA visibility issues
- Pricing page clarity
- Contact form depth
- Conversion flow optimization

**QA Monitor**:
- Basic quality checks (query params, path depth, URL length)
- Marks pages as Healthy or Review Needed

---

## CLI Usage

For headless operation or automation:

```bash
# Basic usage
node collect-urls.mjs https://example.com

# With options
node collect-urls.mjs https://example.com --depth=4 --max=8000

# Output files
# - urls.txt (one URL per line)
# - urls.csv (CSV format)
```

### CLI Options

- `--depth=N` - Maximum crawl depth (default: 3)
- `--max=N` - Maximum URLs to collect (default: 5000)

### Verify Results

On Windows PowerShell:

```powershell
.\verify-urls.ps1 -TargetDomain "https://example.com"
```

This validates:
- ✅ Same-origin filtering
- ✅ Hash removal
- ✅ Query string handling
- ✅ www/non-www normalization

---

## Deployment (Vercel)

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "WebScout Agent MVP"
git remote add origin https://github.com/yourusername/webscout-agent.git
git push -u origin main
```

### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click **"Add New..."** → **"Project"**
4. Select `webscout-agent` repository
5. Click **"Deploy"**

Vercel automatically detects the configuration from `vercel.json`.

### Environment Variables

None required for basic operation.

---

## Folder Structure

```
webscout-agent/
├── README.md                 # This file (English)
├── README.ko.md             # Korean version
├── CHANGELOG.md              # Version history
├── LICENSE                   # MIT License
├── package.json              # Dependencies & scripts
├── vercel.json               # Vercel deployment config
├── .gitignore                # Git ignore rules
│
├── server.js                 # Express server (Web UI)
├── collect-urls.mjs          # Core URL collection logic
├── verify-urls.ps1          # PowerShell validation script
│
├── public/                   # Web UI frontend
│   ├── index.html           # Main HTML
│   ├── style.css            # Styles
│   └── app.js               # Client-side logic
│
├── docs/                     # Documentation
│   ├── architecture.md      # System architecture
│   ├── agent-flow.md        # Agent flow diagram
│   └── roadmap.md           # Future features
│
└── samples/                  # Sample outputs
    ├── urls.sample.txt      # Example urls.txt
    └── urls.sample.csv       # Example urls.csv
```

---

## Architecture

WebScout Agent consists of:

- **Express Server** (`server.js`) - Serves static UI and API endpoints
- **Collection Engine** (`collect-urls.mjs`) - Core URL discovery logic
- **Web Dashboard** (`public/`) - React-free vanilla JS UI
- **Validation Script** (`verify-urls.ps1`) - PowerShell result checker

For detailed architecture, see [docs/architecture.md](./docs/architecture.md)

---

## Screenshots

![WebScout Agent Dashboard](docs/screenshots/dashboard.png)
*Real-time KPI dashboard with insights*

![URL Collection](docs/screenshots/collection.png)
*Interactive URL table with search and export*

---

## Roadmap

### ✅ Completed (v0.1)
- [x] Sitemap discovery
- [x] Internal link crawling
- [x] Web dashboard UI
- [x] URL export (txt/csv)
- [x] KPI metrics
- [x] Insights tabs

### 🚧 Planned
- [ ] Sitemap tree visualization
- [ ] Page type auto-tagging (marketing/product/support)
- [ ] Figma readiness scoring
- [ ] Page importance heatmap (link count analysis)
- [ ] Funnel mapping
- [ ] Batch processing
- [ ] API rate limiting
- [ ] Authentication

See [docs/roadmap.md](./docs/roadmap.md) for details.

---

## Troubleshooting

### Port Already in Use

The server automatically tries ports 3001-3010. If all are busy:

```bash
# Kill process on port 3001
# Windows PowerShell
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### No URLs Collected

- **Check sitemap**: Visit `https://yourdomain.com/sitemap.xml`
- **SPA sites**: May require JavaScript rendering (not supported yet)
- **Bot blocking**: Some sites block automated requests
- **Try crawl fallback**: Disable sitemap preference

### PowerShell Script Won't Run

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\verify-urls.ps1 -TargetDomain "https://example.com"
```

---

## Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

MIT License - see [LICENSE](./LICENSE) file for details.

---

## Author

**Seyoung Lee**

Built with ❤️ for designers and developers who hate manual URL collection.

---

## Acknowledgments

- Inspired by the need to automate Figma design workflows
- Built with Express.js, vanilla JavaScript, and modern CSS
- Deployed on Vercel

---

**Ready to scout your website?** Start collecting URLs in seconds! 🚀
