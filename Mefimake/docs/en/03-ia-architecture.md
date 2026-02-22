# Information Architecture & System Architecture

## Overview

This document describes the information architecture (user-facing structure) and technical architecture (system implementation) of MEFIMAKE.

---

## Information Architecture

### Application Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     INTRO SPLASH                            │
│                   (2.8s loading)                            │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    MAIN EDITOR                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐         ┌───────────────────────────────┐ │
│  │   CONTROL   │         │           CANVAS              │ │
│  │    PANEL    │         │            AREA               │ │
│  │             │         │                               │ │
│  │  ┌───────┐  │         │   ┌─────────────────────┐    │ │
│  │  │ PLAN  │  │         │   │                     │    │ │
│  │  ├───────┤  │         │   │    AD PREVIEW       │    │ │
│  │  │DESIGN │  │◄───────►│   │                     │    │ │
│  │  ├───────┤  │         │   │                     │    │ │
│  │  │EXPORT │  │         │   └─────────────────────┘    │ │
│  │  └───────┘  │         │                               │ │
│  │             │         │                               │ │
│  └─────────────┘         └───────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Tab Structure

```
PLAN (기획)
├── STEP 1: Canvas Size
│   ├── Square (1:1) - 1080×1080
│   ├── Landscape (16:9) - 1280×720
│   └── Portrait (9:16) - 1080×1920
│
└── STEP 2: Content Production
    ├── Keyword Input
    ├── AI Draft Generation Button
    ├── Content Editor
    │   ├── Headline
    │   ├── Subtext
    │   └── CTA Button Text
    └── Apply All Button

DESIGN (디자인)
├── Position
│   ├── X / Y Coordinates
│   ├── Width / Height
│   └── Rotation
│
├── Typography
│   ├── Font Family
│   ├── Font Size
│   ├── Font Weight
│   ├── Text Alignment
│   ├── Letter Spacing
│   └── Line Height
│
├── Background
│   ├── Fill Type (Solid/Gradient/Image)
│   ├── Color Pickers
│   ├── Image Upload
│   ├── Opacity Control
│   └── Blur Control
│
└── Layers
    ├── Layer List (draggable)
    ├── Visibility Toggle
    └── Lock Toggle

EXPORT (내보내기)
├── Export Options
│   ├── Current Image (1 image)
│   ├── Size Set (3 images)
│   └── All Variants (15 images)
│
├── History Panel
│   ├── Saved Works Grid
│   ├── Save Button
│   └── Delete Function
│
└── Market Research
    ├── Safe Zone Toggle
    ├── Meta Library Link
    └── WebScout Agent Link
```

---

## Technical Architecture

### Component Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      index.html                             │
│                   (DOM Structure)                           │
└──────────────────────────┬──────────────────────────────────┘
                           │
           ┌───────────────┼───────────────┐
           │               │               │
           ▼               ▼               ▼
    ┌──────────┐    ┌──────────┐    ┌──────────┐
    │  app.js  │    │  styles  │    │  assets  │
    │  (Init)  │    │   .css   │    │ (Images) │
    └────┬─────┘    └──────────┘    └──────────┘
         │
         ▼
    ┌──────────────┐
    │ figma-panel  │◄────────────────────┐
    │     .js      │                     │
    │  (UI Logic)  │                     │
    └──────┬───────┘                     │
           │                             │
           ▼                             │
    ┌──────────────┐              ┌──────────────┐
    │ editor-state │◄────────────►│   command-   │
    │     .js      │              │  palette.js  │
    │ (Data Model) │              │  (Actions)   │
    └──────────────┘              └──────────────┘
```

### Data Flow

```
User Action
    │
    ▼
