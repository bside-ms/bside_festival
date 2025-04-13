import type { Participant } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import getAllParticipants from 'lib/participants/getAllParticipants';
import isGroupMember from 'lib/next-auth/isGroupMember';
import { dataPrivacyGroup } from 'lib/next-auth/KeycloakGroups';

export interface GetApplicationResponse {
    application: Participant | null;
}

export default async (request: NextApiRequest, response: NextApiResponse<GetApplicationResponse>): Promise<void> => {
    const query = request.query as { id: string };

    const isInDataPrivacyGroup = await isGroupMember(dataPrivacyGroup);

    const application = (await getAllParticipants(isInDataPrivacyGroup)).find(({ id }) => id === Number(query.id)) ?? null;

    response.status(application === null ? 404 : 200).json({ application });
};
