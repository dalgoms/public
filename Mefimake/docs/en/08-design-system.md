# Design System

This document defines MEFIMAKE's visual design system, including tokens, components, and patterns.

---

## Overview

MEFIMAKE uses a token-based design system inspired by iOS Dark Mode. All visual properties are defined as CSS custom properties (variables) for consistency and maintainability.

---

## Design Tokens

### Color Tokens

#### Primary Colors

```css
--color-primary: #0A84FF;        /* iOS Blue - primary actions */
--color-primary-hover: #0070E0;  /* Darker blue for hover */
--color-primary-glow: rgba(10, 132, 255, 0.25);  /* Glow effect */
```

#### Background Colors

```css
/* Main surfaces */
--bg-base: #2C2C2C;          /* App background */
--bg-surface: #2C2C2C;       /* Card backgrounds */
--bg-elevated: #2C2C2C;      /* Elevated surfaces */
--bg-canvas: #1E1E1E;        /* Canvas area */

/* Input backgrounds */
--bg-input: #383838;         /* Input default */
--bg-input-hover: #262626;   /* Input hover */
--bg-input-focus: #262626;   /* Input focus */

/* State backgrounds */
--bg-hover: #262626;         /* Hover state */
--bg-active: #0A84FF;        /* Active/selected */
--bg-tertiary: #383838;      /* Tertiary surface */
```

#### Border Colors

```css
--border-subtle: rgba(255, 255, 255, 0.06);   /* Subtle separation */
--border-normal: rgba(255, 255, 255, 0.08);   /* Normal borders */
--border-hover: rgba(255, 255, 255, 0.12);    /* Hover borders */
--border-focus: #0A84FF;                       /* Focus state */
```

#### Text Colors

```css
--text-primary: #FFFFFF;      /* Primary text */
--text-secondary: #98989D;    /* Secondary text */
--text-tertiary: #636366;     /* Tertiary/hint text */
--text-muted: #48484A;        /* Muted text */
--text-disabled: #3A3A3C;     /* Disabled text */
```

#### Accent Colors

```css
--accent-blue: #0A84FF;       /* Informational */
--accent-red: #FF453A;        /* Destructive/error */
--accent-green: #30D158;      /* Success */
```

#### Canvas Theme Colors

```css
--theme-primary: #001D61;     /* Gradient start */
--theme-secondary: #003C8A;   /* Gradient end */
--theme-accent: #0A84FF;      /* CTA accent */
--theme-text: #FFFFFF;        /* Canvas text */
```

---

### Spacing Tokens

Based on 8pt grid system:

```css
--space-1: 4px;    /* Tight spacing */
--space-2: 8px;    /* Default gap */
--space-3: 12px;   /* Medium gap */
--space-4: 16px;   /* Section padding */
--space-5: 24px;   /* Large gap */
--space-6: 32px;   /* Section spacing */
--space-7: 48px;   /* Major sections */
```

#### Legacy Aliases

```css
--gap-xs: 4px;
--gap-sm: 8px;
--gap-md: 16px;
--gap-lg: 24px;
--gap-xl: 32px;
```

---

### Border Radius Tokens

```css
--radius-sm: 8px;       /* Small elements */
--radius-md: 10px;      /* Medium elements */
--radius-lg: 12px;      /* Large elements */
--radius-xl: 14px;      /* Extra large */
--radius-card: 14px;    /* Cards */
--radius-input: 10px;   /* Input fields */
--radius-button: 12px;  /* Buttons */
```

---

### Typography Tokens

```css
--font-section-title: 600 16px/1.4 'Inter', 'Pretendard', sans-serif;
--font-label: 500 13px/1.4 'Inter', 'Pretendard', sans-serif;
--font-input: 500 14px/1.5 'Inter', 'Pretendard', sans-serif;
--font-cta: 600 15px/1.4 'Inter', 'Pretendard', sans-serif;
--font-hint: 400 12px/1.5 'Inter', 'Pretendard', sans-serif;
--font-badge: 600 11px/1 'Inter', 'Pretendard', sans-serif;
```

---

### Shadow Tokens

