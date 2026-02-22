# Performance Notes

This document covers performance considerations, optimizations, and best practices for MEFIMAKE.

---

## Overview

MEFIMAKE prioritizes:
1. **Perceived performance** - UI feels responsive
2. **Export speed** - Quick image generation
3. **Memory efficiency** - No leaks over long sessions

---

## Performance Metrics

### Target Metrics

| Metric | Target | Current |
|--------|--------|---------|
| First Contentful Paint | < 1.5s | ~0.8s |
| Time to Interactive | < 2.5s | ~1.5s |
| Input Latency | < 50ms | ~20ms |
| Export (single image) | < 2s | ~1s |
| Memory (30 min session) | < 150MB | ~80MB |

### Measurement Tools

- Chrome DevTools Performance panel
- Lighthouse audits
- Custom performance marks

```javascript
// Example performance measurement
performance.mark('export-start');
await exportImage();
performance.mark('export-end');
performance.measure('export-duration', 'export-start', 'export-end');
```

---

## Asset Loading

### Critical Resources

```
Load Order:
1. HTML structure (inline critical CSS)
2. Main stylesheet (styles.css)
3. Fonts (async, display=swap)
4. JavaScript (defer)
5. Icons (Lucide - async)
6. html2canvas (defer)
```

### Font Loading Strategy

```css
/* Use font-display: swap for fast text rendering */
@font-face {
    font-family: 'Pretendard';
    font-display: swap;
    /* ... */
}
```

```html
<!-- Preconnect to font origins -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

### Lazy Loading

Images are lazy-loaded where appropriate:

```html
<img src="assets/size-square.png" loading="lazy" alt="Square">
```

---

## DOM Performance

### Minimize Reflows

```javascript
// Bad: Multiple reflows
element.style.width = '100px';
element.style.height = '100px';
element.style.left = '50px';

// Good: Single reflow using class
element.classList.add('positioned');

// Good: Batch style changes
element.style.cssText = 'width: 100px; height: 100px; left: 50px;';
```

### Use Transform for Animation

```css
/* Good: GPU-accelerated */
.element {
    transform: translateX(100px);
}

/* Avoid: Triggers layout */
.element {
    left: 100px;
}
```

### Efficient Selectors

```javascript
// Cache DOM references
const canvas = document.getElementById('ad-container');
const headline = document.querySelector('.ad-headline');

// Avoid repeated queries
// Bad
for (let i = 0; i < 100; i++) {
    document.querySelector('.headline').style.opacity = i / 100;
}

// Good
const el = document.querySelector('.headline');
for (let i = 0; i < 100; i++) {
    el.style.opacity = i / 100;
}
```

---

## Event Handling

### Debouncing

For frequently-firing events (input, scroll, resize):

```javascript
function debounce(fn, delay) {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
}

