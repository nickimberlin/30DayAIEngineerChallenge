# Design System: AI Proposal Generator

> A bold, confident fintech-inspired design system for the AI Proposal Generator, drawing inspiration from Wise's "money without borders" philosophy.

---

## 1. Visual Theme & Atmosphere

The AI Proposal Generator inherits Wise's bold, confident fintech aesthetic that communicates professionalism and innovation. The design operates on a **warm off-white canvas** with **near-black text** (`#0e0f0c`) and a distinctive **lime-green accent** (`#9fe870`) — a fresh, lime-bright color that feels alive and optimistic, unlike the corporate blues of traditional banking.

### Typography Philosophy

The typography uses **Wise Sans** — a proprietary font used at extreme weight 900 (black) for display headings with a remarkably tight line-height of **0.85** and OpenType `"calt"` (contextual alternates). At 126px, the text is so dense it feels like a protest sign — bold, urgent, and impossible to ignore.

**Inter** serves as the body font with weight 600 as the default for emphasis, creating a consistently confident voice.

### Material Palette

What distinguishes this design is its **green-on-white-on-black** material palette:

- **Lime Green** (`#9fe870`) appears on buttons with **dark green text** (`#163300`), creating a nature-inspired CTA that feels fresh
- Hover states use `scale(1.05)` expansion rather than color changes — buttons physically grow on interaction
- Border-radius system uses **9999px** for buttons (pill), **30px–40px** for cards
- Shadow system is minimal — just `rgba(14,15,12,0.12) 0px 0px 0px 1px` ring shadows

### Key Characteristics

| Characteristic | Value | Description |
|----------------|-------|-------------|
| **Display Font** | Wise Sans 900 | 0.85 line-height — billboard-scale bold headlines |
| **Accent Color** | Lime Green `#9fe870` | With dark green text `#163300` — nature-inspired fintech |
| **Body Font** | Inter 600 | Confident, not light — default reading weight |
| **Primary Color** | Near Black `#0e0f0c` | Warm green undertone |
| **Hover Animation** | `scale(1.05)` | Buttons physically grow |
| **OpenType** | `"calt"` | Contextual alternates on ALL text |
| **Button Radius** | 9999px | Pill buttons |
| **Card Radius** | 30px–40px | Large rounded cards |
| **Shadow System** | Ring shadows only | `rgba(14,15,12,0.12) 0px 0px 0px 1px` |

---

## 2. Color Palette & Roles

### Primary Brand Colors

| Name | Value | Usage |
|------|-------|-------|
| **Near Black** | `#0e0f0c` | Primary text, background for dark sections |
| **Wise Green** | `#9fe870` | Primary CTA button, brand accent |
| **Dark Green** | `#163300` | Button text on green, deep green accent |
| **Light Mint** | `#e2f6d5` | Soft green surface, badge backgrounds |
| **Pastel Green** | `#cdffad` | `--color-interactive-contrast-hover`, hover accent |

### Semantic Colors

| Name | Value | CSS Variable | Usage |
|------|-------|--------------|-------|
| **Positive Green** | `#054d28` | `--color-sentiment-positive-primary` | Success states |
| **Danger Red** | `#d03238` | `--color-interactive-negative-hover` | Error/destructive |
| **Warning Yellow** | `#ffd11a` | `--color-sentiment-warning-hover` | Warnings |
| **Background Cyan** | `rgba(56,200,255,0.10)` | `--color-background-accent` | Info tint |
| **Bright Orange** | `#ffc091` | `--color-bright-orange` | Warm accent |

### Neutral Colors

| Name | Value | Usage |
|------|-------|-------|
| **Warm Dark** | `#454745` | Secondary text, borders |
| **Gray** | `#868685` | Muted text, tertiary |
| **Light Surface** | `#e8ebe6` | Subtle green-tinted light surface |

---

## 3. Typography Rules

### Font Families

| Role | Font | Fallback | OpenType |
|------|------|----------|----------|
| **Display** | `Wise Sans` | `Inter` | `"calt"` on all text |
| **Body / UI** | `Inter` | `Helvetica, Arial` | `"calt"` on all text |

