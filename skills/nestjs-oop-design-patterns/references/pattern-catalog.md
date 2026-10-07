# Pattern selection catalog

Start from a force or failure mode. Use the smallest pattern that makes the variation, boundary, or reliability property explicit.

## Read catalogs correctly

Broad NestJS pattern lists often combine several different design levels:

- modular and hexagonal architecture shape system boundaries;
- controller-service-repository describes a possible layered request flow;
- dependency injection is a construction and inversion mechanism;
- middleware, guards, pipes, interceptors, and filters are framework lifecycle mechanisms;
- default provider scope is a container lifetime, not a reason to implement a static GoF Singleton;
- Strategy, Factory, Builder, Adapter, Bridge, Decorator, Proxy, Template Method, and Chain of Responsibility are object collaboration patterns;
- CQRS, repositories, events, outbox, and sagas address application, persistence, or distributed-system forces.

The categories can cooperate, but they are not interchangeable. Do not install patterns from a popularity chart, apply all patterns in a category, or infer runtime scalability from a class diagram. Select from repository evidence and verify the resulting behavior.

## Running the examples

Each TypeScript block is a separate module with its own imports and Nest wiring. In this repository, `npm run test:patterns` extracts the blocks, compiles them with strict TypeScript, and runs their behavioral contracts. The [runnable example guide](https://github.com/amirtaherkhani/nestjs-skills/blob/main/examples/design-patterns/README.md) explains the tested versions and adapter limits.

The `ExampleModule` classes are alternative teaching modules; choose the one relevant to your feature. Their repeated names do not belong together in a single source file. Plain value objects and builders use ordinary constructors. Nest manages services and effectful collaborators. Interfaces disappear at runtime, so those dependencies use explicit tokens or abstract classes.

## Strategy

Use Strategy when one stable operation has several real algorithms. Here, standard and priority delivery have different prices in cents. `QuoteDelivery` validates input and selects the policy; each policy only calculates its own rate.

<!-- runnable: strategy -->

```typescript
import { Injectable, Module } from '@nestjs/common';

export interface DeliveryRate { quote(grams: number): number }

@Injectable()
export class StandardRate implements DeliveryRate {
  quote(grams: number) { return 300 + Math.ceil(grams / 1000) * 100; }
}

@Injectable()
export class PriorityRate implements DeliveryRate {
  quote(grams: number) { return 700 + Math.ceil(grams / 1000) * 150; }
}

@Injectable()
export class QuoteDelivery {
  private readonly rates: Map<string, DeliveryRate>;
  constructor(standard: StandardRate, priority: PriorityRate) {
    this.rates = new Map([['standard', standard], ['priority', priority]]);
  }
  quote(mode: string, grams: number): number {
    if (!Number.isSafeInteger(grams) || grams <= 0) throw new Error('Invalid weight');
    const rate = this.rates.get(mode);
    if (!rate) throw new Error('Unknown delivery mode');
    return rate.quote(grams);
  }
}

@Module({ providers: [StandardRate, PriorityRate, QuoteDelivery], exports: [QuoteDelivery] })
export class ExampleModule {}
```

Import `ExampleModule` and inject `QuoteDelivery` to call `quote('priority', 1500)`. A real pricing model also needs explicit units, range limits, and rounding rules. With one algorithm and no accepted variation, a direct function is enough. Test every policy at weight boundaries, reject unknown modes, and apply the same input contract to both implementations.

## Factory

Use a factory when creation has a policy or several steps. A selector can also hide the choice among providers that Nest has already constructed. This example keeps the existing CSV/PDF choice, but the outputs are teaching strings: neither writer generates a valid CSV or PDF file.

<!-- runnable: factory -->

```typescript
import { Injectable, Module } from '@nestjs/common';

export interface PreviewWriter { render(rows: readonly string[]): string }

@Injectable()
export class CsvPreview implements PreviewWriter {
  render(rows: readonly string[]) { return `CSV teaching preview: ${rows.join('|')}`; }
}

@Injectable()
export class PdfPreview implements PreviewWriter {
  render(rows: readonly string[]) { return `PDF teaching preview: ${rows.join('|')}`; }
}

@Injectable()
export class ExporterFactory {
  constructor(
    private readonly csv: CsvPreview,
    private readonly pdf: PdfPreview,
  ) {}
  for(format: string): PreviewWriter {
    if (format === 'csv') return this.csv;
    if (format === 'pdf') return this.pdf;
    throw new Error('Unsupported export format');
  }
}

// GoF Factory Method: a subclass supplies the product used by a base workflow.
export abstract class ExportJob {
  run(rows: readonly string[]) { return this.createWriter().render(rows); }
  protected abstract createWriter(): PreviewWriter;
}

@Injectable()
export class CsvExportJob extends ExportJob {
  protected createWriter(): PreviewWriter { return new CsvPreview(); }
}

@Module({
  providers: [CsvPreview, PdfPreview, ExporterFactory, CsvExportJob],
  exports: [ExporterFactory, CsvExportJob],
})
export class ExampleModule {}
```

`ExporterFactory.for()` is a provider selector, often called a simple factory. It returns container-owned instances. GoF Factory Method specifically uses an overridable creation method, as `ExportJob` does. The preview writer has no injected dependencies, which makes `new CsvPreview()` safe in this teaching example; real clients and pools should remain container-managed.

Nest's `useFactory` is a container construction hook. Use it for validated configuration and dependency-aware setup, keeping ordinary business work out of bootstrap. Test that selection preserves provider identity, rejects unsupported formats, and that the base job uses the subclass's writer. Do not add a factory to conceal one straightforward constructor.

## Builder

A builder fits a value with optional parts and a final validation step. This invoice search produces a typed criteria value; it does not interpolate SQL.

<!-- runnable: builder -->

```typescript
import { Injectable, Module } from '@nestjs/common';

type Status = 'paid' | 'pending';
export type InvoiceCriteria = Readonly<{
  tenant: string; statuses: readonly Status[]; limit: number;
}>;

export class InvoiceSearchBuilder {
  private statuses: Status[] = [];
  private limit = 20;
  constructor(private readonly tenant: string) {}
  withStatuses(...statuses: Status[]) { this.statuses = [...statuses]; return this; }
  take(limit: number) { this.limit = limit; return this; }
  build(): InvoiceCriteria {
    if (!this.tenant.trim()) throw new Error('Tenant is required');
    if (!Number.isInteger(this.limit) || this.limit < 1 || this.limit > 100) {
      throw new Error('Limit must be an integer from 1 to 100');
    }
    return Object.freeze({
      tenant: this.tenant, statuses: Object.freeze([...this.statuses]), limit: this.limit,
    });
  }
}

@Injectable()
export class SearchInvoices {
  criteria(tenant: string, statuses: Status[] = [], limit = 20) {
    return new InvoiceSearchBuilder(tenant).withStatuses(...statuses).take(limit).build();
  }
}

@Module({ providers: [SearchInvoices], exports: [SearchInvoices] })
export class ExampleModule {}
```

Inject `SearchInvoices`; create each builder inside the operation so mutable intermediate state cannot leak between requests. Validate untrusted status strings at the transport boundary before using this typed API. Test final validation, separate calls, and that changing the builder cannot mutate a previously built result. Prefer an object literal or the ORM's parameterized query builder when it already expresses the requirement clearly.

## Adapter

An adapter translates an external contract into the application's vocabulary. Here a vendor stock response becomes a nonnegative item count, including the valid value zero. Vendor errors become application-owned failures.

<!-- runnable: adapter -->

```typescript
import { Inject, Injectable, Module } from '@nestjs/common';

export const STOCK = Symbol('STOCK');
export interface Stock { available(sku: string): Promise<number> }
export abstract class VendorClient { abstract readSku(sku: string): Promise<unknown>; }
export class StockMissing extends Error {}
export class StockUnavailable extends Error {}

@Injectable()
export class StockAdapter implements Stock {
  constructor(@Inject(VendorClient) private readonly vendor: VendorClient) {}
  async available(sku: string): Promise<number> {
    let reply: unknown;
    try { reply = await this.vendor.readSku(sku); }
    catch (error) {
      if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'NOT_FOUND') {
        throw new StockMissing('Item missing');
      }
      throw new StockUnavailable('Stock lookup unavailable', { cause: error });
    }
    const count = typeof reply === 'object' && reply !== null && 'stock_quantity' in reply
      ? reply.stock_quantity : undefined;
    if (typeof count !== 'number' || !Number.isSafeInteger(count) || count < 0) {
      throw new StockUnavailable('Invalid stock response');
    }
    return count;
  }
}

@Module({ providers: [
  // Local teaching client; replace with an SDK client that enforces a timeout.
  { provide: VendorClient, useValue: { readSku: async () => ({ stock_quantity: 0 }) } },
  { provide: STOCK, useClass: StockAdapter },
], exports: [STOCK] })
export class ExampleModule {}
```

Consumers inject `@Inject(STOCK) stock: Stock`. Bind the real client at the module boundary and test its timeout and cancellation behavior separately. Keep vendor response types and status codes inside the adapter. Test zero stock, malformed data, vendor absence, and network errors. A preserved `cause` is for internal diagnostics; transport filters must expose only the public failure contract.

## Bridge

Bridge fits two independent variation axes. Receipt and overdue notices decide wording; email and SMS channels decide delivery. Four combinations need two notice classes and two channel classes, rather than a class for each combination.

<!-- runnable: bridge -->

```typescript
import { Injectable, Module } from '@nestjs/common';

export interface Channel { send(to: string, text: string): Promise<string> }
// Teaching transports return a string; they do not send email or SMS.
@Injectable()
export class EmailChannel implements Channel {
  async send(to: string, text: string) { return `email:${to}:${text}`; }
}
@Injectable()
export class SmsChannel implements Channel {
  async send(to: string, text: string) { return `sms:${to}:${text}`; }
}
abstract class Notice {
  constructor(private readonly channel: Channel) {}
  protected abstract text(reference: string): string;
  send(to: string, reference: string) { return this.channel.send(to, this.text(reference)); }
}
export class ReceiptNotice extends Notice {
  protected text(reference: string) { return `Receipt ${reference}`; }
}
export class OverdueNotice extends Notice {
  protected text(reference: string) { return `Overdue ${reference}`; }
}
export const RECEIPT_SMS = Symbol('RECEIPT_SMS');
export const OVERDUE_EMAIL = Symbol('OVERDUE_EMAIL');

@Module({ providers: [EmailChannel, SmsChannel,
  { provide: RECEIPT_SMS, useFactory: (c: SmsChannel) => new ReceiptNotice(c), inject: [SmsChannel] },
  { provide: OVERDUE_EMAIL, useFactory: (c: EmailChannel) => new OverdueNotice(c), inject: [EmailChannel] },
], exports: [RECEIPT_SMS, OVERDUE_EMAIL] })
export class ExampleModule {}
```

Inject a notice by its token. Test every supported notice/channel combination, then run contract tests for the real channel adapters. With only a vendor translation problem, Adapter is enough; with one varying algorithm, Strategy is enough. Bridge adds a second abstraction and earns that cost only when both axes change independently.

## Facade

A facade gives consumers one operation over a subsystem. `ShipmentTracking` reads shipment state and constructs a tracking link. Callers depend on that capability instead of coordinating the two collaborators themselves.

<!-- runnable: facade -->

```typescript
import { Injectable, Module } from '@nestjs/common';

@Injectable()
class ShipmentStore {
  async find(id: string) {
    return id === 's-1' ? { id, status: 'in-transit', trackingCode: 'TRK1' } : null;
  }
}
@Injectable()
class TrackingLinks {
  for(code: string) { return `https://carrier.example/track/${encodeURIComponent(code)}`; }
}
@Injectable()
export class ShipmentTracking {
  constructor(private readonly shipments: ShipmentStore, private readonly links: TrackingLinks) {}
  async track(id: string) {
    const shipment = await this.shipments.find(id);
    if (!shipment) throw new Error('Shipment missing');
    return { id: shipment.id, status: shipment.status, url: this.links.for(shipment.trackingCode) };
  }
}

