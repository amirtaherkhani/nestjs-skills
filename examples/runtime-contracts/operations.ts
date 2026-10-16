import 'reflect-metadata';
import { DynamicModule, Inject, Injectable, Module, OnApplicationBootstrap,
  OnApplicationShutdown, OnModuleDestroy, OnModuleInit, BeforeApplicationShutdown } from '@nestjs/common';

export const SETTINGS = Symbol('runtime.settings');
export interface Settings { readonly port: number; readonly service: string }
export function parseSettings(env: Record<string, string | undefined>): Readonly<Settings> {
  const rawPort = env.PORT ?? '3000';
  if (!/^[0-9]+$/.test(rawPort)) throw new Error('PORT must be an integer from 1 to 65535');
  const port = Number(rawPort);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be an integer from 1 to 65535');
  const service = env.SERVICE_NAME ?? 'catalog';
  if (!/^[a-z][a-z0-9-]{0,31}$/.test(service)) throw new Error('SERVICE_NAME is invalid');
  return Object.freeze({ port, service });
}

export const LOG_SINK = Symbol('runtime.log-sink');
export interface LogSink { write(line: string): void }
export interface Completion { requestId: string; status: number; durationMs: number }
// Application event logger: intentionally not a generic arbitrary-object serializer.
@Injectable()
export class CompletionLogger {
  constructor(@Inject(LOG_SINK) private readonly sink: LogSink,
    @Inject(SETTINGS) private readonly settings: Settings) {}
  completed(input: Completion): void {
    if (!/^[a-zA-Z0-9-]{1,64}$/.test(input.requestId) ||
      !Number.isInteger(input.status) || input.status < 100 || input.status > 599 ||
      !Number.isFinite(input.durationMs) || input.durationMs < 0) throw new Error('Invalid completion event');
    this.sink.write(JSON.stringify({ event: 'request.completed', service: this.settings.service,
      requestId: input.requestId, status: input.status, durationMs: input.durationMs }));
  }
}

export const RESOURCE = Symbol('runtime.resource');
export interface Resource { connect(): Promise<void>; close(): Promise<void> }
@Injectable()
export class ManagedResource implements OnModuleInit, OnApplicationBootstrap,
  OnModuleDestroy, BeforeApplicationShutdown, OnApplicationShutdown {
  readonly events: string[] = [];
  ready = false;
  private closed = false;
  constructor(@Inject(RESOURCE) private readonly resource: Resource) {}
  async onModuleInit(): Promise<void> {
    await this.resource.connect();
    this.events.push('connected');
  }
  onApplicationBootstrap(): void { this.ready = true; this.events.push('ready'); }
  onModuleDestroy(): void { this.ready = false; this.events.push('stopping'); }
  beforeApplicationShutdown(): void { this.events.push('before.shutdown'); }
  async onApplicationShutdown(): Promise<void> {
    if (!this.closed) {
      await this.resource.close();
      this.closed = true;
      this.events.push('resource.closed');
    }
    this.events.push('shutdown');
  }
}

@Module({})
export class OperationsModule {
  static register(env: Record<string, string | undefined>, resource: Resource, sink: LogSink): DynamicModule {
    return { module: OperationsModule, providers: [
      { provide: SETTINGS, useFactory: () => parseSettings(env) },
      { provide: RESOURCE, useValue: resource }, { provide: LOG_SINK, useValue: sink },
      CompletionLogger, ManagedResource,
    ] };
  }
}
