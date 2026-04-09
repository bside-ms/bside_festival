'use server';

import prismaClient from '@/lib/common/prismaClient';
import { revalidatePath } from 'next/cache';

export const updateVenue = async (participantId: number, locationId: number, dates: Array<string>): Promise<void> => {
    await prismaClient.venue.deleteMany({ where: { participantId } });
    await prismaClient.venue.create({ data: { participantId, locationId, dates: dates.join(',') } });
    revalidatePath('/bewerbungen/uebersicht');
    revalidatePath('/programm');
};

export const deleteVenue = async (participantId: number): Promise<void> => {
    await prismaClient.venue.deleteMany({ where: { participantId } });
    revalidatePath('/bewerbungen/uebersicht');
    revalidatePath('/programm');
};