@Module({ providers: [ShipmentStore, TrackingLinks, ShipmentTracking], exports: [ShipmentTracking] })
export class ExampleModule {}
```

The store is seeded teaching data, and `carrier.example` is a placeholder domain. Import the module and inject `ShipmentTracking`; Nest exports only the facade. Test the combined result and missing shipment behavior. A facade should stay focused on one capability. It does not make several writes transactional or justify an application-wide forwarding service.

## Layered controller-service-repository flow

This is an application structure, rather than a GoF object pattern. It helps when HTTP parsing, a use case, and persistence have different reasons to change. This small lookup keeps the application failure independent of HTTP while the controller maps it to a 404 response.

<!-- runnable: layered-flow -->

```typescript
import { Controller, Get, Injectable, Module, NotFoundException, Param, ParseIntPipe } from '@nestjs/common';

export class ItemMissing extends Error {}
@Injectable()
class ItemRepository {
  async find(id: number) { return id === 1 ? { id, label: 'Notebook' } : null; }
}
@Injectable()
export class FindItem {
  constructor(private readonly items: ItemRepository) {}
  async execute(id: number) {
    const item = await this.items.find(id);
    if (!item) throw new ItemMissing('Item missing');
    return item;
  }
}
@Controller('items')
class ItemsController {
  constructor(private readonly find: FindItem) {}
  @Get(':id')
  async get(@Param('id', ParseIntPipe) id: number) {
    try { return await this.find.execute(id); }
    catch (error) {
      if (error instanceof ItemMissing) throw new NotFoundException('Item missing');
      throw error;
    }
  }
}
@Module({ controllers: [ItemsController], providers: [ItemRepository, FindItem] })
export class ExampleModule {}
```

Import this module into the app to expose `GET /items/1`. An application with a shared error contract can move the repeated mapping to an exception filter. HTTP tests should exercise valid IDs, malformed IDs, and missing records; application tests should assert `ItemMissing` directly. The repository is a local lookup stub. Three classes are useful here to explain ownership, but a real CRUD endpoint does not automatically need all three layers or an ORM wrapper.

## Decorator

An object decorator wraps a stable contract to add behavior. This one records a quote lookup's outcome while preserving its result or original error. It works for background jobs as well as HTTP callers.

<!-- runnable: decorator -->

```typescript
import { Injectable, Module } from '@nestjs/common';

