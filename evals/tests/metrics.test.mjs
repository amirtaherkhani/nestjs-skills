import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseEvents, summarize, validateResult } from '../lib.mjs';

const event = value => JSON.stringify(value);
test('uses reported usage and command events without guessing reasoning tokens', () => {
  const result = parseEvents([
    event({ type: 'item.completed', item: { type: 'command_execution', command: 'npm test', exit_code: 0 } }),
    event({ type: 'turn.completed', usage: { input_tokens: 120, cached_input_tokens: 30, output_tokens: 42 } }),
  ].join('\n'));
  assert.deepEqual(result.tokens, { input: 120, cached: 30, output: 42, reasoning: null, unavailable_reason: 'CLI did not report reasoning tokens.' });
  assert.equal(result.commands, 1);
  assert.equal(result.completed, true);
});
test('missing usage remains null and interrupted output never becomes success', () => {
  const result = parseEvents(event({ type: 'thread.started', thread_id: 'local' }));
  assert.equal(result.tokens.input, null);
  assert.match(result.tokens.unavailable_reason, /did not report/);
  assert.equal(result.completed, false);
});
test('malformed events are rejected rather than silently dropped', () => {
  assert.throws(() => parseEvents('{invalid'), /JSON/);
});
test('partial usage is recorded per field and not fabricated', () => {
  const result = parseEvents(event({ type: 'turn.completed', usage: { input_tokens: 4 } }));
  assert.equal(result.tokens.input, 4);
  assert.equal(result.tokens.cached, null);
  assert.equal(result.tokens.output, null);
});
test('summary separates not-run, failed and passed behavior and refuses mismatched pairs', () => {
  const make = (variant, status) => ({ schema_version: 1, task: 'boolean-query', variant,
    model: 'same-model', reasoning_effort: 'xhigh', skill_hash: 'a'.repeat(64), fixture_hash: 'b'.repeat(64),
    duration_ms: 10, commands: 2, status, tokens: { input: null, cached: null, output: null, reasoning: null, unavailable_reason: 'not reported' },
    behavior: { pass: null, seeded_defects_found: null, false_findings: null, duplicates: null, unauthorized_edits: null, test_changes: null, unsupported_claims: null, reason: 'Not reviewed' } });
  const rows = [make('baseline', 'not-run'), make('candidate', 'completed')];
  assert.equal(validateResult(rows[0]).length, 0);
  const report = summarize(rows);
  assert.equal(report.completed, 1);
  assert.equal(report.behavior_passed, 0);
  assert.equal(report.behavior_unreviewed, 2);
  assert.equal(report.tokens.input, null);
  assert.throws(() => summarize([...rows, rows[0]]), /Duplicate/);
  assert.throws(() => summarize([rows[0], { ...rows[1], model: 'other-model' }]), /mismatch/);
  assert.throws(() => summarize([rows[0], { ...rows[1], fixture_hash: 'c'.repeat(64) }]), /mismatch/);
  assert.ok(validateResult({ ...rows[0], tokens: { ...rows[0].tokens, input: -1 } }).length);
});

test('an unexecuted or unreviewed run cannot become a behavior pass', () => {
  const row = { schema_version: 1, task: 'boolean-query', variant: 'baseline', model: 'model', reasoning_effort: 'xhigh',
    skill_hash: 'a'.repeat(64), fixture_hash: 'b'.repeat(64), duration_ms: null, commands: null, status: 'not-run',
    tokens: { input: null, cached: null, output: null, reasoning: null, unavailable_reason: 'not run' },
    behavior: { pass: true, seeded_defects_found: 1, false_findings: 0, duplicates: 0, unauthorized_edits: 0, test_changes: 0, unsupported_claims: 0, reason: 'claimed pass' } };
  assert.ok(validateResult(row).length);
  assert.ok(validateResult({ ...row, status: 'completed', behavior: { ...row.behavior, false_findings: null } }).length);
});

test('review may add observed violations but cannot erase them', async () => {
  const { applyReview } = await import('../lib.mjs');
  const row = { status: 'completed', behavior: { unauthorized_edits: 1, test_changes: 1, pass: null } };
  assert.throws(() => applyReview(row, { unauthorized_edits: 0 }), /erase/);
  assert.throws(() => applyReview(row, { test_changes: 0 }), /erase/);
  assert.equal(applyReview(row, { unauthorized_edits: 2 }).behavior.unauthorized_edits, 2);
});
