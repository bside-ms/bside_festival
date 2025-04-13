import type { Label, Link, ParticipantLabel } from '@prisma/client';
import type { GetServerSideProps, GetServerSidePropsResult } from 'next';
import type { ReactElement } from 'react';
import ApplicationsOverview from 'components/applications/applicationsOverview/ApplicationsOverview';
import { ApplicationsOverviewContextProvider } from 'components/applications/applicationsOverview/ApplicationsOverviewContext';
import BackgroundImage from 'components/common/BackgroundImage';
import Footer from 'components/common/Footer';
import Header from 'components/common/Header';
import prismaClient from 'lib/common/prismaClient';
import getUserSession from 'lib/next-auth/getUserSession';
import serializeParticipant from 'lib/participants/serializeParticipant';
import type { SerializableParticipant } from 'typings/SerializableParticipant';
import getAllParticipants from 'lib/participants/getAllParticipants';
import { getServerSession } from 'next-auth';
import authOptions from 'lib/next-auth/authOptions';
import isGroupMember from 'lib/next-auth/isGroupMember';
import { dataPrivacyGroup } from 'lib/next-auth/KeycloakGroups';

interface Props {
    applications: Array<SerializableParticipant>;
    participantLabels: Array<ParticipantLabel>;
    allLinks: Array<Link>;
    allLabels: Array<Label>;
}

export const getServerSideProps: GetServerSideProps<Props> = async (context): Promise<GetServerSidePropsResult<Props>> => {
    const userSession = await getUserSession();

    if (userSession === null) {
        return {
            redirect: {
                statusCode: 302,
                destination: '/',
            },
        };
    }

    const isInDataPrivacyGroup = await isGroupMember(dataPrivacyGroup);

    const applications = await getAllParticipants(isInDataPrivacyGroup);

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
            <div className="relative min-h-screen w-full pb-16">
                <div className="relative z-10">
                    <div className="mx-auto max-w-7xl p-3">
                        <Header />
                    </div>

                    <div className="mx-auto max-w-7xl px-3">
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