export interface Quotes { read(sku: string): Promise<number> }
export const QUOTES = Symbol('QUOTES');
const RAW_QUOTES = Symbol('RAW_QUOTES');
@Injectable()
export class Metrics {
  readonly outcomes: ('ok' | 'error')[] = [];
  record(outcome: 'ok' | 'error') { this.outcomes.push(outcome); }
}
export class MeasuredQuotes implements Quotes {
  constructor(private readonly inner: Quotes, private readonly metrics: Metrics) {}
  async read(sku: string) {
    let outcome: 'ok' | 'error' = 'error';
    try {
      const result = await this.inner.read(sku);
      outcome = 'ok';
      return result;
    } finally { this.metrics.record(outcome); }
  }
}
@Module({ providers: [Metrics,
  { provide: RAW_QUOTES, useValue: { read: async (sku: string) => sku === 'free' ? 0 : 42 } },
  { provide: QUOTES, useFactory: (raw: Quotes, metrics: Metrics) => new MeasuredQuotes(raw, metrics),
    inject: [RAW_QUOTES, Metrics] },
], exports: [QUOTES] })
export class ExampleModule {}
```

The two tokens keep the wrapper from injecting itself. `Metrics` is a local recorder for the example; a production metric exporter should bound label cardinality and contain its own errors so telemetry cannot replace the operation's result. Test success, zero values, and original error identity. Nest's `@Injectable()` and `@Module()` are metadata decorators; the GoF Decorator here is the `MeasuredQuotes` object. A retry decorator also needs an idempotent operation, a bounded retry budget, and a deadline.

## Proxy

A proxy controls access to another object through the same interface. Here it can answer a quote lookup without calling the source, using a bounded local cache. Results may be reused for one second after a source read completes; the source's own data age is unknown.

<!-- runnable: proxy -->

```typescript
import { Module } from '@nestjs/common';

