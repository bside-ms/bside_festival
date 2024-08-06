import type { NextApiRequest, NextApiResponse } from 'next';
import prismaClient from 'lib/common/prismaClient';
import getAllSlots from 'lib/participants/getAllSlots';
import type { SerializableSlot } from 'typings/SerializableSlot';

export interface UpsertSlotRequest {
    participantId: number;
    begin: Date;
    locationId: number;
    duration: number;
    maxAttendees?: number;
}

export interface SuccessfulUpdateSlotResponse {
    updatedSlots: Array<SerializableSlot>;
}

export interface ErroneousUpdateSlotResponse {
    message: string;
}

export default async (
    request: NextApiRequest,
    response: NextApiResponse<SuccessfulUpdateSlotResponse | ErroneousUpdateSlotResponse>,
): Promise<void> => {
    const { participantId, begin, locationId, duration, maxAttendees } = request.body as UpsertSlotRequest;

    // Just deleting slot before creating new one, since upsert only works with unique fields
    await prismaClient.slot.deleteMany({ where: { participantId } });

    await prismaClient.slot.create({
        data: {
            participantId,
            locationId,
            begin,
            duration,
            maxAttendees,
        },
    });

    const slots = await getAllSlots();

    response.status(200).json({ updatedSlots: slots });
};
