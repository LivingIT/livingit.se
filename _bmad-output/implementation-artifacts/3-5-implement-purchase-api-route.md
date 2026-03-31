# Story 3.5: Implement Purchase API Route

Status: review

## Story

As a **system**,
I want a server-side API route at `/api/purchase` that validates and proxies paid event order submissions,
so that purchase requests are securely processed and only valid submissions reach the backend Stripe checkout flow.

## Acceptance Criteria

1. **Given** `RegistrationForm.astro` POSTs `{ eventId, email, seatCount, termsAccepted? }` to `/api/purchase`, **When** all fields are valid, **Then** the route proxies to `POST /api/events/public/{eventId}/orders` via `apiFetch` with body `{ email, seatCount, hasAcceptedAllTerms? }`.
2. **Given** the backend responds with `{ checkoutUrl }`, **When** the route forwards this, **Then** it returns HTTP 200 with `{ checkoutUrl: string }` and the client JS does `window.location.href = checkoutUrl`.
3. **Given** `eventId` or `email` is missing/empty, **When** the route validates, **Then** it returns HTTP 400 with `{ error: true }`.
4. **Given** `seatCount` is missing, not an integer, or < 1, **When** the route validates, **Then** it returns HTTP 400 with `{ error: true }`.
5. **Given** `request.json()` throws (malformed body), **When** parsing fails, **Then** the route returns HTTP 400 with `{ error: true }`.
6. **Given** `apiFetch` throws (network error), **When** the backend is unreachable, **Then** the route logs the error and returns HTTP 502 with `{ error: true }`.
7. **Given** the backend returns a 4xx/5xx, **When** the order fails, **Then** the route logs the error and returns an appropriate error response.
8. **Given** `npm run build` is run, **When** compilation completes, **Then** zero TypeScript errors.

## Tasks / Subtasks