export interface Quotes { read(sku: string): Promise<number> }
export const QUOTES = Symbol('QUOTES');
const RAW_QUOTES = Symbol('RAW_QUOTES');
const NOW = Symbol('NOW');
export class CachedQuotes implements Quotes {
  private readonly cache = new Map<string, { value: number; until: number }>();
  constructor(private readonly source: Quotes, private readonly now: () => number) {}
  async read(sku: string) {
    const hit = this.cache.get(sku);
    if (hit && this.now() < hit.until) return hit.value;
    const value = await this.source.read(sku);
    if (!this.cache.has(sku) && this.cache.size >= 100) {
      this.cache.delete(this.cache.keys().next().value!);
    }
    this.cache.set(sku, { value, until: this.now() + 1000 });
    return value;
  }
  invalidate(sku: string) { this.cache.delete(sku); }
}
@Module({ providers: [
  { provide: RAW_QUOTES, useValue: { read: async (sku: string) => sku === 'free' ? 0 : 42 } },
  { provide: NOW, useValue: Date.now },
  { provide: QUOTES, useFactory: (source: Quotes, now: () => number) => new CachedQuotes(source, now),
    inject: [RAW_QUOTES, NOW] },
], exports: [QUOTES] })
export class ExampleModule {}
```

Inject `QUOTES`; the factory supplies the source and clock. Tests control the clock to verify expiry without sleeps, preserve zero, check eviction and invalidation, and confirm failures are not cached. This sample assumes a public catalog keyed only by SKU. Tenant, currency, and permission-dependent responses need those dimensions in the key.

The cache is local to one process. Concurrent misses can duplicate source work, and invalidation can race with an in-flight read. Use this version where that reuse policy is acceptable. An absolute freshness bound needs source timestamps and a suitable invalidation or generation scheme. Production caching also needs observability, memory sizing, and a stampede policy. A remote proxy must make timeouts and partial failures part of its contract.

## Observer and domain events

Use an observer when independent consumers react to a fact that has already happened. This small in-process publisher awaits its listeners, collects their failures, and continues to later listeners. A Nest lifecycle hook registers the audit subscriber and releases it on shutdown.

<!-- runnable: observer -->

```typescript
import { Injectable, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

type OrderConfirmed = Readonly<{ id: string; orderId: string }>;
type Listener = (event: OrderConfirmed) => Promise<void>;
@Injectable()
export class OrderEvents {
  private readonly listeners = new Set<Listener>();
  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  }
  async publish(event: OrderConfirmed): Promise<unknown[]> {
    const failures: unknown[] = [];
    const fact = Object.freeze({ ...event });
    for (const listener of [...this.listeners]) {
      try { await listener(fact); } catch (error) { failures.push(error); }
    }
    return failures;
  }
}
@Injectable()
export class OrderAudit implements OnModuleInit, OnModuleDestroy {
  readonly orderIds: string[] = [];
  private unsubscribe?: () => void;
  constructor(private readonly events: OrderEvents) {}
  onModuleInit() {
    this.unsubscribe = this.events.subscribe(async event => { this.orderIds.push(event.orderId); });
  }
  onModuleDestroy() { this.unsubscribe?.(); }
}
@Module({ providers: [OrderEvents, OrderAudit], exports: [OrderEvents] })
export class ExampleModule {}
```

Inject `OrderEvents` and publish after the local state change succeeds. The caller must observe the returned failures. This array recorder is a teaching subscriber, not a durable audit log. Tests cover multiple listeners, awaited work, failure isolation, and unsubscribe behavior.

This custom publisher makes the delivery semantics visible in a small example. An existing Nest application can use `@nestjs/event-emitter`; check that library's listener-error and async options rather than assuming these semantics transfer. In-process delivery can lose events on a crash. Use an outbox for reliable integration delivery, and use a direct call when another operation's result is required to maintain the producer's invariant.

## Command

A command names an intended operation and its input. A handler executes it. This example archives a note through a plain injectable handler, which is enough when a dispatch bus would add no useful behavior.

<!-- runnable: command -->

```typescript
import { Injectable, Module } from '@nestjs/common';

