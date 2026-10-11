# Enhancer Responsibility and Execution

Choose one responsibility per component, then choose its binding reach and lifetime separately:

| Component | Focused responsibility | Inventory example |
| --- | --- | --- |
| Middleware | Transport setup or correlation | Records arrival before Nest enhancers |
| Guard | Whether this caller may proceed | Checks a fixture credential before reading the command |
| Pipe | Parse/transform/validate one boundary value | Rejects strings as quantities and unexpected fields |
| Interceptor | Wrap an operation for one cross-cutting outcome | Records entry, result or error without changing the command |
| Filter | Final transport mapping for an uncaught failure | Maps stock failure to safe 409 and unknown failure to safe 500 |
| Application operation | Coordinate the capability | Requests an inventory reservation |
| Domain object | Preserve its invariant for every caller | Rejects nonpositive or excessive stock reservations |

Global binding describes reach. Provider scope describes lifetime. Module imports/exports describe visibility. A global authentication guard still has one responsibility; a route-bound class can still mix unrelated responsibilities. Neither global binding nor provider count establishes a design defect or performance cost. Do not store a request's principal in singleton mutable fields.

## Order is a control-flow contract

For the fixture's single body argument and HTTP registration, successful execution is:

1. Middleware; global, controller, then route guards.
2. Global, controller, then route interceptor entry.
3. Global, controller, route, then parameter pipes; controller/application operation.
4. Route, controller, then global interceptor response handling.

A denied guard stops before interceptors and pipes. A pipe/application failure can unwind interceptor error handling before the selected filter maps the uncaught error. A consuming route filter prevents a later global filter from handling that same exception. Multiple parameters have their own pipe ordering; interceptors that recover or short-circuit also alter the path. Test the exact composition instead of applying this list unconditionally.

The [runtime fixture](https://github.com/amirtaherkhani/nestjs-skills/blob/main/examples/four-axis/runtime.ts) and its HTTP tests record these paths. They also prove that APP_FILTER registration and useGlobalFilters(app.get(GlobalFilter)) both preserve a singleton's injected collaborator. A missing constructor dependency fails startup. This does not establish request-scoped bootstrap resolution, Fastify parity or hybrid/gateway coverage.

The trace array is a sequential test recorder, not a production request-context design. Existing provider-lifetime tests separately prove manual Nest-context isolation. Follow [api-design.md](api-design.md), [security.md](security.md), [exception-filters-transports.md](exception-filters-transports.md) and [testing.md](testing.md) for the underlying contracts.
