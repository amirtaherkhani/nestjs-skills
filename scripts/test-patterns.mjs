import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const catalog = await readFile(resolve(root, 'skills/nestjs-oop-design-patterns/references/pattern-catalog.md'), 'utf8');
const expected = [
  'strategy', 'factory', 'builder', 'adapter', 'bridge', 'facade', 'layered-flow',
  'decorator', 'proxy', 'observer', 'command', 'template-method', 'chain',
  'repository', 'provider-lifetime', 'unit-of-work', 'specification', 'outbox', 'saga',
];
const snippets = [...catalog.matchAll(/<!-- runnable: ([a-z-]+) -->\n\n```typescript\n([\s\S]*?)\n```/g)];
assert.deepEqual(snippets.map(match => match[1]), expected, 'Every catalog entry needs its executable example.');
const source = resolve(root, 'examples/.build/patterns-src');
const output = resolve(root, 'examples/.build/patterns');
await rm(source, { recursive: true, force: true });
await rm(output, { recursive: true, force: true });
await mkdir(source, { recursive: true });
for (const [, name, code] of snippets) await writeFile(resolve(source, `${name}.ts`), `${code}\n`);
await writeFile(resolve(source, 'tsconfig.json'), JSON.stringify({
  extends: '../../tsconfig.json',
  compilerOptions: { rootDir: '.', outDir: '../patterns', noEmitOnError: true },
  include: ['*.ts'],
}));
const build = spawnSync(process.execPath, ['node_modules/typescript/bin/tsc', '-p', source], {
  cwd: root, encoding: 'utf8', timeout: 30_000,
});
assert.equal(build.status, 0, build.stdout + build.stderr);
console.log(`Compiled all ${snippets.length} catalog examples from their published code blocks.`);
const tests = spawnSync(process.execPath, ['--test', 'examples/design-patterns/contract.test.mjs'], {
  cwd: root, stdio: 'inherit', timeout: 30_000,
});
assert.equal(tests.status, 0, `Pattern contracts failed: ${tests.error ?? tests.signal ?? tests.status}`);
