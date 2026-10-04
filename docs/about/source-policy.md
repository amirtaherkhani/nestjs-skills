---
title: Source Policy
description: How the NestJS Skills documentation stays authoritative, current, and original.
---

<p class="doc-kicker">Project · Research</p>

# Source policy

<p class="doc-lede">The collection is an original synthesis of official documentation, open Agent Skills conventions, community repositories, and practitioner discussions.</p>

## Authority order

1. The installed repository versions and actual runtime behavior.
2. Official NestJS, Node.js, Claude Code, Codex, and Agent Skills documentation.
3. Primary package documentation for third-party libraries.
4. Community repositories and discussions as discovery or experience reports.

Version-sensitive APIs and commands must be checked against the target repository. A community catalog is not authority for framework behavior, package compatibility, security, or maintenance status.

## Documentation generation

The complete skill-reference pages are generated from `skills/*/SKILL.md` and their `references/` directories during every documentation build. The website therefore presents the same instructions distributed to Claude Code and Codex.

Hand-authored concept pages explain how Professional Engineering coordinates implementation, how Git Publication handles verified changes, how the three NestJS domain skills work together, and how Code Audit coordinates a read-only review. [Choose a skill](/guide/choose-a-skill) records primary ownership and handoff rules, while the [ten-topic rules reference](/rules/) routes each public category to one canonical domain-skill reference.

## Research log

The repository's [complete source log](https://github.com/amirtaherkhani/nestjs-skills/blob/main/SOURCES.md) includes official NestJS and Node.js references, authoring specifications, requested skill repositories, and community discussions reviewed for the project.

Source projects were studied for structure, coverage, trade-offs, and failure modes. Their prose was not copied into these skills.
