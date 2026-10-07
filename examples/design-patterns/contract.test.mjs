import 'reflect-metadata';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { test } from 'node:test';
import { NestFactory, ContextIdFactory } from '@nestjs/core';
import request from 'supertest';
import { MemoryTransferUow, MemoryOutboxStore, MemorySagaStore } from './support.mjs';

const require = createRequire(import.meta.url);
const load = name => require(`../.build/patterns/${name}.js`);
async function context(t, module) {
  const app = await NestFactory.createApplicationContext(module, { logger: false, abortOnError: false });
  t.after(() => app.close());
  return app;
}

test('Strategy selects the requested algorithm and rejects unknown or invalid inputs', async t => {
  const m = load('strategy');
  const app = await context(t, m.ExampleModule);
  const quotes = app.get(m.QuoteDelivery);
  assert.equal(quotes.quote('standard', 1500), 500);
  assert.equal(quotes.quote('priority', 1500), 1000);
  for (const mode of ['standard', 'priority']) {
    assert.equal(quotes.quote(mode, 1), mode === 'standard' ? 400 : 850);
    for (const grams of [0, -1, NaN, 1.5]) assert.throws(() => quotes.quote(mode, grams), /weight/i);
  }
  assert.throws(() => quotes.quote('unknown', 100), /delivery mode/i);
});

test('Factory selects container-owned preview writers; Factory Method uses its creation hook', async t => {
  const m = load('factory');
  const app = await context(t, m.ExampleModule);
  const factory = app.get(m.ExporterFactory);
  assert.equal(factory.for('csv'), app.get(m.CsvPreview));
  assert.equal(factory.for('pdf').render(['a']), 'PDF teaching preview: a');
  assert.equal(factory.for('csv').render(['a', 'b']), 'CSV teaching preview: a|b');
  assert.throws(() => factory.for('xml'), /format/i);
  assert.equal(app.get(m.CsvExportJob).run(['a']), 'CSV teaching preview: a');
});

test('Builder validates the finished value and prevents result aliasing or cross-call state', async t => {
  const m = load('builder');
  const builder = new m.InvoiceSearchBuilder('tenant-a').withStatuses('paid').take(5);
  const first = builder.build();
  builder.withStatuses('pending');
  assert.deepEqual(first.statuses, ['paid']);
  assert.ok(Object.isFrozen(first) && Object.isFrozen(first.statuses));
  assert.throws(() => new m.InvoiceSearchBuilder('').build(), /tenant/i);
  for (const limit of [0, 101, 1.5]) assert.throws(() => new m.InvoiceSearchBuilder('a').take(limit).build(), /limit/i);
  const app = await context(t, m.ExampleModule);
  const service = app.get(m.SearchInvoices);
  assert.deepEqual(service.criteria('a', ['paid'], 5).statuses, ['paid']);
  assert.deepEqual(service.criteria('b').statuses, []);
});

test('Adapter maps vendor stock, missing data, malformed replies, and transport failures', async t => {
  const m = load('adapter');
  const app = await context(t, m.ExampleModule);
  assert.equal(await app.get(m.STOCK).available('sku-1'), 0);
  const reply = value => new m.StockAdapter({ readSku: async () => value });
  assert.equal(await reply({ stock_quantity: 7 }).available('x'), 7);
  for (const value of [{ stock_quantity: -1 }, {}, { stock_quantity: 1.2 }]) {
    await assert.rejects(reply(value).available('x'), m.StockUnavailable);
  }
  for (const [failure, type] of [[{ code: 'NOT_FOUND' }, m.StockMissing], [new Error('vendor secret'), m.StockUnavailable]]) {
    const adapter = new m.StockAdapter({ readSku: async () => { throw failure; } });
    await assert.rejects(adapter.available('x'), e => e instanceof type && !e.message.includes('vendor secret'));
  }
});

