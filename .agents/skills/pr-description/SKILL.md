---
name: pr-description
description: "Use when writing a PR body."
---

Use this template for the PR body. Keep it short, skip preambles, and use the terms in `GLOSSARY.md`.

```markdown
## TLDR

<What this PR changes, in a few sentences. Name anything not verified.>

Closes #N

## How to test

1. Check out the branch, run `npm run dev` and open `http://localhost:5000/<path>`; compare with [staging](https://devingit.se/<path>), which runs `develop`.
2. <One action, using the UI's exact labels.>
   - <What the reviewer should see.>

<The expected visible change, or "No visible change from `develop` is expected.">

<details>
<summary><b>Problem</b></summary>

<What was wrong or missing, and for whom.>

</details>

<details>
<summary><b>Solution</b></summary>

<What this PR changes and why this approach. Note deliberate behaviour changes.>

</details>

<details>
<summary><b>Testing</b></summary>

<Only what CI and the diff do not show: what was not verified and why, evidence beyond the required checks, and required checks that failed or were skipped.>

</details>

<details>
<summary><b>Rendered check</b></summary>

<Only when the rendered check ran or moved to How to test: the pages, languages and widths checked, the tool used, and anything that differs from the intended design with its reason; or why the check moved. No screenshots.>

</details>

## Notes

<Risks and open questions for reviewers.>

### Standing findings

<Review findings left standing because the contract excludes their fix, each quoting the contract text it conflicts with, so a reviewer can decide whether the contract should change.>

### Pre-existing defects fixed

<Small defects that predate this PR, fixed in files it already changes: each file and what was wrong.>

### Issues filed

<Links to issues filed in `needs-triage`, or commented on, while working the ticket.>

### Ideas

<Suggestions not filed as issues.>
```

Write How to test when a reviewer can try the change in the browser, and cover there the acceptance criteria only a human can verify. There are no pull request previews; the environments are in [Deployment](../../../docs/development/deployment.md). Link staging only when the page exists there.

Write one `Closes #N` line per ticket the PR completes. Elsewhere in the body, never put a closing keyword (close, closes, closed, fix, fixes, fixed, resolve, resolves, resolved) directly before an issue reference: GitHub closes that issue on merge. Write "#14 can be closed after merge", not "Close #14".

Drop a section that has nothing to say, and a heading left with nothing under it. Report only what was done and run.
