# Story 3.6: Build Order Success Page

Status: done

## Story

As a **visitor**,
I want a success page after completing a paid ticket purchase,
so that I know my order was processed and I'll receive my tickets by email.

## Acceptance Criteria

1. **Given** Stripe redirects me to `/events/[slug]/ordersuccess`, **When** the page loads, **Then** the page is SSR (`export const prerender = false`) and displays the shared `<Layout>` with site header and footer.
2. **Given** the page loads, **When** event data is fetched, **Then** `GET /api/events/public/{slug}` is called server-side via `apiFetch` and the event's `language` field drives locale via `getTranslations(event.language)`.
3. **Given** the event fetch succeeds, **When** the page renders, **Then** `t.messages.purchaseSuccess` is shown as the heading and `t.messages.purchaseEmailSent` as a body paragraph, both in the event's language.
4. **Given** the page renders, **When** displayed, **Then** a link back to `/events` is shown using `t.nav.backToEvents`.
5. **Given** the API returns 404 or an error, **When** the page renders, **Then** it falls back to Swedish (`getTranslations('sv')`) and still renders gracefully — do not set a 404 status (the order succeeded; the event lookup is cosmetic).
6. **Given** the page, **When** audited, **Then** colour contrast meets WCAG 2.1 AA minimums and all content is keyboard accessible.

## Tasks / Subtasks

