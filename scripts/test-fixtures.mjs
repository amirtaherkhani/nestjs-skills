import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const build = spawnSync(process.execPath, ['node_modules/typescript/bin/tsc', '-p', 'examples/tsconfig.json'], { cwd: root, encoding: 'utf8' });
assert.equal(build.status, 0, build.stdout + build.stderr);
const expected = { 'boolean-query': [7, 5], 'module-boundary': [3, 1], 'slow-api': [14, 2] };
const results = [];
for (const [fixture, [tests, failures]] of Object.entries(expected)) {
  for (const variant of ['before', 'after']) {
    const run = spawnSync(process.execPath, ['--test', '--test-reporter=tap', `examples/${fixture}/contract.test.mjs`], {
      cwd: root, encoding: 'utf8', timeout: 30_000,
      env: { ...process.env, FIXTURE_ENTRY: resolve(root, `examples/.build/${fixture}/${variant}/app.js`) },
    });
    const expectedFailures = variant === 'before' ? failures : 0;
    assert.equal(run.status, expectedFailures ? 1 : 0, `${fixture}/${variant}\n${run.stdout}\n${run.stderr}`);
    assert.match(run.stdout, new RegExp(`# tests ${tests}\\b`));
    assert.match(run.stdout, new RegExp(`# fail ${expectedFailures}\\b`), run.stdout);
    const measurements = [...run.stdout.matchAll(/MEASUREMENT (\{.+\})/g)].map(match => JSON.parse(match[1]));
    results.push({ fixture, variant, tests, expected_failures: expectedFailures, verified: true, measurements });
    console.log(`${fixture}/${variant}: ${tests} tests; ${expectedFailures} expected failures verified.`);
  }
}
const collections = spawnSync(process.execPath, ['--test', '--test-reporter=tap', 'examples/collections/contract.test.mjs'], {
  cwd: root, encoding: 'utf8', timeout: 30_000,
  env: { ...process.env, FIXTURE_ENTRY: resolve(root, 'examples/.build/collections/app.js') },
});
assert.equal(collections.status, 0, `collections\n${collections.stdout}\n${collections.stderr}`);
assert.match(collections.stdout, /# tests 15\b/);
assert.match(collections.stdout, /# fail 0\b/);
results.push({ fixture: 'collections', variant: 'single', tests: 15, expected_failures: 0, verified: true, measurements: [] });
console.log('collections: 15 tests; 0 failures verified.');
await mkdir(resolve(root, 'evals/.runs'), { recursive: true });
await writeFile(resolve(root, 'evals/.runs/fixtures.json'), JSON.stringify({ kind: 'fixture-correctness', results }, null, 2) + '\n');
console.log('Fixture correctness verified. This does not measure agent performance.');
