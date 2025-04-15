import type { Participant } from '@prisma/client';
import { NextResponse } from 'next/server';
import getAllParticipants from 'lib/participants/getAllParticipants';
import isGroupMember from 'lib/next-auth/isGroupMember';
import { dataPrivacyGroup } from 'lib/next-auth/KeycloakGroups';

export interface GetAllApplicationsResponse {
    applications: Array<Participant>;
}

export const GET = async (): Promise<NextResponse<GetAllApplicationsResponse>> => {
    const isInDataPrivacyGroup = await isGroupMember(dataPrivacyGroup);
    const applications = await getAllParticipants(isInDataPrivacyGroup);

    return NextResponse.json({ applications });
};
