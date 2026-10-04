import assert from 'node:assert/strict';
import { test } from 'node:test';
import request from 'supertest';
import { createApp } from '../build/app.js';
test('checkout can charge a positive amount', async () => {
  const app = await createApp();
  try {
    const result = await request(app.getHttpServer()).post('/checkout/charge').send({ amount: 20 }).expect(201);
    assert.equal(result.body.balance, 80);
  } finally { await app.close(); }
});
