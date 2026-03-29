# Story 2.2: Build the Upcoming Events Listing Page

Status: done

## Story

As a **visitor**,
I want to browse all Living IT events on a single listing page,
so that I can find events I'm interested in without leaving the main site.

## Acceptance Criteria

1. **Given** I navigate to `/events`, **When** the page loads, **Then** the page is SSR (`export const prerender = false`) and displays the shared `<Layout>` with site header and footer, including the existing event-type descriptions below the live listing.
2. **And** all active events fetched from `GET $PUBLIC_API_URL/api/events/public` (filtered by `isActive`) are displayed as `EventCard` components.
3. **And** each event card shows title, date, location, and an event-type icon. The status badge is shown only for non-upcoming states (full/past) to avoid redundancy with the "Kommande" section heading.
4. **And** the page sets `Astro.response.status = 500` and shows an error message if the API call fails (including network errors caught via `try/catch`).
5. **And** `npm run build` passes with no TypeScript errors.

## Tasks / Subtasks

- [x] Merge upcoming events listing into `src/pages/events.astro` (AC: #1, #2, #3, #4, #5)
  - [x] Add `export const prerender = false` to make the page SSR
  - [x] **API endpoint confirmed**: `apiFetch('/api/events/public')`
  - [x] Call `apiFetch('/api/events/public')` and filter by `isActive`
  - [x] Check `response.ok` — set `Astro.response.status = 500` on failure; `try/catch` for network errors
  - [x] Render `<EventCard event={event} lang={safeLang} />` for each active event
  - [x] Render empty state (`t.error.noActiveEvents`) when API returns zero active events
  - [x] Render error state (`t.error.somethingWentWrong`) when API call fails
  - [x] Keep existing event-type descriptions section below the live listing
- [x] Update `src/types/api.ts` to match real backend API shape (AC: #2)
- [x] Update `EventCard.astro` for new API fields and event-type icons (AC: #3)
- [x] Add `API_SECRET_KEY` guard to `src/lib/api.ts` (AC: #4)
- [x] Rename nav/service label "Events" → "Event" in `config.ts` and `services.ts`
- [x] Verify: `npm run build` passes with no TypeScript errors (AC: #5)

## Dev Notes

### Scope

**Architectural pivot**: Instead of creating a separate `/events/upcoming` page, the live event listing was merged into the existing `/events` page (`src/pages/events.astro`), which was converted from static to SSR. This decision was made because a separate upcoming page added navigation friction with no benefit — the `/events` page already served as the entry point for events content.

Files modified:
- `src/pages/events.astro` — converted to SSR, added API fetch + EventCard rendering
- `src/types/api.ts` — updated `ApiEvent` interface to match real backend API shape
- `src/components/EventCard.astro` — updated for new API fields (`eventId`, `startDateTime`, `eventType`, `imageUrl`), added event-type icons
- `src/lib/api.ts` — added `API_SECRET_KEY` guard
- `src/config.ts`, `src/content/services.ts` — renamed "Events" → "Event" (Swedish grammar)

Do NOT:
- Modify `src/i18n/` or `src/components/Layout.astro`
- Create any other event pages (Stories 3.x)

### API Endpoint (Confirmed)

Endpoint confirmed with backend: `GET $PUBLIC_API_URL/api/events/public`

Returns all events. Client-side filtering by `isActive` selects upcoming events for display.

### Always Use `apiFetch` — Never Raw `fetch`

`src/lib/api.ts` handles base URL + auth header (`X-Api-Key: API_SECRET_KEY`). Import and use it — never call `fetch(import.meta.env.PUBLIC_API_URL + '...')` directly or auth is skipped.

```typescript
import { apiFetch } from '../../lib/api';
```

### SSR Page Pattern (Mandatory)

```astro
---
export const prerender = false;  // MUST BE FIRST LINE

import { apiFetch } from '../lib/api';
import type { ApiEvent } from '../types/api';
import { getTranslations } from '../i18n';
import Layout from '../components/Layout.astro';
import EventCard from '../components/EventCard.astro';

const t = getTranslations('sv');

let upcomingEvents: ApiEvent[] | null = null;
let fetchFailed = false;

try {
  const response = await apiFetch('/api/events/public');
  if (response.ok) {
    const allEvents = await response.json() as ApiEvent[];
    upcomingEvents = allEvents.filter((e) => e.isActive);
  } else {
    Astro.response.status = 500;
    fetchFailed = true;
  }
} catch {
  Astro.response.status = 500;
  fetchFailed = true;
}
---
```

Architecture rules:
- `prerender = false` **first** line
- Use `response.ok` for HTTP error handling
- Use `try/catch` around `apiFetch` to catch network-level errors (DNS, timeout) and prevent unhandled crashes
- **Always** set `Astro.response.status` explicitly before rendering (both in `!response.ok` and `catch` branches)
- **Never** call `.json()` on a failed response

### Layout Usage

`src/components/Layout.astro` props: `title?: string`, `description?: string` (both optional with site defaults from `siteConfig`).

```astro
<Layout title="Kommande evenemang | Living IT" description="Bläddra bland kommande evenemang från Living IT.">
  <!-- page content -->
</Layout>
```

### Rendering EventCard

`EventCard` props: `event: ApiEvent`, `lang: 'sv' | 'en'`. The listing shows active events. Pass a validated language (`event.language` with fallback to `'sv'`) so each card formats dates in the event's own locale:

```astro
{upcomingEvents.map((event) => {
  const safeLang = event.language === 'en' ? 'en' : 'sv';
  return (
    <li><EventCard event={event} lang={safeLang} /></li>
  );
})}
```

`EventCard` renders the status badge internally (hidden for `'upcoming'`, shown for `'full'`/`'past'`). Do not add `<EventStatusBadge>` separately on this page.

**EventCard link destination**: links to `/events/${event.eventId}` — language is **not** in the URL.

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

Check order: `if (fetchFailed)` → state 3. `else if (upcomingEvents.length === 0)` → state 2. `else` → state 1.

### i18n Keys to Use (No New Keys Needed)

The page has no `[lang]` URL segment — use Swedish (`getTranslations('sv')`) for all page-level UI text.

| Key | Value (sv) |
|---|---|
| `t.nav.upcomingEvents` | `'Kommande evenemang'` — page heading |
| `t.error.noActiveEvents` | `'För tillfället har vi inget planerat - kom tillbaka senare!'` — empty state |
| `t.error.somethingWentWrong` | `'Något gick fel 😞'` — error state |

**Do NOT invent new i18n keys.** All keys already exist in `sv.ts` and `en.ts`.

### Types

```typescript
import type { ApiEvent } from '../types/api';
// ApiEvent fields: eventId, eventType, language ('sv'|'en'), title,
//                  description, agenda, imageUrl, startDateTime (ISO 8601),
//                  endDateTime (ISO 8601), location, geo, isActive, isSoldOut,
//                  isAlmostSoldOut, contactEmail, termsUrl, privacyUrl,
//                  foodOptions?, price?
```

### File Structure

```
src/
├── components/
│   └── EventCard.astro      ← MODIFIED (new API fields, event-type icons)
├── lib/
│   └── api.ts               ← MODIFIED (API_SECRET_KEY guard)
├── types/
│   └── api.ts               ← MODIFIED (real backend API shape)
└── pages/
    └── events.astro          ← MODIFIED (static → SSR, merged listing)
```

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
- **`src/lib/api.ts` exists** — `apiFetch(path, init?)` attaches `X-Api-Key` header and prepends `PUBLIC_API_URL`; guards for missing `API_SECRET_KEY`; never use raw `fetch()` for API calls
- **`src/types/api.ts`** — contains `ApiEvent` (updated to real backend shape), `EventStatus`, `SupportedLanguage`
- **`src/i18n/`** — all keys in place (including `t.nav.upcomingEvents`, `t.error.noActiveEvents`); do NOT add new keys
- **EventCard URL** — links to `/events/${eventId}` (no lang in URL)
- **Cloudflare Workers shim** — a debug CJS shim was added for local dev (`npm run dev` works as-is)
- **No test suite** — verification is `npm run build` success only
- **Tailwind token**: `bg-bg-card` is the card background (see `EventCard.astro`)

### Cross-Story Context

- **Story 2.3**: Originally planned to link from `/events` to `/events/upcoming` — **superseded** by the merge. The listing is now part of `/events` directly.
- **Story 3.1**: Event detail page at `/events/[slug]` — EventCard links to `/events/${event.eventId}`

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

- Merged live event listing into `src/pages/events.astro` (architectural pivot from separate `/events/upcoming` route)
- `export const prerender = false` added, converting the page from static to SSR via Cloudflare adapter
- Uses confirmed endpoint `apiFetch('/api/events/public')` with `isActive` client-side filtering
- Three render states implemented: success with events (grid), empty state (`t.error.noActiveEvents`), API failure (`t.error.somethingWentWrong`) with `Astro.response.status = 500`
- `try/catch` wraps `apiFetch` for network error resilience; `response.ok` for HTTP errors
- `ApiEvent` interface updated to match real backend API shape
- `EventCard` updated for new fields, event-type icons (Film/MicVocal/Users), image rendering
- `API_SECRET_KEY` guard added to `api.ts`; debug console.log statements removed (code review fix)
- `event.language` validated with fallback to `'sv'` (code review fix)
- `npm run build` passes with zero TypeScript errors

### File List

- `src/pages/events.astro` — MODIFIED (static → SSR, merged listing)
- `src/components/EventCard.astro` — MODIFIED (new API fields, icons, image)
- `src/types/api.ts` — MODIFIED (real API shape)
- `src/lib/api.ts` — MODIFIED (API_SECRET_KEY guard)
- `src/config.ts` — MODIFIED (Events → Event label)
- `src/content/services.ts` — MODIFIED (Events → Event title)

## Change Log

- 2026-03-28: Story 2.2 created — comprehensive dev context added.
- 2026-03-28: Story 2.2 implemented — `src/pages/events/upcoming.astro` created; `npm run build` passes.
- 2026-03-28: Architectural pivot — merged listing into `src/pages/events.astro`; deleted `upcoming.astro`.
- 2026-03-29: Code review fixes — removed debug console.log from api.ts, added `Astro.response.status = 500`, added `event.language` validation fallback. Spec updated to reflect architectural pivot and real API shape.
