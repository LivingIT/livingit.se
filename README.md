# Living IT - Dreaming today, living it tomorrow

A modern, fast, and accessible website for Living IT consulting company. Built with Astro and Tailwind CSS.

## About Living IT

Living IT is a consulting company based in Malmö, Helsingborg and Göteborg, Sweden. We believe that family, friends, and leisure are the most important things in life, but when we're at work, we always do our best to exceed our clients' expectations.

We offer two core consulting services:
- **Mjukvarukonsulting** (Software Consulting) - Creating digital solutions with curiosity, precision, and genuine commitment
- **Ledarskapskonsulting** (Leadership Consulting) - Strengthening organizations through innovation and inclusive solutions

## Technology Stack

- **Astro 6** - Static + SSR hybrid site generation
- **Tailwind CSS 4** - Modern styling with CSS-first config
- **Cloudflare Workers** - SSR runtime and deployment target
- **Cloudflare Turnstile** - Bot protection for forms

## Pages

- **Home** (`index.astro`) - Hero section and overview
- **Software Consulting** (`mjukvarukonsulting.astro`) - Detailed service information
- **Leadership Consulting** (`ledarskapskonsulting.astro`) - Detailed service information
- **Contact** (`kontakt.astro`) - Contact page
- **Events** (`events.astro`) - Event listing
- **Event Detail** (`events/[slug].astro`) - Individual event with registration/purchase
- **Cookie Policy** (`cookies-policy.astro`) - Cookie policy information

## Quick Start

### Prerequisites

- Node.js (LTS recommended)
- npm

### Environment Setup

Create a `.env` file in the project root with the following variables:

```env
PUBLIC_API_URL=https://api.devingit.se
PUBLIC_ENVIRONMENT=development
API_SECRET_KEY=<your-api-secret-key>
PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
```

| Variable | Description |
|---|---|
| `PUBLIC_API_URL` | Backend API base URL |
| `PUBLIC_ENVIRONMENT` | `production` or `development` — controls search engine indexing |
| `API_SECRET_KEY` | Server-side secret for authenticating with the backend API |
| `PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile site key for bot protection |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile secret key for server-side verification |

In production, `API_SECRET_KEY` is stored as a Cloudflare secret (via `wrangler secret put`). Locally, Astro loads it from `.env`.

### Running Locally

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

The dev server runs on `http://localhost:5000`.

## Content Management

Edit content in:

- [src/config.ts](src/config.ts) - Site configuration and metadata
- [src/content/](src/content/) - Services, events, and other content files
- [src/styles/globals.css](src/styles/globals.css) - Colors and animations
- [src/components/](src/components/) - Reusable Astro components

## Deployment

The site deploys to Cloudflare Workers via CI (`.github/workflows/deploy.yml`).

The base `wrangler.toml` contains development defaults. CI patches `dist/server/wrangler.json` with production values before deploying. **Do not deploy directly** using `wrangler deploy` from the repo root — always go through the CI pipeline.

## License

[MIT](LICENSE)
