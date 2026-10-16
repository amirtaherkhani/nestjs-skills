# Runtime examples research record

Checked 2026-10-16. This is original implementation and contract-test work informed by the [Kadajett inventory](https://github.com/Kadajett/agent-nestjs-skills/blob/main/skills/nestjs-best-practices/SKILL.md) and its [compiled rule discussion](https://github.com/Kadajett/agent-nestjs-skills/blob/main/AGENTS.md). Existing attribution in `SOURCES.md` remains intact. No upstream code or numeric performance promises were imported. The upstream inventory observed during research identifies version 1.2.0; the links track upstream main and are not immutable snapshots.

## Selected scope and coverage

Categories 10 (operations), 2 (DI), and 5 (performance) are completed at the stated teaching-contract level. [Runnable sources, 17 checks and limitations](https://github.com/amirtaherkhani/nestjs-skills/blob/main/examples/runtime-contracts/README.md) are the implementation evidence. NestJS 11.2.7 and TypeScript 5.9.3 remain pinned; no optional infrastructure packages were added.

| Upstream rule | Local evidence | Decision |
| --- | --- | --- |
| `devops-use-config-module` | `parseSettings`, provider-construction rejection | Validate configuration once at composition; fixture uses a custom provider because ConfigModule is not installed. |
| `devops-use-logging` | `CompletionLogger`, allowlist and malformed-ID checks | Bounded application events; framework logger/transport integration remains project-specific. |
| `devops-graceful-shutdown` | `ManagedResource`, awaited close and phase checks | Cleanup correctness; no zero-downtime or OS-signal claim. |
| `di-avoid-service-locator` | `CanReserve` constructor dependency | Keep lookup out of business operations; lazy loader is an explicit framework boundary. |
| `di-interface-segregation` | Query-only `StockReader` substitute | Consumer does not depend on mutation/admin operations. |
| `di-liskov-substitution` | Shared behavioral checks plus invalid adapter controls | Structural conformance is insufficient. |
| `di-prefer-constructor-injection` | Real Nest construction and missing-token failure | Required dependencies are visible at creation. |
| `di-scope-awareness` | Singleton/transient/request context identity checks | Choose lifetime for state semantics; no speed percentage. |
| `di-use-interfaces-tokens` | Alias identity and lookalike Symbol failure | Import the same runtime token. |
| `perf-async-hooks` | Awaited startup, rejection and cleanup | Lifecycle coordination is not a generic optimization. |
| `perf-use-caching` | Single-value cache, expiry/coalescing/failure checks | Explicit size, lifetime and sharing boundaries. |
| `perf-optimize-database` | Bounded tenant/projection/order query-port checks | Real database plans and adapter tests are still needed. |
| `perf-lazy-loading` | Real lazy loader reuse and absent hooks | Optional graph deferral, with first-use and lifecycle costs. |

## Verified sources and corrections

- [Nest configuration](https://docs.nestjs.com/techniques/configuration) supports central validation; a typed getter alone cannot establish runtime validity.
- [Custom providers](https://docs.nestjs.com/fundamentals/custom-providers) and [scopes](https://docs.nestjs.com/fundamentals/injection-scopes) ground tokens, aliases and context behavior. Tests run those APIs locally.
- [Lifecycle](https://docs.nestjs.com/fundamentals/lifecycle-events) distinguishes explicit close from enabled signal listeners. Request-scoped classes do not receive application lifecycle hooks.
- [Lazy loading](https://docs.nestjs.com/fundamentals/lazy-loading-modules) documents reuse and lifecycle limitations. The fixture tests both; it does not infer a speedup.
- [Logger](https://docs.nestjs.com/techniques/logger) distinguishes application logging from Nest bootstrap integration. Current online APIs can differ from the pinned major; the fixture avoids adopting newer logging features without installed-version proof.
- [Caching](https://docs.nestjs.com/techniques/caching) describes package/store semantics. The dependency-free fixture makes its own cache policy explicit rather than pretending to test CacheModule.
- [Node event-loop guidance](https://nodejs.org/en/learn/asynchronous-work/dont-block-the-event-loop) explains why an asynchronous declaration does not make synchronous CPU work nonblocking.
- [Queues](https://docs.nestjs.com/techniques/queues) explicitly distinguishes Bull's named `@Process` handlers from BullMQ's `WorkerHost.process`. Do not copy a mixed-package worker example. Queue implementation belongs to category 9 backlog, not this scope; no Redis behavior is claimed.

## Ownership across the existing seven skills

| Skill | Existing responsibility and gap addressed by this work |
| --- | --- |
| Architecture Principles | Primary owner of DI composition and lifetime. Constructor/token, alias, context and scope assertions turn existing guidance into runtime evidence. |
| Features and Performance | Primary owner of operations and performance. Adds executable startup/cleanup, safe event logging, bounded cache, query-request and lazy-module contracts alongside existing diagnosis/deployment guidance. |
| OOP and Design Patterns | Owns substitutability and consumer-shaped collaboration. The same query-port behavior is exercised against two implementations and invalid controls; no new pattern taxonomy is needed. |
| Professional Software Engineering | Owns implementation conventions and verification. Strict TypeScript compilation and deterministic contracts demonstrate the existing workflow without introducing optional package dependencies. |
| Code Audit | Owns evidence-backed findings. Failed token wiring, invalid adapter results and rejected configuration are reproducible examples; an auditor must still trace the actual target code before reporting a finding. |
| Feature Audit | Owns applicability and roadmap evidence. The coverage matrix separates teaching contracts from absent real infrastructure proofs, so example presence cannot be mistaken for a production feature. |
| Git Commit and PR | Owns reviewable change scope and provenance. Relevant/full checks, explicit staging and a local commit preserve the existing workflow; the research record distinguishes upstream inspiration from original code. |

Only the primary architecture and runtime references gain pointers. Supporting skills retain their existing ownership; their role here is to interpret evidence rather than duplicate runtime guidance.

## Remaining seven categories

| Category | Backlog boundary |
| --- | --- |
| 1 Architecture | Further upstream-specific module/cycle/event coverage |
| 3 Error handling | Further asynchronous and transport contract coverage |
| 4 Security | Further authentication/authorization/rate-limit coverage |
| 6 Testing | Further testing-module and external-boundary examples |
| 7 Database & ORM | Real driver transactions, migration and N+1 evidence |
| 8 API design | Further upstream-specific versioning and transport coverage |
| 9 Microservices | Real broker, health and queue integration; correct BullMQ package APIs |

These categories already have guidance and some fixtures in this repository. The backlog records deferred expansion, not absence of existing support. Tests added to verify selected rules do not imply category 6 was implemented, and the query-port fixture does not imply category 7 was implemented.
