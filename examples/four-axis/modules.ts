import 'reflect-metadata';
import { Inject, Injectable, Module } from '@nestjs/common';

export interface Principal { readonly id: string; readonly school: string }
export const VERIFY_SESSION = Symbol('auth.verify-session');
@Injectable()
export class SessionStore {
  private readonly sessions = new Map([
    ['alice-session', { id: 'alice', school: 'north' }],
    ['carol-session', { id: 'carol', school: 'north' }],
    ['bob-session', { id: 'bob', school: 'south' }],
  ]);
  find(credential: string) { return this.sessions.get(credential); }
}
@Injectable()
export class VerifySession {
  constructor(private readonly sessions: SessionStore) {}
  execute(credential: string): Principal {
    const principal = this.sessions.find(credential);
    if (!principal) throw new Error('Unauthenticated');
    return Object.freeze({ id: principal.id, school: principal.school });
  }
}
@Module({ providers: [SessionStore, VerifySession,
  { provide: VERIFY_SESSION, useExisting: VerifySession },
], exports: [VERIFY_SESSION] })
export class AuthModule {}

@Injectable()
class LibraryLoans {
  private readonly loans: string[] = [];
  add(id: string) { this.loans.push(id); }
  list() { return [...this.loans]; }
}
@Injectable()
export class BorrowBook {
  constructor(@Inject(VERIFY_SESSION) readonly auth: VerifySession,
    private readonly loans: LibraryLoans) {}
  execute(credential: string) {
    const principal = this.auth.execute(credential);
    if (principal.school !== 'north') throw new Error('Library access denied');
    this.loans.add(principal.id);
    return this.loans.list();
  }
  list() { return this.loans.list(); }
}
@Module({ imports: [AuthModule], providers: [LibraryLoans, BorrowBook], exports: [BorrowBook] })
export class LibraryModule {}

@Injectable()
export class EnrollStudent {
  private readonly students = new Set<string>();
  constructor(@Inject(VERIFY_SESSION) readonly auth: VerifySession) {}
  execute(credential: string) {
    const principal = this.auth.execute(credential);
    if (principal.school !== 'north') throw new Error('School access denied');
    if (this.students.has(principal.id)) return [...this.students]; // Explicit duplicate policy.
    if (this.students.size >= 1) throw new Error('Class full');
    this.students.add(principal.id);
    return [...this.students];
  }
}
@Module({ imports: [AuthModule], providers: [EnrollStudent], exports: [EnrollStudent] })
export class SchoolModule {}

// An abstract-class token does not require inheritance.
export abstract class NotificationSender { abstract send(text: string): string }
@Injectable()
export class PreviewNotification implements NotificationSender {
  send(text: string) { return 'notification: ' + text; }
}
@Module({ imports: [LibraryModule, SchoolModule],
  providers: [{ provide: NotificationSender, useClass: PreviewNotification }] })
export class ExampleModule {}

export function brokenWiring(kind: 'private-provider' | 'different-symbol') {
  const token = kind === 'private-provider' ? SessionStore : Symbol('auth.verify-session');
  @Injectable()
  class BrokenConsumer { constructor(@Inject(token) readonly dependency: unknown) {} }
  @Module({ imports: [AuthModule], providers: [BrokenConsumer] })
  class BrokenModule {}
  return BrokenModule;
}
