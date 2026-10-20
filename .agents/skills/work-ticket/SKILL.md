---
name: work-ticket
description: "Work one ticket from pick to pull request, or bring your own conflicting pull request back to mergeable with an update run. Argument: the issue number; without one, list the tickets that can be started."
disable-model-invocation: true
---

Work one ticket to an open pull request, or [give up](#giving-up) on it with
a question on the ticket. The repository, labels, the
[contract](../../../docs/agents/issue-tracker.md#contract) and the
[qualifying rules](../../../docs/agents/issue-tracker.md#qualifying-tickets)
are in the [issue tracker doc](../../../docs/agents/issue-tracker.md); run
`gh` against that repository. Permissions and checks are in
[AGENTS.md](../../../AGENTS.md).

Choose implementation details yourself, within the contract and the docs
that govern the area. Ask the developer when a choice would change the
contract or conflict with a governing doc.

## 1. Clean up

From the main checkout, run `git fetch --prune origin`. If it is on `develop`
with a clean status, run `git merge --ff-only origin/develop`; otherwise tell
the developer why it was left alone. Never reset, stash or switch branches.

For each other worktree on an `agent/` branch, read its merged pull request
with `gh pr list --head <branch> --state merged --json headRefOid`. When there
is one, the worktree has no local changes and its `HEAD` equals
`headRefOid`, remove it with `git worktree remove`, then `git branch -D`
(squash merges make `-d` refuse; the `headRefOid` match proves nothing is
lost). Report each worktree you keep, and why.

Done when `develop` is fast-forwarded or reported, and every `agent/`
worktree is removed or reported.

## 2. Pick

Without a number, list the qualifying tickets: run the query in the issue
tracker doc, then check each result's "Blocked by" text and body rules as it
says. Also list open `ready-for-agent` tickets assigned only to you
(`--assignee @me`), such as one back from `needs-info`. Stop; the
developer chooses.

With a number, read the issue and its comments. A `spec` is never worked:
refuse, and offer `/to-tickets` on it. Check each qualifying rule; if one
fails, name it, and the other assignees when it is the "no assignee" rule,
then stop. When the ticket is already assigned only to you and has an open pull
request on a branch starting `agent/<N>-`, read
`gh pr view <PR> --json mergeable`, reading again after a few seconds while
it is UNKNOWN. On CONFLICTING do an [update run](#update-run) instead of the
steps below; on MERGEABLE report that there is nothing to update; if it stays
UNKNOWN, say so and ask the developer to run again later. Then stop.

Done when one ticket is chosen, an update run is due, or you have said why
nothing can start.

## 3. Claim

Skip this when the ticket is already assigned only to you. Otherwise get
your login with `gh api user --jq .login`, run
`gh issue edit N --add-assignee <login>` and re-read the assignees. If the
command fails or you are not among them, name the login, list the other
accounts from `gh auth status`, and stop. If anyone else is also assigned,
remove yourself, name them and stop.

Done when you are the ticket's only assignee.

## 4. Worktree

Reuse a clean worktree on a branch starting `agent/<N>-`. Otherwise fetch
`origin`. The new worktree is a sibling of the main checkout, named after
its directory: `../<dir>-<N>`. If `origin` has such a branch, from an
earlier give-up, run `git worktree add ../<dir>-<N> <branch>` and continue
its commits. If not, create `../<dir>-<N>` on a new branch `agent/<N>-<slug>` from
`origin/develop`, where the slug is two to four words from the title, and run
`git branch --unset-upstream`. Run `npm ci` in the new worktree. Work from
the worktree from here on.

Done when the working directory is the worktree, on the ticket's branch,
with a clean status.

## 5. Build

The ticket's [contract](../../../docs/agents/issue-tracker.md#contract) is
the work.

A documentation ticket, one that changes no application code, such as
documentation, agent instructions or a recorded decision (its content
decides this, not its kind label): edit the files directly against its
acceptance criteria.

Any other ticket: the repository has no automated test suite, so build
against the acceptance criteria and run `npm run build` regularly. Verify
each criterion by running the affected scenario in the dev server or reading
the built result, and note for the pull request how.

Commit to the current branch. Done when each acceptance criterion is met by
a commit, or noted for the pull request as one only a human can verify.

## 6. Review

Run `code-review` against `origin/develop`, with the ticket as the spec. Fix
the findings and commit, together with each small pre-existing defect you saw
in a file the pull request changes: one whose fix is a few lines and changes
nothing else. Both are
[within the contract](../../../docs/agents/issue-tracker.md#contract), so
fix them directly on the branch, under the current contract; a finding whose
fix needs behaviour the contract excludes stands. Run the
[rendered check](../../../docs/development/local-environment.md#rendered-check)
first when [required](../../../AGENTS.md#verification-and-handoff). Apply the
[checks AGENTS.md requires](../../../AGENTS.md#verification-and-handoff)
for this kind of change.
For the pull request, note each standing finding
and each pre-existing defect fixed. Any later commit except fixes to
review findings, including a merge, needs another `code-review` against a freshly
fetched `origin/develop`, and another rendered check when it
[changes what a page shows](../../../AGENTS.md#verification-and-handoff); a
give-up push needs neither.

List each other concrete defect you saw in material read for the ticket:
a larger pre-existing one, or one in a file the pull request does not
change. Ask the developer once which to fix here and which to file, with
your recommendation for each.

- **Fix here:**
  [change the contract](../../../docs/agents/issue-tracker.md#contract) to
  cover it, with the new brief's text approved in the session, then build and
  review it on the branch.
- **File:**
  [search first](../../../docs/agents/issue-tracker.md#searching-before-publishing).
  Comment the evidence on an open issue that covers it; otherwise file it
  with `gh issue create --label needs-triage --label <kind> --body-file -`,
  never `ready-for-agent`. Start the body with "Found while working #N."
  and give evidence: a file and line, or an issue number.

Keep ideas for the pull request's Notes.

Done when the checks pass, every finding is fixed or stands because the
contract excludes its fix, each standing finding and each pre-existing defect
fixed is noted, each other defect is fixed under an updated contract, filed
or commented, and no commit since the last review or rendered check needs
another.

## 7. Submit

Write the body with `pr-description`: `Closes #N`, the criteria only a human
can verify, any standing findings and pre-existing defects fixed, and any
issues filed and ideas. Run
`git push -u origin <branch>` and `gh pr create --base develop --body-file -`.
Report the URL and stop: merging, closing the ticket and promoting `develop`
to `main` belong to a maintainer.

## Update run

In the worktree on the pull request's branch (create it from `origin` if
missing; it must be clean and contain the pull request's `headRefOid`), run
`git fetch origin` and `git merge origin/develop`. Resolve each conflict so both
sides' intent survives, guided by any answer to an earlier give-up on the
ticket, commit the merge, do step 6, and run `git push origin <branch>`.
Never rebase or force-push; if the push is rejected, tell the developer and
stop.

Done when the push succeeds and the pull request's URL is reported.

## Giving up

Give up instead of opening a pull request when the acceptance criteria are
unclear or contradict the spec or the code, the checks cannot be made green,
or a conflict needs a judgement, and the developer cannot settle it in the
session. Commit any work in progress and push the branch; in an update run,
abort an unfinished merge and push nothing, and say in the comment if a
committed merge stays in the local worktree. Comment the specific question,
what was tried and a link to any pushed branch with
`gh issue comment N --body-file -`, then
`gh issue edit N --remove-label ready-for-agent --add-label needs-info`.
Report the comment's URL and stop.
