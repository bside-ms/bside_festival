import type { Participant } from '@prisma/client';
import isGroupMember from 'lib/next-auth/isGroupMember';
import { dataPrivacyGroup } from 'lib/next-auth/KeycloakGroups';
import getAllParticipants from 'lib/participants/getAllParticipants';
import { NextResponse } from 'next/server';

export interface GetAllApplicationsResponse {
    applications: Array<Participant>;
}

export const GET = async (): Promise<NextResponse<GetAllApplicationsResponse>> => {
    const isInDataPrivacyGroup = await isGroupMember(dataPrivacyGroup);
    const applications = await getAllParticipants(isInDataPrivacyGroup);

    return NextResponse.json({ applications });
};
