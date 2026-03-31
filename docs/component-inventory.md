# Component Inventory — Living IT Website

**Generated:** 2026-03-20
**Component count:** 7 Astro components
**Location:** `src/components/`

---

## Summary

All components are native Astro components (`.astro`). There is no React, Vue, Svelte, or other JS UI framework. Components use Astro frontmatter (`---`) for build-time logic and TypeScript imports.

Client-side JavaScript is included inline in component `<script>` tags where needed (carousel, mobile menu, scroll animations, cookies).

---

## Layout Components

### Layout.astro
**Path:** `src/components/Layout.astro`
**Used by:** All pages except `cookies-policy.astro`
**Role:** Global HTML shell — wraps every page with consistent `<head>`, navigation, footer, and cookie banner.

**Props:**
```typescript
interface Props {
  title?: string;      // defaults to siteConfig.site.title
  description?: string; // defaults to siteConfig.site.description
}
```

**Renders:**
- Full `<!doctype html>` document
- `<head>`: charset, viewport, robots meta, favicon, title, description, keywords
- Open Graph tags: title, description, type, locale (`sv_SE`), image (`/og-image.png`, 1200×400)
- Twitter Card tags: summary, title, description, image
- Font preconnects: Google Fonts (Geist)
- `<Navigation />`, `<main><slot /></main>`, `<Footer />`, `<CookieBanner />`
- `IntersectionObserver` script for scroll-triggered animations (`.scroll-fade-*` classes)

**Special behavior:**
- Detects `devingit.se` hostname → sets `noindex, nofollow` robots meta (dev environment guard)
- Constructs absolute OG image URL from `siteConfig.site.url`

---

## Navigation Components

### Navigation.astro
**Path:** `src/components/Navigation.astro`
**Used by:** `Layout.astro` + `cookies-policy.astro` (direct import)
**Role:** Fixed top navigation bar with desktop and mobile variants.

**Props:** None (all data from `siteConfig.navigation`)

**Renders:**
- Fixed top bar (`position: fixed, z-50`) with backdrop blur
- Logo (`logo-light.svg`) linking to `/`
- Desktop nav: 3 page links with Lucide icons, active state (orange bottom border + `aria-current`)
- Desktop CTA: "Kontakta oss" button → `/kontakt`
- Mobile: hamburger button (Lucide `Menu` icon) → slide-down menu with same links + CTA
- Semantic `<header>` + `<nav>` with ARIA labels

**Client-side JS:** Mobile menu toggle (show/hide, aria-expanded, close on link click)

**Data source:** `siteConfig.navigation.links` + `siteConfig.navigation.cta`

---

## Content Components

### Hero.astro
**Path:** `src/components/Hero.astro`
**Used by:** `src/pages/index.astro`
**Role:** Full-width hero section at the top of the home page.

**Props:** None (all data from `siteConfig.hero`)

**Renders:**
- `<section>` with gradient background (`mono-mesh` + `--color-bg-main-default`)
- `<h1>` with headline + contrasting subheadline
- Description paragraph
- Scroll-fade-up animation on headline and description

**Data source:** `siteConfig.hero.headline`, `.subheadline`, `.description`

---

### HeroCarousel.astro
**Path:** `src/components/HeroCarousel.astro`
**Used by:** `src/pages/index.astro`
**Role:** Two-column section — auto-rotating image carousel (left) + "The Living IT Way" company philosophy text (right).

**Props:** None (all data from `siteConfig.heroCarousel`)

**Renders:**
- Two-column grid (1:1 on large screens, stacked on mobile)
- Left: Portrait-ratio image carousel (`carousel-frame-portrait`, aspect 4:5)
  - 10 images with responsive `srcset` (mobile/tablet/desktop)
  - First image: `loading="eager"`, rest: `loading="lazy"`
  - `data-carousel` and `data-interval` attributes for JS
- Right: Markdown body text rendered via `marked` library (`set:html`)
- Scroll-fade-left / scroll-fade-right animations

**Client-side JS:** `setInterval` carousel — advances active image every `intervalMs` ms (4500ms)

**Data source:** `siteConfig.heroCarousel.images`, `.markdown`, `.intervalMs`, `.imageAltPrefix`

---

### Services.astro
**Path:** `src/components/Services.astro`
**Used by:** `src/pages/index.astro`
**Role:** 3-column services card grid on the home page.

