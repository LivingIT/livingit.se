# Story 1.3: Create i18n Translation Module

Status: done

## Story

As a **developer**,
I want a typed i18n module with Swedish and English translations,
so that all locale-aware event pages and components can render content in the correct language without duplication.

## Acceptance Criteria

1. **Given** `src/i18n/sv.ts`, `src/i18n/en.ts`, and `src/i18n/index.ts` are created, **When** `getTranslations('sv')` is called, **Then** it returns the Swedish string object with all required keys (form labels, validation errors, event status labels, navigation strings, confirmation strings).
2. **And** `getTranslations('en')` returns the equivalent English strings with the same key structure.
3. **And** both translation objects conform to the `Translations` type exported from `sv.ts`.
4. **And** TypeScript strict-mode compilation passes with no errors (`npm run build` succeeds).

## Tasks / Subtasks

- [x] Create `src/i18n/sv.ts` with `as const` Swedish translations and exported `Translations` type (AC: #1, #3)
- [x] Create `src/i18n/en.ts` with English translations conforming to `Translations` type (AC: #2, #3)
- [x] Create `src/i18n/index.ts` with `getTranslations(lang)` helper (AC: #1, #2)
- [x] Create `src/types/api.ts` with `ApiEvent`, `EventStatus`, `ApiRegistrationRequest`, `ApiErrorResponse` types (optional — unblocks Stories 2.1+, no AC required here)
- [x] Verify TypeScript compilation: `npm run build` passes with no errors (AC: #4)

---

## Dev Notes

### Scope

**Translation infrastructure only.** Create `src/i18n/` and optionally `src/types/api.ts`. Do NOT create any pages, components, or routes. Do NOT modify any existing files.

Do NOT:
- Create `src/pages/events/` or any event pages (later epics)
- Modify `src/content/events.ts` (serves the static `/events` marketing page)
- Modify `astro.config.ts`, `wrangler.toml`, or any CI files
- Remove or modify `server.allowedHosts: true` in `astro.config.ts`

### File Structure

```
src/
└── i18n/                  ← NEW directory
    ├── sv.ts              ← Swedish translations + Translations type
    ├── en.ts              ← English translations (must match Translations type)
    └── index.ts           ← getTranslations() helper

src/
└── types/                 ← NEW directory (optional but recommended — unblocks 2.1+)
    └── api.ts             ← ApiEvent, EventStatus, ApiRegistrationRequest, ApiErrorResponse
```

### TypeScript Conventions

- TypeScript strict mode: `tsconfig.json` extends `"astro/tsconfigs/strict"` — no implicit `any`, strict null checks
- All new files must be `.ts` (not `.js`)
- `as const` on translation objects — enables literal type inference for all string values
- Use `typeof sv` to derive the `Translations` type — do NOT hand-write it
- No `I` prefix on interface names (`Translations`, not `ITranslations`)
- Union string literals for status: `'upcoming' | 'past' | 'full'` (not enums)

### sv.ts — Exact Implementation

```typescript
// src/i18n/sv.ts
export const sv = {
  form: {
    labelName: 'Namn',
    labelEmail: 'E-post',
    labelEmployer: 'Företag',
    submitButton: 'Anmäl mig',
    errorRequired: 'Det här fältet är obligatoriskt',
    errorEmail: 'Ange en giltig e-postadress',
    errorGeneric: 'Något gick fel. Försök igen.',
  },
  event: {
    statusUpcoming: 'Kommande',
    statusPast: 'Avslutat',
    statusFull: 'Fullbokat',
    registrationClosed: 'Anmälan stängd',
    registrationFull: 'Det här eventet är fullbokat',
    notFound: 'Eventet hittades inte',
  },
  confirmation: {
    title: 'Anmälan bekräftad',
    thankYou: 'Tack för din anmälan!',
    thankYouNamed: 'Tack,',
    registered: 'Din anmälan är mottagen.',
  },
  nav: {
    backToEvents: 'Tillbaka till evenemang',
    upcomingEvents: 'Kommande evenemang',
  },
} as const;

export type Translations = typeof sv;
```

### en.ts — Exact Implementation

```typescript
// src/i18n/en.ts
import type { Translations } from './sv';

export const en: Translations = {
  form: {
    labelName: 'Name',
    labelEmail: 'Email',
    labelEmployer: 'Company',
    submitButton: 'Register',
    errorRequired: 'This field is required',
    errorEmail: 'Please enter a valid email address',
    errorGeneric: 'Something went wrong. Please try again.',
  },
  event: {
    statusUpcoming: 'Upcoming',
    statusPast: 'Ended',
    statusFull: 'Fully booked',
    registrationClosed: 'Registration closed',
    registrationFull: 'This event is fully booked',
    notFound: 'Event not found',
  },
  confirmation: {
    title: 'Registration confirmed',
    thankYou: 'Thank you for registering!',
    thankYouNamed: 'Thank you,',
    registered: 'Your registration has been received.',
  },
  nav: {
    backToEvents: 'Back to events',
    upcomingEvents: 'Upcoming events',
  },
};
```

### index.ts — Exact Implementation

```typescript
// src/i18n/index.ts
import { sv } from './sv';
import { en } from './en';
export type { Translations } from './sv';

export function getTranslations(lang: 'sv' | 'en') {
  return lang === 'sv' ? sv : en;
}
```

### Why `as const` on `sv` but typed annotation on `en`

- `sv.ts`: `as const` preserves literal string types AND lets TypeScript derive `Translations` via `typeof sv`. No annotation needed.
- `en.ts`: Explicit `: Translations` annotation ensures TypeScript enforces structural parity with `sv`. Any missing or mismatched key in `en` is a compile-time error.
- `index.ts`: Re-exports `Translations` so downstream code only needs one import (`import type { Translations } from '../i18n'`).

### i18n Key Usage by Future Story

| Key path | Used in |
|---|---|
| `form.*` | Story 3.2 (RegistrationForm.astro), Story 3.3 (api/register.ts) |
| `event.status*` | Story 2.1 (EventStatusBadge.astro) |
| `event.registrationClosed` | Story 3.1 (detail page — past event state) |
| `event.registrationFull` | Story 3.1 (detail page — full event state) |
| `event.notFound` | Story 3.1 (detail page — 404 state) |
| `confirmation.*` | Story 3.4 (confirmation.astro) |
| `nav.backToEvents` | Story 3.1 (past/404), Story 3.4 (confirmation page) |
| `nav.upcomingEvents` | Story 2.3 (link on static /events page) |

### Confirmation Message Interpolation Pattern

The `confirmation.thankYouNamed` and `confirmation.registered` keys split the personal greeting so the component interpolates the registrant's name:

```astro
---
// src/pages/events/[lang]/[slug]/confirmation.astro (Story 3.4)
const name = Astro.url.searchParams.get('name');
const t = getTranslations(lang);
---
{name
  ? <p>{t.confirmation.thankYouNamed} <strong>{name}!</strong> {t.confirmation.registered}</p>
  : <p>{t.confirmation.thankYou}</p>
}
```

**Do not add a single interpolation-ready string** like `'Tack, {name}!'` — Astro templates handle interpolation natively with `{name}`.

### API Error Shape (used in Story 3.3)

The API route at `src/pages/api/register.ts` (Story 3.3) uses translations directly:

```typescript
import { getTranslations } from '../../../i18n';
const t = getTranslations(lang);

// Validation error → 400 JSON
return new Response(JSON.stringify({ error: t.form.errorRequired, field: 'name' }), {
  status: 400,
  headers: { 'Content-Type': 'application/json' },
});

// Backend error → 502 JSON
return new Response(JSON.stringify({ error: t.form.errorGeneric }), {
  status: 502,
  headers: { 'Content-Type': 'application/json' },
});
```

The `field` property in the `ApiErrorResponse` shape maps to one of `'name' | 'email' | 'employer'`.

### Optional: src/types/api.ts (Recommended Scope Expansion)

Creating `src/types/api.ts` in this story avoids Story 2.1 having to invent its own types. No AC required — just add it alongside the i18n files:

```typescript
// src/types/api.ts
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

export interface ApiRegistrationRequest {
  slug: string;
  name: string;
  email: string;
  employer: string;
}

export interface ApiErrorResponse {
  error: string;
  field?: string;      // present for field-specific validation errors
}
```

Import in future stories: `import type { ApiEvent, EventStatus } from '../../types/api';`

### Locale Passing Pattern (for future reference)

How the i18n module is used in SSR pages (Stories 2.x, 3.x):

```astro
---
// src/pages/events/[lang]/[slug].astro
import { getTranslations } from '../../i18n';
const { lang, slug } = Astro.params as { lang: 'sv' | 'en'; slug: string };
const t = getTranslations(lang);
---
<EventStatusBadge status={event.status} {t} />
```

- `lang` is always extracted from `Astro.params` at the page level
- Components receive `lang` and/or `t` as typed props — they never call `getTranslations()` themselves and never read `Astro.params` directly

### Build Command

```bash
npm run build
# expands to: node scripts/copy-robots.mjs && astro build
```

No changes to `scripts/copy-robots.mjs` or `seo/robots-livingit.txt` in this story.

### No Existing Tests

The project has no test suite. Verification is `npm run build` success only.

### Previous Story Intelligence

**From Story 1.1:**
- `output: 'hybrid'` was removed in Astro 6; `output: 'static'` with adapter is the equivalent
- Build output lands in `dist/client/` (static) and `dist/server/` (SSR functions) — not `dist/` root
- `src/` directory structure was untouched in stories 1.1 and 1.2

**From Story 1.2:**
- `src/lib/api.ts` was created — server-side only, throws at module evaluation if imported in browser
- File-level guard pattern: `if (typeof window !== 'undefined') { throw new Error('...'); }`
- The i18n module has no such restriction — it is pure TypeScript with string constants, safe to import anywhere (server or client)
- `src/lib/api.ts` uses `import.meta.env.PUBLIC_API_URL` and `import.meta.env.API_SECRET_KEY`

**git history pattern:**
- Files land in `src/lib/` (utilities) or `src/i18n/` (locale) — no generic `src/utils/`
- TypeScript strict, no implicit any, no untyped exports
- Existing code style: named exports, no default exports on utility modules (see `src/lib/api.ts`, `src/config.ts`)

### References

- i18n structure and key schema: [`_bmad-output/planning-artifacts/architecture.md` — "Naming Patterns: i18n Key Structure"]
- File locations: [`_bmad-output/planning-artifacts/architecture.md` — "Structure Patterns: Project Organisation"]
- API type definitions: [`_bmad-output/planning-artifacts/architecture.md` — "Format Patterns: API Response Types"]
- Confirmation message pattern: [`_bmad-output/planning-artifacts/epics.md` — "Story 3.4"]
- API error shape: [`_bmad-output/planning-artifacts/architecture.md` — "Format Patterns: API Error Response Shape"]
- Epic 1 context: [`_bmad-output/planning-artifacts/epics.md` — "Story 1.3: Create i18n Translation Module"]

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

None — implementation matched exact spec, build passed first attempt.

### Completion Notes List

- Created `src/i18n/sv.ts`: Swedish translation object with `as const` and `Translations` type derived via `typeof sv`.
- Created `src/i18n/en.ts`: English translations with explicit `: Translations` annotation ensuring structural parity at compile time.
- Created `src/i18n/index.ts`: `getTranslations(lang: 'sv' | 'en')` helper; re-exports `Translations` type for single-import convenience in downstream stories.
- Created `src/types/api.ts`: `EventStatus`, `ApiEvent`, `ApiRegistrationRequest`, `ApiErrorResponse` — unblocks Stories 2.1+.
- `npm run build` completed successfully with no TypeScript errors (only pre-existing Node.js compat warnings from `debug` package, unrelated to this story).
- All four ACs satisfied: `getTranslations('sv')` / `getTranslations('en')` return correct typed objects, both conform to `Translations`, strict-mode build passes.

### File List

- src/i18n/sv.ts (new)
- src/i18n/en.ts (new)
- src/i18n/index.ts (new)
- src/types/api.ts (new)

### Change Log

- 2026-03-28: Story 1.3 implemented — created i18n translation module (sv/en/index) and API type definitions.
