import type { Participant } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import authOptions from 'lib/next-auth/authOptions';
import getAllParticipants from 'lib/participants/getAllParticipants';
import isGroupMember from 'lib/next-auth/isGroupMember';
import { dataPrivacyGroup } from 'lib/next-auth/KeycloakGroups';

export interface GetAllApplicationsResponse {
    applications: Array<Participant>;
}

export default async (request: NextApiRequest, response: NextApiResponse<GetAllApplicationsResponse>): Promise<void> => {
    const session = await getServerSession(request, response, authOptions);
    const isInDataPrivacyGroup = isGroupMember(dataPrivacyGroup, session);
    const applications = await getAllParticipants(isInDataPrivacyGroup);

    response.status(200).json({ applications });
};
