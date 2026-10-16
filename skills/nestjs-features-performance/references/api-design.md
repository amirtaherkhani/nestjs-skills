# API Design Rules

Design an API as a stable consumer contract, then implement it with the NestJS primitives that match its transport. Do not expose internal entities or framework accidents as the public model.

## Define the contract first

Identify consumers, trust boundary, compatibility promise, latency/size requirements, idempotency needs, and the installed transport stack. Specify operations, input/output schemas, statuses or message outcomes, errors, pagination, authentication, authorization, and deprecation policy before polishing controller code.

## Input contracts

- Use explicit DTOs or schemas for body, path, query, message, and job input.
- Validate types and business-compatible formats; bound lengths, arrays, pages, filters, sorts, files, and nesting.
- Make coercion, unknown fields, defaults, null versus omission, and date/time formats deliberate.
- Keep transport DTOs at the boundary. Map to an application command or query when the shapes or responsibilities differ.
- Use parameterized persistence APIs after validation; DTO validation does not prevent injection by itself.

For boolean query parameters, remember that HTTP query values arrive as strings. A TypeScript `boolean` annotation does not parse the value, and JavaScript treats the non-empty string `"false"` as truthy. Use Nest's `ParseBoolPipe` to accept only the literal `"true"` and `"false"` values. If omission should mean a default, apply `DefaultValuePipe` before `ParseBoolPipe`:

```typescript
@Get()
list(
  @Query(
    'includeArchived',
    new DefaultValuePipe(false),
    ParseBoolPipe,
  )
  includeArchived: boolean,
) {
  return this.itemsService.list({ includeArchived });
}
```

Test the missing parameter, both accepted values, and an invalid value through the actual HTTP route. See the official NestJS [pipes documentation](https://docs.nestjs.com/pipes#providing-defaults) and the pinned [NestJS 11.2.7 `ParseBoolPipe` implementation](https://github.com/nestjs/nest/blob/v11.2.7/packages/common/pipes/parse-bool.pipe.ts). The comparison began with the pinned upstream [API pipes rule](https://github.com/Kadajett/agent-nestjs-skills/blob/3986e0cede33958e000f959031cbee0cd83c2941/skills/nestjs-best-practices/rules/api-use-pipes.md); this guidance and example are original.

## Transport, internal and domain types

| Boundary or role | Suitable representation | What proves safety |
| --- | --- | --- |
| Reflection/class-validator transport input | Concrete DTO class imported as a runtime value | Explicit pipe settings, metadata, transformation and nested validation checks |
| Explicit schema/custom-pipe input | Schema over unknown values; class optional | Real transport checks for shape, bounds, coercion and unknown-field policy |
| Trusted internal command/query | Interface or type when reflection is unnecessary | Static caller checks plus operation/domain invariants |
| Behavior-rich domain value/entity | Domain object independent of transport/ORM concerns | Construction and mutation reject invalid states for every caller |
| Persistence/public output | ORM model inside persistence; explicit allow-listed projection at the public boundary | Mapping checks and absence of private fields |

TypeScript annotations and assertions are erased; they do not validate JSON. A class alone also does not validate a value without a configured runtime mechanism. Treat external successful responses as unknown and validate them at the adapter boundary. The slow-API example rejects malformed JSON, mismatched identities and invalid prices in both variants, then projects only id/price.

For bounded JSON lists and collection joins, see the tested `examples/collections/README.md` repository example. Cap request bytes before parsing, then narrow `unknown` and check item counts/types; cap data-source rows and output separately. Preserve the caller's ID order and duplicates when those are the contract. Build a request-local index only when repeated lookups justify its setup and memory cost, and project response fields explicitly.

Transport validation and domain invariants protect different promises: a positive inventory quantity can still exceed stock. Internal interfaces are valid without runtime DTO classes, and an internal transfer object is not forbidden merely because someone calls it a DTO. Separate shapes when ownership or contracts differ; keep a simple direct model when the project needs no additional boundary.

See [enhancer-composition.md](enhancer-composition.md) for the inventory HTTP/operation/domain path and [testing.md](testing.md) for test-layer limits.

## Output contracts

- Return response DTOs or explicit projections with allow-listed fields.
- Do not leak ORM entities, vendor response types, credentials, internal flags, or private relations.
- Use consistent success and error semantics. Provide stable machine-readable error codes.
- Bound collections and include pagination metadata or continuation cursors whose consistency is documented.
- Stream large files or exports when appropriate and define cancellation, range, buffering, and cleanup behavior.

Interceptors can perform cross-cutting response mapping when the contract is uniform. Do not hide core business policy or break streaming, low-level response handling, GraphQL, or other transports with an unconditional global wrapper.

## Place framework behavior deliberately

- Use pipes for transport input validation and safe transformation.
- Use guards for authentication or authorization decisions that depend on execution context and metadata.
- Use interceptors for behavior around handler execution such as compatible response mapping, timing, tracing, or caching.
- Use exception filters for the final transport-specific mapping of uncaught failures.
- Keep business invariants and orchestration in application/domain providers, not in lifecycle components.

Test global and route-scoped ordering through the real application boundary. A component that is correct alone can still be wrong when bound at an incompatible scope or transport.

## HTTP behavior

- Use HTTP methods and status codes according to operation semantics, including `201`, `202`, `204`, conflict, validation, and conditional requests where useful.
- Make retry-prone writes idempotent with a scoped key, request fingerprint, result retention, and conflict policy.
- Define filtering and sorting as allow-listed fields; never pass raw client field names or expressions into a query builder.
- Use cursor/keyset pagination for large changing datasets when stable continuation matters; offsets can remain simpler for bounded data.
- Avoid adapter-specific `@Req()` or `@Res()` when framework-managed behavior is desired. Use them deliberately for low-level streaming or protocol control.

## Versioning and compatibility

Version when a public breaking change must coexist with older consumers, not automatically for every private API. Prefer additive compatible evolution when possible.

When versioning is required:

- choose URI, header, media-type, or custom extraction based on consumer and infrastructure constraints;
- document a default/version-neutral policy;
- publish a deprecation and removal timeline;
- support mixed application versions during rollout;
- test both old and new contracts and generated documentation.

Message/event schemas need the same compatibility discipline even when Nest's HTTP versioning is not involved.

## Other transports

- **GraphQL:** bound query depth/complexity and list size, prevent N+1 access, and authorize sensitive fields/resources.
- **WebSockets:** authenticate connections and authorize messages, bound payloads and buffers, and define reconnect/acknowledgement semantics.
- **RPC/messages:** define correlation, deadline, delivery, duplicate, ordering, retry, and transport-specific error contracts.
- **SSE/streams:** define event names, reconnect/resume semantics, heartbeats, cancellation, backpressure, and durability separately.

## Documentation and verification

Generate OpenAPI or schemas from the same maintained contract where the project supports it. Include representative examples without secrets or real personal data. Treat generated documentation drift as a failing contract check.

Test validation, status/outcome, authorization, serialization, stable errors, pagination bounds, idempotency, and version compatibility through the real transport. Add consumer/provider contract tests when teams or deployments evolve independently.

This reference owns API compatibility. Failure classification, protocol mapping, and filter behavior are detailed in [error-handling.md](error-handling.md); preserve one public contract rather than defining a second envelope here.

See the official NestJS guidance for [validation](https://docs.nestjs.com/techniques/validation), [serialization](https://docs.nestjs.com/techniques/serialization), [interceptors](https://docs.nestjs.com/interceptors), [versioning](https://docs.nestjs.com/techniques/versioning), and [OpenAPI](https://docs.nestjs.com/openapi/introduction).
