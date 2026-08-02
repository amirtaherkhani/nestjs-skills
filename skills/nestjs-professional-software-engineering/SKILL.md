---
name: nestjs-professional-software-engineering
description: 'Designs, implements, refactors, debugs, reviews, and verifies production-quality NestJS and TypeScript software. Use for NestJS feature development, bug fixes, APIs, libraries, testing, maintainability, developer experience, idiomatic syntax, or syntactic sugar. It inspects the current project and official version-appropriate documentation before selecting syntax, preserves public behavior, and tests the result. When other skills also apply, reconcile ownership before mutation.'
license: MIT
metadata:
  author: amirtaherkhani
  version: '2.0.1'
---

# Professional Software Engineering

Produce correct, idiomatic, secure, readable, maintainable, testable, and extensible NestJS software while respecting the existing project.

## Pre-execution conflict guard

Run this guard after identifying every applicable skill and before editing files, installing packages, generating code, running migrations, or executing any other state-changing command. Read-only inspection is allowed while resolving the guard.

### Prerequisites

- Read the nearest repository instructions, contributor documentation, relevant source, tests, configuration, dependency manifests, and every active skill's coordination contract.
- Identify the language, framework, runtime, package manager, versions, project structure, current behavior, public contracts, and available verification commands.
- Search the repository for established patterns before proposing a new abstraction or syntax.
- Inspect the working tree and preserve unrelated changes.
- When syntax or library behavior is uncertain or version-sensitive, consult installed types/source and official version-appropriate documentation. Never invent an API.

### Primary ownership

This skill leads the end-to-end engineering workflow: inspection, requirements clarification, minimal design, idiomatic implementation, developer-facing API ergonomics, testing, verification, and concise handoff. It owns the decision to use language or framework syntax and syntactic sugar only after repository and compatibility constraints are known.

It yields NestJS capability, module, dependency, data, transaction, and service boundaries to `nestjs-architecture-principles`. It yields object responsibilities, invariants, SOLID trade-offs, and pattern selection to `nestjs-oop-design-patterns`. It yields Nest lifecycle mechanisms, transport/error contracts, security controls, runtime behavior, performance, reliability, and delivery to `nestjs-features-performance`.

For a read-only NestJS repository review, `nestjs-code-audit` owns evidence collection, finding deduplication, severity, and report assembly. This skill may provide general implementation-quality context but must not turn an audit into a mutation.

For a roadmap-scoped feature review, `nestjs-feature-audit` owns branch preparation, roadmap traceability, classification, and report assembly. This skill may implement confirmed gaps only after the user separately authorizes that scope.

After implementation is verified, `nestjs-git-commit-pr-message` owns intentional staging, commit and PR wording, push safety, changelog routing, and publication follow-up. It does not decide whether incomplete code is ready.

### Conflict test

A conflict exists when active skills would:

- change the same file, public contract, or architecture decision toward incompatible outcomes;
- require commands whose order, environment, permissions, or side effects cannot all be satisfied;
- select syntax that conflicts with the installed language/framework version or repository conventions;
- hide behavior that another skill requires to remain explicit; or
- proceed while another skill's prerequisite, repository constraint, or required evidence is unmet.

Resolve conflicts in this order: explicit user intent, repository contracts and verified runtime constraints, then the narrowest primary owner above. Assign one lead skill per disputed decision. This skill coordinates the implementation but does not overrule a domain owner.

If a material conflict remains, stop before mutation and ask for the smallest missing decision. Report the conflicting instructions, affected files or commands, and safe alternatives. Do not implement parallel APIs merely to satisfy incompatible advice.

## Required workflow

For implementation requests, complete the workflow through mutation and verification. For review or diagnosis requests, inspect and report evidence without modifying files unless the user also authorizes implementation.

### 1. Inspect

1. Establish repository scope and applicable instructions.
2. Identify the language, framework, runtime, package manager, and exact relevant versions.
3. Read relevant implementation, callers, tests, configuration, manifests, and public contracts.
4. Search for analogous features and naming, error, test, and API conventions.
5. Determine focused and broader test, type-check, lint, format, build, and smoke-test commands.

Do not begin with a broad rewrite. Establish current behavior before changing it.

### 2. Understand

Define:

