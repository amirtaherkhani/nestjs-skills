import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createServer } from 'node:http';
import { test } from 'node:test';
import request from 'supertest';
import { createApp } from '../build/app.js';
test('quote preserves item order', async () => {
  const server = createServer((req, res) => res.end(JSON.stringify({ id: req.url.slice(1), price: 10 })));
  server.listen(0, '127.0.0.1'); await once(server, 'listening');
  const app = await createApp(`http://127.0.0.1:${server.address().port}`);
  try {
    const result = await request(app.getHttpServer()).get('/quote').expect(200);
    assert.deepEqual(result.body, ['one', 'two', 'one', 'two'].map(id => ({ id, price: 10 })));
  } finally { await app.close(); await new Promise(resolve => server.close(resolve)); }
});
