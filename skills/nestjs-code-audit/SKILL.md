---
name: nestjs-code-audit
description: 'Audits an existing NestJS repository with the NestJS Architecture, OOP, and Features skills and returns one prioritized, evidence-backed code-quality report. Use when asked to check a whole NestJS codebase or a scoped folder for syntax, TypeScript, lint, module-boundary, dependency, design-smell, security, testing, performance, reliability, or production-readiness problems. This is a read-only review workflow: it does not fix code, install dependencies, run migrations, or deploy. When other skills also apply, reconcile ownership before mutation.'
license: MIT
compatibility: 'Requires Node.js 20+, a NestJS repository, and the sibling nestjs-architecture-principles, nestjs-oop-design-patterns, and nestjs-features-performance skills.'
metadata:
  author: amirtaherkhani
  version: '1.0.2'
---

# NestJS Code Audit

Inspect the current user's NestJS project and return one consolidated report of verified code problems and evidence-backed risks. Audit only; do not modify the target project.

## Pre-execution conflict guard

Run this guard after identifying every applicable skill and before editing files, installing packages, generating code, running migrations, changing infrastructure, or executing any other state-changing command. Read-only repository inspection and non-mutating static checks are allowed while resolving the guard.

### Prerequisites

- Confirm the target root, requested scope, repository instructions, git state, package manager, installed dependencies, NestJS/Node/TypeScript versions, and available quality scripts.
- Load `nestjs-architecture-principles`, `nestjs-oop-design-patterns`, and `nestjs-features-performance` before classifying semantic findings.
- Treat the target repository's explicit contracts and verified runtime constraints as evidence. Do not import this repository's preferred folder structure into an unrelated project.

### Primary ownership

This skill owns audit orchestration, safe evidence collection, cross-skill deduplication, severity normalization, and the final report. It does not override the domain owners:

- `nestjs-architecture-principles` owns module, capability, dependency, data/write, transaction, and service-boundary findings.
- `nestjs-oop-design-patterns` owns object responsibility, invariant placement, coupling, abstraction, and pattern/refactoring findings.
- `nestjs-features-performance` owns NestJS lifecycle, API/error, security, testing, runtime, performance, reliability, and delivery findings.

Syntax, TypeScript, and lint failures are reported as toolchain facts. A single issue that crosses lanes keeps one primary owner and lists the other skills as supporting context.

`nestjs-professional-software-engineering` may provide general code-quality context, but this skill's read-only boundary controls the audit. Fixes require a separately authorized implementation workflow.

`nestjs-feature-audit` owns branch-specific roadmap traceability and the feature-status report. This skill may supply verified quality findings, but it does not replace the roadmap gate or reorganize the report around whole-repository severity.

`nestjs-git-commit-pr-message` may publish an explicitly requested audit report, but it cannot use publication as authorization to fix findings or mutate the audited project.

### Conflict test

A conflict exists when active skills would:

- classify the same evidence as incompatible problems or recommend incompatible outcomes;
- require checks whose commands, environment assumptions, or side effects cannot all remain read-only;
- claim primary ownership of the same finding without a clear handoff; or
- proceed without dependencies, configuration, authorization, or evidence required to make a reliable claim.

Resolve conflicts in this order: explicit user intent, target-repository contracts and verified runtime constraints, then the narrowest primary owner above. If a material conflict remains, omit the disputed claim from confirmed findings and record it under **Needs verification** with the missing evidence. If a requested action would cross this skill's read-only boundary, stop before mutation and require a separately authorized implementation workflow. Never manufacture consensus, run an unsafe command, or modify the project to make the audit pass.

## Invocation

Preferred portable invocation:

```text
$nestjs-code-audit
$nestjs-code-audit full src/payments
$nestjs-code-audit static
$nestjs-code-audit security src/auth
```

Codex CLI/IDE custom-prompt alias, when installed:

```text
/prompts:nestjs-audit
/prompts:nestjs-audit full src/payments
```

Codex does not provide arbitrary bare user-defined commands such as `/Nestjs audit`; keep the supported alias explicit.

### Actions

| Action | Coverage |
| --- | --- |
| `full` (default) | Safe static gates plus architecture, object design, runtime, security, testing, and delivery review |
| `static` | Syntax, TypeScript, lint, configuration, and directly related toolchain failures |
| `architecture` | Modules, dependencies, data/write ownership, transactions, events, ports, and service boundaries |
| `design` | Responsibilities, invariants, coupling, abstractions, patterns, and refactoring risks |
| `runtime` | Nest lifecycle, API/errors, reliability, performance evidence, health, shutdown, and delivery |
| `security` | Input, identity/access, tenant isolation, secrets, output, abuse controls, and security tests |
| `tests` | Test-layer choice, missing boundary coverage, flaky lifecycle risks, and safely runnable checks |

