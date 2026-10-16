import 'reflect-metadata';
import { BadRequestException, Body, Controller, Injectable, Module, Post } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';

export type CatalogRow = Readonly<{ id: string; title: string; internalToken: string }>;
export type PublicCard = { id: string; title: string };
type Query = Readonly<{ ids: readonly string[]; limit: number }>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function parseQuery(value: unknown): Query {
  if (!isRecord(value) || Object.keys(value).some(key => key !== 'ids' && key !== 'limit')) {
    throw new BadRequestException('Invalid collection query');
  }
  const { ids, limit } = value;
  if (!Array.isArray(ids) || ids.length > 32 ||
      !ids.every(id => typeof id === 'string' && id.length >= 1 && id.length <= 40) ||
      !Number.isInteger(limit) || (limit as number) < 1 || (limit as number) > 32) {
    throw new BadRequestException('Invalid collection query');
  }
  return { ids: ids as string[], limit: limit as number };
}

// Build the index once per selection. Keep the first row for duplicate IDs, like Array.find.
export function selectCards(
  ids: readonly string[], rows: readonly CatalogRow[], allowedIds: readonly string[], limit: number,
): PublicCard[] {
  const firstById = new Map<string, CatalogRow>();
  for (const row of rows) if (!firstById.has(row.id)) firstById.set(row.id, row);
  const allowed = new Set(allowedIds);
  const cards: PublicCard[] = [];
  for (const id of ids) {
    if (cards.length === limit) break;
    if (!allowed.has(id)) continue;
    const row = firstById.get(id);
    if (row === undefined) continue;
    cards.push({ id: row.id, title: row.title });
  }
  return cards;
}

@Injectable()
class Catalog {
  // A real provider would fetch a bounded, authorized page or batch from persistence.
  readonly rows: readonly CatalogRow[] = [
    { id: 'a', title: 'Alpha', internalToken: 'never-return-a' },
    { id: 'b', title: 'Beta', internalToken: 'never-return-b' },
    { id: 'b', title: 'Old Beta', internalToken: 'never-return-old' },
    { id: '__proto__', title: 'Special', internalToken: 'never-return-special' },
  ];
  readonly allowedIds: readonly string[] = ['a', 'b', '__proto__'];
}

@Controller('collections')
class CollectionController {
  constructor(private readonly catalog: Catalog) {}

  @Post('select')
  select(@Body() body: unknown): { items: PublicCard[] } {
    const query = parseQuery(body);
    return { items: selectCards(query.ids, this.catalog.rows, this.catalog.allowedIds, query.limit) };
  }
}

@Module({ controllers: [CollectionController], providers: [Catalog] })
class AppModule {}

export async function createApp(): Promise<NestExpressApplication> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false, logger: false,
  });
  // Cap bytes before JSON.parse; field-count and type checks above cap work after parsing.
  app.useBodyParser('json', { limit: '4kb' });
  await app.init();
  return app;
}