export class ArchiveNote {
  constructor(readonly noteId: string) {}
}
@Injectable()
class Notes {
  private readonly rows = new Map([['n-1', { id: 'n-1', archived: false, revision: 0 }]]);
  async archive(id: string) {
    const note = this.rows.get(id);
    if (!note) throw new Error('Note missing');
    if (!note.archived) {
      note.archived = true;
      note.revision++;
    }
    return { ...note };
  }
}
@Injectable()
export class ArchiveNoteHandler {
  constructor(private readonly notes: Notes) {}
  execute(command: ArchiveNote) { return this.notes.archive(command.noteId); }
}
@Module({ providers: [Notes, ArchiveNoteHandler], exports: [ArchiveNoteHandler] })
export class ExampleModule {}
```

Inject `ArchiveNoteHandler` and call `execute(new ArchiveNote('n-1'))`. Tests verify the result, missing records, and repeated execution without an extra revision. The local store makes this operation idempotent within the process; a database implementation needs an atomic conditional update to retain that property under concurrency.

If the project uses `@nestjs/cqrs`, register a `@CommandHandler` and its module, then dispatch through `CommandBus`. Neither the command object nor that bus supplies persistence, queueing, replay, or audit history. Add those mechanisms only when required by the use case.

## Template Method

A template method fits a fixed workflow whose supported steps vary. Here parsing varies by import format, while the sequence stays parse, validate, then save. The validation runs before the first persistence effect.

<!-- runnable: template-method -->

```typescript
import { Injectable, Module } from '@nestjs/common';

export abstract class IdImport {
  async run(raw: string): Promise<number> {
    const ids = this.parse(raw);
    if (ids.length === 0 || ids.length > 100 || new Set(ids).size !== ids.length) {
      throw new Error('Expected 1 to 100 distinct IDs');
    }
    if (ids.some(id => !/^[a-z0-9-]+$/.test(id))) throw new Error('Invalid ID');
    return await this.save(ids);
  }
  protected abstract parse(raw: string): string[];
  protected abstract save(ids: string[]): Promise<number>;
}
@Injectable()
export class ImportLedger {
  readonly ids: string[] = [];
  async save(ids: string[]) { this.ids.push(...ids); return ids.length; }
}
@Injectable()
export class LineImport extends IdImport {
  constructor(private readonly ledger: ImportLedger) { super(); }
  protected parse(raw: string) { return raw.split('\n').map(s => s.trim()).filter(Boolean); }
  protected save(ids: string[]) { return this.ledger.save(ids); }
}
@Module({ providers: [ImportLedger, LineImport], exports: [LineImport] })
export class ExampleModule {}
```

Inject `LineImport` and call `run('a\nb')`. Test invalid and duplicate IDs before writes, successful results, and propagation of asynchronous save failures. The ledger is local teaching storage; real imports need a decision about atomic batches and restart behavior. TypeScript has no `final` method modifier, so preserving `run()` is a documented subclass contract backed by tests. Prefer injected parsing/saving policies when those variations need independent combinations; inheritance couples every subclass to this skeleton.

## Chain of Responsibility

An ordered chain fits a decision that several handlers may resolve. In this order review, a blocked country rejects first, a large amount requires review, and only then may a trusted account be approved. A handler returns `undefined` to pass control onward.

<!-- runnable: chain -->

```typescript
import { Inject, Injectable, Module } from '@nestjs/common';

type Order = { amountCents: number; country: string; trusted: boolean };
type Decision = 'approve' | 'review' | 'reject';
interface Rule { evaluate(order: Order): Decision | undefined }
const RULES = Symbol('RULES');
@Injectable()
class BlockedCountry implements Rule {
  evaluate(order: Order): Decision | undefined { return order.country === 'XX' ? 'reject' : undefined; }
}
@Injectable()
class LargeOrder implements Rule {
  evaluate(order: Order): Decision | undefined { return order.amountCents >= 100000 ? 'review' : undefined; }
}
@Injectable()
class TrustedAccount implements Rule {
  evaluate(order: Order): Decision | undefined { return order.trusted ? 'approve' : undefined; }
}
@Injectable()
export class ReviewChain {
  constructor(@Inject(RULES) private readonly rules: readonly Rule[]) {}
  decide(order: Order): Decision {
    if (!Number.isSafeInteger(order.amountCents) || order.amountCents <= 0) throw new Error('Invalid amount');
    for (const rule of this.rules) {
      const decision = rule.evaluate(order);
      if (decision !== undefined) return decision;
    }
    return 'review';
  }
}
@Module({ providers: [BlockedCountry, LargeOrder, TrustedAccount, ReviewChain,
  { provide: RULES, useFactory: (a: BlockedCountry, b: LargeOrder, c: TrustedAccount) => [a, b, c],
    inject: [BlockedCountry, LargeOrder, TrustedAccount] },
], exports: [ReviewChain] })
export class ExampleModule {}
```

These are invented teaching policies, including `XX`; they are not a real eligibility list. Inject `ReviewChain` for application-level order review. Test competing matches, first-decision short circuiting, invalid amounts, and the fallback. Rule order changes behavior and should be explicit. For HTTP authentication, validation, or response wrapping, use Nest's guards, pipes, and interceptors at their existing lifecycle stages.

## Repository

A repository exposes persistence operations in the consumer's terms. `findDue` includes tenant, payment status, and cutoff semantics in one contract. A real adapter can implement that contract with a parameterized ORM query.

<!-- runnable: repository -->

```typescript
import { Inject, Injectable, Module } from '@nestjs/common';

