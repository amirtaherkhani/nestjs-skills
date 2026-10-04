import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { pathToFileURL } from 'node:url';
import request from 'supertest';

const { createApp } = await import(pathToFileURL(process.env.FIXTURE_ENTRY));
let app;
before(async () => { app = await createApp(); });
after(async () => { await app?.close(); });
const active = [{ id: 1, archived: false }];
const all = [...active, { id: 2, archived: true }];

test('omitted query returns only active records', async () => {
  const response = await request(app.getHttpServer()).get('/items').expect(200);
  assert.deepEqual(response.body, active);
});
test('true query includes archived records', async () => {
  const response = await request(app.getHttpServer()).get('/items?includeArchived=true').expect(200);
  assert.deepEqual(response.body, all);
});
test('false query excludes archived records', async () => {
  const response = await request(app.getHttpServer()).get('/items?includeArchived=false').expect(200);
  assert.deepEqual(response.body, active);
});
for (const value of ['yes', '0', '', 'TRUE']) {
  test(`invalid query ${JSON.stringify(value)} returns 400`, async () => {
    await request(app.getHttpServer()).get(`/items?includeArchived=${value}`).expect(400);
  });
}
