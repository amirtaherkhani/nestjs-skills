# Contributing

Contributions should make an agent more correct, more decisive, or more efficient on real NestJS work.

## Change a skill

1. Identify the smallest affected skill and reference file.
2. Verify framework semantics in the current official NestJS documentation.
3. Preserve existing repository conventions unless they violate correctness, security, or an explicit contract.
4. Add or update an evaluation case that would fail without the change.
5. Run `npm test` and `npx skills add . --list`.

Changes to the code-audit collector must also run `npm run test:audit` and prove that scoped paths cannot escape the target repository.

## Rule format

Prefer rules that state:

- the signal or problem;
- the recommended action;
- the trade-off or boundary;
- a compact NestJS/TypeScript example when useful;
- verification steps.

Avoid universal mandates that lack a correctness basis. Examples of weak rules include fixed class line counts, mandatory value objects for every primitive, microservices by default, and changing HTTP adapters without a benchmark.

## Source policy

- Official NestJS, Node.js, TypeScript, database, broker, and library documentation is authoritative for technical behavior.
- Community projects are useful for discovering patterns and operational lessons.
- Do not copy substantial source text or examples. Write original guidance and retain links in `SOURCES.md` or the relevant reference file.
- Do not freeze volatile versions in a skill unless the rule explicitly explains how to refresh them.

## Skill constraints

- Directory name and frontmatter `name` must match.
- Names use lowercase letters, numbers, and single hyphens, with a maximum of 64 characters.
- Descriptions explain what the skill does and when it should trigger, with a maximum of 1024 characters.
- Keep each `SKILL.md` below 500 lines and preferably below 5,000 tokens.
- Keep supporting references one link away from `SKILL.md`.
- Keep the pre-execution conflict guard in every skill description and body.
- Declare prerequisites, primary ownership, handoffs to the other NestJS skills, and concrete conflict tests before adding mutating instructions.
- Add an evaluation case when a change creates or alters a cross-skill ownership boundary.

## Executable examples and agent evaluations

Keep every installed skill self-contained. Sibling names describe optional ownership handoffs, never a mandatory file outside the skill package. Keep essential authorization, version, read-only audit, roadmap, and publication guards in the entrypoint; load detailed guidance only when relevant.

See [examples](examples/README.md) for authored before/after NestJS applications and [evaluation](evals/README.md) for the opt-in fresh-context pilot. Add deterministic regression checks before changing runner or fixture behavior. Keep answer keys outside submitted agent workspaces, preserve raw run evidence locally, and review model responses and diffs manually before reporting behavior scores. Prompt cases are not completed evaluations. Never infer token savings from word counts or put model calls in ordinary CI.

An audit-only prompt must expect no edits. An explicit audit-and-fix prompt may authorize a separate implementation phase in the same request; do not write an evaluation that demands redundant approval for that already authorized scope.
