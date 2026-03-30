# Story 3.1: Build Event Detail Page with State-Aware Display

Status: done

## Story

As a **visitor**,
I want to view a full event detail page at `/events/[slug]`,
so that I can read event information and understand whether registration is available.

## Acceptance Criteria

1. **Given** I navigate to `/events/[slug]`, **When** the page loads, **Then** the page is SSR (`export const prerender = false`) and displays the shared `<Layout>` with the correct `title` and meta description.
2. **And** event details are fetched from `GET $PUBLIC_API_URL/api/events/public/{slug}` and displayed: hero image, title, date/time range, location, price (if paid), description (HTML), agenda (HTML).
3. **And** an `EventStatusBadge` is shown reflecting the event's status.
4. **And** if the event status is `'upcoming'` or `isSoldOut` (join queue), a registration form placeholder is shown (the actual form is implemented in Story 3.2).
5. **And** if the event status is `'past'`, no registration form is shown and a link back to `/events` is displayed.
6. **And** if the slug is not found (API returns 404), `Astro.response.status` is set to 404 and a "not found" page is shown.
7. **And** if the API returns a non-404 error, `Astro.response.status` is set to 500 and an error message is shown.
8. **And** the page language matches the event's `language` field from the API (`'sv'` → Swedish UI, `'en'` → English UI) via `getTranslations(event.language)`.
9. **And** a neutral "Tillbaka" / "Back" button (`.btn-back`, `t.nav.back`) is shown in the left column above the "Tid och plats" heading, linking to `/events`.

## Tasks / Subtasks

