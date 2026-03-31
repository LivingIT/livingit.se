# Story 3.8: Implement Cloudflare Turnstile Token Verification

Status: review

## Story

As a **site owner**,
I want Cloudflare Turnstile tokens to be verified server-side on every registration submission,
so that automated bots cannot submit the registration form.

## Background

The Turnstile widget is already rendered in `RegistrationForm.astro` (line 256) and the `.env` file already contains both keys. The widget is cosmetically functional — it challenges users and injects a one-time token into a hidden input (`cf-turnstile-response`). However, the registration form uses `e.preventDefault()` + `fetch()` with a manually-constructed JSON payload, so the auto-injected hidden input is **never read** and **never sent** to the server. The server does **no verification** at all.

This was flagged as **Finding F1** in the story 3.2 implementation artifact and explicitly deferred.

**Scope boundary:** Turnstile applies to `/api/register` only. The purchase form (`/api/purchase`) explicitly does **not** get Turnstile (decision in story 3.5 artifact line 170).

## Acceptance Criteria

1. **Given** a visitor completes the registration form, **When** they click submit, **Then** the frontend reads the Turnstile token from the widget and includes it as `turnstileToken` in the JSON payload sent to `/api/register`.
2. **Given** a POST to `/api/register` with a valid `turnstileToken`, **When** the server verifies it with Cloudflare's siteverify API, **Then** the registration proceeds normally.
3. **Given** a POST to `/api/register` with a missing or empty `turnstileToken`, **When** validation runs, **Then** the server returns 400 and no registration is forwarded to the backend.
4. **Given** a POST to `/api/register` with an invalid/expired `turnstileToken`, **When** Cloudflare siteverify returns `success: false`, **Then** the server returns 400 and no registration is forwarded to the backend.
5. **Given** Cloudflare's siteverify endpoint is unreachable, **When** the fetch throws, **Then** the server returns 502 (consistent with existing error handling pattern).
6. **Given** the test environment with test keys, **When** the form is submitted normally, **Then** the challenge always passes (test key `1x00000000000000000000AA` always succeeds).

## Tasks / Subtasks

