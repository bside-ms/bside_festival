import type { Participant } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import prismaClient from 'lib/common/prismaClient';

export interface GetAllApplicationsResponse {
    applications: Array<Participant>;
}

export default async (
    _request: NextApiRequest,
    response: NextApiResponse<GetAllApplicationsResponse>
): Promise<void> => {

    const applications = await prismaClient.participant.findMany();

    response.status(200).json({ applications });
};