### Typography Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|------|--------|-------------|----------------|-------|
| Display Mega | Wise Sans | 126px (7.88rem) | 900 | 0.85 (ultra-tight) | normal | `"calt"` |
| Display Hero | Wise Sans | 96px (6.00rem) | 900 | 0.85 | normal | `"calt"` |
| Section Heading | Wise Sans | 64px (4.00rem) | 900 | 0.85 | normal | `"calt"` |
| Sub-heading | Wise Sans | 40px (2.50rem) | 900 | 0.85 | normal | `"calt"` |
| Alt Heading | Inter | 78px (4.88rem) | 600 | 1.10 (tight) | -2.34px | `"calt"` |
| Card Title | Inter | 26px (1.62rem) | 600 | 1.23 (tight) | -0.39px | `"calt"` |
| Feature Title | Inter | 22px (1.38rem) | 600 | 1.25 (tight) | -0.396px | `"calt"` |
| Body | Inter | 18px (1.13rem) | 400 | 1.44 | 0.18px | `"calt"` |
| Body Semibold | Inter | 18px (1.13rem) | 600 | 1.44 | -0.108px | `"calt"` |
| Button | Inter | 18px–22px | 600 | 1.00–1.44 | -0.108px | `"calt"` |
| Caption | Inter | 14px (0.88rem) | 400–600 | 1.50–1.86 | -0.084px to -0.108px | `"calt"` |
| Small | Inter | 12px (0.75rem) | 400–600 | 1.00–2.17 | -0.084px to -0.108px | `"calt"` |

### Typography Principles

1. **Weight 900 as identity**: Wise Sans Black (900) is used exclusively for display — the heaviest weight in any analyzed system. It creates text that feels stamped, pressed, physical.

2. **0.85 line-height**: The tightest display line-height analyzed. Letters overlap vertically, creating dense, billboard-like text blocks.

3. **"calt" everywhere**: Contextual alternates enabled on ALL text — both Wise Sans and Inter.

4. **Weight 600 as body default**: Inter Semibold is the standard reading weight — confident, not light.

---

## 4. Component Stylings

### Buttons

#### Primary Green Pill

```css
background: #9fe870;  /* Wise Green */
color: #163300;       /* Dark Green */
padding: 5px 16px;
border-radius: 9999px;
transition: transform 0.2s ease;

&:hover {
  transform: scale(1.05);  /* Button physically grows */
}

&:active {
  transform: scale(0.95);  /* Button compresses */
}
```

#### Secondary Subtle Pill

```css
background: rgba(22, 51, 0, 0.08);  /* Dark green at 8% opacity */
color: #0e0f0c;
padding: 8px 12px 8px 16px;
border-radius: 9999px;
/* Same scale hover/active behavior */
```

### Cards & Containers

```css
border-radius: 16px;    /* small */
border-radius: 30px;    /* medium */
border-radius: 40px;    /* large cards/tables */

border: 1px solid rgba(14,15,12,0.12);
border: 1px solid #9fe870;  /* green accent variant */

box-shadow: rgba(14,15,12,0.12) 0px 0px 0px 1px;  /* ring shadow */
```

### Navigation

- Green-tinted navigation hover: `rgba(211,242,192,0.4)`
- Clean header with wordmark
- Pill CTAs right-aligned

---

## 5. Layout Principles

### Spacing System

**Base unit: 8px**

Scale: `1px, 2px, 3px, 4px, 5px, 8px, 10px, 11px, 12px, 16px, 18px, 19px, 20px, 22px, 24px`

### Border Radius Scale

| Name | Value | Usage |
|------|-------|-------|
| Minimal | 2px | Links, inputs |
| Standard | 10px | Comboboxes, inputs |
| Card | 16px | Small cards, buttons, radio |
| Medium | 20px | Links, medium cards |
| Large | 30px | Feature cards |
| Section | 40px | Tables, large cards |
| Mega | 1000px | Presentation elements |
| Pill | 9999px | All buttons, images |
| Circle | 50% | Icons, badges |

---

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat (Level 0) | No shadow | Default |
| Ring (Level 1) | `rgba(14,15,12,0.12) 0px 0px 0px 1px` | Card borders |
| Inset (Level 2) | `rgb(134,134,133) 0px 0px 0px 1px inset` | Input focus |

**Shadow Philosophy**: Wise uses minimal shadows — ring shadows only. Depth comes from the bold green accent against the neutral canvas.

---

## 7. Do's and Don'ts

### Do ✅

- Use Wise Sans weight 900 for display — the extreme boldness IS the brand
- Apply line-height 0.85 on Wise Sans display — ultra-tight is intentional
- Use Lime Green (`#9fe870`) for primary CTAs with Dark Green (`#163300`) text
- Apply `scale(1.05)` hover and `scale(0.95)` active on buttons
- Enable `"calt"` on all text
- Use Inter weight 600 as the body default

