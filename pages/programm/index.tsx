import type { Link, Location, ParticipantLabel } from '@prisma/client';
import type { GetServerSideProps, GetServerSidePropsResult } from 'next';
import type { ReactElement } from 'react';
import BackgroundImage from 'components/common/BackgroundImage';
import Footer from 'components/common/Footer';
import ParticipantsOverview from 'components/participants/overview/ParticipantsOverview';
import { ParticipantsOverviewContextProvider } from 'components/participants/overview/ParticipantsOverviewContext';
import prismaClient from 'lib/common/prismaClient';
import serializeParticipant from 'lib/participants/serializeParticipant';
import type { SerializableParticipant } from 'typings/SerializableParticipant';

interface Props {
    applications: Array<SerializableParticipant>;
    participantLabels: Array<ParticipantLabel>;
    allLinks: Array<Link>;
    allLocations: Array<Location>;
}

export const getServerSideProps: GetServerSideProps<Props> = async (): Promise<GetServerSidePropsResult<Props>> => {

    const applications = await prismaClient.participant.findMany();

    const participantLabels = await prismaClient.participantLabel.findMany();

    const allLinks = await prismaClient.link.findMany();

    const allLocations = await prismaClient.location.findMany();

    return {
        props: {
            applications: applications.map(serializeParticipant),
            participantLabels,
            allLinks,
            allLocations,
        },
    };
};

export default ({ applications, participantLabels, allLinks, allLocations }: Props): ReactElement => {

    return (
        <div>
            <div className="py-16 min-h-screen w-full relative">
                <div className="relative z-10">
                    <div className="px-3 max-w-7xl mx-auto">
                        <ParticipantsOverviewContextProvider
                            participants={applications}
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
