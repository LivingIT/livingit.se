---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
lastStep: 8
status: 'complete'
completedAt: '2026-03-27'
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/research/technical-sveltekit-to-astro-migration-research-2026-03-27.md
  - docs/index.md
  - docs/architecture.md
  - docs/source-tree-analysis.md
  - docs/component-inventory.md
  - docs/development-guide.md
  - docs/project-overview.md
workflowType: 'architecture'
project_name: 'livingit.se'
user_name: 'Mattias'
date: '2026-03-27'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements (25 total):**
This initiative is a brownfield extension — all existing static pages are preserved unchanged.
New capabilities are purely additive across 6 categories:
- *Event Discovery* (FR1–FR4): SSR listing integrated into `/events`; detail pages at `/events/[slug]`
- *Event Registration* (FR5–FR10): Server-processed form with validation; confirmation page; state-aware display (upcoming/past/full)
- *Content Management* (FR11–FR14): Event data owned by backend API; language field drives UI rendering
- *Localisation* (FR15–FR18): Language derived from `event.language` field (no locale prefix in URL); locale-appropriate form error messages
- *Site Integration* (FR19–FR22): Shared Layout.astro (header/footer/design system) on all new pages; existing `/events` page unchanged
- *Accessibility & Compliance* (FR23–FR25): WCAG 2.1 AA on all new pages; keyboard-navigable form; event routes excluded from indexing

**Non-Functional Requirements:**
- *Performance* (NFR1–NFR2): SSR pages < 2s response; existing static Lighthouse scores must not regress
- *Security* (NFR3–NFR6): Collect only name/email/employer; server-side validation+sanitisation; reject malformed submissions; GDPR data minimisation
- *Accessibility* (NFR7–NFR8): WCAG 2.1 AA verified by automated tooling + manual keyboard testing; contrast ratios ≥ 4.5:1 normal / 3:1 large

**Scale & Complexity:**
- Primary domain: Web app (hybrid SSG + SSR)
- Complexity level: Low-medium (brownfield, additive only)
- Estimated new architectural components: 5 new pages/routes + 1 API endpoint + optional shared event components

### Technical Constraints & Dependencies

- **Framework**: Astro 6, TypeScript strict, Tailwind CSS 4 (CSS-first via `@theme` in `globals.css`) — all new code must follow existing patterns
- **Rendering**: `output: 'hybrid'` required; `export const prerender = false` on all 3 new SSR page groups
- **Server adapter**: Must add platform adapter (likely `@astrojs/cloudflare` based on detected CF_PAGES_BRANCH env var)
- **External API dependency**: `PUBLIC_API_URL` backend serves all event data and handles registration — Astro becomes a frontend/BFF only; no direct data storage
- **Form handling**: Standard Astro API route (`src/pages/api/register.ts`) — NOT Astro Actions (cookie storage limit risk with 7-field form, confirmed in research)
- **Zod validation**: Import from `astro/zod` (not `zod` directly) — re-exported by Astro, no separate install
- **Redirects**: Must be at `.astro` page frontmatter level only — not inside components (Astro streaming constraint)
- **HTTP status codes**: Must be set explicitly on SSR pages — Astro SSR will not infer 404 from empty data

### Cross-Cutting Concerns Identified

1. **Layout/brand consistency** — `<Layout>` component wraps all new event pages; title prop, meta description, and Open Graph must be set per page
2. **Language from data** — `language` field in API event response is sole locale authority; UI language derived from `event.language`, not the URL
3. **Form validation** — both client-side (UX) and server-side (security); error messages locale-matched to page language
4. **SEO robots exclusion** — `robots.txt` generation logic (`seo/` folder + `copy-robots.mjs`) must be updated to add `Disallow: /events/` (excludes all event detail and confirmation pages; static `/events` remains indexable)
5. **WCAG 2.1 AA** — applies to every new page and the registration form; colour contrast, keyboard operability, focus management
6. **Error handling** — all SSR pages must explicitly set `Astro.response.status` for 404/500; do not rely on implicit inference
7. **Environment variables** — `PUBLIC_API_URL` for event data endpoint; any API secrets must use non-`PUBLIC_` prefix (server-only)

## Starter Template Evaluation

### Primary Technology Domain

