---
title: Getting Started
description: Install and use the NestJS Skills with Claude Code and Codex.
---

<p class="doc-kicker">Guide · 5 minutes</p>

# Getting started

<p class="doc-lede">Install seven focused Agent Skills for project-aware implementation, safe Git publication, NestJS architecture and runtime decisions, and evidence-backed feature or codebase audits.</p>

## Requirements

- Node.js 20 or newer for repository validation and the documentation site.
- Claude Code, Codex, or another client that supports the open [Agent Skills specification](https://agentskills.io/specification).
- A NestJS repository to inspect. Every skill in this collection is scoped to NestJS work.

## Install

Install the collection with the `skills` CLI:

```bash
npx skills add amirtaherkhani/nestjs-skills
```

To install a single skill for Claude Code and Codex:

```bash
npx skills add amirtaherkhani/nestjs-skills \
  --skill nestjs-professional-software-engineering \
  --agent claude-code \
  --agent codex
```

Preview the available skills without installing them:

```bash
npx skills add amirtaherkhani/nestjs-skills --list
```

Use `--global` for a user-level installation. Without it, the CLI installs into the project location expected by each selected agent.

## Published marketplace listings

The same open-format skills are available from three directories. Their listing links and installation routes are separate; a command for one source should not be assumed to work with another.

### Agensi.io

Agensi provides free ZIP downloads. Open a skill listing, choose **Download Free**, then use the agent-specific folder shown by the listing to place the extracted skill. If your agent is already running, restart it so it can discover the new files.

- [Professional Software Engineering](https://www.agensi.io/skills/nestjs-skills-professional-software-engineering)
- [Architecture and Principles](https://www.agensi.io/skills/nestjs-skills-architecture-and-principles)
- [OOP and Design Patterns](https://www.agensi.io/skills/nestjs-skills-oop-and-design-patterns)
- [Features, Scaling and Performance](https://www.agensi.io/skills/nestjs-skills-features-scaling-and-performance)
- [Code Audit](https://www.agensi.io/skills/nestjs-skills-code-audit)
- [Feature Audit](https://www.agensi.io/skills/nestjs-skills-feature-audit)
- [Git Commit and PR Messages](https://www.agensi.io/skills/nestjs-skills-git-commit-and-pr-messages)

### Skills.sh

[Browse the NestJS Skills collection on Skills.sh](https://www.skills.sh/amirtaherkhani/nestjs-skills). Skills.sh uses the Skills CLI with the GitHub repository as its source:

```bash
npx skills add amirtaherkhani/nestjs-skills
```

For one skill, choose the supported agent IDs explicitly. For example, to install Professional Software Engineering for Claude Code and Codex:

```bash
npx skills add amirtaherkhani/nestjs-skills \
  --skill nestjs-professional-software-engineering \
  --agent claude-code \
  --agent codex
```

For other compatible harnesses, use a target ID supported by the Skills CLI, or follow that harness's documented manual skill-folder instructions. The project-level folders used by the CLI include `.claude/skills/` for Claude Code and `.agents/skills/` for Codex; do not assume the same folder applies to every harness.

### Skillstore

Skillstore listings provide **Ask an Agent**, **CLI**, and **Manual** install choices. Follow the options shown on the specific listing you select: use its generated agent request, its displayed CLI command, or download the skill and place it in the selected agent's documented skills folder. These Skillstore choices are distinct from the GitHub-source command above.

- [nestjs-professional-software-engineering](https://skillstore.io/skills/amirtaherkhani-nestjs-professional-software-engineering)
- [nestjs-architecture-principles](https://skillstore.io/skills/amirtaherkhani-nestjs-architecture-principles)
- [nestjs-oop-design-patterns](https://skillstore.io/skills/amirtaherkhani-nestjs-oop-design-patterns)
- [nestjs-features-performance](https://skillstore.io/skills/amirtaherkhani-nestjs-features-performance)
- [nestjs-code-audit](https://skillstore.io/skills/amirtaherkhani-nestjs-code-audit)
- [nestjs-feature-audit](https://skillstore.io/skills/amirtaherkhani-nestjs-feature-audit)
- [nestjs-git-commit-pr-message](https://skillstore.io/skills/amirtaherkhani-nestjs-git-commit-pr-message)

See [public listings and posts](/guide/publications) for publication links and their current verification status.

::: tip Current release
[`v2.3.0`](https://github.com/amirtaherkhani/nestjs-skills/releases/tag/v2.3.0) includes all seven skills, executable examples for all 19 design-pattern entries, and documentation entry pages in five languages. It retains the standalone Code Audit guidance, three before/after HTTP fixtures, and opt-in evaluation harness. See [examples and evaluation](/guide/examples-and-evaluation) for the verified behavior and current measurement limits.
:::

::: warning Version 2 migration
`professional-software-engineering` was renamed to `nestjs-professional-software-engineering`, and `git-commit-pr-message` was renamed to `nestjs-git-commit-pr-message`. Reinstall the renamed skills and update explicit commands.
:::

## Invoke a skill

The descriptions are written for automatic activation, so a concrete request is usually enough:

```text
Implement this feature using the clearest syntax supported by the current project, then verify it.
```

You can also name a skill explicitly:

```text
# Claude Code
/nestjs-professional-software-engineering

# Codex
$nestjs-professional-software-engineering
```

The other skill names are:

- `nestjs-git-commit-pr-message`
- `nestjs-architecture-principles`
- `nestjs-code-audit`
- `nestjs-feature-audit`
- `nestjs-oop-design-patterns`
- `nestjs-features-performance`

## Add client engineering rules

The portable skill works in both clients. Optional repository-level templates make it the default engineering workflow. From this repository checkout:

```bash
# Codex
cp integrations/codex/AGENTS.md ./AGENTS.md

# Claude Code
cp integrations/claude/CLAUDE.md ./CLAUDE.md
```

Merge rather than overwrite when the project already has `AGENTS.md` or `CLAUDE.md`; the nearest project instructions must remain authoritative.

For a new feature, ask:

```text
Implement this feature using the clearest syntax supported by the current project.
Compare any syntactic sugar with the explicit form, preserve compatibility,
and run the relevant tests, type-check, lint, and build.
```

When the change is verified, publish it explicitly:

```text
$nestjs-git-commit-pr-message
Commit and push this NestJS change, open a draft PR, and verify the
matching CI and GitHub Pages workflow without merging.
```

The public documentation workflow deploys after every push to `main`. A feature-branch push runs validation but does not replace the production GitHub Pages site; the agent reports that merge or a main-branch push is still required.

## Audit a current project

From a NestJS project root, invoke the portable audit skill:

```text
$nestjs-code-audit
$nestjs-code-audit full src/payments
$nestjs-code-audit static
$nestjs-code-audit security src/auth
```

It runs a read-only workflow and returns one report covering safe syntax/TypeScript/lint checks plus verified architecture, object-design, security, testing, runtime, and delivery findings. It does not install dependencies or fix code.

Codex does not support arbitrary bare custom commands such as `/Nestjs audit`. Custom prompts are deprecated in favor of skills, but Codex CLI and the IDE extension still support them as explicit local aliases. Copy [`integrations/codex/prompts/nestjs-audit.md`](https://github.com/amirtaherkhani/nestjs-skills/blob/main/integrations/codex/prompts/nestjs-audit.md) into `~/.codex/prompts/`, then use:

```text
/prompts:nestjs-audit
/prompts:nestjs-audit full src/payments
```

## Audit one feature against its roadmap

Use Feature Audit when the expected state is a documented roadmap rather than general code quality:

```text
$nestjs-feature-audit "payments"
$nestjs-feature-audit "payments" --branch "release/2026-q3"
```

The skill defaults to `main`, preserves dirty work, allows only fast-forward branch updates, and stops before comparison when `docs/` has no clear feature roadmap. A roadmap supplied by the user can satisfy that gate.

For Codex compatibility, copy [`integrations/codex/prompts/audit_feature.md`](https://github.com/amirtaherkhani/nestjs-skills/blob/main/integrations/codex/prompts/audit_feature.md) into `~/.codex/prompts/`, then use:

```text
/prompts:audit_feature payments
/prompts:audit_feature payments on branch release/2026-q3
```

Bare `/audit_feature` is client-specific and works only when the host routes it to `nestjs-feature-audit`.

Continue with the [Feature Audit workflow guide](./feature-audit) for the roadmap gate, branch-safety rules, evidence categories, and exact report contract.

## Give the agent evidence

The skills deliberately begin with repository inspection. Better prompts identify the goal and constraints while leaving the agent access to the relevant code, configuration, tests, and runtime evidence.

```text
This endpoint misses its p95 latency target under the attached load test.
Trace the request, identify the limiting resource, and propose the smallest measured fix.
Preserve the public API and PostgreSQL transaction behavior.
```

Avoid prescribing a fashionable solution before diagnosis. “Add Redis,” “use microservices,” or “apply Clean Architecture” may hide the actual constraint.

## Validate a local checkout

```bash
npm install
npm test
npx skills add . --list
```

`npm test` validates skill metadata, links, and evaluation files, then builds every documentation route from the canonical skill sources.

## Next steps

- Use [Choose a skill](./choose-a-skill) to route work and understand intentional overlap.
- Read [Request lifecycle](/concepts/request-lifecycle) before selecting middleware, guards, pipes, interceptors, or filters.
- Open the complete [Architecture & Principles](/reference/architecture/) skill reference.
