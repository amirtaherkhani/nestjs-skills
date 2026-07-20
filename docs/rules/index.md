---
title: Rules Reference
description: Ten conflict-checked NestJS rulebooks covering architecture, dependency injection, errors, security, performance, testing, data, APIs, microservices, and deployment.
---

<p class="doc-kicker">Ten rulebooks · Three owners</p>

# Rules reference

<p class="doc-lede">A fast path into the canonical instructions used by Claude Code and Codex. Each topic has one primary owner, explicit handoffs, and conditions that prevent “always” or “never” advice from becoming accidental architecture.</p>

<nav class="rules-reference" aria-label="NestJS rules reference">
  <a class="rule-row" href="../reference/architecture/references/architecture-rules">
    <span class="rule-number" aria-hidden="true">01</span>
    <span class="rule-copy"><strong>Architecture</strong><small>Capabilities, boundaries, ownership, dependency direction, and coupling</small></span>
    <span class="rule-owner">Architecture</span>
    <span class="rule-arrow" aria-hidden="true">→</span>
  </a>
  <a class="rule-row" href="../reference/architecture/references/dependency-injection">
    <span class="rule-number" aria-hidden="true">02</span>
    <span class="rule-copy"><strong>Dependency Injection</strong><small>Provider forms, runtime tokens, scopes, ports, composition, and cycle repair</small></span>
    <span class="rule-owner">Architecture</span>
    <span class="rule-arrow" aria-hidden="true">→</span>
  </a>
  <a class="rule-row" href="../reference/features-performance/references/error-handling">
    <span class="rule-number" aria-hidden="true">03</span>
    <span class="rule-copy"><strong>Error Handling</strong><small>Taxonomy, stable contracts, multi-transport filters, deadlines, retries, privacy, and fatal failures</small></span>
    <span class="rule-owner">Runtime</span>
    <span class="rule-arrow" aria-hidden="true">→</span>
  </a>
  <a class="rule-row" href="../reference/features-performance/references/security">
    <span class="rule-number" aria-hidden="true">04</span>
    <span class="rule-copy"><strong>Security</strong><small>Validation, authentication, authorization, tokens, secrets, and abuse controls</small></span>
    <span class="rule-owner">Runtime</span>
    <span class="rule-arrow" aria-hidden="true">→</span>
  </a>
  <a class="rule-row" href="../reference/features-performance/references/performance-diagnosis">
    <span class="rule-number" aria-hidden="true">05</span>
    <span class="rule-copy"><strong>Performance</strong><small>Measurement, event-loop safety, database latency, memory, caching, and capacity</small></span>
    <span class="rule-owner">Runtime</span>
    <span class="rule-arrow" aria-hidden="true">→</span>
  </a>
  <a class="rule-row" href="../reference/features-performance/references/testing">
    <span class="rule-number" aria-hidden="true">06</span>
    <span class="rule-copy"><strong>Testing</strong><small>Unit, TestingModule, integration, contract, E2E, reliability, and load tests</small></span>
    <span class="rule-owner">Runtime</span>
    <span class="rule-arrow" aria-hidden="true">→</span>
  </a>
  <a class="rule-row" href="../reference/architecture/references/database-orm">
    <span class="rule-number" aria-hidden="true">07</span>
    <span class="rule-copy"><strong>Database &amp; ORM</strong><small>Data ownership, mappings, migrations, transactions, queries, pools, and integrity</small></span>
    <span class="rule-owner">Architecture</span>
    <span class="rule-arrow" aria-hidden="true">→</span>
  </a>
  <a class="rule-row" href="../reference/features-performance/references/api-design">
    <span class="rule-number" aria-hidden="true">08</span>
    <span class="rule-copy"><strong>API Design</strong><small>DTOs, response contracts, pagination, idempotency, versioning, and transports</small></span>
    <span class="rule-owner">Runtime</span>
    <span class="rule-arrow" aria-hidden="true">→</span>
  </a>
  <a class="rule-row" href="../reference/architecture/references/microservices">
    <span class="rule-number" aria-hidden="true">09</span>
    <span class="rule-copy"><strong>Microservices</strong><small>Extraction gates, service contracts, data ownership, delivery, and operations</small></span>
    <span class="rule-owner">Architecture</span>
    <span class="rule-arrow" aria-hidden="true">→</span>
  </a>
  <a class="rule-row" href="../reference/features-performance/references/devops-deployment">
    <span class="rule-number" aria-hidden="true">10</span>
    <span class="rule-copy"><strong>DevOps &amp; Deployment</strong><small>CI/CD, containers, Kubernetes, supply chain, SRE, recovery, drain, and rollout</small></span>
    <span class="rule-owner">Runtime</span>
    <span class="rule-arrow" aria-hidden="true">→</span>
  </a>
</nav>

## One rule model, not ten competing checklists

The labels are navigation; the three skills remain the ownership model. Architecture decides system and data boundaries. OOP and Design Patterns shapes collaborators inside those boundaries. Features, Scaling, and Performance implements runtime behavior and verifies it under load and failure.

::: tip Context beats slogans
Repository evidence, explicit contracts, security, data integrity, and measured runtime behavior outrank a generic rule. The rulebooks state their conditions and handoffs wherever a topic crosses skill boundaries.
:::
