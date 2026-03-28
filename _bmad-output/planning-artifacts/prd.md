---
stepsCompleted:
  - step-01-init
  - step-02-discovery
  - step-02b-vision
  - step-02c-executive-summary
  - step-03-success
  - step-04-journeys
  - step-05-domain
  - step-06-innovation
  - step-07-project-type
  - step-08-scoping
  - step-09-functional
  - step-10-nonfunctional
  - step-11-polish
  - step-12-complete
inputDocuments:
  - _bmad-output/planning-artifacts/research/technical-sveltekit-to-astro-migration-research-2026-03-27.md
  - docs/index.md
  - docs/project-overview.md
  - docs/architecture.md
  - docs/component-inventory.md
  - docs/development-guide.md
  - docs/source-tree-analysis.md
workflowType: 'prd'
briefCount: 0
researchCount: 1
brainstormingCount: 0
projectDocsCount: 6
classification:
  projectType: web_app
  domain: general
  complexity: low-medium
  projectContext: brownfield
---

# Product Requirements Document - livingit.se

**Author:** Mattias
**Date:** 2026-03-27

## Executive Summary

`livingit.se` is the primary digital presence for Living IT Consulting Group AB, a Swedish IT and leadership consulting firm. Today, event registrations are handled by a separate SvelteKit application on `events.livingit.se` — a site with a different header, footer, and colour scheme. This fragmentation creates a disjointed visitor experience: users who follow an event link land on what feels like a different company's website, undermining brand trust and creating unnecessary friction at the point of conversion.

This initiative consolidates event registration into the main Astro site by migrating the SvelteKit SSR functionality into `livingit.se` using Astro's hybrid rendering mode. All existing static pages remain pre-rendered and CDN-served; new event routes run as server-side rendered pages. The result is a single codebase, a single deployment, and a single coherent brand experience for every visitor.

### What Makes This Special

This is not a feature addition — it is a brand repair. The core insight is that technical fragmentation has a direct user-experience cost: a visitor who feels uncertain about whether they're still on the right site is less likely to complete a registration. By eliminating the visual and structural inconsistency between the marketing site and the events site, Living IT presents a unified, professional face at every touchpoint. The migration is low-risk (direct SvelteKit→Astro pattern mapping, estimated 3–4 dev-days) with high visible impact.

## Project Classification

| Attribute | Value |
|---|---|
| **Project Type** | Web App (static site → hybrid SSR) |
| **Domain** | General (corporate marketing / consulting) |
| **Complexity** | Low-medium |
| **Project Context** | Brownfield — extending an existing Astro 5 static site |

## Success Criteria

### User Success

A visitor navigating from `livingit.se` to an event page, through registration, and to a confirmation page experiences a single uninterrupted brand environment — identical header, footer, colour scheme, and typography throughout. No visual or structural cue signals that they have left the main site. The event registration flow is self-contained within `livingit.se`; the `events.livingit.se` subdomain is retired.

### Business Success

The events functionality is maintained as part of a single codebase (`livingit.se`). There is no separate SvelteKit application to deploy, update, or monitor. All event-related changes — content, styling, behaviour — are made in one place.

### Technical Success

- All existing static pages on `livingit.se` remain pre-rendered (no performance regression)
- Astro hybrid rendering mode (`output: 'hybrid'`) enables SSR selectively for event routes only
- Event registration form implemented as a standard Astro API route (`src/pages/api/register.ts`)
- No new external dependencies, backend services, or databases introduced
- `events.livingit.se` can be decommissioned once migration is complete

### Measurable Outcomes

- All pages currently on `events.livingit.se` exist as equivalent routes on `livingit.se`
- Zero visual brand inconsistencies between event pages and marketing pages
- Single deployment pipeline serves the entire site

## Product Scope

### MVP — Minimum Viable Product

**Approach:** Parity + consolidation. Done when every page from `events.livingit.se` exists as an equivalent route on `livingit.se`, within the shared brand layout, and `events.livingit.se` can be decommissioned.

**Resource requirements:** 1 developer, estimated 3–4 days.

