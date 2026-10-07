# NestJS testing models: ordered research backlog and source inventory

Status: research inventory only. Prepared 2026-10-06 UTC. Deeper research paused after the user's request to agree the topic order first. No skill, application code, tests, dependency installation, or publication was performed. Proposed examples below have not been implemented or run.

## Executive finding

The project already has a sound testing philosophy. The useful next step is to investigate and demonstrate its difficult boundaries, rather than introduce another generic testing checklist or choose a test runner prematurely.

**Version warning:** the inspected repository uses Nest packages 11.2.7. The current unversioned Nest documentation describes newer defaults, including Vitest and ES modules; its SWC page explicitly discusses Nest v12. The versioned Nest v11 testing page instead documents Jest integration. All three runners remain candidates, but documentation defaults are not evidence that this repository should migrate.

## Verified repository baseline

Read-only inspection of `main` resolved to commit `96fb9a22c59a54fa1250a2664455c71df4942dfc`, package version 2.2.0.

- [Testing Rules](https://github.com/amirtaherkhani/nestjs-skills/blob/96fb9a22c59a54fa1250a2664455c71df4942dfc/skills/nestjs-features-performance/references/testing.md): already covers smallest useful boundary, direct construction, owned-port fakes, real dependency semantics, migration/isolation needs, production-relevant HTTP configuration, failure testing, and flaky-suite prevention.
- [Testing Boundaries](https://github.com/amirtaherkhani/nestjs-skills/blob/96fb9a22c59a54fa1250a2664455c71df4942dfc/docs/concepts/testing-boundaries.md): already distinguishes domain, application, adapter, module, transport, performance, and architecture checks.
- [Failure Resilience and Testing](https://github.com/amirtaherkhani/nestjs-skills/blob/96fb9a22c59a54fa1250a2664455c71df4942dfc/skills/nestjs-features-performance/references/failure-resilience-testing.md): already covers asynchronous error channels, cancellation, retry budgets, unknown write outcomes, duplicate messages, shutdown, and a failure matrix. Do not duplicate this as a newly discovered gap.
- [Package manifest](https://github.com/amirtaherkhani/nestjs-skills/blob/96fb9a22c59a54fa1250a2664455c71df4942dfc/package.json): Nest common/core/platform-express 11.2.7, TypeScript 5.9.3, Supertest 7.3.1; repository scripts include native `node --test` evaluation tests. No Jest/Vitest dependency or `@nestjs/testing` appears in this manifest. This is a skills repository, not proof of any downstream application's runner choice.

## Ordered topic backlog

The order below is a proposal for the next research pass, not an approved implementation plan.

### 1. Version and execution baseline

- Resolve target Nest major, Node support matrix, CommonJS/ESM, compiler, decorator metadata, HTTP adapter, and existing test runner before choosing examples.
- Compare preserving an established Jest stack, Vitest with a supported Nest compiler path, and compiled JavaScript with `node:test`.
- Verified warning: native Node TypeScript stripping does not transform decorators or read `tsconfig.json`. It is not a drop-in way to execute normal decorator-based Nest TypeScript tests.
- Next deliverable: a small compatibility matrix with exact versions and commands. No migration recommendation until compatibility evidence exists.
- Sources: S1–S5, S10.

### 2. Boundary taxonomy and evidence claims

- Distinguish isolated unit, sociable/application unit, Nest module wiring, dependency integration, consumer/provider contract, HTTP application integration, and deployed end-to-end tests.
- Existing references already select boundaries by risk. Investigate terminology and claims: an HTTP test with a replaced database proves its HTTP path, not database correctness or deployed-system behavior.
- Avoid prescribing a universal pyramid/trophy percentage. Compare feedback speed, realistic semantics, diagnostic clarity, and maintenance cost.
- Proposed example: one business operation shown at three boundaries, with explicit “proves / does not prove” notes.
- Sources: repository baseline, S1, S6–S7. This taxonomy is a proposed editorial model, not an official Nest standard.

### 3. Nest module, lifecycle, and override tests

- Investigate exact provider tokens, overrides, module exports, request scopes, global enhancers, and bootstrap behavior.
- Verified from Nest 11.2.7 source: `compile()` creates the graph and instances; its implementation does not call application-context `init()`. Application initialization and shutdown deserve separate assertions.
- Research pitfalls: replacing the subject under test, auto-mocking away missing wiring, global `APP_*` enhancer overrides, `get()` versus scoped resolution, and helper setup that silently differs from `main.ts`.
- Proposed examples: imported module/export consumer; provider override; lifecycle-hook assertion; request-scope isolation; real authorization rejection.
- Sources: S1, S8–S9.

### 4. Real database tests and isolation

- Compare container per test/suite/worker, a shared container with separate databases/schemas, truncation/reset, and transaction rollback.
- Determine which arrangements can test independent connections, commit visibility, constraints, concurrency, migrations, and outbox behavior. A transaction wrapper is not automatically suitable for an HTTP app using another connection pool.
- Testcontainers supplies infrastructure; the suite still owns data isolation, readiness, migration setup, and awaited teardown.
- Proposed example: PostgreSQL constraint and concurrent-write tests with real migrations, unique worker namespace, bounded readiness, and cleanup ownership.
- Sources: S11–S13. Transaction strategy comparisons remain planned research, not verified adapter-specific instructions.

### 5. HTTP and external contract tests

- Separate generated schema checks, consumer-driven contracts, provider verification, external sandbox checks, and whole-system journeys.
- Compare Supertest/HTTP-server tests and Fastify injection where relevant. Research production configuration parity, serialization allow-lists, validation, auth/ownership, pagination, and stable error responses.
- Pact consumer tests alone do not establish that the real provider satisfies the contract; provider verification is a separate stage.
- Proposed examples: invalid input and denied ownership over HTTP; one consumer/provider interaction with deliberate incompatible change.
- Sources: S1, S6–S7.

### 6. Events, queues, and durable-work contracts

- Separate in-process listener registration and async completion from Redis/broker-backed delivery behavior.
- Research duplicate delivery, retries, poison jobs, acknowledgement timing, idempotency, interrupted work, mixed-version payloads, and shutdown.
- Verified discovery: Nest documents listener-readiness concerns for events emitted during bootstrap. A direct handler call cannot establish listener registration or broker wiring.
- Proposed examples: listener registration after initialization; duplicate delivery producing one business effect; retry exhaustion; shutdown during work.
- Sources: S14–S16 and the existing failure-resilience reference. Broker-specific guarantees and exact helper APIs remain unverified.

### 7. Flaky-test prevention and test-double discipline

- Turn the current checklist into demonstrations: controlled clocks/IDs, explicit completion signals, bounded polling with diagnostics, clean teardown, and isolated ports/data/queues.
- Compare small owned-port fakes and runner spies with module-level mocking; include ESM import-order and mock-reset pitfalls.
- Distinguish process/file isolation from external database isolation. Parallel workers do not make shared databases safe.
- Proposed examples: time-based policy without sleeps; deterministic async assertion; failure caused by a leaked worker; shared-state test that becomes parallel-safe.
- Sources: S3–S5, S12–S13, S17–S19. A flake quarantine should have an owner and exit criterion, not quietly become permanent.

### 8. CI evidence, test quality, and maintenance

- Define lanes by evidence: static/type checks and focused tests; real-dependency tests; contract verification; a small deployed smoke set; scheduled load/failure checks when justified.
- Research artifact collection, reproducible versions/images, Docker availability, worker/resource budgets, deterministic sharding, migration upgrade coverage, and failure diagnostics.
- Compare coverage thresholds with risk/branch assertions and deliberate mutation checks. A coverage percentage does not establish assertion quality.
- Proposed deliverable: example-to-CI acceptance matrix, with deliberate breakages that each test must detect and clear exclusions.
- Primary CI documentation and mutation-tool selection are pending; no tool has been chosen.

## Primary-source inventory

All entries below were opened on 2026-10-06 UTC. “Opened” means reviewed for discovery and selected claims; it does not mean every API/version combination or example was verified by execution. Current documentation can change after this date.

| ID | Source | Version / evidence status |
| --- | --- | --- |
| S1 | [Nest v11 testing](https://docs.nestjs.com/v11/fundamentals/testing) | Versioned v11; matching baseline; runner-agnostic utilities and Jest examples |
| S2 | [Current Nest testing](https://docs.nestjs.com/fundamentals/testing) | Current/newer defaults; Vitest examples; do not assume v11 scaffold parity |
| S3 | [Nest SWC recipe](https://docs.nestjs.com/recipes/swc) | Current page explicitly mentions v12; compiler metadata and Vitest/Jest configuration |
| S4 | [Jest ESM](https://jestjs.io/docs/ecmascript-modules) | Page labels 30.5; ESM support/mocking limitations are version-sensitive |
| S5 | [Vitest migration guide](https://vitest.dev/guide/migration/) | Current guide; migration differences require installed-version verification |
| S6 | [Pact consumer tests](https://docs.pact.io/consumer) | Living guide; contract design, not general business-logic testing |
| S7 | [Pact provider verification](https://docs.pact.io/provider) | Living guide; separate provider verification stage |
| S8 | [Nest TestingModuleBuilder source](https://github.com/nestjs/nest/blob/v11.2.7/packages/testing/testing-module.builder.ts) | Pinned v11.2.7; compile and override implementation inspected |
| S9 | [Nest application-context source](https://github.com/nestjs/nest/blob/v11.2.7/packages/core/nest-application-context.ts) | Pinned v11.2.7; initialization/shutdown implementation inspected |
| S10 | [Node TypeScript support](https://nodejs.org/api/typescript.html) | Current page labels v26.10.0; not the repository's declared runtime pin |
| S11 | [Testcontainers PostgreSQL](https://node.testcontainers.org/modules/postgresql/) | Living guide; container lifecycle and connection APIs; package version not yet pinned |
| S12 | [Testcontainers wait strategies](https://node.testcontainers.org/features/wait-strategies/) | Living guide; readiness conditions and bounded startup |
| S13 | [Testcontainers global setup](https://node.testcontainers.org/quickstart/global-setup/) | Living guide; lifecycle-sharing tradeoffs and serializable setup data |
| S14 | [Nest events](https://docs.nestjs.com/techniques/events) | Current guide; registration/readiness issue verified; installed package still to check |
| S15 | [Nest queues](https://docs.nestjs.com/techniques/queues) | Current guide opened; transport-specific details pending |
| S16 | [BullMQ failing-job retries](https://docs.bullmq.io/guide/retrying-failing-jobs) | Living guide opened; exact version and failure examples pending |
| S17 | [Jest mock API](https://jestjs.io/docs/mock-function-api) | Current guide opened; reset/restore details to compare with selected version |
| S18 | [Vitest module mocking](https://vitest.dev/guide/mocking/modules) | Current guide opened; exact module-mode examples pending |
| S19 | [Vitest parallelism](https://vitest.dev/guide/parallelism.html) | File/test concurrency distinction inspected; external-resource isolation remains suite responsibility |
| S20 | [Node test runner](https://nodejs.org/api/test.html) | Current page labels v26.10.0; feature stability varies; target-LTS check pending |
| S21 | [Nest lifecycle](https://docs.nestjs.com/fundamentals/lifecycle-events) | Current documentation; version-pinned source also inspected |
| S22 | [Nest module reference](https://docs.nestjs.com/fundamentals/module-ref) | Current documentation; scoped resolution research source |
| S23 | [Nest custom providers](https://docs.nestjs.com/fundamentals/custom-providers) | Current documentation; tokens/factories/aliases research source |

## Community discovery queue, not adopted standards

Planned venues: NestJS GitHub issues and linked testing examples; Jest ESM issue discussions linked from S4; Vitest issue/discussion threads about Nest decorators and runner migrations; Testcontainers Node issues concerning CI/container lifecycle; BullMQ issue/discussion threads on retries and shutdown; Pact community examples of provider-state design.

No community opinion has been used as a verified technical claim in this inventory. Next pass should record the exact thread, date, reproduction, relevant package versions, maintainer response, and whether the issue still reproduces. Verify conclusions against primary documentation/source and, only if authorized later, a minimal executable example.

## Suggested decision gate

Agree the topic order and target runtime first. Then research topics 1–4 deeply before selecting runner-specific examples. A later teaching contribution could extend the existing reference with linked, versioned examples; this inventory does not establish that a separate new skill is necessary.
