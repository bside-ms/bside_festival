import type { Participant } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import prismaClient from 'lib/common/prismaClient';

export interface UpdateDescriptionRequest {
    id: number;
    description: string;
}

export interface SuccessfulUpdateDescriptionResponse {
    updatedParticipant: Participant;
}

export interface ErroneousUpdateDescriptionResponse {
    message: string;
}

export default async (
    request: NextApiRequest,
    response: NextApiResponse<SuccessfulUpdateDescriptionResponse | ErroneousUpdateDescriptionResponse>,
): Promise<void> => {
    const { id, description } = request.body as UpdateDescriptionRequest;

    const updatedParticipant = await prismaClient.participant.update({
        data: {
            updatedDescription: description,
        },
        where: {
            id,
        },
    });

    const successfulResponse: SuccessfulUpdateDescriptionResponse = {
        updatedParticipant,
    };

    response.status(200).json(successfulResponse);
};
