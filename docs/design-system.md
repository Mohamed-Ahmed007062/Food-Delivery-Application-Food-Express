# Design System

This document outlines the core design language for the Food Delivery Web Application. It provides a foundation for consistent UI/UX implementation across the entire application using Tailwind CSS and shadcn/ui.

## Color Palette

Our color palette is designed to be modern, vibrant, and appetizing, while maintaining high contrast and accessibility.

### Brand Colors
| Name | Hex | HSL | CSS Variable | Usage |
| :--- | :--- | :--- | :--- | :--- |
| Primary | `#EA580C` | `24.6, 95%, 48.2%` | `--primary` | Main brand color, primary buttons, active states, key highlights |
| Primary Foreground | `#FFFFFF` | `0, 0%, 100%` | `--primary-foreground` | Text on primary elements |
| Secondary | `#0D9488` | `174.7, 83.9%, 31.6%` | `--secondary` | Trust signals, freshness indicators, secondary buttons |
| Secondary Foreground | `#FFFFFF` | `0, 0%, 100%` | `--secondary-foreground`| Text on secondary elements |
| Accent | `#F43F5E` | `349.7, 89.2%, 60.2%` | `--accent` | Call to Action (CTA), special offers, highlights |
| Accent Foreground | `#FFFFFF` | `0, 0%, 100%` | `--accent-foreground` | Text on accent elements |

### Neutral Colors
| Name | Hex (Light) / Hex (Dark) | HSL | CSS Variable | Usage |
| :--- | :--- | :--- | :--- | :--- |
| Background | `#FAFAFA` / `#0F172A` | L: `0, 0%, 98%` / D: `222.2, 47.4%, 11.2%` | `--background` | Page background |
| Surface | `#FFFFFF` / `#1E293B` | L: `0, 0%, 100%` / D: `215, 27.9%, 16.9%` | `--card`, `--popover` | Cards, modals, popovers, dropdowns |
| Text Primary | `#0F172A` / `#F8FAFC` | L: `222.2, 47.4%, 11.2%` / D: `210, 40%, 98%` | `--foreground` | Main text, headings |
| Text Secondary | `#64748B` / `#94A3B8` | L: `215.4, 16.3%, 46.9%` / D: `215, 20.2%, 65.1%` | `--muted-foreground` | Subtitles, helper text, placeholders |
| Border | `#E2E8F0` / `#334155` | L: `214.3, 31.8%, 91.4%` / D: `215, 27.9%, 16.9%` | `--border` | Dividers, card borders, input borders |
| Muted | `#F1F5F9` / `#1E293B` | L: `210, 40%, 96.1%` / D: `217.2, 32.6%, 17.5%` | `--muted` | Disabled states, subtle backgrounds |

### Semantic Colors
| Name | Hex | HSL | CSS Variable | Usage |
| :--- | :--- | :--- | :--- | :--- |
| Success | `#22C55E` | `142.1, 70.6%, 45.3%` | `--success` | Order completed, successful actions |
| Warning | `#F59E0B` | `37.7, 92.1%, 50.2%` | `--warning` | Pending status, alerts |
| Error | `#EF4444` | `0, 84.2%, 60.2%` | `--destructive` | Destructive actions, validation errors, cancelled orders |
| Info | `#3B82F6` | `217.2, 91.2%, 59.8%` | `--info` | Informational messages, delivery updates |

### Gradient Definitions
| Name | Definition | Usage |
| :--- | :--- | :--- |
| Primary Gradient | `linear-gradient(to right, var(--primary), var(--accent))` | Highlighting premium features, special banners |
| Hero Gradient | `linear-gradient(135deg, rgba(234,88,12,0.1) 0%, rgba(244,63,94,0.05) 100%)` | Subtle background for hero sections |
| Card Hover Gradient | `linear-gradient(to bottom, transparent, rgba(0,0,0,0.05))` | Subtle overlay on hover for interactive cards |

---

## Typography

**Font Families:**
- **Headings:** `Inter` or `Outfit`
- **Body:** `Inter`
- **Monospace:** `JetBrains Mono`

### Type Scale
| Name | Size | Weight | Line Height | Letter Spacing | Tailwind Class |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Display | 48px / 3rem | 700 (Bold) | 1.1 | -0.02em | `text-5xl font-bold` |
| H1 | 36px / 2.25rem | 700 (Bold) | 1.2 | -0.015em | `text-4xl font-bold` |
| H2 | 30px / 1.875rem | 600 (Semibold) | 1.25 | -0.01em | `text-3xl font-semibold` |
| H3 | 24px / 1.5rem | 600 (Semibold) | 1.3 | normal | `text-2xl font-semibold` |
| H4 | 20px / 1.25rem | 600 (Semibold) | 1.4 | normal | `text-xl font-semibold` |
| Body Large | 18px / 1.125rem | 400 (Regular) | 1.5 | normal | `text-lg` |
| Body | 16px / 1rem | 400 (Regular) | 1.5 | normal | `text-base` |
| Body Small | 14px / 0.875rem | 400 (Regular) | 1.4 | normal | `text-sm` |
| Caption | 12px / 0.75rem | 400 (Regular) | 1.3 | 0.01em | `text-xs` |

