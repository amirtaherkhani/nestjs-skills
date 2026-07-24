# NestJS Agent Skills

Five focused Agent Skills for auditing, building, reviewing, refactoring, and scaling software—including NestJS applications—with Claude Code and Codex.

The collection follows the [Agent Skills open standard](https://agentskills.io/specification): each skill has a concise `SKILL.md`, focused on-demand references, and evaluation prompts. The guidance is architecture-aware without forcing every project into Clean Architecture, CQRS, or microservices.

**Documentation:** [amirtaherkhani.github.io/nestjs-agent-skills](https://amirtaherkhani.github.io/nestjs-agent-skills/) · [Ten-topic rules reference](https://amirtaherkhani.github.io/nestjs-agent-skills/rules/)

<p align="center">
  <img src="docs/assets/nestjs-code-audit-preview.gif" alt="Animated terminal preview of the NestJS code audit skill" width="960">
</p>

<p align="center"><sub>Run a read-only audit across TypeScript, lint, architecture, design, security, testing, and production readiness—then get one prioritized, evidence-backed report.</sub></p>

## Skills

| Skill | Focus | Use it for |
| --- | --- | --- |
| [`professional-software-engineering`](skills/professional-software-engineering/SKILL.md) | Project-aware implementation | New features, fixes, refactors, APIs, idiomatic syntax, safe syntactic sugar, tests, and evidence-backed verification |
| [`nestjs-code-audit`](skills/nestjs-code-audit/SKILL.md) | Read-only whole-codebase audit | Syntax, TypeScript, lint, architecture, design, security, testing, runtime, and production-readiness reports using all three domain skills |
| [`nestjs-architecture-principles`](skills/nestjs-architecture-principles/SKILL.md) | NestJS architectures + engineering principles | Module, data, ORM, transaction, and service boundaries; modular monoliths; architecture reviews; and refactors |
| [`nestjs-oop-design-patterns`](skills/nestjs-oop-design-patterns/SKILL.md) | OOP rules and tips + design patterns | SOLID, object design, dependency injection, code smells, refactoring, and selecting patterns without over-engineering |
| [`nestjs-features-performance`](skills/nestjs-features-performance/SKILL.md) | NestJS features + scaling and performance | Errors, security, testing, APIs, queues, caching, transports, observability, deployment, performance, and scale |

The professional engineering skill coordinates implementation and selects the clearest version-compatible syntax. The three NestJS domain skills own architecture, object design, and runtime decisions. The audit skill coordinates those owners into one read-only report.

DevOps is treated as a first-class operating discipline: immutable CI/CD and container delivery, Kubernetes live-state verification, SLO-driven observability, incident response, tested recovery, compatible migrations, graceful drain, and evidence-based rollout/rollback. Platform-specific guidance remains conditional rather than making Docker or Kubernetes mandatory.

Error Handling is also first-class: application-owned failure taxonomy, stable public contracts, precise HTTP/GraphQL/RPC/gRPC/WebSocket mapping, NestJS filter coverage, deadline and cancellation propagation, safe retry/idempotency rules, partial-effect analysis, privacy, fatal-process behavior, and failure-path testing. The guidance preserves an existing compatible API instead of forcing one universal error envelope.

## Install

Install all five skills:

```bash
npx skills add amirtaherkhani/nestjs-agent-skills
```

Install one skill for Claude Code and Codex:

```bash
npx skills add amirtaherkhani/nestjs-agent-skills \
  --skill professional-software-engineering \
  --agent claude-code \
  --agent codex
```

List the available skills without installing:

```bash
npx skills add amirtaherkhani/nestjs-agent-skills --list
```

The CLI installs project skills into the location expected by each agent, including `.claude/skills/` for Claude Code and `.agents/skills/` for Codex. Use `--global` for a user-level installation.

Optional repository-level engineering rules are included for both clients: [Codex `AGENTS.md`](integrations/codex/AGENTS.md) and [Claude Code `CLAUDE.md`](integrations/claude/CLAUDE.md). From this repository checkout:

```bash
# Codex
cp integrations/codex/AGENTS.md ./AGENTS.md

# Claude Code
cp integrations/claude/CLAUDE.md ./CLAUDE.md
```

Review an existing rules file before merging these templates so project-specific instructions remain intact.

## Invoke

The descriptions are written for automatic activation. You can also invoke a skill explicitly:

```text
# Claude Code
/professional-software-engineering

# Codex
$professional-software-engineering
```

Example requests:

- "Audit this NestJS repository and return one evidence-backed report without changing code."
- "Implement this feature using the clearest syntax supported by the current project, and verify it."
- "Review this NestJS module graph and recommend the smallest architecture change."
- "Refactor this provider using SOLID and an appropriate design pattern."
- "Find the bottleneck in this NestJS endpoint and propose a measured scaling plan."

For a read-only codebase report in Codex, use `$nestjs-code-audit`. Codex CLI/IDE's deprecated custom-prompt compatibility can also expose `/prompts:nestjs-audit`; see the [getting-started guide](https://amirtaherkhani.github.io/nestjs-agent-skills/guide/getting-started#audit-a-current-project). Bare user-defined commands such as `/Nestjs audit` are not supported.

## Design choices

- **Progressive disclosure:** the main instructions stay compact; detailed rules and examples live under `references/`.
- **Architecture ladder:** begin with cohesive feature modules and add layers, ports, CQRS, or services only when the problem earns their cost.
- **Context before rules:** inspect the actual repository, NestJS version, transport, persistence layer, and conventions before recommending a change.
- **Syntax from evidence:** prefer repository conventions, installed versions, official documentation, and focused experiments over remembered or fashionable syntax.
- **Safe syntactic sugar:** reduce real ceremony without hiding I/O, state, security, transactions, cost, failures, or advanced control.
- **Pre-execution conflict guard:** every skill declares prerequisites, primary ownership, handoffs, and conflict tests; agents may inspect read-only state but must resolve material conflicts before mutation.
- **Read-only audit:** the audit collector runs only installed local ESLint and `tsc --noEmit` checks, never package lifecycle scripts, dependency installation, fixing commands, builds, migrations, or deployments.
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

Run the deterministic audit collector tests:

```bash
npm run test:audit
```

The local validator checks required frontmatter, directory/name agreement, description limits, reference links, evaluation JSON, and the recommended `SKILL.md` size limit. The documentation build generates the complete website reference directly from the canonical skill files so the two cannot drift.

Run the documentation site locally:

```bash
npm run docs:dev
```

## Research and attribution

The skills synthesize the official Agent Skills, Claude Code, Codex, NestJS, and relevant language/framework documentation with the repositories and discussions requested for this project. See [SOURCES.md](SOURCES.md) for the complete research log and source policy.

## License

[MIT](LICENSE)
