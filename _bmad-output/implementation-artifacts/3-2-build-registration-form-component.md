# Story 3.2: Build Registration Form Component

Status: review

## Story

As a **visitor**,
I want a registration form on the event detail page,
So that I can register for an upcoming event exactly as on events.livingit.se.

## Acceptance Criteria

### Two-Step Free Event Flow
1. **Given** I am on an active event detail page, **When** the page loads, **Then** the registration column shows a referral code input with a "Validate code" button.
2. **Given** I enter a valid referral code and submit, **When** `/api/validate-ticket` returns `{ maxSeatCount }`, **Then** the full registration form appears with the code pre-filled (read-only) and seat controls calibrated to `maxSeatCount`.
3. **Given** I enter an invalid referral code, **When** validation fails, **Then** an inline error is shown and the registration form remains hidden.
4. **Given** the referral code input loses focus with a non-empty value, **When** auto-blur triggers, **Then** validation fires automatically without needing to click the button.
5. **Given** `?ticketid=XXX` (or `?ticketId=XXX`) is present in the URL, **When** the page loads, **Then** the referral code field is pre-filled with the value and auto-validated on mount. Both `ticketid` and `ticketId` casing are accepted server-side.

### Paid Event Flow (`event.price.ticketPrice > 0`)
6. **Given** I am on a paid event detail page, **When** the form loads, **Then** two buttons are shown: `t.form.buyTicket` (primary/orange, stands out) and `t.form.haveCode` (secondary/neutral).
7. **Given** I click `t.form.buyTicket`, **When** the purchase form appears, **Then** it contains: email field, seat count with +/- controls, optional `termsAccepted` checkbox (if `event.termsUrl || event.privacyUrl`), and an invoice `<details>` element.
8. **Given** I submit the purchase form, **When** `/api/purchase` returns `{ checkoutUrl }`, **Then** `window.location.href` is set to `checkoutUrl` (Stripe redirect).

### Registration Form Fields
9. **Given** the code is validated, **When** I view the registration form, **Then** it contains:
   - `referralCode` (readonly, pre-filled — NOT an editable field)
   - `firstName` (required) — NOT a single "name" field
   - `lastName` (required)
   - `email` (required)
   - `company` (optional) — NOT "employer"; sends empty string to API if not filled
   - `claimedSeatCount`: `=== 1` → hidden input + show "1"; `2–6` → dropdown; `>= 7` → +/- controls
   - `foodChoiceOptionId` select (only if `event.foodOptions !== undefined`)
   - `foodChoiceAllergies` textarea (only if `event.foodOptions.acceptAllergies`)
   - `termsAccepted` checkbox with HTML links (only if `event.termsUrl || event.privacyUrl`)
   - Cloudflare Turnstile widget div
10. **Given** the event is sold out (`isSoldOut`), **When** viewing the form, **Then** submit button reads `t.form.joinQueue` instead of `t.form.submitButton`.
11. **Given** the event is almost sold out (`isAlmostSoldOut && !isSoldOut`), **When** viewing the form, **Then** `t.messages.fewTicketsLeft` warning is shown below the form.
12. **Given** the event is sold out, **When** viewing the form, **Then** `t.messages.soldOutMessage` info text is shown below the form.
13. **Given** registration succeeds, **When** the API returns `{ nextStep }`, **Then** the form is replaced by a success message:
    - If `isSoldOut` → `t.messages.queueSuccessLine1` + `t.messages.queueSuccessLine2`
    - Else if `nextStep === 'NeedToConfirmEmailAddress'` → `t.messages.registrationNeedToConfirmLine1` + `registrationNeedToConfirmLine2`
    - Else if `nextStep === 'ExpectConfirmationEmail'` → `t.messages.registrationConfirmationLine1` + `registrationConfirmationLine2`
    - Else if `nextStep === 'FailedToSendEmail'` → `t.messages.registrationFailedLine1` + `registrationFailedLine2`
14. **Given** registration fails, **When** the API returns an error, **Then** an error message is shown above the form (form remains visible and submittable).