- [x] Create `src/pages/events/[slug].astro` (AC: #1–#8)
  - [x] `export const prerender = false` as **FIRST line** (mandatory)
  - [x] Extract `slug` from `Astro.params` — this is the event's `eventId`
  - [x] Call `apiFetch(\`/api/events/public/${slug}\`)` and handle errors (404 → 404, other → 500)
  - [x] Compute status: `event.isSoldOut ? 'full' : event.isActive ? 'upcoming' : 'past'`
  - [x] Detect one-day event: `new Date(event.startDateTime).toDateString() === new Date(event.endDateTime).toDateString()`
  - [x] Get translations: `getTranslations(event.language)`
  - [x] Render hero image section (full-width `event.imageUrl`)
  - [x] Render two-column layout (event info left, form placeholder right)
  - [x] Render event title, time range, location, price (if `event.price?.ticketPrice > 0`)
  - [x] Render description and agenda as HTML (`set:html`)
  - [x] Render `<EventStatusBadge>` with correct status and translations
  - [x] State-aware right column: upcoming/soldOut → placeholder, past → back link
  - [x] Render error states (404, 500) with back link
  - [x] Fixed home/back button (top-right, links to `/events`)
- [x] Verify: `npm run build` passes with zero TypeScript errors

## Dev Notes

### One New File Only

**Create:** `src/pages/events/[slug].astro`

The `src/pages/events/` directory may not exist (it was created for Story 2.2, then `upcoming.astro` was deleted when the listing was merged into `/events` in commit 6b52f62). Create the directory and file.

Do NOT:
- Modify `EventCard.astro`, `EventStatusBadge.astro`, `Layout.astro`
- Modify `src/pages/events.astro` (the `/events` listing page)
- Modify `src/lib/api.ts`, `src/types/api.ts`, `src/i18n/`
- Create `RegistrationForm.astro` (that's Story 3.2)
- Add new dependencies

### ⚠️ CRITICAL: `slug` Parameter = `eventId`

The route parameter is named `slug` in the file (`[slug].astro`) but holds the event's `eventId` value. This is because `EventCard.astro` links to `/events/${event.eventId}`.

```typescript
const { slug } = Astro.params as { slug: string };
// slug === event.eventId — use it directly:
const response = await apiFetch(`/api/events/public/${slug}`);
```

### ⚠️ CRITICAL: Actual `ApiEvent` Shape (Differs from Architecture Docs)

The architecture doc shows a simplified type. The **actual** `ApiEvent` in `src/types/api.ts` is:

```typescript
interface ApiEvent {
  eventId: string;          // URL identifier (NOT a "slug" field)
  eventType: string;
  language: 'sv' | 'en';
  title: string;
  description: string;      // HTML string — use set:html
  agenda: string;           // HTML string — use set:html
  imageUrl: string;
  startDateTime: string;    // ISO 8601 — NOT "date"
  endDateTime: string;      // ISO 8601
  location: string;
  isActive: boolean;        // true = upcoming
  isSoldOut: boolean;       // true = full/queue
  isAlmostSoldOut: boolean;
  defaultTicketSeatCount: number;
  maxTicketSeatCount: number;
  contactEmail: string;
  termsUrl: string;
  privacyUrl: string;
  price?: { ticketPrice: number; vatAmount: number; vatPercentage: number; minimumTicketsForInvoicing: number; saleIsOpen: boolean };
  foodOptions?: { options: Array<{ optionId: string; description: string }>; acceptAllergies: boolean };
  geo: { latitude: number; longitude: number };
}
```

### ⚠️ CRITICAL: `isSoldOut` Does NOT Hide the Form

In the existing `events.livingit.se` site, a sold-out event **still shows the registration form** — the button text changes to "Join queue" (`t.form.joinQueue`). The `EventForms` component handles `isSoldOut` as a different form variant, not a "no form" state.

Therefore, status rendering rules are:
- `isActive && !isSoldOut` → `'upcoming'` → show registration form placeholder
- `isActive && isSoldOut` → still `'upcoming'` (queue mode) → show registration form placeholder (Story 3.2 handles the queue button text)
- `!isActive` → `'past'` → no form, show back link

For the `EventStatusBadge`: only show `'full'` badge when `isSoldOut`, use `'upcoming'` otherwise.

```typescript
const status: EventStatus = event.isSoldOut ? 'full' : event.isActive ? 'upcoming' : 'past';
const showRegistrationPlaceholder = event.isActive; // includes sold-out (queue)
```

### SSR Page Pattern (Mandatory)

```astro
---
export const prerender = false;  // MUST BE FIRST LINE

import { apiFetch } from '../../lib/api';
import type { ApiEvent, EventStatus } from '../../types/api';
import { getTranslations } from '../../i18n';
import Layout from '../../components/Layout.astro';
import EventStatusBadge from '../../components/EventStatusBadge.astro';

const { slug } = Astro.params as { slug: string };

const response = await apiFetch(`/api/events/public/${slug}`);

if (!response.ok) {
  Astro.response.status = response.status === 404 ? 404 : 500;
}

const event: ApiEvent | null = response.ok
  ? (await response.json() as ApiEvent)
  : null;

const status: EventStatus | null = event
  ? (event.isSoldOut ? 'full' : event.isActive ? 'upcoming' : 'past')
  : null;

const showRegistrationPlaceholder = event?.isActive ?? false;

const isOneDayEvent = event
  ? new Date(event.startDateTime).toDateString() === new Date(event.endDateTime).toDateString()
  : false;

const t = event ? getTranslations(event.language) : getTranslations('sv');
---
```

Architecture rules (no exceptions):
- `prerender = false` **first** line
- **Never** `try/catch` around fetch — use `response.ok` (note: `events.astro` deviates with try/catch — do NOT copy)
- **Never** call `.json()` on a failed response

### Page Layout (Match events.livingit.se)

The existing SvelteKit site layout for the detail page:

```
[Full-width hero image]
[Two-column section: event info (flex 2) | form column (flex 1)]
  Left: title, time range, location, price, description, agenda
  Right: form placeholder / back link
[Fixed top-right home button → /events]
```

**Mobile**: single column (stacked). **Desktop** (≥ 768px): two columns side-by-side.

Minimal Astro structure:
```astro
<!-- Fixed home/back button -->
<a href="/events" class="home-button" aria-label={t.common.goToHome}>
  <!-- home SVG icon (see events.livingit.se src/routes/events/[eventId]/+page.svelte) -->
</a>

<!-- Hero image -->
<section class="promotion">
  <img src={event.imageUrl} alt={t.common.eventPromotion} />
</section>

<!-- Content section -->
<section>
  <div class="content">         <!-- flex row at ≥768px -->
    <div class="event">         <!-- flex: 2 -->
      <h1>{event.title}</h1>
      <EventStatusBadge ... />
      <div class="event__details">
        <h2>{t.common.timeAndLocation}</h2>
        <!-- time range, location, price -->
      </div>
      <div set:html={event.description} />
      <div set:html={event.agenda} />
    </div>
    <div class="reservation">   <!-- flex: 1 -->
      <!-- placeholder or back link -->
    </div>
  </div>
</section>
```

### Date / Time Range Display

```typescript
function formatDate(isoDate: string, lang: 'sv' | 'en', options: Intl.DateTimeFormatOptions): string {
  try {
    const d = new Date(isoDate);
    if (isNaN(d.getTime())) throw new RangeError('invalid');
    return new Intl.DateTimeFormat(lang === 'sv' ? 'sv-SE' : 'en-GB', options).format(d);
  } catch {
    return isoDate;
  }
}

const startFormatted = formatDate(event.startDateTime, event.language, { dateStyle: 'long', timeStyle: 'short' });
// One-day event: end shows time only (no date)
const endFormatted = formatDate(event.endDateTime, event.language,
  isOneDayEvent ? { timeStyle: 'short' } : { dateStyle: 'long', timeStyle: 'short' }
);
// Display: "{startFormatted} - {endFormatted}"
```

### Price Display (Conditional)

Only show if `event.price && event.price.ticketPrice > 0`:

```astro
{event.price && event.price.ticketPrice > 0 && (
  <p class="event__price">
    {event.price.ticketPrice} {t.price.sek}
    ({t.price.includingVat.replace('{{percentage}}', String(event.price.vatPercentage))})
  </p>
)}
```

Note: `t.price.includingVat` is a string with `{{percentage}}` placeholder — replace it manually (not a function). Check the actual i18n key value in `src/i18n/sv.ts`.

### description and agenda: MUST Use `set:html`

Both `event.description` and `event.agenda` are **HTML strings** from the API (contain `<p>` tags, links, etc.). You MUST use `set:html` — plain `{event.description}` will render escaped HTML as text.

```astro
<div class="event__description" set:html={event.description} />
<div class="event__agenda" set:html={event.agenda} />
```

### Registration Placeholder (Story 3.2 handoff)

For `showRegistrationPlaceholder === true`, render a placeholder that Story 3.2 will replace with `<RegistrationForm>`:

```astro
{showRegistrationPlaceholder && (
  <div id="registration-form-placeholder">
    {/* TODO Story 3.2: Replace this with:
        <RegistrationForm
          event={event}
          lang={event.language}
          translations={t}
        />
    */}
    <p class="placeholder-text">{t.form.submitButton}</p>
  </div>
)}
{!showRegistrationPlaceholder && (
  <a href="/events">{t.nav.backToEvents}</a>
)}
```

### ⚠️ IMPORTANT Context for Story 3.2 (Registration Form)

The architecture doc describes a simplified form (name, email, employer → POST /api/register). The **actual** `events.livingit.se` form is far more complex:

**Form fields:**
- `referralCode` (required) — validated first via `GET /api/events/public/{eventId}/{referralCode}`
- `firstName` + `lastName` (required) — NOT a single "name" field
- `email` (required)
- `company` (required) — NOT "employer"
- `claimedSeatCount` (1 to `event.maxTicketSeatCount`, with +/- controls or dropdown)
- `foodChoiceOptionId` (conditional: if `event.foodOptions` exists)
- `foodChoiceAllergies` (conditional textarea)
- `termsAccepted` (conditional checkbox: if `event.termsUrl` or `event.privacyUrl`)

**Two-step registration flow:**
1. Visitor enters `referralCode` → `GET /api/events/public/{eventId}/{referralCode}` validates it; returns `{ maxSeatCount: number }`
2. Visitor fills rest of form → `POST /api/events/public/{eventId}/{referralCode}` with JSON body

**For paid events:** separate "Buy ticket" flow → `POST /api/events/public/{eventId}/orders` → returns `{ checkoutUrl }` → redirect to Stripe

**Response `nextStep`:** `'NeedToConfirmEmailAddress'` | `'ExpectConfirmationEmail'` | `'FailedToSendEmail'` — drives success message copy

**Sold-out queue:** `isSoldOut` still shows the full form; button reads `t.form.joinQueue` instead of `t.form.submitButton`

**Almost sold out:** Shows `t.messages.fewTicketsLeft` warning below the form when `isAlmostSoldOut && !isSoldOut`

**`?ticketid=XXX` URL param:** Pre-fills the referral code field and auto-validates on mount

**Cloudflare Turnstile CAPTCHA:** Embedded in registration form (`data-sitekey="0x4AAAAAAAxEPDEDZFCyjeIx"`)

All `src/i18n/sv.ts` and `en.ts` already have keys for this — `form.labelReferralCode`, `form.validateCode`, `form.joinQueue`, `form.haveCode`, etc.

### i18n Keys for This Story (All Exist — Do NOT Add)

| Key | Usage |
|-----|-------|
| `t.common.goToHome` | fixed back button aria-label |
| `t.common.eventPromotion` | hero image alt text |
| `t.common.timeAndLocation` | section heading |
| `t.price.sek` | price currency label |
| `t.price.includingVat` | VAT label (has `{{percentage}}` placeholder) |
| `t.event.statusUpcoming/Past/Full` | EventStatusBadge |
| `t.nav.backToEvents` | back link for past events |
| `t.event.notFound` | 404 error state |
| `t.error.somethingWentWrong` | 500 error state |
| `t.form.submitButton` | registration placeholder text |

### EventStatusBadge Usage

```typescript
interface Props {
  status: EventStatus;             // 'upcoming' | 'past' | 'full'
  translations: Translations['event'];  // pass t.event
}
```

```astro
<EventStatusBadge status={status} translations={t.event} />
```

### Tailwind CSS 4 Token Rules

- No `tailwind.config.js` — tokens in `src/styles/globals.css` via `@theme`
- Use design tokens: `text-mono-black`, `text-mono-dark`, `text-mono-gray`, `bg-[var(--color-bg-card)]`
- Never hardcoded hex values

Note: the living.se Tailwind design system differs from the events.livingit.se CSS variables. Use the Tailwind tokens from the existing site, not the `--dark-bg-color` etc. variables from the SvelteKit site.

### Build Command

```bash
npm run build  # node scripts/copy-robots.mjs && astro build
```

Verify passes with zero TypeScript errors.

### Previous Story Intelligence

- **`apiFetch`** — server-only, attaches `X-Api-Key` header; import from `../../lib/api`; never raw `fetch()`
- **`ApiEvent`** — in `src/types/api.ts`; uses `eventId`, `startDateTime`, `endDateTime`, `isActive`, `isSoldOut` — not `slug`/`date`/`status`
- **`output: 'hybrid'` removed** — SSR is `export const prerender = false` only
- **No test suite** — verification is `npm run build` + visual check
- **`events.astro` uses try/catch** around apiFetch — deviation from architecture; do NOT copy

### Cross-Story Context

- **Story 3.2 (next)**: Implements `RegistrationForm.astro` — replace the `#registration-form-placeholder` with the component. See "IMPORTANT Context for Story 3.2" above.
- **Story 3.3**: Implements `src/pages/api/register.ts` API route to proxy to backend. Note: the SvelteKit site posts directly to the backend without a proxy; the Astro version adds a BFF proxy layer with `API_SECRET_KEY`.
- **Story 3.4**: Adds `/events/[slug]/confirmation.astro` — do NOT create the `[slug]/` subdirectory in this story.

### References

- **Existing implementation to match:** `C:\Projects\GitHub\LivingIT\events.livingit.se\src\routes\events\[eventId]\+page.svelte`
- **SvelteKit form component:** `C:\Projects\GitHub\LivingIT\events.livingit.se\src\lib\components\EventForms.svelte`
- **API client:** `src/lib/api.ts`
- **API types:** `src/types/api.ts`
- **i18n:** `src/i18n/sv.ts`, `src/i18n/en.ts`, `src/i18n/index.ts`
- **EventStatusBadge:** `src/components/EventStatusBadge.astro`
- **Layout:** `src/components/Layout.astro`
- **SSR error pattern:** `_bmad-output/planning-artifacts/architecture.md` — "Process Patterns: SSR Page Error Handling"
- **Previous story:** `_bmad-output/implementation-artifacts/2-2-build-the-upcoming-events-listing-page.md`

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

### Completion Notes List

- Created `src/pages/events/[slug].astro` as a single SSR page (`prerender = false`).
- `slug` param maps to `eventId`; fetches from `GET /api/events/public/${slug}` via `apiFetch`.
- Error states: 404 → `Astro.response.status = 404` + t.event.notFound; non-404 → status 500 + t.error.somethingWentWrong. No try/catch — uses `response.ok`.
- Status computation: `isSoldOut ? 'full' : isActive ? 'upcoming' : 'past'`. `showRegistrationPlaceholder = event.isActive` (sold-out events still show placeholder for queue mode per AC #4).
- `formatDate` helper renders locale-aware date/time ranges; one-day events show end time only.
- Two-column layout (flex 2 / flex 1): event info left, registration placeholder / back link right. Collapses to single column on mobile.
- `set:html` used for both `event.description` and `event.agenda` (HTML strings from API).
- `EventStatusBadge` rendered with correct status and `t.event` translations.
- Tailwind design tokens used via CSS variables in `<style>` block; no hardcoded hex values.
- `npm run build` passed with zero TypeScript errors.

### File List

- `src/pages/events/[slug].astro` (created)

## Change Log

- 2026-03-28: Created `src/pages/events/[slug].astro` — SSR event detail page with state-aware display, error handling (404/500), two-column layout, locale-aware date formatting, and registration placeholder. Build passes with zero TypeScript errors.
- 2026-03-30: Added neutral `.btn-back` button above "Tid och plats" heading in left column (links to `/events`, uses new `t.nav.back` i18n key). Added `t.nav.back` (`'Back'` / `'Tillbaka'`) to `src/i18n/en.ts` and `src/i18n/sv.ts`. Fixed `ticketId` URL param to be accepted case-insensitively (`ticketid` or `ticketId`).
