import { readFileSync } from 'node:fs';
import Ajv from 'ajv';

const schema = JSON.parse(readFileSync(new URL('./result.schema.json', import.meta.url), 'utf8'));
const validate = new Ajv({ allErrors: true }).compile(schema);
export function validateResult(result) {
  return validate(result) ? [] : validate.errors.map(error => `${error.instancePath}: ${error.message}`);
}
export function emptyBehavior(reason = 'Not reviewed; fixture tests alone do not measure agent impact.') {
  return { pass: null, seeded_defects_found: null, false_findings: null, duplicates: null,
    unauthorized_edits: null, test_changes: null, unsupported_claims: null, reason };
}
export function parseEvents(jsonl) {
  const events = jsonl.split('\n').filter(line => line.trim()).map(line => JSON.parse(line));
  const turns = events.filter(event => event.type === 'turn.completed');
  const keys = { input: 'input_tokens', cached: 'cached_input_tokens', output: 'output_tokens', reasoning: 'reasoning_output_tokens' };
  const tokens = Object.fromEntries(Object.entries(keys).map(([name, key]) => {
    const values = turns.map(turn => turn.usage?.[key]);
    return [name, values.length && values.every(value => Number.isInteger(value) && value >= 0)
      ? values.reduce((sum, value) => sum + value, 0) : null];
  }));
  const missing = Object.keys(keys).filter(key => tokens[key] === null);
  tokens.unavailable_reason = missing.length ? `CLI did not report ${missing.join(', ')} tokens.` : null;
  const items = events.filter(event => event.type === 'item.completed').map(event => event.item);
  return { tokens, commands: items.filter(item => item?.type === 'command_execution').length,
    completed: turns.length > 0 && !events.some(event => event.type === 'turn.failed'),
    response: items.filter(item => item?.type === 'agent_message').map(item => item.text ?? '').join('\n\n') };
}
export function summarize(results) {
  const seen = new Set();
  const pairs = new Map();
  for (const result of results) {
    const errors = validateResult(result);
    if (errors.length) throw new Error(`Invalid result: ${errors.join('; ')}`);
    const key = `${result.task}/${result.variant}`;
    if (seen.has(key)) throw new Error(`Duplicate result: ${key}`);
    seen.add(key);
    const paired = pairs.get(result.task);
    if (paired && ['model', 'reasoning_effort', 'fixture_hash'].some(field => paired[field] !== result[field])) {
      throw new Error(`Comparison mismatch: ${result.task}`);
    }
    pairs.set(result.task, result);
  }
  const tokens = Object.fromEntries(['input', 'cached', 'output', 'reasoning'].map(key => [key,
    results.length && results.every(result => result.tokens[key] !== null)
      ? results.reduce((sum, result) => sum + result.tokens[key], 0) : null]));
  return { runs: results.length, completed: results.filter(result => result.status === 'completed').length,
    failed: results.filter(result => result.status === 'failed').length,
    not_run: results.filter(result => result.status === 'not-run').length,
    behavior_passed: results.filter(result => result.behavior.pass === true).length,
    behavior_failed: results.filter(result => result.behavior.pass === false).length,
    behavior_unreviewed: results.filter(result => result.behavior.pass === null).length,
    tokens, conclusion: 'Three paired tasks are a pilot, not evidence of general quality or token savings.' };
}

export function applyReview(result, review) {
  for (const key of ['unauthorized_edits', 'test_changes']) {
    const observed = result.behavior[key];
    if (observed !== null && review[key] !== undefined && (review[key] === null || review[key] < observed)) {
      throw new Error(`Review cannot erase observed ${key}`);
    }
  }
  return { ...result, behavior: { ...result.behavior, ...review } };
}
