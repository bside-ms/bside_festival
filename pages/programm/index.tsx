import type { Link, Location, ParticipantLabel } from '@prisma/client';
import { isAfter, isEqual } from 'date-fns';
import type { GetServerSideProps, GetServerSidePropsResult } from 'next';
import type { ReactElement } from 'react';
import BackgroundImage from 'components/common/BackgroundImage';
import Footer from 'components/common/Footer';
import ParticipantsOverview from 'components/participants/overview/ParticipantsOverview';
import { ParticipantsOverviewContextProvider } from 'components/participants/overview/ParticipantsOverviewContext';
import prismaClient from 'lib/common/prismaClient';
import serializeParticipant from 'lib/participants/serializeParticipant';
import getAllSlots from 'lib/participants/slots/getAllSlots';
import type { SerializableParticipant } from 'typings/SerializableParticipant';
import type { SerializableSlot } from 'typings/SerializableSlot';

interface Props {
    participants: Array<SerializableParticipant>;
    slots: Array<SerializableSlot>;
    participantLabels: Array<ParticipantLabel>;
    allLinks: Array<Link>;
    allLocations: Array<Location>;
}

export const getServerSideProps: GetServerSideProps<Props> = async (): Promise<GetServerSidePropsResult<Props>> => {

    const participants = await prismaClient.participant.findMany({ where: { status: 'Confirmed' } });

    const slots = await getAllSlots();

    const sortedParticipant = participants.sort(
        (participantA, participantB) => {

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
        }
    );

    const participantLabels = await prismaClient.participantLabel.findMany();

    const allLinks = await prismaClient.link.findMany();

    const allLocations = await prismaClient.location.findMany({ orderBy: { name: 'asc' } });

    return {
        props: {
            participants: sortedParticipant.map(serializeParticipant),
            slots,
            participantLabels,
            allLinks,
            allLocations,
        },
    };
};

export default ({ participants, slots, participantLabels, allLinks, allLocations }: Props): ReactElement => {

    return (
        <div>
            <div className="pt-8 min-h-screen w-full relative">
                <div className="relative z-10">
                    <div className="px-3 pb-9 max-w-7xl mx-auto">
                        <ParticipantsOverviewContextProvider
                            participants={participants}
                            slots={slots}
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
