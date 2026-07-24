---
title: Choose a Skill
description: Route implementation through Professional Engineering, three NestJS domain skills, and the code-audit orchestrator without conflicting ownership.
---

<p class="doc-kicker">Guide · Skill routing</p>

# Choose a skill

<p class="doc-lede">Use Professional Engineering to coordinate implementation, then let the skill that owns each decision level lead architecture, object collaboration, or runtime behavior.</p>

For a whole-codebase quality review, start with `nestjs-code-audit`. It coordinates all three decision owners, runs safe static checks, deduplicates findings, and returns one report without modifying the target project.

## Routing matrix

| Decision level | Lead skill | Typical questions |
| --- | --- | --- |
| Implementation workflow and syntax | Professional Software Engineering | What syntax does this project and version support? Is syntactic sugar clearer and safe? How should the change be tested? |
| System shape and ownership | Architecture & Principles | Which module owns this write? Is a port justified? Does this capability need its own deployment boundary? |
| Object responsibilities and collaboration | OOP & Design Patterns | Where should this invariant live? Is Strategy warranted? How do we refactor this god provider safely? |
| Framework lifecycle and runtime behavior | Features & Performance | Is this a guard or interceptor? Why is the endpoint slow? How should jobs retry and drain? |

## Professional Software Engineering

Lead with `professional-software-engineering` for feature implementation, fixes, refactors, public APIs, library work, developer experience, and syntax selection.

It inspects the actual project and installed versions, compares explicit and convenient forms, and uses syntactic sugar only when it reduces real ceremony without hiding meaningful behavior. NestJS-specific architecture, object-design, and runtime decisions remain owned by the domain skills below.

[Open the full skill →](/reference/professional-engineering/)

## Architecture & Principles

Lead with `nestjs-architecture-principles` for decisions that affect dependency direction, capability ownership, module APIs, transaction boundaries, or deployment shape.

It chooses the lowest architecture level that satisfies known constraints. A cohesive modular monolith is the default starting point; layers, ports, CQRS, and independent services must earn their operational and cognitive cost.

[Open the full skill →](/reference/architecture/)

## OOP & Design Patterns

Lead with `nestjs-oop-design-patterns` when the system boundary is understood but the responsibilities inside it are unclear. It diagnoses cohesion, encapsulation, substitutability, variation, and code smells before selecting a pattern.

It does not require an interface for every class or a pattern for every conditional. Direct code remains preferable when no durable variation or boundary exists.

[Open the full skill →](/reference/oop-patterns/)

## Features & Performance

Lead with `nestjs-features-performance` for framework feature selection, request and message lifecycles, error taxonomy and transport mapping, CI/CD, containers, Kubernetes, observability/SRE, resource bottlenecks, reliability, or horizontal scale.

It measures before optimizing and compares repository intent with the built artifact and live runtime before diagnosing deployment. Fastify, Redis, workers, replicas, and service splits are possible remedies only after evidence identifies the constraint and the compatibility cost is understood.

[Open the full skill →](/reference/features-performance/)

## Intentional overlap

Overlap is resolved by decision ownership, so the skills reinforce rather than override each other.

| Topic | Primary ownership | Handoff |
| --- | --- | --- |
| Implementation and syntax | Professional Engineering coordinates inspection, syntax selection, coding, testing, and reporting | Domain skills own architecture, object design, and NestJS runtime decisions |
| Dependency injection | Architecture defines boundaries and composition; OOP defines collaborator contracts | Features evaluates provider scope and runtime cost |
| Interceptors and guards | Features owns lifecycle placement | OOP reviews cohesion; Architecture prevents business policy from leaking into transport adapters |
| Events | Architecture owns capability and transaction boundaries | OOP models completed facts; Features owns delivery, retries, idempotency, and backpressure |
| CQRS | Architecture decides whether command/query separation is justified | OOP shapes handlers and messages; Features verifies transport and operational behavior |
| Error handling | Features owns taxonomy, public/transport mapping, filters, deadlines, retry classification, fatal-process behavior, and diagnostics | OOP models cohesive failure types; Architecture owns transactions and partial-effect consistency; Security owns disclosure |
| Security | Features owns validation, identity, access, secrets, output, and abuse controls | Architecture assigns trust/data ownership; OOP encapsulates resource policy |
| Testing | Features owns test-layer selection and runtime verification | Architecture owns boundary assertions; OOP owns object behavior and test seams |
| Database & ORM | Architecture owns data, migration, transaction, and persistence boundaries | OOP shapes domain objects/ports; Features diagnoses query, pool, and capacity cost |
| API design | Features owns transport contracts, DTOs, compatibility, and protocol semantics | Architecture owns capability boundaries; OOP owns invariant-rich internal models |
| Microservices | Architecture owns extraction, service contracts, and data ownership | Features implements transport, delivery, backpressure, health, and measured capacity |
| DevOps & deployment | Features owns artifact, configuration, health, telemetry, drain, and rollout mechanics | Architecture owns independently deployable boundaries and data compatibility |
| Performance-driven service split | Features supplies measurements and capacity evidence | Architecture decides whether independent deployment and data ownership justify the split |
| Repository pattern | Architecture decides whether persistence needs a port | OOP keeps the contract application-owned and cohesive; Features checks query and transaction cost |

## Pre-execution conflict guard

Every skill carries the same guard, with ownership specialized to its decision level. After selecting all applicable skills and before any file edit, package installation, generator, migration, deployment, or other state-changing command:

1. Read the target repository instructions and each active skill's prerequisites and ownership declaration.
2. List the intended files, contracts, commands, target environments, and assumptions.
3. Flag incompatible outcomes, unsafe command ordering or side effects, overlapping primary ownership, and unmet prerequisites.
4. Resolve each disputed decision using explicit user intent, verified repository/runtime constraints, and then the narrowest primary owner in the routing matrix.
5. Assign one lead skill to the decision. If a material conflict remains, stop before mutation and present the conflict and smallest safe choices.

Read-only inspection may continue to collect the evidence needed to resolve a conflict. The guard blocks mutation, not diagnosis.

::: danger Do not merge incompatible advice
Running both commands, introducing parallel abstractions, or letting the last skill overwrite the first is not conflict resolution. The agent must preserve one coherent architecture and execution plan.
:::

## Shared rules

All implementation and NestJS domain skills use the same non-negotiable order when advice competes:

1. Correctness, security, and data integrity.
2. Explicit external contracts and backward compatibility.
3. Operability, failure containment, and measured runtime behavior.
4. Healthy repository conventions.
5. Design purity and local elegance.

They also share four working defaults:

- inspect the actual repository and installed versions before prescribing;
- prefer the least complex safe design;
- keep business policy separate from volatile framework and infrastructure concerns;
- verify behavior with tests, traces, measurements, or operational checks.

::: warning A conflict is evidence to investigate
If two recommendations still appear incompatible, do not silently pick the more elaborate one. State the concrete requirement, identify which decision level owns it, and verify the repository or runtime evidence that resolves it.
:::

## A cross-skill sequence

For a feature that writes data and publishes work:

1. **Professional Engineering:** inspect the project, versions, conventions, public contracts, and verification commands.
2. **Architecture:** assign write ownership, transaction intent, and dependency direction.
3. **OOP:** place invariants and define the smallest useful collaborators or ports.
4. **Features:** choose the controller, validation, event or queue mechanism, idempotency, observability, and shutdown behavior.
5. **Professional Engineering:** implement the coherent design and verify the public contract, boundary wiring, failure paths, and runtime target.
