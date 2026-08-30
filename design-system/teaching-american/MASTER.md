# Design System: Teaching American / TeachFlow

## Overview

This design system implements **Liquid Glassmorphism (Translucent Ethereal Glass)** with a **mobile-first** approach. It is crafted specifically for educational platforms (quizzes, teacher & student dashboards, lessons).

**Version:** 2.0.0 (Liquid Glass Evolution)  
**Last updated:** 2026-08-30  

---

## 1. Style: Liquid Glassmorphism

- **Concept:** Translucent liquid-like glass layers with high backdrop blur, specular light refraction highlights, soft ambient glows, and organic depth.
- **Backdrop:** Multi-layered radial ambient mesh gradient (`#0d0f1f` -> `#121528` with soft periwinkle, rose, and cyan ambient light clouds).
- **Glass Surfaces:** Translucent white tint (`rgba(255, 255, 255, 0.065 - 0.12)`) + `backdrop-filter: blur(24px) saturate(180%) contrast(102%)`.
- **Specular Highlights:** Dual inset shadows (`inset 0 1.5px 1.5px rgba(255, 255, 255, 0.65)`) creating a polished, rounded bevel edge.
- **Interactions:** Ultra-fluid spring transitions (`cubic-bezier(0.16, 1, 0.3, 1)`), hover lift, and liquid glow diffusion.

---

## 2. Color Palette & Tokens

### Primary & Action Colors (Soft Pastel Dream)
| Token | Hex / RGBA | Usage |
|:---|:---|:---|
| `--color-primary` | `#818cf8` (Soft Periwinkle) | Primary buttons, active indicators, brand accent |
| `--color-primary-light` | `#a5b4fc` | Hover tints, gradient highlights |
| `--color-primary-glow` | `rgba(129, 140, 248, 0.35)` | Ambient glow & focus rings |
| `--color-secondary` | `#c084fc` (Soft Lilac Violet) | Secondary actions, gradient overlays |
| `--color-accent` | `#f472b6` (Soft Rose Quartz) | Score badges, celebratory highlights |
| `--color-cyan` | `#38bdf8` (Ice Cyan) | Today badges, subheadings, timers |
| `--color-success` | `#34d399` (Soft Mint) | Correct answers, completed states |
| `--color-warning` | `#fbbf24` (Soft Amber) | Warnings, topic badges |
| `--color-error` | `#f87171` (Soft Coral Red) | Error states, wrong answers |

### Glass & Background Tokens
| Token | Value | Description |
|:---|:---|:---|
| `--bg-mesh` | `radial-gradient(...) + linear-gradient(...)` | Ambient multi-point backdrop |
| `--glass-bg` | `rgba(255, 255, 255, 0.065)` | Default card & surface glass |
| `--glass-bg-subtle` | `rgba(255, 255, 255, 0.04)` | Subtle options, secondary surfaces |
| `--glass-bg-strong` | `rgba(255, 255, 255, 0.12)` | Card hover & active surfaces |
| `--glass-border` | `rgba(255, 255, 255, 0.16)` | Default glass border |
| `--glass-border-highlight`| `rgba(255, 255, 255, 0.65)` | Specular top-edge light reflection |
| `--glass-blur` | `24px` | Standard backdrop blur |
| `--glass-saturate` | `180%` | Backing color vividness |
| `--liquid-shadow-sm` | Multi-layer inset + drop | Button & small badge elevation |
| `--liquid-shadow-md` | Multi-layer inset + drop | Cards & containers elevation |
| `--liquid-shadow-lg` | Multi-layer inset + drop | Modals & quiz hero cards elevation |

### Typography & Text
| Token | Value | Description |
|:---|:---|:---|
| `--color-text` | `#f8fafc` | Primary headings and text |
| `--color-text-secondary` | `rgba(248, 250, 252, 0.75)` | Subtitles, labels, descriptions |
| `--color-text-muted` | `rgba(248, 250, 252, 0.45)` | Metadata, placeholders, timestamps |

---

## 3. Typography

**Font Families:**
- **Heading & Display:** `Lora` (Serif) - thanh lịch, organic, học thuật nhẹ nhàng
- **Body & Controls:** `Raleway` & `Outfit` (Sans-Serif) - hiện đại, dễ đọc trên nền kính

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&family=Raleway:ital,wght@0,300..800;1,300..800&family=Outfit:wght@300..800&display=swap" rel="stylesheet">
```

---

## 4. Key Component Specifications

### A. Liquid Glass Card
```css
.glass-card {
  position: relative;
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate)) contrast(var(--glass-contrast));
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate)) contrast(var(--glass-contrast));
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--liquid-shadow-md);
  padding: var(--space-6);
  transition: all var(--transition-normal);
}

.glass-card:hover {
  background: var(--glass-bg-hover);
  border-color: var(--glass-border-strong);
  box-shadow: var(--liquid-shadow-lg), 0 0 20px var(--color-primary-glow);
  transform: translateY(-3px);
}
```

### B. Liquid Glass Buttons
```css
.btn-primary {
  background: linear-gradient(135deg, rgba(129, 140, 248, 0.85) 0%, rgba(192, 132, 252, 0.85) 100%);
  border: 1px solid rgba(255, 255, 255, 0.45);
  box-shadow: 0 8px 24px -4px rgba(129, 140, 248, 0.42), inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.85);
  border-radius: var(--radius-full);
  color: #ffffff;
}

.btn-primary:hover {
  box-shadow: 0 12px 30px -4px rgba(129, 140, 248, 0.58), inset 0 1.5px 2px 0 #ffffff;
  filter: brightness(1.05);
  transform: translateY(-2px);
}
```

### C. Liquid Input Fields
```css
.input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  backdrop-filter: blur(var(--glass-blur-sm));
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.16);
  color: var(--color-text);
}

.input:focus {
  background: rgba(255, 255, 255, 0.09);
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4px var(--color-primary-glow), inset 0 1px 2px rgba(255, 255, 255, 0.25);
}
```

### D. Quiz Answer Option
```css
.answer-option {
  background: var(--glass-bg-subtle);
  backdrop-filter: blur(var(--glass-blur-sm)) saturate(var(--glass-saturate));
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  box-shadow: var(--liquid-shadow-sm);
}

.answer-option.selected {
  background: rgba(129, 140, 248, 0.22);
  border-color: var(--color-primary);
  box-shadow: 0 0 24px -2px var(--color-primary-glow), inset 0 1px 2px 0 rgba(255, 255, 255, 0.6);
}
```

### E. Liquid Sphere Score Badge
```css
.score-badge {
  background: radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.35), rgba(255, 255, 255, 0.06) 60%),
              linear-gradient(135deg, rgba(129, 140, 248, 0.25), rgba(244, 114, 182, 0.25));
  backdrop-filter: blur(var(--glass-blur)) saturate(200%);
  border: 1.5px solid var(--glass-border-highlight);
  border-radius: var(--radius-full);
  box-shadow: 0 16px 36px -4px rgba(0, 0, 0, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.9);
}
```

---

## 5. Accessibility & Best Practices

1. **Contrast Compliance:** All text on liquid glass must maintain WCAG AA ratio (min 4.5:1). Use `--color-text` (#f8fafc) for high legibility.
2. **GPU Acceleration:** Complex glass containers include `transform: translateZ(0)` for hardware acceleration.
3. **Motion Sensitivity:** Respects `prefers-reduced-motion: reduce` by disabling floating backdrop orbs and instant transitions.
4. **Touch Targets:** Buttons and options maintain min 44x44px clickable area on mobile.
