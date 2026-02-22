# Error Fixes & Improvement History

This document chronicles significant bugs, their solutions, and lessons learned during MEFIMAKE's development.

---

## 1. Selection System Bug

### Problem

**Date:** February 2026  
**Severity:** High  
**Impact:** Users couldn't control background separately from content

**Symptom:**
Clicking on the canvas background would select it as an element, allowing users to accidentally move or modify the background through the property panel.

**Root Cause:**
The selection event handler didn't distinguish between background elements and content elements. All elements within the canvas were selectable.

```javascript
// Problematic code
canvas.addEventListener('click', (e) => {
    selectElement(e.target);  // Selected ANY element
});
```

### Solution

Implemented the **Background Isolation Rule** - background elements are explicitly excluded from selection.

```javascript
// Fixed code
canvas.addEventListener('click', (e) => {
    const target = e.target;
    
    // Guard: Never select background elements
    if (target.classList.contains('ad-container') ||
        target.classList.contains('ad-overlay') ||
        target.classList.contains('ad-background-image')) {
        deselectAll();
        return;
    }
    
    // Only select content elements
    if (target.classList.contains('ad-headline') ||
        target.classList.contains('ad-subtext') ||
        target.classList.contains('ad-cta')) {
        selectElement(target);
    }
});
```

### Lesson Learned

**Principle: Explicit element classification**

Don't assume all clickable elements should be selectable. Create clear categories (background vs content) and handle them differently based on user intent.

---

## 2. Background Override Bug

### Problem

**Date:** February 2026  
**Severity:** Medium  
**Impact:** Background image opacity control didn't work

**Symptom:**
The opacity slider in the background controls had no effect on the background image. Image remained at full opacity regardless of slider position.

**Root Cause:**
The `.ad-overlay` element used for opacity control had `background: transparent` instead of a solid color. Adjusting its opacity had no visual effect.

```css
/* Problematic CSS */
.ad-overlay {
    position: absolute;
    background: transparent;  /* No color to show opacity! */
    opacity: 0;
}
```

### Solution

Changed overlay background to solid black, then controlled its opacity to create a darkening effect over the background image.

```css
/* Fixed CSS */
.ad-overlay {
    position: absolute;
    background: #000000;  /* Solid black */
    opacity: 0;           /* Start fully transparent */
}
```

```javascript
// JavaScript control
function setBackgroundImageOpacity(value) {
    const overlay = document.querySelector('.ad-overlay');
    // Invert: 100% image opacity = 0% overlay opacity
    overlay.style.opacity = (100 - value) / 100;
}
```

### Lesson Learned

**Principle: Test the full chain**

When implementing controls, test the entire pipeline from UI input → state change → visual result. A control might "work" (change state) without actually producing visible results.

---

## 3. Text Overflow Issue

### Problem

**Date:** February 2026  
**Severity:** High  
**Impact:** AI-generated text exceeded canvas boundaries

**Symptom:**
When clicking the "문구 생성" (Generate Copy) button multiple times, the headline text would grow progressively larger and overflow the canvas boundaries.

**Root Cause:**
A duplicate event listener was attached to the generate button. Each click triggered the handler twice, causing cumulative text growth.

```javascript
// In app.js (problematic)
document.getElementById('ai-generate-btn').addEventListener('click', handler);

// In figma-panel.js (also attached)
document.getElementById('ai-generate-btn').addEventListener('click', handler);

// Result: handler called twice per click
```

### Solution

Removed the duplicate listener and consolidated event handling in one location.

```javascript
// Single source of truth in figma-panel.js
init() {
    const generateBtn = document.getElementById('ai-generate-btn');
    if (generateBtn) {
        generateBtn.addEventListener('click', () => {
            this.generateContent();
        });
    }
}
```

### Lesson Learned

**Principle: Single responsibility for event binding**

Establish clear ownership of event listeners. One module should be responsible for binding events to a given element. Document which module owns which events.

---

## 4. Depth Hierarchy Issue

### Problem

**Date:** February 2026  
**Severity:** Medium  
**Impact:** UI looked flat and unprofessional

**Symptom:**
The control panel, cards, and inputs all had similar background colors, creating a flat appearance with no visual depth hierarchy.

**Root Cause:**
Color tokens were defined but not applied consistently. Different components used hardcoded colors that didn't follow the intended hierarchy.

```css
/* Inconsistent application */
.panel { background: #0B0D12; }
.card { background: #0B0D12; }  /* Same as panel! */
.input { background: #0B0D12; } /* Same as card! */
```

### Solution

Established clear depth hierarchy with distinct colors for each level:

```css
:root {
    --bg-base: #2C2C2C;    /* Deepest - canvas wrapper */
    --bg-surface: #2C2C2C; /* Panel background */
    --bg-input: #383838;   /* Input fields - lighter */
}

/* Applied consistently */
.control-panel { background: var(--bg-surface); }
.panel-section { background: var(--bg-surface); }
.figma-input { background: var(--bg-input); }
```

### Lesson Learned

**Principle: Design tokens require discipline**

Defining tokens isn't enough. Enforce their usage through code review and linting. Avoid hardcoded colors entirely.

---

## 5. Intro Redesign Decision

### Problem

**Date:** February 2026  
**Severity:** Low (aesthetic)  
**Impact:** Initial impression didn't match product quality

**Symptom:**
Multiple iterations of the intro splash screen failed to achieve the desired "professional creative tool" aesthetic. Designs were described as "이상해" (strange) or not matching expectations.

**Root Cause:**
Design direction was unclear. Iterations attempted different styles (3D motion, glassmorphism, elaborate animations) without clear reference points.

