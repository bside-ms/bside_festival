import { ParticipantsOverviewContextProvider } from '@/components/participants/overview/ParticipantsOverviewContext';
import Slotplan from '@/components/participants/Slotplan';
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
import { redirect } from 'next/navigation';
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

export default async (): Promise<ReactElement> => {
    const loggedIn = await isLoggedIn();

    if (!loggedIn) {
        redirect('/');
    }

    const { participants, slots, venues, participantLabels, allLinks, allLocations, allAttendees } = await getData();

    const isInDataPrivacyGroup = await isGroupMember(dataPrivacyGroup);

    const participantGenres = await prismaClient.participantGenre.findMany();

    const allGenres = await prismaClient.genre.findMany();

    return (
        <div className="relative min-h-screen w-full max-w-none pt-5 pb-3">
            <div className="text-center font-display text-6xl uppercase">Slotplan</div>

            <ParticipantsOverviewContextProvider
                participants={participants}
                slots={slots}
                venues={venues}
                participantLabels={participantLabels}
                allLinks={allLinks}
                allLocations={allLocations}
                allAttendees={allAttendees}
                isInDataPrivacyGroup={isInDataPrivacyGroup}
                initialDateRangeDateRangeFilter={undefined}
                initialTypesFilter={undefined}
                initialLocationsFilter={undefined}
                initialTextFilter={undefined}
                participantGenres={participantGenres}
                allGenres={allGenres}
            >
                <Slotplan />
            </ParticipantsOverviewContextProvider>
        </div>
    );
};
