import 'reflect-metadata';
import { Inject, Injectable, Module, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

export const STOCK_READER = Symbol('inventory.stock-reader');
// The consumer needs a query, not mutation/admin methods.
export interface StockReader { available(sku: string): Promise<number> }
@Injectable()
export class LocalStock implements StockReader {
  async available(sku: string): Promise<number> { return sku === 'book' ? 3 : 0; }
}
@Injectable()
export class CanReserve {
  constructor(@Inject(STOCK_READER) private readonly stock: StockReader) {}
  async execute(sku: string, quantity: number): Promise<boolean> {
    if (!sku || !Number.isSafeInteger(quantity) || quantity <= 0) throw new Error('Invalid reservation');
    const count = await this.stock.available(sku);
    if (!Number.isSafeInteger(count) || count < 0) throw new Error('Invalid stock response');
    return count >= quantity;
  }
}
@Injectable()
export class SharedCounter { value = 0; }
@Injectable({ scope: Scope.TRANSIENT })
export class ConsumerCounter { value = 0; }
@Injectable()
export class ConsumerA {
  constructor(readonly shared: SharedCounter, readonly own: ConsumerCounter) {}
}
@Injectable()
export class ConsumerB {
  constructor(readonly shared: SharedCounter, readonly own: ConsumerCounter) {}
}
@Injectable({ scope: Scope.REQUEST })
export class RequestTenant {
  initializedByHook = false;
  onModuleInit(): void { this.initializedByHook = true; }
  constructor(@Inject(REQUEST) private readonly request: { tenant: string }) {}
  get tenant(): string { return this.request.tenant; }
}
@Injectable()
export class TenantConsumer {
  constructor(readonly context: RequestTenant, readonly shared: SharedCounter) {}
}
@Module({ providers: [LocalStock, { provide: STOCK_READER, useExisting: LocalStock }, CanReserve,
  SharedCounter, ConsumerCounter, ConsumerA, ConsumerB, RequestTenant, TenantConsumer] })
export class InjectionModule {}