test('Bridge supports both notice policies with both delivery channels', async t => {
  const m = load('bridge');
  const app = await context(t, m.ExampleModule);
  for (const [Notice, body] of [[m.ReceiptNotice, 'Receipt'], [m.OverdueNotice, 'Overdue']]) {
    for (const [Channel, prefix] of [[m.EmailChannel, 'email'], [m.SmsChannel, 'sms']]) {
      assert.equal(await new Notice(new Channel()).send('recipient', 'INV-1'), `${prefix}:recipient:${body} INV-1`);
    }
  }
  assert.equal(await app.get(m.RECEIPT_SMS).send('r', 'INV-2'), 'sms:r:Receipt INV-2');
  assert.equal(await app.get(m.OVERDUE_EMAIL).send('r', 'INV-2'), 'email:r:Overdue INV-2');
});

test('Facade exposes one coherent tracking result and preserves missing-shipment failure', async t => {
  const m = load('facade');
  const app = await context(t, m.ExampleModule);
  const tracking = app.get(m.ShipmentTracking);
  assert.deepEqual(await tracking.track('s-1'), { id: 's-1', status: 'in-transit', url: 'https://carrier.example/track/TRK1' });
  await assert.rejects(tracking.track('missing'), /Shipment missing/);
});

test('Layered flow exercises HTTP parsing, application lookup, and transport error mapping', async t => {
  const m = load('layered-flow');
  const app = await NestFactory.create(m.ExampleModule, { logger: false, abortOnError: false });
  t.after(() => app.close());
  await app.init();
  await request(app.getHttpServer()).get('/items/1').expect(200, { id: 1, label: 'Notebook' });
  await request(app.getHttpServer()).get('/items/nope').expect(400);
  await request(app.getHttpServer()).get('/items/999').expect(404);
  await assert.rejects(app.get(m.FindItem).execute(999), m.ItemMissing);
});

test('Decorator preserves successful values and the original failure while recording outcomes', async t => {
  const m = load('decorator');
  const app = await context(t, m.ExampleModule);
  assert.equal(await app.get(m.QUOTES).read('free'), 0);
  assert.deepEqual(app.get(m.Metrics).outcomes, ['ok']);
  const original = new Error('Upstream unavailable');
  const meter = new m.Metrics();
  const measured = new m.MeasuredQuotes({ read: async () => { throw original; } }, meter);
  await assert.rejects(measured.read('x'), e => e === original);
  assert.deepEqual(meter.outcomes, ['error']);
});

test('Proxy caches zero, expires at the boundary, invalidates, and never caches a failure', async t => {
  const m = load('proxy');
  const app = await context(t, m.ExampleModule);
  assert.equal(await app.get(m.QUOTES).read('free'), 0);
  let now = 0;
  let calls = 0;
  let fail = false;
  const proxy = new m.CachedQuotes({ read: async () => { calls++; if (fail) throw new Error('offline'); return 0; } }, () => now);
  assert.equal(await proxy.read('a'), 0);
  assert.equal(await proxy.read('a'), 0);
  assert.equal(calls, 1);
  now = 1000;
  await proxy.read('a');
  assert.equal(calls, 2);
  proxy.invalidate('a');
  fail = true;
  await assert.rejects(proxy.read('a'), /offline/);
  fail = false;
  await proxy.read('a');
  assert.equal(calls, 4);
});

test('Proxy bounds local entries and does not share cache across application instances', () => {
  const m = load('proxy');
  return (async () => {
    let calls = 0;
    const source = { read: async () => ++calls };
    const first = new m.CachedQuotes(source, () => 0);
    for (let i = 0; i < 101; i++) await first.read(String(i));
    await first.read('0');
    assert.equal(calls, 102);
    await new m.CachedQuotes(source, () => 0).read('0');
    assert.equal(calls, 103);
  })();
});

