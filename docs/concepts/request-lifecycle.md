---
title: Request Lifecycle
description: Place cross-cutting behavior in the correct NestJS request lifecycle primitive.
---

<p class="doc-kicker">Core concept · Runtime</p>

# Request lifecycle

<p class="doc-lede">NestJS provides several extension points around a handler. Choose by lifecycle responsibility—not by which decorator or example is easiest to copy.</p>

## The HTTP path

For a typical successful HTTP request, the useful mental model is:

```text
request
  → middleware
  → guards
  → interceptors (before)
  → pipes
  → controller and providers
  → interceptors (after, reverse order)
  → response
```

An uncaught exception leaves the normal success path and is mapped by an applicable exception filter. GraphQL, WebSocket, RPC, and scheduled execution use different context objects, so verify transport compatibility before reusing an HTTP-specific component.

## Choose by responsibility

| Primitive | Owns | Good examples | Keep out |
| --- | --- | --- | --- |
| Middleware | Raw protocol preprocessing | Correlation context, compatible HTTP headers | Authorization policy, response mapping |
| Guard | Whether execution may continue | Authentication, authorization, tenant access | DTO transformation, business workflow |
| Pipe | Input value validation and transformation | Parse IDs, validate DTOs, normalize bounded input | Database access, response mapping |
| Interceptor | Behavior around handler execution | Timing, tracing, response envelopes, compatible caching | Core authorization or domain invariants |
| Exception filter | Final protocol error mapping | Domain error to HTTP response | Normal control flow, swallowed failures |
| Decorator | Declarative metadata or context extraction | `@CurrentUser()`, policy metadata | Hidden network or database work |
| Provider / use case | Business operation and orchestration | Place order, approve refund | Transport-specific response objects |

## Scope and order matter

Components can be global, controller-scoped, or method-scoped. Before adding one:

1. Decide which routes and transports actually share the concern.
2. Check ordering against existing global and local components.
3. Confirm dependencies can be injected at the chosen registration point.
4. Test both the success path and short-circuit or error path.

Global behavior has the largest compatibility surface. A response-mapping interceptor that works for JSON may corrupt a stream or file response; an authentication guard registered globally may block health endpoints unless that policy is explicit.

## Keep business policy below the lifecycle

Framework components should adapt context and invoke policy, not become the only home of policy. For example, a guard may extract an authenticated principal and call an authorization policy, while the policy remains testable without constructing an HTTP request.

This separation also makes transport changes safer: the same policy can be invoked from HTTP, GraphQL, or a message handler while each adapter handles its own execution context.

## Validate placement

Ask these questions in order:

- Does the concern happen before, after, or around handler execution?
- Does it decide access, transform a value, map an error, or coordinate business behavior?
- Is it tied to HTTP, or should it work across execution contexts?
- Does it need dependency injection, request scope, or durable state?
- What existing component runs immediately before and after it?

Continue with [Interceptors](./interceptors) or use the complete [feature-selection reference](/reference/features-performance/references/feature-selection).
