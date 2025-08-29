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
import getAllSlots from '@/lib/participants/getAllSlots';
import getAllVenues from '@/lib/participants/getAllVenues';
import serializeParticipant from '@/lib/participants/serializeParticipant';
import type AllAttendees from '@/typings/AllAttendees';
import type { SerializableParticipant } from '@/typings/SerializableParticipant';
import type { SerializableSlot } from '@/typings/SerializableSlot';
import type { Location, ParticipantLabel, Link as PrismaLink, Venue } from '@prisma/client';
import { isAfter, isEqual } from 'date-fns';
import { ReactElement } from 'react';

interface Props {
    participants: Array<SerializableParticipant>;
    slots: Array<SerializableSlot>;
    venues: Array<Venue>;
    participantLabels: Array<ParticipantLabel>;
    allLinks: Array<PrismaLink>;
    allLocations: Array<Location>;
    allAttendees: Array<AllAttendees>;
}

async function getData(): Promise<Props> {
    const isInDataPrivacyGroup = await isGroupMember(dataPrivacyGroup);

    const participants = (await getAllParticipants(isInDataPrivacyGroup)).filter(({ status }) =>
        ['Confirmed', 'Canceled'].includes(status),
    );

    const slots = await getAllSlots();

    const venues = await getAllVenues();

    const sortedParticipant = participants.sort((participantA, participantB) => {
        const firstSlotA = slots.find(({ participantId }) => participantId === participantA.id);
        const firstSlotB = slots.find(({ participantId }) => participantId === participantB.id);

        if (firstSlotA === undefined && firstSlotB === undefined) {
            return 0;
        }

        if (firstSlotA === undefined) {
            return 1;
        }

        if (firstSlotB === undefined) {
            return -1;
        }

        const firstSlotABegin = new Date(firstSlotA.begin);
        const firstSlotBBegin = new Date(firstSlotB.begin);

        if (isEqual(firstSlotABegin, firstSlotBBegin)) {
            return 0;
        }

        return isAfter(firstSlotABegin, firstSlotBBegin) ? 1 : -1;
    });

    const participantLabels = await prismaClient.participantLabel.findMany();

    const allLinks = await prismaClient.link.findMany();

    const allLocations = await prismaClient.location.findMany({ orderBy: { name: 'asc' } });

    const allAttendees = await getAllAttendees();

    return {
        participants: sortedParticipant.map(serializeParticipant),
        slots,
        venues,
        participantLabels,
        allLinks,
        allLocations,
        allAttendees,
    };
}

export default async (props: { searchParams: Promise<Record<string, string | string[]>> }): Promise<ReactElement> => {
    const loggedIn = await isLoggedIn();

    const searchParams = await props.searchParams;
    const initialDateRangeFilter = searchParams[dateRangeFilterQueryName];
    const initialTypesFilter = searchParams[typesFilterQueryName];
    const initialLocationsFilter = searchParams[locationsFilterQueryName];
    const initialTextFilter = searchParams[textFilterQueryName];

    const { participants, slots, venues, participantLabels, allLinks, allLocations, allAttendees } = await getData();

    const isInDataPrivacyGroup = await isGroupMember(dataPrivacyGroup);

    const participantGenres = await prismaClient.participantGenre.findMany();

    const allGenres = await prismaClient.genre.findMany();

    return (
        <div className="relative mx-auto min-h-screen w-full max-w-7xl pt-5 pb-3">
            <div className="text-center font-display text-6xl uppercase">Programm</div>

            <ParticipantsOverviewContextProvider
                participants={participants}
                slots={slots}
                venues={venues}
                participantLabels={participantLabels}
                allLinks={allLinks}
                allLocations={allLocations}
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
