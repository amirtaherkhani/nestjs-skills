import 'reflect-metadata';
import { Inject, Injectable, Module } from '@nestjs/common';
import { LazyModuleLoader } from '@nestjs/core';

export const CLOCK = Symbol('runtime.clock');
export const ORIGIN = Symbol('runtime.origin');
export interface Clock { now(): number }
export interface Origin { read(): Promise<string> }
// One public, immutable string value. No tenant-specific data and at most one pending read.
@Injectable()
export class PublicSummaryCache {
  private cached?: { value: string; expiresAt: number };
  private pending?: Promise<string>;
  constructor(@Inject(CLOCK) private readonly clock: Clock, @Inject(ORIGIN) private readonly origin: Origin) {}
  read(): Promise<string> {
    if (this.cached && this.clock.now() < this.cached.expiresAt) return Promise.resolve(this.cached.value);
    if (this.pending) return this.pending;
    this.pending = Promise.resolve().then(() => this.origin.read()).then(value => {
      if (typeof value !== 'string' || Buffer.byteLength(value, 'utf8') > 1024) throw new Error('Summary exceeds contract');
      this.cached = { value, expiresAt: this.clock.now() + 1000 };
      return value;
    }).finally(() => { this.pending = undefined; });
    return this.pending;
  }
}

export const PAGE_QUERY = Symbol('runtime.page-query');
export interface PageRequest { tenant: string; afterId: number; limit: number; select: readonly ['id', 'title']; order: 'id-asc' }
export interface PageRow { id: number; title: string }
export interface PageQuery { fetch(input: PageRequest): Promise<PageRow[]> }
@Injectable()
export class ListTitles {
  constructor(@Inject(PAGE_QUERY) private readonly query: PageQuery) {}
  async execute(tenant: string, afterId: number, limit: number): Promise<PageRow[]> {
    if (!/^[a-z0-9-]{1,32}$/.test(tenant) || !Number.isSafeInteger(afterId) || afterId < 0 ||
      !Number.isSafeInteger(limit) || limit < 1 || limit > 50) throw new Error('Invalid page');
    const rows = await this.query.fetch({ tenant, afterId, limit, select: ['id', 'title'], order: 'id-asc' });
    if (rows.length > limit) throw new Error('Adapter exceeded page limit');
    let previous = afterId;
    return rows.map(row => {
      if (!Number.isSafeInteger(row.id) || row.id <= previous || typeof row.title !== 'string' || row.title.length > 200)
        throw new Error('Invalid page response');
      previous = row.id;
      return { id: row.id, title: row.title };
    });
  }
}

@Injectable()
export class OptionalReport {
  initializedByHook = false;
  onModuleInit(): void { this.initializedByHook = true; }
  render(): string { return 'public report'; }
}
@Module({ providers: [OptionalReport] })
export class OptionalReportModule {}
@Injectable()
export class Reports {
  constructor(private readonly loader: LazyModuleLoader) {}
  async get(): Promise<OptionalReport> {
    const moduleRef = await this.loader.load(() => OptionalReportModule);
    return moduleRef.get(OptionalReport, { strict: true });
  }
}
@Module({ providers: [Reports] })
export class LazyRootModule {}
