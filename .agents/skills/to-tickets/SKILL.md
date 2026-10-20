---
name: to-tickets
description: Split a spec into a set of tracer-bullet tickets, each declaring its blocking edges, published to the project issue tracker with native blocking links.
disable-model-invocation: true
---

# To Tickets

Split a spec into a set of **tickets**: tracer-bullet vertical slices, each declaring the tickets that **block** it. A single ticket comes from [`triage`](../triage/SKILL.md) instead.

The issue tracker, its labels and its operations are in the [issue tracker doc](../../../docs/agents/issue-tracker.md).

## Process

### 1. Gather context

Work from whatever is already in the conversation context. If the developer passes a reference (a spec path, an issue number or URL) as an argument, fetch it and read its full body and comments.

### 2. Explore the codebase (optional)

If you have not already explored the codebase, do so to understand the current state of the code. Ticket titles and descriptions should use the project's domain glossary vocabulary, and respect ADRs in the area you're touching.

Look for opportunities to prefactor the code to make the implementation easier. "Make the change easy, then make the easy change."

### 3. Draft vertical slices

Break the work into **tracer bullet** tickets.

<vertical-slice-rules>

- Each slice cuts a narrow but COMPLETE path through every layer it touches (content, API route, page): vertical, NOT a horizontal slice of one layer
- A completed slice is demoable or verifiable on its own
- Each slice is sized to fit in a single fresh context window
- Any prefactoring should be done first

</vertical-slice-rules>

Give each ticket its **blocking edges**: the other tickets that must complete before it can start. A ticket with no blockers can start immediately.

**Wide refactors are the exception to vertical slicing.** A **wide refactor** is one mechanical change (rename a column, retype a shared symbol) whose **blast radius** fans across the whole codebase, so a single edit breaks thousands of call sites at once and no vertical slice can land green. Don't force it into a tracer bullet; sequence it as **expand–contract**. First expand: add the new form beside the old so nothing breaks. Then migrate the call sites over in batches sized by blast radius (per package, per directory), each batch its own ticket blocked by the expand, keeping CI green batch to batch because the old form still exists. Finally contract: delete the old form once no caller remains, in a ticket blocked by every migrate batch. When even the batches can't stay green alone, keep the sequence but let them share an integration branch that all block a final integrate-and-verify ticket; green is promised only there.

### 4. Quiz the developer

Present the proposed breakdown as a numbered list. For each ticket, show:

- **Title**: short descriptive name
- **Blocked by**: which other tickets (if any) must complete first
- **What it delivers**: the end-to-end behaviour this ticket makes work

Ask the developer:

- Does the granularity feel right? (too coarse / too fine)
- Are the blocking edges correct: does each ticket only depend on tickets that genuinely gate it?
- Should any tickets be merged or split further?

When the source is an issue labelled `spec`, also say that the spec will be closed once every ticket is published; approving the breakdown approves that close.

Iterate until the developer approves the breakdown.

### 5. Publish the tickets

Publish the approved tickets to the issue tracker, one issue per ticket, in dependency order (blockers first) so each ticket's blocking edges can reference real issue numbers. Search first as [Searching before publishing](../../../docs/agents/issue-tracker.md#searching-before-publishing) says. For each ticket:

- Use the issue template below.
- Apply `ready-for-agent`, or `ready-for-human` when a maintainer says a person must do it, and one kind label: `bug`, `enhancement` or `documentation`. The tickets are agent-grabbable by construction.
- Set its blockers as native dependencies, as [Dependencies](../../../docs/agents/issue-tracker.md#dependencies) says; use the "Blocked by" section only for an edge that cannot be set natively.
- When the ticket builds a decision settled in triage, give it the acceptance criteria [Decisions](../../../WAY_OF_WORKING.md#decisions) describes, with the glossary or ADR text in full.
- If the source was an existing issue, make the ticket its sub-issue, as [Dependencies](../../../docs/agents/issue-tracker.md#dependencies) says.

Work the **frontier**: any ticket whose blockers are all done. For a purely linear chain that means top to bottom.

When the source is an issue labelled `spec` and every approved ticket is published and added as its sub-issue, close the spec as completed with a comment listing the tickets: `gh issue close <N> --reason completed --comment "Split into #A, #B, #C."`. If publishing stops partway, leave the spec open.

Apart from adding sub-issues and closing a split spec, do NOT close or modify any parent issue.

<issue-template>

## Parent

A reference to the parent issue on the tracker (if the source was an existing issue, otherwise omit this section).

## What to build

The end-to-end behaviour this ticket makes work, from the user's perspective, not layer-by-layer implementation.

## Acceptance criteria

- [ ] Criterion 1
- [ ] Criterion 2

## Blocked by

- A reference to each blocking ticket, or "None (can start immediately)". Omit this section when blockers were set as native edges.

</issue-template>

Avoid specific file paths or code snippets: they go stale fast. Exception: if a prototype produced a snippet that encodes a decision more precisely than prose can (state machine, reducer, schema, type shape), inline it and note briefly that it came from a prototype. Trim to the decision-rich parts, not a working demo, just the important bits.
