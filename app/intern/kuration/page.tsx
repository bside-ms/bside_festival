import ApplicationCurationOverview from '@/components/applications/applicationCuration/ApplicationCurationOverview';
import prismaClient from '@/lib/common/prismaClient';
import isGroupMember from '@/lib/next-auth/isGroupMember';
import isLoggedIn from '@/lib/next-auth/isLoggedIn';
import { dataPrivacyGroup } from '@/lib/next-auth/KeycloakGroups';
import getAllParticipants from '@/lib/participants/getAllParticipants';
import serializeParticipant from '@/lib/participants/serializeParticipant';
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
    const allZipcodes = await prismaClient.zipcode.findMany();
    const allGenres = await prismaClient.genre.findMany();

    return (
        <div className="relative mx-auto min-h-full w-full max-w-7xl px-2 pt-5 pb-3">
            <ApplicationCurationOverview
                applications={applications}
                participantGenres={participantGenres}
                allLinks={allLinks}
                allZipcodes={allZipcodes}
                allGenres={allGenres}
            />
        </div>
    );
};
