# Project Profile Before Scaffolding

Use the smallest profile that resolves the actual implementation decisions:

| Evidence to inspect | Decision to record |
| --- | --- |
| Repository/client instructions and existing feature paths | Which conventions apply to this change? Preserve existing instructions. |
| Installed Nest, CLI, schematics, Node, TypeScript, adapter and compiler configuration | Which syntax, runtime tokens and generator options are supported? |
| Capability owners and current consumers | Who owns writes/invariants; which exports and contracts are needed? |
| Established DTO/error/token/persistence/test style | Copy a healthy local precedent rather than imposing new layers. |
| Required checks and intended generated changes | List additions, import edits, collisions and repeat-run behavior before scaffolding. |

For this collection's inventory example, domain code has no framework or ORM imports, a custom pipe validates unknown input, and internal commands use erased interfaces. Its architecture test reads imports using TypeScript's parser and catches a deliberate domain-to-Nest import. Another small CRUD project may intentionally permit a service to use its ORM directly. The first profile is not a universal architecture rule.

## Resolve conflicts before mutation

An instruction to inject an interface as a runtime token conflicts with TypeScript erasure. Explain that concrete classes, abstract-class values, exported Symbols or supported strings provide runtime keys. A naming rule cannot create a runtime value. The compile-only control in the [four-axis examples](https://github.com/amirtaherkhani/nestjs-skills/tree/main/examples/four-axis) demonstrates this distinction; runtime wiring controls separately reject a private provider and a distinct Symbol.

Preserve valid local conventions. Correct only the incompatible part of a rule, with the exact framework/version evidence and the smallest feasible alternative. A supported direct-service/ORM design should not acquire mandatory repository, CQRS or domain folders.

## Select scaffolding only for a repeated need

Inspect the installed CLI and schematic schema before choosing options; rolling documentation can describe a newer major version. Compare existing CLI project/configuration options, a short recipe and a narrow custom collection against one repeated real scaffold. Use a supported dry run to inspect collisions and import changes when implementation is authorized.

The separate generator feasibility task remains a decision: identify the target project, version matrix, repeated output, options/defaults, ownership/token/DTO/registration map, collision safety and compile/container/behavior acceptance checks. Choosing no custom generator can be the correct result. These examples do not implement or publish a collection.

Written evaluation scenarios, deterministic fixture checks and actual agent runs are separate evidence. Passing the fixture does not prove an agent follows project instructions. See [implementation-verification.md](implementation-verification.md) and [syntax-and-idioms.md](syntax-and-idioms.md).
