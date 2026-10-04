import 'reflect-metadata';
import { Controller, DefaultValuePipe, Get, Module, ParseBoolPipe, Query } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

const records = [{ id: 1, archived: false }, { id: 2, archived: true }];
@Controller('items')
class ItemsController {
  @Get()
  list(@Query('includeArchived', new DefaultValuePipe(false), ParseBoolPipe) includeArchived: boolean) {
    return records.filter(item => includeArchived || !item.archived);
  }
}
@Module({ controllers: [ItemsController] })
class AppModule {}
export async function createApp() {
  const app = await NestFactory.create(AppModule, { logger: false });
  await app.init();
  return app;
}
