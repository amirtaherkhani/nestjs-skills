---
title: Getting Started
description: Install and use the NestJS Agent Skills with Claude Code and Codex.
---

<p class="doc-kicker">Guide · 5 minutes</p>

# Getting started

<p class="doc-lede">Install five focused Agent Skills for project-aware implementation, safe syntactic sugar, NestJS architecture and runtime decisions, and read-only codebase audits.</p>

## Requirements

- Node.js 20 or newer for repository validation and the documentation site.
- Claude Code, Codex, or another client that supports the open [Agent Skills specification](https://agentskills.io/specification).
- A software repository to inspect. The professional skill is framework-neutral; the other four skills require a NestJS project.

## Install

Install the collection with the `skills` CLI:

```bash
npx skills add amirtaherkhani/nestjs-agent-skills
```

To install a single skill for Claude Code and Codex:

```bash
npx skills add amirtaherkhani/nestjs-agent-skills \
  --skill professional-software-engineering \
  --agent claude-code \
  --agent codex
```

Preview the available skills without installing them:

```bash
npx skills add amirtaherkhani/nestjs-agent-skills --list
```

Use `--global` for a user-level installation. Without it, the CLI installs into the project location expected by each selected agent.

## Invoke a skill

The descriptions are written for automatic activation, so a concrete request is usually enough:

```text
Implement this feature using the clearest syntax supported by the current project, then verify it.
```

You can also name a skill explicitly:

```text
# Claude Code
/professional-software-engineering

# Codex
$professional-software-engineering
```

The other skill names are:

- `nestjs-architecture-principles`
- `nestjs-code-audit`
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

## Audit a current project

From a NestJS project root, invoke the portable audit skill:

```text
$nestjs-code-audit
$nestjs-code-audit full src/payments
$nestjs-code-audit static
$nestjs-code-audit security src/auth
```

It runs a read-only workflow and returns one report covering safe syntax/TypeScript/lint checks plus verified architecture, object-design, security, testing, runtime, and delivery findings. It does not install dependencies or fix code.

Codex does not support arbitrary bare custom commands such as `/Nestjs audit`. Custom prompts are deprecated in favor of skills, but Codex CLI and the IDE extension still support them as explicit local aliases. Copy [`integrations/codex/prompts/nestjs-audit.md`](https://github.com/amirtaherkhani/nestjs-agent-skills/blob/main/integrations/codex/prompts/nestjs-audit.md) into `~/.codex/prompts/`, then use:

```text
/prompts:nestjs-audit
/prompts:nestjs-audit full src/payments
```

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
