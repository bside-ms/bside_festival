import type { ApplicationStatus, Participant } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import prismaClient from 'lib/common/prismaClient';

export interface SetCurationRequest {
    id: number;
    curationScore: number | null;
    curationInfo: string | null;
    applicationStatus: ApplicationStatus;
}

export interface SuccessfulSetCurationResponse {
    updatedParticipant: Participant;
}

export interface ErroneousSetCurationResponse {
    message: string;
}

export default async (
    request: NextApiRequest,
    response: NextApiResponse<SuccessfulSetCurationResponse | ErroneousSetCurationResponse>
): Promise<void> => {

    const {
        id,
        curationScore,
        curationInfo,
        applicationStatus,
    } = request.body as SetCurationRequest;

    const updatedParticipant = await prismaClient.participant.update({
        data: {
            curationScore,
            curationInfo,
            status: applicationStatus,
        },
        where: {
            id,
        },
    });

    response.status(200).json({ updatedParticipant });
};