test('Observer awaits listeners, reports failures, keeps later listeners, and unsubscribes', async () => {
  const m = load('observer');
  const app = await NestFactory.createApplicationContext(m.ExampleModule, { logger: false, abortOnError: false });
  try {
    const events = app.get(m.OrderEvents);
    const audit = app.get(m.OrderAudit);
    const received = [];
    const off = events.subscribe(async event => { await Promise.resolve(); received.push(event.orderId); });
    events.subscribe(async () => { throw new Error('Mail unavailable'); });
    events.subscribe(async event => { received.push(`later:${event.orderId}`); });
    const errors = await events.publish({ id: 'e-1', orderId: 'o-1' });
    assert.equal(errors.length, 1);
    assert.deepEqual(received, ['o-1', 'later:o-1']);
    assert.deepEqual(audit.orderIds, ['o-1']);
    off();
    await events.publish({ id: 'e-2', orderId: 'o-2' });
    assert.deepEqual(received, ['o-1', 'later:o-1', 'later:o-2']);
    await app.close();
    await events.publish({ id: 'e-3', orderId: 'o-3' });
    assert.deepEqual(audit.orderIds, ['o-1', 'o-2']);
  } finally { await app.close(); }
});

test('Command handler archives once and preserves a stable result on repeated invocation', async t => {
  const m = load('command');
  const app = await context(t, m.ExampleModule);
  const handler = app.get(m.ArchiveNoteHandler);
  const command = new m.ArchiveNote('n-1');
  assert.deepEqual(await handler.execute(command), { id: 'n-1', archived: true, revision: 1 });
  assert.deepEqual(await handler.execute(command), { id: 'n-1', archived: true, revision: 1 });
  await assert.rejects(handler.execute(new m.ArchiveNote('missing')), /Note missing/);
});

test('Template Method validates before saving and propagates asynchronous save failure', async t => {
  const m = load('template-method');
  const app = await context(t, m.ExampleModule);
  const importer = app.get(m.LineImport);
  const ledger = app.get(m.ImportLedger);
  assert.equal(await importer.run('a\nb'), 2);
  assert.deepEqual(ledger.ids, ['a', 'b']);
  for (const raw of ['', 'a\na', 'bad id']) await assert.rejects(importer.run(raw));
  assert.deepEqual(ledger.ids, ['a', 'b']);
  const broken = new m.LineImport({ save: async () => { throw new Error('Storage unavailable'); } });
  await assert.rejects(broken.run('c'), /Storage unavailable/);
});

test('Chain stops at the first decision, preserves rule order, and defaults to review', async t => {
  const m = load('chain');
  const app = await context(t, m.ExampleModule);
  const chain = app.get(m.ReviewChain);
  assert.equal(chain.decide({ amountCents: 1, country: 'XX', trusted: true }), 'reject');
  assert.equal(chain.decide({ amountCents: 100000, country: 'GB', trusted: true }), 'review');
  assert.equal(chain.decide({ amountCents: 1, country: 'GB', trusted: true }), 'approve');
  assert.equal(chain.decide({ amountCents: 1, country: 'GB', trusted: false }), 'review');
  assert.throws(() => chain.decide({ amountCents: -1, country: 'GB', trusted: true }), /amount/i);
  const stop = new m.ReviewChain([{ evaluate: () => 'reject' }, { evaluate: () => { throw new Error('Must not run'); } }]);
  assert.equal(stop.decide({ amountCents: 1, country: 'GB', trusted: true }), 'reject');
});

test('Repository preserves tenant, due-date, paid-state, and copy-isolation semantics', async t => {
  const m = load('repository');
  const app = await context(t, m.ExampleModule);
  assert.deepEqual((await app.get(m.CollectDueInvoices).execute('a', 10)).map(i => i.id), ['i-1']);
  const rows = [
    { id: 'yes', tenant: 'a', due: 10, paid: false },
    { id: 'later', tenant: 'a', due: 11, paid: false },
    { id: 'paid', tenant: 'a', due: 1, paid: true },
    { id: 'other', tenant: 'b', due: 1, paid: false },
  ];
  const repo = new m.MemoryInvoices(rows);
  const found = await repo.findDue('a', 10);
  assert.deepEqual(found.map(i => i.id), ['yes']);
  found[0].paid = true;
  rows[0].paid = true;
  assert.equal((await repo.findDue('a', 10)).length, 1);
});