export type Invoice = { id: string; tenant: string; due: number; paid: boolean };
export abstract class Invoices {
  abstract findDue(tenant: string, cutoff: number): Promise<Invoice[]>;
}
export class MemoryInvoices implements Invoices {
  private readonly rows: Invoice[];
  constructor(rows: readonly Invoice[]) { this.rows = rows.map(row => ({ ...row })); }
  async findDue(tenant: string, cutoff: number) {
    return this.rows.filter(row => row.tenant === tenant && !row.paid && row.due <= cutoff)
      .map(row => ({ ...row }));
  }
}
@Injectable()
export class CollectDueInvoices {
  constructor(@Inject(Invoices) private readonly invoices: Invoices) {}
  execute(tenant: string, cutoff: number) { return this.invoices.findDue(tenant, cutoff); }
}
@Module({ providers: [CollectDueInvoices,
  { provide: Invoices, useValue: new MemoryInvoices([
    { id: 'i-1', tenant: 'a', due: 10, paid: false },
  ]) },
], exports: [CollectDueInvoices] })
export class ExampleModule {}
```

The application injects the abstract class token; its owning module chooses the adapter. Test tenant separation, inclusive cutoff, paid exclusion, and returned-value isolation against each implementation. This in-memory adapter cannot prove SQL isolation, indexes, or date precision. Production queries also need pagination and explicit ordering where callers depend on it. Direct ORM use inside a cohesive boundary can be sufficient; a repository that reproduces the ORM's entire API adds little value.

## Nest provider lifetime versus Singleton

Nest uses singleton provider scope by default. Let the container manage that lifetime instead of adding static `getInstance()` methods or global mutable registries.

Register a shared provider once in its owning module and export it deliberately. Two consumer modules then receive the same settings instance, while a request-scoped marker is resolved separately for each Nest context.

<!-- runnable: provider-lifetime -->

```typescript
import { Injectable, Module, Scope } from '@nestjs/common';

@Injectable()
export class RuntimeSettings {
  readonly value = Object.freeze({ currency: 'USD' });
}
export const SETTINGS_ALIAS = Symbol('SETTINGS_ALIAS');
@Module({ providers: [RuntimeSettings,
  { provide: SETTINGS_ALIAS, useExisting: RuntimeSettings },
], exports: [RuntimeSettings, SETTINGS_ALIAS] })
class SettingsModule {}

@Injectable()
export class ConsumerA {
  constructor(readonly settings: RuntimeSettings) {}
}
@Injectable()
export class ConsumerB {
  constructor(readonly settings: RuntimeSettings) {}
}
@Module({ imports: [SettingsModule], providers: [ConsumerA], exports: [ConsumerA] })
class FeatureA {}
@Module({ imports: [SettingsModule], providers: [ConsumerB], exports: [ConsumerB] })
class FeatureB {}

@Injectable({ scope: Scope.REQUEST })
export class RequestMarker { readonly id = Symbol('request'); }

@Module({ imports: [SettingsModule, FeatureA, FeatureB], providers: [RequestMarker] })
export class ExampleModule {}
```

`useExisting` aliases an existing instance. Registering `RuntimeSettings` separately in both feature modules could create two instances. Tests compare identities across consumers and aliases, then use `ContextIdFactory.create()` and `app.resolve(RequestMarker, context)` to verify isolation between contexts and reuse within one context. These explicit contexts exercise DI scope, rather than an HTTP request pipeline.

Never keep mutable per-request data in a default-scoped provider. Request scope can propagate to consumers and has a runtime cost. Transient scope provides a separate instance per consumer; it does not mean one new object per method call. The default lifetime is a Nest container property, distinct from enforcing a process-wide GoF Singleton.

## Unit of Work

Use a Unit of Work when one operation must commit several writes together. The transfer use case receives transaction-bound debit and credit operations from a port. Both operations must use the same database transaction.

<!-- runnable: unit-of-work -->

```typescript
import { DynamicModule, Inject, Injectable, Module } from '@nestjs/common';

export interface TransferTx {
  debit(account: string, amount: number): Promise<void>;
  credit(account: string, amount: number): Promise<void>;
}
export abstract class TransferUow {
  abstract run<T>(work: (tx: TransferTx) => Promise<T>): Promise<T>;
}
@Injectable()
export class Transfer {
  constructor(@Inject(TransferUow) private readonly uow: TransferUow) {}
  async execute(from: string, to: string, amount: number): Promise<void> {
    if (!Number.isSafeInteger(amount) || amount <= 0) throw new Error('Invalid amount');
    if (from === to) throw new Error('Accounts must be different');
    await this.uow.run(async tx => {
      await tx.debit(from, amount);
      await tx.credit(to, amount);
    });
  }
}
@Module({})
export class ExampleModule {
  static with(uow: TransferUow): DynamicModule {
    return { module: ExampleModule,
      providers: [Transfer, { provide: TransferUow, useValue: uow }], exports: [Transfer] };
  }
}
```

Import `ExampleModule.with(adapter)` and inject `Transfer`. This example leaves the database adapter explicit. In a real module, a `useFactory` provider can inject the data source and construct that adapter. Its `run()` must resolve only after commit and reject after rollback; `debit()` must reject insufficient funds with appropriate locking or a conditional update. Amounts here are integer minor units in one currency, and `credit()` must check storage range limits.

The executable tests use a serialized in-memory transaction adapter. They exercise rollback after a successful debit followed by a failed credit, and competing transfers. Run the same contracts against the actual ORM/database to prove isolation, rollback, and deadlock handling. Keep transaction control out of controllers and keep slow external calls outside the database transaction.

## Specification

A specification fits a rule that several operations need to compose and reuse. A fulfilment policy permits shipping only when an order is paid and has no hold. The predicate is deterministic and has no persistence side effects.

<!-- runnable: specification -->

```typescript
import { Injectable, Module } from '@nestjs/common';