Brownfield web application extension — extending an existing Astro 6 SSG site to hybrid SSG/SSR.
No starter template applies. The "initialization" for this project is adding the server adapter
and switching rendering mode in the existing codebase.

### Existing Technical Foundation

All technology decisions are already established by the existing codebase:

| Category | Technology | Status |
|---|---|---|
| Framework | Astro 6, TypeScript strict | In place |
| Styling | Tailwind CSS 4 (CSS-first via `@theme` in `globals.css`) | In place |
| Formatting | Prettier + astro + tailwindcss plugins | In place |
| Deployment | Cloudflare Pages | In place |
| Testing | None — Playwright recommended (port from events site) | To be added |

### Required Package Changes

**Add Cloudflare adapter:**

```bash
npx astro add cloudflare
```

This installs `@astrojs/cloudflare` and auto-updates `astro.config.ts` with the adapter.

**Switch rendering mode** (manual edit to `astro.config.ts`):

```typescript
// astro.config.ts
export default defineConfig({
  output: 'hybrid',   // was: 'static'
  adapter: cloudflare(),
  // ... existing config unchanged
});
```

**No other new dependencies required.** Zod is already available via `astro/zod`.

### Architectural Decisions Established by Existing Stack

**Language & Runtime:**
TypeScript strict mode throughout — all new files must be `.ts` or `.astro` with typed frontmatter.

**Styling Solution:**
Tailwind CSS 4 CSS-first — no `tailwind.config.js`. All design tokens defined via `@theme` in
`src/styles/globals.css`. New event pages and components follow this pattern exclusively.

**Build Tooling:**
Astro 6 built-in — Vite under the hood. No changes to build pipeline needed.

**Testing Framework:**
No existing tests. Recommended addition: Playwright (E2E) for event registration critical path,
ported from the existing `events.livingit.se` codebase. Unit tests with Vitest for API route
handler logic. Testing setup is a post-implementation concern, not a blocker.

**Code Organization:**
File-based routing via `src/pages/`. All new event pages added under `src/pages/events/`.
API routes under `src/pages/api/`. Content model additions to `src/content/events.ts`.
All existing files remain untouched.

**Development Experience:**
`npm run dev` → `http://localhost:5000` (unchanged). New SSR pages work in dev mode without
the adapter. The adapter is only required for production build/deployment.

**Note:** Adding the Cloudflare adapter and switching to `output: 'hybrid'` should be the
first implementation task — verified against the existing static build before any new pages
are added.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- Rendering mode: `output: 'hybrid'` + Cloudflare adapter
- All event data is live from `api.livingit.se` — no TypeScript content file for event instances
- Form submission proxied through `src/pages/api/register.ts` → `api.livingit.se`
- Localisation via typed `src/i18n/` objects (not Astro native i18n)
- Confirmation data passed via URL-encoded params

**Important Decisions (Shape Architecture):**
- No client-side state management — all state is URL/server-derived
- Astro components only — no React, Vue, or other JS framework
- API secrets in non-`PUBLIC_` env vars (server-only)
- Origin header validation for API route CSRF protection

**Deferred Decisions (Post-MVP):**
- Playwright E2E test suite (port from events site after implementation)
- Cloudflare Turnstile CAPTCHA for spam protection

---

### Data Architecture

**Event Data Source:** `api.livingit.se` — single source of truth for all event data.
All event definitions, dates, capacity, and registration counts are owned by the backend.
The Astro site is a pure rendering layer — it fetches and displays, never stores.

**Existing `src/content/events.ts`:** Unchanged. Serves marketing copy for the static
`/events` overview page only (4 event-type descriptions + images).

**Data flow:**
- Listing page (`/events`) → `GET api.livingit.se/api/events/public` on each request
- Detail page (`/events/[slug]`) → `GET api.livingit.se/api/events/public/{slug}` on each request
- Registration → `POST src/pages/api/register.ts` → proxied to `api.livingit.se`

**Caching:** None on SSR event pages — registration status (upcoming/past/full) must be
live accurate. Cloudflare edge cache bypassed for all SSR routes.

**Validation:** Zod via `astro/zod` — registration form schema validated server-side
in `src/pages/api/register.ts` before proxying to backend.

