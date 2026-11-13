# BullMQ Workers

Use this reference when the repository already processes jobs with `@nestjs/bullmq`. It applies the handler rules in [scaling and reliability](scaling-reliability.md) to that package; it does not choose a queue product. Read the installed `bullmq` and `@nestjs/bullmq` versions first, because option names and defaults change between major versions.

## Confirm the package before writing a processor

`@nestjs/bullmq` and `@nestjs/bull` have different consumer APIs. Do not mix them.

| Signal in the repository | Consumer shape |
| --- | --- |
| `@nestjs/bullmq` and `bullmq` | Class with `@Processor('queue')` that extends `WorkerHost` and implements `process(job)`; route by `job.name` |
| `@nestjs/bull` and `bull` | `@Process('name')` handler methods |

```ts
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('receipts')
export class ReceiptProcessor extends WorkerHost {
  constructor(private readonly sendReceipt: SendReceipt) {
    super();
  }

  async process(job: Job<ReceiptJob>): Promise<void> {
    switch (job.name) {
      case 'send':
        return this.sendReceipt.execute(job.data.orderId, job.data.operationKey);
      default:
        throw new Error(`Unknown job name ${job.name}`);
    }
  }
}
```

Register processors as providers in a module that only worker processes import when web and worker capacity differ. Worker-level events use `@OnWorkerEvent` inside the processor; queue-level events need a `QueueEventsHost` class with `@QueueEventsListener`. During a rolling deployment an unknown job name may come from a newer producer, so decide whether it fails terminally or stays retryable for a newer worker.

## Assume every job can run more than once

BullMQ provides at-least-once processing. A job runs again when:

- the processor throws and attempts remain;
- the worker stops renewing the job lock (a crash, a kill during deployment, or an event loop blocked past the stalled check, about 30 seconds by default) and the job returns to waiting;
- an operator replays a failed job.

A job that stalls more than `maxStalledCount` times (default 1) fails permanently even though its code never threw.

- Carry a stable operation key in the job data and claim it atomically with the protected write, following the idempotency steps in [scaling and reliability](scaling-reliability.md).
- Do not treat a custom `jobId` or the `deduplication` option as the idempotency guard. They only block a second enqueue. A custom `jobId` is accepted again once `removeOnComplete` or `removeOnFail` deletes the earlier job, so its window equals the retention window, and neither protects against redelivery of an accepted job.
- Pass an idempotency key to external providers that support one; a local record does not make a remote call atomic.

## Classify failures inside the processor

- `attempts` defaults to 1, so a failed job is not retried unless the producer or `defaultJobOptions` sets it. Without `backoff`, a retry starts immediately.
- For transient failures set bounded `attempts` with `backoff: { type: 'exponential', delay, jitter }`. Exponential backoff waits `2 ^ (attemptsMade - 1) * delay` milliseconds; add up the series and compare it with the business deadline.
- For terminal failures (validation, authorization, missing aggregate, broken invariant) throw `UnrecoverableError` from `bullmq`. The job moves to failed without using the remaining attempts.
- Throw `Error` instances only; BullMQ's failure handling expects them.
- Map causes with the taxonomy in [error handling](error-handling.md) instead of inspecting messages.

## Keep the lock during CPU-heavy or long work

- CPU-bound code in `process()` blocks the event loop, the lock is not renewed, and the job stalls and is retried while the first run may still be executing.
- Move CPU-heavy handlers to a sandboxed processor (a separate file run in a forked process) or to a dedicated worker deployment. Nest dependency injection is not available inside a sandboxed processor; the function must build what it needs.
- Total concurrency is the worker `concurrency` multiplied by replicas. Bound it by the database pool and downstream rate limits, not by CPU count alone.
- Split or checkpoint jobs that can outlive the termination grace period.

## Retention, payload, and Redis

- Completed and failed jobs are kept forever by default, so Redis memory grows with traffic. Set `removeOnComplete` to a small count or age and `removeOnFail` to a larger one; the failed set is the inspection and replay surface.
- Job data is stored in Redis as clear text. Enqueue identifiers and immutable input, not secrets, tokens, or personal data that can be reloaded.
- BullMQ needs Redis `maxmemory-policy` set to `noeviction`, and jobs survive a Redis restart only with persistence enabled (AOF preferred). Verify both on the deployed instance; a cache-tier Redis often has neither.

## Producers and workers need different connection behavior

- Worker connections must keep `maxRetriesPerRequest: null` so blocking commands wait for Redis to return. BullMQ sets it on connections it creates and warns when a shared ioredis instance overrides it; treat that warning as a defect.
- A producer on a request path should fail fast when Redis is down (for ioredis, `enableOfflineQueue: false` on the queue connection). Otherwise `queue.add()` waits and requests pile up. Use a named configuration (`configKey`) when producers and workers in one application need different connection options.
- Decide the caller-visible result when enqueueing fails. When the job must exist if and only if a database write commits, enqueue from a transactional outbox instead of from the request handler.

## Shutdown

- `@nestjs/bullmq` closes workers in `onModuleDestroy` and queues in `onApplicationShutdown`. On a termination signal those hooks run only after `app.enableShutdownHooks()`. Without it, SIGTERM kills active jobs and they return as stalled.
- `worker.close()` waits for active jobs and has no built-in timeout in the TypeScript SDK. Set the platform grace period above the longest job plus margin; a job cut off at the deadline is recovered as stalled and runs again.
- A worker-only process can start with `NestFactory.createApplicationContext(WorkerModule)` and still needs `enableShutdownHooks()`.

## Verification gate

- Run the processor twice with the same job data and assert one effect and one stored result.
- Assert that a terminal failure throws `UnrecoverableError` and a transient one throws a plain `Error`.
- With a real Redis, verify the configured attempts and backoff, kill a worker mid-job and observe the stalled job complete once on another worker, and send SIGTERM during an active job to confirm it finishes inside the grace period.
- Check `maxmemory-policy`, persistence, and retention on the deployed Redis, not only locally.
- Alert on waiting count, oldest waiting job age, failed count, and stalled events.

A mocked `Queue` or a direct call to `process()` proves handler logic only. It does not prove delivery, retry, stall recovery, or shutdown behavior.

This reference owns `@nestjs/bullmq` processor shape, job options, retention, stall, connection, and shutdown rules. [Scaling and reliability](scaling-reliability.md) owns the queue decision, idempotency design, retry budget, and backpressure; [error handling](error-handling.md) owns failure classification.

See the official NestJS [queues](https://docs.nestjs.com/application/queues) and [lifecycle events](https://docs.nestjs.com/fundamentals/lifecycle-events) documentation, and BullMQ [going to production](https://docs.bullmq.io/guide/going-to-production), [stalled jobs](https://docs.bullmq.io/guide/jobs/stalled), [retrying failing jobs](https://docs.bullmq.io/guide/retrying-failing-jobs), [stop retrying jobs](https://docs.bullmq.io/patterns/stop-retrying-jobs), [job ids](https://docs.bullmq.io/guide/jobs/job-ids), [deduplication](https://docs.bullmq.io/guide/jobs/deduplication), [auto-removal of jobs](https://docs.bullmq.io/guide/queues/auto-removal-of-jobs), [sandboxed processors](https://docs.bullmq.io/guide/workers/sandboxed-processors), and [graceful shutdown](https://docs.bullmq.io/guide/workers/graceful-shutdown).
