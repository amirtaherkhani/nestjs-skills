---
title: Modules and Boundaries
description: Design cohesive NestJS feature modules with clear ownership and small public APIs.
---

<p class="doc-kicker">Core concept · Architecture</p>

# Modules and boundaries

<p class="doc-lede">A Nest module is useful when it expresses capability ownership and controls a real public API—not merely when it groups files with similar technical names.</p>

## Organize by capability

Start with business capabilities such as `Orders`, `Billing`, or `Identity`. Each capability should own its invariants, writes, and the providers needed to fulfill its operations.

```text
orders/
  application/
  domain/
  infrastructure/
  orders.controller.ts
  orders.module.ts
```

Internal layers are optional. Add them when domain complexity or infrastructure volatility makes the dependency boundary valuable; do not create empty folders to imitate an architecture diagram.

## Export a small public API

Providers are private by default. Export an application operation or deliberate port only when another module has a real use for it.

```ts
@Module({
  imports: [PersistenceModule],
  controllers: [OrdersController],
  providers: [PlaceOrder, OrderRepositoryAdapter, OrderPricingPolicy],
  exports: [PlaceOrder],
})
export class OrdersModule {}
```

Exporting every provider turns module metadata into a service locator and lets callers bypass invariants. A small API keeps future refactors local.

## Assign write ownership

One capability should own each business write and its invariants. Another module may collaborate through:

- an exported application operation;
- an application-owned port;
- a completed event with explicit delivery semantics;
- a deliberately designed read model.

Avoid letting multiple modules update the same tables through shared generic repositories. Shared database access is not shared business ownership.

## Treat cycles as feedback

A circular dependency often signals mixed responsibilities, a missing owner, or a synchronous collaboration that should be redesigned. Before using `forwardRef()`:

1. Name which capability owns the operation.
2. Move misplaced behavior to that owner.
3. Extract a narrow dependency in the correct direction if a real boundary remains.
4. Consider an event only when the reaction is independent and its consistency model is acceptable.

`forwardRef()` is a compatibility tool for a cycle that cannot yet be removed, not an architectural default.

## Keep the composition root explicit

Nest modules should select implementations and wire providers. Business objects should receive their collaborators rather than resolving them dynamically from `ModuleRef` or constructing infrastructure inside methods.

Continue with [Dependency injection](./dependency-injection) or use the full [module-boundaries reference](/reference/architecture/references/module-boundaries).
