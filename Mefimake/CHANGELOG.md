# Changelog

All notable changes to MEFIMAKE will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-02-23

### Added

#### Core Features
- **AI Content Generation**: Generate 5 different headline/subtext/CTA combinations based on keywords
- **Multi-Size Canvas System**: Support for 1:1 (1080×1080), 16:9 (1280×720), 9:16 (1080×1920) formats
- **Three-Tab Workflow**: Plan → Design → Export streamlined interface

#### Export System
- **Current Image Export**: Download the active canvas as PNG
- **Size Set Export**: Export current content across 3 aspect ratios
- **All Variants Export**: Generate 15 images (5 variants × 3 sizes)
- **Size Set Viewer Modal**: Preview all sizes before download

#### Design Controls
- **Typography Panel**: Font family, size, weight, alignment, letter-spacing, line-height
- **Background Controls**: Solid color, gradient, image upload with opacity and blur
- **Position Controls**: X/Y coordinates, width/height, rotation
- **Layer System**: Visual layer management with drag-to-reorder

#### User Experience
- **Intro Splash Screen**: Branded loading experience
- **iOS Dark Mode UI**: Unified color system (#2C2C2C base)
- **History System**: Save and restore work states
- **Safe Zone Toggle**: Platform-specific safe area visualization
- **Market Research Links**: Meta Library and WebScout Agent integration

#### Technical
- **Snap Guide System**: Visual alignment guides (neon pink #FF00FF)
- **Canvas State Management**: Centralized state with localStorage persistence
- **Zero-Build Architecture**: Pure HTML/CSS/JS, no compilation required

### Design System
- **Color Tokens**: iOS Dark Mode palette
  - Base: #2C2C2C
  - Input: #383838
  - Hover: #262626
  - Canvas: #1E1E1E
  - Primary: #0A84FF
- **Typography**: Inter, Pretendard, Space Grotesk, Syne
- **Spacing**: 8pt grid system
- **Radius**: 8px-14px scale

---

## [0.9.0] - 2026-02-22

### Changed
- Intro splash screen redesign (minimal text + logo)
- Panel logo changed from text to image
- Loading animation changed to pulsing dots

### Fixed
- Background image opacity control not working
- Export "All Variants" producing identical images
- Initial screen not defaulting to Square size

---

## [0.8.0] - 2026-02-21

### Added
- History/Library system with save/restore functionality
- Size Set Viewer modal for preview before download
- Market research buttons (Safe Zone, Meta Library, WebScout Agent)

### Changed
- Workflow reorganization: Canvas Size moved to Step 1
- AI Content Generation merged into Content Editor (Step 2)
- Label changes: "콘텐츠 수정" → "콘텐츠 제작", "생성하기" → "전체 적용하기"

---

## [0.7.0] - 2026-02-20

### Added
- Background image blur control
- Line-height (행간) control in Typography section
- Letter-spacing (자간) control

### Fixed
- Text overflow when clicking "문구 생성" multiple times
- Position section input field alignment

---

## [0.6.0] - 2026-02-19

### Changed
- Complete color system unification to iOS Dark Mode style
- Snap guide color changed to neon pink (#FF00FF)
- Default gradient colors changed to blue tone (#001D61 → #003C8A)
- Default solid fill color changed to #00298A

---

## [0.5.0] - 2026-02-18

### Added
- Three-tier export system (Current/Size Set/All Variants)
- Progress indication during export
- Quality and format selection

### Changed
- Export panel UI restructure

---

## [0.4.0] - 2026-02-17

### Added
- AI content generation with 5 variant cycling
- Dynamic content updates based on keyword

### Fixed
- Duplicate event listener causing text overflow

---

## [0.3.0] - 2026-02-16

### Changed
- Design tab layout improvements
- Section collapse icons reduced to one per section
- Functional background padding standardized to 16px

### Removed
- Unnecessary action buttons from section headers
- Three vertical alignment functions from Typography
- "Auto" line height function

---

## [0.2.0] - 2026-02-15

### Added
- Initial editor implementation
- Canvas rendering with multi-element support
- Property panel with two-way binding
- Selection system with visual feedback

---

## [0.1.0] - 2026-02-14

### Added
- Project initialization
- Basic HTML/CSS/JS structure
- Design token system
- Core layout (control panel + canvas area)

---

## Legend

- **Added**: New features
- **Changed**: Changes in existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security improvements
