# Research Sources

Reviewed on 2026-07-24. These skills are an original synthesis; source projects were used to study structure, coverage, trade-offs, and failure modes rather than copied verbatim.

## Authoring standards and agent compatibility

- [Agent Skills specification](https://agentskills.io/specification)
- [Agent Skills authoring best practices](https://agentskills.io/skill-creation/best-practices)
- [Agent Skills client implementation guide](https://agentskills.io/client-implementation/adding-skills-support)
- [Codex: Build skills](https://developers.openai.com/codex/skills)
- [Codex: Custom prompts (deprecated)](https://developers.openai.com/codex/custom-prompts)
- [Claude Code: Extend Claude with skills](https://code.claude.com/docs/en/skills)
- [`skills` CLI repository](https://github.com/vercel-labs/skills)
- [`skills` npm package](https://www.npmjs.com/package/skills)
- [psenger/ai-agent-skills: Git Commit & PR Message](https://github.com/psenger/ai-agent-skills/tree/main/skills/git-commit-pr-message)
- [psenger/ai-agent-skills](https://github.com/psenger/ai-agent-skills)
- [Kadajett/agent-nestjs-skills](https://github.com/Kadajett/agent-nestjs-skills)
- [Kadajett NestJS Rules Reference](https://kadajett.github.io/agent-nestjs-skills/concepts/interceptors)

Key decisions taken from this research:

- Keep `SKILL.md` focused and move deep material into one-level `references/` files.
- Put both the capability and trigger conditions in the frontmatter description.
- Use the portable open-standard fields only in the distributable skills.
- Provide evaluation prompts and deterministic repository validation.
- Prefer three focused domain skills plus one read-only audit orchestrator over one always-loaded NestJS encyclopedia.
- Keep the documentation navigable by concept while preserving the distributable skills as the canonical source.
- Use Kadajett's ten-section rules taxonomy as a navigation and coverage check, while validating every technical rule independently and assigning one primary owner across the three domain skills.
- Treat cross-skill coordination as a pre-execution gate: discovery metadata signals the guard, activated skills declare decision ownership and prerequisites, and unresolved material conflicts block mutation while read-only diagnosis continues.
- Ship the NestJS audit as the portable primary skill. Keep `/prompts:nestjs-audit` only as an optional deprecated Codex CLI alias because Codex recommends skills for reusable workflows and does not expose arbitrary bare custom slash-command names.
- Ship Professional Software Engineering as one portable skill for Claude Code and Codex, with optional `CLAUDE.md` and `AGENTS.md` repository templates. Select syntax from repository conventions, installed versions, official documentation, and focused verification; treat syntactic sugar as an API-design decision rather than a line-count optimization.
- Adapt the linked Git Commit & PR Message workflow into a smaller cross-client skill: retain intentional staging, sensitive-content review, Conventional Commit compatibility, ticket/PR/changelog guidance, and explicit remote authorization; add NestJS verification ownership and GitHub Pages trigger/result checks. Production Pages remains tied to reviewed `main` history rather than feature-branch pushes.

## Official NestJS and Node.js sources

- [NestJS documentation](https://docs.nestjs.com)
- [Modules](https://docs.nestjs.com/modules)
- [Providers](https://docs.nestjs.com/providers)
- [Custom providers](https://docs.nestjs.com/fundamentals/custom-providers)
- [Dynamic modules](https://docs.nestjs.com/fundamentals/dynamic-modules)
- [Injection scopes](https://docs.nestjs.com/fundamentals/injection-scopes)
- [Lazy-loading modules](https://docs.nestjs.com/fundamentals/lazy-loading-modules)
- [Circular dependencies](https://docs.nestjs.com/fundamentals/circular-dependency)
- [Request lifecycle](https://docs.nestjs.com/faq/request-lifecycle)
- [Guards](https://docs.nestjs.com/guards)
- [Interceptors](https://docs.nestjs.com/interceptors)
- [Exception filters](https://docs.nestjs.com/exception-filters)
- [Validation](https://docs.nestjs.com/techniques/validation)
- [Serialization](https://docs.nestjs.com/techniques/serialization)
- [API versioning](https://docs.nestjs.com/techniques/versioning)
- [Authentication](https://docs.nestjs.com/security/authentication)
- [Authorization](https://docs.nestjs.com/security/authorization)
- [Rate limiting](https://docs.nestjs.com/security/rate-limiting)
- [Configuration](https://docs.nestjs.com/techniques/configuration)
- [Logger](https://docs.nestjs.com/techniques/logger)
- [Lifecycle events](https://docs.nestjs.com/fundamentals/lifecycle-events)
- [Events](https://docs.nestjs.com/techniques/events)
- [CQRS](https://docs.nestjs.com/recipes/cqrs)
- [Testing](https://docs.nestjs.com/fundamentals/testing)
- [Caching](https://docs.nestjs.com/techniques/caching)
- [Queues](https://docs.nestjs.com/techniques/queues)
- [Performance with Fastify](https://docs.nestjs.com/techniques/performance)
- [Microservices](https://docs.nestjs.com/microservices/basics)
- [Health checks](https://docs.nestjs.com/recipes/terminus)
- [Deployment](https://docs.nestjs.com/deployment)
- [Node.js: Do not block the event loop](https://nodejs.org/en/learn/asynchronous-work/dont-block-the-event-loop)
- [Node.js worker threads](https://nodejs.org/api/worker_threads.html)

Official documentation is authoritative for framework behavior. Version-sensitive commands and APIs must still be checked against the target repository.

## Error contracts, transports, and failure behavior

- [NestJS exception filters](https://docs.nestjs.com/exception-filters)
- [NestJS request lifecycle](https://docs.nestjs.com/faq/request-lifecycle)
- [NestJS execution context](https://docs.nestjs.com/fundamentals/execution-context)
- [NestJS microservice exception filters](https://docs.nestjs.com/microservices/exception-filters)
- [NestJS WebSocket exception filters](https://docs.nestjs.com/websockets/exception-filters)
- [Node.js errors](https://nodejs.org/api/errors.html)
- [Node.js process events](https://nodejs.org/api/process.html)
- [Node.js `AbortSignal`](https://nodejs.org/api/globals.html#class-abortsignal)
- [RFC 9457: Problem Details for HTTP APIs](https://www.rfc-editor.org/rfc/rfc9457.html)
- [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html)
- [GraphQL specification: Errors](https://spec.graphql.org/September2025/#sec-Errors)
- [gRPC error handling](https://grpc.io/docs/guides/error/)
- [gRPC status codes](https://grpc.io/docs/guides/status-codes/)
- [RxJS `timeout`](https://rxjs.dev/api/operators/timeout)
- [OpenTelemetry exception conventions](https://opentelemetry.io/docs/specs/semconv/exceptions/)
- [OWASP Error Handling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html)
- [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)

The error-handling rules separate stable application meaning from protocol representation. HTTP status codes, GraphQL errors, gRPC status, WebSocket events, and worker acknowledgement/retry semantics are mapped independently. Filters own final transport mapping; application policy owns business failures; architecture owns transactions and partial effects; security owns disclosure; operational observability retains one primary logging owner.

## Security and persistence sources

- [OWASP REST Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html)
- [OWASP Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)
- [TypeORM migrations](https://typeorm.io/docs/advanced-topics/migrations/)
- [TypeORM transactions](https://typeorm.io/docs/advanced-topics/transactions/)
- [Prisma Migrate](https://www.prisma.io/docs/orm/prisma-migrate)
- [Prisma transactions](https://www.prisma.io/docs/orm/prisma-client/queries/transactions)

The security rules use OWASP as a framework-neutral baseline and NestJS documentation for integration points. ORM guidance remains tool-neutral; agents must verify migration, transaction, and isolation APIs against the driver and version installed in the target repository.

## DevOps, containers, Kubernetes, and SRE sources

- [Docker build best practices](https://docs.docker.com/build/building/best-practices/)
- [Docker multi-stage builds](https://docs.docker.com/build/building/multi-stage/)
- [Docker build secrets](https://docs.docker.com/build/building/secrets/)
- [GitHub Actions secure use](https://docs.github.com/en/actions/reference/security/secure-use)
- [GitHub Actions deployments](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments)
- [GitHub artifact attestations](https://docs.github.com/en/actions/how-tos/secure-your-work/use-artifact-attestations/use-artifact-attestations)
- [Kubernetes probes](https://kubernetes.io/docs/concepts/workloads/pods/probes/)
- [Kubernetes Pod lifecycle and termination](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/)
- [Kubernetes Deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)
- [Kubernetes resource management](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/)
- [Kubernetes horizontal autoscaling](https://kubernetes.io/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/)
- [Kubernetes disruption budgets](https://kubernetes.io/docs/tasks/run-application/configure-pdb/)
- [Kubernetes Secrets](https://kubernetes.io/docs/concepts/configuration/secret/)
- [OpenTelemetry concepts](https://opentelemetry.io/docs/concepts/)
- [OpenTelemetry context propagation](https://opentelemetry.io/docs/concepts/context-propagation/)
- [OpenTelemetry metrics and cardinality](https://opentelemetry.io/docs/concepts/signals/metrics/)
- [Google SRE Workbook: Monitoring](https://sre.google/workbook/monitoring/)
- [Google SRE Workbook: Incident response](https://sre.google/workbook/incident-response/)

DevOps guidance is provider-neutral at its core. Docker, GitHub Actions, Kubernetes, and OpenTelemetry are loaded only when present or requested. Manifests and pipeline files describe intent; agents must compare them with built artifact identity and observed runtime state before diagnosing or declaring a release healthy.

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
- [NestJS Design Patterns](https://dev.to/amirtaherkhani/nestjs-design-patterns-23fc)

The requested Clean Architecture path is no longer present on the current registry branch. Its repository history and the linked directory mirror were reviewed instead. npm web pages rejected automated access, so current package metadata was verified through the public npm registry CLI.

`awesome-nestjs`, directory sites, and `@nestjs-ai/*` packages are discovery sources, not authorities for core NestJS behavior. An agent should not introduce a community dependency only because it appears in one of these catalogs.

The requested NestJS Design Patterns article was validated as a discovery catalog rather than adopted as a checklist. Its module, dependency-injection, custom-provider, interceptor, and optional CQRS concepts align with official NestJS capabilities. The skills add safeguards where the article overstates or combines guarantees: repositories and CQRS are not universally required; a popularity score is not evidence; middleware does not know route metadata; interceptors should not hide core business policy; Nest metadata decorators differ from the GoF Decorator pattern; default provider scope differs from a hand-written Singleton; and in-process events or command objects do not automatically provide durable pub/sub, queuing, replay, or auditability.

Kadajett's rules inventory was reviewed topic by topic for this update. Its ten categories informed the public Rules Reference, but its impact labels and absolute wording were not copied as authority. The resulting rulebooks narrow context-dependent claims around repositories, events, `TestingModule`, HTTP exceptions, JWT, output sanitization, lazy loading, lifecycle hooks, queues, API versioning, and configuration.

## Requested community discussions

- [Alex Shev's feedback on Agent Skill conflict detection](https://dev.to/alexshev/comment/3bh3c)

- [NestJS architecture skill discussion](https://www.reddit.com/r/nestjs/comments/1t0nl2r/stop_arguing_with_ai_about_nestjs_architecture_i/)
- [SOLID and clean-code skill discussion](https://www.reddit.com/r/nestjs/comments/1qk1wkn/made_an_agent_skill_to_enforce_solidclean_code/)
- [Principal-architect skill discussion](https://www.reddit.com/r/claudeskills/comments/1uvtiyl/how_i_built_an_opensource_skill_that_forces_ai/)
- [Agent skill repository ranking discussion](https://www.reddit.com/r/AIAgentsInAction/comments/1u7fu10/top_10_claude_agent_skill_repos_on_github_ranked/)

Community feedback directly influenced two safeguards:

- Avoid context-heavy, always-loaded instructions; route agents to focused references on demand.
- Treat architecture work as evidence-based decision-making with explicit constraints and trade-offs, not a generic request to "act senior."
- Detect incompatible file ownership, commands, architecture rules, and prerequisites before execution; use one primary owner per disputed decision and stop for clarification when verified constraints do not resolve it.
