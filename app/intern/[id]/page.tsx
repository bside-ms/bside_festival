import ContributionDetailPage from '@/components/intern/ContributionDetailPage';
import { buildApplicationChangeLogHref } from '@/lib/changeLog/buildApplicationChangeLogHref';
import prismaClient from '@/lib/common/prismaClient';
import isGroupMember from '@/lib/next-auth/isGroupMember';
import isLoggedIn from '@/lib/next-auth/isLoggedIn';
import { dataPrivacyGroup } from '@/lib/next-auth/KeycloakGroups';
import getParticipantById from '@/lib/participants/getParticipantById';
import serializeParticipant from '@/lib/participants/serializeParticipant';
import getAllProgramLocations from '@/lib/schedule/getAllProgramLocations';
import getScheduleEntriesByParticipantId from '@/lib/schedule/getScheduleEntriesByParticipantId';
import { activeWorkshopReservationWhere } from '@/lib/workshops/workshopAttendeeReservations';
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
    const [participant, participantGenreRows, links, zipcodes, scheduleEntries, programLocations, workshopAttendees] = await Promise.all([
        getParticipantById(participantId, isInDataPrivacyGroup),
        prismaClient.participantGenre.findMany({ where: { participantId } }),
        prismaClient.link.findMany({ where: { participantId } }),
        prismaClient.zipcode.findMany({ where: { participantId } }),
        getScheduleEntriesByParticipantId(participantId),
        getAllProgramLocations(),
        prismaClient.attendee.findMany({
            orderBy: { attendedAt: 'asc' },
            select: { confirmedAt: true, fullName: true, id: true, mailAddress: true, message: true, scheduleEntryId: true },
            where: { scheduleEntry: { participantId }, ...activeWorkshopReservationWhere() },
        }),
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
        <div className="relative mx-auto min-h-full w-full max-w-7xl px-2 pt-5 pb-3">
            <ContributionDetailPage
                application={application}
                changeLogHref={isInDataPrivacyGroup ? buildApplicationChangeLogHref(application.id) : undefined}
                genres={genres}
                links={links}
                programLocations={programLocations}
                scheduleEntries={scheduleEntries}
                workshopAttendees={workshopAttendees.map((attendee) => ({
                    confirmedAt: attendee.confirmedAt?.toISOString() ?? null,
                    fullName: attendee.fullName,
                    id: attendee.id,
                    ...(isInDataPrivacyGroup ? { mailAddress: attendee.mailAddress } : {}),
                    message: attendee.message,
                    scheduleEntryId: attendee.scheduleEntryId,
                }))}
                isInDataPrivacyGroup={isInDataPrivacyGroup}
                zipcodes={zipcodes}
            />
        </div>
    );
};