---

### Authentication & Security

**User authentication:** None — public registration form, no login required.

**API authentication:** `api.livingit.se` calls use a server-side API key stored as
`API_SECRET_KEY` (non-`PUBLIC_` prefix — never exposed to browser).

**CSRF protection:** Origin header validation in `src/pages/api/register.ts`.
Requests not originating from `livingit.se` are rejected with 403.

**Data minimisation (GDPR):** Registration form collects only: name, email, employer.
No additional fields. Data transmitted directly to `api.livingit.se` — not stored
or logged by the Astro application layer.

**Rate limiting:** Cloudflare WAF handles at edge — no application-level rate limiting needed.

**Input sanitisation:** All form input validated via Zod schema before forwarding.
Malformed or incomplete submissions rejected with 400 + locale-appropriate error message.

---

### API & Communication Patterns

**Backend:** `api.livingit.se` — own REST API. Base URL stored in env var `PUBLIC_API_URL`.

**Env var strategy:**

| Variable | Prefix | Accessible from |
|---|---|---|
| `PUBLIC_API_URL` | `PUBLIC_` | Server + browser (URL is not sensitive) |
| `API_SECRET_KEY` | _(none)_ | Server only |

**Astro API route pattern:**
```typescript
// src/pages/api/register.ts
export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData();
  // 1. Zod validate
  // 2. Origin check
  // 3. Proxy to api.livingit.se with API_SECRET_KEY
  // 4. Return redirect or error response
};
```

**Error handling standard:**
- All SSR pages set `Astro.response.status` explicitly (404, 500) — never rely on inference
- API route returns JSON error with `{ error: string, field?: string }` shape
- Client receives locale-appropriate error message mapped from response

**HTTP redirects:** `return Astro.redirect('/path', 302)` at page frontmatter level only —
never inside components (Astro streaming constraint).

---

### Frontend Architecture

**Component strategy:** Astro components (`.astro`) only. No React, Vue, or Svelte.

**New components to create:**

| Component | Purpose |
|---|---|
| `src/components/EventCard.astro` | Single event card for listing page |
| `src/components/RegistrationForm.astro` | Registration form with client-side validation |
| `src/components/EventStatusBadge.astro` | Upcoming / Past / Full status indicator |

**Client-side JavaScript:** Minimal inline `<script>` in `RegistrationForm.astro` for
real-time validation UX feedback only. No framework, no build step.

**Localisation:**
```
src/i18n/
  sv.ts   — Swedish translations (typed)
  en.ts   — English translations (typed, same keys)
  index.ts — getTranslations(lang: 'sv' | 'en') helper
```
Language derived from `event.language` field returned by API — no URL segment, no browser detection.
Passed as prop to all locale-aware components.

**State management:** None. All state is request-derived (URL params, server fetch results).
No client-side stores. PRG pattern via redirect after successful registration.

**Confirmation data:** URL-encoded params on redirect to `/events/[slug]/confirmation`
(e.g. `?name=Erik`). Stateless — no session required. Language resolved by fetching event on the confirmation page.

---

### Infrastructure & Deployment

**Platform:** Cloudflare Pages (in place). SSR pages run as Cloudflare Pages Functions.

**Adapter:** `@astrojs/cloudflare` — install via `npx astro add cloudflare`.

**Environment variables (required in Cloudflare Pages dashboard):**
- `PUBLIC_API_URL` — `https://api.livingit.se`
- `API_SECRET_KEY` — backend API authentication secret

**CI/CD:** Cloudflare Pages auto-deploys from Git (already in place). No pipeline changes needed.

**robots.txt:** `seo/robots-livingit.txt` must be updated to disallow:
```
Disallow: /events/
```
This excludes all event detail pages (`/events/[slug]`) and confirmation pages (`/events/[slug]/confirmation`) while leaving the static `/events` marketing page indexable.

**Monitoring:** Cloudflare Analytics (included with Pages). No additional tooling for MVP.

---

### Decision Impact Analysis