**Core journeys supported:**
- Visitor browses upcoming events on `/events`
- Visitor registers for an event (`/events/[slug]`)
- Visitor receives registration confirmation (`/events/[slug]/confirmation`)
- Developer adds/updates events via TypeScript content files

**Must-have capabilities:**
- Astro hybrid rendering mode (`output: 'hybrid'`) + server adapter
- `/events` — SSR listing page (all events, sv + en, merged into existing page)
- `/events/[slug]` — SSR event detail + registration form (language from `event.language`)
- `/events/[slug]/confirmation` — confirmation page
- `src/pages/api/register.ts` — registration form API route
- Event content model with `language` field driving locale URL
- Shared header/footer/design system on all event pages
- Form validation (client + server-side)
- Event state handling (upcoming / past / full)
- WCAG 2.1 AA compliance on all new pages
- `robots.txt` updated to exclude event routes from indexing

### Growth Features (Post-MVP)

None identified — this initiative is scoped to parity only.

### Vision (Future)

To be defined in a future initiative.

### Risk Mitigation

**Technical risks:**
- *Server adapter integration*: Add adapter and verify existing static site works before building any new pages
- *Astro Actions cookie limit*: Mitigated by using standard API route instead of Astro Actions for form submission
- *Hybrid mode performance*: Low risk — static pages are unaffected by SSR configuration

**Resource risks:** Low — the event listing is already integrated into `/events`. Individual event detail URLs can be shared directly without the listing page.

## User Journeys

### Journey 1: Visitor Registers for an Event (Happy Path)

**Meet Erik.** He's a software developer at a mid-sized company in Malmö. A colleague mentions Living IT's *Beauty in Code* conference over lunch. He searches, lands on `livingit.se`, and browses briefly — the site feels polished and professional.

He spots "Events" in the navigation and clicks through to `/events`. The page shows a general overview of Living IT events along with a live listing of upcoming events — mixing Swedish and English entries.

He finds Beauty in Code, clicks through to `/events/beauty-in-code`. Same header, same colours, same feel as the rest of the site. He fills in the registration form (name, email, employer) and submits. He lands on `/events/beauty-in-code/confirmation`, still on `livingit.se`, with a clear confirmation message.

**Capabilities revealed:** `/events` integrated SSR listing, `/events/[slug]` SSR event detail, registration form, API route, confirmation page, shared header/footer.

---

### Journey 2: Visitor Hits a Problem During Registration (Edge Case)

