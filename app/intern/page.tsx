import InternWorkspace from '@/components/intern/InternWorkspace';
import { InternWorkspaceContextProvider } from '@/components/intern/InternWorkspaceContext';
import prismaClient from '@/lib/common/prismaClient';
import getKeycloakUsers from '@/lib/keycloak/getKeycloakUsers';
import getUserSession from '@/lib/next-auth/getUserSession';
import isGroupMember from '@/lib/next-auth/isGroupMember';
import isLoggedIn from '@/lib/next-auth/isLoggedIn';
import { dataPrivacyGroup } from '@/lib/next-auth/KeycloakGroups';
import getAllParticipants from '@/lib/participants/getAllParticipants';
import serializeParticipant from '@/lib/participants/serializeParticipant';
import { redirect } from 'next/navigation';
import type { ReactElement } from 'react';

export default async (): Promise<ReactElement> => {
    if (!(await isLoggedIn())) {
        redirect('/');
    }

    const isInDataPrivacyGroup = await isGroupMember(dataPrivacyGroup);
    const applications = (await getAllParticipants(isInDataPrivacyGroup, true)).map(serializeParticipant);
    const participantGenres = await prismaClient.participantGenre.findMany();
    const scheduledParticipantIds = (
        await prismaClient.scheduleEntry.findMany({
            select: { participantId: true },
            where: { participantId: { not: null } },
        })
    )
        .map(({ participantId }) => participantId)
        .filter((participantId): participantId is number => participantId !== null);
    const allLinks = await prismaClient.link.findMany();
    const allZipcodes = await prismaClient.zipcode.findMany();
    const allGenres = await prismaClient.genre.findMany();
    const availableOrganizers = await getKeycloakUsers();
    const user = await getUserSession();
    const currentOrganizerUserId =
        user?.id ??
        availableOrganizers.find((organizer) => organizer.id === user?.email)?.id ??
        availableOrganizers.find((organizer) => organizer.name === user?.name)?.id ??
        null;

    return (
        <div className="relative mx-auto min-h-screen w-full max-w-7xl px-2 pt-5 pb-3">
            <InternWorkspaceContextProvider
                applications={applications}
                participantGenres={participantGenres}
                allLinks={allLinks}
                allZipcodes={allZipcodes}
                allGenres={allGenres}
                availableOrganizers={availableOrganizers}
                currentOrganizerUserId={currentOrganizerUserId}
                scheduledParticipantIds={scheduledParticipantIds}
            >
                <InternWorkspace />
            </InternWorkspaceContextProvider>
        </div>
    );
};