- [x] **Frontend — RegistrationForm.astro**: Read Turnstile token and include in registration payload (AC: #1)
  - [x] In the submit handler for `registration-form-submit`, read the token: `document.querySelector('input[name="cf-turnstile-response"]') as HTMLInputElement | null`
  - [x] Add `turnstileToken: string` to `RegPayload` interface
  - [x] Assign `payload.turnstileToken = tokenEl?.value ?? ''` before the fetch call
- [x] **Backend — /api/register.ts**: Verify token with Cloudflare siteverify before proxying (AC: #2–#5)
  - [x] Add `turnstileToken?: string` to `RegisterBody` interface
  - [x] After body parsing and before field validation, extract `turnstileToken`
  - [x] If `turnstileToken` is missing/empty, return 400
  - [x] Call Cloudflare siteverify with `TURNSTILE_SECRET_KEY` and the token
  - [x] If `success: false`, return 400
  - [x] If siteverify fetch throws, return 502
- [x] Verify `npm run build` passes with zero TypeScript errors

## Dev Notes

### Environment Variables (already set)

Both keys exist in `.env` and are ready:

```
PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA   ← test key, already used in widget
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA  ← test key, server-only
```

The `TURNSTILE_SECRET_KEY` has no `PUBLIC_` prefix — it is server-only and must never be exposed to the browser. Pattern matches `API_SECRET_KEY` in this project.

**Cloudflare Pages dashboard:** `TURNSTILE_SECRET_KEY` must be set as a secret in the dashboard for production (same pattern as `API_SECRET_KEY`). This is out of scope for this story (infra task), but note it in completion notes.

### Frontend Change — RegistrationForm.astro

The Turnstile widget div is at line 256. When the SDK loads, it auto-injects a hidden `<input name="cf-turnstile-response">` as a sibling/child of the widget container. Since the submit handler uses `e.preventDefault()` + manual JSON payload, we must read this input explicitly.

**In the submit handler (around line 680), extend `RegPayload`:**

```typescript
interface RegPayload {
  eventId: string;
  referralCode: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  claimedSeatCount: number;
  foodChoiceOptionId?: string;
  foodChoiceAllergies?: string;
  termsAccepted?: boolean;
  turnstileToken: string;  // ← ADD THIS
}
```

**Build the payload (after existing assignments, before the fetch call):**

```typescript
const turnstileInput = document.querySelector('input[name="cf-turnstile-response"]') as HTMLInputElement | null;
const payload: RegPayload = {
  // ... existing fields ...
  turnstileToken: turnstileInput?.value ?? '',
};
```

Do NOT use `window.turnstile.getResponse()` — it requires the Turnstile global to be loaded and is unnecessary when the input is available in the DOM.

### Backend Change — /api/register.ts

**Extend `RegisterBody`:**

```typescript
interface RegisterBody {
  // ... existing fields ...
  turnstileToken?: string;
}
```

**Add verification after body parsing, before field validation:**

```typescript
const { eventId, referralCode, firstName, lastName, email, company, claimedSeatCount, turnstileToken } = body;

// Verify Turnstile token
if (!turnstileToken) {
  return new Response(JSON.stringify({ error: true }), {
    status: 400,
    headers: { 'Content-Type': 'application/json' },
  });
}

const formData = new FormData();
formData.append('secret', import.meta.env.TURNSTILE_SECRET_KEY);
formData.append('response', turnstileToken);

let turnstileOk: boolean;
try {
  const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: formData,
  });
  const outcome = await verifyRes.json() as { success: boolean };
  turnstileOk = outcome.success === true;
} catch (err) {
  console.error('[register] Turnstile verification fetch failed:', err);
  return new Response(JSON.stringify({ error: true }), {
    status: 502,
    headers: { 'Content-Type': 'application/json' },
  });
}

if (!turnstileOk) {
  return new Response(JSON.stringify({ error: true }), {
    status: 400,
    headers: { 'Content-Type': 'application/json' },
  });
}

// Continue with existing field validation...
```

### Cloudflare Turnstile siteverify API

- **Endpoint:** `https://challenges.cloudflare.com/turnstile/v0/siteverify`
- **Method:** POST
- **Body:** `FormData` with fields `secret` (TURNSTILE_SECRET_KEY) and `response` (the token)
- **Response shape:**
  ```json
  {
    "success": true,
    "challenge_ts": "2026-03-31T10:00:00.000Z",
    "hostname": "livingit.se",
    "error-codes": []
  }
  ```
- **Token is single-use and expires after ~5 minutes** — never cache or reuse it
- **Test secret key** `1x0000000000000000000000000000000AA` always returns `success: true` for any token (safe for dev/test)

### Files to Touch

| File | Change |
|------|--------|
| `src/components/RegistrationForm.astro` | Read `cf-turnstile-response` input; add `turnstileToken` to payload |
| `src/pages/api/register.ts` | Add `turnstileToken` to `RegisterBody`; call siteverify before proxying |

**Do NOT touch:**
- `src/pages/api/purchase.ts` — explicitly no Turnstile on purchase flow
- `src/pages/api/validate-ticket.ts` — unrelated
- `wrangler.toml` — secrets are set via Cloudflare dashboard, not in vars

### No UI Change Required

The Turnstile widget already renders. No new visual elements, no i18n changes, no CSS changes. The `msgSomethingWentWrong` i18n key already exists and is used by the existing error display block — it will correctly surface to the user if Turnstile verification fails and the server returns 400.

### TypeScript: `import.meta.env.TURNSTILE_SECRET_KEY`

This project has no `src/env.d.ts`. Astro infers env vars from usage. If TypeScript complains about `TURNSTILE_SECRET_KEY` not existing on `ImportMeta`, cast with `(import.meta.env as Record<string, string>).TURNSTILE_SECRET_KEY` or add a minimal `env.d.ts`. Check if `API_SECRET_KEY` has the same issue in `src/lib/api.ts` and match that pattern.

### Previous Story Intelligence

From story 3.2 (RegistrationForm build):
- All API calls from the form use `e.preventDefault()` + `fetch()` with JSON body — the auto-injected Turnstile hidden input is never picked up by native form submission
- This is exactly why the token must be read explicitly from the DOM

From story 3.3 (register API route):
- The 400/502 error response pattern: `new Response(JSON.stringify({ error: true }), { status: NNN, headers: ... })` — use exactly this shape
- Field validation returns 400 before calling `apiFetch`; Turnstile verification should be added **before** field validation so bots fail fast

From story 3.7 (last completed):
- `npm run build` with zero TypeScript errors is the build gate — verify this passes

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

_none_

### Completion Notes List

- Frontend: Added `turnstileToken: string` to `RegPayload` interface; reads token from `input[name="cf-turnstile-response"]` injected by Turnstile widget SDK, falls back to empty string if not present.
- Backend: Added `turnstileToken?: string` to `RegisterBody`; imported `env` from `cloudflare:workers` (same pattern as `API_SECRET_KEY` in `src/lib/api.ts`); Turnstile verification runs before field validation so bots fail fast. Returns 400 on missing/empty token, 400 on `success: false`, 502 on fetch error.
- `TURNSTILE_SECRET_KEY` accessed via `(env as Record<string, string>).TURNSTILE_SECRET_KEY` to match the established ts-suppress pattern for Cloudflare secrets.
- `npm run build` passes with zero TypeScript errors.
- **Note for infra:** `TURNSTILE_SECRET_KEY` must be set as a secret in the Cloudflare Pages dashboard for production (same setup as `API_SECRET_KEY`). This is an out-of-scope infra task.

### File List

- src/components/RegistrationForm.astro
- src/pages/api/register.ts

## Change Log

- 2026-03-31: Story created — implement Cloudflare Turnstile token verification for /api/register; frontend reads token, backend verifies with siteverify.
- 2026-03-31: Implemented — frontend reads `cf-turnstile-response` and passes as `turnstileToken`; backend verifies with Cloudflare siteverify before proxying to registration backend.
