# Four-axis boundary examples

Run from the repository root: npm run test:boundaries. The runner compiles these TypeScript sources with the pinned Nest 11.2.7 / TypeScript 5.9.3 dependencies and runs 16 deterministic tests.

| Focus | Sources | Healthy and negative controls |
| --- | --- | --- |
| Module contracts/provider wiring | modules.ts | Two feature modules share verification; private-provider and same-description Symbol injection fail |
| Authentication/application/storage separation | modules.ts | Small immutable principal; library writes and school capacity remain consumer-owned; denied writes leave state intact |
| Behavioral substitution | inventory-reader.ts, provider-contract.mjs | Array and Map adapters pass one suite; a type-compatible aliasing adapter fails it |
| Enhancer responsibility/order | runtime.ts | Real HTTP traces; guard denial and validation errors short-circuit; route filter consumes its error; both global singleton filter registrations retain DI |
| DTO/domain/internal types/project rules | runtime.ts, domain.ts, internal-types.ts | Unknown body schema, output projection, domain invariants for internal callers; erased-token compiler control and profile-specific import rejection |

The abstract-class notification token uses an adapter that implements its shape without extending it. The existing provider-lifetime catalog additionally compares useExisting alias identity against a separate useClass instance and manual request-context resolution.

The files use focused teaching policies: one-place enrollment, fixed in-memory credentials, a two-unit inventory and preview notifications. They are not production auth, persistence, concurrency, transactional or distributed examples. The trace recorder is intended only for sequential tests. The HTTP fixture uses Express, one body argument and explicit schema validation; it does not claim class-validator metadata, nested ValidationPipe behavior, other transports or request-scoped global-filter support.

The project import check protects this example's domain rule and includes a different healthy direct-ORM profile. It is not a general analyzer or proof of agent compliance. The compile-only erased-token expression is never invoked. These tests make no agent-quality or performance claim and do not implement the separate generator feasibility task.

See the [module contracts](../../skills/nestjs-architecture-principles/references/module-contracts.md), [enhancer composition](../../skills/nestjs-features-performance/references/enhancer-composition.md), [object roles](../../skills/nestjs-oop-design-patterns/references/object-design.md) and [project profile](../../skills/nestjs-professional-software-engineering/references/project-profile-and-scaffolding.md) guidance.
