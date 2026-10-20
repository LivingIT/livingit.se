# Local development environment

How to run, edit and check the site on your machine. Environments and
deploys are in [Deployment](deployment.md).

## Setup and startup

Install Node.js 24, the version CI uses, then:

```sh
npm ci
npm run dev
```

Create `.env` with the variables in the [README](../../README.md#environment-setup)
first; the Turnstile test keys there always pass. The dev server listens on
`http://localhost:5000` and on the local network. Swedish pages are served
at `/`, English ones under `/en`.

Event pages, registration and purchase call the staging API named by
`PUBLIC_API_URL`, so they need a valid `API_SECRET_KEY`; everything else
works without it. Never point a local server at the production API.

## Content and images

Site configuration and navigation are in `src/config.ts`, page content in
`src/content/`, and interface strings for both languages in `src/i18n/`.
The recurring events presented on the events page are in
`src/content/events.ts`; bookable events, with registration and tickets,
come from the API.

A content image needs three sizes, at the same path under
`public/images/desktop/`, `public/images/tablet/` and
`public/images/mobile/`; reference it with `getResponsiveImage()` from
`src/config.ts`.

## Checks

- `npm run lint`: local links and heading anchors in Markdown, Prettier
  formatting, and the
  [repository rules](../../scripts/check-repo-rules.mjs). `npm run format`
  fixes formatting.
- `npm run build`: the production build into `dist/`. It also copies the
  `robots.txt` for the environment from `seo/`, blocking crawlers when
  `ROBOTS_ENV`, `CF_PAGES_BRANCH` or `NODE_ENV` names a development
  environment.

There is no automated test suite. Which checks a change needs is in
[Verification and handoff](../../AGENTS.md#verification-and-handoff).

## Rendered check

The rendered check looks at a change in a real browser. When it is required
is in [Verification and handoff](../../AGENTS.md#verification-and-handoff),
and when it runs in
[`work-ticket`](../../.agents/skills/work-ticket/SKILL.md#6-review). The
agent runs it; the developer does the setup once.

### Setup

- Chrome with the Claude in Chrome extension, signed in to the same claude.ai
  account as Claude Code.
- Chrome enabled in Claude Code: `/chrome`, or start with `claude --chrome`.
- The extension allowed on `localhost` and `127.0.0.1`.
- A working local environment ([Setup and startup](#setup-and-startup)). The
  agent starts the dev server when none runs.

### Guardrails

- Work in a new tab only, on the local site.
- Never submit an event registration or purchase against the API: it creates
  real records in the backend. Check forms up to their validation.
- Never trigger `alert`, `confirm` or `prompt`.

### Coverage

Check every page the change touches, in Swedish and English, at 1280 px for
desktop and 390 px for mobile:

- **Layout**: the page holds its layout at both widths, including the
  navigation and footer.
- **Copy**: each language shows its own text, with no missing or mixed
  strings, and the language switch leads to the same page.
- **Keyboard**: a Tab walk through the changed controls, each with visible
  focus.
- **Labels and feedback**: each changed control has a label and shows its
  feedback, such as a validation error.
- **Console**: no new errors.

### Fallback

Without Claude in Chrome, a throwaway Playwright script outside the
repository covers the same list. Without any browser, the pull request says
so and moves the check to "How to test". The check is never skipped
silently.

### Findings

- A defect the change caused is fixed on the branch.
- An existing defect is handled as `work-ticket`'s
  [Review step](../../.agents/skills/work-ticket/SKILL.md#6-review) says.
