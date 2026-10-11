import 'reflect-metadata';
import {
  ArgumentMetadata, ArgumentsHost, BadRequestException, Body, CallHandler, CanActivate, Catch,
  Controller, ExceptionFilter, ExecutionContext, Get, HttpException, Inject,
  Injectable, Module, NestInterceptor, PipeTransform, Post, UnauthorizedException,
  UseFilters, UseGuards, UseInterceptors, UsePipes,
} from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE, NestFactory } from '@nestjs/core';
import { tap } from 'rxjs';
import { InventoryItem, StockUnavailable } from './domain';
import type { ReserveCommand, ReservationView } from './internal-types';

// Sequential test recorder, not production request context or a concurrent log sink.
@Injectable()
export class Trace { readonly events: string[] = []; add(event: string) { this.events.push(event); } }

@Injectable()
class GlobalGuard implements CanActivate {
  constructor(private readonly trace: Trace) {}
  canActivate(context: ExecutionContext) {
    this.trace.add('guard:global');
    if (context.switchToHttp().getRequest().headers.authorization !== 'fixture-credential') {
      throw new UnauthorizedException();
    }
    return true;
  }
}
@Injectable()
class ControllerGuard implements CanActivate {
  constructor(private readonly trace: Trace) {}
  canActivate() { this.trace.add('guard:controller'); return true; }
}
@Injectable()
class RouteGuard implements CanActivate {
  constructor(private readonly trace: Trace) {}
  canActivate() { this.trace.add('guard:route'); return true; }
}

class TraceInterceptor implements NestInterceptor {
  constructor(private readonly trace: Trace, private readonly name: string) {}
  intercept(_context: ExecutionContext, next: CallHandler) {
    this.trace.add('interceptor:' + this.name + ':in');
    return next.handle().pipe(tap({
      next: () => this.trace.add('interceptor:' + this.name + ':out'),
      error: () => this.trace.add('interceptor:' + this.name + ':error'),
    }));
  }
}
@Injectable()
class GlobalTrace extends TraceInterceptor { constructor(trace: Trace) { super(trace, 'global'); } }
@Injectable()
class ControllerTrace extends TraceInterceptor { constructor(trace: Trace) { super(trace, 'controller'); } }
@Injectable()
class RouteTrace extends TraceInterceptor { constructor(trace: Trace) { super(trace, 'route'); } }

class TracePipe implements PipeTransform {
  constructor(private readonly trace: Trace, private readonly name: string) {}
  transform(value: unknown) { this.trace.add('pipe:' + this.name); return value; }
}
@Injectable()
class GlobalPipe extends TracePipe { constructor(trace: Trace) { super(trace, 'global'); } }
@Injectable()
class ControllerPipe extends TracePipe { constructor(trace: Trace) { super(trace, 'controller'); } }
@Injectable()
class RoutePipe extends TracePipe { constructor(trace: Trace) { super(trace, 'route'); } }
@Injectable()
class ReserveBodyPipe implements PipeTransform<unknown, ReserveCommand> {
  constructor(private readonly trace: Trace) {}
  transform(value: unknown, _metadata: ArgumentMetadata): ReserveCommand {
    this.trace.add('pipe:parameter');
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new BadRequestException();
    const body = value as Record<string, unknown>;
    if (Object.keys(body).some(key => !['sku', 'quantity'].includes(key))
      || typeof body.sku !== 'string' || !/^[A-Z]+$/.test(body.sku)
      || typeof body.quantity !== 'number' || !Number.isSafeInteger(body.quantity) || body.quantity <= 0) {
      throw new BadRequestException();
    }
    return { sku: body.sku, quantity: body.quantity };
  }
}
@Injectable()
export class ReserveInventory {
  private readonly item = new InventoryItem('BOOK', 2);
  execute(command: ReserveCommand): ReservationView {
    if (command.sku !== this.item.sku) throw new StockUnavailable('Unknown stock');
    return this.item.reserve(command.quantity);
  }
  snapshot() { return this.item.snapshot(); }
}

@Catch()
@Injectable()
export class GlobalFilter implements ExceptionFilter {
  constructor(@Inject(Trace) private readonly trace: Trace) {}
  catch(error: unknown, host: ArgumentsHost) {
    this.trace.add('filter:global');
    const status = error instanceof StockUnavailable ? 409 : error instanceof HttpException ? error.getStatus() : 500;
    const message = status === 409 ? 'Stock unavailable' : status === 401 ? 'Unauthenticated'
      : status === 400 ? 'Invalid request' : 'Internal failure';
    host.switchToHttp().getResponse().status(status).json({ statusCode: status, message });
  }
}
@Catch(StockUnavailable)
@Injectable()
class LocalFilter implements ExceptionFilter {
  constructor(private readonly trace: Trace) {}
  catch(_error: StockUnavailable, host: ArgumentsHost) {
    this.trace.add('filter:route');
    host.switchToHttp().getResponse().status(409).json({ message: 'Local stock unavailable' });
  }
}
@Controller('inventory')
@UseGuards(ControllerGuard)
@UseInterceptors(ControllerTrace)
@UsePipes(ControllerPipe)
class InventoryController {
  constructor(private readonly reserve: ReserveInventory, private readonly trace: Trace) {}
  @Post('reservations')
  @UseGuards(RouteGuard)
  @UseInterceptors(RouteTrace)
  @UsePipes(RoutePipe)
  reserveItem(@Body(ReserveBodyPipe) command: ReserveCommand) {
    this.trace.add('controller');
    return this.reserve.execute(command);
  }
  @Get('local-failure')
  @UseFilters(LocalFilter)
  localFailure() { throw new StockUnavailable('private inventory detail'); }
  @Get('unknown')
  unknown() { throw new Error('private database detail'); }
}

export async function createApp(registration: 'provider' | 'resolved-singleton' = 'provider') {
  @Module({ controllers: [InventoryController], providers: [
    Trace, ReserveInventory, GlobalFilter, LocalFilter, ReserveBodyPipe,
    ControllerGuard, RouteGuard, ControllerTrace, RouteTrace, ControllerPipe, RoutePipe,
    { provide: APP_GUARD, useClass: GlobalGuard },
    { provide: APP_INTERCEPTOR, useClass: GlobalTrace },
    { provide: APP_PIPE, useClass: GlobalPipe },
    ...(registration === 'provider' ? [{ provide: APP_FILTER, useExisting: GlobalFilter }] : []),
  ] })
  class RuntimeModule {}
  const app = await NestFactory.create(RuntimeModule, { logger: false, abortOnError: false });
  const trace = app.get(Trace);
  app.use((_req: unknown, _res: unknown, next: () => void) => { trace.add('middleware'); next(); });
  if (registration === 'resolved-singleton') app.useGlobalFilters(app.get(GlobalFilter));
  await app.init();
  return app;
}
@Module({ providers: [GlobalFilter] }) // Deliberate missing constructor dependency.
export class MissingFilterDependencyModule {}
