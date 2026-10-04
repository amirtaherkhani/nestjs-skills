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

## Fixture tests and agent tests answer different questions

Working examples prove their own contracts. They do not prove an agent made better decisions, found more bugs, or used fewer tokens.

The [evaluation harness](https://github.com/amirtaherkhani/nestjs-skills/blob/main/evals/README.md) runs three tasks against two skill versions in fresh contexts. It uses the same declared model, reasoning setting, fixtures, and permissions. Answer keys are withheld from the submitted workspace; source changes are checked with held-out contracts and human review. Ordinary CI runs deterministic tests only and never invokes a model.

The runner records execution outcomes, version hashes, duration, command count, actual token usage when supplied by the CLI, and reviewed behavior metrics. Unknown token fields remain null with a reason. False findings, duplicate findings, unauthorized edits, test changes, and unsupported claims count against a run.

## Current evidence

The initial implementation environment verified the executable fixtures, but Codex CLI could not initialize before a model turn. The six-run comparison therefore remains unrun, and no token-savings claim is established. See the [dated pilot status](https://github.com/amirtaherkhani/nestjs-skills/blob/main/evals/reports/2026-10-04-pilot.md).

Fresh contexts may still contain ambient global skill metadata, and some CLI sandboxes block local TCP listeners. Disclose those conditions, keep authorized host-side HTTP verification separate, and treat affected comparisons as exploratory.

A shorter skill entrypoint is a measured text-size change. Real agent quality and consumption require matched repeated runs, including all files and tool output the agent actually reads.
