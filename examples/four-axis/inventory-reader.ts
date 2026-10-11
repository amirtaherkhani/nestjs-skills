export interface StockSnapshot { tenant: string; sku: string; quantity: number }
// Consumer promise: exact tenant+SKU lookup, undefined on absence, isolated snapshots.
export interface InventoryReader {
  find(tenant: string, sku: string): StockSnapshot | undefined;
}
const seed = (): StockSnapshot[] => [
  { tenant: 'north', sku: 'BOOK', quantity: 2 },
  { tenant: 'south', sku: 'BOOK', quantity: 7 },
];
export class ArrayInventory implements InventoryReader {
  private readonly rows = seed();
  find(tenant: string, sku: string) {
    const row = this.rows.find(row => row.tenant === tenant && row.sku === sku);
    return row ? { ...row } : undefined;
  }
}
export class MapInventory implements InventoryReader {
  private readonly rows = new Map(seed().map(row => [row.tenant + ':' + row.sku, row]));
  find(tenant: string, sku: string) {
    const row = this.rows.get(tenant + ':' + sku);
    return row ? { ...row } : undefined;
  }
}
// Deliberately type-compatible, behaviorally incompatible teaching control.
export class AliasingInventory implements InventoryReader {
  private readonly rows = seed();
  find(tenant: string, sku: string) {
    return this.rows.find(row => row.tenant === tenant && row.sku === sku);
  }
}
