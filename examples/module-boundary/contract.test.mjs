import assert from 'node:assert/strict';
import { afterEach, beforeEach, test } from 'node:test';
import { pathToFileURL } from 'node:url';
import request from 'supertest';

const { createApp } = await import(pathToFileURL(process.env.FIXTURE_ENTRY));
let app;
beforeEach(async () => { app = await createApp(); });
afterEach(async () => { await app?.close(); });

test('healthy public-operation consumer rejects an overdraft', async () => {
  await request(app.getHttpServer()).post('/checkout/charge').send({ amount: 150 }).expect(409);
});
test('bulk consumer must preserve the same nonnegative-balance invariant', async () => {
  await request(app.getHttpServer()).post('/bulk/charge').send({ amount: 150 }).expect(409);
});
test('valid charges use the public operation', async () => {
  const response = await request(app.getHttpServer()).post('/checkout/charge').send({ amount: 20 }).expect(201);
  assert.equal(response.body.balance, 80);
});
