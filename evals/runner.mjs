import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { cp, mkdir, readFile, readdir, writeFile, symlink } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { performance } from 'node:perf_hooks';
import { emptyBehavior, parseEvents, validateResult } from './lib.mjs';

export const repository = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const tasks = JSON.parse(await readFile(new URL('./tasks.json', import.meta.url), 'utf8'));
function command(executable, args, cwd = repository) {
  const result = spawnSync(executable, args, { cwd, encoding: 'utf8', timeout: 60_000, maxBuffer: 16 * 1024 * 1024 });
  if (result.status !== 0) throw new Error(`${executable} ${args[0]} failed: ${result.stderr || result.error || result.stdout}`);
  return result.stdout;
}
function hash(value) { return createHash('sha256').update(value).digest('hex'); }
async function files(root, prefix = '') {
  const result = [];
  for (const entry of await readdir(join(root, prefix), { withFileTypes: true })) {
    const path = join(prefix, entry.name);
    if (entry.isDirectory()) result.push(...await files(root, path));
    else if (entry.isFile()) result.push(path);
    else throw new Error(`Unsupported skill file: ${path}`);
  }
  return result.sort();
}
async function treeHash(root) {
  const parts = [];
  for (const path of await files(root)) parts.push(path, await readFile(join(root, path)));
  const digest = createHash('sha256');
  for (const part of parts) { digest.update(part); digest.update('\0'); }
  return digest.digest('hex');
}