**Props:** None

**Renders:**
- Section header from `siteConfig.services.title` and `.subtitle`
- 3 cards from `src/content/services.ts` (index 0, 1, 2)
- Each card: Lucide icon, title, description, hover arrow (`ArrowRight`)
- Cards link to: `/mjukvarukonsulting`, `/ledarskapskonsulting`, `/events`
- Alternating scroll-fade-left / scroll-fade-right with stagger delays

**Data source:** `servicesContent` (from `src/content/services.ts`) + `siteConfig.services`

---

### Footer.astro
**Path:** `src/components/Footer.astro`
**Used by:** `Layout.astro` + `cookies-policy.astro` (direct import)
**Role:** Site footer with office addresses and brand information.

**Props:** None (all data from `siteConfig.footer.columns`)

**Renders:**
- Dark background footer (`--color-bg-footer`)
- 4-column grid:
  - Column 1: Malmö office address (links to Google Maps)
  - Column 2: Göteborg office address (links to Google Maps)
  - Column 3: Helsingborg office address (links to Google Maps)
  - Column 4: Logo + legal info (company name, VAT, copyright year) + social icon links
- Social icons: LinkedIn, Facebook, X, Instagram (via `astro-icon` + simple-icons)
- Cookies link → `/cookies-policy` (Lucide `Cookie` icon)
- All addresses open `target="_blank" rel="noopener noreferrer"`
- Tooltip on hover for social icons (`.tooltip-above` CSS class)

**Data source:** `siteConfig.footer.columns`

---

## Utility Components

### CookieBanner.astro
**Path:** `src/components/CookieBanner.astro`
**Used by:** `Layout.astro`
**Role:** GDPR cookie consent banner. **Currently disabled.**

**Status:** The banner HTML is commented out with `{/* ... */}`. Only the CSS styles remain active. The component renders nothing visually.

**Original design:**
- Fixed bottom-of-screen banner with background image
- Accept button → stores consent in `localStorage` (`cookie-notice-acknowledged: 'true'`)
- Link to `/cookies-policy`
- Responsive: stacked layout on mobile
- Responsive background images (CSS `--mobile-bg`, `--tablet-bg` variables)

**Why disabled:** Living IT only uses essential/technical cookies; full consent banner deemed unnecessary. Cookie policy accessible via footer link.

**To re-enable:** Uncomment the JSX block in `CookieBanner.astro` (lines 11–38)

---

## Component Dependencies

```
Layout.astro
  ├── Navigation.astro
  │   ├── siteConfig (config.ts)
  │   └── lucide-astro icons
  ├── Footer.astro
  │   ├── siteConfig (config.ts)
  │   ├── lucide-astro icons
  │   └── astro-icon (simple-icons)
  └── CookieBanner.astro (disabled)
      └── siteConfig (config.ts)

Hero.astro
  └── siteConfig (config.ts)

HeroCarousel.astro
  ├── siteConfig (config.ts)
  ├── marked (markdown parsing)
  └── astro:assets Image

Services.astro
  ├── siteConfig (config.ts)
  ├── services.ts (content)
  └── lucide-astro icons
```

---

## Design System Tokens

Defined in `src/styles/globals.css` via Tailwind 4's `@theme`:

| Token | Value | Usage |
|---|---|---|
| `--color-mono-black` | `#000000` | Primary text |
| `--color-mono-darker` | `#303132` | Hero subheadline |
| `--color-mono-dark` | `#414243` | Body text |
| `--color-mono-gray` | `#757779` | Labels |
| `--color-mono-light` | `#a3a5a8` | Secondary/footer text |
| `--color-mono-lighter` | `#e5e8ec` | Borders |
| `--color-bg-navigation` | `#f8f9ff` | Nav bar background |
| `--color-bg-main-default` | `#f0f1f7` | Page background |
| `--color-bg-main-section` | `#e3e4ea` | Alternate section background |
| `--color-bg-card` | `#f8f9ff` | Card background |
| `--color-bg-footer` | `#1c1c1a` | Footer background |
| `--color-orange` | `#ff8705` | Brand accent: CTAs, icons, active indicators |
| `--font-sans` | `Atak, system-ui, sans-serif` | Body font |

**Typography:** Atak font (self-hosted WOFF) — Regular (400), Regular Italic, Semibold (600), Semibold Italic. Geist from Google Fonts as fallback.