export class Specification<T> {
  constructor(private readonly predicate: (value: T) => boolean) {}
  isSatisfiedBy(value: T) { return this.predicate(value); }
  and(other: Specification<T>) {
    return new Specification<T>(value => this.isSatisfiedBy(value) && other.isSatisfiedBy(value));
  }
  or(other: Specification<T>) {
    return new Specification<T>(value => this.isSatisfiedBy(value) || other.isSatisfiedBy(value));
  }
  not() { return new Specification<T>(value => !this.isSatisfiedBy(value)); }
}
type Order = Readonly<{ paid: boolean; held: boolean }>;
@Injectable()
export class FulfilmentPolicy {
  private readonly eligible = new Specification<Order>(order => order.paid)
    .and(new Specification<Order>(order => order.held).not());
  canShip(order: Order) { return this.eligible.isSatisfiedBy(order); }
}
@Module({ providers: [FulfilmentPolicy], exports: [FulfilmentPolicy] })
export class ExampleModule {}
```

Inject `FulfilmentPolicy` wherever the same rule applies. Tests cover the rule's truth table and the composition operators. This example illustrates composition; if only one call site needs `paid && !held`, keep that expression. An in-memory predicate does not automatically translate into a correct or efficient ORM query. A shared query specification needs an explicit translation contract and equivalence tests, including null and date semantics.

## Transactional outbox

Use a transactional outbox when a committed change must eventually reach another process. The transaction stores the order change and event together. A separate relay publishes pending events and records successful delivery afterward.

<!-- runnable: outbox -->

```typescript
import { DynamicModule, Inject, Injectable, Module } from '@nestjs/common';

export type OrderEvent = Readonly<{ id: string; type: 'order.confirmed'; orderId: string }>;
export interface OutboxTx {
  confirmOrder(id: string): Promise<boolean>; // false if already confirmed
  insert(event: OrderEvent): Promise<void>;
}
export abstract class OutboxStore {
  abstract transaction(work: (tx: OutboxTx) => Promise<void>): Promise<void>;
  abstract pending(limit: number): Promise<OrderEvent[]>;
  abstract markPublished(id: string): Promise<void>;
}
export abstract class Broker { abstract publish(event: OrderEvent): Promise<void>; }
@Injectable()
export class ConfirmOrder {
  constructor(@Inject(OutboxStore) private readonly store: OutboxStore) {}
  async execute(orderId: string) {
    await this.store.transaction(async tx => {
      if (await tx.confirmOrder(orderId)) {
        await tx.insert({ id: `order.confirmed:${orderId}`, type: 'order.confirmed', orderId });
      }
    });
  }
}
@Injectable()
export class OutboxRelay {
  constructor(@Inject(OutboxStore) private readonly store: OutboxStore,
    @Inject(Broker) private readonly broker: Broker) {}
  async flush() {
    for (const event of await this.store.pending(50)) {
      await this.broker.publish(event);
      await this.store.markPublished(event.id);
    }
  }
}
@Module({})
export class ExampleModule {
  static with(store: OutboxStore, broker: Broker): DynamicModule {
    return { module: ExampleModule, providers: [ConfirmOrder, OutboxRelay,
      { provide: OutboxStore, useValue: store }, { provide: Broker, useValue: broker },
    ], exports: [ConfirmOrder, OutboxRelay] };
  }
}
```

Wire the ports with `ExampleModule.with(store, broker)`, then invoke `flush()` from a supervised worker. The teaching tests supply local adapters. A real `transaction()` must use one database transaction for both writes. A successful `publish()` must mean the broker accepted the message under the chosen durability contract. This order can be confirmed once in its lifetime, so its event ID is stable; repeatable transitions need an aggregate version or another unique event identity.

The sample assumes one relay worker. Multiple workers need row claims or leases and a defined ordering key. A crash after publish but before marking the row causes redelivery. Consumers must record the event ID and their local state change atomically; external effects need their own idempotency keys.

Tests inject an outbox-write failure to check rollback, a publish failure to retain a pending row, and a mark failure to prove redelivery uses the same ID. They do not exercise a real broker or database. Production integration tests must cover those boundaries, consumer deduplication, retention, retry backoff, poison events, and lag monitoring. The outbox adds tables and a worker; a best-effort in-process notification needs less machinery.

## Saga/process manager

A process manager fits a workflow with durable intermediate state and recovery across services. This checkout reserves stock, requests payment, and releases stock after a confirmed payment decline. A payment timeout triggers a status check because the charge may already have succeeded.

<!-- runnable: saga -->

```typescript
import { DynamicModule, Inject, Injectable, Module } from '@nestjs/common';

