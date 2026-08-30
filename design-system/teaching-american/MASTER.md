# Design System: Teaching American

## Overview

This design system follows **Glassmorphism (Frosted Glass)** style with a **mobile-first** approach. The project is an educational platform for students to take quizzes.

**Last updated:** 2026-08-30

---

## Style: Glassmorphism

- **Concept:** Translucent frosted glass elements with backdrop blur, layered depth
- **Background:** Vibrant gradient (Purple-Blue)
- **Cards:** Translucent white (rgba 15-25%) + backdrop blur 15-20px
- **Borders:** Subtle 1px solid rgba(255,255,255,0.2)
- **Animation:** Smooth hover transitions (250ms), glow effects
- **Depth:** Z-index layering with shadows

---

## Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-gradient` | `linear-gradient(135deg, #667eea 0%, #764ba2 100%)` | Page background |
| `--glass-bg` | `rgba(255,255,255,0.15)` | Card backgrounds |
| `--glass-bg-strong` | `rgba(255,255,255,0.25)` | Hover states |
| `--glass-border` | `rgba(255,255,255,0.2)` | Card borders |
| `--glass-blur` | `15px` | Backdrop filter |
| `--glass-blur-strong` | `20px` | Header blur |
| `--color-primary` | `#667eea` | Primary actions |
| `--color-primary-light` | `#818cf8` | Primary light |
| `--color-secondary` | `#764ba2` | Secondary |
| `--color-accent` | `#f093fb` | Highlights, scores |
| `--color-success` | `#34d399` | Correct answers |
| `--color-error` | `#f87171` | Wrong answers |
| `--color-warning` | `#fbbf24` | Warnings |
| `--color-text` | `#ffffff` | Primary text |
| `--color-text-secondary` | `rgba(255,255,255,0.7)` | Secondary text |
| `--color-text-muted` | `rgba(255,255,255,0.5)` | Muted text |

---

## Typography

**Font Family:**
- **Heading:** Lora (Serif) - organic, dịu dàng
- **Body:** Raleway (Sans) - thanh lịch, nhẹ nhàng

**Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&family=Raleway:wght@300;400;500;600;700&display=swap');
```

| Token | Value | Usage |
|-------|-------|-------|
| `--text-xs` | `0.75rem` (12px) | Labels, badges |
| `--text-sm` | `0.875rem` (14px) | Captions, hints |
| `--text-base` | `1rem` (16px) | Body text |
| `--text-lg` | `1.125rem` (18px) | Subheadings |
| `--text-xl` | `1.25rem` (20px) | Section headings |
| `--text-2xl` | `1.5rem` (24px) | Page titles |
| `--text-3xl` | `1.875rem` (30px) | Hero text |
| `--text-4xl` | `2.25rem` (36px) | Large hero |

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
| Tablet | `≥ 768px` | Grid 2-cols |
| Desktop | `≥ 1024px` | Full layout |
| Large | `≥ 1440px` | Max-width container |

---

## Components

### Glass Card
```css
.glass-card {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  transition: all var(--transition-normal);
}
```

### Button (Gradient)
```css
.btn {
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  border: none;
  border-radius: var(--radius-md);
  color: white;
  font-family: var(--font-body);
  transition: all var(--transition-normal);
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
}
```

### Input (Glass)
```css
.input {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-md);
  backdrop-filter: blur(var(--glass-blur));
  color: white;
}

.input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3);
}
```

### Answer Option
```css
.answer-option {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
}

.answer-option:hover {
  background: var(--glass-bg-strong);
  transform: translateX(4px);
}

.answer-option.selected {
  background: rgba(102, 126, 234, 0.3);
  border-color: var(--color-primary);
  box-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
}
```

### Progress Bar
```css
.progress-bar {
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-full);
  height: 8px;
}

.progress-fill {
  background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
  height: 100%;
  border-radius: var(--radius-full);
}
```

### Score Badge
```css
.score-badge {
  width: 80px;
  height: 80px;
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
  border-radius: 50%;
  font-family: var(--font-heading);
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--color-accent);
}
```

---

## Icons

**Recommended libraries:** Lucide, Heroicons, Phosphor Icons  
**Do NOT use emojis as icons** (use inline SVG)

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
- ❌ Solid backgrounds on cards (must be glass)
- ❌ Font size below 12px
- ❌ Disabling zoom on mobile
- ❌ Missing hover/focus states
- ❌ No backdrop-filter on glass elements

---

## File Structure

```
design-system/teaching-american/
├── MASTER.md              # This file (design system documentation)
├── design-system.css      # CSS variables + component styles
└── pages/                 # Page-specific overrides (if needed)
```

---

## Quick Reference for Coding Agents

When implementing UI for this project:

1. **Import the CSS file first:** `@import '../../../design-system/teaching-american/design-system.css';`
2. **Use CSS variables** from the design system
3. **Apply glass effect** to all cards/containers:
   ```css
   background: var(--glass-bg);
   backdrop-filter: blur(var(--glass-blur));
   border: 1px solid var(--glass-border);
   border-radius: var(--radius-lg);
   ```
4. **Mobile-first** - design for 375px first, then scale up
5. **Use Lora for headings, Raleway for body**
6. **Check contrast** for text on glass backgrounds (use `--color-text` and `--color-text-secondary`)
7. **Buttons** use gradient backgrounds with glow hover effect
8. **Forms** use translucent inputs with focus glow