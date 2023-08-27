import type { NextApiRequest, NextApiResponse } from 'next';
import prismaClient from 'lib/common/prismaClient';
import getAllSlots from 'lib/participants/slots/getAllSlots';
import type { SerializableSlot } from 'typings/SerializableSlot';

export interface DeleteSlotRequest {
    participantId: number;
}

export interface SuccessfulDeleteSlotResponse {
    updatedSlots: Array<SerializableSlot>;
}

export interface ErroneousDeleteSlotResponse {
    message: string;
}

export default async (
    request: NextApiRequest,
    response: NextApiResponse<SuccessfulDeleteSlotResponse | ErroneousDeleteSlotResponse>
): Promise<void> => {

    const {
        participantId,
    } = request.body as DeleteSlotRequest;

    await prismaClient.slot.deleteMany({ where: { participantId } });

    const slots = await getAllSlots();

    response.status(200).json({ updatedSlots: slots });
};