// Usage
const handleInput = debounce((e) => {
    applyFontSize(e.target.value);
}, 150);
```

### Throttling

For rate-limited operations:

```javascript
function throttle(fn, limit) {
    let inThrottle;
    return (...args) => {
        if (!inThrottle) {
            fn(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Usage
const handleScroll = throttle(() => {
    updateScrollPosition();
}, 100);
```

### Event Delegation

```javascript
// Bad: Listener per element
layers.forEach(layer => {
    layer.addEventListener('click', handleLayerClick);
});

// Good: Single delegated listener
layerPanel.addEventListener('click', (e) => {
    const layer = e.target.closest('.layer-item');
    if (layer) handleLayerClick(layer);
});
```

---

## Canvas & Export Performance

### html2canvas Optimization

```javascript
async function captureCanvas() {
    return html2canvas(canvas, {
        scale: 2,                    // Balance quality vs speed
        useCORS: true,
        logging: false,              // Disable logging in production
        allowTaint: false,
        backgroundColor: null,
        removeContainer: true,       // Clean up clone
        imageTimeout: 15000,
        onclone: (doc) => {
            // Remove non-essential elements from clone
            doc.querySelectorAll('.safe-zone-guide').forEach(el => el.remove());
        }
    });
}
```

### Sequential vs Parallel Export

```javascript
// Sequential (safer, slower)
for (const size of sizes) {
    await exportAtSize(size);  // Wait for each
}

// Parallel (faster, memory-intensive)
await Promise.all(sizes.map(size => exportAtSize(size)));
```

Current approach: **Sequential** to avoid memory spikes with large images.

### Memory Management During Export

```javascript
async function exportAllVariants() {
    for (const variant of variants) {
        await exportVariant(variant);
        
        // Force garbage collection hint
        await new Promise(r => setTimeout(r, 100));
    }
}
```

---

## Memory Management

### Event Listener Cleanup

```javascript
class Component {
    constructor() {
        this.handleClick = this.handleClick.bind(this);
    }
    
    mount() {
        this.element.addEventListener('click', this.handleClick);
    }
    
    unmount() {
        this.element.removeEventListener('click', this.handleClick);
    }
}
```

### Object URL Cleanup

```javascript
// When uploading images
const imageUrl = URL.createObjectURL(file);
element.style.backgroundImage = `url(${imageUrl})`;

// When replacing or removing
URL.revokeObjectURL(previousUrl);
```

### LocalStorage Limits

```javascript
// Check storage usage
function getStorageSize() {
    let total = 0;
    for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            total += localStorage[key].length * 2; // UTF-16
        }
    }
    return total / 1024 / 1024; // MB
}

// Limit history entries
const MAX_HISTORY_ENTRIES = 20;
function pruneHistory() {
    while (history.length > MAX_HISTORY_ENTRIES) {
        history.shift();  // Remove oldest
    }
}
```

---

## CSS Performance

### Efficient Animations

```css
/* Use will-change sparingly */
.animating {
    will-change: transform, opacity;
}

/* Remove after animation */
.animating.done {
    will-change: auto;
}
```

### Reduce Repaints

```css
/* Promote to own layer for frequent changes */
.canvas-element {
    transform: translateZ(0);
}
```

### Minimize Expensive Properties

| Expensive | Alternative |
|-----------|-------------|
| `box-shadow` (complex) | Simple shadow or pseudo-element |
| `filter: blur()` | Pre-blurred images |
| `backdrop-filter` | Solid backgrounds |
| `border-radius` (large) | Pre-rounded images |

---

## JavaScript Performance

### Avoid Forced Synchronous Layout

```javascript
// Bad: Interleaved read/write
elements.forEach(el => {
    const height = el.offsetHeight;  // Read (forces layout)
    el.style.height = height + 10;   // Write
});

// Good: Batch reads, then writes
const heights = elements.map(el => el.offsetHeight);
elements.forEach((el, i) => {
    el.style.height = heights[i] + 10;
});
```

### Use RequestAnimationFrame

```javascript
// For visual updates
function updatePosition(x, y) {
    requestAnimationFrame(() => {
        element.style.transform = `translate(${x}px, ${y}px)`;
    });
}
```

### Efficient Data Structures

```javascript
// Use Map for frequent lookups
const elementCache = new Map();
elementCache.set('headline', document.querySelector('.ad-headline'));

// Use Set for unique collections
const selectedElements = new Set();
selectedElements.add(element);
selectedElements.has(element);  // O(1)
```

---

## Network Performance

### Zero Runtime Network

MEFIMAKE operates entirely client-side after initial load:
- No API calls during editing
- No telemetry or analytics
- No CDN requests after load

### Cache Strategy

For Vercel deployment:

```json
// vercel.json
{
    "headers": [
        {
            "source": "/assets/(.*)",
            "headers": [
                { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
            ]
        },
        {
            "source": "/(.*\\.js)",
            "headers": [
                { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
            ]
        }
    ]
}
```

---

## Profiling Guide

### CPU Profiling

1. Open Chrome DevTools
2. Go to Performance tab
3. Click Record
4. Perform action (export, selection, etc.)
5. Stop recording
6. Analyze flame chart

### Memory Profiling

1. Open Chrome DevTools
2. Go to Memory tab
3. Take heap snapshot
4. Perform actions
5. Take another snapshot
6. Compare for leaks

### Performance Marks

```javascript
// Add to critical paths
performance.mark('operation-start');
// ... operation ...
performance.mark('operation-end');
performance.measure('operation', 'operation-start', 'operation-end');

// Log results
const measures = performance.getEntriesByType('measure');
console.table(measures.map(m => ({ name: m.name, duration: m.duration })));
```

---

## Known Performance Issues

### 1. Large Image Export

**Issue:** Exporting very large canvases (1080×1920 at 2x scale) can be slow.

**Mitigation:** Show progress indicator, consider web worker.

### 2. Many History Entries

**Issue:** History with many high-resolution thumbnails consumes memory.

**Mitigation:** Limit history size, compress thumbnails.

### 3. Font Loading

**Issue:** Custom fonts may cause FOUT (Flash of Unstyled Text).

**Mitigation:** Use `font-display: swap`, preload critical fonts.

---

## Future Optimizations

### 1. Web Workers for Export

```javascript
// Move html2canvas to worker
const worker = new Worker('export-worker.js');
worker.postMessage({ action: 'capture', canvas: canvasData });
worker.onmessage = (e) => {
    downloadImage(e.data.imageUrl);
};
```

### 2. Virtual Scrolling for Layers

If layer count increases significantly, implement virtual scrolling.

### 3. Image Compression

Before storage, compress history thumbnails:

```javascript
function compressThumbnail(dataUrl, quality = 0.6) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 200;  // Thumbnail size
            canvas.height = 200;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, 200, 200);
            resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.src = dataUrl;
    });
}
```

---

## Performance Checklist

Before release:

- [ ] Lighthouse score > 90
- [ ] No memory leaks in 30-min session
- [ ] Export completes in < 2s per image
- [ ] No layout thrashing in DevTools
- [ ] All animations at 60fps
- [ ] First paint < 1.5s on 3G
