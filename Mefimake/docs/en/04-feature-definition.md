# Feature Definition

This document provides detailed specifications for every major feature in MEFIMAKE.

---

## 1. AI Content Generation

### Purpose
Enable users to quickly generate multiple copy variations without starting from scratch, reducing creative block and accelerating ideation.

### Logic

```
Input: Keyword (e.g., "자격증")
    │
    ▼
┌─────────────────────────┐
│   Content Generation    │
│   Algorithm             │
│                         │
│   - 5 predefined        │
│     variant templates   │
│   - Keyword insertion   │
│   - Style variations    │
└───────────┬─────────────┘
            │
            ▼
Output: 5 unique combinations
    ├── Variant 1: Headline + Subtext + CTA
    ├── Variant 2: Headline + Subtext + CTA
    ├── Variant 3: Headline + Subtext + CTA
    ├── Variant 4: Headline + Subtext + CTA
    └── Variant 5: Headline + Subtext + CTA
```

### Data Structure

```javascript
const contentVariants = [
    {
        headline: `${keyword} 취득의 새로운 기준`,
        subtext: `전문가가 설계한 커리큘럼으로 빠르게 합격하세요`,
        cta: '무료 상담받기'
    },
    {
        headline: `왜 ${keyword}인가?`,
        subtext: `높은 연봉, 안정적인 미래가 기다립니다`,
        cta: '자세히 보기'
    },
    // ... 3 more variants
];
```

### User Flow
1. User enters keyword in input field
2. Clicks "AI 초안 문구 생성" button
3. System generates and cycles through 5 variants
4. Each click shows next variant
5. After variant 5, cycles back to variant 1

### Limitations
- Currently uses predefined templates (not real AI)
- Korean language only in templates
- Limited to 5 variants per keyword
- No learning from user preferences

### Future Improvements
- Real AI integration (GPT-4 / Claude)
- Multi-language support
- User feedback learning
- Industry-specific templates

---

## 2. Canvas System

### Purpose
Provide a WYSIWYG editing surface that accurately represents the final exported ad.

### Logic

```
Canvas Container
├── Aspect Ratio: Determined by size selection
├── Background: Color / Gradient / Image
├── Content Elements: Absolutely positioned
└── Guides: Safe zone overlay
```

### Supported Sizes

| Name | Aspect Ratio | Dimensions | Use Case |
|------|--------------|------------|----------|
| Square | 1:1 | 1080×1080 | Instagram Feed |
| Landscape | 16:9 | 1280×720 | Facebook Feed |
| Portrait | 9:16 | 1080×1920 | Instagram Story |

### Data Structure

```javascript
const canvasState = {
    width: 1080,
    height: 1080,
    aspectRatio: '1:1',
    scale: 0.5,  // Display scale (responsive)
    elements: [
        { type: 'headline', ... },
        { type: 'subtext', ... },
        { type: 'cta', ... }
    ]
};
```

### Rendering Pipeline

```
1. User selects size
    │
    ▼
2. Canvas container resized
    │
    ▼
3. Elements maintain relative positions
    │
    ▼
4. Scale factor applied for viewport fit
    │
    ▼
5. Export captures at full resolution
```

### Limitations
- No zoom/pan controls
- Fixed element types (headline, subtext, CTA)
- No arbitrary shape drawing
- Single canvas per session

---

## 3. Selection Engine

### Purpose
Enable intuitive element selection with visual feedback and property panel synchronization.

### Logic

```javascript
// Selection handler
canvas.addEventListener('click', (e) => {
    const target = e.target;
    
    // Guard: Ignore background elements
    if (isBackgroundElement(target)) {
        deselectAll();
        return;
    }
    
    // Guard: Only select content children
    if (!isContentElement(target)) {
        deselectAll();
        return;
    }
    
    // Select the element
    selectElement(target);
});
```

### Visual Feedback

