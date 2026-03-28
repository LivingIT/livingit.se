---
stepsCompleted:
  - step-01-validate-prerequisites
  - step-02-confirmed-requirements
  - step-02-design-epics
  - step-03-create-stories
  - step-04-final-validation
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/architecture.md
  - _bmad-output/planning-artifacts/research/technical-sveltekit-to-astro-migration-research-2026-03-27.md
---

# livingit.se - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for livingit.se, decomposing the requirements from the PRD and Architecture into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: Visitor can browse all upcoming events on a single listing page
FR2: Visitor can view full event details (description, date, location, capacity status)
FR3: Visitor can see whether an event is upcoming, past, or fully booked
FR4: Visitor can navigate from the `/events` overview page to the upcoming events listing
FR5: Visitor can submit a registration form for an upcoming event
FR6: Visitor receives a confirmation page upon successful registration
FR7: Visitor receives inline validation feedback when submitting an invalid registration form
FR8: Visitor cannot register for a past event (registration form is not shown)
FR9: Visitor cannot register for a fully-booked event (registration form is not shown)
FR10: System processes registration form submissions server-side
FR11: Developer can define a new event by adding an entry to the TypeScript event content file
FR12: Developer can specify Swedish or English as the language for each event
FR13: Developer can set event capacity, date, description, and URL slug per event
FR14: Developer can preview new event pages locally before deploying
FR15: All events (Swedish and English) are served at `/events/[slug]`
FR16: Event detail pages are rendered in the event's own language, determined by the `language` field from the API
FR17: Event detail and registration pages are presented in the language matching the event's `language` field via `getTranslations(event.language)`
FR18: Form validation messages are displayed in the language of the event page
FR19: All event pages display the shared `livingit.se` header
FR20: All event pages display the shared `livingit.se` footer
FR21: All event pages use the shared `livingit.se` colour scheme and typography
FR22: The existing `/events` marketing page remains unchanged and statically rendered
FR23: All new event pages meet WCAG 2.1 Level AA requirements
FR24: The registration form is operable via keyboard navigation alone
FR25: New event routes are excluded from search engine indexing via `robots.txt`

### NonFunctional Requirements

NFR1: SSR event pages (listing, detail, confirmation) return a server response within 2 seconds under normal load
NFR2: Existing static pages do not regress in Lighthouse performance scores after hybrid mode is enabled
NFR3: The registration form collects only data necessary for event registration (name, email, employer)
NFR4: All form input is validated and sanitised server-side before processing
NFR5: The registration API route rejects malformed or incomplete submissions with appropriate error responses
NFR6: Personal data submitted via the registration form is handled in accordance with GDPR principles (purpose limitation, data minimisation)
NFR7: All new pages meet WCAG 2.1 Level AA as verified by automated tooling (e.g. axe, Lighthouse) and manual keyboard navigation testing
NFR8: Colour contrast ratios on event pages meet WCAG 2.1 AA minimums (4.5:1 for normal text, 3:1 for large text)

### Additional Requirements

- **[EPIC 1 STORY 1 - BLOCKER]** Add Cloudflare adapter (`@astrojs/cloudflare`) via `npx astro add cloudflare` and switch `astro.config.ts` to `output: 'hybrid'`; verify existing static build passes before adding any new pages
- Add env vars `PUBLIC_API_URL` (`https://api.livingit.se`) and `API_SECRET_KEY` in Cloudflare Pages dashboard
- All event data sourced live from `api.livingit.se` REST API — no TypeScript content file for event instances; existing `src/content/events.ts` is unchanged
- Form submission proxied through `src/pages/api/register.ts` → `api.livingit.se` (NOT Astro Actions — cookie limit risk confirmed)
- Localisation implemented via typed `src/i18n/` objects (`sv.ts`, `en.ts`, `index.ts` with `getTranslations(lang)` helper) — not Astro native i18n
- Confirmation data passed as URL-encoded params on redirect to `/events/[slug]/confirmation` (stateless, no session)
- CSRF protection via Origin header validation in `src/pages/api/register.ts` — reject non-`livingit.se` origins with 403
- API authentication via `API_SECRET_KEY` env var (non-`PUBLIC_` prefix — server-only, never exposed to browser)
- All SSR pages must explicitly set `Astro.response.status` for 404/500 — never rely on Astro implicit inference
- HTTP redirects (`Astro.redirect()`) must be at page frontmatter level only — never inside components (Astro streaming constraint)
- `robots.txt` generated via `seo/robots-livingit.txt` — add `Disallow: /events/` to exclude all event detail and confirmation pages; the static `/events` marketing page remains indexable (no trailing slash match)
- New shared Astro components to create: `EventCard.astro`, `RegistrationForm.astro`, `EventStatusBadge.astro`
- Implementation sequence enforced: adapter → env vars → i18n → event listing on `/events` → `/events/[slug]` detail+form → API route → `/events/[slug]/confirmation` → robots.txt → decommission `events.livingit.se`

