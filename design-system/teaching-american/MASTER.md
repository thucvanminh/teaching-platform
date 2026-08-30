# Design System: Teaching American

## Overview

This design system follows **Neumorphism (Soft UI)** style with a **mobile-first** approach. The project is an educational platform for students to take quizzes.

**Last updated:** 2026-08-30

---

## Style: Neumorphism

- **Concept:** Soft, embossed/debossed elements with subtle depth
- **Border-radius:** 12-16px (all elements)
- **Shadows:** Dual soft shadows (light + dark)
- **Background:** Monochromatic light pastel
- **Animation:** Smooth press effect (150ms)

---

## Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg` | `#E8EDF2` | Main background |
| `--shadow-light` | `#FFFFFF` | Light shadow (top-left) |
| `--shadow-dark` | `#C5CDD6` | Dark shadow (bottom-right) |
| `--color-primary` | `#6C9BCF` | Primary actions, links |
| `--color-on-primary` | `#FFFFFF` | Text on primary |
| `--color-accent` | `#F4B942` | Scores, leaderboard, highlights |
| `--color-on-accent` | `#1A1A2E` | Text on accent |
| `--color-success` | `#7BC67E` | Correct answers, success states |
| `--color-error` | `#E57373` | Wrong answers, errors |
| `--color-text` | `#2D3748` | Primary text |
| `--color-text-secondary` | `#718096` | Secondary text |

---

## Typography

**Font Family:** Plus Jakarta Sans  
**Import:** `https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,700;1,400`

| Token | Value | Usage |
|-------|-------|-------|
| `--text-xs` | `0.75rem` (12px) | Labels, badges |
| `--text-sm` | `0.875rem` (14px) | Captions, hints |
| `--text-base` | `1rem` (16px) | Body text |
| `--text-lg` | `1.125rem` (18px) | Subheadings |
| `--text-xl` | `1.25rem` (20px) | Section headings |
| `--text-2xl` | `1.5rem` (24px) | Page titles |
| `--text-3xl` | `1.875rem` (30px) | Hero text |

**Line Heights:**
- `--leading-tight: 1.25` (headings)
- `--leading-normal: 1.5` (body)
- `--leading-relaxed: 1.75` (long text)

---

## Spacing Scale

| Token | Value |
|-------|-------|
| `--space-1` | `0.25rem` (4px) |
| `--space-2` | `0.5rem` (8px) |
| `--space-3` | `0.75rem` (12px) |
| `--space-4` | `1rem` (16px) |
| `--space-5` | `1.25rem` (20px) |
| `--space-6` | `1.5rem` (24px) |
| `--space-8` | `2rem` (32px) |
| `--space-10` | `2.5rem` (40px) |
| `--space-12` | `3rem` (48px) |

---

## Breakpoints (Mobile-First)

| Name | Value | Usage |
|------|-------|-------|
| Mobile | `< 768px` | Default |
| Tablet | `≥ 768px` | Grid adjustments |
| Desktop | `≥ 1024px` | Full layout |
| Large | `≥ 1440px` | Max-width container |

---

## Components

### Button (Neumorphic)

```css
.btn {
  background: var(--color-bg);
  border-radius: 12px;
  box-shadow: 
    -5px -5px 15px var(--shadow-light),
    5px 5px 15px var(--shadow-dark);
  transition: all 150ms ease;
  cursor: pointer;
}

.btn:active {
  box-shadow: 
    inset -3px -3px 8px var(--shadow-light),
    inset 3px 3px 8px var(--shadow-dark);
  transform: scale(0.98);
}
```

### Card (Quiz Card)

```css
.quiz-card {
  background: var(--color-bg);
  border-radius: 16px;
  box-shadow: 
    -6px -6px 18px var(--shadow-light),
    6px 6px 18px var(--shadow-dark);
  padding: var(--space-6);
}
```

### Input Field

```css
.input {
  background: var(--color-bg);
  border: none;
  border-radius: 12px;
  box-shadow: 
    inset -3px -3px 8px var(--shadow-light),
    inset 3px 3px 8px var(--shadow-dark);
  padding: var(--space-3) var(--space-4);
}
```

### Answer Option (Quiz)

```css
.answer-option {
  background: var(--color-bg);
  border-radius: 12px;
  box-shadow: 
    -4px -4px 12px var(--shadow-light),
    4px 4px 12px var(--shadow-dark);
  padding: var(--space-4);
  cursor: pointer;
  transition: all 150ms ease;
}

.answer-option.selected {
  box-shadow: 
    inset -3px -3px 8px var(--shadow-light),
    inset 3px 3px 8px var(--shadow-dark);
}

.answer-option.correct {
  background: var(--color-success);
  color: white;
}

.answer-option.wrong {
  background: var(--color-error);
  color: white;
}
```

### Progress Bar

```css
.progress-bar {
  background: var(--color-bg);
  border-radius: 10px;
  box-shadow: 
    inset -3px -3px 8px var(--shadow-light),
    inset 3px 3px 8px var(--shadow-dark);
  height: 12px;
  overflow: hidden;
}

.progress-fill {
  background: var(--color-primary);
  height: 100%;
  border-radius: 10px;
  transition: width 300ms ease;
}
```

### Score Badge

```css
.score-badge {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--color-bg);
  box-shadow: 
    -5px -5px 15px var(--shadow-light),
    5px 5px 15px var(--shadow-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--color-accent);
}
```

---

## Icons

**Recommended libraries:** Lucide, Heroicons, Phosphor Icons  
**Do NOT use emojis as icons**

---

## Accessibility

- Minimum contrast ratio: **4.5:1** for normal text
- All clickable elements must have `cursor: pointer`
- Focus states must be visible (keyboard navigation)
- Support `prefers-reduced-motion`
- Touch targets minimum: **44x44px**

---

## Anti-Patterns (Avoid)

- ❌ Using emojis as icons
- ❌ Shadows darker than defined palette
- ❌ Font size below 12px
- ❌ Disabling zoom on mobile
- ❌ Missing hover/active states

---

## File Structure

```
design-system/teaching-american/
├── MASTER.md              # This file (design system documentation)
├── design-system.css      # CSS variables and base styles
└── pages/                 # Page-specific overrides (if needed)
```

---

## Quick Reference for Coding Agents

When implementing UI for this project:

1. **Import the CSS file first:** `@import '../design-system/teaching-american/design-system.css';`
2. **Use CSS variables** from the design system
3. **Apply neumorphic shadows** to all interactive elements
4. **Mobile-first** - design for 375px first, then scale up
5. **Use Plus Jakarta Sans** font family
6. **Check contrast** for text on colored backgrounds
