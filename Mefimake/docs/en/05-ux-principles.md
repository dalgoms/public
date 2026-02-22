# UX Principles

This document outlines the user experience principles that guide MEFIMAKE's design decisions.

---

## Core Philosophy

> **"Speed without sacrifice."**

MEFIMAKE optimizes for creative velocity while maintaining professional-grade output quality. Every interaction is designed to minimize friction between idea and execution.

---

## Principle 1: Progressive Disclosure

### Definition
Show only what's needed at each step. Advanced features are available but don't clutter the initial experience.

### Application in MEFIMAKE

**Tab-Based Workflow**
```
PLAN ──► DESIGN ──► EXPORT
  │         │          │
  │         │          └── Export options appear
  │         │              only when ready
  │         │
  │         └── Design controls appear
  │             only when content exists
  │
  └── Start with content strategy
      before design decisions
```

**Collapsible Sections**
- Position, Typography, Background, Layers are collapsible
- Users expand what they need, collapse what they don't
- State preserved across sessions

**Examples**
- Background image controls only appear when image is selected
- Blur/opacity sliders appear after image upload
- Export variants option only meaningful after content generation

---

## Principle 2: Sensible Defaults

### Definition
Every field has a default value that works for most use cases. Users can customize, but starting from zero is never required.

### Application in MEFIMAKE

**Content Defaults**
```
Headline: "당신의 헤드라인"
Subtext: "서브 텍스트를 입력하세요"
CTA: "자세히 보기"
```

**Background Defaults**
```
Type: Gradient
Start: #001D61 (Deep blue)
End: #003C8A (Medium blue)
```

**Typography Defaults**
```
Headline: Pretendard, 64px, 700 weight
Subtext: Pretendard, 24px, 400 weight
CTA: Pretendard, 18px, 600 weight
```

### Rationale
- Users see a complete-looking ad immediately
- Reduces decision paralysis
- Demonstrates capabilities through example

---

## Principle 3: Direct Manipulation

### Definition
Users interact directly with the thing they're changing, not through abstract controls.

### Application in MEFIMAKE

**Canvas Interaction**
- Click element to select
- Drag to reposition
- Visual selection feedback (blue outline)

**Real-Time Preview**
- All property changes reflect immediately
- No "Apply" button needed
- WYSIWYG editing

**Future Enhancements**
- Resize handles on selected elements
- Rotation handles
- On-canvas text editing

---

## Principle 4: Forgiving Interface

### Definition
Mistakes are recoverable. The system prevents errors where possible and provides recovery where it can't.

### Application in MEFIMAKE

**Error Prevention**
- Background elements aren't selectable (prevents accidental moves)
- Input fields have sensible min/max bounds
- Dangerous actions require confirmation

**Recovery Options**
- History system for state restoration
- Default values can be restored
- Browser refresh restores last saved state

**Graceful Degradation**
- Missing fonts fall back gracefully
- Failed image loads show placeholder
- Export errors provide clear feedback

---

## Principle 5: Consistent Interaction Patterns

### Definition
Similar actions work the same way throughout the interface.

### Application in MEFIMAKE

**Input Patterns**
| Control Type | Behavior |
|--------------|----------|
| Number inputs | Arrow keys increment, direct type, blur commits |
| Color pickers | Click to open, click outside to close |
| Dropdowns | Click to open, selection commits |
| Sliders | Drag to change, number input alternative |

**Visual Patterns**
| State | Appearance |
|-------|------------|
| Hover | Background lightens |
| Active | Blue highlight |
| Disabled | Reduced opacity |
| Focus | Blue border |

**Iconography**
- Consistent icon style (Lucide)
- Consistent icon sizes (16px in tabs, 14px in controls)
- Icons always paired with labels (accessibility)

---

## Principle 6: Clear Visual Hierarchy

### Definition
The most important elements are the most prominent. Users can quickly scan and understand structure.

### Application in MEFIMAKE