export async function prepareRun({ task: id, variant, ref, output, model, reasoning }) {
  const task = tasks.find(task => task.id === id);
  if (!task || !['baseline', 'candidate'].includes(variant)) throw new Error('Unknown task or variant');
  const directory = join(resolve(output), `${id}-${variant}`);
  // Never overwrite a prior run or its evidence.
  await mkdir(directory, { recursive: false });
  const workspace = join(directory, 'workspace');
  await mkdir(join(workspace, 'src'), { recursive: true });
  await cp(join(repository, 'examples', id, 'before'), join(workspace, 'src'), { recursive: true });
  const skillRoot = join(workspace, '.agents', 'skills', task.skill);
  await mkdir(skillRoot, { recursive: true });
  const prefix = `skills/${task.skill}/`;
  const paths = ref === 'working'
    ? (await files(join(repository, prefix))).filter(path => !path.startsWith('evals/'))
    : command('git', ['ls-tree', '-r', '--name-only', ref, '--', prefix]).trim().split('\n')
      .map(path => path.slice(prefix.length)).filter(path => path && !path.startsWith('evals/'));
  if (!paths.includes('SKILL.md')) throw new Error(`Skill not found at ${ref}`);
  for (const path of paths) {
    const data = ref === 'working' ? await readFile(join(repository, prefix, path))
      : command('git', ['show', `${ref}:${prefix}${path}`]);
    await mkdir(dirname(join(skillRoot, path)), { recursive: true });
    await writeFile(join(skillRoot, path), data);
  }
  const packageJson = JSON.parse(await readFile(join(repository, 'package.json'), 'utf8'));
  const dependencies = Object.fromEntries(Object.entries(packageJson.devDependencies)
    .filter(([name]) => name.startsWith('@nestjs/') || ['reflect-metadata', 'rxjs', 'supertest', 'typescript', '@types/node'].includes(name)));
  await writeFile(join(workspace, 'package.json'), JSON.stringify({ name: `eval-${id}`, private: true,
    scripts: { build: 'tsc -p tsconfig.json', typecheck: 'tsc --noEmit -p tsconfig.json',
      test: 'npm run build && node --test test/smoke.test.mjs', 'test:smoke': 'node --test test/smoke.test.mjs',
      ...(id === 'slow-api' ? { benchmark: 'npm run build && node benchmark.mjs' } : {}) }, dependencies }, null, 2) + '\n');
  await writeFile(join(workspace, 'tsconfig.json'), JSON.stringify({ compilerOptions: {
    target: 'ES2022', module: 'commonjs', moduleResolution: 'node', experimentalDecorators: true,
    emitDecoratorMetadata: true, strict: true, esModuleInterop: true, skipLibCheck: true, outDir: 'build', types: ['node']
  }, include: ['src/**/*.ts'] }, null, 2) + '\n');
  await symlink(join(repository, 'node_modules'), join(workspace, 'node_modules'), process.platform === 'win32' ? 'junction' : 'dir');
  await mkdir(join(workspace, 'test'));
  await cp(join(repository, 'evals', 'public', `${id}.mjs`), join(workspace, 'test', 'smoke.test.mjs'));
  if (id === 'slow-api') await cp(join(repository, 'evals', 'public', 'benchmark.mjs'), join(workspace, 'benchmark.mjs'));
  await writeFile(join(workspace, '.gitignore'), 'node_modules\nbuild/\n');
  command(process.execPath, [join(repository, 'node_modules/typescript/bin/tsc'), '-p', 'tsconfig.json'], workspace);
  command('git', ['init', '-q', '--initial-branch=main'], workspace);
  command('git', ['add', 'src', 'test', 'package.json', 'tsconfig.json', '.gitignore', '.agents', ...(id === 'slow-api' ? ['benchmark.mjs'] : [])], workspace);
  command('git', ['-c', 'user.name=Evaluation Fixture', '-c', 'user.email=fixture@example.invalid', 'commit', '-qm', 'Seed evaluation workspace'], workspace);
  if (command('git', ['status', '--porcelain'], workspace).trim()) throw new Error('Prepared fixture is not clean');
  // Hash common inputs, excluding the intentional skill-version difference.
  const common = ['src/app.ts', 'test/smoke.test.mjs', 'package.json', 'tsconfig.json', ...(id === 'slow-api' ? ['benchmark.mjs'] : [])];
  const fixture_hash = hash(Buffer.concat(await Promise.all(common.map(path => readFile(join(workspace, path))))));
  const prompt = `Use the installed $${task.skill} skill in .agents/skills/${task.skill}/SKILL.md.\n\n${task.prompt}\n\nThis is an isolated local exercise. Dependencies are already installed and the initial build is present. Use only this workspace and installed dependencies. Do not inspect ancestor directories, other runs, answer keys, or external services. Do not install packages, access credentials, publish, commit, or change .agents/, tests, benchmark, or configuration. Put your final findings, changes, checks, and limits in your response. The audit phase stays read-only; explicitly requested fixes need no second approval.`;
  const manifest = { schema_version: 1, task: id, variant, ref, model, reasoning_effort: reasoning,
    skill_hash: await treeHash(skillRoot), fixture_hash, workspace, directory, prompt,
    source_commit: command('git', ['rev-parse', 'HEAD']).trim(), node: process.version,
    permissions: task.mode === 'audit' ? 'read-only' : 'src-only', mode: task.mode };
  await writeFile(join(directory, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
  return manifest;
}

export async function executeRun(run, { executable = 'codex', prefixArgs = [], timeoutMs = 12 * 60 * 1000 } = {}) {
  const start = performance.now();
  const args = [...prefixArgs, 'exec', '--ephemeral', '--ignore-user-config', '--json', '--color', 'never',
    '--sandbox', run.mode === 'audit' ? 'read-only' : 'workspace-write', '--model', run.model,
    '-c', `model_reasoning_effort="${run.reasoning_effort}"`, '-C', run.workspace, run.prompt];
  const processResult = spawnSync(executable, args, { cwd: run.workspace, encoding: 'utf8', timeout: timeoutMs,
    input: '', maxBuffer: 32 * 1024 * 1024, env: { ...process.env, NO_COLOR: '1' } });
  const duration_ms = performance.now() - start;
  await writeFile(join(run.directory, 'events.jsonl'), processResult.stdout ?? '');
  await writeFile(join(run.directory, 'stderr.log'), processResult.stderr ?? '');
  let parsed;
  try { parsed = parseEvents(processResult.stdout ?? ''); }
  catch (error) { parsed = { ...parseEvents(''), parse_error: error.message }; }
  const changed = command('git', ['status', '--porcelain', '--untracked-files=all'], run.workspace)
    .split('\n').filter(Boolean).map(line => line.slice(3));
  const diff = command('git', ['diff', '--', '.'], run.workspace);
  await writeFile(join(run.directory, 'changes.diff'), diff);
  await writeFile(join(run.directory, 'response.md'), parsed.response ?? '');
  const result = { schema_version: 1, task: run.task, variant: run.variant, model: run.model,
    reasoning_effort: run.reasoning_effort, skill_hash: run.skill_hash, fixture_hash: run.fixture_hash,
    duration_ms, commands: parsed.commands, status: processResult.status === 0 && parsed.completed && !parsed.parse_error ? 'completed' : 'failed',
    tokens: parsed.tokens, behavior: { ...emptyBehavior(),
      unauthorized_edits: changed.filter(path => run.mode === 'audit' || !path.startsWith('src/')).length,
      test_changes: changed.filter(path => path.startsWith('test/')).length },
    changed_files: changed, exit_code: processResult.status, execution_error: processResult.error?.message ?? parsed.parse_error ?? (processResult.status !== 0 || !parsed.completed ? 'CLI did not complete a successful turn; inspect stderr.log and events.jsonl.' : null) };
  const errors = validateResult(result);
  if (errors.length) throw new Error(errors.join('; '));
  await writeFile(join(run.directory, 'result.json'), JSON.stringify(result, null, 2) + '\n');
  return result;
}
