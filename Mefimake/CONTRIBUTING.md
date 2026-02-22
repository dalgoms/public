# Contributing to MEFIMAKE

Thank you for your interest in contributing to MEFIMAKE. This document provides guidelines and instructions for contributing.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Setup](#development-setup)
4. [Project Structure](#project-structure)
5. [Coding Standards](#coding-standards)
6. [Commit Guidelines](#commit-guidelines)
7. [Pull Request Process](#pull-request-process)
8. [Issue Reporting](#issue-reporting)

---

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Assume good intentions
- Keep discussions professional

---

## Getting Started

### Prerequisites

- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+)
- Text editor (VS Code recommended)
- Git
- Basic understanding of HTML, CSS, JavaScript

### Fork and Clone

```bash
# Fork the repository on GitHub, then:
git clone https://github.com/YOUR_USERNAME/mefimake.git
cd mefimake
```

---

## Development Setup

MEFIMAKE uses zero-build architecture. No compilation or bundling required.

### Local Development

```bash
# Option 1: Simple HTTP server
npx serve .

# Option 2: Python server
python -m http.server 8000

# Option 3: VS Code Live Server extension
# Install "Live Server" extension and click "Go Live"
```

### File Watching

For CSS/JS changes, simply refresh the browser. No hot-reload setup required.

---

## Project Structure

```
mefimake/
├── index.html          # Main HTML structure
├── styles.css          # All styles (design tokens + components)
├── app.js              # Application initialization
├── figma-panel.js      # UI panel logic (largest file)
├── editor-state.js     # State management
├── command-palette.js  # Command palette actions
└── assets/             # Static assets (images, icons)
```

### Key Files

| File | Purpose | Lines |
|------|---------|-------|
| `styles.css` | Design system, all components | ~8000 |
| `figma-panel.js` | Panel interactions, export logic | ~3000 |
| `editor-state.js` | Canvas state, element properties | ~500 |
| `index.html` | DOM structure | ~900 |

---

## Coding Standards

### JavaScript

```javascript
// Use ES6+ features
const myFunction = (param) => {
    // Early returns for guard clauses
    if (!param) return;
    
    // Descriptive variable names
    const elementProperties = getProperties(param);
    
    // Use const by default, let when reassignment needed
    let counter = 0;
    
    // Avoid var
};

// Class naming: PascalCase
class FigmaPanel {
    constructor() {
        // Initialize properties
        this.state = {};
    }
}

// Function naming: camelCase
function handleButtonClick() {}

// Constants: UPPER_SNAKE_CASE
const MAX_LAYERS = 100;
```

### CSS

```css
/* Use CSS custom properties for design tokens */
:root {
    --color-primary: #0A84FF;
    --space-4: 16px;
}

/* BEM-like naming for components */
.panel-header { }
.panel-header__title { }
.panel-header--active { }

/* Avoid deep nesting (max 3 levels) */
.component .child .grandchild { }

/* Group related properties */
.element {
    /* Positioning */
    position: relative;
    top: 0;
    
    /* Box model */
    display: flex;
    padding: var(--space-4);
    
    /* Typography */
    font-size: 14px;
    color: var(--text-primary);
    
    /* Visual */
    background: var(--bg-surface);
    border-radius: var(--radius-md);
    
    /* Animation */
    transition: all 0.2s ease;
}
```

### HTML

```html
<!-- Semantic elements -->
<header class="panel-header">
    <h1 class="panel-title">Title</h1>
</header>

<!-- Accessibility -->
<button aria-label="Close modal" class="close-btn">
    <svg>...</svg>
</button>

<!-- Data attributes for JS hooks -->
<div class="card" data-id="123" data-type="layer">
```

---

## Commit Guidelines

### Commit Message Format

```
type(scope): description

[optional body]

[optional footer]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Code style (formatting, no logic change) |
| `refactor` | Code change that neither fixes nor adds |
| `perf` | Performance improvement |
| `test` | Adding tests |
| `chore` | Build process, dependencies |

### Examples

```bash
feat(export): add size set viewer modal

fix(selection): prevent background element selection

docs(readme): update deployment instructions

style(css): organize design tokens

refactor(panel): extract layer management to separate method
```

---

## Pull Request Process

### Before Submitting

1. **Test your changes** in multiple browsers
2. **Check for console errors**
3. **Verify responsive behavior**
4. **Update documentation** if needed

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested in Chrome
- [ ] Tested in Firefox
- [ ] Tested in Safari
- [ ] No console errors

## Screenshots
(if applicable)

## Related Issues
Closes #123
```

### Review Process

1. Submit PR to `main` branch
2. Automated checks run (if configured)
3. Maintainer reviews code
4. Address feedback if any
5. Maintainer merges when approved

---

## Issue Reporting

### Bug Reports

```markdown
**Description**
Clear description of the bug

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**
- Browser: Chrome 120
- OS: macOS 14
- Screen size: 1920x1080

**Screenshots**
(if applicable)
```

### Feature Requests

```markdown
**Problem Statement**
What problem does this solve?

**Proposed Solution**
How should it work?

**Alternatives Considered**
Other approaches you've thought about

**Additional Context**
Mockups, examples, references
```

---

## Design Decisions

When making architectural decisions, consider:

1. **Simplicity** - Zero-build architecture is intentional
2. **Performance** - Keep bundle size minimal
3. **Accessibility** - Support keyboard navigation
4. **Maintainability** - Clear separation of concerns

---

## Questions?

Open an issue with the `question` label or reach out to the maintainers.

---

Thank you for contributing to MEFIMAKE!