**Meet Anna.** A team lead in Göteborg who found out about a Swedish workshop the day before it starts. She navigates to `/events`, finds *IT-helg April*, and clicks through to `/events/it-helg-april`. The page is in Swedish throughout (language derived from the event's `language: 'sv'` field).

She submits the form with an invalid email. An inline error appears in Swedish: "Ange en giltig e-postadress." She corrects it and resubmits successfully.

Second scenario: Anna arrives at `/events/it-helg-mars` — an event that ended last week. The page exists but clearly marks it as past, shows no registration form, and links back to `/events`.

Third scenario: The event she wants is fully booked. The form is replaced with a "Det här eventet är fullbokat" message.

**Capabilities revealed:** Language-aware rendering from event data, form validation with locale-appropriate error messages, event state display (upcoming / past / full).

---

### Journey 3: Developer Adds a New Event

**The Living IT developer** needs to add a new IT-helg weekend. All event data — title, date, description, slug, capacity, and `language: 'sv'` — is managed in the backend API. The site generates the event at `/events/it-helg-maj`.

They run `npm run dev` locally, verify it appears on `/events` with the shared site layout, push to `develop`, and CI deploys it.

No admin panel or CMS on the frontend. The `language` field returned by the API is the source of truth for UI language — no frontend language-detection logic required.

**Capabilities revealed:** API-driven event data, language-from-data rendering, dynamic routing (`src/pages/events/[slug].astro`), dev/preview workflow.

## Web App Specific Requirements

### Rendering Architecture

`livingit.se` is an MPA built with Astro 5. This initiative extends it from fully static to hybrid SSG/SSR. All existing pages remain statically pre-rendered; new event pages run as SSR routes via `export const prerender = false`. No SPA behaviour, client-side routing, or real-time features required.

**Route map:**

| Route | Type |
|---|---|
| `/events` | SSR — event listing (upcoming events from API) + static marketing content |
| `/events/[slug]` | SSR — event detail + registration form |
| `/events/[slug]/confirmation` | SSR — registration confirmation |
| `/api/register` | Server API route |

**Language routing:** Language determined by the `language` field in the API event response. No locale prefix in URL. `getTranslations(event.language)` drives all UI strings on detail and confirmation pages.

### Browser Support

Modern evergreen browsers: Chrome, Firefox, Safari, Edge (latest stable). No legacy browser support required.

### Responsive Design

Inherits the existing site's responsive design system (Tailwind CSS 4, mobile/tablet/desktop breakpoints, `getResponsiveImage()` utility). All new event pages use the same responsive layout patterns as existing pages.

### SEO

Existing static pages: unchanged. New event routes: not intended for search indexing; excluded from `robots.txt`.

### Accessibility

**Required:** WCAG 2.1 Level AA per the European Accessibility Act (EAA, in force June 2025). Living IT qualifies as a private company subject to the EAA. All new event pages — including the registration form and confirmation pages — must meet this standard. WCAG 2.2 alignment recommended for forward compatibility.

## Functional Requirements

### Event Discovery

- **FR1:** Visitor can browse all upcoming events on a single listing page
- **FR2:** Visitor can view full event details (description, date, location, capacity status)
- **FR3:** Visitor can see whether an event is upcoming, past, or fully booked
- **FR4:** Visitor can browse upcoming events directly on the `/events` page (listing integrated into the existing overview page)

### Event Registration

- **FR5:** Visitor can submit a registration form for an upcoming event
- **FR6:** Visitor receives a confirmation page upon successful registration
- **FR7:** Visitor receives inline validation feedback when submitting an invalid registration form
- **FR8:** Visitor cannot register for a past event (registration form is not shown)
- **FR9:** Visitor cannot register for a fully-booked event (registration form is not shown)
- **FR10:** System processes registration form submissions server-side

### Event Content Management

- **FR11:** Developer can define a new event by adding an entry to the TypeScript event content file
- **FR12:** Developer can specify Swedish or English as the language for each event
- **FR13:** Developer can set event capacity, date, description, and URL slug per event
- **FR14:** Developer can preview new event pages locally before deploying

### Localisation

- **FR15:** All events (Swedish and English) are served at `/events/[slug]`
- **FR16:** Event detail pages are rendered in the event's own language, determined by the `language` field returned by the API
- **FR17:** Event detail and registration pages are presented in the language matching the event's `language` field via `getTranslations(event.language)`
- **FR18:** Form validation messages are displayed in the language of the event page

### Site Integration

- **FR19:** All event pages display the shared `livingit.se` header
- **FR20:** All event pages display the shared `livingit.se` footer
- **FR21:** All event pages use the shared `livingit.se` colour scheme and typography
- **FR22:** The existing `/events` marketing page remains unchanged and statically rendered

### Accessibility & Compliance

- **FR23:** All new event pages meet WCAG 2.1 Level AA requirements
- **FR24:** The registration form is operable via keyboard navigation alone
- **FR25:** New event routes are excluded from search engine indexing via `robots.txt`

## Non-Functional Requirements

### Performance

- **NFR1:** SSR event pages (listing, detail, confirmation) return a server response within 2 seconds under normal load
- **NFR2:** Existing static pages do not regress in Lighthouse performance scores after hybrid mode is enabled

### Security

- **NFR3:** The registration form collects only data necessary for event registration (name, email, employer)
- **NFR4:** All form input is validated and sanitised server-side before processing
- **NFR5:** The registration API route rejects malformed or incomplete submissions with appropriate error responses
- **NFR6:** Personal data submitted via the registration form is handled in accordance with GDPR principles (purpose limitation, data minimisation)

### Accessibility

- **NFR7:** All new pages meet WCAG 2.1 Level AA as verified by automated tooling (e.g. axe, Lighthouse) and manual keyboard navigation testing
- **NFR8:** Colour contrast ratios on event pages meet WCAG 2.1 AA minimums (4.5:1 for normal text, 3:1 for large text)
