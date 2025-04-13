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

    const slotData = await prismaClient.slot.findFirst({ where: { participantId } });

    if (slotData === null) {
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

        return;
    }

    const attendees = await prismaClient.attendee.findMany({ where: { slotId: slotData.id } });

    if (attendees.length > (maxAttendees ?? 0)) {
        response.status(200).json({
            message:
                (maxAttendees ?? 0) > 0
                    ? `Es gibt bereits mehr als ${maxAttendees} Anmeldungen, sorry, du kannst die Anzahl nicht mehr hierüber reduzieren. Wende dich bitte an die IT 😇`
                    : 'Es gibt bereits Anmeldungen, sorry, aber wir können die Anmeldung auch komplett entfernen, wende dich bitte an die IT 😇',
        });

        return;
    }

    await prismaClient.slot.update({
        data: {
            locationId,
            begin,
            duration,
            maxAttendees,
        },
        where: { id: slotData.id },
    });

    const slots = await getAllSlots();

    response.status(200).json({ updatedSlots: slots });
};
