import ApplicationsOverview from 'components/applications/applicationsOverview/ApplicationsOverview';
import { ApplicationsOverviewContextProvider } from 'components/applications/applicationsOverview/ApplicationsOverviewContext';
import BackgroundImage from 'components/common/BackgroundImage';
import prismaClient from 'lib/common/prismaClient';
import isGroupMember from 'lib/next-auth/isGroupMember';
import isLoggedIn from 'lib/next-auth/isLoggedIn';
import { dataPrivacyGroup } from 'lib/next-auth/KeycloakGroups';
import getAllParticipants from 'lib/participants/getAllParticipants';
import serializeParticipant from 'lib/participants/serializeParticipant';
import { redirect } from 'next/navigation';
import type { ReactElement } from 'react';

export default async (): Promise<ReactElement> => {
    if (!(await isLoggedIn())) {
        redirect('/');
    }

    const isInDataPrivacyGroup = await isGroupMember(dataPrivacyGroup);

    const applications = (await getAllParticipants(isInDataPrivacyGroup)).map(serializeParticipant);

    const participantGenres = await prismaClient.participantGenre.findMany();

    const allLinks = await prismaClient.link.findMany();

    const allGenres = await prismaClient.genre.findMany();

    return (
        <div className="relative min-h-screen w-full pb-16">
            <div className="relative z-10">
                <div className="mx-auto max-w-7xl px-3">
                    <ApplicationsOverviewContextProvider
                        applications={applications}
                        participantGenres={participantGenres}
                        allLinks={allLinks}
                        allGenres={allGenres}
                    >
                        <ApplicationsOverview />
                    </ApplicationsOverviewContextProvider>
                </div>
            </div>

            <BackgroundImage />
        </div>
    );
};
