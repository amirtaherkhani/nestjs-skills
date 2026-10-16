import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { rm } from 'node:fs/promises';
const root = fileURLToPath(new URL('..', import.meta.url));
await rm(new URL('../examples/.build/runtime-contracts/', import.meta.url), { recursive: true, force: true });
const build = spawnSync(process.execPath, ['node_modules/typescript/bin/tsc', '-p', 'examples/runtime-contracts/tsconfig.json'], {
  cwd: root, encoding: 'utf8', timeout: 30_000,
});
assert.equal(build.status, 0, build.stdout + build.stderr);
const tests = spawnSync(process.execPath, ['--test', 'examples/runtime-contracts/contract.test.mjs'], {
  cwd: root, stdio: 'inherit', timeout: 30_000,
});
assert.equal(tests.status, 0, 'Runtime contracts failed: ' + (tests.error ?? tests.status));
