import { Inject } from '@nestjs/common';

// Internal contracts need no reflection: the boundary pipe supplies runtime validation.
export interface ReserveCommand { sku: string; quantity: number }
export type ReservationView = { sku: string; remaining: number };
interface ErasedPort { find(id: string): unknown }
// Compiler control: an interface is a valid static contract, but has no runtime token.
// @ts-expect-error ErasedPort exists only as a type.
const erasedToken = () => Inject(ErasedPort);
void erasedToken; // Never execute this deliberately invalid illustration.
