import type { Location, ParticipantLabel, Link as PrismaLink, Venue } from '@prisma/client';
import BackgroundImage from 'components/common/BackgroundImage';
import ParticipantsOverview from 'components/participants/overview/ParticipantsOverview';
import { ParticipantsOverviewContextProvider } from 'components/participants/overview/ParticipantsOverviewContext';
import { isAfter, isEqual } from 'date-fns';
import prismaClient from 'lib/common/prismaClient';
import isGroupMember from 'lib/next-auth/isGroupMember';
import isLoggedIn from 'lib/next-auth/isLoggedIn';
import { dataPrivacyGroup } from 'lib/next-auth/KeycloakGroups';
import getAllAttendees from 'lib/participants/getAllAttendees';
import getAllParticipants from 'lib/participants/getAllParticipants';
import getAllSlots from 'lib/participants/getAllSlots';
import getAllVenues from 'lib/participants/getAllVenues';
import serializeParticipant from 'lib/participants/serializeParticipant';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ReactElement } from 'react';
import type AllAttendees from 'typings/AllAttendees';
import type { SerializableParticipant } from 'typings/SerializableParticipant';
import type { SerializableSlot } from 'typings/SerializableSlot';

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

    return (
        <div className="relative min-h-screen w-full pb-16">
            <div className="relative z-10">
                <div className="bg-white py-3 text-center font-bold tracking-[0.3em] text-[#5ff450] uppercase">
                    19. & 20. September 2025
                </div>
                <Link
                    href="/"
                    className="block w-full cursor-pointer bg-white py-3 text-center font-bold tracking-[0.3em] text-black uppercase"
                >
                    B-Side Festival 2025
                </Link>

                <div className="block w-full cursor-pointer bg-[#FDF85D] py-3 text-center text-xl font-bold tracking-[0.3em] uppercase select-none">
                    Programm
                </div>

                <div className="mx-auto max-w-7xl">
                    <ParticipantsOverviewContextProvider
                        participants={participants}
                        slots={slots}
                        venues={venues}
                        participantLabels={participantLabels}
                        allLinks={allLinks}
                        allLocations={allLocations}
                        allAttendees={allAttendees}
                        isInDataPrivacyGroup={isInDataPrivacyGroup}
                    >
                        <ParticipantsOverview isLoggedIn={loggedIn} />
                    </ParticipantsOverviewContextProvider>
                </div>
            </div>

            <BackgroundImage />
        </div>
    );
};
