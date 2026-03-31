# Architecture — Living IT Website

**Generated:** 2026-03-20
**Project Type:** Web — Static Site Generation (SSG)
**Framework:** Astro 5 + Tailwind CSS 4

---

## Executive Summary

The Living IT website (`livingit.se`) is a static marketing site for Living IT Consulting Group AB — a Swedish IT and leadership consulting firm with offices in Malmö, Helsingborg, and Göteborg. It is built with **Astro 5** using the SSG output model: all pages are pre-rendered to static HTML at build time, resulting in zero server-side runtime and maximum performance.

The site is content-light (marketing copy only, no CMS, no database) and architecture-simple: a flat set of Astro pages that share a single Layout component. All site content is authored as TypeScript data files in `src/content/`.

---

## Technology Stack

| Category | Technology | Version | Notes |
|---|---|---|---|
| Framework | Astro | ^6.0.4 | SSG mode, `.astro` components |
| Styling | Tailwind CSS | ^4.1.16 | CSS-first config via `@theme` in globals.css |
| Styling pipeline | PostCSS + @tailwindcss/postcss | ^4.1.16 | No tailwind.config.js needed |
| Language | TypeScript | strict (via Astro preset) | All source files |
| Icons | lucide-astro | ^0.556.0 | Inline SVG Lucide icons |
| Icons | astro-icon + @iconify-json/simple-icons | ^1.1.5 / ^1.2.69 | Social media icons |
| Markdown | marked | ^15.0.4 | Converts content body strings to HTML |
| Fonts | Atak (WOFF, self-hosted) | — | Primary brand font |
| Fonts | Geist (Google Fonts) | — | Fallback / supplemental |
| Formatter | Prettier | ^3.6.2 | With astro + tailwindcss plugins |
| Node types | @types/node | ^25.2.0 | For build scripts |

---

## Architecture Pattern

**Flat SSG with Data-as-Code content pattern.**

- No router: Astro file-based routing (`src/pages/*.astro` → URL paths)
- No state management: Static output, no client-side state
- No API layer: No backend, no API routes, no data fetching at runtime
- No database or ORM
- Content is TypeScript data files imported directly into pages at build time
- Client-side JavaScript is minimal: scroll animations, image carousel, mobile menu toggle

```
Request → CDN / Vercel Edge → pre-built static HTML (no server compute)
```

---

## Directory Structure

```
livingit.se/
├── src/
│   ├── config.ts              # Central site config + responsive image utilities
│   ├── components/            # Reusable Astro components
│   │   ├── Layout.astro       # HTML shell, <head>, global scripts
│   │   ├── Navigation.astro   # Fixed top nav bar, mobile menu
│   │   ├── Footer.astro       # 4-column footer, social links
│   │   ├── Hero.astro         # Home page hero section
│   │   ├── HeroCarousel.astro # Image carousel + "The Living IT Way" text
│   │   ├── Services.astro     # Service cards grid (home page)
│   │   └── CookieBanner.astro # GDPR cookie banner (currently disabled)
│   ├── content/               # All page content as TypeScript data
│   │   ├── services.ts        # 3 service definitions (SW, IM, Events)
│   │   ├── consulting-sw.ts   # 9 software consulting specializations
│   │   ├── consulting-im.ts   # 9 leadership consulting specializations (3 groups)
│   │   ├── events.ts          # 4 event types with images and body copy
│   │   └── contact.ts         # 8 team contacts + company registration data
│   ├── pages/                 # File-based routes → static HTML pages
│   │   ├── index.astro        # / (Home)
│   │   ├── mjukvarukonsulting.astro  # /mjukvarukonsulting
│   │   ├── ledarskapskonsulting.astro # /ledarskapskonsulting
│   │   ├── events.astro       # /events
│   │   ├── kontakt.astro      # /kontakt
│   │   └── cookies-policy.astro # /cookies-policy
│   └── styles/
│       └── globals.css        # Tailwind import, @theme tokens, animations, carousel CSS
├── public/
│   ├── images/
│   │   ├── logo-dark.svg
│   │   ├── logo-light.svg
│   │   ├── desktop/           # Desktop-size images (1920w)
│   │   ├── tablet/            # Tablet-size images (1024w)
│   │   └── mobile/            # Mobile-size images (640w)
│   ├── fonts/                 # Self-hosted Atak font (WOFF)
│   ├── email/                 # Email assets
│   ├── favicon.svg
│   ├── og-image.png           # Open Graph image (1200×400)
│   └── robots.txt             # Copied from seo/ at build time
├── scripts/
│   └── copy-robots.mjs        # Copies correct robots.txt based on env
├── seo/
│   ├── robots-livingit.txt    # Production robots.txt (allow all)
│   └── robots-devingit.txt    # Dev/staging robots.txt (noindex)
├── astro.config.ts            # Astro config: integrations, redirects, server
├── package.json
├── tsconfig.json              # Extends astro/tsconfigs/strict
└── postcss.config.js          # @tailwindcss/postcss plugin
```