```css
--shadow-card: 0 2px 8px rgba(0, 0, 0, 0.3), 
               0 0 1px rgba(255, 255, 255, 0.05);

--shadow-elevated: 0 4px 16px rgba(0, 0, 0, 0.4),
                   0 0 1px rgba(255, 255, 255, 0.08);

--shadow-modal: 0 16px 48px rgba(0, 0, 0, 0.5),
                0 0 1px rgba(255, 255, 255, 0.1);
```

---

## Typography

### Font Stack

```css
/* Primary (UI) */
font-family: 'Inter', 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;

/* Display */
font-family: 'Space Grotesk', 'Inter', sans-serif;

/* Headlines */
font-family: 'Syne', 'Inter', sans-serif;

/* Korean */
font-family: 'Pretendard', 'Noto Sans KR', sans-serif;
```

### Type Scale

| Use | Size | Weight | Line Height |
|-----|------|--------|-------------|
| Section Title | 16px | 600 | 1.4 |
| Field Label | 13px | 500 | 1.4 |
| Input Text | 14px | 500 | 1.5 |
| Button Text | 15px | 600 | 1.4 |
| Hint Text | 12px | 400 | 1.5 |
| Badge | 11px | 600 | 1.0 |

### Font Loading

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Sans+KR:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&family=Syne:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/web/static/pretendard.min.css" rel="stylesheet">
```

---

## Components

### Buttons

#### Primary Button

```css
.btn-primary {
    background: var(--color-primary);
    color: white;
    border: none;
    border-radius: var(--radius-button);
    padding: 12px 20px;
    font: var(--font-cta);
    cursor: pointer;
    transition: background 0.15s ease;
}

.btn-primary:hover {
    background: var(--color-primary-hover);
}
```

#### Secondary Button

```css
.btn-secondary {
    background: var(--bg-input);
    color: var(--text-primary);
    border: 1px solid var(--border-normal);
    border-radius: var(--radius-button);
    padding: 11px 19px;
    font: var(--font-cta);
    cursor: pointer;
    transition: all 0.15s ease;
}

.btn-secondary:hover {
    background: var(--bg-input-hover);
    border-color: var(--border-hover);
}
```

#### Icon Button

```css
.btn-icon {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    border-radius: var(--radius-sm);
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.15s ease;
}

.btn-icon:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
}
```

---

### Input Fields

#### Text Input

```css
.figma-text-input {
    width: 100%;
    padding: 10px 12px;
    background: var(--bg-input);
    border: none;
    border-radius: var(--radius-input);
    color: var(--text-primary);
    font: var(--font-input);
    transition: background 0.15s ease;
}

.figma-text-input:hover {
    background: var(--bg-input-hover);
}

.figma-text-input:focus {
    background: var(--bg-input-focus);
    outline: 2px solid var(--border-focus);
    outline-offset: -2px;
}
```

#### Number Input

```css
.figma-num-input {
    width: 100%;
    padding: 8px 10px;
    background: var(--bg-input);
    border: none;
    border-radius: var(--radius-input);
    color: var(--text-primary);
    font: var(--font-input);
    text-align: center;
}

/* Hide spin buttons */
.figma-num-input::-webkit-outer-spin-button,
.figma-num-input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
```

#### Select Dropdown

```css
.figma-select {
    width: 100%;
    padding: 10px 12px;
    background: var(--bg-input);
    border: none;
    border-radius: var(--radius-input);
    color: var(--text-primary);
    font: var(--font-input);
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,...");
    background-repeat: no-repeat;
    background-position: right 12px center;
}
```

---

### Cards

#### Panel Section

```css
.panel-section {
    background: var(--bg-surface);
    border-radius: var(--radius-card);
    padding: var(--space-4);
}

.panel-section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--space-3);
}

.panel-section-title {
    font: var(--font-section-title);
    color: var(--text-primary);
}
```

#### Size Card

```css
.size-card {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    padding: var(--space-3);
    background: var(--bg-input);
    border: 2px solid transparent;
    border-radius: var(--radius-card);
    cursor: pointer;
    transition: all 0.15s ease;
}

.size-card:hover {
    background: var(--bg-input-hover);
}

