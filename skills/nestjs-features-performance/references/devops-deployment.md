# DevOps and Deployment Rules

Deploy a verified, immutable artifact with validated configuration, observable health, compatible data changes, and a tested shutdown and rollback path.

## Build and release

- Pin supported Node.js and package-manager behavior; install from the lockfile in CI.
- Build once and promote the same immutable image or artifact across environments.
- Keep runtime images minimal, non-root where supported, and free of build-only tools and credentials.
- Record source revision and dependency/image provenance without exposing secrets.
- Run deterministic build, type, lint, unit, integration, contract, and security gates appropriate to the risk.
- Treat a passing pipeline as evidence for its tested scope, not proof of production safety.

## Configuration and secrets

Centralize typed configuration and validate required values before listening. Nest `ConfigModule` is a useful option, not a mandatory architecture; an existing validated provider is acceptable. Avoid scattered `process.env` reads in feature code.

Supply secrets through the deployment platform, scope them to the service, redact them from diagnostics, and support rotation. Keep environment-specific values outside the artifact while preserving the same code path across environments.

## Database changes

- Run reviewed migrations through one controlled release step; do not let every replica race automatically.
- Use expand-and-contract changes for rolling deployments and mixed application versions.
- Back up and rehearse recovery for destructive or large transformations.
- Make schema, event, cache, and application rollback compatibility explicit.
- Do not enable unsafe automatic schema synchronization in production.

## Health and traffic

- **Liveness:** can this process make progress, without depending on every downstream service?
- **Readiness:** should this instance receive traffic or work now?
- **Startup:** does a slow-starting process need protection from premature liveness failure?

Health endpoints must be cheap, bounded, authenticated or exposure-limited as appropriate, and excluded from noisy access logs/metrics where useful. A healthy endpoint does not replace real traffic, error, saturation, and dependency monitoring.

## Observability

- Emit structured logs with operation and correlation identifiers; redact tokens, cookies, credentials, sensitive fields, and raw bodies.
- Measure traffic, errors, duration, and saturation with bounded-cardinality labels.
- Trace critical database, broker, cache, and external calls while controlling sampling and sensitive attributes.
- Alert on user impact or actionable leading indicators and link alerts to an owner and runbook.
- Preserve deployment markers so regressions correlate with releases.

Logging middleware or interceptors must not consume streams, serialize huge payloads, duplicate the same failure at every layer, or materially distort the hot path.

## Graceful shutdown

Enable Nest shutdown hooks when the deployment sends supported termination signals, then implement an ordered drain:

1. mark the instance unready and stop taking new work;
2. stop schedulers/consumers or pause intake;
3. finish, checkpoint, or safely requeue in-flight requests, streams, sockets, and jobs;
4. flush bounded telemetry;
5. close broker, cache, database, server, and worker resources;
6. exit before the platform's termination deadline.

Shutdown hooks are correctness controls, not performance optimizations. Test the real signal path; calling a lifecycle method directly does not prove the deployment drains.

## Rollout and capacity

- Define rolling, canary, or blue/green strategy from compatibility and risk.
- Verify readiness gates traffic, termination grace exceeds measured drain time, and rollback is executable.
- Keep web replicas stateless or externalize shared state and coordination explicitly.
- Size CPU, memory, connection pools, queue concurrency, and autoscaling against peak workload and total dependency capacity.
- Use p95/p99 latency, errors, queue age, event-loop delay, memory/GC, and pool saturation; average CPU alone is insufficient.
- Exercise load, spike, soak, dependency failure, and region/node/pod interruption according to the system's risk.

## Operational gate

Before release, record the artifact, migrations, configuration changes, success/rollback signals, owner, runbook, and recovery procedure. Verify backups by restore testing. After rollout, compare error, latency, saturation, and business correctness against the baseline.

See official NestJS guidance for [configuration](https://docs.nestjs.com/techniques/configuration), [logging](https://docs.nestjs.com/techniques/logger), [deployment](https://docs.nestjs.com/deployment), [lifecycle events](https://docs.nestjs.com/fundamentals/lifecycle-events), and [health checks](https://docs.nestjs.com/recipes/terminus).
