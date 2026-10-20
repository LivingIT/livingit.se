# Coding standards

The rules for writing and reviewing code and documentation in this
repository. The `code-review` Standards axis checks changes against this file.
Code and documentation follow the [Simple and lean](AGENTS.md#principle)
principle.

## Writing

Write documentation, issues, code, commits and pull requests in English.
Site copy is written in Swedish and English, as
[Languages](#languages) says. Preserve the facts of the source when
rewriting, translating or summarising text.

Use "-" where an em dash would go; never write an em dash. `npm run lint`
checks this.

## Documentation

Each topic has one owner; see
[Where rules live](WAY_OF_WORKING.md#where-rules-live). An owner states the
current answer. When the answer changes, rewrite the owner in place, without
a change log, dates of earlier versions or an account of what changed; Git
history keeps the earlier text. A change updates the topic's owner and every
reference it affects. Other documents link to the owner instead of repeating
its rules or facts. Refer to a section by an anchor link to its heading, not
by its quoted name, so lint catches a renamed heading.

An owner may keep provenance next to its current guidance when it serves the
same reader: the source, licence or upstream revision of what it describes,
or the record a fact comes from. Provenance is not what earlier text said or
when it changed.

Records explain past decisions and work and are not rewritten to current
guidance; see [Terms](WAY_OF_WORKING.md#terms). How ADRs change is in
[ADR format](.agents/skills/domain-modeling/ADR-FORMAT.md#changing-an-existing-adr).

## Technology and code

- Use Astro with its Cloudflare adapter, TypeScript and Tailwind 4. Write
  components as `.astro` files; do not add a UI framework, component library
  or client-side state library unless explicitly requested.
- Keep site content as typed data in `src/content/` and interface strings
  in `src/i18n/`, not hard-coded in pages or components.
- Call the backend API only from server code (API routes and server-rendered
  pages) through `apiFetch`, so `API_SECRET_KEY` never reaches the browser.
  Only `PUBLIC_` variables may be read in client code.
- Protect a new public form that reaches the backend with Turnstile,
  verified on the server, as event registration does.
- Use explicit, straightforward domain types, such as those in
  `src/types/api.ts`.

## Languages

Swedish is the default locale, served without a prefix; English mirrors each
page under `/en` with the same slug. A change to a page or its copy updates
both languages in the same pull request, and links between pages keep the
visitor's language.

## Interface and accessibility

Use semantic HTML and native controls first. Account for keyboard operation,
focus management, visible focus, headings, form labels, accessible names,
contrast and reduced-motion preferences where relevant. Set the page
language, and mark content in another language with its own `lang`.

Use Tailwind utilities, and CSS custom properties in `src/styles/globals.css`
for design tokens. Use kebab-case for custom classes and IDs. Give every
content image its three responsive sizes and alt text.
