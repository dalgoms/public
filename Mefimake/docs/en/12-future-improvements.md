# Future Improvements

This document outlines planned enhancements, technical debt, and potential future directions for MEFIMAKE.

---

## Priority Matrix

| Priority | Category | Items |
|----------|----------|-------|
| P0 | Critical | Real AI integration, User accounts |
| P1 | High | Template library, Brand kit, Undo/redo |
| P2 | Medium | Animation, Custom fonts, Collaboration |
| P3 | Low | Marketplace, API, White-label |

---

## P0: Critical Improvements

### 1. Real AI Integration

**Current State:**
AI content generation uses predefined templates with keyword insertion.

**Future State:**
Integration with LLM APIs for truly intelligent content generation.

**Implementation Plan:**

```javascript
// Future API integration
async function generateContent(keyword, context) {
    const response = await fetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify({
            keyword,
            context,
            variants: 5,
            tone: 'professional',
            language: 'ko'
        })
    });
    
    return response.json();
}
```

**Considerations:**
- API provider selection (OpenAI, Anthropic, local models)
- Cost management (token usage)
- Response quality control
- Fallback to templates if API fails

---

### 2. User Accounts

**Current State:**
All data stored in browser localStorage. No cross-device sync.

**Future State:**
User authentication with cloud storage.

**Implementation Plan:**

```
Authentication Flow:
┌─────────┐     ┌─────────┐     ┌─────────┐
│  Login  │────►│  Auth   │────►│  Load   │
│  Screen │     │  Check  │     │  Data   │
└─────────┘     └─────────┘     └─────────┘
                     │
                     ▼ (new user)
              ┌─────────┐
              │  Sign   │
              │   Up    │
              └─────────┘
```

**Tech Stack Options:**
- Auth: Auth0, Clerk, Supabase Auth
- Database: PostgreSQL, Supabase
- Storage: S3, Cloudflare R2

---

## P1: High Priority

### 3. Template Library

**Description:**
Pre-designed templates for common ad formats.

**Features:**
- Category browsing (e-commerce, finance, education, etc.)
- Template preview
- One-click apply
- Customization after apply

**Data Structure:**

```javascript
const template = {
    id: 'ecommerce-sale-01',
    name: 'E-commerce Sale',
    category: 'e-commerce',
    thumbnail: 'url',
    sizes: ['1:1', '16:9', '9:16'],
    elements: {
        headline: {
            text: '최대 50% 할인',
            fontSize: 72,
            fontWeight: 800,
            position: { x: 540, y: 300 }
        },
        // ... other elements
    },
    background: {
        type: 'gradient',
        colors: ['#FF6B6B', '#FF8E53']
    }
};
```

---

### 4. Brand Kit

**Description:**
Save and reuse brand assets across projects.

**Features:**
- Logo upload and storage
- Brand color palette
- Typography presets
- One-click brand application

**Data Structure:**

```javascript
const brandKit = {
    id: 'brand-001',
    name: 'My Brand',
    logo: {
        primary: 'data:image/png;base64,...',
        secondary: 'data:image/png;base64,...',
        favicon: 'data:image/png;base64,...'
    },
    colors: {
        primary: '#0A84FF',
        secondary: '#5E5CE6',
        accent: '#30D158',
        background: '#1E1E1E',
        text: '#FFFFFF'
    },
    typography: {
        headlineFont: 'Syne',
        bodyFont: 'Inter',
        weights: [400, 600, 800]
    }
};
```

---

### 5. Undo/Redo Stack

**Description:**
Full edit history with keyboard shortcuts.

**Implementation:**

```javascript
class HistoryManager {
    constructor(maxSize = 50) {
        this.undoStack = [];
        this.redoStack = [];
        this.maxSize = maxSize;
    }
    
    push(state) {
        this.undoStack.push(JSON.parse(JSON.stringify(state)));
        this.redoStack = [];  // Clear redo on new action
        if (this.undoStack.length > this.maxSize) {
            this.undoStack.shift();
        }
    }
    
    undo() {
        if (this.undoStack.length === 0) return null;
        const state = this.undoStack.pop();
        this.redoStack.push(state);
        return this.undoStack[this.undoStack.length - 1];
    }
    
    redo() {
        if (this.redoStack.length === 0) return null;
        const state = this.redoStack.pop();
        this.undoStack.push(state);
        return state;
    }
}
```

**Keyboard Shortcuts:**
- `Cmd+Z` - Undo
- `Cmd+Shift+Z` - Redo

---

## P2: Medium Priority

### 6. Animation Support

**Description:**
Basic motion graphics for animated ads.

**Features:**
- Entrance animations (fade, slide, scale)
- Timeline editor
- GIF/WebM export
- Preset animation patterns

**Technical Approach:**
- CSS animations for simple motion
- Web Animations API for timeline control
- GIF.js for GIF export

---

### 7. Custom Fonts

**Description:**
Upload and use custom typefaces.

