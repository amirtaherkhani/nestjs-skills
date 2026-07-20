---
layout: home

hero:
  name: NestJS Agent Skills
  text: Better boundaries. Better decisions.
  tagline: Three focused skills that help Claude Code and Codex reason about NestJS architecture, object design, framework features, performance, and scale—without forcing accidental complexity.
  image:
    src: /skill-mark.svg
    alt: Three connected modules representing the skill collection
  actions:
    - theme: brand
      text: Get started
      link: /guide/getting-started
    - theme: alt
      text: Explore concepts
      link: /concepts/request-lifecycle

features:
  - icon: ◫
    title: Architecture & Principles
    details: Choose the smallest architecture that protects real boundaries—from cohesive feature modules to deliberate distributed services.
    link: /reference/architecture/
    linkText: Read the skill
  - icon: ◇
    title: OOP & Design Patterns
    details: Apply SOLID and patterns as diagnostic tools for observed change pressure, not as decoration or folder-tree ceremony.
    link: /reference/oop-patterns/
    linkText: Read the skill
  - icon: ↗
    title: Features & Performance
    details: Put behavior in the right NestJS lifecycle primitive, measure the limiting resource, then scale safely.
    link: /reference/features-performance/
    linkText: Read the skill
---

<div class="home-content">

## Route work to the right skill

Each skill owns a distinct decision level. Use one as the lead and bring in another only when the task crosses a real boundary.

<div class="route-grid">
  <a class="route-card" href="./guide/choose-a-skill#architecture--principles">
    <strong>System shape</strong>
    <span>Module ownership, architecture level, dependency direction, transactions, and service boundaries.</span>
  </a>
  <a class="route-card" href="./guide/choose-a-skill#oop--design-patterns">
    <strong>Object collaboration</strong>
    <span>Responsibilities, invariants, SOLID, object roles, code smells, and design-pattern selection.</span>
  </a>
  <a class="route-card" href="./guide/choose-a-skill#features--performance">
    <strong>Runtime behavior</strong>
    <span>Request lifecycle, APIs, queues, caching, observability, bottlenecks, reliability, and scale.</span>
  </a>
</div>

## One coherent engineering model

The skills share the same defaults: inspect the actual repository, preserve explicit contracts, prefer the least complex safe design, keep policy separate from volatile infrastructure, and verify outcomes with tests or measurements. Their scopes overlap at intentional handoff points—not through contradictory ownership.

::: tip A practical sequence
For a large change, decide the system boundary first, design the collaborating objects second, then choose the NestJS runtime features and performance controls that implement it.
:::

<div class="install-strip">
  <div>
    <h2>Install all three</h2>
    <p>The open Agent Skills format works with Claude Code and Codex.</p>
  </div>

```bash
npx skills add amirtaherkhani/nestjs-agent-skills
```
</div>

</div>
