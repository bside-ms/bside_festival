import prismaClient from '@/lib/common/prismaClient';
import type { ApplicationStatus, Comment, Participant, ParticipantOrganizer } from '@prisma/client';

export type ParticipantWithInternRelations = Participant & {
    comments: Array<Comment>;
    organizers: Array<ParticipantOrganizer>;
};

const getAllParticipants = async (
    isInDataPrivacyGroup: boolean,
    includeInternRelations = false,
    statuses?: Array<ApplicationStatus>,
): Promise<Array<ParticipantWithInternRelations>> => {
    const where = statuses === undefined ? undefined : { status: { in: statuses } };
    const applications = includeInternRelations
        ? await prismaClient.participant.findMany({
              include: {
                  comments: { orderBy: { createdAt: 'desc' } },
                  organizers: { orderBy: { organizerName: 'asc' } },
              },
              orderBy: [{ appliedAt: 'asc' }, { id: 'asc' }],
              where,
          })
        : (await prismaClient.participant.findMany({ orderBy: [{ appliedAt: 'asc' }, { id: 'asc' }], where })).map((application) => ({
              ...application,
              comments: [],
              organizers: [],
          }));

    if (isInDataPrivacyGroup) {
        return applications;
    }

    return applications.map<ParticipantWithInternRelations>((application) => ({
        ...application,
        contactMail: '*******',
        contactPhone: application.contactPhone !== null ? '*******' : null,
        address: application.address !== null ? '*******' : null,
    }));
};

export default getAllParticipants;
