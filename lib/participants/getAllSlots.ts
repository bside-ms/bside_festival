import prismaClient from 'lib/common/prismaClient';
import serializeSlot from 'lib/participants/serializeSlot';
import type { SerializableSlot } from 'typings/SerializableSlot';

const getAllSlots = async (): Promise<Array<SerializableSlot>> => {
    const slots = await prismaClient.slot.findMany({ orderBy: { begin: 'asc' } });

    return slots.map(serializeSlot);
};

export default getAllSlots;
