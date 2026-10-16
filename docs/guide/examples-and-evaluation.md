# Examples and evaluation

The collection includes three runnable before/after NestJS applications:

- Strict boolean query parsing: omitted, true, false, and invalid HTTP inputs.
- Module-boundary review: an invariant bypass through exported storage, plus a healthy consumer of the public operation.
- Slow API diagnosis: a controlled local dependency, request count and latency measurements, request-local deduplication, bounded concurrency, stable responses, timeout, and failure handling.

From a repository checkout:

```bash
npm ci
npm run test:fixtures
```

The runner verifies that the faulty examples fail their expected checks and that the reference corrections pass. See the [example walkthrough](https://github.com/amirtaherkhani/nestjs-skills/blob/main/examples/README.md).

## Practical design-pattern examples

The [pattern catalog](/reference/oop-patterns/references/pattern-catalog) has executable examples for all 19 entries, with imports, Nest provider wiring, selection guidance, and behavioral checks. Run them from a repository checkout:

```bash
npm run test:patterns
```

The runner compiles the code blocks shown on the catalog page, then checks their behavior. Examples cover delivery strategies, preview writer selection, invoice search builders, vendor adapters, notification bridges, and the other catalog entries. The guide distinguishes GoF Factory Method from a simple provider selector, object decorators from Nest metadata decorators, and provider lifetimes from a static Singleton.

The Unit of Work, outbox, and saga examples use explicit application ports with in-memory test adapters. Their checks cover rollback, duplicate delivery, saved-state recovery, and payment-timeout reconciliation. They do not verify a real database or broker. CSV/PDF examples return teaching strings. See the [scenario and verification guide](https://github.com/amirtaherkhani/nestjs-skills/blob/main/examples/design-patterns/README.md) for all examples, tested versions, and production checks.

## Four-axis boundary proofs

Run npm run test:boundaries for 16 deterministic checks covering two actual feature modules sharing authentication, private-provider and token failures, inventory behavioral substitution, HTTP enhancer success/error paths, runtime schemas, domain invariants and a project-specific import rule. See the [fixture guide](https://github.com/amirtaherkhani/nestjs-skills/blob/main/examples/four-axis/README.md), [module contracts](/reference/architecture/references/module-contracts), [enhancer composition](/reference/features-performance/references/enhancer-composition) and [project profile](/reference/professional-engineering/references/project-profile-and-scaffolding).

Both slow-API variants additionally validate successful external JSON and allow-list public output. Future evaluation preparations record the new source revision and fixture hash; existing pilot receipts retain their original meaning. No agent comparison or custom generator is claimed by these deterministic checks.

## Collections and runtime contracts

Run `npm run test:fixtures` for [15 collection checks](https://github.com/amirtaherkhani/nestjs-skills/blob/main/examples/collections/README.md) covering indexed joins, membership, ordering, duplicate semantics, caller-owned input, runtime validation and bounded HTTP projection. Both index construction and the input distribution matter when measuring an optimization; these checks make no speed claim.

Run `npm run test:runtime` for [17 runtime checks](https://github.com/amirtaherkhani/nestjs-skills/blob/main/examples/runtime-contracts/README.md) covering configuration rejection, allowlisted logging, awaited lifecycle work, constructor injection, scopes, cache expiry and failures, bounded query requests and lazy-module reuse. The [research record](/research/runtime-contracts) maps upstream categories 10, 2 and 5 to the seven existing skills and keeps the other categories as expansion backlog. Fake adapters and explicit application close do not prove database plans, broker behavior, OS signal handling or live request draining.

Both suites run as part of `npm test` with the repository's pinned dependencies.

## Seven skill workflows

The runnable apps cover endpoint behavior, module boundaries, and measured performance. The catalog examples cover object collaboration and application contracts. Audit workflows use an evidence path and stop condition because their conclusions depend on the target repository.

| Skill | Example | What to verify |
| --- | --- | --- |
| Professional Engineering | Add strict boolean query parsing to a NestJS 11 route. | Inspect the installed version and existing contract; exercise omitted, accepted, and invalid values with the [boolean-query fixture](https://github.com/amirtaherkhani/nestjs-skills/blob/main/examples/README.md#boolean-query-parsing). |
| Architecture Principles | Find a consumer that bypasses a wallet module's public operation. | Trace both consumers and provider exports; verify the public operation owns writes and storage stays private with the [module-boundary fixture](https://github.com/amirtaherkhani/nestjs-skills/blob/main/examples/README.md#module-boundary-review). |
| OOP and Design Patterns | Select a pattern for a concrete variation, then verify the contract. | Use the [executable catalog](/reference/oop-patterns/references/pattern-catalog) for syntax and wiring. Keep direct code when no variation or boundary justifies a pattern. |
| Features and Performance | Reduce repeated catalog calls for a quote endpoint. | Keep response order and failure behavior; compare call counts and record local elapsed time using the [slow API fixture](https://github.com/amirtaherkhani/nestjs-skills/blob/main/examples/README.md#slow-local-api). |
| Code Audit | Audit only `src/payments`, without changing it. | Establish root and scope, run only safe evidence collection, and report verified findings with limitations. The walkthrough includes the repository-local collector invocation. |
| Feature Audit | Compare refunds on `main` with its roadmap. | Require a concrete roadmap first, pin one revision, and trace every target item to evidence; stop without implementing gaps. |
| Git Commit and PR | Commit a verified documentation change locally. | Stage only named paths, inspect the staged patch and sensitive content, run relevant checks, and confirm the resulting local commit without pushing. |

See the [seven workflow examples](https://github.com/amirtaherkhani/nestjs-skills/blob/main/examples/README.md#seven-skill-workflows) for the full evidence checklists and links to the corresponding skill instructions. Nest module semantics are documented in the official [Modules](https://docs.nestjs.com/modules) and [Providers](https://docs.nestjs.com/providers) guides; staging is described by the official [Git add reference](https://git-scm.com/docs/git-add).

## Fixture tests and agent tests answer different questions

Working examples prove their own contracts. They do not prove an agent made better decisions, found more bugs, or used fewer tokens.

The [evaluation harness](https://github.com/amirtaherkhani/nestjs-skills/blob/main/evals/README.md) runs three tasks against two skill versions in fresh contexts. It uses the same declared model, reasoning setting, fixtures, and permissions. Answer keys are withheld from the submitted workspace; source changes are checked with held-out contracts and human review. Ordinary CI runs deterministic tests only and never invokes a model.

The runner records execution outcomes, version hashes, duration, command count, actual token usage when supplied by the CLI, and reviewed behavior metrics. Unknown token fields remain null with a reason. False findings, duplicate findings, unauthorized edits, test changes, and unsupported claims count against a run.

## Current evidence

The initial implementation environment verified the executable fixtures, but Codex CLI could not initialize before a model turn. The six-run comparison therefore remains unrun, and no token-savings claim is established. See the [dated pilot status](https://github.com/amirtaherkhani/nestjs-skills/blob/main/evals/reports/2026-10-04-pilot.md).

Fresh contexts may still contain ambient global skill metadata, and some CLI sandboxes block local TCP listeners. Disclose those conditions, keep authorized host-side HTTP verification separate, and treat affected comparisons as exploratory.

A shorter skill entrypoint is a measured text-size change. Real agent quality and consumption require matched repeated runs, including all files and tool output the agent actually reads.
