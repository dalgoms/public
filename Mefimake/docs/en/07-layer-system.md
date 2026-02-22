# Layer System

This document describes MEFIMAKE's layer management system.

---

## Overview

The layer system provides visual representation and control of element stacking order on the canvas.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      LAYER SYSTEM                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐                      ┌─────────────┐      │
│  │   Layer     │◄────────────────────►│   Canvas    │      │
│  │   Panel     │     Bidirectional    │   Elements  │      │
│  │             │     Synchronization  │             │      │
│  └──────┬──────┘                      └──────┬──────┘      │
│         │                                    │              │
│         ▼                                    ▼              │
│  ┌─────────────┐                      ┌─────────────┐      │
│  │   Layer     │                      │   Z-Index   │      │
│  │   State     │                      │   Manager   │      │
│  └─────────────┘                      └─────────────┘      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Layer Hierarchy

### Fixed Layer Structure

MEFIMAKE uses a fixed three-layer structure:

```
LAYER PANEL                    CANVAS Z-INDEX
───────────────────────────────────────────────
┌─────────────────┐
│ ○ CTA Button    │  ────────►  z-index: 30
├─────────────────┤
│ ○ Subtext       │  ────────►  z-index: 20
├─────────────────┤
│ ○ Headline      │  ────────►  z-index: 10
└─────────────────┘

Background layers (not in panel):
- ad-content:     z-index: 5
- ad-overlay:     z-index: 2
- ad-container:   z-index: 1
```

### Why Fixed Layers?

**Design Decision:**

Ad creatives typically have a consistent structure:
1. Background (image/gradient)
2. Headline (primary message)
3. Subtext (supporting message)
4. CTA (call-to-action)

Rather than arbitrary layers, we enforce this proven structure to:
- Reduce decision fatigue
- Ensure professional results
- Simplify the interface

---

## Layer Panel UI

### Panel Structure

```html
<div class="layer-panel">
    <div class="layer-item" data-type="cta">
        <span class="layer-icon">□</span>
        <span class="layer-name">CTA 버튼</span>
        <div class="layer-actions">
            <button class="layer-visibility">👁</button>
            <button class="layer-lock">🔓</button>
        </div>
    </div>
    <!-- Repeat for subtext, headline -->
</div>
```

### Visual States

| State | Appearance |
|-------|------------|
| Normal | Gray background |
| Hover | Lighter background |
| Selected | Blue outline, highlighted |
| Hidden | Reduced opacity, strikethrough |
| Locked | Lock icon filled |

---

## Layer Operations

### 1. Reordering

**Drag and Drop Reordering:**

```javascript
// Initialize sortable
const layerPanel = document.querySelector('.layer-panel');
let draggedItem = null;

layerPanel.addEventListener('dragstart', (e) => {
    draggedItem = e.target.closest('.layer-item');
    e.dataTransfer.effectAllowed = 'move';
});

layerPanel.addEventListener('dragover', (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(layerPanel, e.clientY);
    if (afterElement) {
        layerPanel.insertBefore(draggedItem, afterElement);
    }
});

layerPanel.addEventListener('drop', (e) => {
    e.preventDefault();
    updateZIndices();
});
```

**Z-Index Update:**

```javascript
function updateZIndices() {
    const items = document.querySelectorAll('.layer-item');
    items.forEach((item, index) => {
        const type = item.dataset.type;
        const element = document.querySelector(`.ad-${type}`);
        const zIndex = (items.length - index) * 10;  // 30, 20, 10
        element.style.zIndex = zIndex;
    });
}
```

### 2. Visibility Toggle

```javascript
function toggleVisibility(type) {
    const element = document.querySelector(`.ad-${type}`);
    const layerItem = document.querySelector(`.layer-item[data-type="${type}"]`);
    
    if (element.style.display === 'none') {
        element.style.display = '';
        layerItem.classList.remove('hidden');
    } else {
        element.style.display = 'none';
        layerItem.classList.add('hidden');
    }
}
```

### 3. Lock Toggle

```javascript
function toggleLock(type) {
    const element = document.querySelector(`.ad-${type}`);
    const layerItem = document.querySelector(`.layer-item[data-type="${type}"]`);
    
    if (layerItem.classList.contains('locked')) {
        element.style.pointerEvents = '';
        layerItem.classList.remove('locked');
    } else {
        element.style.pointerEvents = 'none';
        layerItem.classList.add('locked');
    }
}
```

---

## Layer State

### Data Structure

```javascript
const layerState = {
    layers: [
        {
            id: 'cta',
            type: 'cta',
            name: 'CTA 버튼',
            visible: true,
            locked: false,
            zIndex: 30
        },
        {
            id: 'subtext',
            type: 'subtext',
            name: '서브텍스트',
            visible: true,
            locked: false,
            zIndex: 20
        },
        {
            id: 'headline',
            type: 'headline',
            name: '헤드라인',
            visible: true,
            locked: false,
            zIndex: 10
        }
    ]
};
```

### State Persistence

Layer state is persisted in localStorage:

```javascript
function saveLayerState() {
    localStorage.setItem('mefimake_layers', JSON.stringify(layerState));
}

function loadLayerState() {
    const saved = localStorage.getItem('mefimake_layers');
    if (saved) {
        return JSON.parse(saved);
    }
    return defaultLayerState;
}
```

---

## Canvas Synchronization

### Layer Panel → Canvas

When layer panel changes, canvas updates:

```javascript
// Visibility change
toggleVisibilityButton.addEventListener('click', () => {
    const type = getLayerType();
    toggleVisibility(type);
    saveLayerState();
});

// Order change
layerPanel.addEventListener('drop', () => {
    updateZIndices();
    saveLayerState();
});
```

### Canvas → Layer Panel

When canvas selection changes, layer panel updates:

```javascript
function onCanvasSelection(element) {
    const type = getElementType(element);
    highlightLayerItem(type);
}

function highlightLayerItem(type) {
    document.querySelectorAll('.layer-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const layerItem = document.querySelector(`.layer-item[data-type="${type}"]`);
    if (layerItem) {
        layerItem.classList.add('active');
    }
}
```

---

## Layer Panel Styling

```css
.layer-panel {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.layer-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: var(--bg-input);
    border-radius: var(--radius-sm);
    cursor: grab;
    transition: all 0.15s ease;
}

.layer-item:hover {
    background: var(--bg-input-hover);
}

.layer-item.active {
    outline: 2px solid var(--color-primary);
}

.layer-item.hidden {
    opacity: 0.5;
}

.layer-item.hidden .layer-name {
    text-decoration: line-through;
}

.layer-item.locked {
    cursor: not-allowed;
}

.layer-actions {
    margin-left: auto;
    display: flex;
    gap: 4px;
}

.layer-visibility,
.layer-lock {
    width: 24px;
    height: 24px;
    border: none;
    background: transparent;
    cursor: pointer;
    opacity: 0.5;
}

.layer-visibility:hover,
.layer-lock:hover {
    opacity: 1;
}
```

---

## Z-Index Management

### Z-Index Scale

```
z-index: 99999  │  Intro splash (above everything)
z-index: 9999   │  Modals
z-index: 1000   │  Tooltips
z-index: 100    │  Panel overlays
z-index: 30     │  CTA layer
z-index: 20     │  Subtext layer
z-index: 10     │  Headline layer
z-index: 5      │  Content container
z-index: 2      │  Overlay
z-index: 1      │  Background
```

### Why Gaps in Z-Index?

Using 10, 20, 30 instead of 1, 2, 3 allows:
- Future insertion of intermediate layers
- Overlay elements between layers
- Debugging flexibility

---

## Keyboard Shortcuts (Planned)

| Shortcut | Action |
|----------|--------|
| `[` | Move layer down |
| `]` | Move layer up |
| `Cmd+[` | Move to bottom |
| `Cmd+]` | Move to top |
| `Cmd+H` | Toggle visibility |
| `Cmd+L` | Toggle lock |

---

## Limitations

### Current Limitations

1. **Fixed Three Layers**
   - Cannot add new layers
   - Cannot delete layers
   - Cannot duplicate layers

2. **No Layer Groups**
   - Cannot group layers
   - No nested hierarchy

3. **No Layer Effects**
   - No drop shadows per layer
   - No blend modes
   - No opacity per layer (except background)

4. **No Layer Naming**
   - Cannot rename layers
   - Fixed Korean names

### Design Rationale

These limitations are intentional:
- Reduces complexity for target users
- Ad creatives have predictable structure
- Power users can use Figma
- Scope control for v1

---

## Future Improvements

### 1. Dynamic Layers

```javascript
// Add custom text layer
function addTextLayer() {
    const newLayer = {
        id: generateId(),
        type: 'text',
        name: 'New Text',
        content: 'Enter text',
        // ... properties
    };
    
    layerState.layers.push(newLayer);
    renderLayers();
    renderCanvas();
}
```

### 2. Layer Effects

```javascript
// Per-layer effects
const layerEffects = {
    shadow: {
        enabled: true,
        x: 0,
        y: 4,
        blur: 8,
        color: 'rgba(0,0,0,0.3)'
    },
    opacity: 100,
    blendMode: 'normal'
};
```

### 3. Layer Groups

```javascript
const layerGroup = {
    id: 'group-1',
    type: 'group',
    name: 'Header Group',
    expanded: true,
    children: [
        { id: 'headline', ... },
        { id: 'subtext', ... }
    ]
};
```

---

## Testing

### Manual Test Cases

1. ✅ Layer panel shows all three layers
2. ✅ Click layer → selects corresponding canvas element
3. ✅ Select canvas element → highlights layer
4. ✅ Toggle visibility hides/shows element
5. ✅ Toggle lock prevents selection
6. ✅ Drag layer changes z-index
7. ✅ Layer order persists after refresh

### Edge Cases

1. **Hidden + Selected**
   - If element is selected then hidden, deselect it

2. **Locked + Selected**
   - If element is locked, it can still be selected
   - But cannot be moved or edited

3. **All Layers Hidden**
   - Allowed (export will be background only)
   - Warning could be shown