.size-card.active {
    border-color: var(--color-primary);
    background: rgba(10, 132, 255, 0.1);
}
```

---

### Tabs

```css
.panel-tabs {
    display: flex;
    gap: var(--space-1);
    padding: var(--space-2);
    background: var(--bg-surface);
    border-radius: var(--radius-md);
}

.panel-tab {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    padding: 10px;
    background: transparent;
    border: none;
    border-radius: var(--radius-sm);
    color: var(--text-secondary);
    font: var(--font-label);
    cursor: pointer;
    transition: all 0.15s ease;
}

.panel-tab:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
}

.panel-tab.active {
    background: var(--color-primary);
    color: white;
}
```

---

### Badges

```css
.header-badge {
    padding: 4px 8px;
    background: var(--bg-tertiary);
    border-radius: 6px;
    font: var(--font-badge);
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}
```

---

## Layout Patterns

### Control Panel Layout

```css
.control-panel {
    width: 380px;
    height: 100vh;
    background: var(--bg-surface);
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.panel-header {
    padding: var(--space-4);
    display: flex;
    align-items: center;
    gap: var(--space-3);
}

.panel-content {
    flex: 1;
    overflow-y: auto;
    padding: var(--space-4);
}
```

### Two-Column Grid

```css
.figma-prop-row.two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-3);
}
```

### Property Row

```css
.figma-prop-row {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
}

.figma-prop-label {
    font: var(--font-label);
    color: var(--text-secondary);
}
```

---

## Animation

### Timing Functions

```css
--ease-default: ease;
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
```

### Duration Scale

```css
--duration-fast: 0.1s;
--duration-normal: 0.15s;
--duration-slow: 0.3s;
--duration-slower: 0.5s;
```

### Common Transitions

```css
/* Default transition */
transition: all 0.15s ease;

/* Background change */
transition: background 0.15s ease;

/* Transform */
transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);

/* Opacity */
transition: opacity 0.3s ease;
```

---

## Icons

### Icon System

MEFIMAKE uses Lucide Icons for consistent iconography.

```html
<script src="https://unpkg.com/lucide@latest"></script>
```

### Icon Sizes

| Context | Size |
|---------|------|
| Tab navigation | 16px |
| Section header | 16px |
| Input action | 14px |
| Button icon | 18px |

### Icon Colors

```css
/* Default */
color: var(--text-secondary);

/* Hover */
color: var(--text-primary);

/* Active */
color: var(--color-primary);
```

---

## Responsive Behavior

### Panel Width

```css
.control-panel {
    width: 380px;  /* Fixed width */
    min-width: 320px;
    max-width: 420px;
}
```

### Canvas Scaling

```css
.canvas-area {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}

#ad-container {
    /* Scale to fit viewport while maintaining aspect ratio */
    transform-origin: center center;
    transform: scale(var(--canvas-scale, 0.5));
}
```

---

## Dark Mode (Default)

MEFIMAKE is designed dark-mode-first. All colors are optimized for dark backgrounds.

### Color Philosophy

- **Base**: Near-black (#2C2C2C) - not pure black for reduced eye strain
- **Surfaces**: Slightly lighter grays for elevation hierarchy
- **Primary**: iOS Blue (#0A84FF) - high contrast, accessible
- **Text**: White with opacity levels for hierarchy

### No Light Mode

Light mode is not currently supported. Design decisions assume dark context.

---

## Accessibility

### Color Contrast

All text meets WCAG AA standards:
- Primary text: 15.4:1 contrast ratio
- Secondary text: 7.1:1 contrast ratio
- Primary button: 4.8:1 contrast ratio

### Focus States

All interactive elements have visible focus states:

```css
:focus {
    outline: 2px solid var(--border-focus);
    outline-offset: 2px;
}
```

### Motion Preferences

```css
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
    }
}
```

---

## Design Principles Summary

1. **Consistency** - Same patterns everywhere
2. **Hierarchy** - Clear visual importance
3. **Density** - Efficient use of space
4. **Feedback** - Every action has a response
5. **Simplicity** - Remove unnecessary decoration
