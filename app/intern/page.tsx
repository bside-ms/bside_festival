import InternWorkspace from '@/components/intern/InternWorkspace';
import { InternWorkspaceContextProvider } from '@/components/intern/InternWorkspaceContext';
import prismaClient from '@/lib/common/prismaClient';
import type { ListScheduleEntryInput } from '@/lib/intern/earliestListSlot';
import toEarliestListSlot from '@/lib/intern/earliestListSlot';
import getUserSession from '@/lib/next-auth/getUserSession';
import isGroupMember from '@/lib/next-auth/isGroupMember';
import isLoggedIn from '@/lib/next-auth/isLoggedIn';
import { dataPrivacyGroup } from '@/lib/next-auth/KeycloakGroups';
import getAllParticipants from '@/lib/participants/getAllParticipants';
import { serializeListParticipant } from '@/lib/participants/serializeParticipant';
import { groupBy, mapValues } from 'lodash';
import { redirect } from 'next/navigation';
import type { ReactElement } from 'react';

const parseAllDayDates = (allDayDates: unknown): Array<string> => {
    if (!Array.isArray(allDayDates)) {
        return [];
    }

    return allDayDates.filter((date): date is string => typeof date === 'string');
};

export default async (): Promise<ReactElement> => {
    if (!(await isLoggedIn())) {
        redirect('/');
    }

    const isInDataPrivacyGroup = await isGroupMember(dataPrivacyGroup);
    const [participants, scheduleEntries, user] = await Promise.all([
        getAllParticipants(isInDataPrivacyGroup, true),
        prismaClient.scheduleEntry.findMany({
            select: {
                allDayDates: true,
                endsAt: true,
                participantId: true,
                programLocation: { select: { name: true } },
                startsAt: true,
                timeMode: true,
            },
            where: { participantId: { not: null } },
        }),
        getUserSession(),
    ]);

    const entriesByParticipantId = mapValues(
        groupBy(
            scheduleEntries.filter((entry): entry is typeof entry & { participantId: number } => entry.participantId !== null),
            ({ participantId }) => participantId,
        ),
        (entries): Array<ListScheduleEntryInput> =>
            entries.map((entry) => ({
                allDayDates: parseAllDayDates(entry.allDayDates),
                endsAt: entry.endsAt,
                locationName: entry.programLocation.name,
                startsAt: entry.startsAt,
                timeMode: entry.timeMode,
            })),
    );

    const scheduledParticipantIds = Object.keys(entriesByParticipantId).map(Number);
    const applications = participants.map((participant) =>
        serializeListParticipant(participant, toEarliestListSlot(entriesByParticipantId[participant.id] ?? [])),
    );
    const currentOrganizerUserId = user?.id ?? null;

    return (
        <div className="relative mx-auto min-h-full w-full max-w-[90rem] px-2 pt-5 pb-3">
            <InternWorkspaceContextProvider
                applications={applications}
                currentOrganizerUserId={currentOrganizerUserId}
                scheduledParticipantIds={scheduledParticipantIds}
            >
                <InternWorkspace />
            </InternWorkspaceContextProvider>
        </div>
    );
};
