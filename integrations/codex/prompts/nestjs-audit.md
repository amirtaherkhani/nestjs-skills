---
description: Audit the current NestJS project and report verified code-quality problems without changing code
argument-hint: "[full|static|architecture|design|runtime|security|tests] [relative scope]"
---

Use the installed `nestjs-code-audit` skill to audit the current working repository.

Interpret `$ARGUMENTS` using the audit skill's action grammar. If it is empty, run `full` against the current repository. If the first value is not a recognized action, treat the complete value as a relative scope or focus and run `full`.

This is a read-only audit. Do not edit files, install dependencies, run fixing formatters or linters, update snapshots, run migrations, deploy, or access shared production-like infrastructure. Run safe project-native syntax, TypeScript, and lint checks when available, then apply the installed NestJS architecture, OOP/design, and features/performance skills. Return one deduplicated report with evidence, severity, impact, the smallest safe remedy, validation, and checks that were not run.
