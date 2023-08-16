import type { Slot } from '@prisma/client';

export type SerializableSlot = Omit<Slot, 'begin'> & { begin: string };
