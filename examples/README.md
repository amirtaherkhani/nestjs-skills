# Runnable NestJS examples

These small, authored applications show a failing behavior and a minimal correction using real NestJS HTTP boundaries. They are learning fixtures, not production templates or proof that an agent skill works better.

From the repository root, with Node.js 20+:

```bash
npm ci
npm run test:fixtures
```

The runner compiles the TypeScript and verifies both sides: the intentionally faulty `before/` must fail the expected regression checks, while `after/` must pass. A broken fixture, unexpected failure, or passing faulty version fails the runner. No credentials or external services are needed. The slow example binds an ephemeral loopback port.

## Boolean query parsing

`boolean-query/` exposes `GET /items?includeArchived=false`. JavaScript's Boolean coercion treats the string `"false"` as truthy. The correction uses Nest's `DefaultValuePipe(false)` followed by `ParseBoolPipe` at the query boundary.

The seven HTTP checks cover omitted, true, false, and four invalid values. The contract is deliberately strict: only lowercase true/false are accepted when supplied. Five checks fail before the correction; all seven pass after it.

## Module boundary review

`module-boundary/` contains a wallet module, an internal storage provider, a public charge operation, and two consumers. The charge operation enforces a positive amount and a nonnegative balance. Checkout uses it correctly. Bulk charges use exported storage directly and bypass that invariant.

The correction changes the bulk consumer to call the public operation and removes storage from module exports. Merely exporting a provider is not the finding: the unsafe consumer and bypassed invariant supply the evidence. The healthy checkout is a negative control. Each of the three HTTP tests starts a fresh app so a failed charge cannot contaminate another test.

## Slow local API

`slow-api/` serves a fixed quote containing `[one, two, one, two]`. A local catalog delays each reply by 30 ms. Before the correction, four requests run sequentially. Afterward, request-local deduplication fetches the two unique items concurrently and reconstructs the original ordered response.

The fixed two-unique-item workload bounds concurrency at two. If this becomes user-defined input, add explicit input bounds and a worker limit rather than assuming unrestricted `Promise.all` is safe. The example preserves a one-second upstream timeout and the non-leaking 502 error contract. It does not introduce a cross-request cache.

Tests check response equality/order, request count, maximum concurrency, request-local freshness, and upstream failure handling. The runner records actual elapsed time in `evals/.runs/fixtures.json`. Latency is illustrative local evidence, not a CI threshold or a production claim; request count and correctness are deterministic gates.

For a repeatable five-sample benchmark, the [evaluation guide](../evals/README.md) explains the controlled agent workspace and benchmark command.
