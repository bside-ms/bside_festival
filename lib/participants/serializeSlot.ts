import type { SerializableSlot } from '@/typings/SerializableSlot';
import type { Slot } from '@prisma/client';

const serializeSlot = (slot: Slot): SerializableSlot => ({
    ...slot,
    begin: slot.begin.toString(),
});

export default serializeSlot;