- requested outcome and observable acceptance criteria;
- affected boundaries and consumers;
- compatibility, security, data, performance, deployment, and migration implications;
- assumptions that would materially change the solution.

Ask only when a missing decision materially affects architecture, public behavior, security, data, cost, or compatibility.

### 3. Select the clearest valid syntax

Use this evidence order:

1. Existing repository conventions and compatible public behavior.
2. Installed compiler, runtime, package versions, types, and source.
3. Official version-appropriate language or framework documentation.
4. A minimal local experiment or type-check when documentation leaves ambiguity.
5. Community examples only as discovery evidence, never as the API contract.

Compare at least the direct, explicit form with any convenient syntax. Prefer modern idioms when they are supported, familiar in the project, and clearer at the call site and implementation site.

Load [syntax-and-idioms.md](references/syntax-and-idioms.md) when selecting language or framework syntax.

### 4. Design the smallest coherent change

The design must be:

- idiomatic for the detected language and framework;
- consistent with existing architecture and conventions;
- cohesive, testable, secure by default, and backward-compatible unless a break is authorized;
- explicit about meaningful state changes, effects, failure modes, cost, and control.

For public APIs, make common operations obvious and invalid usage difficult. Prefer progressive disclosure: a convenient path for common cases and a lower-level path only when callers need meaningful control.

Load [syntactic-sugar.md](references/syntactic-sugar.md) for the decision test and API examples.

### 5. Implement

- Use valid, modern syntax supported by the detected toolchain.
- Keep functions, classes, modules, components, and services focused.
- Follow established naming, formatting, organization, validation, and error conventions.
- Validate untrusted input at boundaries and protect sensitive information.
- Handle failures explicitly with actionable, non-leaking errors.
- Consider concurrency, transactions, idempotency, retries, timeouts, cancellation, cleanup, and observability when relevant.
- Avoid unnecessary dependencies, speculative abstractions, clever one-liners, hidden global state, implicit side effects, and unrelated cleanup.
- Comment intent and constraints, not self-explanatory syntax.

### 6. Test and verify

Add or update deterministic tests for observable behavior, relevant edge cases, invalid input, failure paths, security-sensitive behavior, regressions, and public compatibility.

Run the checks appropriate to the change:

1. Focused tests.
2. Broader tests when the risk warrants them.
3. Type checking or compilation.
4. Lint and formatting verification.
5. Build or packaging.
6. Runtime, generated-contract, or migration smoke checks when practical.

Do not weaken tests or controls to obtain a pass. Do not claim a check passed unless it ran successfully.

Load [implementation-verification.md](references/implementation-verification.md) for risk-based verification.

### 7. Report

Lead with the completed outcome, then state:

- important design and syntax decisions;
- files or areas changed;
- checks executed and their results;
- remaining limitations, risks, migrations, or follow-up.

Keep the report concise and distinguish verified facts from assumptions or unrun checks.

## Syntactic sugar rule

Use syntactic sugar only when it:

- reduces meaningful ceremony or repeated misuse;
- improves readability for the repository's actual maintainers;
- preserves predictable behavior, typing, debugging, and composability;
- does not conceal meaningful cost, I/O, state changes, network activity, authorization, transactions, error behavior, or lifecycle;
- preserves an explicit path when advanced callers need control; and
- can be documented and tested with realistic examples.

Reject sugar that merely shortens code, creates a private mini-language, overloads ambiguous inputs, relies on surprising coercion, or makes stack traces and errors harder to understand.

## Expected response

For implementation work, report the delivered behavior and verification. When syntax choice is central, also state:

- **Observed convention:** the relevant repository pattern.
- **Options considered:** explicit and convenient forms.
- **Selected syntax:** why it is supported and clearest.
- **Hidden-behavior check:** effects, cost, failures, and control that remain visible.
- **Compatibility:** affected callers and migration, if any.

Do not return only a proposed snippet when the user requested implementation.

## Reference routing

| Task | Load |
| --- | --- |
| Choose idiomatic, version-compatible syntax | [syntax-and-idioms.md](references/syntax-and-idioms.md) |
| Design or review syntactic sugar and public API ergonomics | [syntactic-sugar.md](references/syntactic-sugar.md) |
| Scope implementation and select verification depth | [implementation-verification.md](references/implementation-verification.md) |
