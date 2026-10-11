import 'reflect-metadata';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { NestFactory } from '@nestjs/core';
import { MODULE_METADATA } from '@nestjs/common/constants.js';
import request from 'supertest';
import ts from 'typescript';
import { inventoryContract } from './provider-contract.mjs';

const require = createRequire(import.meta.url);
const modules = require('../.build/four-axis/modules.js');
const runtime = require('../.build/four-axis/runtime.js');
const domain = require('../.build/four-axis/domain.js');
const inventory = require('../.build/four-axis/inventory-reader.js');
const options = { logger: false, abortOnError: false };
async function context(t, module) {
  const app = await NestFactory.createApplicationContext(module, options);
  t.after(() => app.close());
  return app;
}
async function http(t, registration) {
  const app = await runtime.createApp(registration);
  t.after(() => app.close());
  return app;
}
const authorized = app => request(app.getHttpServer()).post('/inventory/reservations')
  .set('authorization', 'fixture-credential');

test('two consuming modules share authentication but own their distinct write policies', async t => {
  const app = await context(t, modules.ExampleModule);
  const library = app.get(modules.BorrowBook);
  const school = app.get(modules.EnrollStudent);
  assert.equal(library.auth, school.auth);
  assert.deepEqual(library.auth.execute('alice-session'), { id: 'alice', school: 'north' });
  assert.deepEqual(library.execute('alice-session'), ['alice']);
  for (const credential of ['unknown', 'bob-session']) {
    assert.throws(() => library.execute(credential), /Unauthenticated|denied/);
    assert.throws(() => school.execute(credential), /Unauthenticated|denied/);
  }
  assert.deepEqual(library.list(), ['alice'], 'denied writes must leave owner state intact');
  assert.deepEqual(school.execute('alice-session'), ['alice']);
  assert.deepEqual(school.execute('alice-session'), ['alice'], 'duplicate enrollment is idempotent');
  assert.throws(() => school.execute('carol-session'), /Class full/);
  assert.deepEqual(library.execute('carol-session'), ['alice', 'carol'], 'library policy does not inherit class capacity');
  assert.deepEqual(school.execute('alice-session'), ['alice']);
  assert.deepEqual(library.auth.execute('bob-session'), { id: 'bob', school: 'south' }, 'no singleton principal bleed');
  for (const feature of [modules.LibraryModule, modules.SchoolModule]) {
    assert.deepEqual(Reflect.getMetadata(MODULE_METADATA.IMPORTS, feature), [modules.AuthModule]);
  }
  assert.equal(Reflect.getMetadata(MODULE_METADATA.IMPORTS, modules.AuthModule), undefined);
});