- [x] Create `src/pages/events/[slug]/ordersuccess.astro` (AC: #1–#6)
  - [x] `export const prerender = false` at top
  - [x] Import `apiFetch`, `getTranslations`, `Layout`
  - [x] Fetch event via `apiFetch('/api/events/public/${slug}')` in try/catch
  - [x] Resolve locale: `event?.language ?? 'sv'` → `getTranslations(resolvedLang)`
  - [x] Render `<Layout>` wrapping a success card with heading + body + back link
  - [x] Apply CSS matching the confirmation page card style (dark bg, centred)
- [x] Verify `npm run build` passes with zero TypeScript errors

## Dev Notes

### File to Create

`src/pages/events/[slug]/ordersuccess.astro` — **only file needed for this story**.

### Route Pattern

The Stripe `return_url` is `/events/{eventId}/ordersuccess` (set by the backend, no lang segment). The `[slug]` dynamic segment captures the event ID (e.g. `V8L59S`). No lang is in the URL — derive it from the fetched event.

**Do NOT** add a `[lang]` segment to this route. **Do NOT** ask the backend to append lang. Language comes from `event.language`.

### Copy Pattern from `[slug].astro`

`src/pages/events/[slug].astro` is the canonical reference for how to:
- Declare `export const prerender = false`
- Import and call `apiFetch`
- Extract `slug` from `Astro.params`
- Call `getTranslations(event.language)`
- Wrap in `<Layout>`

### Copy Style from `confirm/[lang]/[token].astro`

`src/pages/events/confirm/[lang]/[token].astro` is the canonical reference for the card layout used on post-action pages. Reuse its CSS classes / structure exactly:

```astro
<Layout title={`${t.messages.purchaseSuccess} - Living IT Event`}>
  <main class="confirm-main">
    <div class="confirm-card">
      <div class="confirm-icon" aria-hidden="true">🎉</div>
      <h1 class="confirm-heading">{t.messages.purchaseSuccess}</h1>
      <p class="confirm-body">{t.messages.purchaseEmailSent}</p>
      <a href="/events" class="confirm-link confirm-back">{t.nav.backToEvents}</a>
    </div>
  </main>
</Layout>
```

Copy the `<style>` block verbatim from `confirm/[lang]/[token].astro` — no new design tokens needed.

### i18n Keys (Already Exist)

Both keys exist in `src/i18n/sv.ts` and `src/i18n/en.ts` under the `messages` namespace:

```typescript
// sv.ts
messages.purchaseSuccess  → 'Tack för ditt köp!'
messages.purchaseEmailSent → 'Ni kommer nu att få ett mail med biljetter och vidare instruktioner.'

// en.ts
messages.purchaseSuccess  → 'Thank you for your purchase!'
messages.purchaseEmailSent → 'You will now receive an email with tickets and further instructions.'
```

Also use `t.nav.backToEvents` for the back link (already exists in both locales).

**Do NOT** add new i18n keys — all required strings already exist.

### Frontmatter Structure

```astro
---
export const prerender = false;

import { apiFetch } from '../../../lib/api';
import { getTranslations } from '../../../i18n';
import type { ApiEvent, SupportedLanguage } from '../../../types/api';
import Layout from '../../../components/Layout.astro';

const { slug } = Astro.params as { slug: string };

let event: ApiEvent | null = null;
try {
  const response = await apiFetch(`/api/events/public/${encodeURIComponent(slug)}`);
  if (response.ok) {
    event = await response.json() as ApiEvent;
  }
} catch (err) {
  console.error('[ordersuccess] apiFetch failed:', err);
}

const resolvedLang: SupportedLanguage = event?.language ?? 'sv';
const t = getTranslations(resolvedLang);
---
```

**Do NOT** set `Astro.response.status = 404` even if the event is not found. The order succeeded; the event lookup only determines page language.

### apiFetch Rules

- Always use `apiFetch` from `../../../lib/api` (three levels up from `src/pages/events/[slug]/`)
- Never use raw `fetch()` from server code
- Wrap in `try/catch` — log errors with prefix `[ordersuccess]`

### Do NOT

- Add a `[lang]` URL segment — language comes from event data only
- Modify `RegistrationForm.astro`, `/api/purchase.ts`, or any other existing file
- Add new i18n keys — all needed strings exist
- Set `Astro.response.status = 404` when event lookup fails (graceful fallback only)
- Use `zod` validation — this is a read-only display page, no form submission
- Add a home button SVG — use the standard `<Layout>` header instead (unlike the SvelteKit source which adds a custom home button)

### Previous Story Intelligence

From story 3.4 (confirmation page — most similar pattern):
- Card-style centred layout with `class="confirm-main"` / `confirm-card` / `confirm-heading` etc.
- `<Layout title="...">` wraps all content — title uses a translated string + " - Living IT Event"
- Language derived server-side from `event.language`, not URL params
- `apiFetch` wrapped in try/catch; errors logged with `[prefix]` convention

From story 3.5 (purchase API — immediate predecessor):
- `apiFetch` import path from `src/pages/api/` is `../../lib/api`; from `src/pages/events/[slug]/` it is `../../../lib/api`
- `encodeURIComponent(slug)` when building API URL path segments
- Error logging prefix convention: `[ordersuccess]`

### References

- **Layout reference:** `src/pages/events/[slug].astro` (SSR page pattern, apiFetch, getTranslations)
- **Card style reference:** `src/pages/events/confirm/[lang]/[token].astro` (copy CSS verbatim)
- **i18n keys:** `src/i18n/sv.ts` + `src/i18n/en.ts` (messages.purchaseSuccess, messages.purchaseEmailSent, nav.backToEvents)
- **Types:** `src/types/api.ts` (ApiEvent, SupportedLanguage)
- **SvelteKit source (reference only):** `C:\Projects\GitHub\LivingIT\events.livingit.se\src\routes\events\[eventId]\ordersuccess\+page.svelte`

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

None — straightforward implementation, no issues encountered.

### Completion Notes List

- Created `src/pages/events/[slug]/ordersuccess.astro` as the sole file for this story.
- SSR page (`export const prerender = false`) fetches event via `apiFetch` in try/catch; on error/404 falls back to Swedish — no 404 status set.
- Language resolved from `event?.language ?? 'sv'` → `getTranslations(resolvedLang)`.
- Renders Layout + success card using `t.messages.purchaseSuccess`, `t.messages.purchaseEmailSent`, `t.nav.backToEvents` — all pre-existing i18n keys.
- CSS copied verbatim from `confirm/[lang]/[token].astro` card style.
- `npm run build` passes with zero TypeScript errors.

### File List

- src/pages/events/[slug]/ordersuccess.astro (created)

## Change Log

- 2026-03-30: Story created — Stripe order success page at `/events/[slug]/ordersuccess`, language from event data (no lang in URL).
- 2026-03-30: Implementation complete — ordersuccess.astro created; build passes.
