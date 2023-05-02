import type { Participant, Type } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import prismaClient from 'lib/common/prismaClient';

export interface AddParticipantRequest {
    type: Type;
    name: string;
    contactName: string;
    contactPhone: string;
    contactMail: string;
    description: string;
}

interface ErroneousAddParticipantResponse {
    message: string;
}

export interface SuccessfulAddParticipantResponse {
    newParticipant: Participant;
}

export default async (
    request: NextApiRequest,
    response: NextApiResponse<SuccessfulAddParticipantResponse | ErroneousAddParticipantResponse>
): Promise<void> => {

    const newParticipant = await prismaClient.participant.create({
        data: request.body,
    });

    response.status(200).json({ newParticipant });
};
