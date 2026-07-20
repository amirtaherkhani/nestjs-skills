# Research Sources

Reviewed on 2026-07-20. These skills are an original synthesis; source projects were used to study structure, coverage, trade-offs, and failure modes rather than copied verbatim.

## Authoring standards and agent compatibility

- [Agent Skills specification](https://agentskills.io/specification)
- [Claude Code: Extend Claude with skills](https://code.claude.com/docs/en/skills)
- [Codex: Build skills](https://developers.openai.com/codex/skills)
- [`skills` CLI repository](https://github.com/vercel-labs/skills)
- [`skills` npm package](https://www.npmjs.com/package/skills)
- [psenger/ai-agent-skills](https://github.com/psenger/ai-agent-skills)

Key decisions taken from this research:

- Keep `SKILL.md` focused and move deep material into one-level `references/` files.
- Put both the capability and trigger conditions in the frontmatter description.
- Use the portable open-standard fields only in the distributable skills.
- Provide evaluation prompts and deterministic repository validation.
- Prefer three focused skills over one always-loaded NestJS encyclopedia.

## Official NestJS and Node.js sources

- [NestJS documentation](https://docs.nestjs.com)
- [Modules](https://docs.nestjs.com/modules)
- [Providers](https://docs.nestjs.com/providers)
- [Custom providers](https://docs.nestjs.com/fundamentals/custom-providers)
- [Dynamic modules](https://docs.nestjs.com/fundamentals/dynamic-modules)
- [Injection scopes](https://docs.nestjs.com/fundamentals/injection-scopes)
- [Circular dependencies](https://docs.nestjs.com/fundamentals/circular-dependency)
- [Request lifecycle](https://docs.nestjs.com/faq/request-lifecycle)
- [Lifecycle events](https://docs.nestjs.com/fundamentals/lifecycle-events)
- [Testing](https://docs.nestjs.com/fundamentals/testing)
- [Caching](https://docs.nestjs.com/techniques/caching)
- [Queues](https://docs.nestjs.com/techniques/queues)
- [Performance with Fastify](https://docs.nestjs.com/techniques/performance)
- [Microservices](https://docs.nestjs.com/microservices/basics)
- [Health checks](https://docs.nestjs.com/recipes/terminus)
- [Node.js: Do not block the event loop](https://nodejs.org/en/learn/asynchronous-work/dont-block-the-event-loop)
- [Node.js worker threads](https://nodejs.org/api/worker_threads.html)

Official documentation is authoritative for framework behavior. Version-sensitive commands and APIs must still be checked against the target repository.

## Requested NestJS and software-design references

- [myatminlu/vector-skills](https://github.com/myatminlu/vector-skills)
- [xirothedev/skills](https://github.com/xirothedev/skills)
- [ramziddin/solid-skills](https://github.com/ramziddin/solid-skills)
- [nestjs/awesome-nestjs](https://github.com/nestjs/awesome-nestjs)
- [awesome-nestjs README](https://github.com/nestjs/awesome-nestjs/blob/master/README.md)
- [Clean Architecture registry path](https://github.com/majiayu000/claude-skill-registry/tree/main/skills/other/clean-architecture)
- [Awesome Skills listing for xirothedev/skills](https://www.awesomeskills.dev/en/skill/xirothedev-skills)
- [EliteAI SOLID listing](https://eliteai.tools/agent-skills/solid)
- [EliteAI Clean Architecture listing](https://eliteai.tools/agent-skills/clean-architecture-18)
- [NestJS AI npm organization](https://www.npmjs.com/org/nestjs-ai)

The requested Clean Architecture path is no longer present on the current registry branch. Its repository history and the linked directory mirror were reviewed instead. npm web pages rejected automated access, so current package metadata was verified through the public npm registry CLI.

`awesome-nestjs`, directory sites, and `@nestjs-ai/*` packages are discovery sources, not authorities for core NestJS behavior. An agent should not introduce a community dependency only because it appears in one of these catalogs.

## Requested community discussions

- [NestJS architecture skill discussion](https://www.reddit.com/r/nestjs/comments/1t0nl2r/stop_arguing_with_ai_about_nestjs_architecture_i/)
- [SOLID and clean-code skill discussion](https://www.reddit.com/r/nestjs/comments/1qk1wkn/made_an_agent_skill_to_enforce_solidclean_code/)
- [Principal-architect skill discussion](https://www.reddit.com/r/claudeskills/comments/1uvtiyl/how_i_built_an_opensource_skill_that_forces_ai/)
- [Agent skill repository ranking discussion](https://www.reddit.com/r/AIAgentsInAction/comments/1u7fu10/top_10_claude_agent_skill_repos_on_github_ranked/)

Community feedback directly influenced two safeguards:

- Avoid context-heavy, always-loaded instructions; route agents to focused references on demand.
- Treat architecture work as evidence-based decision-making with explicit constraints and trade-offs, not a generic request to "act senior."
