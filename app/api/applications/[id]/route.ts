import type { Participant } from '@prisma/client';
import { NextResponse } from 'next/server';
import getAllParticipants from 'lib/participants/getAllParticipants';
import isGroupMember from 'lib/next-auth/isGroupMember';
import { dataPrivacyGroup } from 'lib/next-auth/KeycloakGroups';

export interface GetApplicationResponse {
    application: Participant | null;
}

export const GET = async (
    _request: Request,
    { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<GetApplicationResponse>> => {
    const { id } = await params;

    const isInDataPrivacyGroup = await isGroupMember(dataPrivacyGroup);
    const application = (await getAllParticipants(isInDataPrivacyGroup)).find((participant) => participant.id === Number(id)) ?? null;

    return NextResponse.json({ application }, { status: application === null ? 404 : 200 });
};
