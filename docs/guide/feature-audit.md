---
title: Feature Audit Workflow
description: Validate one NestJS feature against its documented roadmap on a stable Git branch.
---

<p class="doc-kicker">Guide · Feature roadmap validation</p>

# Audit a feature against its roadmap

<p class="doc-lede">Use Feature Audit to compare one feature at one identified revision with an authoritative roadmap—not to perform a general code-quality review or implement the gaps it finds.</p>

## Choose the right audit

| Goal | Skill | Result |
| --- | --- | --- |
| Validate one feature against planned outcomes | `nestjs-feature-audit` | Branch-specific roadmap traceability report |
| Review repository quality across domains | `nestjs-code-audit` | Prioritized architecture, design, security, testing, runtime, and toolchain findings |

Feature Audit may reuse verified quality findings, but roadmap coverage remains its organizing contract.

## Invoke the workflow

The portable skill invocation works across clients that support Agent Skills:

```text
$nestjs-feature-audit "payments"
$nestjs-feature-audit "payments" --branch "release/2026-q3"
```

The branch defaults to `main` only when no branch is named.

Claude Code exposes installed skills with `/nestjs-feature-audit`. Codex uses `$nestjs-feature-audit`; the optional compatibility prompt accepts:

```text
/prompts:audit_feature payments
/prompts:audit_feature payments on branch release/2026-q3
```

Bare `/audit_feature` is client-specific. Do not assume every client installs that alias.

## What happens during an audit

1. **Stabilize the revision.** Inspect the worktree and remotes, switch safely, and use fast-forward-only updates.
2. **Enforce the roadmap gate.** Search `docs/` for an authoritative feature roadmap or use roadmap text supplied directly by the user.
3. **Build traceability.** Map every roadmap item to source, wiring, tests, configuration, migrations, contracts, deployment artifacts, and authorized runtime evidence.
4. **Classify once.** Assign each normalized item to one primary report category without double-counting.
5. **Report without fixing.** Return evidence, impact, and the next validation or exit condition. Implementation requires a separate request.

## Roadmap eligibility

A clear roadmap must:

- identify the requested feature or a verified alias;
- define concrete outcomes, phases, deliverables, acceptance conditions, or migration targets;
- contain at least one item that can be compared with observable evidence; and
- be distinguishable from an idea, historical note, changelog entry, rejected proposal, or isolated TODO.

::: danger No roadmap, no comparison
If `docs/` has no clear roadmap, the audit stops before classifying implementation state and asks for a roadmap path or contents. Existing code cannot define its own expected completeness.
:::

## Branch and evidence safety

| Observed state | Required behavior |
| --- | --- |
| Dirty worktree | Stop before switching or updating; never stash, reset, clean, or discard automatically |
| Diverged target branch | Stop; do not merge, rebase, or force-update as part of the audit |
| Remote freshness unavailable | Do not claim the branch is current; continue only if the user accepts the local snapshot |
| Test or runtime gate unavailable | Mark it not verified; never reinterpret `not run` as success or failure |
| Roadmap mentions deployment, migration, or load testing | Treat it as a requirement, not authorization to execute the live action |

The report records the branch, commit SHA, worktree state, roadmap source, audited scope, and evidence freshness.

## Required report categories

| Category | Use when |
| --- | --- |
| **✅ Implemented** | The item is present, wired, standards-compatible, and supported by the strongest safely available validation |
| **❌ Missing/Not Implemented** | Required work is absent, stubbed, or only partially complete |
| **⚠️ Legacy Code** | An older active path must be migrated, replaced, or retired under the roadmap or current standards |
| **🛑 Bugs & Blockers** | Behavior is verified broken, or a prerequisite prevents completion or reliable validation |

Every item includes the roadmap requirement, observed state, evidence, impact, and next proof. All four headings remain in the report, including when a category has no findings.

::: tip Source completion is not rollout completion
When code and tests are complete but production cutover remains unapproved, report the source sub-item as implemented and the distinct rollout sub-item as blocked.
:::

## Continue from the report

- Open the complete [Feature Audit skill reference](/reference/feature-audit/).
- Review the [roadmap discovery gate](/reference/feature-audit/references/roadmap-discovery).
- Apply the [evidence classification rules](/reference/feature-audit/references/evidence-classification).
- Use the exact [report template](/reference/feature-audit/references/report-template).
- Start a separately authorized implementation with [Professional Engineering](/reference/professional-engineering/) after the audit scope is accepted.