**Implementation:**

```javascript
async function loadCustomFont(file, fontName) {
    const fontData = await file.arrayBuffer();
    const font = new FontFace(fontName, fontData);
    await font.load();
    document.fonts.add(font);
    
    // Add to font selector
    updateFontSelector(fontName);
}
```

**Considerations:**
- Font licensing compliance
- Performance (font file size)
- Fallback fonts

---

### 8. Team Collaboration

**Description:**
Multi-user workspaces with shared assets.

**Features:**
- Team workspaces
- Role-based access (admin, editor, viewer)
- Asset library sharing
- Comment/feedback system

**Architecture:**

```
┌─────────────────────────────────────────┐
│             TEAM WORKSPACE              │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐ │
│  │  User A │  │  User B │  │  User C │ │
│  │ (Admin) │  │ (Editor)│  │(Viewer) │ │
│  └────┬────┘  └────┬────┘  └────┬────┘ │
│       │            │            │       │
│       ▼            ▼            ▼       │
│  ┌─────────────────────────────────┐   │
│  │        SHARED ASSETS            │   │
│  │  - Brand kit                    │   │
│  │  - Templates                    │   │
│  │  - Projects                     │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

---

## P3: Low Priority

### 9. Template Marketplace

**Description:**
Community-contributed templates.

**Features:**
- Browse community templates
- Upload and share templates
- Rating and reviews
- Creator credits

---

### 10. API Access

**Description:**
Programmatic creative generation.

**Use Cases:**
- Batch generation from spreadsheet
- Integration with marketing platforms
- Automated A/B test creation

**API Design:**

```
POST /api/v1/creatives
{
    "template": "ecommerce-sale-01",
    "variables": {
        "headline": "Flash Sale!",
        "discount": "50%",
        "product_image": "https://..."
    },
    "sizes": ["1:1", "16:9"],
    "format": "png"
}

Response:
{
    "id": "creative_123",
    "status": "completed",
    "files": [
        { "size": "1:1", "url": "https://..." },
        { "size": "16:9", "url": "https://..." }
    ]
}
```

---

### 11. White-Label Version

**Description:**
Rebrandable version for agencies.

**Features:**
- Custom branding
- Custom domain
- Team management
- Usage analytics
- Priority support

---

## Technical Debt

### 1. Code Organization

**Current:**
- Large monolithic files (figma-panel.js ~3000 lines)

**Future:**
- Module-based architecture
- ES6 imports/exports
- Build step with bundler

### 2. Type Safety

**Current:**
- No type checking

**Future:**
- TypeScript migration
- Runtime validation

### 3. Testing

**Current:**
- Manual testing only

**Future:**
- Unit tests (Jest)
- Integration tests (Playwright)
- Visual regression tests

### 4. Error Handling

**Current:**
- Basic try/catch

**Future:**
- Centralized error handling
- User-friendly error messages
- Error reporting service

---

## Technical Exploration

### 1. Framework Migration

Consider migrating from Vanilla JS to:
- **React**: Component model, ecosystem
- **Vue**: Simpler learning curve
- **Svelte**: No runtime, smaller bundle

**Decision Factors:**
- Team familiarity
- Bundle size impact
- Development velocity

### 2. Canvas Rendering

Consider alternative rendering approaches:
- **Fabric.js**: Full-featured canvas library
- **Konva.js**: Simpler canvas abstraction
- **PixiJS**: WebGL performance

### 3. State Management

Consider formal state management:
- **Zustand**: Minimal, flexible
- **Redux Toolkit**: Feature-rich
- **XState**: State machines

---

## Community Requests

Tracking user-requested features:

| Feature | Requests | Status |
|---------|----------|--------|
| Video backgrounds | 12 | Planned |
| More export formats | 8 | Under review |
| Keyboard shortcuts | 7 | Planned |
| Dark/light mode toggle | 5 | Backlog |
| Multiple artboards | 4 | Under review |

---

## Improvement Process

### Proposing Improvements

1. Create GitHub Issue with `enhancement` label
2. Describe problem and proposed solution
3. Discuss in comments
4. If approved, add to roadmap

### Prioritization Criteria

- **Impact**: How many users benefit?
- **Effort**: Engineering time required
- **Strategic**: Does it align with vision?
- **Revenue**: Does it enable monetization?

### Implementation Flow

```
Idea → Issue → Discussion → Approval → Design → Implement → Review → Release
```

---

## Metrics for Success

How we measure if improvements are successful:

| Improvement | Success Metric |
|-------------|----------------|
| AI Integration | 80% of users try AI generation |
| Templates | 50% of projects use templates |
| Accounts | 30% of visitors create accounts |
| Team Features | 5+ teams with >3 members |

---

## Contributing

We welcome contributions! See [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

**Areas needing help:**
- Documentation improvements
- Translation (i18n)
- Accessibility enhancements
- Performance optimizations
- New export formats
