---
stepsCompleted: [1, 2, 3, 4, 5, 6]
inputDocuments: []
workflowType: 'research'
lastStep: 1
research_type: 'technical'
research_topic: 'Migrating SvelteKit SSR event registration functionality into Astro'
research_goals: 'Simplest integration path, architecture focus'
user_name: 'Mattias'
date: '2026-03-27'
web_research_enabled: true
source_verification: true
---

# Migrating SvelteKit Event Registration into Astro: Technical Research Report

**Date:** 2026-03-27
**Author:** Mattias
**Research Type:** Technical Architecture

---

## Executive Summary

The `events.livingit.se` SvelteKit SSR application can be migrated into `livingit.se` (Astro) with low technical risk and minimal effort. Astro's **hybrid rendering mode** (`output: 'hybrid'`) is the correct architecture: all existing static marketing pages remain pre-rendered and CDN-served, while the three new event routes run as server-side rendered pages. Every SvelteKit SSR pattern used in the events app has a direct Astro equivalent — the migration is primarily a translation exercise, not a redesign.

**Key Technical Findings:**

- Hybrid mode preserves 100% of the existing site's static performance while unlocking SSR selectively for event pages
- SvelteKit `load()` functions → Astro frontmatter `await fetch()` (same concept, simpler syntax)
- SvelteKit form actions → Astro API endpoints (recommended over Astro Actions for complex forms)
- `hooks.server.ts` → `src/middleware.ts` (identical concept)
- Zod schemas port with a single import change (`'zod'` → `'astro/zod'`)
- All deployment targets (Vercel, Netlify, Cloudflare) have official Astro SSR adapters

**One active risk:** Astro Actions has a known cookie storage limitation (~4096 chars) that affects forms with many fields. The registration form has ~7 fields — use a standard Astro API route endpoint instead of Astro Actions for the registration POST to avoid this issue entirely.

**Technical Recommendations:**

1. Use `output: 'hybrid'` in `astro.config.ts` — not `'server'`
2. Implement the registration form as a standard API route (`src/pages/api/register.ts`), not an Astro Action
3. Add `export const prerender = false` to all three new SSR pages
4. Port the existing Playwright test suite directly from the events site
5. Add the server adapter first and verify the existing static site works before building new pages

**Estimated effort:** 3–4 developer-days.

---

## Table of Contents

