import type { Participant } from '@prisma/client';
import { NextResponse } from 'next/server';
import getAllParticipants from 'lib/participants/getAllParticipants';
import { getServerSession } from 'next-auth';
import authOptions from 'lib/next-auth/authOptions';
import isGroupMember from 'lib/next-auth/isGroupMember';
import { dataPrivacyGroup } from 'lib/next-auth/KeycloakGroups';

export interface GetApplicationResponse {
    application: Participant | null;
}

export async function GET(_request: Request, { params }: { params: { id: string } }): Promise<NextResponse<GetApplicationResponse>> {
    const isInDataPrivacyGroup = await isGroupMember(dataPrivacyGroup);
    const application = (await getAllParticipants(isInDataPrivacyGroup)).find(({ id }) => id === Number(params.id)) ?? null;

    return NextResponse.json({ application }, { status: application === null ? 404 : 200 });
}