type Phase = 'reserving' | 'charging' | 'checking-payment' | 'releasing' | 'complete' | 'cancelled';
export type SagaState = { phase: Phase; seen: string[] };
type CommandType = 'reserve-stock' | 'charge-payment' | 'check-payment' | 'release-stock';
export type SagaCommand = { id: string; sagaId: string; type: CommandType };
export type SagaEvent = {
  id: string; sagaId: string;
  type: 'stock.reserved' | 'payment.accepted' | 'payment.declined' | 'payment.timeout' | 'stock.released';
};
export interface SagaTx {
  readonly state: SagaState | undefined;
  save(state: SagaState): void;
  enqueue(command: SagaCommand): void;
}
export abstract class SagaStore {
  // save/enqueue stage writes; transaction commits state and command outbox atomically.
  abstract transaction(id: string, work: (tx: SagaTx) => Promise<void>): Promise<void>;
}
@Injectable()
export class CheckoutSaga {
  constructor(@Inject(SagaStore) private readonly store: SagaStore) {}
  start(sagaId: string) {
    return this.store.transaction(sagaId, async tx => {
      if (tx.state) return;
      tx.save({ phase: 'reserving', seen: [] });
      tx.enqueue({ id: `${sagaId}:reserve-stock`, sagaId, type: 'reserve-stock' });
    });
  }
  handle(event: SagaEvent) {
    return this.store.transaction(event.sagaId, async tx => {
      const state = tx.state;
      if (!state) throw new Error('Unknown saga');
      if (state.seen.includes(event.id)) return;
      let phase: Phase;
      let command: CommandType | undefined;
      if (state.phase === 'reserving' && event.type === 'stock.reserved') {
        phase = 'charging'; command = 'charge-payment';
      } else if (state.phase === 'charging' && event.type === 'payment.timeout') {
        phase = 'checking-payment'; command = 'check-payment';
      } else if (['charging', 'checking-payment'].includes(state.phase) && event.type === 'payment.accepted') {
        phase = 'complete';
      } else if (['charging', 'checking-payment'].includes(state.phase) && event.type === 'payment.declined') {
        phase = 'releasing'; command = 'release-stock';
      } else if (state.phase === 'releasing' && event.type === 'stock.released') {
        phase = 'cancelled';
      } else { throw new Error('Unexpected event for saga phase'); }
      tx.save({ phase, seen: [...state.seen, event.id] });
      if (command) tx.enqueue({ id: `${event.sagaId}:${command}`, sagaId: event.sagaId, type: command });
    });
  }
}
@Module({})
export class ExampleModule {
  static with(store: SagaStore): DynamicModule {
    return { module: ExampleModule,
      providers: [CheckoutSaga, { provide: SagaStore, useValue: store }], exports: [CheckoutSaga] };
  }
}
```

Import `ExampleModule.with(store)` and inject `CheckoutSaga`. The store must serialize updates for one saga, persist processed event IDs, and commit state with outgoing commands in one transaction. An outbox relay sends commands to idempotent handlers. Use the same payment operation key when charging and checking its result; a status check must not create another charge. Transport consumers must validate event shape and correlation before calling the manager.

The tests use an in-memory store to verify restart with saved state, duplicate events, compensation, timeout reconciliation, out-of-order rejection, and rollback if command persistence fails. A declined payment is a definitive outcome in this contract. A provider that reports an uncertain decline must map it to reconciliation instead. Releasing inventory is compensation, which may itself fail and need retry; it is not a rollback across services.

This is a teaching slice of the workflow. Production also needs persisted deadlines, recovery scans, durable event/command delivery, reservation failure and timeout paths, retryable status checks, and escalation when reconciliation cannot finish. Unexpected events require a retry, dead-letter, or reconciliation policy at the consumer; do not silently discard them. Keep a direct application operation when these partial-progress concerns do not exist.

## Selection questions

Before adding any pattern:

1. What concrete change or failure is difficult now?
2. What remains stable, and what varies?
3. Who owns the abstraction?
4. What new indirection or runtime state appears?
5. How will tests prove all implementations preserve the contract?
6. What simpler design was rejected, and why?

If those questions have no concrete answers, keep the direct implementation.

For Nest-specific semantics, verify the current official documentation for [modules](https://docs.nestjs.com/modules), [custom providers](https://docs.nestjs.com/fundamentals/custom-providers), [guards](https://docs.nestjs.com/guards), [interceptors](https://docs.nestjs.com/interceptors), [injection scopes](https://docs.nestjs.com/fundamentals/injection-scopes), and [CQRS](https://docs.nestjs.com/recipes/cqrs).

For the executable examples, see [Nest testing](https://docs.nestjs.com/fundamentals/testing), [events](https://docs.nestjs.com/techniques/events), and [TypeORM transactions](https://typeorm.io/docs/advanced-topics/transactions/). AWS's [outbox](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html) and [saga orchestration](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/saga-orchestration.html) guides explain the distributed recovery concerns. Check the installed library versions before adapting a snippet.
