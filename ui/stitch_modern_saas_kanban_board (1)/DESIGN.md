---
name: Kinetic Enterprise
colors:
  surface: '#f9f9ff'
  surface-dim: '#d3daea'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eefe'
  surface-container-high: '#e2e8f8'
  surface-container-highest: '#dce2f3'
  on-surface: '#151c27'
  on-surface-variant: '#424754'
  inverse-surface: '#2a313d'
  inverse-on-surface: '#ebf1ff'
  outline: '#727785'
  outline-variant: '#c2c6d6'
  surface-tint: '#005ac2'
  primary: '#0058be'
  on-primary: '#ffffff'
  primary-container: '#2170e4'
  on-primary-container: '#fefcff'
  inverse-primary: '#adc6ff'
  secondary: '#712ae2'
  on-secondary: '#ffffff'
  secondary-container: '#8a4cfc'
  on-secondary-container: '#fffbff'
  tertiary: '#924700'
  on-tertiary: '#ffffff'
  tertiary-container: '#b75b00'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#eaddff'
  secondary-fixed-dim: '#d2bbff'
  on-secondary-fixed: '#25005a'
  on-secondary-fixed-variant: '#5a00c6'
  tertiary-fixed: '#ffdcc6'
  tertiary-fixed-dim: '#ffb786'
  on-tertiary-fixed: '#311400'
  on-tertiary-fixed-variant: '#723600'
  background: '#f9f9ff'
  on-background: '#151c27'
  surface-variant: '#dce2f3'
typography:
  display-lg:
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
  label-sm:
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  gutter: 16px
  sidebar-width: 260px
  kanban-column-width: 300px
---

## Brand & Style
This design system is engineered for high-performance productivity, blending the spatial clarity of Notion with the technical precision of Linear. The brand personality is professional, efficient, and reliable, aimed at teams who require a low-friction interface for complex task management.

The aesthetic follows a **Corporate / Modern** style with a focus on functional minimalism. It utilizes subtle depth through tonal layering and precise borders rather than heavy decorative elements. The goal is to create a "zen-like" workspace where the UI recedes to prioritize user content and workflow velocity.

## Colors
The palette is divided into two distinct modes to support long-form focus. 

**Light Mode** utilizes high-key whites and soft gray surfaces to define work areas. The primary blue (#3B82F6) acts as a functional signifier for actions and progress.

**Dark Mode** shifts to a deep charcoal base (#0B0E14) to reduce eye strain. It employs a sophisticated blue-purple accent (#7C3AED) to maintain visibility against darker backgrounds. 

Both modes prioritize WCAG 2.1 AA contrast ratios for all text elements against their respective backgrounds. Use `surface-alt` for nested elements like sidebar groups or inner card sections to provide subtle hierarchy.

## Typography
The system relies exclusively on **Inter** to ensure maximum legibility and a systematic, utilitarian feel. 

- **Display & Headlines:** Use tight letter-spacing for larger sizes to maintain a compact, "designed" look. 
- **Body Text:** `body-md` (14px) is the standard for most application data, including task descriptions and sidebar links.
- **Labels:** `label-sm` is specifically for metadata, tags, and small badges, utilizing all-caps and increased tracking for distinctiveness at small sizes.

## Layout & Spacing
The layout follows a **Fixed-Fluid hybrid grid**. Sidebars and Kanban columns have fixed widths to maintain structural predictability, while the main workspace expands to fill the viewport.

A 4px base unit governs all spacing. 
- **Kanban Board:** Columns should be spaced by `md` (16px). Inner card padding should also be `md`.
- **Sidebars:** Use `sm` (8px) for vertical list item spacing and `md` for horizontal container margins.
- **Modals:** Use `xl` (32px) padding for headers and footers to give complex forms breathing room.
- **Mobile:** Transition to a single-column layout where Kanban stacks vertically, or use a horizontal-scroll "swipe" pattern for columns.

## Elevation & Depth
This design system uses **Tonal Layers** supplemented by **Ambient Shadows**.

1.  **Level 0 (Background):** Pure background color. Used for the app canvas.
2.  **Level 1 (Surface):** Tonal lift (`surface`). Used for sidebar backgrounds and Kanban column containers.
3.  **Level 2 (Cards):** Elevated containers. Task cards use a subtle shadow (Light: 0 1px 3px rgba(0,0,0,0.1); Dark: no shadow, just a `border`).
4.  **Level 3 (Popovers/Modals):** Floating elements. High-diffusion shadows to indicate temporary prominence.

In Dark Mode, depth is primarily conveyed via border contrast and increasing surface lightness rather than shadows, which become invisible.

## Shapes
A **Rounded** geometry (8px–16px) is used to soften the technical nature of the application, making it feel approachable and modern.

- **Standard Buttons/Inputs:** 8px (0.5rem).
- **Task Cards:** 12px (0.75rem).
- **Large Containers/Modals:** 16px (1rem).
- **Avatars/Badges:** Full circle (Pill) for distinct visual separation from square-ish task cards.

## Components
- **Buttons:**
    - *Solid:* Primary action, high emphasis.
    - *Outline:* Secondary action, uses `border` tokens.
    - *Ghost:* For toolbar actions or sidebar items; reveals `surface-alt` background on hover.
- **Task Cards:** Use white/surface background with a 1px border. On hover, the border color should shift to the `accent` color.
- **Inputs:** 40px height, 8px radius. Use a 2px accent border for the focus state.
- **Badges/Chips:** Low-saturation backgrounds with high-saturation text for status indicators (e.g., "In Progress," "Urgent").
- **Avatars:** 32px standard size. Use initials or high-quality image crops with a 2px border matching the background to "cut" through overlapping elements in stacks.
- **Sidebar Items:** Clear 8px padding, active state indicated by a vertical 4px bar on the left edge and a shift to the `accent` text color.