┌─────────────────┐
│  Event Handler  │ (figma-panel.js)
│   (onClick,     │
│   onChange)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  State Update   │ (editor-state.js)
│   (EditorState) │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌───────┐ ┌───────────┐
│ DOM   │ │ localStorage│
│Update │ │   Persist   │
└───────┘ └───────────┘
```

---

## Canvas Object Model

### Layer Hierarchy

```
Canvas Container (#ad-container)
│
├── Background Layer (ad-container itself)
│   ├── Background Color/Gradient
│   └── Background Image + Overlay
│
├── Overlay Layer (.ad-overlay)
│   └── Controls image opacity
│
├── Content Layer (.ad-content)
│   │
│   ├── Headline (.ad-headline) ─────────► [SELECTABLE]
│   │   └── Text content
│   │
│   ├── Subtext (.ad-subtext) ───────────► [SELECTABLE]
│   │   └── Text content
│   │
│   └── CTA Button (.ad-cta) ────────────► [SELECTABLE]
│       └── Button text
│
└── Guide Layer (.safe-zone-guide)
    └── Platform-specific safe area
```

### Element Properties

Each selectable element has these properties:

```javascript
{
    // Identity
    type: 'headline' | 'subtext' | 'cta',
    id: 'ad-headline',
    
    // Position
    x: 540,          // px from left
    y: 300,          // px from top
    width: 800,      // px
    height: 'auto',  // px or 'auto'
    rotation: 0,     // degrees
    
    // Typography
    fontFamily: 'Pretendard',
    fontSize: 64,    // px
    fontWeight: 700,
    textAlign: 'center',
    letterSpacing: 0, // em
    lineHeight: 1.2,  // ratio
    color: '#FFFFFF',
    
    // Visibility
    visible: true,
    locked: false
}
```

---

## Selection System

### Selection Flow

```
Click Event
    │
    ▼
┌───────────────────────┐
│ Is target .ad-content │
│    child element?     │
└───────────┬───────────┘
            │
     ┌──────┴──────┐
     │ YES         │ NO
     ▼             ▼
┌─────────┐   ┌─────────┐
│ Select  │   │ Deselect│
│ Element │   │   All   │
└────┬────┘   └─────────┘
     │
     ▼
┌─────────────────────┐
│ Add .selected class │
│ Update properties   │
│ panel binding       │
└─────────────────────┘
```

### Background Isolation Rule

**Critical Design Decision:** The background (ad-container, ad-overlay, background image) is NEVER selectable through normal click interaction.

```javascript
// Selection guard
if (target.classList.contains('ad-container') ||
    target.classList.contains('ad-overlay') ||
    target.classList.contains('ad-background-image')) {
    // Do NOT select - these are background elements
    return;
}
```

This prevents accidental background selection when users intend to click on empty canvas areas.

---

## Property Binding System

### Two-Way Binding Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    PROPERTY PANEL                           │
│                                                             │
│  ┌─────────────┐                      ┌─────────────┐      │
│  │   Input     │ ─── onChange ──────► │   Canvas    │      │
│  │   Field     │                      │   Element   │      │
│  │             │ ◄── updatePanel ──── │             │      │
│  └─────────────┘                      └─────────────┘      │
│                                                             │
└─────────────────────────────────────────────────────────────┘

1. User changes input value
2. onChange handler fires
3. Style applied to canvas element
4. EditorState updated
5. localStorage persisted

---

1. User selects element on canvas
2. Element properties read
3. Panel inputs populated
4. User sees current values
```

### Property Panel Sections

| Section | Bound Properties |
|---------|------------------|
| Position | x, y, width, height, rotation |
| Typography | fontFamily, fontSize, fontWeight, textAlign, letterSpacing, lineHeight |
| Background | fillType, color, gradient, image, opacity, blur |
| Layers | order, visibility, locked state |

---

## State Management

### EditorState Structure

```javascript
EditorState = {
    // Canvas dimensions
    canvas: {
        width: 1080,
        height: 1080,
        aspectRatio: '1:1'
    },
    
    // Background state
    background: {
        type: 'gradient',
        solidColor: '#00298A',
        gradientStart: '#001D61',
        gradientEnd: '#003C8A',
        gradientAngle: 180,
        imageUrl: null,
        imageOpacity: 100,
        imageBlur: 0
    },
    
    // Content state
    content: {
        headline: 'Your Headline Here',
        subtext: 'Supporting text goes here',
        cta: 'Learn More'
    },
    
    // Element states (per element)
    elements: {
        headline: { /* properties */ },
        subtext: { /* properties */ },
        cta: { /* properties */ }
    },
    
    // UI state
    ui: {
        activeTab: 'plan',
        selectedElement: null,
        safeZoneVisible: false
    }
}
```

### Persistence Strategy

```
┌─────────────────┐
│   EditorState   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  JSON.stringify │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  localStorage   │
│                 │
│ Keys:           │
│ - mefimake_plan │
│ - mefimake_state│
│ - mefimake_hist │
└─────────────────┘
```

---

## Export System Architecture

### Export Flow

```
Export Request
    │
    ├── Current Image ───────► Capture current canvas
    │                          └── Download 1 PNG
    │
    ├── Size Set ────────────► For each size (3):
    │                          ├── Resize canvas
    │                          ├── Capture
    │                          └── Download 3 PNGs
    │
    └── All Variants ────────► For each variant (5):
                               └── For each size (3):
                                   ├── Apply content
                                   ├── Resize canvas
                                   ├── Capture
                                   └── Download 15 PNGs
```

### html2canvas Integration

```javascript
async function captureCanvas() {
    const canvas = document.getElementById('ad-container');
    
    const result = await html2canvas(canvas, {
        scale: 2,              // 2x resolution
        useCORS: true,         // Handle external images
        backgroundColor: null,  // Transparent if needed
        logging: false
    });
    
    return result.toDataURL('image/png');
}
```

---

## Performance Considerations

### DOM Updates
- Batch DOM updates where possible
- Use CSS transforms for position changes (GPU accelerated)
- Avoid layout thrashing by reading then writing

### State Updates
- Debounce input handlers (especially sliders)
- Throttle expensive operations
- Use requestAnimationFrame for smooth animations

### Memory Management
- Clean up event listeners on element removal
- Revoke object URLs after use
- Limit history stack size

---

## Security Considerations

### Input Sanitization
- All user text inputs escaped before DOM insertion
- File uploads validated for type and size
- No eval() or innerHTML with user content

### Storage
- localStorage only (no server communication in v1)
- No sensitive data stored
- Clear data option available

---

## Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| CSS Custom Properties | ✅ 90+ | ✅ 88+ | ✅ 14+ | ✅ 90+ |
| Backdrop Filter | ✅ | ✅ | ✅ | ✅ |
| html2canvas | ✅ | ✅ | ✅ | ✅ |
| Drag and Drop | ✅ | ✅ | ✅ | ✅ |
| localStorage | ✅ | ✅ | ✅ | ✅ |
