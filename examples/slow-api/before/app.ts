import 'reflect-metadata';
import { BadGatewayException, Controller, Get, Inject, Injectable, Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

const catalogUrl = Symbol('catalog-url');
type Item = { id: string; price: number };
@Injectable()
class Catalog {
  constructor(@Inject(catalogUrl) private readonly url: string) {}
  async get(id: string): Promise<Item> {
    try {
      const response = await fetch(`${this.url}/${id}`, { signal: AbortSignal.timeout(1000) });
      if (!response.ok) throw new Error('Catalog request failed');
      return await response.json() as Item;
    } catch {
      throw new BadGatewayException('Catalog unavailable');
    }
  }
}
@Injectable()
class Quotes {
  constructor(@Inject(Catalog) private readonly catalog: Catalog) {}
  async quote() {
    const ids = ['one', 'two', 'one', 'two'];
    const items: Item[] = [];
    for (const id of ids) items.push(await this.catalog.get(id));
    return items;
  }
}
@Controller('quote')
class QuoteController {
  constructor(@Inject(Quotes) private readonly quotes: Quotes) {}
  @Get()
  get() { return this.quotes.quote(); }
}
export async function createApp(url: string) {
  @Module({ controllers: [QuoteController], providers: [Quotes, Catalog, { provide: catalogUrl, useValue: url }] })
  class AppModule {}
  const app = await NestFactory.create(AppModule, { logger: false });
  await app.init();
  return app;
}
