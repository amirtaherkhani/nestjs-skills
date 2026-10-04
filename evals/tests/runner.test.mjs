import assert from 'node:assert/strict';
import { mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { prepareRun, executeRun } from '../runner.mjs';

test('preparation withholds the answer key and evaluation expectations', async () => {
  const root = await mkdtemp(join(tmpdir(), 'skill-pilot-test-'));
  try {
    const run = await prepareRun({ task: 'module-boundary', variant: 'candidate', ref: 'working', output: root, model: 'test-model', reasoning: 'xhigh' });
    assert.equal(run.fixture_hash.length, 64);
    assert.equal(run.skill_hash.length, 64);
    assert.deepEqual((await readdir(join(run.workspace, 'src'))).sort(), ['app.ts']);
    assert.ok((await readFile(join(run.workspace, '.agents/skills/nestjs-code-audit/references/semantic-review.md'), 'utf8')).includes('Standalone'));
    await assert.rejects(readdir(join(run.workspace, '.agents/skills/nestjs-code-audit/evals')));
    await assert.rejects(readdir(join(run.workspace, 'after')));
    await assert.rejects(readFile(join(run.workspace, 'contract.test.mjs')));
    assert.match(run.prompt, /Do not edit/);
    await assert.rejects(prepareRun({ task: 'module-boundary', variant: 'candidate', ref: 'working', output: root, model: 'test-model', reasoning: 'xhigh' }), /exists/);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test('failed executor preserves evidence and never reports behavior success', async () => {
  const root = await mkdtemp(join(tmpdir(), 'skill-pilot-failure-'));
  try {
    const run = await prepareRun({ task: 'boolean-query', variant: 'baseline', ref: 'working', output: root, model: 'test-model', reasoning: 'xhigh' });
    const cli = join(root, 'fake-codex');
    await writeFile(cli, 'console.log(JSON.stringify({type:"turn.failed",error:{message:"test failure"}}));process.exitCode=1;\n');
    const result = await executeRun(run, { executable: process.execPath, prefixArgs: [cli], timeoutMs: 5000 });
    assert.equal(result.status, 'failed');
    assert.equal(result.tokens.input, null);
    assert.equal(result.behavior.pass, null);
    assert.equal(result.behavior.test_changes, 0);
    assert.equal(result.behavior.unauthorized_edits, 0);
    assert.match(await readFile(join(run.directory, 'events.jsonl'), 'utf8'), /turn.failed/);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test('an existing pilot output is rejected before any evidence is overwritten', async () => {
  const root = await mkdtemp(join(tmpdir(), 'skill-pilot-existing-'));
  try {
    const evidence = join(root, 'environment.json');
    await writeFile(evidence, 'original evidence');
    await (await import('node:fs/promises')).mkdir(join(root, 'boolean-query-baseline'));
    const run = spawnSync(process.execPath, [fileURLToPath(new URL('../run.mjs', import.meta.url)), 'pilot',
      '--baseline', 'HEAD', '--candidate', 'working', '--model', 'test-model', '--reasoning', 'xhigh', '--output', root],
      { encoding: 'utf8', env: { ...process.env, CI: '' } });
    assert.notEqual(run.status, 0);
    assert.equal(await readFile(evidence, 'utf8'), 'original evidence');
  } finally { await rm(root, { recursive: true, force: true }); }
});
