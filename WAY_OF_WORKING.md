# Delivery workflow

This document is the process for humans and the owner of what no skill owns:
roles, routing, decisions, the merge stage, where rules live and terms. How
each step runs is in its skill; labels, the contract and the queries are in
[the issue tracker doc](docs/agents/issue-tracker.md).

Everything enters through intake: `/triage` turns an idea, an issue or
meeting notes into a [contract](#terms), an issue whose scope, behaviour
and acceptance criteria are settled. `/work-ticket` takes a ready contract
along one straight path to a pull request to `develop`. A maintainer merges
it, which deploys staging, and later promotes `develop` to `main`, which
deploys production.

```text
┌─ INTAKE  (maintainer, /triage) ────────────────────────────────────────────┐
│ an idea, an issue, a defect, meeting-issue-scout proposals                 │
│ one ticket → /triage writes it                                             │
│ more than one → /to-spec → /to-tickets                                     │
│ a question for someone absent → needs-info                                 │
└──────────────────────────────────────┬─────────────────────────────────────┘
                                       │ contract: ready-for-agent
                                       ▼
┌─ /work-ticket N  (agent, for the developer) ───────────────────────────────┐
│ claim → worktree → build → review → open pull request to develop           │
│ out-of-scope defects → fixed here or filed, as the developer chooses       │
│ stuck → question on the ticket, needs-info                                 │
│ pull request conflicts → update run                                        │
└──────────────────────────────────────┬─────────────────────────────────────┘
                                       │ pull request
                                       ▼
┌─ MERGE  (maintainer) ──────────────────────────────────────────────────────┐
│ CI green, review, merge to develop → staging                               │
│ /triage the issues it filed and the Ideas worth keeping                    │
│ promote develop → main → production                                        │
└────────────────────────────────────────────────────────────────────────────┘
```

## Principles

The principle every route judges against, Simple and lean, is in
[AGENTS.md](AGENTS.md#principle).

1. **The contract is the interface.** Work is defined by an issue whose
   scope, behaviour and checkable acceptance criteria are settled. How it got
   there does not matter.
2. **Agents decide within the contract, and ask at its edges.** Agents
   choose implementation details within the contract and the governing docs.
   They ask the developer when a choice would change the contract or
   conflict with a governing doc.
3. **Humans own priorities, decisions and merges.** Agents own everything
   between a ready ticket and an open pull request.
4. **One place per rule.** Each rule is stated once, in the file whose name
   says it owns it. Other files link to it.
5. **Skills are steps, and all of them are ours.** Which skills the repo
   carries is in [the skills README](.agents/skills/README.md). Skills
   adapted from upstream are changed like any other file.
6. **Enforce by check what a check can enforce.** Prose is for judgement.

## Roles

Maintainers own priorities, product decisions and acceptance. A maintainer is
a role, not a person: any developer with admin rights acting to triage, answer
`needs-info`, decide scope, merge or promote to production; write "a
maintainer", not "the maintainer". Developers start the skills and own their
tickets. Agents implement and verify assigned work.

## Pipeline: idea to merged

Triage is the single intake: an idea told in free text, a bug report, a
small fix, a defect an agent found outside its ticket, or meeting feedback
that [`meeting-issue-scout`](.agents/skills/meeting-issue-scout/SKILL.md)
captures in `needs-triage`. Anyone filing an issue first
[searches for overlap and earlier rejection](docs/agents/issue-tracker.md#searching-before-publishing).
A maintainer runs [`/triage`](.agents/skills/triage/SKILL.md) on an idea,
an issue or the [triage queues](docs/agents/issue-tracker.md#triage) at any
time. Issue states and kinds are in
[Labels](docs/agents/issue-tracker.md#labels), and which tickets can be
started now in
[Qualifying tickets](docs/agents/issue-tracker.md#qualifying-tickets).

Dependabot updates bypass this pipeline: their own workflows build, merge
and promote them.

### Choosing a route

Work is routed by its size. Triage grills until checkable acceptance
criteria can be written without an open decision.

| Scenario              | Route                                                                                                                   |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| One ticket, clear     | File it as an issue; it enters triage, or a maintainer files it ready (see [State](docs/agents/issue-tracker.md#state)). |
| One ticket, fuzzy     | `/triage` writes the ticket.                                                                                            |
| More than one ticket  | `/triage` → `/to-spec` → `/to-tickets`, in one session, so the spec draws on the grilling.                              |

A spec is split whole; parts still undecided go back to triage. Specs live
only in issues; their durable outcomes go into their
[owners](#where-rules-live).

### Building and merging

A developer runs `/work-ticket <N>`, and its agent opens a pull request to
`develop` that closes the ticket. A maintainer checks CI is green, reviews
and merges, then runs `/triage` on the issues the pull request filed and on
the ideas worth keeping from the Ideas section of its
[description](.agents/skills/pr-description/SKILL.md). After checking
staging, a maintainer promotes `develop` to `main`, as
[Deployment](docs/development/deployment.md) says.

### Decisions

Triage, `/to-spec` and `/to-tickets` make no repo edits. Resolved terms and ADR text are
written out in the conversation, and the spec or ticket carries them. The ticket that
builds a decision carries "add glossary entry or ADR X, with this text" as an
acceptance criterion; a decision that contradicts existing code or docs gets
that change as a criterion on the same ticket or a separate one. Other
owners, such as the README's list of pages, change in the pull request that
makes them true.

## Working a ticket

This is the developer's side; what the agent does is in
[`work-ticket`](.agents/skills/work-ticket/SKILL.md).

**Starting.** In a fresh session in the main checkout, run
`/work-ticket <N>`, or run it without a number to see what you can start.
As [assignee](docs/agents/issue-tracker.md#assignees) you own the ticket
and its pull request until it is merged.

**When it moves to `needs-info`**, because your agent gave up, read the
ticket's latest comment: it names the question and links any pushed branch.
Get the answer into the [contract](docs/agents/issue-tracker.md#contract),
ask a maintainer to move the ticket back to `ready-for-agent`, and run
`/work-ticket <N>` again; work continues on the pushed branch.

**When the pull request conflicts** after a merge to `develop`, a maintainer
notifies you, for example with a pull request comment. Run
`/work-ticket <N>` again; it merges `develop` in with an
[update run](.agents/skills/work-ticket/SKILL.md#update-run).

**When CI is red or review asks for changes.** Maintainers merge only when
the pull request's [checks](.github/workflows/) are green and review is
done. A maintainer tells you, and you fix it in an interactive session on
the task branch. When a fix departs from the
[ticket's contract](docs/agents/issue-tracker.md#contract), change the
contract first, with the new brief's text approved in the session.

## Where rules live

Each file owns what its name says: the README what is built, the glossary
business terms, CODING_STANDARDS how code and documentation are written, and
code and configuration what they do. Other files link to the owner instead
of restating it. The owners that are not obvious from a name:

- The principle, agent permissions, the way-of-working check and the checks
  before a pull request: [AGENTS.md](AGENTS.md).
- The repository, labels, the contract, assignees, qualifying rules, triage
  queues and dependencies: [the issue tracker doc](docs/agents/issue-tracker.md).
- How each step runs: the skill that runs it, listed in
  [the skills README](.agents/skills/README.md).
- Glossary and ADR rules: [`domain-modeling`](.agents/skills/domain-modeling/SKILL.md).
- Local setup, content editing, the rendered check and deployment:
  [`docs/development/`](docs/development/).

## Terms

- **Contract**: what a ticket asks for. Which text that is is in
  [Contract](docs/agents/issue-tracker.md#contract).
- **Agent Brief**: the contract `triage` writes, as a comment headed
  `## Agent Brief` or as the body of an issue it files. A new one replaces it
  when the contract changes while the ticket is worked.
- **Owner**: the one file, or the code or configuration, that states the
  current answer for a topic.
- **Record**: a document that explains a past decision or past work: an ADR,
  or an issue or pull request with its comments. Records are not rewritten
  to current guidance.
- **Update run**: bringing your own conflicting pull request back to
  mergeable by merging `develop` into it.
- **Giving up**: ending work on a ticket without a pull request because a
  human must answer a question first.
- **Promotion**: merging `develop` into `main`, which deploys production.

The workflow is adapted from
[livingit-intelligence](https://github.com/LivingIT/livingit-intelligence/blob/master/WAY_OF_WORKING.md).