---

## Page Routing

| URL | File | Description |
|---|---|---|
| `/` | `src/pages/index.astro` | Home: Hero + HeroCarousel + Services |
| `/mjukvarukonsulting` | `src/pages/mjukvarukonsulting.astro` | Software consulting + 9 specialization cards |
| `/ledarskapskonsulting` | `src/pages/ledarskapskonsulting.astro` | Leadership consulting + 3×3 specialization groups |
| `/events` | `src/pages/events.astro` | Events overview + 4 event cards with image carousels |
| `/kontakt` | `src/pages/kontakt.astro` | Contact page: 2 info cards, 8 team members, company data |
| `/cookies-policy` | `src/pages/cookies-policy.astro` | GDPR cookie policy (standalone layout, no Layout.astro) |
| `/bli-konsult` | _(redirect)_ | 301 → `/kontakt` (configured in astro.config.ts) |

---

## Component Architecture

All components are Astro components (`.astro`). There is no React, Vue, or other JS framework. Components use Astro's frontmatter (`---`) for logic and templating.

### Layout.astro — Global Shell
- Wraps all pages (except `cookies-policy.astro`, which has its own layout)
- Renders `<head>` with: title, description, keywords, Open Graph tags, Twitter Card tags
- Loads Atak + Geist fonts
- Renders `<Navigation />`, `<slot />` (page content), `<Footer />`, `<CookieBanner />`
- Includes `IntersectionObserver` script for scroll-triggered animations
- Adds `noindex, nofollow` for `devingit.se` hostname (dev environment detection)

### Navigation.astro
- Fixed top nav bar with backdrop blur
- Desktop: logo left, nav links center (with active state indicator), CTA button right
- Mobile: hamburger button → slide-down menu with same links + CTA
- Active state: bottom orange border on current page link (`aria-current="page"`)
- Nav links and CTA configured in `siteConfig.navigation`
- Uses `lucide-astro` for nav link icons

### Footer.astro
- 4-column grid: 3 office addresses (Malmö, Göteborg, Helsingborg) + brand column
- Brand column: logo, legal info (company name, VAT, copyright year)
- Social links: LinkedIn, Facebook, X, Instagram + Cookies policy link
- Social icons from `astro-icon` + `@iconify-json/simple-icons`
- All data from `siteConfig.footer`

### Hero.astro
- Full-width section with gradient background
- Displays `siteConfig.hero.headline` and `siteConfig.hero.subheadline`
- Uses `scroll-fade-up` animation class

### HeroCarousel.astro
- Two-column layout: image carousel (left) + "The Living IT Way" markdown text (right)
- Carousel: 10 images, auto-advances every 4500ms via `setInterval`
- Images use responsive `srcset` (mobile/tablet/desktop variants)
- Markdown rendered via `marked` library (`set:html`)
- Carousel JS: minimal vanilla JS, no library

### Services.astro
- 3-column card grid on home page
- Each card: icon, title, description, hover arrow
- Cards link to respective service pages
- Data from `src/content/services.ts`
- Alternating scroll-fade-left / scroll-fade-right animations

