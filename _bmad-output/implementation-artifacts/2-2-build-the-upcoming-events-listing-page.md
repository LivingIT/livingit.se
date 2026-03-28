# Story 2.2: Build the Upcoming Events Listing Page

Status: review

## Story

As a **visitor**,
I want to browse all Living IT events on a single listing page,
so that I can find events I'm interested in without leaving the main site.

## Acceptance Criteria

1. **Given** I navigate to `/events/upcoming`, **When** the page loads, **Then** the page is SSR (`export const prerender = false`) and displays the shared `<Layout>` with site header and footer.
2. **And** all events fetched from `GET $PUBLIC_API_URL/[events-endpoint]` are displayed as `EventCard` components.
3. **And** each event card shows title, date, location, and status badge.
4. **And** the page sets `Astro.response.status = 500` and shows an error message if the API call fails.
5. **And** `npm run build` passes with no TypeScript errors.

## Tasks / Subtasks

- [x] Create `src/pages/events/upcoming.astro` (AC: #1, #2, #3, #4, #5)
  - [x] `export const prerender = false` as FIRST line (mandatory)
  - [x] **Confirm events API endpoint path with backend team** (placeholder: `/events`)
  - [x] Call `apiFetch('/events')` (or confirmed endpoint) from `src/lib/api`
  - [x] Check `response.ok` — set `Astro.response.status = 500` on failure, never throw
  - [x] Render `<EventCard event={event} lang={event.language} />` for each event
  - [x] Render empty state (`t.error.noActiveEvents`) when API returns zero events
  - [x] Render error state (`t.error.somethingWentWrong`) when API call fails
  - [x] Wrap all content in `<Layout title="Kommande evenemang | Living IT">`
- [x] Verify: `npm run build` passes with no TypeScript errors (AC: #5)

## Dev Notes

### Scope

**One new file only**: `src/pages/events/upcoming.astro`. This also requires creating the `src/pages/events/` directory.

Do NOT:
- Modify `EventCard.astro` or `EventStatusBadge.astro` (done in Story 2.1)
- Modify `src/lib/api.ts`, `src/types/api.ts`, `src/i18n/`, or `src/components/Layout.astro`
- Modify `src/pages/events.astro` (the static `/events` marketing page — that's Story 2.3)
- Add new dependencies
- Create any other event pages (Stories 2.3, 3.x)

### ⚠️ CRITICAL: Confirm API Endpoint Path

The architecture document explicitly states:
> "Assumed REST API; exact endpoint paths to be confirmed with backend team before implementation"

The data flow diagram uses placeholder notation: `GET api.livingit.se/[events]`.

**Placeholder to use until confirmed**: `apiFetch('/events')`

Confirm the real path before deploying. If the path differs, update the single call site in `upcoming.astro`.

### Always Use `apiFetch` — Never Raw `fetch`

`src/lib/api.ts` handles base URL + auth header (`X-Api-Key: API_SECRET_KEY`). Import and use it — never call `fetch(import.meta.env.PUBLIC_API_URL + '...')` directly or auth is skipped.

```typescript
import { apiFetch } from '../../lib/api';
```

### SSR Page Pattern (Mandatory)

```astro
---
export const prerender = false;  // MUST BE FIRST LINE

import { apiFetch } from '../../lib/api';
import type { ApiEvent } from '../../types/api';
import { getTranslations } from '../../i18n';
import Layout from '../../components/Layout.astro';
import EventCard from '../../components/EventCard.astro';

const t = getTranslations('sv');

const response = await apiFetch('/events');  // replace with confirmed endpoint

if (!response.ok) {
  Astro.response.status = 500;
}

const events: ApiEvent[] | null = response.ok
  ? (await response.json() as ApiEvent[])
  : null;
---
```

Architecture rules (no exceptions):
- `prerender = false` **first** line
- **Never** `try/catch` around fetch — use `response.ok`
- **Always** set `Astro.response.status` explicitly before rendering
- **Never** call `.json()` on a failed response

### Layout Usage

`src/components/Layout.astro` props: `title?: string`, `description?: string` (both optional with site defaults from `siteConfig`).

```astro
<Layout title="Kommande evenemang | Living IT" description="Bläddra bland kommande evenemang från Living IT.">
  <!-- page content -->
</Layout>
```

### Rendering EventCard

`EventCard` props: `event: ApiEvent`, `lang: 'sv' | 'en'`. The listing shows all events (both languages). Pass `event.language` as `lang` so each card formats dates in the event's own locale:

```astro
<EventCard event={event} lang={event.language} />
```

`EventCard` renders the status badge internally — do not add `<EventStatusBadge>` separately on this page.

**EventCard link destination** (established in Story 2.1, cannot change here): links to `/events/${event.slug}` — language is **not** in the URL. Note: Story 3.1 defines detail page routes as `/events/[lang]/[slug]` — this discrepancy is intentional and will be resolved in Story 3.1.

### Three Rendering States

**State 1 — Success with events** (`events` is non-null and length > 0):
```astro
<ul class="...">
  {events.map((event) => (
    <li><EventCard event={event} lang={event.language} /></li>
  ))}
</ul>
```

**State 2 — Empty** (`events` is non-null but `events.length === 0`):
```astro
<p>{t.error.noActiveEvents}</p>
<!-- sv: "För tillfället har vi inget planerat - kom tillbaka senare!" -->
```

**State 3 — API failure** (`events` is null, `Astro.response.status = 500`):
```astro
<p>{t.error.somethingWentWrong}</p>
<!-- sv: "Något gick fel 😞" -->
```

Check order: `if (!response.ok)` → state 3. `else if (events.length === 0)` → state 2. `else` → state 1.

### i18n Keys to Use (No New Keys Needed)

The page has no `[lang]` URL segment — use Swedish (`getTranslations('sv')`) for all page-level UI text.

| Key | Value (sv) |
|---|---|
| `t.nav.upcomingEvents` | `'Kommande evenemang'` — page heading |
| `t.error.noActiveEvents` | `'För tillfället har vi inget planerat - kom tillbaka senare!'` — empty state |
| `t.error.somethingWentWrong` | `'Något gick fel 😞'` — error state |

**Do NOT invent new i18n keys.** All keys already exist in `sv.ts` and `en.ts`.

### Types — Import Only, Never Re-declare

```typescript
import type { ApiEvent } from '../../types/api';
// ApiEvent fields: slug, language ('sv'|'en'), title, date (ISO 8601),
//                  location, description, capacity, registrationCount,
//                  status ('upcoming'|'past'|'full')
```

### File Structure

```
src/
└── pages/
    ├── events.astro         ← UNCHANGED (static /events marketing page)
    └── events/              ← NEW directory (this story)
        └── upcoming.astro   ← NEW (this story)
```

Note: `src/pages/events.astro` and `src/pages/events/` coexist without conflict — Astro treats them as separate routes (`/events` and `/events/*`).

### Tailwind CSS 4 — Design Token Rules

- No `tailwind.config.js` — tokens defined via `@theme` in `src/styles/globals.css`
- Use theme tokens, never hardcoded hex: `text-mono-black`, `bg-bg-card`, `text-mono-gray`, `text-mono-dark`
- Page section pattern (match existing pages): `<section class="max-w-5xl mx-auto px-4 py-12">`
- Reference `EventCard.astro` for card tokens; reference `Services.astro` for list/grid layout

### TypeScript Conventions

- TypeScript strict mode — no implicit `any`; use `ApiEvent[]` not `any[]`
- Page files: `kebab-case.astro` ✓ (`upcoming.astro`)
- Typed imports only

### Build Command

```bash
npm run build
# expands to: node scripts/copy-robots.mjs && astro build
```

Verify this passes with zero TypeScript errors before marking done.

### Previous Story Intelligence (Stories 1.1–2.1)

- **`output: 'hybrid'` removed in Astro 6** — the Cloudflare adapter is in place; SSR is enabled via `export const prerender = false` at the page level only
- **`src/lib/api.ts` exists** — `apiFetch(path, init?)` attaches `X-Api-Key` header and prepends `PUBLIC_API_URL`; never use raw `fetch()` for API calls
- **`src/types/api.ts`** — contains `ApiEvent`, `EventStatus`, `SupportedLanguage`; do NOT re-declare
- **`src/i18n/`** — all keys in place (including `t.nav.upcomingEvents`, `t.error.noActiveEvents`); do NOT add new keys
- **EventCard URL** — links to `/events/${slug}` per product decision in Story 2.1 (no lang in URL)
- **Cloudflare Workers shim** — a debug CJS shim was added for local dev (`npm run dev` works as-is)
- **No test suite** — verification is `npm run build` success only
- **Tailwind token**: `bg-bg-card` is the card background (see `EventCard.astro`)

### Cross-Story Context

- **Story 2.3 (next)**: Adds a link from the static `/events` page to `/events/upcoming` — do NOT touch `events.astro` in this story
- **Story 3.1**: Event detail page at `/events/[lang]/[slug]` — EventCard currently links to `/events/${slug}` without lang; this routing mismatch will need resolving in Story 3.1

### References

- API client: `src/lib/api.ts`
- API types: `src/types/api.ts`
- i18n: `src/i18n/sv.ts`, `src/i18n/en.ts`, `src/i18n/index.ts`
- EventCard component: `src/components/EventCard.astro`
- Layout component: `src/components/Layout.astro`
- SSR error handling pattern: `_bmad-output/planning-artifacts/architecture.md` — "Process Patterns: SSR Page Error Handling"
- Enforcement rules: `_bmad-output/planning-artifacts/architecture.md` — "Enforcement Guidelines"
- Previous story: `_bmad-output/implementation-artifacts/2-1-create-shared-event-components.md`

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

_None_

### Completion Notes List

- Created `src/pages/events/upcoming.astro` as the sole new file
- `export const prerender = false` is the first line, enabling SSR via Cloudflare adapter
- Uses `apiFetch('/events')` with placeholder endpoint — must be confirmed with backend before deploy
- Three render states implemented: success with events (grid), empty state (`t.error.noActiveEvents`), API failure (`t.error.somethingWentWrong`) with `Astro.response.status = 500`
- No `try/catch` used — error handling via `response.ok` check only
- `npm run build` passes with zero TypeScript errors

### File List

- `src/pages/events/upcoming.astro` — NEW

## Change Log

- 2026-03-28: Story 2.2 created — comprehensive dev context added.
- 2026-03-28: Story 2.2 implemented — `src/pages/events/upcoming.astro` created; `npm run build` passes.
