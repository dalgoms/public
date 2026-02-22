# Selection System

This document provides a deep dive into MEFIMAKE's element selection system.

---

## Overview

The selection system is responsible for:
1. Detecting user intent to select elements
2. Managing selection state
3. Providing visual feedback
4. Synchronizing with the property panel

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    SELECTION SYSTEM                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐  │
│  │   Event     │────►│  Selection  │────►│   Visual    │  │
│  │   Handler   │     │   Manager   │     │  Feedback   │  │
│  └─────────────┘     └──────┬──────┘     └─────────────┘  │
│                             │                              │
│                             ▼                              │
│                      ┌─────────────┐                       │
│                      │  Property   │                       │
│                      │   Panel     │                       │
│                      │   Binding   │                       │
│                      └─────────────┘                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Selectable Elements

### Element Classification

| Element | Selectable | Reason |
|---------|------------|--------|
| `.ad-headline` | ✅ Yes | Primary content element |
| `.ad-subtext` | ✅ Yes | Primary content element |
| `.ad-cta` | ✅ Yes | Primary content element |
| `.ad-container` | ❌ No | Background - isolation rule |
| `.ad-overlay` | ❌ No | Background - isolation rule |
| `.ad-background-image` | ❌ No | Background - isolation rule |
| `.ad-content` | ❌ No | Container, not content |
| `.safe-zone-guide` | ❌ No | UI overlay, not content |

### Why Background Elements Are Not Selectable

**Design Decision: Background Isolation Rule**

The background (container, overlay, image) is never selectable through click interaction because:

1. **User Intent Clarity**
   - When users click empty space, they typically want to deselect
   - Accidental background selection causes confusion

2. **Background vs Content**
   - Background is controlled through dedicated panel section
   - Content elements need direct manipulation
   - Different mental models for each

3. **Error Prevention**
   - Moving the background would break the layout
   - Background properties don't match element properties

---

## Selection Detection

### Event Flow

```javascript
// 1. Capture click on canvas
canvas.addEventListener('click', handleCanvasClick);

// 2. Handle click
function handleCanvasClick(event) {
    const target = event.target;
    
    // Guard: Ignore background
    if (isBackgroundElement(target)) {
        deselectAll();
        return;
    }
    
    // Guard: Ignore non-content
    if (!isContentElement(target)) {
        deselectAll();
        return;
    }
    
    // Select the element
    selectElement(target);
}

// 3. Background check
function isBackgroundElement(element) {
    return element.classList.contains('ad-container') ||
           element.classList.contains('ad-overlay') ||
           element.classList.contains('ad-background-image') ||
           element.id === 'ad-container';
}

// 4. Content check
function isContentElement(element) {
    return element.classList.contains('ad-headline') ||
           element.classList.contains('ad-subtext') ||
           element.classList.contains('ad-cta');
}
```

### Event Propagation

```
Click on headline text
        │
        ▼
┌───────────────────┐
│  .ad-headline     │ ◄── Target (stop here)
├───────────────────┤
│  .ad-content      │
├───────────────────┤
│  .ad-overlay      │
├───────────────────┤
│  .ad-container    │
├───────────────────┤
│  .canvas-area     │
└───────────────────┘

We check event.target, not the bubbled element
```

---

## Selection State Management

### State Structure

```javascript
// In FigmaPanel class
this.selectedElement = null;  // Currently selected DOM element
this.selectedType = null;     // 'headline' | 'subtext' | 'cta'
```

### State Transitions

```
                    ┌─────────────────┐
        ┌──────────►│   NO SELECTION  │◄──────────┐
        │           └────────┬────────┘           │
        │                    │                    │
        │         Click content element           │
        │                    │                    │
        │                    ▼                    │
        │           ┌─────────────────┐           │
Click   │           │    HEADLINE     │           │ Click
background          │    SELECTED     │           │ empty
        │           └────────┬────────┘           │
        │                    │                    │
        │         Click different element         │
        │                    │                    │
        │                    ▼                    │
        │           ┌─────────────────┐           │
        └───────────│    SUBTEXT      │───────────┘
                    │    SELECTED     │
                    └─────────────────┘
```

### Selection Methods

```javascript
// Select an element
function selectElement(element) {
    // Deselect previous
    deselectAll();
    
    // Add selected class
    element.classList.add('selected');
    
    // Update state
    this.selectedElement = element;
    this.selectedType = getElementType(element);
    
    // Sync property panel
    this.updatePropertyPanel();
}

// Deselect all
function deselectAll() {
    document.querySelectorAll('.selected').forEach(el => {
        el.classList.remove('selected');
    });
    
    this.selectedElement = null;
    this.selectedType = null;
    
    // Clear property panel or show defaults
    this.clearPropertyPanel();
}
```

---

## Visual Feedback

### Selection Indicator

```css
.ad-headline.selected,
.ad-subtext.selected,
.ad-cta.selected {
    outline: 2px solid #0A84FF;
    outline-offset: 4px;
}
```

### Hover State

```css
.ad-headline:hover,
.ad-subtext:hover,
.ad-cta:hover {
    cursor: move;
    outline: 1px dashed rgba(255, 255, 255, 0.3);
}
```

### Transition

```css
.ad-headline,
.ad-subtext,
.ad-cta {
    transition: outline 0.15s ease;
}
```

---

## Property Panel Synchronization

