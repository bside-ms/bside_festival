import type { Link, Location, ParticipantLabel, Venue } from '@prisma/client';
import { isAfter, isEqual } from 'date-fns';
import type { GetServerSideProps, GetServerSidePropsResult } from 'next';
import { ReactElement } from 'react';
import Footer from 'components/common/Footer';
import ParticipantsOverview from 'components/participants/overview/ParticipantsOverview';
import { ParticipantsOverviewContextProvider } from 'components/participants/overview/ParticipantsOverviewContext';
import prismaClient from 'lib/common/prismaClient';
import getAllSlots from 'lib/participants/getAllSlots';
import getAllVenues from 'lib/participants/getAllVenues';
import serializeParticipant from 'lib/participants/serializeParticipant';
import type { SerializableParticipant } from 'typings/SerializableParticipant';
import type { SerializableSlot } from 'typings/SerializableSlot';
import getAllParticipants from 'lib/participants/getAllParticipants';
import { getServerSession } from 'next-auth';
import authOptions from 'lib/next-auth/authOptions';
import isGroupMember from 'lib/next-auth/isGroupMember';
import getAllAttendees from 'lib/participants/getAllAttendees';
import AllAttendees from 'typings/AllAttendees';
import { dataPrivacyGroup } from 'lib/next-auth/KeycloakGroups';
import Image from 'next/image';

interface Props {
    participants: Array<SerializableParticipant>;
    slots: Array<SerializableSlot>;
    venues: Array<Venue>;
    participantLabels: Array<ParticipantLabel>;
    allLinks: Array<Link>;
    allLocations: Array<Location>;
    allAttendees: Array<AllAttendees>;
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ req, res }): Promise<GetServerSidePropsResult<Props>> => {
    const session = await getServerSession(req, res, authOptions);

    const isInDataPrivacyGroup = isGroupMember(dataPrivacyGroup, session);

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

    const allAttendees = await getAllAttendees(session !== null && session.user !== undefined, isInDataPrivacyGroup);

    return {
        props: {
            participants: sortedParticipant.map(serializeParticipant),
            slots,
            venues,
            participantLabels,
            allLinks,
            allLocations,
            allAttendees,
        },
    };
};

export default ({ participants, slots, venues, participantLabels, allLinks, allLocations, allAttendees }: Props): ReactElement => {
    return (
        <div>
            <div className="relative z-10 mx-auto min-h-screen w-full max-w-2xl font-display">
                <div className="py-3 text-center font-bold uppercase tracking-[0.3em] text-[#5ff450]">20. & 21. September 2024</div>
                <div className="h-10 w-full bg-black" />
                <a href="/" className="block w-full cursor-pointer py-3 text-center font-bold uppercase tracking-[0.3em] text-black">
                    B-Side Festival 2024
                </a>

                <div className="h-5 w-full bg-black" />

                <div className="block w-full cursor-pointer select-none bg-[#FDF85D] py-3 text-center text-xl font-bold uppercase tracking-[0.3em]">
                    Programm
                </div>

                <div className="h-5 w-full bg-[#5ff450]" />

                <div className="relative min-h-screen w-full pt-8">
                    <div className="relative z-10">
                        <div className="mx-auto max-w-7xl pb-9">
                            <ParticipantsOverviewContextProvider
                                participants={participants}
                                slots={slots}
                                venues={venues}
                                participantLabels={participantLabels}
                                allLinks={allLinks}
                                allLocations={allLocations}
                                allAttendees={allAttendees}
                            >
                                <ParticipantsOverview />
                            </ParticipantsOverviewContextProvider>
                        </div>
                    </div>
                </div>
            </div>

            <div className="fixed inset-0 z-0">
                <Image
                    src="/assets/2024-bg1.png"
                    alt="background"
                    className="fixed inset-0 z-0 object-contain object-center blur"
                    fill={true}
                    priority={true}
                />
            </div>

            <div className="relative z-10">
                <Footer />
            </div>
        </div>
    );
};