### Solution

Simplified to the essential elements:

```html
<div class="intro-splash">
    <div class="intro-content">
        <div class="intro-tagline">Build high-converting creatives with AI.</div>
        <img src="assets/Mefimake-logo.png" class="intro-logo-img">
        <div class="intro-loader">
            <span class="loader-dot"></span>
            <span class="loader-dot"></span>
            <span class="loader-dot"></span>
        </div>
    </div>
    <div class="intro-credit">2026 made by SEYOUNG LEE</div>
</div>
```

Key decisions:
- Logo image instead of text
- Clear value proposition tagline
- Minimal animation (pulsing dots)
- Black background for maximum contrast

### Lesson Learned

**Principle: When in doubt, simplify**

Complex animations and effects often add confusion rather than value. Start simple, add complexity only when there's clear user benefit.

---

## 6. Color System Rebalancing

### Problem

**Date:** February 2026  
**Severity:** Medium  
**Impact:** Inconsistent visual appearance across the application

**Symptom:**
Users reported "purple tone" appearing in the UI. Colors felt "뒤죽박죽" (jumbled/mixed). The dark theme didn't feel cohesive.

**Root Cause:**
Multiple color palettes were mixed:
- Initial dark theme colors
- iOS-style colors
- Gradient colors bleeding into UI
- Hardcoded hex values

```css
/* Mixed sources causing confusion */
background: #15141D;  /* Purple-tinted black */
background: #0F172A;  /* Navy */
background: #020617;  /* Near black */
background: #111827;  /* Gray-blue */
```

### Solution

Complete color system unification to iOS Dark Mode:

```css
:root {
    /* Single source palette */
    --bg-base: #2C2C2C;
    --bg-input: #383838;
    --bg-input-hover: #262626;
    --bg-canvas: #1E1E1E;
    
    /* Remove all hardcoded colors */
    /* Replace navy tones with neutral grays */
}
```

Applied through:
1. Global search/replace of old color values
2. CSS audit for hardcoded colors
3. Visual QA across all screens

### Lesson Learned

**Principle: Color system from day one**

Establish and enforce color tokens before building UI. Retroactive color changes are expensive and error-prone. Create a color lint rule if possible.

---

## 7. Initial State Bug

### Problem

**Date:** February 2026  
**Severity:** Medium  
**Impact:** Inconsistent starting state for new users

**Symptom:**
After the intro splash, the canvas sometimes showed "Story" (9:16) size instead of the intended "Square" (1:1) default.

**Root Cause:**
The `loadPlanFromStorage()` function was overriding the initial state set in `applyInitialState()`.

```javascript
// Order of operations
applyInitialState();      // Sets Square
loadPlanFromStorage();    // Overwrites with saved state (Story)
```

### Solution

Modified `loadPlanFromStorage()` to respect the initial state when appropriate:

```javascript
loadPlanFromStorage() {
    const saved = localStorage.getItem('mefimake_plan');
    if (saved) {
        // Only restore non-size properties
        // OR respect fresh start flag
    }
}

applyInitialState() {
    // Always apply Square size for new sessions
    this.applyCanvasSize(1080, 1080, '1:1');
    
    // Mark the 1:1 card as active
    document.querySelector('[data-size="1:1"]').classList.add('active');
}
```

### Lesson Learned

**Principle: Explicit initialization order**

Document and test the initialization sequence. Consider whether saved state should override defaults, and under what conditions.

---

## 8. Export Variants Bug

### Problem

**Date:** February 2026  
**Severity:** High  
**Impact:** Core feature (All Variants export) was broken

**Symptom:**
"All Variants" export (15 images) produced 5 copies of the same image, not 5 different content variants.

**Root Cause:**
The export function captured the current canvas state 5 times without actually changing the content between captures.

```javascript
// Problematic code
async exportAllVariants() {
    for (let i = 0; i < 5; i++) {
        // Missing: this.applyVariant(i)
        await this.captureAndDownload();
    }
}
```

### Solution

Store all 5 variants during generation, then explicitly apply each before capture:

```javascript
async exportAllVariants() {
    // Store all variants
    const variants = this.generatedVariants;
    
    for (let i = 0; i < variants.length; i++) {
        // Apply variant content
        this.fillContentEditor(variants[i]);
        this.applyContentToCanvas();
        
        // Wait for render
        await this.delay(200);
        
        // Capture each size
        for (const size of sizes) {
            await this.captureAtSize(size, i);
        }
    }
}
```

### Lesson Learned

**Principle: Visual verification of complex features**

For features that produce multiple outputs, manually verify each output is distinct. Automated tests should include visual diff checks where possible.

---

## Summary of Lessons

| Category | Lesson |
|----------|--------|
| Architecture | Single responsibility for event binding |
| Testing | Test the full chain, not just the control |
| Design | When in doubt, simplify |
| Tokens | Design tokens require discipline from day one |
| State | Explicit initialization order matters |
| Features | Visual verification for complex outputs |

---

## Prevention Strategies

### Code Review Checklist

- [ ] Event listeners have single ownership
- [ ] No hardcoded color values
- [ ] State initialization is explicit
- [ ] Complex features have visual tests
- [ ] Error handling covers edge cases

### Automated Checks

- ESLint rule for hardcoded colors
- Test suite for initialization states
- Visual regression tests for export
- Event listener leak detection

---

## Reporting New Issues

When documenting new issues:

1. **Describe the symptom** - What did the user see?
2. **Identify root cause** - Why did it happen?
3. **Document the fix** - What changed?
4. **Extract the lesson** - What principle applies?
5. **Update prevention** - How do we catch this earlier?
