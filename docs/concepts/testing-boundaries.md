---
title: Testing Boundaries
description: Test NestJS behavior at the smallest level that can prove each architectural and runtime contract.
---

<p class="doc-kicker">Core concept · Verification</p>

# Testing boundaries

<p class="doc-lede">A useful test protects a public behavior, invariant, integration contract, or wiring decision. Match the test level to the failure you need to detect.</p>

## Test by responsibility

| Boundary | Test style | Proves |
| --- | --- | --- |
| Value object or policy | Plain unit test | Invariants and deterministic decisions |
| Application operation | Focused unit test with narrow fakes | Orchestration, outcomes, and collaborator contracts |
| Adapter | Integration or contract test | Mapping to a database, broker, cache, or external API |
| Nest module | `TestingModule` integration test | Tokens, exports, scopes, decorators, and provider wiring |
| Transport endpoint | E2E test | Validation, guards, interceptors, filters, serialization, and public contract |
| Performance path | Representative load test plus telemetry | Latency, throughput, saturation, and resource bounds |

## Mock at owned seams

Mock an application-owned port when the test is about high-level policy. Do not mock every private collaborator, Nest decorator, ORM method chain, or implementation detail. Excessive mocking lets production wiring fail while unit tests remain green.

For infrastructure adapters, prefer the real protocol or a faithful local dependency over mocks that merely repeat the implementation's assumptions.

## Protect boundaries explicitly

Architecture rules can be executable:

- domain packages cannot import NestJS, transport types, ORM entities, or vendor SDKs;
- feature modules may import only documented public entry points;
- forbidden cycles fail a dependency-graph check;
- one module's tests cannot write another capability's tables through internal adapters.

These tests protect dependency direction without asserting a specific folder tree.

## Verify failure paths

For every important success path, identify the failure boundary:

- invalid or oversized input;
- denied authorization;
- transaction conflict or invariant violation;
- dependency timeout or partial failure;
- duplicate message delivery;
- process shutdown with in-flight work.

Assert the observable contract and recovery behavior. Avoid tests that call private methods or snapshot unstable framework internals.

## Proportional verification

A local pure refactor may need focused unit tests and static checks. A module-boundary change needs wiring and integration tests. A transport or persistence migration needs contract, e2e, and rollout checks. Performance claims require before-and-after measurements under the same representative workload.

See the [Architecture review](/reference/architecture/references/architecture-review) and [Production readiness](/reference/features-performance/references/production-readiness) checklists.
