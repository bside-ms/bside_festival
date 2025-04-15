import type { ReactElement } from 'react';
import ApplicationsOverview from 'components/applications/applicationsOverview/ApplicationsOverview';
import { ApplicationsOverviewContextProvider } from 'components/applications/applicationsOverview/ApplicationsOverviewContext';
import BackgroundImage from 'components/common/BackgroundImage';
import Footer from 'components/common/Footer';
import prismaClient from 'lib/common/prismaClient';
import serializeParticipant from 'lib/participants/serializeParticipant';
import getAllParticipants from 'lib/participants/getAllParticipants';
import isGroupMember from 'lib/next-auth/isGroupMember';
import { dataPrivacyGroup } from 'lib/next-auth/KeycloakGroups';
import { redirect } from 'next/navigation';
import isLoggedIn from 'lib/next-auth/isLoggedIn';
import Link from 'next/link';

export default async (): Promise<ReactElement> => {
    if (!(await isLoggedIn())) {
        redirect('/');
    }

    const isInDataPrivacyGroup = await isGroupMember(dataPrivacyGroup);

    const applications = (await getAllParticipants(isInDataPrivacyGroup)).map(serializeParticipant);

    const participantLabels = await prismaClient.participantLabel.findMany();

    const allLinks = await prismaClient.link.findMany();

    // Just use all now, will be filtered out later
    const allLabels = await prismaClient.label.findMany();

    return (
        <div>
            <div className="relative min-h-screen w-full pb-16">
                <div className="relative z-10">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="pt-1 text-2xl md:pt-2 md:text-3xl">B-Side Festival 2025</div>
                    </Link>

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
