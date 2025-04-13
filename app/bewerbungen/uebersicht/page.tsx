import type { Label, Link as PrismaLink, ParticipantLabel } from '@prisma/client';
import type { ReactElement } from 'react';
import ApplicationsOverview from 'components/applications/applicationsOverview/ApplicationsOverview';
import { ApplicationsOverviewContextProvider } from 'components/applications/applicationsOverview/ApplicationsOverviewContext';
import BackgroundImage from 'components/common/BackgroundImage';
import Footer from 'components/common/Footer';
import Header from 'components/common/Header';
import prismaClient from 'lib/common/prismaClient';
import serializeParticipant from 'lib/participants/serializeParticipant';
import type { SerializableParticipant } from 'typings/SerializableParticipant';
import getAllParticipants from 'lib/participants/getAllParticipants';
import { getServerSession } from 'next-auth';
import authOptions from 'lib/next-auth/authOptions';
import isGroupMember from 'lib/next-auth/isGroupMember';
import { dataPrivacyGroup } from 'lib/next-auth/KeycloakGroups';
import { redirect } from 'next/navigation';

interface Props {
    applications: Array<SerializableParticipant>;
    participantLabels: Array<ParticipantLabel>;
    allLinks: Array<PrismaLink>;
    allLabels: Array<Label>;
}

async function getData(): Promise<Props> {
    const session = await getServerSession(authOptions);

    if (session === null) {
        redirect('/');
    }

    const isInDataPrivacyGroup = await isGroupMember(dataPrivacyGroup);

    const applications = await getAllParticipants(isInDataPrivacyGroup);

    const participantLabels = await prismaClient.participantLabel.findMany();

    const allLinks = await prismaClient.link.findMany();

    // Just use all now, will be filtered out later
    const allLabels = await prismaClient.label.findMany();

    return {
        applications: applications.map(serializeParticipant),
        participantLabels,
        allLinks,
        allLabels,
    };
}

export default async function BewerbungenUebersichtPage(): Promise<ReactElement> {
    const { applications, participantLabels, allLinks, allLabels } = await getData();

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
}