### General
15. **And** all strings use the passed `translations` prop — zero hardcoded Swedish or English text.
16. **And** all labels are programmatically associated with inputs via matching `id`/`for` attributes (WCAG 2.1 AA).
17. **And** the form is operable via keyboard (Tab, Enter, Space).
18. **And** colour contrast meets WCAG 2.1 AA (4.5:1 text, 3:1 UI components).

## Tasks / Subtasks

- [x] Create `src/components/RegistrationForm.astro`
  - [x] Props interface: `event: ApiEvent`, `lang: SupportedLanguage`, `translations: Translations`, `ticketId?: string`
  - [x] Frontmatter: compute `hasPrice`, `hasFoodOptions`, `hasTerms`, build `termsHtml` string
  - [x] Render all state sections as `<div data-state="...">` (all initially hidden except the correct starting state)
  - [x] Section `paid-initial`: two buttons (buy / have code) — only for `hasPrice`
  - [x] Section `code-input`: referral code input + validate button + back button (for paid events)
  - [x] Section `registration`: full form (see AC #9) + Turnstile div + submit button + conditional warnings
  - [x] Section `purchase`: email, seatCount +/-, terms, submit + invoice `<details>` — only for `hasPrice`
  - [x] Section `success`: all success message variants, shown/hidden by JS based on `nextStep`
  - [x] Inline `<script>`: state machine, code validation, seat +/-, form submit handlers
  - [x] Auto-blur validation on referral code field
  - [x] Auto-validate on mount if `ticketId` is set
  - [x] Disable/re-enable submit buttons during submission (`isSubmitting`)
  - [x] `<style>` block with form-specific styles (field layout, labels, error text, buttons)
- [x] Update `src/pages/events/[slug].astro`
  - [x] Import `RegistrationForm` from `../../components/RegistrationForm.astro`
  - [x] Read `const ticketId = Astro.url.searchParams.get('ticketid') ?? undefined`
  - [x] Replace `#registration-form-placeholder` div with `<RegistrationForm>` component
  - [x] Conditional: active event → `<RegistrationForm>`, past/error → `<a href="/events">`
- [x] Create `src/pages/api/validate-ticket.ts` (POST, proxies to backend GET)
- [x] Update `ApiRegistrationRequest` in `src/types/api.ts` to match actual payload shape
- [x] Verify `npm run build` passes with zero TypeScript errors

## Dev Notes

### ⚠️ Architecture Doc Override

The architecture doc describes a simplified form (`name`, `email`, `employer`). The **user has directed the new implementation to behave the same as `events.livingit.se`**. The real implementation (confirmed via `EventForms.svelte`) is significantly more complex. The following guidance overrides the architecture doc for this story.

### Component Props

```typescript
interface Props {
  event: ApiEvent;
  lang: SupportedLanguage;
  translations: Translations;
  ticketId?: string;   // from ?ticketid=XXX URL param — passed from [slug].astro
}
```

Usage in `[slug].astro`:
```astro
---
import RegistrationForm from '../../components/RegistrationForm.astro';
// add after existing frontmatter:
const ticketId = Astro.url.searchParams.get('ticketid') ?? undefined;
---

<!-- Replace reservation div contents: -->
<div class="reservation">
  {showRegistrationPlaceholder ? (
    <RegistrationForm
      event={event}
      lang={event.language}
      translations={t}
      ticketId={ticketId}
    />
  ) : (
    <a href="/events" class="back-link">{t.nav.backToEvents}</a>
  )}
</div>
```

### Passing Event Data to Client JavaScript

Since Astro components are server-rendered, pass event data to the inline `<script>` via data attributes:

```astro
<div
  id="registration-form"
  data-event-id={event.eventId}
  data-is-sold-out={String(event.isSoldOut)}
  data-is-almost-sold-out={String(event.isAlmostSoldOut)}
  data-has-price={String(hasPrice)}
  data-max-seat-count={String(event.maxTicketSeatCount)}
  data-default-seat-count={String(event.defaultTicketSeatCount)}
  data-ticket-id={ticketId ?? ''}
>
  <!-- state sections here -->
</div>
```

### API Routes Used by This Component

| Client call | Astro route | Backend API |
|---|---|---|
| `POST /api/validate-ticket` | `src/pages/api/validate-ticket.ts` (**create this story**) | `GET /api/events/public/{eventId}/{referralCode}` |
| `POST /api/register` | `src/pages/api/register.ts` (Story 3.3) | `POST /api/events/public/{eventId}/{referralCode}` |
| `POST /api/purchase` | `src/pages/api/purchase.ts` (Story 3.3 — **expand scope**) | `POST /api/events/public/{eventId}/orders` |

**Story 3.3 must be expanded** to include `/api/purchase` in addition to `/api/register`.

### `/api/validate-ticket.ts` (Create This Story)

```typescript
import type { APIRoute } from 'astro';
import { apiFetch } from '../../lib/api';

export const POST: APIRoute = async ({ request }) => {
  const { eventId, referralCode } = await request.json() as { eventId: string; referralCode: string };

  const response = await apiFetch(
    `/api/events/public/${encodeURIComponent(eventId)}/${encodeURIComponent(referralCode)}`
  );

  if (response.ok) {
    const data = await response.json() as { maxSeatCount: number };
    return new Response(JSON.stringify({ maxSeatCount: data.maxSeatCount }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ error: true }), {
    status: response.status === 404 ? 404 : 502,
    headers: { 'Content-Type': 'application/json' },
  });
};
```

### Registration Payload (Client → `/api/register`)

The form JS sends this JSON body to the Astro BFF route:

```typescript
{
  eventId: string;           // from data-event-id
  referralCode: string;      // from readonly field value
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  claimedSeatCount: number;
  foodChoiceOptionId?: string;     // only if event.foodOptions exists and selected
  foodChoiceAllergies?: string;    // only if event.foodOptions.acceptAllergies
  termsAccepted?: boolean;         // only if event.termsUrl || event.privacyUrl
}
```

Story 3.3 (`/api/register`) transforms and proxies to the backend:
- Backend URL: `POST /api/events/public/{eventId}/{referralCode}`
- `foodChoice` nesting: `{ optionId: foodChoiceOptionId, allergies: foodChoiceAllergies }`
- `termsAccepted` → `hasAcceptedAllTerms`
- Backend response: `{ nextStep: 'NeedToConfirmEmailAddress' | 'ExpectConfirmationEmail' | 'FailedToSendEmail' }`

### Purchase Payload (Client → `/api/purchase`)

```typescript
// Client sends to /api/purchase:
{ eventId, email, seatCount, termsAccepted? }

// Story 3.3 proxies to: POST /api/events/public/{eventId}/orders
// Body: { email, seatCount, hasAcceptedAllTerms? }
// Backend response: { checkoutUrl: string }
// JS action: window.location.href = checkoutUrl
```

### Client-Side State Machine

All state is managed in an inline `<script>` block. Example skeleton:

```javascript
const wrapper = document.getElementById('registration-form');
const eventId = wrapper.dataset.eventId;
const isSoldOut = wrapper.dataset.isSoldOut === 'true';
const isAlmostSoldOut = wrapper.dataset.isAlmostSoldOut === 'true';
const hasPrice = wrapper.dataset.hasPrice === 'true';
const defaultSeatCount = parseInt(wrapper.dataset.defaultSeatCount, 10);
const ticketId = wrapper.dataset.ticketId;

let maxSeatCount = 0;
let isSubmitting = false;

function showSection(name) {
  wrapper.querySelectorAll('[data-state]').forEach(el => { el.hidden = true; });
  const target = wrapper.querySelector(`[data-state="${name}"]`);
  if (target) target.hidden = false;
}

// Initial state
showSection(hasPrice ? 'paid-initial' : 'code-input');

// Auto-validate if ticketId from URL
if (ticketId) {
  const codeInput = document.getElementById('referralCode');
  if (codeInput) codeInput.value = ticketId;
  showSection('code-input');
  // Call validateCode() after DOM ready
  validateCode();
}

async function validateCode() {
  if (isSubmitting) return;
  const codeInput = document.getElementById('referralCode');
  const code = codeInput?.value?.trim();
  if (!code) return;
  isSubmitting = true;
  // disable submit, show validating state
  try {
    const res = await fetch('/api/validate-ticket', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId, referralCode: code }),
    });
    if (res.ok) {
      const data = await res.json();
      maxSeatCount = data.maxSeatCount;
      // pre-fill readonly referralCode in registration form
      document.getElementById('regReferralCode').value = code;
      updateSeatCountUI(maxSeatCount);
      showSection('registration');
    } else {
      // show inline error on code-input section
    }
  } finally {
    isSubmitting = false;
  }
}
```

### Seat Count UI Logic

The seat count control depends on `maxSeatCount` returned from validation. Render all three variants and show the correct one in JS:

| `maxSeatCount` | Show |
|---|---|
| `=== 1` | hidden input + static "1" text |
| `2–6` | `<select>` with options 1..maxSeatCount |
| `>= 7` (or default) | `<button>-</button>` `<input type="number">` `<button>+</button>` |

Function `updateSeatCountUI(max)` runs after validation to show the right variant and set min/max bounds.

### Success Messages: Render All Variants Server-Side

The success section must contain all four message variants in HTML, all hidden initially. JS shows the correct one after API response by reading `nextStep`:

```astro
<div data-state="success" hidden>
  <div data-success-variant="queue" hidden>
    <p>{t.messages.queueSuccessLine1}</p>
    <p>{t.messages.queueSuccessLine2}</p>
  </div>
  <div data-success-variant="need-to-confirm" hidden>
    <p>{t.messages.registrationNeedToConfirmLine1}</p>
    <p>{t.messages.registrationNeedToConfirmLine2}</p>
  </div>
  <div data-success-variant="expect-confirmation" hidden>
    <p>{t.messages.registrationConfirmationLine1}</p>
    <p>{t.messages.registrationConfirmationLine2}</p>
  </div>
  <div data-success-variant="failed-email" hidden>
    <p>{t.messages.registrationFailedLine1}</p>
    <p>{t.messages.registrationFailedLine2}</p>
  </div>
</div>
```

JS after success:
```javascript
function showSuccess(nextStep, isSoldOut) {
  const variant = isSoldOut ? 'queue'
    : nextStep === 'NeedToConfirmEmailAddress' ? 'need-to-confirm'
    : nextStep === 'ExpectConfirmationEmail' ? 'expect-confirmation'
    : 'failed-email';
  wrapper.querySelectorAll('[data-success-variant]').forEach(el => { el.hidden = true; });
  wrapper.querySelector(`[data-success-variant="${variant}"]`).hidden = false;
  showSection('success');
}
```

### Terms / Privacy Checkbox — Build HTML in Frontmatter

`t.terms.acceptBoth`, `t.terms.acceptTerms`, `t.terms.acceptPrivacy` use `{{terms}}` / `{{privacy}}` placeholder syntax (not template literals — replace manually):

```typescript
// In frontmatter:
let termsHtml = '';
if (event.termsUrl && event.privacyUrl) {
  const termsLink = `<a href="${event.termsUrl}" target="_blank" rel="noopener noreferrer">${t.terms.termsLink}</a>`;
  const privacyLink = `<a href="${event.privacyUrl}" target="_blank" rel="noopener noreferrer">${t.terms.privacyLink}</a>`;
  termsHtml = t.terms.acceptBoth.replace('{{terms}}', termsLink).replace('{{privacy}}', privacyLink);
} else if (event.termsUrl) {
  const link = `<a href="${event.termsUrl}" target="_blank" rel="noopener noreferrer">${t.terms.termsLink}</a>`;
  termsHtml = t.terms.acceptTerms.replace('{{terms}}', link);
} else if (event.privacyUrl) {
  const link = `<a href="${event.privacyUrl}" target="_blank" rel="noopener noreferrer">${t.terms.privacyLink}</a>`;
  termsHtml = t.terms.acceptPrivacy.replace('{{privacy}}', link);
}
```

Then in the template: `<span class="checkbox-text" set:html={termsHtml} />`

Same pattern applies to `t.price.includingVat` (already handled in `[slug].astro`).

### Cloudflare Turnstile

Include in the component or in `Layout.astro` if not already there:
```html
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
```

Place the widget div inside the registration form (before the submit button):
```html
<div class="cf-turnstile" data-sitekey="0x4AAAAAAAxEPDEDZFCyjeIx" data-theme="light"></div>
```

The Turnstile script auto-inserts a hidden `cf-turnstile-response` field into the form.

> **Code Review Finding (F1):** Since the form uses `e.preventDefault()` + `fetch()` with a manually constructed JSON payload (not native form submission), the auto-inserted hidden input is **not** automatically included in the request. **Story 3.3 must read the Turnstile token** from the form's hidden input (`cf-turnstile-response` or via `turnstile.getResponse()`) and include it in the JSON payload sent to `/api/register` and `/api/purchase`.

### CSS Variables Available in livingit.se (`src/styles/globals.css`)

```
--color-orange: #ff8705         (brand/primary/buttons)
--color-mono-black: #000000
--color-mono-darker: #303132
--color-mono-dark: #414243      (body text)
--color-mono-gray: #757779      (secondary text)
--color-mono-light: #a3a5a8
--color-mono-lighter: #e5e8ec   (borders/dividers)
--color-mono-white: #ffffff
--color-bg-card: #f8f9ff        (card background)
--color-bg-main-default: #f0f1f7
```

**Do NOT use** SvelteKit CSS vars (`--primary-brand-color`, `--dark-bg-color`, `--light-bg-color`, `--dark-text-color`, `--secondary-brand-color`, `--text-danger-color`) — these do not exist in livingit.se. For error text color, use `--color-orange` or a direct value like `#dc2626`.

The `.reservation` container in `[slug].astro` already provides card styling (border, padding, shadow, border-radius). The form just needs to fill that container.

### ⚠️ Update `src/types/api.ts`

`ApiRegistrationRequest` is outdated. Update to the actual payload:

```typescript
export interface ApiRegistrationRequest {
  eventId: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  claimedSeatCount: number;
  foodChoiceOptionId?: string;
  foodChoiceAllergies?: string;
  termsAccepted?: boolean;
}
```

### i18n Keys (All Already Exist — Do NOT Add New Keys)

| Key | Usage |
|---|---|
| `t.form.labelReferralCode` | Referral code label |
| `t.form.labelFirstName` / `t.form.labelLastName` | Name labels |
| `t.form.labelEmail` / `t.form.labelBuyerEmail` | Email labels |
| `t.form.labelEmployer` → **use `t.form.labelEmployer` for display but field name is `company`** | Company label |
| `t.form.labelFoodPreference` / `t.form.labelAllergies` | Food labels |
| `t.form.labelChooseOption` | Food dropdown placeholder |
| `t.form.labelTicketCount` | Seat count label |
| `t.form.submitButton` | Register button text |
| `t.form.joinQueue` | Submit button when `isSoldOut` |
| `t.form.validateCode` | Validate button text |
| `t.form.validating` | Validating state text |
| `t.form.buyTicket` | Buy ticket button |
| `t.form.haveCode` | "I have a code" button |
| `t.form.goToPayment` | Purchase form submit |
| `t.common.cancel` | Cancel/back buttons |
| `t.common.pleaseWait` | Loading state text |
| `t.validation.referralCodeRequired` | Empty referral code error |
| `t.validation.referralCodeBad` | Invalid referral code error |
| `t.validation.termsRequired` | Terms not accepted error |
| `t.messages.fewTicketsLeft` | Almost sold out warning |
| `t.messages.soldOutMessage` | Sold out info text |
| `t.invoice.payByInvoice` | Invoice details summary |
| `t.invoice.minimumTicketsRequired` | Invoice min tickets note (use `{{count}}` placeholder → `.replace('{{count}}', ...)`) |
| `t.invoice.contactForInvoice` | Invoice contact note (use `{{email}}` placeholder) |
| `t.terms.acceptBoth` / `t.terms.acceptTerms` / `t.terms.acceptPrivacy` | Terms checkbox text |
| `t.terms.termsLink` / `t.terms.privacyLink` | Link anchor texts |
| All `t.messages.*Success*` / `*Confirmation*` / `*Failed*` | Success state messages |

**Note:** `t.form.labelEmployer` is the i18n label but the actual HTML `name` attribute must be `company` (to match backend field). See `EventForms.svelte` line 449: `id="company" name="company"` with label `$t('form.company')`. In the Astro i18n, the matching key is `t.form.labelEmployer`.

### Do NOT

- Use `apiFetch` from `RegistrationForm.astro` — it is server-only (`src/lib/api.ts` throws if called from browser)
- Use `try/catch` around fetch in API routes — use `response.ok` check
- Import `zod` directly — use `import { z } from 'astro/zod'` in API routes
- Create a new `src/pages/api/validate-ticket.ts` pattern with `export const GET` — use `POST` (simpler for JSON body)
- Add a `prerender = false` to `validate-ticket.ts` — API routes under `src/pages/api/` are already SSR in hybrid mode
- Modify `EventCard.astro`, `EventStatusBadge.astro`, `Layout.astro`
- Add new keys to `src/i18n/sv.ts` / `src/i18n/en.ts` — all required keys already exist

### Previous Story Intelligence

- `apiFetch` attaches `X-Api-Key` automatically — use it in all Astro API routes, never raw `fetch()` from server
- `ApiEvent.eventId` is the URL identifier (not `slug`) — pass it as `data-event-id` to client JS
- `ApiEvent` has `isSoldOut`, `isAlmostSoldOut`, `isActive`, `maxTicketSeatCount`, `defaultTicketSeatCount`
- `npm run build` with zero TypeScript errors is the acceptance bar
- No test framework — build verification + visual check

### References

- **SvelteKit form (match this):** `C:\Projects\GitHub\LivingIT\events.livingit.se\src\lib\components\EventForms.svelte`
- **SvelteKit server actions (match this):** `C:\Projects\GitHub\LivingIT\events.livingit.se\src\routes\events\[eventId]\+page.server.ts`
- **SvelteKit schema:** `C:\Projects\GitHub\LivingIT\events.livingit.se\src\lib\schema.ts`
- **Detail page to update:** `src/pages/events/[slug].astro`
- **API types to update:** `src/types/api.ts`
- **i18n keys:** `src/i18n/sv.ts`, `src/i18n/en.ts`
- **API client (server-only):** `src/lib/api.ts`
- **CSS variables:** `src/styles/globals.css`
- **Architecture:** `_bmad-output/planning-artifacts/architecture.md`

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

None — build passed on first attempt with zero TypeScript errors.

### Completion Notes List

- Created `RegistrationForm.astro` with full client-side state machine matching EventForms.svelte behavior.
- Five state sections rendered server-side: `paid-initial`, `code-input`, `registration`, `purchase`, `success`.
- All sections `hidden` in HTML; inline `<script>` shows correct initial section on load (`paid-initial` if hasPrice, else `code-input`).
- Event data passed to client JS via data attributes on wrapper div; i18n error strings also passed as data attributes.
- Three seat-count UI variants (fixed, select, stepper) all rendered; `updateSeatCountUI(max)` shows the correct one after validation.
- Terms HTML built in frontmatter with `{{terms}}`/`{{privacy}}` placeholder replacement.
- Invoice strings (minimumTicketsRequired, contactForInvoice) computed in frontmatter with placeholder replacement.
- Turnstile widget included only in registration section; no token handling needed in frontend.
- All CSS uses livingit.se CSS variables (not SvelteKit vars); `--color-orange` used for error text.
- `ApiRegistrationRequest` updated from simplified (name/email/employer) to full payload matching backend.
- `src/pages/api/validate-ticket.ts` created as POST endpoint proxying to backend GET.
- `[slug].astro` updated: `ticketId` read from URL, `RegistrationForm` replaces placeholder, back-link shown only for non-active events.
- `npm run build` passed with zero TypeScript errors.

### File List

- `src/components/RegistrationForm.astro` (created)
- `src/pages/api/validate-ticket.ts` (created)
- `src/types/api.ts` (modified — ApiRegistrationRequest updated)
- `src/pages/events/[slug].astro` (modified — RegistrationForm integration)

## Change Log

- 2026-03-29: Story created — full two-step registration form matching events.livingit.se EventForms.svelte behavior.
- 2026-03-29: Story implemented — RegistrationForm.astro, validate-ticket API, api.ts update, slug.astro integration. All tasks complete, build passes.
- 2026-03-30: Swapped paid-initial button styles — buy is now primary (orange), "have code" is secondary (neutral). Fixed `?ticketId=` casing (now accepts both `ticketid` and `ticketId`). Made company field optional (no `required` attr; sends empty string).
