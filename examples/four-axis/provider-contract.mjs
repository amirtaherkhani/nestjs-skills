import assert from 'node:assert/strict';

// Shared behavioral suite: use this same promise against each real adapter.
export function inventoryContract(create) {
  const reader = create();
  assert.deepEqual(reader.find('north', 'BOOK'), { tenant: 'north', sku: 'BOOK', quantity: 2 });
  assert.equal(reader.find('south', 'BOOK').quantity, 7);
  assert.equal(reader.find('unknown', 'BOOK'), undefined);
  assert.equal(reader.find('north', 'missing'), undefined);
  const snapshot = reader.find('north', 'BOOK');
  snapshot.quantity = 999;
  assert.equal(reader.find('north', 'BOOK').quantity, 2, 'a returned snapshot must not mutate stored inventory');
}
