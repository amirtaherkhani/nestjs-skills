import 'reflect-metadata';
import { BadRequestException, Body, ConflictException, Controller, Inject, Injectable, Module, Post } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

@Injectable()
class WalletStorage {
  private balance = 100;
  read() { return this.balance; }
  write(balance: number) { this.balance = balance; return { balance }; }
}
@Injectable()
class WalletOperations {
  constructor(@Inject(WalletStorage) private readonly storage: WalletStorage) {}
  charge(amount: number) {
    if (!Number.isFinite(amount) || amount <= 0) throw new BadRequestException('Positive amount required');
    const next = this.storage.read() - amount;
    if (next < 0) throw new ConflictException('Insufficient balance');
    return this.storage.write(next);
  }
}
@Module({ providers: [WalletStorage, WalletOperations], exports: [WalletStorage, WalletOperations] })
class WalletModule {}
@Controller('checkout')
class CheckoutController {
  constructor(@Inject(WalletOperations) private readonly wallet: WalletOperations) {}
  @Post('charge')
  charge(@Body('amount') amount: number) { return this.wallet.charge(amount); }
}
@Controller('bulk')
class BulkController {
  constructor(@Inject(WalletStorage) private readonly storage: WalletStorage) {}
  @Post('charge')
  charge(@Body('amount') amount: number) {
    return this.storage.write(this.storage.read() - amount);
  }
}
@Module({ imports: [WalletModule], controllers: [CheckoutController, BulkController] })
class AppModule {}
export async function createApp() {
  const app = await NestFactory.create(AppModule, { logger: false });
  await app.init();
  return app;
}
