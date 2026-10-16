# Changelog

User-visible changes to NestJS Skills are recorded here. The collection uses semantic versioning; individual skill metadata versions may differ from the collection version.

## [Unreleased]

## [2.5.0] - 2026-10-16

### Added

- A bounded collection selection example with 15 deterministic checks for indexed joins, membership, first-match catalog duplicates, request order and repeated IDs, caller-owned inputs, fresh public output, runtime validation and parser byte limits.
- Operations, dependency injection and performance examples with 17 deterministic checks for configuration rejection, allowlisted logging, awaited startup and cleanup, constructor tokens and aliases, adapter substitution, provider scopes, cache expiry and failures, bounded query requests and lazy-module reuse.
- A research record mapping all 13 selected upstream rules in categories 10 (operations), 2 (dependency injection) and 5 (performance) to original examples, official sources and ownership across the seven existing skills. The other seven categories remain expansion backlog.
- `npm run test:runtime` in the full repository check, with the collection checks included in `npm run test:fixtures`.

### Changed

- Updated Architecture to `1.2.1`, Features and Performance to `1.4.1`, and Professional Engineering to `2.1.1`; the other skill versions are unchanged.
- Connected the new examples and research record from the public indexes and relevant architecture, API, deployment, performance and syntax references.

### Fixed

- Direct collection-selector calls reject limits outside 1 to 32, including fractional and non-finite values, so callers cannot bypass the output bound enforced by the HTTP route.

### Verification limits

- Examples target the existing NestJS 11.2.7 and TypeScript 5.9.3 lockfile without dependency upgrades. The collection uses a fixed server-owned catalog, and the runtime examples use local adapters and explicit application close; they do not prove real database plans, broker behavior, OS signal delivery, active-request draining or production authorization.
- The custom configuration and event-logging examples do not exercise ConfigModule or Nest bootstrap logging. The cache is process-local and single-key; lazy loading defers a provider graph in the same file, without proving deferred JavaScript loading.
- These deterministic contracts do not establish production speed, memory, agent-quality or token-savings improvements. Existing evaluation receipts remain historical.

## [2.4.0] - 2026-10-11

### Added

- Focused library, school, inventory and notification examples with 16 deterministic boundary checks: multi-consumer authentication, private-provider and token failures, behavioral adapter conformance, enhancer success/error paths, runtime validation, domain invariants and project-specific import rules.
- Module contract, enhancer composition and pre-scaffold project-profile guidance, with written evaluation scenarios. Internal static types, transport validation and domain invariants now have explicit decision guidance.
- `npm run test:boundaries` in the full repository check. The existing provider-lifetime example also proves the identity difference between `useExisting` and a separate `useClass` registration.

### Changed

- Updated Architecture and OOP skills to `1.2.0`, Features and Performance at `1.4.0`, and Professional Engineering at `2.1.0`; the other skill versions are unchanged.
- Connected new guidance to existing references and documented evidence limits without removing the established architecture or simple-CRUD controls.
- Added social footer navigation across all five locale entry pages since 2.3.0.

### Fixed

- Both slow-API variants validate successful external JSON at runtime, reject malformed shapes/values and mismatched identities, and project only public fields. Their 14 checks each preserve the isolated performance comparison and its two expected before-variant failures.
- Corrected abstract-class token wording: structurally compatible adapters need not inherit from the token class.
- Corrected global-filter wording: registration does not determine construction; a container-resolved singleton retains DI when passed to `useGlobalFilters()`.

### Verification limits

- New examples use in-memory/fixed teaching policies and Express HTTP; they do not prove production authentication, database isolation, transport parity or request-scoped global-filter behavior.
- Deterministic checks and written scenarios do not establish agent-quality or token-savings improvements. Existing pilot receipts remain historical; generator feasibility remains separate and no custom generator is implemented.

## [2.3.0] - 2026-10-07

### Added

- Practical TypeScript examples for all 19 design-pattern catalog entries, with Nest provider wiring, selection guidance, tradeoffs, and behavioral checks. Examples distinguish simple factory selection from GoF Factory Method, object decorators from Nest metadata decorators, and provider scope from a static Singleton.
- `npm run test:patterns`, which compiles the catalog's own code blocks and runs 26 behavioral tests, including transaction rollback, duplicate delivery, saga recovery, payment-timeout reconciliation, and concurrent outbox acknowledgements.
- Persian, French, Simplified Chinese, and Japanese home, Getting Started, and publication gateway pages alongside English, with localized metadata, reciprocal language links, sitemap alternates, and language switching.
- A public listing/article/post index, Hashnode links, marketplace installation guidance, and examples for all seven skill workflows.
- A backend research backlog and archived preliminary notes, explicitly separated from approved skill guidance.

