import ParticipantsOverview from '@/components/participants/overview/ParticipantsOverview';
import { ParticipantsOverviewContextProvider } from '@/components/participants/overview/ParticipantsOverviewContext';
import {
    dateRangeFilterQueryName,
    locationsFilterQueryName,
    textFilterQueryName,
    typesFilterQueryName,
} from '@/lib/applications/filterQueryNames';
import prismaClient from '@/lib/common/prismaClient';
import isGroupMember from '@/lib/next-auth/isGroupMember';
import isLoggedIn from '@/lib/next-auth/isLoggedIn';
import { dataPrivacyGroup } from '@/lib/next-auth/KeycloakGroups';
import getAllAttendees from '@/lib/participants/getAllAttendees';
import getAllParticipants from '@/lib/participants/getAllParticipants';
import isProgramPublished from '@/lib/participants/isProgramPublished';
import serializeParticipant from '@/lib/participants/serializeParticipant';
import getAllProgramLocations from '@/lib/schedule/getAllProgramLocations';
import getAllScheduleEntries from '@/lib/schedule/getAllScheduleEntries';
import type AllAttendees from '@/typings/AllAttendees';
import type { SerializableParticipant } from '@/typings/SerializableParticipant';
import type { SerializableProgramLocation } from '@/typings/SerializableProgramLocation';
import type { SerializableScheduleEntry } from '@/typings/SerializableScheduleEntry';
import type { ParticipantLabel, Link as PrismaLink } from '@prisma/client';
import { isAfter, isEqual } from 'date-fns';
import { redirect } from 'next/navigation';
import { ReactElement } from 'react';

interface Props {
    participants: Array<SerializableParticipant>;
    scheduleEntries: Array<SerializableScheduleEntry>;
    participantLabels: Array<ParticipantLabel>;
    allLinks: Array<PrismaLink>;
    programLocations: Array<SerializableProgramLocation>;
    allAttendees: Array<AllAttendees>;
}

async function getData(): Promise<Props> {
    const isInDataPrivacyGroup = await isGroupMember(dataPrivacyGroup);

    const participants = await getAllParticipants(isInDataPrivacyGroup, false, ['Confirmed', 'Canceled']);

    const scheduleEntries = await getAllScheduleEntries({ publicOnly: true });

    const sortedParticipant = participants.sort((participantA, participantB) => {
        const firstSlotA = scheduleEntries.find(({ participantId, startsAt }) => participantId === participantA.id && startsAt !== null);
        const firstSlotB = scheduleEntries.find(({ participantId, startsAt }) => participantId === participantB.id && startsAt !== null);

        if (firstSlotA === undefined && firstSlotB === undefined) {
            return 0;
        }

        if (firstSlotA === undefined) {
            return 1;
        }

        if (firstSlotB === undefined) {
            return -1;
        }

        const firstSlotABegin = new Date(firstSlotA.startsAt!);
        const firstSlotBBegin = new Date(firstSlotB.startsAt!);

        if (isEqual(firstSlotABegin, firstSlotBBegin)) {
            return 0;
        }

        return isAfter(firstSlotABegin, firstSlotBBegin) ? 1 : -1;
    });

    const participantLabels = await prismaClient.participantLabel.findMany();

    const allLinks = await prismaClient.link.findMany();

    const programLocations = await getAllProgramLocations(false);

    const allAttendees = await getAllAttendees();

    return {
        participants: sortedParticipant.map(serializeParticipant),
        scheduleEntries,
        participantLabels,
        allLinks,
        programLocations,
        allAttendees,
    };
}

export default async (props: { searchParams: Promise<Record<string, string | string[]>> }): Promise<ReactElement> => {
    const loggedIn = await isLoggedIn();

    if (!isProgramPublished && !loggedIn) {
        redirect('/');
    }

    const searchParams = await props.searchParams;
    const initialDateRangeFilter = searchParams[dateRangeFilterQueryName];
    const initialTypesFilter = searchParams[typesFilterQueryName];
    const initialLocationsFilter = searchParams[locationsFilterQueryName];
    const initialTextFilter = searchParams[textFilterQueryName];

    const { participants, scheduleEntries, participantLabels, allLinks, programLocations, allAttendees } = await getData();

    const isInDataPrivacyGroup = await isGroupMember(dataPrivacyGroup);

    const participantGenres = await prismaClient.participantGenre.findMany();

    const allGenres = await prismaClient.genre.findMany();

    return (
        <div className="relative mx-auto min-h-screen w-full max-w-7xl pt-5 pb-3">
            <div className="text-center font-display text-6xl uppercase">Programm</div>

            {!isProgramPublished && (
                <div className="mx-auto mt-4 max-w-xl rounded-xl border-2 border-black bg-[#f0ee0a] p-4 text-center text-sm text-balance">
                    <div className="font-black">Nur intern sichtbar</div>
                    <div className="mt-1">
                        Das Programm ist noch nicht veröffentlicht und aktuell nur für eingeloggte Team-Mitglieder einsehbar.
                    </div>
                </div>
            )}

            <ParticipantsOverviewContextProvider
                participants={participants}
                scheduleEntries={scheduleEntries}
                participantLabels={participantLabels}
                allLinks={allLinks}
                programLocations={programLocations}
                allAttendees={allAttendees}
                isInDataPrivacyGroup={isInDataPrivacyGroup}
                initialDateRangeDateRangeFilter={typeof initialDateRangeFilter === 'string' ? initialDateRangeFilter : undefined}
                initialTypesFilter={typeof initialTypesFilter === 'string' ? initialTypesFilter : undefined}
                initialLocationsFilter={typeof initialLocationsFilter === 'string' ? initialLocationsFilter : undefined}
                initialTextFilter={typeof initialTextFilter === 'string' ? initialTextFilter : undefined}
                participantGenres={participantGenres}
                allGenres={allGenres}
            >
                <ParticipantsOverview isLoggedIn={loggedIn} />
            </ParticipantsOverviewContextProvider>
        </div>
    );
};
