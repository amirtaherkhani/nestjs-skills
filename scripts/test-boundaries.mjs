import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const compile = spawnSync(process.execPath, ['node_modules/typescript/bin/tsc', '-p', 'examples/four-axis/tsconfig.json'], {
  cwd: root, encoding: 'utf8', timeout: 30_000,
});
assert.equal(compile.status, 0, compile.stdout + compile.stderr);
const tests = spawnSync(process.execPath, ['--test', 'examples/four-axis/contract.test.mjs'], {
  cwd: root, stdio: 'inherit', timeout: 30_000,
});
assert.equal(tests.status, 0, 'Four-axis boundary contracts failed: ' + (tests.error ?? tests.status));