**Implementation Sequence (order matters):**
1. ✅ Add Cloudflare adapter + switch to `output: 'hybrid'` → verify existing static site builds
2. ✅ Add env vars + verify `api.livingit.se` connectivity
3. ✅ Create `src/i18n/` translation files
4. ✅ Integrate event listing into `/events` page (SSR, read-only)
5. Implement `/events/[slug]` detail + registration form placeholder
6. Implement `src/pages/api/register.ts` (validate + proxy)
7. Implement `/events/[slug]/confirmation` page
8. Update `robots.txt` to exclude `/events/`
9. Decommission `events.livingit.se`

**Cross-Component Dependencies:**
- `src/i18n/` must exist before any locale-aware page/component can be built
- Cloudflare adapter must be verified working before SSR pages are meaningful to test
- `RegistrationForm.astro` depends on `src/pages/api/register.ts` being in place
- Confirmation page depends on redirect from API route passing URL params correctly

## Implementation Patterns & Consistency Rules

### Critical Conflict Points Identified

7 areas where AI agents could make inconsistent choices without explicit rules:
file naming, component prop patterns, i18n key structure, API error shape,
event status representation, locale passing strategy, and SSR error handling.

---

### Naming Patterns

**File Naming:**

| Type | Convention | Examples |
|---|---|---|
| Astro components | `PascalCase.astro` | `EventCard.astro`, `RegistrationForm.astro` |
| Astro pages | `kebab-case.astro` | `upcoming.astro`, `[slug].astro` |
| TypeScript modules | `kebab-case.ts` | `sv.ts`, `en.ts`, `index.ts` |
| API routes | `kebab-case.ts` | `register.ts` |

Follows existing project: `Layout.astro`, `HeroCarousel.astro`, `cookies-policy.astro`.

**Component Props:**
All props typed with explicit TypeScript interfaces in the component frontmatter.
Props use `camelCase`. Boolean props follow HTML convention (`isActive`, not `active`).

```astro
---
interface Props {
  lang: 'sv' | 'en';
  eventSlug: string;
  isFullyBooked: boolean;
}
const { lang, eventSlug, isFullyBooked } = Astro.props;
---
```

**TypeScript Types & Interfaces:**
- Interfaces: `PascalCase` — no `I` prefix (`Event`, not `IEvent`)
- Union string literals preferred over enums: `'upcoming' | 'past' | 'full'` not `enum EventStatus`
- API response types live in `src/types/api.ts`

**i18n Key Structure:**
Flat namespaced keys — dot notation, lowercase, descriptive:

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
  },
  nav: {
    backToEvents: 'Tillbaka till evenemang',
  },
} as const;

export type Translations = typeof sv;
```

```typescript
// src/i18n/index.ts
import { sv } from './sv';
import { en } from './en';

export function getTranslations(lang: 'sv' | 'en') {
  return lang === 'sv' ? sv : en;
}
```

---

### Structure Patterns

**Project Organisation:**

```
src/
├── components/         ← All Astro components (existing + new)
├── content/            ← Static marketing content only (unchanged)
├── i18n/               ← NEW: sv.ts, en.ts, index.ts
├── pages/
│   ├── events/
│   │   ├── [slug].astro                ← SSR detail + form
│   │   └── [slug]/
│   │       └── confirmation.astro      ← SSR confirmation
│   └── api/
│       └── register.ts                 ← API route
├── types/
│   └── api.ts          ← NEW: API response type definitions
└── styles/             ← Unchanged
```

No new top-level directories beyond `src/i18n/` and `src/types/`. Utilities that are
shared across pages go in `src/i18n/` (locale) or `src/types/` (type definitions).
No generic `src/utils/` folder — helpers live closest to their usage.

---

### Format Patterns

**API Response Types (`src/types/api.ts`):**

```typescript
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

**API Error Response Shape (from `src/pages/api/register.ts`):**

```typescript
// Success → redirect (not JSON)
return Astro.redirect(`/events/${lang}/${slug}/confirmation?name=${encodeURIComponent(name)}`);

// Validation error → 400 JSON
return new Response(JSON.stringify({ error: t.form.errorRequired, field: 'email' }), {
  status: 400,
  headers: { 'Content-Type': 'application/json' },
});

// Backend error → 502 JSON
return new Response(JSON.stringify({ error: t.form.errorGeneric }), {
  status: 502,
  headers: { 'Content-Type': 'application/json' },
});
```

