import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { tasks, prepareRun, executeRun, repository } from './runner.mjs';
import { applyReview, emptyBehavior, parseEvents, summarize } from './lib.mjs';

const [action, ...args] = process.argv.slice(2);
const options = {};
for (let i = 0; i < args.length; i += 2) {
  if (!args[i]?.startsWith('--') || !args[i + 1] || args[i + 1].startsWith('--')) throw new Error('Options require --name value pairs');
  options[args[i].slice(2)] = args[i + 1];
}
if (action === 'pilot') {
  if (process.env.CI) throw new Error('Model runs are disabled in ordinary CI. Run the pilot explicitly outside CI.');
  for (const name of ['baseline', 'candidate', 'model', 'reasoning', 'output']) {
    if (!options[name]) throw new Error(`Missing --${name}`);
  }
  const output = resolve(options.output);
  await mkdir(dirname(output), { recursive: true });
  await mkdir(output); // Exclusive: preserve all evidence on accidental rerun.
  const results = [];
  let blocked = null;
  const cliVersion = spawnSync('codex', ['--version'], { encoding: 'utf8' });
  await writeFile(join(output, 'environment.json'), JSON.stringify({ node: process.version, cli: cliVersion.stdout?.trim(),
    model: options.model, reasoning: options.reasoning, baseline: options.baseline, candidate: options.candidate,
    order: 'task-major, baseline then candidate', started_at: new Date().toISOString() }, null, 2) + '\n');
  for (const task of tasks) {
    for (const variant of ['baseline', 'candidate']) {
      console.log(`Preparing ${task.id}/${variant}`);
      const run = await prepareRun({ task: task.id, variant, ref: options[variant], output, model: options.model, reasoning: options.reasoning });
      let result;
      if (blocked) {
        result = { schema_version: 1, task: task.id, variant, model: run.model, reasoning_effort: run.reasoning_effort,
          skill_hash: run.skill_hash, fixture_hash: run.fixture_hash, duration_ms: null, commands: null,
          status: 'not-run', tokens: parseEvents('').tokens, behavior: emptyBehavior(blocked), execution_error: blocked };
        await writeFile(join(run.directory, 'result.json'), JSON.stringify(result, null, 2) + '\n');
      } else {
        console.log(`Running ${task.id}/${variant}`);
        result = await executeRun(run);
        // A tool failure is not evidence about the skill. Stop instead of spending five more runs on the same infrastructure block.
        if (result.status !== 'completed') blocked = `Pilot stopped after ${task.id}/${variant} execution failed; inspect its stderr.log and events.jsonl.`;
      }
      results.push(result);
      await writeFile(join(output, 'results.json'), JSON.stringify(results, null, 2) + '\n');
      console.log(`${task.id}/${variant}: ${result.status}; tokens ${JSON.stringify(result.tokens)}`);
    }
  }
  console.log(JSON.stringify(summarize(results), null, 2));
} else if (action === 'grade') {
  if (!options.output) throw new Error('Missing --output');
  const output = resolve(options.output);
  const results = JSON.parse(await readFile(join(output, 'results.json'), 'utf8'));
  for (const result of results) {
    if (result.status !== 'completed') continue;
    const directory = join(output, `${result.task}-${result.variant}`);
    const workspace = join(directory, 'workspace');
    const build = spawnSync(process.execPath, [join(repository, 'node_modules/typescript/bin/tsc'), '-p', 'tsconfig.json'], { cwd: workspace, encoding: 'utf8' });
    let contract = { status: null, stdout: '', stderr: 'Build failed' };
    if (build.status === 0) contract = spawnSync(process.execPath, ['--test', '--test-reporter=tap', join(repository, 'examples', result.task, 'contract.test.mjs')], {
      cwd: workspace, encoding: 'utf8', timeout: 30_000,
      env: { ...process.env, FIXTURE_ENTRY: join(workspace, 'build/app.js') },
    });
    await writeFile(join(directory, 'contract.log'), `${build.stdout}${build.stderr}\n${contract.stdout}${contract.stderr}`);
    result.contract = { build_passed: build.status === 0, exit_code: contract.status,
      tests: Number(contract.stdout.match(/# tests (\d+)/)?.[1] ?? 0),
      failures: Number(contract.stdout.match(/# fail (\d+)/)?.[1] ?? 0),
      meaning: result.task === 'module-boundary' ? 'Seed remains unchanged during a read-only audit; review findings manually.' : 'Held-out contract checks; combine with independent behavior review.' };
  }
  await writeFile(join(output, 'results.json'), JSON.stringify(results, null, 2) + '\n');
  console.log('Contract checks recorded. Read each response, command log, and diff before grading behavior.');
} else if (action === 'summarize') {
  if (!options.output) throw new Error('Missing --output');
  const output = resolve(options.output);
  const results = JSON.parse(await readFile(join(output, 'results.json'), 'utf8'));
  if (options.review) {
    const reviews = JSON.parse(await readFile(resolve(options.review), 'utf8'));
    for (let index = 0; index < results.length; index++) {
      const result = results[index];
      const review = reviews[`${result.task}/${result.variant}`];
      if (review) results[index] = applyReview(result, review);
    }
  }
  const summary = summarize(results);
  await writeFile(join(output, 'reviewed-results.json'), JSON.stringify(results, null, 2) + '\n');
  await writeFile(join(output, 'summary.json'), JSON.stringify(summary, null, 2) + '\n');
  console.log(JSON.stringify(summary, null, 2));
} else {
  throw new Error('Use pilot, grade, or summarize. See evals/README.md.');
}
