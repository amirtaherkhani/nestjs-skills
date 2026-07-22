# Contributing

Contributions should make an agent more correct, more decisive, or more efficient on real NestJS work.

## Change a skill

1. Identify the smallest affected skill and reference file.
2. Verify framework semantics in the current official NestJS documentation.
3. Preserve existing repository conventions unless they violate correctness, security, or an explicit contract.
4. Add or update an evaluation case that would fail without the change.
5. Run `npm run validate` and `npx skills add . --list`.

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