### UX Design Requirements

_No UX Design document exists for this project. UX follows existing site design system (Tailwind CSS 4, shared Layout.astro)._

### FR Coverage Map

| FR | Epic | Notes |
|---|---|---|
| FR1 | Epic 2 | Upcoming listing page |
| FR2 | Epic 2 | Event detail on listing + detail pages |
| FR3 | Epic 2 | EventStatusBadge component |
| FR4 | Epic 2 | Event listing integrated directly into `/events` (no separate upcoming page) |
| FR5 | Epic 3 | Registration form |
| FR6 | Epic 3 | Confirmation page |
| FR7 | Epic 3 | Client + server validation |
| FR8 | Epic 3 | Event state: past → no form |
| FR9 | Epic 3 | Event state: full → no form |
| FR10 | Epic 3 | `/api/register.ts` route |
| FR11 | Epic 1 | Arch superseded: events via `api.livingit.se` / `api.devingit.se` |
| FR12 | Epic 1 | Language field drives URL locale via API data |
| FR13 | Epic 1 | Capacity/date/slug owned by backend |
| FR14 | Epic 1 | `npm run dev` works once adapter in place |
| FR15 | Epic 2 | All events served at `/events/[slug]` regardless of language |
| FR16 | Epic 2 | UI language derived from `event.language` field via `getTranslations(event.language)` |
| FR17 | Epic 3 | Locale-aware detail page rendering |
| FR18 | Epic 3 | i18n error messages in form |
| FR19 | Epic 2 | Shared `<Layout>` wraps listing page |
| FR20 | Epic 2 | Shared `<Layout>` wraps listing page |
| FR21 | Epic 2 | Tailwind CSS 4 design tokens applied |
| FR22 | Epic 1 | Static `/events` build verified unchanged |
| FR23 | Epic 3 | WCAG 2.1 AA on registration pages |
| FR24 | Epic 3 | Keyboard-navigable form |
| FR25 | Epic 4 | `seo/robots-livingit.txt` updated |

## Epic List

### Epic 1: Hybrid Rendering Foundation
The existing Astro site runs in hybrid SSG/SSR mode on Cloudflare Pages, with all infrastructure (Cloudflare adapter, environment variables, i18n module) in place and the existing static build verified unbroken. Developers can confidently build SSR pages.
**FRs covered:** FR11, FR12, FR13, FR14, FR22
**Env note:** `PUBLIC_API_URL` configured separately for production (`api.livingit.se`) and preview/dev (`api.devingit.se`) in Cloudflare Pages dashboard.

### Epic 2: Event Discovery
Visitors can browse all upcoming Living IT events on `livingit.se` with the full brand experience — same header, footer, colours, and typography as the rest of the site.
**FRs covered:** FR1, FR2, FR3, FR4, FR15, FR16, FR19, FR20, FR21, FR22

### Epic 3: Event Registration
Visitors can register for events and receive confirmation without ever leaving `livingit.se`. The registration experience handles all states (upcoming, past, fully booked), validates input in the correct language, and is fully WCAG 2.1 AA compliant.
**FRs covered:** FR5, FR6, FR7, FR8, FR9, FR10, FR17, FR18, FR23, FR24
**NFRs:** NFR1, NFR3, NFR4, NFR5, NFR6, NFR7, NFR8
**CSRF note:** Origin check in `api/register.ts` must allow both `livingit.se` and `devingit.se`.

### Epic 4: Production Readiness & Consolidation
The consolidated site is production-ready with correct SEO exclusions, performance verified, and `events.livingit.se` can be decommissioned.
**FRs covered:** FR25
**NFRs:** NFR1, NFR2, NFR7, NFR8

---

## Epic 1: Hybrid Rendering Foundation

The existing Astro site runs in hybrid SSG/SSR mode on Cloudflare Pages, with all infrastructure (Cloudflare adapter, environment variables, i18n module) in place and the existing static build verified unbroken. Developers can confidently build SSR pages.

### Story 1.1: Enable Hybrid Rendering with Cloudflare Adapter

As a **developer**,
I want the Astro site configured with the Cloudflare adapter and hybrid rendering mode,
So that SSR pages can run as Cloudflare Pages Functions without breaking any existing static pages.

**Acceptance Criteria:**

**Given** the existing fully-static Astro site
**When** `npx astro add cloudflare` is run and `astro.config.ts` is updated to `output: 'hybrid'`
**Then** `npm run build` completes successfully with no errors
**And** all existing static routes remain pre-rendered (verified by inspecting build output)
**And** the deployed site on `devingit.se` shows no visual or functional regression on existing pages

