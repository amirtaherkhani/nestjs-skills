import assert from 'node:assert/strict';
import test from 'node:test';
import { DefaultValuePipe, ParseBoolPipe } from '@nestjs/common';

test('Nest 11 boolean query parsing accepts only true and false strings', async () => {
  const parseBoolean = new ParseBoolPipe();

  assert.equal(await parseBoolean.transform('true'), true);
  assert.equal(await parseBoolean.transform('false'), false);
  await assert.rejects(() => parseBoolean.transform('yes'));
  await assert.rejects(() => parseBoolean.transform('false '));
});

test('Nest 11 applies a missing-value default before strict boolean parsing', async () => {
  const defaultValue = new DefaultValuePipe(false);
  const parseBoolean = new ParseBoolPipe();

  assert.equal(await parseBoolean.transform(defaultValue.transform(undefined)), false);
});

test('JavaScript truthiness does not parse the string false as boolean false', () => {
  assert.equal(Boolean('false'), true);
});
