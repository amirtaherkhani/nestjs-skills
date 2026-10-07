# Executable pattern catalog

The [pattern catalog](../../skills/nestjs-oop-design-patterns/references/pattern-catalog.md) contains 19 original examples. Each entry explains the design pressure, shows complete TypeScript with Nest wiring, and describes its tradeoffs and behavior checks.

From the repository root:

```bash
npm ci
npm run test:patterns
```

The runner extracts the catalog's marked code blocks into the ignored `examples/.build/` directory, compiles them with strict TypeScript and decorator metadata, and runs [the contracts](contract.test.mjs). The code displayed in the documentation is the code under test. No second implementation is maintained in this directory.

Nest application contexts verify provider construction and injection. The layered example also exercises the real HTTP boundary through Supertest. Tests close their application contexts, use a controllable clock for cache expiry, and require no credentials or external services.

## Scenarios and contracts

| Catalog entry | Practical scenario | Behavior checked |
| --- | --- | --- |
| Strategy | Select standard or priority delivery pricing | Both algorithms, common input rules, unknown selection |
| Factory | Choose a preview writer; create one through an overridable method | Container identity, unsupported formats, Factory Method hook |
| Builder | Construct bounded invoice search criteria | Final validation, immutable results, separate operation state |
| Adapter | Translate a vendor stock response | Zero stock, malformed replies, missing items, private vendor errors |
| Bridge | Combine receipt/overdue wording with email/SMS delivery | All four combinations and Nest factory wiring |
| Facade | Obtain shipment status and its tracking link | Combined result and missing shipment failure |
| Layered flow | Look up an item through HTTP, application, and storage boundaries | Parsing, response shape, 404 mapping, application error type |
| Decorator | Measure a quote operation | Successful values, original errors, outcome recording |
| Proxy | Cache quotes with a short freshness allowance | Zero, expiry, invalidation, bounded entries, failure propagation |
| Observer | Notify independent order listeners | Awaited callbacks, failure isolation, subscription cleanup |
| Command | Archive a note through a named request | Idempotent local behavior and missing note failure |
| Template Method | Parse, validate, and save an ID import | Validation before effects and awaited persistence failure |
| Chain of Responsibility | Apply ordered order-review rules | First match, precedence, fallback, invalid input |
| Repository | Find unpaid invoices due for one tenant | Tenant boundary, cutoff, payment state, defensive copies |
| Nest provider lifetime | Share settings and isolate request context | Module reuse, provider alias identity, request scope |
| Unit of Work | Transfer between two accounts | Commit, rollback after debit, competing requests |
| Specification | Compose shipping eligibility rules | Truth table, conjunction, disjunction, negation |
| Transactional outbox | Confirm an order and publish its event | Atomic orchestration, rollback, pending retries, duplicate delivery |
| Saga/process manager | Reserve stock and charge or compensate | Saved-state recovery, event deduplication, timeout reconciliation, atomic command staging |

## What the fixtures prove

The package lock pins NestJS 11.2.7 and TypeScript 5.9.3. Local compilation and behavior checks use those versions; CI uses Node.js 22. During the 2026-10-07 source check, `npm view @nestjs/core version` returned 12.1.2. Current official documentation was consulted, but this change does not upgrade dependencies or claim a NestJS 12 test run. Refresh the registry and installed-version checks before adapting these examples to another project.

CSV and PDF previews return teaching strings. The mail and SMS channels return local strings. The shipment URL uses a reserved example domain. These examples do not generate files, send messages, or contact a carrier.

[support.mjs](support.mjs) supplies in-memory transaction, outbox, and saga adapters. They serialize operations and commit cloned state only when the callback succeeds. Tests exercise the application code's orchestration against that contract. They cannot establish a real database's transaction isolation or broker durability. The saga restart test creates a new manager over the retained memory store; it does not simulate a process crash or disk recovery.

Before production use, run adapter contracts against the actual database and broker. Cover locking, commit failure, crash recovery, consumer deduplication, persisted deadlines, command delivery, and reconciliation. The catalog names further limits beside each example. Working snippets are evidence about these fixtures, not a measurement of agent quality or a production architecture recommendation.

## Existing examples elsewhere

The [before/after HTTP fixtures](../README.md) cover boolean parsing, an invariant bypass through exported storage, and a measured local API optimization. The skill's [object design](../../skills/nestjs-oop-design-patterns/references/object-design.md) and [OOP/SOLID](../../skills/nestjs-oop-design-patterns/references/oop-solid.md) references already contain entity, value-object, port, and polymorphism snippets. The catalog adds executable pattern examples alongside that material.
