# Living IT Website — Project Documentation

**Generated:** 2026-03-20
**Scan type:** Deep scan (initial)

---

## Project Overview

- **Type:** Monolith (single static site)
- **Primary Language:** TypeScript / Astro
- **Architecture:** Static Site Generation (SSG)
- **Framework:** Astro 5 + Tailwind CSS 4
- **Purpose:** Corporate website for Living IT Consulting Group AB

**Tech Stack Summary:** Astro 5 · Tailwind CSS 4 · TypeScript · lucide-astro · astro-icon · marked

---

## Generated Documentation

- [Project Overview](./project-overview.md) — Executive summary, business purpose, quick reference
- [Architecture](./architecture.md) — Full technical architecture: patterns, components, routing, SEO, deployment
- [Source Tree Analysis](./source-tree-analysis.md) — Annotated directory tree with descriptions of every file/folder
- [Component Inventory](./component-inventory.md) — All 7 Astro components: props, responsibilities, design system tokens
- [Development Guide](./development-guide.md) — Setup, npm scripts, content editing, adding pages, deployment

---

## Existing Documentation

- [README.md](../README.md) — Quick start, technology stack, pages list, deploy instructions

---

## Quick Navigation

### "Where do I find...?"

| I want to... | Go to |
|---|---|
| Understand the project at a high level | [project-overview.md](./project-overview.md) |
| Understand the technical architecture | [architecture.md](./architecture.md) |
| Find where a file lives | [source-tree-analysis.md](./source-tree-analysis.md) |
| Look up a component's props/behavior | [component-inventory.md](./component-inventory.md) |
| Set up local development | [development-guide.md](./development-guide.md) |
| Edit site content | [development-guide.md](./development-guide.md#content-editing) |
| Add a team member | [development-guide.md](./development-guide.md#adding-a-team-member) |
| Deploy the site | [development-guide.md](./development-guide.md#deployment) |

---

## Getting Started

```bash
npm install
npm run dev        # → http://localhost:5000
npm run build      # Production build to dist/
npm run preview    # Preview production build
npm run format     # Format code with Prettier
```

---

## Site Pages

| URL | File | Description |
|---|---|---|
| `/` | `src/pages/index.astro` | Home — Hero, Carousel, Services |
| `/mjukvarukonsulting` | `src/pages/mjukvarukonsulting.astro` | Software consulting |
| `/ledarskapskonsulting` | `src/pages/ledarskapskonsulting.astro` | Leadership consulting |
| `/events` | `src/pages/events.astro` | Events listing |
| `/kontakt` | `src/pages/kontakt.astro` | Contact page |
| `/cookies-policy` | `src/pages/cookies-policy.astro` | Cookie policy |
| `/bli-konsult` | _(301 redirect)_ | → `/kontakt` |

---

## Content Files (Edit These to Update Site Content)

| File | Controls |
|---|---|
| `src/config.ts` | Site metadata, nav links, hero text, carousel, footer, cookies |
| `src/content/services.ts` | 3 top-level service definitions |
| `src/content/consulting-sw.ts` | 9 software consulting role cards |
| `src/content/consulting-im.ts` | 9 leadership consulting roles (3 groups) |
| `src/content/events.ts` | 4 event entries |
| `src/content/contact.ts` | 8 team contacts + company data |