- [x] Create `src/pages/api/purchase.ts` (AC: #1–#8)
  - [x] `export const prerender = false` at top
  - [x] Define `interface PurchaseBody` with all optional fields (defensive typing)
  - [x] Define `interface BackendPurchasePayload` with required `email`, `seatCount`, optional `hasAcceptedAllTerms`
  - [x] Parse JSON body in `try/catch` → HTTP 400 on parse failure
  - [x] Validate `eventId` (non-empty string), `email` (non-empty string), `seatCount` (integer ≥ 1) → HTTP 400
  - [x] Build `BackendPurchasePayload`: map `termsAccepted` → `hasAcceptedAllTerms` (only include if present)
  - [x] Call `apiFetch` in `try/catch` → log + HTTP 502 on network error
  - [x] Check `response.ok` → return `{ checkoutUrl }` (HTTP 200) on success
  - [x] On backend error: log status + body, return 502 (or pass through 4xx if client error)
- [x] Verify `npm run build` passes with zero TypeScript errors

## Dev Notes

### File to Create

`src/pages/api/purchase.ts` — **only file needed for this story**.

### Follow `register.ts` Pattern Exactly

`src/pages/api/register.ts` is the canonical reference. Copy the same structure:

```typescript
import type { APIRoute } from 'astro';
import { apiFetch } from '../../lib/api';

export const prerender = false;

interface PurchaseBody {
  eventId?: string;
  email?: string;
  seatCount?: number;
  termsAccepted?: boolean;
}

interface BackendPurchasePayload {
  email: string;
  seatCount: number;
  hasAcceptedAllTerms?: boolean;
}

export const POST: APIRoute = async ({ request }) => {
  let body: PurchaseBody;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: true }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { eventId, email, seatCount } = body;

  if (!eventId || !email) {
    return new Response(JSON.stringify({ error: true }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const seats = seatCount ?? 0;
  if (!Number.isInteger(seats) || seats < 1 || seats > 100) {
    return new Response(JSON.stringify({ error: true }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const payload: BackendPurchasePayload = { email, seatCount: seats };
  if (body.termsAccepted !== undefined) {
    payload.hasAcceptedAllTerms = body.termsAccepted;
  }

  let response: Response;
  try {
    response = await apiFetch(
      `/api/events/public/${encodeURIComponent(eventId)}/orders`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );
  } catch (err) {
    console.error('[purchase] apiFetch failed:', err);
    return new Response(JSON.stringify({ error: true }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (response.ok) {
    const data = await response.json() as { checkoutUrl: string };
    return new Response(JSON.stringify({ checkoutUrl: data.checkoutUrl }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const errorBody = await response.text().catch(() => '');
  console.error(`[purchase] backend error ${response.status}:`, errorBody);
  return new Response(JSON.stringify({ error: true }), {
    status: response.status >= 400 && response.status < 500 ? response.status : 502,
    headers: { 'Content-Type': 'application/json' },
  });
};
```

### Client → `/api/purchase` Payload

Sent by `RegistrationForm.astro` purchase form submit handler (`src/components/RegistrationForm.astro` ~line 787):

```typescript
{
  eventId: string;          // from wrapper.dataset.eventId
  email: string;            // #purEmail input value
  seatCount: number;        // currentPurSeatCount JS variable (stepper)
  termsAccepted?: boolean;  // #purTermsAccepted checkbox (only if hasTerms)
}
```

### Backend Endpoint

`POST /api/events/public/{eventId}/orders` (via `apiFetch`)

Payload to backend: `{ email, seatCount, hasAcceptedAllTerms? }`

Success response from backend: `{ checkoutUrl: string }`

Client action on success: `window.location.href = data.checkoutUrl` (Stripe hosted checkout redirect)

### `apiFetch` Rules

- **Always use `apiFetch`** from `../../lib/api` — never raw `fetch()` from server code
- `apiFetch` attaches `X-Api-Key` header automatically from Cloudflare secret `API_SECRET_KEY`
- `apiFetch` is server-only — throws if called from browser context

### Error Handling Pattern

- `try/catch` around `request.json()` → HTTP 400 (malformed JSON)
- Field validation → HTTP 400 (missing/invalid fields)
- `try/catch` around `apiFetch` → HTTP 502 (network error, log it)
- `response.ok` check → pass through status (4xx from backend) or map to 502 (5xx)
- **Never** use `try/catch` to detect HTTP 4xx/5xx responses — that's what `response.ok` is for

### Turnstile Note

The Turnstile widget (`div.cf-turnstile`) is in the `registration` section only (referral-code flow), not in the `purchase` section. The purchase form payload does **not** include a Turnstile token. Do **not** add Turnstile validation to `/api/purchase`.

### Do NOT

- Add `src/types/api.ts` changes — not required for this story
- Modify `RegistrationForm.astro` — already calls `/api/purchase` correctly
- Use `zod` / `astro/zod` validation — the simple field checks in `register.ts` are the established pattern
- Add `prerender = false` via a different mechanism — inline `export const prerender = false` is correct
- Use raw `fetch()` — always `apiFetch`

### Previous Story Intelligence

From `register.ts` and `validate-ticket.ts` (established patterns):
- `export const prerender = false` explicitly declared in API routes (even though all `src/pages/api/` are SSR in hybrid mode)
- All interfaces defined inline in the route file — no shared type imports needed for API routes
- Error logging uses prefix `[purchase]` (match `[register]` / `[validate-ticket]` convention)
- `seatCount` validation mirrors `claimedSeatCount` in `register.ts`: `Number.isInteger(n) && n >= 1 && n <= 100`
- `response.text().catch(() => '')` pattern used for logging backend error bodies

### References

- **Reference implementation (copy pattern):** `src/pages/api/register.ts`
- **Client caller (how payload is built):** `src/components/RegistrationForm.astro` ~line 773–830
- **Backend order endpoint (SvelteKit source):** `C:\Projects\GitHub\LivingIT\events.livingit.se\src\routes\events\[eventId]\+page.server.ts` (purchase action, line 219–286)
- **apiFetch:** `src/lib/api.ts`
- **API types (read-only reference):** `src/types/api.ts`

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

### Completion Notes List

- Created `src/pages/api/purchase.ts` following the `register.ts` pattern exactly.
- Validates `eventId` (non-empty string), `email` (non-empty string), `seatCount` (integer 1–100).
- Maps `termsAccepted` → `hasAcceptedAllTerms` only when present.
- Proxies to `POST /api/events/public/{eventId}/orders` via `apiFetch`.
- Returns `{ checkoutUrl }` on success (HTTP 200), `{ error: true }` on parse failure (400), validation failure (400), network error (502), or backend error (pass-through 4xx / 502 for 5xx).
- `npm run build` completed with zero TypeScript errors.

### File List

- src/pages/api/purchase.ts (created)

## Change Log

- 2026-03-30: Created `/api/purchase` route — proxies paid event order submissions to backend, validates fields, returns `{ checkoutUrl }` on success. Build passes with zero TypeScript errors.
