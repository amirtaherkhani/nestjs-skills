import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { pathToFileURL } from 'node:url';
import request from 'supertest';

const { createApp, parseQuery, selectCards } = await import(pathToFileURL(process.env.FIXTURE_ENTRY));
let app;
before(async () => { app = await createApp(); });
after(async () => { await app?.close(); });

test('indexed join retains request order, repeated IDs and first catalog match', () => {
  const ids = ['b', 'a', 'b', 'missing', 'private'];
  const rows = [
    { id: 'b', title: 'First', internalToken: 'secret' },
    { id: 'b', title: 'Second', internalToken: 'secret' },
    { id: 'a', title: 'A', internalToken: 'secret' },
    { id: 'private', title: 'Private', internalToken: 'secret' },
  ];
  const allowed = ['a', 'b', 'missing'];
  Object.freeze(ids); Object.freeze(allowed);
  rows.forEach(Object.freeze); Object.freeze(rows);
  assert.deepEqual(selectCards(ids, rows, allowed, 32), [
    { id: 'b', title: 'First' }, { id: 'a', title: 'A' }, { id: 'b', title: 'First' },
  ]);
  assert.deepEqual(ids, ['b', 'a', 'b', 'missing', 'private']);
  assert.equal(rows[0].internalToken, 'secret');
  assert.deepEqual(allowed, ['a', 'b', 'missing']);
  const cards = selectCards(['b', 'b'], rows, allowed, 2);
  assert.notEqual(cards[0], cards[1]);
  cards[0].title = 'Caller edit';
  assert.equal(cards[1].title, 'First');
  assert.equal(rows[0].title, 'First');
});

test('limit stops output early; user strings are safe as Map keys', () => {
  const rows = [{ id: '__proto__', title: 'Safe', internalToken: 'secret' }];
  assert.deepEqual(selectCards(['__proto__', '__proto__'], rows, ['__proto__'], 1), [
    { id: '__proto__', title: 'Safe' },
  ]);
});

test('direct selector calls cannot bypass the output limit with invalid numbers', () => {
  for (const limit of [-1, 0, 1.5, 33, NaN, Infinity]) {
    assert.throws(() => selectCards(['a'], [], [], limit), RangeError);
  }
});

test('query narrows unknown at the boundary without changing caller-owned IDs', () => {
  const ids = ['a', 'b'];
  const query = parseQuery({ ids, limit: 2 });
  assert.deepEqual(query, { ids, limit: 2 });
  assert.deepEqual(ids, ['a', 'b']);
});

test('HTTP projects only public fields while preserving duplicates and order', async () => {
  const response = await request(app.getHttpServer()).post('/collections/select')
    .send({ ids: ['b', 'a', 'b', '__proto__', 'missing'], limit: 4 }).expect(201);
  assert.deepEqual(response.body, { items: [
    { id: 'b', title: 'Beta' }, { id: 'a', title: 'Alpha' },
    { id: 'b', title: 'Beta' }, { id: '__proto__', title: 'Special' },
  ] });
  assert.ok(!JSON.stringify(response.body).includes('internalToken'));
});

for (const [name, body] of [
  ['null', null], ['array', []], ['missing ids', { limit: 1 }],
  ['object ID', { ids: [{}], limit: 1 }], ['too many IDs', { ids: Array(33).fill('a'), limit: 1 }],
  ['long ID', { ids: ['x'.repeat(41)], limit: 1 }],
  ['fractional limit', { ids: ['a'], limit: 1.5 }],
  ['zero limit', { ids: ['a'], limit: 0 }],
  ['extra field', { ids: ['a'], limit: 1, admin: true }],
]) {
  test(`HTTP rejects ${name}`, async () => {
    await request(app.getHttpServer()).post('/collections/select').send(body).expect(400);
  });
}

test('HTTP rejects payloads above the parser byte limit', async () => {
  await request(app.getHttpServer()).post('/collections/select')
    .set('Content-Type', 'application/json')
    .send(JSON.stringify({ ids: ['x'.repeat(5_000)], limit: 1 })).expect(413);
});
