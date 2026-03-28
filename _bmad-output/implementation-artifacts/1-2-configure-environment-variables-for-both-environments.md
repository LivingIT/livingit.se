# Story 1.2: Configure Environment Variables for Both Environments

Status: in-progress

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
- [ ] Set `API_SECRET_KEY` as Workers secrets via `wrangler secret put` (AC: #3, #4)
  - [ ] Run `npx wrangler secret put API_SECRET_KEY` (staging, no `--env` flag)
  - [ ] Run `npx wrangler secret put API_SECRET_KEY --env production` (production)
  - [ ] Confirm secret does NOT appear in `wrangler.toml` or any committed file
- [ ] Create temporary SSR verification page (AC: #5)
  - [x] Create `src/pages/env-check.astro` with `export const prerender = false`
  - [x] Page reads `import.meta.env.PUBLIC_API_URL` in frontmatter and renders it in the body
  - [ ] Deploy to `devingit.se` and browse `/env-check` — confirm `https://api.devingit.se` is shown
- [ ] Delete verification page (AC: #5)
  - [ ] Remove `src/pages/env-check.astro` after confirming env vars work
  - [ ] Confirm build still passes without the test page

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

- Task 1 complete: Added `[vars]` (staging) and `[env.production.vars]` (production) sections to `wrangler.toml`. Build passes.
- Task 3 (partial): Created `src/pages/env-check.astro` with `prerender = false`; reads `PUBLIC_API_URL` and renders it. Build passes.
- HALTED: Task 2 requires interactive `wrangler secret put` commands (user must provide `API_SECRET_KEY` value). Task 3 deployment verification requires user to deploy and browse `/env-check`. Task 4 depends on Task 3 verification.

### File List

- `wrangler.toml` (modified)
- `src/pages/env-check.astro` (created, temporary — to be deleted after verification)
