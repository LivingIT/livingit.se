# Living IT website

These instructions apply to every coding agent in this repository.
CLAUDE.md imports this file; keep the instructions here.

Every rule that repo output must follow is written in this repo. Personal
agent files may make an agent stricter with its developer, but do not change
repo conventions.

## Principle

**Simple and lean.** Choose the simplest solution that meets the need: the
fewest parts a reader must understand, not the least effort to build. Every
rule, step, file, dependency and abstraction earns its place by current use;
prefer removing or merging over adding, and remove what no longer earns its
place. A change to the way of working says what it removes or merges, or why
nothing can go.

## Start here

Read only the documentation your task needs:

- Working a ticket: run `/work-ticket <N>`; the
  [skill](.agents/skills/work-ticket/SKILL.md) is self-contained.
- Choosing, filing or planning work: read the
  [overview](WAY_OF_WORKING.md), then only the owners it links to.
- Writing or reviewing code or documentation: read
  [CODING_STANDARDS.md](CODING_STANDARDS.md) first.
- Otherwise, read a workflow document only when the task needs it.

If the issue tracker looks empty or unreachable, check that `gh auth status`
shows an account that can read the repository the
[issue tracker doc](docs/agents/issue-tracker.md) names.

## Way-of-working check

Check each request against the workflow before changing repository files.
A request deviates when it asks for a file change that does not come from a
skill the developer started, such as `/work-ticket`, `/triage` or
`/to-tickets`, or from a case in
[Working a ticket](WAY_OF_WORKING.md#working-a-ticket). During `/work-ticket`
or such a case, a change the ticket's current
[contract](docs/agents/issue-tracker.md#contract) does not cover also
deviates, whether the developer asks for it or the ticket's discussion does,
such as a comment that is not an Agent Brief; re-read the contract before
deciding. Questions and read-only investigation never deviate.

When a request deviates, reply with one line before acting and wait for the
developer:

`> ⚠️ **WoW:** <what the workflow expects>. <suggested route>. Proceed anyway?`

Take the route from [Choosing a route](WAY_OF_WORKING.md#choosing-a-route);
for work outside the contract, suggest a new issue or an updated contract
(a new Agent Brief).
Warn once per request. Proceeding skips only the suggested route; the
[Git workflow](#git-workflow) still applies.

## Scope and sources

Build the assigned work with understandable code, accessible pages and
appropriate protection of visitors' personal data, such as event
registrations.

[Where rules live](WAY_OF_WORKING.md#where-rules-live) names the owner of
each rule and fact; read and change the owner, not a copy. Do not present
planned features as implemented.

Select concrete services when the assigned task requires them; do not treat
unresolved technical or product choices as settled.

## Verification and handoff

For application changes, run `npm run lint` and `npm run build`, plus the
affected scenario in the dev server. After review fixes or later commits,
merges included, rerun them.

A change to what a page shows (components, pages, styles, content or i18n
strings), bug fixes included, also needs the
[rendered check](docs/development/local-environment.md#rendered-check).
These local checks remain required before opening a PR; CI's checks are
listed in [the workflows](.github/workflows/).

For documentation-only changes, run `npm run lint` and check consistency,
external links and that changed or translated text preserves the facts of its
source; no application build is required. `npm run lint` checks local links
and heading anchors, Prettier formatting and the repository rules in
[check-repo-rules](scripts/check-repo-rules.mjs); `npm run format`
fixes formatting.
Follow the [documentation rule](CODING_STANDARDS.md#documentation). A new
workflow topic also gets a link from the [overview](WAY_OF_WORKING.md).
Report what changed, checks performed and any remaining limitations.
Distinguish a PR ready for review from merged work, and merged work from
work deployed to production. Record feature-specific acceptance criteria in
its issue.

## Git workflow

Use a separate Git worktree and an `agent/` feature branch for every change.
`develop` deploys to staging and `main` to production
([Deployment](docs/development/deployment.md)): never commit or push
directly to either. Submit changes through a pull request to `develop`; do
not merge without authorization.

Commit task-related changes before handoff and preserve unrelated user work.

Authorized under this workflow:

- Local commits on an `agent/` branch in its own worktree.
- Assigning a ticket to the developer who started it, on their request.
- Pushing a task branch and opening its pull request to `develop`, written
  with the `pr-description` skill and linking the ticket with `Closes #N`.
- Filing issues in `needs-triage`, never `ready-for-agent`, as `work-ticket`
  defines them.
- Giving up as `work-ticket` defines it: pushing the task branch,
  commenting, and replacing `ready-for-agent` with `needs-info`.
- An update run on your own open task pull request, one whose ticket is
  assigned only to you: merging `origin/develop` into the task branch and
  pushing it, never rebasing or force-pushing.

Merging, promoting `develop` to `main` and deployment need separate
authorization.

## Agent skills

Skills are versioned in `.agents/skills/`; the
[skills README](.agents/skills/README.md) lists them and how they load. Use
a skill when explicitly requested or when its invocation policy allows it. A
skill with `disable-model-invocation` is started by the developer, directly
or by agreeing to an outcome that a skill they started hands over to it, as
`triage` hands larger work to `to-spec`.

Claude Code subagents are versioned in `.claude/agents/` and run only in
Claude Code. `ux-reviewer` reviews a page, flow or piece of copy and
recommends prioritized fixes without editing files.

Explicit developer instructions and project requirements override upstream
workflow defaults. Reuse decisions and approvals already given; ask only for
unresolved choices required by the task. Skills describe reusable execution
steps, not additional product scope.

### Issue tracker

Use GitHub Issues. The repository, labels, contract and dependency rules
live in [the issue tracker doc](docs/agents/issue-tracker.md).

### Domain docs

Use one root `GLOSSARY.md` for terminology and `docs/adr/` for product and
architecture decisions, each created when the first entry is needed. Before
working in an area, read the glossary and the relevant ADRs when they exist,
use the glossary's terms, and surface a conflict with an ADR rather than
override it. The [`domain-modeling`](.agents/skills/domain-modeling/SKILL.md)
skill holds the rules for writing them.