1. [Technical Research Scope Confirmation](#technical-research-scope-confirmation)
2. [Technology Stack Analysis](#technology-stack-analysis)
3. [Integration Patterns Analysis](#integration-patterns-analysis)
4. [Architectural Patterns and Design](#architectural-patterns-and-design)
5. [Implementation Approaches and Technology Adoption](#implementation-approaches-and-technology-adoption)
6. [Technical Research Conclusion](#technical-research-conclusion)

---

## Research Overview

This report covers the technical research conducted to evaluate and plan the migration of the `events.livingit.se` SvelteKit SSR application into the `livingit.se` Astro main site. The research identifies the simplest, lowest-risk integration path with a focus on architecture.

The migration is technically viable with well-understood patterns. No architectural re-design is needed — only the addition of hybrid rendering mode, a server adapter, and three new SSR pages that mirror the existing SvelteKit routes.

---

## Technical Research Scope Confirmation

**Research Topic:** Migrating SvelteKit SSR event registration functionality into Astro
**Research Goals:** Simplest integration path, architecture focus

**Technical Research Scope:**

- Architecture Analysis - design patterns, frameworks, system architecture
- Implementation Approaches - development methodologies, coding patterns
- Technology Stack - languages, frameworks, tools, platforms
- Integration Patterns - APIs, protocols, interoperability
- Performance Considerations - scalability, optimization, patterns

**Out of Scope:** Svelte islands/hybrid frameworks, proxy strategies, monorepo multi-deploy setups

**Research Methodology:**

- Current web data with rigorous source verification
- Multi-source validation for critical technical claims
- Confidence level framework for uncertain information
- Comprehensive technical coverage with architecture-specific insights

**Scope Confirmed:** 2026-03-27

---

<!-- Content will be appended sequentially through research workflow steps -->

## Technology Stack Analysis

### Programming Languages & Frameworks

**Current stacks:**
- **livingit.se (main):** Astro 6, TypeScript, Tailwind CSS 4 — pure SSG, zero runtime
- **events.livingit.se:** SvelteKit (SSR), TypeScript, Zod, i18n (sv/en)

**Migration target:** Astro with SSR enabled (hybrid mode)

_Astro is actively maintained; Cloudflare acquired Astro in early 2026, signaling strong long-term investment._
_Source: https://dev.to/polliog/astro-in-2026-why-its-beating-nextjs-for-content-sites-and-what-cloudflares-acquisition-means-6kl_

### Rendering Modes in Astro

Astro supports three output modes, making hybrid integration straightforward:

| Mode | Setting | Use case |
|---|---|---|
| Static (SSG) | `output: 'static'` | Current main site — marketing pages |
| Hybrid | `output: 'hybrid'` | **Recommended target** — static pages stay static, event routes opt into SSR |
| Full SSR | `output: 'server'` | All pages server-rendered |

**Hybrid mode is the key enabler:** existing pages remain pre-rendered at build time; only new event pages use on-demand rendering. Build times improve up to 30% vs. static-only for dynamic routes.

_Source: https://docs.astro.build/en/guides/on-demand-rendering/_
_Source: https://blog.logrocket.com/hybrid-rendering-astro-guide/_

### Server Endpoints & Form Handling

**Astro server endpoints** (`src/pages/api/*.ts`) export named HTTP method handlers:

```typescript
// src/pages/api/register.ts
export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData();
  // validate, call API, return response
};
```

**Astro Actions** (built-in, Astro v4+): type-safe server functions with automatic Zod v4 validation. Native replacement for SvelteKit form actions — no extra Zod install needed.

_Source: https://docs.astro.build/en/guides/actions/_
_Source: https://docs.astro.build/en/guides/endpoints/_

### Validation: Zod in Astro

- Astro re-exports Zod v4 via `astro/zod` — no separate install required
- `isInputError()` utility provides per-field error handling matching SvelteKit's pattern
- File upload validation supported via `z.instanceof(File)`

_Source: https://docs.astro.build/en/reference/modules/astro-zod/_

### i18n (Internationalization)

- Astro v4+ includes **native i18n routing** with SSR support
- Server-side language detection from browser preferences via `Astro.redirect()`
- Community libraries: `astro-i18n`, `@i18n-tiny/astro` (zero-dependency)
- The events site uses sv/en — both are straightforward to implement in Astro i18n

_Source: https://docs.astro.build/en/guides/internationalization/_

### Deployment

All current deployment targets (Vercel, Netlify, Cloudflare Pages) have official Astro SSR adapters:

| Platform | Adapter | Notes |
|---|---|---|
| Vercel | `@astrojs/vercel` | Serverless functions, ISR support |
| Netlify | `@astrojs/netlify` | Server islands, actions, sessions |
| Cloudflare Pages | `@astrojs/cloudflare` | Pages Functions; Workers recommended for new projects |
| Node.js | `@astrojs/node` | Self-hosted |

One-line setup: `npx astro add [platform]`

_Source: https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/_
_Source: https://docs.astro.build/en/guides/integrations-guide/netlify/_

---

## Integration Patterns Analysis

### SvelteKit → Astro Pattern Mapping

This is the core of the migration. Every SvelteKit server pattern has a direct Astro equivalent.

#### Server-Side Data Fetching

**SvelteKit (`+page.server.ts`):**
```typescript
export const load: PageServerLoad = async ({ fetch }) => {
  const response = await fetch(`${BASE_URL}/api/events/public`);
  const data = await response.json();
  return { events: data };
};
```

**Astro (frontmatter in `.astro` page, SSR mode):**
```astro
---
export const prerender = false;
const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/events/public`);
const data = await response.json();
const events = data.filter(e => e.isActive);
---
```

Data is available directly in the template — no `data.events` indirection needed.
_Source: https://docs.astro.build/en/guides/data-fetching/_

#### Dynamic Route Parameters

**SvelteKit:** `src/routes/events/[eventId]/+page.server.ts` → `params.eventId`

**Astro:** `src/pages/events/[eventId].astro` → `Astro.params.eventId`

In hybrid mode, add `export const prerender = false` — no `getStaticPaths()` needed for SSR routes.

```astro
---
export const prerender = false;
const { eventId } = Astro.params;
const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/events/${eventId}`);
const event = await response.json();
---
```
_Source: https://docs.astro.build/en/guides/on-demand-rendering/_

#### Redirects

**SvelteKit:** `redirect(302, '/events/abc')`

**Astro:** `return Astro.redirect('/events/abc', 302)`

⚠️ Astro redirects must happen at page level (not in child components) due to HTML streaming.

_Source: https://docs.astro.build/en/guides/server-side-rendering/_

#### Error Handling

**SvelteKit:** `throw error(404, { message: 'No active events', code: 'no-active-event' })`

**Astro:**
```astro
---
return new Response('Not found', { status: 404, statusText: 'Not found' });
// or set status and let +error page handle it:
Astro.response.status = 404;
---
```
_Source: https://docs.astro.build/en/guides/server-side-rendering/_

#### Form Actions / Registration Flow

**SvelteKit:** `+page.server.ts` `actions` export with `fail()` and `redirect()`

**Astro Actions** (`src/actions/index.ts`):
```typescript
import { defineAction } from 'astro:actions';
import { z } from 'astro/zod';

export const server = {
  registerAttendee: defineAction({
    accept: 'form',
    input: z.object({
      firstName: z.string().min(1),
      lastName: z.string().min(1),
      email: z.string().email(),
      company: z.string().min(1),
      // ... matches existing schema
    }),
    handler: async (input) => {
      const response = await fetch(`${import.meta.env.API_URL}/api/register`, {
        method: 'POST',
        body: JSON.stringify(input),
      });
      return response.json();
    }
  })
}
```

In the page, check result and redirect:
```astro
---
const result = Astro.getActionResult(actions.registerAttendee);
if (result && !result.error) {
  return Astro.redirect(`/events/${eventId}/ordersuccess`);
}
---
```
_Source: https://docs.astro.build/en/guides/actions/_
_Source: https://blog.logrocket.com/exploring-actions-request-rewriting-astro/_

### API Communication Pattern

The events site calls `PUBLIC_API_URL` — an external backend API. This pattern carries over unchanged:

- In Astro, use `import.meta.env.PUBLIC_API_URL` (public env vars) or `import.meta.env.API_URL` (server-only, recommended for API secrets)
- All API calls happen server-side in SSR pages/actions — the browser never sees the API URL directly
- `fetch()` is available globally in Astro server context

_Source: https://docs.astro.build/en/guides/data-fetching/_

### Hybrid Rendering: The Key Integration Pattern

The main site stays fully static. Only the new event routes opt into SSR:

```javascript
// astro.config.ts
export default defineConfig({
  output: 'hybrid',   // ← change from 'static'
  adapter: YOUR_ADAPTER,
});
```

Static pages (all existing): no change needed — pre-rendered at build time by default.

SSR pages (new event routes): add `export const prerender = false` at top.

```
src/pages/
├── index.astro                    ← static (unchanged)
├── events.astro                   ← static (unchanged, shows event cards)
├── events/
│   └── [eventId]/
│       ├── index.astro            ← prerender = false (SSR)
│       └── ordersuccess.astro     ← prerender = false (SSR)
└── confirm/
    └── [confirmationData].astro   ← prerender = false (SSR)
```

_Source: https://docs.astro.build/en/guides/on-demand-rendering/_
_Source: https://blog.logrocket.com/hybrid-rendering-astro-guide/_


---

## Architectural Patterns and Design

### System Architecture: Hybrid SSG + SSR

**Target architecture:** Astro hybrid mode with `output: 'hybrid'` and a server adapter.

```
Request flow:
  Static pages (marketing)  → CDN edge → pre-built HTML (no server)
  Event pages (SSR)         → Server/Function → Astro renders on-demand → HTML
  Event actions (forms)     → Server/Function → Astro Action → API call → redirect
```

**Why hybrid (not full SSR):** The main site's static pages are a key performance asset. Hybrid preserves CDN-delivered static HTML for all existing pages while unlocking server capability only where needed.

_Source: https://astro.build/blog/hybrid-rendering/_

### Project Structure Changes

Minimal changes to existing directory layout:

```
src/
├── actions/
│   └── index.ts          ← NEW: Astro Actions (replaces SvelteKit form actions)
├── middleware.ts          ← NEW: Request interceptor (replaces hooks.server.ts)
├── pages/
│   ├── index.astro        ← unchanged (static)
│   ├── events.astro       ← unchanged (static overview page)
│   ├── events/
│   │   └── [eventId]/
│   │       ├── index.astro        ← NEW (prerender=false, SSR)
│   │       └── ordersuccess.astro ← NEW (prerender=false, SSR)
│   └── confirm/
│       └── [confirmationData].astro ← NEW (prerender=false, SSR)
├── components/            ← existing + new event-specific components
└── content/               ← unchanged
```

Existing pages remain completely untouched. New pages are additive.

_Source: https://docs.astro.build/en/basics/project-structure/_

### Middleware: Replacing SvelteKit hooks.server.ts

Astro has a middleware system at `src/middleware.ts` that is the direct equivalent of SvelteKit's `hooks.server.ts`:

```typescript
// src/middleware.ts
import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  // intercept request, modify context.locals, validate, etc.
  return next();
});
```

Supports: request/response interception, `locals` for per-request shared data, header/cookie manipulation, chaining via `sequence()`.

_Source: https://docs.astro.build/en/guides/middleware/_

### Environment Variables Security Pattern

The events site uses `PUBLIC_API_URL` — this pattern maps directly:

| SvelteKit | Astro | Browser-visible? |
|---|---|---|
| `PUBLIC_API_URL` ($env/static/public) | `import.meta.env.PUBLIC_API_URL` | Yes |
| Private env vars ($env/static/private) | `import.meta.env.API_SECRET` (no PUBLIC_ prefix) | No |

**Recommendation:** The API base URL can stay `PUBLIC_` if it is not sensitive. Any API tokens/keys must use non-`PUBLIC_` names and are automatically server-only.

Astro also offers `astro:env` for typed, schema-validated env vars.

_Source: https://docs.astro.build/en/guides/environment-variables/_

### Form Handling: PRG Pattern Built-in

Astro Actions automatically implement the **Post/Redirect/Get (PRG)** pattern — no manual redirect coding needed after form submission. Results persist in session storage and survive page refresh, eliminating "confirm form resubmission" dialogs.

This is a significant improvement over manual SvelteKit form action patterns.

_Source: https://docs.astro.build/en/guides/actions/_

### Cookie and Session Handling

- **Cookies API:** `Astro.cookies` available in SSR endpoints and pages (not in layouts/components)
- **Sessions API:** Server-side session storage (only session ID in cookie; data stays on server) — preferred for auth-style state
- The events site's confirmation flow (`/confirm/[confirmationData]`) encodes data in the URL, so no session state is needed for that route

_Source: https://docs.astro.build/en/guides/sessions/_

### Error Pages

Custom error pages at `src/pages/404.astro` and `src/pages/500.astro`. For SSR routes, must explicitly set `Astro.response.status = 404` to return correct HTTP status codes.

⚠️ Known Astro issue: without explicit status setting, SSR may return "404 OK" — always set the status code manually in SSR pages.

_Source: https://github.com/withastro/astro/issues/13259_

### Scalability and Deployment Architecture

No scalability changes required. The adapter handles serverless function deployment:

- **Vercel:** Each SSR page/action → individual Serverless Function. Static pages → Edge CDN.
- **Netlify:** SSR pages → Netlify Functions. Static → CDN.
- **Cloudflare:** SSR pages → Pages Functions (Workers recommended for new projects).

The existing deployment pipeline only needs one change: add the server adapter.

_Source: https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/_

---

## Implementation Approaches and Technology Adoption

### Migration Strategy: Incremental (Recommended)

**Approach:** Add SSR capability to the existing Astro site incrementally. All existing static pages stay untouched.

**Sequence:**
1. Add server adapter to `astro.config.ts`, switch to `output: 'hybrid'`
2. Add `PUBLIC_API_URL` env var
3. Implement event detail page (`/events/[eventId]`) with API fetch
4. Implement registration action (`src/actions/index.ts`)
5. Implement order success page
6. Implement confirmation page (`/confirm/[confirmationData]`)
7. Decommission `events.livingit.se`

This is a **low-risk, additive** approach — no existing code is touched until step 7.

### TypeScript/Zod Migration

The existing Zod schemas in the events site can be copied almost verbatim into `src/actions/index.ts`. The `z` import changes from `'zod'` to `'astro/zod'` but the schema definitions are identical.

The `Event` type from `src/lib/types.d.ts` can be moved to a shared types file in the Astro project.

### Testing Approach

The events site already has Playwright configured (`playwright.config.ts`). This test setup can be adopted directly:

- **Vitest** for unit tests on action handlers and utility functions
- **Playwright** for E2E tests on event registration flows (critical path)
- Configure `baseURL: 'http://localhost:4321'` (Astro's dev server port)

_Source: https://docs.astro.build/en/guides/testing/_

### Known Risks and Mitigations

| Risk | Severity | Mitigation |
|---|---|---|
| Astro Actions cookie limit (>2-3 fields exceeds 4096 chars) | Medium | The registration form has ~7 fields — monitor for cookie overflow. Consider using API endpoint instead of Actions for complex forms. |
| Astro v5.16.0 regression: `accept: 'form'` causes 500 errors | Medium | Pin to a stable Astro version; check changelog before upgrading |
| Action named 'apply' fails outside index.ts | Low | Avoid naming actions 'apply'; keep all actions in `src/actions/index.ts` |
| Redirects must happen at page level (not components) | Low | Keep all redirect logic in `.astro` page frontmatter |
| Cloudflare Workers: no persistent /tmp filesystem | Low | No file system usage in event flows — not applicable |

_Source: https://github.com/withastro/astro/issues/11675_
_Source: https://github.com/withastro/astro/issues/14970_

**Critical risk note on Astro Actions for complex forms:** Given the registration form has ~7 fields with Zod validation, the cookie storage limit for action results is a real risk. An alternative is to use a direct `src/pages/api/register.ts` endpoint (standard Astro API route) instead of Astro Actions for the registration POST — this avoids the cookie limit entirely and is the safer choice for complex forms.

### Team Skill Requirements

| Skill | Current level (SvelteKit) | Gap |
|---|---|---|
| Astro SSR/hybrid mode | None | Low — patterns are similar |
| Astro Actions | None | Low — simpler than SvelteKit actions |
| Astro middleware | None | Low — same concept as hooks.server.ts |
| TypeScript | Strong | None |
| Zod | Strong | None (same library) |

Learning curve is minimal — the concepts are the same, only the API surface differs.

### Implementation Roadmap

**Phase 1 — Setup (½ day)**
- Add adapter (`npx astro add node` or platform-specific)
- Switch `output: 'hybrid'` in `astro.config.ts`
- Add env vars, verify existing site still works

**Phase 2 — Event detail page (1 day)**
- `src/pages/events/[eventId]/index.astro` with API fetch
- Display event details, registration form
- Handle sold out / inactive states

**Phase 3 — Registration flow (1-2 days)**
- Registration form action or API endpoint
- Zod validation (port from existing schema)
- Order success page

**Phase 4 — Confirmation page (½ day)**
- `src/pages/confirm/[confirmationData].astro`
- Server-side confirmation handling

**Phase 5 — Polish and decommission (½ day)**
- i18n (if needed — assess if Swedish-only is acceptable initially)
- Redirect `events.livingit.se` → `livingit.se/events`
- Monitor and decommission old app

**Total estimated effort: 3-4 days for a developer familiar with the existing events codebase.**

### Cost Optimization

No additional infrastructure cost. The SSR pages become serverless functions on the existing deployment platform. Static pages remain on CDN with zero compute cost.

_Source: https://vercel.com/docs/frameworks/frontend/astro_

---

## Technical Research Conclusion

### Summary of Key Technical Findings

| Area | Finding |
|---|---|
| Architecture | Astro hybrid mode (`output: 'hybrid'`) is the correct target — static pages stay static, 3 event routes become SSR |
| Rendering | `export const prerender = false` on dynamic event pages — no `getStaticPaths()` needed |
| Data fetching | `await fetch()` directly in Astro frontmatter replaces SvelteKit `load()` |
| Form handling | Use Astro API routes (`src/pages/api/`) not Astro Actions for the multi-field registration form |
| Validation | Zod schemas port verbatim; only import path changes |
| Middleware | `src/middleware.ts` with `onRequest()` replaces `hooks.server.ts` |
| Redirects | `return Astro.redirect('/path', 302)` — must be at page level only |
| Error handling | `return new Response('...', { status: 404 })` or set `Astro.response.status` |
| Env vars | `PUBLIC_API_URL` maps directly; non-PUBLIC vars are automatically server-only |
| Deployment | One change: add adapter via `npx astro add [platform]` |
| Testing | Playwright config ports directly from events site |

### Strategic Technical Assessment

This is a **low-complexity, low-risk migration** that consolidates two codebases, two deployment pipelines, and two repositories into one. The architectural decision to use hybrid mode means the performance profile of the existing site is preserved entirely.

The only non-trivial decision is whether to use Astro Actions or API routes for form handling. Given the known cookie storage bug with multi-field forms, **API routes are the safer choice** for this project.

### Next Steps

1. **Create Architecture document** — formalize the hybrid rendering decision, file structure, and env var strategy for the implementation team
2. **Create PRD** — document user-facing requirements for the integrated event registration experience
3. **Sprint planning** — break implementation into the 5 phases outlined in the Implementation Roadmap

---

**Research Completion Date:** 2026-03-27
**Source Verification:** All technical facts cited with current sources from Astro official documentation and community resources
**Confidence Level:** High — based on multiple authoritative sources including official Astro documentation

_This research document serves as the technical foundation for the livingit.se events integration project._
