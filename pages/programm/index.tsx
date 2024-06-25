import type { Link, Location, ParticipantLabel, Venue } from '@prisma/client';
import { isAfter, isEqual } from 'date-fns';
import type { GetServerSideProps, GetServerSidePropsResult } from 'next';
import type { ReactElement } from 'react';
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
import getUserSession from 'lib/next-auth/getUserSession';

interface Props {
    participants: Array<SerializableParticipant>;
    slots: Array<SerializableSlot>;
    venues: Array<Venue>;
    participantLabels: Array<ParticipantLabel>;
    allLinks: Array<Link>;
    allLocations: Array<Location>;
}

export const getServerSideProps: GetServerSideProps<Props> = async (context): Promise<GetServerSidePropsResult<Props>> => {
    const userSession = await getUserSession(context);

    if (userSession === null)
        return {
            redirect: {
                statusCode: 302,
                destination: '/',
            },
        };
    }

    const participants = await prismaClient.participant.findMany({ where: { status: { in: ['Confirmed', 'Canceled'] } } });

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

    return {
        props: {
            participants: sortedParticipant.map(serializeParticipant),
            slots,
            venues,
            participantLabels,
            allLinks,
            allLocations,
        },
    };
};

export default ({ participants, slots, venues, participantLabels, allLinks, allLocations }: Props): ReactElement => {
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
