# Skills

The skills in this folder, how they load, where they come from and how they
are maintained. When to use them is in
[Agent skills](../../AGENTS.md#agent-skills).

Claude Code reads them through the `.claude/skills` symlink; on Windows,
enable Git symlinks (`core.symlinks`) before checkout. A reference to the
"Skill tool" means loading the named skill; to run a skill, follow its
`SKILL.md`.

The repo carries a skill only when its workflow invokes it, a skill it
carries calls it, or maintaining the repo's own skills and agent
instructions needs it. General development tools, such as prototyping,
debugging or session handoffs, are each developer's own.

All skills here are ours: the repo changes them like any other file.

## Adapted from livingit-intelligence

Taken from
[livingit-intelligence](https://github.com/LivingIT/livingit-intelligence/tree/master/.agents/skills),
together with the workflow they run. Each carries this repo's branches,
verification and site in place of that app's:

- `work-ticket`: works one ticket from pick to pull request. It branches
  from and targets `develop`, and builds without `tdd`, since this repo has
  no test suite.
- `pr-description`: the pull request body template, with local and staging
  links in place of previews.
- `meeting-issue-scout`: proposes issues and comments from a meeting
  transcript. It is adapted from Henrik Ljunggren's Claude Code agent of the
  same name.

## Adapted from mattpocock/skills

Taken from https://github.com/mattpocock/skills through livingit-intelligence,
including supporting files. License: MIT, full notice in
[LICENSE-mattpocock](LICENSE-mattpocock).

- Reviewing: `code-review`.
- Maintaining skills and agent instructions: `writing-for-agents`.
- Issue intake and specs: `triage`, `grilling`, which `triage` calls,
  `to-spec` and `to-tickets`. Apart from `grilling`, these carry this
  repo's rules directly: its label names, its contract and its search before
  publishing. Contracts and specs carry no test seams or design boards;
  `to-spec` names how each part is verified instead.
- `domain-modeling`, which carries this repo's rules for the glossary and
  ADRs.

`tdd` and `codebase-design`, which livingit-intelligence carries, are left
out until this repo has a test suite. A personal mattpocock-skills plugin
shows its own copies with a `mattpocock-skills:` prefix; this repo's skills
are the unprefixed ones.

## Maintenance

Upstream is a source of ideas, not of updates. When livingit-intelligence
or mattpocock/skills changes a skill we adapted, review the change and take
what we want, in part or not at all, like any other edit.

Follow [AGENTS.md](../../AGENTS.md) for Git workflow and instruction precedence.
