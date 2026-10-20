# Issue tracker: GitHub

Issues and specifications live in LivingIT/livingit.se. Use the gh CLI from
the project worktree, with `--body-file` for multiline bodies and comments.

## Searching before publishing

Before publishing any issue, by a skill or by hand, search for overlap,
contradiction and earlier rejection, then read the likely matches:

```sh
gh issue list --state open --search '<key terms>'
gh issue list --state closed --search '<key terms> reason:"not planned"'
```

Read a not-planned match's closing explanation. Only a closure that rejected
the idea is an earlier rejection, and it is a candidate for a maintainer to
reconsider, not a rule that forbids the idea; a duplicate or other closure
says nothing about the idea itself.

Report each match with its link before publishing, and link related issues,
including earlier rejections, from the new one. Do not publish an issue that
duplicates or contradicts an open one; put the match to a maintainer instead. An issue found while working a
ticket follows
[`work-ticket`](../../.agents/skills/work-ticket/SKILL.md#6-review).

## Labels

Every issue carries labels on two axes: a **state**, which drives the
workflow, and a **kind**, which is informational only.

### State

Every open issue has exactly one state, except a spec, which carries none
or `on-hold`. An open issue that is not a spec and has no state counts as
`needs-triage`. Closed issues keep their labels.

| Label             | Meaning                                                                                                                                      | Set by                                                                                                                                                                         | Leaves by                                                                                                                                                  |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `needs-triage`    | Not yet worked into shape.                                                                                                                   | Anyone filing outside `to-tickets` and `triage`, except a maintainer filing a ready ticket: raw reports, issues from anyone else, and agents filing out-of-scope defects.    | `/triage` or a maintainer: to another state, or closed (`wontfix`, duplicate).                                                                             |
| `needs-info`      | An open question: waits on a human answer.                                                                                                   | Triage, when an answer must come from someone not in the session; `work-ticket` giving up, which swaps out `ready-for-agent`.                                                  | The answer lands in the contract; a maintainer moves it back to `needs-triage`, or directly to `ready-for-agent` or `ready-for-human`.                      |
| `ready-for-agent` | Fully specified; an agent may take it if unassigned and unblocked.                                                                           | `to-tickets`, triage; a maintainer filing an issue directly, with a kind label, when its body passes the [body rules](#qualifying-tickets).                                    | A merged PR closes it; giving up moves it to `needs-info`; `wontfix`.                                                                                      |
| `ready-for-human` | Specified, but a person must do it (secrets, admin, copy or design judgement).                                                               | Triage; `to-tickets` when a maintainer says so.                                                                                                                                | Closed when done; to `ready-for-agent` if an agent can do it. Never qualifies for `work-ticket`.                                                           |
| `on-hold`         | Deferred by a maintainer until a stated condition. Open, but not to be worked or triaged. The issue says why and until when.                 | A maintainer, replacing any state it had. An issue never carries `on-hold` together with another state, so `ready-for-agent` is removed when it is set.                       | When the condition no longer holds, a maintainer moves a ticket to `needs-triage` and removes `on-hold` from a spec, or closes it.                          |
| `wontfix`         | Will not be done. Closed as not planned, with the reasoning in the closing comment (see [Triage](#triage)).                                  | A maintainer.                                                                                                                                                                  | Final; a reopened issue goes to `needs-triage`.                                                                                                            |

There is no blocked state; blocking is recorded as a dependency (see
[Dependencies](#dependencies)). `on-hold` is a decision to defer, not a
dependency on other work. On a spec, `on-hold` means it is not split into
tickets.

### Kind

Every issue has exactly one kind label; triage gives one to an issue filed
without. Kinds are informational: no rule or query depends on them, except
that a spec is never worked directly.

| Label           | Meaning                                                                  |
| --------------- | ------------------------------------------------------------------------ |
| `bug`           | Something is broken.                                                     |
| `enhancement`   | A new feature or improvement.                                            |
| `documentation` | Documentation, agent instructions or a recorded decision.                |
| `spec`          | The issue is a spec. It is split into tickets and never worked directly. |

Which tickets are built as documentation tickets is in
[`work-ticket`](../../.agents/skills/work-ticket/SKILL.md#5-build). Native
GitHub issue types are not used. The GitHub default labels `duplicate`,
`good first issue`, `help wanted`, `invalid` and `question` are not part of
the workflow.

### Specs

`to-spec` applies only `spec`. `-label:spec` keeps an open spec out of the
qualifying and triage queries. How a spec is split and closed is in
[`to-tickets`](../../.agents/skills/to-tickets/SKILL.md).

An issue's labels and its open/closed state are its only workflow state;
change them on purpose. When publishing an approved issue that requires one
of these labels, check whether it exists and create it if missing as part of
that authorized publication. Do not rename or delete unrelated labels.

## Contract

An issue's contract is its latest comment headed `## Agent Brief`; without
one, its body. Other comments, including meeting feedback, are discussion: a
decision recorded only there is not part of the contract. To change the
contract, post a new complete Agent Brief, or edit the body while no brief
exists.

A contract settles the change's scope, behaviour and acceptance criteria.
Implementation details are left to the agent, within the contract and the
documents that govern the area. Two kinds of fix are therefore within the
contract: a defect in the lines and behaviour the pull request's diff
changes, such as a review finding, unless the fix needs behaviour the
contract excludes; and a small pre-existing defect in a file the pull
request already changes, as
[`work-ticket`](../../.agents/skills/work-ticket/SKILL.md#6-review) says.

Issues are [records](../../WAY_OF_WORKING.md#terms): they do not own
enduring product or workflow facts, which live in their
[owners](../../WAY_OF_WORKING.md#where-rules-live). A ticket's current
contract governs the change it requests: it links existing facts to their
owners and describes how the change should differ from them. `triage` writes briefs
in the format of its
[AGENT-BRIEF.md](../../.agents/skills/triage/AGENT-BRIEF.md).

A contract for a ticket that changes site copy gives the new text in both
Swedish and English, or says which language a maintainer will supply; an
agent does not invent published copy.

## Assignees

An assigned issue belongs to its assignee, whatever its state. Anyone else
who triages, splits, relabels or closes it agrees with the assignee first.
Tickets split from it are published unassigned, like any other ticket, and
are claimed as usual.

## Qualifying tickets

A ticket qualifies when it is open, labelled `ready-for-agent`, not labelled
`spec`, has no assignee, all its blocking issues are closed, and its contract
passes the body rules: it has acceptance criteria (an "Acceptance criteria"
section, or the brief's acceptance criteria list) with at least one checkable
criterion, and leaves no deferred decision about scope or behaviour (no
text that defers one, such as "until decided", and no open question about
them that it does not answer). Its content decides this, not its kind label;
the rule applies to tickets a maintainer files directly too.
Glossary and ADR text that a contract carries passes the rules of
[`domain-modeling`](../../.agents/skills/domain-modeling/SKILL.md): an ADR
meets [When to offer an ADR](../../.agents/skills/domain-modeling/ADR-FORMAT.md#when-to-offer-an-adr),
and a glossary entry meets
[Capture glossary terms as they resolve](../../.agents/skills/domain-modeling/SKILL.md#capture-glossary-terms-as-they-resolve)
and the [glossary format](../../.agents/skills/domain-modeling/GLOSSARY-FORMAT.md#rules).

A ticket assigned only to the developer starting it, for example after
their agent gave up on it, is exempt from the "no assignee" rule and no
other. Claiming is in
[`work-ticket`](../../.agents/skills/work-ticket/SKILL.md#3-claim).

This query applies every rule except blockers recorded only as "Blocked by"
text and the body rules; check those by reading each result's contract:

```sh
gh issue list --search 'is:open label:ready-for-agent -label:spec no:assignee -is:blocked sort:created-asc'
```

## Triage

When a maintainer runs `/triage` is in the
[pipeline](../../WAY_OF_WORKING.md#pipeline-idea-to-merged); what it does is
in [`triage`](../../.agents/skills/triage/SKILL.md). These queries list what
waits on triage: open issues in `needs-triage` or with no state, then those
in `needs-info`.

```sh
gh issue list --search 'is:open -label:spec -label:needs-info -label:ready-for-agent -label:ready-for-human -label:on-hold -label:wontfix sort:created-asc'
gh issue list --search 'is:open label:needs-info sort:created-asc'
```

## Dependencies

Record a dependency as a native GitHub issue dependency ("blocked by") where
available; otherwise list the blocking issues under a "Blocked by" heading in
the body. Add native edges with `gh issue create --blocked-by <N>,<M> ...`,
or `gh issue edit <N> --add-blocked-by <M>` afterwards. A ticket qualifies
only when the blocking issues recorded either way are all closed. Read native blockers with GraphQL
`issue(number:N){blockedBy(first:20){nodes{number state}}}`.

A ticket split from an existing issue, such as a spec, is that issue's
sub-issue: `gh issue create --parent <parent> ...`, or
`gh issue edit <parent> --add-sub-issue <N>` afterwards.

Git branching, PR and merge rules are defined in [AGENTS.md](../../AGENTS.md).
