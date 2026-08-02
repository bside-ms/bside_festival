import ContributionDetailPage from '@/components/intern/ContributionDetailPage';
import prismaClient from '@/lib/common/prismaClient';
import isGroupMember from '@/lib/next-auth/isGroupMember';
import isLoggedIn from '@/lib/next-auth/isLoggedIn';
import { dataPrivacyGroup } from '@/lib/next-auth/KeycloakGroups';
import getParticipantById from '@/lib/participants/getParticipantById';
import serializeParticipant from '@/lib/participants/serializeParticipant';
import { notFound, redirect } from 'next/navigation';
import type { ReactElement } from 'react';

interface Props {
    params: Promise<{ id: string }>;
}

export default async ({ params }: Props): Promise<ReactElement> => {
    if (!(await isLoggedIn())) {
        redirect('/');
    }

    const participantId = Number((await params).id);

    if (!Number.isInteger(participantId) || participantId <= 0) {
        notFound();
    }

    const isInDataPrivacyGroup = await isGroupMember(dataPrivacyGroup);
    const [participant, participantGenreRows, links, zipcodes] = await Promise.all([
        getParticipantById(participantId, isInDataPrivacyGroup),
        prismaClient.participantGenre.findMany({ where: { participantId } }),
        prismaClient.link.findMany({ where: { participantId } }),
        prismaClient.zipcode.findMany({ where: { participantId } }),
    ]);

    if (participant === null) {
        notFound();
    }

    const application = serializeParticipant(participant);
    const genreIds = participantGenreRows.map(({ genreId }) => genreId);
    const genres =
        genreIds.length === 0
            ? []
            : await prismaClient.genre.findMany({
                  where: { id: { in: genreIds } },
              });

    return (
        <div className="relative mx-auto min-h-screen w-full max-w-7xl px-2 pt-5 pb-3">
            <ContributionDetailPage application={application} genres={genres} links={links} zipcodes={zipcodes} />
        </div>
    );
};
