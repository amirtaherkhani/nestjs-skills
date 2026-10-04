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

::: tip Current release
[`v2.2.0`](https://github.com/amirtaherkhani/nestjs-skills/releases/tag/v2.2.0) includes all seven skills, standalone Code Audit guidance, runnable examples, and an opt-in evaluation harness. See [examples and evaluation](/guide/examples-and-evaluation) for the verified behavior and current measurement limits.
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
