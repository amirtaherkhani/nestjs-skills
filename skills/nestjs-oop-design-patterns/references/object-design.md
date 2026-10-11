# Object Design

Choose an object role before choosing a suffix.

## Entity

An entity has continuity and identity across state changes. It protects invariants through behavior.

```typescript
class Subscription {
  constructor(
    readonly id: SubscriptionId,
    private plan: Plan,
    private state: SubscriptionState,
  ) {}

  upgradeTo(next: Plan) {
    if (!this.state.canChangePlan()) throw new PlanChangeNotAllowed();
    if (!next.isUpgradeFrom(this.plan)) throw new PlanDowngradeRejected();
    this.plan = next;
  }
}
```

Do not put transport decorators, ORM lazy-loading behavior, or HTTP exceptions in a framework-free domain entity. A simple CRUD feature may use an ORM model directly when it has no meaningful domain behavior; do not manufacture a separate entity without a benefit.

## Value object

A value object has no identity, compares by value, is ideally immutable, and validates a meaningful domain concept.

Good candidates:

- money with currency and rounding rules;
- email or phone values with canonicalization;
- date ranges with ordering invariants;
- percentages, coordinates, quantities, and units;
- identifiers when they prevent accidental cross-entity mixing or centralize parsing.

Weak candidates:

- a string wrapped with no validation, behavior, or type-safety gain;
- every DTO field by mandate;
- values used only at a transport boundary before validation.

```typescript
class Money {
  private constructor(
    readonly minorUnits: bigint,
    readonly currency: Currency,
  ) {}

  static of(minorUnits: bigint, currency: Currency) {
    if (minorUnits < 0n) throw new NegativeMoney();
    return new Money(minorUnits, currency);
  }

  add(other: Money) {
    if (other.currency !== this.currency) throw new CurrencyMismatch();
    return Money.of(this.minorUnits + other.minorUnits, this.currency);
  }
}
```

## Domain policy/service

Use a domain policy when a rule belongs to the domain but not naturally to one entity/value object, often because it compares several objects.

Keep it deterministic when possible. External calls belong behind application ports.

## Application operation/use case

Coordinates one user/system goal:

- obtains required state;
- invokes domain behavior/policies;
- defines transaction intent;
- calls external ports;
- persists and publishes outcomes.

It should not parse HTTP requests, map ORM rows inline, or contain vendor retry loops.

## Infrastructure adapter

Implements an application port using an ORM, broker, cache, vendor SDK, filesystem, or clock. It translates errors and data into application-owned contracts.

Do not let vendor response types escape merely because TypeScript can infer them.

## Controller/resolver/message handler

Adapts a protocol:

- receives validated DTO/message data;
- obtains authenticated principal/context;
- invokes one application operation;
- maps status, headers, or response representation.

Transport handlers should not own business transactions or call several repositories directly.

## DTOs and mappers

DTOs are contract shapes, not behavior-rich domain models. Keep separate DTOs for separate external contracts even when their current fields match.

Map at boundaries:

```typescript
const command: PlaceOrderInput = {
  customerId: CustomerId.parse(dto.customerId),
  lines: dto.lines.map(toOrderLine),
};
```

Avoid universal mapping frameworks when explicit mapping is short and captures important semantics.

A transport DTO, an internal command/query type, a domain object and an ORM model have different owners. Internal interfaces/types are useful when no runtime reflection is needed. Concrete DTO classes support reflection-based validation only with the configured validator/pipe; explicit schema validation is also valid. Neither a TypeScript assertion nor a class declaration validates incoming JSON by itself.

For example, a file-upload boundary checks size, media type and filename policy; an internal StoreFile command can be an interface containing validated content metadata. Storage owns filesystem/vendor translation, while a domain rule may still reject overwriting a protected file. A public FileView projects only the allowed identifier and display name. Avoid turning every property into a value object or every simple CRUD row into a separate domain entity.

The inventory fixture additionally checks an internal caller that bypasses the pipe: the domain still rejects a negative or excessive reservation. The reusable inventory-reader suite rejects an adapter whose static return type is correct but whose returned object aliases mutable state. See the [executable boundary examples](https://github.com/amirtaherkhani/nestjs-skills/tree/main/examples/four-axis) and [nestjs-native-patterns.md](nestjs-native-patterns.md).

A project may use a shared `User` class with Swagger and serialization decorators as its central model, alongside a separately validated create DTO. Follow that supported project design; a rich or framework-free domain is a chosen boundary, not a universal requirement. Indexed-access types such as `User['email']` reuse a static property type; they do not transfer Swagger, serialization or validation metadata to another class. Configure and test runtime validation and serialization at their actual boundaries.

## Factory

Use a factory when valid construction has branching, multiple steps, dependencies, or invariants that should not leak to callers. Prefer a named static constructor for a single straightforward invariant.

## Naming

- Name by domain role: `PlaceOrder`, `PaymentGateway`, `OrderPricingPolicy`.
- Avoid vague containers: `Helper`, `Manager`, `CommonService`, `UtilsService`.
- Use verbs for operations and commands; nouns for values/entities/policies.
- Do not append `Impl` when the concrete behavior has a meaningful name.

## Responsibility test

For each object, answer:

1. What promise does it make?
2. Which invariant or decision does it own?
3. Which dependencies are effects?
4. Who asks it to change?
5. What can remain hidden from callers?

If the answers describe unrelated concerns, split by responsibility—not by arbitrary size.
