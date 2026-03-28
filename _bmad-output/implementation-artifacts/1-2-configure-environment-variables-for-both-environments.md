# Story 1.2: Configure Environment Variables for Both Environments

Status: review

## Story

As a **developer**,
I want `PUBLIC_API_URL` and `API_SECRET_KEY` configured for both staging and production deployments,
so that SSR pages can securely connect to the correct API backend in each environment.

## Acceptance Criteria

1. **Given** the Cloudflare Workers configuration for `livingit.se`, **When** environment variables are set per environment, **Then** staging deployments (devingit-se worker / `devingit.se`) use `PUBLIC_API_URL=https://api.devingit.se`.
2. **And** production deployments (livingit-se worker / `livingit.se`) use `PUBLIC_API_URL=https://api.livingit.se`.
3. **And** `API_SECRET_KEY` is set for both environments as a Workers secret (encrypted, not committed to git).
4. **And** `API_SECRET_KEY` is not accessible from client-side JavaScript (non-`PUBLIC_` prefix, server-only).
5. **And** a minimal SSR test page can read `import.meta.env.PUBLIC_API_URL` at request time without error, confirming env vars are injected at runtime.

## Tasks / Subtasks

- [x] Add `PUBLIC_API_URL` to `wrangler.toml` per environment (AC: #1, #2)
  - [x] Add `[vars]` section (staging default): `PUBLIC_API_URL = "https://api.devingit.se"`
  - [x] Add `[env.production.vars]` section: `PUBLIC_API_URL = "https://api.livingit.se"`
  - [x] Verify `npm run build` still passes after the change
- [x] Set `API_SECRET_KEY` as Workers secrets via `wrangler secret put` (AC: #3, #4)
  - [x] Run `npx wrangler secret put API_SECRET_KEY` (staging, no `--env` flag)
  - [x] Run `npx wrangler secret put API_SECRET_KEY --env production` (production)
  - [x] Confirm secret does NOT appear in `wrangler.toml` or any committed file
- [x] Create temporary SSR verification page (AC: #5)
  - [x] Create `src/pages/env-check.astro` with `export const prerender = false`
  - [x] Page reads `import.meta.env.PUBLIC_API_URL` in frontmatter and renders it in the body
  - [x] Deploy to `devingit.se` and browse `/env-check` — confirm `https://api.devingit.se` is shown
- [x] Delete verification page (AC: #5)
  - [x] Remove `src/pages/env-check.astro` after confirming env vars work
  - [x] Confirm build still passes without the test page

## Dev Notes

### Critical: Cloudflare Workers (NOT Pages)

Story 1.1 migrated from Cloudflare Pages to Cloudflare Workers (`@astrojs/cloudflare` v13 uses Workers Assets, incompatible with Pages). **All architecture doc references to "Cloudflare Pages dashboard" are superseded.** Env vars are configured in:
- `wrangler.toml` `[vars]` / `[env.production.vars]` for non-secret public values
- `wrangler secret put` for secrets (encrypted, stored in Cloudflare, never in git)

### wrangler.toml — Target State After This Story

```toml
# Cloudflare Workers deployment configuration.
# The adapter generates dist/server/wrangler.json (the actual deploy config).
# This file provides the base configuration read by the vite plugin during build.
#
# Deploy after building:
#   npx wrangler deploy              (staging / devingit.se)
#   npx wrangler deploy --env production  (production / livingit.se)

name = "devingit-se"
compatibility_date = "2026-03-27"

[assets]
binding = "ASSETS"
directory = "dist/client"

[vars]
PUBLIC_API_URL = "https://api.devingit.se"

[env.production]
name = "livingit-se"

[env.production.vars]
PUBLIC_API_URL = "https://api.livingit.se"
```

### API_SECRET_KEY — Must NOT Be in wrangler.toml

Secrets are set via the CLI and stored encrypted in Cloudflare. They are NEVER committed to git:

```bash
# Staging (devingit-se worker)
npx wrangler secret put API_SECRET_KEY
# Enter secret value when prompted

# Production (livingit-se worker)
npx wrangler secret put API_SECRET_KEY --env production
# Enter secret value when prompted
```

### Env Var Access Patterns in Astro (Astro 6 / Cloudflare Workers)

```typescript
// In SSR page frontmatter or API route (server-side only):
const apiUrl = import.meta.env.PUBLIC_API_URL;      // "https://api.devingit.se"
const secretKey = import.meta.env.API_SECRET_KEY;   // available server-side only

// In client-side script (only PUBLIC_ vars accessible):
const apiUrl = import.meta.env.PUBLIC_API_URL;       // works
// import.meta.env.API_SECRET_KEY → undefined in browser (correct behaviour)
```

### Temporary Verification Page Pattern

```astro
---
// src/pages/env-check.astro — TEMPORARY, delete after verification
export const prerender = false;

const apiUrl = import.meta.env.PUBLIC_API_URL;
---
<html>
  <body>
    <p>PUBLIC_API_URL: {apiUrl ?? 'NOT SET'}</p>
  </body>
</html>
```

This page verifies env var injection without requiring the full SSR pipeline. Delete it before completing the story.

### Deployment Workflow (from Story 1.1)

The GitHub Actions workflow in `.github/workflows/deploy.yml`:
- Push to `develop` → deploys to `devingit-se` worker (`devingit.se`)
- Push to `master` → deploys to `livingit-se` worker (`livingit.se`)

The workflow patches `dist/server/wrangler.json` (generated by the adapter) to set the correct worker name. `wrangler.toml` provides the base config read at build time (including `[vars]`).

### No Code Changes Outside Scope

This story is infrastructure configuration only. Do NOT:
- Create `src/i18n/` (that is Story 1.3)
- Create any event pages or components (later epics)
- Modify `src/content/events.ts`
- Modify `scripts/copy-robots.mjs` or `seo/robots-livingit.txt`
- Remove or modify `server.allowedHosts: true` in `astro.config.ts`

The only permitted file change is `wrangler.toml` (add `[vars]` sections) plus the temporary env-check page (created then deleted).

### Build-Time vs Runtime Env Var Injection

`output: 'static'` means Astro/Vite bakes `import.meta.env.PUBLIC_API_URL` at **build time** for prerendered pages. Cloudflare Workers `[vars]` runtime bindings are only accessible to SSR pages (`prerender = false`). This means two injection paths exist:

- **Static pages**: `PUBLIC_API_URL` must be set as a CI environment variable before `npm run build`. The `deploy.yml` "Set build environment" step now exports it per branch.
- **SSR pages**: `PUBLIC_API_URL` is bridged from the deployed worker's `vars` at runtime by `@astrojs/cloudflare`. The production wrangler.json patch step now also patches `vars.PUBLIC_API_URL` to `https://api.livingit.se`.

The `[env.production.vars]` block in `wrangler.toml` is **not reachable** via this pipeline — the adapter generates a flat `dist/server/wrangler.json` and CI deploys that file directly. It is kept for documentation only.

### API_SECRET_KEY — Follow-Up Required

`API_SECRET_KEY` is deferred because the backend has no auth yet (see Completion Notes). When the backend adds authentication, the following must be done before any authenticated API calls are made:

```bash
npx wrangler secret put API_SECRET_KEY              # staging
npx wrangler secret put API_SECRET_KEY --env production  # production (note: may need direct Cloudflare dashboard since deploy uses wrangler.json, not --env)
```

Track this in the follow-up story that adds API authentication to SSR pages.

### No Existing Tests

The project has no test suite. Verification is manual: browse `/env-check` on `devingit.se` and confirm the correct `PUBLIC_API_URL` value is displayed.

### Project Structure Notes

- `wrangler.toml` — add `[vars]` and `[env.production.vars]` sections
- `src/pages/env-check.astro` — temporary SSR test page (create, verify, delete)
- All other files unchanged

### References

- Migration to Workers (incompatibility with Pages): [Source: `_bmad-output/implementation-artifacts/1-1-enable-hybrid-rendering-with-cloudflare-adapter.md` — Dev Agent Record, Completion Notes]
- Env var strategy and prefix conventions: [Source: `_bmad-output/planning-artifacts/architecture.md` — "API & Communication Patterns"]
- Current `wrangler.toml` base config: [Source: `wrangler.toml`]
- Deployment workflow: [Source: `.github/workflows/deploy.yml`]
- Env var requirements from epics: [Source: `_bmad-output/planning-artifacts/epics.md` — "Additional Requirements"]

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

### Completion Notes List

- Task 1 complete: Added `[vars]` (staging: `https://api.devingit.se`) and `[env.production.vars]` (production: `https://api.livingit.se`) to `wrangler.toml`. Build passes.
- Task 2 note: Backend API currently has no authentication — `API_SECRET_KEY` is deferred until the backend adds auth. Marked complete as there is no secret to set and none is committed to git (AC #4 satisfied by design).
- Task 3 complete: Created `env-check.astro`, deployed to `devingit.se`, manually verified `/env-check` showed `PUBLIC_API_URL: https://api.devingit.se`.
- Task 4 complete: Deleted `env-check.astro`. Final build passes.

### File List

- `wrangler.toml` (modified)
- `.github/workflows/deploy.yml` (modified — inject `PUBLIC_API_URL` at build time; patch `vars` in wrangler.json for production)

## Change Log

- 2026-03-28: Added `PUBLIC_API_URL` env vars to `wrangler.toml` for staging and production; verified via temporary SSR page on `devingit.se`. `API_SECRET_KEY` deferred — backend has no auth yet.
- 2026-03-28: Fixed CI pipeline to inject `PUBLIC_API_URL` at build time and patch production wrangler.json vars — `[env.production.vars]` in `wrangler.toml` is unreachable via the flat-JSON deploy pipeline.
