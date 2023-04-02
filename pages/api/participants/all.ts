import type { Participant } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import prismaClient from 'lib/common/prismaClient';

export interface GetAllParticipantsResponse {
    participants: Array<Participant>;
}

export default async (
    _request: NextApiRequest,
    response: NextApiResponse<GetAllParticipantsResponse>
): Promise<void> => {

    const participants = await prismaClient.participant.findMany();

    response.status(200).json({ participants });
};
