# Story 2.1: Create Shared Event Components

Status: done

## Story

As a **developer**,
I want `EventCard.astro` and `EventStatusBadge.astro` components built and typed,
so that event data from the API can be rendered consistently across all event pages.

## Acceptance Criteria

1. **Given** `src/components/EventCard.astro` and `src/components/EventStatusBadge.astro` are created, **When** an event object with `title`, `date`, `location`, `slug`, `lang`, and `status` (`'upcoming' | 'past' | 'full'`) is passed as props, **Then** `EventCard` renders the event title, date, location, and links to `/events/[slug]` (lang is not part of the URL — the event's language is determined from the API payload, not the URL).
2. **And** `EventStatusBadge` renders "Kommande" / "Avslutat" / "Fullbokat" (or English equivalents) based on `status` using i18n keys from `t.event.*`.
3. **And** both components use Tailwind CSS 4 design tokens consistent with the existing site (no hardcoded colors — use `@theme` tokens from `globals.css`).
4. **And** TypeScript strict-mode compilation passes with no type errors (`npm run build` succeeds).

## Tasks / Subtasks

- [x] Create `src/components/EventStatusBadge.astro` (AC: #2, #3, #4)
  - [x] Props: `status: EventStatus`, `translations: Translations['event']`
  - [x] Render badge text using i18n keys: `statusUpcoming`, `statusPast`, `statusFull`
  - [x] Style with Tailwind CSS 4 — visually distinct per status (e.g. green/grey/red chip)
  - [x] No hardcoded locale strings
- [x] Create `src/components/EventCard.astro` (AC: #1, #3, #4)
  - [x] Props: `event: ApiEvent`, `lang: 'sv' | 'en'`
  - [x] Render: event `title`, formatted `date`, `location`, and a link to `/events/${event.language}/${event.slug}`
  - [x] Format date using `Intl.DateTimeFormat` with `lang`-derived locale (see Dev Notes)
  - [x] Include `<EventStatusBadge>` — call `getTranslations(lang)` internally to get `t.event` for the badge
  - [x] Style with Tailwind CSS 4 consistent with site card/panel patterns
- [x] Verify: `npm run build` passes with no TypeScript errors (AC: #4)

## Dev Notes

### Scope

**Components only.** Create two `.astro` component files in `src/components/`. Do NOT create any pages, routes, or API handlers. Do NOT modify any existing files.

Do NOT:
- Create `src/pages/events/` or any event pages (Story 2.2+)
- Modify `src/content/events.ts`, `astro.config.ts`, or any existing components
- Add new dependencies — all types and i18n are already in place from Stories 1.2–1.3

### Types Already Available — Do Not Reinvent

`src/types/api.ts` was created in Story 1.3. Import from it directly:

```typescript
import type { ApiEvent, EventStatus } from '../types/api';
```

```typescript
// Available types (do not re-declare):
export type EventStatus = 'upcoming' | 'past' | 'full';

export interface ApiEvent {
  slug: string;
  language: 'sv' | 'en';
  title: string;
  date: string;        // ISO 8601
  location: string;
  description: string;
  capacity: number;
  registrationCount: number;
  status: EventStatus;
}
```

### i18n Already Available — Use, Don't Reinvent

`src/i18n/` was created in Story 1.3. The relevant i18n keys for this story:

```typescript
// t.event keys used by EventStatusBadge:
t.event.statusUpcoming  // sv: 'Kommande',  en: 'Upcoming'
t.event.statusPast      // sv: 'Avslutat',  en: 'Ended'
t.event.statusFull      // sv: 'Fullbokat', en: 'Fully booked'
```

Import pattern:

```typescript
import { getTranslations } from '../i18n';
import type { Translations } from '../i18n';
```

### EventStatusBadge.astro — Implementation Guide

```astro
---
import type { EventStatus } from '../types/api';
import type { Translations } from '../i18n';

interface Props {
  status: EventStatus;
  translations: Translations['event'];
}

const { status, translations: t } = Astro.props;
---
<span class={
  status === 'upcoming'
    ? '...tailwind upcoming classes...'
    : status === 'past'
      ? '...tailwind past classes...'
      : '...tailwind full classes...'
}>
  {status === 'upcoming' ? t.statusUpcoming : status === 'past' ? t.statusPast : t.statusFull}
</span>
```

### EventCard.astro — Implementation Guide

`EventCard` receives `event: ApiEvent` and `lang: 'sv' | 'en'`. It internally calls `getTranslations(lang)` to obtain `t.event` for passing to `EventStatusBadge`. The link URL uses `/events/${event.slug}` — language is **not** part of the URL; it is carried in the API payload (`event.language`). Date formatting uses the `lang` prop.

Lang is not in the URL because the event's language is already known from `event.language` in the payload. Adding it to the URL was considered as a workaround for external consumers but is not required — the API payload is the source of truth.

Guard `event.date` before formatting — `new Date()` silently produces `Invalid Date` for null/empty/malformed input, and `Intl.DateTimeFormat.format()` throws a `RangeError` on it. Use try/catch with `event.date` as fallback. Guard `event.slug` before building the href — render without a link if slug is empty.

```astro
---
import type { ApiEvent } from '../types/api';
import { getTranslations } from '../i18n';
import EventStatusBadge from './EventStatusBadge.astro';

interface Props {
  event: ApiEvent;
  lang: 'sv' | 'en';
}

const { event, lang } = Astro.props;
const t = getTranslations(lang);

let formatted: string;
try {
  const d = new Date(event.date);
  if (isNaN(d.getTime())) throw new RangeError('Invalid date');
  formatted = new Intl.DateTimeFormat(lang === 'sv' ? 'sv-SE' : 'en-GB', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(d);
} catch {
  formatted = event.date;
}

const href = event.slug ? `/events/${event.slug}` : null;
---
<article>
  {href ? (
    <a href={href}>
      <h2>{event.title}</h2>
      <p>{formatted}</p>
      <p>{event.location}</p>
      <EventStatusBadge status={event.status} translations={t.event} />
    </a>
  ) : (
    <div>
      <h2>{event.title}</h2>
      <p>{formatted}</p>
      <p>{event.location}</p>
      <EventStatusBadge status={event.status} translations={t.event} />
    </div>
  )}
</article>
```

### Tailwind CSS 4 — Design Token Rules

- Tailwind CSS 4 uses CSS-first configuration — there is NO `tailwind.config.js`
- All design tokens (colors, spacing, typography) are defined via `@theme` in `src/styles/globals.css`
- Use theme tokens from `globals.css` (e.g. `text-primary`, `bg-surface`) — do NOT use arbitrary hex values or inline `style=` attributes
- Follow the visual patterns of existing components (`Layout.astro`, `HeroCarousel.astro`, etc.) for spacing and typography scale

### TypeScript Conventions

- TypeScript strict mode: extends `"astro/tsconfigs/strict"` — no implicit `any`, strict null checks
- All new files must be `.astro` (components) — the frontmatter is typed TypeScript
- Interface names use `PascalCase`, no `I` prefix
- Use union string literals, not enums: `'upcoming' | 'past' | 'full'`
- Named imports only — no default exports from type/utility modules

### Naming Conventions

| Type | Convention | Example |
|---|---|---|
| Astro components | `PascalCase.astro` | `EventCard.astro`, `EventStatusBadge.astro` |
| Props interfaces | `Props` (inline in frontmatter) | `interface Props { ... }` |

### File Locations

```
src/
└── components/
    ├── EventCard.astro         ← NEW (this story)
    └── EventStatusBadge.astro  ← NEW (this story)
```

All other directories (`src/i18n/`, `src/types/`, `src/pages/`, etc.) are UNCHANGED in this story.

### Build Command

```bash
npm run build
# expands to: node scripts/copy-robots.mjs && astro build
```

Verify this passes with no TypeScript errors before marking the story done.

### Previous Story Intelligence (Stories 1.1–1.3)

- `output: 'hybrid'` was removed in Astro 6 — the adapter is in place, `output: 'static'` is the equivalent; SSR pages use `export const prerender = false` at the page level (not needed in components)
- `src/types/api.ts` was **created in Story 1.3** — import `ApiEvent` and `EventStatus` from there; do NOT declare them again
- `src/i18n/` was **created in Story 1.3** — all translation keys are in place; do NOT invent new keys for this story
- `src/lib/api.ts` exists (Story 1.2) — server-side API client; this story does NOT use it (components are rendering-only, no data fetching)
- File naming pattern confirmed: `PascalCase.astro` for components (matches `Layout.astro`, `HeroCarousel.astro`, etc.)
- No generic `src/utils/` folder — utilities live in `src/lib/` (server-side) or `src/i18n/` (locale)
- No test suite exists — verification is `npm run build` success only

### Key Architecture Rules (from architecture.md)

- Components NEVER read `Astro.params` directly — locale comes from the `lang` prop
- Do NOT hardcode Swedish or English strings — always use `t.*` i18n keys
- No React, Vue, or Svelte — Astro components only
- `RegistrationForm.astro` is NOT part of this story (Epic 3, Story 3.2)
- Both components will be consumed by `src/pages/events/upcoming.astro` (Story 2.2) and `src/pages/events/[lang]/[slug].astro` (Story 3.1)

### Cross-Story Context

- Story 2.2 (next): `EventCard` will be used in `src/pages/events/upcoming.astro` listing page — the listing page passes `event` and `lang` props
- Story 3.1: `EventStatusBadge` will also be used standalone on the event detail page

### References

- API type definitions: [`_bmad-output/planning-artifacts/architecture.md` — "Format Patterns: API Response Types"]
- Component props patterns: [`_bmad-output/planning-artifacts/architecture.md` — "Naming Patterns: Component Props"]
- i18n key schema: [`_bmad-output/planning-artifacts/architecture.md` — "Naming Patterns: i18n Key Structure"]
- Project structure: [`_bmad-output/planning-artifacts/architecture.md` — "Structure Patterns: Project Organisation"]
- Date display pattern: [`_bmad-output/planning-artifacts/architecture.md` — "Format Patterns: Date Display"]
- Enforcement rules: [`_bmad-output/planning-artifacts/architecture.md` — "Enforcement Guidelines"]
- Story 1.3 learnings: [`_bmad-output/implementation-artifacts/1-3-create-i18n-translation-module.md`]

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

_No issues encountered._

### Completion Notes List

- Created `EventStatusBadge.astro`: renders a pill badge using `t.event.statusUpcoming/Past/Full` i18n keys; styled with Tailwind CSS 4 theme tokens (`bg-orange`, `bg-mono-gray`, `bg-mono-darker`) for orange/grey/dark-grey per status. Base classes deduplicated via a `base` const; color class selected via a typed `Record<EventStatus, string>` lookup (exhaustiveness enforced at compile time); `role="status"` added for accessibility.
- Created `EventCard.astro`: renders event title, long-formatted date via `Intl.DateTimeFormat` (guarded with try/catch), location, and a link to `/events/${event.slug}` (lang is not in the URL — carried in API payload); calls `getTranslations(lang)` internally to pass `t.event` to `<EventStatusBadge>`; card styled with `bg-bg-card` (Tailwind CSS 4 `@theme` token) and site card patterns consistent with `Services.astro`. Renders without a link if slug is empty.
- `npm run build` passes with zero TypeScript errors (pre-existing Cloudflare compatibility warnings only, unrelated to this story).

### File List

- `src/components/EventStatusBadge.astro` — NEW
- `src/components/EventCard.astro` — NEW

## Change Log

- 2026-03-28: Story 2.1 implemented — created `EventStatusBadge.astro` and `EventCard.astro` components.
- 2026-03-28: Post-review patches applied — date guard (RangeError), bg-bg-card token, empty-slug guard, CSS deduplication, role="status" on badge, URL simplified to /events/[slug] (lang removed from URL per product decision).