### Changed

- Renamed the repository and collection to `nestjs-skills` / NestJS Skills, with updated installation commands, documentation links, and GitHub Pages base path. All seven individual skill names remain unchanged.
- Documentation now lives at <https://amirtaherkhani.github.io/nestjs-skills/>. GitHub repository URLs redirect after a rename; old project-site URLs do not.
- Updated the site branding, theme-aware logos, home icons, social assets, and localized homepage definitions.
- Expanded the full test command to cover executable patterns, localized documentation, accessible home icons, and marketplace links.
- Released OOP and Design Patterns as skill version `1.1.0` and Features and Performance as `1.3.3`, with their updated evaluation scenarios. The other five skill metadata versions are unchanged.

### Fixed

- Clarified strict boolean query parsing with `DefaultValuePipe` before `ParseBoolPipe`, including checks for omission, accepted strings, and invalid input.
- Corrected document direction during locale navigation, RTL menu anchoring, translated navigation labels, and closing the locale selector on outside interaction.

### Verification limits

- Pattern examples compile and run against the repository's pinned NestJS 11.2.7 and TypeScript 5.9.3. Database, outbox, and saga tests use in-memory adapters; they do not prove real database isolation, broker durability, or process-crash recovery. CSV/PDF previews and email/SMS examples return teaching strings.
- The research backlog is planned work, and archived notes remain preliminary. Full skill references remain in English; localized entry pages do not imply every reference has been translated.
- Fixture correctness does not establish agent-quality improvements or token savings. The earlier evaluation pilot limitations still apply.

## [2.2.0] - 2026-10-04

### Added

- Bundled semantic review guidance so Code Audit can review architecture, object design, runtime, and healthy controls without installing sibling skills.
- Three runnable, authored NestJS examples for strict boolean query parsing, a module-boundary invariant bypass with a healthy consumer, and a measured local HTTP optimization.
- Deterministic tests for faulty/reference fixture behavior, including invalid input, response order, request-local freshness, bounded concurrency, upstream timeout, and failure handling.
- An opt-in three-task, two-version evaluation runner with fresh workspaces, held-out contract checks, result schema, actual reported token fields, and reviewed behavior summaries. Ordinary CI makes no model calls.
- Contributor guidance, an examples/evaluation guide, and the feature-audit workflow guide added since v2.1.0.

### Changed

- Shortened the coordination sections in all seven skill entrypoints while retaining standalone ownership, version, read-only audit, roadmap, and publication guards.
- Made sibling skills optional guidance and clarified that an explicit audit-and-fix request authorizes a distinct implementation phase without redundant approval.
- Expanded `npm test` to verify the executable examples and evaluation harness as well as skill packaging, collector safety, and documentation.

### Fixed

- Preserved Feature Audit’s non-empty feature requirement and default to `main` only when no branch is named, with a packaging regression check.
- Aligned the feature-audit guides and Claude template with explicit authorization already supplied in an audit-and-fix request. Publication, deployment, and roadmap edits still require their own authorized scope.

### Verification limits

- The initial cloud CLI comparison was blocked before any model turn. It completed 0 of 6 planned runs and reported no token usage. No agent-quality, cost, or token-savings claim is established.
- Follow-up model runs can inherit ambient skill metadata or encounter sandbox restrictions on local HTTP checks. Results affected by those conditions are exploratory, not a clean causal comparison. No unreviewed follow-up metrics are included in this release.
- Example timing measurements describe a controlled local dependency, not production performance. The current [pilot report](evals/reports/2026-10-04-pilot.md) separates fixture correctness from agent impact.

## [2.1.0] - 2026-08-02

### Added

- The seventh skill, `nestjs-feature-audit`, for branch-specific roadmap validation with safe branch preparation and a hard documentation gate.
- Evidence-backed implemented, missing, legacy, and bug/blocker reporting, with integration into ownership guards, evaluations, client metadata, validation, and documentation.

Earlier release history is available in [GitHub Releases](https://github.com/amirtaherkhani/nestjs-skills/releases).

[Unreleased]: https://github.com/amirtaherkhani/nestjs-skills/compare/v2.5.0...HEAD
[2.5.0]: https://github.com/amirtaherkhani/nestjs-skills/compare/v2.4.0...v2.5.0
[2.4.0]: https://github.com/amirtaherkhani/nestjs-skills/compare/v2.3.0...v2.4.0
[2.3.0]: https://github.com/amirtaherkhani/nestjs-skills/compare/v2.2.0...v2.3.0
[2.2.0]: https://github.com/amirtaherkhani/nestjs-skills/compare/v2.1.0...v2.2.0
[2.1.0]: https://github.com/amirtaherkhani/nestjs-skills/releases/tag/v2.1.0