### On Selection

When an element is selected:

```javascript
function updatePropertyPanel() {
    if (!this.selectedElement) return;
    
    const styles = getComputedStyle(this.selectedElement);
    const rect = this.selectedElement.getBoundingClientRect();
    
    // Position section
    document.getElementById('pos-x').value = parseInt(styles.left) || 0;
    document.getElementById('pos-y').value = parseInt(styles.top) || 0;
    document.getElementById('pos-width').value = rect.width;
    document.getElementById('pos-height').value = rect.height;
    
    // Typography section
    document.getElementById('font-family').value = styles.fontFamily.split(',')[0].replace(/"/g, '');
    document.getElementById('font-size').value = parseInt(styles.fontSize);
    document.getElementById('font-weight').value = styles.fontWeight;
    document.getElementById('text-align').value = styles.textAlign;
    document.getElementById('letter-spacing').value = parseFloat(styles.letterSpacing) || 0;
    document.getElementById('line-height').value = Math.round(parseFloat(styles.lineHeight) / parseFloat(styles.fontSize) * 100);
}
```

### On Property Change

When a property panel value changes:

```javascript
// Example: Font size change
document.getElementById('font-size').addEventListener('change', (e) => {
    if (!this.selectedElement) return;
    
    const value = e.target.value;
    this.selectedElement.style.fontSize = `${value}px`;
    
    // Persist to state
    EditorState.updateElement(this.selectedType, 'fontSize', value);
});
```

---

## Layer Panel Integration

### Selection from Layer Panel

```javascript
// Click on layer item
layerItem.addEventListener('click', () => {
    const elementType = layerItem.dataset.type;
    const element = document.querySelector(`.ad-${elementType}`);
    
    if (element) {
        selectElement(element);
        // Scroll element into view on canvas
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
});
```

### Layer Highlighting

When canvas element is selected, corresponding layer is highlighted:

```javascript
function highlightLayer(type) {
    // Remove previous highlight
    document.querySelectorAll('.layer-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Add highlight to corresponding layer
    const layerItem = document.querySelector(`.layer-item[data-type="${type}"]`);
    if (layerItem) {
        layerItem.classList.add('active');
    }
}
```

---

## Keyboard Interaction

### Current Support

| Key | Action |
|-----|--------|
| Escape | Deselect all |
| Tab | (Planned) Cycle through elements |
| Arrow keys | (Planned) Nudge selected element |
| Delete | (Planned) Reset element to default |

### Implementation

```javascript
document.addEventListener('keydown', (e) => {
    // Escape to deselect
    if (e.key === 'Escape') {
        deselectAll();
        e.preventDefault();
    }
    
    // Arrow keys to nudge (future)
    if (this.selectedElement && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        const nudge = e.shiftKey ? 10 : 1;
        // Apply nudge...
        e.preventDefault();
    }
});
```

---

## Edge Cases

### 1. Click on Text vs Container

```
Problem: Clicking between words might hit parent container
Solution: Use pointer-events and proper element hierarchy
```

### 2. Overlapping Elements

```
Problem: Multiple elements occupy same space
Solution: Click selects topmost (highest z-index)
```

### 3. Rapid Clicks

```
Problem: Double-click might be interpreted as text selection
Solution: Debounce click handler, distinguish click from double-click
```

### 4. Touch Devices

```
Problem: Touch interaction differs from mouse
Solution: Handle both touchstart and click events
Current: Basic touch support, needs improvement
```

---

## Known Limitations

1. **Single Selection Only**
   - No multi-select with Shift+Click
   - No marquee selection
   - No selection groups

2. **No Drag to Select**
   - Must click directly on element
   - Cannot drag a box to select

3. **No Selection History**
   - Cannot Cmd+Z to reselect previous
   - No "reselect last" shortcut

4. **Limited Touch Support**
   - Basic tap to select works
   - No gestures for selection

---

## Future Improvements

### Multi-Selection
```javascript
// Shift+Click to add to selection
if (e.shiftKey) {
    addToSelection(element);
} else {
    selectElement(element);  // Replace selection
}
```

### Selection Box
```javascript
// Drag to create selection box
canvas.addEventListener('mousedown', startSelectionBox);
canvas.addEventListener('mousemove', updateSelectionBox);
canvas.addEventListener('mouseup', completeSelectionBox);
```

### Selection Shortcuts
```javascript
// Cmd+A to select all
if (e.metaKey && e.key === 'a') {
    selectAll();
    e.preventDefault();
}
```

---

## Testing Selection

### Manual Test Cases

1. ✅ Click headline → headline selected
2. ✅ Click subtext → subtext selected, headline deselected
3. ✅ Click CTA → CTA selected
4. ✅ Click empty canvas → all deselected
5. ✅ Click background → all deselected
6. ✅ Property panel updates on selection
7. ✅ Layer panel highlights on selection
8. ✅ Selection outline visible
9. ✅ Press Escape → all deselected

### Automated Testing (Future)

```javascript
describe('Selection System', () => {
    it('should select headline on click', () => {
        const headline = document.querySelector('.ad-headline');
        headline.click();
        expect(headline.classList.contains('selected')).toBe(true);
    });
    
    it('should not select background on click', () => {
        const container = document.querySelector('.ad-container');
        container.click();
        expect(document.querySelector('.selected')).toBeNull();
    });
});
```