---

### Story 1.2: Configure Environment Variables for Both Environments

As a **developer**,
I want `PUBLIC_API_URL` and `API_SECRET_KEY` configured in Cloudflare Pages for both preview and production,
So that SSR pages can securely connect to the correct API backend in each environment.

**Acceptance Criteria:**

**Given** the Cloudflare Pages dashboard for `livingit.se`
**When** environment variables are set per environment
**Then** preview deployments use `PUBLIC_API_URL=https://api.devingit.se`
**And** production uses `PUBLIC_API_URL=https://api.livingit.se`
**And** `API_SECRET_KEY` is set for both environments with the non-`PUBLIC_` prefix
**And** `API_SECRET_KEY` is not accessible from client-side JavaScript (server-only)
**And** a minimal SSR test page can read `import.meta.env.PUBLIC_API_URL` at request time without error

---

### Story 1.3: Create i18n Translation Module

As a **developer**,
I want a typed i18n module with Swedish and English translations,
So that all locale-aware event pages and components can render content in the correct language without duplication.

**Acceptance Criteria:**

**Given** `src/i18n/sv.ts`, `src/i18n/en.ts`, and `src/i18n/index.ts` are created
**When** `getTranslations('sv')` is called
**Then** it returns the Swedish string object with all required keys (form labels, validation errors, event status labels, navigation strings)
**And** `getTranslations('en')` returns the equivalent English strings with the same key structure
**And** both files conform to the `Translations` type exported from `sv.ts`
**And** TypeScript strict-mode compilation passes with no errors

---

## Epic 2: Event Discovery

Visitors can browse all upcoming Living IT events on `livingit.se` with the full brand experience — same header, footer, colours, and typography as the rest of the site.

### Story 2.1: Create Shared Event Components

As a **developer**,
I want `EventCard.astro` and `EventStatusBadge.astro` components built and typed,
So that event data from the API can be rendered consistently across all event pages.

**Acceptance Criteria:**

**Given** `src/components/EventCard.astro` and `src/components/EventStatusBadge.astro` are created
**When** an event object with `title`, `date`, `location`, `slug`, `lang`, and `status` (`'upcoming' | 'past' | 'full'`) is passed as props
**Then** `EventCard` renders the event title, date, location, and links to `/events/[slug]`
**And** `EventStatusBadge` renders "Kommande" / "Avslutat" / "Fullbokat" (or English equivalents) based on status
**And** both components use Tailwind CSS 4 design tokens consistent with the existing site
**And** TypeScript strict-mode compilation passes with no type errors

---

### Story 2.2: Build the Upcoming Events Listing Page

As a **visitor**,
I want to browse all upcoming Living IT events on a single listing page,
So that I can find events I'm interested in without leaving the main site.

**Acceptance Criteria:**

**Given** I navigate to `/events`
**When** the page loads
**Then** the page is SSR (`export const prerender = false`) and displays the shared `<Layout>` with site header and footer
**And** all events fetched from `GET $PUBLIC_API_URL/api/events/public` are displayed as `EventCard` components
**And** each event card shows title, date, location, and status badge
**And** the page sets `Astro.response.status = 500` and shows an error message if the API call fails
**And** `npm run dev` correctly renders the page locally

---

### Story 2.3: ~~Link Events Overview Page to Upcoming Listing~~ _(Done — superseded)_

The live event listing from the API is displayed directly on the `/events` page (merged in story 2.2). There is no separate `/events/upcoming` route. This story is complete by virtue of the listing being integrated into `/events` itself.

---

## Epic 3: Event Registration

Visitors can register for events and receive confirmation without ever leaving `livingit.se`. The registration experience handles all states (upcoming, past, fully booked), validates input in the correct language, and is fully WCAG 2.1 AA compliant.

### Story 3.1: Build Event Detail Page with State-Aware Display

As a **visitor**,
I want to view a full event detail page at `/events/[slug]`,
So that I can read event information and understand whether registration is available.

**Acceptance Criteria:**

**Given** I navigate to `/events/[slug]`
**When** the page loads
**Then** the page is SSR (`export const prerender = false`) and displays the shared `<Layout>` with the correct `title` and meta description
**And** event details (title, date, location, description, capacity status) are fetched from `GET $PUBLIC_API_URL/api/events/public/{slug}`
**And** an `EventStatusBadge` is shown reflecting the event's status
**And** if the event status is `'upcoming'`, a registration form placeholder is shown (implemented in Story 3.2)
**And** if the event status is `'past'`, no registration form is shown and a link back to `/events` is displayed
**And** if the event status is `'full'`, no registration form is shown and a "fully booked" message is displayed in the page language
**And** if the slug is not found (API returns 404), `Astro.response.status` is set to 404 and a "not found" page is shown
**And** the page language matches the event's `language` field from the API (`'sv'` → Swedish UI, `'en'` → English UI) via `getTranslations(event.language)`

