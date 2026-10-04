# Evaluate skill behavior

Two different checks answer different questions:

1. `npm run test:fixtures` proves the authored examples reproduce the intended problems and that their reference corrections satisfy their contracts. It does not test an agent.
2. The opt-in pilot runs an agent in six fresh workspaces: three tasks × the baseline and candidate skill versions. It records execution evidence, then requires held-out checks and human review. A prompt in `skills/*/evals/evals.json` is a written scenario, not a completed run.

## Deterministic checks (ordinary CI)

```bash
npm ci
npm test
```

The suite validates skill packaging, collector safety, fixture behavior, result schema, usage parsing, isolated preparation, and failure handling, then builds the documentation. It does not call a model or use paid APIs.

## Run a bounded pilot explicitly

Use an already authenticated, supported Codex CLI and a model you are authorized to use. The command can consume your existing account allowance. Do not create credentials or start paid services just to run it.

```bash
npm run eval:pilot -- \
  --baseline 449522236105ca1d244af8caa7510fd8434cdfd6 \
  --candidate working \
  --model YOUR_AVAILABLE_MODEL \
  --reasoning xhigh \
  --output evals/.runs/my-pilot
```

Use a commit SHA instead of `working` for an immutable candidate when possible. A working candidate is still content-hashed. Use a new output directory for each pilot; existing per-run directories are never overwritten. The CLI uses `codex exec --ephemeral --ignore-user-config --json`, the same model/reasoning setting for all six runs, and a 12-minute per-run timeout. It does not resume sessions, bypass sandboxing, or weaken approvals. Model runs are refused when `CI` is set.

Each run installs only its selected skill package into `.agents/skills/`; Code Audit's independent-installation behavior is therefore part of this comparison. It copies the seeded source, a public smoke test, exact dependency metadata, and (for the slow task) a local five-sample benchmark. Dependencies are shared from this checkout through a link and need no installation in the run. Audit is read-only; the two explicit fix tasks permit source edits only. The build is prepared before the audit.

The baseline/candidate pair uses identical task text, fixtures, dependency versions, permissions, and declared model/reasoning. Runs execute task-major, baseline then candidate. A fresh conversation does not guarantee an empty provider prompt cache; use only the cache usage actually reported. The hosted model may change over time, so reruns are not automatically comparable.

The `after/` solutions, held-out contract tests, rubric below, and written scenario expectations are not copied into the agent workspace or prompt. The prompt prohibits ancestor/other-run inspection. This is ordinary evaluation isolation, not an adversarial secrecy boundary: the OS sandbox may still allow reading other filesystem locations. Inspect command logs for violations before accepting a run.

A failed executor stops further model calls and preserves evidence. This avoids repeatedly spending runs on unavailable authentication, a read-only runtime, an unsupported model, or another infrastructure failure. Fix the environment through supported controls and start a new pilot; do not call an infrastructure failure a skill failure.

## Grade and summarize

```bash
npm run eval:grade -- --output evals/.runs/my-pilot
npm run eval:summary -- --output evals/.runs/my-pilot
```

Grading recompiles submitted source and runs the original contract tests from outside the workspace; changing copied tests cannot make these pass. The audit fixture intentionally stays faulty, so its failing regression test is expected. Judge the audit's report, evidence, healthy control, and absence of mutation instead.

Read each `response.md`, `events.jsonl`, `changes.diff`, manifest, and contract log. Record one review object per `task/variant` in an untracked JSON file, then pass it with `--review path/to/review.json` to `eval:summary`. Review fields follow `result.schema.json`:

- `pass`: true/false only after review; otherwise null.
- `seeded_defects_found`: number of distinct seeded root causes correctly identified (one in each task). A correct fix counts only when its explanation identifies the root cause.
- `false_findings`: asserted defects lacking evidence, including incorrectly flagging the healthy consumer.
- `duplicates`: extra findings for the same root cause.
- `unauthorized_edits`: changed paths outside allowed source scope, or any mutation during audit. The runner seeds this from Git; also inspect logs for transient, ignored, or reverted edits and prohibited external actions.
- `test_changes`: changed protected tests. Inspect logs as well as the final diff.
- `unsupported_claims`: claims of checks, fixes, security, speed, or savings unsupported by evidence.
- `reason`: concise evidence and limitations, including any unreviewed items.

An overall behavior pass requires the requested behavior (or correct read-only audit), no false/duplicate findings, no unauthorized edits/test changes, and no unsupported claims. An authorized fix request does not require another generic approval; audit-only tasks still must not mutate. If permission or scope materially changes, asking is correct behavior.

The schema uses null for unknown counts. Human review must not replace unknowns with zero just to complete a summary. Execution success is not behavior success. Summary generation rejects duplicate runs and model/reasoning/fixture mismatches within a pair.

## Recorded evidence

Each run records the skill content hash, fixture hash, base repository SHA, requested model/reasoning, Node/CLI version, permitted actions, elapsed execution time, command count, process outcome, and raw events. Token fields are populated only from CLI `turn.completed.usage`: input, cached input, output, and reasoning when the CLI actually emits it. Missing fields remain null with a reason. No character/word approximation is labeled as token use. Cached input is a subset of input; do not add them together.

Run directories and raw transcripts are ignored by Git. Inspect and redact environment paths, account details, or other private data before sharing a report. Commit only reviewed summaries appropriate for a public repository.

One observation per task/version is a small pilot. It cannot establish general quality, reliability, cost, or token savings. Repeat matched runs and use more independent tasks before making broad claims. A shorter skill body is a text-size change, not a measured reduction in agent consumption.

See [pilot status](reports/2026-10-04-pilot.md) for what was actually executable in the initial implementation environment.