**Date Display:** Use `Intl.DateTimeFormat` with locale derived from `lang` prop.
Never hardcode date formats:

```typescript
const formatted = new Intl.DateTimeFormat(lang === 'sv' ? 'sv-SE' : 'en-GB', {
  dateStyle: 'long',
  timeStyle: 'short',
}).format(new Date(event.date));
```

---

### Process Patterns

**SSR Page Error Handling:**

All SSR pages follow this pattern — no exceptions:

```astro
---
export const prerender = false;

const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/events/${slug}`);

if (!response.ok) {
  Astro.response.status = response.status === 404 ? 404 : 500;
  // render error state below — do not throw
}

const event = response.ok ? await response.json() as ApiEvent : null;
---

{event ? (
  <!-- happy path -->
) : (
  <!-- error state -->
)}
```

Never use `try/catch` around fetch in SSR pages — check `response.ok` instead.
Always set `Astro.response.status` explicitly before any rendering.

**Locale Passing Pattern:**

Locale is extracted from `Astro.params.lang` at the page level and passed down as a prop.
Components never read `Astro.params` directly — they receive `lang` as a typed prop.

```astro
---
// events/[slug].astro
const { slug } = Astro.params as { slug: string };
const response = await apiFetch(`/api/events/public/${slug}`);
const event = await response.json() as ApiEvent;
const t = getTranslations(event.language);
---
<RegistrationForm lang={event.language} eventSlug={slug} translations={t.form} />
```

**CSRF Validation Pattern (API route):**

```typescript
// First check in every API route handler
const origin = request.headers.get('origin');
if (!origin?.includes('livingit.se')) {
  return new Response(null, { status: 403 });
}
```

**Form Submission Loading State:**

Inline `<script>` in `RegistrationForm.astro` only. Disable submit button on click,
re-enable on error response. No external libraries.

```html
<script>
  const form = document.querySelector('#registration-form');
  const button = form?.querySelector('button[type="submit"]');
  form?.addEventListener('submit', () => {
    if (button) button.setAttribute('disabled', 'true');
  });
</script>
```

---

### Enforcement Guidelines

**All AI agents MUST:**
- Add `export const prerender = false` as the **first line** of every new SSR page
- Use `getTranslations(lang)` — never inline hardcoded Swedish or English strings
- Check `response.ok` and set `Astro.response.status` explicitly — never assume
- Import Zod from `astro/zod`, not from `zod`
- Keep all redirect logic in page frontmatter, never inside components
- Use `PascalCase.astro` for component files, `kebab-case.astro` for page files
- Pass `lang` as explicit prop to all locale-aware components

**Anti-Patterns (never do these):**

```typescript
// ❌ Hardcoded locale strings
<p>Anmäl dig här</p>
// ✅ i18n lookup
<p>{t.form.submitButton}</p>

// ❌ No error check on fetch
const data = await fetch(...).then(r => r.json());
// ✅ Check ok, set status
if (!response.ok) { Astro.response.status = 500; }

// ❌ Redirect inside a component
return Astro.redirect('/');
// ✅ Redirect in page frontmatter only

