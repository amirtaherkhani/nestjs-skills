import { once } from 'node:events';
import { createServer } from 'node:http';
import { performance } from 'node:perf_hooks';
import request from 'supertest';
import { createApp } from './build/app.js';
let calls = 0, active = 0, peak = 0;
const server = createServer((req, res) => {
  calls++; active++; peak = Math.max(peak, active);
  setTimeout(() => { active--; res.end(JSON.stringify({ id: req.url.slice(1), price: 10 })); }, 30);
});
server.listen(0, '127.0.0.1'); await once(server, 'listening');
const app = await createApp(`http://127.0.0.1:${server.address().port}`);
try {
  await request(app.getHttpServer()).get('/quote').expect(200); // warm up
  const samples = [];
  for (let i = 0; i < 5; i++) {
    calls = 0; peak = 0;
    const start = performance.now();
    const response = await request(app.getHttpServer()).get('/quote').expect(200);
    samples.push({ calls, peak, duration_ms: performance.now() - start, response: response.body });
  }
  console.log(JSON.stringify({ dependency_delay_ms: 30, samples }, null, 2));
} finally { await app.close(); await new Promise(resolve => server.close(resolve)); }