An optional repository-relative scope follows the action. If the first argument is not a recognized action, treat all arguments as the scope/focus and use `full`. Focused actions still load the three domain skills to resolve ownership, but they report only the requested lane and explicit cross-lane blockers.

## Audit workflow

### 1. Establish eligibility and scope

1. Resolve the current working directory and optional user scope without escaping the repository root.
2. Read `AGENTS.md` and other repository instructions, `package.json`, lockfiles, `nest-cli.json`, TypeScript and lint configuration, bootstrap files, module files, tests, and deployment manifests that affect the scope.
3. Verify that `@nestjs/core` is declared or that the repository is clearly a NestJS workspace. If not, stop and report that this audit is not applicable.
4. Record the current branch and dirty state. Do not alter or discard existing changes.
5. State a one-sentence baseline of the observed architecture. Do not infer Clean Architecture, DDD, CQRS, or microservices from folder names.

### 2. Collect deterministic evidence

Use the bundled collector from this skill's directory:

```bash
node scripts/collect-quality-evidence.mjs --root "$PWD" --run
```

Add `--scope <relative-path>` when the user requested a narrower audit. The collector:

- reads manifests and source files without changing them;
- identifies the package manager and available quality scripts;
- runs only allow-listed, non-fixing ESLint and `tsc --noEmit` commands when `--run` is present;
- never installs dependencies, runs builds, updates snapshots, writes coverage, or invokes arbitrary package scripts;
- returns JSON containing command results and heuristic review candidates.

If dependencies are missing or a command is unsafe, unavailable, timed out, or outside scope, record it as **not run**. Do not reinterpret a missing check as a pass. Never run `lint --fix`, format/write commands, migrations, deployment commands, live integration tests, or tests that may reach shared infrastructure during this audit.

### 3. Review four evidence lanes

#### Toolchain correctness

- Report parser, TypeScript, and lint diagnostics exactly enough to locate the problem.
- Deduplicate cascaded compiler errors when they share one root cause.
- Separate command failure from a code finding, such as missing dependencies or broken configuration.

#### Architecture

Trace bootstrap entry points, module imports/exports, provider visibility, request/message paths, persistence ownership, transactions, events, and external adapters. Confirm cycles or boundary leaks from real imports and call paths. Do not report architectural preference as a defect.

#### Object design and maintainability

Inspect responsibilities, dependency clusters, invariant placement, repeated conditional variation, framework/vendor leakage, hidden service location, speculative abstractions, and risky refactor seams. File length or a regex signal alone is not a finding.

#### Runtime, security, and verification

Inspect lifecycle placement, validation, authentication/authorization, tenant/resource ownership, public error and response contracts, secrets/logging, query and resource bounds, timeouts/retries/idempotency, health/shutdown, test boundaries, and deployment evidence when present. Do not claim performance problems without measurements.

### 4. Verify and deduplicate findings

A confirmed finding needs:

- a stable ID: `TOOL`, `ARCH`, `OOP`, `RUN`, `SEC`, or `TEST` plus a number;
- severity: critical, high, medium, or low;
- primary owning skill;
- file and line evidence plus the relevant import, call path, diagnostic, or configuration;
- concrete impact, not only a rule name;
- the smallest safe remedy;
- a validation step that could prove the remedy.

Use critical only for a present security, data-loss, tenant-isolation, or severe availability risk. High requires likely incorrect behavior or a boundary flaw blocking a known change. Medium requires a credible maintainability, correctness, or operability cost. Low is a localized improvement with limited risk.

Move unverified regex signals, suspected dead code, possible performance issues, and checks blocked by missing dependencies to **Needs verification**. Do not inflate the report with style preferences or multiple findings for one root cause.

## Required report

Return Markdown in this order:

1. **Audit verdict:** pass, pass with risks, or fail; audited scope; one-sentence baseline.
2. **Quality gates:** syntax/TypeScript, lint, tests if safely available, and audit coverage, each marked pass, fail, or not run with the exact command or reason.
3. **Finding summary:** counts by severity and owner.
4. **Confirmed findings:** ordered by severity and impact, using the evidence/remedy/validation contract above.
5. **Needs verification:** candidate, missing evidence, and smallest next check.
6. **Healthy patterns:** only notable controls actually verified in the repository.
7. **Recommended order:** a short, dependency-aware remediation sequence; do not implement it unless the user separately asks.

If there are no confirmed problems, say so and list the checks that were not run. A clean lint result is not proof of sound architecture, security, runtime behavior, or test coverage.

## Reference routing

| Need | Load |
| --- | --- |
| Decide which checks may run without modifying the project | [check-policy.md](references/check-policy.md) |
| Assign and deduplicate findings across the three domain skills | [finding-ownership.md](references/finding-ownership.md) |
| Format the final audit consistently | [report-template.md](references/report-template.md) |
