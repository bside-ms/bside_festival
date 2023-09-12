import type { Participant } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import prismaClient from 'lib/common/prismaClient';

export interface GetApplicationResponse {
    application: Participant | null;
}

export default async (request: NextApiRequest, response: NextApiResponse<GetApplicationResponse>): Promise<void> => {
    const query = request.query as { id: string };

    const applicationId = Number(query.id);

    if (isNaN(applicationId)) {
        response.status(404).json({ application: null });
        return;
    }

    const application = await prismaClient.participant.findUnique({ where: { id: applicationId } });

    response.status(application === null ? 404 : 200).json({ application });
};
