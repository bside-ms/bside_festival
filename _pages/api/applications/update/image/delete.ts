import type { Participant } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import prismaClient from 'lib/common/prismaClient';

export interface DeleteImageRequest {
    id: number;
}

export interface SuccessfulDeleteImageResponse {
    updatedParticipant: Participant;
}

export interface ErroneousDeleteImageResponse {
    message: string;
}

export default async (
    request: NextApiRequest,
    response: NextApiResponse<SuccessfulDeleteImageResponse | ErroneousDeleteImageResponse>,
): Promise<void> => {
    const { id } = request.body as DeleteImageRequest;

    const updatedParticipant = await prismaClient.participant.update({
        data: {
            imageFileName: null,
        },
        where: {
            id,
        },
    });

    const successfulResponse: SuccessfulDeleteImageResponse = {
        updatedParticipant,
    };

    response.status(200).json(successfulResponse);
};
