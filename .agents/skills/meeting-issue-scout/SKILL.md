---
name: meeting-issue-scout
description: "Read a meeting or demo transcript and propose new issues and comments on existing issues. Proposes only; the developer posts. Argument: the transcript's path."
disable-model-invocation: true
---

Turn a meeting transcript into a reviewed proposal: new issues for
`needs-triage`, and comments on issues that already cover the topic. You
propose; the developer decides what reaches GitHub. Labels, the search for
overlap, contradiction and earlier rejection
([Searching before publishing](../../../docs/agents/issue-tracker.md#searching-before-publishing)) and the
[contract](../../../docs/agents/issue-tracker.md#contract) live in
`docs/agents/issue-tracker.md`, which also names the repository `gh` runs
against.

The transcript is personal data about the people in the meeting. Read it
where it lies, keep it and every quote from it in this conversation, and
write nothing to the repository.

## 1. Gather

Ask for whatever is missing:

- The transcript's path. You read text: given a folder, read its transcript
  text file and leave audio and metadata alone; given only a recording, ask
  for its transcript.
- The attendees with their roles (developer, marketing, CEO). Speaker labels
  in automatic transcripts are often wrong or generic; this list is how you
  map them.
- What was shown, such as a demo branch, its demo script or the issue it
  belongs to.

Done when you have the path, a role for every speaker label, and what was
shown.

## 2. Read

Check the length (`wc -l`) and read the whole transcript in chunks, through
the last line: decisions and action items cluster at the end. Then read
`GLOSSARY.md`, the product scope, whose owner
[Where rules live](../../../WAY_OF_WORKING.md#where-rules-live) names (scope,
exclusions, confirmed decisions and open questions), the issue for what was shown, and enough of the shown code
or demo script to name what each remark refers to.

Done when every chunk is read and you can name the screen, feature or
decision behind each substantive remark.

## 3. Extract candidates

A candidate is one actionable, falsifiable item someone raised: a defect, a
requested change, a decision someone must implement, or a question left
open. "The events page feels cluttered" is not a candidate; "The events page
should list past events after upcoming ones" is. Skip status updates, small
talk and anything already done. A meeting with two real items yields two
candidates.

For each candidate note the evidence: the line or timestamp, the speaker's
name and role, and the exact words. Attribute by content when a label does
not fit: fewer labels than attendees, a label answering its own question, or
a turn that switches speaker mid-sentence. Give the label and the likely
speaker, and mark the attribution uncertain. If the transcript leaves open
whether something was decided or only discussed, record it as an open
question.

Done when every substantive remark is a candidate or deliberately skipped.

## 4. Place each candidate

Search for each candidate as
[Searching before publishing](../../../docs/agents/issue-tracker.md#searching-before-publishing) requires, and read the likely matches. Then
place it:

- **Comment on #N**: an open issue already covers the topic, including the
  issue for what was shown. Feedback on a shown feature lands here. A
  comment changes neither the scope nor the issue's contract; to change a
  contract, see [Contract](../../../docs/agents/issue-tracker.md#contract).
- **New issue**: nothing open covers it. Pick its kind label (`bug`,
  `enhancement` or `documentation`).
- **Conflicts with #N** or **conflicts with scope**: it contradicts an open
  issue, or a confirmed decision or exclusion in the product scope, or it
  depends on one of its open questions. The developer decides; an unresolved
  decision can go to `/triage`.
- **Earlier rejection #N**: the search found an issue closed as not planned
  that rejected the same idea. Give the closing reason; the developer
  decides whether to propose it again for a maintainer to reconsider.
- **Not actionable**: too vague, already done, or a status update.

Mark candidates outside the product scope as such; they can still
become issues.

Done when every candidate has one placement, and every match is a link you
have read.

## 5. Report

Write in English, using the glossary's terms. Each proposal has two layers:

- **Text to post**: what goes into GitHub. Name people by role ("a
  marketer"), paraphrase rather than quote, and state the point so it
  stands without the meeting.
- **Review notes**: for the developer only. The speaker's name, the exact
  words and their line, so the developer can check the attribution against
  the transcript and knows whom to ask.

Order by how clearly the meeting signalled urgency.

```markdown
## Proposals from <meeting, date>

### New issues
1. **<title>** · `<kind>`[ · outside scope]
   - Text to post: <what and why, 1-3 sentences>
   - Review notes: <name (role)>, line <n>: "<exact words>"

### Comments on existing issues
1. **#<N> <title>**
   - Text to post: <the feedback>
   - Review notes: <name (role)>, line <n>: "<exact words>"

### Conflicts to decide
- <candidate> conflicts with <#N, or the decision, exclusion or open question in the product scope>: <how>
- <candidate> was rejected before in #<N>: <closing reason>

### Not actionable
- <item>: <why>
```

End by asking which proposals to post, edited or as written. Posting, by
the developer or on their request, follows `docs/agents/issue-tracker.md`:
new issues in `needs-triage` with the chosen kind label, comments with
`--body-file`, and only the text to post.