for (const kind of ['private-provider', 'different-symbol']) {
  test('constructor wiring rejects ' + kind, async () => {
    await assert.rejects(NestFactory.createApplicationContext(modules.brokenWiring(kind), options),
      /Nest can't resolve dependencies of the BrokenConsumer/);
  });
}
test('abstract class token resolves a structurally compatible adapter without inheritance', async t => {
  const app = await context(t, modules.ExampleModule);
  const sender = app.get(modules.NotificationSender);
  assert.equal(sender.send('Library closes at five'), 'notification: Library closes at five');
  assert.equal(sender instanceof modules.NotificationSender, false);
});

test('HTTP success proves enhancer scope order, reverse interceptor unwind and output allow-list', async t => {
  const app = await http(t);
  const response = await authorized(app).send({ sku: 'BOOK', quantity: 1 }).expect(201);
  assert.deepEqual(response.body, { sku: 'BOOK', remaining: 1 });
  assert.deepEqual(app.get(runtime.Trace).events, [
    'middleware', 'guard:global', 'guard:controller', 'guard:route',
    'interceptor:global:in', 'interceptor:controller:in', 'interceptor:route:in',
    'pipe:global', 'pipe:controller', 'pipe:route', 'pipe:parameter', 'controller',
    'interceptor:route:out', 'interceptor:controller:out', 'interceptor:global:out',
  ]);
});
test('authentication rejection skips pipes, interceptors and application writes', async t => {
  const app = await http(t);
  await request(app.getHttpServer()).post('/inventory/reservations').send({ sku: 'BOOK', quantity: 1 }).expect(401);
  assert.deepEqual(app.get(runtime.Trace).events, ['middleware', 'guard:global', 'filter:global']);
  assert.deepEqual(app.get(runtime.ReserveInventory).snapshot(), { sku: 'BOOK', remaining: 2 });
});
test('runtime schema rejects coercion, unknown fields and malformed bodies before the operation', async t => {
  const app = await http(t);
  for (const body of [{ sku: 'BOOK', quantity: '1' }, { sku: 'BOOK', quantity: 0 },
    { sku: 'BOOK', quantity: 1.5 }, { sku: 'BOOK', quantity: 1, private: true }, {}, []]) {
    const trace = app.get(runtime.Trace).events; trace.length = 0;
    const response = await authorized(app).send(body).expect(400);
    assert.equal(response.body.message, 'Invalid request');
    assert.ok(!trace.includes('controller'));
    assert.deepEqual(trace.slice(-4), [
      'interceptor:route:error', 'interceptor:controller:error', 'interceptor:global:error', 'filter:global',
    ]);
  }
  assert.equal(app.get(runtime.ReserveInventory).snapshot().remaining, 2);
});
test('domain invariants survive valid transport input and direct internal calls', async t => {
  const app = await http(t);
  await authorized(app).send({ sku: 'BOOK', quantity: 3 }).expect(409);
  assert.throws(() => app.get(runtime.ReserveInventory).execute({ sku: 'BOOK', quantity: -1 }), domain.StockUnavailable);
  assert.equal(app.get(runtime.ReserveInventory).snapshot().remaining, 2);
  await authorized(app).send({ sku: 'BOOK', quantity: 2 }).expect(201);
  await authorized(app).send({ sku: 'BOOK', quantity: 1 }).expect(409);
  assert.equal(app.get(runtime.ReserveInventory).snapshot().remaining, 0);
});
test('a route filter consumes its exception; the global filter is not a later pipeline stage', async t => {
  const app = await http(t);
  const response = await request(app.getHttpServer()).get('/inventory/local-failure')
    .set('authorization', 'fixture-credential').expect(409);
  assert.deepEqual(response.body, { message: 'Local stock unavailable' });
  assert.ok(app.get(runtime.Trace).events.includes('filter:route'));
  assert.ok(!app.get(runtime.Trace).events.includes('filter:global'));
});
for (const registration of ['provider', 'resolved-singleton']) {
  test('DI-managed global filter preserves injected dependency via ' + registration, async t => {
    const app = await http(t, registration);
    const response = await request(app.getHttpServer()).get('/inventory/unknown')
      .set('authorization', 'fixture-credential').expect(500);
    assert.deepEqual(response.body, { statusCode: 500, message: 'Internal failure' });
    assert.ok(app.get(runtime.Trace).events.includes('filter:global'));
  });
}
test('missing filter dependency fails composition before a server starts', async () => {
  await assert.rejects(NestFactory.createApplicationContext(runtime.MissingFilterDependencyModule, options),
    /Nest can't resolve dependencies of the GlobalFilter/);
});
for (const Adapter of [inventory.ArrayInventory, inventory.MapInventory]) {
  test(Adapter.name + ' honors the same consumer contract', () => inventoryContract(() => new Adapter()));
}
test('the reusable contract rejects a type-compatible adapter with aliased snapshots', () => {
  assert.throws(() => inventoryContract(() => new inventory.AliasingInventory()), /returned snapshot/);
});

// One project's explicit import rule, checked using TypeScript's parser.
// This does not claim to implement a general architecture analyzer or prove agent compliance.
function forbiddenImports(source, forbidden) {
  const file = ts.createSourceFile('example.ts', source, ts.ScriptTarget.Latest, true);
  return file.statements.filter(ts.isImportDeclaration).map(node => node.moduleSpecifier.text)
    .filter(name => forbidden.some(prefix => name === prefix || name.startsWith(prefix + '/')));
}
test('project profile protects the domain boundary and rejects a deliberate framework import', async () => {
  const profile = { forbiddenDomainImports: ['@nestjs', 'typeorm', './runtime'] };
  const source = await readFile(new URL('./domain.ts', import.meta.url), 'utf8');
  assert.deepEqual(forbiddenImports(source, profile.forbiddenDomainImports), []);
  assert.deepEqual(forbiddenImports("import { BadRequestException } from '@nestjs/common';", profile.forbiddenDomainImports),
    ['@nestjs/common']);
  const simpleCrud = { forbiddenServiceImports: [] }; // A different healthy project's supported convention.
  assert.deepEqual(forbiddenImports("import { Repository } from 'typeorm';", simpleCrud.forbiddenServiceImports), []);
});
