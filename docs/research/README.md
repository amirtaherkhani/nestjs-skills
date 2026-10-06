# NestJS backend research backlog

This is a prioritized topic list for later, focused research sessions. Each item is planned, not yet researched. The order builds from test foundations toward performance measurement and delivery. Session cadence is undecided.

## 1. Testing models and boundaries

**Questions**

- When should behavior be covered by unit, module, integration, contract, or end-to-end tests in a NestJS service?
- Which boundaries should use mocks, and which need real framework, transport, or persistence behavior?
- What database isolation strategy gives reliable coverage without making the suite slow or brittle?

**Future evidence:** a test-level decision guide, an example that demonstrates the boundaries, and measured runtime or reliability trade-offs.

**Depends on:** none.

## 2. Practical NestJS testing

**Questions**

- How should `TestingModule` and provider overrides test modules, guards, pipes, interceptors, filters, and controllers?
- How can HTTP/API tests retain realistic serialization, validation, and error behavior while isolating external services?
- Which database and transaction patterns support independent, repeatable tests?

**Future evidence:** small runnable NestJS examples for module/provider tests, API tests, mocks, database setup, cleanup, and isolation; include relevant failure cases.

**Depends on:** item 1.

## 3. Performance experiments, baselines, and SLOs

**Questions**

- What baseline should be recorded before changing a service?
- How should workload input volume be varied separately from concurrent clients?
- Which service-level objectives and thresholds make a performance result actionable?

**Future evidence:** a reproducible workload definition, baseline report, latency/error/throughput measures, and explicit pass/fail thresholds.

**Depends on:** item 1 for regression coverage; informs items 4–6.

## 4. k6 workload shapes

**Questions**

- When is a smoke, load, stress, spike, or soak test appropriate?
- How should arrival rate, virtual users, duration, ramp-up, and thresholds reflect the service’s SLO and expected traffic?
- What safeguards prevent a test from overwhelming shared or production systems?

**Future evidence:** a k6 script and configuration for each workload shape, with explicit assumptions, thresholds, safety limits, and example result interpretation.

**Depends on:** item 3.

## 5. Profiling and bottleneck diagnosis

**Questions**

- How should CPU, memory, event-loop delay, garbage collection, database query plans, N+1 queries, and distributed traces be examined?
- What evidence distinguishes an application, runtime, database, network, or downstream bottleneck?
- How should a suspected bottleneck be tested before selecting a fix?

**Future evidence:** a repeatable diagnose-and-measure workflow, profiler/trace artifacts, and a before/after example tied to an observed bottleneck.

**Depends on:** item 3; uses workload methods from item 4 where useful.

## 6. Big O and controlled growth

**Questions**

- How do time and space costs grow with input size for representative NestJS operations?
- How can input-size growth be varied without confusing it with concurrency or I/O effects?
- When do asymptotic costs matter at realistic sizes, and when do measurements point elsewhere?

**Future evidence:** code-level complexity analysis plus controlled measurements across input sizes, including memory use and stated limits.

**Depends on:** item 3; draw on the diagnostic methods in item 5.

## 7. CI regression, flakiness, and reproducibility

**Questions**

- Which unit, integration, contract, performance, and end-to-end checks belong in each CI stage?
- How should flaky tests be detected and diagnosed without hiding product defects through retries?
- What fixtures, seeds, environment capture, and artifact retention make failures reproducible?

**Future evidence:** a staged CI proposal, a flake triage procedure, and an example showing how a failure can be reproduced from retained inputs and artifacts.

**Depends on:** item 1 for test boundaries; items 3–6 for measured-performance regressions.
