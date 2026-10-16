import 'reflect-metadata';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Module } from '@nestjs/common';
import { ContextIdFactory, NestFactory } from '@nestjs/core';
import ops from '../.build/runtime-contracts/operations.js';
import di from '../.build/runtime-contracts/injection.js';
import perf from '../.build/runtime-contracts/performance.js';

const options = { logger: false, abortOnError: false };
const deferred = () => { let resolve, reject; const promise = new Promise((yes, no) => { resolve = yes; reject = no; }); return { promise, resolve, reject }; };
async function context(providers) {
  class TestModule {}
  Module({ providers })(TestModule);
  return NestFactory.createApplicationContext(TestModule, options);
}
function operations(resource = { async connect() {}, async close() {} }, sink = { write() {} }, env = {}) {
  return NestFactory.create(ops.OperationsModule.register(env, resource, sink), options);
}

test('configuration rejects malformed and out-of-range ports; defaults and result are immutable', () => {
  for (const PORT of ['', '0', '-1', '65536', '3.5', '1e3', ' 3000']) assert.throws(() => ops.parseSettings({ PORT }), /PORT/);
  assert.deepEqual(ops.parseSettings({}), { port: 3000, service: 'catalog' });
  assert.equal(ops.parseSettings({ PORT: '65535' }).port, 65535);
  assert.throws(() => ops.parseSettings({ SERVICE_NAME: 'x\nsecret' }), /SERVICE_NAME/);
  assert.equal(Object.isFrozen(ops.parseSettings({})), true);
});

test('invalid configuration rejects Nest provider construction before initialization', async () => {
  let connects = 0;
  await assert.rejects(operations({ async connect() { connects++; }, async close() {} }, undefined, { PORT: 'bad' }), /PORT/);
  assert.equal(connects, 0);
});

test('event logger projects allowlisted fields and rejects log-injection IDs', async () => {
  const lines = [];
  const app = await operations(undefined, { write(line) { lines.push(line); } });
  try {
    const logger = app.get(ops.CompletionLogger);
    logger.completed({ requestId: 'r-1', status: 200, durationMs: 12, authorization: 'secret', body: { password: 'secret' } });
    assert.deepEqual(JSON.parse(lines[0]), { event: 'request.completed', service: 'catalog', requestId: 'r-1', status: 200, durationMs: 12 });
    assert.equal(lines[0].includes('secret'), false);
    assert.throws(() => logger.completed({ requestId: 'x\nforged', status: 200, durationMs: 1 }), /Invalid/);
    assert.equal(lines.length, 1);
  } finally { await app.close(); }
});

test('async startup is awaited and explicit close awaits cleanup in hook phase order', async () => {
  const connected = deferred(); const released = deferred(); const connecting = deferred(); const closing = deferred();
  const app = await operations({ connect() { connecting.resolve(); return connected.promise; }, close() { closing.resolve(); return released.promise; } });
  const resource = app.get(ops.ManagedResource);
  const starting = app.init();
  await connecting.promise;
  assert.equal(resource.ready, false);
  connected.resolve(); await starting;
  assert.equal(resource.ready, true);
  const stopped = app.close();
  await closing.promise;
  assert.equal(resource.ready, false);
  assert.deepEqual(resource.events, ['connected', 'ready', 'stopping', 'before.shutdown']);
  released.resolve(); await stopped;
  assert.deepEqual(resource.events, ['connected', 'ready', 'stopping', 'before.shutdown', 'resource.closed', 'shutdown']);
});

test('failed asynchronous initialization never marks application ready', async () => {
  const app = await operations({ async connect() { throw new Error('dependency unavailable'); }, async close() {} });
  try {
    await assert.rejects(app.init(), /dependency unavailable/);
    assert.equal(app.get(ops.ManagedResource).ready, false);
  } finally { await app.close(); }
});

test('constructor injection resolves the runtime Symbol alias to the same adapter', async () => {
  const app = await NestFactory.createApplicationContext(di.InjectionModule, options);
  try {
    assert.equal(app.get(di.STOCK_READER), app.get(di.LocalStock));
    assert.equal(await app.get(di.CanReserve).execute('book', 3), true);
    assert.equal(await app.get(di.CanReserve).execute('book', 4), false);
  } finally { await app.close(); }
});

test('a lookalike Symbol cannot satisfy the constructor dependency', async () => {
  await assert.rejects(context([{ provide: Symbol('inventory.stock-reader'), useValue: new di.LocalStock() }, di.CanReserve]), /resolve dependencies/);
});

for (const [name, adapter] of [
  ['class adapter', new di.LocalStock()],
  ['query-only substitute', { async available(sku) { return sku === 'book' ? 3 : 0; } }],
]) test(`${name} honors the same reservation consumer contract`, async () => {
  const app = await context([{ provide: di.STOCK_READER, useValue: adapter }, di.CanReserve]);
  try {
    const reserve = app.get(di.CanReserve);
    assert.equal(await reserve.execute('book', 3), true);
    assert.equal(await reserve.execute('missing', 1), false);
    await assert.rejects(reserve.execute('book', 0), /Invalid reservation/);
  } finally { await app.close(); }
});

