# NestJS backend research backlog

This is a prioritized list for later, focused research sessions. These six headings are our proposed planning taxonomy, not a claim that one formal engineering standard defines a universal taxonomy. Topics are planned, not yet researched. Research cadence is undecided.

Already-collected notes are kept separately in [preliminary materials](preliminary/README.md). They are incomplete and unapproved, not conclusions or guidance.

The source inventory below is preliminary, captured 2026-10-06. It is not completed research or evidence for conclusions. Add independent engineering blogs and developer-community or social discussions during the relevant topic session, clearly labeled as commentary or discovery sources.

## 1. Software Testing Strategy

**Scope and questions**

- Place unit, Nest module, integration, contract, and end-to-end tests at the boundaries where they provide useful evidence.
- Decide when to mock dependencies versus use real framework, transport, or persistence behavior.
- Compare database isolation, test data setup, cleanup, and transaction strategies for reliable suites.
- Separate product behavior tests from operational and performance checks.

**Future evidence:** a test-level decision guide, a small NestJS example for each relevant boundary, and measured runtime, fidelity, and reliability trade-offs.

**Depends on:** none.

## 2. Performance Measurement and Benchmarking

**Scope and questions**

- Establish a repeatable baseline before comparing a change.
- Vary input volume separately from request concurrency so the two effects are distinguishable.
- Select latency distributions, throughput, errors, and resource measures appropriate to the question.
- Set service-level objectives and explicit thresholds, and control environment, warm-up, and run-to-run variation.

**Future evidence:** a reproducible benchmark protocol, baseline artifacts, workload and environment details, and justified pass/fail thresholds.

**Depends on:** item 1 for behavioral safeguards; informs items 3–6.

## 3. Performance Testing

**Scope and questions**

- Choose among load, stress, spike, endurance/soak, and scalability testing for the question being asked.
- Define arrival rate or virtual users, ramp-up, duration, workload mix, and SLO thresholds.
- Treat k6 as a test tool, not as a performance-testing category.
- Set safety limits so tests do not overload shared or production systems.

**Future evidence:** runnable workload examples, workload assumptions, safety controls, threshold configuration, and result interpretation for each relevant test type.

**Depends on:** item 2.

## 4. Performance Profiling and Bottleneck Analysis

**Scope and questions**

- Investigate CPU, memory, event-loop delay, garbage collection, database query plans, N+1 queries, and distributed traces.
- Distinguish application, Node.js runtime, database, network, and downstream limits using observed evidence.
- Form and test a bottleneck hypothesis before selecting an optimization.

**Future evidence:** a repeatable diagnosis workflow, representative profiler/query-plan/trace artifacts, and a measured before/after case tied to the identified bottleneck.

**Depends on:** item 2; use workloads from item 3 where they help reproduce the issue.

## 5. Algorithm Analysis and Computational Complexity

**Scope and questions**

- Analyze time and space complexity for representative operations using asymptotic notation, including Big O.
- Vary input size independently from concurrency and I/O to observe growth.
- Relate theoretical complexity to measured behavior at realistic sizes, stating where each analysis stops being predictive.

**Future evidence:** code-level complexity reasoning plus controlled runtime and memory measurements across input sizes, with limits and assumptions recorded.

**Depends on:** item 2; use diagnostic methods from item 4 when a bottleneck needs explanation.

## 6. Performance Regression Testing

**Scope and questions**

- Decide which measured checks belong in local development, pull-request CI, scheduled runs, or release validation.
- Define regression thresholds that account for noise without hiding meaningful slowdowns.
- Control flaky tests and make workloads, seeds, environments, and artifacts reproducible.
- Treat retries as diagnostic evidence, not as a way to turn an unstable result green.

**Future evidence:** a staged CI proposal, threshold rationale, flake triage procedure, and a failure that can be reproduced from retained inputs and artifacts.

**Depends on:** items 1–5 as relevant to the regression being guarded.

## Backend Architecture Styles and Patterns in NestJS

**Planning priority:** High decision value when a team is choosing or changing boundaries; otherwise a follow-on research topic because the existing [architecture ladder](../../skills/nestjs-architecture-principles/references/architecture-ladder.md) and [microservices guidance](../../skills/nestjs-architecture-principles/references/microservices.md) already cover the main progression. This is a practical sequencing judgment, not a popularity ranking.

**Initial scope scan:** current guidance recommends cohesive feature modules, shows layered feature modules and hexagonal boundaries, and gives criteria for independent services. A likely research opportunity is a clearer side-by-side comparison of these choices in NestJS, especially where terms overlap. This scan is not a full coverage audit.

