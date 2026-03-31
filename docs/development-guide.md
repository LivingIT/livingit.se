# Development Guide — Living IT Website

**Generated:** 2026-03-20

---

## Prerequisites

| Requirement | Version | Notes |
|---|---|---|
| Node.js | ≥18.0.0 | Required by Astro 5 |
| npm | ≥8.0.0 | Included with Node.js |
| Git | Any recent | For version control |

No other runtime dependencies (no Docker, no database, no external services required for local development).

---

## Quick Start

```bash
# Clone the repository
git clone <repo-url>
cd livingit.se

# Install dependencies
npm install

# Start development server
npm run dev
```

The dev server runs at **http://localhost:5000** (or the network IP shown in the terminal).

---

## npm Scripts

| Script | Command | Description |
|---|---|---|
| `npm run dev` | `astro dev` | Start development server with HMR |
| `npm run build` | `node scripts/copy-robots.mjs && astro build` | Production build to `dist/` |
| `npm run preview` | `astro preview` | Preview production build locally |
| `npm run format` | `prettier --write .` | Format all files with Prettier |
| `npm run astro` | `astro` | Run Astro CLI directly |

---

## Development Server Configuration

The dev server is configured in `astro.config.ts`:

```typescript
server: {
  host: '0.0.0.0',  // Binds to all interfaces (accessible on LAN)
  port: 5000,
  allowedHosts: true,
}
```

This config allows access from other devices on the same network (useful for mobile testing).

---

## Building for Production

```bash
npm run build
```

This runs two steps:
1. `node scripts/copy-robots.mjs` — selects and copies the correct `robots.txt`
2. `astro build` — pre-renders all pages to static HTML in `dist/`

### robots.txt Selection

The build script (`scripts/copy-robots.mjs`) picks the correct robots.txt based on environment:

| Condition | File used | Effect |
|---|---|---|
| `ROBOTS_ENV=dev` (or develop/staging) | `seo/robots-devingit.txt` | Blocks all crawlers |
| `CF_PAGES_BRANCH` is dev/staging | `seo/robots-devingit.txt` | Blocks all crawlers |
| `NODE_ENV=development` | `seo/robots-devingit.txt` | Blocks all crawlers |
| Default (production) | `seo/robots-livingit.txt` | Allows all crawlers |

The `Layout.astro` component also adds `noindex, nofollow` meta when the site is accessed via `devingit.se` hostname as a second layer of protection.

---

## Content Editing

All content is in TypeScript files in `src/content/`. No CMS required.

### Editing Site Metadata and Global Config
**File:** `src/config.ts`

```typescript
export const siteConfig = {
  site: {
    name: 'Living IT',
    title: 'Living IT',
    description: '...',
    email: 'hello@livingit.se',
    url: 'https://livingit.se'
  },
  navigation: { ... },
  hero: { headline, subheadline, description },
  heroCarousel: { images, markdown, intervalMs },
  footer: { columns: [...offices, brandColumn] },
  cookies: { ... }
}
```

### Editing Service Pages
- **Service summaries** (home page cards + page headers): `src/content/services.ts`
- **Software consulting cards** (`/mjukvarukonsulting`): `src/content/consulting-sw.ts`
- **Leadership consulting groups** (`/ledarskapskonsulting`): `src/content/consulting-im.ts`

### Editing Events
**File:** `src/content/events.ts`

Each event has:
```typescript
{
  title: string,
  icon: string,        // Lucide icon name
  body: string,        // Markdown text
  images: ResponsiveImage[],  // use getResponsiveImage()
  alt: string,
}
```

### Editing Contact Page
**File:** `src/content/contact.ts`

Contains:
- `header` — page title
- `contactGeneral` + `contactStart` — two info card texts (markdown)
- `people` — array of team member objects
- `company` — registration data (name, org number, bankgiro)

