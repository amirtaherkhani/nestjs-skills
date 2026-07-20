# Pattern Selection Catalog

Start from a force or failure mode. Use the smallest pattern that makes the variation, boundary, or reliability property explicit.

## Strategy

**Signal:** one stable operation has several real algorithms selected by tenant, product, region, or configuration.

```typescript
export interface FraudPolicy {
  evaluate(input: FraudInput): Promise<FraudDecision>;
}
```

Keep selection separate from execution. A strategy should not inspect its own type discriminator. Avoid when one algorithm exists and no accepted requirement introduces another.

## Factory

**Signal:** construction is complex or depends on a validated discriminator.

```typescript
@Injectable()
class ExporterFactory {
  constructor(
    private readonly csv: CsvExporter,
    private readonly pdf: PdfExporter,
  ) {}

  for(format: ExportFormat): Exporter {
    if (format === 'csv') return this.csv;
    if (format === 'pdf') return this.pdf;
    throw new UnsupportedExportFormat(format);
  }
}
```

Do not use a factory to hide a single `new` with no policy.

## Adapter

**Signal:** an external SDK, legacy model, or transport shape does not match the application contract.

The adapter translates types, errors, timeouts, and semantics. It should not leak vendor-specific status codes through an otherwise vendor-neutral port.

## Facade

**Signal:** consumers need one cohesive operation over a complex subsystem.

In NestJS, an exported application service often serves as the facade of a feature module. Keep the facade focused on that capability; do not create an application-wide service that forwards unrelated calls.

## Decorator

**Signal:** behavior should wrap a stable operation without changing its contract—metrics, caching, tracing, or retry at a port boundary.

Distinguish the GoF object decorator from TypeScript/Nest metadata decorators. Nest interceptors can provide request-level wrapping, while an object decorator can wrap an application port outside HTTP.

Retries must be limited to operations safe to retry and must respect timeouts/idempotency.

## Proxy

**Signal:** access, laziness, remote invocation, or caching must be controlled behind the same interface.

Be explicit about remote failure semantics; a network proxy is not behaviorally identical to an in-memory object unless the contract includes latency, timeout, and partial failure.

## Observer and domain events

**Signal:** a fact has occurred and independent consumers may react without changing the source operation.

Use an in-process event for best-effort decoupling inside one process. Use a durable integration event plus outbox when other processes must reliably observe a committed change.

Avoid events when the producer requires an immediate result to complete its invariant.

## Command

**Signal:** a use-case request benefits from a named message, handler, middleware pipeline, audit trail, or dispatch abstraction.

Nest's CQRS package can implement commands, queries, and events. A plain injectable use-case class is simpler when dispatch adds no capability.

## Chain of Responsibility

**Signal:** ordered processors may handle, transform, authorize, or reject a request.

Nest middleware, guards, pipes, and interceptors form framework-managed chains. Put behavior in the correct lifecycle stage rather than building a parallel chain.

## Repository

**Signal:** the domain/application needs collection-like persistence operations independent of ORM details.

Design methods from use cases (`findPendingForSettlement`) rather than exposing a generic query builder. Do not wrap an ORM only to reproduce its complete API.

## Unit of Work

**Signal:** one use case changes several aggregates/repositories atomically and needs an explicit transaction boundary.

Keep transaction control at the application/infrastructure boundary. Avoid starting transactions in controllers or hiding long external network calls inside a database transaction.

## Specification

**Signal:** a business rule or query predicate is composed and reused across contexts.

Do not mix an in-memory domain predicate with an ORM expression unless the abstraction clearly supports both semantics and tests them.

## Transactional outbox

**Signal:** a database change and integration event must not diverge.

Write the aggregate change and outbox record in one local transaction. A relay publishes with retries; consumers remain idempotent. Plan retention, ordering keys, poison events, and observability.

## Saga/process manager

**Signal:** a long-running workflow spans services/transactions and needs explicit state, compensations, timeouts, and correlation.

Do not call a chain of ordinary service methods a saga. The pattern earns its cost only when partial progress and recovery are real domain concerns.

## Selection questions

Before adding any pattern:

1. What concrete change or failure is difficult now?
2. What remains stable, and what varies?
3. Who owns the abstraction?
4. What new indirection or runtime state appears?
5. How will tests prove all implementations preserve the contract?
6. What simpler design was rejected, and why?

If those questions have no concrete answers, keep the direct implementation.
