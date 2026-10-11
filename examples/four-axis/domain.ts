// This project's domain rule forbids Nest, HTTP and persistence imports here.
export class StockUnavailable extends Error {}
export class InventoryItem {
  constructor(readonly sku: string, private remaining: number) {
    if (!/^[A-Z]+$/.test(sku) || !Number.isSafeInteger(remaining) || remaining < 0) {
      throw new Error('Invalid inventory state');
    }
  }
  reserve(quantity: number) {
    if (!Number.isSafeInteger(quantity) || quantity <= 0 || quantity > this.remaining) {
      throw new StockUnavailable('Reservation exceeds available stock');
    }
    this.remaining -= quantity;
    return { sku: this.sku, remaining: this.remaining };
  }
  snapshot() { return { sku: this.sku, remaining: this.remaining }; }
}
