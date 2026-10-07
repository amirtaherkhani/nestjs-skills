---
title: Events, Queues, and Outbox
description: Choose synchronous calls, events, queues, and transactional outbox delivery by consistency and failure semantics.
---

<p class="doc-kicker">Core concept · Reliability</p>

# Events, queues, and outbox

<p class="doc-lede">These mechanisms are not interchangeable. Choose from the consistency requirement, delivery guarantee, latency expectation, and ownership boundary.</p>

## Decision table

| Mechanism | Best fit | Caller waits? | Failure model |
| --- | --- | --- | --- |
| Direct call | Immediate result within one application boundary | Yes | Failure returns to caller |
| In-process event | Independent reaction where best-effort delivery is acceptable | Usually no | Lost on crash unless separately persisted |
| Durable queue | Deferred, bursty, retryable, or resource-heavy work | No | Duplicate and delayed delivery must be expected |
| Transactional outbox | Database write and durable publication must agree | No | Publisher retries committed outbox records |

An event names a completed fact such as `OrderPlaced`. A command asks for work such as `CapturePayment`. Do not rename a synchronous command as an event to avoid defining its failure contract.

## Use queues for operational separation

A durable queue is useful when work can happen later, has a different capacity profile, must absorb bursts, or should retry independently from the request. It also introduces queue lag, duplicate delivery, poison messages, retention, worker deployment, and shutdown concerns.

Every consumer should define:

- an idempotency key or deduplication strategy;
- bounded concurrency and payload size;
- retryable versus terminal errors;
- exponential backoff with jitter and a retry limit;
- dead-letter or operator recovery behavior;
- trace, metric, and structured-log correlation;
- safe drain or requeue behavior during shutdown.

## Close the dual-write gap with an outbox

If a business write and message publication must not diverge, write the business state and an outbox record in the same database transaction:

```text
request transaction
  ├─ update aggregate
  └─ insert outbox record

publisher
  ├─ claim committed records
  ├─ publish message
  └─ mark published (or retry)
```

The outbox closes the gap between committing data and publishing a message, but it does not create exactly-once side effects. The publisher or broker can still deliver more than once, so consumers remain idempotent.

## Preserve ownership

Architecture decides which capability owns the fact and its transaction. Object design makes the event immutable and meaningful. Runtime design chooses in-process or durable transport, serialization, retries, backpressure, observability, and recovery.

Use [Scaling and reliability](/reference/features-performance/references/scaling-reliability) for operational rules and [Pattern catalog](/reference/oop-patterns/references/pattern-catalog) for selection forces.

For executable application examples, see [in-process observers](/reference/oop-patterns/references/pattern-catalog#observer-and-domain-events), [transactional outbox](/reference/oop-patterns/references/pattern-catalog#transactional-outbox), and [saga/process manager](/reference/oop-patterns/references/pattern-catalog#saga-process-manager). Their tests use in-memory adapters and exercise failure paths; actual database and broker guarantees need separate integration checks.