**Questions for a later focused session**

- When is a feature-based modular monolith sufficient, and what concrete change pressure justifies adding layers or ports and adapters?
- How are Hexagonal Architecture and Clean Architecture related, and where do their dependency rules, terminology, or implementation choices differ? Treat them as related, not identical.
- What observable ownership, deployment, data, scaling, and failure constraints justify microservices, and when would a separate worker be enough?
- How do Event-Driven and Web-Queue-Worker styles support asynchronous integration and background workloads in NestJS, and what operational trade-offs do they introduce? See the [Microsoft architecture styles overview](https://learn.microsoft.com/azure/architecture/guide/architecture-styles) as a starting reference.
- How does N-tier deployment topology differ from logical layered organization inside an application? Keep deployment tiers distinct from code organization.
- How can serverless execution and deployment combine with Hexagonal Architecture, CQRS, or other logical patterns? Treat serverless as a deployment choice, not a competing logical style; see [AWS hexagonal architecture examples](https://docs.aws.amazon.com/prescriptive-guidance/latest/hexagonal-architectures/examples.html).
- How should Domain-Driven Design modeling, CQRS, and event-driven integration be explained as orthogonal choices that can combine with multiple deployment styles, rather than as adjacent rungs in one ladder?
- Which architectural terms or patterns are already useful in a real NestJS codebase, and which add ceremony without a present requirement?

**Future evidence:** a compact decision matrix; one small NestJS example showing module ownership, dependency direction, and provider wiring; a comparison of layered, hexagonal, and Clean Architecture terminology; and a migration example showing what evidence would justify moving from a modular monolith toward independently operated services. Keep DDD, CQRS, and event-driven integration as separate dimensions in the comparison.

**Potential guidance home:** first assess whether this belongs as a focused expansion of the existing NestJS Architecture & Principles skill. Do not create or implement a specialized skill until later research establishes a distinct audience, scope, and gap.

**Depends on:** the existing architecture-skill coverage review; use the earlier Software Testing Strategy and Performance Measurement topics when a comparison needs runnable or operational evidence.

## NestJS Release, Migration, and Guidance Currency

**Planning priority:** revisit this topic when planning a framework upgrade or when version-sensitive guidance is selected for implementation. This is a research backlog item, not an upgrade request.

**Scope and questions**

- Verify the latest stable NestJS release from official GitHub releases and the npm stable package metadata when the topic is selected; compare it with this repository's package pins and compatibility constraints.
- Review the official [migration guide](https://docs.nestjs.com/migration-guide) and identify migration steps and changed guidance relevant to the repository's current version. The supplied snapshot reports a current 11→12 migration guide; verify that at research time.
- Record which guidance is version-sensitive and which remains applicable to the repository's pinned NestJS version. Do not automatically upgrade dependencies or change project files as part of the research.

**Future evidence:** dated official release and package references, the repository-version comparison, compatibility notes, and a concise migration-impact summary grounded in the official guide.

**Depends on:** a current package/version inventory and the repository's compatibility requirements; select alongside any version-sensitive topic before using its conclusions.

## Background Job Processing and Workflow Orchestration in NestJS

**Planning priority:** a later focused research topic for workloads that need deferred, recurring, event-triggered, or long-running background execution. This entry sets research scope only; it does not select a package or establish that a specialized skill is needed.

**Scope and questions**

- Compare scheduled, deferred, recurring, and event-triggered tasks, and distinguish CPU-bound work from I/O-bound work when considering execution boundaries.
- Evaluate Nest-compatible queue options using explicit criteria, including maintenance and compatibility, durability, deployment needs, operational complexity, and fit for the workload. Use the official [NestJS queues guide](https://docs.nestjs.com/techniques/queues) and [BullMQ documentation](https://docs.bullmq.io/) as initial source seeds; inspect existing queue guidance in the repository before proposing an owner or new skill.
- For BullMQ where relevant, examine jobs, queues, workers, and flows, including retry and backoff, idempotency, concurrency, rate limits, timeouts, cancellation, failure handling, recovery, and observability.
- Define when a queue job is enough and when a durable multi-step workflow with state, coordination, and recovery semantics is warranted; compare using workload requirements rather than product labels.

**Future evidence:** a workload-to-approach decision matrix, version-pinned NestJS examples, and executable evidence for enqueueing, worker execution, retry/failure recovery, idempotency, and observability, with deployment assumptions and operational trade-offs recorded.

**Depends on:** the repository queue-guidance coverage review and a later selection of representative workload requirements. Do not choose a package or create a specialized skill until focused research establishes the gap and fit.

## Observability, Metrics, Monitoring, and SRE in NestJS

**Planning priority:** a focused research topic to turn existing operational guidance into version-pinned, runnable NestJS instrumentation and telemetry-export evidence. This is a backlog entry, not an implementation plan.

**Scope and questions**

- Define the terms distinctly: metrics are numeric measurements over time; monitoring uses known signals, dashboards, and alerts to detect expected conditions; observability uses logs, metrics, and traces to diagnose system behavior, including conditions not anticipated in advance; SRE applies service objectives, error budgets, and incident practices to reliability work.
- Review the existing [Observability and SRE reference](../../skills/nestjs-features-performance/references/observability-sre.md) for coverage of SLIs/SLOs and error budgets, signals and dashboards, actionable alerts, incident response, recovery, privacy, cardinality, and telemetry cost. Identify the specific gap before proposing duplicate ownership or new guidance.
- Research executable NestJS OpenTelemetry instrumentation and export paths, including collector and Prometheus/Grafana arrangements. State framework, Node.js, and instrumentation versions, and distinguish example deployment assumptions from general guidance.
- Address sensitive data and redaction, metric label cardinality, sampling, retention, access control, and telemetry cost as design constraints, not afterthoughts.

**Future evidence:** a runnable, version-pinned NestJS example that emits representative traces, metrics, and structured logs through a documented collector/export path; setup instructions for a local Prometheus/Grafana view where appropriate; and checks or sample queries showing correlation, useful alerts, privacy safeguards, cardinality bounds, and cost/retention assumptions.

**Depends on:** the existing observability/SRE coverage review and a defined service scenario with user-facing SLIs. Research should establish whether a focused addition to the current performance skill is sufficient before considering a new skill.

## HTTP Clients and Outbound Requests in NestJS

**Planning priority:** a focused topic for reliable and maintainable outbound HTTP integrations, including the newly announced `@nestjs/http-client`. Confirm package status, compatibility, and supported NestJS versions during research; this entry does not select or add a dependency.

**Scope and questions**

- Compare Nest-compatible HTTP client options, including `@nestjs/http-client`, using compatibility, API, maintenance, runtime, and testing criteria.
- Define safe timeout, cancellation, and error-handling practices for outbound requests, including propagation of request context and clear ownership of failures.
- Evaluate retry behavior based on idempotency and operation semantics; address backoff, retry limits, and avoiding duplicate side effects.

**Future evidence:** version-pinned NestJS examples for a client call, timeout and cancellation, structured error handling, and a retry decision that demonstrates safety boundaries; a concise client comparison with reproducible criteria.

**Depends on:** checking current HTTP client guidance and the announced package's release and compatibility details. Research before choosing a default client or proposing new skill content.

## NestJS HTTP Adapters: Express vs Fastify

**Planning priority:** a focused comparison for teams selecting or changing NestJS HTTP adapters. This is a research topic; it does not recommend or migrate the repository to either adapter.

**Scope and questions**

- Compare Express and Fastify compatibility with NestJS features and ecosystem integrations, including middleware, plugins, request/response behavior, and adapter-specific constraints.
- Measure performance under controlled, representative workloads; record versions, configuration, environment, and workload so results are reproducible and not treated as universal rankings.
- Assess migration trade-offs, including code and integration changes, operational behavior, testing, and maintenance costs.

**Future evidence:** a compatibility matrix, runnable equivalent NestJS examples, a reproducible performance measurement plan and results, and a migration checklist with risks and validation steps.

**Depends on:** the existing adapter guidance and defined application requirements. Research first to identify a distinct gap before proposing a dedicated skill or migration.

## Preliminary primary-source inventory

These are official or primary references supplied for later investigation. Their contents, applicability, and version alignment still need review when a topic is selected.

| Source | Classification | Planned use |
| --- | --- | --- |
| [NestJS testing](https://docs.nestjs.com/fundamentals/testing) | Official framework documentation | Testing strategy and Nest-specific test APIs |
| [k6 metrics](https://grafana.com/docs/k6/latest/using-k6/metrics/) | Official tool documentation | Performance measurements and metrics |
| [ISTQB Certified Tester Performance Testing](https://istqb.org/certifications/certified-tester-performance-testing-ct-pt/) | Official testing certification syllabus | Performance-testing terminology and test types |
| [Node.js profiling](https://nodejs.org/en/learn/getting-started/profiling) | Official runtime documentation | Profiling tools and workflow |
| [MIT 6.006: Introduction to Algorithms](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/) | Official university course material | Algorithm analysis and computational complexity |
| [Automated performance testing with k6](https://grafana.com/docs/k6/latest/testing-guides/automated-performance-testing/) | Official tool documentation | Performance regression checks in delivery pipelines |

**Captured:** 2026-10-06. This is an inventory date, not a claim that each page was published or updated on that date.

**Version note:** this repository pins NestJS packages at 11.2.7. The NestJS documentation URL is unversioned and may describe a newer release. When item 1 is researched, verify guidance against the repository’s pinned version and record the documentation version or retrieval date.

**Source gaps:** venues are inventoried below, but no individual independent engineering blog posts or community/social discussions have been reviewed. Add specific sources per topic and label them as independent commentary or discovery leads rather than primary documentation.

## Practitioner writing, communities, and discovery venues

These are discovery locations and evidence venues, not a set of reviewed articles. Link checks were bounded to one HTTP `HEAD` request per URL on 2026-10-06; a response code only checks endpoint reachability, not page contents, authorship, accuracy, or current activity. No article sweep or account-content review was performed.

| Venue | Purpose and priority | Evidence caveat and link-check result |
| --- | --- | --- |
| [DEV.to NestJS tag](https://dev.to/t/nestjs) | Find practitioner write-ups and questions tagged NestJS. | Independent posts; check author, date, version, sample, and claims later. `200` response. |
| [DEV.to NestJS publication](https://dev.to/nestjs) | Official-publication discovery venue, as identified in the supplied inventory. | Verify authorship and whether each post is an official project statement. `200` response. |
| [Hashnode](https://hashnode.com/) | General writing-platform discovery only; no NestJS topic URL assumed. | Individual post scope and authorship must be checked. Request timed out; contents not inspected. |
| [Medium](https://medium.com/) | General writing-platform discovery only; no NestJS topic URL assumed. | Individual post scope and authorship must be checked. `403` response; contents not inspected. |
| [Stack Overflow: NestJS tag](https://stackoverflow.com/questions/tagged/nestjs) | Find concrete implementation questions and answers. | Treat answers as community evidence; verify dates, versions, and accepted-answer context. `403` response; contents not inspected. |
| [Reddit: r/nestjs](https://www.reddit.com/r/nestjs/) | Discover practitioner discussions and recurring problems. | Anecdotal leads only; validate technical claims against primary docs and runnable evidence. Request did not resolve; contents not inspected. |
| [NestJS GitHub repository](https://github.com/nestjs/nest), [issues](https://github.com/nestjs/nest/issues), and [pull requests](https://github.com/nestjs/nest/pulls) | Inspect source, release context, and maintainer decisions for a specific version or change. | Prefer pinned code/PR/issue evidence. Use Discussions only if that feature is enabled. All three endpoints returned `200`; no issues, PRs, source files, or discussions were reviewed. |
| [Grafana k6 community](https://community.grafana.com/c/grafana-k6/70) | Find k6 usage questions and operational reports. | Community commentary, not normative tool behavior; verify against k6 docs and controlled runs. `200` response. |

### Official NestJS community links

The links below were supplied as links listed by the [official NestJS homepage](https://nestjs.com/); this inventory does not establish current activity or review account contents. The homepage returned `200` to the bounded check. No account was joined, followed, or contacted.

| Channel | Use as | Link check and limitation |
| --- | --- | --- |
| [NestJS Discord](https://discord.com/invite/G7Qnnhy) | Official community venue and discovery leads. | Request did not resolve; membership and channel contents not inspected. |
| [NestJS on X](https://twitter.com/nestframework) | Official social account attribution from the homepage. | Request did not resolve; contents not inspected and no activity claim made. |
| [NestJS on LinkedIn](https://linkedin.com/company/19078346) | Official social account attribution from the homepage. | `403` response; contents not inspected and no activity claim made. |
| [NestJS GitHub](https://github.com/nestjs/nest) | Official source, issues, and pull requests. | `200` response; not a substitute for version-specific source review. |

**Planned but not yet inventoried:** official engineering blogs from NestJS and relevant tooling maintainers. No specific blog articles have been verified or selected. For any source used later, record its author or organization, publication and update dates, applicable tool/framework version, evidence type, and whether examples were independently run. Community ideas should be checked against official documentation and runnable evidence before adoption.
