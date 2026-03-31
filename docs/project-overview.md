# Project Overview — Living IT Website

**Generated:** 2026-03-20

---

## About the Project

**livingit.se** is the corporate marketing website for **Living IT Consulting Group AB**, a Swedish IT and leadership consulting firm with offices in Malmö, Helsingborg, and Göteborg. The site presents the company's services, events, and contact information.

The company's tagline is *"Dreaming today, living it tomorrow"* — and their philosophy ("The Living IT Way") emphasizes that work-life balance enables better professional results.

---

## Business Purpose

The website serves as:
- **Primary marketing presence** — describes services and company values to prospective clients
- **Talent acquisition channel** — encourages prospective consultants to reach out
- **Events hub** — promotes Living IT events (Beauty in Code conference, workshops, IT-bio, IT-helg)
- **Contact directory** — lists key business development and leadership contacts

---

## Technology Summary

| Category | Technology |
|---|---|
| Framework | Astro 5 (SSG — Static Site Generation) |
| Styling | Tailwind CSS 4 (CSS-first config) |
| Language | TypeScript |
| Hosting | Static (Vercel / Netlify / GitHub Pages compatible) |
| Build output | Pre-rendered HTML — no server runtime |
| Content management | TypeScript data files (no CMS) |

---

## Architecture Type

**Monolith — Single Static Site**

- 6 pre-rendered pages
- 7 Astro components
- 5 TypeScript content data files
- No backend, database, API, or server runtime
- All content is authored in TypeScript and compiled at build time

---

## Pages

| Page | URL | Purpose |
|---|---|---|
| Home | `/` | Hero + company intro + services overview |
| Software Consulting | `/mjukvarukonsulting` | SW consulting service description + 9 role cards |
| Leadership Consulting | `/ledarskapskonsulting` | Leadership consulting + 3 groups × 3 role cards |
| Events | `/events` | Events intro + 4 event cards (Beauty in Code, Workshops, IT-bio, IT-helg) |
| Contact | `/kontakt` | 2 contact CTAs, 8 team members with photos, company registration |
| Cookie Policy | `/cookies-policy` | GDPR cookie policy (standalone layout) |

---

## Key Design Decisions

1. **Data-as-code content pattern** — All site content is TypeScript data in `src/content/`. No headless CMS dependency. Simple to edit for developers.

2. **Static generation** — Zero server costs, maximum performance, CDN-friendly. No runtime infrastructure to maintain.

3. **Responsive images** — Custom `getResponsiveImage()` utility provides mobile/tablet/desktop variants for all content images, reducing bandwidth on mobile devices.

4. **No tracking/analytics** — Only essential technical cookies. GDPR-compliant by design. No Google Analytics or other tracking scripts.

5. **Dual robots.txt** — Separate robots files for production (`livingit.se`) and dev (`devingit.se`) environments, selected automatically at build time.

---

## Repository Structure

```
src/           Source code (components, pages, content, styles)
public/        Static assets (images, fonts, favicon)
scripts/       Build utility scripts
seo/           SEO configuration files (robots.txt variants)
docs/          Project documentation (this folder)
dist/          Build output (gitignored)
```

---

## Quick Reference

| Task | Where |
|---|---|
| Edit site title/description/metadata | `src/config.ts` → `siteConfig.site` |
| Edit navigation links | `src/config.ts` → `siteConfig.navigation` |
| Edit hero text | `src/config.ts` → `siteConfig.hero` |
| Edit "The Living IT Way" text | `src/config.ts` → `siteConfig.heroCarousel.markdown` |
| Edit footer offices/social | `src/config.ts` → `siteConfig.footer` |
| Edit service descriptions | `src/content/services.ts` |
| Edit software consulting roles | `src/content/consulting-sw.ts` |
| Edit leadership consulting roles | `src/content/consulting-im.ts` |
| Edit events | `src/content/events.ts` |
| Edit contact people | `src/content/contact.ts` |
| Add a new page | Create `src/pages/my-page.astro` |
| Change brand colors | `src/styles/globals.css` → `@theme` |

---

## Getting Started

```bash
npm install
npm run dev
# → http://localhost:5000
```

See [development-guide.md](./development-guide.md) for full setup and content editing instructions.
See [architecture.md](./architecture.md) for deep technical documentation.
See [component-inventory.md](./component-inventory.md) for component reference.
