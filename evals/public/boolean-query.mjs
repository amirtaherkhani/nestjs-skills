import assert from 'node:assert/strict';
import { test } from 'node:test';
import request from 'supertest';
import { createApp } from '../build/app.js';
test('items default response', async () => {
  const app = await createApp();
  try {
    const result = await request(app.getHttpServer()).get('/items').expect(200);
    assert.deepEqual(result.body, [{ id: 1, archived: false }]);
  } finally { await app.close(); }
});