---

## Responsive Breakpoints

| Breakpoint | Width | Target | Columns | Margin | Gutter |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Mobile S | `320px` | Small phones | 4 | 16px | 8px |
| Mobile M | `375px` | Standard phones | 4 | 16px | 8px |
| Mobile L | `425px` | Large phones | 4 | 16px | 12px |
| Tablet | `768px` (md) | Tablets | 8 | 24px | 16px |
| Laptop | `1024px` (lg) | Laptops | 12 | 32px | 24px |
| Desktop | `1280px` (xl) | Desktops | 12 | 40px | 24px |
| Large | `1536px` (2xl) | Large screens | 12 | auto | 24px |

---

## Spacing Scale

Based on a 4px base unit.

| Name | Size (px) | Tailwind | Usage |
| :--- | :--- | :--- | :--- |
| `1` | 4px | `*-1` | Tight element spacing |
| `2` | 8px | `*-2` | Small gaps |
| `3` | 12px | `*-3` | Inner padding for small items |
| `4` | 16px | `*-4` | Standard padding/margin, base gutter |
| `5` | 20px | `*-5` | Loose inner padding |
| `6` | 24px | `*-6` | Section inner spacing, standard gutter |
| `8` | 32px | `*-8` | Sub-section spacing |
| `10` | 40px | `*-10` | Large section spacing |
| `12` | 48px | `*-12` | Component grouping |
| `16` | 64px | `*-16` | Major section breaks |
| `20` | 80px | `*-20` | Hero vertical padding |
| `24` | 96px | `*-24` | Page top/bottom padding |
| `32` | 128px| `*-32` | Max spacing |

---

## Border Radius

| Name | Radius | Usage | Tailwind Class |
| :--- | :--- | :--- | :--- |
| None | 0 | Hard edges | `rounded-none` |
| Small | 4px | Badges, small inputs, tooltips | `rounded` or `rounded-sm` |
| Medium | 8px | Buttons, inputs, modals, dropdowns | `rounded-md` |
| Large | 12px | Standard cards, feature blocks | `rounded-lg` |
| XL | 16px | Hero sections, large banners | `rounded-xl` |
| Full | 9999px | Pills, avatars, circular buttons | `rounded-full` |

---

## Shadows

| Name | Utility | Usage | Tailwind Class |
| :--- | :--- | :--- | :--- |
| Small | Subtle | Subtle card shadow, buttons | `shadow-sm` |
| Medium | Elevated | Elevated cards, persistent header | `shadow-md` |
| Large | Floating | Modals, dropdown menus, popovers | `shadow-lg` |
| XL | Deep Float | Highly floating elements, major dialogues | `shadow-xl` |
| Inner | Inset | Inset shadow for inputs, pressed states | `shadow-inner` |

---

## Animations & Transitions

- **Duration:** 
  - Fast: 150ms (`duration-150`)
  - Normal: 300ms (`duration-300`)
  - Slow: 500ms (`duration-500`)
- **Easing:** `ease-in-out` as default (`ease-in-out`)

### Common Animations
| Animation | CSS/Tailwind | Usage |
| :--- | :--- | :--- |
| Fade In | `animate-in fade-in` | Modals, lazy-loaded images, dropdowns |
| Slide Up | `animate-in slide-in-from-bottom` | Toasts, sheet menus |
| Slide In | `animate-in slide-in-from-right` | Mobile navigation drawers |
| Scale Up | `hover:scale-105` | Card hovers, interactive elements |
| Pulse | `animate-pulse` | Loading states, attention grabbers |
| Shimmer | Custom keyframes | Skeleton loading states |

---

## Dark Mode Strategy

- Implemented using Tailwind's `class` strategy.
- Toggle dark mode by adding the `dark` class (or `data-theme="dark"`) on the `<html>` element.
- All colors defined in the palette have a corresponding dark mode representation utilizing CSS custom properties.
- Example structure in `globals.css`:
  ```css
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 47.4% 11.2%;
    /* ... */
  }
  .dark {
    --background: 222.2 47.4% 11.2%;
    --foreground: 210 40% 98%;
    /* ... */
  }
  ```

---

## Iconography

- **Library:** `lucide-react` (shadcn/ui default)
- **Standard Sizes:**
  - Small: `16px` (`w-4 h-4`) - inline text, small buttons
  - Medium: `20px` (`w-5 h-5`) - standard buttons, standard list items
  - Large: `24px` (`w-6 h-6`) - headers, prominent UI controls
- **Stroke Width:** Default `2px` for consistency across all scales.
