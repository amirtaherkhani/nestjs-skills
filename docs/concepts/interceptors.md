---
title: Interceptors
description: Use NestJS interceptors for deliberate behavior around handler execution.
---

<p class="doc-kicker">Core concept · Runtime</p>

# Interceptors

<p class="doc-lede">An interceptor wraps handler execution. It can run work before the handler, transform or observe the returned stream, and centralize compatible cross-cutting behavior.</p>

## What an interceptor owns

Interceptors are a strong fit for concerns that need both the execution context and the handler result:

- latency measurement and tracing spans;
- structured request completion logs;
- response serialization or a consistent envelope;
- timeout policy at a transport boundary;
- cache behavior when the handler contract is compatible.

Use a guard for an access decision, a pipe for input validation or transformation, and an exception filter for final protocol-specific error mapping. Keep business invariants and workflows in application or domain code.

## Execution model

`intercept()` receives the current `ExecutionContext` and a `CallHandler`. Calling `next.handle()` continues execution and returns an RxJS `Observable` representing the rest of the pipeline.

```ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable()
export class RequestTimingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RequestTimingInterceptor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    const startedAt = performance.now();
    const handler = context.getHandler().name;

    return next.handle().pipe(
      finalize(() => {
        const elapsedMs = performance.now() - startedAt;
        this.logger.log({ handler, elapsedMs });
      }),
    );
  }
}
```

`finalize()` runs when the observable completes, errors, or is unsubscribed, which makes it appropriate for closing timing or tracing work. Preserve the original error unless the interceptor explicitly owns a documented error contract.

## Transform a compatible result

Use `map()` when every targeted handler has a compatible response contract:

```ts
import { map, Observable } from 'rxjs';

type Envelope<T> = { data: T };

intercept<T>(
  _context: ExecutionContext,
  next: CallHandler<T>,
): Observable<Envelope<T>> {
  return next.handle().pipe(map((data) => ({ data })));
}
```

Do not apply a JSON envelope blindly to file downloads, streams, server-sent events, or handlers that already return transport-native responses. Narrow the interceptor scope or define an explicit opt-out metadata contract.

## Register with dependency injection

For an application-wide interceptor, register it through Nest's provider system:

```ts
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestTimingInterceptor,
    },
  ],
})
export class ObservabilityModule {}
```

This keeps construction in the composition root and allows injected dependencies. Controller- or route-level interceptors are better when the behavior belongs to a smaller contract surface.

## Ordering

On the way in, interceptors run from the outer scope toward the handler. On the way out, their observable operators resolve in reverse order. Treat nesting as part of the contract when combining tracing, caching, serialization, and error mapping.

```text
A before → B before → handler → B after → A after
```

Avoid relying on incidental provider-array order across unrelated modules. If order is correctness-critical, compose the behavior deliberately and cover it with an integration test.

## Common failure modes

### Hiding business behavior

An interceptor that charges a card, writes an audit business fact, or changes an aggregate hides required workflow behind controller metadata. Invoke those operations explicitly from the use case. An interceptor may still record technical telemetry about the call.

### Swallowing or flattening errors

Mapping every exception to one response destroys error semantics and observability. Let an exception filter own protocol mapping, or catch only the error class the interceptor is designed to handle.

### Unbounded buffering

Collecting a full response or request body for logging can amplify memory use and expose sensitive data. Record bounded metadata and redact secrets; stream large payloads without materializing them.

### Request scope by default

Request-scoped dependencies propagate their lifetime through the injection graph and add allocation. Use them only when request-specific state cannot be passed explicitly or represented by established context.

## Test the boundary

Test an interceptor at two levels:

1. **Focused test:** provide a controlled `CallHandler` observable and verify transformation, cleanup, and error preservation.
2. **Integration or e2e test:** register it through the real module and verify ordering, metadata, transport behavior, and excluded routes.

For performance interceptors, keep the hot path bounded and validate logging or tracing overhead under a representative workload. Instrumentation that dominates the endpoint is itself a bottleneck.

See [Request lifecycle](./request-lifecycle) for neighboring primitives and [NestJS-native patterns](/reference/oop-patterns/references/nestjs-native-patterns) for the object-design perspective.