### Don't ❌

- Don't use light font weights for Wise Sans — only 900
- Don't relax the 0.85 line-height on display — the density is the identity
- Don't use the Wise Green as background for large surfaces — it's for buttons and accents
- Don't skip the scale animation on buttons
- Don't use traditional shadows — ring shadows only

---

## 8. Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | <576px | Single column |
| Tablet | 576–992px | 2-column |
| Desktop | 992–1440px | Full layout |
| Large | >1440px | Expanded |

---

## 9. Agent Prompt Guide

### Quick Color Reference

| Element | Color | Value |
|---------|-------|-------|
| Text | Near Black | `#0e0f0c` |
| Background | White | `#ffffff` (off-white) |
| Accent | Wise Green | `#9fe870` |
| Button text | Dark Green | `#163300` |
| Secondary | Gray | `#868685` |

### Example Component Prompts

**Hero Section**
> "Create hero: white background. Headline at 96px Wise Sans weight 900, line-height 0.85, 'calt' enabled, #0e0f0c text. Green pill CTA (#9fe870, 9999px radius, 5px 16px padding, #163300 text). Hover: scale(1.05)."

**Card Component**
> "Build a card: 30px radius, 1px solid rgba(14,15,12,0.12). Title at 22px Inter weight 600, body at 18px weight 400."

### Iteration Guide

When iterating on designs, follow this order:

1. **Wise Sans 900 at 0.85 line-height** — the extreme weight IS the brand
2. **Lime Green for buttons only** — dark green text on green background
3. **Scale animations** (1.05 hover, 0.95 active) on all interactive elements
4. **"calt" on everything** — contextual alternates are mandatory
5. **Inter 600 for body** — confident reading weight

---

## 10. Implementation Checklist

### CSS Variables Setup

```css
:root {
  /* Colors */
  --color-near-black: #0e0f0c;
  --color-wise-green: #9fe870;
  --color-dark-green: #163300;
  --color-light-mint: #e2f6d5;
  --color-pastel-green: #cdffad;
  
  /* Typography */
  --font-display: 'Wise Sans', 'Inter', sans-serif;
  --font-body: 'Inter', 'Helvetica', 'Arial', sans-serif;
  
  /* Spacing */
  --spacing-base: 8px;
  
  /* Radius */
  --radius-pill: 9999px;
  --radius-card: 30px;
  --radius-large: 40px;
  
  /* Shadows */
  --shadow-ring: rgba(14, 15, 12, 0.12) 0px 0px 0px 1px;
}
```

### Font Loading

```css
/* Enable contextual alternates on all text */
* {
  font-feature-settings: 'calt' 1;
}
```

### Button Component

```css
.btn-primary {
  background-color: var(--color-wise-green);
  color: var(--color-dark-green);
  padding: 5px 16px;
  border-radius: var(--radius-pill);
  font-weight: 600;
  font-size: 18px;
  transition: transform 0.2s ease;
}

.btn-primary:hover {
  transform: scale(1.05);
}

.btn-primary:active {
  transform: scale(0.95);
}
```

---

## 11. Design Tokens (JSON)

```json
{
  "colors": {
    "nearBlack": "#0e0f0c",
    "wiseGreen": "#9fe870",
    "darkGreen": "#163300",
    "lightMint": "#e2f6d5",
    "pastelGreen": "#cdffad",
    "warmDark": "#454745",
    "gray": "#868685",
    "lightSurface": "#e8ebe6"
  },
  "typography": {
    "display": {
      "fontFamily": "Wise Sans",
      "fontWeight": 900,
      "lineHeight": 0.85
    },
    "body": {
      "fontFamily": "Inter",
      "fontWeight": 600,
      "lineHeight": 1.44
    }
  },
  "spacing": {
    "base": 8,
    "scale": [1, 2, 3, 4, 5, 8, 10, 11, 12, 16, 18, 19, 20, 22, 24]
  },
  "radius": {
    "minimal": "2px",
    "standard": "10px",
    "card": "16px",
    "medium": "20px",
    "large": "30px",
    "section": "40px",
    "pill": "9999px",
    "circle": "50%"
  },
  "animation": {
    "hover": "scale(1.05)",
    "active": "scale(0.95)",
    "transition": "0.2s ease"
  }
}
```

---

*This design system is inspired by Wise's bold fintech aesthetic and adapted for the AI Proposal Generator project.*
