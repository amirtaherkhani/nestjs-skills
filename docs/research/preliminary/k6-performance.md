# k6 Performance Testing: Ordered Research Backlog and Source Inventory

Status: first-pass inventory, not a completed deep-dive or implementation plan. Checked 2026-10-06 UTC. Scope narrowed to an ordered topic backlog and verified sources. No load tests, installations, repository edits, or new skills were performed.

## Recommended order

1. Define the workload and claim before selecting the tool configuration.
2. Learn open versus closed models and prove the requested load was actually offered.
3. Define correctness checks, latency/error SLOs, and test-validity gates.
4. Build representative data, authentication, correlation, and cache conditions.
5. Connect client observations to server/dependency saturation evidence.
6. Compare a reproducible baseline and candidate in CI.
7. Extend to stress, spike, soak, and recovery tests according to risk.
8. Add distributed execution and telemetry export only when needed.

This order is a research proposal. It is not an instruction to create a skill or execute tests.

## Existing repository coverage, verified

Repository: `amirtaherkhani/nestjs-skills`. Baseline supplied by the parent and files fetched at commit `96fb9a22c59a54fa1250a2664455c71df4942dfc`.

- [Performance diagnosis](https://github.com/amirtaherkhani/nestjs-skills/blob/96fb9a22c59a54fa1250a2664455c71df4942dfc/skills/nestjs-features-performance/references/performance-diagnosis.md) already asks for representative workload, warm-up, data/cache conditions, p50/p95/p99, errors, throughput, CPU/event-loop/memory, dependencies, and before/after comparisons. It warns against treating framework benchmarks as proof for an application. Missing in this file: a concrete k6 load model, test-validity criteria, threshold example, reproducible fixture, or CI gate.
- [Production readiness](https://github.com/amirtaherkhani/nestjs-skills/blob/96fb9a22c59a54fa1250a2664455c71df4942dfc/skills/nestjs-features-performance/references/production-readiness.md) already requires representative load tests, risk-based soak/spike testing, retained baseline/post-change metrics, and an SLO/rollback record. Missing in this file: executable examples and specific evidence required to declare a load-test result valid.
- [Public benchmark](https://github.com/amirtaherkhani/nestjs-skills/blob/96fb9a22c59a54fa1250a2664455c71df4942dfc/evals/public/benchmark.mjs) uses one warm-up followed by five sequential Supertest requests to `/quote`, with a 30 ms simulated dependency and measurements of calls, peak dependency concurrency, and duration. This is useful narrow mechanism evidence; it does not establish sustained offered load, load capacity, stable tail percentiles, or long-running recovery behavior. This conclusion is based on reading the code, not executing it.

The gap is operational detail and examples, not an absence of performance principles. This first pass does not claim that every repository file has been exhaustively searched for k6.

## Ordered topic backlog

### K6-01: Workload contract and evidence boundaries

- Research: critical route/journey, requests per iteration, operation mix, payload sizes, database cardinality, tenant mix, concurrency, arrival pattern, duration, cache state, infrastructure, runtime versions, and permitted target.
- Compare: one isolated endpoint for diagnosis versus a mixed authenticated journey for user-facing capacity.
- Future proposal: one bounded NestJS endpoint and explicit dataset/environment manifest; no benchmark numbers until measured.
- Evidence boundary: k6 observes behavior under a workload. A latency curve alone does not prove Big-O complexity, a V8 optimization, event-loop blocking, an index's effect, or a NestJS internal mechanism. Such claims need source inspection, profiles, query plans, and controlled experiments varying the relevant input.
- Sources: S01, S15, S16, repository performance reference above.
- Status: scope and source inventory verified; fixture and claim-specific evidence protocol pending discussion.

### K6-02: Open/closed models and coordinated omission

- Research: `constant-vus`/`ramping-vus` versus `constant-arrival-rate`/`ramping-arrival-rate`; iterations versus HTTP requests; think time versus arrival pacing.
- Verified: a closed model starts the next iteration after the previous one ends, so slower responses can reduce offered traffic. Arrival-rate executors decouple scheduled starts from iteration completion, subject to VU availability. This addresses the documented coordinated-omission problem for arrival-driven workloads.
- Compare: closed model for a fixed active-user population; open model for independently arriving API demand. Neither is universally correct.
- Future proposal: run the same bounded endpoint under both models while deliberately varying service latency, and show offered versus achieved traffic. No execution proposed yet.
- Sources: S02, S03, S04.

### K6-03: Delivered-load validity and generator capacity

- Research: `iterations`, `dropped_iterations`, interrupted work, `preAllocatedVUs`, `maxVUs`, request counts, and generator CPU/memory/network limits.
- Verified: arrival-rate iterations can be dropped when no VU is free; iteration-based executors can drop work after `maxDuration`. Drops may reflect poor allocation or a slowing target. Dynamically allocating VUs has resource costs; Grafana generally recommends adequate preallocation.
- Proposed acceptance principle: classify an unmet offered-load target separately from a valid SLO pass. A zero-drop threshold is a candidate for a controlled baseline, not a universal rule for deliberate overload tests. Retain drops even if an overload profile accepts them.
- Compare: larger single generator versus distributed generation; fixed preallocation versus exploratory allocation sizing.
- Future proposal: contrast deliberately undersized and adequate generators without mislabeling the first result as server capacity.
- Sources: S03, S05, S06, S07.

### K6-04: SLO thresholds, correctness, and tail latency

- Research: p95/p99, request failures, business-operation correctness, completed throughput, sample counts, windows, and route/scenario-specific thresholds.
- Verified: `http_req_duration` covers sending, waiting, and receiving; it excludes initial connection/DNS time. `http_req_failed` follows expected-response classification. An iteration may perform several HTTP requests. A request success status is insufficient evidence of a correct business response.
- Proposed distinction: service SLO, short test acceptance threshold, and test-validity gate are different objects. Avoid inventing universal p95/p99 or error targets. A brief synthetic run does not establish a month-long production SLO.
- Compare: absolute service-budget gate versus relative baseline-regression gate; prefer both when their measurement conditions are understood. Whole-run percentiles can hide brief degradation, so research phase/window analysis too.
- Future proposal: separate successful read and write routes, explicit expected responses, business-result checks, required sample counts, and visible rejected/timeout outcomes.
- Sources: S06, S08, S09. Exact check/threshold and percentile-confidence examples remain pending.

### K6-05: Realistic data, cache, warm-up, and authentication

- Research: warm and cold states, realistic hot-key distributions, data cardinality, cache hit/miss/stampede cases, seeded variability, independent test identities, login versus token reuse/refresh, and response-to-request correlation.
- Verified: correlation extracts dynamic response values for later requests; recorded tokens may expire. `SharedArray` holds read-only shared data and must be initialized in the init context; it is not a shared mutable state store.
- Compare: deterministic datasets for reproducibility versus distributions sampled from privacy-safe production aggregates; preauthenticated API measurement versus an explicitly proportioned login flow.
- Future proposal: a read-only seeded dataset first; authenticated read/update journey later after choosing identity and cleanup boundaries. Warm-up exclusion must be explicit in phase tagging or separate measurement runs; delaying abort evaluation alone is not a warm-up exclusion design.
- Sources: S10, S11, S12, S13. Detailed token lifecycle and warm-up implementation require further primary-source verification.

### K6-06: Diagnose saturation across the complete NestJS path

- Research: traffic/error/duration/saturation alongside event-loop delay/utilization, CPU, heap/RSS/GC, DB query/pool/lock time, external calls, queue age, replicas, and throttling.
- Verified: Node's `perf_hooks` exposes event-loop delay and utilization. Delay values are in nanoseconds. Current documentation includes version-sensitive sampling behavior; installed Node version must govern the eventual example.
- Compare: client-side symptoms alone versus time-aligned server metrics, traces, and profiles. Keep profiling overhead and instrumentation configuration consistent when comparing runs.
- Future proposal: one event-loop-bound case and one dependency/pool-bound case with hypotheses explicitly separated from verified causes.
- Sources: S14, S15, S16; existing performance and production references.

### K6-07: Reproducible CI baseline and candidate gates

- Research: fixed tool/runtime/image versions, identical data and infrastructure, isolated generators, repeated runs, run-to-run variance, artifacts, effect sizes, and inconclusive results.
- Compare: small PR smoke/regression tests; controlled release-capacity tests; separately scheduled soak tests. Shared CI runners are convenient but may be too noisy for tight regression gates.
- Future proposal: a baseline/candidate record with commit IDs, environment/data manifest, load validity, latency/error/throughput/saturation, correctness, and limitations. Select a variance policy before deciding a change passed.
- Sources: S08, S09. CI implementation and policy values are unchosen.

### K6-08: Stress, spike, soak, and recovery profiles

- Research: expected-load plateau; sustained above-normal demand; abrupt burst and recovery; long-duration resource accumulation; breakpoint discovery.
- Verified: Grafana distinguishes these by purpose; no single profile covers all risks.
- Compare: application-specific durations and load levels instead of universal multipliers. Soak duration should cover relevant token expiry, connection recycling, cache expiry, and recurring tasks where those are in scope.
- Future proposal: one named profile per risk, a stop condition, observable recovery criteria, and an approved isolated target. Recovery should include queue draining and healthy latency/errors after the peak, rather than only process survival.
- Source: S01. Detailed spike/soak pages and safe-stop examples are queued for deeper research.

### K6-09: Prometheus/OpenTelemetry alignment and aggregation

- Research: client/server measurement boundaries, run/phase/route labels, units, histogram buckets, collection windows, output overhead, and cardinality.
- Verified: k6 can export metrics via OpenTelemetry. Current docs map trends to histograms and rates to a counter distinguished by `condition=zero/nonzero`. Older tutorials may show a different mapping. Prometheus remote-write percentile gauges cannot generally be aggregated into a correct cross-generator percentile; the k6 guide presents native histograms as an alternative.
- Compare: local summary for a minimal example; Prometheus for an existing metrics stack; OTLP through an existing collector. Do not add both exporters without a reason.
- Important pending verification: the Prometheus guide contains historical native-histogram version/experimental notes. Check the deployed Prometheus version's primary documentation before adopting feature flags or stability claims. OTLP metric export does not by itself prove request trace propagation.
- Sources: S17, S18, S19.

## Source ledger

All links below were opened or returned with primary-source content on 2026-10-06 UTC. “Verified” means the relevant documentation/source content was retrieved; it does not mean an example was executed or compatibility was tested.

| ID | Primary source | Verified use |
|---|---|---|
| S01 | [Grafana: load test types](https://grafana.com/docs/k6/latest/testing-guides/test-types/) | Smoke/load/stress/soak/spike/breakpoint purposes |
| S02 | [Grafana: open and closed models](https://grafana.com/docs/k6/latest/using-k6/scenarios/concepts/open-vs-closed/) | Scheduling and coordinated omission |
| S03 | [Grafana: arrival-rate VU allocation](https://grafana.com/docs/k6/latest/using-k6/scenarios/concepts/arrival-rate-vu-allocation/) | Preallocation, VU availability, dynamic allocation tradeoffs |
| S04 | [Grafana: constant arrival rate](https://grafana.com/docs/k6/latest/using-k6/scenarios/executors/constant-arrival-rate/) | Iteration pacing; no extra pacing sleep needed at iteration end |
| S05 | [Grafana: dropped iterations](https://grafana.com/docs/k6/latest/using-k6/scenarios/concepts/dropped-iterations/) | Different drop causes by executor |
| S06 | [Grafana: built-in metrics](https://grafana.com/docs/k6/latest/using-k6/metrics/reference/) | Duration components, failures, requests, iterations |
| S07 | [Grafana: running large tests](https://grafana.com/docs/k6/latest/testing-guides/running-large-tests/) | Generator resource limits and monitoring |
| S08 | [Grafana: thresholds](https://grafana.com/docs/k6/latest/using-k6/thresholds/) | Threshold syntax and abort/delayed evaluation |
| S09 | [Grafana: automated performance testing](https://grafana.com/docs/k6/latest/testing-guides/automated-performance-testing/) | Baselines, automation purpose, CI versus other schedules |
| S10 | [Grafana: correlation and dynamic data](https://grafana.com/docs/k6/latest/examples/correlation-and-dynamic-data/) | Dynamic tokens and IDs |
| S11 | [Grafana: SharedArray](https://grafana.com/docs/k6/latest/javascript-api/k6-data/sharedarray/) | Read-only data sharing, init lifecycle, pitfalls |
| S12 | [Grafana: data parameterization](https://grafana.com/docs/k6/latest/examples/data-parameterization/) | Input variation and dataset memory |
| S13 | [Grafana: API load testing](https://grafana.com/docs/k6/latest/testing-guides/api-load-testing/) | Iteration rate versus requests per iteration |
| S14 | [Node: perf_hooks](https://nodejs.org/api/perf_hooks.html) | Event-loop measurement APIs; page displayed Node v26.9.0 |
| S15 | [Node: do not block the event loop](https://nodejs.org/learn/asynchronous-work/dont-block-the-event-loop) | Event-loop and worker-pool reasoning |
| S16 | [NestJS: Performance/Fastify](https://docs.nestjs.com/techniques/performance) | Adapter and middleware compatibility; generic speed claims are not application evidence |
| S17 | [Grafana: OpenTelemetry output](https://grafana.com/docs/k6/latest/results-output/real-time/opentelemetry/) | Current metric/attribute mapping and output configuration |
| S18 | [Grafana: Prometheus remote write](https://grafana.com/docs/k6/latest/results-output/real-time/prometheus-remote-write/) | Gauge versus histogram representation and aggregation caveat |
| S19 | [grafana/k6 releases](https://github.com/grafana/k6/releases) | Release page displayed v2.3.0 as latest |

Version note: fetched Grafana pages identify themselves as v2.3.x/latest. These are moving URLs, not immutable guarantees. Pin a reviewed k6 release and the actual NestJS/Node/runtime versions before authoring runnable examples. Current upstream documentation does not establish what is installed in the user's project.

## Community and social discovery, not evidence of performance

- Verified venue: [Grafana k6 community forum](https://community.grafana.com/c/grafana-k6/70). Search themes for the next pass: dropped iterations, unexpectedly low RPS, authentication expiry, generator saturation, CI noise, and percentile aggregation.
- Planned venues: relevant public k6 GitHub issues/discussions, conference talks, Stack Overflow, Reddit, and X posts. No individual anecdote was selected or validated in this first pass.
- Label each later experience as anecdotal, record its date/version/workload, and trace technical claims to current official docs, source, or a reproducible experiment. A popular post, impressive request rate, or vendor framework comparison is not portable evidence for a NestJS application.

## Decisions for the next discussion

1. Confirm this order and choose the first topic to deepen; recommended starting point is K6-02 together with K6-03.
2. Choose one minimal demonstrator: read-only endpoint for transparent load-model teaching, or authenticated business journey for realism.
3. Decide which SLO/workload figures come from an actual service; otherwise keep all example values visibly illustrative.
4. Choose the initial output boundary: local summary/CI artifact, existing Prometheus, or existing OTLP collector.
5. Decide how much backend-specific diagnostic evidence each future example must include before any causal performance claim is accepted.

Deferred: full example scripts, CI workflow, pinned-version validation, statistical decision policy, native-histogram compatibility, social-experience synthesis, skill structure, and any execution. None of these are complete or authorized by this inventory alone.