| State | Appearance |
|-------|------------|
| Normal | No outline |
| Hover | Subtle highlight |
| Selected | Blue outline (2px solid #0A84FF) |
| Dragging | Reduced opacity |

### Property Binding

```
Select Element
    │
    ├── Read element styles
    │       - position
    │       - typography
    │       - colors
    │
    └── Populate property panel
            - Position inputs
            - Typography controls
            - Color pickers
```

### Limitations
- Single selection only (no multi-select)
- No keyboard-based selection
- No selection history (undo select)

---

## 4. Property Panel Binding

### Purpose
Provide real-time, two-way binding between UI controls and canvas elements.

### Logic

```
┌────────────────┐      ┌────────────────┐
│  Input Field   │      │ Canvas Element │
│                │      │                │
│  value: 64     │ ───► │ fontSize: 64px │
│                │      │                │
│  onChange()    │ ◄─── │ style.fontSize │
└────────────────┘      └────────────────┘
```

### Binding Types

| Control Type | Binding Method | Update Trigger |
|--------------|----------------|----------------|
| Number Input | Direct value | onChange |
| Text Input | Direct value | onInput |
| Select | Option value | onChange |
| Color Picker | Hex value | onChange |
| Slider | Numeric value | onInput (debounced) |

### Data Flow

```javascript
// Panel → Canvas
fontSizeInput.addEventListener('change', (e) => {
    const value = e.target.value;
    selectedElement.style.fontSize = `${value}px`;
    EditorState.update('fontSize', value);
});

// Canvas → Panel (on selection)
function updatePanel(element) {
    const computed = getComputedStyle(element);
    fontSizeInput.value = parseInt(computed.fontSize);
}
```

### Limitations
- No batch property editing
- No property presets/favorites
- Limited undo for property changes

---

## 5. Background Controls

### Purpose
Enable rich background customization including solid colors, gradients, and images with effects.

### Logic

```
Background Type Selection
    │
    ├── Solid ─────► Single color picker
    │               └── Apply to ad-container
    │
    ├── Gradient ──► Start/End color pickers
    │               └── Angle control
    │               └── Apply linear-gradient
    │
    └── Image ─────► File upload
                    └── Fit mode (cover/contain)
                    └── Opacity slider
                    └── Blur slider
```

### Data Structure

```javascript
const backgroundState = {
    type: 'gradient',  // 'solid' | 'gradient' | 'image'
    
    // Solid
    solidColor: '#00298A',
    
    // Gradient
    gradientStart: '#001D61',
    gradientEnd: '#003C8A',
    gradientAngle: 180,
    
    // Image
    imageUrl: null,
    imageFit: 'cover',
    imageOpacity: 100,
    imageBlur: 0
};
```

### Image Handling

```
File Input
    │
    ▼
FileReader.readAsDataURL()
    │
    ▼
Set as background-image
    │
    ▼
Apply opacity via .ad-overlay
    │
    ▼
Apply blur via CSS filter
```

### Limitations
- No image positioning controls
- Single image only (no layers)
- No video backgrounds
- Local images only (no URL input)

---

## 6. Typography System

### Purpose
Provide professional-grade typography controls for ad copy.

### Available Controls

| Control | Property | Range/Options |
|---------|----------|---------------|
| Font Family | fontFamily | 6 font options |
| Font Size | fontSize | 8 - 200px |
| Font Weight | fontWeight | 300 - 900 |
| Text Align | textAlign | left, center, right |
| Letter Spacing | letterSpacing | -0.1 - 0.5em |
| Line Height | lineHeight | 80% - 200% |

### Font Stack

```css
--fonts: 
    'Pretendard',    /* Korean primary */
    'Inter',         /* Latin primary */
    'Noto Sans KR',  /* Korean fallback */
    'Space Grotesk', /* Display */
    'Syne',          /* Headlines */
    sans-serif;
```

### Limitations
- No custom font upload
- No text effects (shadow, outline)
- No text on path
- Fixed text boxes (no auto-resize)

---

## 7. Layer System

### Purpose
Enable visual management of element stacking order.

### Logic

```
Layer Panel
├── CTA Button       [z-index: 3] ▲▼
├── Subtext          [z-index: 2] ▲▼
└── Headline         [z-index: 1] ▲▼
```

### Features

| Feature | Description |
|---------|-------------|
| Reorder | Drag to change z-index |
| Visibility | Eye icon to show/hide |
| Lock | Lock icon to prevent editing |
| Rename | (Not implemented) |

### Data Structure

```javascript
const layers = [
    { id: 'cta', type: 'cta', visible: true, locked: false, zIndex: 3 },
    { id: 'subtext', type: 'subtext', visible: true, locked: false, zIndex: 2 },
    { id: 'headline', type: 'headline', visible: true, locked: false, zIndex: 1 }
];
```

### Limitations
- Fixed three layers (no add/remove)
- No layer groups
- No layer effects
- No layer duplication

---

## 8. Export System

### Purpose
Generate production-ready image assets in multiple formats and sizes.

### Export Modes

| Mode | Output | Use Case |
|------|--------|----------|
| Current Image | 1 PNG | Quick single export |
| Size Set | 3 PNGs | Multi-platform campaign |
| All Variants | 15 PNGs | A/B testing suite |

### Logic

```javascript
async function exportSizeSet() {
    const sizes = [
        { name: 'square', w: 1080, h: 1080 },
        { name: 'landscape', w: 1280, h: 720 },
        { name: 'portrait', w: 1080, h: 1920 }
    ];
    
    for (const size of sizes) {
        // 1. Resize canvas
        setCanvasSize(size.w, size.h);
        
        // 2. Wait for render
        await delay(100);
        
        // 3. Capture
        const dataUrl = await captureCanvas();
        
        // 4. Download
        downloadImage(dataUrl, `${keyword}-${size.name}.png`);
    }
    
    // 5. Restore original size
    restoreOriginalSize();
}
```

### File Naming Convention

```
{keyword}-{variant}-{size}.png

Examples:
- 자격증-v1-square.png
- 자격증-v1-landscape.png
- 자격증-v2-portrait.png
```

### Limitations
- PNG only (no JPG, WebP)
- No quality settings
- No batch ZIP download
- Sequential downloads (not parallel)

---

## 9. History System

### Purpose
Allow users to save work states and restore previous versions.

### Logic

```
Save Action
    │
    ▼
Capture current state
    ├── Canvas content
    ├── Background settings
    ├── Element positions
    └── Timestamp
    │
    ▼
Store in localStorage
    │
    ▼
Update history panel UI
```

### Data Structure

```javascript
const historyEntry = {
    id: 'hist_1234567890',
    timestamp: '2026-02-23T15:30:00Z',
    thumbnail: 'data:image/png;base64,...',
    state: {
        canvas: { ... },
        background: { ... },
        content: { ... },
        elements: { ... }
    }
};
```

### Features

| Feature | Description |
|---------|-------------|
| Save | Capture current state with thumbnail |
| Restore | Load saved state to editor |
| Delete | Remove entry from history |
| Preview | Thumbnail in history panel |

### Limitations
- Local storage only (no cloud)
- ~5MB storage limit
- No version comparison
- No selective restore (all or nothing)

---

## 10. Safe Zone & Market Research

### Purpose
Help users create platform-compliant ads and research competitors.

### Safe Zone

```
┌──────────────────────────┐
│ ┌──────────────────────┐ │
│ │                      │ │
│ │    SAFE ZONE         │ │
│ │    (Content area)    │ │
│ │                      │ │
│ └──────────────────────┘ │
│     UNSAFE (may be cut)  │
└──────────────────────────┘
```

Toggle shows/hides overlay indicating platform-specific safe areas.

### Market Research Links

| Button | Destination | Purpose |
|--------|-------------|---------|
| Safe Zone | Toggle overlay | Platform compliance |
| Meta Library | facebook.com/ads/library | Competitor research |
| WebScout Agent | webscout-agent.vercel.app | Market analysis |

### Limitations
- Generic safe zone (not platform-specific)
- External links only (no integration)
- No saved research notes
