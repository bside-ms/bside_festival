import type { Link, Location, ParticipantLabel, Venue } from '@prisma/client';
import { isAfter, isEqual } from 'date-fns';
import type { GetServerSideProps, GetServerSidePropsResult } from 'next';
import { ReactElement } from 'react';
import BackgroundImage from 'components/common/BackgroundImage';
import Footer from 'components/common/Footer';
import ParticipantsOverview from 'components/participants/overview/ParticipantsOverview';
import { ParticipantsOverviewContextProvider } from 'components/participants/overview/ParticipantsOverviewContext';
import prismaClient from 'lib/common/prismaClient';
import getAllSlots from 'lib/participants/getAllSlots';
import getAllVenues from 'lib/participants/getAllVenues';
import serializeParticipant from 'lib/participants/serializeParticipant';
import type { SerializableParticipant } from 'typings/SerializableParticipant';
import type { SerializableSlot } from 'typings/SerializableSlot';
import useEffectOnMount from 'lib/common/hooks/useEffectOnMount';
import getAllParticipants from 'lib/participants/getAllParticipants';
import { getServerSession } from 'next-auth';
import authOptions from 'lib/next-auth/authOptions';
import isGroupMember from 'lib/next-auth/isGroupMember';
import getAllAttendees from 'lib/participants/getAllAttendees';
import AllAttendees from 'typings/AllAttendees';
import { dataPrivacyGroup } from 'lib/next-auth/KeycloakGroups';
import getUserSession from 'lib/next-auth/getUserSession';

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

    if (session === null) {
        return {
            redirect: {
                statusCode: 302,
                destination: '/',
            },
        };
    }

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
    useEffectOnMount(() => {
        (async () => {
            const response = await fetch('/api/applications/all');

            if (response.ok) {
                const data = await response.json();

                console.log('data', data);
            }
        })();
    });

    return (
        <div>
            <div className="relative min-h-screen w-full pt-8">
                <div className="relative z-10">
                    <div className="mx-auto max-w-7xl px-3 pb-9">
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

                <BackgroundImage />
            </div>

            <Footer />
        </div>
    );
};