// ❌ Wrong Zod import
import { z } from 'zod';
// ✅ Correct
import { z } from 'astro/zod';
```

## Project Structure & Boundaries

### Complete Project Directory Structure

Files marked `← UNCHANGED`, `← MODIFIED`, or `← NEW`.

```
livingit.se/
├── astro.config.ts              ← MODIFIED: output:'hybrid' + cloudflare adapter
├── package.json                 ← MODIFIED: @astrojs/cloudflare added
├── tsconfig.json                ← UNCHANGED
├── postcss.config.js            ← UNCHANGED
│
├── seo/
│   ├── robots-livingit.txt      ← MODIFIED: Disallow /events/
│   └── robots-devingit.txt      ← UNCHANGED
│
├── scripts/
│   └── copy-robots.mjs          ← UNCHANGED
│
├── public/                      ← UNCHANGED (all assets)
│
└── src/
    ├── config.ts                ← UNCHANGED
    │
    ├── i18n/                    ← NEW directory
    │   ├── sv.ts                ← NEW: Swedish translations (const object, as const)
    │   ├── en.ts                ← NEW: English translations (same keys as sv.ts)
    │   └── index.ts             ← NEW: getTranslations(lang) helper + Translations type
    │
    ├── types/                   ← NEW directory
    │   └── api.ts               ← NEW: ApiEvent, ApiRegistrationRequest, ApiErrorResponse, EventStatus
    │
    ├── styles/
    │   └── globals.css          ← UNCHANGED
    │
    ├── content/                 ← ALL UNCHANGED (marketing copy only)
    │   ├── events.ts            ← UNCHANGED (4 event-type cards on /events page)
    │   ├── services.ts          ← UNCHANGED
    │   ├── consulting-sw.ts     ← UNCHANGED
    │   ├── consulting-im.ts     ← UNCHANGED
    │   └── contact.ts           ← UNCHANGED
    │
    ├── components/
    │   ├── Layout.astro         ← UNCHANGED (wraps all new event pages)
    │   ├── Navigation.astro     ← UNCHANGED
    │   ├── Footer.astro         ← UNCHANGED
    │   ├── Hero.astro           ← UNCHANGED
    │   ├── HeroCarousel.astro   ← UNCHANGED
    │   ├── Services.astro       ← UNCHANGED
    │   ├── CookieBanner.astro   ← UNCHANGED
    │   ├── EventCard.astro      ← NEW: event card for listing page (props: event, lang)
    │   ├── EventStatusBadge.astro ← NEW: status chip (props: status, translations)
    │   └── RegistrationForm.astro ← NEW: form + client-side validation script (props: lang, eventSlug, translations)
    │
    └── pages/
        ├── index.astro              ← UNCHANGED
        ├── mjukvarukonsulting.astro ← UNCHANGED
        ├── ledarskapskonsulting.astro ← UNCHANGED
        ├── events.astro             ← MODIFIED: SSR listing integrated (prerender=false)
        ├── kontakt.astro            ← UNCHANGED
        ├── cookies-policy.astro     ← UNCHANGED
        │
        ├── events/                  ← NEW directory
        │   ├── [slug].astro         ← NEW: SSR event detail + registration form (prerender=false)
        │   └── [slug]/
        │       └── confirmation.astro ← NEW: SSR confirmation page (prerender=false)
        │
        └── api/                     ← NEW directory
            └── register.ts          ← NEW: POST handler (Zod validate → proxy to api.livingit.se)
```

---

### Architectural Boundaries

**External Service Boundary — `api.livingit.se`:**
- All event data and registration storage lives here — outside this repo
- Astro communicates server-side only (never from browser)
- Authenticated via `API_SECRET_KEY` env var on all outbound calls
- Assumed REST API; exact endpoint paths to be confirmed with backend team before implementation

**CDN / Edge Boundary — Cloudflare Pages:**
- Static pages (all existing) served directly from CDN — zero server compute
- SSR pages run as Cloudflare Pages Functions (serverless, per-request)
- Edge cache must be bypassed for all SSR event routes (live data requirement)

**Form Submission Boundary — `/api/register`:**
- Single entry point for all registration submissions
- Validates, checks CSRF, then proxies — does not store data
- Returns redirect on success, JSON error on failure

---

### Requirements to Structure Mapping

**Event Discovery (FR1–FR4):**

| FR | File |
|---|---|
| FR1: Browse upcoming events | `src/pages/events.astro` (integrated listing) + `src/components/EventCard.astro` |
| FR2: View event details | `src/pages/events/[slug].astro` + `src/types/api.ts` |
| FR3: Event status display | `src/components/EventStatusBadge.astro` |
| FR4: Link from /events page | `src/pages/events.astro` (add link only) |

**Event Registration (FR5–FR10):**

| FR | File |
|---|---|
| FR5: Registration form | `src/components/RegistrationForm.astro` |
| FR6: Confirmation page | `src/pages/events/[slug]/confirmation.astro` |
| FR7: Inline validation | `src/components/RegistrationForm.astro` (client script + server Zod) |
| FR8: No form for past events | `src/pages/events/[slug].astro` (conditional render on `status`) |
| FR9: No form when full | `src/pages/events/[slug].astro` (conditional render on `status`) |
| FR10: Server-side processing | `src/pages/api/register.ts` |

**Localisation (FR15–FR18):**

| FR | File |
|---|---|
| FR15–FR16: Events at `/events/[slug]` | `src/pages/events/[slug].astro` |
| FR17: UI in event language | `src/i18n/sv.ts`, `src/i18n/en.ts`, `src/i18n/index.ts` |
| FR18: Locale error messages | `src/i18n/sv.ts` + `src/i18n/en.ts` form error keys |

**Site Integration (FR19–FR22):**

| FR | File |
|---|---|
| FR19–FR21: Shared layout | `src/components/Layout.astro` wraps all new pages |
| FR22: /events page unchanged | `src/pages/events.astro` — link addition only |

**Accessibility & Compliance (FR23–FR25):**

| FR | File |
|---|---|
| FR23–FR24: WCAG 2.1 AA | All new `.astro` files — enforced during implementation |
| FR25: robots.txt exclusion | `seo/robots-livingit.txt` |

**Content Management (FR11–FR14):** Handled by `api.livingit.se` backend — outside this repo.

---

### Integration Points

**Internal Communication:**
- Pages import components directly (Astro file-based imports)
- All components receive `lang` + `translations` as explicit props — no global state
- `src/i18n/index.ts` is the single import point for all locale lookups

**External Integrations:**
- `api.livingit.se` — event data (GET) and registration (POST)
  - Called from SSR page frontmatter and `src/pages/api/register.ts`
  - Never called from client-side scripts

**Data Flow:**

```
Static pages:
  Build time → Astro pre-renders → Cloudflare CDN → Browser