### CookieBanner.astro
- **Currently disabled** (HTML commented out, `{/* ... */}`)
- Only CSS and disabled script remain active
- Cookie policy accessible via footer link to `/cookies-policy`
- Was designed for `localStorage`-based consent tracking

---

## Content Management

All content is **data-as-code** in `src/content/` TypeScript files. To update site content, edit these files directly:

| File | What it controls |
|---|---|
| `src/config.ts` | Site metadata (name, title, description, URL, email), navigation links & CTA, hero text, carousel images & "Living IT Way" markdown, footer offices & social links, cookie policy text |
| `src/content/services.ts` | 3 top-level service definitions (title, description, body) shown on home and detail pages |
| `src/content/consulting-sw.ts` | 9 software consulting specialization cards on `/mjukvarukonsulting` |
| `src/content/consulting-im.ts` | 9 leadership consulting specializations organized in 3 groups (Interim Management, Projektledning, Förändringsledning) on `/ledarskapskonsulting` |
| `src/content/events.ts` | 4 event types with body copy and image arrays on `/events` |
| `src/content/contact.ts` | 8 team contacts (name, title, phone, email, photo) + 2 contact blurbs + company registration data |

---

## Responsive Images

A custom utility in `src/config.ts` provides responsive image support:

```typescript
// Generates three image paths from a single base path
getResponsiveImage('carousel/01.jpg')
// → { mobile: '/images/mobile/carousel/01.jpg',
//     tablet: '/images/tablet/carousel/01.jpg',
//     desktop: '/images/desktop/carousel/01.jpg' }

// Generates HTML srcset string
getImageSrcSet(image)
// → "...mobile 640w, ...tablet 1024w, ...desktop 1920w"
```

Images must exist in all three subdirectories: `public/images/mobile/`, `public/images/tablet/`, `public/images/desktop/`.

Predefined `sizes` configs in `imageSizes`: `contactPhoto`, `eventImage`, `carouselImage`.

---

## Animation System

CSS-based scroll-triggered animations powered by `IntersectionObserver` (in `Layout.astro`):

| Class | Effect |
|---|---|
| `.scroll-fade-up` | Fades in, moves up from below |
| `.scroll-fade-down` | Fades in, moves down from above |
| `.scroll-fade-left` | Fades in, slides in from right |
| `.scroll-fade-right` | Fades in, slides in from left |

Stagger delay classes `.stagger-1` through `.stagger-9` (100ms–900ms) add sequential animation to card grids.

The `IntersectionObserver` adds `.visible` class when elements enter viewport, triggering the CSS transitions.

---

## SEO Strategy

- **Production** (`livingit.se`): `robots.txt` allows all crawlers
- **Development** (`devingit.se` hostname): `robots.txt` disallows all + `<meta robots noindex, nofollow>` applied via Layout.astro
- Environment detection: `ROBOTS_ENV` → `CF_PAGES_BRANCH` → `NODE_ENV` env vars (Cloudflare Pages compatible)
- Open Graph: title, description, image (`/og-image.png`, 1200×400), locale `sv_SE`
- Twitter Card: summary style with same image
- Page titles: `[Page Name] - Living IT` pattern (via Layout `title` prop)

---

## Deployment

Static site — deployable to any static host:

- **Vercel** (primary, referenced in README)
- **Netlify**
- **GitHub Pages**
- **Cloudflare Pages** (env var `CF_PAGES_BRANCH` suggests this may be in use)

Build output: `dist/` directory (excluded from git).

No CI/CD pipeline configuration files found in the repository.

---

## GDPR / Privacy

- No analytics or tracking cookies
- No third-party tracking scripts
- Self-hosted primary font (Atak) — no font provider tracking
- Google Fonts loaded for Geist (one external request)
- Cookie policy page at `/cookies-policy`
- Cookie banner component exists but is currently disabled
- Only essential/technical cookies used (localStorage for cookie banner state)
