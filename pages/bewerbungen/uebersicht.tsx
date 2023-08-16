import type { Label, Link, ParticipantLabel } from '@prisma/client';
import type { GetServerSideProps, GetServerSidePropsResult } from 'next';
import type { ReactElement } from 'react';
import ApplicationsOverview from 'components/applications/applicationsOverview/ApplicationsOverview';
import { ApplicationsOverviewContextProvider } from 'components/applications/applicationsOverview/ApplicationsOverviewContext';
import BackgroundImage from 'components/common/BackgroundImage';
import Footer from 'components/common/Footer';
import prismaClient from 'lib/common/prismaClient';
import getLegacyUserSession from 'lib/next-auth/getLegacyUserSession';
import serializeParticipant from 'lib/participants/serializeParticipant';
import type { SerializableParticipant } from 'typings/SerializableParticipant';

interface Props {
    applications: Array<SerializableParticipant>;
    participantLabels: Array<ParticipantLabel>;
    allLinks: Array<Link>;
    allLabels: Array<Label>;
}

export const getServerSideProps: GetServerSideProps<Props> = async (context): Promise<GetServerSidePropsResult<Props>> => {

    const userSession = await getLegacyUserSession(context);

    if (userSession === null) {
        return {
            redirect: {
                statusCode: 302,
                destination: '/',
            },
        };
    }

    const applications = await prismaClient.participant.findMany();

    const participantLabels = await prismaClient.participantLabel.findMany();

    const allLinks = await prismaClient.link.findMany();

    // Just use all now, will be filtered out later
    const allLabels = await prismaClient.label.findMany();

    return {
        props: {
            applications: applications.map(serializeParticipant),
            participantLabels,
            allLinks,
            allLabels,
        },
    };
};

export default ({ applications, participantLabels, allLinks, allLabels }: Props): ReactElement => {

    return (
        <div>
            <div className="py-16 min-h-screen w-full relative">
                <div className="relative z-10">
                    <div className="px-3 max-w-7xl mx-auto">
                        <ApplicationsOverviewContextProvider
                            applications={applications}
                            participantLabels={participantLabels}
                            allLinks={allLinks}
                            allLabels={allLabels}
                        >
                            <ApplicationsOverview />
                        </ApplicationsOverviewContextProvider>
                    </div>
                </div>

                <BackgroundImage />
            </div>

            <Footer />
        </div>
    );
};
