# Changelog

User-visible changes to NestJS Skills are recorded here. The collection uses semantic versioning; individual skill metadata versions may differ from the collection version.

## [Unreleased]

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

[Unreleased]: https://github.com/amirtaherkhani/nestjs-skills/compare/v2.3.0...HEAD
[2.3.0]: https://github.com/amirtaherkhani/nestjs-skills/compare/v2.2.0...v2.3.0
[2.2.0]: https://github.com/amirtaherkhani/nestjs-skills/compare/v2.1.0...v2.2.0
[2.1.0]: https://github.com/amirtaherkhani/nestjs-skills/releases/tag/v2.1.0
