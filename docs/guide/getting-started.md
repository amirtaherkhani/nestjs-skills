---
title: Getting Started
description: Install and use the NestJS Agent Skills with Claude Code and Codex.
---

<p class="doc-kicker">Guide · 5 minutes</p>

# Getting started

<p class="doc-lede">Install three focused Agent Skills that help your coding agent make deliberate NestJS architecture, object-design, framework, performance, and scaling decisions.</p>

## Requirements

- Node.js 20 or newer for repository validation and the documentation site.
- Claude Code, Codex, or another client that supports the open [Agent Skills specification](https://agentskills.io/specification).
- A NestJS repository to inspect. The skills are useful during planning, implementation, refactoring, review, and diagnosis.

## Install

Install the collection with the `skills` CLI:

```bash
npx skills add amirtaherkhani/nestjs-agent-skills
```

To install a single skill for Claude Code and Codex:

```bash
npx skills add amirtaherkhani/nestjs-agent-skills \
  --skill nestjs-architecture-principles \
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
Review the module graph and recommend the smallest architecture change that removes this cycle.
```

You can also name a skill explicitly:

```text
# Claude Code
/nestjs-architecture-principles

# Codex
$nestjs-architecture-principles
```

The other skill names are:

- `nestjs-oop-design-patterns`
- `nestjs-features-performance`

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