**Layout Hierarchy**
```
┌─────────────────────────────────────────────┐
│ HEADER (Logo + Tabs)          ← Navigation  │
├─────────────────────────────────────────────┤
│                                             │
│  CONTROLS          │        CANVAS          │
│  (Panel)           │        (Focus)         │
│                    │                        │
│  Secondary         │        Primary         │
│  attention         │        attention       │
│                    │                        │
└─────────────────────────────────────────────┘
```

**Typography Hierarchy**
```
Section Title:  16px, 600 weight, white
Field Label:    13px, 500 weight, gray
Input Value:    14px, 500 weight, white
Hint Text:      12px, 400 weight, dim gray
```

**Color Hierarchy**
```
Primary action:   Blue (#0A84FF)
Primary text:     White (#FFFFFF)
Secondary text:   Gray (#98989D)
Tertiary text:    Dim (#636366)
Background:       Dark (#2C2C2C)
```

---

## Principle 7: Efficiency for Power Users

### Definition
While optimizing for beginners, provide shortcuts for experienced users.

### Application in MEFIMAKE

**Current Efficiencies**
- Tab keyboard navigation
- Input arrow key adjustment
- Direct number entry (no sliders required)

**Planned Enhancements**
- Keyboard shortcuts (Cmd+S save, Cmd+E export)
- Command palette (Cmd+K)
- Copy/paste styles
- Preset saving

---

## Principle 8: Contextual Feedback

### Definition
The system communicates its state clearly. Users always know what's happening.

### Application in MEFIMAKE

**Selection Feedback**
- Selected element shows blue outline
- Property panel updates to show element properties
- Layer panel highlights corresponding layer

**Loading States**
- Intro splash shows loading progress
- Export shows progress indication
- Image upload shows processing state

**Success/Error States**
- Export completion notification
- Save confirmation
- Error messages with recovery suggestions

---

## Principle 9: Aesthetic Integrity

### Definition
The interface aesthetic matches the product's purpose. A creative tool should feel creative.

### Application in MEFIMAKE

**Design Language: iOS Dark Mode**
- Premium feel matching target user expectations
- Reduced eye strain for extended sessions
- Content (canvas) stands out against UI

**Visual Polish**
- Subtle shadows for depth
- Smooth transitions (200ms ease)
- Consistent border radius (8-14px)
- Carefully chosen icon set

**Typography**
- Professional font stack
- Clear hierarchy
- Readable contrast ratios

---

## Principle 10: Accessibility

### Definition
The tool is usable by people with diverse abilities.

### Current Implementation

| Feature | Status |
|---------|--------|
| Keyboard navigation | Partial |
| Screen reader support | Basic |
| Color contrast | WCAG AA |
| Focus indicators | Yes |
| Alt text | Partial |

### Future Improvements
- Full keyboard navigation
- ARIA labels throughout
- High contrast mode
- Reduced motion option
- Screen reader testing

---

## Anti-Patterns We Avoid

### 1. Modal Abuse
❌ Don't interrupt flow with unnecessary modals
✅ Use inline controls and progressive disclosure

### 2. Hidden Features
❌ Don't hide essential features in menus
✅ Surface common actions, hide edge cases

### 3. Confirmation Fatigue
❌ Don't confirm every action
✅ Only confirm destructive/irreversible actions

### 4. Forced Tutorials
❌ Don't force users through onboarding
✅ Make interface self-explanatory, offer optional help

### 5. Feature Creep
❌ Don't add every requested feature
✅ Stay focused on core use case

---

## Measuring UX Success

### Quantitative Metrics
- Time to first export
- Variants created per session
- Feature adoption rates
- Error rates

### Qualitative Signals
- User feedback sentiment
- Support ticket themes
- Feature request patterns
- Social media mentions

---

## Design Decision Log

When making UX decisions, we document:

1. **Context** - What problem are we solving?
2. **Options** - What alternatives were considered?
3. **Decision** - What did we choose?
4. **Rationale** - Why this choice?
5. **Trade-offs** - What did we sacrifice?

This creates institutional memory for future decisions.
