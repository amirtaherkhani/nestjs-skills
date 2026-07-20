# Error Handling Rules

Design failures as stable contracts. Keep business meaning independent of transport while mapping errors once at the system edge.

## Classify errors by layer

| Layer | Responsibility |
| --- | --- |
| Domain/application | Express expected failures with typed results or errors such as `OrderNotPayable`; preserve the business meaning |
| Infrastructure adapter | Translate vendor/driver failures into application-relevant categories and preserve the cause for diagnostics |
| Transport adapter | Map known failures to HTTP, GraphQL, RPC, WebSocket, or job semantics |
| Global boundary | Catch unexpected failures, record safe diagnostics, and return a non-sensitive fallback |

Using Nest `HttpException` in a small HTTP-only controller or boundary service can be pragmatic. Do not force HTTP status codes into reusable domain/application policy or code shared by other transports.

## Handle asynchronous failures explicitly

- `await` or return promises whose failure matters. Do not start floating work inside a request and assume Nest will observe it.
- Catch only when adding context, translating a known failure, compensating, or recovering. Empty catch blocks hide defects.
- Preserve the original error as `cause` where the runtime and logging policy support it.
- In RxJS interceptors or transport streams, map errors with operators that preserve cancellation and do not swallow terminal signals.
- Attach process-level unhandled-rejection or uncaught-exception reporting for diagnostics, but do not use it as a request recovery strategy.
- Retry only classified transient failures, only when the operation is safe or idempotent, and within a deadline and attempt budget.

## Define a public error contract

A public error should have stable semantics such as:

```json
{
  "code": "ORDER_NOT_PAYABLE",
  "message": "The order cannot be paid in its current state",
  "requestId": "01J...",
  "details": []
}
```

- Keep a stable machine-readable code separate from human wording.
- Use status codes consistently: validation/authentication/authorization/conflict/not-found are expected client outcomes; unknown defects remain server errors.
- Include field-level validation details only when safe and useful.
- Never return stack traces, SQL, filesystem paths, secrets, tokens, raw vendor bodies, or internal exception class names.
- Document the error shape and compatibility policy with the API or message contract.

## Use filters at the edge

Exception filters are the final mapping mechanism for uncaught errors in a Nest execution context. Keep them narrow:

- map known errors deliberately and let one fallback handle unknown errors;
- use dependency injection through providers such as `APP_FILTER` when the filter needs services;
- account for HTTP-adapter differences through `HttpAdapterHost` when required;
- use the correct host type for HTTP, GraphQL, RPC, or WebSockets;
- do not repeat logging in every layer. Record an unexpected failure once at the boundary with correlation context.

Filters do not repair partial writes or failed external effects. Transaction, idempotency, outbox, and compensation policy must be designed at the owning use case.

## Observability and privacy

Log a stable error code, operation, correlation identifier, and safe cause chain. Redact credentials, cookies, authorization headers, personal data, and raw request bodies. Control stack-trace volume on known client errors and keep metric labels low-cardinality.

## Test failure behavior

- Unit-test application failure categories and state invariants.
- Test adapter translation for driver/vendor errors that influence retry or status.
- E2E-test public status, code, validation shape, and absence of sensitive details.
- Test unknown failures and production logging configuration.
- For critical workflows, test timeout, duplicate, partial commit, retry exhaustion, and shutdown behavior.

See the official NestJS [exception filters](https://docs.nestjs.com/exception-filters) and [request lifecycle](https://docs.nestjs.com/faq/request-lifecycle) documentation.
