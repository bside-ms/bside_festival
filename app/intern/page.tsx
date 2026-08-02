import InternWorkspace from '@/components/intern/InternWorkspace';
import { InternWorkspaceContextProvider } from '@/components/intern/InternWorkspaceContext';
import prismaClient from '@/lib/common/prismaClient';
import getUserSession from '@/lib/next-auth/getUserSession';
import isGroupMember from '@/lib/next-auth/isGroupMember';
import isLoggedIn from '@/lib/next-auth/isLoggedIn';
import { dataPrivacyGroup } from '@/lib/next-auth/KeycloakGroups';
import getAllParticipants from '@/lib/participants/getAllParticipants';
import { serializeListParticipant } from '@/lib/participants/serializeParticipant';
import { redirect } from 'next/navigation';
import type { ReactElement } from 'react';

export default async (): Promise<ReactElement> => {
    if (!(await isLoggedIn())) {
        redirect('/');
    }

    const isInDataPrivacyGroup = await isGroupMember(dataPrivacyGroup);
    const [applications, participantGenres, scheduleEntries, allGenres, user] = await Promise.all([
        getAllParticipants(isInDataPrivacyGroup, true).then((participants) => participants.map(serializeListParticipant)),
        prismaClient.participantGenre.findMany(),
        prismaClient.scheduleEntry.findMany({
            select: { participantId: true },
            where: { participantId: { not: null } },
        }),
        prismaClient.genre.findMany(),
        getUserSession(),
    ]);

    const scheduledParticipantIds = scheduleEntries
        .map(({ participantId }) => participantId)
        .filter((participantId): participantId is number => participantId !== null);
    const currentOrganizerUserId = user?.id ?? null;

    return (
        <div className="relative mx-auto min-h-screen w-full max-w-7xl px-2 pt-5 pb-3">
            <InternWorkspaceContextProvider
                applications={applications}
                participantGenres={participantGenres}
                allGenres={allGenres}
                currentOrganizerUserId={currentOrganizerUserId}
                scheduledParticipantIds={scheduledParticipantIds}
            >
                <InternWorkspace />
            </InternWorkspaceContextProvider>
        </div>
    );
};
