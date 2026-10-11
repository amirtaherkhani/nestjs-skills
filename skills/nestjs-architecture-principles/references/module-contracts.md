# Module Contracts and Consumer Proof

Record the capability before choosing folders or tokens:

| Question | Library and school example |
| --- | --- |
| Owner and writes | Auth validates sessions; Library owns loans; School owns enrollment and capacity |
| Consumers | LibraryModule and SchoolModule explicitly import AuthModule |
| Public promise | Verify a credential or fail; return only an immutable id/school principal |
| Hidden state | Session records and credential details remain inside Auth |
| Consumer policy | A valid identity still needs library or school access; school capacity belongs to School |
| Duplicate/failure effects | Duplicate enrollment is idempotent; denied/full enrollment leaves state unchanged |
| Composition | One exported Symbol aliases VerifySession; private SessionStore is not a module export |

The [four-axis fixture](https://github.com/amirtaherkhani/nestjs-skills/tree/main/examples/four-axis) proves this record with two actual consuming feature modules. Its fixed session map is a teaching adapter, not production authentication. The existing wallet example remains a healthy smaller design; neither requires a repository wrapper for every model.

## Prove the right boundary

- Unit checks prove policy with controlled collaborators.
- A real Nest container proves constructor injection and imports/exports. A global lookup alone does not prove that a consuming module can inject a provider.
- A shared behavioral suite proves each adapter's stated inputs, outputs, absence/error categories and effects. The inventory suite rejects a type-compatible adapter that returns mutable storage aliases.
- HTTP checks prove the chosen transport's parsing, status and response projection. They do not prove another transport.
- Network consumer/provider contracts become useful when independently deployed consumers evolve at different times; they are optional for ordinary local modules.

Keep a healthy case beside the deliberate failure. Here, the shared token resolves; a newly created same-description Symbol does not. A public verification operation resolves; injection of the private session store from another module fails.

## Business interactions and dependency graphs

Separate business interactions, TypeScript imports, Nest module imports and provider dependencies. A port changes source coupling only when its ownership and binding change the actual edges. It does not automatically remove A → B → A module imports.

If identity disabling must revoke sessions, a real account-lifecycle workflow can depend on both owners instead of adding a reverse identity-to-auth import. Specify atomicity or durable reconciliation before replacing a synchronous operation with events. A successful boot with forward references is not proof of an acyclic graph.

See [module-boundaries.md](module-boundaries.md), [dependency-injection.md](dependency-injection.md) and [architecture-review.md](architecture-review.md). Preserve simple cohesive CRUD and the project's supported conventions.
