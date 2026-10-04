---
layout: home

hero:
  name: NestJS Skills
  text: Better boundaries. Better decisions.
  tagline: Seven focused skills that implement, audit, and publish software with project-aware syntax, deliberate NestJS boundaries, safe runtime behavior, and evidence-backed verification.
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
    - theme: alt
      text: Browse rules
      link: /rules/

features:
  - icon: ↥
    title: Git Publication
    details: Stage intentionally, scan for secrets, write accurate commits and PRs, push safely, and verify CI or GitHub Pages.
    link: /reference/git-publication/
    linkText: Read the skill
  - icon: </>
    title: Professional Engineering
    details: Inspect the project, choose clear version-compatible syntax, implement the smallest coherent change, and verify the result.
    link: /reference/professional-engineering/
    linkText: Read the skill
  - icon: ✓
    title: Code Audit
    details: Run read-only syntax, TypeScript, lint, architecture, design, security, testing, and runtime checks and receive one evidence-backed report.
    link: /reference/code-audit/
    linkText: Run the audit
  - icon: 🗺
    title: Feature Audit
    details: Compare one feature at a stable branch revision with its documented roadmap and expose gaps, legacy paths, bugs, and blockers.
    link: /guide/feature-audit
    linkText: Use the workflow
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
    details: Put behavior in the right lifecycle, design safe error contracts, ship immutable releases, operate from live evidence, and scale safely.
    link: /reference/features-performance/
    linkText: Read the skill
---

<div class="home-content">

## Route work to the right skill

Use Professional Engineering to coordinate implementation and Git Publication after verification. Code Audit reviews repository quality; Feature Audit measures one branch-specific feature against its roadmap.

<div class="route-grid">
  <a class="route-card" href="./reference/git-publication/">
    <strong>Publication</strong>
    <span>Staging scope, secret scanning, commits, pushes, PRs, changelogs, CI, releases, and GitHub Pages.</span>
  </a>
  <a class="route-card" href="./reference/professional-engineering/">
    <strong>Implementation</strong>
    <span>Project inspection, idiomatic syntax, safe syntactic sugar, focused changes, tests, and verification.</span>
  </a>
  <a class="route-card" href="./guide/feature-audit">
    <strong>Roadmap status</strong>
    <span>Target revision, roadmap gate, traceability, implementation gaps, legacy paths, bugs, and blockers.</span>
  </a>
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
    <span>Request lifecycle, error contracts, APIs, queues, caching, observability, bottlenecks, reliability, and scale.</span>
  </a>
</div>

## One coherent engineering model

The skills share the same defaults: inspect the actual repository, preserve explicit contracts, prefer the least complex safe design, keep policy separate from volatile infrastructure, and verify outcomes with tests or measurements. Their scopes overlap at intentional handoff points—not through contradictory ownership.

::: tip A practical sequence
For a large change, use Professional Engineering to coordinate the work: decide the system boundary first, design the collaborating objects second, then choose the NestJS runtime features and verification that implement it.
:::

<div class="install-strip">
  <div>
    <h2>Install all seven</h2>
    <p>The open Agent Skills format works with Claude Code and Codex.</p>
  </div>

```bash
npx skills add amirtaherkhani/nestjs-skills
```
</div>

</div>