test('Provider lifetime shares the owning-module singleton and isolates request contexts', async t => {
  const m = load('provider-lifetime');
  const app = await context(t, m.ExampleModule);
  assert.equal(app.get(m.ConsumerA).settings, app.get(m.ConsumerB).settings);
  assert.equal(app.get(m.SETTINGS_ALIAS), app.get(m.RuntimeSettings));
  const one = ContextIdFactory.create();
  const two = ContextIdFactory.create();
  assert.equal(await app.resolve(m.RequestMarker, one), await app.resolve(m.RequestMarker, one));
  assert.notEqual(await app.resolve(m.RequestMarker, one), await app.resolve(m.RequestMarker, two));
});

test('Unit of Work commits both account changes and rolls back when the credit fails', async t => {
  const m = load('unit-of-work');
  const memory = new MemoryTransferUow();
  const app = await context(t, m.ExampleModule.with(memory));
  const transfer = app.get(m.Transfer);
  await transfer.execute('alice', 'bob', 30);
  assert.deepEqual([...memory.balances], [['alice', 70], ['bob', 30]]);
  await assert.rejects(transfer.execute('alice', 'missing', 20), /Missing account/);
  assert.deepEqual([...memory.balances], [['alice', 70], ['bob', 30]]);
  for (const amount of [0, -1, 1.5]) await assert.rejects(transfer.execute('alice', 'bob', amount), /amount/i);
  await assert.rejects(transfer.execute('alice', 'alice', 1), /different/i);
});

test('Unit of Work caller preserves balances when competing transfers exceed the available funds', async () => {
  const m = load('unit-of-work');
  const memory = new MemoryTransferUow();
  const transfer = new m.Transfer(memory);
  const results = await Promise.allSettled([transfer.execute('alice', 'bob', 70), transfer.execute('alice', 'bob', 70)]);
  assert.equal(results.filter(r => r.status === 'fulfilled').length, 1);
  assert.deepEqual([...memory.balances], [['alice', 30], ['bob', 70]]);
});

test('Specification composes predicates and enforces the same rule for every caller', async t => {
  const m = load('specification');
  const app = await context(t, m.ExampleModule);
  const policy = app.get(m.FulfilmentPolicy);
  for (const paid of [false, true]) for (const held of [false, true]) {
    assert.equal(policy.canShip({ paid, held }), paid && !held);
  }
  const positive = new m.Specification(n => n > 0);
  const even = new m.Specification(n => n % 2 === 0);
  assert.equal(positive.and(even).isSatisfiedBy(2), true);
  assert.equal(positive.and(even).isSatisfiedBy(-2), false);
  assert.equal(positive.or(even).isSatisfiedBy(-2), true);
  assert.equal(positive.not().isSatisfiedBy(0), true);
});

test('Outbox records state and an event together; an event write failure rolls back state', async t => {
  const m = load('outbox');
  const store = new MemoryOutboxStore();
  const app = await context(t, m.ExampleModule.with(store, { publish: async () => {} }));
  const confirm = app.get(m.ConfirmOrder);
  store.failInsert = true;
  await assert.rejects(confirm.execute('order-1'), /Outbox write failed/);
  assert.equal(store.orders.get('order-1'), 'draft');
  assert.equal(store.events.size, 0);
  store.failInsert = false;
  await confirm.execute('order-1');
  await confirm.execute('order-1');
  assert.equal(store.orders.get('order-1'), 'confirmed');
  assert.equal(store.events.size, 1);
});

test('Outbox retries publish failures and redelivers the same event after an acknowledgement failure', async () => {
  const m = load('outbox');
  const store = new MemoryOutboxStore();
  await new m.ConfirmOrder(store).execute('order-1');
  const deliveries = [];
  let offline = true;
  const relay = new m.OutboxRelay(store, { publish: async event => {
    if (offline) throw new Error('Broker unavailable');
    deliveries.push(event);
  } });
  await assert.rejects(relay.flush(), /Broker unavailable/);
  assert.equal((await store.pending(50)).length, 1);
  offline = false;
  store.failMark = true;
  await assert.rejects(relay.flush(), /Acknowledgement write failed/);
  store.failMark = false;
  await relay.flush();
  await relay.flush();
  assert.equal(deliveries.length, 2);
  assert.equal(deliveries[0].id, deliveries[1].id);
  assert.equal((await store.pending(50)).length, 0);
});