---

### Story 3.2: Build Registration Form Component

As a **visitor**,
I want a registration form on the event detail page,
So that I can submit my details to register for an upcoming event.

**Acceptance Criteria:**

**Given** I am on an event detail page with status `'upcoming'`
**When** I view the `RegistrationForm.astro` component
**Then** the form contains fields for name, email, and employer — no additional fields
**And** the form submits via `POST` to `/api/register`
**And** client-side validation highlights empty required fields and invalid email format inline before submission, in the page language
**And** all form fields and error messages use i18n strings from `getTranslations(lang)`
**And** the form and all its interactive elements are operable via keyboard navigation alone (Tab, Enter, Space)
**And** all form labels are programmatically associated with their inputs (WCAG 2.1 AA)
**And** colour contrast on form elements meets WCAG 2.1 AA minimums (4.5:1 for text, 3:1 for UI components)

---

### Story 3.3: Implement Registration API Route

As a **system**,
I want a server-side API route at `/api/register` that validates and proxies registration submissions,
So that form data is securely processed and only valid, authorised submissions reach the backend.

**Acceptance Criteria:**

**Given** a `POST` request to `/api/register`
**When** the request originates from `livingit.se` or `devingit.se`
**Then** the request body is validated with Zod (name required, email valid format, employer required)
**And** on validation success, the data is proxied to `api.livingit.se` (or `api.devingit.se`) using `API_SECRET_KEY` in the Authorization header
**And** on successful backend response, the route redirects to `/events/[slug]/confirmation?name=[name]` (302)
**And** on validation failure, the route returns HTTP 400 with `{ error: string, field?: string }` and the form re-renders with locale-appropriate error messages
**And** requests with an Origin header not matching `livingit.se` or `devingit.se` are rejected with HTTP 403
**And** all input is validated via Zod (`astro/zod`) before forwarding — no raw data reaches the backend

---

### Story 3.4: Build Registration Confirmation Page

As a **visitor**,
I want a confirmation page after successfully registering for an event,
So that I know my registration was received.

**Acceptance Criteria:**

**Given** the `/api/register` route redirects to `/events/[slug]/confirmation?name=[name]`
**When** I land on the confirmation page
**Then** the page is SSR and displays the shared `<Layout>` with site header and footer
**And** event details are fetched from `GET $PUBLIC_API_URL/api/events/public/{slug}` to determine page language via `event.language`
**And** a confirmation message is shown in the event's language, personalised with the registrant's name from the `name` query param
**And** if `name` is missing or empty, a generic confirmation message is shown (no error)
**And** a link back to `/events` is displayed
**And** the page meets WCAG 2.1 AA (keyboard accessible, sufficient contrast)

---

## Epic 4: Production Readiness & Consolidation

The consolidated site is production-ready with correct SEO exclusions, performance verified, and `events.livingit.se` can be decommissioned.

### Story 4.1: Update robots.txt to Exclude Event Routes

As a **site owner**,
I want the new SSR event routes excluded from search engine indexing,
So that search engines do not index dynamic event pages that are not intended for organic discovery.

**Acceptance Criteria:**

**Given** `seo/robots-livingit.txt` is updated
**When** the site is built and deployed
**Then** the generated `robots.txt` contains `Disallow: /events/` (excludes all event detail and confirmation pages)
**And** the existing `Disallow` rules for other paths remain unchanged
**And** the static `/events` marketing page remains indexable (path `/events` without trailing slash does not match `Disallow: /events/`)

---

### Story 4.2: Production Validation & Decommission events.livingit.se

As a **site owner**,
I want the consolidated `livingit.se` site verified in production and `events.livingit.se` decommissioned,
So that there is a single codebase, a single deployment, and no fragmented brand experience.

**Acceptance Criteria:**

**Given** all epics 1–3 are deployed to production `livingit.se`
**When** a full production smoke test is performed
**Then** all routes from `events.livingit.se` have equivalent working routes on `livingit.se`
**And** SSR event pages respond within 2 seconds under normal load (NFR1)
**And** existing static pages show no Lighthouse performance regression compared to pre-migration baseline (NFR2)
**And** automated accessibility tooling (axe or Lighthouse) reports no WCAG 2.1 AA violations on event pages (NFR7)
**And** `events.livingit.se` is decommissioned (DNS removed or redirected to `livingit.se/events`)
