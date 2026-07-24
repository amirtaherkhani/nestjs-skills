import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { chmod, mkdir, mkdtemp, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const repositoryRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const collector = join(
  repositoryRoot,
  'skills',
  'nestjs-code-audit',
  'scripts',
  'collect-quality-evidence.mjs',
);
const fixture = await mkdtemp(join(tmpdir(), 'nestjs-code-audit-'));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function run(args, cwd = fixture) {
  return spawnSync(process.execPath, [collector, ...args], {
    cwd,
    encoding: 'utf8',
    timeout: 10_000,
  });
}

try {
  await mkdir(join(fixture, 'src', 'payments'), { recursive: true });
  await mkdir(join(fixture, 'node_modules', '.bin'), { recursive: true });
  await writeFile(join(fixture, 'package.json'), JSON.stringify({
    name: 'audit-fixture',
    packageManager: 'npm@10.0.0',
    dependencies: { '@nestjs/core': '^11.0.0' },
    devDependencies: { typescript: '^5.8.0', eslint: '^9.0.0' },
    scripts: {
      prelint: "node -e \"require('node:fs').writeFileSync('unsafe-hook-ran', '')\"",
      lint: 'eslint . --fix',
      test: 'jest -u'
    },
  }, null, 2));
  await writeFile(join(fixture, 'tsconfig.json'), JSON.stringify({ compilerOptions: { strict: true } }));
  await writeFile(join(fixture, 'src', 'main.ts'), [
    "import { forwardRef } from '@nestjs/common';",
    'export const cycle = forwardRef(() => class ExampleModule {});',
    '',
  ].join('\n'));
  await writeFile(join(fixture, 'src', 'payments', 'payment.ts'), 'export const amount: number = 1;\n');

  const fakeCheck = '#!/usr/bin/env node\nprocess.exit(0);\n';
  for (const binary of ['eslint', 'tsc']) {
    const path = join(fixture, 'node_modules', '.bin', binary);
    await writeFile(path, fakeCheck);
    await chmod(path, 0o755);
  }

  const inventory = run(['--root', fixture]);
  assert(inventory.status === 0, `Inventory failed: ${inventory.stderr}`);
  const inventoryJson = JSON.parse(inventory.stdout);
  assert(inventoryJson.project.nestjs === true, 'NestJS dependency was not detected.');
  assert(inventoryJson.readOnlyContract === true, 'Read-only contract is missing.');
  assert(inventoryJson.checks.every((check) => check.status === 'not-run'), 'Checks ran without --run.');
  assert(inventoryJson.reviewCandidates.some((item) => item.signal === 'forward-ref'), 'Expected review signal was not collected.');

  const checked = run(['--root', fixture, '--scope', 'src/payments', '--run']);
  assert(checked.status === 0, `Checks failed to execute: ${checked.stderr}`);
  const checkedJson = JSON.parse(checked.stdout);
  assert(checkedJson.scope === 'src/payments', 'Relative scope was not preserved.');
  assert(checkedJson.checks.every((check) => check.status === 'pass'), 'Allow-listed checks did not pass.');
  assert(checkedJson.checks.find((check) => check.id === 'lint')?.scope === 'src/payments', 'Lint was not scoped.');
  assert(checkedJson.checks.find((check) => check.id === 'typescript')?.scope === '.', 'TypeScript scope should be repository-wide.');
  assert(!existsSync(join(fixture, 'unsafe-hook-ran')), 'A package lifecycle hook was executed.');

  const escaped = run(['--root', fixture, '--scope', '..']);
  assert(escaped.status === 2, 'A scope outside the repository was not rejected.');
  assert(escaped.stderr.includes('escapes repository root'), 'Scope rejection was not explained.');

  const external = await mkdtemp(join(tmpdir(), 'nestjs-code-audit-external-'));
  await symlink(external, join(fixture, 'linked-outside'));
  const linkedEscape = run(['--root', fixture, '--scope', 'linked-outside']);
  assert(linkedEscape.status === 2, 'A symlink scope outside the repository was not rejected.');
  assert(linkedEscape.stderr.includes('resolves outside repository root'), 'Symlink rejection was not explained.');
  await rm(external, { recursive: true, force: true });

  process.stdout.write('NestJS code-audit collector tests passed.\n');
} finally {
  await rm(fixture, { recursive: true, force: true });
}
