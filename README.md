# NestJS Agent Skills

Three focused Agent Skills for building, reviewing, refactoring, and scaling NestJS applications with Claude Code and Codex.

The collection follows the [Agent Skills open standard](https://agentskills.io/specification): each skill has a concise `SKILL.md`, focused on-demand references, and evaluation prompts. The guidance is architecture-aware without forcing every project into Clean Architecture, CQRS, or microservices.

**Documentation:** [amirtaherkhani.github.io/nestjs-agent-skills](https://amirtaherkhani.github.io/nestjs-agent-skills/) · [Ten-topic rules reference](https://amirtaherkhani.github.io/nestjs-agent-skills/rules/)

## Skills

| Skill | Focus | Use it for |
| --- | --- | --- |
| [`nestjs-architecture-principles`](skills/nestjs-architecture-principles/SKILL.md) | NestJS architectures + engineering principles | Module, data, ORM, transaction, and service boundaries; modular monoliths; architecture reviews; and refactors |
| [`nestjs-oop-design-patterns`](skills/nestjs-oop-design-patterns/SKILL.md) | OOP rules and tips + design patterns | SOLID, object design, dependency injection, code smells, refactoring, and selecting patterns without over-engineering |
| [`nestjs-features-performance`](skills/nestjs-features-performance/SKILL.md) | NestJS features + scaling and performance | Errors, security, testing, APIs, queues, caching, transports, observability, deployment, performance, and scale |

The three skills expose one conflict-checked rules reference covering Architecture, Dependency Injection, Error Handling, Security, Performance, Testing, Database & ORM, API Design, Microservices, and DevOps & Deployment. The categories are navigation—not ten competing sources of truth.

DevOps is treated as a first-class operating discipline: immutable CI/CD and container delivery, Kubernetes live-state verification, SLO-driven observability, incident response, tested recovery, compatible migrations, graceful drain, and evidence-based rollout/rollback. Platform-specific guidance remains conditional rather than making Docker or Kubernetes mandatory.

Error Handling is also first-class: application-owned failure taxonomy, stable public contracts, precise HTTP/GraphQL/RPC/gRPC/WebSocket mapping, NestJS filter coverage, deadline and cancellation propagation, safe retry/idempotency rules, partial-effect analysis, privacy, fatal-process behavior, and failure-path testing. The guidance preserves an existing compatible API instead of forcing one universal error envelope.

## Install

Install all three skills:

```bash
npx skills add amirtaherkhani/nestjs-agent-skills
```

Install one skill for Claude Code and Codex:

```bash
npx skills add amirtaherkhani/nestjs-agent-skills \
  --skill nestjs-architecture-principles \
  --agent claude-code \
  --agent codex
```

List the available skills without installing:

```bash
npx skills add amirtaherkhani/nestjs-agent-skills --list
```

The CLI installs project skills into the location expected by each agent, including `.claude/skills/` for Claude Code and `.agents/skills/` for Codex. Use `--global` for a user-level installation.

## Invoke

The descriptions are written for automatic activation. You can also invoke a skill explicitly:

```text
# Claude Code
/nestjs-architecture-principles

# Codex
$nestjs-architecture-principles
```

Example requests:

- "Review this NestJS module graph and recommend the smallest architecture change."
- "Refactor this provider using SOLID and an appropriate design pattern."
- "Find the bottleneck in this NestJS endpoint and propose a measured scaling plan."

## Design choices

- **Progressive disclosure:** the main instructions stay compact; detailed rules and examples live under `references/`.
- **Architecture ladder:** begin with cohesive feature modules and add layers, ports, CQRS, or services only when the problem earns their cost.
- **Context before rules:** inspect the actual repository, NestJS version, transport, persistence layer, and conventions before recommending a change.
- **Framework-aware OOP:** use Nest modules and providers as real boundaries; do not recreate the DI container or framework lifecycle in application code.
- **Measure before optimizing:** distinguish event-loop, database, network, memory, and capacity bottlenecks before selecting a remedy.
- **Source freshness:** verify version-sensitive APIs and packages against the installed project and official documentation.

## Validate

```bash
npm install
npm run validate
npm run docs:build
npx skills add . --list
```

The local validator checks required frontmatter, directory/name agreement, description limits, reference links, evaluation JSON, and the recommended `SKILL.md` size limit. The documentation build generates the complete website reference directly from the canonical skill files so the two cannot drift.

Run the documentation site locally:

```bash
npm run docs:dev
```

## Research and attribution

The skills synthesize the official NestJS and Agent Skills documentation with the repositories and discussions requested for this project. See [SOURCES.md](SOURCES.md) for the complete research log and source policy.

## License

[MIT](LICENSE)
