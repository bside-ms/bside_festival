import type { Slot } from '@prisma/client';
import type { SerializableSlot } from 'typings/SerializableSlot';

const serializeSlot = (slot: Slot): SerializableSlot => ({
    ...slot,
    begin: slot.begin.toString(),
});

export default serializeSlot;
