# MEFIMAKE

**Build high-converting creatives with AI.**

MEFIMAKE is a browser-based creative IDE designed for performance marketers and creative teams who need to produce, test, and iterate ad creatives at scale.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/mefimake)

---

## Problem

Performance marketing teams face a critical bottleneck: **creative production**.

- Designers spend 80% of their time on repetitive resizing and formatting
- A/B testing requires dozens of variants, but production capacity limits experimentation
- Feedback loops between marketers and designers slow iteration cycles
- Existing tools (Figma, Canva) aren't optimized for ad-specific workflows

## Solution

MEFIMAKE is a purpose-built creative IDE that:

1. **Generates AI-powered copy** - Headlines, subtexts, and CTAs optimized for conversion
2. **Handles multi-format export** - One design, three sizes (1:1, 16:9, 9:16) instantly
3. **Streamlines the workflow** - Plan → Design → Export in a single interface
4. **Enables rapid iteration** - 5 content variants with one click

---

## Key Features

### AI Content Generation
Generate 5 different headline/subtext/CTA combinations based on your keyword. Cycle through variants instantly.

### Multi-Size Export System
- **Current Image** - Export the active canvas
- **Size Set** - Export current content in 3 aspect ratios
- **All Variants** - Export 5 content variants × 3 sizes = 15 images

### Professional Design Controls
- Typography: Font family, size, weight, alignment, letter-spacing, line-height
- Background: Solid color, gradient, image upload with opacity and blur controls
- Positioning: X/Y coordinates, width/height, rotation
- Layers: Visual layer management with reordering

### Workflow Integration
- **Safe Zone Toggle** - Visualize platform-specific safe areas
- **Meta Library Link** - Direct access to competitor ad research
- **WebScout Agent** - Market research integration

### History System
Save work states, browse history, restore previous versions.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        MEFIMAKE                             │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │    PLAN     │  │   DESIGN    │  │   EXPORT    │         │
│  │   (Step 1)  │→ │   (Step 2)  │→ │   (Step 3)  │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                   CANVAS ENGINE                      │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │   │
│  │  │Background│ │Headline │ │ Subtext │ │   CTA   │   │   │
│  │  │ (Layer 0)│ │(Layer 1)│ │(Layer 2)│ │(Layer 3)│   │   │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │EditorState  │  │ FigmaPanel  │  │   App.js    │         │
│  │(Data Model) │  │ (UI Logic)  │  │  (Init)     │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Vanilla JavaScript (ES6+) |
| Styling | CSS3 with Custom Properties (Design Tokens) |
| Fonts | Inter, Pretendard, Space Grotesk, Syne |
| Icons | Lucide Icons |
| Image Export | html2canvas |
| Deployment | Vercel (Static) |

**No build step required.** Pure HTML/CSS/JS for maximum simplicity and deployment flexibility.

---

## Screenshots

> Add screenshots here after deployment

| Intro | Editor | Export |
|-------|--------|--------|
| ![Intro](docs/screenshots/intro.png) | ![Editor](docs/screenshots/editor.png) | ![Export](docs/screenshots/export.png) |

---

## Local Development

```bash
# Clone the repository
git clone https://github.com/yourusername/mefimake.git

# Navigate to project
cd mefimake

# Open in browser (no build required)
# Option 1: Direct file open
open index.html

# Option 2: Local server (recommended)
npx serve .
# or
python -m http.server 8000
```

### Requirements
- Modern browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- No Node.js required for basic usage
- Node.js 16+ only if using local server

---

## Deployment

### Vercel (Recommended)

1. **Fork this repository**

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your forked repository

3. **Configure Build Settings**
   ```
   Framework Preset: Other
   Build Command: (leave empty)
   Output Directory: .
   Install Command: (leave empty)
   ```

4. **Deploy**
   - Click "Deploy"
   - Your site will be live at `https://your-project.vercel.app`

### Custom Domain
1. Go to Project Settings → Domains
2. Add your domain
3. Configure DNS as instructed

---

## Project Structure

```
mefimake/
├── index.html          # Main application
├── styles.css          # Design system & components
├── app.js              # Application initialization
├── figma-panel.js      # UI panel logic & interactions
├── editor-state.js     # State management & data model
├── command-palette.js  # Command palette actions
├── assets/             # Static assets
│   ├── Mefimake-logo.png
│   ├── size-square.png
│   ├── size-landscape.png
│   └── size-portrait.png
├── docs/               # Documentation
│   ├── en/             # English docs
│   └── ko/             # Korean docs
├── README.md
├── CHANGELOG.md
└── CONTRIBUTING.md
```

---

## Roadmap

### Phase 1: Foundation (Completed)
- [x] Core editor engine
- [x] Multi-size canvas system
- [x] AI content generation (5 variants)
- [x] Export system (current/size set/all variants)
- [x] History & save system
- [x] iOS-style dark mode UI

### Phase 2: Enhancement (Planned)
- [ ] Template library with pre-made designs
- [ ] Real AI integration (GPT-4 / Claude API)
- [ ] Cloud save with user accounts
- [ ] Team collaboration features
- [ ] Animation timeline for motion ads

### Phase 3: Scale (Future)
- [ ] Batch processing for campaigns
- [ ] Direct Meta/Google Ads integration
- [ ] Performance analytics dashboard
- [ ] White-label enterprise version

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## License

MIT License - See [LICENSE](LICENSE) for details.

---

## Author

**Seyoung Lee**  
2026 © MEFIMAKE

---

<p align="center">
  <strong>Build high-converting creatives with AI.</strong>
</p>
