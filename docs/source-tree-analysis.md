# Source Tree Analysis — Living IT Website

**Generated:** 2026-03-20

---

## Annotated Directory Tree

```
livingit.se/                        # Project root
│
├── src/                            # ★ ALL SOURCE CODE LIVES HERE
│   ├── config.ts                   # ★ ENTRY POINT — Global site config + image utilities
│   │                               #   Exports: siteConfig, getResponsiveImage, getImageSrcSet, imageSizes
│   │
│   ├── components/                 # Reusable Astro UI components
│   │   ├── Layout.astro            # ★ Root layout — wraps all pages
│   │   │                           #   Head tags, OG meta, font loading, global scripts
│   │   ├── Navigation.astro        # Fixed top navigation bar + mobile menu
│   │   ├── Footer.astro            # Site footer (offices, social links, legal)
│   │   ├── Hero.astro              # Home page hero section (headline + subheadline)
│   │   ├── HeroCarousel.astro      # Image carousel + "The Living IT Way" markdown section
│   │   ├── Services.astro          # Service cards grid (used on home page)
│   │   └── CookieBanner.astro      # GDPR cookie banner component (DISABLED - CSS only)
│   │
│   ├── content/                    # ★ ALL SITE CONTENT — TypeScript data files
│   │   ├── services.ts             # 3 service definitions: SW consulting, IM consulting, Events
│   │   ├── consulting-sw.ts        # 9 software consulting specialization cards
│   │   ├── consulting-im.ts        # 9 leadership consulting items in 3 groups
│   │   ├── events.ts               # 4 event entries with images + body copy
│   │   └── contact.ts             # 8 team contacts + company registration data
│   │
│   ├── pages/                      # ★ File-based routing — each file = one URL
│   │   ├── index.astro             # / → Home page
│   │   ├── mjukvarukonsulting.astro # /mjukvarukonsulting → Software consulting page
│   │   ├── ledarskapskonsulting.astro # /ledarskapskonsulting → Leadership consulting page
│   │   ├── events.astro            # /events → Events listing page
│   │   ├── kontakt.astro           # /kontakt → Contact page
│   │   └── cookies-policy.astro    # /cookies-policy → GDPR cookie policy (standalone layout)
│   │
│   └── styles/
│       └── globals.css             # ★ Tailwind + CSS design tokens + all custom CSS
│                                   #   @theme: colors, fonts, animations
│                                   #   Scroll animation classes, carousel styles, stagger delays
│
├── public/                         # Static assets (served as-is, not processed by Astro)
│   ├── images/
│   │   ├── logo-dark.svg           # Logo for dark backgrounds (footer)
│   │   ├── logo-light.svg          # Logo for light backgrounds (navigation)
│   │   ├── desktop/                # Desktop images (used in srcset as 1920w)
│   │   │   ├── carousel/           # Carousel: 10 images (01–10.jpg)
│   │   │   ├── events/             # Event images (beautyincode, workshop, it-bio, it-helg)
│   │   │   ├── contact/            # Team member photos (8 people)
│   │   │   └── cookies-back.jpg    # Cookie banner background (banner disabled)
│   │   ├── tablet/                 # Tablet images (used in srcset as 1024w)
│   │   │   └── (same structure)
│   │   └── mobile/                 # Mobile images (used in srcset as 640w)
│   │       └── (same structure)
│   ├── fonts/
│   │   ├── AtakRegular-Web.woff    # Atak font — regular weight
│   │   ├── AtakRegular-Italic-Web.woff  # Atak font — regular italic
│   │   ├── AtakSemibold-Web.woff   # Atak font — semibold
│   │   └── AtakSemibold-Italic-Web.woff # Atak font — semibold italic
│   ├── email/                      # Email-related assets
│   ├── favicon.svg                 # Browser tab icon
│   ├── og-image.png                # Open Graph image (1200×400 px)
│   └── robots.txt                  # Copied from seo/ at build time (gitignored)
│
├── scripts/
│   └── copy-robots.mjs             # Build script: copies correct robots.txt based on env
│                                   # Reads: ROBOTS_ENV / CF_PAGES_BRANCH / NODE_ENV
│
├── seo/
│   ├── robots-livingit.txt         # Production: allows all crawlers
│   └── robots-devingit.txt         # Dev/staging: disallows all (noindex)
│
├── astro.config.ts                 # Astro configuration
│                                   # - astro-icon integration
│                                   # - 301 redirect: /bli-konsult → /kontakt
│                                   # - Dev server: port 5000, host 0.0.0.0
│
├── package.json                    # Dependencies + npm scripts
├── postcss.config.js               # PostCSS: @tailwindcss/postcss plugin
├── tsconfig.json                   # TypeScript: extends astro/tsconfigs/strict
│
├── docs/                           # ★ Project documentation (this folder)
│   ├── index.md                    # Master documentation index
│   ├── architecture.md             # Full architecture document
│   ├── source-tree-analysis.md     # This file
│   ├── component-inventory.md      # UI component catalog
│   ├── development-guide.md        # Dev setup + commands
│   ├── project-overview.md         # Executive overview
│   └── project-scan-report.json    # Documentation workflow state
│
├── _bmad/                          # BMAD workflow config (not project source)
├── _bmad-output/                   # BMAD output artifacts (not project source)
├── .claude/                        # Claude Code configuration (not project source)
├── dist/                           # Build output (gitignored)
├── node_modules/                   # Dependencies (gitignored)
└── .astro/                         # Astro generated types (gitignored)
```

---

## Critical Entry Points

| Entry Point | Path | Role |
|---|---|---|
| Site config | `src/config.ts` | Single source of truth for all site-wide text, links, images |
| Root layout | `src/components/Layout.astro` | HTML wrapper for all pages |
| Home page | `src/pages/index.astro` | Site root, composes Hero + HeroCarousel + Services |
| Build script | `scripts/copy-robots.mjs` | Run before `astro build`, selects robots.txt |
| Styles | `src/styles/globals.css` | All CSS: Tailwind, design tokens, animation system |

---

## Key Integration Points

- `src/config.ts` → imported by ALL components and pages
- `src/content/*.ts` → imported by specific pages that need that content
- `src/components/Layout.astro` → wraps all pages except `cookies-policy.astro`
- `public/images/{desktop|tablet|mobile}/` → referenced by `getResponsiveImage()` at build time
- `seo/robots-*.txt` → copied to `public/robots.txt` by `scripts/copy-robots.mjs`

---

## What Is Not In This Repo

- No backend, API, or server-side code
- No database or ORM
- No CI/CD pipeline configuration (`.github/workflows/`, etc.)
- No test files (no testing framework configured)
- No CMS integration
- No environment variable files (`.env` is gitignored)
