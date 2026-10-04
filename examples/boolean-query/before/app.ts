import 'reflect-metadata';
import { Controller, Get, Module, Query } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

const records = [{ id: 1, archived: false }, { id: 2, archived: true }];
@Controller('items')
class ItemsController {
  @Get()
  list(@Query('includeArchived') includeArchived?: string) {
    return records.filter(item => Boolean(includeArchived) || !item.archived);
  }
}
@Module({ controllers: [ItemsController] })
class AppModule {}
export async function createApp() {
  const app = await NestFactory.create(AppModule, { logger: false });
  await app.init();
  return app;
}
