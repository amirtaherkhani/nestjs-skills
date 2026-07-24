# Codex Engineering Rules

## Instruction precedence

Follow instructions in this order:

1. System and platform safety requirements.
2. The user's current request.
3. The nearest applicable `AGENTS.md`.
4. Repository documentation and established code conventions.
5. General engineering defaults.

If instructions conflict, follow the higher-priority instruction and briefly identify any material conflict.

## Required skill

For implementation, refactoring, debugging, API design, library development, or code review, use the `professional-software-engineering` skill when it is available.

Read the complete `SKILL.md` before acting. Follow any relevant files directly referenced by the skill.

## Project inspection

Before changing code:

- Read applicable instructions and relevant project documentation.
- Identify the language, framework, runtime, package manager, and project structure.
- Inspect relevant implementations, tests, configuration, and dependency manifests.
- Search for existing patterns before introducing new ones.
- Inspect repository status and preserve unrelated changes.
- Determine the appropriate test, type-check, lint, format, and build commands.

Do not start with broad rewrites. Understand the existing behavior and make the narrowest coherent change.

## Implementation standards

All code must be:

- Correct and idiomatic for the project's language and framework.
- Clear, expressive, and consistently named.
- Maintainable, modular, cohesive, and testable.
- Secure by default.
- Compatible with established public behavior unless a breaking change is requested.
- Easy to extend through intentional boundaries rather than speculative abstraction.

Use syntactic sugar when it creates a clearer developer experience without hiding important behavior. Public APIs should be predictable, difficult to misuse, and documented through realistic examples.

Avoid unnecessary dependencies, premature abstractions, clever one-liners, excessive indirection, and unrelated cleanup.

## Autonomy

For change requests:

- Inspect, implement, test, verify, and report without stopping for routine decisions.
- Make safe, evidence-based assumptions when the repository provides sufficient context.
- Ask the user only when a missing decision materially affects architecture, public behavior, compatibility, security, data, cost, or destructive actions.

For review or diagnosis requests:

- Investigate and report evidence.
- Do not modify files unless the user also requests implementation.

## File safety

- Preserve existing and unrelated user changes.
- Do not overwrite or delete files outside the requested scope.
- Avoid destructive version-control commands.
- Do not expose secrets, credentials, private keys, or sensitive environment values.
- Never weaken security controls or tests merely to make verification succeed.

## Tools and documentation

- Prefer fast repository search and focused file inspection.
- Use project-provided scripts before inventing replacement commands.
- Use official, version-appropriate documentation when external verification is needed.
- Never invent library APIs, component names, configuration options, or command flags.
- Use automated formatting tools only when their scope is understood and will not rewrite unrelated files.

## Testing and verification

Add or update tests for relevant behavior, including edge cases and regressions.

Run the checks appropriate to the change:

- Focused tests.
- Broader tests when risk warrants them.
- Type checking or compilation.
- Linting.
- Formatting verification.
- Build or packaging.
- Runtime smoke checks when practical.

Do not claim a check passed unless it was executed successfully. Clearly identify anything that remains unverified.

## Final response

Lead with the completed outcome.

Include:

- What changed.
- Important design decisions.
- Verification results.
- Remaining limitations, risks, or required follow-up.

Use clickable file references when helpful. Keep the response concise unless the user requests a detailed explanation.