SSR event listing:
  Browser → CF Pages Function → Astro SSR
    → GET api.livingit.se/[events]
    → render EventCard × N with EventStatusBadge
    → return HTML

SSR event detail:
  Browser → CF Pages Function → Astro SSR
    → GET api.livingit.se/[event]/{slug}
    → conditionally render RegistrationForm or status message
    → return HTML

Registration:
  Browser (form POST) → CF Pages Function → /api/register.ts
    → Origin check → Zod validate
    → POST api.livingit.se/[register] (+ API_SECRET_KEY header)
    → 302 redirect to /events/{lang}/{slug}/confirmation?name=...
    OR 400 JSON { error, field? } → client displays inline error
```

---

### Configuration Files

**Environment variables (Cloudflare Pages dashboard):**

```
PUBLIC_API_URL=https://api.livingit.se
API_SECRET_KEY=[secret]
```

**`astro.config.ts` changes (only these two lines change):**

```typescript
import cloudflare from '@astrojs/cloudflare';
export default defineConfig({
  output: 'hybrid',        // was: 'static'
  adapter: cloudflare(),   // new
  // all other config unchanged
});
```

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
All technology choices are mutually compatible. Astro 6 hybrid mode with
`@astrojs/cloudflare` is a first-party supported combination. Tailwind CSS 4
and Zod (via `astro/zod`) are already part of the Astro 6 ecosystem with no
version conflicts. No Astro Actions are used, avoiding the known cookie-limit
issue with multi-field forms.

**Pattern Consistency:**
Naming conventions (PascalCase components, kebab-case pages) are consistent
with the existing codebase. Locale passing via explicit props, error handling
via `response.ok` checks, and redirect-only-at-page-level are applied
uniformly across all new pages. No contradictions between decisions.

**Structure Alignment:**
All new files are purely additive. No existing files are restructured except
the three targeted modifications (`astro.config.ts`, `events.astro`,
`robots-livingit.txt`). The `src/i18n/` and `src/types/` additions follow
Astro project conventions and do not conflict with the existing layout.

---

### Requirements Coverage Validation ✅

**Functional Requirements (25/25 covered):**
- FR1–FR4 (Event Discovery): `upcoming.astro`, `EventCard.astro`, `EventStatusBadge.astro`
- FR5–FR10 (Registration): `[slug].astro`, `register.ts`, `confirmation.astro`, `RegistrationForm.astro`
- FR11–FR14 (Content Management): delegated to `api.livingit.se` — by design, not a gap
- FR15–FR18 (Localisation): `src/i18n/` directory with typed translation objects
- FR19–FR22 (Site Integration): `Layout.astro` wraps all new pages; `/events` page gets link addition
- FR23–FR25 (Accessibility/Compliance): WCAG 2.1 AA as implementation requirement; `robots-livingit.txt` updated

**Non-Functional Requirements (8/8 covered):**
- NFR1 (SSR < 2s): Cloudflare Pages Functions + lightweight server logic — achievable
- NFR2 (No static regression): hybrid mode explicitly leaves all existing pages pre-rendered
- NFR3–NFR6 (Security/GDPR): CSRF via Origin header, Zod validation, `API_SECRET_KEY` server-only, data minimisation by design
- NFR7–NFR8 (Accessibility): WCAG 2.1 AA mandated across all new `.astro` files including `RegistrationForm.astro`

---

### Gap Analysis Results

**🟡 Important Gap 1 — API endpoint contract not yet confirmed:**
The `ApiEvent` type and data flow assume `api.livingit.se` returns a computed
`status` field (`'upcoming' | 'past' | 'full'`). If the API returns raw
`registrationCount` + `capacity` instead, status derivation logic must live
in the SSR page frontmatter. Endpoint paths are also unknown.

Action required before first SSR page is built:
Confirm with backend team: (a) exact endpoint URLs, (b) response shape,
(c) whether `status` is computed server-side or must be derived in Astro.
Update `src/types/api.ts` accordingly.

**🟡 Important Gap 2 — Error pages not in scope:**
Astro SSR requires `src/pages/404.astro` and `src/pages/500.astro` for SSR
routes to return correct HTTP status codes. These do not exist in the current
codebase (static site doesn't need them).

Action: Add creation of `src/pages/404.astro` and `src/pages/500.astro`
(simple pages using `Layout.astro`) to the implementation task list.

**🟢 Minor Gap — No `.env.example` file:**
Add `.env.example` with `PUBLIC_API_URL` and `API_SECRET_KEY` placeholders
as part of the adapter setup task.

---

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed (low-medium, brownfield, additive)
- [x] Technical constraints identified (Cloudflare, hybrid mode, external API)
- [x] Cross-cutting concerns mapped (layout, i18n, accessibility, robots.txt)

**✅ Architectural Decisions**
- [x] Critical decisions documented (adapter, rendering mode, form handling, i18n)
- [x] Technology stack fully specified
- [x] Integration patterns defined (proxy pattern, CSRF, env vars)
- [x] Performance and security considerations addressed

**✅ Implementation Patterns**
- [x] Naming conventions established (file types, props, i18n keys)
- [x] Structure patterns defined (no utils folder, locale via explicit props)
- [x] Process patterns documented (SSR error handling, redirect rules, CSRF)
- [x] Anti-patterns explicitly called out with examples

**✅ Project Structure**
- [x] Complete directory structure with UNCHANGED / MODIFIED / NEW annotations
- [x] All 25 FRs mapped to specific files
- [x] Integration points and data flow documented
- [x] Configuration changes specified exactly

---

### Architecture Readiness Assessment

**Overall Status: READY FOR IMPLEMENTATION**

**Confidence Level: High**

Two pre-implementation actions required:
1. Confirm `api.livingit.se` endpoint paths and response shape with backend team
2. Add `404.astro` and `500.astro` to implementation scope

**Key Strengths:**
- Purely additive — zero risk to existing static pages
- All event data live from API — no stale content possible
- Typed i18n prevents locale gaps at compile time
- Explicit patterns eliminate agent ambiguity on the 7 identified conflict points
- Implementation sequence is ordered by dependency (adapter → env → i18n → pages)

**Areas for Future Enhancement (post-MVP):**
- Playwright E2E test suite (port from events site)
- Cloudflare Turnstile CAPTCHA for registration form spam protection
- Vitest unit tests for `register.ts` handler logic

---

### Implementation Handoff

**AI Agent Guidelines:**
- Follow all architectural decisions exactly as documented in this file
- Use implementation patterns consistently — refer to the anti-patterns list
- Respect the UNCHANGED / MODIFIED / NEW annotations in the project structure
- Confirm API contract with backend team before building SSR pages

**First Implementation Task:**
```bash
npx astro add cloudflare
```
Then switch `output: 'hybrid'` in `astro.config.ts`, run `npm run build`,
and verify all existing static pages build successfully before adding any new pages.