### Adding a Team Member
1. Add their photo to `public/images/desktop/contact/`, `public/images/tablet/contact/`, and `public/images/mobile/contact/`
2. Add entry to the `people` array in `src/content/contact.ts`:
```typescript
{
  name: 'First Last',
  title: 'Job Title',
  phoneDisplay: '070-000 00 00',
  phoneNumber: '+46700000000',
  email: 'first.last@livingit.se',
  photo: getResponsiveImage('contact/first-last.jpg'),
}
```

---

## Adding Images

All content images must be provided in three resolutions:
- `public/images/desktop/<path>` — served at 1920w
- `public/images/tablet/<path>` — served at 1024w
- `public/images/mobile/<path>` — served at 640w

Reference them using `getResponsiveImage()` from `src/config.ts`:
```typescript
import { getResponsiveImage } from '../config';
const image = getResponsiveImage('events/my-event.jpg');
// → { desktop: '/images/desktop/events/my-event.jpg', ... }
```

---

## Adding a New Page

1. Create `src/pages/my-page.astro`
2. Use `Layout.astro` as the wrapper:
```astro
---
import Layout from '../components/Layout.astro';
---
<Layout title="My Page - Living IT" description="Page description">
  <!-- page content -->
</Layout>
```
3. Optionally add it to navigation in `siteConfig.navigation.links` (`src/config.ts`)

---

## Adding Navigation Links

Edit `siteConfig.navigation.links` in `src/config.ts`:
```typescript
links: [
  {
    name: 'Link Name',
    href: '/page-path',
    icon: 'LucideIconName',  // See lucide.dev for icon names
  },
]
```

---

## Styling

The project uses Tailwind CSS 4 with a CSS-first configuration approach. No `tailwind.config.js` — all design tokens are defined in `src/styles/globals.css` via `@theme`.

### Adding Custom Styles
Add to `src/styles/globals.css`:
```css
@theme {
  --color-my-color: #hexvalue;
}
```

Then use in templates:
```html
<div class="bg-[var(--color-my-color)]">
```

### Scroll Animations
Add these classes to any element to animate it on scroll:
- `.scroll-fade-up` — slides up from below
- `.scroll-fade-down` — slides down from above
- `.scroll-fade-left` — slides in from right
- `.scroll-fade-right` — slides in from left

Add `.stagger-1` through `.stagger-9` for sequential animation in grids.

---

## Icons

### Lucide Icons (UI icons)
```astro
---
import * as LucideIcons from 'lucide-astro';
const { Code2 } = LucideIcons;
---
<Code2 class="h-6 w-6" />
```
Browse icons at [lucide.dev](https://lucide.dev)

### Simple Icons (brand/social icons)
```astro
---
import { Icon } from 'astro-icon/components';
---
<Icon name="simple-icons:linkedin" class="h-6 w-6" />
```
Browse at [simpleicons.org](https://simpleicons.org)

---

## Code Formatting

Uses Prettier with Astro and Tailwind plugins:
```bash
npm run format
```

Configuration is in `package.json`:
- `singleQuote: true`
- `bracketSpacing: true`
- Astro files parsed with astro parser
- Tailwind classes auto-sorted

---

## Deployment

### Vercel (recommended)
1. Connect GitHub repository to Vercel
2. Framework preset: **Astro**
3. Build command: `npm run build`
4. Output directory: `dist`
5. No environment variables required for basic deployment

### Environment Variables for robots.txt
Set `ROBOTS_ENV=production` on production deployments to ensure the correct robots.txt is used. If using Cloudflare Pages, set the production branch correctly — the `CF_PAGES_BRANCH` env var is automatically available.

### Other Hosts (Netlify, GitHub Pages)
Works with any static host. Set build command to `npm run build` and publish directory to `dist`.

---

## Testing

No test framework is currently configured. Manual testing should cover:
- Desktop and mobile layout (navigation, cards, footer)
- Page navigation and active state highlighting
- Image carousel functionality (home page, events page)
- Responsive images at different viewport sizes
- Contact page: phone/email links
- Redirect: `/bli-konsult` → `/kontakt` (HTTP 301)
- Production build: `npm run build && npm run preview`
