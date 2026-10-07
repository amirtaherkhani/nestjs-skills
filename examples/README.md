# Runnable NestJS examples

The three before/after applications show a failing behavior and a minimal correction using real NestJS HTTP boundaries. A separate [executable pattern catalog](design-patterns/README.md) covers all 19 catalog entries. These are learning fixtures, not production templates or proof that an agent skill works better.

From the repository root, with Node.js 20+:

```bash
npm ci
npm run test:fixtures
```

The runner compiles the TypeScript and verifies both sides: the intentionally faulty `before/` must fail the expected regression checks, while `after/` must pass. A broken fixture, unexpected failure, or passing faulty version fails the runner. No credentials or external services are needed. The slow example binds an ephemeral loopback port.

## Boolean query parsing

`boolean-query/` exposes `GET /items?includeArchived=false`. JavaScript's Boolean coercion treats the string `"false"` as truthy. The correction uses Nest's `DefaultValuePipe(false)` followed by `ParseBoolPipe` at the query boundary.

The seven HTTP checks cover omitted, true, false, and four invalid values. The contract is deliberately strict: only lowercase true/false are accepted when supplied. Five checks fail before the correction; all seven pass after it.

## Module boundary review

`module-boundary/` contains a wallet module, an internal storage provider, a public charge operation, and two consumers. The charge operation enforces a positive amount and a nonnegative balance. Checkout uses it correctly. Bulk charges use exported storage directly and bypass that invariant.

The correction changes the bulk consumer to call the public operation and removes storage from module exports. Merely exporting a provider is not the finding: the unsafe consumer and bypassed invariant supply the evidence. The healthy checkout is a negative control. Each of the three HTTP tests starts a fresh app so a failed charge cannot contaminate another test.

## Slow local API

`slow-api/` serves a fixed quote containing `[one, two, one, two]`. A local catalog delays each reply by 30 ms. Before the correction, four requests run sequentially. Afterward, request-local deduplication fetches the two unique items concurrently and reconstructs the original ordered response.

The fixed two-unique-item workload bounds concurrency at two. If this becomes user-defined input, add explicit input bounds and a worker limit rather than assuming unrestricted `Promise.all` is safe. The example preserves a one-second upstream timeout and the non-leaking 502 error contract. It does not introduce a cross-request cache.

Tests check response equality/order, request count, maximum concurrency, request-local freshness, and upstream failure handling. The runner records actual elapsed time in `evals/.runs/fixtures.json`. Latency is illustrative local evidence, not a CI threshold or a production claim; request count and correctness are deterministic gates.

For a repeatable five-sample benchmark, the [evaluation guide](../evals/README.md) explains the controlled agent workspace and benchmark command.

## Seven skill workflows

The three before/after fixtures cover HTTP contracts. The [pattern examples](design-patterns/README.md) add executable object collaboration, provider wiring, and application reliability contracts through `npm run test:patterns`. Audit workflows still require evidence from the target repository before reaching a finding.

| Skill | Example request | Evidence and stopping point |
| --- | --- | --- |
| [Professional Engineering](../skills/nestjs-professional-software-engineering/SKILL.md) | Add strict `includeArchived` parsing to an existing NestJS 11 endpoint. | Inspect the installed Nest version and route contract, then run the [boolean-query fixture](#boolean-query-parsing). Reject invalid query values and preserve the omitted-value default. |
| [Architecture Principles](../skills/nestjs-architecture-principles/SKILL.md) | Review a wallet module where bulk checkout writes through exported storage. | Trace providers, exports, and both consumers. The [module-boundary fixture](#module-boundary-review) shows the bypass and its healthy negative control; route writes through the exported wallet operation and keep storage private. |
| [OOP and Design Patterns](../skills/nestjs-oop-design-patterns/SKILL.md) | Select a pattern for an observed variation and prove its behavior. | Use the [19 pattern examples](design-patterns/README.md) for syntax, Nest wiring, and contracts. The [wallet fixture](#module-boundary-review) also shows when a direct invariant-owning operation is enough. |
| [Features and Performance](../skills/nestjs-features-performance/SKILL.md) | Reduce repeated catalog work on a quote endpoint without changing its response. | Measure a fixed local workload, retain order and failure behavior, and bound concurrency. The [slow API fixture](#slow-local-api) separates deterministic call-count checks from illustrative elapsed time. |
| [Code Audit](../skills/nestjs-code-audit/SKILL.md) | Audit only `src/payments` and report verified issues. | Establish the repo root, scope, instructions, versions, and safe checks. Run `node scripts/collect-quality-evidence.mjs --root "$PWD" --scope src/payments --run` from the target repository; report evidence and limitations without edits. |
| [Feature Audit](../skills/nestjs-feature-audit/SKILL.md) | Compare refunds on `main` with its documented roadmap. | Confirm a concrete roadmap exists before evaluating it. Pin one branch revision, map every roadmap item to source/tests/runtime evidence, and report implemented items, gaps, legacy, bugs, and blockers without fixing them. |
| [Git Commit and PR](../skills/nestjs-git-commit-pr-message/SKILL.md) | Commit only the verified docs change; do not push. | Inspect branch and complete diff; stage explicit paths; inspect the staged diff and scan it for secrets/generated output; run relevant checks; commit locally and confirm clean scoped status. Never infer push or deployment permission. |

The Nest module behavior above follows the official [Modules](https://docs.nestjs.com/modules) and [Providers](https://docs.nestjs.com/providers) contracts. For an actual repository task, use that repository's installed version and instructions as the authority. The [Git documentation](https://git-scm.com/docs/git-add) describes explicit-path staging; inspect the staged patch with `git diff --cached` before committing.
