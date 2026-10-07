# Examples and evaluation

The collection includes three runnable, authored NestJS examples:

- Strict boolean query parsing: omitted, true, false, and invalid HTTP inputs.
- Module-boundary review: an invariant bypass through exported storage, plus a healthy consumer of the public operation.
- Slow API diagnosis: a controlled local dependency, request count and latency measurements, request-local deduplication, bounded concurrency, stable responses, timeout, and failure handling.

From a repository checkout:

```bash
npm ci
npm run test:fixtures
```

The runner verifies that the faulty examples fail their expected checks and that the reference corrections pass. See the [example walkthrough](https://github.com/amirtaherkhani/nestjs-skills/blob/main/examples/README.md).

## Seven skill workflows

The three runnable apps cover endpoint behavior, module boundaries, and measured performance. The other skill workflows are reviews whose conclusions must come from the target repository, so their examples show the evidence path and stop condition instead of presenting a fixed sample finding.

| Skill | Example | What to verify |
| --- | --- | --- |
| Professional Engineering | Add strict boolean query parsing to a NestJS 11 route. | Inspect the installed version and existing contract; exercise omitted, accepted, and invalid values with the [boolean-query fixture](https://github.com/amirtaherkhani/nestjs-skills/blob/main/examples/README.md#boolean-query-parsing). |
| Architecture Principles | Find a consumer that bypasses a wallet module's public operation. | Trace both consumers and provider exports; verify the public operation owns writes and storage stays private with the [module-boundary fixture](https://github.com/amirtaherkhani/nestjs-skills/blob/main/examples/README.md#module-boundary-review). |
| OOP and Design Patterns | Preserve a nonnegative-balance invariant across checkout paths. | Assert the same overdraft behavior through each route; keep the rule in the wallet operation and avoid an abstraction without a real variation. |
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
