import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createServer } from 'node:http';
import { after, before, test } from 'node:test';
import { performance } from 'node:perf_hooks';
import { pathToFileURL } from 'node:url';
import request from 'supertest';

const { createApp } = await import(pathToFileURL(process.env.FIXTURE_ENTRY));
let app, dependency, calls = 0, active = 0, peak = 0, fail = false, delayMs = 30;
before(async () => {
  dependency = createServer((req, res) => {
    calls++; active++; peak = Math.max(peak, active);
    setTimeout(() => {
      active--;
      res.setHeader('content-type', 'application/json');
      res.statusCode = fail ? 503 : 200;
      res.end(JSON.stringify(fail ? { error: 'unavailable' } : { id: req.url.slice(1), price: 10 }));
    }, delayMs);
  });
  dependency.listen(0, '127.0.0.1');
  await once(dependency, 'listening');
  app = await createApp(`http://127.0.0.1:${dependency.address().port}`);
});
after(async () => {
  await app?.close();
  await new Promise(resolve => dependency?.close(resolve));
});

test('response order and duplicate entries stay stable', async () => {
  const response = await request(app.getHttpServer()).get('/quote').expect(200);
  assert.deepEqual(response.body, ['one', 'two', 'one', 'two'].map(id => ({ id, price: 10 })));
});
test('one request fetches each unique item once with bounded concurrency', async () => {
  calls = 0; peak = 0;
  const start = performance.now();
  await request(app.getHttpServer()).get('/quote').expect(200);
  const durationMs = performance.now() - start;
  console.log('MEASUREMENT ' + JSON.stringify({ calls, peak, durationMs }));
  assert.equal(calls, 2);
  assert.ok(peak <= 2, 'at most two calls may be in flight');
});
test('deduplication does not become a stale cross-request cache', async () => {
  calls = 0;
  await request(app.getHttpServer()).get('/quote').expect(200);
  await request(app.getHttpServer()).get('/quote').expect(200);
  assert.equal(calls, 4);
});
test('the one-second upstream deadline returns the existing 502 contract', async () => {
  delayMs = 1300;
  try {
    const start = performance.now();
    const response = await request(app.getHttpServer()).get('/quote').expect(502);
    assert.equal(response.body.message, 'Catalog unavailable');
    assert.ok(performance.now() - start >= 800, 'deadline must not be shortened substantially');
  } finally { delayMs = 30; }
});
test('dependency failure retains the non-leaking 502 contract', async () => {
  fail = true;
  const response = await request(app.getHttpServer()).get('/quote').expect(502);
  assert.equal(response.body.message, 'Catalog unavailable');
  assert.ok(!JSON.stringify(response.body).includes('127.0.0.1'));
});