test('structural compatibility does not excuse an invalid adapter result or swallowed failure', async () => {
  await assert.rejects(new di.CanReserve({ async available() { return -1; } }).execute('book', 1), /Invalid stock/);
  const failure = new Error('store unavailable');
  await assert.rejects(new di.CanReserve({ async available() { throw failure; } }).execute('book', 1), error => error === failure);
});

test('singleton sharing and transient per-consumer identity are distinct', async () => {
  const app = await NestFactory.createApplicationContext(di.InjectionModule, options);
  try {
    const a = app.get(di.ConsumerA), b = app.get(di.ConsumerB);
    assert.equal(a.shared, b.shared);
    assert.notEqual(a.own, b.own);
    a.own.value++;
    assert.equal(app.get(di.ConsumerA).own.value, 1);
    assert.equal(b.own.value, 0);
  } finally { await app.close(); }
});

test('request scope bubbles to the consumer while the shared dependency stays singleton', async () => {
  const app = await NestFactory.createApplicationContext(di.InjectionModule, options);
  try {
    const one = ContextIdFactory.create(), two = ContextIdFactory.create();
    app.registerRequestByContextId({ tenant: 'one' }, one);
    app.registerRequestByContextId({ tenant: 'two' }, two);
    const a = await app.resolve(di.TenantConsumer, one), b = await app.resolve(di.TenantConsumer, two);
    assert.notEqual(a, b);
    assert.equal(a, await app.resolve(di.TenantConsumer, one));
    assert.equal(a.shared, b.shared);
    assert.equal(a.context.tenant, 'one'); assert.equal(b.context.tenant, 'two');
    assert.equal(a.context.initializedByHook, false);
  } finally { await app.close(); }
});

async function cacheContext(origin, clock) {
  return context([{ provide: perf.ORIGIN, useValue: origin }, { provide: perf.CLOCK, useValue: clock }, perf.PublicSummaryCache]);
}
test('cache coalesces concurrent misses and expires exactly at its millisecond TTL', async () => {
  let now = 0, calls = 0;
  const gate = deferred();
  const app = await cacheContext({ async read() { calls++; return calls === 1 ? gate.promise : 'new'; } }, { now: () => now });
  try {
    const cache = app.get(perf.PublicSummaryCache);
    const first = cache.read(), second = cache.read();
    assert.equal(first, second);
    gate.resolve('old');
    assert.deepEqual(await Promise.all([first, second]), ['old', 'old']);
    now = 999; assert.equal(await cache.read(), 'old'); assert.equal(calls, 1);
    now = 1000; assert.equal(await cache.read(), 'new'); assert.equal(calls, 2);
  } finally { await app.close(); }
});

test('rejected or oversized cache loads are not retained and later calls retry', async () => {
  let calls = 0;
  const app = await cacheContext({ async read() { calls++; if (calls === 1) throw new Error('origin failed'); return calls === 2 ? 'x'.repeat(1025) : ''; } }, { now: () => 0 });
  try {
    const cache = app.get(perf.PublicSummaryCache);
    await assert.rejects(cache.read(), /origin failed/);
    await assert.rejects(cache.read(), /Summary exceeds/);
    assert.equal(await cache.read(), '');
    assert.equal(await cache.read(), '');
    assert.equal(calls, 3);
  } finally { await app.close(); }
});

test('page service sends one bounded tenant-filtered projection request and strips extra fields', async () => {
  const requests = [];
  const app = await context([{ provide: perf.PAGE_QUERY, useValue: { async fetch(input) { requests.push(input); return [{ id: 11, title: 'Book', privateCost: 99 }]; } } }, perf.ListTitles]);
  try {
    const list = app.get(perf.ListTitles);
    assert.deepEqual(await list.execute('tenant-a', 10, 2), [{ id: 11, title: 'Book' }]);
    assert.deepEqual(requests, [{ tenant: 'tenant-a', afterId: 10, limit: 2, select: ['id', 'title'], order: 'id-asc' }]);
    for (const limit of [0, 51, 1.5]) await assert.rejects(list.execute('tenant-a', 10, limit), /Invalid page/);
    assert.equal(requests.length, 1);
  } finally { await app.close(); }
});

test('page adapter cannot silently exceed bounds or return unordered rows', async () => {
  await assert.rejects(new perf.ListTitles({ async fetch() { return [{ id: 1, title: 'A' }, { id: 2, title: 'B' }]; } }).execute('a', 0, 1), /exceeded/);
  await assert.rejects(new perf.ListTitles({ async fetch() { return [{ id: 2, title: 'A' }, { id: 1, title: 'B' }]; } }).execute('a', 0, 2), /Invalid page response/);
});

test('lazy providers are absent before load, reused after load, and do not receive init hooks', async () => {
  const app = await NestFactory.createApplicationContext(perf.LazyRootModule, options);
  try {
    assert.throws(() => app.get(perf.OptionalReport), /does not exist/);
    const reports = app.get(perf.Reports);
    const report = await reports.get();
    assert.equal(report.render(), 'public report');
    assert.equal(report, await reports.get());
    assert.equal(report.initializedByHook, false);
  } finally { await app.close(); }
});