test('Saga resumes from stored state, deduplicates events, and completes without compensation', async t => {
  const m = load('saga');
  const store = new MemorySagaStore();
  const app = await context(t, m.ExampleModule.with(store));
  const saga = app.get(m.CheckoutSaga);
  await saga.start('checkout-1');
  await saga.start('checkout-1');
  const reserved = { id: 'e-1', sagaId: 'checkout-1', type: 'stock.reserved' };
  await saga.handle(reserved);
  await new m.CheckoutSaga(store).handle(reserved);
  await new m.CheckoutSaga(store).handle({ id: 'e-2', sagaId: 'checkout-1', type: 'payment.accepted' });
  assert.equal(store.states.get('checkout-1').phase, 'complete');
  assert.deepEqual([...store.commands.values()].map(c => c.type), ['reserve-stock', 'charge-payment']);
});

test('Outbox teaching adapter preserves acknowledgements across concurrent transactions', async () => {
  const m = load('outbox');
  const store = new MemoryOutboxStore();
  await new m.ConfirmOrder(store).execute('order-1');
  let entered;
  const started = new Promise(resolve => { entered = resolve; });
  let resume;
  const paused = new Promise(resolve => { resume = resolve; });
  const transaction = store.transaction(async () => {
    entered();
    await paused;
  });
  await started;
  const acknowledgement = store.markPublished('order.confirmed:order-1');
  resume();
  await Promise.all([transaction, acknowledgement]);
  assert.equal((await store.pending(50)).length, 0);
});

test('Saga compensates a declined payment and waits for the release acknowledgement', async () => {
  const m = load('saga');
  const store = new MemorySagaStore();
  const saga = new m.CheckoutSaga(store);
  await saga.start('s');
  await saga.handle({ id: '1', sagaId: 's', type: 'stock.reserved' });
  await saga.handle({ id: '2', sagaId: 's', type: 'payment.declined' });
  assert.equal(store.states.get('s').phase, 'releasing');
  await saga.handle({ id: '3', sagaId: 's', type: 'stock.released' });
  assert.equal(store.states.get('s').phase, 'cancelled');
  assert.deepEqual([...store.commands.values()].map(c => c.type), ['reserve-stock', 'charge-payment', 'release-stock']);
});

test('Saga checks an unknown payment outcome on timeout before deciding whether to compensate', async () => {
  const m = load('saga');
  const store = new MemorySagaStore();
  const saga = new m.CheckoutSaga(store);
  await saga.start('s');
  await saga.handle({ id: '1', sagaId: 's', type: 'stock.reserved' });
  await saga.handle({ id: '2', sagaId: 's', type: 'payment.timeout' });
  assert.equal(store.states.get('s').phase, 'checking-payment');
  assert.equal([...store.commands.values()].at(-1).type, 'check-payment');
  await saga.handle({ id: '3', sagaId: 's', type: 'payment.accepted' });
  assert.equal(store.states.get('s').phase, 'complete');
  assert.ok(![...store.commands.values()].some(c => c.type === 'release-stock'));
});

test('Saga leaves state unchanged if command persistence fails or an event arrives out of order', async () => {
  const m = load('saga');
  const store = new MemorySagaStore();
  const saga = new m.CheckoutSaga(store);
  await saga.start('s');
  store.failEnqueue = true;
  const event = { id: '1', sagaId: 's', type: 'stock.reserved' };
  await assert.rejects(saga.handle(event), /Command write failed/);
  assert.equal(store.states.get('s').phase, 'reserving');
  assert.deepEqual(store.states.get('s').seen, []);
  store.failEnqueue = false;
  await assert.rejects(saga.handle({ id: '2', sagaId: 's', type: 'payment.accepted' }), /Unexpected event/);
  await saga.handle(event);
  assert.equal(store.states.get('s').phase, 'charging');
  await assert.rejects(saga.handle({ id: '3', sagaId: 'missing', type: 'stock.reserved' }), /Unknown saga/);
});
