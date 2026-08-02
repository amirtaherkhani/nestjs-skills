---
description: Audit one NestJS feature against its documented roadmap on main or a named branch
argument-hint: FEATURE_NAME [on branch BRANCH_NAME]
---

Use the installed `nestjs-feature-audit` skill.

Interpret `$ARGUMENTS` as the required feature name plus an optional `on branch <branch>` suffix. Default to `main` only when no branch is provided. Preserve the skill's safe branch-preparation rules, hard roadmap gate, read-only comparison boundary, and exact four-category report contract.
