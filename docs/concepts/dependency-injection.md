---
title: Dependency Injection
description: Use NestJS dependency injection to compose explicit, application-owned boundaries.
---

<p class="doc-kicker">Core concept · Architecture</p>

# Dependency injection

<p class="doc-lede">Dependency injection separates what a component needs from how the application constructs it. In NestJS, modules form the composition root where application contracts meet infrastructure implementations.</p>

## Depend on the capability you need

Define a narrow, application-owned port when an external concern is volatile, expensive to test, or genuinely replaceable:

```ts
export const PAYMENT_GATEWAY = Symbol('PAYMENT_GATEWAY');

export interface PaymentGateway {
  authorize(command: AuthorizePayment): Promise<Authorization>;
}
```

The application operation depends on that capability, not on a vendor SDK:

```ts
@Injectable()
export class AuthorizeOrderPayment {
  constructor(
    @Inject(PAYMENT_GATEWAY)
    private readonly payments: PaymentGateway,
  ) {}

  execute(command: AuthorizePayment) {
    return this.payments.authorize(command);
  }
}
```

The module chooses the implementation:

```ts
@Module({
  providers: [
    AuthorizeOrderPayment,
    StripePaymentGateway,
    { provide: PAYMENT_GATEWAY, useExisting: StripePaymentGateway },
  ],
  exports: [AuthorizeOrderPayment],
})
export class PaymentsModule {}
```

Use a stable `Symbol`, string, or abstract-class token when TypeScript interfaces disappear at runtime. Keep the token near the application contract, not inside the vendor adapter.

## Choose the provider form deliberately

| Provider | Use when |
| --- | --- |
| `useClass` | The token should construct a selected class |
| `useExisting` | Two tokens must refer to the same existing instance |
| `useValue` | Supplying immutable configuration or a test double |
| `useFactory` | Construction needs other providers or validated configuration |

Avoid a factory that performs hidden business work at bootstrap. Provider creation should assemble dependencies and fail clearly when required configuration is invalid.

## Scope is a runtime contract

Singleton scope is the default and usually the right choice. Request scope propagates through consumers and increases per-request construction and allocation. Transient scope creates an instance per consumer.

Choose a non-default scope only for an actual lifetime requirement, then measure its effect and test context propagation. Correlation IDs and request metadata can often live in established async context without making an entire dependency graph request-scoped.

## Avoid service location

Dynamic lookup through `ModuleRef` can support framework integration or truly dynamic selection, but using it inside ordinary business methods hides dependencies and makes tests less representative. Prefer constructor dependencies and an explicit Strategy or registry when the set of implementations is known.

See [Modules and boundaries](./modules-and-boundaries) and the complete [dependency-injection reference](/reference/architecture/references/dependency-injection).
