# Runtime contracts: operations, DI, and performance

Run `npm run test:runtime` from the repository root after `npm ci`. The runner compiles the original TypeScript examples with the lockfile's NestJS 11.2.7 and TypeScript 5.9.3, then runs 17 deterministic behavior checks. It opens no listening ports and requires no credentials, database, broker, cache server, or extra dependency. `npm test` includes this suite.

These examples address categories 10, 2, and 5 of the upstream research inventory. The [research record](../../docs/research/runtime-contracts.md) maps all selected rules and records the remaining seven categories as backlog. Existing examples and skills already cover parts of those categories; backlog means they were not expanded by this change.

## Operations: validate, project logs, await cleanup

[operations.ts](operations.ts) provides three constructor-injected collaborators:

- `parseSettings` rejects malformed or out-of-range input, supplies explicit defaults, and freezes a small configuration value. Nest constructs it through a provider factory; invalid configuration rejects application creation before initialization. It consumes a supplied environment object and never changes `process.env`.
- `CompletionLogger` emits a bounded JSON event with an explicit field list. Extra body or authorization fields never reach the sink, and malformed IDs are rejected. It is an application event logger, not a replacement for Nest's system logger. The test sink stores lines; a real sink must define backpressure, failure policy, retention and access controls.
- `ManagedResource` waits for connection before readiness. On explicit `app.close()`, it marks itself unready, records shutdown phases, then awaits resource release in `onApplicationShutdown`, after Nest disposes its connections. Startup failure never marks it ready.

The fixture exercises lifecycle order without HTTP traffic. It does not prove draining active requests, signal delivery, process exit, readiness probe behavior or zero downtime. Production shutdown needs ingress removal, a bounded drain policy, dependency cleanup and a termination grace budget. Enable Nest shutdown hooks for the signals used by the deployment; do not add a competing immediate `process.exit()`. Connection and release adapters need their own deadlines and cancellation strategy. A hung adapter can hang startup or close. Failed partial connection must clean itself up; the example's fake does not model external handles.

Use the project's existing `ConfigModule` when available. This repository does not install `@nestjs/config`, so the fixture teaches the validation boundary with a custom factory. It does not exercise dotenv precedence, `ConfigService`, secret loading or schema-library integration. See the [configuration documentation](https://docs.nestjs.com/techniques/configuration). For Nest system logging, follow the installed version's `LoggerService` or `ConsoleLogger` API and test bootstrap failure plus buffered log delivery; the event logger here does not certify either.

## Dependency injection: visible dependencies and lifetime contracts

[injection.ts](injection.ts) gives `CanReserve` one query-only `StockReader` port, injected through a shared Symbol. It needs no write/admin interface, property injection or service lookup. The module aliases `LocalStock` with `useExisting`; a newly created Symbol with the same label fails wiring. A class adapter and a query-only substitute run the same consumer contract. Negative counts are rejected and dependency failures remain failures: matching TypeScript shape alone does not establish substitution.

The scope checks use Nest's real container. Two singleton consumers share one singleton dependency and receive distinct transient dependencies. Re-reading one singleton consumer retains its transient instance; transient does not mean a fresh object for every method call. Explicit context IDs demonstrate request-scope propagation to a consumer, tenant isolation, singleton sharing and the absence of application initialization hooks on request-scoped providers. These are container tests, not HTTP authentication or tenant authorization tests.

## Performance: contracts before timing claims

[performance.ts](performance.ts) has three deliberately narrow cases:

| Example | Applicability and checked behavior | Tradeoff and production boundary |
| --- | --- | --- |
| `PublicSummaryCache` | One public immutable string, at most 1024 UTF-8 bytes; a one-second TTL; one shared pending load; failed/oversized loads are not cached; empty strings are valid hits | Process-local and single-key. No tenant/user data, invalidation API, distributed coordination or stale-on-error guarantee. The origin must enforce a deadline/abort policy; coalescing does not cancel a hung origin. An oversized origin response can allocate before rejection. |
| `ListTitles` | One query-port call carrying tenant, ascending ID cursor, projection and limit 1–50; output excludes extra fields; invalid limits, overflow and unordered results fail | This is a query request contract with a fake adapter, not an SQL optimization benchmark. The actual adapter must apply filtering, ordering, selection and limiting in the database, parameterize inputs, enforce authorization and verify its plan/index on representative data. The fake cannot prove tenant filtering or query count within an ORM. |
| `Reports` | Optional provider graph absent before loading, reused afterward; lazy provider init hook remains uncalled | Nest graph deferral only: the module class is in the same file, so this example does not defer JS file evaluation. A real optional graph can use dynamic import. First-use cost/failure moves to the caller; no startup, memory or latency improvement is claimed. |

Cache time uses an injected clock, with no elapsed-time threshold. The TTL is this example's explicit millisecond policy; adopting `@nestjs/cache-manager` requires checking installed package/store versions and testing serialization and expiry separately. Private responses require authorization-aware keys and invalidation before cache reuse is safe.

Async initialization is correctness work, not an event-loop speed optimization. CPU-heavy synchronous work remains blocking even in an `async` method. Database tuning still needs real query plans and load evidence. Measure cold start, first use, steady-state latency, memory and failures before selecting lazy loading. Lazy modules are unsuitable for relying on normal lifecycle hooks or late controller registration.

Official references: [custom providers](https://docs.nestjs.com/fundamentals/custom-providers), [scopes](https://docs.nestjs.com/fundamentals/injection-scopes), [lifecycle](https://docs.nestjs.com/fundamentals/lifecycle-events), [logger](https://docs.nestjs.com/techniques/logger), [caching](https://docs.nestjs.com/techniques/caching), [lazy modules](https://docs.nestjs.com/fundamentals/lazy-loading-modules), and [Node event-loop guidance](https://nodejs.org/en/learn/asynchronous-work/dont-block-the-event-loop). Current documentation may target a newer major; the executable tests establish only the pinned local behavior.
